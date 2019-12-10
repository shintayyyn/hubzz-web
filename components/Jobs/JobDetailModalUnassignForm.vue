<template>
  <div class="relative bg-white rounded-lg shadow-lg p-4 md:p-8 mt-8">
    <div class="text-base font-bold mb-4">You can unassign from this job</div>
    <div
      class="text-sm text-gray-700"
    >Cancellation should be at least be 72 hours before the start of the job.</div>
    <AppInput
      :ref="'unassignTextArea'"
      v-model="form.declined_reason"
      :type="'textarea'"
      :name="'declined_reason'"
      :label="'Please state here your reason.'"
      :error="this.formError.find(item => item.field === 'declined_reason')"
      :resize="false"
    />
    <AppButton :label="'Unassign from this job'" @click="unassign" :disabled="loading" />
    <AppLoading :loading="loading" spinner />
  </div>
</template>
<script>
import AppLoading from "@/components/Base/AppLoading";
import AppButton from "@/components/Base/AppButton";
import AppInput from "@/components/Base/AppInput";
export default {
  props: ["job"],
  components: {
    AppLoading,
    AppButton,
    AppInput
  },
  data() {
    return {
      loading: false,
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
        this.loading = true;
        this.$axios
          .$post(`/api/v1/locum/jobs/${this.job.id}/decline`, this.form)
          .then(res => {
            this.$store.commit(
              "jobs/REMOVE_LOCUM_ALLOCATED_JOB",
              res.data.job.id
            );
            this.job.job_parts.forEach(({ id }) => {
              this.$store.commit("jobs/REMOVE_LOCUM_ALLOCATED_JOB_PART", id);
            });
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: ["Declined"]
            });
            this.$emit("unassign");
          })
          .catch(err => {
            console.log("err", err.response.data);
            if (err.response.data.message) {
              this.$store.commit("SET_NOTIFICATION", {
                enabled: true,
                status: "danger",
                text: [`${err.response.data.message}`]
              });
            }
            if (err.response.data.error_messages) {
              err.response.data.error_messages.forEach(error => {
                this.formError.push(error);
              });
            }
          })
          .finally(() => {
            this.loading = false;
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
