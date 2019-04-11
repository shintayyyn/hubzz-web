<template>
  <div>
    <div class="sidebar" >
      <AppSideBar />
    </div>
    <AppToggleSideBar v-if="$store.state.drawer"/>
    <div class="content">
        <div v-if="$store.state.mobile" class="float-left text-xs font-thin font-sans m-5 text-right cursor-pointer" @click="$store.commit('TOGGLE_DRAWER', true)">
          Hamburger
        </div>
        <div class="text-xs font-thin font-sans m-5 text-right">
          kpabad.halcyondigital@gmail.com
        </div>
        <nuxt/>
        <transition name="slide">
          <AvailabilityModal v-if="$store.state.availability.modal"/>
          <AvailabilityRangeModal v-if="$store.state.availability.rangeModal"/>
          <AddInvoiceModal v-if="$store.state.billing.invoiceModal"/>
        </transition>
    </div>
  </div>
</template>
<script>
import AppSideBar from '@/components/AppSideBar'
import AppToggleSideBar from '@/components/AppToggleSideBar'
import AvailabilityModal from '@/components/Availability/AvailabilityModal'
import AvailabilityRangeModal from '@/components/Availability/AvailabilityRangeModal'
import AddInvoiceModal from '@/components/Billing/AddInvoice/AddInvoiceModal'
export default {
  components: {
    AppSideBar,
    AppToggleSideBar,
    AvailabilityModal,
    AvailabilityRangeModal,
    AddInvoiceModal
  },
  beforeCreate() {
    this.$store.commit("CHECK_WINDOW_WIDTH");
  },
  created() {
    if(process.browser) {
      addEventListener("resize", () => {
        this.$store.commit("CHECK_WINDOW_WIDTH");
      });
    }
  },
  watch: {
    '$route'(value) {
      this.$store.commit('TOGGLE_DRAWER', false)
    }
  }
}
</script>
<style>
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
  margin-bottom:50px;
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
  div.content {margin-left: 0;}
}

@media screen and (max-width: 400px) {
  .sidebar a {
    text-align: center;
    float: none;
  }
}
.slide-enter-active, .slide-leave-active {
  transition: all .9s ease;
}
.slide-enter, .slide-leave-to {
  transform: translateX(50px);
  opacity: 0;
}
</style>


