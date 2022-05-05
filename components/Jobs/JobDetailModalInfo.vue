<template>
  <div class="bg-white rounded-lg border p-4 mt-4">
    <div class="flex flex-row flex-wrap">
      <div class="flex flex-col w-full">
        <div class="flex flex-col md:flex-row">
          <div class="md:w-1/3">
            <div class="font-bold text-sm sm:text-md">
              Job number
            </div>

            <div class="text-xs sm:text-sm mb-6">
              {{ job.job_number }}
            </div>

            <div class="font-bold text-sm sm:text-md">
              Duration
            </div>

            <p v-if="job.dates.length > 1" class="px-1">
              {{ $moment(job.dates[0], 'YYYY-MM-DD').format('DD/MM/YYYY') }} - {{ $moment(job.dates[job.dates.length-1], 'YYYY-MM-DD').format('DD/MM/YYYY') }}
            </p>

            <div class="px-1 mb-2">
              <p>Days: {{ job.dates.length }}</p>
            </div>
          </div>

          <div class="md:w-2/3">
            <div class="font-bold text-sm sm:text-md">
              Job description
            </div>

            <div class="text-xs sm:text-sm mb-6 break-words">
              {{ job && job.description ? job.description : '(none)' }}
            </div>
          </div>
        </div>

        <div class="text-xs sm:text-sm mb-6">
          <div class="px-1">
            <div class="flex justify-between items-end mb-2">
              <p class="font-bold text-sm sm:text-md">
                Schedule
              </p>
            </div>

            <div class="hidden bg-gray-400 lg:flex font-bold text-xs">
              <p class="p-1 w-2/12">
                DATE
              </p>

              <p class="p-1 w-3/12 text-center">
                TIME
              </p>

              <p class="p-1 w-2/12 text-center">
                SHIFT
              </p>

              <p class="p-1 w-2/12 text-center">
                RATE
              </p>

              <p class="p-1 w-2/12 text-center">
                BREAK
              </p>
            </div>

            <div class="overflow-y-auto" style="max-height: 205px;">
              <div v-for="(sched, index) in job.schedules" :key="index" class="lg:flex pb-2">
                <p class="lg:w-2/12">
                  {{ $moment(sched.date, 'YYYY-MM-DD').format('DD/MM/YYYY') }}
                </p>

                <p class="lg:w-3/12 lg:text-center">
                  {{ sched.time_start }}-{{ sched.time_end }}
                </p>

                <p class="lg:w-2/12 lg:text-center">
                  {{ sched.shift.name }}
                </p>

                <p class="lg:w-2/12 lg:text-center">
                  £{{ sched.rate }} {{ sched.locum_detail_rate_type.name }}
                </p>

                <p class="lg:w-2/12 lg:text-center">
                  {{ sched.posted_break_formatted }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="flex flex-col w-full md:w-1/3 md:pr-1">
        <div class="font-bold text-sm sm:text-md">
          Job Gross Rate
        </div>

        <div class="text-xs sm:text-sm mb-6">
          £ {{ job ? job.job_gross_rate_formatted : null }}
        </div>

        <div class="font-bold text-sm sm:text-md">
          Job Total Hours
        </div>

        <div class="text-xs sm:text-sm mb-6">
          {{ job.schedules.map(schedule => schedule.original_hours_in_minutes).reduce((acc, cur) => acc + cur) | hoursMinutes }}
        </div>

        <div class="font-bold text-sm sm:text-md">
          Extra information
        </div>

        <div class="text-xs sm:text-sm mb-6 break-words">
          {{ job.extra_information ? job.extra_information : '(none)' }}
        </div>

        <div class="font-bold text-sm sm:text-md">
          Report to
        </div>

        <div class="text-xs sm:text-sm mb-6">
          {{ job.report_to }}
        </div>

        <div class="font-bold text-sm sm:text-md">
          Telephone number
        </div>

        <div class="text-xs sm:text-sm mb-6">
          {{ job.practice.phone_number ? job.practice.phone_number : '(none)' }}
        </div>

        <div class="font-bold text-sm sm:text-md">
          Email address
        </div>

        <div class="text-xs sm:text-sm mb-6">
          {{ job.email }}
        </div>
        
        <div class="font-bold text-sm sm:text-md">
          Compliance requirements
        </div>

        <div class="text-xs sm:text-sm mb-6 flex flex-row flex-wrap">
          <div v-if="job.compliance_documents.length === 0" class="mt-1">
            (none)
          </div>

          <div v-for="item in job.compliance_documents" :key="item.id" class="rounded-lg bg-sunglow px-2 py-1 m-1">
            {{ item.name }}
          </div>
        </div>
      </div>

      <div class="flex flex-col w-full md:w-1/3 md:px-1">
        <div class="font-bold text-sm sm:text-md">
          Is there another Dr on site?
        </div>

        <div class="text-xs sm:text-sm mb-6">
          {{ job.is_another_doctor ? 'Yes' : 'No' }}
        </div>

        <div class="font-bold text-sm sm:text-md">
          Is nurse support available?
        </div>

        <div class="text-xs sm:text-sm mb-6">
          {{ job.is_nurse_available ? 'Yes' : 'No' }}
        </div>

        <div class="font-bold text-sm sm:text-md">
          Number of patients to be seen during the session?
        </div>

        <div class="text-xs sm:text-sm mb-6">
          {{ job.number_of_patients }}
        </div>

        <div class="font-bold text-sm sm:text-md">
          Duration of each appointment?
        </div>
        
        <div class="text-xs sm:text-sm mb-6">
          {{ job.duration_for_each_appointment }}
        </div>

        <div class="font-bold text-sm sm:text-md">
          Opportunity for catch up slots?
        </div>

        <div class="text-xs sm:text-sm mb-6">
          {{ job.opportunity_for_catch_up_slots ? 'Yes' : 'No' }}
        </div>

        <div class="font-bold text-sm sm:text-md">
          Session requirements:
        </div>

        <div v-if="!session_requirements.length" class="text-xs sm:text-sm">
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

        <div class="text-xs sm:text-sm mb-6" />

        <div class="font-bold text-sm sm:text-md">
          Session structure information
        </div>

        <div class="text-xs sm:text-sm mb-6 break-words">
          {{ job.session_structure_information ? job.session_structure_information : '(none)' }}
        </div>
      </div>

      <div class="flex flex-col w-full md:w-1/3 md:pl-1">
        <template v-if="job.selection_date">
          <div class="font-bold text-sm sm:text-md">
            Selection will be made by this date
          </div>

          <div class="text-xs sm:text-sm mb-6">
            {{ $moment(job.selection_date, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]').format('DD/MM/YYYY') }} |
            {{ $moment(job.selection_date, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]').format('HH:mm') }}
          </div>
        </template>

        <div class="text-xs sm:text-sm mb-6">
          <span>This job is</span>
          <span class="font-bold text-sm sm:text-md">{{ job.ir35 ? 'INSIDE' : 'OUTSIDE' }}</span>
          <span>of scope of</span>
          <span class="font-bold text-sm sm:text-md">IR35</span>
        </div>

        <div class="font-bold text-sm sm:text-md">
          Role
        </div>

        <div class="text-xs sm:text-sm mb-6">
          {{ job.profession.name }}
        </div>

        <div class="font-bold text-sm sm:text-md">
          Speciality
        </div>

        <div class="text-xs sm:text-sm mb-6 flex flex-row flex-wrap">
          <div v-for="item in job.qualifications" :key="item.id" class="rounded-lg bg-sunglow px-2 py-1 m-1">
            {{ item.name }}
          </div>
          <div v-if="job.qualifications.length === 0" class="rounded-lg bg-sunglow px-2 py-1 m-1">
            N/A
          </div>
        </div>

        <div class="font-bold text-sm sm:text-md">
          Clinical systems
        </div>

        <div class="text-xs sm:text-sm mb-6 flex flex-row flex-wrap">
          <div v-for="item in job.clinical_systems" :key="item.id" class="rounded-lg bg-sunglow px-2 py-1 m-1">
            {{ item.name }}
          </div>
        </div>

        <div class="font-bold text-sm sm:text-md">
          Spoken languages
        </div>

        <div class="text-xs sm:text-sm mb-6 flex flex-row flex-wrap">
          <div class="rounded-lg bg-sunglow px-2 py-1 m-1">
            English
          </div>

          <div v-for="item in job.spoken_languages" :key="item.id" class="rounded-lg bg-sunglow px-2 py-1 m-1">
            {{ item.name }}
          </div>
        </div>

        <div class="font-bold text-sm sm:text-md">
          Additional training
        </div>

        <div class="text-xs sm:text-sm mb-6 flex flex-row flex-wrap">
          <div v-if="job.mandatory_trainings.length === 0" class="mt-1 text-xs sm:text-sm">
            (none)
          </div>

          <div v-for="item in job.mandatory_trainings" :key="item.id" class="rounded-lg bg-sunglow px-2 py-1 m-1">
            {{ item.name }}
          </div>
        </div>

        <div class="font-bold text-sm sm:text-md">
          Other Additional Trainings
        </div>

        <div class="text-xs sm:text-sm mb-6 flex flex-row flex-wrap">
          <div v-if="job.other_mandatory_trainings.length === 0" class="mt-1 text-xs sm:text-sm">
            (none)
          </div>

          <div v-for="item in job.other_mandatory_trainings" :key="item.id" class="rounded-lg bg-sunglow px-2 py-1 m-1">
            {{ item.name }}
          </div>
        </div>

        <div class="font-bold text-sm sm:text-md">
          Update Remarks
        </div>

        <div class="text-xs sm:text-sm mb-6 break-words">
          {{ job.update_remarks?job.update_remarks:`(none)` }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    job: {
      type: Object,
      requried: true,
      default: () => null,
    },
  },

  computed: {
    session_requirements () {
      return this.job.session_requirements
        ? this.job.session_requirements.split(",")
        : []
    },
  },
}
</script>
