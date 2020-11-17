<template>
  <div class="relative bg-white rounded-lg shadow-lg p-4 md:p-8 mt-8">
    <template v-if="true || isReadyToApply">
      <div class="text-sm sm:text-base mb-4">
        This job is still open
      </div>
      <template v-if="job.use_variation_terms && (job.variation_terms_file_id || job.standard_terms_file_id) ">
        <template v-if="job.variation_terms_file_id">
          <div class="font-bold text-sm sm:text-md">
            Terms &amp; Conditions
          </div>
          <div class="text-sm sm:text-md">
            Variation Terms
          </div>
          <div class="text-xs sm:text-sm mb-6 flex flex-row flex-wrap">
            <transition name="slide" mode="out-in">
              <div v-if="modal && job.variation_terms_file" class="modal-container shadow-lg">
                <AppLoading :loading="loading" spinner />
                <div class="h-full w-full px-6">
                  Variation Terms
                  <embed
                    class="object-contain object-top w-full"
                    :class="job.variation_terms_file.type == 'image' ? 'image' : 'document h-full '"
                    :src="['msword', 'tiff', 'vnd.openxmlformats-officedocument.wordprocessingml.document', 'vnd.openxmlformats-officedocument.wordprocessingml.template', 'vnd.ms-word.document.macroEnabled.12', 'vnd.ms-word.template.macroEnabled.12'].includes(job.variation_terms_file.subtype) ? convertDoc(job.variation_terms_file.url) : job.variation_terms_file.url"
                  >
                  <div class="my-4">
                    <div class="flex flex-row justify-center">
                      <div class="mx-4">
                        <AppButton :label="'Agree & Apply'" :disabled="loading" @click="checkIfLocumAlreadyAppointed" />
                      </div>
                      <div class="mx-4">
                        <AppButton :label="'Cancel'" :disabled="loading" @click="modal=false" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </template>
        <template v-else-if="job.standard_terms_file_id">
          <div class="font-bold text-sm sm:text-md">
            Terms &amp; Conditions
          </div>
          <div class="text-sm sm:text-md">
            Standard Terms
          </div>
          <div class="text-xs sm:text-sm mb-6 flex flex-row flex-wrap">
            <transition name="slide" mode="out-in">
              <div v-if="modal && job.standard_terms_file" class="modal-container shadow-lg">
                <AppLoading :loading="loading" spinner />
                <div class="h-full w-full px-6">
                  Standard Terms
                  <embed
                    class="object-contain object-top w-full"
                    :class="job.standard_terms_file.type == 'image' ? 'image' : 'document h-full '"
                    :src="['msword', 'tiff', 'vnd.openxmlformats-officedocument.wordprocessingml.document', 'vnd.openxmlformats-officedocument.wordprocessingml.template', 'vnd.ms-word.document.macroEnabled.12', 'vnd.ms-word.template.macroEnabled.12'].includes(job.standard_terms_file.subtype) ? convertDoc(job.standard_terms_file.url) : job.standard_terms_file.url"
                  >
                  <div class="my-4">
                    <div class="flex flex-row justify-center">
                      <div class="mx-4">
                        <AppButton :label="'Agree & Apply'" :disabled="loading" @click="checkIfLocumAlreadyAppointed" />
                      </div>
                      <div class="mx-4">
                        <AppButton :label="'Cancel'" :disabled="loading" @click="modal=false" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </template>
      </template>

      <template v-if="!job.use_variation_terms && (job.variation_terms_file_id || job.standard_terms_file_id)">
        <template v-if="job.standard_terms_file_id">
          <div class="font-bold text-sm sm:text-md">
            Terms &amp; Conditions
          </div>
          <div class="text-sm sm:text-md">
            Standard Terms
          </div>
          <div class="text-xs sm:text-sm mb-6 flex flex-row flex-wrap">
            <transition name="slide" mode="out-in">
              <div v-if="modal && job.standard_terms_file" class="modal-container shadow-lg">
                <AppLoading :loading="loading" spinner />
                <div class="h-full w-full px-6">
                  Standard Terms
                  <embed
                    class="object-contain object-top w-full"
                    :class="job.standard_terms_file.type == 'image' ? 'image' : 'document h-full '"
                    :src="['msword', 'tiff', 'vnd.openxmlformats-officedocument.wordprocessingml.document', 'vnd.openxmlformats-officedocument.wordprocessingml.template', 'vnd.ms-word.document.macroEnabled.12', 'vnd.ms-word.template.macroEnabled.12'].includes(job.standard_terms_file.subtype) ? convertDoc(job.standard_terms_file.url) : job.standard_terms_file.url"
                  >
                  <div class="my-4">
                    <div class="flex flex-row justify-center">
                      <div class="mx-4">
                        <AppButton :label="'Agree & Apply'" :disabled="loading" @click="checkIfLocumAlreadyAppointed" />
                      </div>
                      <div class="mx-4">
                        <AppButton :label="'Cancel'" :disabled="loading" @click="modal=false" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </template>
        <template v-else-if="job.variation_terms_file_id">
          <div class="font-bold text-sm sm:text-md">
            Terms &amp; Conditions
          </div>
          <div class="text-sm sm:text-md">
            Variation Terms
          </div>
          <div class="text-xs sm:text-sm mb-6 flex flex-row flex-wrap">
            <transition name="slide" mode="out-in">
              <div v-if="modal && job.variation_terms_file" class="modal-container shadow-lg">
                <AppLoading :loading="loading" spinner />
                <div class="h-full w-full px-6">
                  Variation Terms
                  <embed
                    class="object-contain object-top w-full"
                    :class="job.variation_terms_file.type == 'image' ? 'image' : 'document h-full '"
                    :src="['msword', 'tiff', 'vnd.openxmlformats-officedocument.wordprocessingml.document', 'vnd.openxmlformats-officedocument.wordprocessingml.template', 'vnd.ms-word.document.macroEnabled.12', 'vnd.ms-word.template.macroEnabled.12'].includes(job.variation_terms_file.subtype) ? convertDoc(job.variation_terms_file.url) : job.variation_terms_file.url"
                  >
                  <div class="my-4">
                    <div class="flex flex-row justify-center">
                      <div class="mx-4">
                        <AppButton :label="'Agree & Apply'" :disabled="loading" @click="checkIfLocumAlreadyAppointed" />
                      </div>
                      <div class="mx-4">
                        <AppButton :label="'Cancel'" :disabled="loading" @click="modal=false" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </template>
      </template>

      <AppButton 
        :label="'Apply now'" 
        :disabled="loading" 
        @click="checkVariationTerms" 
      />
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
      :label="`This Job is conflict on ${conflictJobNumbers.length} of your appointed Job.`"
      :label2="`${conflictJobNumbers.length > 2 ? `${conflictJobNumbers.slice(0,2)},etc..` : `${conflictJobNumbers}`}`"
      :label3="`Are you sure you want to continue?`"
      :confirmLabel="'Yes'"
      :cancelLabel="'Cancel'"
      :modal="warning_modal"
      :loading="loading"
      @confirm="apply"
      @cancel="warning_modal = false"
    />
    <transition name="fade" mode="out-in">
      <div v-if="modal" class="shield" @click="modal = false" />
    </transition>
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
      conflictJobNumbers: [],
      warning_modal: false,
      loading: false,
      userCompliance: [],
      gmc_or_nmc_number_status: null,
      mpl_or_npl_number_status: null,

      // standard terms
      modal: false,
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
    checkVariationTerms () {
      if (this.job 
        && this.job.standard_terms_file_id !== null 
        && this.job.standard_terms_file !== null) {
        this.modal = true
      } else if (this.job 
        && this.job.variation_terms_file_id !== null 
        && this.job.variation_terms_file !== null)  {
        this.modal = true
      } else {
        this.checkIfLocumAlreadyAppointed()
      }
    },

    checkIfLocumAlreadyAppointed () {
      this.loading = true
      this.conflictJobNumbers = []
      this.$axios.get(`/api/v1/locum/jobs/${this.job.id}/has-conflict`).then((response) => {
        this.conflictJobNumbers = response.data.data.job.conflict_job_job_numbers

        if (this.conflictJobNumbers.length > 0) {
          this.warning_modal = true
          this.loading = false
        } else if (this.conflictJobNumbers.length === 0) {
          this.apply()
        }
      })
    },

    async apply () {
      this.loading = true
      await this.$axios
        .$post(`/api/v1/locum/jobs/${this.job.id}/apply`)
        .then(res => {
          this.$store.commit("jobs/REMOVE_LOCUM_AVAILABLE_JOB", this.job.id)
          this.$store.commit("jobs/REMOVE_LOCUM_MATCHED_JOB", this.job.id)
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`${res.message}`,],
          })
          
          this.$emit("applied", this.job.id)
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
        }).finally(() => {
          this.modal = false
          this.loading = false
        })
    },

    convertDoc (document) {
      return `https://docs.google.com/gview?url=${document}&embedded=true`
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
      width: 70%;
    }
  }
</style>
