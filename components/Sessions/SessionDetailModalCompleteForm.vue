<template>
	<section>
		<div class="rounded-lg shadow-lg bg-white flex flex-col p-4 md:p-8 mt-4">
			<div class="font-bold text-md sm:text-lg">Complete Form</div>
			<AppFormError v-if="formError.length" :formError="formError" />
			<AppInput
				v-model="has_absences"
				:type="'select'"
				:name="'has_absences'"
				:label="'Was the Locum absent for session?'"
				:items="[{ label: 'Yes', value: true }, { label: 'No', value: false }]"
			/>
			<template v-if="has_absences === 'true' || has_absences === true">
				<AppInput
					v-model="form.absent_days"
					:type="'number'"
					:name="'absent_days'"
					:label="'Days of Absent'"
					:inStyle="'padding-top:0.5rem;padding-bottom:0.5rem;text-align:right'"
					:error="formError.find(item => item.field === 'absent_days')"
				/>
				<AppInput
					v-model="form.absent_days_reason"
					:type="'textarea'"
					:name="'absent_days_reason'"
					:label="'Reason of Absence'"
					:placeholder="'For e.g. No-show'"
					:resize="false"
				/>
			</template>
			<AppInput
				v-model="has_late"
				:type="'select'"
				:name="'has_late'"
				:label="'Was the Locum late for this session?'"
				:items="[{ label: 'Yes', value: true }, { label: 'No', value: false }]"
			/>
			<template v-if="has_late === 'true' || has_late === true">
				<p class="text-sm">Hours of Late</p>
				<AppInput
					v-model="form.late_hours"
					:type="'number'"
					:name="'late_hours'"
					:label="'Hours of Late'"
					:inStyle="'padding-top:0.5rem;padding-bottom:0.5rem;text-align:right'"
					:error="formError.find(item => item.field === 'late_hours')"
				/>
				<div class="flex items-center justify-start flex-wrap">
					<div class="flex items-center">
						<AppInput
							v-model="form.late_hour"
							:type="'number'"
							:name="'late_hour'"
							:inStyle="'padding-top:0.5rem;padding-bottom:0.5rem;text-align:right'"
							:error="formError.find(item => item.field === 'late_hour')"
							:min="1"
							:limit="8"
							@keydown="inputNumberOnly($event)"
							@focus="hasValue(form.late_hour, 'late_hour')"
							@blur="!form.late_hour ? form.late_hour = 0 : form.late_hour"
						/>
						<p class="mx-2 text-sm">hours</p>
					</div>
					<div class="flex items-center">
						<AppInput
							v-model="form.late_minute"
							:type="'number'"
							:name="'late_minute'"
							:inStyle="'padding-top:0.5rem;padding-bottom:0.5rem;text-align:right'"
							:error="formError.find(item => item.field === 'late_minute')"
							:min="1"
							:maxInput="60"
							:limit="2"
							@keydown="inputNumberOnly($event)"
							@focus="hasValue(form.late_minute, 'late_minute')"
							@blur="!form.late_minute ? form.late_minute = 0 : form.late_minute"
						/>
						<p class="mx-2 text-sm">minutes</p>
					</div>
				</div>
				<AppInput
					v-model="form.late_hours_reason"
					:type="'textarea'"
					:name="'late_hours_reason'"
					:label="'Reason of late'"
					:placeholder="'For e.g. Traffic'"
					:resize="false"
				/>
			</template>
			<p class="text-sm">Final hours</p>
			<div class="flex items-center justify-start flex-wrap">
				<div class="flex items-center">
					<AppInput
						v-model="form.final_hours_hour"
						:type="'number'"
						:name="'final_hours_hour'"
						:inStyle="'padding-top:0.5rem;padding-bottom:0.5rem;text-align:right'"
						:error="formError.find(item => item.field === 'final_hours_hour')"
						:min="1"
						:limit="8"
						@keydown="inputNumberOnly($event)"
						@focus="hasValue(form.final_hours_hour, 'final_hours_hour')"
						@blur="!form.final_hours_hour ? form.final_hours_hour = 0 : form.final_hours_hour"
					/>
					<p class="mx-2 text-sm">hours</p>
				</div>
				<div class="flex items-center">
					<AppInput
						v-model="form.final_hours_minute"
						:type="'number'"
						:name="'final_hours_minute'"
						:inStyle="'padding-top:0.5rem;padding-bottom:0.5rem;text-align:right'"
						:error="formError.find(item => item.field === 'final_hours_minute')"
						:min="1"
						:maxInput="60"
						:limit="2"
						@keydown="inputNumberOnly($event)"
						@focus="hasValue(form.final_hours_minute, 'final_hours_minute')"
						@blur="!form.final_hours_minute ? form.final_hours_minute = 0 : form.final_hours_minute"
					/>
					<p class="mx-2 text-sm">minutes</p>
				</div>
			</div>
			<!-- <div
				v-for="(schedule, index) in form.schedules"
				:key="schedule.id"
				class="pt-4 px-2"
				:class="index%2?'' : 'bg-gray-100'"
			>
				<p>{{ schedule.date }}</p>
				<div class="flex items-end">
					<div class="w-1/3">
						<AppTime
							v-model="schedule.final_time_start"
							:label="'Final Time Start'"
							:inStyle="'background-color: transparent'"
						/>
					</div>
					<div class="w-1/3 px-2">
						<AppTime
							v-model="schedule.final_time_end"
							:label="'Final Time End'"
							:inStyle="'background-color: transparent'"
						/>
					</div>
					<div class="w-1/3">
						<AppInput
							v-model="schedule.has_late"
							:type="'select'"
							:name="'has_late'"
							:label="'Was the Locum late for this session?'"
							:items="[{ label: 'Yes', value: true }, { label: 'No', value: false }]"
						/>
					</div>
				</div>
				<template v-if="schedule.has_late === 'true' || schedule.has_late === true">
					<p class="text-sm">Hours of Late</p>
					<div class="flex items-center justify-start">
						<div class="flex items-center">
							<AppInput
								v-model="schedule.late_hour"
								:type="'number'"
								:name="'late_hour'"
								:inStyle="'padding-top:0.5rem;padding-bottom:0.5rem;text-align:right; background-color: transparent'"
								:error="formError.find(item => item.field === 'late_hour')"
								:min="1"
								:limit="8"
								@keydown="inputNumberOnly($event)"
								@focus="hasValue(form.late_hour, 'late_hour')"
								@blur="!schedule.late_hour ? schedule.late_hour = 0 : schedule.late_hour"
							/>
							<p class="mx-2 text-sm">hours</p>
						</div>
						<div class="flex items-center">
							<AppInput
								v-model="schedule.late_minute"
								:type="'number'"
								:name="'late_minute'"
								:inStyle="'padding-top:0.5rem;padding-bottom:0.5rem;text-align:right; background-color: transparent'"
								:error="formError.find(item => item.field === 'late_minute')"
								:min="1"
								:maxInput="60"
								:limit="2"
								@keydown="inputNumberOnly($event)"
								@focus="hasValue(schedule.late_minute, 'late_minute')"
								@blur="!schedule.late_minute ? schedule.late_minute = 0 : schedule.late_minute"
							/>
							<p class="mx-2 text-sm">minutes</p>
						</div>
					</div>
					<AppInput
						v-model="schedule.late_hours_reason"
						:type="'textarea'"
						:name="'late_hours_reason'"
						:label="'Reason of late'"
						:rows="2"
						:inStyle="'background-color: transparent'"
						:placeholder="'For e.g. Traffic'"
						:resize="false"
					/>
				</template>
			</div>-->
			<AppButton :label="`Mark this week as Complete`" @click="checkIfCanComplete" />
		</div>
		<AppConfirmationModal
			:label="'Mark this week as Completed?'"
			:confirmLabel="'Yes'"
			:cancelLabel="'Cancel'"
			:modal="confirmation_modal"
			@confirm="complete"
			@cancel="confirmation_modal = false"
		/>
		<AppConfirmationModal
			:label="ignore_modal_label"
			:confirmLabel="'OK'"
			:modal="ignore_modal"
			@confirm="ignore_modal = false"
		/>
	</section>
