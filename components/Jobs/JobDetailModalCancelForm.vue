<template>
  <div class="rounded-lg shadow-lg p-4 md:p-8 mt-8">
    <div class="text-sm sm:text-base mb-4">You can cancel your application to this job</div>
    <AppButton :label="'Cancel'" @click="cancel" />
  </div>
</template>
<script>
import AppButton from "@/components/Base/AppButton";
export default {
  props: ["job"],
  components: {
    AppButton
  },
  methods: {
    cancel() {
      this.$axios
        .$delete(`/api/v1/locum/jobs/${this.job.id}/apply`)
        .then(res => {
          if (
            this.$route.path.includes("/jobs") ||
            this.$route.path.includes("/dashboard")
          ) {
            this.$store.commit(
              "jobs/REMOVE_LOCUM_APPLIED_JOB",
              res.data.job.id
            );
          }
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: ["Cancelled"]
          });
          this.$emit("cancelled");
        });
    }
  }
};
</script>

