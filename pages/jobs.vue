<template>
  <section>
    <div class="px-10">
      <JobsTabs/>
    </div>
    <div class="px-10 mt-5">
      <Allocated v-if="$store.state.jobs.activeTab === 'allocated'"/>
      <Available v-if="$store.state.jobs.activeTab === 'available'"/>
      <Applied v-if="$store.state.jobs.activeTab === 'applied'"/>
      <Rejected v-if="$store.state.jobs.activeTab === 'rejected'"/>
      <Declined v-if="$store.state.jobs.activeTab === 'declined'"/>
      <Completed v-if="$store.state.jobs.activeTab === 'completed'"/>
    </div>
  </section>
</template>
<script>
import JobsTabs from '@/components/Jobs/JobsTabs'
import Allocated from '@/components/Jobs/Allocated'
import Available from '@/components/Jobs/Available'
import Applied from '@/components/Jobs/Applied'
import Rejected from '@/components/Jobs/Rejected'
import Declined from '@/components/Jobs/Declined'
import Completed from '@/components/Jobs/Completed'
export default {
  components: {
    JobsTabs,
    Allocated,
    Available,
    Applied,
    Rejected,
    Declined,
    Completed
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
