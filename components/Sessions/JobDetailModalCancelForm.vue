<template>
  <section>
    <div class="rounded-lg shadow-lg p-8 mt-4">
      <div class="font-bold text-md sm:text-lg">Cancel this job</div>
      <AppInput
        v-model="form.cancelled_reason"
        :type="'select'"
        :name="'cancelled_reason'"
        :label="'Please select your reason'"
        :error="formError.find(item => item.field === 'cancelled_reason')"
        :placeholder="'Select...'"
        :items="reasons"
      />
      <AppButton :label="'Cancel job'" @click="cancelJob" />
    </div>
    <AppConfirmationModal
      :label="'Cancel this Job?'"
      :confirmLabel="'Yes'"
      :cancelLabel="'Cancel'"
      :modal="confirmation_modal"
      @confirm="cancel"
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
        cancelled_reason: ""
      },
      formError: []
    };
  },
  watch: {
    "form.cancelled_reason"() {
      this.CheckEmptyField(this.form.cancelled_reason, "cancelled_reason");
    }
  },
  methods: {
    cancelJob() {
      this.formError = [];
      this.Validate(this.form);
      if (!this.formError.length) {
        this.confirmation_modal = true;
      }
    },
    cancel() {
      let jobId = this.$route.params.id || this.job.id;
      this.$axios
        .$put(`/api/v1/practice/jobs/${jobId}/cancel`, this.form)
        .then(res => {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: ["Job cancelled"]
          });
          this.$emit("close");
        });
    }
  }
};
</script>
