<template>
  <div class="px-2">
    <!-- <div v-if="isModal">
      <svgicon
        name="left-arrow"
        height="32"
        width="32"
        class="cursor-pointer"
        @click="$emit('close')"
      />
    </div> -->

    <div class="flex flex-row justify-start items-center mt-4">
      <div class="leading-loose font-bold text-md sm:text-lg">
        {{ job.title }}
      </div>

      <div class="mx-2 py-2 px-4 rounded font-semibold" :class="bgStatus(job.locum_status)">
        {{ status(job.locum_status) }}
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

    <div v-if="job && job.conflict" class="flex flex-col">
      <div class="flex flex-wrap justify-start">
        <div class="p-0 lg:pr-4 w-full lg:w-1/2">
          <div class="bg-white rounded-lg border p-4 mt-4">
            <div class="leading-tight">
              <p class="font-bold text-sm sm:text-md pb-2">
                Job Conflicts
              </p>

              <p v-for="conflictJob in job.conflict_jobs" :key="conflictJob.id" class="text-xs sm:text-sm">
                {{ conflictJob.job_number }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- <div class="text-xs sm:text-sm py-3">
      Posted {{ $moment(job.date_created).format("DD/MM/YYYY") }}
    </div>-->

    <template v-if="job && job.locum_status === 'Allocated' && job.update_accepted_until && !job.update_accepted">
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

    <template v-if="job && job.locum_status === 'Applied' && job.applied_update_accepted_until && !job.applied_update_accepted">
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
        <div class="md:pr-2 w-full md:w-55p">
          <div class="flex flex-col">
            <JobDetailModalInfo :job="job" />
          </div>
        </div>

        <div class="md:pl-2 w-full md:w-45p order-first md:order-none">
          <div class="flex flex-col">
            <JobPartDetailModalParts :job_id="job.id" :disabled-link="true" />

            <JobDetailModalMap v-if="showMap" :job="job" />

            <JobDetailModalApplyForm
              v-if="job.locum_status === 'Available' || job.locum_status === 'Matched'"
              :job="job"
              @applied="$emit('close'), $emit('applied', $event)"
            />

            <JobDetailModalCancelForm
              v-if="job.locum_status === 'Applied'"
              :job="job"
              @cancelled="$emit('close'), $emit('cancelled', $event)"
            />

            <JobDetailModalUnassignForm
              v-if="job.locum_status === 'Allocated'"
              :ref="'unassignForm'"
              :job="job"
              @unassign="$emit('close'), $emit('unassign', $event)"
            />
          </div>
        </div>
      </div>
    </div>

    <AppConfirmationModal
      :label="'Proceed to cancel your application to this Job?'"
      :confirm-label="'Yes'"
      :cancel-label="'Cancel'"
      :modal="cancel_application_modal"
      @confirm="cancel"
      @cancel="cancel_application_modal = false"
    />

    <AppConfirmationModal
      :label="confirmation_text"
      :confirm-label="'Yes'"
      :cancel-label="'Cancel'"
      :modal="confirmation_modal"
      @confirm="confirm"
      @cancel="confirmation_modal = false"
    />
  </div>
</template>

<script>
import JobDetailModalInfo from "@/components/Jobs/JobDetailModalInfo"
import JobPartDetailModalParts from "@/components/Jobs/JobPart/JobPartDetailModalParts"
import JobDetailModalMap from "@/components/Jobs/JobDetailModalMap"
import JobDetailModalUnassignForm from "@/components/Jobs/JobDetailModalUnassignForm"
import JobDetailModalApplyForm from "@/components/Jobs/JobDetailModalApplyForm"
import JobDetailModalCancelForm from "@/components/Jobs/JobDetailModalCancelForm"
import AppConfirmationModal from "@/components/Base/AppConfirmationModal"

export default {
  components: {
    JobDetailModalInfo,
    JobPartDetailModalParts,
    JobDetailModalMap,
    JobDetailModalUnassignForm,
    JobDetailModalApplyForm,
    JobDetailModalCancelForm,
    AppConfirmationModal,
  },

  props: {
    job: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },

  data () {
    return {
      showMap: false,
      cancel_application_modal: false,
      confirmation_text: "",
      confirmation_modal: false,
    }
  },

  mounted () {
    setTimeout(() => {
      this.showMap = true
    }, 1)
  },

  methods: {
    favorite () {
      this.confirmation_text = "Add this Practice to Favorites?"
      this.confirmation_modal = true
    },

    unfavorite () {
      this.confirmation_text = "Remove this Practice to Favorites?"
      this.confirmation_modal = true
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
            this.confirmation_modal = false
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
            this.confirmation_modal = false
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
      if (this.job.locum_status === "Allocated") {
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
      } else if (this.job.locum_status === "Applied") {
        this.cancel_application_modal = true
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
