<template>
  <section>
    <div class="rounded-lg shadow-lg bg-white flex flex-col p-4 md:p-8 mt-4">
      <div class="font-bold text-md sm:text-lg">Complete Form</div>
      <AppFormError :formError="formError" v-if="formError.length" />
      <AppInput
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
          :inStyle="'padding-top:0.5rem;padding-bottom:0.5rem;text-align:right'"
          :error="formError.find(item => item.field === 'absent_days')"
        />
        <AppInput
          v-model="form.reason_of_absence"
          :type="'textarea'"
          :name="'reason_of_absence'"
          :label="'Reason of Absence'"
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
      <AppButton :label="`Mark this week as Complete`" @click="checkIfCanComplete" />
    </div>
    <AppConfirmationModal
      :label="'Mark this week as Completed?'"
      :confirmLabel="'Yes'"
      :cancelLabel="'Cancel'"
      :modal="confirmation_modal"
      @confirm="complete"
      @cancel="confirmation_modal = false"
    />
    <AppConfirmationModal
      :label="ignore_modal_label"
      :confirmLabel="'OK'"
      :modal="ignore_modal"
      @confirm="ignore_modal = false"
    />
  </section>
</template>
<script>
import AppButton from "@/components/Base/AppButton";
import AppInput from "@/components/Base/AppInput";
import AppFormError from "@/components/Base/AppFormError";
import AppConfirmationModal from "@/components/Base/AppConfirmationModal";
export default {
  props: ["job_part"],
  components: {
    AppButton,
    AppInput,
    AppFormError,
    AppConfirmationModal
  },
  data() {
    return {
      confirmation_modal: false,
      ignore_modal: false,
      ignore_modal_label: "",
      has_absences: false,
      has_late: false,
      form: {
        absent_days: 0,
        reason_of_absence: "",
        late_hours: 0,
        late_hours_reason: "",
        final_hours: 0
      },
      formError: []
    };
  },
  mounted() {
    this.form.final_hours = this.job_part.final_hours.toFixed(2);
  },
  computed: {
    isPreviousJobPartComplete() {
      return !this.job_part.job.job_parts
        .filter(jobPart => !jobPart.completed_at)
        .map(jobPart => jobPart.part)
        .includes(this.job_part.part - 1);
    },
    isCurrentDatePastTheEndDate() {
      return (
        this.$moment(
          `${this.job_part.date_end} ${this.job_part.time_end}`,
          "YYYY-MM-DD HH:mm"
        ).diff(this.$moment(), "minutes") < 0
      );
    }
  },
  methods: {
    checkIfCanComplete() {
      this.confirmation_modal = true;
      //   if (this.isPreviousJobPartComplete && this.isCurrentDatePastTheEndDate) {
      //     this.confirmation_modal = true;
      //   } else if (!this.isPreviousJobPartComplete) {
      //     this.ignore_modal = true;
      //     this.ignore_modal_label =
      //       "You need to complete the previous week first";
      //   } else if (!this.isCurrentDatePastTheEndDate) {
      //     this.ignore_modal = true;
      //     this.ignore_modal_label =
      //       "You cannot complete a Job part that has not yet past the end date";
      //   }
    },
    complete() {
      this.formError = [];
      let notRequired = [];
      this.confirmation_modal = false;
      if (this.has_absences === "false" || this.has_absences === false) {
        this.form.absent_days = 0;
        notRequired.push("absent_days", "reason_of_absence");
      }
      if (this.has_late === "false" || this.has_late === false) {
        this.form.late_hours = 0;
        notRequired.push("late_hours", "late_hours_reason");
      }
      this.Validate(this.form, notRequired);
      if (!this.formError.length) {
        this.$axios
          .$put(
            `/api/v1/practice/job-parts/${this.job_part.id}/complete`,
            this.form
          )
          .then(res => {
            if (
              this.$route.path.includes("/dashboard") ||
              this.$route.path.includes("/sessions")
            ) {
              this.$store.commit(
                "jobs/REMOVE_PRACTICE_ONGOING_JOB_PART",
                this.job_part.id
              );
            }
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: ["Job Part completed"]
            });
            this.$emit("completed");
            setTimeout(() => {
              this.$router.push({
                path: `/sessions/${this.job_part.id}`,
                query: { ...this.$route.query }
              });
            }, 500);
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
