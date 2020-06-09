<template>
	<div class="relative flex flex-col w-full my-5">
		<div class="text-md font-bold">Job Parts</div>
		<div v-if="parts.length === 0 && loading" class="relative flex w-full" style="min-height:80px">
			<AppLoading :loading="loading" spinner />
		</div>
		<AppTable
			v-if="parts.length > 0"
			:total="total"
			:items="parts"
			:currentPage="current_page"
			:perPage="params.limit"
			:columns="columns"
			:loading="loading"
			:routerLink="routerLink"
			:customWidth="700"
			@pagechanged="pagechanged"
			@limitchanged="limitchanged"
		>
			<template v-slot:complete="slotProps">
				<button
					v-if="slotProps.item.status === 'Ongoing'"
					class="text-white px-3 py-2 rounded-lg transition-hover focus:outline-none"
					:class="slotProps.item.status === 'Ongoing' && authPermissions.includes('Complete Sessions Job') ? 'bg-green-500 hover:bg-green-600 ' : 'cursor-not-allowed bg-gray-400'"
					@click="slotProps.item.status === 'Ongoing' && authPermissions.includes('Complete Sessions Job') ? [completeJobPart=true, job_part = slotProps.item] : ''"
				>Complete</button>
			</template>
			<template v-slot:terminate="slotProps">
				<button
					v-if="slotProps.item.status === 'Ongoing'"
					class="text-white px-3 py-2 rounded-lg transition-hover focus:outline-none"
					:class="slotProps.item.status === 'Ongoing' && authPermissions.includes('Cancel Sessions Job') ? 'bg-red-500 hover:bg-red-600 ' : 'cursor-not-allowed bg-gray-400'"
					@click="slotProps.item.status === 'Ongoing' && authPermissions.includes('Cancel Sessions Job') ? [terminateJobPart=true, job_part = slotProps.item] : ''"
				>Terminate</button>
			</template>
		</AppTable>
		<transition name="fade" mode="out-in">
			<div v-if="completeJobPart || terminateJobPart" class="shield"></div>
		</transition>
		<transition name="slide" mode="out-in">
			<SessionDetailModalCompleteModal
				v-if="completeJobPart"
				:job_part="job_part"
				@close="completeJobPart=false"
				@completed="[getJobParts(params), completeJobPart=false]"
			/>
		</transition>
		<transition name="slide" mode="out-in">
			<SessionDetailModalTerminateModal
				v-if="terminateJobPart"
				:job_part="job_part"
				@close="terminateJobPart=false"
				@terminated="[getJobParts(params), terminateJobPart=false]"
			/>
		</transition>
	</div>
