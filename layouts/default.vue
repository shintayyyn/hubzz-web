<template>
  <section>
    <AppSideBar @modal="signout_modal = $event" />
    <transition name="drop" mode="out-in">
      <SignOut v-if="signout_modal" @modal="signout_modal = $event" />
    </transition>
    <!-- modals here -->
    <!-- shields here -->
    <div class="sidebar-shield" v-if="$store.state.toggled_sidebar"></div>
    <div class="signout-shield" v-if="signout_modal"></div>
    <!-- content -->
    <div class="content">
      <AppNotification />
      <AppHeader />
      <nuxt />
    </div>
  </section>
</template>
<script>
import AppSideBar from '@/components/AppSideBar'
import SignOut from '@/components/Auth/SignOut'
import AppNotification from '@/components/AppNotification'
import AppHeader from '@/components/AppHeader'
export default {
  transitions: 'page',
  components: {
    AppSideBar,
    SignOut,
    AppNotification,
    AppHeader,
  },
  data() {
    return {
      signout_modal: false
    }
  },
  middleware: 'isNotAuthenticated',
  computed: {
    notify() {
      return this.$store.state.notification.enabled
    }
  },
  watch: {
    notify(value) {
      if (value) {
        setTimeout(() => {
          this.$store.commit('SET_NOTIFICATION', { enabled: false, status: '', text: '' })
        }, 2000)
      }
    },
    '$route'(value) {
      this.$store.commit('TOGGLE_SIDEBAR', false)
      document.body.style.overflow = 'auto'
    },
  },
  mounted() {
    this.$store.dispatch('signUp/getProfessions')
    this.$store.dispatch('signUp/getQualifications')
    this.$store.dispatch('signUp/getClinicalSystems')
    this.$store.dispatch('signUp/getSpokenLanguages')
    this.$store.dispatch('signUp/getPracticeTypes')
  },
}
</script>
<style>
.content {
  /* box-sizing: content-box; */
  max-width: 1000px;
  padding: 5px 40px;
}
.sidebar-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 499;
}
.signout-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 599;
}
@media screen and (min-width: 1200px) {
  .content {
    margin-left: 200px;
  }
}
</style>


