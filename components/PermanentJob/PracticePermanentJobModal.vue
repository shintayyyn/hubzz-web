<template>
  <section ref="modalContainer">
    <div class="p-4 md:p-8">
      <nuxt-link
        :to="{
          path: $route.name.includes('hub-surgery-management') ? 
            `/hub-surgery-management/${$route.params.id}/surgery-permanent-jobs` : 
            `/permanent-jobs` ,
          query:$route.query
        }"
      >
        <svgicon name="left-arrow" height="32" width="32" class="cursor-pointer" />
      </nuxt-link>

      <div class="flex justify-start items-center flex-wrap md:px-2">
        <h4 class="text-lg md:text-xl font-bold mr-2">
          <span>{{ permanent_job.title }}</span>
        </h4>
        <span
          class="mr-2 py-2 px-4 rounded my-1 font-semibold"
          :class="statusStyle(permanent_job.job_posting_status)"
        >{{ permanent_job.job_posting_status }}</span>
        <span
          v-if="permanent_job.job_posting_status === 'Closed'"
          class="mr-2 py-2 px-4 rounded my-1 font-semibold bg-yellow-500"
        >
          {{ jobClosingTag(permanent_job.hired_through) }}
        </span>
        <!-- v-if="permanent_job.job_posting_status !== 'Unfilled'" -->
        <AppButton :label="editJobLabel(edit)" class="my-2" @click="edit = !edit" />
      </div>
      <div
        v-if="permanent_job.job_posting_status === 'Closed'" 
        class="bg-red-300 p-4 rounded-lg my-2"
      >
        <div>
          Closed At: {{ permanent_job.closed_at_in_gb_formatted }}
          <!-- Closed At: {{ $moment(permanent_job.closed_at, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]').format('DD/MM/YYYY, h:mm:ss a') }} -->
        </div>
        <div 
          v-if="$auth.user.domain === 'Practice'
            && permanent_job 
            && permanent_job.cancelled_reason"
          class="m-2"
        >
          Closed By Hub for the reason : {{ permanent_job && permanent_job.cancelled_reason ? permanent_job.cancelled_reason : null }}
        </div>
        <!-- This Job Posting has been closed by the Practice for the reason that someone might have already been hired {{ permanent_job.hired_through === 'Through HUBZZ' ? "thru HUBZZ." : "thru Direct Hiring." }} -->
      </div>
      <div class="flex flex-col md:flex-row">
        <div class="md:mx-2 w-full md:w-3/5 lg:w-1/2">
          <div class="bg-white rounded-lg shadow-lg p-4 mb-4 flex flex-col items-start">
            <!-- VIEW PERMANENT JOB DETAILS -->
            <template v-if="edit === false">
              <div class="w-full flex flex-col md:flex-row">
                <div class="w-full md:flex-w-1/2">
                  <p class="font-bold">
                    Practice
                  </p>
                  <p class="pl-2 pb-3">
                    {{ permanent_job ? permanent_job.practice.name : '' }}
                  </p>
                  <p class="font-bold">
                    Salary
                  </p>
                  <p class="pl-2 pb-3">
                    <template v-if="permanent_job && permanent_job.salary_amount !== 0">
                      £ {{ permanent_job.salary_amount | currency }}
                    </template>
                    <template v-else>
                      N/A
                    </template>
                  </p>
                  <p class="font-bold">
                    Salary Description
                  </p>
                  <p class="pl-2 pb-3">
                    {{ permanent_job && permanent_job.salary_description_2 ? permanent_job.salary_description_2 : 'N/A' }}
                  </p>
                  <p class="font-bold">
                    Posted
                  </p>
                  <p class="pl-2 pb-3">
                    {{ permanent_job ? $moment(permanent_job.date_posted).format('DD/MM/YYYY') : '' }}
                  </p>
                  <p class="font-bold">
                    Closes
                  </p>
                  <p class="pl-2 pb-3">
                    {{ permanent_job ? $moment(permanent_job.date_closing).format('DD/MM/YYYY') : '' }}
                  </p>
                </div>

                <div class="w-full md:flex-w-1/2">
                  <p class="font-bold">
                    Email
                  </p>
                  <p class="pl-2 pb-3">
                    {{ permanent_job ? permanent_job.email : '' }}
                  </p>

                  <p class="font-bold">
                    Report to
                  </p>
                  <p class="pl-2 pb-3">
                    {{ permanent_job ? permanent_job.report_to : '' }}
                  </p>

                  <p class="font-bold">
                    Role
                  </p>
                  <p class="pl-2 pb-3">
                    {{ permanent_job ? permanent_job.professions.name : '' }}
                  </p>

                  <p class="font-bold">
                    Hours
                  </p>
                  <p class="pl-2 pb-3">
                    {{ permanent_job ? permanent_job.work_hours : '' }}
                  </p>

                  <p class="font-bold">
                    Industry
                  </p>
                  <p class="pl-2 pb-3">
                    {{ permanent_job ? permanent_job.industry_type : '' }}
                  </p>
                </div>
              </div>
              <p class="font-bold">
                Description
              </p>
              <div>
                <no-ssr>
                  <quill-editor
                    class="border-none break-all"
                    :options="options"
                    :content="permanent_job.description"
                    disabled
                  />
                </no-ssr>
              </div>

              <div
                v-if="
                  $route.name.includes('hub-surgery-management') && 
                    $auth.user.practice_detail.practice.type === 'Hub' &&
                    permanent_job.job_posting_status === 'Pending'"
                class="w-full"
              >
                <AppButton
                  class="font-semibold"
                  :label="'Approve'"
                  :custom-theme="'bg-green-500 hover:bg-green-600 text-white'"
                  @click="acceptRejectSpokePermanentJob('Approved')"
                />
                <AppButton
                  class="font-semibold"
                  :label="'Reject'"
                  :custom-theme="'bg-red-500 hover:bg-red-600 text-white'"
                  @click="showCancel = true"
                />
                <div v-if="showCancel === true" class="mt-2 w-full">
                  <AppInput
                    v-if="showCancel === true"
                    v-model="approve_or_reject.cancelled_reason"
                    :type="'textarea'"
                    :label="'Reason for Rejection'"
                    :name="'cancelled_reason'"
                    :rows="3"
                    :error="formError.find(item => item.field === 'cancelled_reason')"
                    :resize="false"
                  />
                  <AppButton
                    class="font-semibold -mt-8"
                    :label="'Submit'"
                    @click="acceptRejectSpokePermanentJob('Rejected')"
                  />
                  <AppButton
                    class="font-semibold -mt-8"
                    :label="'Cancel'"
                    @click="showCancel = false, formError=[]"
                  />
                </div>
              </div>
            </template>
            <!-- EDIT PERMANENT JOB -->
            <template v-if="edit === true">
              <!-- IF JOB IS NOT YET CLOSED -->
              <AppDate
                v-if="permanent_job.job_posting_status !== 'Closed' && permanent_job.job_posting_status !== 'Unfilled'"
                v-model="form.date_closing"
                :name="'date_closing'"
                :label="'Date Closing'"
                is-after
                :start-date="$moment(form.date_posted).add(1, 'days').format('YYYY-MM-DD')"
                :error="formError.find(item => item.field === 'date_closing')"
              />
              <!-- IF JOB IS NOW CLOSED -->
              <div
                v-else
                class="w-full flex flex-col md:flex-row"
              >
                <!-- LEFT -->
                <div class="w-full md:flex-w-1/2 pr-2">
                  <p class="font-bold">
                    Title
                  </p>
                  <AppInput
                    v-model="form.title"
                    :type="'text'"
                    :name="'title'"
                    :error="formError.find(item => item.field === 'title')"
                  />

                  <p class="font-bold">
                    Practice
                  </p>
                  <AppInput
                    v-model="form.practice_id"
                    :type="'select'"
                    :name="'practice_id'"
                    :placeholder="'Select...'"
                    :error="formError.find(item => item.field === 'practice_id')"
                    :items="practice_lists"
                    @blur="CheckEmptyField(form.practice_id, 'practice_id')"
                  />

                  <p class="font-bold">
                    Salary
                  </p>
                  <div class="flex flex-wrap">
                    <AppInput
                      v-model="form.salary_amount"
                      class="w-full pr-1"
                      :type="'number'"
                      :name="'salary_amount'"
                      :label="'Salary Amount'"
                      :min="0"
                      :in-style="'text-align:right'"
                      :limit="8"
                    />
                    <AppInput
                      v-model="form.salary_description_2"
                      class="w-full pl-1"
                      :type="'select'"
                      :name="'salary_description_2'"
                      :placeholder="'Select...'"
                      :label="'Salary Description'"
                      :error="formError.find(item => item.field === 'salary_description_2')"
                      :items="salary_description_type_2"
                      :disabled="!form.salary_amount"
                      @blur="CheckEmptyField(form.salary_description_2, 'salary_description_2')"
                    />
                  </div>

                  <AppDate
                    v-model="form.date_posted"
                    :name="'date_posted'"
                    :label="'Date Posted'"
                    is-after
                    disabled
                    :error="formError.find(item => item.field === 'date_posted')"
                  />

                  <AppDate
                    v-model="form.date_closing"
                    :name="'date_closing'"
                    :label="'Date Closing'"
                    is-after
                    :start-date="form.date_posted"
                    :error="formError.find(item => item.field === 'date_closing')"
                  />
                </div>
                <!-- RIGHT -->
                <div class="w-full md:flex-w-1/2 pl-2">
                  <p class="font-bold">
                    E-Mail
                  </p>
                  <AppInput
                    v-model="form.email"
                    :type="'text'"
                    :name="'email'"
                    :error="formError.find(item => item.field === 'email')"
                  />

                  <p class="font-bold">
                    Report to
                  </p>
                  <AppInput
                    v-model="form.report_to"
                    :type="'text'"
                    :name="'report_to'"
                    :error="formError.find(item => item.field === 'report_to')"
                  />

                  <p class="font-bold">
                    Role
                  </p>
                  <AppInput
                    v-model="form.profession_id"
                    :type="'select'"
                    :name="'profession_id'"
                    :placeholder="'Select...'"
                    :error="formError.find(item => item.field === 'profession_id')"
                    :items="professions"
                    @blur="CheckEmptyField(form.profession_id, 'profession_id')"
                  />

                  <p class="font-bold">
                    Hours
                  </p>
                  <AppInput
                    v-model="form.work_hours"
                    :type="'select'"
                    :name="'work_hours'"
                    :placeholder="'Select...'"
                    :label="'Work Hours'"
                    :error="formError.find(item => item.field === 'work_hours')"
                    :items="work_hours_type"
                    @blur="CheckEmptyField(form.work_hours, 'work_hours')"
                  />

                  <p class="font-bold">
                    Industry
                  </p>
                  <AppInput
                    v-model="form.industry_type"
                    :type="'select'"
                    :name="'industry_type'"
                    :placeholder="'Select...'"
                    :error="formError.find(item => item.field === 'industry_type')"
                    :items="industry_types"
                    @blur="CheckEmptyField(form.industry_type, 'industry_type')"
                  />
                </div>
              </div>
              <!-- DESCRIPTION BOX -->
              <div 
                v-if="permanent_job.job_posting_status === 'Closed'"
                class="w-full"
              >
                <p class="font-bold">
                  Description
                </p>
                <no-ssr placeholder="Loading...">
                  <quill-editor
                    ref="myTextEditor"
                    v-model="form.description"
                    class="bg-white text-black border-b-2 mb-3 md:mb-6 w-full"
                    :options="editorOption"
                    @blur="CheckEmptyField(form.description, 'description')"
                    @focus="onEditorFocus($event)"
                    @ready="onEditorReady($event)"
                  />
                </no-ssr>
              </div>
              <!-- <p class="font-bold">Update Remarks</p>
              <AppInput
                v-model="form.update_remarks"
                :type="'textarea'"
                :name="'update_remarks'"
                :error="formError.find(item => item.field === 'update_remarks')"
                :resize="false"
                :rows="4"
              />-->
              <AppButton v-if="permanent_job.job_posting_status === 'Available' || permanent_job.job_posting_status === 'Pending'" :label="'Save Changes'" @click="editPermanentJob()" />
              <AppButton v-if="permanent_job.job_posting_status === 'Closed' || permanent_job.job_posting_status === 'Unfilled'" :label="'Confirm Repost Job'" @click="repostPermanentJob()" />
            </template>
          </div>
          <PermanentJobMap
            v-if="permanent_job && permanent_job.job_posting_status === 'Closed' && permanent_job.appointed_to_locum_user_id"
            :permanent_job="permanent_job"
          />
        </div>

        <div v-if="permanent_job" class="md:mx-2 w-full md:w-2/5 lg:w-1/2">
          <PermanentJobCandidates
            :permanent_job="permanent_job"
          />
          <PermanentJobMap
            :permanent_job="permanent_job"
          />

          <template v-if="permanent_job.appointed_to_locum_user_id">
            <PermanentJobLocum class="my-4" :user="assignedLocum" />
          </template>

          <AppButton
            v-if="permanent_job.job_posting_status !== 'Closed' && permanent_job.job_posting_status !== 'Unfilled'"
            class="my-4"
            :label="'Close Job'"
            @click="toCloseJob = !toCloseJob"
          />

          <div v-if="toCloseJob === true">
            <AppInput
              v-model="form.hired_through"
              :label="'Closing Job Due to External Reason? (Optional)'"
              :type="'select'"
              :name="'hired_through'"
              :placeholder="'Select...'"
              :items="hired_through"
            />
            <AppButton class="my-4" :label="'Confirm'" @click="forceCloseJob()" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import AppButton from "@/components/Base/AppButton"
import AppInput from "@/components/Base/AppInput"
import AppDate from "@/components/Base/AppDate"
// import PermanentJobShowCandidate from "@/components/PermanentJob/PermanentJobShowCandidate"
import PermanentJobCandidates from "@/components/PermanentJob/PermanentJobCandidates"
import PermanentJobMap from "@/components/PermanentJob/PermanentJobMap"
import PermanentJobLocum from "@/components/PermanentJob/PermanentJobLocum"
export default {
  components: {
    AppInput,
    AppButton,
    AppDate,
    PermanentJobCandidates,
    PermanentJobMap,
    PermanentJobLocum,
  },
  data () {
    return {
      options: {
        modules: {
          toolbar: null
        }
      },
      edit: false,
      toCloseJob: false,
      modal: false,
      permanent_job: "",

      approve_or_reject: {
        approved_or_rejected: "",
        cancelled_reason: ""
      },
      showCancel: false,

      form: {
        practice_id: "",
        parent_practice_id: "",
        title: "",
        description: "",
        date_posted: this.$moment().format("YYYY-MM-DD"),
        date_closing: "",
        email: "",
        report_to: "",
        profession_id: "",
        industry_type: "",
        salary_amount: null,
        salary_description_2: "",
        work_hours: "",
        hired_through: "",
        update_remarks: ""
      },
      salary_range: false,
      practice_lists: [],
      work_hours_type: [],
      industry_types: [],
      salary_description_type_1: [],
      salary_description_type_2: [],
      professions: [],
      professions_categories: [],

      hired_through: [],
      put_hired_through: "",

      postingProfession: "",

      assignedLocum: null,

      formError: [],

      // quill
      editorOption: {
        placeholder: "Please type the description here",
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            ["blockquote", "code-block"],
            [{ header: 1 }, { header: 2 }],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ script: "sub" }, { script: "super" }],
            [{ size: ["small", false, "large", "huge"] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ font: [] }],
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
            ["clean"],
            ["link"]
          ]
        }
      }
      // displayOption: {
      // 	modules: {
      // 		toolbar: null
      // 	}date_posted
      // }
    }
  },
  watch: {
    edit (value) {
      if (value === false) {
        this.getPermanentJob()
      } else {
        this.form.practice_id = this.permanent_job.practice_id
        this.form.parent_practice_id = this.permanent_job.parent_practice_id 
          || this.$auth.user.practice_detail.practice.parent_practice_id 
          ? this.permanent_job.parent_practice_id
            || this.$auth.user.practice_detail.practice.parent_practice_id : null
        this.form.title = this.permanent_job.title
        this.form.description = this.permanent_job.description
        this.form.date_posted = this.$moment().format("YYYY-MM-DD"),
        this.form.date_closing = this.$moment(
          this.permanent_job.date_closing
        ).format("YYYY-MM-DD")
        this.form.email = this.permanent_job.email
        this.form.report_to = this.permanent_job.report_to
        this.form.industry_type = this.permanent_job.industry_type
        this.form.salary_amount = this.permanent_job.salary_amount
          ? this.permanent_job.salary_amount
          : 0
        this.form.salary_description_2 = this.permanent_job.salary_description_2
        this.form.work_hours = this.permanent_job.work_hours
        this.form.practice_id = this.permanent_job.practice_id
        this.form.profession_id = this.permanent_job.profession_id
        this.loading = false
      }
    },
    "form.date_posted" (value) {
      if (this.$moment(value).isAfter(this.form.date_closing)) {
        this.formError.push({
          field: "date_closing",
          message: "Date Closing is not valid"
        })
      }
    },
    "form.date_closing" (value) {
      if (this.$moment(value).isBefore(this.form.date_posted)) {
        this.formError.push({
          field: "date_posted",
          message: "Date Posted is not valid"
        })
      }
      let index = this.formError.findIndex(
        item => item.field === "date_closing"
      )
      if (this.$moment(value).isAfter(this.form.date_posted)) {
        this.formError.splice(index, 1)
      }
    },
    "form.salary_amount" (oldValue, value) {
      if (value) {
        this.validateNumber(this.form.salary_amount, "salary_amount")
      }
    }
  },
  created () {
    console.log('router name', this.$route.name)
    this.loading = true
    this.getPermanentJob(),
    Promise.all([
      this.$axios.$get("/api/v1/practice/me/practice-job-practices"),
      this.$axios.$get("/api/v1/locum-detail-rate-types"),
      this.$axios.$get("/api/v1/shifts"),
      this.$axios.$get("/api/v1/professions"),
    ])
      .then(
        ([
          responsePracticeLists,
          responseRateLists,
          responseShifts,
          responseProfessions,
        ]) => {
          this.practice_lists = []
          responsePracticeLists.data.practices.forEach(item => {
            this.practice_lists.push({
              label: item.surgery.name,
              value: item.id,
            })
          })
          this.rate_lists = []
          responseRateLists.data.locum_detail_rate_types.forEach(item => {
            this.rate_lists.push({ label: item.name, value: item.id, })
          })
          this.shifts = []
          responseShifts.data.shifts.forEach(item => {
            this.shifts.push({ label: item.name, value: item.id, })
          })
          this.professions = []
          responseProfessions.data.professions.forEach(item => {
            this.professions.push({ label: item.name, value: item.id, })
            this.professions_categories.push(item)
          })
        }
      )
      .finally(() => {
        this.form.title = this.permanent_job.title
        this.form.description = this.permanent_job.description
        this.form.date_posted = this.$moment(
          this.permanent_job.date_posted
        ).format("YYYY-MM-DD")
        this.form.date_closing = this.$moment(
          this.permanent_job.date_closing
        ).format("YYYY-MM-DD")
        this.form.email = this.permanent_job.email
        this.form.report_to = this.permanent_job.report_to
        this.form.industry_type = this.permanent_job.industry_type
        this.form.salary_amount = this.permanent_job.salary_amount
        this.form.salary_description_2 = this.permanent_job.salary_description_2
        this.form.work_hours = this.permanent_job.work_hours
        this.form.practice_id = this.permanent_job.practice_id
        this.form.parent_practice_id = this.permanent_job.parent_practice_id 
          || this.$auth.user.practice_detail.practice.parent_practice_id 
          ? this.permanent_job.parent_practice_id
            || this.$auth.user.practice_detail.practice.parent_practice_id : null
        this.form.profession_id = this.permanent_job.profession_id
        this.loading = false
      })
    this.work_hours_type = [
      {
        label: "Part Time",
        value: "Part Time"
      },
      {
        label: "Full Time",
        value: "Full Time",
      }
    ]
    this.industry_types = [
      {
        label: "NHS",
        value: "NHS",
      },
      {
        label: "Private",
        value: "Private",
      }
    ]
    this.salary_description_type_2 = [
      {
        label: "Negotiable",
        value: "Negotiable",
      },
      {
        label: "Non-negotiable",
        value: "Non-negotiable",
      }
    ]
    this.hired_through = [
      {
        label: "Filed through HUBZZ",
        value: "Filed through HUBZZ",
      },
      {
        label: "Filed through Recruitment Agency",
        value: "Filed through Recruitment Agency",
      },
      {
        label: "Filed by Direct Applicant",
        value: "Filed by Direct Applicant",
      },
      {
        label: "Filed by Advert",
        value: "Filed by Advert",
      },
      {
        label: "Filed Internally",
        value: "Filed Internally",
      },
      {
        label: "Withdrawn",
        value: "Withdrawn",
      },
    ]
  },
  methods: {
    validateNumber (value, fieldName) {
      let displayFieldName =
        fieldName.charAt(0).toUpperCase() +
        fieldName.slice(1).replace(/_/g, " ")
      let index = this.formError.findIndex(item => item.field === fieldName)
      if (
        parseInt(value) < 1 ||
        value.toString().includes("e") ||
        value === ""
      ) {
        this.formError.push({
          field: fieldName,
          message: `${displayFieldName} is invalid`,
        })
      } else {
        this.formError.splice(index, 1)
      }
    },
    
    async getPermanentJob () {
      let permJobId = ""
      if (this.$route.name.includes("hub-surgery-management")) {
        permJobId = this.$route.params.permJobId
      } else {
        permJobId = this.$route.params.id
      }

      this.$axios
        .$get(`/api/v1/practice/permanent-jobs/${permJobId}`)
        .then(res => {
          this.permanent_job = res.data.permanent_job
        })
        .finally(() => {
          if (this.permanent_job.appointed_to_locum_user_id) {
            this.getAssignedLocum(
              this.permanent_job.appointed_to_locum_user_id
            )
          }
        })
    },
    
    getAssignedLocum (userID) {
      this.$axios.$get(`/api/v1/practice/locums/${userID}`).then(res => {
        this.assignedLocum = res.data.user
        console.log("assignedLocum", this.assignedLocum)
      })
    },
    
    editJobLabel (edit) {
      console.log("edit", edit)
      if (
        (edit === false &&
          this.permanent_job.job_posting_status == "Available") ||
        this.permanent_job.job_posting_status == "Pending"
      ) {
        console.log("status", this.permanent_job.job_posting_status)
        return "Edit Closing Date"
      }
      if (
        (edit === false && this.permanent_job.job_posting_status == "Closed") ||
        this.permanent_job.job_posting_status == "Unfilled"
      ) {
        console.log("status", this.permanent_job.job_posting_status)
        return "Re-post Job"
      }
      if (edit === true) {
        console.log("status", this.permanent_job.job_posting_status)
        return "Cancel"
      }
    },
    
    editPermanentJob () {
      this.formError = []

      let notRequired = [
        "parent_practice_id",
        "salary_amount",
        "salary_description_2",
        "hired_through", 
        "update_remarks",
      ]

      if(this.form.salary_amount){
        this.validateNumber(this.form.salary_amount, "salary_amount")
      }

      this.Validate(this.form, notRequired)

      console.log("form",this.form)
      console.log("errors: ",this.formError)

      if (!this.formError.length) {
        this.$axios
          .$put(
            `/api/v1/practice/permanent-jobs/${this.permanent_job.id}`,
            {
              ...this.form,
              salary_amount : this.form.salary_amount ? this.form.salary_amount : 0
            }
          )
          .then(() => {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: ["Successfully Edited Job"]
            })
            this.edit = false
          })
          .catch(err => {
            this.formError = err.response.data.error_messages
          })
      }
    },

    async repostPermanentJob () {
      this.formError = []
      let notRequired = [
        'parent_practice_id',
        'salary_amount',
        'salary_description_2',
        'hired_through',
        'update_remarks',
      ]

      this.Validate(this.form, notRequired)

      console.log("form",this.form)
      console.log("errors: ",this.formError)

      if (!this.formError.length) {
        await this.$axios
          .post(`/api/v1/practice/permanent-jobs`, {
            ...this.form,
            salary_amount: this.form.salary_amount ? this.form.salary_amount : 0,
          })
          .then((res) => {
            console.log('res', res)
            let goToRoute = this.$route.name.includes("hub-surgery-management") 
              ? `/hub-surgery-management/${this.$route.params.id}/surgery-permanent-jobs`
              :`/permanent-jobs`

            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: ["Successfully Created Permanent Job"]
            })
            this.$router.push(goToRoute)
          })
          .catch(err => {
            this.formError = err.response.data.error_messages
            console.log('eror', err)
            this.$nextTick(() => {
              this.$refs.modalContainer.scrollTop = 0
            })
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "danger",
              text: [err.response.data.message]
            })
          })
      } else {
        this.$nextTick(() => {
          // this.$refs.modalContainer.scrollTop = 0
        })
      }
    },
    
    async forceCloseJob () {
      await this.$axios
        .$put(
          `/api/v1/practice/permanent-jobs/${this.permanent_job.id}/force-close-job`,
          {
            hired_through: this.form.hired_through === 'Closed by Practice' ? null : this.form.hired_through 
          }
        )
        .then(() => {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: ["Successfully Closed Job"]
          })
          this.$router.go(-1)
        })
    },

    async acceptRejectSpokePermanentJob (approveReject) {
      this.formError = []
      let notRequired = []

      this.approve_or_reject.approved_or_rejected = approveReject
      if(approveReject === "Approved"){
        notRequired.push("cancelled_reason")
      }
      this.Validate(this.approve_or_reject, notRequired)

      if (!this.formError.length) {
        await this.$axios
          .$put(
            `/api/v1/practice/permanent-jobs/${this.permanent_job.id}/approve-or-reject`,
            this.approve_or_reject
          )
          .then(() => {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: [`Job  has successfully ${this.approve_or_reject.approved_or_rejected}`]
            })
            this.$router.go(-1)
          })
      }
			
    },
    
    onEditorBlur (editor) {
      console.log ("editor blur!", editor)
    },
    
    onEditorFocus (editor) {
      console.log ("editor focus!", editor)
    },
    
    onEditorReady (editor) {
      console.log ("editor ready!", editor)
    },
    
    statusStyle (jobPostingStatus) {
      switch (jobPostingStatus) {
      case "Available":
        return "bg-green-500 text-white"
      case "Closed":
        return "bg-red-700 text-white"
      case "Unfilled":
        return "bg-gray-700 text-white"
      default:
        return "bg-yellow-400 text-black"
      }
    },
    jobClosingTag (jobClosingTag) {
      switch(jobClosingTag) {
      case "Direct Hiring":
        return "Hired Directly"
      case "Through HUBZZ":
        return "Hired Through Hubzz"
      default:
        return "Closed By Practice"
      }
    },
  },
}
</script>

<style scoped>
/* .modal-container {
	z-index: 510;
}
@media screen and (min-width: 1200px) {
	.modal-container {
		width: 80%;
	}
} */

.wrapper {
	max-height: 500px;
}

.quill-editor .ql-container,
.wrapper {
	overflow-y: auto;
}
.quill-editor .ql-container {
	max-height: 300px;
	padding: 8px 0;
}
</style>
