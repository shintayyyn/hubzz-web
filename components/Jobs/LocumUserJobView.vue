<template>
  <div class="px-2">
    <!-- <div>
      <svgicon
        name="left-arrow"
        height="32"
        width="32"
        class="cursor-pointer"
        @click="$emit('close')"
      />
    </div> -->

    <div class="flex flex-row justify-start items-center pt-2">
      <div class="leading-loose font-bold text-md sm:text-lg">
        {{ job.title }}
      </div>

      <div class="mx-2 py-2 px-4 rounded font-semibold" :class="bgStatus(job.locum_job_status)">
        {{ status(job.locum_job_status) }}
      </div>
      
      <div
        v-if="job && job.terminated"
        class="py-2 px-4 mx-1 rounded font-semibold bg-gray-300"
      >
        TERMINATED
      </div>

      <template v-if="job.practice_is_favorite_of_locum">
        <svgicon
          name="on-star"
          height="25"
          width="25"
          class="cursor-pointer fill-current text-gray-700 hover:text-gray-800"
          @click="unfavorite()"
        />
      </template>

      <template v-else-if="!job.practice_is_favorite_of_locum">
        <svgicon
          name="off-star"
          height="25"
          width="25"
          class="cursor-pointer fill-current text-gray-700 hover:text-gray-800"
          @click="favorite()"
        />
      </template>
    </div>

    <template v-if="job && job.locum_job_status === 'Allocated' && job.update_accepted_until && !job.update_accepted">
      <div class="text-md">
        The Practice made changes on this Job, Accept these changes?
      </div>

      <div class="text-sm">
        <span>You must accept the changes within {{ job.update_accepted_until_duration_in_minutes_formatted }}, </span>
        <span>before {{ job.update_accepted_until_in_gb_formatted }}.</span>
      </div>

      <div class="flex items-center justify-start mt-1">
        <div
          class="bg-red-600 text-white rounded-lg px-2 py-1 font-semibold focus:outline-none cursor-pointer"
          @click="decline"
        >
          Decline
        </div>

        <div class="mx-1" />

        <div
          class="bg-yellow-500 rounded-lg px-2 py-1 font-semibold focus:outline-none cursor-pointer"
          @click="accept"
        >
          Accept
        </div>
      </div>
    </template>

    <template v-if="job && job.locum_job_status === 'Applied' && job.applied_update_accepted_until && !job.applied_update_accepted">
      <div class="text-md">
        The Practice made changes on this Job, Accept these changes?
      </div>

      <div class="text-sm">
        <span>You must accept the changes within {{ job.applied_update_accepted_until_duration_in_minutes_formatted }}, </span>
        <span>before {{ job.applied_update_accepted_until_in_gb_formatted }}.</span>
      </div>

      <div class="flex items-center justify-start mt-1">
        <div
          class="bg-red-600 text-white rounded-lg px-2 py-1 font-semibold focus:outline-none cursor-pointer"
          @click="decline"
        >
          Decline
        </div>

        <div class="mx-1" />

        <div
          class="bg-yellow-500 rounded-lg px-2 py-1 font-semibold focus:outline-none cursor-pointer"
          @click="accept"
        >
          Accept
        </div>
      </div>
    </template>

    <div class="flex flex-col mt-4">
      <div class="flex flex-wrap justify-start">
        <div class="w-full md:w-1/2">
        
         <div v-if="job && job.conflict" class="flex flex-col mb-4">
            <div class="bg-white rounded-lg border p-4 w-full">
              <div class="leading-tight">
                <p class="font-bold text-sm sm:text-md px-1 mb-1">
                  Job Conflicts
                </p>

                <span v-for="conflictJob in job.conflict_jobs" :key="conflictJob.id" class="text-xs sm:text-sm m-1 bg-gray-300 px-2">
                  {{ conflictJob.job_number }}
                </span>
              </div>
            </div>
          </div>
          
          <div v-if="job.locum_job_status === 'Withdrawn'" class="bg-white rounded-lg border p-4 flex flex-col md:flex-row">
            <div class="leading-tight w-full md:w-1/2">
              <p class="font-bold text-sm sm:text-md">
                Reason for Withdrawal
              </p>

              <p class="text-xs sm:text-sm break-words">
                {{ job.declined_reason ? job.declined_reason : '(none)' }}
              </p>
            </div>

            <div class="leading-tight w-full md:w-1/2">
              <p class="font-bold text-sm sm:text-md">
                Date of Withdrawal
              </p>

              <p class="text-xs sm:text-sm">
                {{ job.declined_at_in_gb_formatted }}
              </p>
            </div>
          </div>

          <div v-if="job.locum_job_status === 'Cancelled' && job.terminated" class="bg-white rounded-lg border p-4">
            <div class="leading-tight pb-4">
              <p class="font-bold text-sm sm:text-md">
                Terminated At
              </p>

              <p class="text-xs sm:text-sm break-words">
                {{ job.cancelled_at_in_gb_formatted }}
              </p>
            </div>

            <div class="leading-tight">
              <p class="font-bold text-sm sm:text-md">
                Reason for termination
              </p>

              <p class="text-xs sm:text-sm">
                {{ job.cancelled_reason }}
              </p>
            </div>
          </div>

          <div v-if="job.locum_job_status === 'Cancelled' && !job.terminated" class="bg-white rounded-lg border p-4">
            <div class="leading-tight pb-4">
              <p class="font-bold text-sm sm:text-md">
                Cancelled At
              </p>

              <p class="text-xs sm:text-sm break-words">
                {{ job.cancelled_at_in_gb_formatted }}
              </p>
            </div>

            <div class="leading-tight">
              <p class="font-bold text-sm sm:text-md">
                Reason for cancellation
              </p>
              
              <p class="text-xs sm:text-sm">
                {{ job.cancelled_reason }}
              </p>
            </div>
          </div>

          <div class="flex flex-col">
            <LocumUserJobViewInfo :job="job" />
          </div>
        </div>

        <div class="p-0 md:pl-4 w-full md:w-1/2 order-first md:order-none">
          <div class="flex flex-col">
            <LocumUserJobViewJobParts :jobId="jobId" :disabled-link="true" />

            <LocumUserJobViewJobMap
              :practiceName="job.practice_name"
              :practiceTypes="job.practice_types"
              :practiceAddress="`${job.practice_address_line_1} ${job.practice_address_line_2} ${job.practice_address_line_3} ${job.practice_postcode}`"
              :practiceCoordinateX="job.practice_coordinate_x"
              :practiceCoordinateY="job.practice_coordinate_y"
            />

            <JobDetailModalUnassignForm
              v-if="job.locum_job_status === 'Allocated'"
              :ref="'unassignForm'"
              :job="job"
              @unassign="$emit('close'), $emit('unassign', $event)"
            />

            <JobDetailModalApplyForm
              v-if="job.locum_job_status === 'Available' || job.locum_job_status === 'Matched'"
              :job="job"
              @applied="$emit('close'), $emit('applied', $event)"
            />

            <JobDetailModalCancelForm
              v-if="job.locum_job_status === 'Applied'"
              :job="job"
              @cancelled="$emit('close'), $emit('cancelled', $event)"
            />
          </div>
        </div>
      </div>
    </div>

    <AppConfirmationModal
      :label="'Proceed to cancel your application to this Job?'"
      :confirm-label="'Yes'"
      :cancel-label="'Cancel'"
      :modal="cancelApplicationModal"
      @confirm="cancel"
      @cancel="cancelApplicationModal = false"
    />

    <AppConfirmationModal
      :label="confirmationText"
      :confirm-label="'Yes'"
      :cancel-label="'Cancel'"
      :modal="confirmationModal"
      @confirm="confirm"
      @cancel="confirmationModal = false"
    />
  </div>
