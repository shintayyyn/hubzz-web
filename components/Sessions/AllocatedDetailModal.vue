<template>
  <div class="p-8 max-w-2xl">
    <div @click="close" class="cursor-pointer">
      <svgicon name="left-arrow" height="32" width="32" />
    </div>
    <div class="flex flex-row justify-start mt-8">
      <div class="mx-2 leading-loose font-bold text-md sm:text-lg">{{job.platform_job.title}}</div>
      <div class="mx-2 bg-green-light text-sm sm:text-sm p-2">ALLOCATED</div>
    </div>
    <div class="flex flex-row flex-wrap justify-start mt-4">
      <div class="flex flex-col w-full lg:w-2/3 p-0 lg:pr-4">
        <div class="text-xs sm:text-sm">Posted {{job.platform_job.date_created | localDate }}</div>
        <div class="rounded-lg shadow-lg p-8 mt-4">
          <div class="flex flex-row flex-wrap">
            <div class="flex flex-col w-full md:w-1/2 p-0 md:pr-4">
              <div class="font-bold text-sm sm:text-md">Job number</div>
              <div class="text-xs sm:text-sm mb-4">{{job.job_number}}</div>
              <div class="font-bold text-sm sm:text-md">Rate</div>
              <div class="text-xs sm:text-sm mt-2 mb-4 flex flex-row flex-nowrap">
                <input
                  v-model="form.rate"
                  type="text"
                  class="border-b-2 focus:border-yellow focus:outline-none py-2 font-bold text-xs w-1/5 text-right"
                />
                <div class="leading-loose mx-2">per</div>
                <select
                  v-model="form.locum_detail_rate_type.id"
                  class="border-b-2 focus:border-yellow focus:outline-none py-2 font-bold text-xs"
                >
                  <option
                    v-for="item in rate_types"
                    :key="item.id"
                    :value="item.value"
                  >{{item.label}}</option>
                </select>
              </div>
              <div class="font-bold text-sm sm:text-md">Total hours</div>
              <div class="text-xs sm:text-sm mt-2 mb-4 flex flex-row flex-nowrap">
                <input
                  v-model="form.total_hours"
                  type="text"
                  class="border-b-2 focus:border-yellow focus:outline-none py-2 font-bold text-xs w-1/5 text-right"
                />
                <div class="leading-loose mx-2">hours</div>
              </div>
              <div class="mb-8">
                <AppButton :label="'Save changes'" :inStyle="'padding:8px'" @click="save" />
              </div>
              <div class="font-bold text-sm sm:text-md">Job description</div>
              <div class="text-xs sm:text-sm mb-8">{{job.platform_job.job_description}}</div>
              <div class="font-bold text-sm sm:text-md">Extra information</div>
              <div class="text-xs sm:text-sm mb-8">{{job.platform_job.extra_information}}</div>
              <div class="font-bold text-sm sm:text-md">Report to</div>
              <div class="text-xs sm:text-sm mb-8">{{job.platform_job.report_to}}</div>
              <div class="font-bold text-sm sm:text-md">Telephone number</div>
              <div class="text-xs sm:text-sm mb-8">{{job.platform_job.phone_number}}</div>
              <div class="font-bold text-sm sm:text-md">Email address</div>
              <div class="text-xs sm:text-sm mb-8">{{job.platform_job.email}}</div>
            </div>
            <div class="flex flex-col w-full md:w-1/2 p-0 md:pl-4">
              <div class="font-bold text-sm sm:text-md">Duration</div>
              <div class="text-xs sm:text-sm">From {{job.platform_job.date_start}}</div>
              <div class="text-xs sm:text-sm my-2">To {{job.platform_job.date_end}}</div>
              <div class="text-xs sm:text-sm mb-8">Shift {{job.platform_job.shift.name}}</div>
              <div
                class="font-bold text-sm sm:text-md"
              >Auto-assigns this job to the first, matching Favourite applicant</div>
              <div
                class="text-xs sm:text-sm mb-8"
                v-if="job.platform_job.auto_assign_at"
              >{{job.platform_job.auto_assign_at | localDate}}</div>
              <div class="text-xs sm:text-sm mb-8" v-else>No</div>
              <div class="text-xs sm:text-sm mb-4">
                This job is
                <span
                  class="font-bold text-sm sm:text-md"
                >{{job.platform_job.ir35 ? 'INSIDE' : 'OUTSIDE'}}</span> of scope of
                <span class="font-bold text-sm sm:text-md">IR35</span>
              </div>
              <div class="font-bold text-sm sm:text-md">Role</div>
              <div class="text-xs sm:text-sm mb-8">{{job.platform_job.profession.name}}</div>
              <div class="font-bold text-sm sm:text-md">Specialty</div>
              <div class="text-xs sm:text-sm mb-8 flex flex-row flex-wrap">
                <div
                  class="rounded-lg bg-yellow-dark p-2 m-1"
                  v-for="item in job.platform_job.qualifications"
                  :key="item.id"
                >{{item.name}}</div>
              </div>
              <div class="font-bold text-sm sm:text-md">Clinical systems</div>
              <div class="text-xs sm:text-sm mb-8 flex flex-row flex-wrap">
                <div
                  class="rounded-lg bg-yellow-dark p-2 m-1"
                  v-for="item in job.platform_job.clinical_systems"
                  :key="item.id"
                >{{item.name}}</div>
              </div>
              <div class="font-bold text-sm sm:text-md">Spoken languages</div>
              <div class="text-xs sm:text-sm mb-8 flex flex-row flex-wrap">
                <div class="rounded-lg bg-yellow-dark p-2 m-1">English</div>
                <div
                  class="rounded-lg bg-yellow-dark p-2 m-1"
                  v-for="item in job.platform_job.spoken_languages"
                  :key="item.id"
                >{{item.name}}</div>
              </div>
              <div class="font-bold text-sm sm:text-md">Compliance requirements</div>
              <div class="text-xs sm:text-sm mb-8 flex flex-row flex-wrap">
                <div class="mt-1" v-if="job.platform_job.compliance_documents.length === 0">(none)</div>
                <div
                  v-else
                  class="rounded-lg bg-yellow-dark p-2 m-1"
                  v-for="item in job.platform_job.compliance_documents"
                  :key="item.id"
                >{{item.name}}</div>
              </div>
              <div class="font-bold text-sm sm:text-md">Mandatory training</div>
              <div class="text-xs sm:text-sm mb-8 flex flex-row flex-wrap">
                <div class="mt-1" v-if="job.platform_job.mandatory_trainings.length === 0">(none)</div>
                <div
                  v-else
                  class="rounded-lg bg-yellow-dark p-2 m-1"
                  v-for="item in job.platform_job.mandatory_trainings"
                  :key="item.id"
                >{{item.name}}</div>
              </div>
            </div>
          </div>
          <div class="flex flex-col">
            <div class="font-bold text-xs sm:text-sm">Practice</div>
            <div class="font-bold text-sm sm:text-md">{{job.platform_job.practice.surgery.name}}</div>
            <div
              class="text-sm sm:text-md"
            >{{job.platform_job.practice.surgery.address.line_1}} {{job.platform_job.practice.surgery.address.line_2}} {{job.platform_job.practice.surgery.address.line_3}} {{job.platform_job.practice.surgery.address.post_code}}</div>
            <div class="mt-4">
              <!-- google map -->
              <GmapMap
                :center="{lat:latLang.y, lng:latLang.x}"
                :zoom="15"
                map-type-id="terrain"
                style="width: 100%; height:300px"
              >
                <GmapMarker :position="google && new google.maps.LatLng(latLang.y, latLang.x)" />
              </GmapMap>
            </div>
          </div>
        </div>
        <div class="rounded-lg shadow-lg p-8 mt-4">
          <div class="font-bold text-md sm:text-lg">Cancel this job</div>
          <AppSelect
            v-model="form_cancel.cancelled_reason"
            :name="'reason'"
            :label="'Please select your reason'"
            :placeholder="'Select..'"
            :items="reasons"
          />
          <AppButton :label="'Cancel job'" @click="cancel" />
        </div>
        <div class="rounded-lg shadow-lg p-8 mt-4">
          <AppButton :label="'Mark this job as Complete'" @click="complete" />
        </div>
      </div>
      <div class="flex flex-col w-full lg:w-1/3 p-0 lg:pl-4 mt-4 lg:m-0" v-if="user">
        <div class="text-xs sm:text-sm font-bold">Locum</div>
        <div class="rounded-lg shadow-lg p-8 mt-4">
          <div class="flex flex-col">
            <div class="head-info">
              <div class="float-left mr-4">
                <svgicon name="no-avatar" height="80" width="80" />
              </div>
              <div class="font-bold mt-4 text-sm lg:text-lg">{{user.personal_detail.name}}</div>
              <div class="text-xs lg:text-sm">{{user.locum_detail.profession.name}}</div>
            </div>
            <div class="body-info my-4">
              <div class="font-bold text-sm sm:text-md">Headline</div>
              <div class="text-xs sm:text-sm mb-8">{{user.locum_detail.headline}}</div>
              <div class="font-bold text-sm sm:text-md">Biography</div>
              <div class="text-xs sm:text-sm mb-8">{{user.locum_detail.short_biography}}</div>
              <div class="font-bold text-sm sm:text-md">GMC / NMC Number</div>
              <div class="text-xs sm:text-sm mb-8">{{user.locum_detail.gmc_or_nmc_number.number}}</div>
              <div class="font-bold text-sm sm:text-md">MPL / NPL Number</div>
              <div class="text-xs sm:text-sm mb-8">{{user.locum_detail.mpl_or_npl_number.number}}</div>
              <div class="font-bold text-sm sm:text-md">NHS Smart Card ID Number</div>
              <div class="text-xs sm:text-sm mb-8">{{user.locum_detail.nhs_smart_card_id_number}}</div>
              <div class="font-bold text-sm sm:text-md">Special requirements</div>
              <div class="text-xs sm:text-sm mb-8">{{user.locum_detail.special_requirements}}</div>
              <div class="font-bold text-sm sm:text-md">Preferred rates</div>
              <div class="flex flex-col mb-8">
                <div
                  class="flex flex-row flex-nowrap mt-2"
                  v-for="item in user.locum_detail.rates"
                  :key="item.id"
                >
                  <div
                    class="text-xs sm:text-sm"
                  >{{item.rate_type.name}}: £ {{item.min}} - £ {{item.max}}</div>
                </div>
              </div>
              <div class="font-bold text-sm sm:text-md">Specialty</div>
              <div class="text-xs sm:text-sm mb-8 flex flex-row flex-wrap">
                <div
                  class="rounded-lg bg-yellow-dark p-2 m-1"
                  v-for="item in user.locum_detail.qualifications"
                  :key="item.id"
                >{{item.name}}</div>
              </div>
              <div class="font-bold text-sm sm:text-md">Clinical systems</div>
              <div class="text-xs sm:text-sm mb-8 flex flex-row flex-wrap">
                <div
                  class="rounded-lg bg-yellow-dark p-2 m-1"
                  v-for="item in user.locum_detail.clinical_systems"
                  :key="item.id"
                >{{item.name}}</div>
              </div>
              <div class="font-bold text-sm sm:text-md">Languages</div>
              <div class="text-xs sm:text-sm mb-8 flex flex-row flex-wrap">
                <div class="rounded-lg bg-yellow-dark p-2 m-1">English</div>
                <div
                  class="rounded-lg bg-yellow-dark p-2 m-1"
                  v-for="item in user.locum_detail.spoken_languages"
                  :key="item.id"
                >{{item.name}}</div>
              </div>
              <div class="font-bold text-sm sm:text-md">Compliance documents</div>
              <div class="flex flex-col mb-8">
                <div
                  class="flex flex-row flex-nowrap mt-2 cursor-pointer hover:underline"
                  v-for="item in mandatory"
                  :key="item.id"
                >
                  <svgicon name="cloud-download" height="24" width="24" />
                  <div
                    class="leading-normal mx-2 document-filename"
                  >{{item.compliance_document.name}}</div>
                </div>
              </div>
              <div class="font-bold text-sm sm:text-md">Other documents</div>
              <div class="flex flex-col mb-8">
                <div
                  class="flex flex-row flex-nowrap mt-2 cursor-pointer hover:underline"
                  v-for="item in optional"
                  :key="item.id"
                >
                  <svgicon name="cloud-download" height="24" width="24" />
                  <div
                    class="leading-normal mx-2 document-filename"
                  >{{item.compliance_document.name}}</div>
                </div>
              </div>
              <div class="font-bold text-sm sm:text-md">Referees</div>
              <div class="rounded-lg flex flex-col bg-grey-light my-2 p-4">
                <div class="text-xs sm:text-sm">name</div>
                <div class="text-xs sm:text-sm">number</div>
                <div class="text-xs sm:text-sm">email</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { gmapApi } from 'vue2-google-maps'
