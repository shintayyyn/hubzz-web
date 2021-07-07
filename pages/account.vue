<template>
  <section class="account-section">
    <div class="flex flex-wrap items-center justify-between w-full border-b border-sunglow">
      <div class="flex overflow-x-auto items-center">
        <template v-if="$auth.user.domain === 'Locum'">
          <nuxt-link
            to="/account"
            class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
            :class="['account'].includes($route.name) ? 'border-b-4 border-sunglow' : 'text-gray-600'"
          >
            Personal Details
          </nuxt-link>

          <nuxt-link
            to="/account/profile"
            class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
            :class="$route.name === 'account-profile' ? 'border-b-4 border-sunglow' : 'text-gray-600'"
          >
            Preferences
          </nuxt-link>
        </template>

        <template v-else-if="$auth.user.domain === 'Practice'">
          <nuxt-link
            to="/account"
            class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
            :class="['account'].includes($route.name) ? 'border-b-4 border-sunglow' : 'text-gray-600'"
          >
            User
          </nuxt-link>
        </template>

        <nuxt-link
          to="/account/change-password"
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="$route.name === 'account-change-password' ? 'border-b-4 border-sunglow' : 'text-gray-600'"
        >
          Change Password
        </nuxt-link>

        <button
          v-if="$auth.user.domain === 'Locum' && $auth.user.status !== 'Deactivated'"
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap text-gray-600"
          @click="showDeativateLocumAccountModal = true"
        >
          Deactivate Account
        </button>

        <button
          v-if="$auth.user.domain === 'Locum' && (!$auth.user.account_delete_status || $auth.user.account_delete_status === 'Rejected')"
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap text-gray-600"
          @click="showRequestDeleteLocumAccountModal = true"
        >
          Request Delete Account
        </button>

        <button
          v-if="$auth.user.domain === 'Locum' && $auth.user.account_delete_status && $auth.user.account_delete_status === 'Pending'"
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap text-gray-600"
          @click="showCancelDeleteLocumAccountRequestModal = true"
        >
          Cancel Delete Account Request
        </button>
      </div>
    </div>

    <div class="mt-5">
      <nuxt-child />
    </div>
    
    <AppConfirmationModal
      :label="deactivatingLocum ? 'Deactivating account...' : 'Are you sure you want to deactivate your account?'"
      confirmLabel="Yes"
      cancelLabel="No"
      :modal="showDeativateLocumAccountModal"
      :loading="deactivatingLocum"
      @confirm="deactivateLocumAccount"
      @cancel="showDeativateLocumAccountModal = false"
    />
    
    <AppConfirmationModal
      :label="requestingDeleteLocumAccount ? 'Requesting delete account...' : 'Are you sure you want to delete your account?'"
      confirmLabel="Yes"
      cancelLabel="No"
      :modal="showRequestDeleteLocumAccountModal"
      :loading="requestingDeleteLocumAccount"
      @confirm="requestDeleteLocumAccount"
      @cancel="showRequestDeleteLocumAccountModal = false"
    />
    
    <AppConfirmationModal
      :label="cancelingDeleteAccountRequest ? 'Canceling delete account request...' : 'Are you sure you want to cancel your request?'"
      confirmLabel="Yes"
      cancelLabel="No"
      :modal="showCancelDeleteLocumAccountRequestModal"
      :loading="cancelingDeleteAccountRequest"
      @confirm="cancelDeleteAccountRequest"
      @cancel="showCancelDeleteLocumAccountRequestModal = false"
    />
  </section>
</template>
<script>
import AppConfirmationModal from "@/components/Base/AppConfirmationModal"

export default {
  components: {
    AppConfirmationModal,
  },

  data () {
    return {
      showDeativateLocumAccountModal: false,
      deactivatingLocum: false,
      showRequestDeleteLocumAccountModal: false,
      requestingDeleteLocumAccount: false,
      showCancelDeleteLocumAccountRequestModal: false,
      cancelingDeleteAccountRequest: false,
    }
  },

  mounted () {
    this.$socket.on('Locum Notification Account Delete Request Rejected', this.locumNotificationAccountDeleteRequestRejectedHandler)
  },

  destroyed () {
    this.$socket.removeListener('Locum Notification Account Delete Request Rejected', this.locumNotificationAccountDeleteRequestRejectedHandler)
  },

  methods: {
    locumNotificationAccountDeleteRequestRejectedHandler () {
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

    deactivateLocumAccount () {
      console.log('deactivateLocumAccount')
      this.deactivatingLocum = true
    
      this.$axios.put('/api/v1/locum/me/account/deactivate').then((response) => {
        console.log('response', response)

        const message = response.data.message

        this.$store.commit('SET_NOTIFICATION', {
          enabled: true,
          status: 'success',
          text: [`${message}`,],
        })

        this.logout()
      }).catch((err) => {
        console.log('err', err.response || err)

        let message = null

        if (err.response) {
          message = err.response.data.message
        } else if (err.request) {
          message = 'Something went wrong!'
        } else {
          message = err.message
        }

        console.log('message', message)

        if (message) {
          this.$store.commit('SET_NOTIFICATION', {
            enabled: true,
            status: 'danger',
            text: [`${message}`,],
          })
        }
      }).finally(() => {
        this.showDeativateLocumAccountModal = false
        this.deactivatingLocum = false
      })
    },

    requestDeleteLocumAccount () {
      console.log('requestDeleteLocumAccount')
      this.requestingDeleteLocumAccount = true

      this.$axios.put('/api/v1/locum/me/account/request-delete').then((response) => {
        console.log('response', response)

        const message = response.data.message

        this.$store.commit('SET_NOTIFICATION', {
          enabled: true,
          status: 'success',
          text: [`${message}`,],
        })

        return this.$auth.fetchUser()
      }).catch((err) => {
        console.log('err', err.response || err)

        let message = null

        if (err.response) {
          message = err.response.data.message
        } else if (err.request) {
          message = 'Something went wrong!'
        } else {
          message = err.message
        }

        console.log('message', message)

        if (message) {
          this.$store.commit('SET_NOTIFICATION', {
            enabled: true,
            status: 'danger',
            text: [`${message}`,],
          })
        }
      }).finally(() => {
        this.showRequestDeleteLocumAccountModal = false
        this.requestingDeleteLocumAccount = false
      })
    },

    cancelDeleteAccountRequest () {
      console.log('cancelDeleteAccountRequest')
      this.cancelingDeleteAccountRequest = true

      this.$axios.put('/api/v1/locum/me/account/cancel-delete-request').then((response) => {
        console.log('response', response)

        const message = response.data.message

        this.$store.commit('SET_NOTIFICATION', {
          enabled: true,
          status: 'success',
          text: [`${message}`,],
        })

        return this.$auth.fetchUser()
      }).catch((err) => {
        console.log('err', err.response || err)

        let message = null

        if (err.response) {
          message = err.response.data.message
        } else if (err.request) {
          message = 'Something went wrong!'
        } else {
          message = err.message
        }

        console.log('message', message)

        if (message) {
          this.$store.commit('SET_NOTIFICATION', {
            enabled: true,
            status: 'danger',
            text: [`${message}`,],
          })
        }
      }).finally(() => {
        this.showCancelDeleteLocumAccountRequestModal = false
        this.cancelingDeleteAccountRequest = false
      })
    },
  },
}
</script>
