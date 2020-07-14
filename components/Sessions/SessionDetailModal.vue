<template>
  <div class="p-4 md:p-8">
    <div>
      <svgicon
        name="left-arrow"
        height="32"
        width="32"
        class="cursor-pointer"
        @click="$emit('close')"
      />
    </div>

    <div class="flex flex-wrap justify-start items-center mt-4">
      <div class="leading-tight font-bold text-md sm:text-lg">
        {{ job.title }}
      </div>

      <div class="mx-2 py-2 px-4 rounded font-semibold" :class="bgStatus(job.status)">
        {{ status(job.status) }}
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

      <template v-if="['Unfilled','Withdrawn','Cancelled'].includes(job.status) && !this.$route.name.includes('my-banks')">
        <AppButton :label="'Repost Job'" :in-style="'font-size:1em'" @click="repost" />
      </template>
    </div>

    <template v-if="['Allocated'].includes(job.status)">
      <div v-if="job.update_accepted_until && !job.update_accepted" class="mt-4">
        <span>Waiting for locum's approval within {{ job.update_accepted_until_duration_in_minutes_formatted }}, </span>
        <span>before {{ job.update_accepted_until_in_gb_formatted }}.</span>
      </div>
    </template>

    <AppConfirmationModal
      :label="'Approve this job?'"
      :confirmLabel="'Yes'"
      :cancelLabel="'Cancel'"
      :modal="approve_modal"
      @confirm="approveJob()"
      @cancel="approve_modal = false"
    />

    <div v-if="reject_modal">
      <div class="shield" @click.prevent="reject_modal = false" />
      <transition name="fade" mode="out-in">
        <div v-if="reject_modal" class="flex justify-center remove-confirmation-modal">
          <div class="w-full max-w-sm border-solid rounded-lg bg-white shadow-lg p-2">
            <AppInput
              v-model="form.rejected_reason"
              :type="'textarea'"
              :name="'rejected_reason'"
              :rows="3"
              :resize="false"
              :error="formError.find(item => item.field === 'rejected_reason')"
              :placeholder="'Enter Reason Here'"
            />

            <div class="flex justify-center mt-5">
              Note: Job will be deleted once rejected.
            </div>

            <div class="flex justify-center mt-2">
              <button
                class="font-bold text-sm no-underline px-2 py-2 rounded-lg bg-red-400 hover:bg-red-500 text-white focus:outline-none"
                @click="rejectJob"
              >
                Reject
              </button>

              <div class="mx-2" />

              <button
                class="font-bold text-sm no-underline px-2 py-2 rounded-lg bg-green-400 hover:bg-green-500 text-white focus:outline-none"
                @click="reject_modal = false"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </transition>
    </div>

    <div class="flex flex-col mt-4">
      <div class="flex flex-wrap justify-start">
        <div class="p-0 md:pr-4 w-full md:w-1/2">
          <div class="flex flex-col">
            <SessionDetailModalInfo v-if="toEdit === false" :job="job" />
            <div
              v-if="job.status === 'Pending' && practice.type == 'Hub' && toEdit === false"
              class="flex justify-start mt-5"
            >
              <button
                class="font-bold text-sm no-underline px-2 py-2 rounded-lg bg-green-400 hover:bg-green-500 text-white focus:outline-none"
                @click="approve_modal = true"
              >
                Approve
              </button>

              <div class="mx-2" />

              <button
                class="font-bold text-sm no-underline px-2 py-2 rounded-lg bg-red-400 hover:bg-red-500 text-white focus:outline-none"
                @click="toggleRejectModal"
              >
                Reject
              </button>
            </div>

            <SessionDetailModalUpdateForm
              v-if="toEdit"
              :job="job"
              @updateJob="updateJob"
              @scrollToTop="$emit('scrollToTop')"
            />

            <SessionDetailModalMap v-if="showMap" :job="job" />

            <SessionDetailModalCancelForm
              v-if="['Allocated','Ongoing','Applied','Live','Pending'].includes(job.status) && authPermissions.includes('Cancel Sessions Job')"
              :job="job"
              @cancelled="$emit('close'), $emit('cancelled', $event)"
            />
          </div>
        </div>

        <div class="p-0 md:pl-4 w-full md:w-1/2 order-first md:order-none">
          <div class="flex flex-col">
            <SessionPartDetailModalParts :job_id="job.id" :disabled-link="true" />

            <SessionDetailModalCandidates
              v-if="job.status === 'Applied'"
              :job="job"
              @appointed="$emit('close'), $emit('appointed', job.id)"
              @close="$emit('close')"
            />

            <SessionDetailModalLocum
              v-if="(job.status === 'Allocated' || job.status === 'Ongoing' || job.status === 'Completed' || job.status === 'Declined' || job.status === 'Withdrawn')"
              :job="job"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SessionPartDetailModalParts from "@/components/Sessions/SessionPart/SessionPartDetailModalParts"
