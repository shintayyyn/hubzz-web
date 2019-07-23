<template>
  <div class="p-8 max-w-xl">
    <div @click="close" class="cursor-pointer">
      <svgicon name="left-arrow" height="32" width="32" />
    </div>
    <div class="flex flex-row justify-start mt-8">
      <div class="leading-loose font-bold text-md sm:text-lg">{{job.platform_job.title}}</div>
      <div class="mx-2 bg-yellow-dark text-sm sm:text-sm p-2">LIVE</div>
    </div>
    <div class="flex flex-row flex-wrap justify-between mt-4">
      <div class="w-full">
        <div
          class="text-xs sm:text-sm"
        >Posted {{$moment(job.platform_job.date_created).format('DD/MM/YYYY')}}</div>
        <div class="rounded-lg shadow-lg p-8 mt-4 w-full md:w-3/4">
          <div class="flex flex-row flex-wrap">
            <div class="flex flex-col w-full md:w-1/2 p-0 md:pr-4">
              <div class="font-bold text-sm sm:text-md">Job number</div>
              <div class="text-xs sm:text-sm mb-4">{{job.job_number}}</div>
              <div class="font-bold text-sm sm:text-md">Rate</div>
              <div class="text-xs sm:text-sm mt-2 mb-4 flex flex-row flex-wrap">
                <input
                  v-model="form.rate"
                  type="text"
                  class="border-b-2 focus:border-yellow focus:outline-none py-2 font-bold text-xs w-1/4 text-right"
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
              <div class="text-xs sm:text-sm mb-8">{{job.description}}</div>
              <div class="font-bold text-sm sm:text-md">Extra information</div>
              <div class="text-xs sm:text-sm mb-8">{{job.extra_information}}</div>
              <div class="font-bold text-sm sm:text-md">Report to</div>
              <div class="text-xs sm:text-sm mb-8">{{job.report_to}}</div>
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

        <div class="font-bold text-md sm:text-lg">Cancel this job</div>
        <AppSelect
          v-model="form_cancel.cancelled_reason"
          :name="'cancelled_reason'"
          :label="'Please select your reason'"
          :placeholder="'Select..'"
          :items="reasons"
        />
        <AppButton :label="'Cancel job'" @click="cancel" />
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
        locum_detail_rate_type: {
          id: '',
          name: ''
        },
        total_hours: ''
      },
      form_cancel: {
        cancelled_reason: ''
      },

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
  },
  methods: {
    close() {
      if (this.$route.fullPath === '/dashboard') {
        this.$emit('close')
      } else {
        const query = {
          ...this.$route.query
        }
        this.$router.push({ path: `/sessions`, query })
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
        this.$store.commit('session/UPDATE_LIVE_JOBS', jobId)
        this.$store.commit('calendar/UPDATE_PRACTICE_AVAILABLE_JOBS_REMINDER', jobId)
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'Job cancelled' })
        this.close()
      })
    }
  }
}
</script>
<style scoped>
.loader {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  opacity: 0.5;
}
.loading {
  background-color: lightgray;
}
</style>

