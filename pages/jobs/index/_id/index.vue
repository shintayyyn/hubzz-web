<template>
  <div class="modal-container shadow-lg">
    <JobDetailModalAppointment
      v-if="!activeJobTypePlatform"
      :job="job"
      @close="close"
      @appointmentUpdated="$emit('appointmentUpdated')"
    />
    <JobDetailModal
      v-if="activeJobTypePlatform"
      :job="job"
      @close="close"
      @applied="$emit('applied', $event)"
      @cancelled="$emit('cancelled', $event)"
      @unassign="$emit('unassign', $event)"
    />
  </div>
</template>

<script>
  import JobDetailModal from "@/components/Jobs/JobDetailModal"
  import JobDetailModalAppointment from "@/components/Jobs/JobDetailModalAppointment"

  export default {
    transition: {
      name: 'slide',
      mode: 'out-in',
    },

    components: {
      JobDetailModal,
      JobDetailModalAppointment,
    },

    data () {
      return {
        job: null,
      }
    },

    computed: {
      activeJobTypePlatform () {
        return this.job.type === 'Platform'
      },
    },

    async asyncData ({ app, params, error }) {
      try {
        const {
          id,
        } = params

        let response = await app.$axios.get(`/api/v1/locum/jobs/${id}`)

        let job = response.data.data.job

        return {
          job,
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          return error({
            status: 404,
            message: 'This job could not be found.',
          })
        }

        throw err
      }
    },

    methods: {

      close () {
        const {
          query,
        } = this.$route

        this.$router.push({
          name: 'jobs-index',
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
      width: 80%;
    }
  }
</style>
