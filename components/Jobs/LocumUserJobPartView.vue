<template>
  <div class="px-2">
    <AppLoading :loading="loading" spinner />
    <!-- 
    <div>
      <svgicon
        name="left-arrow"
        height="32"
        width="32"
        class="cursor-pointer"
        @click="$emit('close')"
      />
    </div> -->

    <div class="flex flex-row justify-start items-center pt-4">
      <div class="leading-loose font-bold text-md sm:text-lg mr-2">
        {{ job_part.title }}
      </div>

      <div
        class="py-1 px-4 mx-1 rounded font-semibold text-sm"
        :class="bgStatus(job_part.locum_job_part_status)"
        @click="
          ['Approved'].includes(job_part.locum_job_part_status)
            || (['Cancelled'].includes(job_part.locum_job_part_status) && job_part.terminated)
              ? toggle_invoice_modal = true
              : null
        "
      >
        {{ status(job_part.locum_job_part_status) }}
      </div>
      
      <div
        v-if="job_part && job_part.terminated"
        class="py-1 px-4 mx-1 rounded font-semibold text-sm bg-gray-300 cursor-pointer hover:bg-gray-600 hover:text-white"
        @click="toggle_invoice_modal = true"
      >
        TERMINATED
      </div>
      
      <div
        v-if="job_part && job_part.locum_invoiceable && job_part.locum_invoice_status && job_part.locum_job_part_status !== 'Approved'"
        class="py-1 px-4 mx-1 rounded font-semibold text-sm bg-gray-300 cursor-pointer hover:bg-gray-600 hover:text-white"
        @click="toggle_invoice_modal = true"
      >
        {{ job_part.locum_invoice_status.toUpperCase() }}
      </div>

      <template v-if="job_part.practice_is_favorite_of_locum">
        <svgicon
          name="on-star"
          height="25"
          width="25"
          class="cursor-pointer fill-current text-gray-700 hover:text-gray-800"
          @click="unfavorite()"
        />
      </template>

      <template v-else-if="!job_part.practice_is_favorite_of_locum">
        <svgicon
          name="off-star"
          height="25"
          width="25"
          class="cursor-pointer fill-current text-gray-700 hover:text-gray-800"
          @click="favorite()"
        />
      </template>
    </div>

    <template v-if="job_part.locum_job_part_status === 'Allocated' && job_part.update_accepted_until && !job_part.update_accepted">
      <div class="text-md">
        The Practice made changes on this Job, Accept these changes?
      </div>

      <div class="text-sm">
        <span>You must accept the changes within {{ job_part.update_accepted_until_duration_in_minutes_formatted }}, </span>
        <span>before {{ job_part.update_accepted_until_in_gb_formatted }}.</span>
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

    <template v-if="job_part.locum_job_part_status === 'Applied' && job_part.applied_update_accepted_until && !job_part.applied_update_accepted">
      <div class="text-md">
        The Practice made changes on this Job, Accept these changes?
      </div>

      <div class="text-sm">
        <span>You must accept the changes within {{ job_part.applied_update_accepted_until_duration_in_minutes_formatted }}, </span>
        <span>before {{ job_part.applied_update_accepted_until_in_gb_formatted }}.</span>
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
          <div v-if="job_part.conflict" class="flex flex-col mb-4">
            <div class="bg-white rounded-lg border p-4 w-full">
              <div class="leading-tight">
                <p class="font-bold text-sm sm:text-md px-1 mb-1">
                  Job Conflicts
                </p>

                <p v-for="conflictJob in job_part.conflict_jobs" :key="conflictJob.id" class="text-xs sm:text-sm m-1 bg-gray-300 px-2">
                  {{ conflictJob.job_number }}
                </p>
              </div>
            </div>
          </div>
          
          <div v-if="!loadingJobPart && job_part.locum_job_part_status === 'Withdrawn'" class="bg-white rounded-lg border p-4 flex flex-col md:flex-row">
            <div class="leading-tight w-full md:w-1/2">
              <p class="font-bold text-sm sm:text-md">
                Reason for Withdrawal
              </p>

              <p class="text-xs sm:text-sm break-words">
                {{ job_part.declined_reason ? job_part.declined_reason : '(none)' }}
              </p>
            </div>

            <div class="leading-tight w-full md:w-1/2">
              <p class="font-bold text-sm sm:text-md">
                Date of Withdrawal
              </p>

              <p class="text-xs sm:text-sm">
                {{ job_part.declined_at_in_gb_formatted }}
              </p>
            </div>
          </div>

          <div v-if="job_part.locum_job_part_status === 'Cancelled' && job_part.terminated" class="bg-white rounded-lg border p-4">
            <div class="leading-tight pb-4">
              <p class="font-bold text-sm sm:text-md">
                Terminated At
              </p>

              <p class="text-xs sm:text-sm break-words">
                {{ job_part.cancelled_at_in_gb_formatted }}
              </p>
            </div>

            <div class="leading-tight">
              <p class="font-bold text-sm sm:text-md">
                Reason for termination
              </p>

              <p class="text-xs sm:text-sm">
                {{ job_part.cancelled_reason }}
              </p>
            </div>
          </div>

          <div v-if="job_part.locum_job_part_status === 'Cancelled' && !job_part.terminated" class="bg-white rounded-lg border p-4">
            <div class="leading-tight pb-4">
              <p class="font-bold text-sm sm:text-md">
                Cancelled At
              </p>

              <p class="text-xs sm:text-sm break-words">
                {{ job_part.cancelled_at_in_gb_formatted }}
              </p>
            </div>

            <div class="leading-tight">
              <p class="font-bold text-sm sm:text-md">
                Reason for cancellation
              </p>
              
              <p class="text-xs sm:text-sm">
                {{ job_part.cancelled_reason }}
              </p>
            </div>
          </div>

          <div class="flex flex-col">
            <LocumUserJobPartViewInfo
              :loadingJobPart="loadingJobPart"
              :jobPart="job_part"
            />
          </div>
        </div>

        <div class="md:pl-2 w-full md:w-45p order-first md:order-none">
          <div class="flex flex-col">
            <LocumUserJobViewJobParts :jobId="job_part.job_id" />

            <LocumUserJobViewJobMap
              :practiceName="job_part.practice_name"
              :practiceTypes="job_part.practice_types"
              :practiceAddress="`${job_part.practice_address_line_1} ${job_part.practice_address_line_2} ${job_part.practice_address_line_3} ${job_part.practice_postcode}`"
              :practiceCoordinateX="job_part.practice_coordinate_x"
              :practiceCoordinateY="job_part.practice_coordinate_y"
            />

            <JobDetailModalUnassignForm
              v-if="!loadingJobPart && (job_part.locum_job_part_status === 'Ongoing' || job_part.locum_job_part_status === 'Allocated')"
              :ref="'unassignForm'"
              :job="job"
              @unassign="$emit('close')"
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
      :label="'Proceed to Invoice?'"
      :confirmLabel="'Yes'"
      :cancelLabel="'No'"
      :modal="toggle_invoice_modal"
      @confirm="goToGenerateInvoice"
      @cancel="toggle_invoice_modal = false"
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
import AppLoading from "@/components/Base/AppLoading"
import LocumUserJobPartViewInfo from "@/components/Jobs/LocumUserJobPartViewInfo"
import LocumUserJobViewJobParts from "@/components/Jobs/LocumUserJobViewJobParts"
import LocumUserJobViewJobMap from "@/components/Jobs/LocumUserJobViewJobMap"
import JobDetailModalUnassignForm from "@/components/Jobs/JobDetailModalUnassignForm"
import AppConfirmationModal from "@/components/Base/AppConfirmationModal"

