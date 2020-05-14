<template>
	<div class="flex flex-col py-2 mb-4 md:mb-6 leading-normal" v-on-clickaway="toggledOff">
		<div class="relative flex flex-row flex-no-wrap justify-between">
			<label :for="name" class="text-xs sm:text-sm py-1">
				{{label}}
				<span v-if="required" class="text-red-500">*</span>
			</label>
			<!-- <div
        class="absolute right-0 bg-red-500 p-1 text-xs sm:text-sm text-white rounded"
        v-if="error"
			>{{error.message}}</div>-->
		</div>
		<div class="flex flex-row justify-start mt-1">
			<div class="flex flex-col w-full">
				<input
					:value="placeholder"
					type="text"
					:placeholder="'DD/MM/YYYY'"
					class="border-b-2 focus:border-yellow-400 focus:outline-none py-2 font-bold text-xs sm:text-sm w-full text-center"
					:class="{ inClass, 'border-red-500': error}"
					@click="modal = true"
					@keypress="validateInput($event)"
					:style="inStyle"
					:format="format"
					:disabled="disabled"
				/>
				<transition name="drop-down">
					<div
						v-if="error"
						class="text-red-500 py-1 text-xs text-white"
					>{{error.message.charAt(0).toUpperCase() + error.message.slice(1).replace(/_/g, " ")}}</div>
				</transition>
				<div class="px-1 w-full md:w-1/2">
					<AppTime
						v-model="form.time_start"
						:type="'time'"
						:name="'time_start'"
						:label="'Start Time'"
						:error="formError.find(item => item.field === 'time_start')"
						required
						@blur="CheckEmptyField(form.time_start,'time_start')"
					/>
				</div>
				<div class="px-1 w-full md:w-1/2">
					<AppTime
						v-model="form.time_end"
						:type="'time'"
						:name="'time_end'"
						:label="'End Time'"
						:error="formError.find(item => item.field === 'time_end')"
						required
						@blur="CheckEmptyField(form.time_end,'time_end')"
					/>
				</div>
			</div>
		</div>
		<transition name="fade">
			<div class="relative md:static z-10 flex" v-if="modal">
				<div class="absolute border rounded-b-lg calendar bg-white shadow-md">
					<div
						class="p-2 flex flex-row flex-no-wrap justify-start items-center border-b-2 border-yellow-500"
					>
						<div class="m-1 w-1/2 flex flex-no-wrap">
							<select
								v-model="selectedMonth"
								class="mr-1 text-xs sm:text-sm py-1 px-1 cursor-pointer bg-gray-200 hover:bg-gray-300 focus:outline-none"
							>
								<option
									:value="month.value"
									v-for="(month, index) in filteredMonths"
									:key="index"
								>{{month.label}}</option>
							</select>
							<select
								v-model="selectedYear"
								class="ml-1 text-xs sm:text-sm py-1 px-1 cursor-pointer bg-gray-200 hover:bg-gray-300 focus:outline-none"
							>
								<option :value="year" v-for="(year, index) in yearLists" :key="index">{{year}}</option>
							</select>
						</div>
						<div class="m-1 w-1/2 flex flex-no-wrap justify-end">
							<span class="cursor-pointer mr-1" @click="adjustMonth('previous')">
								<svgicon
									name="arrow-left"
									height="12"
									width="12"
									:color="(selectedYear.toString() === $moment().format('YYYY') && selectedMonth.toString() === $moment().format('M')) && isAfter ? 'gray' : ''"
								/>
							</span>
							<span class="cursor-pointer ml-1" @click="adjustMonth('next')">
								<svgicon name="arrow-right" height="12" width="12" />
							</span>
						</div>
					</div>

					<div class="flex flex-no-wrap justify-between text-xs sm:text-sm mx-1 mt-4">
						<div class="w-full text-center font-bold">Mo</div>
						<div class="w-full text-center font-bold">Tu</div>
						<div class="w-full text-center font-bold">We</div>
						<div class="w-full text-center font-bold">Th</div>
						<div class="w-full text-center font-bold">Fr</div>
						<div class="w-full text-center font-bold">Sa</div>
						<div class="w-full text-center font-bold">Su</div>
					</div>

					<div class="flex flex-no-wrap justify-between m-1">
						<div class="flex flex-col w-full">
							<div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 6">
								<div class="date-cell">&nbsp;</div>
							</div>
							<div class="relative" v-for="(item, index) in daysInMonth" :key="index">
								<div
									@click="select(item.fullDate)"
									class="rounded-full relative p-1 flex justify-center items-center date-cell"
									:class="{
									'border-yellow-500 border-2': isSame(item.fullDate),
									'text-gray-500': isDisabled(item.fullDate), 
									'cursor-pointer hover:bg-gray-300': !isDisabled(item.fullDate),
									'bg-yellow-500 border-yellow-500 border-2': isSelectedDate(item.date, item),
                  'bg-yellow-500' : dates.length && dates.includes($moment(item.fullDate, 'MM-DD-YYYY').format(format))
									}"
									v-if="item.day === 1"
								>
									<div class="text-xs md:text-sm z-10">{{(item.date)}}</div>
								</div>
							</div>
						</div>
						<div class="flex flex-col w-full">
							<div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 5">
								<div class="date-cell">&nbsp;</div>
							</div>
							<div v-for="(item, index) in daysInMonth" :key="index">
								<div
									@click="select(item.fullDate)"
									class="rounded-full relative p-1 flex justify-center items-center date-cell"
									:class="{
										'border-yellow-500 border-2': isSame(item.fullDate),
										'text-gray-500': isDisabled(item.fullDate), 
										'cursor-pointer hover:bg-gray-300': !isDisabled(item.fullDate),
										'bg-yellow-500 border-yellow-500 border-2': isSelectedDate(item.date, item),
                    'bg-yellow-500' : dates.length && dates.includes($moment(item.fullDate, 'MM-DD-YYYY').format(format))
									}"
									v-if="item.day === 2"
								>
									<div class="text-xs md:text-sm z-10">{{item.date}}</div>
								</div>
							</div>
						</div>
						<div class="flex flex-col w-full">
							<div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 4">
								<div class="date-cell">&nbsp;</div>
							</div>
							<div v-for="(item, index) in daysInMonth" :key="index">
								<div
									@click="select(item.fullDate)"
									class="rounded-full relative p-1 flex justify-center items-center date-cell"
									:class="{
									'border-yellow-500 border-2': isSame(item.fullDate),
									'text-gray-500': isDisabled(item.fullDate), 
									'cursor-pointer hover:bg-gray-300': !isDisabled(item.fullDate),
									'bg-yellow-500 border-yellow-500 border-2': isSelectedDate(item.date),
                    'bg-yellow-500' : dates.length && dates.includes($moment(item.fullDate, 'MM-DD-YYYY').format(format))
									}"
									v-if="item.day === 3"
								>
									<div class="text-xs md:text-sm z-10">{{(item.date)}}</div>
								</div>
							</div>
						</div>
						<div class="relative flex flex-col w-full">
							<div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 3">
								<div class="date-cell">&nbsp;</div>
							</div>
							<div v-for="(item, index) in daysInMonth" :key="index">
								<div
									@mouseover="showDetail=true"
									@mouseleave="showDetail=false"
									@click="select(item.fullDate)"
									class="rounded-full relative p-1 flex justify-center items-center date-cell"
									:class="{
									'border-yellow-500 border-2': isSame(item.fullDate),
									'text-gray-500': isDisabled(item.fullDate), 
									'cursor-pointer hover:bg-gray-300': !isDisabled(item.fullDate),
									'bg-yellow-500 border-yellow-500 border-2': isSelectedDate(item.date),
                    'bg-yellow-500' : dates.length && dates.includes($moment(item.fullDate, 'MM-DD-YYYY').format(format))
									}"
									v-if="item.day === 4"
								>
									<div class="text-xs md:text-sm z-10">{{item.date}}</div>
								</div>
								<!-- <transition name="fade">
									<div
										class="hover-details absolute bg-white border px-1 text-xs z-50 flex flex-col items-center"
										v-if="item.fullDate === $moment().format('MM-DD-YYYY') && showDetail"
									>
										<div class="py-1">
											<div>Shift: Whole Day</div>
											<div>Time in: 24:59</div>
											<div>Time out: 24:59</div>
										</div>
									</div>
								</transition>-->
							</div>
						</div>
						<div class="flex flex-col w-full">
							<div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 2">
								<div class="date-cell">&nbsp;</div>
							</div>
							<div v-for="(item, index) in daysInMonth" :key="index">
								<div
									@click="select(item.fullDate)"
									class="rounded-full relative p-1 flex justify-center items-center date-cell"
									:class="{
									'border-yellow-500 border-2': isSame(item.fullDate),
									'text-gray-500': isDisabled(item.fullDate), 
									'cursor-pointer hover:bg-gray-300': !isDisabled(item.fullDate),
									'bg-yellow-500 border-yellow-500 border-2': isSelectedDate(item.date),
                    'bg-yellow-500' : dates.length && dates.includes($moment(item.fullDate, 'MM-DD-YYYY').format(format))
									}"
									v-if="item.day === 5"
								>
									<div class="text-xs md:text-sm z-10">{{(item.date)}}</div>
								</div>
							</div>
						</div>
						<div class="flex flex-col w-full">
							<div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 1">
								<div class="date-cell">&nbsp;</div>
							</div>
							<div v-for="(item, index) in daysInMonth" :key="index">
								<div
									@click="select(item.fullDate)"
									class="rounded-full relative p-1 flex justify-center items-center date-cell"
									:class="{
									'border-yellow-500 border-2': isSame(item.fullDate),
									'text-gray-500': isDisabled(item.fullDate), 
									'cursor-pointer hover:bg-gray-300': !isDisabled(item.fullDate),
									'bg-yellow-500 border-yellow-500 border-2': isSelectedDate(item.date),
                    'bg-yellow-500' : dates.length && dates.includes($moment(item.fullDate, 'MM-DD-YYYY').format(format))
									}"
									v-if="item.day === 6"
								>
									<div class="text-xs md:text-sm z-10">{{item.date}}</div>
								</div>
							</div>
						</div>
						<div class="flex flex-col w-full">
							<div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 0">
								<div class="date-cell">&nbsp;</div>
							</div>
							<div v-for="(item, index) in daysInMonth" :key="index">
								<div
									@click="select(item.fullDate)"
									class="rounded-full relative p-1 flex justify-center items-center date-cell"
									:class="{
									'border-yellow-500 border-2': isSame(item.fullDate),
									'text-gray-500': isDisabled(item.fullDate), 
									'cursor-pointer hover:bg-gray-300': !isDisabled(item.fullDate),
									'bg-yellow-500 border-yellow-500 border-2': isSelectedDate(item.date),
                    'bg-yellow-500' : dates.length && dates.includes($moment(item.fullDate, 'MM-DD-YYYY').format(format))
									}"
									v-if="item.day === 0"
								>
									<div class="text-xs md:text-sm z-10">{{item.date}}</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</transition>
	</div>
