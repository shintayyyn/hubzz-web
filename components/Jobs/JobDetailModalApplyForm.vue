<template>
  <div class="relative bg-white rounded-lg border p-4 mt-4">
    <template v-if="true || isReadyToApply">
      <div class="text-sm sm:text-base mb-4">
        This job is still open
      </div>
      <template v-if="job.use_variation_terms && (job.variation_terms_file_id || job.standard_terms_file_id)">
        <template v-if="job.variation_terms_file_id">
          <div class="font-bold text-sm sm:text-md">
            Terms &amp; Conditions
          </div>
          <div class="text-sm sm:text-md">
            Variation Terms
          </div>
          <div class="text-xs sm:text-sm mb-6 flex flex-row flex-wrap">
            <transition name="slide" mode="out-in">
              <div v-if="modal && job.variation_terms_file" class="modal-container shadow-lg py-4">
                <AppLoading :loading="loading" spinner />
                <div class="w-full px-6 flex flex-col" style="height: 95vh;">
                  <p class="mb-2 flex-shrink-0">
                    Variation Terms
                  </p>
                  <div class="flex-1 overflow-hidden min-h-0">
                    <embed class="object-contain object-top w-full h-full"
                           :class="job.variation_terms_file.type == 'image' ? 'image' : 'document'"
                           :src="fileSrc(job.variation_terms_file)"
                    >
                  </div>
                  <div class="my-4 flex-shrink-0">
                    <div class="flex flex-row justify-center">
                      <div class="mx-4">
                        <AppButton :label="'Agree & Apply'" :disabled="loading" @click="checkUnavailability" />
                      </div>
                      <div class="mx-4">
                        <AppButton :label="'Cancel'" :disabled="loading" @click="modal = false" />
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
              <div v-if="modal && job.standard_terms_file" class="modal-container shadow-lg py-4">
                <AppLoading :loading="loading" spinner />
                <div class="w-full px-6 flex flex-col" style="height: 95vh;">
                  <div class="mb-2 flex-shrink-0">
                    Standard Terms
                  </div>
                  <div class="flex-1 overflow-hidden min-h-0">
                    <embed class="object-contain object-top w-full h-full"
                           :class="job.standard_terms_file.type == 'image' ? 'image' : 'document h-full '"
                           :src="fileSrc(job.standard_terms_file)"
                    >
                  </div>
                  <div class="my-4 flex-shrink-0">
                    <div class="flex flex-row justify-center">
                      <div class="mx-4">
                        <AppButton :label="'Agree & Apply'" :disabled="loading" @click="checkUnavailability" />
                      </div>
                      <div class="mx-4">
                        <AppButton :label="'Cancel'" :disabled="loading" @click="modal = false" />
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
              <div v-if="modal && job.standard_terms_file" class="modal-container shadow-lg py-4">
                <AppLoading :loading="loading" spinner />
                <div class="w-full px-6 flex flex-col" style="height: 95vh;">
                  <p class="mb-2 flex-shrink-0">
                    Standard Terms
                  </p>
                  <div class="flex-1 overflow-hidden min-h-0">
                    <embed class="w-full h-full object-contain object-top"
                           :class="job.standard_terms_file.type == 'image' ? 'image' : 'document'"
                           :src="fileSrc(job.standard_terms_file)"
                    >
                  </div>
                  <div class="my-4 flex-shrink-0">
                    <div class="flex flex-row justify-center">
                      <div class="mx-4">
                        <AppButton :label="'Agree & Apply'" :disabled="loading" @click="checkUnavailability" />
                      </div>
                      <div class="mx-4">
                        <AppButton :label="'Cancel'" :disabled="loading" @click="modal = false" />
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
                <div class="w-full px-6 flex flex-col" style="height: 95vh;">
                  <p class="mb-2 flex-shrink-0">
                    Variation Terms
                  </p>
                  <div class="flex-1 overflow-hidden min-h-0">
                    <embed class="object-contain object-top w-full h-full"
                           :class="job.variation_terms_file.type == 'image' ? 'image' : 'document h-full '"
                           :src="fileSrc(job.variation_terms_file)"
                    >
                  </div>
                  <div class="my-4 flex-shrink-0">
                    <div class="flex flex-row justify-center">
                      <div class="mx-4">
                        <AppButton :label="'Agree & Apply'" :disabled="loading" @click="checkUnavailability" />
                      </div>
                      <div class="mx-4">
                        <AppButton :label="'Cancel'" :disabled="loading" @click="modal = false" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </template>
      </template>

      <AppButton :label="'Apply now'" :disabled="loading" @click="checkVariationTerms" />

      <div
        v-if="isUnavailable"
        class="mt-2 text-xs text-yellow-700 bg-yellow-50 border border-yellow-300 rounded px-3 py-2"
      >
        You have marked yourself as unavailable for: {{ unavailabilityConflictsFormatted }}
      </div>
    </template>

    <template v-if="false && !isReadyToApply">
      <div class="text-sm sm:text-base mb-4">
        Please complete your
        <strong>compliance</strong> requirements to be eligible to apply for this job
      </div>

      <nuxt-link :to="{ path: '/compliance' }"
                 class="button rounded-lg p-2 md:px-4 font-bold md:text-lg focus:outline-none transition-hover"
      >
        Go to Compliance
      </nuxt-link>
    </template>

    <AppLoading :loading="loading" spinner />

    <!-- :label="`You already appointed to one of this Practice Job.`" -->

    <AppConfirmationModal
      :label="'You have marked yourself as unavailable for:'"
      :label2="unavailabilityConflictsFormatted"
      :label3="'Are you sure you want to apply anyway?'"
      :confirmLabel="'Yes, Apply'"
      :cancelLabel="'Cancel'"
      :modal="unavailability_warning_modal"
      :loading="loading"
      @confirm="onUnavailabilityConfirmed"
      @cancel="unavailability_warning_modal = false"
    />

    <AppConfirmationModal :label="`This Job is conflict on ${conflictJobNumbers.length} of your appointed Job.`"
                          :label2="`${conflictJobNumbers.length > 2 ? `${conflictJobNumbers.slice(0, 2)},etc..` : `${conflictJobNumbers}`}`"
                          :label3="`Are you sure you want to continue?`" :confirmLabel="'Yes'" :cancelLabel="'Cancel'"
                          :modal="warning_modal" :loading="loading" @confirm="applyLocumToJob" @cancel="warning_modal = false"
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
  data() {
    return {
      conflictJobNumbers: [],
      warning_modal: false,
      unavailability_warning_modal: false,
      isUnavailable: false,
      unavailabilityConflicts: [],
      loading: false,
      userCompliance: [],
      gmc_or_nmc_number_status: null,
      mpl_or_npl_number_status: null,

      // standard terms
      modal: false,
    }
  },
  computed: {
    unavailabilityConflictsFormatted() {
      const fmtDate = (d, includeYear) => {
        const [y, m, day] = d.split('-').map(Number)
        const opts = includeYear
          ? { month: 'long', day: 'numeric', year: 'numeric' }
          : { month: 'long', day: 'numeric' }
        return new Date(y, m - 1, day).toLocaleDateString('en-US', opts)
      }
      const fmtShifts = (shifts) => shifts.length <= 2
        ? shifts.join(' and ')
        : shifts.slice(0, -1).join(', ') + ' and ' + shifts[shifts.length - 1]

      const groups = []
      this.unavailabilityConflicts.forEach(({ date, shifts }) => {
        const shiftKey = shifts.join('|')
        const last = groups[groups.length - 1]
        if (last && last.shiftKey === shiftKey) {
          const [ly, lm, ld] = last.endDate.split('-').map(Number)
          const [cy, cm, cd] = date.split('-').map(Number)
          if (new Date(cy, cm - 1, cd) - new Date(ly, lm - 1, ld) === 86400000) {
            last.endDate = date
            return
          }
        }
        groups.push({ startDate: date, endDate: date, shifts, shiftKey })
      })

      const parts = groups.map(({ startDate, endDate, shifts }) => {
        const shiftStr = fmtShifts(shifts)
        if (startDate === endDate) return `${fmtDate(startDate, true)} (${shiftStr})`
        return `${fmtDate(startDate, false)} to ${fmtDate(endDate, true)} (${shiftStr})`
      })

      if (parts.length === 0) return ''
      if (parts.length === 1) return parts[0]
      if (parts.length === 2) return parts[0] + ' and ' + parts[1]
      return parts.slice(0, -1).join(', ') + ', and ' + parts[parts.length - 1]
    },

    isReadyToApply() {
      let isComplete = true
      this.job.compliance_documents
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

  mounted() {
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
    checkVariationTerms() {
      if (this.job
        && this.job.standard_terms_file_id !== null
        && this.job.standard_terms_file !== null) {
        this.modal = true
      } else if (this.job
        && this.job.variation_terms_file_id !== null
        && this.job.variation_terms_file !== null) {
        this.modal = true
      } else {
        this.checkUnavailability()
      }
    },

    checkUnavailability() {
      this.loading = true
      this.isUnavailable = false
      this.unavailabilityConflicts = []

      const jobScheduleKeys = new Set()
      const schedules = Array.isArray(this.job.schedules) ? this.job.schedules : []
      schedules.forEach((s) => {
        if (s.date && s.shift_id) jobScheduleKeys.add(`${s.date}|${s.shift_id}`)
      })

      const params = { limit: 10000 }
      if (this.job.date_start) params.date_start = this.job.date_start
      if (this.job.date_end) params.date_end = this.job.date_end

      this.$axios.get('/api/v1/locum/unavailabilities', { params }).then((response) => {
        const raw = response.data.data.unavailabilities
        const unavailabilities = Array.isArray(raw) ? raw : (raw && raw.rows ? raw.rows : [])

        const conflictMap = new Map()
        unavailabilities.forEach((u) => {
          if (!u.shifts || !u.shifts.length) return
          u.shifts.forEach((s) => {
            if (jobScheduleKeys.has(`${u.date}|${s.id}`)) {
              if (!conflictMap.has(u.date)) conflictMap.set(u.date, [])
              if (!conflictMap.get(u.date).includes(s.name)) {
                conflictMap.get(u.date).push(s.name)
              }
            }
          })
        })

        if (conflictMap.size > 0) {
          this.unavailabilityConflicts = [...conflictMap.entries()]
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([date, shifts]) => ({ date, shifts }))
          this.isUnavailable = true
          this.unavailability_warning_modal = true
          this.loading = false
        } else {
          this.checkIfLocumAlreadyAppointed()
        }
      }).catch(() => {
        this.checkIfLocumAlreadyAppointed()
      })
    },

    onUnavailabilityConfirmed() {
      this.unavailability_warning_modal = false
      this.checkIfLocumAlreadyAppointed()
    },

    checkIfLocumAlreadyAppointed() {
      this.loading = true
      this.conflictJobNumbers = []
      this.$axios.get(`/api/v1/locum/jobs/${this.job.id}/has-conflict`).then((response) => {
        this.conflictJobNumbers = response.data.data.job.conflict_job_job_numbers

        if (this.conflictJobNumbers.length > 0) {
          this.warning_modal = true
          this.loading = false
        } else if (this.conflictJobNumbers.length === 0) {
          this.applyLocumToJob()
        }
      })
    },

    errorHandler(err) {
      console.log('err', err.response || err)

      let message = null

      if (err.response) {
        message = err.response.data.message
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
    },

    applyLocumToJob() {
      const jobId = this.job.id

      this.loading = true

      this.$axios.post(`/api/v1/locum/jobs/${jobId}/apply`).then((response) => {
        const message = response.data.message

        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "success",
          text: [`${message}`,],
        })

        this.$store.commit("jobs/REMOVE_LOCUM_AVAILABLE_JOB", jobId)

        this.$store.commit("jobs/REMOVE_LOCUM_MATCHED_JOB", jobId)

        this.$emit("applied", jobId)
      }).catch(this.errorHandler).finally(() => {
        this.modal = false
        this.loading = false
      })
    },

    // Same viewer rules as FileModal.getFileUrl: gview often fails to preview Word
    // files (shows its "open" popup) and needs the file URL encoded
    fileSrc(file) {
      const { url, subtype } = file
      const wordSubtypes = [
        'msword',
        'doc',
        'docx',
        'vnd.openxmlformats-officedocument.wordprocessingml.document',
        'vnd.openxmlformats-officedocument.wordprocessingml.template',
        'vnd.ms-word.document.macroEnabled.12',
        'vnd.ms-word.template.macroEnabled.12',
      ]

      if (wordSubtypes.includes(subtype)) {
        return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`
      }

      if (subtype === 'tiff') {
        return `${process.env.API_URL}/image-to-jpeg?url=${url}`
      }

      return url
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
