<template>
  <div>
    <div class="sidebar" v-if="$store.state.drawer">
      <AppSideBar/>
    </div>
    <SignOut v-if="$store.state.sign_out_modal"/>
    <div class="content">
      <!-- shields -->
      <div class="shield" :class="shield" v-if="$store.state.activeShield !== ''"></div>
      <!-- header -->
      <div class="header">
        <div class="flex flex-row flex-no-wrap justify-start">
          <div class="w-1/3 cursor-pointer" @click="toggle">
            <div v-if="$store.state.mobile">
              <div class="mx-4 my-2 bg-yellow-dark" style="width:30px;height:2px;"></div>
              <div class="mx-4 my-2 bg-yellow-dark" style="width:20px;height:2px;"></div>
            </div>
          </div>
          <div class="w-1/2 text-center">
            <img src="/images/hubzz-icon-transparent.png" style="width:25px;">
          </div>
          <div class="w-1/3 text-right leading-loose">
            <div class="px-6 text-xs xl:text-sm">{{$auth.user.email}}</div>
          </div>
        </div>
      </div>
      <!-- body -->
      <nuxt/>
    </div>
  </div>
</template>
<script>
import AppSideBar from '@/components/AppSideBar'
import AppToggleSideBar from '@/components/AppToggleSideBar'
import AppNotification from '@/components/AppNotification'
import AvailabilityModal from '@/components/Availability/AvailabilityModal'
import AvailabilityRangeModal from '@/components/Availability/AvailabilityRangeModal'
import AddInvoiceModal from '@/components/Billing/AddInvoice/AddInvoiceModal'
import AppointmentModal from '@/components/Dashboard/AppointmentModal'
import SignOut from '@/components/Auth/SignOut'
export default {
  components: {
    AppSideBar,
    AppToggleSideBar,
    AppNotification,
    AvailabilityModal,
    AvailabilityRangeModal,
    AddInvoiceModal,
    AppointmentModal,
    SignOut,
  },
  middleware: 'isAuthenticated',
  beforeCreate() {
    this.$store.commit("CHECK_WINDOW_WIDTH");
    // this.$store.commit('SET_MONTHS')
  },
  mounted() {
    if (process.browser) {
      addEventListener("resize", () => {
        this.$store.commit("CHECK_WINDOW_WIDTH");
      });
    }
    // this.$store.commit('dashboard/SET_DATE_TODAY')
  },
  computed: {
    shield() {
      switch (this.$store.state.activeShield) {
        case 'content_shield':
          return 'block z-10'
        case 'confirm_shield':
          return 'block z-20'
        default:
          return 'hidden'
      }
    }
  },
  watch: {
    '$store.state.drawer'(value) {
      if (value) {
        this.$store.commit('SET_ACTIVE_SHIELD', 'content_shield')
        document.body.style.overflow = 'hidden'
      } else {
        this.$store.commit('SET_ACTIVE_SHIELD', '')
        document.body.style.overflow = ''
      }
    },
    '$route'(value) {
      this.$store.commit('TOGGLE_DRAWER', false)
    }
  },
  methods: {
    toggle() {
      this.$store.commit('TOGGLE_DRAWER', true)
    }
  }
}
</script>
<style>
body {
  margin: 0;
}
.shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
}
.header {
  padding-top: 10px;
  padding-bottom: 10px;
}
.content {
  height: auto;
  padding: 1px;
  margin-left: 200px;
  overflow-y: auto;
}
.sidebar {
  position: fixed;
  width: 200px;
  top: 0;
  bottom: 0;
  height: 100vh;
  border-right: solid 2px #edf2f7;
}

@media screen and (max-width: 900px) {
  .sidebar {
    position: fixed;
    z-index: 100;
    background-color: white;
  }
  .content {
    margin-left: 0;
  }
}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.1s ease-in-out;
}
.slide-enter,
.slide-leave-to {
  transform: translateX(-50px);
}
/* @media screen and (max-width: 700px) {
  .sidebar {
    width: 100%;
    height: auto;
    position: relative;
  }
  .sidebar a {float: left;}
  div.content {
    margin-left: 0;
  }
} */

/* @media screen and (max-width: 400px) {
  .sidebar a {
    text-align: center;
    float: none;
  }
} */
</style>