export default {
  components: {
    AppLoading,
    LocumUserJobPartViewInfo,
    LocumUserJobViewJobParts,
    LocumUserJobViewJobMap,
    JobDetailModalUnassignForm,
    AppConfirmationModal,
  },

  props: {
    loadingJobPart: {
      type: Boolean,
      default: false,
    },

    job_part: {
      type: Object,
      default: () => null,
    },

    job_part_job: {
      type: Object,
      default: () => null,
    },
  },

  data () {
    return {
      loading: false,
      toggle_invoice_modal: false,
      cancel_application_modal: false,
      confirmation_text: "",
      confirmation_modal: false,
    }
  },

  computed: {
    job () {
      console.log("job_part_job", this.job_part_job)
      if (this.job_part_job) {
        return this.job_part_job
      }
      return this.job_part && this.job_part.job
        ? this.job_part.job
        : null
    },
  },

  methods: {
    favorite () {
      this.confirmation_text = "Add this Practice to Favourites?"
      this.confirmation_modal = true
    },

    unfavorite () {
      this.confirmation_text = "Remove this Practice to Favourites?"
      this.confirmation_modal = true
    },

    confirm () {
      if (!this.job_part.practice_is_favorite_of_locum) {
        this.$axios
          .$post(`/api/v1/locum/practices/${this.job_part.practice_id}/favorite`)
          .then(() => {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: ["Added to favourites",],
            })

            const jobPart = {
              ...this.job_part,
            }

            jobPart.practice_is_favorite_of_locum = true

            this.$emit('setJobPart', jobPart)
          })
          .catch(err => {
            console.log("err", err.response || err)
            throw err
          })
          .finally(() => {
            this.confirmation_modal = false
          })
      } else if (this.job_part.practice_is_favorite_of_locum) {
        this.$axios
          .$delete(`/api/v1/locum/practices/${this.job_part.practice_id}/favorite`)
          .then(() => {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: ["Remove to favourites",],
            })

            const jobPart = {
              ...this.job_part,
            }

            jobPart.practice_is_favorite_of_locum = false

            this.$emit('setJobPart', jobPart)
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

    goToGenerateInvoice () {
      this.$router.push(`/locum-billing/invoices`)

      setTimeout(() => {
        if (this.job_part.locum_invoice_id) {
          if (this.job_part.status === 'Approved') {
            this.$router.push({
              path: `/locum-billing/invoices/${this.job_part.locum_invoice_id}`,
            })
          } else {
            this.$router.push({
              path: `/locum-billing/invoices/${this.job_part.locum_invoice_id}/edit`,
            })
          }
        } else {
          this.$router.push(`/locum-billing/invoices/${this.job_part.id}/create`)
        }
      }, 500)
    },

    status (status) {
      return status.toUpperCase()
    },

    bgStatus (status) {
      switch (status) {
      case "Ongoing":
      case "Completed":
        return "bg-green-600 text-white"
      case "Approved":
        return "bg-green-600 text-white cursor-pointer"
      case "Cancelled":
        return "bg-red-500 text-white cursor-pointer"
      default:
        return "bg-red-500 text-white"
      }
    },

    decline () {
      if (this.job_part.locum_job_part_status === "Allocated") {
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
      } else if (this.locum_job_part_status === "Applied") {
        this.cancel_application_modal = true
      }
    },

    accept () {
      const jobId = this.job_part.job_id

      this.loading = true

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
        .finally(() => {
          this.loading = false
        })
    },

    cancel () {
      const jobId = this.job_part.job_id

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
