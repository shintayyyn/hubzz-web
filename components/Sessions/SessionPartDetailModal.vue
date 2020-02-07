<template>
	<div class="p-4 md:p-8">
		<div>
			<svgicon
				name="left-arrow"
				height="32"
				width="32"
				@click="$emit('close')"
				class="cursor-pointer"
			/>
		</div>

		<div class="flex flex-row justify-start items-center mt-4">
			<div class="leading-tight font-bold text-md sm:text-lg">{{job_part.job.title}}</div>
			<div
				class="ml-1 py-2 px-4 mx-1 rounded font-semibold"
				:class="bgStatus(job_part.status)"
			>{{status(job_part.status)}}</div>
			<template v-if="job_part.status === 'Completed'">
				<div
					class="py-2 px-4 mx-1 mx-rounded font-semibold"
					:class="jobPartStatus === 'Completed' ? 'bg-green-500' : 'bg-gray-300'"
				>{{jobPartStatus}}</div>
			</template>
			<template
				v-if="['Terminated','Completed','Approved', 'Cancelled', 'Withdrawn', 'Declined'].includes(job_part.status)"
			>
				<AppButton :label="'Repost Job'" @click="repost" :inStyle="'font-size:1em'" />
			</template>
		</div>

		<div class="flex flex-col mt-4">
			<div class="flex flex-wrap justify-start">
				<div class="p-0 md:pr-4 w-full md:w-1/2">
					<div class="flex flex-col">
						<div
							class="bg-white rounded-lg shadow-lg p-4 md:p-8 mt-4"
							v-if="job_part.status === 'Declined'"
						>
							<div class="leading-tight pb-2">
								<p class="font-bold text-sm sm:text-md">Reason for Withdrawal</p>
								<p class="text-xs sm:text-sm">{{ job_part.job.platform_job.declined_reason}}</p>
							</div>
							<div class="leading-tight pb-2">
								<p class="font-bold text-sm sm:text-md">Date of Withdrawal</p>
								<p
									class="text-xs sm:text-sm"
								>{{ $moment(job_part.job.platform_job.declined_at).format('YYYY-MM-DD | HH:MM')}}</p>
							</div>
						</div>
						<SessionPartDetailModalInfo :job_part="job_part" />
						<SessionDetailModalCompleteForm
							:job_part="job_part"
							@completed="$emit('close')"
							v-if="job_part.status === 'Ongoing' && authPermissions.includes('Complete Sessions Job')"
						/>
						<SessionDetailModalCancelForm
							:job="job_part.job"
							@cancelled="$emit('close')"
							v-if="(job_part.job.status === 'Allocated' || job_part.job.status === 'Ongoing' || job_part.job.status === 'Applied' || job_part.job.status === 'Live') && authPermissions.includes('Cancel Sessions Job')"
						/>
					</div>
				</div>
				<div class="p-0 md:pr-4 w-full md:w-1/2">
					<div class="flex flex-col">
						<SessionPartDetailModalParts :job_id="job_part.job.id" />
						<SessionDetailModalLocum
							:job="job_part.job"
							v-if="(job_part.status === 'Allocated' || job_part.status === 'Ongoing' || job_part.status === 'Completed' || job_part.status === 'Approved')"
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import SessionPartDetailModalInfo from "@/components/Sessions/SessionPart/SessionPartDetailModalInfo";
import SessionPartDetailModalParts from "@/components/Sessions/SessionPart/SessionPartDetailModalParts";
import SessionDetailModalCancelForm from "@/components/Sessions/SessionDetailModalCancelForm";
import SessionDetailModalCompleteForm from "@/components/Sessions/SessionDetailModalCompleteForm";
import SessionDetailModalLocum from "@/components/Sessions/SessionDetailModalLocum";
import AppButton from "@/components/Base/AppButton";
export default {
	props: ["job_part"],
	components: {
		SessionPartDetailModalInfo,
		SessionPartDetailModalParts,
		SessionDetailModalCompleteForm,
		SessionDetailModalCancelForm,
		SessionDetailModalLocum,
		AppButton
	},
	data() {
		return {
			user: null
		};
	},
	computed: {
		authPermissions() {
			return this.$store.getters["permissions"];
		},
		jobPartStatus() {
			let status = "TO BE INVOICED";
			if (this.job_part.disputed && this.job_part.issued) {
				status = "DISPUTED";
			} else if (this.job_part.invoiced && this.job_part.issued) {
				status = "INVOICED";
			}
			return status;
		}
	},
	created() {
		console.log("job_part", this.job_part);
	},
	methods: {
		status(status) {
			let jobStatus =
				status === "Declined"
					? "Withdrawn"
					: status === "Available"
					? "Live"
					: status;
			return jobStatus.toUpperCase();
		},
		bgStatus(status) {
			switch (status) {
				case "Ongoing":
				case "Completed":
				case "Approved":
					return "bg-green-600 text-white";
					break;
				default:
					return "bg-red-500 text-white";
			}
		},
		repost() {
			this.$emit("close");
			setTimeout(() => {
				this.$store.commit("calendar/SET_REPOST_JOB", this.job_part.job);
				this.$store.commit("calendar/CREATE_JOB_MODAL", true);
			}, 500);
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
		width: 60%;
	}
}
</style>
