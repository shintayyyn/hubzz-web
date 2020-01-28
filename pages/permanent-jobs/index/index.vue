<template>
	<section class="flex flex-col items-start">
		<AppButton
			v-if="$auth.user.domain === 'Practice'"
			:label="'Create'"
			class="ml-auto"
			@click="$router.push('/permanent-jobs/create')"
		/>
		<AppTable
			class="w-full"
			v-if="permanent_job_count > 0"
			:total="total"
			:items="permanent_jobs"
			:currentPage="current_page"
			:perPage="params.limit"
			:columns="columns"
			:loading="loading"
			:routerLink="'/permanent-jobs'"
		></AppTable>
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
		AppTable
  },
  
	data() {
		return {
			total: 0,
			current_page: 1,
			// app table params
			params: {
				job_id: null,
				limit: 5,
				offset: 0
			},
			loading: false,
			columns: [
				{
					name: "Title",
					dataIndex: "title"
				},
				{
					name: "Salary",
					dataIndex: "salary_amount",
					class: "text-center"
				},
				{
					name: "Posted",
					dataIndex: "date_posted",
					class: "text-center localDate"
				},
				{
					name: "Closes",
					dataIndex: "date_closing",
					class: "text-center localDate"
				},
				// {
				// 	name: "Role",
				// 	dataIndex: "role",
				// 	class: "text-center"
				// },
				{
					name: "Work Hours",
					dataIndex: "work_hours",
					class: "text-center"
				},
				{
					name: "Industry",
					dataIndex: "industry_type",
					class: "text-center"
				}
			],
      permanent_jobs: [],
      permanent_job_count: 0,
		};
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