</template>
<script>
import AppButton from "@/components/Base/AppButton";
import AppInput from "@/components/Base/AppInput";
import AppFormError from "@/components/Base/AppFormError";
import AppConfirmationModal from "@/components/Base/AppConfirmationModal";
import AppTime from "@/components/Base/AppTime";
export default {
	components: {
		AppButton,
		AppInput,
		AppFormError,
		AppConfirmationModal,
		AppTime
	},
	props: ["job_part"],
	data() {
		return {
			confirmation_modal: false,
			ignore_modal: false,
			ignore_modal_label: "",
			has_absences: false,
			has_late: false,
			form: {
				absent_days: 0,
				absent_days_reason: "",
				late_hours: 0,
				late_hours_reason: "",
				late_hour: 0,
				late_minute: 0,
				schedules: []
				// final_hours: 0,
				// final_hours_hour: 0,
				// final_hours_minute: 0
			},
			formError: []
		};
	},
	computed: {
		isPreviousJobPartComplete() {
			return !this.job_part.job.job_parts
				.filter(jobPart => !jobPart.completed_at)
				.map(jobPart => jobPart.part)
				.includes(this.job_part.part - 1);
		},
		isCurrentDatePastTheEndDate() {
			return (
				this.$moment(
					`${this.job_part.date_end} ${this.job_part.time_end}`,
					"YYYY-MM-DD HH:mm"
				).diff(this.$moment(), "minutes") < 0
			);
		}
	},
	mounted() {
		console.log("schedules", this.job_part.schedules);
		this.job_part.schedules.forEach(item => {
			this.form.schedules.push({
				id: item.id,
				date: item.date,
				final_time_start: "",
				final_time_end: "",
				has_late: "",
				late_hours_reason: ""
			});
		});
		// this.form.final_hours = this.job_part.final_hours.toFixed(2);
		// this.form.final_hours_hour = Math.floor(this.job_part.final_hours / 60);
		// this.form.final_hours_minute = Math.floor(this.job_part.final_hours % 60);
	},
	methods: {
		hasValue(value, field) {
			if (value == 0) {
				this.form[field] = "";
			}
		},
		handleKeyDownEvent(e, formField, limit) {
			let acceptedKeys = [
				"Backspace",
				"Tab",
				"ArrowUp",
				"ArrowDown",
				"ArrowLeft",
				"ArrowRight"
			];
			if (
				this.form[formField].length >= limit &&
				!acceptedKeys.includes(e.key)
			) {
				e.preventDefault();
			}
		},
		checkIfCanComplete() {
			this.confirmation_modal = true;
			//   if (this.isPreviousJobPartComplete && this.isCurrentDatePastTheEndDate) {
			//     this.confirmation_modal = true;
			//   } else if (!this.isPreviousJobPartComplete) {
			//     this.ignore_modal = true;
			//     this.ignore_modal_label =
			//       "You need to complete the previous week first";
			//   } else if (!this.isCurrentDatePastTheEndDate) {
			//     this.ignore_modal = true;
			//     this.ignore_modal_label =
			//       "You cannot complete a Job part that has not yet past the end date";
			//   }
		},
		complete() {
			this.formError = [];
			let notRequired = [
				"absent_days_reason",
				"late_hours_reason",
				"final_hours_minute",
				"final_hours_hour",
				"late_minute",
				"late_hour"
			];
			this.confirmation_modal = false;
			if (this.has_absences === "false" || this.has_absences === false) {
				this.form.absent_days = 0;
				notRequired.push("absent_days");
			}
			if (this.has_late === "false" || this.has_late === false) {
				this.form.late_hours = 0;
				notRequired.push("late_hours");
			}

			// if (
			// 	[0, "0"].includes(this.form.final_hours_hour) &&
			// 	[0, "0"].includes(this.form.final_hours_minute)
			// ) {
			// 	this.formError.push({
			// 		field: "final_hours_minute",
			// 		message: "Final Minutes is required"
			// 	});
			// 	// this.formError.push({
			// 	// 	field: "final_hours_hour",
			// 	// 	message: "Final Hours is required"
			// 	// });
			// } else {
			// 	this.form.final_hours =
			// 		this.form.final_hours_hour * 60 +
			// 		parseInt(this.form.final_hours_minute);
			// }

			if ([true, "true"].includes(this.has_late)) {
				if (
					[0, "0"].includes(this.form.late_hour) &&
					[0, "0"].includes(this.form.late_minute)
				) {
					this.formError.push({
						field: "late_minute",
						message: "Late Minutes is required"
					});
					// this.formError.push({
					// 	field: "late_hour",
					// 	message: "Late Hours is required"
					// });
				} else {
					this.form.late_hours =
						this.form.late_hour * 60 + parseInt(this.form.late_minute);
				}
			}
			this.Validate(this.form, notRequired);
			if (!this.formError.length) {
				this.$axios
					.$put(
						`/api/v1/practice/job-parts/${this.job_part.id}/complete`,
						this.form
					)
					.then(() => {
						if (
							this.$route.path.includes("/dashboard") ||
							this.$route.path.includes("/sessions")
						) {
							this.$store.commit(
								"jobs/REMOVE_PRACTICE_ONGOING_JOB_PART",
								this.job_part.id
							);
						}
						this.$store.commit("SET_NOTIFICATION", {
							enabled: true,
							status: "success",
							text: ["Job Part completed"]
						});
						this.$emit("completed");
						// setTimeout(() => {
						//   this.$router.push({
						//     path: `/sessions/${this.job_part.id}`,
						//     query: { ...this.$route.query }
						//   });
						// }, 500);
					})
					.catch(err => {
						if (!err.response.data.error_messages) {
							this.formError.push({ message: err.response.data.message });
						} else {
							err.response.data.error_messages.forEach(error => {
								this.formError.push(error);
							});
						}
					})
					.finally(() => {
						this.confirmation_modal = false;
					});
			}
		}
	}
};
</script>
