<template>
  <section class="header-section">
    <div class="flex flex-row flex-wrap justify-between">
      <div class="w-1/3 py-2">
        <div class="burger cursor-pointer" @click="toggle">
          <div class="my-2 bg-yellow-500"></div>
          <div class="my-2 bg-yellow-500"></div>
        </div>
      </div>
      <div class="w-1/3 sm:w-1/3 py-2">
        <img src="/images/hubzz-icon-transparent.png" class="logo mx-auto" />
      </div>
      <div class="w-1/3 text-right leading-loose py-2">
        <div class="flex flex-col md:flex-row justify-end md:items-center" v-if="$auth.loggedIn">
          <div class="flex flex-col md:flex-row">
            <div v-if="$auth.user.domain === 'Practice' && $auth.user.status === 'Active'">
              <AppButton
                :label="'Create Job'"
                @click="$store.commit('calendar/CREATE_JOB_MODAL', true)"
                :inStyle="'font-size: medium; padding:10px;'"
                class="mb-2 md:mx-2 leading-none"
              />
            </div>
            <AppButton
              :label="'Messages'"
              @click="$router.push('/messages')"
              :inStyle="'font-size: medium; padding:2px 14px;'"
            />
            <!-- <nuxt-link
            :to="'/messages'"
            class="font-bold text-xs sm:text-sm no-underline px-2 py-1 rounded-lg bg-yellow-500 ml-4"
            >Messages</nuxt-link>-->
          </div>
          <div
            class="text-xs xl:text-sm ml-4"
            v-if="$auth.user.domain === 'Locum'"
          >{{$auth.user.email}}</div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import AppButton from "@/components/Base/AppButton";
export default {
  components: {
    AppButton
  },
  methods: {
    toggle() {
      this.$store.commit("TOGGLE_SIDEBAR", true);
      document.body.style.overflow = "hidden";
    }
  }
};
</script>

<style scoped>
.header-section {
  width: 100%;
  margin-bottom: 20px;
}
.burger {
  display: block;
}
.burger div:first-child {
  width: 30px;
  height: 2px;
}
.burger div:nth-child(2) {
  width: 20px;
  height: 2px;
}
.logo {
  width: 25px;
}
@media screen and (min-width: 1200px) {
  .burger {
    display: none;
  }
  .header-section {
    margin-bottom: 50px;
    max-width: 1466px;
  }
}
a {
  text-decoration: none;
  color: black;
}
</style>
