<template>
  <section>
    <div class="text-md font-bold">Form</div>
    <div class="rounded-lg shadow-lg flex flex-col p-8 mt-4">
      <AppFormError :formError="formError" v-if="formError.length" />
      <div class="flex flex-col">
        <AppInput
          v-model="form.absent_days"
          :type="'number'"
          :name="'absent_days'"
          :label="'Days of Absent'"
          :inStyle="'padding-top:0.5rem;padding-bottom:0.5rem;text-align:right'"
          :error="formError.find(item => item.field === 'absent_days')"
        />
        <AppInput
          v-model="form.final_hours"
          :type="'number'"
          :name="'final_hours'"
          :label="'Final hours'"
          :inStyle="'padding-top:0.5rem;padding-bottom:0.5rem;text-align:right'"
          :error="formError.find(item => item.field === 'final_hours')"
        />
        <AppInput
          v-model="form.late_hours"
          :type="'number'"
          :name="'late_hours'"
          :label="'Hours of Late'"
          :inStyle="'padding-top:0.5rem;padding-bottom:0.5rem;text-align:right'"
          :error="formError.find(item => item.field === 'late_hours')"
        />
        <AppButton
          :label="`Mark this week as Complete`"
          @click="confirmation_modal = true"
          :disabled="!isCompletable"
        />
      </div>
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
      form: {
        absent_days: null,
        final_hours: null,
        late_hours: null
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
      this.confirmation_modal = false;
      this.Validate(this.form);
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
                res.data.job_part.id
              );
            }
            this.$emit("close");
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: ["Job completed"]
            });
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
