<template>
  <section>
    <div class="sidebar" :class="{'toggled-left': $store.state.toggled_sidebar}">
      <div class="sidebar-nav pt-8 xl:pt-20">
        <button
          class="close-button cursor-pointer focus:outline-none text-2xl font-bold text-yellow-500 px-4"
          @click="close"
        >X</button>
        <div v-for="(item, index) in lists" :key="index" class="text-sm relative">
          <span
            class="absolute inset-y-0 left-0 border-solid bg-sunglow w-1 h-full"
            v-if="`/${$route.path.split('/')[1]}` == item.route"
          ></span>
          <nuxt-link
            :to="item.route"
            :event="isDisabled(item.route)"
            class="block no-underline p-4 transition-hover"
            :class="`/${$route.path.split('/')[1]}` == item.route ? 'text-sunglow font-bold' : 'hover:text-sunglow hover:font-bold'"
            v-if="hasPermissions(item.permissions ? item.permissions : [])"
          >
            <span>{{item.name}}</span>
          </nuxt-link>
        </div>
        <div class="text-sm relative">
          <span
            class="absolute left-0 border-solid bg-sunglow w-1 h-full"
            v-if="`/${$route.path.split('/')[1]}` == '/sign-out'"
          ></span>
          <button
            @click.prevent="signout_modal = true"
            class="block no-underline p-4 transition-hover focus:outline-none"
            :class="`/${$route.path.split('/')[1]}` == '/sign-out' ? 'text-sunglow font-bold' : 'hover:text-sunglow hover:font-bold'"
          >
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
    <AppConfirmationModal
      :label="'Proceed to sign-out?'"
      :confirmLabel="'Yes'"
      :cancelLabel="'Cancel'"
      :modal="signout_modal"
      @confirm="logout"
      @cancel="signout_modal = false"
    />
    <AppConfirmationModal
      :label="'Your Profile Has Been Deleted, Contact Hubzz For More Info'"
      :confirmLabel="'Yes'"
      :modal="confirmation_modal"
      @confirm="confirm"
    />
  </section>
