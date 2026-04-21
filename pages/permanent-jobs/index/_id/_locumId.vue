<template>
  <div>
    <PermanentJobShowCandidate
      :permanent_job_application="permanent_job_application"
      :permanent_job="permanent_job"
      :user="user"
      isPage
      @close="
        $router.push({
          path: `/permanent-jobs/${$route.params.id}`,
          query: { ...$route.query }
        })
      "
    />
  </div>
</template>
<script>
import PermanentJobShowCandidate from "@/components/PermanentJob/PermanentJobShowCandidate";
export default {
  components: {
    PermanentJobShowCandidate
  },

  data() {
    return {
      // permanent_job_application: null,
      // user: null,
      // permanent_job: null,
      loading: false
    };
  },

  async asyncData({ app, route, error }) {
    try {
      let permJobId = "";
      if (route.name.includes("hub-surgery-management")) {
        permJobId = route.params.permJobId;
      } else {
        permJobId = route.params.id;
      }

      let permJobResponse = await app.$axios.$get(
        `/api/v1/practice/permanent-jobs/${permJobId}`,
        { cache: true }
      );

      const permanent_job = permJobResponse.data.permanent_job;

      let permJobAppResponse = await app.$axios.$get(
        `/api/v1/practice/permanent-job-applications/${route.params.locumId}`,
        { cache: true }
      );
      const permanent_job_application =
        permJobAppResponse.data.permanent_job_application;

      let userResponse = await app.$axios.$get(
        `/api/v1/practice/locums/${permanent_job_application.locum_user.id}`,
        { cache: true }
      );

      const user = userResponse.data.user;

      return {
        permanent_job,
        permanent_job_application,
        user
      };
    } catch (e) {
      console.error(e);
    }
  },

  methods: {
    async getPermanentJob() {
      let permJobId = "";
      if (this.$route.name.includes("hub-surgery-management")) {
        permJobId = this.$route.params.permJobId;
      } else {
        permJobId = this.$route.params.id;
      }

      this.$axios
        .$get(`/api/v1/practice/permanent-jobs/${permJobId}`)
        .then(res => {
          this.permanent_job = res.data.permanent_job;

          let status =
            this.permanent_job.job_posting_status !== "Available"
              ? ["Unfilled", "Closed"].includes(
                this.permanent_job.job_posting_status
              )
                ? "Closed"
                : this.permanent_job.job_posting_status
              : "Available";
        });
    }
  }
};
</script>
