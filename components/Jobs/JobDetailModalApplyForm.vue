<template>
  <div class="relative bg-white rounded-lg shadow-lg p-4 md:p-8 mt-8">
    <template v-if="true || isReadyToApply">
      <div class="text-sm sm:text-base mb-4">
        This job is still open
      </div>
      
      <AppButton :label="'Apply now'" :disabled="loading" @click="checkIfLocumAlreadyAppointed" />
    </template>

    <template v-if="false && !isReadyToApply">
      <div class="text-sm sm:text-base mb-4">
        Please complete your
        <strong>compliance</strong> requirements to be eligible to apply for this job
      </div>

      <nuxt-link
        :to="{ path: '/compliance' }"
        class="button rounded-lg p-2 md:px-4 font-bold md:text-lg focus:outline-none transition-hover"
      >
        Go to Compliance
      </nuxt-link>
    </template>

    <AppLoading :loading="loading" spinner />

    <!-- :label="`You already appointed to one of this Practice Job.`" -->

    <AppConfirmationModal
      :label="`This Job is conflict on one of your appointed Job.`"
      :label2="`${conflictJobs.length > 2 ? `${conflictJobs.slice(0,2)},etc..` : `${conflictJobs}`}`"
      :label3="`Are you sure you want to continue?`"
      :confirmLabel="'Yes'"
      :cancelLabel="'Cancel'"
      :modal="warning_modal"
      :loading="loading"
      @confirm="apply"
      @cancel="warning_modal = false"
    />
  </div>
</template>

<script>
import AppConfirmationModal from "@/components/Base/AppConfirmationModal"
import AppLoading from "@/components/Base/AppLoading"
import AppButton from "@/components/Base/AppButton"
export default {
  components: {
    AppConfirmationModal,
    AppButton,
    AppLoading,
  },
  props: {
    job: {
      type: Object,
      required: true,
    },
  },
  data () {
    return {
      conflictJobs: [],
      warning_modal: false,
      loading: false,
      userCompliance: [],
      gmc_or_nmc_number_status: null,
      mpl_or_npl_number_status: null,
    }
  },
  computed: {
    isReadyToApply () {
      let isComplete = true
      this.job.platform_job.compliance_documents
        .map(item => item.id)
        .forEach(id => {
          if (!this.userCompliance.includes(id)) {
            isComplete = false
          }
        })
      if (
        this.gmc_or_nmc_number_status === "Expired"
        || this.mpl_or_npl_number_status === "Expired"
      ) {
        isComplete = false
      }
      return isComplete
    },
  },

  mounted () {
    this.$auth.user.locum_detail.compliance_documents.forEach(item => {
      if (item.status === "Expiring" || item.status === "Approved") {
        this.userCompliance.push(item.compliance_document.id)
      }
    })

    this.gmc_or_nmc_number_status = this.$auth.user.locum_detail && this.$auth.user.locum_detail.gmc_or_nmc_number
      ? this.$auth.user.locum_detail.gmc_or_nmc_number.status
      : null
    this.mpl_or_npl_number_status = this.$auth.user.locum_detail && this.$auth.user.locum_detail.mpl_or_npl_number
      ? this.$auth.user.locum_detail.mpl_or_npl_number.status
      : null
  },

  methods: {
    checkIfLocumAlreadyAppointed () {
      this.loading = true
      this.$axios
        .$get(`/api/v1/locum/job-parts`, {
          params: {
            appointed_to_locum_user_id: this.$auth.user.id,
            status: ["Allocated", "Ongoing",],
            job_practice_id: this.job.practice_id,
          },
        })
        .then(res => {
          this.conflictJobs = []

          res.data.job_parts.forEach(jobPart => {
            if (jobPart.dates.some(date => this.job.dates.includes(date))) {
              if (jobPart.status === "Ongoing") {
                this.conflictJobs.push(jobPart.job_part_number)
              } else if (jobPart.status === "Allocated") {
                this.conflictJobs.push(jobPart.job_job_number)
              }
            }
          })

          this.conflictJobs = [...new Set(this.conflictJobs),]

          if (this.conflictJobs.length > 0) {
            this.warning_modal = true
          } else if (this.conflictJobs.length === 0) {
            this.apply()
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    apply () {
      this.loading = true
      this.$axios
        .$post(`/api/v1/locum/jobs/${this.job.id}/apply`)
        .then(res => {
          this.$store.commit("jobs/REMOVE_LOCUM_AVAILABLE_JOB", this.job.id)
          this.$store.commit("jobs/REMOVE_LOCUM_MATCHED_JOB", this.job.id)
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`${res.message}`,],
          })
          this.$emit("applied", this.job.id) // FILTERS THE JOBS DATATABLE
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
        .finally(() => {
          this.loading = false
        })
    },
  },
}
</script>
