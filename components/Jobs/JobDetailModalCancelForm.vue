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
        this.$store.commit('jobs/REMOVE_LOCUM_APPLIED_JOB', res.data.job.id)
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: ['Cancelled'] })
        this.$emit('close')
      })
    },
  }
}
</script>

