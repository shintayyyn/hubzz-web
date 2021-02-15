<template>
  <div class="bg-white rounded-lg border p-4 mt-4">
    <AppLoading :loading="loadingJobPart" spinner />

    <div class="relative flex flex-row flex-wrap justify-between">
      <div class="flex flex-col w-full md:w-1/3 p-0 md:pr-2">
        <div class="font-bold text-sm sm:text-md">
          Job part number
        </div>

        <div class="text-xs sm:text-sm mb-8">
          {{ jobPart.job_part_number }}
        </div>
        <div class="font-bold text-sm sm:text-md">
          Job description
        </div>

        <div class="text-xs sm:text-sm mb-8 break-words">
          {{ jobPart.description ? jobPart.description : '(none)' }}
        </div>

        <div class="font-bold text-sm sm:text-md">
          Job Part Gross Rate
        </div>

        <div class="text-xs sm:text-sm mb-8">
          £ {{ jobPart ? jobPart.job_part_gross_rate_formatted : null }}
        </div>

        <div class="font-bold text-sm sm:text-md">
          Job Gross Rate
        </div>

        <div class="text-xs sm:text-sm mb-8">
          £ {{ jobPart ? jobPart.job_gross_rate_formatted : null }}
        </div>

        <div class="font-bold text-sm sm:text-md">
          Job Part Total Original Hours
        </div>

        <div class="text-xs sm:text-sm mb-8">
          {{ jobPart ? jobPart.job_part_total_original_hours_in_minutes_formatted : null }}
        </div>

        <template v-if="jobPart && jobPart.locum_invoiceable">
          <div class="font-bold text-sm sm:text-md">
            Job Part Total Final Hours
          </div>

          <div class="text-xs sm:text-sm mb-8">
            {{ jobPart ? jobPart.job_part_total_final_hours_in_minutes_formatted : null }}
          </div>
        </template>

        <div class="font-bold text-sm sm:text-md">
          Job Total Original Hours
        </div>

        <div class="text-xs sm:text-sm mb-8">
          {{ jobPart ? jobPart.job_total_original_hours_in_minutes_formatted : null }}
        </div>

        <template v-if="jobPart && jobPart.locum_invoiceable">
          <div class="font-bold text-sm sm:text-md">
            Job Total Final Hours
          </div>

          <div class="text-xs sm:text-sm mb-8">
            {{ jobPart ? jobPart.job_total_final_hours_in_minutes_formatted : null }}
          </div>
        </template>

        <div class="font-bold text-sm sm:text-md">
          Extra information
        </div>

        <div class="text-xs sm:text-sm mb-8 break-words">
          {{ jobPart.extra_information ? jobPart.extra_information : '(none)' }}
        </div>

        <div class="font-bold text-sm sm:text-md">
          Report to
        </div>

        <div class="text-xs sm:text-sm mb-8">
          {{ jobPart.report_to }}
        </div>

        <div class="font-bold text-sm sm:text-md">
          Telephone number
        </div>

        <div class="text-xs sm:text-sm mb-8">
          {{ jobPart.practice_phone_number ? jobPart.practice_phone_number : '(none)' }}
        </div>

        <div class="font-bold text-sm sm:text-md">
          Email address
        </div>

        <div class="text-xs sm:text-sm mb-8">
          {{ jobPart.email }}
        </div>

        <div class="font-bold text-sm sm:text-md">
          Is there another Dr on site?
        </div>

        <div class="text-xs sm:text-sm mb-8">
          {{ jobPart.is_another_doctor ? 'Yes' : 'No' }}
        </div>

        <div class="font-bold text-sm sm:text-md">
          Is nurse support available?
        </div>

        <div class="text-xs sm:text-sm mb-8">
          {{ jobPart.is_nurse_available ? 'Yes' : 'No' }}
        </div>

        <div class="font-bold text-sm sm:text-md">
          Number of patients to be seen during the session?
        </div>

        <div class="text-xs sm:text-sm mb-8">
          {{ jobPart.number_of_patients }}
        </div>

        <div class="font-bold text-sm sm:text-md">
          Duration of eact appointment?
        </div>

        <div class="text-xs sm:text-sm mb-8">
          {{ jobPart.duration_for_each_appointment }}
        </div>

        <div class="font-bold text-sm sm:text-md">
          Opportunity for catch up slots?
        </div>

        <div class="text-xs sm:text-sm mb-8">
          {{ jobPart.opportunity_for_catch_up_slots ? 'Yes' : 'No' }}
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
          {{ jobPart.session_structure_information ? jobPart.session_structure_information : '(none)' }}
        </div>

        <div class="font-bold text-sm sm:text-md">
          Update Remarks
        </div>

        <div class="text-xs sm:text-sm mb-8 break-words">
          {{ jobPart.update_remarks ? jobPart.update_remarks : '(none)' }}
        </div>
      </div>

      <div class="flex flex-col w-full md:w-2/3 p-0 md:pl-2">
        <div class="mb-8">
          <div class="font-bold text-sm sm:text-md">
            Duration
          </div>

          <p v-if="jobPart.dates.length > 1" class="px-1">
            {{ $moment(jobPart.date_start, 'YYYY-MM-DD').format('DD/MM/YYYY') }} - {{ $moment(jobPart.date_end, 'YYYY-MM-DD').format('DD/MM/YYYY') }}
          </p>

          <p class="text-xs sm:text-sm">
            Days: {{ jobPart.dates.length }}
          </p>

          <p class="font-bold text-sm sm:text-md">
            Schedule
          </p>

          <div class="text-xs sm:text-sm overflow-y-auto flex flex-col items-center" style="max-height:205px;">
            <div style="position:sticky;top:0" class="flex justify-between w-full">
              <p
                class="bg-white p-1 font-bold text-xs"
                :style="jobPart && jobPart.locum_invoiceable ? 'min-width:120px;max-width:120px' : 'min-width:190px;max-width:190px'"
              >
                DATE
              </p>

              <p
                class="text-center bg-white p-1 font-bold text-xs"
                :style="jobPart && jobPart.locum_invoiceable ? 'min-width:120px;max-width:120px' : 'min-width:180px;max-width:180px'"
              >
                SHIFT
              </p>

              <p
                class="text-center bg-white p-1 font-bold text-xs"
                :style="jobPart && jobPart.locum_invoiceable ? 'min-width:120px;max-width:120px' : 'min-width:180px;max-width:180px'"
              >
                RATE
              </p>

              <p
                v-if="jobPart.locum_invoiceable"
                class="text-center bg-white p-1 font-bold text-xs"
                style="min-width:120px;max-width:120px"
              >
                {{ 
                  jobPart.locum_job_part_status === 'Approved'
                    ? 'APPROVED TIME'
                    : jobPart.locum_invoice_status === 'Disputed'
                      ? 'DISPUTED TIME'
                      : jobPart.locum_invoice_status === 'Invoiced'
                        ? 'INVOICED TIME'
                        : 'COMPLETED TIME'
                }}
              </p>

              <template v-if="jobPart && jobPart.locum_invoiceable">
                <p
                  class="text-center bg-white p-1 font-bold text-xs"
                  style="min-width:120px;max-width:120px"
                >
                  REMARKS
                </p>

                <p
                  class="text-center bg-white p-1 font-bold text-xs"
                  style="min-width:120px;max-width:120px"
                >
                  REASON
                </p>
              </template>
            </div>

            <div v-for="(sched, index) in jobPart.schedules" :key="index" class="flex justify-between w-full pb-2">
              <p
                :style="jobPart && jobPart.locum_invoiceable ? 'min-width:120px;max-width:120px' : 'min-width:190px;max-width:190px'"
              >
                {{ $moment(sched.date, 'YYYY-MM-DD').format('DD/MM/YYYY') }} | {{ sched.time_start }}-{{ sched.time_end }}
              </p>

              <p
                class="text-center"
                :style="jobPart && jobPart.locum_invoiceable ? 'min-width:120px;max-width:120px' : 'min-width:180px;max-width:180px'"
              >
                {{ sched.shift_name }}
              </p>

              <p
                class="text-center"
                :style="jobPart && jobPart.locum_invoiceable ? 'min-width:120px;max-width:120px' : 'min-width:180px;max-width:180px'"
              >
                £{{ sched.rate | currency }} {{ sched.rate_type_name !== 'Hourly' ? 'per' : '' }} {{ sched.rate_type_name }}
              </p>

              <p
                v-if="jobPart.locum_invoiceable"
                class="text-center"
                style="min-width:120px;max-width:120px"
              >
                {{
                  jobPart.locum_job_part_status === 'Approved' || jobPart.locum_invoice_status === 'Disputed' || jobPart.locum_invoice_status === 'Invoiced'
                    ? `${sched.invoiced_time_start || ''} - ${sched.invoiced_time_end || ''}`
                    : `${sched.completed_time_start} - ${sched.completed_time_end}`
                }}
              </p>

              <template v-if="jobPart && jobPart.locum_invoiceable">
                <p
                  class="text-center"
                  style="min-width:120px;max-width:120px"
                >
                  {{
                    jobPart.locum_job_part_status === 'Approved' || jobPart.locum_invoice_status === 'Disputed' || jobPart.locum_invoice_status === 'Invoiced'
                      ? sched.invoiced_remarks
                      : sched.completed_remarks
                  }}
                </p>
                <p
                  class="text-center"
                  style="min-width:120px;max-width:120px"
                >
                  {{
                    jobPart.locum_job_part_status === 'Approved' || jobPart.locum_invoice_status === 'Disputed' || jobPart.locum_invoice_status === 'Invoiced'
                      ? sched.invoiced_reason
                      : sched.completed_reason
                  }}
                </p>
              </template>
            </div>
          </div>
        </div>
        <div class="text-xs sm:text-sm mb-6">
          <span>This job is</span>
          <span class="font-bold text-sm sm:text-md">{{ jobPart.ir35 ? 'INSIDE' : 'OUTSIDE' }}</span>
          <span>of scope of</span>
          <span class="font-bold text-sm sm:text-md">IR35</span>
        </div>

        <div class="font-bold text-sm sm:text-md">
          Role
        </div>

        <div class="text-xs sm:text-sm mb-6">
          {{ jobPart.profession_name }}
        </div>

        <div class="font-bold text-sm sm:text-md">
          Specialty
        </div>

        <div class="text-xs sm:text-sm mb-6 flex flex-row flex-wrap">
          <div v-for="qualification in jobPart.qualifications" :key="qualification.id" class="rounded-lg bg-sunglow py-1 px-2 m-1">
            {{ qualification.name }}
          </div>
        </div>

        <div class="font-bold text-sm sm:text-md">
          Clinical systems
        </div>

        <div class="text-xs sm:text-sm mb-6 flex flex-row flex-wrap">
          <div v-for="clinicalSystem in jobPart.clinical_systems" :key="clinicalSystem.id" class="rounded-lg bg-sunglow py-1 px-2 m-1">
            {{ clinicalSystem.name }}
          </div>
        </div>

        <div class="font-bold text-sm sm:text-md">
          Spoken languages
        </div>

        <div class="text-xs sm:text-sm mb-6 flex flex-row flex-wrap">
          <div class="rounded-lg bg-sunglow py-1 px-2 m-1">
            English
          </div>

          <div v-for="spokenLanguage in jobPart.spoken_languages" :key="spokenLanguage.id" class="rounded-lg bg-sunglow py-1 px-2 m-1">
            {{ spokenLanguage.name }}
          </div>
        </div>

        <div class="font-bold text-sm sm:text-md">
          Compliance requirements
        </div>

        <div class="text-xs sm:text-sm mb-8 flex flex-row flex-wrap">
          <div v-if="jobPart.compliance_documents.length === 0" class="mt-1">
            (none)
          </div>

          <div v-for="complianceDocument in jobPart.compliance_documents" :key="complianceDocument.id" class="rounded-lg bg-sunglow py-1 px-1 m-1">
            {{ complianceDocument.name }}
          </div>
        </div>

        <div class="font-bold text-sm sm:text-md">
          Mandatory training
        </div>

        <div class="text-xs sm:text-sm mb-6 flex flex-row flex-wrap">
          <div v-if="jobPart.mandatory_trainings.length === 0" class="mt-1">
            (none)
          </div>

          <div v-for="mandatoryTraining in jobPart.mandatory_trainings" :key="mandatoryTraining.id" class="rounded-lg bg-sunglow py-1 px-2 m-1">
            {{ mandatoryTraining.name }}
          </div>
        </div>

        <div class="font-bold text-sm sm:text-md">
          Other Mandatory training
        </div>

        <div class="text-xs sm:text-sm mb-6 flex flex-row flex-wrap">
          <div v-if="jobPart.other_mandatory_trainings.length === 0" class="mt-1">
            (none)
          </div>

          <div v-for="otherMandatoryTraining in jobPart.other_mandatory_trainings" :key="otherMandatoryTraining.id" class="rounded-lg bg-sunglow py-1 px-2 m-1">
            {{ otherMandatoryTraining.name }}
          </div>
        </div>

        <template v-if="jobPart.use_variation_terms">
          <template v-if="jobPart.variation_terms_file_id">
            <div class="font-bold text-sm sm:text-md">
              Terms &amp; Condition
            </div>

            <div class="text-sm sm:text-md">
              Variation Terms
            </div>

            <div class="text-xs sm:text-sm mb-6 flex flex-row flex-wrap">
              <div
                class="mt-1 cursor-pointer bg-sunglow hover:bg-sunglow-dark rounded-lg px-4 py-1 transition-hover"
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
                      :class="jobPart.variation_terms_file.type == 'image' ? 'image' : 'document h-full '"
                      :src="[
                        'msword',
                        'tiff',
                        'vnd.openxmlformats-officedocument.wordprocessingml.document',
                        'vnd.openxmlformats-officedocument.wordprocessingml.template',
                        'vnd.ms-word.document.macroEnabled.12',
                        'vnd.ms-word.template.macroEnabled.12'
                      ].includes(jobPart.variation_terms_file.subtype)
                        ? convertDoc(jobPart.variation_terms_file.url)
                        : jobPart.variation_terms_file.url
                      "
                    >
                  </div>
                </div>
              </transition>
            </div>
          </template>

          <template v-else-if="jobPart.standard_terms_file_id">
            <div class="font-bold text-sm sm:text-md">
              Terms & Condition
            </div>

            <div class="text-sm sm:text-md">
              Standard Terms
            </div>

            <div class="text-xs sm:text-sm mb-6 flex flex-row flex-wrap">
              <div
                class="mt-1 cursor-pointer bg-sunglow hover:bg-sunglow-dark rounded-lg px-4 py-1 transition-hover"
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
                      :class="jobPart.standard_terms_file.type == 'image' ? 'image' : 'document h-full '"
                      :src="[
                        'msword',
                        'tiff',
                        'vnd.openxmlformats-officedocument.wordprocessingml.document',
                        'vnd.openxmlformats-officedocument.wordprocessingml.template',
                        'vnd.ms-word.document.macroEnabled.12',
                        'vnd.ms-word.template.macroEnabled.12'
                      ].includes(jobPart.standard_terms_file.subtype)
                        ? convertDoc(jobPart.standard_terms_file.url)
                        : jobPart.standard_terms_file.url
                      "
                    >
                  </div>
                </div>
              </transition>
            </div>
          </template>
        </template>

        <template v-if="!jobPart.use_variation_terms">
          <template v-if="jobPart.standard_terms_file_id">
            <div class="font-bold text-sm sm:text-md">
              Terms & Condition
            </div>

            <div class="text-sm sm:text-md">
              Standard Terms
            </div>

            <div class="text-xs sm:text-sm mb-6 flex flex-row flex-wrap">
              <div
                class="mt-1 cursor-pointer bg-sunglow hover:bg-sunglow-dark rounded-lg px-4 py-1 transition-hover"
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
                      :class="jobPart.standard_terms_file.type == 'image' ? 'image' : 'document h-full '"
                      :src="[
                        'msword',
                        'tiff',
                        'vnd.openxmlformats-officedocument.wordprocessingml.document',
                        'vnd.openxmlformats-officedocument.wordprocessingml.template',
                        'vnd.ms-word.document.macroEnabled.12',
                        'vnd.ms-word.template.macroEnabled.12'
                      ].includes(jobPart.standard_terms_file.subtype)
                        ? convertDoc(jobPart.standard_terms_file.url)
                        : jobPart.standard_terms_file.url
                      "
                    >
                  </div>
                </div>
              </transition>
            </div>
          </template>

          <template v-else-if="jobPart.variation_terms_file_id">
            <div class="font-bold text-sm sm:text-md">
              Terms & Condition
            </div>

            <div class="text-sm sm:text-md">
              Variation Terms
            </div>

            <div class="text-xs sm:text-sm mb-6 flex flex-row flex-wrap">
              <div
                class="mt-1 cursor-pointer bg-sunglow hover:bg-sunglow-dark rounded-lg px-4 py-1 transition-hover"
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
                      :class="jobPart.variation_terms_file.type == 'image' ? 'image' : 'document h-full '"
                      :src="[
                        'msword',
                        'tiff',
                        'vnd.openxmlformats-officedocument.wordprocessingml.document',
                        'vnd.openxmlformats-officedocument.wordprocessingml.template',
                        'vnd.ms-word.document.macroEnabled.12',
                        'vnd.ms-word.template.macroEnabled.12'
                      ].includes(jobPart.standard_terms_file.subtype)
                        ? convertDoc(jobPart.standard_terms_file.url)
                        : jobPart.standard_terms_file.url
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

    jobPart: {
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
    session_requirements () {
      return this.jobPart.session_requirements
        ? this.jobPart.session_requirements.split(",")
        : []
    },
  },

  methods: {
    convertDoc (document) {
      return `https://docs.google.com/gview?url=${document}&embedded=true`
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