</template>
<script>
import AppInput from "@/components/Base/AppInput";
import AppTime from "@/components/Base/AppTime";
import { mixin as clickaway } from "vue-clickaway";
let months = [
	{ label: "Jan", value: "1" },
	{ label: "Feb", value: "2" },
	{ label: "Mar", value: "3" },
	{ label: "Apr", value: "4" },
	{ label: "May", value: "5" },
	{ label: "Jun", value: "6" },
	{ label: "Jul", value: "7" },
	{ label: "Aug", value: "8" },
	{ label: "Sep", value: "9" },
	{ label: "Oct", value: "10" },
	{ label: "Nov", value: "11" },
	{ label: "Dec", value: "12" }
];
export default {
	components: {
		AppInput,
		AppTime
	},
	mixins: [clickaway],
	props: {
		value: Array,
		name: String,
		label: String,
		error: Object,
		inStyle: String,
		inClass: String,
		format: String,
		limitYear: Number,
		maxYearBefore: Number,
		required: {
			type: Boolean,
			default: false
		},
		// disabled all dates past the current date
		isAfter: Boolean,
		isBefore: Boolean,
		format: {
			type: String,
			default: "YYYY-MM-DD"
		},
		disabled: Boolean,
		startYear: String,
		startDate: String
	},
	data() {
		return {
			modal: false,
			months,
			monthLists: [],
			yearLists: [],
			selectedMonth: this.$moment.utc().format("M"),
			selectedYear: this.$moment.utc().format("YYYY"),
			daysInMonth: [],
			lastDate: "",
			dates: [],
			showDetail: false
		};
	},
	created() {
		console.log("VALUE", this.value);
		if (this.value && this.value.length) {
			this.dates = this.value;
			let last = this.value.find(
				(item, index) => index + 1 === this.value.length
			);
			this.lastDate = last;
		}

		// get current month and year
		if (this.lastDate) {
			this.selectedMonth = this.$moment(this.lastDate, this.format).format("M");
			this.selectedYear = this.$moment(this.lastDate, this.format).format(
				"YYYY"
			);
		}
		// Defined selected year
		if (this.maxYearBefore) {
			this.selectedYear = this.selectedYear - this.maxYearBefore;
		}
		// get month list
		this.getMonthLists();
		// get year list
		this.getYearLists();
		this.getDaysInMonth(this.selectedMonth, this.selectedYear);
	},
	watch: {
		selectedMonth(value) {
			this.getDaysInMonth(value.toString(), this.selectedYear);
		},
		selectedYear(value) {
			// set selected month to this current month if selected year === current year
			if (value === this.$moment().format("YYYY")) {
				this.selectedMonth = this.filteredMonths[0].value;
			}
			this.getDaysInMonth(this.selectedMonth.toString(), value);
		},
		startDate(value) {
			if (value) {
				this.selectedMonth = this.$moment(value).format("M");
				this.selectedYear = this.$moment(value).format("YYYY");
			}
		}
	},
	computed: {
		filteredMonths() {
			// if selected year === current year, get only the current month up to last month,
			// if not, get all the months
			if (this.selectedYear === this.$moment().format("YYYY")) {
				if (this.isAfter) {
					return this.months.filter(
						month =>
							parseInt(month.value) >= parseInt(this.$moment().format("M"))
					);
				}
				if (this.isBefore) {
					return this.months.filter(
						month =>
							parseInt(month.value) <= parseInt(this.$moment().format("M"))
					);
				}
			}
			return this.months;
		},
		placeholder() {
			let sortedDates;
			let display;
			if (this.dates && this.dates.length) {
				sortedDates = this.dates.sort((a, b) => new Date(a) - new Date(b));
			}
			display = sortedDates
				? sortedDates.length > 1
					? `${this.$moment(sortedDates[0]).format(
							"DD/MM/YYYY"
					  )} - ${this.$moment(sortedDates[this.dates.length - 1]).format(
							"DD/MM/YYYY"
					  )} - (${sortedDates.length} day${
							sortedDates.length > 1 ? "s" : ""
					  })`
					: `${this.$moment(sortedDates[0]).format("DD/MM/YYYY")} - 1 day`
				: null;
			return display;
		}
	},
	methods: {
		getMonthLists() {
			for (let i = this.selectedMonth; i <= this.months.length; i++) {
				this.monthLists.push(`${i}`);
			}
		},
		getYearLists() {
			let yearsBefore = [];
			if (!this.isAfter) {
				if (this.limitYear) {
					for (let i = 1; i <= this.limitYear; i++) {
						this.yearLists.push(
							this.$moment()
								.subtract(
									this.maxYearBefore ? this.maxYearBefore - 1 : 0,
									"years"
								)
								.subtract(i, "years")
								.format("YYYY")
						);
					}
				} else {
					for (let i = 0; i <= 5; i++) {
						this.yearLists.push(
							this.$moment()
								.subtract(i, "years")
								.format("YYYY")
						);
						this.yearLists.push(
							this.$moment()
								.add(i, "years")
								.format("YYYY")
						);
					}
				}
			} else if (this.isAfter) {
				for (let i = 0; i <= 10; i++) {
					this.yearLists.push(
						this.$moment(this.selectedYear, "YYYY")
							.add(i, "years")
							.format("YYYY")
					);
				}
			}

			this.yearLists.sort(function(a, b) {
				return a - b;
			});
		},
		isSelectedDate(date) {
			let selectedDate = `${this.selectedYear}-${this.selectedMonth}-${date}`;
			return this.$moment(selectedDate, "YYYY-MM-D").isSame(this.lastDate);
		},
		isSame(date) {
			let newDate = this.$moment().format("MM-DD-YYYY");
			if (this.startDate) {
				this.isDisabled(this.startDate);
				return this.$moment(date, "MM-DD-YYYY").isSame(this.startDate);
			}
			return this.$moment(date, "MM-DD-YYYY").isSame(newDate);
		},
		isDisabled(date) {
			let newDate = this.$moment.utc().format("MM-DD-YYYY");
			if (this.isBefore) {
				if (this.startDate) {
					return this.$moment(date).isAfter(this.startDate);
				}
				return this.$moment(date, "MM-DD-YYYY").isAfter(
					this.$moment(newDate, "MM-DD-YYYY")
				);
			}
			if (this.isAfter) {
				if (this.startDate) {
					return this.$moment(date).isBefore(this.startDate);
				}
				return this.$moment(date, "MM-DD-YYYY").isBefore(
					this.$moment(newDate, "MM-DD-YYYY")
				);
			}
		},
		toggledOff() {
			// get to the selected date
			if (this.lastDate) {
				let month = this.$moment(this.lastDate, "YYYY-MM-DD").format("M");
				let year = this.$moment(this.lastDate, "YYYY-MM-DD").format("YYYY");
				this.selectedMonth = month;
				this.selectedYear = year;
			}
			this.modal = false;
		},
		adjustMonth(type) {
			if (type === "previous") {
				let index = this.filteredMonths.findIndex(
					month => month.value === this.selectedMonth
				);
				// return if selected month and year === current month and year
				if (
					this.selectedMonth.toString() === this.$moment().format("M") &&
					this.selectedYear.toString() === this.$moment().format("YYYY") &&
					this.isAfter
				) {
					return;
				}
				this.selectedYear = parseInt(this.selectedYear);
				if (index === 0 || this.selectedMonth != 1) {
					this.selectedMonth--;
				} else {
					this.selectedMonth = 12;
					this.selectedYear--;
				}
			}
			if (type === "next") {
				if (this.selectedMonth === 12 || this.selectedMonth === "12") {
					this.selectedYear++;
					this.selectedMonth = 1;
				} else {
					this.selectedMonth = parseInt(this.selectedMonth);
					this.selectedMonth++;
				}
			}
		},
		getDaysInMonth(month, selectedYear) {
			let date = this.$moment(`${selectedYear}-${month}-01`, "YYYY-MM-DD");
			let days = [];
			while (date.format("M") === month) {
				days.push({
					day: parseInt(date.format("d")),
					date: parseInt(date.format("D")),
					fullDate: date.format("MM-DD-YYYY")
				});
				date = date.add(1, "days");
			}
			this.daysInMonth = days;
			// days.forEach(day => {
			//   this.daysInMonth.push({
			//     day: day.getDay(),
			//     date: day.getDate(),
			//     fullDate: this.$moment(day).format("MM-DD-YYYY")
			//   });
			// });
		},
		validateInput(e) {
			// e.preventDefault();
			if ((e.key >= 0 && e.key <= 9) || e.key === "/") {
				return;
			} else {
				e.preventDefault();
			}
		},
		select(date) {
			if (!this.isDisabled(date)) {
				if (
					!this.dates.includes(
						this.$moment(date, "MM-DD-YYYY").format(this.format)
					)
				) {
					this.dates.push(this.$moment(date, "MM-DD-YYYY").format(this.format));
				} else {
					let dateIndex = this.dates.findIndex(
						item =>
							item === this.$moment(date, "MM-DD-YYYY").format(this.format)
					);
					if (dateIndex > -1) {
						this.dates.splice(dateIndex, 1);
					}
				}
			}
			this.$emit("input", this.dates);
		}
	}
};
</script>
<style scoped>
.calendar {
	min-width: 230px;
	height: auto;
}
.hover-details {
	min-width: 110px;
}
.top.hover-details {
	margin-top: -32px;
	top: 0;
}
.hover-details {
	margin-top: 8px;
}
.hover-details::after {
	content: "";
	position: absolute;
	top: 0;
	left: 20px;
	width: 0;
	height: 0;
	border: 8px solid transparent;
	border-bottom-color: #ccc;
	border-top: 0;
	margin-left: -8px;
	margin-top: -8px;
}
.top.hover-details::after {
	content: "";
	position: absolute;
	bottom: 0;
	left: 20px;
	width: 0;
	height: 0;
	border: 8px solid transparent;
	border-top-color: #ccc;
	border-bottom: 0;
	margin-left: -8px;
	margin-bottom: -8px;
}
@media screen and (min-width: 468px) {
	.calendar {
		width: 330px;
	}
}
@media screen and (min-width: 468px) {
	.date-cell {
		height: 2.5rem;
	}
}
@media screen and (min-width: 640px) {
	.date-cell {
		height: 3rem;
	}
}
</style>


