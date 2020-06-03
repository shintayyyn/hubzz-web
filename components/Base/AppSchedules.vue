<template>
	<section>
		<AppConfirmationModal
			:label="`Are you sure you want to apply this shift to ${confirmApply.type === 'job_part' ? 'this job part' : 'all dates'}?`"
			:confirmLabel="'Yes'"
			:cancelLabel="'Cancel'"
			:modal="confirmApply ? true : false"
			@confirm="applyToAll(confirmApply.type, confirmApply.data)"
			@cancel="confirmApply = ''"
		/>
		<div class="flex">
			<div class="pl-0 p-4">
				<div class="border rounded-lg w-full h-full">
					<p class="text-gray-700 text-center text-lg font-bold pt-6">DATES</p>
					<p class="text-center text-xs text-gray-700">
						Select date range or use the calendar
						<br />to pick out specific dates
					</p>
					<div class="px-4 pb-4 pt-6">
						<div class="flex">
							<div class="px-1 w-full md:w-1/2">
								<AppDate v-model="start_date" :name="'date_start'" :label="'Start Date'" isAfter />
							</div>
							<div class="px-1 w-full md:w-1/2">
								<AppDate
									v-model="end_date"
									:name="'date_end'"
									:label="'End Date'"
									:startDate="start_date"
									isAfter
								/>
							</div>
						</div>
						<AppMultipleDates
							v-model="schedule_dates"
							:name="'dates'"
							is-after
							multipleSelection
							isDisplay
							class="multiple-date-picker"
							:format="'DD/MM/YYYY'"
							:overlayData="overlayData"
							@focus="toggleCalendar = true"
							@blur="toggleCalendar = false"
						/>
						<template v-if="schedule_dates.length">
							<div>
								<div>
									<p class="text-gray-700">
										Selected:
										<span
											class="font-bold"
										>{{ schedule_dates.length }} Date{{schedule_dates.length > 1 ? 's' : ''}}</span>
									</p>
									<p class="text-gray-700">
										Job Parts:
										<span
											class="font-bold"
										>{{ job_parts.length }} Part{{job_parts.length > 1 ? 's' : ''}}</span>
									</p>
								</div>
							</div>
						</template>
						<!-- </template> -->
					</div>
				</div>
			</div>
			<div class="w-full py-4">
				<div class="border rounded-lg w-full h-full pb-6 flex flex-col justify-between">
					<div>
						<p class="text-gray-700 text-center text-lg font-bold py-6">SHIFTS &amp; RATES</p>
						<template v-if="schedules && schedules.length">
							<div class="flex items-center w-1/3 mx-auto mb-6 text-gray-600">
								<p class="text-sm whitespace-no-wrap mr-2 font-bold">Job Part</p>
								<div class="flex flex-col justify-center w-full">
									<div
										class="flex border border-gray-500 justify-between items-center w-full px-2 py-1 text-sm rounded cursor-pointer"
									>
										<div class="flex justify-between items-center xl:w-11/12 font-bold" v-if="activeJobPart">
											<p>{{ `${activeJobPart.id}/${job_parts.length}` }}</p>
											<p
												v-if="activeJobPart.total_days>1"
											>{{ activeJobPart.start_date }} to {{ activeJobPart.end_date }}</p>
											<p v-else>{{ activeJobPart.start_date }}</p>
											<p class="mr-2">{{ activeJobPart.total_days }} day{{ activeJobPart.total_days>1?'s':'' }}</p>
										</div>
										<svgicon name="down" width="12" height="12" class="fill-current" />
									</div>
									<select v-model="job_part_id" class="custom-select -mt-8 py-1 text-sm px-2">
										<option v-for="part in job_parts" :value="part.value" :key="part.id">{{ part.label }}</option>
									</select>
								</div>
							</div>
							<!-- <div class="flex justify-center w-1/3 mx-auto">
								<AppInput
									v-model="job_part_id"
									:label="'Job Part'"
									class="w-full"
									:type="'select'"
									:placeholder="'Select...'"
									:items="job_parts"
								/>
							</div>-->
							<div class="flex px-4 mb-4" v-if="error">
								<p class="py-2 px-4 bg-red-500 text-white text-sm rounded-lg">{{ error.message }}</p>
							</div>
							<div class="px-4">
								<div class="flex text-sm pb-2 font-bold text-gray-700">
									<p class="w-2/12 px-2">Date</p>
									<div class="w-9/12 flex">
										<p class="w-4/12 text-center">Shift</p>
										<p class="w-2/12 text-center">Start</p>
										<p class="w-2/12 text-center">End</p>
										<p class="w-2/12 text-center">Hours</p>
										<p class="w-3/12 text-center">Rate Type</p>
										<p class="w-3/12 text-center">Rate £</p>
									</div>
									<p class="w-2/12 text-center">Other Options</p>
								</div>
								<div class="flex text-sm mb-2" v-for="(item, index) in filteredSchedule" :key="index">
									<div
										class="w-2/12 pl-3 pr-1 pt-4 pb-8 rounded-l-lg"
										:class="index%2 ? 'bg-lighter-gray' : 'bg-light-gray'"
									>{{ item.date }}</div>
									<div
										class="w-9/12 flex flex-col items-start rounded-r-lg"
										:class="index%2 ? 'bg-lighter-gray' : 'bg-light-gray'"
									>
										<div class="flex items-end w-full" v-for="(shift, i) in item.shifts" :key="i">
											<div class="flex flex-col w-4/12 px-1 mb-2">
												<!-- <AppInput
													v-model="shift.shift_id"
													:name="`shift_id-s${index}-${i}`"
													:type="'select'"
													:items="shifts_option"
													class="w-full"
													:inStyle="'font-size: 13px; padding-left: 8px;'"
													:wrapperClass="'mb-1 py-1'"
													@change="changeShiftId(shift.shift_id, item.shifts, i)"
													:error="formError.find(err => err.name === `shift_id-s${index}-${i}`)"
													@blur="CheckEmptyField(shift.shift_id,`shift_id-s${index}-${i}`)"
												/>-->
												<div
													class="flex border text-gray-500 border-gray-500 justify-between items-center w-full px-2 py-1 text-sm rounded cursor-pointer"
													:class="shiftColor(shift.shift_id)"
												>
													<div
														class="flex justify-between items-center font-bold"
													>{{ shifts_option.find(item => item.value.toString() === shift.shift_id.toString()) ? shifts_option.find(item => item.value.toString() === shift.shift_id.toString()).label : 'Select...' }}</div>
													<svgicon name="down" width="12" height="12" class="fill-current" />
												</div>
												<select
													v-model="shift.shift_id"
													class="custom-select -mt-8 py-1 text-sm px-2"
													@change="changeShiftId(shift.shift_id, item.shifts, i)"
												>
													<option
														v-for="option in shifts_option"
														:value="option.value"
														:key="option.value"
													>{{ option.label }}</option>
												</select>
											</div>
											<div class="w-2/12 px-1">
												<AppTime
													v-model="shift.time_start"
													:name="`time_start-s${index}-${i}`"
													:wrapperClass="'mb-1 py-1'"
													:inStyle="`background-color: transparent; ${(shift.time_start && shift.time_end) && totalHours(shift.time_start, shift.time_end, item.date) <= 0 ? 'border-color: #f56565;' : ''}`"
													@change="$emit('getSchedule', schedules)"
													:error="formError.find(err => err.name === `time_start-s${index}-${i}`)"
												/>
											</div>
											<div class="w-2/12 px-1">
												<AppTime
													v-model="shift.time_end"
													:name="`time_end-s${index}-${i}`"
													:wrapperClass="'mb-1 py-1'"
													:inStyle="`background-color: transparent; ${(shift.time_start && shift.time_end) && totalHours(shift.time_start, shift.time_end, item.date) <= 0 ? 'border-color: #f56565;' : ''}`"
													@change="$emit('getSchedule', schedules)"
													:error="formError.find(err => err.name === `time_end-s${index}-${i}`)"
												/>
											</div>
											<div class="w-2/12 px-2 py-4 text-center">
												<template v-if="totalHours(shift.time_start, shift.time_end, item.date) > 0">
													<p>{{totalHours(shift.time_start, shift.time_end, item.date) | hours}}</p>
													<p>{{totalHours(shift.time_start, shift.time_end, item.date) | minutes}}</p>
												</template>
												<template v-else-if="shift.time_start && shift.time_end">
													<span class="text-red-500 leading-none text-sm">
														Shift is less than
														<template
															v-if="totalHours(shift.time_start, shift.time_end, item.date) !== 0"
														>{{ Math.abs(totalHours(shift.time_start, shift.time_end, item.date)) | hoursMinutes }}</template>
														<template v-else>a minute</template>
													</span>
												</template>
											</div>
											<div class="w-3/12 px-1">
												<AppInput
													v-model="shift.locum_detail_rate_type_id"
													:name="`locum_detail_rate_type_id-s${index}-${i}`"
													:type="'select'"
													:items="rate_lists"
													:wrapperClass="'mb-1 py-1'"
													:inStyle="'font-size: 13px; padding-left: 8px;'"
													@change="$emit('getSchedule', schedules)"
													:error="formError.find(err => err.name === `locum_detail_rate_type_id-s${index}-${i}`)"
												/>
											</div>
											<div class="w-3/12 pl-1 pr-3">
												<AppInput
													v-model="shift.rate"
													:name="`rate-s${index}-${i}`"
													class="w-full"
													:type="'text'"
													:min="1"
													:in-style="'text-align:right;background-color: transparent'"
													:wrapperClass="'mb-1 py-1'"
													:limit="8"
													@blur="shift.rate === '' ? shift.rate = 0 : shift.rate"
													@focus="shift.rate === 0 ? shift.rate = '' : shift.rate"
													@keydown="isNumber($event)"
													@change="$emit('getSchedule', schedules)"
													:error="formError.find(err => err.name === `rate-s${index}-${i}`)"
												/>
											</div>
										</div>
										<div class="flex items-center mt-2 mb-4">
											<button
												class="flex items-center justify-center border border-gray-500 hover:bg-gray-200 text-gray-700 font-bold bg-white py-1 rounded-lg w-full text-xs transition-hover px-4 focus:outline-none"
												:class="rowNotFilled(item.shifts)?'cursor-not-allowed bg-gray-300 text-gray-500':''"
												@click="addShift(item.shifts, index)"
											>
												<svgicon
													name="times-solid"
													width="8"
													height="8"
													class="fill-current mr-1"
													style="transform: rotate(45deg);"
												/>Add Shift
											</button>
											<span v-if="item.shifts.length" class="pl-1">
												<svgicon
													name="refresh"
													width="14"
													height="14"
													class="fill-current cursor-pointer"
													@click="clearShifts(item.shifts, index)"
												/>
											</span>
										</div>
									</div>
									<div class="w-2/12 flex flex-col items-center p-2">
										<template v-if="item.shifts && item.shifts.length">
											<button
												class="w-full border border-gray-500 hover:bg-gray-200 leading-tight px-2 py-1 mb-2 rounded-lg"
												@click="confirmApply={type: 'job_part', data: item}"
											>Apply to Job Part</button>
											<button
												class="w-full border border-gray-500 hover:bg-gray-200 leading-tight px-2 py-1 rounded-lg"
												@click="confirmApply={type: 'dates', data: item}"
											>Apply to All Dates</button>
										</template>
									</div>
								</div>
							</div>
						</template>
						<template v-else>
							<p class="text-center py-20 italic text-gray-500">Select dates first</p>
						</template>
					</div>
					<div v-if="schedules && schedules.length" class="w-10/12 pl-4 pt-4 flex flex-col items-end">
						<div class="flex flex-col w-2/4 text-lg text-gray-600 font-bold">
							<div class="flex justify-between">
								<p>Job Part {{ job_part_id }}/{{ job_parts.length }} Total Hours:</p>
								<p>{{ getTotalHours(this.filteredSchedule) <= 0 ? '-' : '' }}{{ getTotalHours(this.filteredSchedule) | hoursMinutes }}</p>
							</div>
							<div class="flex justify-between">
								<p>Job Part {{ job_part_id }}/{{ job_parts.length }} Gross Rate:</p>
								<p>£ {{ getJobGrossRate(filteredSchedule) | currency}}</p>
							</div>
							<div class="flex justify-between">
								<p>Total Job Gross Rate:</p>
								<p>£ {{ getJobGrossRate(schedules) | currency}}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>
