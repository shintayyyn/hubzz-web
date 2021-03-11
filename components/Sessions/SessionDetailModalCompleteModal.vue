<template>
  <section ref="modalContainer" :class="modal ? 'modal-container shadow-lg p-4 md:py-8' : ''">
    <div v-if="modal" class="px-4">
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
        v-if="!dataLoading"
        :shifts="shifts"
        :rate_lists="rate_lists"
        :practice_rate="practice_rate"
        :schedule="form.schedules"
        :error="formError.find(err => err.field === 'schedules')"
        :shiftErrors="shiftErrors"
        toComplete
        :type="'complete'"
        :locum_vat_registered="job_part.locum_details_vat_registered"
        :tax_rates="tax_rates"
        :jobPartTerminationCompletion="job_part"
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
        :loading="completingJobPart"
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
    modal: {
      type: Boolean,
      default: true,
    },
  },

  data () {
    return {
      shifts: [],
      rate_lists: [],
      total_working_hours: 0,
      total_gross_locum_wages: 0,
      locum_tax_rate: 0,
      taxed_total_gross_locum_wages: 0,
      hasShiftError: false,
      dataLoading: false,
      form: {
        schedules: [],
      },
      schedule: [],
      job_all_schedules:[],
      formError: [],
      shiftErrors: [],
      confirmation_modal: false,

      tax_rates: {},
      completingJobPart: false,
    }
  },

  computed: {
    practice_rate () {
      if (this.job_part.practice_rate) {
        return this.job_part.practice_rate
      } else {
        return 0
      }
      // let practice_rates = this.$auth.user.practice_detail.practice
      //   .practice_rates
      // let practice_rate = practice_rates.find(
      //   item => item.id.toString() === this.job_part.profession_id.toString()
      // )
      // let rate = 0
      // if (practice_rate) {
      //   rate = practice_rate.rate
      // } else {
      //   rate = practice_rates[practice_rates.length - 1].rate
      // }
      // return rate
    },
  },

  created () {
    this.form.schedules = this.job_part.schedules
    this.dataLoading = true
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
      this.$axios.get("/api/v1/tax-rates").then(response => 
        response.data.data.tax_rates
      ),
    ])
      .then(responses => {
        const [rateLists, shiftLists, taxRates,] = responses
        this.rate_lists = rateLists
        this.shifts = shiftLists
        this.tax_rates = taxRates
      })
      .finally(() => {
        this.dataLoading = false
      })
  },
  methods: {
    totalHours (start, end, date) {
      let startDate = this.$moment(date + " " + start, "DD/MM/YYYY HH:mm")
      let endDate = this.$moment(date + " " + end, "DD/MM/YYYY HH:mm")
      return start && end
        ? this.$moment(endDate, "DD/MM/YYYY HH:mm").diff(startDate, "minutes")
        : 0
    },

    getSchedule (
      schedule,
      total_gross_locum_wages,
      locum_tax_rate,
      taxed_total_gross_locum_wages,
      total_working_hours,
      deductions,
      total_lates,
      hasError,
    ) {
      this.schedule = schedule

      this.form.schedules = []

      console.log("schedule", schedule)

      schedule.forEach((sched, scheduleIndex) => {
        if (sched.shifts && sched.shifts.length) {
          sched.shifts.forEach((shift, shiftIndex) => {
            const timeStart = shift.has_absences
              ? shift.time_start
              : shift.final_time_start

            const timeEnd = shift.has_absences
              ? shift.time_start
              : shift.final_time_end

            this.form.schedules.push({
              id: shift.id,
              final_time_start: timeStart,
              final_time_end: timeEnd,
              late_hours_reason: shift.late_hours_reason,
              absent_reason: shift.absent_reason,
              completed_break_in_minutes: shift.has_absences ? '0' : shift.completed_break_in_minutes,
              completed_break_payable: shift.has_absences ? 'false' : shift.completed_break_payable,
            })

            if (shift.has_absences && shift.absent_reason) {
              let rowError = this.shiftErrors.filter(err =>
                err.field.includes(`s${scheduleIndex}-${shiftIndex}`)
              )

              let errNames = rowError.map(err => err.field)

              this.shiftErrors.forEach((err, ind) => {
                if (errNames.includes(err.field)) {
                  this.shiftErrors.splice(ind, errNames.length)
                }
              })
            } else {
              if (shift.final_time_start) {
                const index = this.shiftErrors.findIndex(
                  err => err.field === `final_time_start-s${scheduleIndex}-${shiftIndex}`
                )

                if (index > -1) {
                  this.shiftErrors.splice(index, 1)
                }
              }

              if (shift.final_time_end) {
                const index = this.shiftErrors.findIndex(
                  err => err.field === `final_time_end-s${scheduleIndex}-${shiftIndex}`
                )

                if (index > -1) {
                  this.shiftErrors.splice(index, 1)
                }
              }
            }

            if (
              shift.completed_break_in_minutes
              && shift.final_time_start
              && shift.final_time_end
              && sched.date
              && parseInt(shift.completed_break_in_minutes) > this.totalHours(shift.final_time_start, shift.final_time_end, sched.date)
            ) {
              this.shiftErrors.push({
                field: `completed_break_in_minutes-s${scheduleIndex}-${shiftIndex}`,
                message: "Invalid break in minutes.",
              })
            } else {
              const index = this.shiftErrors.findIndex(
                err => err.field === `completed_break_in_minutes-s${scheduleIndex}-${shiftIndex}`
              )

              if (index > -1) {
                this.shiftErrors.splice(index, 1)
              }
            }
          })
        }
      })

      this.total_working_hours = total_working_hours

      this.total_gross_locum_wages = total_gross_locum_wages

      this.locum_tax_rate = locum_tax_rate

      this.taxed_total_gross_locum_wages = taxed_total_gross_locum_wages

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

      this.schedule.forEach((sched, scheduleIndex) => {
        sched.shifts.forEach((shift, shiftIndex) => {
          if (!shift.final_time_start && !shift.has_absences) {
            this.shiftErrors.push({
              field: `final_time_start-s${scheduleIndex}-${shiftIndex}`,
              message: "Final Start is required.",
            })
          }

          if (!shift.final_time_end && !shift.has_absences) {
            this.shiftErrors.push({
              field: `final_time_end-s${scheduleIndex}-${shiftIndex}`,
              message: "Final End is required.",
            })
          }

          if (
            shift.completed_break_in_minutes
            && shift.final_time_start
            && shift.final_time_end
            && sched.date
            && parseInt(shift.completed_break_in_minutes) > this.totalHours(shift.final_time_start, shift.final_time_end, sched.date)
          ) {
            this.shiftErrors.push({
              field: `completed_break_in_minutes-s${scheduleIndex}-${shiftIndex}`,
              message: "Invalid break in minutes.",
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
        this.completingJobPart = true
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
            console.log('err', err.response || err)

            let message = null

            if (err.response) {
              if (err.response.status === 400 && err.response.data.error_messages) {
                this.formError = err.response.data.error_messages
              } else {
                message = err.response.data.message
              }
            } else if (err.request) {
              message = 'Something went wrong!'
            } else {
              message = err.message
            }

            if (message) {
              this.$store.commit('SET_NOTIFICATION', {
                enabled: true,
                status: 'danger',
                text: [`${message}`,],
              })
            }
          })
          .finally(() => {
            this.completingJobPart = false
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
