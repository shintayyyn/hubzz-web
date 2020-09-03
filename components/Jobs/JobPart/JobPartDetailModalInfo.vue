<template>
  <div class="bg-white rounded-lg shadow-lg p-4 md:p-8 mt-4">
    <AppLoading :loading="loadingJobPart" spinner />

    <div class="relative flex flex-row flex-wrap justify-between">
      <div class="w-full">
        <div class="font-bold text-sm sm:text-md">
          Job part number
        </div>

        <div class="text-xs sm:text-sm mb-8">
          {{ job_part.job_part_number }}
        </div>

        <div class="mb-8">
          <div class="font-bold text-sm sm:text-md">
            Duration
          </div>

          <p v-if="job_part.dates.length > 1" class="px-1">
            {{ $moment(job_part.date_start, 'YYYY-MM-DD').format('DD/MM/YYYY') }} - {{ $moment(job_part.date_end, 'YYYY-MM-DD').format('DD/MM/YYYY') }}
          </p>

          <p class="text-xs sm:text-sm">
            Days: {{ job_part.dates.length }}
          </p>

          <p class="font-bold text-sm sm:text-md">
            Schedule
          </p>

          <div class="text-xs sm:text-sm overflow-y-auto" style="max-height:205px;">
            <div style="position:sticky;top:0" class="flex">
              <p
                class="bg-gray-400 p-1 font-bold text-xs"
                :style="job_part && job_part.locum_invoiceable ? 'min-width:100px;max-width:100px' : 'min-width:190px;max-width:190px'"
              >
                DATE
              </p>

              <p
                v-if="job_part.status === 'Completed'"
                class="text-center bg-gray-400 p-1 font-bold text-xs"
                style="min-width:100px;max-width:100px"
              >
                FINAL TIME
              </p>

              <p
                class="text-center bg-gray-400 p-1 font-bold text-xs"
                :style="job_part && job_part.locum_invoiceable ? 'min-width:100px;max-width:100px' : 'min-width:180px;max-width:180px'"
              >
                SHIFT
              </p>

              <p
                class="text-center bg-gray-400 p-1 font-bold text-xs"
                :style="job_part && job_part.locum_invoiceable ? 'min-width:100px;max-width:100px' : 'min-width:180px;max-width:180px'"
              >
                RATE
              </p>

              <template v-if="job_part && job_part.locum_invoiceable">
                <p
                  class="text-center bg-gray-400 p-1 font-bold text-xs"
                  style="min-width:100px;max-width:100px"
                >
                  REMARKS
                </p>

                <p
                  class="text-center bg-gray-400 p-1 font-bold text-xs"
                  style="min-width:100px;max-width:100px"
                >
                  REASON
                </p>
              </template>
            </div>

            <div v-for="(sched, index) in job_part.schedules" :key="index" class="flex pb-2">
              <p
                :style="job_part && job_part.locum_invoiceable ? 'min-width:100px;max-width:100px' : 'min-width:190px;max-width:190px'"
              >
                {{ $moment(sched.date, 'YYYY-MM-DD').format('DD/MM/YYYY') }} | {{ sched.time_start }}-{{ sched.time_end }}
              </p>

              <p
                v-if="job_part.status === 'Completed'"
                class="text-center"
                style="min-width:100px;max-width:100px"
              >
                {{ sched.final_time_start }} - {{ sched.final_time_end }}
              </p>

              <p
                class="text-center"
                :style="job_part && job_part.locum_invoiceable ? 'min-width:100px;max-width:100px' : 'min-width:180px;max-width:180px'"
              >
                {{ sched.shift.name }}
              </p>

              <p
                class="text-center"
                :style="job_part && job_part.locum_invoiceable ? 'min-width:100px;max-width:100px' : 'min-width:180px;max-width:180px'"
              >
                £{{ sched.rate | currency }} {{ sched.locum_detail_rate_type.name !== 'Hourly' ? 'per' : '' }} {{ sched.locum_detail_rate_type.name }}
              </p>

              <template v-if="job_part && job_part.locum_invoiceable">
                <p
                  class="text-center"
                  style="min-width:100px;max-width:100px"
                >
                  {{ `${isAbsent(sched) ? 'Absent' : isLate(sched) ? 'Late' : 'N/A'}` }}
                </p>
                <p
                  class="text-center"
                  style="min-width:100px;max-width:100px"
                >
                  {{ `${isAbsent(sched) && sched.absent_reason ? sched.absent_reason : isLate(sched) && sched.late_hours_reason ? sched.late_hours_reason : 'N/A'}` }}
                </p>
              </template>
            </div>
          </div>
          <!-- <div class="hidden lg:flex font-bold text-xs">
            <p class="w-1/3">DATE</p>
            <p class="w-1/3 text-center">SHIFT</p>
            <p class="w-1/3 text-center">RATE</p>
          </div>
          <div class="text-xs sm:text-sm overflow-y-auto" style="max-height: 205px;">
            <div v-for="(sched, index) in job_part.schedules" :key="index" class="lg:flex pb-2">
              <p
                class="lg:w-1/3"
              >{{ $moment(sched.date, 'YYYY-MM-DD').format('DD/MM/YYYY') }} | {{ sched.time_start }}-{{ sched.time_end }}</p>
              <p class="lg:w-1/3 lg:text-center">{{ sched.shift.name }}</p>
              <p
                class="lg:w-1/3 lg:text-center"
              >£{{ sched.rate }} {{ sched.locum_detail_rate_type.name }}</p>
            </div>
          </div>-->
        </div>
      </div>

      <div class="flex flex-col w-full md:w-1/2 p-0 md:pr-4">
        <template v-if="job_part.locum_status === 'Cancelled' && job_part.terminated">
          <div class="font-bold text-sm sm:text-md">
            Terminated At
          </div>

          <div class="text-xs sm:text-sm mb-8">
            {{ job_part.cancelled_at_in_gb_formatted }}
          </div>

          <div class="font-bold text-sm sm:text-md">
            Reason for termination
          </div>

          <div class="text-xs sm:text-sm mb-8">
            {{ job_part.job.platform_job.cancelled_reason }}
          </div>
        </template>

        <template v-if="job_part.locum_status === 'Cancelled' && !job_part.terminated">
          <div class="font-bold text-sm sm:text-md">
            Cancelled At
          </div>

          <div class="text-xs sm:text-sm mb-8">
            {{ job_part.cancelled_at_in_gb_formatted }}
          </div>

          <div class="font-bold text-sm sm:text-md">
            Reason for cancellation
          </div>

          <div class="text-xs sm:text-sm mb-8">
            {{ job_part.job.platform_job.cancelled_reason }}
          </div>
        </template>

        <div class="font-bold text-sm sm:text-md">
          Job description
        </div>

        <div class="text-xs sm:text-sm mb-8 break-words">
          {{ job_part.job && job_part.job.description ? job_part.job.description : '(none)' }}
        </div>
        <!-- <div class="font-bold text-sm sm:text-md">Rate</div>
				<div
					class="text-xs sm:text-sm mb-8"
        >{{ `£ ${job_part.job.rate} ${job_part.job.locum_detail_rate_type.name}` }}</div>-->
        <div class="font-bold text-sm sm:text-md">
          Job Part Gross Rate
        </div>

        <div class="text-xs sm:text-sm mb-8">
          £ {{ job_part ? job_part.job_part_gross_rate_formatted : null }}
        </div>

        <div class="font-bold text-sm sm:text-md">
          Job Gross Rate
        </div>

        <div class="text-xs sm:text-sm mb-8">
          £ {{ job ? job.job_gross_rate_formatted : null }}
        </div>

        <div class="font-bold text-sm sm:text-md">
          Job Part Total Original Hours
        </div>

        <div class="text-xs sm:text-sm mb-8">
          {{ job_part.schedules.map(schedule => schedule.original_hours_in_minutes).reduce((acc, cur) => acc + cur) | hoursMinutes }}
        </div>

        <template v-if="job_part && job_part.locum_invoiceable">
          <div class="font-bold text-sm sm:text-md">
            Job Part Total Final Hours
          </div>

          <div class="text-xs sm:text-sm mb-8">
            {{ job_part.schedules.map(schedule => schedule.final_hours_in_minutes).reduce((acc, cur) => acc + cur) | hoursMinutes }}
          </div>
        </template>

        <div class="font-bold text-sm sm:text-md">
          Job Total Original Hours
        </div>

        <div class="text-xs sm:text-sm mb-8">
          {{ job_part.job.schedules.map(schedule => schedule.original_hours_in_minutes).reduce((acc, cur) => acc + cur) | hoursMinutes }}
        </div>

        <template v-if="job_part && job_part.locum_invoiceable">
          <div class="font-bold text-sm sm:text-md">
            Job Total Final Hours
          </div>

          <div class="text-xs sm:text-sm mb-8">
            {{ job_part.job.schedules.map(schedule => schedule.final_hours_in_minutes).reduce((acc, cur) => acc + cur) | hoursMinutes }}
          </div>
        </template>

        <!-- <div class="text-xs sm:text-sm mb-8">{{ job_part.job.total_hours | hoursMinutes }}</div> -->
        <div class="font-bold text-sm sm:text-md">
          Extra information
        </div>

        <div
          class="text-xs sm:text-sm mb-8 break-words"
          v-text="job_part.job.platform_job.extra_information?job_part.job.platform_job.extra_information:`(none)`"
        />

        <div class="font-bold text-sm sm:text-md">
          Report to
        </div>

        <div class="text-xs sm:text-sm mb-8">
          {{ job_part.job.platform_job.report_to }}
        </div>

        <div class="font-bold text-sm sm:text-md">
          Telephone number
        </div>

        <div
          class="text-xs sm:text-sm mb-8"
          v-text="job_part.job.platform_job.practice.phone_number?job_part.job.platform_job.practice.phone_number:`(none)`"
        />

        <div class="font-bold text-sm sm:text-md">
          Email address
        </div>

        <div class="text-xs sm:text-sm mb-8">
          {{ job_part.job.platform_job.email }}
        </div>

        <div class="font-bold text-sm sm:text-md">
          Is there another Dr on site?
        </div>

        <div class="text-xs sm:text-sm mb-8">
          {{ job_part.job.platform_job.is_another_doctor ? 'Yes' : 'No' }}
        </div>

        <div class="font-bold text-sm sm:text-md">
          Is nurse support available?
        </div>

        <div class="text-xs sm:text-sm mb-8">
          {{ job_part.job.platform_job.is_nurse_available ? 'Yes' : 'No' }}
        </div>

        <div class="font-bold text-sm sm:text-md">
          Number of patients to be seen during the session?
        </div>

        <div class="text-xs sm:text-sm mb-8">
          {{ job_part.job.platform_job.number_of_patients }}
        </div>

        <div class="font-bold text-sm sm:text-md">
          Duration of eact appointment?
        </div>

        <div class="text-xs sm:text-sm mb-8">
          {{ job_part.job.platform_job.duration_for_each_appointment }}
        </div>

        <div class="font-bold text-sm sm:text-md">
          Opportunity for catch up slots?
        </div>

        <div class="text-xs sm:text-sm mb-8">
          {{ job_part.job.platform_job.opportunity_for_catch_up_slots ? 'Yes' : 'No' }}
        </div>

        <div class="font-bold text-sm sm:text-md">
          Session requirements:
        </div>

        <div v-if="!session_requirements.length">
          (none)
        </div>

        <div
          v-for="(item, index) in session_requirements"
          :key="`${item}-${index}`"
          class="flex flex-col"
        >
          <div class="text-xs sm:text-sm w-full">
            {{ item }}
          </div>
        </div>

        <div class="text-xs sm:text-sm mb-8" />

        <div class="font-bold text-sm sm:text-md">
          Session structure information
        </div>

        <div class="text-xs sm:text-sm mb-8 break-words">
          {{ job_part.job.platform_job && job_part.job.platform_job.session_structure_information ? job_part.job.platform_job.session_structure_information : '(none)' }}
        </div>

        <div class="font-bold text-sm sm:text-md">
          Update Remarks
        </div>

        <div class="text-xs sm:text-sm mb-8 break-words">
          {{ job_part.job.update_remarks?job_part.job.update_remarks:`(none)` }}
        </div>
        <!--  -->
      </div>

      <div class="flex flex-col w-full md:w-1/2 p-0 md:pl-4">
        <div class="text-xs sm:text-sm mb-6">
          <span>This job is</span>
          <span class="font-bold text-sm sm:text-md">{{ job_part.job.platform_job.ir35 ? 'INSIDE' : 'OUTSIDE' }}</span>
          <span>of scope of</span>
          <span class="font-bold text-sm sm:text-md">IR35</span>
        </div>

        <div class="font-bold text-sm sm:text-md">
          Role
        </div>

        <div class="text-xs sm:text-sm mb-6">
          {{ job_part.job.platform_job.profession.name }}
        </div>

        <div class="font-bold text-sm sm:text-md">
          Specialty
        </div>

        <div class="text-xs sm:text-sm mb-6 flex flex-row flex-wrap">
          <div
            v-for="item in job_part.job.platform_job.qualifications"
            :key="item.id"
            class="rounded-lg bg-yellow-500 p-2 m-1"
          >
            {{ item.name }}
          </div>
        </div>

        <div class="font-bold text-sm sm:text-md">
          Clinical systems
        </div>

        <div class="text-xs sm:text-sm mb-6 flex flex-row flex-wrap">
          <div
            v-for="item in job_part.job.platform_job.clinical_systems"
            :key="item.id"
            class="rounded-lg bg-yellow-500 p-2 m-1"
          >
            {{ item.name }}
          </div>
        </div>

        <div class="font-bold text-sm sm:text-md">
          Spoken languages
        </div>

        <div class="text-xs sm:text-sm mb-6 flex flex-row flex-wrap">
          <div class="rounded-lg bg-yellow-500 p-2 m-1">
            English
          </div>
          <div
            v-for="item in job_part.job.platform_job.spoken_languages"
            :key="item.id"
            class="rounded-lg bg-yellow-500 p-2 m-1"
          >
            {{ item.name }}
          </div>
        </div>

        <div class="font-bold text-sm sm:text-md">
          Compliance requirements
        </div>

        <div class="text-xs sm:text-sm mb-8 flex flex-row flex-wrap">
          <div v-if="job_part.job.platform_job.compliance_documents.length === 0" class="mt-1">
            (none)
          </div>

          <div
            v-for="item in job_part.job.platform_job.compliance_documents"
            v-else
            :key="item.id"
            class="rounded-lg bg-yellow-500 p-1 m-1"
          >
            {{ item.name }}
          </div>
        </div>

        <div class="font-bold text-sm sm:text-md">
          Mandatory training
        </div>

        <div class="text-xs sm:text-sm mb-6 flex flex-row flex-wrap">
          <div v-if="job_part.job.platform_job.mandatory_trainings.length === 0" class="mt-1">
            (none)
          </div>
          <div
            v-for="item in job_part.job.platform_job.mandatory_trainings"
            v-else
            :key="item.id"
            class="rounded-lg bg-yellow-500 p-2 m-1"
          >
            {{ item.name }}
          </div>
        </div>

        <div class="font-bold text-sm sm:text-md">
          Other Mandatory training
        </div>

        <div class="text-xs sm:text-sm mb-6 flex flex-row flex-wrap">
          <div v-if="job_part.job.platform_job.other_mandatory_trainings.length === 0" class="mt-1">
            (none)
          </div>

          <div
            v-for="item in job_part.job.platform_job.other_mandatory_trainings"
            v-else
            :key="item.id"
            class="rounded-lg bg-yellow-500 p-2 m-1"
          >
            {{ item.name }}
          </div>
        </div>

        <!-- <template
          v-if="['Completed', 'Terminated', 'Approved', 'Cancelled'].includes(job_part.status)"
        >
          <div class="font-bold text-sm sm:text-md">Was the Locum absent for session?</div>
          <div
            class="text-xs sm:text-sm mb-8"
          >{{ job_part.absent_days > 0 || job_part.absent_days_reason !== null ? 'Yes' : 'No' }}</div>
          <template v-if="job_part.absent_days > 0 || job_part.absent_days_reason !== null">
            <div class="font-bold text-sm sm:text-md">Days of Absent:</div>
            <div class="text-xs sm:text-sm mb-8">{{ job_part.absent_days }}</div>
            <div class="font-bold text-sm sm:text-md">Reason of Absence:</div>
            <div
              class="text-xs sm:text-sm mb-8"
            >{{ job_part.absent_days_reason ? job_part.absent_days_reason : 'None' }}</div>
          </template>
          <div class="font-bold text-sm sm:text-md">Was the Locum late for this session?</div>
          <div
            class="text-xs sm:text-sm mb-8"
          >{{ job_part.late_hours > 0 || job_part.late_hours_reason !== null ? 'Yes' : 'No' }}</div>
          <template v-if="job_part.late_hours > 0 || job_part.late_hours_reason !== null">
            <div class="font-bold text-sm sm:text-md">Hours of Late:</div>
            <div class="text-xs sm:text-sm mb-8">{{ late_hours | hoursMinutes }}</div>
            <div class="font-bold text-sm sm:text-md">Reason of Late:</div>
            <div
              class="text-xs sm:text-sm mb-8"
            >{{ job_part.late_hours_reason ? job_part.late_hours_reason : 'None' }}</div>
          </template>
          <div class="font-bold text-sm sm:text-md">Final Hours:</div>
          <div class="text-xs sm:text-sm mb-8">
            <template v-if="job_part.final_hours>0">{{ job_part.final_hours | hoursMinutes }}</template>
            <template v-else>{{ job_part.final_hours }}</template>
          </div>
        </template>-->

        <template v-if="job_part.use_variation_terms">
          <template v-if="job_part.variation_terms_file_id">
            <div class="font-bold text-sm sm:text-md">
              Terms &amp; Condition
            </div>

            <div class="text-sm sm:text-md">
              Variation Terms
            </div>

            <div class="text-xs sm:text-sm mb-6 flex flex-row flex-wrap">
              <div
                class="mt-1 cursor-pointer bg-yellow-400 hover:bg-yellow-500 rounded-lg px-4 py-1 transition-hover"
                @click="modal = true"
              >
                View
              </div>

              <transition name="slide" mode="out-in">
                <div v-if="modal" class="modal-container shadow-lg">
                  <div class="h-full w-full">
                    <div class="p-4 md:p-8 cursor-pointer">
                      <svgicon name="left-arrow" height="32" @click="modal = false" />
                    </div>

                    <embed
                      class="object-contain object-top w-full"
                      :class="job_part.variation_terms_file.type == 'image' ? 'image' : 'document h-full '"
                      :src="[
                        'msword',
                        'tiff',
                        'vnd.openxmlformats-officedocument.wordprocessingml.document',
                        'vnd.openxmlformats-officedocument.wordprocessingml.template',
                        'vnd.ms-word.document.macroEnabled.12',
                        'vnd.ms-word.template.macroEnabled.12'
                      ].includes(job_part.variation_terms_file.subtype)
                        ? convertDoc(job_part.variation_terms_file.url)
                        : job_part.variation_terms_file.url
                      "
                    >
                  </div>
                </div>
              </transition>
            </div>
          </template>

          <template v-else-if="job_part.standard_terms_file_id">
            <div class="font-bold text-sm sm:text-md">
              Terms & Condition
            </div>

            <div class="text-sm sm:text-md">
              Standard Terms
            </div>

            <div class="text-xs sm:text-sm mb-6 flex flex-row flex-wrap">
              <div
                class="mt-1 cursor-pointer bg-yellow-400 hover:bg-yellow-500 rounded-lg px-4 py-1 transition-hover"
                @click="modal = true"
              >
                View
              </div>

              <transition name="slide" mode="out-in">
                <div v-if="modal" class="modal-container shadow-lg">
                  <div class="h-full w-full">
                    <div class="p-4 md:p-8 cursor-pointer">
                      <svgicon name="left-arrow" height="32" @click="modal = false" />
                    </div>

                    <embed
                      class="object-contain object-top w-full"
                      :class="job_part.standard_terms_file.type == 'image' ? 'image' : 'document h-full '"
                      :src="[
                        'msword',
                        'tiff',
                        'vnd.openxmlformats-officedocument.wordprocessingml.document',
                        'vnd.openxmlformats-officedocument.wordprocessingml.template',
                        'vnd.ms-word.document.macroEnabled.12',
                        'vnd.ms-word.template.macroEnabled.12'
                      ].includes(job_part.standard_terms_file.subtype)
                        ? convertDoc(job_part.standard_terms_file.url)
                        : job_part.standard_terms_file.url
                      "
                    >
                  </div>
                </div>
              </transition>
            </div>
          </template>
        </template>

        <template v-if="!job_part.use_variation_terms">
          <template v-if="job_part.standard_terms_file_id">
            <div class="font-bold text-sm sm:text-md">
              Terms & Condition
            </div>

            <div class="text-sm sm:text-md">
              Standard Terms
            </div>

            <div class="text-xs sm:text-sm mb-6 flex flex-row flex-wrap">
              <div
                class="mt-1 cursor-pointer bg-yellow-400 hover:bg-yellow-500 rounded-lg px-4 py-1 transition-hover"
                @click="modal = true"
              >
                View
              </div>

              <transition name="slide" mode="out-in">
                <div v-if="modal" class="modal-container shadow-lg">
                  <div class="h-full w-full">
                    <div class="p-4 md:p-8 cursor-pointer">
                      <svgicon name="left-arrow" height="32" @click="modal = false" />
                    </div>

                    <embed
                      class="object-contain object-top w-full"
                      :class="job_part.standard_terms_file.type == 'image' ? 'image' : 'document h-full '"
                      :src="[
                        'msword',
                        'tiff',
                        'vnd.openxmlformats-officedocument.wordprocessingml.document',
                        'vnd.openxmlformats-officedocument.wordprocessingml.template',
                        'vnd.ms-word.document.macroEnabled.12',
                        'vnd.ms-word.template.macroEnabled.12'
                      ].includes(job_part.standard_terms_file.subtype)
                        ? convertDoc(job_part.standard_terms_file.url)
                        : job_part.standard_terms_file.url
                      "
                    >
                  </div>
                </div>
              </transition>
            </div>
          </template>

          <template v-else-if="job_part.variation_terms_file_id">
            <div class="font-bold text-sm sm:text-md">
              Terms & Condition
            </div>

            <div class="text-sm sm:text-md">
              Variation Terms
            </div>

            <div class="text-xs sm:text-sm mb-6 flex flex-row flex-wrap">
              <div
                class="mt-1 cursor-pointer bg-yellow-400 hover:bg-yellow-500 rounded-lg px-4 py-1 transition-hover"
                @click="modal = true"
              >
                View
              </div>

              <transition name="slide" mode="out-in">
                <div v-if="modal" class="modal-container shadow-lg">
                  <div class="h-full w-full">
                    <div class="p-4 md:p-8 cursor-pointer">
                      <svgicon name="left-arrow" height="32" @click="modal = false" />
                    </div>

                    <embed
                      class="object-contain object-top w-full"
                      :class="job_part.variation_terms_file.type == 'image' ? 'image' : 'document h-full '"
                      :src="[
                        'msword',
                        'tiff',
                        'vnd.openxmlformats-officedocument.wordprocessingml.document',
                        'vnd.openxmlformats-officedocument.wordprocessingml.template',
                        'vnd.ms-word.document.macroEnabled.12',
                        'vnd.ms-word.template.macroEnabled.12'
                      ].includes(job_part.standard_terms_file.subtype)
                        ? convertDoc(job_part.standard_terms_file.url)
                        : job_part.standard_terms_file.url
                      "
                    >
                  </div>
                </div>
              </transition>
            </div>
          </template>
        </template>
      </div>
    </div>

    <transition name="fade" mode="out-in">
      <div v-if="modal" class="shield" @click="modal = false" />
    </transition>
  </div>
