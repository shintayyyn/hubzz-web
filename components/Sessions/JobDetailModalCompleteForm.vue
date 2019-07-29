<template>
  <div class="flex flex-col w-full lg:w-2/3 p-0 lg:pr-4">
    <div class="rounded-lg shadow-lg flex flex-col p-8 mt-4">
      <div
        class="flex flex-row flex-nowrap"
        v-for="(jobPart, index) in job_parts"
        :key="jobPart.id"
      >
        <div class="w-1/2 p-1 text-lg font-bold flex flex-col justify-center">
          <div>From: {{jobPart.date_start | localDate('dateOnly')}}</div>
          <div class="my-2"></div>
          <div>To: {{jobPart.date_end | localDate('dateOnly')}}</div>
        </div>
        <div class="w-1/2 p-1">
          <AppButton
            :disabled="Boolean(jobPart.completed_at) || isDisabled(index)"
            :label="`Mark this week as Complete`"
            @click="complete(jobPart.id, index)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import AppButton from '@/components/Base/AppButton'
export default {
  props: ['job_parts'],
  components: {
    AppButton
  },
  methods: {
    complete(id, index) {
      this.$axios.$put(`/api/v1/practice/job-parts/${id}/complete`).then(res => {
        this.job_parts[index].completed_at = res.data.job_part.completed_at
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: ['Job Part completed'] })
        if (this.job_parts.filter(jobPart => jobPart.completed_at === null).length === 0) {
          this.$emit('close')
        }
      })
    },
    isDisabled(index) {
      if (index == 0) {
        return false
      } else {
        if (this.job_parts[index - 1].completed_at) {
          return false
        }
      }
      return true
    },
  }
}
</script>
