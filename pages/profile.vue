<template>
  <section class="profile-section">
    <div class="flex items-center overflow-x-auto whitespace-no-wrap">
      <nuxt-link
        to="/profile"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="['profile', 'profile-practice'].includes($route.name) ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        v-if="authPermissions.includes('View Profile Practice')"
      >Practice</nuxt-link>
      <nuxt-link
        to="/profile/users"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('profile-users')  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        v-if="authPermissions.includes('View Profile Users')"
      >Users</nuxt-link>
      <nuxt-link
        to="/profile/practice-documents"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('profile-practice-documents')  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        v-if="authPermissions.includes('View Profile Practice Document')"
      >Practice Documents</nuxt-link>
    </div>
    <div class="mt-2">
      <nuxt-child />
    </div>
    <AppConfirmationModal
      :label="'You\'ve been revoked to view this Page'"
      :confirmLabel="'OK'"
      :modal="modal"
      @confirm="goTo"
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
      modal: false
      // type: null
    };
  },
  computed: {
    authPermissions() {
      return this.$store.getters["auth/permissions"];
    }
  },
  // async asyncData({ app, store, error }) {
  //   try {
  //     const responsePracticeType = await app.$axios.$get(
  //       `/api/v1/practice/me/practice-type`
  //     );
  //     let type =
  //       responsePracticeType.data &&
  //       responsePracticeType.data.practice &&
  //       responsePracticeType.data.practice.type
  //         ? responsePracticeType.data.practice.type
  //         : null;

  //     return {
  //       type
  //     };
  //   } catch (err) {
  //     throw err;
  //   }
  // },
  watch: {
    authPermissions(value) {
      console.log("watch permissions", value);
      if (!this.CheckPermissions(value).hasPermission) {
        this.modal = true;
      }
    }
  },
  mounted() {
    // if (this.$route.name === "profile") {
    //   if (this.authPermissions.includes("View Profile Practice")) {
    //     this.$router.push("/profile/practice");
    //   } else if (
    //     this.authPermissions.includes("View Profile Surgeries") &&
    //     this.type != "Stand Alone"
    //   ) {
    //     this.$router.push("/profile/practice-spokes");
    //   } else if (this.authPermissions.includes("View Profile Users")) {
    //     this.$router.push("/profile/users");
    //   } else if (
    //     this.authPermissions.includes("View Profile Practice Document")
    //   ) {
    //     this.$router.push("/profile/practice-documents");
    //   }
    // }
  },
  methods: {
    goTo() {
      this.modal = false;
      setTimeout(() => {
        this.$router.push("/");
      }, 500);
    }
  }
};
</script>
