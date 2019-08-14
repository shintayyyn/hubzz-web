<template>
  <section>
    <div class="sidebar-shield" v-if="$store.state.toggled_sidebar" @click="close"></div>
    <AppSideBar @modal="signout_modal = $event" />
    <div class="content">
      <AppNotification />
      <AppHeader />
      <nuxt />
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
    AppHeader,
  },
  data() {
    return {
      signout_modal: false
    };
  },
  middleware: "isNotAuthenticated",
  computed: {
    notify() {
      return this.$store.state.notification.enabled;
    }
  },
  watch: {
    notify(value) {
      if (!this.$store.state.notification.closable) {
        setTimeout(() => {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: false,
            status: "",
            text: "",
            closable: false
          });
        }, 2000);
      }
    },
    $route(value) {
      this.$store.commit("TOGGLE_SIDEBAR", false);
      document.body.style.overflow = "auto";
    }
  },
  methods: {
    close() {
      this.$store.commit("TOGGLE_SIDEBAR", false);
      document.body.style.overflow = "auto";
    }
  },
  mounted() {
    this.$store.dispatch("signUp/getProfessions");
    this.$store.dispatch("signUp/getQualifications");
    this.$store.dispatch("signUp/getClinicalSystems");
    this.$store.dispatch("signUp/getSpokenLanguages");
    this.$store.dispatch("signUp/getPracticeTypes");
    this.$store.dispatch("signUp/getMandatoryTrainings");
  }
};
</script>
<style>
.content {
  /* box-sizing: content-box; */
  max-width: 1466px;
  padding: 5px 30px;
  height: 100%;
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


