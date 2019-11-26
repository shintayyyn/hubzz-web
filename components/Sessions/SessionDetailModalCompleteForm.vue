<template>
  <section>
    <div class="rounded-lg shadow-lg flex flex-col p-8 mt-4">
      <div class="font-bold text-md sm:text-lg">Complete Form</div>
      <AppFormError :formError="formError" v-if="formError.length" />
      <AppInput
        v-model="has_absences"
        :type="'select'"
        :name="'has_absences'"
        :label="'Was the locum has any absences?'"
        :items="[{ label: 'Yes', value: true }, { label: 'No', value: false }]"
      />
      <template v-if="has_absences === 'true' || has_absences === true">
        <AppInput
          v-model="form.absent_days"
          :type="'number'"
          :name="'absent_days'"
          :label="'Days of Absent'"
          :inStyle="'padding-top:0.5rem;padding-bottom:0.5rem;text-align:right'"
          :error="formError.find(item => item.field === 'absent_days')"
        />
        <AppInput
          v-model="form.absent_days_reason"
          :type="'textarea'"
          :name="'absent_days_reason'"
          :label="'Withdrawal Status'"
          :placeholder="'For e.g. No-show'"
          :resize="false"
        />
      </template>
      <AppInput
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
          :inStyle="'padding-top:0.5rem;padding-bottom:0.5rem;text-align:right'"
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
        v-model="form.final_hours"
        :type="'number'"
        :name="'final_hours'"
        :label="'Final hours'"
        :inStyle="'padding-top:0.5rem;padding-bottom:0.5rem;text-align:right'"
        :error="formError.find(item => item.field === 'final_hours')"
      />
      <AppButton
        :label="`Mark this week as Complete`"
        @click="confirmation_modal = true"
        :disabled="!isCompletable"
      />
    </div>
    <AppConfirmationModal
      :label="'Mark this week as Completed?'"
      :confirmLabel="'Yes'"
      :cancelLabel="'Cancel'"
      :modal="confirmation_modal"
      @confirm="complete"
      @cancel="cancel"
    />
  </section>
</template>
<script>
import AppButton from "@/components/Base/AppButton";
import AppInput from "@/components/Base/AppInput";
import AppFormError from "@/components/Base/AppFormError";
import AppConfirmationModal from "@/components/Base/AppConfirmationModal";
export default {
  props: ["job"],
  components: {
    AppButton,
    AppInput,
    AppFormError,
    AppConfirmationModal
  },
  data() {
    return {
      confirmation_modal: false,
      has_absences: false,
      has_late: false,
      form: {
        absent_days: 0,
        absent_days_reason: "",
        late_hours: 0,
        late_hours_reason: "",
        final_hours: 0
      },
      formError: []
    };
  },
  computed: {
    isCompletable() {
      return !this.job.job.job_parts
        .filter(jobPart => !jobPart.completed_at)
        .map(jobPart => jobPart.part)
        .includes(this.job.part - 1);
    }
  },
  methods: {
    cancel() {
      this.form.late_hours = null;
      this.form.final_hours = null;
      this.form.absent_days = null;
      this.confirmation_modal = false;
    },
    complete() {
      this.formError = [];
      let notRequired = [];
      this.confirmation_modal = false;
      if (this.has_absences === "false" || this.has_absences === false) {
        this.form.absent_days = 0;
        notRequired.push("absent_days", "absent_days_reason");
      }
      if (this.has_late === "false" || this.has_late === false) {
        this.form.late_hours = 0;
        notRequired.push("late_hours", "late_hours_reason");
      }
      this.Validate(this.form, notRequired);
      if (!this.formError.length) {
        this.$axios
          .$put(`/api/v1/practice/job-parts/${this.job.id}/complete`, this.form)
          .then(res => {
            if (
              this.$route.path.includes("/dashboard") ||
              this.$route.path.includes("/sessions")
            ) {
              this.$store.commit(
                "jobs/REMOVE_PRACTICE_ONGOING_JOB_PART",
                this.job.id
              );
            }
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: ["Job completed"]
            });
            this.$emit("completed");
          })
          .catch(err => {
            if (!err.response.data.error_messages) {
              this.formError.push({ message: err.response.data.message });
            } else {
              err.response.data.error_messages.forEach(error => {
                this.formError.push(error);
              });
            }
          })
          .finally(() => {
            this.confirmation_modal = false;
          });
      }
    }
  }
};
</script>
