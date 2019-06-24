<template>
  <section class="account-section">
    <MyPracticeTab/>
    <div class="mt-5">
      <transition name="fade" mode="out-in">
        <Component :is="activeComponent"/>
      </transition>
    </div>
  </section>
</template>
<script>
import MyPracticeTab from '@/components/MyPractice/MyPracticeTab'
import FavouritePractices from '@/components/MyPractice/FavouritePractices'
import AllPractices from '@/components/MyPractice/AllPractices'
export default {
  components: {
    MyPracticeTab,
    FavouritePractices,
    AllPractices,
  },
  created() {
    const query = {
      ...this.$route.query,
      my_practice_tab: this.$route.query.my_practice_tab || 'favourites'
    }
    this.$router.push({ query })
  },
  computed: {
    activeComponent() {
      if (this.$route.query.my_practice_tab === 'favourites') {
        return 'FavouritePractices'
      }
      if (this.$route.query.my_practice_tab === 'all') {
        return 'AllPractices'
      }
    }
  },
}
</script>
<style scoped>
</style>
