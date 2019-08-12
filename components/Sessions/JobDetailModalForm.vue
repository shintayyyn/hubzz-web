<template>
  <div class="flex flex-col w-full lg:w-2/3 p-0 lg:pr-4">
    <div class="rounded-lg shadow-lg p-8 mt-4">
      <div class="flex flex-row flex-wrap">
        <div class="flex flex-col w-full md:w-1/2 p-0 md:pr-4">
          <div class="font-bold text-sm sm:text-md">Job number</div>
          <div class="text-xs sm:text-sm mb-4">{{job.job_number}}</div>
          <div class="font-bold text-sm sm:text-md">Job description</div>
          <div class="text-xs sm:text-sm mb-8">{{job.description}}</div>
          <div class="font-bold text-sm sm:text-md">Extra information</div>
          <div class="text-xs sm:text-sm mb-8">{{job.platform_job.extra_information}}</div>
          <div class="font-bold text-sm sm:text-md">Report to</div>
          <div class="text-xs sm:text-sm mb-8">{{job.platform_job.report_to}}</div>
          <div class="font-bold text-sm sm:text-md">Telephone number</div>
          <div class="text-xs sm:text-sm mb-8">{{job.platform_job.practice.phone_number}}</div>
          <div class="font-bold text-sm sm:text-md">Email address</div>
          <div class="text-xs sm:text-sm mb-8">{{job.platform_job.email}}</div>
          <template v-if="job.status === 'Cancelled'">
            <div class="font-bold text-sm sm:text-md">Cancelled</div>
            <div class="text-xs sm:text-sm mb-8">{{job.platform_job.cancelled_at | localDate}}</div>
            <div class="font-bold text-sm sm:text-md">Reason for cancellation</div>
            <div class="text-xs sm:text-sm mb-8">{{job.platform_job.cancelled_reason}}</div>
          </template>
          <template v-if="job.status === 'Declined'">
            <div class="font-bold text-sm sm:text-md">Declined</div>
            <div class="text-xs sm:text-sm mb-8">{{job.platform_job.declined_at | localDate}}</div>
            <div class="font-bold text-sm sm:text-md">Appointed Locum</div>
            <div
              class="text-xs sm:text-sm mb-8"
            >{{job.platform_job.appointed_to_locum.user.personal_detail.name}}</div>
          </template>
        </div>
        <div class="flex flex-col w-full md:w-1/2 p-0 md:pl-4">
          <div class="font-bold text-sm sm:text-md">Duration</div>
          <div class="text-xs sm:text-sm">From {{job.date_start}}</div>
          <div class="text-xs sm:text-sm my-2">To {{job.date_end}}</div>
          <div class="text-xs sm:text-sm mb-4">Shift {{job.shift.name}}</div>
          <div class="font-bold text-sm sm:text-md">Total Hours</div>
          <div class="text-xs sm:text-sm mb-4">{{job.total_hours}}</div>

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
              class="rounded-lg bg-yellow-400 p-2 m-1"
              v-for="item in job.platform_job.qualifications"
              :key="item.id"
            >{{item.name}}</div>
          </div>
          <div class="font-bold text-sm sm:text-md">Clinical systems</div>
          <div class="text-xs sm:text-sm mb-8 flex flex-row flex-wrap">
            <div
              class="rounded-lg bg-yellow-400 p-2 m-1"
              v-for="item in job.platform_job.clinical_systems"
              :key="item.id"
            >{{item.name}}</div>
          </div>
          <div class="font-bold text-sm sm:text-md">Spoken languages</div>
          <div class="text-xs sm:text-sm mb-8 flex flex-row flex-wrap">
            <div class="rounded-lg bg-yellow-400 p-2 m-1">English</div>
            <div
              class="rounded-lg bg-yellow-400 p-2 m-1"
              v-for="item in job.platform_job.spoken_languages"
              :key="item.id"
            >{{item.name}}</div>
          </div>
          <div class="font-bold text-sm sm:text-md">Compliance requirements</div>
          <div class="text-xs sm:text-sm mb-8 flex flex-row flex-wrap">
            <div class="mt-1" v-if="job.platform_job.compliance_documents.length === 0">(none)</div>
            <div
              v-else
              class="rounded-lg bg-yellow-400 p-2 m-1"
              v-for="item in job.platform_job.compliance_documents"
              :key="item.id"
            >{{item.name}}</div>
          </div>
          <div class="font-bold text-sm sm:text-md">Required Mandatory Trainings</div>
          <div class="text-xs sm:text-sm mb-8 flex flex-row flex-wrap">
            <div class="mt-1" v-if="job.platform_job.mandatory_trainings.length === 0">(none)</div>
            <div
              v-else
              class="rounded-lg bg-yellow-400 p-2 m-1"
              v-for="item in job.platform_job.mandatory_trainings"
              :key="item.id"
            >{{item.name}}</div>
          </div>
        </div>
      </div>
      <div class="flex flex-col">
        <div class="font-bold text-xs sm:text-sm">Practice</div>
        <div
          class="font-bold text-sm sm:text-md"
        >{{job.platform_job ? job.platform_job.practice.surgery.name :null}}</div>
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
</template>
<script>
import { gmapApi } from 'vue2-google-maps'
export default {
  props: ['job'],
  created() {
    console.log(this.job)
  },
  computed: {
    google: gmapApi,
    latLang() {
      return this.job.platform_job.practice.surgery.address.coordinates
    },
  },
}
</script>
