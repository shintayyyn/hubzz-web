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
  props: ['job'],
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
        this.$axios.$post(`/api/v1/locum/jobs/${this.job.id}/decline`, this.form).then(res => {
          this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: ['Declined'] })
          this.$store.commit('jobs/REMOVE_LOCUM_ALLOCATED_JOB', res.data.job.id)
          this.$store.commit('jobs/ADD_LOCUM_DECLINED_JOB', res.data.job)
          this.$emit('close')
        }).catch(err => {
          err.response.data.error_messages.forEach(error => {
            this.formError.push(error)
          })
          this.$store.commit('SET_NOTIFICATION', {
            enabled: true,
            status: "danger",
            text: this.formError.map(error => error.message)
          })
        })
      } else {
        this.$store.commit('SET_NOTIFICATION', {
          enabled: true,
          status: "danger",
          text: ["Please fill up all the forms"]
        })
      }
    },
  }
}
</script>
