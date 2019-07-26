<template>
  <div class="p-8 max-w-xl">
    <div @click="$emit('close')" class="cursor-pointer">
      <svgicon name="left-arrow" height="32" width="32"/>
    </div>
    <LocumDetailModalTabs />
    <div>
      <transition name="fade" mode="out-in">
        <Component :is="activeComponent" :user="user" :jobs="jobs" />
      </transition>
    </div>
  </div>
</template>
<script>
import LocumDetailModalTabs from '@/components/MyBanks/LocumDetailModalTabs'
import LocumDetailModal from '@/components/MyBanks/LocumDetailModal'
import LocumJobs from '@/components/MyBanks/LocumJobs'
export default {
  props:['user','jobs'],
  components:{
    LocumDetailModalTabs,
    locum_detail: LocumDetailModal,
    locum_jobs: LocumJobs
  },

  computed:{
    activeComponent(){
      return this.$route.query.my_locum
    }
  },
  created() {

    const query = {
      ...this.$route.query,
      my_locum: this.$route.query.my_locum || 'locum_detail'
    }
    this.$router.push({ query })
  }
}
</script>
