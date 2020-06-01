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
										<span class="font-bold">{{ schedule_dates.length }} Dates</span>
									</p>
									<p class="text-gray-700">
										Job Parts:
										<span class="font-bold">{{ job_parts.length }} Parts</span>
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
							<div class="flex justify-center w-1/3 mx-auto">
								<AppInput
									v-model="job_part_id"
									:label="'Job Part'"
									class="w-full"
									:type="'select'"
									:placeholder="'Select...'"
									:items="job_parts"
								/>
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
										<p class="w-3/12 text-center">Rate</p>
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
											<div class="w-4/12 px-1">
												<AppInput
													v-model="shift.shift_id"
													:name="`shift_id-${index}${i}`"
													:type="'select'"
													:items="shifts_option"
													class="w-full"
													:inStyle="'font-size: 13px; padding-left: 8px;'"
													:wrapperClass="'mb-1 py-1'"
													@change="changeShiftId(shift.shift_id, item.shifts, i)"
												/>
											</div>
											<div class="w-2/12 px-1">
												<AppTime
													v-model="shift.time_start"
													:name="`time_start-${index}${i}`"
													:wrapperClass="'mb-1 py-1'"
													:inStyle="'background-color: transparent'"
													@change="$emit('getSchedule', schedules)"
												/>
											</div>
											<div class="w-2/12 px-1">
												<AppTime
													v-model="shift.time_end"
													:name="`time_end-${index}${i}`"
													:wrapperClass="'mb-1 py-1'"
													:inStyle="'background-color: transparent'"
													@change="$emit('getSchedule', schedules)"
												/>
											</div>
											<div class="w-2/12 px-2 py-4 text-center">
												<template v-if="totalHours(shift.time_start, shift.time_end, item.date) > 0">
													<p>{{totalHours(shift.time_start, shift.time_end, item.date) | hours}}</p>
													<p>{{totalHours(shift.time_start, shift.time_end, item.date) | minutes}}</p>
												</template>
												<template
													v-else-if="shift.time_start && shift.time_end"
												>Shift is less than {{ Math.abs(totalHours(shift.time_start, shift.time_end, item.date)) | hoursMinutes}}</template>
											</div>
											<div class="w-3/12 px-1">
												<AppInput
													v-model="shift.locum_detail_rate_type_id"
													:name="`locum_detail_rate_type_id-${index}${i}`"
													:type="'select'"
													:items="rate_lists"
													:wrapperClass="'mb-1 py-1'"
													:inStyle="'font-size: 13px; padding-left: 8px;'"
													@change="$emit('getSchedule', schedules)"
												/>
											</div>
											<div class="w-3/12 pl-1 pr-3">
												<AppInput
													v-model="shift.rate"
													:name="`rate-${index}${i}`"
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
												/>
											</div>
										</div>
										<div class="flex items-center mt-2 mb-4">
											<button
												class="flex items-center justify-center border border-gray-500 hover:bg-gray-200 font-bold bg-white py-1 rounded-lg w-full text-xs transition-hover px-4"
												@click="addShift(item.shifts)"
											>
												<svgicon
													name="times-solid"
													width="8"
													height="8"
													class="fill-current mr-1"
													style="transform: rotate(45deg);"
												/>Add Shift
											</button>
											<span v-if="item.shifts.length && item.shifts.length !== 4" class="pl-1">
												<svgicon
													name="refresh"
													width="14"
													height="14"
													class="fill-current cursor-pointer"
													@click="item.shifts = []"
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
								<!-- <div
									v-for="(item, index) in schedules"
									:key="index"
									class="flex border rounded-lg pl-2 mb-2 text-sm shifts-rates text-gray-600"
								>
									<div class="border-r w-full flex pr-4">
										<div class="flex pr-4 py-4">
											<p>{{ item.date }}</p>
										</div>
										<div class="flex w-full">
											<div class="w-full shift flex flex-col items-start">
												<template v-if="item.shifts.length">
													<div v-for="(shift, i) in item.shifts" :key="i" class="flex w-full items-end">
														<div class="w-1/6 flex items-end">
															<AppInput
																v-model="shift.shift_id"
																:type="'select'"
																:items="shifts"
																class="w-full"
																:wrapperClass="'mb-1 py-1'"
															/>
														</div>
														<div class="w-1/6 pl-4">
															<AppTime v-model="item.time_start" :wrapperClass="'mb-1 py-1'" />
														</div>
														<div class="w-1/6 pl-4">
															<AppTime v-model="item.time_end" :wrapperClass="'mb-1 py-1'" />
														</div>
														<div class="w-2/6 pl-4">
															<AppInput
																v-model="item.rate_type"
																:type="'select'"
																:items="rate_lists"
																:wrapperClass="'mb-1 py-1'"
															/>
														</div>
														<div class="w-1/6 pl-4">
															<AppInput
																class="w-full"
																v-model="item.rate"
																:type="'text'"
																:min="1"
																:in-style="'text-align:right;'"
																:wrapperClass="'mb-1 py-1'"
																:limit="8"
																@blur="item.rate === '' ? item.rate = 0 : item.rate"
																@focus="item.rate === 0 ? item.rate = '' : item.rate"
																@keydown="isNumber($event)"
															/>
														</div>
														<span class="mb-4 ml-2 text-red-500 hover:text-red-600 transition-hover">
															<svgicon
																name="times-solid"
																width="12"
																height="12"
																class="fill-current cursor-pointer"
															/>
														</span>
													</div>
												</template>
												<div class="flex items-center">
													<button
														class="flex items-center justify-center border border-gray-500 hover:bg-gray-200 font-bold bg-white py-1 my-2 rounded-lg w-full text-xs transition-hover px-4"
														:disabled="item.shifts.length && !item.shifts[item.shifts.length-1].shift_id ? true : false"
														@click="addShift(item.shifts)"
													>
														<svgicon
															name="times-solid"
															width="8"
															height="8"
															class="fill-current mr-1"
															style="transform: rotate(45deg);"
														/>Add Shift
													</button>
													<span v-if="item.shifts.length && item.shifts.length !== 4" class="pl-1">
														<svgicon
															name="refresh"
															width="14"
															height="14"
															class="fill-current cursor-pointer"
															@click="item.shifts = []"
														/>
													</span>
												</div>
											</div>
										</div>
									</div>
									<div class="flex flex-col justify-end items-center text-xs px-4 py-2">
										<button
											class="border border-gray-500 leading-tight px-2 py-1 rounded-lg mb-1"
										>Apply to Job Part</button>
										<button
											class="border border-gray-500 leading-tight px-2 py-1 rounded-lg"
										>Apply to all dates</button>
									</div>
								</div>-->
							</div>
						</template>
						<template v-else>
							<p class="text-center py-20 italic text-gray-500">Select dates first</p>
						</template>
					</div>
					<div v-if="schedules && schedules.length" class="w-10/12 pl-4 pt-4 flex flex-col items-end">
						<div class="flex flex-col w-2/4 text-lg text-gray-600 font-bold">
							<div class="flex justify-between">
								<p>Job Part 1/2 Total Hours:</p>
								<p>{{ getTotalHours(this.filteredSchedule) | hoursMinutes }}</p>
							</div>
							<div class="flex justify-between">
								<p>Job Part 1/2 Gross Rate:</p>
								<p>${{ getJobGrossRate(filteredSchedule) | currency}}</p>
							</div>
							<div class="flex justify-between">
								<p>Total Job Gross Rate:</p>
								<p>${{ getJobGrossRate(schedules) | currency}}</p>
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
	props: ["shifts", "rate_lists", "schedule"],
	data() {
		return {
			start_date: "",
			end_date: "",
			schedule_dates: [],
			selected_dates: [],
			overlayData: [],
			toggleCalendar: false,
			schedules: [],
			showSpecialRates: "",
			// shifts_option: [],
			job_part_id: 1,
			confirmApply: ""
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
		start_date(newValue, oldValue) {
			if (
				this.start_date &&
				!this.$moment(this.start_date).isSameOrAfter(
					this.$moment(this.end_date)
				)
			) {
				let start_date = oldValue;
				if (this.schedules && this.schedules.length) {
					let start_date = this.schedules[0];
					start_date = this.$moment(start_date.date, "DD/MM/YYYY").format(
						"YYYY-MM-DD"
					);
				}
				if (this.$moment(newValue).isAfter(start_date)) {
					let overDates = this.schedules.filter(sched =>
						this.$moment(
							this.$moment(sched.date, "DD/MM/YYYY").format("YYYY-MM-DD")
						).isBefore(newValue)
					);
					let schedDates_over = this.schedule_dates.filter(date =>
						this.$moment(
							this.$moment(date, "DD/MM/YYYY").format("YYYY-MM-DD")
						).isBefore(newValue)
					);
					this.schedule_dates.forEach((d, index) => {
						let sched_date = this.$moment(d, "DD/MM/YYYY").format("YYYY-MM-DD");
						if (this.$moment(sched_date).isBefore(newValue)) {
							this.schedule_dates.splice(index, schedDates_over.length);
						}
					});
					this.schedules.forEach((sched, index) => {
						let date = this.$moment(sched.date, "DD/MM/YYYY").format(
							"YYYY-MM-DD"
						);
						if (this.$moment(date).isBefore(newValue)) {
							this.schedules.splice(index, overDates.length);
						}
					});
				}
				this.generateDates();
			}
		},
		end_date(newValue, oldValue) {
			if (
				this.start_date &&
				!this.$moment(this.start_date).isSameOrAfter(
					this.$moment(this.end_date)
				)
			) {
				let last_date = oldValue;
				if (this.schedules && this.schedules.length) {
					let last_sched = this.schedules[this.schedules.length - 1];
					last_date = this.$moment(last_sched.date, "DD/MM/YYYY").format(
						"YYYY-MM-DD"
					);
				}
				if (this.$moment(newValue).isBefore(last_date)) {
					let overDates = this.schedules.filter(sched =>
						this.$moment(
							this.$moment(sched.date, "DD/MM/YYYY").format("YYYY-MM-DD")
						).isAfter(newValue)
					);
					let schedDates_over = this.schedule_dates.filter(date =>
						this.$moment(
							this.$moment(date, "DD/MM/YYYY").format("YYYY-MM-DD")
						).isAfter(newValue)
					);
					this.schedule_dates.forEach((d, index) => {
						let sched_date = this.$moment(d, "DD/MM/YYYY").format("YYYY-MM-DD");
						if (this.$moment(sched_date).isAfter(newValue)) {
							this.schedule_dates.splice(index, schedDates_over.length);
						}
					});
					this.schedules.forEach((sched, index) => {
						let date = this.$moment(sched.date, "DD/MM/YYYY").format(
							"YYYY-MM-DD"
						);
						if (this.$moment(date).isAfter(newValue)) {
							this.schedules.splice(index, overDates.length);
						}
					});
				}
				this.generateDates();
			}
		},
		schedule_dates(value) {
			// let i = 1;
			// value.forEach((date, index) => {
			// 	let job_parts = 0;
			// 	let weekday = this.$moment(date, "DD/MM/YYYY").weekday();
			// 	if (weekday >= 1 || weekday <= 6) {
			// 	} else {
			// 	}
			// 	console.log(date, this.$moment(date, "DD/MM/YYYY").weekday());
			// });
			if (value.length) {
				let removedAnItem = false;
				this.schedules.forEach((sched, index) => {
					let dateStillExist = value
						.map(date => sched.date === date)
						.includes(true);
					if (!dateStillExist) {
						this.schedules.splice(index, 1);
						removedAnItem = true;
					}
				});
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
		},
		schedules(value) {
			this.$emit(
				"getSchedule",
				this.schedules,
				this.getJobGrossRate(this.schedules),
				this.getTotalHours(this.schedules)
			);
		}
	},
	computed: {
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
					label: `${index + 1}/${
						job_part_dates.length
					} | ${minDate} - ${maxDate} | ${item.dates.length} day${
						item.dates.length > 1 ? "s" : ""
					}`,
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
				this.getTotalHours(this.schedules)
			);
			let activeJobPart = this.job_parts.find(
				part => part.value.toString() === this.job_part_id.toString()
			);
			return this.schedules.filter(item =>
				activeJobPart.dates.includes(
					this.$moment(item.date, "DD/MM/YYYY").format("YYYY-MM-DD")
				)
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
				let num = parseInt(rates[i]);
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
					hours.push(total_hours);
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
			}
			this.$emit(
				"getSchedule",
				this.schedules,
				this.getJobGrossRate(this.schedules),
				this.total_working_hours
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
		onFocusShift(shifts, options) {
			console.log("on focus", shifts, options);
		},
		isEmpty(rates, index) {
			if (
				!rates.time_start ||
				!rates.time_end ||
				!rates.rate ||
				rates.rate === 0
			) {
				return true;
			}
			return false;
		},
		rowError(rates, index) {
			let hasTimeStartError = this.specialRatesError.find(
				err => err.field === `sr_time_start_${index}`
			);
			let hasTimeEndError = this.specialRatesError.find(
				err => err.field === `sr_time_end_${index}`
			);
			let hasTimeRateError = this.specialRatesError.find(
				err => err.field === `sr_rate_${index}`
			);
			if (hasTimeStartError || hasTimeStartError || hasTimeRateError) {
				return true;
			}
			return false;
		},
		addShift(shifts) {
			shifts.push({
				shift_id: 0,
				time_start: "",
				time_end: "",
				locum_detail_rate_type_id: 0,
				rate: 0
			});
		}
	}
};
</script>
<style>
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
	border: 2px solid #fe703e;
}
.border-shift-am {
	border: 2px solid #ff59ca;
}
.border-shift-pm {
	border: 2px solid #34bbff;
}
.border-shift-ooh {
	border: 2px solid #947ffe;
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