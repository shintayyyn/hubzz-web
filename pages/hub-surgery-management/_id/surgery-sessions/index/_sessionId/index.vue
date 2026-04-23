<template>
  <div class="">
    <SessionDetailModal :job="job" @close="close" />
  </div>
</template>

<script>
import SessionDetailModal from "@/components/Sessions/SessionDetailModal";

export default {
  transition: {
    name: "slide",
    mode: "out-in"
  },
  components: {
    SessionDetailModal
  },
  data() {
    return {
      job: null
    };
  },

  async asyncData({ app, params, error }) {
    try {
      const { sessionId } = params;

      let response = await app.$axios.get(
        `/api/v1/practice/jobs/${sessionId}`,
        { cache: true }
      );

      let job = response.data.data.job;

      return {
        job
      };
    } catch (err) {
      if (err.response && err.response.status === 404) {
        return error({
          status: 404,
          message: "This session could not be found."
        });
      }

      throw err;
    }
  },

  methods: {
    close() {
      this.$router.push({
        name: "hub-surgery-management-id-surgery-sessions-index",
        params: {
          id: this.$route.params.id
        },
        query: {
          ...this.$route.query
        }
      });
    }
  }
};
</script>

<style scoped>
.modal-container {
  z-index: 510;
}
@media screen and (min-width: 1200px) {
  .modal-container {
    width: 70%;
  }
}
</style>
