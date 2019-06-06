<template>
  <div class="p-8 max-w-2xl">
    <div @click="$emit('close')" class="cursor-pointer">
      <svgicon name="left-arrow" height="32" width="32"/>
    </div>
    <div class="flex flex-row justify-start mt-8">
      <div class="mx-2 leading-loose font-bold text-md sm:text-lg">{{form.title}}</div>
      <div class="mx-2 bg-yellow-dark text-sm sm:text-sm p-2">UNFILLED</div>
    </div>
    <div class="flex flex-row flex-wrap justify-start mt-4">
      <div class="flex flex-col w-full">
        <div class="text-xs sm:text-sm">Posted {{$moment(created_at).format('DD/MM/YYYY')}}</div>
        <div class="rounded-lg shadow-lg p-8 mt-4">
          <div class="flex flex-row flex-wrap">
            <div class="flex flex-col w-full md:w-1/2 p-0 md:pr-4">
              <div class="font-bold text-sm sm:text-md">Job number</div>
              <div class="text-xs sm:text-sm mb-4">{{form.job_number}}</div>
              <div class="font-bold text-sm sm:text-md">Rate</div>
              <div
                class="text-xs sm:text-sm mb-4"
              >£ {{form.rate}} {{form.locum_detail_rate_type.name}}</div>
              <div class="font-bold text-sm sm:text-md">Total hours</div>
              <div class="text-xs sm:text-sm mb-4">{{form.total_hours}}</div>
              <div class="font-bold text-sm sm:text-md">Job description</div>
              <div class="text-xs sm:text-sm mb-8">{{job_description}}</div>
              <div class="font-bold text-sm sm:text-md">Extra information</div>
              <div class="text-xs sm:text-sm mb-8">{{extra_information}}</div>
              <div class="font-bold text-sm sm:text-md">Report to</div>
              <div class="text-xs sm:text-sm mb-8">{{report_to}}</div>
              <div class="font-bold text-sm sm:text-md">Telephone number</div>
              <div class="text-xs sm:text-sm mb-8">{{phone_number}}</div>
              <div class="font-bold text-sm sm:text-md">Email address</div>
              <div class="text-xs sm:text-sm mb-8">{{email}}</div>
            </div>
            <div class="flex flex-col w-full md:w-1/2 p-0 md:pl-4">
              <div class="font-bold text-sm sm:text-md">Duration</div>
              <div class="text-xs sm:text-sm">From {{date_start}}</div>
              <div class="text-xs sm:text-sm my-2">To {{date_end}}</div>
              <div class="text-xs sm:text-sm mb-8">Shift {{shift.name}}</div>
              <div
                class="font-bold text-sm sm:text-md"
              >Auto-assigns this job to the first, matching Favourite applicant</div>
              <div
                class="text-xs sm:text-sm mb-8"
                v-if="auto_assign_at"
              >{{$moment(auto_assign_at).format('YYYY-MM-DD')}}</div>
              <div class="text-xs sm:text-sm mb-8" v-else>No</div>
              <div class="text-xs sm:text-sm mb-4">
                This job is
                <span
                  class="font-bold text-sm sm:text-md"
                >{{ir35 ? 'INSIDE' : 'OUTSIDE'}}</span> of scope of
                <span class="font-bold text-sm sm:text-md">IR35</span>
              </div>
              <div class="font-bold text-sm sm:text-md">Role</div>
              <div class="text-xs sm:text-sm mb-8">{{profession.name}}</div>
              <div class="font-bold text-sm sm:text-md">Specialty</div>
              <div class="text-xs sm:text-sm mb-8 flex flex-row flex-wrap">
                <div
                  class="rounded-lg bg-yellow-dark p-2 m-1"
                  v-for="item in qualifications"
                  :key="item.id"
                >{{item.name}}</div>
              </div>
              <div class="font-bold text-sm sm:text-md">Clinical systems</div>
              <div class="text-xs sm:text-sm mb-8 flex flex-row flex-wrap">
                <div
                  class="rounded-lg bg-yellow-dark p-2 m-1"
                  v-for="item in clinical_systems"
                  :key="item.id"
                >{{item.name}}</div>
              </div>
              <div class="font-bold text-sm sm:text-md">Spoken languages</div>
              <div class="text-xs sm:text-sm mb-8 flex flex-row flex-wrap">
                <div class="rounded-lg bg-yellow-dark p-2 m-1">English</div>
                <div
                  class="rounded-lg bg-yellow-dark p-2 m-1"
                  v-for="item in spoken_languages"
                  :key="item.id"
                >{{item.name}}</div>
              </div>
              <div class="font-bold text-sm sm:text-md">Compliance requirements</div>
              <div class="text-xs sm:text-sm mb-8 flex flex-row flex-wrap">
                <div class="mt-1" v-if="compliance_documents.length === 0">(none)</div>
                <div
                  v-else
                  class="rounded-lg bg-yellow-dark p-2 m-1"
                  v-for="item in compliance_documents"
                  :key="item.id"
                >{{item.name}}</div>
              </div>
              <div class="font-bold text-sm sm:text-md">Mandatory training</div>
              <div class="text-xs sm:text-sm mb-8 flex flex-row flex-wrap">
                <div class="mt-1" v-if="mandatory_trainings.length === 0">(none)</div>
                <div
                  v-else
                  class="rounded-lg bg-yellow-dark p-2 m-1"
                  v-for="item in mandatory_trainings"
                  :key="item.id"
                >{{item.name}}</div>
              </div>
            </div>
          </div>
          <div class="flex flex-col">
            <div class="font-bold text-xs sm:text-sm">Practice</div>
            <div class="font-bold text-sm sm:text-md">{{practice.surgery.name}}</div>
            <div
              class="text-sm sm:text-md"
            >{{practice.surgery.address.line_1}} {{practice.surgery.address.line_2}} {{practice.surgery.address.line_3}} {{practice.surgery.address.post_code}}</div>
            <div class="mt-4">
              <!-- google map -->
              <GmapMap
                :center="{lat:latLang.x, lng:latLang.y}"
                :zoom="15"
                map-type-id="terrain"
                style="width: 100%; height:300px"
              >
                <GmapMarker :position="google && new google.maps.LatLng(latLang.x, latLang.y)"/>
              </GmapMap>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { gmapApi } from 'vue2-google-maps'
