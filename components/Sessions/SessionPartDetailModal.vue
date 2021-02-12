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

    <div class="flex flex-row justify-start items-center py-4">
      <div class="leading-tight font-bold text-md sm:text-lg mr-2">
        {{ jobPart.job.title }}
      </div>

      <div
        class="py-1 px-4 mx-1 rounded font-semibold"
        :class="bgStatus(jobPart.status)"
        @click="['Approved','Cancelled'].includes(jobPart.status) ? toggle_invoice_modal = true : null"
      >
        {{ status(jobPart.status) }}
      </div>

      <template v-if="authPermissions.includes('Update Sessions Job')">
        <button
          v-if="
            ((job.status === 'Allocated' || job.status === 'Pending' ) &&
              toEdit === false &&
              canEdit === true) ||
              (job.status === 'Pending' && toEdit === false) ||
              (job.status === 'Applied' && toEdit === false) ||
              (job.status === 'Live' && toEdit === false)
          "
          class="font-bold text-xs sm:text-sm no-underline px-2 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 ml-4 focus:outline-none"
          @click.prevent="toEdit = true"
        >
          Edit this job
        </button>

        <button
          v-if="
            ((job.status === 'Allocated' || job.status === 'Pending' ) &&
              toEdit === true &&
              canEdit === true) ||
              (job.status === 'Pending' && toEdit === true) ||
              (job.status === 'Applied' && toEdit === true) ||
              (job.status === 'Live' && toEdit === true)
          "
          class="font-bold text-xs sm:text-sm no-underline px-2 py-2 rounded-lg bg-yellow-500 ml-4 focus:outline-none"
          @click.prevent="toEdit = false"
        >
          Cancel Editing
        </button>
      </template>
      
      <div
        v-if="jobPart && jobPart.terminated"
        class="py-2 px-4 mx-1 rounded font-semibold bg-gray-300 cursor-pointer hover:bg-gray-600 hover:text-white"
        @click="toggle_invoice_modal = true"
      >
        TERMINATED
      </div>

      <div
        v-if="jobPart && jobPart.locum_invoiceable && jobPart.invoice_status && jobPart.status !== 'Approved'"
        class="py-2 px-4 mx-1 rounded font-semibold bg-gray-300 cursor-pointer hover:bg-gray-600 hover:text-white"
        @click="toggle_invoice_modal = true"
      >
        {{ jobPart.invoice_status.toUpperCase() }}
      </div>

      <template
        v-if="[
          'Terminated',
          'Completed',
          'Approved',
          'Cancelled',
          'Withdrawn',
          'Declined'
        ].includes(jobPart.status) && !this.$route.name.includes('my-banks')"
      >
        <AppButton :label="'Repost Job'" :in-style="'font-size:1em'" @click="repost" />
      </template>
    </div>

    <template v-if="['Allocated'].includes(job.status)">
      <div v-if="job.update_accepted_until && !job.update_accepted" class="mt-4">
        <span>Waiting for locum's approval within {{ job.update_accepted_until_duration_in_minutes_formatted }}, </span>
        <span>before {{ job.update_accepted_until_in_gb_formatted }}.</span>
      </div>
    </template>

    <div class="flex flex-col">
      <div class="flex flex-col md:flex-row justify-start">
        <div class="md:pr-4 w-full md:w-55p">
          <div class="flex flex-col">
            <div
              v-if="!loadingJobPart && (jobPart.status === 'Declined' || jobPart.status === 'Withdrawn' || jobPart.status === 'Cancelled')"
              class="border rounded-lg flex justify-between p-4 mb-4"
            >
              <template v-if="jobPart.status === 'Declined' || jobPart.status === 'Withdrawn'">
                <div class="w-full md:w-1/3 leading-tight">
                  <p class="font-bold text-sm sm:text-md">
                    Reason for Withdrawal
                  </p>
                  <p
                    class="text-xs sm:text-sm break-words"
                  >
                    {{ jobPart.job.platform_job.declined_reason ? jobPart.job.platform_job.declined_reason : '(none)' }}
                  </p>
                </div>
                <div class="w-full md:w-1/3 px-2 leading-tight">
                  <p class="font-bold text-sm sm:text-md">
                    Date of Withdrawal
                  </p>
                  <p
                    class="text-xs sm:text-sm"
                  >
                    {{ jobPart.declined_at_in_gb_formatted }}
                  </p>
                </div>
                <div class="w-full md:w-1/3 leading-tight">
                  <p class="font-bold text-sm sm:text-md">
                    Withdrawn by
                  </p>
                  <p class="text-xs sm:text-sm">
                    {{ jobPart.locum_first_name }}
                  </p>
                </div>
              </template>

              <template v-if="jobPart.status === 'Cancelled'">
                <div class="w-full md:w-1/3 leading-tight">
                  <p
                    class="font-bold text-sm sm:text-md"
                  >
                    {{ jobPart.terminated ? 'Terminated' : 'Cancelled' }} At
                  </p>

                  <p
                    class="text-xs sm:text-sm"
                  >
                    {{ jobPart.cancelled_at_in_gb_formatted }}
                  </p>
                </div>

                <div class="w-full md:w-1/3 px-2 leading-tight">
                  <p
                    class="font-bold text-sm sm:text-md"
                  >
                    Reason for {{ jobPart.terminated ? 'termination' : 'cancellation' }}
                  </p>

                  <p class="text-xs sm:text-sm">
                    {{ jobPart.job.platform_job.cancelled_reason }}
                  </p>
                </div>

                <div class="w-full md:w-1/3 leading-tight">
                  <p
                    class="font-bold text-sm sm:text-md"
                  >
                    {{ jobPart.terminated ? 'Terminated By' : 'Cancelled By' }}
                  </p>

                  <div class="flex justify-start">
                    <div class="text-xs sm:text-sm">
                      {{
                        jobPart.cancelled_by_practice === 'Hub'
                          ? jobPart.parent_practice_name
                          : jobPart.cancelled_by_practice === 'Spoke'
                            ? jobPart.practice_name
                            : jobPart.practice_name
                      }}
                    </div>

                    <div v-if="jobPart.cancelled_by_user" class="mx-1">
                      -
                    </div>

                    <div v-if="jobPart.cancelled_by_user" class="text-xs sm:text-sm">
                      {{
                        jobPart.cancelled_by_user.email
                          ? jobPart.cancelled_by_user.email
                          : jobPart.cancelled_by_user.name
                      }}
                    </div>
                  </div>
                </div>
              </template>
            </div>

            <SessionPartDetailModalInfo
              v-if="!toEdit"
              :loadingJobPart="loadingJobPart"
              :job_part="jobPart"
            />

            <SessionDetailModalUpdateForm
              v-if="toEdit && job"
              :job="job"
              @updateJob="updateJob"
              @scrollToTop="$emit('scrollToTop')"
            />

            <div
              v-if="
                !loadingJobPart
                  && (
                    practice.type !== 'Spoke'
                  || (practice.type === 'Spoke' && !practice.parent_practice_id)
                  || (practice.type === 'Spoke' && practice.parent_practice_id && practice.allow_surgery_bill_locum === true)
                  )
              "
            >
              <!-- <SessionDetailModalCompleteForm
								v-if="jobPart.status === 'Ongoing' && authPermissions.includes('Complete Sessions Job')"
								:job_part="jobPart"
								@completed="$emit('close')"
              />-->
              <SessionDetailModalCancelForm
                v-if="['Live','Allocated','Applied'].includes(jobPart.job_status) && authPermissions.includes('Cancel Sessions Job')"
                :job="jobPart.job"
                @cancelled="$emit('close')"
              />
            </div>
            <!-- <div
							v-else
							class="mx-4 m-2"
            >You are not allowed to set jobs as completed. Please contact your Hub to gain access to this feature.</div>-->
          </div>
        </div>

        <div class="md:pr-4 w-full md:w-45p">
          <div class="flex flex-col">
            <SessionPartDetailModalParts
              :job_id="jobPart.job.id"
              :cantCompleteJob="practice && practice.type !== 'Hub' && practice.parent_practice_id && !practice.allow_surgery_bill_locum"
              @close="$emit('close')"
            />

            <div
              v-if="practice && practice.type !== 'Hub' && practice.parent_practice_id && !practice.allow_surgery_bill_locum"
              class="px-2 mb-4"
            >
              <p>You are not allowed to set jobs as completed. Please contact your Hub to gain access to this feature.</p>
            </div>

            <SessionDetailModalLocum
            class="mt-2"
              v-if="(
                jobPart.status === 'Allocated'
                  || jobPart.status === 'Ongoing'
                  || jobPart.status === 'Completed'
                  || jobPart.status === 'Approved'
                  || jobPart.status === 'Withdrawn'
                  || (jobPart.status === 'Cancelled' && jobPart.appointed_to_locum_user_id)
              )"
              :job="jobPart.job"
            />
          </div>
        </div>
      </div>
    </div>

    <AppConfirmationModal
      :label="'Proceed to Invoice?'"
      :confirmLabel="'Yes'"
      :cancelLabel="'No'"
      :modal="toggle_invoice_modal"
      @confirm="goToGenerateInvoice"
      @cancel="toggle_invoice_modal = false"
    />
  </div>