import AppSelect from '@/components/Base/AppSelect'
import AppButton from '@/components/Base/AppButton'
export default {
  props: ['job'],
  components: {
    AppSelect,
    AppButton
  },
  data() {
    return {
      rate_types: [],
      form: {
        rate: '',
        locum_detail_rate_type: null,
        total_hours: ''
      },
      form_cancel: {
        cancelled_reason: ''
      },
      user: null,
      mandatory: [],
      optional: []
    }
  },
  computed: {
    google: gmapApi,
    latLang() {
      return this.job.platform_job.practice.surgery.address.coordinates
    },
    reasons() {
      return this.$store.state.session.reasons
    }
  },
  created() {
    this.form.rate = this.job.platform_job.rate
    this.form.locum_detail_rate_type = this.job.platform_job.locum_detail_rate_type
    this.form.total_hours = this.job.platform_job.total_hours
    this.$axios.$get(`/api/v1/locum-detail-rate-types`).then(res => {
      this.rate_types = []
      res.data.locum_detail_rate_types.forEach(item => {
        this.rate_types.push({ label: item.name, value: item.id })
      })
    })
    this.getAssignedLocum()
  },
  methods: {
    getAssignedLocum() {
      this.$axios.$get(`/api/v1/practice/locums/${this.job.platform_job.appointed_to_locum.user.id}`).then(res => {
        this.user = res.data.user
        this.getProfessionCategory(res.data.user.locum_detail.profession.profession_category.id)
      })
    },
    getProfessionCategory(id) {
      this.$axios.$get(`/api/v1/profession-categories/${id}`).then(res => {
        this.mandatory = this.user.locum_detail.compliance_documents.filter(compliance_document => {
          return res.data.profession_category.mandatory_compliance_documents.some(mandatory_compliance_document => mandatory_compliance_document.id === compliance_document.compliance_document.id)
        })
        this.optional = this.user.locum_detail.compliance_documents.filter(compliance_document => {
          return res.data.profession_category.optional_compliance_documents.some(optional_compliance_document => optional_compliance_document.id === compliance_document.compliance_document.id)
        })
      })
    },
    close() {
      if (this.$route.fullPath === '/dashboard') {
        this.$emit('close')
      } else {
        const query = {
          ...this.$route.query
        }
        this.$router.push({ path: '/sessions', query })
      }
    },
    save() {
      let newForm = {}
      newForm.locum_detail_rate_type_id = this.form.locum_detail_rate_type.id
      newForm.rate = this.form.rate
      newForm.total_hours = this.form.total_hours
      // ! ask arvi will these update whole job or just the rate and total hours
      this.$axios.$put(`/api/v1/practice/jobs/${this.$route.params.id}`, newForm).then(res => {
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: res.message })
      })
    },
    cancel() {
      let jobId = this.$route.params.id || this.job.id
      this.$axios.$put(`/api/v1/practice/jobs/${jobId}/cancel`, this.form_cancel).then(res => {
        this.$store.commit('session/CANCEL_JOB', jobId)
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'Job cancelled' })
        this.close()
      })
    },
    complete() {
      let jobId = this.$route.params.id || this.job.id
      this.$axios.$put(`/api/v1/practice/jobs/${jobId}/complete`).then(res => {
        this.$store.commit('session/UPDATE_ALLOCATED_JOBS', jobId)
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'Job completed' })
        this.close()
      })
    }
  }
}
</script>
<style scoped>
.document-filename {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

