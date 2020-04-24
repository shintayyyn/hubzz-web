<template>
  <div class="relative bg-white rounded-lg shadow-lg p-4 md:p-8 mt-8">
    <div class="text-sm sm:text-base mb-4">
      You can cancel your application to this job
    </div>
    <AppButton :label="'Cancel'" :disabled="loading" @click="cancel" />
    <AppLoading :loading="loading" spinner />
  </div>
</template>
<script>
import AppButton from "@/components/Base/AppButton"
import AppLoading from "@/components/Base/AppLoading"
export default {
  components: {
    AppButton,
    AppLoading
  },
  props: ["job"],
  data () {
    return {
      loading: false
    }
  },
  methods: {
    cancel () {
      this.loading = true
      const jobId = this.job.id
      this.$axios
        .$delete(`/api/v1/locum/jobs/${jobId}/apply`)
        .then(() => {
          this.$store.commit("jobs/REMOVE_LOCUM_APPLIED_JOB", jobId)
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: ["Cancelled"]
          })
          this.$emit("cancelled", jobId)
        })
        .catch(err => {
          console.log("err", err.response || err)
          if (err.response.data.message) {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "danger",
              text: [`${err.response.data.message}`]
            })
          }
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

