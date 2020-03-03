<template>
	<div class="p-4 md:p-8">
		<div>
			<svgicon
				name="left-arrow"
				height="32"
				width="32"
				class="cursor-pointer"
				@click="$emit('close')"
			/>
		</div>

		<div class="flex flex-wrap justify-start items-center mt-4">
			<div class="leading-tight font-bold text-md sm:text-lg">{{ job.title }}</div>
			<div
				class="mx-2 py-2 px-4 rounded font-semibold"
				:class="bgStatus(job.status)"
			>{{ status(job.status) }}</div>
			<template v-if="authPermissions.includes('Update Sessions Job')">
				<button
					v-if="job.status === 'Pending' &&
            practice.type == 'Hub' &&
            toEdit === false"
					class="font-bold text-xs sm:text-sm no-underline px-2 py-2 rounded-lg bg-green-400 hover:bg-green-500 text-white ml-4 focus:outline-none"
					@click="approveJob()"
				>Approve this Job</button>
				<button
					v-if="
            ((job.status === 'Allocated' || job.status === 'Pending' ) &&
              toEdit === false &&
              canEdit === true) ||
              (job.status === 'Pending' && toEdit === false) ||
              (job.status === 'Applied' && toEdit === false) ||
              (job.status === 'Live' && toEdit === false)
          "
					class="font-bold text-xs sm:text-sm no-underline px-2 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 ml-4 focus:outline-none"
					@click.prevent="toEdit = true"
				>Edit this job</button>
				<button
					v-if="
            ((job.status === 'Allocated' || job.status === 'Pending' ) &&
              toEdit === true &&
              canEdit === true) ||
              (job.status === 'Pending' && toEdit === true) ||
              (job.status === 'Applied' && toEdit === true) ||
              (job.status === 'Live' && toEdit === true)
          "
					class="font-bold text-xs sm:text-sm no-underline px-2 py-2 rounded-lg bg-yellow-500 ml-4 focus:outline-none"
					@click.prevent="toEdit = false"
				>Cancel Editing</button>
			</template>
			<template
				v-if="['Unfilled','Withdrawn','Cancelled'].includes(job.status) && !this.$route.name.includes('my-banks')"
			>
				<AppButton :label="'Repost Job'" :in-style="'font-size:1em'" @click="repost" />
			</template>
		</div>

		<template v-if="['Allocated','Live','Applied'].includes(job.status)">
			<div v-if="waitingForApproval" class="mt-4">Waiting for Locum's approval...</div>
		</template>

		<div class="flex flex-col mt-4">
			<div class="flex flex-wrap justify-start">
				<div class="p-0 md:pr-4 w-full md:w-1/2">
					<div class="flex flex-col">
						<SessionDetailModalInfo v-if="toEdit === false" :job="job" />
						<SessionDetailModalUpdateForm
							v-if="job.status === 'Allocated' && toEdit === true && canEdit === true || 
                job.status === 'Applied' && toEdit === true || 
                job.status === 'Live' && toEdit === true ||
                job.status === 'Pending' && toEdit === true"
							:job="job"
							@updateJob="updateJob"
							@scrollToTop="$emit('scrollToTop')"
						/>
						<SessionDetailModalMap v-if="showMap" :job="job" />
						<SessionDetailModalCancelForm
							v-if="['Allocated','Ongoing','Applied','Live','Pending'].includes(job.status) && authPermissions.includes('Cancel Sessions Job')"
							:job="job"
							@cancelled="$emit('close'), $emit('cancelled', $event)"
						/>
					</div>
				</div>
				<div class="p-0 md:pl-4 w-full md:w-1/2 order-first md:order-none">
					<div class="flex flex-col">
						<SessionPartDetailModalParts :job_id="job.id" :disabled-link="true" />
						<SessionDetailModalCandidates
							v-if="job.status === 'Applied'"
							:job="job"
							@appointed="$emit('close'), $emit('appointed', job.id)"
						/>
						<SessionDetailModalLocum
							v-if="(job.status === 'Allocated' || job.status === 'Ongoing' || job.status === 'Completed' || job.status === 'Declined' || job.status === 'Withdrawn')"
							:job="job"
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import SessionPartDetailModalParts from "@/components/Sessions/SessionPart/SessionPartDetailModalParts";
import SessionDetailModalInfo from "@/components/Sessions/SessionDetailModalInfo";
import SessionDetailModalUpdateForm from "@/components/Sessions/SessionDetailModalUpdateForm";
import SessionDetailModalCandidates from "@/components/Sessions/SessionDetailModalCandidates";
import SessionDetailModalLocum from "@/components/Sessions/SessionDetailModalLocum";
import SessionDetailModalCancelForm from "@/components/Sessions/SessionDetailModalCancelForm";
import SessionDetailModalMap from "@/components/Sessions/SessionDetailModalMap";
import AppButton from "@/components/Base/AppButton";
export default {
	components: {
		SessionDetailModalInfo,
		SessionPartDetailModalParts,
		SessionDetailModalUpdateForm,
		SessionDetailModalCandidates,
		SessionDetailModalLocum,
		SessionDetailModalCancelForm,
		SessionDetailModalMap,
		AppButton
	},
	props: {
		job: {
			type: Object,
			required: true
		}
	},
	data() {
		return {
			user: null,
			toEdit: false,
			practice: "",
			showMap: false
		};
	},
	computed: {
		authPermissions() {
			return this.$store.getters["permissions"];
		},
		canEdit() {
			return (
				this.$moment(
					`${this.job.date_start} ${this.job.time_start}`,
					"YYYY-MM-DD HH:mm"
				).diff(
					this.$moment()
						.utc()
						.format("YYYY-MM-DD HH:mm"),
					"hours"
				) >= 12
			);
		},
		waitingForApproval() {
			return (
				this.job.status === "Allocated" &&
				this.job.update_accepted === false &&
				this.job.original === false &&
				this.job.update_accepted_until
			);
		}
	},
	created() {
		this.practice = this.$auth.user.practice_detail.practice;
	},
	mounted() {
		setTimeout(() => {
			this.showMap = true;
		}, 1);
	},
	methods: {
		updateJob({ newJob, oldJob }) {
			this.$emit("close");
			setTimeout(() => {
				this.$store.commit("jobs/UPDATE_PRACTICE_PENDING_JOB", {
					newJob,
					oldJob
				});
				this.$store.commit("jobs/UPDATE_PRACTICE_ALLOCATED_JOB", {
					newJob,
					oldJob
				});
				this.$store.commit("jobs/UPDATE_PRACTICE_APPLIED_JOB", {
					newJob,
					oldJob
				});
				this.$store.commit("jobs/UPDATE_PRACTICE_AVAILABLE_JOB", {
					newJob,
					oldJob
				});
				if (this.$route.name === "sessions-index-id") {
					this.$router.push({
						path: `/sessions/${newJob.id}`,
						query: { ...this.$route.query }
					});
				}
			}, 500);
		},
		approveJob() {
			this.$axios
				.$put(`/api/v1/practice/jobs/${this.job.id}/approve`)
				.then(res => {
					console.log(res);
				});
		},
		status(status) {
			return status.toUpperCase();
		},
		bgStatus(status) {
			let str;
			switch (status) {
				case "Live":
					str = "bg-yellow-500";
					break;
				case "Applied":
					str = "bg-orange-500 text-white";
					break;
				case "Allocated":
					str = "bg-green-600 text-white";
					break;
				default:
					str = "bg-red-500 text-white";
			}
			return str;
		},
		repost() {
			this.$emit("close");
			setTimeout(() => {
				if (this.$route.name.includes("hub-surgery-management")) {
					this.$store.commit("calendar/SET_REPOST_JOB", this.job);
					this.$store.commit("calendar/CREATE_JOB_SURGERY_MODAL", true);
				} else if (
					this.$route.name.includes("sessions") ||
					this.$route.name.includes("dashboard")
				) {
					this.$store.commit("calendar/SET_REPOST_JOB", this.job);
					this.$store.commit("calendar/CREATE_JOB_MODAL", true);
				}
			}, 500);
		}
	}
};
</script>
