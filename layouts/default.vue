<template>
  <section>
    <div class="shield" v-if="$store.state.toggled_sidebar" @click="close"></div>
    <AppSideBar @modal="signout_modal = $event" />
    <AppHeader />
    <div class="content">
      <AppNotification />
      <nuxt class="mt-20" />
    </div>
  </section>
</template>
<script>
import AppSideBar from "@/components/AppSideBar";
import AppNotification from "@/components/AppNotification";
import AppHeader from "@/components/AppHeader";

export default {
  transitions: "page",
  components: {
    AppSideBar,
    AppNotification,
    AppHeader
  },
  data() {
    return {
      signout_modal: false
    };
  },
  middleware: "isNotAuthenticated",
  // computed: {
  //   notify() {
  //     return this.$store.state.notification.enabled;
  //   }
  // },
  watch: {
    //   notify(value) {
    //     if (!this.$store.state.notification.closable) {
    //       setTimeout(() => {
    //         this.$store.commit("SET_NOTIFICATION", {
    //           enabled: false,
    //           status: "",
    //           text: "",
    //           closable: false
    //         });
    //       }, 2000);
    //     }
    //   },
    $route(value) {
      if (value) {
        this.$store.commit("TOGGLE_SIDEBAR", false);
        document.body.style.overflow = "auto";
      }
    }
  },
  methods: {
    close() {
      this.$store.commit("TOGGLE_SIDEBAR", false);
      document.body.style.overflow = "auto";
    }
  },
  mounted() {
    // this.$store.dispatch("signUp/getProfessions");
    // this.$store.dispatch("signUp/getQualifications");
    // this.$store.dispatch("signUp/getClinicalSystems");
    // this.$store.dispatch("signUp/getSpokenLanguages");
    // this.$store.dispatch("signUp/getPracticeTypes");
    // this.$store.dispatch("signUp/getMandatoryTrainings");
  }
};
</script>
<style>
.content {
  /* box-sizing: content-box; */
  max-width: 1466px;
  padding: 5px 30px;
  height: 100%;
  scroll-behavior: smooth;
}
.shield {
  z-index: 55;
}
@media screen and (min-width: 1200px) {
  .content {
    margin-left: 200px;
  }
}

@media screen and (min-width: 480px) {
  .content {
    padding: 5px 40px;
  }
}
</style>


