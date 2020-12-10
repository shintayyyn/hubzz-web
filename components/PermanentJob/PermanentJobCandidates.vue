<template>
	<div class="flex flex-col w-full">
		<div class="text-xs sm:text-sm font-bold">Applicants</div>
		<div
			v-for="application in permanent_job_applications"
			:key="application.id"
			class="bg-white rounded-lg shadow-lg m-0 my-4 py-3 pl-3 md:pl-5 md:pr-2"
		>
			<div class="flex flex-row flex-no-wrap justify-between items-center hover:text-gray-600">
				<div class="cursor-pointer" @click.prevent="show(application.id)">
					<AppAvatar
						:height="'40px'"
						:width="'40px'"
						:src="application.locum_user.avatar && application.locum_user.avatar.file && application.locum_user.avatar.file.url ? application.locum_user.avatar.file.url : ''"
					/>
				</div>

				<div class="w-full flex flex-col md:flex-row md:items-center leading-none text-left px-2">
					<div
						class="text-sm font-bold md:w-full md:px-2 md:text-center cursor-pointer leading-tight"
						@click.prevent="show(application.id)"
					>{{ application.locum_user.first_name +' '+application.locum_user.last_name }}</div>

					<div
						class="flex md:block md:py-1 md:px-4 rounded-full whitespace-no-wrap text-xs md:text-sm font-bold text-center md:mx-auto"
						:class="statusStyle(application.application_status)"
					>{{ application.application_status === 'Applied' ? 'Pending' : application.application_status !== 'For Interview' ? `Interview ${application.application_status}` : application.application_status }}</div>
				</div>

				<div class="flex items-center">
					<button
						class="rounded-lg hover:bg-gray-300 focus:outline-none"
						@click.prevent="message(application)"
					>
						<svgicon name="chat" height="24" width="24" color="#888 #555 #fff" class="m-2" />
					</button>
					<button class="focus:outline-none" @click.prevent="show(application.id)">
						<svgicon name="arrow-right" height="20" width="20" class="fill-current m-2" />
					</button>
				</div>
			</div>
		</div>
		<p
			v-if="permanent_job_applications.length === 0"
			class="text-gray-600 text-sm"
		>There are no applicants for this job at the moment.</p>
		<div v-if="total > 0" class="bottom-0 w-full">
			<AppPagination
				:total="total"
				:total-pages="totalPages"
				:current-page="current_page"
				:loading="loading"
				:per-page="params.limit"
				@pagechanged="pagechanged"
				@limitchanged="limitchanged"
			/>
		</div>

		<transition name="fade" mode="out-in">
			<div v-if="sendMessageModal" class="message-modal md:w-2/3 lg:w-1/2 xl:w-1/3">
				<SendMessageModal
					:user="user"
					:profile-option="true"
					@close="sendMessageModal=false"
					@showProfile="modal=true"
				/>
			</div>
		</transition>

		<transition name="slide" mode="out-in">
			<div v-if="modal" class="modal-container shadow-lg">
				<PermanentJobShowCandidate
					:permanent_job_application="permanent_job_application"
					:permanent_job="permanent_job"
					:user="user"
					@close="modal=false"
					@updateApplicants="getApplicantsCount()"
				/>
			</div>
		</transition>
		<div v-if="modal" class="shield modal-shield" @click="closeModal()" />
		<div v-if="sendMessageModal" class="message-shield" @click="closeModal()" />
	</div>
</template>
<script>
import AppAvatar from "~/components/Base/AppAvatar";
import AppPagination from "@/components/Base/AppPagination";
import PermanentJobShowCandidate from "@/components/PermanentJob/PermanentJobShowCandidate";
import SendMessageModal from "@/components/Messages/SendMessageModal";

export default {
	components: {
		AppAvatar,
		AppPagination,
		PermanentJobShowCandidate,
		SendMessageModal
	},
	props: {
		permanent_job: {
			type: Object,
			default: () => null
		}
	},
	data() {
		return {
			total: 0,
			permanent_job_applications: [],
			permanent_job_application: "",
			current_page: 1,
			loading: false,
			params: {
				offset: 0,
				limit: 5,
				permanent_job_id: this.permanent_job.id
			},
			user: null,
			modal: false,
			sendMessageModal: false
		};
	},
	computed: {
		totalPages() {
			return Math.ceil(this.total / this.params.limit);
		}
	},
	created() {
		this.getApplicantsCount();
	},
	methods: {
		async getApplicantsCount() {
			await this.$axios
				.$get(`/api/v1/practice/permanent-job-applications/count`, {
					params: this.params
				})
				.then(res => {
					this.total = res.data.count;
					this.getApplicants(this.params);
				});
		},
		async getApplicants(params) {
			await this.$axios
				.$get(`/api/v1/practice/permanent-job-applications`, { params })
				.then(res => {
					this.permanent_job_applications = res.data.permanent_job_applications;
				});
		},
		pagechanged(page) {
			this.current_page = page;
			this.params.offset = this.params.limit * (page - 1);
			this.getApplicants(this.params);
		},
		limitchanged(limit) {
			this.current_page = 1;
			this.params.offset = 0;
			this.params.limit = limit;
			this.getApplicants(this.params);
		},
		statusStyle(applicationStatus) {
			switch (applicationStatus) {
				case "Available":
					return "md:bg-green-500 text-green-600 md:text-white";
				case "Applied":
					return "md:bg-yellow-600 text-yellow-600 md:text-white";
				case "For Interview":
					return "md:bg-green-600 text-green-700 md:text-white";
				case "Accepted":
					return "md:bg-green-700 text-green-700 md:text-white";
				case "Unsuccessful":
				case "Rejected":
					return "md:bg-red-700 text-red-700 md:text-white";
				case "Closed":
					return "md:bg-gray-700 text-gray-700 md:text-white";
				default:
					return "md:bg-yellow-400 text-gray-500 md:text-black";
			}
		},
		async show(id) {
			await this.$axios
				.$get(`/api/v1/practice/permanent-job-applications/${id}`)
				.then(res => {
					this.permanent_job_application = res.data.permanent_job_application;
				});

			await this.$axios
				.$get(
					`/api/v1/practice/locums/${this.permanent_job_application.locum_user.id}`
				)
				.then(res => {
					this.user = res.data.user;
					this.modal = true;
				});
		},
		async message(application) {
			await this.$axios
				.$get(`/api/v1/practice/locums/${application.applicant_locum_user_id}`)
				.then(res => {
					this.user = res.data.user;
					this.sendMessageModal = true;
				});
		},
		closeModal() {
			if (this.modal) {
				this.modal = false;
			} else if (this.sendMessageModal) {
				this.sendMessageModal = false;
			}
		}
	}
};
</script>
<style scoped>
.avatar {
	max-width: 40px;
	max-height: 40px;
	min-width: 40px;
	min-height: 40px;
}
img {
	border-radius: 50%;
}

.modal-shield {
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
.message-shield {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #333;
	opacity: 0.5;
	z-index: 59;
}
</style>

