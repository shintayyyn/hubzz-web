<template>
  <div class="rounded-lg shadow-lg p-8 mt-8">
    <div class="text-base font-bold mb-4">You can unassign from this job</div>
    <div
      class="text-sm text-gray-700"
    >Cancellation should be at least be 72 hours before the start of the job.</div>
    <AppInput
      v-model="form.declined_reason"
      :type="'textarea'"
      :name="'declined_reason'"
      :label="'Please state here your reason.'"
      :error="this.formError.find(item => item.field === 'declined_reason')"
      :resize="false"
    />
    <AppButton :label="'Unassign from this job'" @click="unassign" />
  </div>
</template>
<script>
import AppButton from "@/components/Base/AppButton";
export default {
  props: ["job"],
  components: {
    AppButton
  },
  data() {
    return {
      form: {
        declined_reason: ""
      },
      formError: []
    };
  },
  methods: {
    unassign() {
      this.formError = [];
      this.Validate(this.form);
      if (!this.formError.length) {
        this.$axios
          .$post(`/api/v1/locum/jobs/${this.job.id}/decline`, this.form)
          .then(res => {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: ["Declined"]
            });
            this.$store.commit(
              "jobs/REMOVE_LOCUM_ALLOCATED_JOB",
              res.data.job.id
            );
            this.$store.commit("jobs/ADD_LOCUM_DECLINED_JOB", res.data.job);
            this.$emit("close");
          })
          .catch(err => {
            err.response.data.error_messages.forEach(error => {
              this.formError.push(error);
            });
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "danger",
              text: this.formError.map(error => error.message)
            });
          });
      } else {
        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "danger",
          text: ["Please fill up all the forms"]
        });
      }
    }
  }
};
</script>
