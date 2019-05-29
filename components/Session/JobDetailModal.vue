<template>
  <div class="p-8 max-w-xl" v-if="job">
    <div @click="$emit('close')" class="cursor-pointer">
      <svgicon name="left-arrow" height="32" width="32"/>
    </div>
    <div class="flex flex-row justify-start mt-8">
      <div class="mx-2 leading-loose font-bold text-md sm:text-lg">{{form.title}}</div>
      <div class="mx-2 bg-orange-dark text-white text-sm sm:text-sm p-2">AVAILABLE</div>
    </div>
    <div class="flex flex-row flex-wrap justify-between mt-4">
      <div class="w-full">
        <div class="text-xs sm:text-sm">Posted {{$moment(job.created_at).format('DD/MM/YYYY')}}</div>
        <div class="rounded-lg shadow-lg p-8 mt-4 w-full md:w-3/4">
          <div class="flex flex-row flex-wrap">
            <div class="flex flex-col w-full md:w-1/2 p-0 md:pr-4">
              <div class="font-bold text-sm sm:text-md">Job number</div>
              <div class="text-xs sm:text-sm mb-4">{{form.job_number}}</div>
              <div class="font-bold text-sm sm:text-md">Rate</div>
              <div class="text-xs sm:text-sm mt-2 mb-4 flex flex-row flex-nowrap">
                <input
                  v-model="form.rate"
                  type="text"
                  class="border-b-2 focus:border-yellow focus:outline-none py-2 font-bold text-xs w-1/5 text-right"
                >
                <div class="leading-loose mx-2">per</div>
                <select
                  v-model="form.locum_detail_rate_type"
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
              <div class="mb-4">
                <AppButton :label="'Save changes'" :inStyle="'padding:8px'" @click="save"/>
              </div>
              <div class="font-bold text-sm sm:text-md">Job description</div>
              <div class="text-xs sm:text-sm mb-4">{{job_description}}</div>
              <div class="font-bold text-sm sm:text-md">Extra information</div>
              <div class="text-xs sm:text-sm mb-4">{{extra_information}}</div>
              <div class="font-bold text-sm sm:text-md">Report to</div>
              <div class="text-xs sm:text-sm mb-4">{{report_to}}</div>
              <div class="font-bold text-sm sm:text-md">Telephone number</div>
              <div class="text-xs sm:text-sm mb-4">{{phone_number}}</div>
              <div class="font-bold text-sm sm:text-md">Email address</div>
              <div class="text-xs sm:text-sm mb-4">{{email}}</div>
            </div>
            <div class="flex flex-col w-full md:w-1/2 p-0 md:pl-4">
              <div class="font-bold text-sm sm:text-md">Duration</div>
              <div class="text-xs sm:text-sm">From {{date_start}}</div>
              <div class="text-xs sm:text-sm my-2">To {{date_end}}</div>
              <div class="text-xs sm:text-sm mb-4">Shift {{shift.name}}</div>
              <div
                class="font-bold text-sm sm:text-md"
              >Auto-assigns this job to the first, matching Favourite applicant</div>
              <div class="text-xs sm:text-sm mb-4" v-if="auto_assign_at">{{auto_assign_at}}</div>
              <div class="text-xs sm:text-sm mb-4" v-else>No</div>
              <div class="text-xs sm:text-sm mb-4">
                This job is
                <span
                  class="font-bold text-sm sm:text-md"
                >{{ir35 ? 'INSIDE' : 'OUTSIDE'}}</span> of scope of
                <span class="font-bold text-sm sm:text-md">IR35</span>
              </div>
              <div class="font-bold text-sm sm:text-md">Role</div>
              <div class="text-xs sm:text-sm mb-4">{{profession.name}}</div>
              <div class="font-bold text-sm sm:text-md">Specialty</div>
              <div class="text-xs sm:text-sm mb-4 flex flex-row flex-wrap">
                <div class="rounded-lg bg-yellow-dark p-2 m-1">specialty1</div>
                <div class="rounded-lg bg-yellow-dark p-2 m-1">specialty2</div>
              </div>
              <div class="font-bold text-sm sm:text-md">Clinical systems</div>
              <div class="text-xs sm:text-sm mb-4 flex flex-row flex-wrap">
                <div class="rounded-lg bg-yellow-dark p-2 m-1">clinical-systems1</div>
                <div class="rounded-lg bg-yellow-dark p-2 m-1">clinical-systems2</div>
              </div>
              <div class="font-bold text-sm sm:text-md">Spoken languages</div>
              <div class="text-xs sm:text-sm mb-4 flex flex-row flex-wrap">
                <div class="rounded-lg bg-yellow-dark p-2 m-1">language1</div>
                <div class="rounded-lg bg-yellow-dark p-2 m-1">language2</div>
              </div>
              <div class="font-bold text-sm sm:text-md">Compliance requirements</div>
              <div class="text-xs sm:text-sm mb-4 flex flex-row flex-wrap">
                <!-- vifelse -->
                <div class="rounded-lg bg-yellow-dark p-2 m-1">language1</div>
                <div class="rounded-lg bg-yellow-dark p-2 m-1">language2</div>
              </div>
              <div class="font-bold text-sm sm:text-md">Mandatory training</div>
              <div class="text-xs sm:text-sm mb-4 flex flex-row flex-wrap">
                <!-- vifelse -->
                <div class="rounded-lg bg-yellow-dark p-2 m-1">language1</div>
                <div class="rounded-lg bg-yellow-dark p-2 m-1">language2</div>
              </div>
            </div>
          </div>
          <div class="flex flex-col">
            <div class="font-bold text-sm sm:text-md">Practice</div>
            <div class="font-bold text-md sm:text-lg">Practice name</div>
            <div class="text-md sm:text-lg">Practice address</div>
            <div class="mt-4">google map here</div>
          </div>
        </div>
        <div class="rounded-lg shadow-lg p-8 mt-4 w-full md:w-3/4">
          <div class="font-bold text-md sm:text-lg">Cancel this job</div>
          <AppSelect
            v-model="form_cancel.reason"
            :name="'reason'"
            :label="'Please select your reason'"
            :placeholder="'Select..'"
            :error="formError.find(item => item.field === 'reason')"
            :items="reasons"
          />
          <AppButton :label="'Cancel job'" @click="cancel"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import AppSelect from '@/components/Base/AppSelect'
