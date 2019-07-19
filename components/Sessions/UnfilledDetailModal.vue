<template>
  <div class="p-8 max-w-2xl">
    <div @click="close" class="cursor-pointer">
      <svgicon name="left-arrow" height="32" width="32" />
    </div>
    <div class="flex flex-row justify-start mt-8">
      <div class="leading-loose font-bold text-md sm:text-lg">{{job.platform_job.title}}</div>
      <div class="mx-2 bg-red text-white text-sm sm:text-sm p-2">UNFILLED</div>
    </div>
    <div class="flex flex-row flex-wrap justify-between mt-4">
      <div class="w-full">
        <div
          class="text-xs sm:text-sm"
        >Posted {{$moment(job.platform_job.date_created).format('DD/MM/YYYY')}}</div>
        <div class="rounded-lg shadow-lg p-8 mt-4 w-full">
          <div class="flex flex-row flex-wrap">
            <div class="flex flex-col w-full md:w-1/2 p-0 md:pr-4">
              <div class="font-bold text-sm sm:text-md">Job number</div>
              <div class="text-xs sm:text-sm mb-4">{{job.job_number}}</div>
              <div class="font-bold text-sm sm:text-md">Rate</div>
              <div
                class="text-xs sm:text-sm mb-4"
              >£ {{job.platform_job.rate}} {{job.platform_job.locum_detail_rate_type.name}}</div>
              <div class="font-bold text-sm sm:text-md">Total hours</div>
              <div class="text-xs sm:text-sm mb-4">{{job.platform_job.total_hours}} hours</div>
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
  }
}
</script>
<style scoped>
</style>

