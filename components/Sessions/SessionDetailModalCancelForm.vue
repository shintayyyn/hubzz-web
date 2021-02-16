<template>
	<section>
		<div class="rounded-lg border p-4 mt-4">
			<div
				class="font-bold text-md sm:text-lg"
			>{{ job.status === 'Ongoing' ? 'Terminate':'Cancel' }} this job</div>
			<!-- <AppFormError v-if="formError.length" :form-error="formError" /> -->

			<AppInput
				v-model="form.cancelled_reason"
				:type="'select'"
				:name="'cancelled_reason'"
				:label="'Please select your reason'"
				:error="formError.find(item => item.field === 'cancelled_reason')"
				:placeholder="'Select...'"
				:items="reasons"
			/>

			<AppInput
				v-if="job.status === 'Ongoing'"
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
					:in-style="'padding-top:0.5rem;padding-bottom:0.5rem;text-align:right'"
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

			<template v-if="job.status === 'Ongoing'">
				<p class="text-sm mb-2">Schedule</p>
				<div style="overflow: auto; max-height: 650px;" class="mb-2 px-2">
					<div
						v-for="(schedule, index) in form.schedules"
						:key="schedule.id"
						class="pt-4 px-2 mb-2 rounded-lg"
						:class="index%2?'bg-lighter-gray' : 'bg-light-gray'"
					>
						<div class="flex justify-between font-bold">
							<p>{{ $moment(schedule.date, "YYYY-MM-DD").format("DD/MM/YYYY") }}</p>
							<p>{{ schedule.time_start }} - {{ schedule.time_end }}</p>
						</div>
						<div class="flex flex-wrap items-end">
							<div class="w-1/2 lg:w-1/3">
								<AppTime
									v-model="schedule.final_time_start"
									:name="`final_time_start-${index}`"
									:label="'Final Time Start'"
									:inStyle="'background-color: transparent'"
									:error="formError.find(err => err.field === `final_time_start-${index}`)"
									@change="(schedule.final_time_start && schedule.final_time_start === schedule.time_start)  || $moment(`${schedule.date} ${schedule.final_time_start}`).isBefore(`${schedule.date} ${schedule.time_start}`) ? [schedule.has_late = false, schedule.late_hours_reason=''] : ''"
								/>
							</div>
							<div class="w-1/2 lg:w-1/3 px-2">
								<AppTime
									v-model="schedule.final_time_end"
									:name="`final_time_end-${index}`"
									:label="'Final Time End'"
									:inStyle="'background-color: transparent'"
									:error="formError.find(err => err.field === `final_time_end-${index}`)"
								/>
							</div>
							<div class="w-full lg:w-1/3">
								<AppInput
									v-model="schedule.has_late"
									:type="'select'"
									:name="'has_late'"
									:label="'Was the Locum late for this session?'"
									:items="[{ label: 'Yes', value: true }, { label: 'No', value: false }]"
									:disabled="(schedule.final_time_start && schedule.final_time_start === schedule.time_start)  || $moment(`${schedule.date} ${schedule.final_time_start}`).isBefore(`${schedule.date} ${schedule.time_start}`)"
								/>
							</div>
						</div>
						<template v-if="schedule.has_late === 'true' || schedule.has_late === true">
							<AppInput
								v-model="schedule.late_hours_reason"
								:type="'textarea'"
								:name="`late_hours_reason-${index}`"
								:label="'Reason of late'"
								:rows="2"
								:inStyle="'background-color: transparent'"
								:placeholder="'For e.g. Traffic'"
								:resize="false"
								:error="formError.find(err => err.field === `late_hours_reason-${index}`)"
							/>
						</template>
					</div>
				</div>
			</template>

			<!-- <AppInput
        v-if="job.status === 'Ongoing'"
        v-model="has_late"
        :type="'select'"
        :name="'has_late'"
        :label="'Was the Locum late for this session?'"
        :items="[{ label: 'Yes', value: true }, { label: 'No', value: false }]"
      />

      <template v-if="has_late === 'true' || has_late === true">
        <p class="text-sm">
          Hours of Late
        </p>
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
            <p class="mx-2 text-sm">
              hours
            </p>
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
            <p class="mx-2 text-sm">
              minutes
            </p>
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
			</template>-->

			<!-- <AppInput
        v-if="job.status === 'Ongoing'"
        v-model="form.final_hours"
        :type="'number'"
        :name="'final_hours'"
        :label="'Final hours'"
        :in-style="'padding-top:0.5rem;padding-bottom:0.5rem;text-align:right'"
        :error="formError.find(item => item.field === 'final_hours')"
			/>-->
			<!-- <template v-if="job.status === 'Ongoing'">
        <p class="text-sm">
          Final hours
        </p>
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
            <p class="mx-2">
              hours
            </p>
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
            <p class="mx-2">
              minutes
            </p>
          </div>
        </div>
			</template>-->
			<AppButton
				:label="`${job.status === 'Ongoing' ? 'Terminate' : 'Cancel'} job`"
				@click="checkIfCanCancel"
			/>
		</div>
		<AppConfirmationModal
			:label="`${job.status === 'Ongoing' ? 'Terminate' : 'Cancel'} this job?`"
			:confirm-label="'Yes'"
			:cancel-label="'No'"
			:modal="confirmation_modal"
			@confirm="cancel"
			@cancel="confirmation_modal = false"
		/>
	</section>
