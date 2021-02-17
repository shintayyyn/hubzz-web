<template>
  <section class="profile-section">
    <AppBreadcrumbs :links="links" />
    <div v-if="!$route.params.id" class="flex items-center overflow-x-auto whitespace-no-wrap border-b border-sunglow">
      <nuxt-link
        v-if="authPermissions.includes('View Profile Practice')"
        to="/profile"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="['profile', 'profile-practice', 'profile-index', 'profile-index-practice'].includes($route.name) ? 'border-b-4 border-sunglow' : 'text-gray-600'"
      >Practice</nuxt-link>
      <nuxt-link
        v-if="authPermissions.includes('View Profile Users')"
        to="/profile/users"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('profile-users') ? 'border-b-4 border-sunglow' : 'text-gray-600'"
      >Users</nuxt-link>
      <nuxt-link
        v-if="authPermissions.includes('View Profile Practice Document')"
        to="/profile/practice-documents"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="['profile-practice-documents', 'profile-standard-terms-id'].includes($route.name) ? 'border-b-4 border-sunglow' : 'text-gray-600'"
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
import AppBreadcrumbs from "@/components/Base/AppBreadcrumbs";
export default {
  components: {
    AppConfirmationModal,
    AppBreadcrumbs
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
    },
    links() {
      let route = this.$route
      let links = [
        {
          title: 'Profile',
          url: '/profile'
        }
      ]

      switch (route.name) {
        case 'profile':
        case "profile-users":
        case "profile-practice-documents":
          return []
        case "profile-users-id":
        case "profile-users-id-change-password":
          links.push({
            title: 'Users',
            url: '/profile/users'
          })
          break;
        case "profile-practice-documents-id":
          links.push({
            title: 'Practice Documents',
            url: '/profile/practice-documents'
          })
          break
        default:
          break;
      }

      if (route.params.id) {
        let tab = ['profile-users-id-change-password','profile-users-id'].includes(route.name) ? 'users' : 'profile-practice-documents-id'
        links.push({
          title: route.params.id,
          url: `/profile/${tab}/${route.params.id}`
        })
      }

      if (route.name === 'profile-users-id-change-password'){
        links.push({
          title: 'Change Password',
          url: `/profile/users/${route.params.id}/change-password`
        })
      }


      console.log("route", route)
      console.log("links", links)

      return links
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
