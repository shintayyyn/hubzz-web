<template>
  <div class="bg-white rounded-lg shadow-lg p-4 md:p-8 mt-4">
    <div class="flex flex-row flex-wrap">
      <div class="flex flex-col w-full md:w-1/2 p-0 md:pr-4">
        <div class="font-bold text-sm sm:text-md">Job number</div>
        <div class="text-xs sm:text-sm mb-4">{{job.job_number}}</div>
        <div class="font-bold text-sm sm:text-md">Job description</div>
        <div class="text-xs sm:text-sm mb-8">{{job.description}}</div>
        <div class="font-bold text-sm sm:text-md">Rate</div>
        <div
          class="text-xs sm:text-sm mb-6"
          v-text="job.rate?`£ ${job.rate} ${job.locum_detail_rate_type.name}`:`(none)`"
        ></div>
        <div class="font-bold text-sm sm:text-md">Total Hours</div>
        <div class="text-xs sm:text-sm mb-4">{{job.total_hours}}</div>
        <div class="font-bold text-sm sm:text-md">Extra information</div>
        <div
          class="text-xs sm:text-sm mb-8"
        >{{job.platform_job.extra_information ? job.platform_job.extra_information : '(none)'}}</div>
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
        <!--  -->
        <div class="font-bold text-sm sm:text-md">Is there another Dr on site?</div>
        <div class="text-xs sm:text-sm mb-8">{{job.platform_job.is_another_doctor ? 'Yes' : 'No'}}</div>
        <div class="font-bold text-sm sm:text-md">Is nurse support available?</div>
        <div class="text-xs sm:text-sm mb-8">{{job.platform_job.is_nurse_available ? 'Yes' : 'No'}}</div>
        <div class="font-bold text-sm sm:text-md">Number of patients to be seen during the session?</div>
        <div class="text-xs sm:text-sm mb-8">{{job.platform_job.number_of_patients}}</div>
        <div class="font-bold text-sm sm:text-md">Duration of eact appointment?</div>
        <div class="text-xs sm:text-sm mb-8">{{job.platform_job.duration_for_each_appointment}}</div>
        <div class="font-bold text-sm sm:text-md">Opportunity for catch up slots?</div>
        <div
          class="text-xs sm:text-sm mb-8"
        >{{job.platform_job.opportunity_for_catch_up_slots ? 'Yes' : 'No'}}</div>
        <div class="font-bold text-sm sm:text-md">Session requirements:</div>
        <div
          class="flex flex-col"
          v-for="(item, index) in session_requirements"
          :key="`${item}-${index}`"
        >
          <div class="text-xs sm:text-sm w-full">{{item}}</div>
        </div>
        <div class="text-xs sm:text-sm mb-8"></div>
        <div class="font-bold text-sm sm:text-md">Session structure information</div>
        <div class="text-xs sm:text-sm mb-8">{{job.platform_job.session_structure_information}}</div>
        <div class="font-bold text-sm sm:text-md">Include Saturday</div>
        <div class="text-xs sm:text-sm mb-8">{{job.include_saturday ? 'Yest' : 'No'}}</div>
        <div class="font-bold text-sm sm:text-md">Include Sunday</div>
        <div class="text-xs sm:text-sm mb-8">{{job.include_sunday ? 'Yest' : 'No'}}</div>
        <div class="font-bold text-sm sm:text-md">Unpaid break</div>
        <div class="text-xs sm:text-sm mb-8">{{job.platform_job.unpaid_breaks_in_minutes}}</div>
        <div class="font-bold text-sm sm:text-md">Update Remarks</div>
        <div
          class="text-xs sm:text-sm mb-6"
          v-text="job.update_remarks?job.update_remarks:`(none)`"
        ></div>
        <!--  -->
      </div>
      <div class="flex flex-col w-full md:w-1/2 p-0 md:pl-4">
        <div class="font-bold text-sm sm:text-md">Duration</div>
        <div class="flex text-xs sm:text-sm mb-6">
          <div class="px-1">
            <p>From</p>
            <p>To</p>
            <p>Shift</p>
          </div>
          <div class="px-1">
            <p>{{$moment(job.date_start, 'YYYY-MM-DD').format('DD-MM-YYYY')}} | {{job.time_start}}</p>
            <p>{{$moment(job.date_end, 'YYYY-MM-DD').format('DD-MM-YYYY')}} | {{job.time_end}}</p>
            <p>{{job.shift.name}}</p>
          </div>
        </div>

        <div class="font-bold text-sm sm:text-md" v-if="job.selection_date">Selection Date</div>
        <div
          v-if="job.selection_date"
          class="text-xs sm:text-sm mb-4"
        >{{$moment(job.selection_date, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]').format('DD-MM-YYYY')}} | {{$moment(job.selection_date, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]').format('HH:mm')}}</div>

        <div
          class="font-bold text-sm sm:text-md"
        >Auto-assigns this job to the first matching applicant</div>
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
            class="rounded-lg bg-yellow-500 p-2 m-1"
            v-for="item in job.platform_job.qualifications"
            :key="item.id"
          >{{item.name}}</div>
        </div>
        <div class="font-bold text-sm sm:text-md">Clinical systems</div>
        <div class="text-xs sm:text-sm mb-8 flex flex-row flex-wrap">
          <div
            class="rounded-lg bg-yellow-500 p-2 m-1"
            v-for="item in job.platform_job.clinical_systems"
            :key="item.id"
          >{{item.name}}</div>
        </div>
        <div class="font-bold text-sm sm:text-md">Spoken languages</div>
        <div class="text-xs sm:text-sm mb-8 flex flex-row flex-wrap">
          <div class="rounded-lg bg-yellow-500 p-2 m-1">English</div>
          <div
            class="rounded-lg bg-yellow-500 p-2 m-1"
            v-for="item in job.platform_job.spoken_languages"
            :key="item.id"
          >{{item.name}}</div>
        </div>
        <div class="font-bold text-sm sm:text-md">Compliance requirements</div>
        <div class="text-xs sm:text-sm mb-8 flex flex-row flex-wrap">
          <div class="mt-1" v-if="job.platform_job.compliance_documents.length === 0">(none)</div>
          <div
            v-else
            class="rounded-lg bg-yellow-500 p-2 m-1"
            v-for="item in job.platform_job.compliance_documents"
            :key="item.id"
          >{{item.name}}</div>
        </div>
        <div class="font-bold text-sm sm:text-md">Required Mandatory Trainings</div>
        <div class="text-xs sm:text-sm mb-8 flex flex-row flex-wrap">
          <div class="mt-1" v-if="job.platform_job.mandatory_trainings.length === 0">(none)</div>
          <div
            v-else
            class="rounded-lg bg-yellow-500 p-2 m-1"
            v-for="item in job.platform_job.mandatory_trainings"
            :key="item.id"
          >{{item.name}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { gmapApi } from "vue2-google-maps";
export default {
  props: ["job"],
  computed: {
    google: gmapApi,
    latLang() {
      return this.job.platform_job.practice.surgery.address.coordinates;
    },
    session_requirements() {
      return this.job.platform_job.session_requirements.split(",");
    }
  }
};
</script>
