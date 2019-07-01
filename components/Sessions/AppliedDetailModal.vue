<template>
  <section>
    <div class="p-8 max-w-2xl">
      <div @click="close" class="cursor-pointer">
        <svgicon name="left-arrow" height="32" width="32"/>
      </div>
      <div class="flex flex-row justify-start mt-8">
        <div class="leading-loose font-bold text-md sm:text-lg">{{job.platform_job.title}}</div>
        <div class="mx-2 bg-orange-dark text-white text-sm sm:text-sm p-2">APPLIED</div>
      </div>
      <div class="flex flex-col mt-4">
        <div class="flex flex-row flex-wrap justify-start">
          <div class="flex flex-col w-full lg:w-2/3 p-0 lg:pr-4">
            <div
              class="text-xs sm:text-sm"
            >Posted {{$moment(job.platform_job.date_created).format('DD/MM/YYYY')}}</div>
            <div class="rounded-lg shadow-lg p-8 mt-4">
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
                    >
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
                    >
                    <div class="leading-loose mx-2">hours</div>
                  </div>
                  <div class="mb-8">
                    <AppButton :label="'Save changes'" :inStyle="'padding:8px'" @click="save"/>
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
                    <div
                      class="mt-1"
                      v-if="job.platform_job.compliance_documents.length === 0"
                    >(none)</div>
                    <div
                      v-else
                      class="rounded-lg bg-yellow-dark p-2 m-1"
                      v-for="item in job.platform_job.compliance_documents"
                      :key="item.id"
                    >{{item.name}}</div>
                  </div>
                  <div class="font-bold text-sm sm:text-md">Mandatory training</div>
                  <div class="text-xs sm:text-sm mb-8 flex flex-row flex-wrap">
                    <div
                      class="mt-1"
                      v-if="job.platform_job.mandatory_trainings.length === 0"
                    >(none)</div>
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
          <div class="flex flex-col w-full lg:w-1/3 p-0 lg:pl-4 mt-4 lg:m-0">
            <div class="text-xs sm:text-sm font-bold">Candidates</div>
            <div
              class="rounded-lg shadow-lg m-0 my-4 py-3 px-5 cursor-pointer"
              v-for="user in applicants"
              :key="user.id"
              @click="show(user.id)"
            >
              <div class="flex flex-row flex-nowrap justify-between items-center">
                <svgicon name="no-avatar" height="40" width="40"/>
                <div
                  class="text-xs sm:text-sm font-bold leading-loose"
                >{{user.personal_detail.name}}</div>
                <div class="flex">
                  <svgicon name="arrow-right" height="20" width="20"/>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="rounded-lg shadow-lg p-8 mt-4 w-full md:w-3/4">
          <div class="font-bold text-md sm:text-lg">Cancel this job</div>
          <AppSelect
            v-model="form_cancel.cancelled_reason"
            :name="'cancelled_reason'"
            :label="'Please select your reason'"
            :placeholder="'Select..'"
            :items="reasons"
          />
          <AppButton :label="'Cancel job'" @click="cancel"/>
        </div>
      </div>
    </div>
    <div class="applied-locum-shield" v-if="modal"></div>
    <transition name="slide" mode="out-in">
      <div class="applied-locum-modal shadow-lg" v-if="modal">
        <AppliedLocumDetailModal @close="modal = false" :user="user"/>
      </div>
    </transition>
  </section>
</template>
<script>
import { gmapApi } from 'vue2-google-maps'
import AppSelect from '@/components/Base/AppSelect'
import AppButton from '@/components/Base/AppButton'
import AppliedLocumDetailModal from '@/components/Sessions/AppliedLocumDetailModal'
export default {
  props: ['job'],
  components: {
    AppSelect,
    AppButton,
    AppliedLocumDetailModal,
  },
  data() {
    return {
      applicants: [],
      rate_types: [],
      form: {
        rate: '',
        locum_detail_rate_type: null,
        total_hours: ''
      },
      form_cancel: {
        cancelled_reason: ''
      },
      modal: false,
      user: null
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
    this.getJobApplicants()
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
    getJobApplicants() {
      this.$axios.$get(`/api/v1/practice/jobs/${this.$route.params.id}/applicants`).then(res => {
        console.log(res.data.users)
        this.applicants = res.data.users
      })
    },
    show(id) {
      // ! negate scroll when showing applicants
      this.$axios.$get(`/api/v1/practice/locums/${id}`).then(res => {
        console.log(res)
        this.user = res.data.user
        this.modal = true
      })
    },
    close() {
      if (this.$route.fullPath === '/dashboard') {
        this.$emit('close')
      } else {
        this.$router.push('/sessions?session_status=applied')
      }
    },
    save() {
      // ! ask arvi will these update whole job or just the rate / rate type / total hours
      // this.$axios.$put(`/api/v1/practice/jobs/${this.$route.params.id}`).then(res => {
      //   console.log(res)
      // })
    },
    cancel() {
      this.$axios.$put(`/api/v1/practice/jobs/${this.$route.params.id}/cancel`, this.form_cancel).then(res => {
        this.close()
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'Job cancelled' })
      })
    }
  }
}
</script>
<style scoped>
.applied-locum-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 511;
}
.applied-locum-modal {
  position: fixed;
  top: 0;
  right: 0;
  margin-right: 0%;
  width: 100%;
  height: 100%;
  overflow: auto;
  border-left: solid 2px #edf2f7;
  transition: all 0.3s ease-in-out;
  background-color: white;
  z-index: 512;
}
@media screen and (min-width: 1200px) {
  .applied-locum-modal {
    width: 70%;
  }
}
</style>

