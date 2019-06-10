<template>
  <section>
    <div class="px-10">
      <JobsTabs/>
    </div>
    <div class="px-10 mt-5">
      <AllocatedJobs v-if="$store.state.jobs.activeTab === 'allocated'"/>
      <AvailableJobs v-if="$store.state.jobs.activeTab === 'available'"/>
      <AppliedJobs v-if="$store.state.jobs.activeTab === 'applied'"/>
      <RejectedJobs v-if="$store.state.jobs.activeTab === 'rejected'"/>
      <DeclinedJobs v-if="$store.state.jobs.activeTab === 'declined'"/>
      <CompletedJobs v-if="$store.state.jobs.activeTab === 'completed'"/>
    </div>
  </section>
</template>
<script>
import JobsTabs from '@/components/Jobs/JobsTabs'
import AllocatedJobs from '@/components/Jobs/AllocatedJobs'
import AvailableJobs from '@/components/Jobs/AvailableJobs'
import AppliedJobs from '@/components/Jobs/AppliedJobs'
import RejectedJobs from '@/components/Jobs/RejectedJobs'
import DeclinedJobs from '@/components/Jobs/DeclinedJobs'
import CompletedJobs from '@/components/Jobs/CompletedJobs'
export default {
  components: {
    JobsTabs,
    AllocatedJobs,
    AvailableJobs,
    AppliedJobs,
    RejectedJobs,
    DeclinedJobs,
    CompletedJobs
  },
  data() {
    return {
      // form: {
      //   type: '',
      //   locum_status: '',
      //   date_start: null,
      //   date_end: null,
      //   shift_id: '',
      //   locum_detail_rate_type_id: '',
      //   rate: [],
      //   post_code: '',
      //   miles: ''
      // }
    }
  },
  created() {
    // this.form.type = 'Platform'
    // this.form.date_start = this.$moment().startOf('month').format('YYYY-MM-DD')
    // this.form.date_end = this.$moment().endOf('month').format('YYYY-MM-DD')
    // this.form.shift_id = this.$auth.user.locum_detail.shifts.map(item => item.id).join()
    // this.form.locum_detail_rate_type_id = this.$auth.user.locum_detail.rates[0].rate_type.id
    // this.form.rate = [`${this.$auth.user.locum_detail.rates[0].min}:gte`, `${this.$auth.user.locum_detail.rates[0].max}:lte`]
    // this.form.post_code = this.$auth.user.locum_detail.post_code
    // this.form.miles = this.$auth.user.locum_detail.miles
    // console.log(this.form)
  }
}
</script>
