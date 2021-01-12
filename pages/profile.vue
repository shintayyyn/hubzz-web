<template>
  <section class="profile-section">
    <div class="flex items-center overflow-x-auto whitespace-no-wrap border-b-2 border-yellow-300">
      <nuxt-link
        v-if="authPermissions.includes('View Profile Practice')"
        to="/profile"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="['profile', 'profile-practice', 'profile-index', 'profile-index-practice'].includes($route.name) ? 'border-b-2 border-yellow-500' : 'text-gray-600'"
      >Practice</nuxt-link>
      <nuxt-link
        v-if="authPermissions.includes('View Profile Users')"
        to="/profile/users"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('profile-users') ? 'border-b-2 border-yellow-500' : 'text-gray-600'"
      >Users</nuxt-link>
      <nuxt-link
        v-if="authPermissions.includes('View Profile Practice Document')"
        to="/profile/practice-documents"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="['profile-practice-documents', 'profile-standard-terms-id'].includes($route.name) ? 'border-b-2 border-yellow-500' : 'text-gray-600'"
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
      modal: false,
      practicePermissions: [],
      // type: null
    };
  },
  computed: {
    authPermissions () {
      return this.$store.getters["permissions"];
    }
  },
  async asyncData ({ store, error, }) {
    try {
      const authPermissions = store.getters["permissions"]

      const practicePermissions = authPermissions.filter(item => item.includes('View Profile'))

      if (authPermissions.includes('View Profile Practice') === false
        && authPermissions.includes('View Profile Practice Document') === false
        && authPermissions.includes('View Profile Users') === false ) {
        error({
          statusCode: 403,
          message: 'You are not authorized to view this page.',
        })
        return
      }
      
    
      // const responsePracticeType = await app.$axios.$get(
      //   `/api/v1/practice/me/practice-type`
      // );
      // let type =
      //   responsePracticeType.data &&
      //   responsePracticeType.data.practice &&
      //   responsePracticeType.data.practice.type
      //     ? responsePracticeType.data.practice.type
      //     : null;

      return {
        practicePermissions,
      }
    } catch (err) {
      throw err;
    }
  },
  created () {
    let toRedirect = ''
    if (this.practicePermissions.find(item => item === 'View Profile Practice') === undefined) {
      console.log('redirecting')
      switch (this.practicePermissions[0]) {
      case "View Profile Practice Document":
        toRedirect = "users"
        break
      case "View Profile Users":
        toRedirect = "practice-documents"
        break
      default:
        toRedirect = ''
      }
      this.$router.push(`/profile/${toRedirect}`)
    }
  },
  watch: {
    authPermissions(value) {
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
    //     this.authPermissions.includes("View Surgery Management") &&
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
