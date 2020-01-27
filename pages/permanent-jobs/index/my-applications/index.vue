<template>
	<section class="flex flex-col items-start">
		<AppTable
			class="w-full"
			v-if="applications_count > 0"
			:total="total"
			:items="permanent_job_applications"
			:currentPage="current_page"
			:perPage="params.limit"
			:columns="columns"
			:loading="loading"
			:routerLink="'/permanent-jobs/my-applications'"
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
		// AppButton,
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
					name: "Permanent Job Id",
					dataIndex: "permanent_job_id"
				},
				{
					name: "Application Status",
					dataIndex: "application_status",
					class: "text-center"
				},
				{
					name: "Posted",
					dataIndex: "permanent_job.date_posted",
					class: "text-center localDate"
				},
				{
					name: "Closes",
					dataIndex: "permanent_job.date_closing",
					class: "text-center localDate"
				},
				// {
				// 	name: "Role",
				// 	dataIndex: "role",
				// 	class: "text-center"
				// },
				{
					name: "Work Hours",
					dataIndex: "permanent_job.work_hours",
					class: "text-center"
				},
				{
					name: "Industry",
					dataIndex: "permanent_job.industry_type",
					class: "text-center"
				}
			],
      permanent_job_applications: [],
      applications_count: 0,
		};
  },
 
  async asyncData({ app, route, store, auth }) {
    try {
      console.log('auth', app.$auth.user.domain)
      let applications_count = ''
      let permanent_job_applications = ''
      
      if (app.$auth.user.domain === 'Locum') {
        let response = await app.$axios.$get(`/api/v1/locum/permanent-job-applications/count`)
        applications_count = response.data && response.data.count ? response.data.count : null

        response = await app.$axios.$get(`/api/v1/locum/permanent-job-applications`)
        permanent_job_applications = response.data && response.data.permanent_job_applications ? response.data.permanent_job_applications : null

      }
    
      return {
        applications_count,
        permanent_job_applications,
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
