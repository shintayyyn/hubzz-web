<template>
  <div class="rounded-lg shadow-lg p-8 mt-8">
    <div class="text-sm sm:text-base mb-4">You can cancel your application to this job</div>
    <AppButton :label="'Cancel'" @click="cancel" />
  </div>
</template>
<script>
import AppButton from '@/components/Base/AppButton'
export default {
  components: {
    AppButton
  },
  methods: {
    cancel() {
      this.$axios.$delete(`/api/v1/locum/jobs/${this.$route.params.id}/apply`).then(res => {
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'Cancelled' })
        this.$router.push('/jobs?job_status=available')
      })
    },
  }
}
</script>

