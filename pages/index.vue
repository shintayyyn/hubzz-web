<template>
  <section class="sign-in-card">
    <div class="flex flex-col">
      <AuthTabs @nextTab="activeComponent = $event" :activeComponent="activeComponent" />
      <div class="px-5 my-5">
        <transition name="fade" mode="out-in">
          <Component :is="activeComponent" />
        </transition>
      </div>
    </div>
  </section>
</template>

<script>
import AuthTabs from "@/components/Auth/AuthTabs";
import SignIn from "@/components/Auth/SignIn";
import SignUp from "@/components/Auth/SignUp";
export default {
  layout: "auth",
  components: {
    AuthTabs,
    SignIn,
    SignUp
  },
  data() {
    return {
      activeComponent: "SignIn"
    };
  },
  mounted() {
    this.$store.commit("sign-up/SET_ACTIVE_COMPONENT", "LocumAccountDetails");
  }
};
</script>
<style scoped>
.sign-in-card {
  position: absolute;
  top: 0px;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  max-width: 600px;
  max-height: 700px;
  padding: 20px 1px;
}

@media screen and (max-width: 1200px) {
  .sign-in-card {
    position: relative;
  }
}
</style>

