<template>
	<div class="p-4 md:p-8">
		<div @click="close" class="cursor-pointer">
			<svgicon name="left-arrow" height="32" width="32" />
		</div>
		<div class="flex flex-row flex-wrap justify-start items-center my-2">
			<div class="leading-loose font-bold text-md sm:text-lg mr-2">
				{{ job_part.job.title }}
			</div>
			<div class="flex items-center text-xs md:text-sm">
				<div
					class="mr-2 py-2 px-4 rounded font-semibold uppercase"
					:class="bgStatus(job_part.locum_status)"
				>
					{{ job_part.locum_status }}
				</div>
				<div
					class="ml-2 py-2 px-4 rounded font-semibold"
					:class="
						jobPartStatus === 'Completed' ? 'bg-green-500' : 'bg-gray-300'
					"
					v-if="job_part.locum_status === 'Completed'"
				>
					{{ jobPartStatus }}
				</div>
			</div>
		</div>

		<div class="text-xs sm:text-sm py-2 border">
			Posted {{ $moment(job_part.date_created).format("DD/MM/YYYY") }}
		</div>

		<div class="flex flex-col mt-4">
			<div class="flex flex-wrap justify-start">
				<div class="p-0 md:pr-4 w-full md:w-1/2 border">
					<JobPartDetailModalInfo :job_part="job_part" />
					<JobDetailModalUnassignForm
						:job="job_part.job"
						v-if="job_part.locum_status === 'Allocated'"
						@close="close"
						@removeJob="removeJobPart"
					/>
				</div>
				<div class="p-0 md:pl-4 w-full md:w-1/2 my-4 md:m-0">
					<div class="flex flex-col">
						<JobPartDetailModalParts
							:job_id="job_part.job.id"
							v-if="job_part.job.job_parts.length > 1"
							:disabledLink="$route.path === '/dashboard'"
						/>
						<JobDetailModalMap :job="job_part.job" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import JobPartDetailModalInfo from "@/components/Jobs/JobPart/JobPartDetailModalInfo";
import JobPartDetailModalParts from "@/components/Jobs/JobPart/JobPartDetailModalParts";
//
import JobDetailModalInfo from "@/components/Jobs/JobDetailModalInfo";
import JobDetailModalMap from "@/components/Jobs/JobDetailModalMap";
import JobDetailModalUnassignForm from "@/components/Jobs/JobDetailModalUnassignForm";
import JobDetailModalApplyForm from "@/components/Jobs/JobDetailModalApplyForm";
import JobDetailModalCancelForm from "@/components/Jobs/JobDetailModalCancelForm";
export default {
	props: ["job_part"],

	components: {
		JobPartDetailModalInfo,
		JobPartDetailModalParts,
		//
		JobDetailModalInfo,
		JobDetailModalMap,
		JobDetailModalUnassignForm,
		JobDetailModalApplyForm,
		JobDetailModalCancelForm
	},
	computed: {
		jobPartStatus() {
			let status = "TO BE INVOICED";
			if (this.job_part.disputed) {
				status = "DISPUTED";
			}
			if (this.job_part.invoiced && this.job_part.issued) {
				status = "INVOICED";
			}
			return status;
		}
	},
	methods: {
		close() {
			this.$emit("close");
		},
		bgStatus(status) {
			switch (status) {
				case "Available":
					return "bg-yellow-500";
					break;
				case "Applied":
					return "bg-orange-400 text-white";
					break;
				case "Completed":
					return "bg-green-400 text-white";
					break;
				case "Allocated":
					return "bg-green-300";
					break;
				case "Ongoing":
					return "bg-green-500 text-white";
					break;
				default:
					return "bg-red-500 text-white";
			}
		},
		removeJobPart() {
			this.$store.commit(
				"jobs/REMOVE_LOCUM_ALLOCATED_JOB_PART",
				this.job_part.id
			);
		}
	}
};
</script>
