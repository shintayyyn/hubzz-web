<template>
  <div ref="modalContainer" class="modal-container shadow-lg">
    <SessionPartDetailModal :job-part="jobPart" @close="close" />
  </div>
</template>

<script>
import SessionPartDetailModal from "@/components/Sessions/SessionPartDetailModal"

export default {
  transition: {
    name: "slide",
    mode: "out-in",
  },

  components: {
    SessionPartDetailModal,
  },

  data () {
    return {
      jobPart: null,
    }
  },

  async asyncData ({ app, params, error, }) {
    try {
      const { jobPartId, } = params

      let response = await app.$axios.get(
        `/api/v1/practice/job-parts/${jobPartId}`
      )

      let jobPart = response.data.data.job_part

      return {
        jobPart,
      }
    } catch (err) {
      if (err && err.response && err.response.status === 404) {
        return error({
          status: 404,
          message: "This session could not be found.",
        })
      }

      throw err
    }
  },

  methods: {
    close () {
      const { query, } = this.$route

      this.$router.push({
        name: "sessions-index",
        query,
      })
    },

    scrollToTop () {
      this.$nextTick(() => {
        this.$refs.modalContainer.scrollTop = 0
      })
    },
  },
}
</script>

<style scoped>
.modal-container {
	z-index: 510;
}
@media screen and (min-width: 1200px) {
	.modal-container {
		width: 90%;
	}
}
</style>
