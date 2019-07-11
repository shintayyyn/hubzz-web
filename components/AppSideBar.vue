<template>
  <div class="sidebar" :class="{'toggled-left': $store.state.toggled_sidebar}">
    <div class="sidebar-nav">
      <div
        class="close-button cursor-pointer text-2xl font-bold text-yellow-dark mt-5 px-4 mb-24"
        @click="close"
      >X</div>
      <div class="mt-20"></div>
      <div v-for="(item, index) in lists" :key="index" class="text-sm relative">
        <span
          class="absolute inset-y-0 left-0 border-solid bg-yellow-dark w-1 h-full"
          v-if="`/${$route.path.split('/')[1]}` == item.route"
        ></span>
        <nuxt-link
          :to="item.route"
          class="block no-underline p-4"
          :class="`/${$route.path.split('/')[1]}` == item.route ? 'text-yellow-dark' : 'text-black hover:text-grey-light'"
        >
          <span class="font-sans">{{item.name}}</span>
        </nuxt-link>
      </div>
      <div class="text-sm relative">
        <span
          class="absolute pin-l border-solid bg-yellow-dark w-1 h-full"
          v-if="`/${$route.path.split('/')[1]}` == '/sign-out'"
        ></span>
        <button
          @click.prevent="signout"
          class="block no-underline p-4 focus:outline-none"
          :class="`/${$route.path.split('/')[1]}` == '/sign-out' ? 'text-yellow-dark' : 'text-black hover:text-grey-light'"
        >
          <span class="font-sans">Sign Out</span>
        </button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      lists: []
    };
  },
  created() {
    if (this.$auth.loggedIn) {
      let domain = this.$auth.user.domain;
      let isActivated = this.$auth.user.is_actived;
      let accountStatus = this.$auth.user.status;

      let addedLists = [];
      let defaultLists = [
        { name: "Dashboard", route: "/dashboard" },
        { name: "Account", route: "/account" },
        { name: "Messages", route: "/messages" }
      ];
      let otherLists = [
        { name: "Billing", route: "/billing" },
        { name: "FAQ", route: "/faq" },
        { name: "Terms and Conditions", route: "/terms-and-conditions" },
        { name: "Invite", route: "/invite" },
        { name: "Contact Us", route: "/contact-us" }
      ];
      if (domain === "Practice" && isActivated === true) {
        addedLists = [
          { name: "Profile", route: "/profile" },
          { name: "My Banks", route: "/my-banks" },
          { name: "Sessions", route: "/sessions" }
        ];
      } else if (domain === "Locum") {
        addedLists = [{ name: "Compliance", route: "/compliance" }];
      }
      if (domain === "Locum" && accountStatus === "Active") {
        addedLists = [
          { name: "My Practice", route: "/my-practice" },
          { name: "Availability", route: "/availability" },
          { name: "Jobs", route: "/jobs" }
        ];
      }
      this.lists = [...defaultLists, ...addedLists, ...otherLists];
    }
  },
  methods: {
    signout() {
      this.$emit("modal", true);
      // this.$store.commit('TOGGLE_SIGNOUT', true)
    },
    close() {
      this.$store.commit("TOGGLE_SIDEBAR", false);
      document.body.style.overflow = "auto";
    }
  }
};
</script>
<style scoped>
.sidebar {
  position: fixed;
  margin-left: -200px;
  width: 200px;
  height: 100%;
  overflow: auto;
  border-right: solid 1px #edf2f7;
  transition: all 0.3s ease-in-out;
  background-color: white;
  z-index: 500;
}
.toggled-left {
  margin-left: 0;
}
.close-button {
  display: block;
}
@media screen and (min-width: 1200px) {
  .sidebar {
    margin-left: 0;
  }
  .close-button {
    display: none;
  }
}
</style>
