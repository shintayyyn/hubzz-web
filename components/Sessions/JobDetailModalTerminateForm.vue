<template>
  <section>
    <div class="bg-white rounded-lg shadow-lg p-4 md:p-8 mt-4">
      <div class="font-bold text-md sm:text-lg">Terminate this job</div>
      <!-- <AppInput
        v-model="form.terminate_reason"
        :type="'select'"
        :name="'terminate_reason'"
        :label="'Please select your reason'"
        :error="formError.find(item => item.field === 'terminate_reason')"
        :placeholder="'Select...'"
        :items="reasons"
      />-->
      <AppInput
        v-model="form.terminate_reason"
        :type="'textarea'"
        :name="'terminate_reason'"
        :label="'Please input your reason'"
        :resize="false"
        :error="formError.find(item => item.field === 'terminate_reason')"
      />
      <AppInput
        v-model="form.total_hours"
        :type="'number'"
        :name="'total_hours'"
        :label="'Total number of hours worked by Locum'"
        :placeholder="''"
        :inStyle="'text-align:right;'"
        :error="formError.find(item => item.field === 'total_hours')"
      />
      <AppButton :label="'Terminate job'" @click="terminateJob" />
    </div>
    <AppConfirmationModal
      :label="'Terminate this Job?'"
      :confirmLabel="'Yes'"
      :cancelLabel="'Cancel'"
      :modal="confirmation_modal"
      @confirm="terminate"
      @cancel="confirmation_modal = false"
    />
  </section>
</template>
<script>
import AppButton from "@/components/Base/AppButton";
import AppInput from "@/components/Base/AppInput";
import AppConfirmationModal from "@/components/Base/AppConfirmationModal";
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
];
export default {
  components: {
    AppButton,
    AppConfirmationModal,
    AppInput
  },
  props: ["job"],
  data() {
    return {
      reasons,
      confirmation_modal: false,
      form: {
        total_hours: null,
        terminate_reason: ""
      },
      formError: []
    };
  },
  watch: {
    "form.terminate_reason"() {
      this.CheckEmptyField(this.form.terminate_reason, "terminate_reason");
    },
    "form.total_hours"() {
      this.CheckEmptyField(this.form.total_hours, "total_hours");
    }
  },
  methods: {
    terminateJob() {
      this.formError = [];
      this.Validate(this.form);
      if (!this.formError.length) {
        this.confirmation_modal = true;
      }
    },
    terminate() {
      this.$axios
        .$put(`/api/v1/practice/jobs/${this.job.id}/terminate`, this.form)
        .then(res => {
          if (
            this.$route.path.includes("/sessions") ||
            this.$route.path.includes("/dashboard")
          ) {
            this.$store.commit(
              "jobs/REMOVE_PRACTICE_ALLOCATED_JOB",
              res.data.job.id
            );
            this.$store.commit(
              "jobs/REMOVE_PRACTICE_AVAILABLE_JOB",
              res.data.job.id
            );
            this.$store.commit(
              "jobs/REMOVE_PRACTICE_APPLIED_JOB",
              res.data.job.id
            );
            this.job.job_parts.forEach(({ id }) => {
              this.$store.commit("jobs/REMOVE_PRACTICE_ONGOING_JOB_PART", id);
            });
          }
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: ["Job terminated"]
          });
          this.$emit("close");
        });
    }
  }
};
</script>
