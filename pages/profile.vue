<template>
  <section class="profile-section">
    <ProfileTabs/>
    <div class="mt-5">
      <transition name="fade" mode="out-in">
        <!-- <Component :is="activeComponent"/> -->
        <nuxt-child/>
      </transition>
    </div>
  </section>
</template>
<script>
import ProfileTabs from '@/components/Profile/ProfileTabs'
import Practice from '@/components/Profile/Practice'
import Surgeries from '@/components/Profile/Surgeries'
import PracticeDocuments from '@/components/Profile/PracticeDocuments'
export default {
  components: {
    ProfileTabs,
    Practice,
    Surgeries,
    PracticeDocuments
  },
  created() {
    const query = {
      ...this.$route.query,
      profile_tab: this.$route.query.profile_tab || 'practice'
    }
    this.$router.push({ query })
  },
  computed: {
    activeComponent() {
      return this.$route.query.profile_tab
    }
  },
}
</script>
<style scoped>
.modal-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 509;
}
</style>