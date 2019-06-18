<template>
  <section>
    <AppSideBar/>
    <SignOut/>
    <!-- modals here -->
    <CreateAppointmentModal v-if="$store.state.toggled_create_appointment_modal"/>
    <AddSurgeryModal/>
    <!-- shields here -->
    <div class="sidebar-shield" v-if="$store.state.toggled_sidebar"></div>
    <div class="signout-shield" v-if="$store.state.toggled_signout"></div>
    <div class="create-appointment-shield" v-if="$store.state.toggled_create_appointment_modal"></div>
    <div class="add-surgery-shield" v-if="$store.state.toggled_add_surgery_modal"></div>
    <!-- content -->
    <div class="content">
      <AppNotification/>
      <AppHeader/>
      <nuxt/>
    </div>
  </section>
</template>
<script>
import AppSideBar from '@/components/AppSideBar'
import SignOut from '@/components/Auth/SignOut'
import AppNotification from '@/components/AppNotification'
import AppHeader from '@/components/AppHeader'
// locum
import CreateAppointmentModal from '@/components/CreateAppointmentModal'
import AddSurgeryModal from '@/components/AddSurgeryModal'
// practice
import CreateJobModal from '@/components/CreateJobModal'
export default {
  transitions: 'fade',
  components: {
    AppSideBar,
    SignOut,
    AppNotification,
    AppHeader,
    // locum
    CreateAppointmentModal,
    AddSurgeryModal,
    // practice
    CreateJobModal
  },
  // middleware: 'isAuthenticated',
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
  methods: {

  }
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
/* locum */
.create-appointment-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 509;
}
.add-surgery-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 511;
}
@media screen and (min-width: 1200px) {
  .content {
    margin-left: 200px;
  }
}
</style>