export default {
  data() {
    return {
      rate_types: [],
      form: {
        title: '',
        job_number: '',
        rate: '',
        locum_detail_rate_type: {
          id: '',
          name: ''
        },
        total_hours: '',
      },
      appointed_at: null,
      cancelled_at: null,
      cancelled_reason: null,
      created_at: null,
      job_description: '',
      extra_information: '',
      report_to: '',
      phone_number: '',
      email: '',
      date_start: '',
      date_end: '',
      time_start: '',
      time_end: '',
      shift: {
        id: '',
        name: ''
      },
      auto_assign_at: null,
      ir35: null,
      profession: {
        id: '',
        name: ''
      },
      qualifications: [],
      clinical_systems: [],
      spoken_languages: [],
      compliance_documents: [],
      mandatory_trainings: [],
      practice: {
        id: '',
        phone_number: '',
        surgery: {
          address: {
            coordinates: {}
          },
          code: '',
          id: '',
          name: ''
        }
      },
      // assigned locum
      user: {
        personal_detail: {},
        locum_detail: {
          gmc_or_nmc_number: {},
          mpl_or_npl_number: {},
          profession: {
            profession_category: {}
          },
          qualifications: [],
          clinical_systems: [],
          spoken_languages: [],
          compliance_documents: [],
          rates: [],
          referees: []
        }
      },
    }
  },
  watch: {},
  computed: {
    google: gmapApi,
    latLang() {
      return this.practice.surgery.address.coordinates
    }
  },
  created() {
    this.getJob()
    // get locum detail rate type
    this.$axios.$get(`/api/v1/locum-detail-rate-types`).then(res => {
      this.rate_types = []
      res.data.locum_detail_rate_types.forEach(item => {
        this.rate_types.push({ label: item.name, value: item.id })
      })
    })
  },
  methods: {
    getJob() {
      // get specific job, get the id from store
      this.$axios.$get(`/api/v1/practice/jobs/${this.$store.state.session.job_id}`).then(res => {
        this.practice.surgery.address.coordinates = res.data.job.platform_job.practice.surgery.address.coordinates
        this.appointed_at = res.data.job.platform_job.appointed_at
        this.cancelled_at = res.data.job.platform_job.cancelled_at
        this.cancelled_reason = res.data.job.platform_job.cancelled_reason
        this.created_at = res.data.job.created_at
        this.form.title = res.data.job.platform_job.title
        this.form.job_number = res.data.job.job_number
        this.form.rate = res.data.job.platform_job.rate
        this.form.locum_detail_rate_type = res.data.job.platform_job.locum_detail_rate_type
        this.form.total_hours = res.data.job.platform_job.total_hours
        this.job_description = res.data.job.platform_job.job_description
        this.extra_information = res.data.job.platform_job.extra_information
        this.report_to = res.data.job.platform_job.report_to
        this.phone_number = res.data.job.platform_job.practice.phone_number
        this.email = res.data.job.platform_job.email
        this.date_start = res.data.job.platform_job.date_start
        this.date_end = res.data.job.platform_job.date_end
        this.time_start = res.data.job.platform_job.time_start
        this.time_end = res.data.job.platform_job.time_end
        this.shift = res.data.job.platform_job.shift
        this.auto_assign_at = res.data.job.platform_job.auto_assign_at
        this.ir35 = res.data.job.platform_job.ir35
        this.profession = res.data.job.platform_job.profession
        this.qualifications = res.data.job.platform_job.qualifications
        this.clinical_systems = res.data.job.platform_job.clinical_systems
        this.spoken_languages = res.data.job.platform_job.spoken_languages
        this.compliance_documents = res.data.job.platform_job.compliance_documents
        this.mandatory_trainings = res.data.job.platform_job.mandatory_trainings
        this.practice = res.data.job.platform_job.practice
      })
    },
  }
}
</script>
<style scoped>
</style>

