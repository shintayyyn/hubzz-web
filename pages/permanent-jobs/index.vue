<template>
  <section class="flex flex-col items-start w-full">
		<AppBreadcrumbs :links="links" v-if="$route.name !== 'permanent-jobs-index'"/>
    <template v-if="$route.name === 'permanent-jobs-index'">
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
    </template>
		
<!-- 
    <div
      v-if="['permanent-jobs-index-id','permanent-jobs-index-create'].includes($route.name)"
      class="shield"
      @click="$router.go(-1)"
    /> -->
    <div class="pr-5">
      <nuxt-child />
    </div>

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
import AppBreadcrumbs from "@/components/Base/AppBreadcrumbs"
export default {
  components: {
    AppButton,
    AppConfirmationModal,
    AppBreadcrumbs
  },

  data () {
    return {
      spokeIsNotAllowed: false,
      confirmation_modal: false,
    }
  },
  computed: {
    links() {
      console.log("hello world", this.$route)
      let route = this.$route
      let links = [
						{
							title: `${route.query.status ? route.query.status : 'Available'} Salaried Roles`,
							url: `/permanent-jobs${route.query.status && route.query.status !== 'Available' ? '/?status='+route.query.status : ''}`
						},
          ]
      if (route.name === 'permanent-jobs-index-create') {
        links = [
          {
            title: 'Permanent Jobs',
            url: '/permanent-jobs'
          },
          {
            title: 'Create Permanent Job',
            url: '/permanent-jobs/create'
          }
        ]
      }
      if (route.params.id) {
        links.push({
          title: route.params.id,
          url: `/permanent-jobs/${route.params.id}${route.query.status && route.query.status !== 'Available' ? '/?status='+route.query.status : ''}`
        })
      }
      if (route.params.locumId) {
        links.push({
          title: 'Applicants',
          url: `/permanent-jobs/${route.params.id}${route.query.status && route.query.status !== 'Available' ? '/?status='+route.query.status : ''}`
        },
        {
          title: route.params.locumId,
          url: `/permanent-jobs/${route.params.id}/${route.params.locumId}${route.query.status && route.query.status !== 'Available' ? '/?status='+route.query.status : ''}`
        })
      }
      console.log(links)
      return links
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
    console.log("route", this.$route)
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
