<template>
  <div class="rounded-lg shadow-lg p-8 mt-8">
    <div class="text-sm sm:text-base mb-4">You can unassign from this job</div>
    <AppTextarea
      v-model="form.declined_reason"
      :name="'declined_reason'"
      :label="'Please state here your reason.'"
      :placeholder="''"
      :error="this.formError.find(item => item.field === 'declined_reason')"
    />
    <AppButton :label="'Unassign from this job'" @click="unassign" />
  </div>
</template>
<script>
import AppTextarea from '@/components/Base/AppTextarea'
import AppButton from '@/components/Base/AppButton'
export default {
  components: {
    AppTextarea,
    AppButton,
  },
  data() {
    return {
      form: {
        declined_reason: ''
      },
      formError: [],
    }
  },
  methods: {
    unassign() {
      this.formError = []
      this.Validate(this.form)
      if (!this.formError.length) {
        this.$axios.$post(`/api/v1/locum/jobs/${this.$route.params.id}/decline`, this.form).then(res => {
          this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'Declined' })
          this.$router.push('/jobs?job_status=declined')
        })
      }
    },
  }
}
</script>
