<template>
  <section class="flex flex-col items-start w-full">
    <div class="flex flex-wrap items-center justify-between w-full border-b border-sunglow">
      <div class="flex overflow-x-auto items-center">
        <nuxt-link
          v-if="$auth.user.domain === 'Practice' 
            && ($auth.user.practice_detail.practice.type === 'Spoke' || $auth.user.practice_detail.practice.type === 'Hub' )
            && $auth.user.practice_detail.practice.allow_surgery_create_permanent_jobs === false"
          to="/permanent-jobs?status=Pending"
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="
            ($route.query.status && $route.query.status.toLowerCase() === 'pending')
              ? 'border-b-4 border-sunglow'
              : 'text-gray-600'
          "
        >
          Pending
        </nuxt-link>
        <nuxt-link
          to="/permanent-jobs"
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="
            !$route.query.status || ($route.query.status && $route.query.status.toLowerCase() === 'available')
              ? 'border-b-4 border-sunglow'
              : 'text-gray-600'
          "
        >
          Available
        </nuxt-link>
        <nuxt-link
          to="/permanent-jobs?status=Closed"
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="
            ($route.query.status && $route.query.status.toLowerCase() === 'closed')
              ? 'border-b-4 border-sunglow'
              : 'text-gray-600'
          "
        >
          Closed
        </nuxt-link>
      </div>
    </div>
		

    <div
      v-if="['permanent-jobs-index-id','permanent-jobs-index-create'].includes($route.name)"
      class="shield"
      @click="$router.go(-1)"
    />
    <nuxt-child />

    <AppConfirmationModal
      :label="'You\'ve been revoked to view this Page'"
      :confirmLabel="'OK'"
      :modal="confirmation_modal"
      @confirm="goTo"
    />
  </section>
</template>
<script>
import AppConfirmationModal from "@/components/Base/AppConfirmationModal"
import AppButton from "@/components/Base/AppButton"
export default {
  components: {
    AppButton,
    AppConfirmationModal,
  },

  data () {
    return {
      spokeIsNotAllowed: false,
      confirmation_modal: false,
    }
  },
  watch: {
    authPermissions (value) {
      if (!this.CheckPermissions(value).hasPermission) {
        this.confirmation_modal = true
      }
    },
  },

  async asyncData ({ app, store, error, }) {
    try {
      const authPermissions = store.getters["permissions"]

      if (
        app.$auth.user.domain === "Practice"
				&& authPermissions.includes("View Permanent Job") === false
      ) {
        error({
          statusCode: 403,
          message: "You are not authorized to view this page.",
        })
        return
      }
      if (
        app.$auth.user.domain === "Practice"
				&& app.$auth.user.practice_detail
				&& app.$auth.user.practice_detail.practice
				&& app.$auth.user.practice_detail.practice.type === "Spoke"
				&& app.$auth.user.practice_detail.practice.parent_practice_id === null
				&& app.$auth.user.practice_detail.practice
				  .allow_surgery_create_permanent_jobs === false
      ) {
        error({
          statusCode: 403,
          message: "You are not authorized to view this page.",
        })

        return
      }
    } catch (err) {
      console.log("err", err.response || err)
      error(err)
    }
  },

  created () {
    if (this.$auth.user.domain === "Practice") {
      if (
        this.$auth.user.practice_detail.practice.type == "Spoke"
				&& this.$auth.user.practice_detail.practice
				  .allow_surgery_create_permanent_jobs === false
      ) {
        this.spokeIsNotAllowed = true
      }
    }
  },

  methods: {
    goTo () {
      this.confirmation_modal = false
      setTimeout(() => {
        this.$router.push("/")
      }, 500)
    },
  },
}
</script>