import AppButton from '@/components/Base/AppButton'
const reasons = [
  { label: 'reason 1', value: 'reason1' },
  { label: 'reason 2', value: 'reason2' },
  { label: 'reason 3', value: 'reason3' },
]
export default {
  components: {
    AppSelect,
    AppButton
  },
  data() {
    return {
      rate_types: [],
      reasons,
      form: {
        title: '',
        job_number: '',
        rate: '',
        locum_detail_rate_type: null,
        total_hours: '',
      },
      form_cancel: {
        reason: ''
      },
      formError: [],
      job_description: '',
      extra_information: '',
      report_to: '',
      phone_number: '',
      email: '',
      date_start: '',
      date_end: '',
      time_start: '',
      time_end: '',
      shift: null,
      auto_assign_at: null,
      ir35: null,
      profession: null,
      qualifications: [],
      clinical_systems: [],
      spoken_languages: [],
      compliance_documents: [],
      mandatory_trainings: [],
      practice: null
    }
  },
  computed: {
    job() {
      return this.$store.state.session.job
    }
  },
  watch: {
    job(value) {
      this.form.title = value.platform_job.title
      this.form.job_number = value.job_number
      this.form.rate = value.platform_job.rate
      this.form.locum_detail_rate_type = value.platform_job.locum_detail_rate_type.id
      this.form.total_hours = value.platform_job.total_hours
      this.job_description = value.platform_job.job_description
      this.extra_information = value.platform_job.extra_information
      this.report_to = value.platform_job.report_to
      this.phone_number = value.platform_job.practice.phone_number
      this.email = value.platform_job.email
      this.date_start = value.platform_job.date_start
      this.date_end = value.platform_job.date_end
      this.time_start = value.platform_job.time_start
      this.time_end = value.platform_job.time_end
      this.shift = value.platform_job.shift
      this.auto_assign_at = value.platform_job.auto_assign_at
      this.ir35 = value.platform_job.ir35
      this.profession = value.platform_job.profession
      this.qualifications = value.platform_job.qualifications
      this.clinical_systems = value.platform_job.clinical_systems
      this.spoken_languages = value.platform_job.spoken_languages
      this.compliance_documents = value.platform_job.compliance_documents
      this.mandatory_trainings = value.platform_job.mandatory_trainings
      this.practice = value.platform_job.practice
    }
  },
  created() {
    // get locum detail rate type
    this.$axios.$get(`/api/v1/locum-detail-rate-types`).then(res => {
      this.rate_types = []
      res.data.locum_detail_rate_types.forEach(item => {
        this.rate_types.push({ label: item.name, value: item.id })
      })
    })
    if (this.job && this.job.type === 'Platform') {
      this.form.title = this.job.platform_job.title
      this.form.job_number = this.job.job_number
      this.form.rate = this.job.platform_job.rate
      this.form.locum_detail_rate_type = this.job.platform_job.locum_detail_rate_type.id
      this.form.total_hours = this.job.platform_job.total_hours
      this.job_description = this.job.platform_job.job_description
      this.extra_information = this.job.platform_job.extra_information
      this.report_to = this.job.platform_job.report_to
      this.phone_number = this.job.platform_job.practice.phone_number
      this.email = this.job.platform_job.email
      this.date_start = this.job.platform_job.date_start
      this.date_end = this.job.platform_job.date_end
      this.time_start = this.job.platform_job.time_start
      this.time_end = this.job.platform_job.time_end
      this.shift = this.job.platform_job.shift
      this.auto_assign_at = this.job.platform_job.auto_assign_at
      this.ir35 = this.job.platform_job.ir35
      this.profession = this.job.platform_job.profession
      this.qualifications = this.job.platform_job.qualifications
      this.clinical_systems = this.job.platform_job.clinical_systems
      this.spoken_languages = this.job.platform_job.spoken_languages
      this.compliance_documents = this.job.platform_job.compliance_documents
      this.mandatory_trainings = this.job.platform_job.mandatory_trainings
      this.practice = this.job.platform_job.practice
    }
  },
  methods: {
    save() {

    },
    cancel() {

    }
  }
}
</script>
<style scoped>
</style>

