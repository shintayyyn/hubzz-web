<template>
	<section class="flex flex-col items-start">
    <div v-if="$auth.user.domain === 'Locum'" class="flex overflow-x-auto">
      <nuxt-link
        :to="`/permanent-jobs`"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="
          $route.name === 'permanent-jobs-index'
            ? 'border rounded-lg border-yellow-500 bg-yellow-500'
            : 'text-gray-600'
        "
        >Permanent Jobs
      </nuxt-link>
      <nuxt-link
        :to="`/permanent-jobs/my-applications`"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="
          $route.name.includes(
            'permanent-jobs-index-my-applications'
          ) || $route.name === 'permanent-jobs-index-my-applications'
            ? 'border rounded-lg border-yellow-500 bg-yellow-500'
            : 'text-gray-600'"
        >My Applications
      </nuxt-link>
    </div>
		<div
			class="shield"
			v-if="['permanent-jobs-index-id','permanent-jobs-index-create'].includes($route.name)"
			@click="$router.go(-1)"
		></div>
		<nuxt-child />
	</section>
</template>
<script>
import AppButton from "@/components/Base/AppButton";
import AppTable from "@/components/Base/AppTable";
export default {
	components: {
		AppButton,
		// AppTable
  },
  
	data() {

  },
  created(){
    
  },
  async asyncData({ app, route, store, auth }) {
    try {
      console.log('auth', app.$auth.user.domain)
      let permanent_job_count = ''
      let permanent_jobs = ''
      if (app.$auth.user.domain === 'Locum') {
        let response = await app.$axios.$get(`/api/v1/locum/permanent-jobs/count`)
        permanent_job_count = response.data && response.data.count ? response.data.count : null

        response = await app.$axios.$get(`/api/v1/locum/permanent-jobs`)
        permanent_jobs = response.data && response.data.permanent_jobs ? response.data.permanent_jobs : null

      } else if (app.$auth.user.domain === 'Practice') {
        let response = await app.$axios.$get('/api/v1/practice/permanent-jobs/count')
        permanent_job_count = response.data && response.data.count 
          ? response.data.count : null

        response = await app.$axios.$get(`/api/v1/practice/permanent-jobs`)
        permanent_jobs = response.data && response.data.permanent_jobs 
          ? response.data.permanent_jobs : null
      }
    
      return {
        permanent_job_count,
        permanent_jobs,
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
				error(err.response.data);
				return;
			}
			throw err;
    }
  },
};
</script>
