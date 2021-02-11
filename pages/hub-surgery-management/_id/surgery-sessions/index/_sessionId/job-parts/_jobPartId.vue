<template>
  <div class="pt-2">
    <SessionPartDetailModal :job-part="jobPart" @close="close" />
  </div>
</template>

<script>
  import SessionPartDetailModal from "@/components/Sessions/SessionPartDetailModal"
  export default {
    transition: {
      name: 'slide',
      mode: 'out-in',
    },

    components: {
      SessionPartDetailModal,
    },

    data () {
      return {
        jobPart: null,
      }
    },

    async asyncData ({ app, params, error }) {
      try {
        const {
          jobPartId,
        } = params

        let response = await app.$axios.get(`/api/v1/practice/job-parts/${jobPartId}`)
        
        let jobPart = response.data.data.job_part

        return {
          jobPart,
        }
      } catch (err) {
        if (err && err.response && err.response.status === 404) {
          return error({
            status: 404,
            message: 'This session could not be found.',
          })
        }

        throw err
      }
    },

    methods: {
      close () {
        const {
          params,
          query,
        } = this.$route

        const {
          id: practiceSurgeryId,
        } = params

        this.$router.push({
          name: 'hub-surgery-management-id-surgery-sessions-index',
          params: {
            id: practiceSurgeryId,
          },
          query,
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
      width: 70%;
    }
  }
</style>