</template>
<script>
import AppConfirmationModal from "@/components/Base/AppConfirmationModal";
export default {
  components: {
    AppConfirmationModal
  },
  data() {
    return {
      signout_modal: false,
      confirmation_modal: false,
      lists: [],
      eligibleToSpoke: false
    };
  },
  async created() {
    if (this.$auth.loggedIn && this.$auth.user.domain === "Pratice") {
      await this.$axios
        .$get(`/api/v1/practice/me/parent-surgery/invitations-count`)
        .then(res => {
          if (res.data.count > 0) {
            this.eligibleToSpoke = true;
          }
        });
    }
  },
  computed: {
    authPermissions() {
      return this.$store.getters["permissions"];
    }
  },
  mounted() {
    this.getInit();
    if (this.$auth.loggedIn && this.$auth.user.domain === "Pratice") {
      this.$axios
        .$get(`/api/v1/practice/me/parent-surgery/invitations-count`)
        .then(res => {
          if (res.data.count > 0) {
            this.eligibleToSpoke = true;
          }
        })
        .finally(() => {
          this.$socket.on(
            "Practice Notification Update Profile",
            this.updatePermissions
          );
          this.$socket.on(
            "Practice Notification Delete Profile",
            this.toggleConfirmationModal
          );
        });
    }
  },
  destroyed() {
    this.removeListener();
  },
  methods: {
    toggleConfirmationModal() {
      this.confirmation_modal = true;
    },
    updatePermissions(user) {
      if (
        user &&
        user.practice_detail &&
        user.practice_detail.permissions &&
        user.practice_detail.permissions.length > 0
      ) {
        this.$store.commit(
          "SET_PERMISSIONS",
          user.practice_detail.role.permissions
        );
      } else {
        this.$store.commit("SET_PERMISSIONS", []);
      }
    },
    removeListener() {
      this.$socket.removeListener(
        "Locum Notification Update Profile",
        this.updatePermissions
      );
      this.$socket.removeListener(
        "Locum Notification Delete Profile",
        this.toggleConfirmationModal
      );
    },
    hasPermissions(permissions) {
      if (permissions && permissions.length) {
        let enable = false;
        for (let i = 0; i < permissions.length; i++) {
          if (this.authPermissions.includes(permissions[i])) {
            enable = true;
          }
        }
        return enable;
      } else {
        return true;
      }
    },
    getInit() {
      let domain = this.$auth.user.domain;
      let accountStatus = this.$auth.user.status;
      let practiceStatus =
        this.$auth.user.domain === "Practice" &&
        this.$auth.user.practice_detail.practice.status
          ? this.$auth.user.practice_detail.practice.status
          : null;

      let hubType = "";
      if (domain === "Practice") {
        if (this.$auth.user.practice_detail.practice.type === "Hub") {
          hubType = this.$auth.user.practice_detail.practice.hub_type;
          console.log("hub type", hubType);
        }
      }

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
        addedLists = [
          {
            name: "Profile",
            route: "/profile",
            permissions: [
              "View Profile Practice",
              "View Profile Surgeries",
              "View Profile Users",
              "View Profile Practice Document"
            ]
          }
        ];
        if (
          ["Active", "Dormant"].includes(accountStatus) &&
          practiceStatus &&
          practiceStatus === "Active"
        ) {
          if (this.$auth.user.practice_detail.practice.type === "Hub") {
            console.log("hub");
            addedLists.push({
              name: "Surgery Management",
              route: "/hub-surgery-management"
            });
          } else if (
            this.$auth.user.practice_detail.practice.type === "Spoke"
          ) {
            console.log("spoke");
            addedLists.push({
              name: "Surgery Management",
              route: "/spoke-surgery-management"
            });
          } else if (this.eligibleToSpoke === true) {
            console.log("stand alone");
            addedLists.push({
              name: "Surgery Management",
              route: "/spoke-surgery-management"
            });
          }
          addedLists.push({ name: "Permanent Jobs", route: "/permanent-jobs" });
          if (hubType !== "Type 2") {
            addedLists.push({ name: "My Banks", route: "/my-banks" });
            addedLists.push({
              name: "Sessions",
              route: "/sessions",
              permissions: ["View Sessions Job"]
            });
            addedLists.push({ name: "Billing", route: "/practice-billing" });
          }
          addedLists.push({ name: "Invite", route: "/invite" });
          addedLists.push({
            name: "Roles and Permissions",
            route: "/roles-and-permissions",
            permissions: ["View Role"]
          });
        }
      }
      if (domain === "Locum") {
        addedLists = [
          { name: "Compliance", route: "/compliance" },
          { name: "Availability", route: "/availability" }
        ];
        if (["Active", "Dormant"].includes(accountStatus)) {
          addedLists.push({ name: "My Practice", route: "/my-practice" });
          addedLists.push({ name: "Jobs", route: "/jobs" });
          addedLists.push({ name: "Permanent Jobs", route: "/permanent-jobs" });
          addedLists.push({ name: "Billing", route: "/locum-billing" });
          addedLists.push({ name: "Invite", route: "/invite" });
        }
      }

      this.lists = [...defaultLists, ...addedLists, ...otherLists];
    },
    logout() {
      this.$axios
        .post("/api/v1/logout")
        .then(() => {
          console.log("Socket Logged Out");
          console.log("One Signal Logged Out");
        })
        .catch(err => {
          console.log("err", err.response || err);
          if (err.response.data.message) {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "danger",
              text: [`${err.response.data.message}`]
            });
          }
        })
        .finally(() => {
          return this.$auth.logout();
        })
        .then(() => {
          this.$emit("modal", false);
          this.$store.commit("TOGGLE_SIDEBAR", false);
          this.$auth.$storage.setUniversal("_token.local", "");
          this.$router.push("/");
        })
        .catch(err => {
          console.log("err", err.response || err);
          if (err.response.data.message) {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "danger",
              text: [`${err.response.data.message}`]
            });
          }
        });
    },
    async confirm() {
      await this.$auth.logout();
      this.$auth.$storage.setUniversal("_token.local", "");
      this.$router.push("/");
    },
    isDisabled(routeName) {
      return this.$route.path.includes(routeName) ? "" : "click";
    },
    close() {
      this.$store.commit("TOGGLE_SIDEBAR", false);
      document.body.style.overflow = "auto";
    }
  }
};
</script>
<style scoped>
.shield {
  z-index: 599;
}
.sidebar {
  position: fixed;
  margin-left: -200px;
  width: 200px;
  height: 100%;
  overflow: auto;
  border-right: solid 1px#ccc;
  transition: all 0.3s ease-in-out;
  background-color: white;
  z-index: 55;
}
.toggled-left {
  margin-left: 0;
}
.close-button {
  display: block;
}
@media screen and (min-width: 1200px) {
  .sidebar {
    z-index: 49;
    margin-left: 0;
  }
  .close-button {
    display: none;
  }
}
</style>
