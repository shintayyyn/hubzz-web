<template>
  <section>
    <div class="sidebar" :class="{'toggled-left': $store.state.toggled_sidebar}">
      <div class="sidebar-nav">
        <div
          class="close-button cursor-pointer text-2xl font-bold text-yellow-dark mt-3 md:mt-5 px-4 md:mb-24"
          @click="close"
        >X</div>
        <div class="md:mt-20"></div>
        <div v-for="(item, index) in lists" :key="index" class="text-sm relative">
          <span
            class="absolute inset-y-0 left-0 border-solid bg-yellow-dark w-1 h-full"
            v-if="`/${$route.path.split('/')[1]}` == item.route"
          ></span>
          <nuxt-link
            :to="item.route"
            :event="isDisabled(item.route)"
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
            @click.prevent="signout_modal = true"
            class="block no-underline p-4 focus:outline-none"
            :class="`/${$route.path.split('/')[1]}` == '/sign-out' ? 'text-yellow-dark' : 'text-black hover:text-grey-light'"
          >
            <span class="font-sans">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
    <div class="signout-shield" v-if="signout_modal"></div>
    <transition name="drop" mode="out-in">
      <SignOut v-if="signout_modal" @modal="signout_modal = $event" />
    </transition>
  </section>
</template>
<script>
import SignOut from "@/components/Auth/SignOut";
export default {
  components: {
    SignOut
  },
  data() {
    return {
      signout_modal: false,
      lists: []
    };
  },
  created() {
    if (this.$auth.loggedIn) {
      let domain = this.$auth.user.domain;
      let accountStatus = this.$auth.user.status;

      let addedLists = [];
      let defaultLists = [
        { name: "Dashboard", route: "/dashboard" },
        { name: "Account", route: "/account" }
      ];
      let otherLists = [
        { name: "FAQ", route: "/faq" },
        { name: "Terms and Conditions", route: "/terms-and-conditions" },
        { name: "Contact Us", route: "/contact-us" }
      ];
      if (domain === "Practice") {
        addedLists = [{ name: "Profile", route: "/profile" }];
      }

      if (domain === "Practice" && accountStatus === "Active") {
        addedLists = [
          { name: "Profile", route: "/profile" },
          { name: "My Banks", route: "/my-banks" },
          { name: "Sessions", route: "/sessions" },
          { name: "Billing", route: "/billing" },
          { name: "Invite", route: "/invite" }
        ];
      }

      if (domain === "Locum") {
        addedLists = [{ name: "Compliance", route: "/compliance" }];
      }

      if (
        (domain === "Locum" && accountStatus === "Active") ||
        accountStatus === "Dormant"
      ) {
        addedLists = [
          { name: "Compliance", route: "/compliance" },
          { name: "My Practice", route: "/my-practice" },
          { name: "Availability", route: "/availability" },
          { name: "Jobs", route: "/jobs" },
          { name: "Billing", route: "/billing" },
          { name: "Invite", route: "/invite" }
        ];
      }
      this.lists = [...defaultLists, ...addedLists, ...otherLists];
    }
  },
  methods: {
    isDisabled(routeName) {
      return this.$route.path === routeName ? '' : 'click'
    },
    close() {
      this.$store.commit("TOGGLE_SIDEBAR", false);
      document.body.style.overflow = "auto";
    }
  }
};
</script>
<style scoped>
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