</template>

<script>
import AppLoading from "@/components/Base/AppLoading"

export default {
  components: {
    AppLoading,
  },
  
  props: {
    loadingJobPart: {
      type: Boolean,
      default: false,
    },

    job_part: {
      type: Object,
      required: true,
    },
  },

  data () {
    return {
      modal: false,
    }
  },

  computed: {
    job () {
      return this.job_part ? this.job_part.job : null
    },

    session_requirements () {
      return this.job_part.job.platform_job.session_requirements
        ? this.job_part.job.platform_job.session_requirements.split(",")
        : []
    },

    late_hours () {
      let originalHours = this.job_part.schedules
        .map(item => item.original_hours_in_minutes)
        .reduce((acc, cur) => acc + cur)

      let finalHours = this.job_part.schedules
        .map(item => item.final_hours_in_minutes)
        .reduce((acc, cur) => acc + cur)

      let lateHours = originalHours - finalHours

      return lateHours
    },
  },

  methods: {
    convertDoc (document) {
      return `https://docs.google.com/gview?url=${document}&embedded=true`
    },

    convertTimeToMinutes (payload) {
      let hour = parseInt(payload.split(":")[0]) * 60
      let minute = parseInt(payload.split(":")[1])

      return hour + minute
    },

    isAbsent (payload) {
      return payload.absent > 0
    },

    isLate (payload) {
      return (
        this.convertTimeToMinutes(payload.final_time_start)
        > this.convertTimeToMinutes(payload.time_start)
      )
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
