<template>
	<section class="flex flex-col items-start w-full">
		<template v-if="$auth.user.domain ===  'Practice'">
			<AppTable
				class="w-full"
				v-if="permanent_job_count > 0"
				:total="permanent_job_count"
				:items="permanent_jobs"
				:currentPage="current_page"
				:perPage="params.limit"
				:columns="columns"
				:loading="loading"
				:routerLink="'/permanent-jobs'"
				@pagechanged="pagechanged"
				@limitchanged="limitchanged"
			></AppTable>
			<p
				v-else
				class="text-gray-600 px-3 py-2"
			>No {{ $route.query.status === 'Closed' ? 'closed' : 'available'}} jobs yet.</p>
		</template>

		<template v-if="$auth.user.domain ===  'Locum'">
			<AppTable
				class="w-full"
				v-if="permanent_jobs_for_locum_count > 0"
				:total="permanent_jobs_for_locum_count"
				:items="permanent_jobs_for_locum"
				:currentPage="current_page"
				:perPage="params.limit"
				:columns="locumColumns"
				:loading="loading"
				:routerLink="'/permanent-jobs'"
				@pagechanged="pagechanged"
				@limitchanged="limitchanged"
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
			<p
				v-else
				class="text-gray-600 px-3 py-2"
			>No {{ $route.query.status === 'Closed' ? 'closed' : 'available'}} jobs yet.</p>
		</template>
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
		// AppButton,
		AppTable
	},
	middleware({ query, redirect, error }) {
		if (
			query.status &&
			!["available", "closed"].includes(query.status.toLowerCase())
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
					name: "Surgery",
					dataIndex: "practice.name"
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
					name: "Profession",
					dataIndex: "professions.name",
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
					name: "Surgery",
					dataIndex: "practice.name"
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
					name: "Profession",
					dataIndex: "professions.name",
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

	watch: {
		"$route.query.status"(newStatus, oldStatus) {
			let params = {};
			if (this.$auth.user.domain === "Locum") {
				params = {
					job_posting_status: newStatus ? newStatus : "Available",
					profession_id: this.$auth.user.locum_detail.profession.id,
					near_post_code: this.$auth.user.locum_postcode
				};
				this.loading = true;
				setTimeout(async () => {
					this.loading = true;
					await this.getPermanentJobsForLocum(params);
					this.loading = false;
				});
				this.loading = false;
			} else if (this.$auth.user.domain === "Practice") {
				params = {
					job_posting_status: newStatus ? newStatus : "Available",
					practice_id: this.$auth.user.practice_id
				};
				setTimeout(async () => {
					this.loading = true;
					await this.getPermanentJobsForPractice(params);
					this.loading = false;
				});
			}
		}
	},

	async asyncData({ app, route, store, auth }) {
		try {
			let permanent_job_count = "";
			let permanent_jobs = "";

			// FOR LOCUM ONLY
			let permanent_job_applications_count = "";
			let permanent_job_applications = "";
			let permanent_jobs_for_locum = "";
			let permanent_jobs_for_locum_count = "";
			let params = {};
			if (app.$auth.user.domain === "Locum") {
				params = {
					job_posting_status: route.query.status
						? route.query.status
						: "Available",
					profession_id: app.$auth.user.locum_detail.profession.id,
					near_post_code: app.$auth.user.locum_postcode
				};

				let response = await app.$axios.$get(
					`/api/v1/locum/permanent-jobs/count`,
					{ params }
				);
				permanent_job_count =
					response.data && response.data.count ? response.data.count : null;

				response = await app.$axios.$get(`/api/v1/locum/permanent-jobs`, {
					params
				});
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
				params = {
					job_posting_status: route.query.status
						? route.query.status
						: "Available",
					practice_id: app.$auth.user.practice_id
				};
				let response = await app.$axios.$get(
					`/api/v1/practice/permanent-jobs/count`,
					{ params }
				);
				permanent_job_count =
					response.data && response.data.count ? response.data.count : null;

				response = await app.$axios.$get(`/api/v1/practice/permanent-jobs`, {
					params
				});

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
				permanent_jobs_for_locum,
				params
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
				case "Unsuccessful":
					return "bg-gray-400";
				default:
					return "bg-yellow-400 text-black";
			}
		},

		getJobs(params) {
			if (this.$auth.user.domain === "Locum") {
				this.getPermanentJobsForLocum(params);
			}
			if (this.$auth.user.domain === "Practice") {
				this.getPermanentJobsForPractice(params);
			}
		},

		async getPermanentJobsForLocum(params) {
			await this.$axios
				.$get(`/api/v1/locum/permanent-jobs/count`, { params })
				.then(res => {
					this.permanent_job_count =
						res.data && res.data.count ? res.data.count : null;
				});

			await this.$axios
				.$get(`/api/v1/locum/permanent-jobs`, { params })
				.then(res => {
					this.permanent_jobs =
						res.data && res.data.permanent_jobs
							? res.data.permanent_jobs
							: null;
				});

			await this.$axios
				.$get(`/api/v1/locum/permanent-job-applications/count`)
				.then(res => {
					this.permanent_job_applications_count =
						res.data && res.data.count ? res.data.count : null;
				});

			await this.$axios
				.$get(`/api/v1/locum/permanent-job-applications`)
				.then(res => {
					this.permanent_job_applications =
						res.data && res.data.permanent_job_applications
							? res.data.permanent_job_applications
							: null;
				});

			this.permanent_jobs_for_locum = this.permanent_jobs.map(permanent_job => {
				const permanent_job_app_found = this.permanent_job_applications.find(
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

			this.permanent_jobs_for_locum_count = this.permanent_jobs_for_locum.length;
		},

		async getPermanentJobsForPractice(params) {
			await this.$axios
				.$get("/api/v1/practice/permanent-jobs/count", { params })
				.then(res => {
					console.log("permanent", res);
					this.permanent_job_count =
						res.data && res.data.count ? res.data.count : null;
				});

			await this.$axios
				.$get(`/api/v1/practice/permanent-jobs`, { params })
				.then(res => {
					this.permanent_jobs =
						res.data && res.data.permanent_jobs
							? res.data.permanent_jobs
							: null;
				});
		},
		async sorted(order_by) {
			let orderBy = order_by.map(item => {
				let order = item.split(":")[1];
				let sorting = item.split(":")[0];
				switch (sorting) {
					case "date_time_start":
						sorting = "date_start";
						break;
					case "date_time_end":
						sorting = "date_end";
						break;
					case "rate_name":
						sorting = "rate";
						break;
					default:
						sorting;
				}
				return `${sorting}:${order}`;
			});
			this.current_page = 1;
			this.params.offset = 0;
			this.params.order_by = orderBy;
			this.jobPartParams.offset = 0;
			this.jobPartParams.order_by = orderBy;
			this.loading = true;
			await this.getJobs(this.isJobPart ? this.jobPartParams : this.params);
			this.loading = false;
		},
		async pagechanged(page) {
			this.current_page = page;
			this.params.offset = this.params.limit * (page - 1);
			this.params.offset = this.params.limit * (page - 1);
			this.loading = true;
			this.getJobs(this.params);
			this.loading = false;
		},
		async limitchanged(limit) {
			this.current_page = 1;
			this.params.offset = 0;
			this.params.limit = limit;
			this.params.offset = 0;
			this.params.limit = limit;
			this.loading = true;
			this.getJobs(this.params);
			this.loading = false;
		}
	}
};
</script>