</template>

<script>
import SessionPartDetailModalInfo from "@/components/Sessions/SessionPart/SessionPartDetailModalInfo"
import SessionPartDetailModalParts from "@/components/Sessions/SessionPart/SessionPartDetailModalParts"
import SessionDetailModalCancelForm from "@/components/Sessions/SessionDetailModalCancelForm"
// import SessionDetailModalCompleteForm from "@/components/Sessions/SessionDetailModalCompleteForm"
import SessionDetailModalLocum from "@/components/Sessions/SessionDetailModalLocum"
import AppButton from "@/components/Base/AppButton"
import AppConfirmationModal from "@/components/Base/AppConfirmationModal"
import SessionDetailModalUpdateForm from "@/components/Sessions/SessionDetailModalUpdateForm"

export default {
  components: {
    SessionPartDetailModalInfo,
    SessionPartDetailModalParts,
    // SessionDetailModalCompleteForm,
    SessionDetailModalCancelForm,
    SessionDetailModalLocum,
    AppButton,
    AppConfirmationModal,
    SessionDetailModalUpdateForm,
  },

  props: {
    loadingJobPart: {
      type: Boolean,
      default: false,
    },

    jobPart: {
      type: Object,
      required: true,
    },
  },

  data () {
    return {
      user: null,
      practice: null,
      toggle_invoice_modal: false,
      toEdit: false,
    }
  },
  computed: {
    authPermissions () {
      return this.$store.getters["permissions"]
    },

    job () {
      return this.jobPart ? this.jobPart.job : null 
    },

    canEdit () {
      return (
        this.$moment(
          `${this.job.date_start} ${this.job.time_start}`,
          "YYYY-MM-DD HH:mm"
        ).diff(
          this.$moment()
            .utc()
            .format("YYYY-MM-DD HH:mm"),
          "hours"
        ) >= 12
      )
    },
  },
  created () {
    this.user = this.$auth.user
    this.practice = this.$auth.user.practice_detail.practice
  },
  methods: {
    updateJob ({ newJobId, oldJobId, }) {
      this.$emit("close")

      setTimeout(() => {
        this.$store.commit("jobs/UPDATE_PRACTICE_PENDING_JOB", oldJobId)
        this.$store.commit("jobs/UPDATE_PRACTICE_ALLOCATED_JOB", oldJobId)
        this.$store.commit("jobs/UPDATE_PRACTICE_APPLIED_JOB", oldJobId)
        this.$store.commit("jobs/UPDATE_PRACTICE_AVAILABLE_JOB", oldJobId)
        if (this.$route.name === "sessions-index-id") {
          this.$router.push({
            path: `/sessions/${newJobId}`,
            query: { ...this.$route.query, },
          })
        } else {
          this.$router.push({
            path: `/job-parts`,
          })
        }
      }, 500)
    },

    goToGenerateInvoice () {
      this.$router.push(`/practice-billing/invoices-from-locums`)

      setTimeout(() => {
        if (this.jobPart.locum_invoice_id) {
          if (this.jobPart.status === 'Approved') {
            this.$router.push({
              path: `/practice-billing/invoices-from-locums/${this.jobPart.locum_invoice_id}`,
            })
          } else {
            this.$router.push({
              path: `/practice-billing/invoices-from-locums/${this.jobPart.locum_invoice_id}/edit`,
            })
          }
        }
      }, 500)
    },
    
    status (status) {
      let jobStatus = status === "Available" ? "Live" : status
      return jobStatus.toUpperCase()
    },

    bgStatus (status) {
      let str
      switch (status) {
      case "Ongoing":
      case "Completed":
      case "Approved":
      case "Allocated":
        str = "bg-green-600 text-white"
        break
      default:
        str = "bg-red-500 text-white"
      }
      return str
    },
    repost () {
      this.$emit("close")

      setTimeout(() => {
        if (this.$route.name.includes("hub-surgery-management")) {
          this.$store.commit("calendar/SET_REPOST_JOB", {
            ...this.jobPart.job,
            dates: this.jobPart.dates,
          })

          this.$store.commit("calendar/CREATE_JOB_SURGERY_MODAL", true)
        } else if (
          this.$route.name.includes("sessions")
          || this.$route.name.includes("job-parts")
          || this.$route.name.includes("dashboard")
        ) {
          this.$store.commit("calendar/SET_REPOST_JOB", {
            ...this.jobPart.job,
            dates: this.jobPart.dates,
          })
          
          this.$router.push('/create-job')
          // this.$store.commit("calendar/CREATE_JOB_MODAL", true)
        }
      }, 500)
    },
  },
}
</script>

<style scoped>
.shield {
  z-index: 511;
}
.modal-container {
  z-index: 512;
}
@media screen and (min-width: 1200px) {
  .modal-container {
    width: 60%;
  }
}
</style>
