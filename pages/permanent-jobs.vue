<template>
  <section class="flex flex-col items-start w-full">
    <div class="flex flex-wrap items-center justify-between w-full">
      <div class="my-1 flex overflow-x-auto items-center">
        <nuxt-link
          v-if="$auth.user.domain === 'Practice' 
            && $auth.user.practice_detail.practice.type === 'Spoke' 
            && $auth.user.practice_detail.practice.allow_surgery_create_permanent_jobs === false"
          to="/permanent-jobs?status=Pending"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="
            ($route.query.status && $route.query.status.toLowerCase() === 'pending')
              ? 'border rounded-lg border-yellow-500 bg-yellow-500'
              : 'text-gray-600'
          "
        > 
          Pending
        </nuxt-link>
        <nuxt-link
          to="/permanent-jobs"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="
            !$route.query.status || ($route.query.status && $route.query.status.toLowerCase() === 'available')
              ? 'border rounded-lg border-yellow-500 bg-yellow-500'
              : 'text-gray-600'
          "
        >
          Available
        </nuxt-link>
        <nuxt-link
          to="/permanent-jobs?status=Closed"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="
            ($route.query.status && $route.query.status.toLowerCase() === 'closed')
              ? 'border rounded-lg border-yellow-500 bg-yellow-500'
              : 'text-gray-600'
          "
        >
          Closed
        </nuxt-link>
        <!-- <nuxt-link
          v-if="$auth.user.domain === 'Practice'"
					to="/permanent-jobs?status=Unfilled"
					class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
					:class="
					($route.query.status && $route.query.status.toLowerCase() === 'unfilled')
						? 'border rounded-lg border-yellow-500 bg-yellow-500'
						: 'text-gray-600'
					"
				>Unfilled</nuxt-link> -->
      </div>
      <AppButton
        v-if="$auth.user.domain === 'Practice'"
        :label="'Create Permanent Job'"
        :class="'whitespace-no-wrap my-1'"
        @click="$router.push('/permanent-jobs/create')"
      />
    </div>

    <div
      v-if="['permanent-jobs-index-id','permanent-jobs-index-create'].includes($route.name)"
      class="shield"
      @click="$router.go(-1)"
    />
    <nuxt-child />
  </section>
</template>
<script>
import AppButton from "@/components/Base/AppButton"
export default {
  components: {
    AppButton,
  },
  data () {
    return {
      spokeIsNotAllowed: false,
    }
  },
  created () {
    if(this.$auth.user.domain === 'Practice') {
      if(this.$auth.user.practice_detail.practice.type == 'Spoke' &&
        this.$auth.user.practice_detail.practice.allow_surgery_create_permanent_jobs === false) {
        this.spokeIsNotAllowed = true
      }
    }
  },

}
</script>
