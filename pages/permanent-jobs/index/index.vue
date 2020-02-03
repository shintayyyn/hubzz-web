<template>
	<section class="flex flex-col items-start py-2 w-full">
		<div class="flex w-full">
			<AppButton
				v-if="$auth.user.domain === 'Practice'"
				:label="'Create'"
				class="ml-auto"
				@click="$router.push('/permanent-jobs/create')"
			/>
		</div>
		<AppTable
			class="w-full"
			v-if="permanent_job_count > 0 && $auth.user.domain ===  'Practice'"
			:total="total"
			:items="permanent_jobs"
			:currentPage="current_page"
			:perPage="params.limit"
			:columns="columns"
			:loading="loading"
			:routerLink="'/permanent-jobs'"
		></AppTable>

		<AppTable
			class="w-full"
			v-if="permanent_jobs_for_locum_count > 0 "
			:total="total"
			:items="permanent_jobs_for_locum"
			:currentPage="current_page"
			:perPage="params.limit"
			:columns="locumColumns"
			:loading="loading"
			:routerLink="'/permanent-jobs'"
		>
			<template v-slot:status_slot="slotProps">
				<div class="flex items-center justify-center">
					<div
						class="rounded-full px-6 py-1"
						:class="statusStyle(slotProps.item.status)"
					>{{ slotProps.item.status }}</div>
				</div>
			</template>
		</AppTable>

		<div
			class="shield"
			v-if="['permanent-jobs-index-id','permanent-jobs-index-create'].includes($route.name)"
			@click="$router.go(-1)"
		></div>
		<nuxt-child />
	</section>
</template>
<script>
var moment = require("moment");
import AppButton from "@/components/Base/AppButton";
import AppTable from "@/components/Base/AppTable";
export default {
	components: {
		AppButton,
		AppTable
	},
	middleware({ query, redirect, error }) {
		if (
			query.status &&
			!["live", "filled", "unfilled"].includes(query.status.toLowerCase())
		) {
			return error({
				status: 404,
				message: "This Permanent Job Status is Invalid"
			});
		}
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

			locumColumns: [
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
				},
				{
					name: "Status",
					slot: true,
					slotName: "status_slot",
					dataIndex: "",
					class: "text-center"
				}
			],

			permanent_job_count: 0,
			permanent_jobs: [],

			permanent_job_applications_count: 0,
			permanent_job_applications: [],

			permanent_jobs_for_locum_count: 0,
			permanent_jobs_for_locum: []
		};
	},

	created() {},
	async asyncData({ app, route, store, auth }) {
		try {
			let permanent_job_count = "";
			let permanent_jobs = "";

			// FOR LOCUM ONLY
			let permanent_job_applications_count = "";
			let permanent_job_applications = "";
			let permanent_jobs_for_locum = "";
			let permanent_jobs_for_locum_count = "";

			if (app.$auth.user.domain === "Locum") {
				let response = await app.$axios.$get(
					`/api/v1/locum/permanent-jobs/count`
				);
				permanent_job_count =
					response.data && response.data.count ? response.data.count : null;

				response = await app.$axios.$get(`/api/v1/locum/permanent-jobs`);
				permanent_jobs =
					response.data && response.data.permanent_jobs
						? response.data.permanent_jobs
						: null;

				response = await app.$axios.$get(
					`/api/v1/locum/permanent-job-applications/count`
				);
				permanent_job_applications_count =
					response.data && response.data.count ? response.data.count : null;

				response = await app.$axios.$get(
					`/api/v1/locum/permanent-job-applications`
				);
				permanent_job_applications =
					response.data && response.data.permanent_job_applications
						? response.data.permanent_job_applications
						: null;

				permanent_jobs_for_locum = permanent_jobs.map(permanent_job => {
					const permanent_job_app_found = permanent_job_applications.find(
						permanent_job_application =>
							permanent_job_application.permanent_job_id === permanent_job.id
					);
					if (permanent_job_app_found) {
						permanent_job.status = permanent_job_app_found.application_status;
					} else {
						if (permanent_job.date_closing < moment().format()) {
							permanent_job.status = "Closed";
						} else {
							permanent_job.status = "Available";
						}
					}
					return permanent_job;
				});

				permanent_jobs_for_locum_count = permanent_jobs_for_locum.length;
			} else if (app.$auth.user.domain === "Practice") {
				let response = await app.$axios.$get(
					"/api/v1/practice/permanent-jobs/count"
				);
				permanent_job_count =
					response.data && response.data.count ? response.data.count : null;

				response = await app.$axios.$get(`/api/v1/practice/permanent-jobs`);
				permanent_jobs =
					response.data && response.data.permanent_jobs
						? response.data.permanent_jobs
						: null;
			}

			return {
				permanent_job_count,
				permanent_jobs,
				permanent_job_applications_count,
				permanent_job_applications,
				permanent_jobs_for_locum_count,
				permanent_jobs_for_locum
			};
		} catch (err) {
			if (err.response && err.response.status === 401) {
				error(err.response.data);
				return;
			}
			throw err;
		}
	},

	methods: {
		statusStyle(jobStatus) {
			switch (jobStatus) {
				case "Available":
					return "bg-green-500 text-white";
					break;
				case "Applied":
					return "bg-yellow-600 text-white";
					break;
				case "For Interview":
					return "bg-green-600 text-white";
					break;
				case "Accepted":
					return "bg-green-700 text-white";
					break;
				case "Rejected":
					return "bg-red-700 text-white";
					break;
				case "Closed":
					return "bg-gray-700 text-white";
					break;
				default:
					return "bg-yellow-400 text-black";
			}
		}
	}
};
</script>
