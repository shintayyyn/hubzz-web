<template>
	<div class="bg-white rounded-lg shadow-lg p-4 md:p-8 mt-4">
		<div class="flex flex-row flex-wrap">
			<div class="flex flex-col w-full">
				<div class="font-bold text-sm sm:text-md">Job number</div>
				<div class="text-xs sm:text-sm mb-8">{{ job.job_number }}</div>
				<div class="font-bold text-sm sm:text-md">Duration</div>
				<div class="text-xs sm:text-sm mb-8">
					<p
						v-if="job.dates.length>1"
						class="px-1"
					>{{ $moment(job.dates[0], 'YYYY-MM-DD').format('DD/MM/YYYY') }} - {{ $moment(job.dates[job.dates.length-1], 'YYYY-MM-DD').format('DD/MM/YYYY') }}</p>
					<div class="px-1">
						<p>Days: {{ job.dates.length }}</p>
					</div>
					<div class="px-1">
						<div class="flex justify-between items-end mb-2">
							<p class="font-bold text-sm sm:text-md">Schedule</p>
						</div>
						<div class="hidden lg:flex font-bold text-xs">
							<p class="w-1/6">DATE</p>
							<p class="w-2/6 text-center">TIME</p>
							<p class="w-1/6 text-center">SHIFT</p>
							<p class="w-2/6 text-center">RATE</p>
						</div>
						<div class="overflow-y-auto" style="max-height: 205px;">
							<div v-for="(sched, index) in job.schedules" :key="index" class="lg:flex pb-2">
								<p class="lg:w-1/6">{{ $moment(sched.date, 'YYYY-MM-DD').format('DD/MM/YYYY') }}</p>
								<p class="lg:w-2/6 lg:text-center">{{ sched.time_start }}-{{ sched.time_end }}</p>
								<p class="lg:w-1/6 lg:text-center">{{ sched.shift.name }}</p>
								<p class="lg:w-2/6 lg:text-center">£{{ sched.rate }} {{ sched.locum_detail_rate_type.name }}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="flex flex-col w-full md:w-1/2 p-0 md:pr-4">
				<div class="font-bold text-sm sm:text-md">Job description</div>
				<div
					class="text-xs sm:text-sm mb-8 break-words"
				>{{ job && job.description ? job.description : '(none)' }}</div>

				<div class="font-bold text-sm sm:text-md">Job Gross Rate</div>
				<div class="text-xs sm:text-sm mb-8">£ {{getJobGrossRate(job.schedules) | currency}}</div>

				<div class="font-bold text-sm sm:text-md">Job total hours</div>
				<div
					class="text-xs sm:text-sm mb-8"
				>{{ job.schedules.map(schedule => schedule.original_hours_in_minutes).reduce((acc, cur) => acc + cur) | hoursMinutes }}</div>

				<!-- <div class="font-bold text-sm sm:text-md">Rate</div>
				<div class="text-xs sm:text-sm mb-8">{{ `£ ${job.rate} ${job.locum_detail_rate_type.name}` }}</div>-->
				<!-- <div class="font-bold text-sm sm:text-md">Total hours</div>
				<div class="text-xs sm:text-sm mb-4">{{ job.total_hours | hoursMinutes }}</div>-->
				<div class="font-bold text-sm sm:text-md">Extra information</div>
				<div
					class="text-xs sm:text-sm mb-8 break-words"
				>{{ job.platform_job && job.platform_job.extra_information?job.platform_job.extra_information:`(none)` }}</div>
				<div class="font-bold text-sm sm:text-md">Report to</div>
				<div class="text-xs sm:text-sm mb-8">{{ job.platform_job.report_to }}</div>
				<div class="font-bold text-sm sm:text-md">Telephone number</div>
				<div
					class="text-xs sm:text-sm mb-8"
				>{{ job.platform_job.practice.phone_number?job.platform_job.practice.phone_number:`(none)` }}</div>
				<div class="font-bold text-sm sm:text-md">Email address</div>
				<div class="text-xs sm:text-sm mb-8">{{ job.platform_job.email }}</div>
				<div class="font-bold text-sm sm:text-md">Is there another Dr on site?</div>
				<div class="text-xs sm:text-sm mb-8">{{ job.platform_job.is_another_doctor ? 'Yes' : 'No' }}</div>
				<div class="font-bold text-sm sm:text-md">Is nurse support available?</div>
				<div class="text-xs sm:text-sm mb-8">{{ job.platform_job.is_nurse_available ? 'Yes' : 'No' }}</div>
				<div class="font-bold text-sm sm:text-md">Number of patients to be seen during the session?</div>
				<div class="text-xs sm:text-sm mb-8">{{ job.platform_job.number_of_patients }}</div>
				<div class="font-bold text-sm sm:text-md">Duration of eact appointment?</div>
				<div class="text-xs sm:text-sm mb-8">{{ job.platform_job.duration_for_each_appointment }}</div>
				<div class="font-bold text-sm sm:text-md">Opportunity for catch up slots?</div>
				<div
					class="text-xs sm:text-sm mb-8"
				>{{ job.platform_job.opportunity_for_catch_up_slots ? 'Yes' : 'No' }}</div>
				<div class="font-bold text-sm sm:text-md">Session requirements:</div>
				<div class="text-xs sm:text-sm" v-if="!session_requirements.length">(none)</div>
				<div
					v-for="(item, index) in session_requirements"
					:key="`${item}-${index}`"
					class="flex flex-col"
				>
					<div class="text-xs sm:text-sm w-full">{{ item }}</div>
				</div>
				<div class="text-xs sm:text-sm mb-8" />
				<div class="font-bold text-sm sm:text-md">Session structure information</div>
				<div
					class="text-xs sm:text-sm mb-8 break-words"
				>{{ job.platform_job && job.platform_job.session_structure_information ? job.platform_job.session_structure_information : '(none)' }}</div>
				<div class="font-bold text-sm sm:text-md">Update Remarks</div>
				<div
					class="text-xs sm:text-sm mb-8 break-words"
				>{{ job.update_remarks?job.update_remarks:`(none)` }}</div>
			</div>
			<div class="flex flex-col w-full md:w-1/2 p-0 md:pl-4">
				<template v-if="job.selection_date">
					<div class="font-bold text-sm sm:text-md">Selection will be made by this date</div>
					<div class="text-xs sm:text-sm mb-8">
						{{ $moment(job.selection_date, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]').format('DD/MM/YYYY') }} |
						{{ $moment(job.selection_date, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]').format('HH:mm') }}
					</div>
				</template>

				<div class="text-xs sm:text-sm mb-8">
					This job is
					<span
						class="font-bold text-sm sm:text-md"
					>{{ job.platform_job.ir35 ? 'INSIDE' : 'OUTSIDE' }}</span> of scope of
					<span class="font-bold text-sm sm:text-md">IR35</span>
				</div>

				<div class="font-bold text-sm sm:text-md">Role</div>
				<div class="text-xs sm:text-sm mb-8">{{ job.platform_job.profession.name }}</div>

				<div class="font-bold text-sm sm:text-md">Specialty</div>
				<div class="text-xs sm:text-sm mb-8 flex flex-row flex-wrap">
					<div
						v-for="item in job.platform_job.qualifications"
						:key="item.id"
						class="rounded-lg bg-yellow-500 p-1 m-1"
					>{{ item.name }}</div>
				</div>

				<div class="font-bold text-sm sm:text-md">Clinical systems</div>
				<div class="text-xs sm:text-sm mb-8 flex flex-row flex-wrap">
					<div
						v-for="item in job.platform_job.clinical_systems"
						:key="item.id"
						class="rounded-lg bg-yellow-500 p-1 m-1"
					>{{ item.name }}</div>
				</div>

				<div class="font-bold text-sm sm:text-md">Spoken languages</div>
				<div class="text-xs sm:text-sm mb-8 flex flex-row flex-wrap">
					<div class="rounded-lg bg-yellow-500 p-1 m-1">English</div>
					<div
						v-for="item in job.platform_job.spoken_languages"
						:key="item.id"
						class="rounded-lg bg-yellow-500 p-1 m-1"
					>{{ item.name }}</div>
				</div>

				<div class="font-bold text-sm sm:text-md">Compliance requirements</div>
				<div class="text-xs sm:text-sm mb-8 flex flex-row flex-wrap">
					<div v-if="job.platform_job.compliance_documents.length === 0" class="mt-1">(none)</div>
					<div
						v-for="item in job.platform_job.compliance_documents"
						v-else
						:key="item.id"
						class="rounded-lg bg-yellow-500 p-1 m-1"
					>{{ item.name }}</div>
				</div>

				<div class="font-bold text-sm sm:text-md">Mandatory training</div>
				<div class="text-xs sm:text-sm mb-8 flex flex-row flex-wrap">
					<div
						v-if="job.platform_job.mandatory_trainings.length === 0"
						class="mt-1 text-xs sm:text-sm"
					>(none)</div>
					<div
						v-for="item in job.platform_job.mandatory_trainings"
						v-else
						:key="item.id"
						class="rounded-lg bg-yellow-500 p-1 m-1"
					>{{ item.name }}</div>
				</div>

				<div class="font-bold text-sm sm:text-md">Other Mandatory training</div>
				<div class="text-xs sm:text-sm mb-8 flex flex-row flex-wrap">
					<div
						v-if="job.platform_job.other_mandatory_trainings.length === 0"
						class="mt-1 text-xs sm:text-sm"
					>(none)</div>
					<div
						v-for="item in job.platform_job.other_mandatory_trainings"
						v-else
						:key="item.id"
						class="rounded-lg bg-yellow-500 p-1 m-1"
					>{{ item.name }}</div>
				</div>

				<template v-if="job.use_variation_terms">
					<template v-if="job.variation_terms_file_id">
						<div class="font-bold text-sm sm:text-md">Terms &amp; Condition</div>
						<div class="text-sm sm:text-md">Variation Terms</div>
						<div class="text-xs sm:text-sm mb-6 flex flex-row flex-wrap">
							<div
								class="mt-1 cursor-pointer bg-yellow-400 hover:bg-yellow-500 rounded-lg px-4 py-1 transition-hover"
								@click="modal = true"
							>View</div>
							<transition name="slide" mode="out-in">
								<div v-if="modal" class="modal-container shadow-lg">
									<div class="h-full w-full">
										<div class="p-4 md:p-8 cursor-pointer">
											<svgicon name="left-arrow" height="32" @click="modal = false" />
										</div>
										<embed
											class="object-contain object-top w-full"
											:class="job.variation_terms_file.type == 'image' ? 'image' : 'document h-full '"
											:src="['msword', 'tiff', 'vnd.openxmlformats-officedocument.wordprocessingml.document', 'vnd.openxmlformats-officedocument.wordprocessingml.template', 'vnd.ms-word.document.macroEnabled.12', 'vnd.ms-word.template.macroEnabled.12'].includes(job.variation_terms_file.subtype) ? convertDoc(job.variation_terms_file.url) : job.variation_terms_file.url"
										/>
									</div>
								</div>
							</transition>
						</div>
					</template>
					<template v-else-if="job.standard_terms_file_id">
						<div class="font-bold text-sm sm:text-md">Terms &amp; Condition</div>
						<div class="text-sm sm:text-md">Standard Terms</div>
						<div class="text-xs sm:text-sm mb-6 flex flex-row flex-wrap">
							<div
								class="mt-1 cursor-pointer bg-yellow-400 hover:bg-yellow-500 rounded-lg px-4 py-1 transition-hover"
								@click="modal = true"
							>View</div>
							<transition name="slide" mode="out-in">
								<div v-if="modal" class="modal-container shadow-lg">
									<div class="h-full w-full">
										<div class="p-4 md:p-8 cursor-pointer">
											<svgicon name="left-arrow" height="32" @click="modal = false" />
										</div>
										<embed
											class="object-contain object-top w-full"
											:class="job.standard_terms_file.type == 'image' ? 'image' : 'document h-full '"
											:src="['msword', 'tiff', 'vnd.openxmlformats-officedocument.wordprocessingml.document', 'vnd.openxmlformats-officedocument.wordprocessingml.template', 'vnd.ms-word.document.macroEnabled.12', 'vnd.ms-word.template.macroEnabled.12'].includes(job.standard_terms_file.subtype) ? convertDoc(job.standard_terms_file.url) : job.standard_terms_file.url"
										/>
									</div>
								</div>
							</transition>
						</div>
					</template>
				</template>

				<template v-if="!job.use_variation_terms">
					<template v-if="job.standard_terms_file_id">
						<div class="font-bold text-sm sm:text-md">Terms &amp; Condition</div>
						<div class="text-sm sm:text-md">Standard Terms</div>
						<div class="text-xs sm:text-sm mb-6 flex flex-row flex-wrap">
							<div
								class="mt-1 cursor-pointer bg-yellow-400 hover:bg-yellow-500 rounded-lg px-4 py-1 transition-hover"
								@click="modal = true"
							>View</div>
							<transition name="slide" mode="out-in">
								<div v-if="modal" class="modal-container shadow-lg">
									<div class="h-full w-full">
										<div class="p-4 md:p-8 cursor-pointer">
											<svgicon name="left-arrow" height="32" @click="modal = false" />
										</div>
										<embed
											class="object-contain object-top w-full"
											:class="job.standard_terms_file.type == 'image' ? 'image' : 'document h-full '"
											:src="['msword', 'tiff', 'vnd.openxmlformats-officedocument.wordprocessingml.document', 'vnd.openxmlformats-officedocument.wordprocessingml.template', 'vnd.ms-word.document.macroEnabled.12', 'vnd.ms-word.template.macroEnabled.12'].includes(job.standard_terms_file.subtype) ? convertDoc(job.standard_terms_file.url) : job.standard_terms_file.url"
										/>
									</div>
								</div>
							</transition>
						</div>
					</template>
					<template v-else-if="job.variation_terms_file_id">
						<div class="font-bold text-sm sm:text-md">Terms &amp; Condition</div>
						<div class="text-sm sm:text-md">Variation Terms</div>
						<div class="text-xs sm:text-sm mb-6 flex flex-row flex-wrap">
							<div
								class="mt-1 cursor-pointer bg-yellow-400 hover:bg-yellow-500 rounded-lg px-4 py-1 transition-hover"
								@click="modal = true"
							>View</div>
							<transition name="slide" mode="out-in">
								<div v-if="modal" class="modal-container shadow-lg">
									<div class="h-full w-full">
										<div class="p-4 md:p-8 cursor-pointer">
											<svgicon name="left-arrow" height="32" @click="modal = false" />
										</div>
										<embed
											class="object-contain object-top w-full"
											:class="job.variation_terms_file.type == 'image' ? 'image' : 'document h-full '"
											:src="['msword', 'tiff', 'vnd.openxmlformats-officedocument.wordprocessingml.document', 'vnd.openxmlformats-officedocument.wordprocessingml.template', 'vnd.ms-word.document.macroEnabled.12', 'vnd.ms-word.template.macroEnabled.12'].includes(job.standard_terms_file.subtype) ? convertDoc(job.standard_terms_file.url) : job.standard_terms_file.url"
										/>
									</div>
								</div>
							</transition>
						</div>
					</template>
				</template>
			</div>
		</div>
		<transition name="fade" mode="out-in">
			<div v-if="modal" class="shield" @click="modal = false" />
		</transition>
	</div>
</template>
<script>
export default {
	props: {
		job: {
			type: Object,
			requried: true
		}
	},
	data() {
		return {
			modal: false
		};
	},
	computed: {
		session_requirements() {
			return this.job.platform_job.session_requirements
				? this.job.platform_job.session_requirements.split(",")
				: [];
		}
	},
	methods: {
		getJobGrossRate(schedules) {
			// PER HOUR rate * final_hours_in_minutes
			// PER WHOLE HALF DAY rate / original_hours_in_minutes * final_hours_in_minutes
			let total = 0;

			schedules.forEach(schedule => {
				if (!schedule.absent_reason) {
					switch (schedule.locum_detail_rate_type.name) {
						case "Hourly":
							total = total + schedule.rate * schedule.final_hours_in_minutes;
							break;
						case "Whole Day":
						case "Half Day":
							total =
								total +
								(schedule.rate / schedule.original_hours_in_minutes) *
									schedule.final_hours_in_minutes;
							break;
						default:
							total = total + schedule.rate * schedule.final_hours_in_minutes;
							break;
					}
				}
			});

			return total;
		},
		convertDoc(document) {
			return `https://docs.google.com/gview?url=${document}&embedded=true`;
		}
	}
};
</script>

<style scoped>
.modal-container {
	z-index: 510;
}

@media screen and (min-width: 1200px) {
	.modal-container {
		width: 70%;
	}
}
</style>