<template>
  <section class="profile-section">
    <AppBreadcrumbs :links="links" />

    <div v-if="!$route.params.id && $route.name !== 'profile-users-create'" class="flex items-center overflow-x-auto whitespace-no-wrap border-b border-sunglow">
      <nuxt-link
        v-if="authPermissions.includes('View Profile Practice')"
        to="/profile"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="['profile', 'profile-practice', 'profile-index', 'profile-index-practice'].includes($route.name) ? 'border-b-4 border-sunglow' : 'text-gray-600'"
      >
        Practice
      </nuxt-link>

      <nuxt-link
        v-if="authPermissions.includes('View Profile Users')"
        to="/profile/users"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('profile-users') ? 'border-b-4 border-sunglow' : 'text-gray-600'"
      >
        Users
      </nuxt-link>

      <nuxt-link
        v-if="authPermissions.includes('View Profile Practice Document')"
        to="/profile/practice-documents"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="['profile-practice-documents', 'profile-standard-terms-id'].includes($route.name) ? 'border-b-4 border-sunglow' : 'text-gray-600'"
      >
        Practice Documents
      </nuxt-link>

      <button
        v-if="$auth.user && $auth.user.domain === 'Practice' && $auth.user.practice_status !== 'Deactivated'"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap text-gray-600"
        @click="showDeactivatePracticeModal = true"
      >
        Deactivate Practice
      </button>

      <button
        v-if="$auth.user && $auth.user.domain === 'Practice' && (!$auth.user.practice_delete_status || $auth.user.practice_delete_status === 'Rejected')"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap text-gray-600"
        @click="showRequestDeletePracticeModal = true"
      >
        Request Delete Practice
      </button>

      <button
        v-if="$auth.user && $auth.user.domain === 'Practice' && $auth.user.practice_delete_status && $auth.user.practice_delete_status === 'Pending'"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap text-gray-600"
        @click="showCancelRequestDeletePracticeModal = true"
      >
        Cancel Request Delete
      </button>
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

    <AppConfirmationModal
      :label="deactivatingPractice ? 'Deactivating practice...' : 'Are you sure you want to deactivate your practice?'"
      confirmLabel="Yes"
      cancelLabel="No"
      :modal="showDeactivatePracticeModal"
      :loading="deactivatingPractice"
      @confirm="deactivatePractice"
      @cancel="showDeactivatePracticeModal = false"
    />

    <AppConfirmationModal
      :label="requestingDeletePractice ? 'Requesting delete practice...' : 'Are you sure you want to DELETE your account? Deleting your account will erase ALL your data'"
      confirmLabel="Yes"
      cancelLabel="No"
      :modal="showRequestDeletePracticeModal"
      :loading="requestingDeletePractice"
      @confirm="requestDeletePractice"
      @cancel="showRequestDeletePracticeModal = false"
    />

    <AppConfirmationModal
      :label="cancelingRequestDeletePractice ? 'Cancelling delete request...' : 'Are you sure you want to cancel your delete request?'"
      confirmLabel="Yes"
      cancelLabel="No"
      :modal="showCancelRequestDeletePracticeModal"
      :loading="cancelingRequestDeletePractice"
      @confirm="cancelRequestDeletePractice"
      @cancel="showCancelRequestDeletePracticeModal = false"
    />
  </section>
</template>
<script>
import AppConfirmationModal from "@/components/Base/AppConfirmationModal"
import AppBreadcrumbs from "@/components/Base/AppBreadcrumbs"