</template>

<script>
import LocumUserJobViewInfo from "@/components/Jobs/LocumUserJobViewInfo"
import JobDetailModalUnassignForm from "@/components/Jobs/JobDetailModalUnassignForm"
import JobDetailModalApplyForm from "@/components/Jobs/JobDetailModalApplyForm"
import JobDetailModalCancelForm from "@/components/Jobs/JobDetailModalCancelForm"
import AppConfirmationModal from "@/components/Base/AppConfirmationModal"


import LocumUserJobViewJobParts from "@/components/Jobs/LocumUserJobViewJobParts"
import LocumUserJobViewJobMap from "@/components/Jobs/LocumUserJobViewJobMap"

export default {
  components: {
    LocumUserJobViewInfo,
    JobDetailModalUnassignForm,
    JobDetailModalApplyForm,
    JobDetailModalCancelForm,
    AppConfirmationModal,

    LocumUserJobViewJobParts,
    LocumUserJobViewJobMap,
  },

  props: {
    jobId: {
      type: Number,
      required: true,
    },

    job: {
      type: Object,
      default: () => ({}),
    },
  },

  data () {
    return {
      showMap: false,
      cancelApplicationModal: false,
      confirmationText: "",
      confirmationModal: false,
    }
  },

  mounted () {
    setTimeout(() => {
      this.showMap = true
    }, 1)
  },

  methods: {
    favorite () {
      this.confirmationText = "Add this Practice to Favourites?"
      this.confirmationModal = true
    },

    unfavorite () {
      this.confirmationText = "Remove this Practice to Favourites?"
      this.confirmationModal = true
    },

    confirm () {
      if (!this.job.practice_is_favorite_of_locum) {
        this.$axios
          .$post(`/api/v1/locum/practices/${this.job.practice_id}/favorite`)
          .then(() => {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: ["Added to favourites",],
            })
            this.job.practice_is_favorite_of_locum = true
          })
          .catch(err => {
            console.log("err", err.response || err)
            throw err
          })
          .finally(() => {
            this.confirmationModal = false
          })
      } else if (this.job.practice_is_favorite_of_locum) {
        this.$axios
          .$delete(`/api/v1/locum/practices/${this.job.practice_id}/favorite`)
          .then(() => {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: ["Remove to favourites",],
            })
            this.job.practice_is_favorite_of_locum = false
          })
          .catch(err => {
            console.log("err", err.response || err)
            throw err
          })
          .finally(() => {
            this.confirmationModal = false
          })
      }
    },

    status (status) {
      return status === "Matched" ? "AVAILABLE" : status.toUpperCase()
    },

    bgStatus (status) {
      let str = ""

      switch (status) {
      case "Available":
      case "Matched":
        str = "bg-yellow-500"
        break
      case "Applied":
        str = "bg-orange-500 text-white"
        break
      case "Allocated":
        str = "bg-green-600 text-white"
        break
      default:
        str = "bg-red-500 text-white"
      }

      return str
    },

    decline () {
      if (this.job.locum_job_status === "Allocated") {
        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "danger",
          text: [`You can unassign yourself from this job`,],
        })

        this.$refs["unassignForm"].$refs["unassignTextArea"].$refs[
          "textarea"
        ].scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "end",
        })
      } else if (this.job.locum_job_status === "Applied") {
        this.cancelApplicationModal = true
      }
    },

    accept () {
      const jobId = this.job.id

      this.$axios
        .$post(`/api/v1/locum/jobs/${jobId}/update-accept`)
        .then(res => {
          this.$emit("close")
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`${res.message}`,],
          })
          setTimeout(() => {
            this.$router.push({
              path: `/jobs/${jobId}`,
              query: { ...this.$route.query, },
            })
          }, 500)
        })
    },

    cancel () {
      const jobId = this.job.id

      this.$axios
        .$delete(`/api/v1/locum/jobs/${jobId}/apply`)
        .then(() => {
          this.$store.commit("jobs/REMOVE_LOCUM_APPLIED_JOB", jobId)
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: ["Cancelled",],
          })
          this.$emit("close")
        })
        .catch(err => {
          console.log("err", err.response || err)
          if (err.response.data.message) {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "danger",
              text: [`${err.response.data.message}`,],
            })
          }
        })
    },

  },

}
</script>
