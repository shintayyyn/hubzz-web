<template>
  <section class="sign-in-card">
    <div class="flex flex-col">
      <div class="flex flex-row flex-no-wrap justify-center md:mb-16">
        <nuxt-link
          :to="'?tabs=sign-in'"
          :event="$route.query.tabs && $route.query.tabs === 'sign-in' ? '' : 'click'"
          class="px-12 py-5 font-bold text-sm cursor-pointer focus:outline-none"
          :class="!$route.query.tabs || ($route.query.tabs && $route.query.tabs === 'sign-in') ? 'rounded-full bg-yellow-500 text-black' : 'text-gray-600'"
        >Sign In</nuxt-link>
        <nuxt-link
          :to="'?tabs=sign-up'"
          :event="$route.query.tabs && $route.query.tabs === 'sign-up' ? '' : 'click'"
          class="px-12 py-5 font-bold text-sm cursor-pointer focus:outline-none"
          :class="$route.query.tabs && $route.query.tabs === 'sign-up' ? 'rounded-full bg-yellow-500 text-black' : 'text-gray-600'"
        >Sign Up</nuxt-link>
      </div>
      <div class="px-5 my-5">
        <transition name="fade" mode="out-in">
          <Component :is="activeComponent" />
        </transition>
      </div>
    </div>
  </section>
</template>

<script>
import SignIn from "@/components/Auth/SignIn";
import SignUp from "@/components/Auth/SignUp";
export default {
  layout: "auth",
  components: {
    SignIn,
    SignUp
  },
  computed: {
    activeComponent() {
      if (
        !this.$route.query.tabs ||
        (this.$route.query.tabs && this.$route.query.tabs === "sign-in")
      ) {
        return "SignIn";
      }
      if (this.$route.query.tabs && this.$route.query.tabs === "sign-up") {
        return "SignUp";
      }
    }
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