import SessionDetailModalInfo from "@/components/Sessions/SessionDetailModalInfo"
import SessionDetailModalUpdateForm from "@/components/Sessions/SessionDetailModalUpdateForm"
import SessionDetailModalCandidates from "@/components/Sessions/SessionDetailModalCandidates"
import SessionDetailModalLocum from "@/components/Sessions/SessionDetailModalLocum"
import SessionDetailModalCancelForm from "@/components/Sessions/SessionDetailModalCancelForm"
import SessionDetailModalMap from "@/components/Sessions/SessionDetailModalMap"
import AppButton from "@/components/Base/AppButton"
import AppInput from "@/components/Base/AppInput"
import AppConfirmationModal from "@/components/Base/AppConfirmationModal"

export default {
  components: {
    AppConfirmationModal,
    SessionDetailModalInfo,
    SessionPartDetailModalParts,
    SessionDetailModalUpdateForm,
    SessionDetailModalCandidates,
    SessionDetailModalLocum,
    SessionDetailModalCancelForm,
    SessionDetailModalMap,
    AppInput,
    AppButton,
  },

  props: {
    job: {
      type: Object,
      required: true,
    },
  },

  data () {
    return {
      formError: [],
      form: {
        rejected_reason: "",
      },
      approve_modal: false,
      reject_modal: false,
      user: null,
      toEdit: false,
      practice: "",
      showMap: false,
      deadline: {
        hours: 0,
        minutes: 0,
      },
    }
  },

  computed: {
    authPermissions () {
      return this.$store.getters["permissions"]
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
    this.practice = this.$auth.user.practice_detail.practice
  },

  mounted () {
    setTimeout(() => {
      this.showMap = true
    }, 1)
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
        }
      }, 500)
    },

    approveJob () {
      this.$axios
        .$put(`/api/v1/practice/jobs/${this.job.id}/approve`)
        .then(res => {
          console.log(res)
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`Job Successfully approved`,],
          })
          this.$emit("close")
        })
        .catch(err => {
          console.log("err", err.response || err)
        })
        .finally(() => {
          this.approve_modal = false
        })
    },

    toggleRejectModal () {
      this.reject_modal = true
      this.form.rejected_reason = ""
    },

    rejectJob () {
      this.formError = []
      this.Validate(this.form)
      if (!this.formError.length) {
        this.$axios
          .$put(`/api/v1/practice/jobs/${this.job.id}/reject`, this.form)
          .then(res => {
            console.log(res)
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "danger",
              text: [`Job Successfully rejected`,],
            })
            this.$emit("close")
          })
          .catch(err => {
            console.log("err", err.response || err)
          })
          .finally(() => {
            this.reject_modal = false
          })
      }
    },

    status (status) {
      return status.toUpperCase()
    },

    bgStatus (status) {
      let str
      switch (status) {
      case "Live":
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

    repost () {
      this.$emit("close")

      setTimeout(() => {
        if (this.$route.name.includes("hub-surgery-management")) {
          this.$store.commit("calendar/SET_REPOST_JOB", this.job)
          this.$store.commit("calendar/CREATE_JOB_SURGERY_MODAL", true)
        } else if (
          this.$route.name.includes("sessions")
          || this.$route.name.includes("dashboard")
        ) {
          this.$store.commit("calendar/SET_REPOST_JOB", this.job)
          this.$store.commit("calendar/CREATE_JOB_MODAL", true)
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
  .remove-confirmation-modal {
    position: fixed;
    left: 0;
    right: 0;
    height: auto;
    z-index: 601;
  }
</style>
