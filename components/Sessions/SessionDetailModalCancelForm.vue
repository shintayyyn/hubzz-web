<template>
  <section>
    <div class="rounded-lg shadow-lg p-8 mt-4">
      <div
        class="font-bold text-md sm:text-lg"
      >
        {{ job.status === 'Ongoing' ? 'Terminate':'Cancel' }} this job
      </div>
      <AppFormError v-if="formError.length" :form-error="formError" />

      <AppInput
        v-model="form.cancelled_reason"
        :type="'select'"
        :name="'cancelled_reason'"
        :label="'Please select your reason'"
        :error="formError.find(item => item.field === 'cancelled_reason')"
        :placeholder="'Select...'"
        :items="reasons"
      />

      <AppInput
        v-if="job.status === 'Ongoing'"
        v-model="has_absences"
        :type="'select'"
        :name="'has_absences'"
        :label="'Was the locum having any absences?'"
        :items="[{ label: 'Yes', value: true }, { label: 'No', value: false }]"
      />

      <template v-if="has_absences === 'true' || has_absences === true">
        <AppInput
          v-model="form.absent_days"
          :type="'number'"
          :name="'absent_days'"
          :label="'Days of Absent'"
          :in-style="'padding-top:0.5rem;padding-bottom:0.5rem;text-align:right'"
          :error="formError.find(item => item.field === 'absent_days')"
        />
        <AppInput
          v-model="form.absent_days_reason"
          :type="'textarea'"
          :name="'absent_days_reason'"
          :label="'Reason of Absence'"
          :placeholder="'For e.g. No-show'"
          :resize="false"
        />
      </template>

      <AppInput
        v-if="job.status === 'Ongoing'"
        v-model="has_late"
        :type="'select'"
        :name="'has_late'"
        :label="'Was the Locum late for this session?'"
        :items="[{ label: 'Yes', value: true }, { label: 'No', value: false }]"
      />

      <template v-if="has_late === 'true' || has_late === true">
        <AppInput
          v-model="form.late_hours"
          :type="'number'"
          :name="'late_hours'"
          :label="'Hours of Late'"
          :in-style="'padding-top:0.5rem;padding-bottom:0.5rem;text-align:right'"
          :error="formError.find(item => item.field === 'late_hours')"
        />
        <AppInput
          v-model="form.late_hours_reason"
          :type="'textarea'"
          :name="'late_hours_reason'"
          :label="'Reason of late'"
          :placeholder="'For e.g. Traffic'"
          :resize="false"
        />
      </template>

      <AppInput
        v-if="job.status === 'Ongoing'"
        v-model="form.final_hours"
        :type="'number'"
        :name="'final_hours'"
        :label="'Final hours'"
        :in-style="'padding-top:0.5rem;padding-bottom:0.5rem;text-align:right'"
        :error="formError.find(item => item.field === 'final_hours')"
      />
      <AppButton
        :label="`${job.status === 'Ongoing' ? 'Terminate' : 'Cancel'} job`"
        @click="confirmation_modal = true"
      />
    </div>
    <AppConfirmationModal
      :label="`${job.status === 'Ongoing' ? 'Terminate' : 'Cancel'} this job?`"
      :confirm-label="'Yes'"
      :cancel-label="'Cancel'"
      :modal="confirmation_modal"
      @confirm="cancel"
      @cancel="confirmation_modal = false"
    />
  </section>
</template>
<script>
import AppButton from "@/components/Base/AppButton"
import AppInput from "@/components/Base/AppInput"
import AppFormError from "@/components/Base/AppFormError"
import AppConfirmationModal from "@/components/Base/AppConfirmationModal"
const reasons = [
  {
    label: "In-house Locum can now cover the session",
    value: "In-house Locum can now cover the session"
  },
  {
    label: "Annual leave that session was required for has been cancelled",
    value: "Annual leave that session was required for has been cancelled"
  },
  {
    label: "Session had been double booked",
    value: "Session had been double booked"
  },
  {
    label: "Session booked in error, practice is closed for staff training",
    value: "Session booked in error, practice is closed for staff training"
  },
  {
    label: "Session booked in error, Bank Holiday",
    value: "Session booked in error, Bank Holiday"
  },
  {
    label: "Session cancelled due to budgetary constraints",
    value: "Session cancelled due to budgetary constraints"
  }
]
export default {
  components: {
    AppButton,
    AppInput,
    AppFormError,
    AppConfirmationModal
  },
  props: ["job"],
  data () {
    return {
      reasons,
      confirmation_modal: false,
      has_absences: false,
      has_late: false,
      form: {
        cancelled_reason: "",
        absent_days: 0,
        absent_days_reason: "",
        late_hours: 0,
        late_hours_reason: "",
        final_hours: 0
      },
      formError: []
    }
  },
  methods: {
    validateForm () {
      this.formError = []
      let notRequired = ["final_hours"]

      if (this.job.status !== "Ongoing") {
        notRequired.push(
          "absent_days",
          "absent_days_reason",
          "late_hours",
          "late_hours_reason"
        )
      } else if (this.job.status === "Ongoing") {
        if (this.has_absences === "false" || this.has_absences === false) {
          notRequired.push("absent_days", "absent_days_reason")
        }
        if (this.has_late === "false" || this.has_late === false) {
          notRequired.push("late_hours", "late_hours_reason")
        }
      }
      this.Validate(this.form, notRequired)
      if (!this.formError.length) {
        this.confirmation_modal = true
      }
    },
    cancel () {
      this.formError = []
      let notRequired = ["final_hours"]

      if (this.job.status !== "Ongoing") {
        notRequired.push(
          "absent_days",
          "absent_days_reason",
          "late_hours",
          "late_hours_reason"
        )
      } else if (this.job.status === "Ongoing") {
        if (this.has_absences === "false" || this.has_absences === false) {
          notRequired.push("absent_days", "absent_days_reason")
        }
        if (this.has_late === "false" || this.has_late === false) {
          notRequired.push("late_hours", "late_hours_reason")
        }
      }
      this.Validate(this.form, notRequired)
      if (!this.formError.length) {
        this.$axios
          .$put(`/api/v1/practice/jobs/${this.job.id}/cancel`, this.form)
          .then(res => {
            this.$store.commit(
              "jobs/REMOVE_PRACTICE_ALLOCATED_JOB",
              res.data.job.id
            )
            this.$store.commit(
              "jobs/REMOVE_PRACTICE_AVAILABLE_JOB",
              res.data.job.id
            )
            this.$store.commit(
              "jobs/REMOVE_PRACTICE_APPLIED_JOB",
              res.data.job.id
            )
            this.job.job_parts.forEach(({ id }) => {
              this.$store.commit("jobs/REMOVE_PRACTICE_ONGOING_JOB_PART", id)
            })
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: [
                `${
                  this.job.status === "Ongoing"
                    ? "Job terminated"
                    : "Job cancelled"
                }`
              ]
            })
            this.$emit("cancelled", this.job.id)
          })
      }
      this.confirmation_modal = false
    }
  }
}
</script>