<script>
import AppInput from "@/components/Base/AppInput";
import AppDate from "@/components/Base/AppDate";
import AppSchedules from "@/components/Base/AppSchedules";
import AppTime from "@/components/Base/AppTime";
import AppButton from "@/components/Base/AppButton";
import AppLoading from "@/components/Base/AppLoading";
import AppMultipleDates from "@/components/Base/AppMultipleDates";
import AppConfirmationModal from "@/components/Base/AppConfirmationModal";

export default {
	components: {
		AppInput,
		AppMultipleDates,
		AppDate,
		AppButton,
		AppTime,
		AppLoading,
		AppConfirmationModal
	},
	props: ["shifts", "rate_lists", "schedule", "error"],
	data() {
		return {
			id: 1,
			// start_date: "",
			// end_date: "",
			schedule_dates: [],
			selected_dates: [],
			overlayData: [],
			toggleCalendar: false,
			schedules: [],
			showSpecialRates: "",
			// shifts_option: [],
			job_part_id: 1,
			confirmApply: "",
			formError: []
		};
	},
	created() {
		if (this.schedule.length) {
			this.schedule.forEach(sched => {
				let isExisting = this.schedules.find(
					item =>
						item.date ===
						this.$moment(sched.date, "YYYY-MM-DD").format("DD/MM/YYYY")
				);
				if (isExisting) {
					isExisting.shifts.push({
						rate: sched.rate,
						shift_id: sched.shift_id,
						time_end: sched.time_end,
						time_start: sched.time_start,
						locum_detail_rate_type_id: sched.locum_detail_rate_type_id
					});
				} else {
					this.schedule_dates.push(
						this.$moment(sched.date, "YYYY-MM-DD").format("DD/MM/YYYY")
					);
					this.schedules.push({
						date: this.$moment(sched.date, "YYYY-MM-DD").format("DD/MM/YYYY"),
						shifts: [
							{
								rate: sched.rate,
								shift_id: sched.shift_id,
								time_end: sched.time_end,
								time_start: sched.time_start,
								locum_detail_rate_type_id: sched.locum_detail_rate_type_id
							}
						]
					});
				}
			});
		}
	},
	watch: {
		schedule_dates(value) {
			if (!this.schedules.length) {
				value.forEach(date => {
					this.schedules.push({
						date: date,
						shifts: []
					});
				});
			} else {
				if (value.length > this.schedules.length) {
					value.forEach(date => {
						let dateExist = this.schedules.find(sched => sched.date === date);
						if (!dateExist) {
							this.schedules.push({
								date: date,
								shifts: []
							});
						}
					});
				} else {
					this.schedules.forEach((sched, index) => {
						let dateToRemove = value.find(date => sched.date === date);
						if (!dateToRemove) {
							this.schedules.splice(index, 1);
						}
					});
				}
			}

			this.schedules.sort(
				(a, b) =>
					this.$moment(a.date, "DD/MM/YYYY") -
					this.$moment(b.date, "DD/MM/YYYY")
			);

			return;
			if (value.length) {
				console.log("value", value);
				console.log("this.schedules", this.schedules);
				let removedAnItem = false;
				this.schedules.forEach((sched, index) => {
					let dateStillExist = value
						.map(date => sched.date === date)
						.includes(true);
					console.log(dateStillExist);
					if (!dateStillExist) {
						this.schedules.splice(index, 1);
						removedAnItem = true;
					}
				});
				console.log(removedAnItem);
				if (!removedAnItem) {
					let isExisting = this.schedules.find(
						item => item.date === value[value.length - 1]
					);
					if (!isExisting) {
						this.schedules.push({
							date: value[value.length - 1],
							shifts: []
						});
					}
				}
			}
			this.schedules.sort(
				(a, b) =>
					this.$moment(a.date, "DD/MM/YYYY") -
					this.$moment(b.date, "DD/MM/YYYY")
			);
			console.log("schedules", this.schedules);
		},
		schedules(value) {
			this.$emit(
				"getSchedule",
				this.schedules,
				this.getJobGrossRate(this.schedules),
				this.getTotalHours(this.schedules),
				this.hasShiftError
			);
		}
	},
	computed: {
		sortedDates() {
			return [...this.schedule_dates].sort((dateA, dateB) => {
				const datetimeA = this.$moment(dateA, "DD/MM/YYYY");
				const datetimeB = this.$moment(dateB, "DD/MM/YYYY");
				if (datetimeA.isBefore(datetimeB)) {
					return -1;
				}

				if (datetimeA.isAfter(datetimeB)) {
					return 1;
				}

				return 0;
			});
		},
		start_date: {
			get() {
				return this.sortedDates.length > 0
					? this.$moment(this.sortedDates[0], "DD/MM/YYYY").format("YYYY-MM-DD")
					: "";
			},
			set(startDate) {
				if (!startDate) {
					return;
				}
				if (!this.start_date) {
					this.schedule_dates.push(
						this.$moment(startDate, "YYYY-MM-DD").format("DD/MM/YYYY")
					);
					return;
				}
				const newStartDate = this.$moment(startDate, "YYYY-MM-DD");

				const oldStartDate = this.$moment(this.start_date, "YYYY-MM-DD");

				if (newStartDate.isBefore(oldStartDate)) {
					let tempDate = newStartDate;
					while (tempDate.isBefore(oldStartDate)) {
						this.schedule_dates.push(tempDate.format("DD/MM/YYYY"));
						tempDate = tempDate.add(1, "days");
					}
					return;
				}

				if (newStartDate.isAfter(oldStartDate)) {
					this.schedule_dates = this.schedule_dates.filter(
						date => !newStartDate.isAfter(this.$moment(date, "DD/MM/YYYY"))
					);
					this.schedule_dates.push(
						this.$moment(startDate, "YYYY-MM-DD").format("DD/MM/YYYY")
					);
					return;
				}
			}
		},
		end_date: {
			get() {
				return this.sortedDates.length > 0
					? this.$moment(
							this.sortedDates[this.sortedDates.length - 1],
							"DD/MM/YYYY"
					  ).format("YYYY-MM-DD")
					: "";
			},

			set(endDate) {
				if (!endDate) {
					return;
				}

				if (!this.end_date) {
					this.schedule_dates.push(
						this.$moment(endDate, "YYYY-MM-DD").format("DD/MM/YYYY")
					);
					return;
				}

				const newEndDate = this.$moment(endDate, "YYYY-MM-DD");

				const oldEndDate = this.$moment(this.end_date, "YYYY-MM-DD");

				if (newEndDate.isBefore(oldEndDate)) {
					this.schedule_dates = this.schedule_dates.filter(
						date => !newEndDate.isSameOrBefore(this.$moment(date, "DD/MM/YYYY"))
					);
					this.schedule_dates.push(
						this.$moment(endDate, "YYYY-MM-DD").format("DD/MM/YYYY")
					);
					return;
				}

				if (newEndDate.isAfter(oldEndDate)) {
					let tempDate = newEndDate;
					while (tempDate.isAfter(oldEndDate)) {
						this.schedule_dates.push(tempDate.format("DD/MM/YYYY"));
						tempDate = tempDate.subtract(1, "days");
					}
					return;
				}
			}
		},
		shifts_option() {
			return [...this.shifts, { label: "Remove", value: 5 }];
		},
		job_parts() {
			let dates = [];
			let job_part = [];
			let job_part_dates = [];
			this.schedules.forEach(item => {
				dates.push(this.$moment(item.date, "DD/MM/YYYY").format("YYYY-MM-DD"));
			});
			job_part_dates = this.datesToJobParts(dates);
			this.datesToJobParts(dates).forEach((item, index) => {
				let moments = item.dates.map(d => this.$moment(d));
				let maxDate = this.$moment.max(moments).format("DD/MM/YYYY");
				let minDate = this.$moment.min(moments).format("DD/MM/YYYY");
				job_part.push({
					dates: item.dates,
					label: `${index + 1}/${job_part_dates.length} | ${
						item.dates.length > 1 ? `${minDate} - ${maxDate}` : maxDate
					} | ${item.dates.length} day${item.dates.length > 1 ? "s" : ""}`,
					id: index + 1,
					start_date: minDate,
					end_date: maxDate,
					total_days: item.dates.length,
					value: index + 1
				});
			});
			return job_part;
		},
		filteredSchedule() {
			this.$emit(
				"getSchedule",
				this.schedules,
				this.getJobGrossRate(this.schedules),
				this.getTotalHours(this.schedules),
				this.hasShiftError
			);
			let job_parts_schedule = [];
			let activeJobPart = this.job_parts.find(
				part => part.value.toString() === this.job_part_id.toString()
			);
			if (!activeJobPart) {
				this.job_part_id -= 1;
				activeJobPart = this.job_parts.find(
					part => part.value.toString() === this.job_part_id.toString()
				);
			}
			job_parts_schedule = this.schedules.filter(item =>
				activeJobPart.dates.includes(
					this.$moment(item.date, "DD/MM/YYYY").format("YYYY-MM-DD")
				)
			);
			return job_parts_schedule;
		},
		hasShiftError() {
			let errors = 0;
			this.schedules.forEach(item => {
				if (item.shifts.length) {
					item.shifts.forEach((shift, index) => {
						this.totalHours(shift.time_start, shift.time_end, item.date) <= 0
							? (errors += 1)
							: "";
						!shift.locum_detail_rate_type_id ? (errors += 1) : "";
						!shift.shift_id ? (errors += 1) : "";
						shift.rate === 0 ? (errors += 1) : "";
					});
				}
			});
			return errors > 0 ? true : false;
		},
		activeJobPart() {
			return this.job_parts.find(
				part => part.value.toString() === this.job_part_id.toString()
			);
		}
	},
	methods: {
		applyToAll(type, item) {
			if (type === "job_part") {
				let activeJobPart = this.job_parts.find(
					part => part.value.toString() === this.job_part_id.toString()
				);
				this.schedules
					.filter(item =>
						activeJobPart.dates.includes(
							this.$moment(item.date, "DD/MM/YYYY").format("YYYY-MM-DD")
						)
					)
					.forEach(sched => {
						if (sched.date !== item.date) {
							if (sched.shifts.length) {
								sched.shifts.splice(0, sched.shifts.length);
							}
							item.shifts.forEach(shift => {
								sched.shifts.push({
									shift_id: shift.shift_id,
									time_start: shift.time_start,
									time_end: shift.time_end,
									locum_detail_rate_type_id: shift.locum_detail_rate_type_id,
									rate: shift.rate
								});
							});
						}
					});
			} else if (type === "dates") {
				this.schedules.forEach(sched => {
					if (sched.date !== item.date) {
						if (sched.shifts.length) {
							sched.shifts.splice(0, sched.shifts.length);
						}
						item.shifts.forEach(shift => {
							sched.shifts.push({
								shift_id: shift.shift_id,
								time_start: shift.time_start,
								time_end: shift.time_end,
								locum_detail_rate_type_id: shift.locum_detail_rate_type_id,
								rate: shift.rate
							});
						});
					}
				});
			}
			this.confirmApply = "";
		},
		getJobGrossRate(schedules) {
			let rate = 0;
			let rates = [];

			schedules.map(item => {
				if (item.shifts && item.shifts.length) {
					rates.push(...item.shifts.map(shift => shift.rate));
				}
			});

			for (let i = 0; i <= rates.length; i++) {
				let num = parseFloat(rates[i]);
				if (isNaN(num)) {
					continue;
				}
				rate += Number(num);
			}
			return rate.toFixed(2);
		},
		getTotalHours(schedule) {
			let hour = 0;
			let hours = [];
			schedule.forEach(sched => {
				sched.shifts.forEach(shift => {
					let total_hours = this.totalHours(
						shift.time_start,
						shift.time_end,
						sched.date
					);
					if (total_hours > 0) {
						hours.push(total_hours);
					}
				});
			});
			for (let i = 0; i <= hours.length; i++) {
				let num = parseInt(hours[i]);
				if (isNaN(num)) {
					continue;
				}
				hour += Number(num);
			}
			return hour;
		},
		totalHours(start, end, date) {
			let startDate = this.$moment(date + " " + start, "DD/MM/YYYY HH:mm");
			let endDate = this.$moment(date + " " + end, "DD/MM/YYYY HH:mm");
			return start && end
				? this.$moment(endDate, "DD/MM/YYYY HH:mm").diff(startDate, "minutes")
				: 0;
		},
		changeShiftId(id, shifts, index) {
			if (["5", 5].includes(id)) {
				shifts.splice(index, 1);
				let rowError = this.formError.filter(err =>
					err.name.includes(`s${index}`)
				);
				let errNames = rowError.map(err => err.name);
				this.formError.forEach((err, i) => {
					if (errNames.includes(err.name)) {
						this.formError.splice(i, 1);
					}
				});
			}
			this.$emit(
				"getSchedule",
				this.schedules,
				this.getJobGrossRate(this.schedules),
				this.total_working_hours,
				this.hasShiftError
			);
		},
		shiftColor(shift, condition) {
			switch (shift) {
				case "1":
				case 1:
					return condition === "colorOnly"
						? "shift-color-am"
						: "border-shift-am shift-color-am";
					break;
				case "2":
				case 2:
					return condition === "colorOnly"
						? "shift-color-pm"
						: "border-shift-pm shift-color-pm";
					break;
				case "3":
				case 3:
					return condition === "colorOnly"
						? "shift-color-wholeday"
						: "border-shift-whole-day shift-color-wholeday";
					break;
				case "4":
				case 4:
					return condition === "colorOnly"
						? "shift-color-ooh"
						: "border-shift-ooh shift-color-ooh";
					break;
				default:
					return "border-gray-500";
					break;
			}
		},
		generateDates() {
			if (
				this.start_date &&
				!this.$moment(this.start_date).isSameOrAfter(
					this.$moment(this.end_date)
				)
			) {
				let diff = this.$moment(this.end_date).diff(
					this.$moment(this.start_date),
					"days"
				);

				for (let i = 0; i <= diff; i++) {
					let date = this.$moment(this.start_date)
						.add(i, "days")
						.format("DD/MM/YYYY");
					if (!this.schedules.find(item => item.date === date)) {
						this.schedule_dates.push(date);
						this.schedules.push({
							date: date,
							shifts: []
						});
					}
				}
			}
		},
		addShift(shifts, index) {
			let rowError = [];

			if (shifts.length) {
				let last_shift = shifts[shifts.length - 1];
				let i = shifts.length - 1;
				let errIndex;

				if (!last_shift.shift_id) {
					rowError.push({
						name: `shift_id-s${index}-${i}`,
						message: "Shift is required."
					});
				} else {
					errIndex = rowError.findIndex(
						err => err.name === `shift_id-s${index}-${i}`
					);
					if (errIndex > -1) {
						rowError.splice(errIndex, 1);
					}
				}
				if (!last_shift.time_start) {
					rowError.push({
						name: `time_start-s${index}-${i}`,
						message: "Start Time is required."
					});
				} else {
					errIndex = rowError.findIndex(
						err => err.name === `time_start-s${index}-${i}`
					);
					if (errIndex > -1) {
						rowError.splice(errIndex, 1);
					}
				}

				if (!last_shift.time_end) {
					rowError.push({
						name: `time_end-s${index}-${i}`,
						message: "End Time is required."
					});
				} else {
					errIndex = rowError.findIndex(
						err => err.name === `time_end-s${index}-${i}`
					);
					if (errIndex > -1) {
						rowError.splice(errIndex, 1);
					}
				}

				if (!last_shift.locum_detail_rate_type_id) {
					rowError.push({
						name: `locum_detail_rate_type_id-s${index}-${i}`,
						message: "Rate type is required."
					});
				} else {
					errIndex = rowError.findIndex(
						err => err.name === `locum_detail_rate_type_id-s${index}-${i}`
					);
					if (errIndex > -1) {
						rowError.splice(errIndex, 1);
					}
				}

				if (!last_shift.rate) {
					rowError.push({
						name: `rate-s${index}-${i}`,
						message: "Rate is required."
					});
				} else {
					errIndex = rowError.findIndex(
						err => err.name === `rate-s${index}-${i}`
					);
					if (errIndex > -1) {
						rowError.splice(errIndex, 1);
					}
				}
			}
			this.formError = [...this.formError, ...rowError];
			if (!rowError.length) {
				shifts.push({
					shift_id: 0,
					time_start: "",
					time_end: "",
					locum_detail_rate_type_id: 0,
					rate: 0
				});
			}
		},
		rowNotFilled(shifts) {
			let shift = shifts[shifts.length - 1];
			// if (
			// 	!shift.shift_id ||
			// 	!shift.time_start ||
			// 	!shift.time_end ||
			// 	!shift.locum_detail_rate_type_id ||
			// 	!shift.rate
			// ) {
			// 	return true;
			// }
			return false;
		},
		clearShifts(shifts, index) {
			let schedule = this.schedules.find((sched, ind) => ind === index);
			schedule.shifts = [];
			let rowError = this.formError.filter(err =>
				err.name.includes(`s${index}`)
			);
			let errNames = rowError.map(err => err.name);
			this.formError.forEach((err, i) => {
				if (errNames.includes(err.name)) {
					this.formError.splice(i, 1);
				}
			});
		}
	}
};
</script>
<style>
select.custom-select {
	background: transparent;
	appearance: none;
	border: 1px solid red;
	opacity: 0;
	cursor: pointer;
}
.multiple-date-picker {
	min-width: 335px;
}
.bg-light-gray {
	background-color: #f6f6f6;
}
.bg-lighter-gray {
	background-color: #fbfbfb;
}
.shifts-rates .message-modal {
	min-width: 616px;
	min-height: 300px;
	max-height: 75vh;
	max-width: 80vw;
}
.shift .customized-select select {
	padding: 5px;
}
/* .shift .customized-select select option {
	font-size: 14px;
	color: #000;
} */
shift .customized-select select option:last-child {
	color: red;
}
.shift .customized-select select option:disabled {
	color: #a0a0a0;
}
.border-shift-whole-day {
	border: 1px solid #fe703e;
}
.border-shift-am {
	border: 1px solid #ff59ca;
}
.border-shift-pm {
	border: 1px solid #34bbff;
}
.border-shift-ooh {
	border: 1px solid #947ffe;
}
.shift-color-wholeday {
	color: #fe703e;
}
.shift-color-am {
	color: #ff59ca;
}
.shift-color-pm {
	color: #34bbff;
}
.shift-color-ooh {
	color: #947ffe;
}
</style>