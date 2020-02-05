<template>
	<div class="flex flex-col w-full">
		<div class="text-xs sm:text-sm font-bold">Applicants</div>
		<div
			class="bg-white rounded-lg shadow-lg m-0 my-4 py-3 px-5"
			v-for="application in permanent_job_applications"
			:key="application.id"
		>
			<div class="flex flex-row flex-no-wrap justify-between items-center hover:text-gray-600">
				<div @click.prevent="show(application.id)" class="cursor-pointer">
					<AppAvatar
						:height="'40px'"
						:width="'40px'"
						:src="application.locum_user.avatar && application.locum_user.avatar.file && application.locum_user.avatar.file.url ? application.locum_user.avatar.file.url : ''"
					/>
				</div>

				<div
					class="text-sm font-bold leading-loose w-full px-2 md:text-center cursor-pointer"
					@click.prevent="show(application.id)"
				>{{application.locum_user.first_name +' '+application.locum_user.last_name}}</div>

				<div
					class="p-1 rounded-full w-full text-sm font-bold text-center mx-auto"
					:class="statusStyle(application.application_status)"
				>{{application.application_status}}</div>

				<div class="flex items-center">
					<button class="rounded-lg hover:bg-gray-300 focus:outline-none" @click.prevent="message(user)">
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
		>There's no applicants for this job at the moment.</p>
		<div class="bottom-0 w-full" v-if="total > 0">
			<AppPagination
				:total="total"
				:totalPages="totalPages"
				:currentPage="current_page"
				@pagechanged="pagechanged"
				@limitchanged="limitchanged"
				:loading="loading"
				:perPage="params.limit"
			/>
		</div>

		<transition name="fade" mode="out-in">
			<div class="message-modal md:w-2/3 lg:w-1/2 xl:w-1/3" v-if="sendMessageModal">
				<SendMessageModal
					:user="user"
					@close="sendMessageModal=false"
					@showProfile="show(user.id)"
					:profileOption="true"
				/>
			</div>
		</transition>
		<transition name="slide" mode="out-in">
			<div class="modal-container shadow-lg" v-if="modal">
				<PermanentJobShowCandidate
					@close="modal=false"
					:permanent_job_application="permanent_job_application"
					:user="user"
				/>
			</div>
		</transition>
		<div class="shield modal-shield" v-if="modal" @click="closeModal()"></div>
		<div class="shield" v-if="sendMessageModal" @click="closeModal()"></div>
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
	props: ["permanent_job"],
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
				status: ["Applied", "For Interview"],
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
					console.log("res", res);
					this.permanent_job_applications = res.data.permanent_job_applications;
				});
			console.log(
				"permanent_job_applications",
				this.permanent_job_applications
			);
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
			console.log("permanent job app", this.permanent_job_application);

			// this.$axios.$put(`/api/v1/practice/permanent-job-applications/${id}/process-application`)
			//   .then(res => {
			//     this.$store.commit("SET_NOTIFICATION", {
			//       enabled: true,
			//       status: "success",
			//       text: ["This application is now being processed"]
			//     })
			//   });

			// this.$axios.$get(`/api/v1/practice/locums/${id}`).then(res => {
			// 	this.user = res.data.user;
			// 	this.modal = true;
			// });
		},
		message(user) {
			this.user = user;
			this.sendMessageModal = true;
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
		width: 70%;
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

