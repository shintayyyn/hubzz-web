<template>
  <section ref="modalContainer" class="modal-container shadow-lg p-4 md:py-8">
    <div class="px-4">
      <svgicon
        name="left-arrow"
        height="32"
        width="32"
        class="cursor-pointer"
        @click="$emit('cancel')"
      />
    </div>
    <template v-if="job_part && !dataLoading">
      <div class="flex items-center my-4 font-bold px-4">
        <p class="leading-tight text-md sm:text-lg mr-2">
          {{ job_part.job.title }}
        </p>
        <p class="py-2 px-2 rounded uppercase" :class="bgStatus(job_part.status)">
          {{ job_part.status }}
        </p>
      </div>

      <AppSchedules
        :shifts="shifts"
        :rate_lists="rate_lists"
        :practice_rate="practice_rate"
        :schedule="form.schedules"
        :error="formError.find(err => err.field === 'schedules')"
        :shiftErrors="shiftErrors"
        toComplete
        :type="'complete'"
        @getSchedule="getSchedule"
      />
      
      <div class="flex px-4">
        <AppButton :label="'Complete'" class="ml-auto" @click="canComplete" />
      </div>
      <AppConfirmationModal
        :label="'Mark this week as Completed?'"
        :confirmLabel="'Yes'"
        :cancelLabel="'Cancel'"
        :modal="confirmation_modal"
        @confirm="completeJob"
        @cancel="confirmation_modal = false"
      />
    </template>
  </section>
</template>
<script>
import AppSchedules from "@/components/Base/AppSchedules"
import AppButton from "@/components/Base/AppButton"
import AppConfirmationModal from "@/components/Base/AppConfirmationModal"
export default {
  components: {
    AppSchedules,
    AppButton,
    AppConfirmationModal,
  },
  props: {
    job_part: {
      type: Object,
      default: () => null,
    },
  },
  data () {
    return {
      shifts: [],
      rate_lists: [],
      total_working_hours: 0,
      total_gross_locum_wages: 0,
      hasShiftError: false,
      dataLoading: false,
      form: {
        schedules: [],
      },
      schedule: [],
      formError: [],
      shiftErrors: [],
      confirmation_modal: false,
    }
  },
  computed: {
    practice_rate () {
      if (this.job_part.practice_rate) {
        return this.job_part.practice_rate
      }
      let practice_rates = this.$auth.user.practice_detail.practice
        .practice_rates
      let practice_rate = practice_rates.find(
        item => item.id.toString() === this.job_part.profession_id.toString()
      )
      let rate = 0
      if (practice_rate) {
        rate = practice_rate.rate
      } else {
        rate = practice_rates[practice_rates.length - 1].rate
      }
      return rate
    },
  },
  created () {
    this.form.schedules = this.job_part.schedules
    Promise.all([
      this.$axios.get("/api/v1/locum-detail-rate-types").then(response =>
        response.data.data.locum_detail_rate_types.map(rateType => ({
          label: rateType.name,
          value: rateType.id,
        }))
      ),
      this.$axios.get("/api/v1/shifts").then(response =>
        response.data.data.shifts.map(shift => ({
          label: shift.name,
          value: shift.id,
        }))
      ),
    ])
      .then(responses => {
        const [rateLists, shiftLists,] = responses
        this.rate_lists = rateLists
        this.shifts = shiftLists
      })
      .finally(() => {
        this.dataLoading = false
      })
  },
  methods: {
    getSchedule (
      schedule,
      total_gross_locum_wages,
      total_working_hours,
      hasError
    ) {
      this.schedule = schedule
      this.form.schedules = []
      schedule.forEach((sched, index) => {
        if (sched.shifts && sched.shifts.length) {
          sched.shifts.forEach((shift, i) => {
            let timeStart = shift.has_absences
              ? shift.time_start
              : shift.final_time_start
            let timeEnd = shift.has_absences
              ? shift.time_start
              : shift.final_time_end
            this.form.schedules.push({
              id: shift.id,
              final_time_start: timeStart,
              final_time_end: timeEnd,
              late_hours_reason: shift.late_hours_reason,
              absent_reason: shift.absent_reason,
            })

            if (shift.has_absences && shift.absent_reason) {
              let rowError = this.shiftErrors.filter(err =>
                err.field.includes(`s${index}-${i}`)
              )
              let errNames = rowError.map(err => err.field)
              this.shiftErrors.forEach((err, ind) => {
                if (errNames.includes(err.field)) {
                  this.shiftErrors.splice(ind, errNames.length)
                }
              })
            } else {
              if (shift.final_time_start) {
                let startIndex = this.shiftErrors.findIndex(
                  err => err.field === `final_time_start-s${index}-${i}`
                )
                if (startIndex > -1) {
                  this.shiftErrors.splice(startIndex, 1)
                }
              }
              if (shift.final_time_end) {
                let endIndex = this.shiftErrors.findIndex(
                  err => err.field === `final_time_end-s${index}-${i}`
                )
                if (endIndex > -1) {
                  this.shiftErrors.splice(endIndex, 1)
                }
              }
            }
          })
        }
      })
      this.total_working_hours = total_working_hours
      this.total_gross_locum_wages = total_gross_locum_wages
      this.hasShiftError = hasError
    },
    bgStatus (status) {
      let str
      switch (status) {
      case "Ongoing":
      case "Completed":
      case "Approved":
        str = "bg-green-600 text-white"
        break
      default:
        str = "bg-red-500 text-white"
      }
      return str
    },
    canComplete () {
      this.shiftErrors = []
      this.schedule.forEach((sched, index) => {
        sched.shifts.forEach((shift, i) => {
          if (!shift.final_time_start && !shift.has_absences) {
            this.shiftErrors.push({
              field: `final_time_start-s${index}-${i}`,
              message: "Final Start is required.",
            })
          }
          if (!shift.final_time_end && !shift.has_absences) {
            this.shiftErrors.push({
              field: `final_time_end-s${index}-${i}`,
              message: "Final End is required.",
            })
          }
        })
      })
      if (
        !this.shiftErrors.length
				&& !this.hasShiftError
				&& !this.formError.length
      ) {
        this.confirmation_modal = true
      }
    },
    completeJob () {
      if (
        !this.shiftErrors.length
				&& !this.hasShiftError
				&& !this.formError.length
      ) {
        this.$axios
          .$put(
            `/api/v1/practice/job-parts/${this.job_part.id}/complete`,
            this.form
          )
          .then(() => {
            if (
              this.$route.path.includes("/dashboard")
							|| this.$route.path.includes("/sessions")
            ) {
              this.$store.commit(
                "jobs/REMOVE_PRACTICE_ONGOING_JOB_PART",
                this.job_part.id
              )
            }

            this.$emit("completed")
            this.$emit("close")
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: ["Job Part completed",],
            })
          })
          .catch(err => {
            if (!err.response.data.error_messages) {
              this.formError.push({ message: err.response.data.message, })
            } else {
              err.response.data.error_messages.forEach(error => {
                this.formError.push(error)
              })
            }
          })
          .finally(() => {
            this.confirmation_modal = false
          })
      }
    },
  },
}
</script>
<style scoped>
.modal-container {
	z-index: 510;
}
@media screen and (min-width: 1200px) {
	.modal-container {
		width: 80%;
	}
}
</style>