export default {
  components: {
    AppConfirmationModal,
    AppBreadcrumbs,
  },

  data () {
    return {
      modal: false,
      practicePermissions: [],
      // type: null,

      showDeactivatePracticeModal: false,
      deactivatingPractice: false,

      showRequestDeletePracticeModal: false,
      requestingDeletePractice: false,

      showCancelRequestDeletePracticeModal: false,
      cancelingRequestDeletePractice: false,
    }
  },

  computed: {
    authPermissions () {
      return this.$store.getters["permissions"]
    },

    links () {
      let route = this.$route
      let links = [
        {
          title: 'Profile',
          url: '/profile',
        },
      ]

      switch (route.name) {
      case 'profile':
      case "profile-users":
      case "profile-practice-documents":
        return []
      case "profile-users-id":
      case "profile-users-id-change-password":
      case "profile-users-create":
        links.push({
          title: 'Users',
          url: '/profile/users',
        })
        break
      case "profile-practice-documents-id":
        links.push({
          title: 'Practice Documents',
          url: '/profile/practice-documents',
        })
        break
      default:
        break
      }

      if (route.params.id) {
        let tab = ['profile-users-id-change-password','profile-users-id',].includes(route.name) ? 'users' : 'profile-practice-documents-id'
        links.push({
          title: route.params.id,
          url: `/profile/${tab}/${route.params.id}`,
        })
      }

      if (route.name === 'profile-users-id-change-password'){
        links.push({
          title: 'Change Password',
          url: `/profile/users/${route.params.id}/change-password`,
        })
      }

      if (route.name === 'profile-users-create'){
        links.push({
          title: 'Create',
          url: '/profile/users/create',
        })
      }

      return links
    },
  },

  watch: {
    authPermissions (value) {
      if (!this.CheckPermissions(value).hasPermission) {
        this.modal = true
      }
    },
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
      throw err
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

  mounted () {
    this.$socket.on('Practice Notification Practice Deactivated', this.practiceNotificationStatusUpdatedHandler)
    this.$socket.on('Practice Notification Practice Deactivated By Admin', this.practiceNotificationStatusUpdatedHandler)
    this.$socket.on('Practice Notification Practice Reactivated By Admin', this.practiceNotificationStatusUpdatedHandler)
    this.$socket.on('Practice Notification Practice Delete Requested', this.practiceNotificationStatusUpdatedHandler)
    this.$socket.on('Practice Notification Practice Delete Request Cancelled', this.practiceNotificationStatusUpdatedHandler)
    this.$socket.on('Practice Notification Practice Delete Request Rejected', this.practiceNotificationStatusUpdatedHandler)
  },

  destroyed () {
    this.$socket.removeListener('Practice Notification Practice Deactivated', this.practiceNotificationStatusUpdatedHandler)
    this.$socket.removeListener('Practice Notification Practice Deactivated By Admin', this.practiceNotificationStatusUpdatedHandler)
    this.$socket.removeListener('Practice Notification Practice Reactivated By Admin', this.practiceNotificationStatusUpdatedHandler)
    this.$socket.removeListener('Practice Notification Practice Delete Requested', this.practiceNotificationStatusUpdatedHandler)
    this.$socket.removeListener('Practice Notification Practice Delete Request Cancelled', this.practiceNotificationStatusUpdatedHandler)
    this.$socket.removeListener('Practice Notification Practice Delete Request Rejected', this.practiceNotificationStatusUpdatedHandler)
  },

  methods: {
    practiceNotificationStatusUpdatedHandler () {
      this.$auth.fetchUser()
    },

    logout () {
      this.$axios
        .post("/api/v1/logout")
        .catch(err => {
          console.log("err", err.response || err)
        })
        .finally(() => {
          return this.loggedOutHandler()
        })
        .then(() => {
          this.$loggedOutBroadcastChannel.postMessage()
        })
        .catch(err => {
          console.log("err", err.response || err)
        })
    },

    async loggedOutHandler () {
      try {
        await this.$auth.logout()
        this.$auth.$storage.setUniversal("_token.local", "")
        this.$router.push("/")
      } catch (err) {
        console.log("err", err)
      }
    },

    errorHandler (err) {
      console.log('err', err.response || err)

      let message = null

      if (err.response) {
        message = err.response.data.message
      } else if (err.request) {
        message = 'Something went wrong!'
      } else {
        message = err.message
      }

      if (message) {
        this.$store.commit('SET_NOTIFICATION', {
          enabled: true,
          status: 'danger',
          text: [`${message}`,],
        })
      }
    },

    deactivatePractice () {
      this.deactivatingPractice = true
    
      this.$axios.put('/api/v1/practice/me/practice-account/deactivate').then((response) => {
        console.log('response', response)

        const message = response.data.message

        this.$store.commit('SET_NOTIFICATION', {
          enabled: true,
          status: 'success',
          text: [`${message}`,],
        })

        this.logout()
      }).catch(this.errorHandler).finally(() => {
        this.showDeactivatePracticeModal = false
        this.deactivatingPractice = false
      })
    },

    requestDeletePractice () {
      this.requestingDeletePractice = true
    
      this.$axios.put('/api/v1/practice/me/practice-account/request-delete').then((response) => {
        console.log('response', response)

        const message = response.data.message

        this.$store.commit('SET_NOTIFICATION', {
          enabled: true,
          status: 'success',
          text: [`${message}`,],
        })
      }).catch(this.errorHandler).finally(() => {
        this.showRequestDeletePracticeModal = false
        this.requestingDeletePractice = false
      })
    },

    cancelRequestDeletePractice () {
      this.cancelingRequestDeletePractice = true
    
      this.$axios.put('/api/v1/practice/me/practice-account/cancel-request-delete').then((response) => {
        console.log('response', response)

        const message = response.data.message

        this.$store.commit('SET_NOTIFICATION', {
          enabled: true,
          status: 'success',
          text: [`${message}`,],
        })
      }).catch(this.errorHandler).finally(() => {
        this.showCancelRequestDeletePracticeModal = false
        this.cancelingRequestDeletePractice = false
      })
    },

    goTo () {
      this.modal = false
      setTimeout(() => {
        this.$router.push("/")
      }, 500)
    },
  },
}
</script>
