<template>
  <div>
    <!-- sidebar 500 499-->
    <div class="sidebar">
      <AppSideBar @close="close"/>
    </div>
    <div class="sidebar-shield" v-if="$store.state.sidebar_shield"></div>
    <!-- signout 600 599-->
    <div class="signout flex justify-center" v-if="$store.state.sign_out_modal">
      <SignOut/>
    </div>
    <div class="signout-shield" v-if="$store.state.signout_shield"></div>
    <!-- availability modal 510 509-->
    <div class="availability-modal shadow-lg">
      <AvailabilityModal/>
    </div>
    <div class="availability-modal-shield" v-if="$store.state.availability_modal"></div>
    <div class="content">
      <!-- shields -->
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
      <div class="body">
        <nuxt/>
      </div>
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
  created() {
    if (process.browser) {
      addEventListener("resize", () => {
        this.$store.commit("CHECK_WINDOW_WIDTH");
      });
    }
    this.$store.commit('dashboard/SET_DATE_TODAY')
  },
  computed: {
    availability_modal() {
      return this.$store.state.availability_modal
    }
  },
  watch: {
    '$route'(value) {
      let d = document.getElementsByClassName('sidebar')[0]
      d.className = "sidebar";
      document.body.style.overflow = 'auto'
      this.$store.commit('SET_SIDEBAR_SHIELD', false)
    },
    availability_modal(value) {
      let d = document.getElementsByClassName('availability-modal')[0]
      d.classList.toggle('toggled-right')
      if (value) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = 'auto'
      }
      // else {
      //   document.getElementsByClassName('availability-modal')[0].classList.toggle('toggle-right')
      //   
      // }
    }
  },
  methods: {
    toggle() {
      this.$store.commit('SET_SIDEBAR_SHIELD', true)
      let d = document.getElementsByClassName('sidebar')[0]
      d.className += " toggled-left";
      document.body.style.overflow = 'hidden'
    },
    close() {
      this.$store.commit('SET_SIDEBAR_SHIELD', false)
      let d = document.getElementsByClassName('sidebar')[0]
      d.className = "sidebar";
      document.body.style.overflow = 'auto'
    }
  }
}
</script>
<style>
body {
  margin: 0;
}
.sidebar {
  position: fixed;
  margin-left: -200px;
  width: auto;
  height: 100%;
  overflow: auto;
  border-right: solid 2px #edf2f7;
  transition: all 0.3s ease-in-out;
  background-color: white;
  z-index: 500;
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
.signout {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 600;
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
.availability-modal {
  position: fixed;
  right: 0;
  margin-right: -100%;
  width: 100%;
  height: 100vh;
  overflow: auto;
  border-left: solid 2px #edf2f7;
  transition: all 0.3s ease-in-out;
  background-color: white;
  z-index: 510;
}
.availability-modal-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 509;
}
.header {
  padding-top: 10px;
  padding-bottom: 10px;
}
.content {
  height: auto;
  padding: 1px;
  margin-left: 0;
}

.toggled-left {
  margin-left: 0;
}
.toggled-right {
  margin-right: 0;
}

@media screen and (min-width: 900px) {
  .sidebar {
    margin-left: 0;
  }
  .availability-modal {
    width: 70%;
  }
  .content {
    margin-left: 200px;
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


