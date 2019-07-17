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
import Favorites from '@/components/MyPractice/Favorites'
import Completed from '@/components/MyPractice/Completed'
import All from '@/components/MyPractice/All'
import Unsuccessful from '@/components/MyPractice/Unsuccessful'
export default {
  components: {
    MyPracticeTab,
    Favorites,
    Completed,
    All,
    Unsuccessful,
  },
  middleware:'isVerified',
  created() {
    const query = {
      ...this.$route.query,
      my_practice_tab: this.$route.query.my_practice_tab || 'favorites'
    }
    this.$router.push({ query })
  },
  computed: {
    activeComponent() {
      return this.$route.query.my_practice_tab
    }
  },
}
</script>
<style scoped>
</style>