</template>
<script>
import AppTable from "@/components/Base/AppTable";
import AppLoading from "@/components/Base/AppLoading";
import AppButton from "@/components/Base/AppButton";
import SessionDetailModalCompleteModal from "@/components/Sessions/SessionDetailModalCompleteModal";
import SessionDetailModalTerminateModal from "@/components/Sessions/SessionDetailModalTerminateModal";
export default {
	components: {
		AppTable,
		AppLoading,
		AppButton,
		SessionDetailModalCompleteModal,
		SessionDetailModalTerminateModal
	},

	props: {
		job_id: {
			type: [String, Number],
			default: () => null
		},
		disabledLink: {
			type: Boolean,
			default: false
		}
	},

	data() {
		return {
			loading: false,
			total: 0,
			parts: [],
			current_page: 1,
			completeJobPart: false,
			terminateJobPart: false,
			job_part: null,
			practice: null,
			// app table params
			params: {
				job_id: null,
				limit: 5,
				offset: 0
			}
			// app table
			// columns: [
			// 	{
			// 		name: "Job Part Number",
			// 		dataIndex: "job_part_number",
			// 		class: "text-center"
			// 	},
			// 	{
			// 		name: "Date Start",
			// 		dataIndex: "date_start",
			// 		class: "text-center"
			// 	},
			// 	{
			// 		name: "Date End",
			// 		dataIndex: "date_end",
			// 		class: "text-center"
			// 	},
			// 	{
			// 		name: "Status",
			// 		dataIndex: "status",
			// 		class: "text-center"
			// 	}
			// ]
		};
	},

	computed: {
		authPermissions() {
			return this.$store.getters["permissions"];
		},
		totalPages() {
			return Math.ceil(this.total / this.params.limit);
		},
		columns() {
			let columns = [
				{
					name: "Job Part Number",
					dataIndex: "job_part_number",
					class: "text-center"
				},
				{
					name: "Date Start",
					dataIndex: "date_start",
					class: "text-center"
				},
				{
					name: "Date End",
					dataIndex: "date_end",
					class: "text-center"
				},
				{
					name: "Status",
					dataIndex: "status",
					class: "text-center"
				}
			];

			if (
				this.$route.query.status === "Ongoing" &&
				(this.practice.type !== "Spoke" ||
					(this.practice.type === "Spoke" &&
						!this.practice.parent_practice_id) ||
					(this.practice.type === "Spoke" &&
						this.practice.parent_practice_id &&
						this.practice.allow_surgery_bill_locum === true))
			) {
				columns.push(
					{
						name: "",
						slot: true,
						slotName: "complete",
						dataIndex: "",
						class: "text-center"
					},
					{
						name: "",
						slot: true,
						slotName: "terminate",
						dataIndex: "",
						class: "text-center"
					}
				);
			}
			return columns;
		}
	},

	async mounted() {
		this.loading = true;
		this.params.job_id = this.job_id;
		this.practice = this.$auth.user.practice_detail.practice;

		try {
			Promise.all([
				this.$axios.$get(`/api/v1/practice/job-parts/count`, {
					params: this.params
				}),
				this.$axios.$get(`/api/v1/practice/job-parts`, {
					params: this.params
				})
			])
				.then(([responseCount, responseJobParts]) => {
					this.total = responseCount.data.count;
					let parts = responseJobParts.data.job_parts;
					parts = parts.map(part => {
						return {
							...part,
							date_start: this.$moment(part.date_start, "YYYY-MM-DD").format(
								"DD-MM-YYYY"
							),
							date_end: this.$moment(part.date_end, "YYYY-MM-DD").format(
								"DD-MM-YYYY"
							),
							status: part.status === "Declined" ? "Withdrawn" : part.status
						};
					});
					this.parts = parts;
				})
				.finally(() => {
					this.loading = false;
				});
		} catch (err) {
			console.log("err", err.response || err);
			if (err.response && err.response.data && err.response.data.message) {
				this.$store.commit("SET_NOTIFICATION", {
					enabled: true,
					status: "danger",
					text: [`${err.response.data.message}`]
				});
			}
			this.loading = false;
			throw err;
		}
	},

	methods: {
		routerLink(jobPart) {
			if (this.disabledLink) {
				return this.$route;
			}

			if (
				this.$route.name ===
					"hub-surgery-management-id-surgery-sessions-index-sessionId" ||
				this.$route.name ===
					"hub-surgery-management-id-surgery-sessions-index-sessionId-job-parts-jobPartId"
			) {
				return {
					name:
						"hub-surgery-management-id-surgery-sessions-index-sessionId-job-parts-jobPartId",
					params: {
						...this.$route.params,
						jobPartId: jobPart.id
					},
					query: {
						...this.$route.query
					}
				};
			}

			if (
				this.$route.name === "sessions-index-id" ||
				this.$route.name === "sessions-index-id-job-parts-jobPartId"
			) {
				return {
					name: "sessions-index-id-job-parts-jobPartId",
					params: {
						...this.$route.params,
						jobPartId: jobPart.id
					},
					query: {
						...this.$route.query
					}
				};
			}

			if (
				this.$route.name ===
					"my-banks-index-locumId-index-related-jobs-index" ||
				this.$route.name ===
					"my-banks-index-locumId-index-related-jobs-index-jobId"
			) {
				return {
					name: "my-banks-index-locumId-index-related-jobs-index-jobId",
					params: {
						...this.$route.params,
						jobId: jobPart.id
					},
					query: {
						...this.$route.query
					}
				};
			}

			return {
				name: "dashboard-id",
				params: {
					id: jobPart.id
				},
				query: {
					...this.$route.query
				}
			};
		},

		getJobParts(params) {
			this.loading = true;
			this.$axios.$get(`/api/v1/practice/job-parts`, { params }).then(res => {
				this.loading = false;
				let parts = res.data.job_parts;
				parts = parts.map(part => {
					return {
						...part,
						date_start: this.$moment(part.date_start, "YYYY-MM-DD").format(
							"DD-MM-YYYY"
						),
						date_end: this.$moment(part.date_end, "YYYY-MM-DD").format(
							"DD-MM-YYYY"
						)
					};
				});
				this.parts = parts;
			});
		},
		pagechanged(page) {
			this.current_page = page;
			this.params.offset = this.params.limit * (page - 1);
			this.getJobParts(this.params);
		},
		limitchanged(limit) {
			this.current_page = 1;
			this.params.offset = 0;
			this.params.limit = limit;
			this.getJobParts(this.params);
		}
	}
};
</script>
<style scoped>
.shield {
	z-index: 511;
}
.modal-container {
	z-index: 512;
}
@media screen and (min-width: 1200px) {
	.modal-container {
		width: 80%;
	}
}
.wrapper {
	transition: all 0.3s linear;
}
</style>
