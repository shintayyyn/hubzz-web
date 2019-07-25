<template>
  <section class="profile-section">
    <ProfileTabs />
    <div class="mt-5">
      <transition name="fade" mode="out-in">
        <Component :is="activeComponent" />
      </transition>
    </div>
    <div class="modal-shield" v-if="shield"></div> <!--SHIELD ITSELF IS IN HERE.-->
    <nuxt-child v-if="this.$route.params.id" />
  </section>
</template>
<script>
import ProfileTabs from '@/components/Profile/ProfileTabs'
import Practice from '@/components/Profile/Practice'
import Surgeries from '@/components/Profile/Surgeries'
import Documents from '@/components/Profile/Documents'
export default {
  components: {
    ProfileTabs,
    Practice,
    Surgeries,
    Documents
  },
  computed: {
    activeComponent() {
      return this.$route.query.profile_tab
    },
    shield() {
      return this.$store.state.profile.shield
    }
  },
  watch: {
    shield(value) {
      if (value) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = 'auto'
      }
    }
  },
  created() {
    const query = {
      ...this.$route.query,
      profile_tab: this.$route.query.profile_tab || 'practice'
    }
    this.$router.push({ query })
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