</template>
<script>
import AppButton from "@/components/Base/AppButton";
import AppInput from "@/components/Base/AppInput";
import AppFormError from "@/components/Base/AppFormError";
import AppConfirmationModal from "@/components/Base/AppConfirmationModal";
import AppTime from "@/components/Base/AppTime";
const reasons = [
	{
		label: "In-house Locum can now cover the session",
		value: "In-house Locum can now cover the session"
	},
	{
		label: "Annual leave that session was required for has been cancelled",
		value: "Annual leave that session was required for has been cancelled"
	},
	{
		label: "Session had been double booked",
		value: "Session had been double booked"
	},
	{
		label: "Session booked in error, practice is closed for staff training",
		value: "Session booked in error, practice is closed for staff training"
	},
	{
		label: "Session booked in error, Bank Holiday",
		value: "Session booked in error, Bank Holiday"
	},
	{
		label: "Session cancelled due to budgetary constraints",
		value: "Session cancelled due to budgetary constraints"
	},
	{
		label: "Locum did not show up",
		value: "Locum did not show up"
	},
	{
		label: "Locums compliance documents have expired",
		value: "Locums compliance documents have expired",
	},
];
export default {
	components: {
		AppButton,
		AppInput,
		AppFormError,
		AppConfirmationModal,
		AppTime
	},

	props: {
		job: {
			type: Object,
			required: true
		}
	},

	data() {
		return {
			reasons,
			confirmation_modal: false,
			has_absences: false,
			has_late: false,
			form: {
				cancelled_reason: "",
				absent_days: 0,
				absent_days_reason: "",
				schedules: []
				// late_hours: 0,
				// late_hour: 0,
				// late_minute: 0,
				// late_hours_reason: "",
				// final_hours: 0,
				// final_hours_hour: 0,
				// final_hours_minute: 0
			},
			formError: []
		};
	},
	created() {
		if (this.job.status === "Ongoing") {
			this.job.schedules.forEach(item => {
				this.form.schedules.push({
					id: item.id,
					date: item.date,
					final_time_start: "",
					final_time_end: "",
					time_start: item.time_start,
					time_end: item.time_end,
					has_late: false,
					late_hours_reason: ""
				});
			});
		}
	},
	methods: {
		hasValue(value, field) {
			if (value == 0) {
				this.form[field] = "";
			}
		},
		validateForm() {
			this.formError = [];
			let notRequired = ["final_hours"];

			if (this.job.status !== "Ongoing") {
				notRequired.push(
					"absent_days",
					"absent_days_reason",
					"late_hours",
					"late_hours_reason",
					"final_hours_hour",
					"final_hours_minute",
					"schedules"
				);
			} else if (this.job.status === "Ongoing") {
				if (this.has_absences === "false" || this.has_absences === false) {
					notRequired.push("absent_days", "absent_days_reason");
				}
				// if (this.has_late === "false" || this.has_late === false) {
				// 	notRequired.push("late_hours", "late_hours_reason")
				// }
			}

			this.Validate(this.form, notRequired);
			if (!this.formError.length) {
				this.confirmation_modal = true;
			}
		},
		checkIfCanCancel() {
			this.formError = [];
			let notRequired = ["schedules"];
			if (this.job.status === "Ongoing") {
				if (this.has_absences === "false" || this.has_absences === false) {
					notRequired.push("absent_days", "absent_days_reason");
				}
			} else {
				notRequired.push("absent_days", "absent_days_reason");
			}
			this.Validate(this.form, notRequired);
			if (this.job.status === "Ongoing") {
				this.form.schedules.forEach((sched, index) => {
					if (!sched.final_time_start) {
						this.formError.push({
							field: `final_time_start-${index}`,
							message: "Time Start is required."
						});
					}
					if (!sched.final_time_end) {
						this.formError.push({
							field: `final_time_end-${index}`,
							message: "Time End is required."
						});
					}

					if (["true", true].includes(sched.has_late)) {
						if (!sched.late_hours_reason) {
							this.formError.push({
								field: `late_hours_reason-${index}`,
								message: "Late Reason is required."
							});
						}
					}
				});
				if (!this.formError.length) {
					let schedules = [];
					this.form.schedules.forEach((sched, index) => {
						schedules.push({
							id: sched.id,
							final_time_start: sched.final_time_start,
							final_time_end: sched.final_time_end,
							late_hours_reason: sched.late_hours_reason
						});
					});
					this.form.schedules = schedules;
					this.confirmation_modal = true;
				}
			} else {
				if (!this.formError.length) {
					this.confirmation_modal = true;
				}
			}
		},
		cancel() {
			this.formError = [];
			let notRequired = [
				"final_hours",
				"final_hours_minute",
				"final_hours_hour",
				"late_minute",
				"late_hour"
			];

			if (this.job.status !== "Ongoing") {
				notRequired.push(
					"absent_days",
					"absent_days_reason",
					"late_hours",
					"late_hours_reason",
					"final_hours",
					"schedules"
				);
			} else if (this.job.status === "Ongoing") {
				if (this.has_absences === "false" || this.has_absences === false) {
					notRequired.push("absent_days", "absent_days_reason");
				}
				// if (this.has_late === "false" || this.has_late === false) {
				// 	notRequired.push("late_hours", "late_hours_reason");
				// }
				// this.form.final_hours =
				// 	this.form.final_hours_hour * 60 +
				// 	parseInt(this.form.final_hours_minute);
				// if ([true, "true"].includes(this.has_late)) {
				// 	if (
				// 		[0, "0"].includes(this.form.late_hour) &&
				// 		[0, "0"].includes(this.form.late_minute)
				// 	) {
				// 		this.formError.push({
				// 			field: "late_minute",
				// 			message: "Late Minutes is required"
				// 		});
				// 		// this.formError.push({
				// 		// 	field: "late_hour",
				// 		// 	message: "Late Hours is required"
				// 		// });
				// 	} else {
				// 		this.form.late_hours =
				// 			this.form.late_hour * 60 + parseInt(this.form.late_minute);
				// 	}
				// }
			}

			this.Validate(this.form, notRequired);
			if (!this.formError.length) {
				const jobId = this.job.id;
				let url;
				if (this.job.status === "Ongoing") {
					url = `/api/v1/practice/job-parts/${jobId}/terminate`;
				} else url = `/api/v1/practice/jobs/${jobId}/cancel`;
				this.$axios.$put(url, this.form).then(() => {
					this.$store.commit("jobs/REMOVE_PRACTICE_ALLOCATED_JOB", jobId);
					this.$store.commit("jobs/REMOVE_PRACTICE_AVAILABLE_JOB", jobId);
					this.$store.commit("jobs/REMOVE_PRACTICE_APPLIED_JOB", jobId);
					this.job.job_parts.forEach(({ id }) => {
						this.$store.commit("jobs/REMOVE_PRACTICE_ONGOING_JOB_PART", id);
					});
					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "success",
						text: [
							`${
								this.job.status === "Ongoing"
									? "Job terminated"
									: "Job cancelled"
							}`
						]
					});
					this.$emit("cancelled", jobId);
				});
			}
			this.confirmation_modal = false;
		}
	}
};
</script>
