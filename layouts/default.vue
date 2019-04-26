<template>
  <div>
    <div class="sidebar">
      <AppSideBar :class="[$store.state.blur_bg ? 'blurClass' : '', 'bgClass']"/>
    </div>
    <AppToggleSideBar v-if="$store.state.drawer"/>
    <div class="content">
      <div :class="[$store.state.blur_bg ? 'blurClass' : '', 'bgClass']">
        <!-- <div v-if="$store.state.mobile" class="float-left text-xs font-thin font-sans m-5 text-right cursor-pointer" @click="$store.commit('TOGGLE_DRAWER', true)">
          Hamburger
        </div>-->
        <transition name="slide-up">
          <AppNotification v-if="$store.state.notification.enabled"/>
        </transition>
        <div class="text-xs font-thin font-sans m-5 text-right">kpabad.halcyondigital@gmail.com</div>
        <nuxt/>
      </div>
      <transition name="slide">
        <AvailabilityModal v-if="$store.state.availability_modal"/>
        <AvailabilityRangeModal v-if="$store.state.availability_range_modal"/>
        <AddInvoiceModal v-if="$store.state.invoice_modal"/>
        <AppointmentModal v-if="$store.state.appointment_modal"/>
      </transition>
      <div
        v-if="$store.state.sign_out_modal"
        class="absolute pin-t"
        :class="$store.state.mobile ? 'w-full pin-x':'flex justify-center w-full pin-x'"
      >
        <SignOut/>
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
    SignOut
  },
  middleware: 'isAuthenticated',
  beforeCreate() {
    this.$store.commit("CHECK_WINDOW_WIDTH");
    this.$store.commit('SET_MONTHS')
  },
  created() {
    if (process.browser) {
      addEventListener("resize", () => {
        this.$store.commit("CHECK_WINDOW_WIDTH");
      });
    }
    this.$store.commit('dashboard/SET_DATE_TODAY')
  },
  watch: {
    '$route'(value) {
      this.$store.commit('TOGGLE_DRAWER', false)
    }
  }
}
</script>
<style>
.bgClass {
  transition: all 0.3s ease-in-out;
}
.blurClass {
  /* filter: grayscale(100%); */
  filter: blur(2px);
  opacity: 0.4;
}
body {
  margin: 0;
}
.sidebar {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  width: 200px;
  position: fixed;
  height: 100%;
  overflow: auto;
}

div.content {
  margin-left: 200px;
  margin-bottom: 50px;
  padding: 1px;
  height: 100%;
}
@media screen and (max-width: 700px) {
  .sidebar {
    width: 100%;
    height: auto;
    position: relative;
  }
  /* .sidebar a {float: left;} */
  div.content {
    margin-left: 0;
  }
}

@media screen and (max-width: 400px) {
  .sidebar a {
    text-align: center;
    float: none;
  }
}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease-in-out;
}
.slide-enter,
.slide-leave-to {
  transform: translateX(50px);
  opacity: 0;
}
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease-in-out;
}
.slide-up-enter,
.slide-up-leave-to {
  transform: translateY(-50px);
  opacity: 0;
}
</style>


