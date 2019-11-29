<template>
  <div class="relative bg-white rounded-lg shadow-lg p-4 md:p-8" :class="onChange && 'opacity-50'">
    <div class="flex flex-row flex-wrap justify-between">
      <div class="flex flex-col w-full md:w-1/2 p-0 md:pr-4">
        <div class="font-bold text-sm sm:text-md">Job part number</div>
        <div class="text-xs sm:text-lg font-bold mb-6" v-text="job_part.job_part_number"></div>
        <div class="font-bold text-sm sm:text-md">Rate</div>
        <div
          class="text-xs sm:text-sm mb-6"
          v-text="job_part.job.rate?`£ ${job_part.job.rate} ${job_part.job.locum_detail_rate_type.name}`:`(none)`"
        ></div>
        <div class="font-bold text-sm sm:text-md">Total hours</div>
        <div
          class="text-xs sm:text-sm mb-4"
          v-text="job_part.job.total_hours?job_part.job.total_hours:`(none)`"
        ></div>
        <div class="font-bold text-sm sm:text-md">Job description</div>
        <div
          class="text-xs sm:text-sm mb-6"
          v-text="job_part.job.description?job_part.job.description:`(none)`"
        ></div>
        <div class="font-bold text-sm sm:text-md">Extra information</div>
        <div
          class="text-xs sm:text-sm mb-6"
          v-text="job_part.job.platform_job.extra_information?job_part.job.platform_job.extra_information:`(none)`"
        ></div>
        <div class="font-bold text-sm sm:text-md">Report to</div>
        <div
          class="text-xs sm:text-sm mb-6"
          v-text="job_part.job.platform_job.report_to?job_part.job.platform_job.report_to:`(none)`"
        ></div>
        <div class="font-bold text-sm sm:text-md">Telephone number</div>
        <div
          class="text-xs sm:text-sm mb-6"
          v-text="job_part.job.platform_job.practice.phone_number?job_part.job.platform_job.practice.phone_number:`(none)`"
        ></div>
        <div class="font-bold text-sm sm:text-md">Email address</div>
        <div
          class="text-xs sm:text-sm mb-6"
          v-text="job_part.job.platform_job.email?job_part.job.platform_job.email:`(none)`"
        ></div>

        <template v-if="job_part.status === 'Terminated'">
          <div class="font-bold text-sm sm:text-md">Terminated</div>
          <div
            class="text-xs sm:text-sm mb-8"
          >{{job_part.job.platform_job.cancelled_at | localDate}}</div>
          <div class="font-bold text-sm sm:text-md">Reason for termination</div>
          <div class="text-xs sm:text-sm mb-8">{{job_part.job.platform_job.cancelled_reason}}</div>
        </template>

        <template v-if="job_part.status === 'Cancelled'">
          <div class="font-bold text-sm sm:text-md">Cancelled At</div>
          <div
            class="text-xs sm:text-sm mb-6"
          >{{job_part.job.platform_job.cancelled_at | localDate}}</div>
          <div class="font-bold text-sm sm:text-md">Cancelled By</div>
          <div
            class="text-xs sm:text-sm mb-6"
            v-text="job_part.job.platform_job.cancelled_by.personal_detail.name"
          ></div>
          <div class="font-bold text-sm sm:text-md">Cancelled Reason</div>
          <div class="text-xs sm:text-sm mb-6" v-text="job_part.job.platform_job.cancelled_reason"></div>
        </template>
      </div>
      <div class="flex flex-col w-full md:w-1/2 p-0 md:pl-4">
        <div class="font-bold text-sm sm:text-md">Duration</div>
        <div class="text-xs sm:text-sm">From {{job_part.date_start}}</div>
        <div class="text-xs sm:text-sm my-2">To {{job_part.date_end}}</div>
        <div class="text-xs sm:text-sm mb-8">Shift {{job_part.job.shift.name}}</div>
        <div
          class="font-bold text-sm sm:text-md"
        >Auto-assigns this job to the first, matching Favourite applicant</div>
        <div
          class="text-xs sm:text-sm mb-8"
          v-if="job_part.job.platform_job.auto_assign_at"
        >{{$moment(job_part.job.platform_job.auto_assign_at).format('YYYY-MM-DD')}}</div>
        <div class="text-xs sm:text-sm mb-8" v-else>No</div>
        <div class="text-xs sm:text-sm mb-4">
          This job is
          <span
            class="font-bold text-sm sm:text-md"
          >{{job_part.job.platform_job.ir35 ? 'INSIDE' : 'OUTSIDE'}}</span> of scope of
          <span class="font-bold text-sm sm:text-md">IR35</span>
        </div>
        <template v-if="job_part.job.platform_job.profession">
          <div class="font-bold text-sm sm:text-md">Role</div>
          <div class="text-xs sm:text-sm mb-8">{{job_part.job.platform_job.profession.name}}</div>
        </template>
        <template v-if="job_part.job.platform_job.qualifications">
          <div class="font-bold text-sm sm:text-md">Specialty</div>
          <div class="text-xs sm:text-sm mb-8 flex flex-row flex-wrap">
            <div
              class="rounded-lg bg-yellow-500 p-2 m-1"
              v-for="item in job_part.job.platform_job.qualifications"
              :key="item.id"
            >{{item.name}}</div>
          </div>
        </template>
        <template v-if="job_part.job.platform_job.clinical_systems">
          <div class="font-bold text-sm sm:text-md">Clinical systems</div>
          <div class="text-xs sm:text-sm mb-8 flex flex-row flex-wrap">
            <div
              class="rounded-lg bg-yellow-500 p-2 m-1"
              v-for="item in job_part.job.platform_job.clinical_systems"
              :key="item.id"
            >{{item.name}}</div>
          </div>
        </template>
        <template v-if="job_part.job.platform_job.spoken_languages">
          <div class="font-bold text-sm sm:text-md">Spoken languages</div>
          <div class="text-xs sm:text-sm mb-8 flex flex-row flex-wrap">
            <div class="rounded-lg bg-yellow-500 p-2 m-1">English</div>
            <div
              class="rounded-lg bg-yellow-500 p-2 m-1"
              v-for="item in job_part.job.platform_job.spoken_languages"
              :key="item.id"
            >{{item.name}}</div>
          </div>
        </template>
        <template v-if="job_part.job.platform_job.compliance_documents">
          <div class="font-bold text-sm sm:text-md">Compliance requirements</div>
          <div class="text-xs sm:text-sm mb-8 flex flex-row flex-wrap">
            <div
              class="mt-1"
              v-if="job_part.job.platform_job.compliance_documents.length === 0"
            >(none)</div>
            <div
              v-else
              class="rounded-lg bg-yellow-500 p-2 m-1"
              v-for="item in job_part.job.platform_job.compliance_documents"
              :key="item.id"
            >{{item.name}}</div>
          </div>
        </template>
        <template v-if="job_part.job.platform_job.mandatory_trainings">
          <div class="font-bold text-sm sm:text-md">Mandatory training</div>
          <div class="text-xs sm:text-sm mb-8 flex flex-row flex-wrap">
            <div
              class="mt-1"
              v-if="job_part.job.platform_job.mandatory_trainings.length === 0"
            >(none)</div>
            <div
              v-else
              class="rounded-lg bg-yellow-500 p-2 m-1"
              v-for="item in job_part.job.platform_job.mandatory_trainings"
              :key="item.id"
            >{{item.name}}</div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import AppLoading from "@/components/Base/AppLoading";
export default {
  props: ["job_part"],
  data() {
    return {
      onChange: false
    };
  },
  watch: {
    job_part(value) {
      setTimeout(() => {
        this.onChange = false;
      }, 800);
      this.onChange = true;
    }
  }
};
</script>
<style>
.wrapper {
  transition: all 0.4s ease;
}
</style>