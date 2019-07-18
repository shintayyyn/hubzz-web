<template>
  <section class="profile-section">
    <ProfileTabs/>
    <div class="mt-5">
      <transition name="fade" mode="out-in">
        <Component :is="activeComponent"/>
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
    console.log(query)
    this.$router.push({ query })
  },
  computed: {
    activeComponent() {
      return this.$route.query.profile_tab
    }
  },
}
</script>

