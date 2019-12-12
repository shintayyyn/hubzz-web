<template>
  <div class="relative bg-white rounded-lg shadow-lg p-4 md:p-8 mt-8">
    <div class="text-sm sm:text-base mb-4">You can cancel your application to this job</div>
    <AppButton :label="'Cancel'" @click="cancel" :disabled="loading" />
    <AppLoading :loading="loading" spinner />
  </div>
</template>
<script>
import AppButton from "@/components/Base/AppButton";
import AppLoading from "@/components/Base/AppLoading";
export default {
  props: ["job"],
  components: {
    AppButton,
    AppLoading
  },
  data() {
    return {
      loading: false
    };
  },
  methods: {
    cancel() {
      this.loading = true;
      this.$axios
        .$delete(`/api/v1/locum/jobs/${this.job.id}/apply`)
        .then(res => {
          this.$store.commit("jobs/REMOVE_LOCUM_APPLIED_JOB", res.data.job.id);
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: ["Cancelled"]
          });
          this.$emit("cancelled");
        })
        .catch(err => {
          console.log("err", err.response || err);
          if (err.response.data.message) {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "danger",
              text: [`${err.response.data.message}`]
            });
          }
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
};
</script>

