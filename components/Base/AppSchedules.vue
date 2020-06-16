<template>
	<section>
		<AppConfirmationModal
			:label="['job_part', 'dates'].includes(confirmApply.type) ? `Are you sure you want to apply this shift to ${confirmApply.type === 'job_part' ? 'this job part' : 'all dates'}?` : 'Are you sure to remove all the shift/s on this schedule?'"
			:confirmLabel="'Yes'"
			:cancelLabel="'Cancel'"
			:modal="confirmApply ? true : false"
			@confirm="['job_part', 'dates'].includes(confirmApply.type) ? applyToAll(confirmApply.type, confirmApply.data) : clearShifts(confirmApply.data.shifts, confirmApply.data.index)"
			@cancel="confirmApply = ''"
		/>

		<div class="flex">
			<div class="pl-0 p-4" v-if="!toComplete && !toInvoice">
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
				<div
					class="w-full h-full pb-6 flex flex-col justify-between"
					:class="toComplete || toInvoice ? '' : 'border rounded-lg '"
				>
					<div>
						<p
							class="text-gray-700 text-center text-lg font-bold py-6"
							v-if="!toComplete && !toInvoice"
						>SHIFTS &amp; RATES</p>
						<template v-if="schedules && schedules.length">
							<div
								class="flex items-center w-2/5 mx-auto mb-6 text-gray-600"
								v-if="!toComplete && !toInvoice"
							>
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
								<div class="flex items-end text-sm pb-2 font-bold text-gray-700">
									<p class="px-2" :class="!toComplete && !toInvoice ? 'w-2/12' : 'w-1/12'">Date</p>
									<div
										class="flex items-end text-center"
										:class="!toComplete && !toInvoice ? 'w-9/12 ' : 'w-11/12 pr-2'"
									>
										<p :class="!toComplete && !toInvoice ? 'w-3/12' : 'w-2/12'">Shift</p>
										<p :class="!toComplete && !toInvoice ? 'w-3/12' : 'w-2/12'">Start</p>
										<p :class="!toComplete && !toInvoice ? 'w-3/12' : 'w-2/12'">End</p>
										<p :class="!toComplete && !toInvoice ? 'w-2/12' : 'w-2/12'">Hours</p>
										<p :class="!toComplete && !toInvoice ? 'w-3/12' : 'w-2/12'">Rate Type</p>
										<p :class="!toComplete && !toInvoice ? 'w-2/12' : 'w-2/12'">Rate £</p>
										<!-- FOR COMPLETING JOB -->
										<p class="w-2/12" v-if="toComplete || toInvoice">Final Start</p>
										<p class="w-2/12" v-if="toComplete || toInvoice">Final End</p>
										<p class="w-2/12" v-if="toComplete || toInvoice">Has Late?</p>
										<p class="w-2/12" v-if="toComplete"></p>
										<p class="w-2/12" v-if="toComplete || toInvoice">Any Absences?</p>
										<p class="w-2/12" v-if="toComplete"></p>
										<!-- FOR INVOICING -->
										<p class="w-2/12" v-if="toInvoice">Final Hours</p>
										<p class="w-2/12" v-if="toInvoice">Final Rate</p>
										<p class="w-2/12" v-if="toInvoice">Dispute?</p>
										<p class="w-2/12" v-if="toInvoice "></p>
									</div>
									<p v-if="!toComplete && !toInvoice" class="w-2/12 text-center">Other Options</p>
								</div>

								<div class="flex text-sm mb-2" v-for="(item, index) in filteredSchedule" :key="index">
									<template v-if="toComplete">
										<div
											class="w-1/12 rounded-l-lg p-2 border-l border-t border-b pt-4"
											:class="index%2 ? 'bg-lighter-gray' : 'bg-light-gray'"
										>{{ item.date }}</div>
										<div class="w-11/12 pr-2">
											<div v-for="(shift, i) in item.shifts" :key="i" class="flex w-full">
												<div
													class="w-2/12 flex items-center justify-center px-2"
													:class="[index%2 ? 'bg-lighter-gray' : 'bg-light-gray', item.shifts.length !== 1 ? i === 0 ? 'border-t' : i === item.shifts.length-1 ? 'border-b pb-2' : '' : 'border-t border-b']"
												>
													<p
														class="rounded px-2 w-full text-center py-1 font-bold"
														:class="shiftColor(shift.shift_id)"
													>{{ shifts.find(item => item.value === shift.shift_id) ? shifts.find(item => item.value === shift.shift_id).label : '' }}</p>
												</div>
												<div
													:class="[index%2 ? 'bg-lighter-gray' : 'bg-light-gray', item.shifts.length !== 1 ? i === 0 ? 'border-t' : i === item.shifts.length-1 ? 'border-b pb-2' : '' : 'border-t border-b']"
													class="w-2/12 flex items-center justify-center"
												>{{ shift.time_start }}</div>
												<div
													:class="[index%2 ? 'bg-lighter-gray' : 'bg-light-gray', item.shifts.length !== 1 ? i === 0 ? 'border-t' : i === item.shifts.length-1 ? 'border-b pb-2' : '' : 'border-t border-b']"
													class="w-2/12 flex items-center justify-center"
												>{{ shift.time_end }}</div>
												<div
													:class="[index%2 ? 'bg-lighter-gray' : 'bg-light-gray', item.shifts.length !== 1 ? i === 0 ? 'border-t' : i === item.shifts.length-1 ? 'border-b pb-2' : '' : 'border-t border-b']"
													class="w-2/12 flex items-center justify-center text-center"
												>{{ totalHours(shift.time_start, shift.time_end, item.date) | hoursMinutes}}</div>
												<div
													:class="[index%2 ? 'bg-lighter-gray' : 'bg-light-gray', item.shifts.length !== 1 ? i === 0 ? 'border-t' : i === item.shifts.length-1 ? 'border-b pb-2' : '' : 'border-t border-b']"
													class="w-2/12 flex items-center justify-center text-center"
												>{{ rate_lists.find(item => item.value === shift.locum_detail_rate_type_id) ? rate_lists.find(item => item.value === shift.locum_detail_rate_type_id).label : '' }}</div>
												<div
													:class="[index%2 ? 'bg-lighter-gray' : 'bg-light-gray', item.shifts.length !== 1 ? i === 0 ? 'border-t rounded-tr-lg' : i === item.shifts.length-1 ? 'border-b rounded-br-lg pb-2' : '' : 'border-t border-b rounded-r-lg']"
													class="w-2/12 flex items-center justify-center border-r"
												>{{ shift.rate }}</div>
												<!-- FIELDS -->
												<div class="px-2 w-2/12">
													<AppTime
														v-model="shift.final_time_start"
														:name="`final_time_start-s${index}-${i}`"
														:wrapperClass="'px-1 mt-2 mb-2'"
														:inStyle="`background-color: transparent; ${(shift.final_time_start && shift.final_time_end) && totalHours(shift.final_time_start, shift.final_time_end, item.date) <= 0 ? 'border-color: #f56565;' : ''}`"
														@change="CheckIfEmpty(shift.final_time_start, `final_time_start-s${index}-${i}`), ((shift.final_time_start && shift.final_time_start === shift.time_start))  || $moment(`${item.date} ${shift.final_time_start}`).isBefore(`${item.date} ${shift.time_start}`) ? [shift.has_late = false, shift.late_hours_reason=''] : ''"
														:error="shiftErrors.find(err => err.field === `final_time_start-s${index}-${i}`)"
														@blur="CheckIfEmpty(shift.final_time_start, `final_time_start-s${index}-${i}`)"
														:disabled="[true, 'true'].includes(shift.has_absences)"
													/>
													<p
														v-if="(shift.final_time_start && shift.final_time_end) && totalHours(shift.final_time_start, shift.final_time_end, item.date) <= 0 "
														class="text-xs text-red-500 px-2 pt-1"
													>Shift is less than {{ Math.abs(totalHours(shift.final_time_start, shift.final_time_end, item.date)) | hoursMinutes }}</p>
												</div>
												<div class="w-2/12">
													<AppTime
														v-model="shift.final_time_end"
														:name="`final_time_end-s${index}-${i}`"
														:wrapperClass="'px-1 mt-2 mb-2'"
														:inStyle="`background-color: transparent; ${(shift.final_time_end && shift.time_end) && totalHours(shift.final_time_start, shift.final_time_end, item.date) <= 0 ? 'border-color: #f56565;' : ''}`"
														@change="CheckIfEmpty(shift.final_time_end, `final_time_end-s${index}-${i}`), emitSchedule()"
														:error="shiftErrors.find(err => err.field === `final_time_end-s${index}-${i}`) ? shiftErrors.find(err => err.field === `final_time_end-s${index}-${i}`) : formError.find(err => err.field === `final_time_end-s${index}-${i}`)"
														@blur="CheckIfEmpty(shift.final_time_end, `final_time_end-s${index}-${i}`)"
														:disabled="[true, 'true'].includes(shift.has_absences)"
													/>
												</div>
												<div class="px-2 w-2/12 flex items-center px-1">
													<button
														@click="[![true, 'true'].includes(shift.has_absences) ? shift.has_late=!shift.has_late : '', ![true, 'true'].includes(shift.has_absences) ? shift.has_late ? lateChange(shift, index, i, 'late') : shift.late_hours_reason = '' : '']"
														class="px-2 py-1 text-white focus:outline-none rounded uppercase w-full"
														:disabled="[true, 'true'].includes(shift.has_absences)"
														:class="![true, 'true'].includes(shift.has_absences) ? shift.has_late ? 'cursor-pointer bg-orange-500' : 'cursor-pointer bg-gray-600' : 'bg-gray-500 cursor-not-allowed'"
													>{{ shift.has_late ? 'YES' : 'NO' }}</button>
													<!--<div class="w-full">
														 <AppInput
															v-model="shift.has_late"
															:name="`has_late-s${index}-${i}`"
															:type="'select'"
															:items="[{ label: 'Yes', value: true }, { label: 'No', value: false }]"
															:wrapperClass="'mr-0'"
															:inStyle="'font-size: 13px; padding-left: 8px;'"
															@change="lateChange(shift, index, i)"
															:error="formError.find(err => err.field === `has_late-s${index}-${i}`)"
															:disabled="((shift.final_time_start && shift.final_time_start === shift.time_start))  || $moment(`${item.date} ${shift.final_time_start}`).isBefore(`${item.date} ${shift.time_start}`)"
														/>
													</div>-->
													<!-- <p class="py-1 text-xs text-blue-500 cursor-pointer flex items-center">
														<svgicon name="write-message" width="10" height="10" class="fill-current mr-1" />Edit Reason
													</p>-->
												</div>
												<div class="w-2/12 flex items-center px-1">
													<button
														v-if="[true, 'true'].includes(shift.has_late) && shift.late_hours_reason"
														@click="lateChange(shift, index, i, 'late')"
														class="px-2 py-1 text-gray-700 border-2 border-orange-500 cursor-pointer focus:outline-none rounded w-full"
													>Reason</button>
												</div>
												<div class="px-2 w-2/12 flex items-center px-1">
													<button
														@click="[shift.has_absences=!shift.has_absences, shift.has_absences ? lateChange(shift, index, i, 'absent') : shift.absent_reason = '']"
														class="px-2 py-1 text-white cursor-pointer focus:outline-none rounded uppercase w-full"
														:class="shift.has_absences ? 'bg-orange-500' : 'bg-gray-600'"
													>{{ shift.has_absences ? 'YES' : 'NO' }}</button>
												</div>
												<div class="w-2/12 flex items-center px-1">
													<button
														v-if="[true, 'true'].includes(shift.has_absences) && shift.absent_reason"
														@click="lateChange(shift, index, i, 'absent')"
														class="px-2 py-1 text-gray-700 border-2 border-orange-500 cursor-pointer focus:outline-none rounded w-full"
													>Reason</button>
												</div>
											</div>
										</div>
									</template>
									<template v-else-if="toInvoice">
										<div
											class="w-1/12 px-2 rounded-l-lg border-l border-t border-b"
											:class="[index%2 ? 'bg-lighter-gray' : 'bg-light-gray', toDisplay ? 'pt-2' : 'pb-4 pt-6']"
										>{{ item.date }}</div>
										<div
											class="w-11/12 py-2 rounded-r-lg border-r border-t border-b"
											:class="index%2 ? 'bg-lighter-gray' : 'bg-light-gray'"
										>
											<div v-for="(shift, i) in item.shifts" :key="i" class="flex w-full">
												<div class="flex items-center justify-center text-center w-2/12">{{ shift.shift.name }}</div>
												<div
													class="flex items-center justify-center text-center w-2/12"
												>{{ shift.orig_time_start ? shift.orig_time_start : shift.time_start }}</div>
												<div
													class="flex items-center justify-center text-center w-2/12"
												>{{ shift.orig_time_end ? shift.orig_time_end : shift.time_end }}</div>
												<div class="flex items-center justify-center text-center w-2/12">
													<template v-if="shift.orig_time_start && shift.orig_time_end">
														<template
															v-if="totalHours(shift.orig_time_start, shift.orig_time_end, item.date)>0"
														>{{ totalHours(shift.orig_time_start, shift.orig_time_end, item.date) | hoursMinutes}}</template>
														<template v-else>0</template>
													</template>
													<template v-else>
														<template
															v-if="totalHours(shift.time_start, shift.time_end, item.date)>0"
														>{{ totalHours(shift.time_start, shift.time_end, item.date) | hoursMinutes}}</template>
														<template v-else>0</template>
													</template>
												</div>
												<div
													class="flex items-center justify-center text-center w-2/12"
												>{{ shift.locum_detail_rate_type.name }}</div>
												<div class="flex items-center justify-center text-center w-2/12">{{ shift.rate }}</div>
												<!-- FIELDS -->
												<!-- FINAL START -->
												<div class="flex items-center justify-center text-center w-2/12">
													<template v-if="!toDisplay">
														<AppTime
															v-model="shift.final_time_start"
															:name="`final_time_start-s${index}-${i}`"
															:wrapperClass="'px-1 mt-2 mb-2'"
															:inStyle="`background-color: transparent; ${!isAbsent(shift) && (shift.final_time_start && shift.final_time_end) && totalHours(shift.final_time_start, shift.final_time_end, item.date) <= 0 ? 'border-color: #f56565;' : ''}`"
															@change="CheckIfEmpty(shift.final_time_start, `final_time_start-s${index}-${i}`), onChangeField(shift, item.date)"
															:error="shiftErrors.find(err => err.field === `final_time_start-s${index}-${i}`)"
															@blur="CheckIfEmpty(shift.final_time_start, `final_time_start-s${index}-${i}`)"
															:disabled="[true, 'true'].includes(shift.has_absences) || [false, 'false'].includes(shift.dispute)"
														/>
														<p
															v-if="!isAbsent(shift) && (shift.final_time_start && shift.final_time_end) && totalHours(shift.final_time_start, shift.final_time_end, item.date) <= 0 "
															class="text-xs text-red-500 px-2 pt-1"
														>Shift is less than {{ Math.abs(totalHours(shift.final_time_start, shift.final_time_end, item.date)) | hoursMinutes }}</p>
													</template>
													<template v-else>{{ shift.time_start }}</template>
												</div>
												<!-- FINAL END -->
												<div class="flex items-center justify-center text-center w-2/12">
													<AppTime
														v-if="!toDisplay"
														v-model="shift.final_time_end"
														:name="`final_time_end-s${index}-${i}`"
														:wrapperClass="'px-1 mt-2 mb-2'"
														:inStyle="`background-color: transparent; ${!isAbsent(shift) && (shift.final_time_end  && shift.time_end) && totalHours(shift.final_time_start, shift.final_time_end, item.date) <= 0 ? 'border-color: #f56565;' : ''}`"
														@change="CheckIfEmpty(shift.final_time_end, `final_time_end-s${index}-${i}`), emitSchedule(), onChangeField(shift, item.date)"
														:error="shiftErrors.find(err => err.field === `final_time_end-s${index}-${i}`) ? shiftErrors.find(err => err.field === `final_time_end-s${index}-${i}`) : formError.find(err => err.field === `final_time_end-s${index}-${i}`)"
														@blur="CheckIfEmpty(shift.final_time_end, `final_time_end-s${index}-${i}`)"
														:disabled="[true, 'true'].includes(shift.has_absences) || [false, 'false'].includes(shift.dispute)"
													/>
													<template v-else>{{ shift.time_end }}</template>
												</div>
												<!-- HAS LATE -->
												<div
													class="flex items-center justify-center text-center w-2/12"
												>{{ getLate(shift, item.date) }}</div>
												<!-- ANY ABSENCES -->
												<div class="flex items-center justify-center text-center w-2/12">
													<button
														v-if="!toDisplay"
														@click="absent(shift)"
														:disabled="[false, 'false'].includes(shift.dispute)"
														class="px-2 py-1 text-white cursor-pointer focus:outline-none rounded uppercase w-full mx-2"
														:class="[shift.has_absences ? 'bg-orange-500' : 'bg-gray-600', [false, 'false'].includes(shift.dispute) ? 'opacity-50 cursor-not-allowed' : '']"
													>{{ shift.has_absences ? 'YES' : 'NO' }}</button>
													<template v-else>{{ shift.has_absences ? 'YES' : 'NO' }}</template>
												</div>
												<!-- FINAL HOURS -->
												<div
													class="flex items-center justify-center text-center w-2/12"
												>{{ finalHours(shift, item.date) }}</div>
												<!-- FINAL RATE -->
												<div class="flex items-center justify-center text-center w-2/12">
													£ {{ getRate(shift,
													shift.final_time_start,
													shift.final_time_end,
													item.date) | currency }}
												</div>
												<!-- DISPUTE? -->
												<div class="flex items-center justify-center text-center w-2/12">
													<button
														v-if="!toDisplay"
														@click="dispute(shift, index, i)"
														class="px-2 py-1 text-white cursor-pointer focus:outline-none rounded uppercase w-full mx-2"
														:class="shift.dispute ? 'bg-orange-500' : 'bg-gray-600'"
													>{{ shift.dispute ? 'YES' : 'NO' }}</button>
													<template v-else>{{ shift.dispute ? 'YES' : 'NO' }}</template>
												</div>
												<div class="flex items-center justify-center w-2/12">
													<button
														v-if="shift.dispute"
														@click="lateChange(shift, index, i, 'dispute')"
														class="border py-1 px-4 text-xs rounded"
													>Reason</button>
												</div>
											</div>
										</div>
									</template>
									<!-- Create / Edit Job -->
									<template v-else>
										<div
											class="w-2/12 pl-3 pr-1 pt-4 pb-8 rounded-l-lg border-l border-t border-b"
											:class="index%2 ? 'bg-lighter-gray' : 'bg-light-gray'"
										>{{ item.date }}</div>
										<div
											class="w-9/12 flex flex-col items-start rounded-r-lg border-r border-t border-b"
											:class="index%2 ? 'bg-lighter-gray' : 'bg-light-gray'"
										>
											<div class="flex items-end w-full" v-for="(shift, i) in item.shifts" :key="i">
												<div class="flex flex-col w-3/12 px-1 mb-2 pt-2">
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
													<div
														class="text-xs text-red-500 pt-2"
														v-if="formError.find(err => err.field === `shift_id-s${index}-${i}`) || (shiftErrors && shiftErrors.find(err => err.field === `shift_id-s${index}-${i}`))"
													>{{ formError.find(err => err.field === `shift_id-s${index}-${i}`) ? formError.find(err => err.field === `shift_id-s${index}-${i}`).message : shiftErrors ? shiftErrors.find(err => err.field === `shift_id-s${index}-${i}`).message : null }}</div>
												</div>
												<div class="w-3/12 px-1">
													<AppTime
														v-model="shift.time_start"
														:name="`time_start-s${index}-${i}`"
														:wrapperClass="'mb-1 py-1'"
														:inStyle="`background-color: transparent; ${(shift.time_start && shift.time_end) && totalHours(shift.time_start, shift.time_end, item.date) <= 0 ? 'border-color: #f56565;' : ''}`"
														@change="emitSchedule(), CheckIfEmptyFormError(shift.time_start, `time_start-s${index}-${i}`)"
														:error="formError.find(err => err.field === `time_start-s${index}-${i}`) ? formError.find(err => err.field === `time_start-s${index}-${i}`) : shiftErrors ? shiftErrors.find(err => err.field === `time_start-s${index}-${i}`) : null"
														@blur="CheckEmptyField(form.phone_number,'phone_number')"
													/>
												</div>
												<div class="w-3/12 px-1">
													<AppTime
														v-model="shift.time_end"
														:name="`time_end-s${index}-${i}`"
														:wrapperClass="'mb-1 py-1'"
														:inStyle="`background-color: transparent; ${(shift.time_start && shift.time_end) && totalHours(shift.time_start, shift.time_end, item.date) <= 0 ? 'border-color: #f56565;' : ''}`"
														@change="emitSchedule(), CheckIfEmptyFormError(shift.time_end, `time_end-s${index}-${i}`)"
														:error="formError.find(err => err.field === `time_end-s${index}-${i}`) ? formError.find(err => err.field === `time_end-s${index}-${i}`) : shiftErrors ? shiftErrors.find(err => err.field === `time_end-s${index}-${i}`) : null"
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
														@change="emitSchedule(), CheckIfEmptyFormError(shift.locum_detail_rate_type_id, `locum_detail_rate_type_id-s${index}-${i}`)"
														:error="formError.find(err => err.field === `locum_detail_rate_type_id-s${index}-${i}`) ? formError.find(err => err.field === `locum_detail_rate_type_id-s${index}-${i}`) : shiftErrors ? shiftErrors.find(err => err.field === `locum_detail_rate_type_id-s${index}-${i}`) : null"
													/>
												</div>
												<div class="w-2/12 pl-1 pr-3">
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
														@change="emitSchedule(), CheckIfEmptyFormError(shift.rate, `rate-s${index}-${i}`)"
														:error="formError.find(err => err.field === `rate-s${index}-${i}`) ? formError.find(err => err.field === `rate-s${index}-${i}`) : shiftErrors ? shiftErrors.find(err => err.field === `rate-s${index}-${i}`) : null"
													/>
												</div>
											</div>
											<!-- Add button -->
											<div class="flex justify-start items-center mt-3 mb-4 w-1/4">
												<button
													class="whitespace-no-wrap w-1/2 flex items-center justify-center border border-gray-500 hover:bg-gray-200 text-gray-700 font-bold bg-white py-1 rounded-lg text-xs transition-hover px-4 focus:outline-none ml-1"
													:class="rowNotFilled(item.shifts)?'cursor-not-allowed bg-gray-300 text-gray-500':''"
													@click="addShift(item.shifts, index, item.date)"
												>
													<svgicon
														name="times-solid"
														width="8"
														height="8"
														class="fill-current mr-1"
														style="transform: rotate(45deg);"
													/>Add Shift
												</button>
												<!-- <span
													v-if="item.shifts.length"
													class="mx-1 text-sm text-red-500 hover:text-red-600 cursor-pointer"
													@click="clearShifts(item.shifts, index)"
												>
													<svgicon
														name="refresh"
														width="14"
														height="14"
														class="fill-current cursor-pointer"
														@click="clearShifts(item.shifts, index)"
													/>
												</span>-->
												<button
													v-if="item.shifts.length"
													class="w-1/2 flex items-center justify-center border border-red-500 hover:bg-red-200 text-red-700 font-bold bg-white py-1 rounded-lg text-xs transition-hover px-4 focus:outline-none ml-1"
													@click="confirmApply={type: 'clear_shifts', data: {shifts: item.shifts, index: index}}"
												>
													<!-- clearShifts(item.shifts, index) -->
													<!-- <svgicon name="refresh" width="14" height="14" class="fill-current mr-1" /> -->
													Clear
												</button>
												<p
													class="px-2 whitespace-no-wrap text-sm text-red-500"
													v-if="shiftErrors && shiftErrors.find(err => err.field === `shift-${item.date}`)"
												>{{ shiftErrors.find(err => err.field === `shift-${item.date}`).message }}</p>
											</div>
										</div>
									</template>

									<div class="w-2/12 flex flex-col items-center p-2" v-if="!toComplete && !toInvoice">
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
							<p
								v-if="!toComplete && !toInvoice"
								class="text-center py-20 italic text-gray-500"
							>Select dates first</p>
						</template>
					</div>
					<div
						v-if="(schedules && schedules.length) && !toInvoice"
						class="pl-4 pt-4 flex flex-col items-end"
						:class="!toComplete ? 'w-10/12' : 'w-full px-4'"
					>
						<div
							class="flex flex-col text-lg text-gray-600 font-bold text-right"
							:class="!toComplete ? ' w-2/4' : 'w-2/5'"
						>
							<div class="flex justify-between">
								<p class="w-2/3">Job Part {{ job_part_id }}/{{ job_parts.length }} Total Hours:</p>
								<p
									class="w-1/3"
								>{{ getTotalHours(this.filteredSchedule) <= 0 ? '-' : '' }}{{ getTotalHours(this.filteredSchedule) | hoursMinutes }}</p>
							</div>
							<div class="flex justify-between">
								<p class="w-2/3">Job Part {{ job_part_id }}/{{ job_parts.length }} Gross Rate:</p>
								<p class="w-1/3">£ {{ getJobGrossRate(filteredSchedule, this.toComplete) | currency}}</p>
							</div>
							<div class="flex justify-between">
								<p class="w-2/3">Total Job Gross Rate:</p>
								<p class="w-1/3">£ {{ getJobGrossRate(schedules, this.toComplete) | currency}}</p>
							</div>
							<div class="flex justify-between" v-if="toComplete">
								<p class="w-2/3">Hubzz Fee*:</p>
								<p class="w-1/3">£ {{ hubzz_fee | currency}}</p>
							</div>
						</div>
					</div>
					<transition name="fade">
						<div class="message-modal mini-modal fixed bg-white p-4 center" v-if="show_late_reason">
							<p class="font-bold uppercase">{{ selectedShift.type }} Reason</p>
							<AppInput
								v-if="selectedShift.type === 'late'"
								v-model="selectedShift.late_hours_reason"
								:type="'textarea'"
								:name="`late_hours_reason-${selectedShift.index}-${selectedShift.i}`"
								:rows="3"
								:inStyle="'background-color: transparent'"
								:placeholder="'For e.g. Traffic'"
								:resize="false"
								:error="formError.find(err => err.field === `late_hours_reason-${selectedShift.index}-${selectedShift.i}`)"
								:limit="300"
							/>
							<AppInput
								v-if="selectedShift.type === 'absent'"
								v-model="selectedShift.absent_reason"
								:type="'textarea'"
								:name="`absent_reason-${selectedShift.index}-${selectedShift.i}`"
								:rows="3"
								:inStyle="'background-color: transparent'"
								:placeholder="'For e.g. Sick'"
								:resize="false"
								:error="formError.find(err => err.field === `absent_reason-${selectedShift.index}-${selectedShift.i}`)"
								:limit="300"
							/>
							<template v-if="selectedShift.type === 'dispute'">
								<AppInput
									v-model="selectedShift.remarks"
									:type="'textarea'"
									:name="`remarks-${selectedShift.index}-${selectedShift.i}`"
									:rows="3"
									:inStyle="'background-color: transparent'"
									:resize="false"
									:error="formError.find(err => err.field === `remarks-${selectedShift.index}-${selectedShift.i}`)"
									:disabled="toDisplay"
									:limit="300"
								/>
							</template>

							<div class="flex justify-end">
								<AppButton
									:label="toDisplay ? 'Close' : 'Cancel'"
									class="mr-2"
									@click="toDisplay ? show_late_reason=false : cancelReason()"
								/>
								<AppButton :label="'Save'" @click="saveLateReason(selectedShift)" v-if="!toDisplay" />
							</div>
						</div>
					</transition>
					<div class="shield" v-if="show_late_reason"></div>
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
	// props: ["shifts", "rate_lists", "schedule", "error"],
	props: {
		shifts: Array,
		rate_lists: Array,
		schedule: Array,
		error: Array,
		toComplete: Boolean,
		toInvoice: Boolean,
		shiftErrors: Array,
		practice_rate: Number,
		noDisputeReason: Boolean,
		toDisplay: Boolean,
		invoiceDetails: Object
	},
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
			formError: [],
			show_late_reason: false,
			selectedShift: null,
			cannotAddShift: []
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
					if (this.toComplete) {
						isExisting.shifts.push({
							id: sched.id,
							rate: sched.rate,
							shift_id: sched.shift_id,
							time_end: sched.time_end,
							time_start: sched.time_start,
							locum_detail_rate_type_id: sched.locum_detail_rate_type_id,
							final_time_start: "",
							final_time_end: "",
							has_late: false,
							late_hours_reason: "",
							has_absences: false,
							absent_reason: ""
						});
					} else if (this.toInvoice) {
						let isAbsent = !this.invoiceDetails
							? sched.final_time_start === sched.final_time_end
							: sched.time_start === sched.time_end;
						let finalRate = this.getRate(
							sched,
							sched.fina_time_start,
							sched.final_time_end,
							this.$moment(sched.date, "YYYY-MM-DD").format("DD/MM/YYYY")
						);
						let isDisputed = !sched.remarks ? false : true;
						isExisting.shifts.push({
							id: sched.id,
							rate: sched.rate,
							shift_id: sched.shift.id,
							shift: sched.shift,
							time_end: sched.time_end,
							time_start: sched.time_start,
							locum_detail_rate_type: sched.locum_detail_rate_type,
							locum_detail_rate_type_id: sched.locum_detail_rate_type.id,
							orig_final_start: sched.final_time_start,
							orig_final_end: sched.final_time_end,
							orig_has_absences: isAbsent,
							final_time_start: isAbsent
								? ""
								: !this.invoiceDetails
								? sched.final_time_start
								: sched.time_start,
							final_time_end: isAbsent
								? ""
								: !this.invoiceDetails
								? sched.final_time_end
								: sched.time_end,
							late_hours: sched.late_hours_in_minutes,
							has_absences: isAbsent,
							dispute: sched.disputed ? sched.disputed : false,
							remarks: sched.remarks ? sched.remarks : "",
							total: finalRate
						});
					} else {
						isExisting.shifts.push({
							rate: sched.rate,
							shift_id: sched.shift_id,
							time_end: sched.time_end,
							time_start: sched.time_start,
							locum_detail_rate_type_id: sched.locum_detail_rate_type_id
						});
					}
				} else {
					this.schedule_dates.push(
						this.$moment(sched.date, "YYYY-MM-DD").format("DD/MM/YYYY")
					);
					if (this.toComplete) {
						this.schedules.push({
							date: this.$moment(sched.date, "YYYY-MM-DD").format("DD/MM/YYYY"),
							shifts: [
								{
									id: sched.id,
									rate: sched.rate,
									shift_id: sched.shift_id,
									time_end: sched.time_end,
									time_start: sched.time_start,
									locum_detail_rate_type_id: sched.locum_detail_rate_type_id,
									final_time_start: "",
									final_time_end: "",
									has_late: false,
									late_hours_reason: "",
									has_absences: false,
									absent_reason: ""
								}
							]
						});
					} else if (this.toInvoice) {
						let isAbsent = !this.invoiceDetails
							? sched.final_time_start === sched.final_time_end
							: sched.time_start === sched.time_end;
						let finalRate = this.getRate(
							sched,
							sched.final_time_start,
							sched.final_time_end,
							this.$moment(sched.date, "YYYY-MM-DD").format("DD/MM/YYYY")
						);
						let isDisputed = !sched.remarks ? false : true;
						this.schedules.push({
							date: this.$moment(sched.date, "YYYY-MM-DD").format("DD/MM/YYYY"),
							shifts: [
								{
									id: sched.id,
									rate: sched.rate,
									shift: sched.shift,
									shift_id: sched.shift.id,
									orig_time_start: sched.original_time_start,
									orig_time_end: sched.original_time_end,
									time_end: sched.time_end,
									time_start: sched.time_start,
									locum_detail_rate_type: sched.locum_detail_rate_type,
									locum_detail_rate_type_id: sched.locum_detail_rate_type.id,
									orig_final_start: sched.final_time_start,
									orig_final_end: sched.final_time_end,
									orig_has_absences: isAbsent,
									final_time_start: isAbsent
										? ""
										: !this.invoiceDetails
										? sched.final_time_start
										: sched.time_start,
									final_time_end: isAbsent
										? ""
										: !this.invoiceDetails
										? sched.final_time_end
										: sched.time_end,
									late_hours: sched.late_hours_in_minutes,
									has_absences: isAbsent,
									dispute: sched.disputed ? sched.disputed : false,
									remarks: sched.remarks ? sched.remarks : "",
									total: finalRate
								}
							]
						});
					} else {
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
			this.emitSchedule();
		},
		shiftErrors(value) {
			console.log(value);
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
			this.emitSchedule();
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
			if (this.shiftErrors && this.shiftErrors.length) {
				errors += this.shiftErrors.length;
			}
			return errors > 0 ? true : false;
		},
		activeJobPart() {
			return this.job_parts.find(
				part => part.value.toString() === this.job_part_id.toString()
			);
		},
		hubzz_fee() {
			let hours = this.getTotalHours(this.filteredSchedule) / 60;
			return (hours * this.practice_rate).toFixed(2);
		},
		errors() {
			return [...this.formError, ...this.shiftErrors];
		}
	},
	methods: {
		emitSchedule() {
			if (this.toInvoice) {
				let deduction =
					this.getJobGrossRate(this.schedules) -
					this.getJobGrossRate(this.schedules, true);
				this.$emit(
					"getSchedule",
					this.schedules,
					this.getJobGrossRate(this.schedules, true),
					this.getTotalHours(this.schedules, true),
					deduction > -1 ? deduction : 0,
					this.getTotalLates(this.schedules),
					this.hasShiftError
				);
			} else {
				this.$emit(
					"getSchedule",
					this.schedules,
					this.getJobGrossRate(this.schedules),
					this.getTotalHours(this.schedules),
					this.hasShiftError
				);
			}
		},
		// Completing Job
		cancelReason() {
			if (this.selectedShift.type === "late") {
				let sched = this.schedules.find(
					(item, index) => index === this.selectedShift.index
				);
				let shift = sched.shifts.find(
					(item, index) => index === this.selectedShift.i
				);
				if (this.selectedShift.late_hours_reason) {
					if (!shift.late_hours_reason) {
						shift.has_late = false;
					}
					this.show_late_reason = false;
					this.selectedShift = null;
				} else {
					if (shift.late_hours_reason) {
						let errIndex = this.formError.findIndex(
							err =>
								err.field ===
								`late_hours_reason-${this.selectedShift.index}-${this.selectedShift.i}`
						);
						if (errIndex < 0) {
							this.formError.push({
								field: `late_hours_reason-${this.selectedShift.index}-${this.selectedShift.i}`,
								message: "Late Reason is required."
							});
						}
					} else {
						shift.has_late = false;
						this.show_late_reason = false;
						this.selectedShift = null;
					}
				}
			} else if (this.selectedShift.type === "absent") {
				let sched = this.schedules.find(
					(item, index) => index === this.selectedShift.index
				);
				let shift = sched.shifts.find(
					(item, index) => index === this.selectedShift.i
				);
				if (!shift.absent_reason) {
					shift.has_absences = false;
				}
				this.show_late_reason = false;
				this.selectedShift = null;
			} else if (this.selectedShift.type === "dispute") {
				let sched = this.schedules.find(
					(item, index) => index === this.selectedShift.index
				);
				let shift = sched.shifts.find(
					(item, index) => index === this.selectedShift.i
				);
				if (!shift.remarks) {
					shift.dispute = false;
					shift.final_time_start = shift.orig_final_start;
					shift.final_time_end = shift.orig_final_end;
				}
				this.show_late_reason = false;
				this.selectedShift = null;
			}
		},
		lateChange(shift, index, i, type) {
			let value =
				type === "late"
					? shift.has_late
					: type === "absent"
					? shift.has_absences
					: shift.dispute;
			if (["true", true].includes(value)) {
				let errIndex = -1;
				if (type === "late") {
					errIndex = this.formError.findIndex(
						err => err.field === `late_hours_reason-${index}-${i}`
					);
				} else if (type === "absent") {
					errIndex = this.formError.findIndex(
						err => err.field === `absent_reason-${index}-${i}`
					);
				} else if (type === "dispute") {
					errIndex = this.formError.findIndex(
						err => err.field === `remarks-${index}-${i}`
					);
				}
				if (errIndex > -1) {
					this.formError.splice(errIndex, 1);
				}
				this.selectedShift = { ...shift, index: index, i: i, type: type };
				this.show_late_reason = true;
			} else {
				let sched = this.schedules.find((item, i) => i === index);
				let selectedShift = sched.shifts.find((item, ind) => ind === i);
				selectedShift.late_hours_reason = "";
			}
		},
		saveLateReason(selectedShift) {
			let sched = this.schedules.find(
				(item, index) => index === selectedShift.index
			);
			let shift = sched.shifts.find((item, index) => index === selectedShift.i);
			if (selectedShift.type === "late") {
				if (selectedShift.late_hours_reason) {
					shift.late_hours_reason = selectedShift.late_hours_reason;
					this.selectedShift = null;
					this.show_late_reason = false;
				} else {
					this.formError.push({
						field: `late_hours_reason-${selectedShift.index}-${selectedShift.i}`,
						message: "Late Reason is required."
					});
				}
			} else if (selectedShift.type === "absent") {
				if (selectedShift.absent_reason) {
					shift.absent_reason = selectedShift.absent_reason;
					shift.late_hours_reason = "";
					shift.has_late = false;
					shift.final_time_start = "";
					shift.final_time_end = "";
					this.selectedShift = null;
					this.show_late_reason = false;
				} else {
					this.formError.push({
						field: `absent_reason-${selectedShift.index}-${selectedShift.i}`,
						message: "Late Reason is required."
					});
				}
			} else if (selectedShift.type === "dispute") {
				if (selectedShift.remarks) {
					shift.remarks = selectedShift.remarks;
					this.selectedShift = null;
					this.show_late_reason = false;
				} else {
					this.formError.push({
						field: `remarks-${selectedShift.index}-${selectedShift.i}`,
						message: "Remarks is required."
					});
				}
			}
		},
		CheckIfEmptyFormError(field, name) {
			if (field) {
				let errIndex = this.formError.findIndex(err => err.field === name);
				if (errIndex > -1) {
					this.formError.splice(errIndex, 1);
				}
			}
		},
		CheckIfEmpty(field, name) {
			if (field) {
				let errIndex = this.shiftErrors.findIndex(err => err.field === name);
				if (errIndex > -1) {
					this.shiftErrors.splice(errIndex, 1);
				}
			}
		},
		//
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
							if (!this.toComplete) {
								item.shifts.forEach(shift => {
									sched.shifts.push({
										shift_id: shift.shift_id,
										time_start: shift.time_start,
										time_end: shift.time_end,
										locum_detail_rate_type_id: shift.locum_detail_rate_type_id,
										rate: shift.rate
									});
								});
							} else {
								// item.shifts.forEach(shift => {
								// 	sched.shifts.push({
								// 		id: sched.id,
								// 		rate: shift.rate,
								// 		shift_id: shift.shift_id,
								// 		time_end: shift.time_end,
								// 		time_start: shift.time_start,
								// 		locum_detail_rate_type_id: shift.locum_detail_rate_type_id,
								// 		final_time_start: shift,
								// 		final_time_end: "",
								// 		has_late: false,
								// 		late_hours_reason: ""
								// 	});
								// });
							}
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
		getLate(shift, date) {
			let orig_start_hour = shift.time_start.split(":")[0];
			let orig_start_minute = shift.time_start.split(":")[1];
			let final_start_hour = shift.final_time_start.split(":")[0];
			let final_start_minute = shift.final_time_start.split(":")[1];
			let hourDiff = final_start_hour - orig_start_hour;
			let minDiff = final_start_minute - orig_start_minute;

			if (shift.late_hours > 0 && shift.dispute) {
				let late_hours =
					shift.late_hours > 60
						? parseFloat(shift.late_hours / 60)
						: shift.late_hours / 100;
				hourDiff = parseInt(late_hours.toString().split(".")[0]);
				minDiff = parseInt(late_hours.toString().split(".")[1]);
			}

			let diff =
				shift.final_time_start && shift.final_time_end
					? `${hourDiff > 9 ? hourDiff : `0${hourDiff > -1 ? hourDiff : 0}`}:${
							minDiff > 9 ? minDiff : `0${minDiff > -1 ? minDiff : 0}`
					  }`
					: "00:00";
			return diff;
		},
		getTotalLates(schedule) {
			let lateHours = [];
			let lateMinutes = [];
			let late_hour = 0;
			let late_minute = 0;
			schedule.forEach(sched => {
				sched.shifts.forEach(shift => {
					let orig_start_hour = shift.time_start.split(":")[0];
					let orig_start_minute = shift.time_start.split(":")[1];
					let final_start_hour = shift.final_time_start.split(":")[0];
					let final_start_minute = shift.final_time_start.split(":")[1];
					let hourDiff = final_start_hour - orig_start_hour;
					let minDiff = final_start_minute - orig_start_minute;
					lateHours.push(
						shift.final_time_start && shift.final_time_end ? hourDiff : 0
					);
					lateMinutes.push(
						shift.final_time_start && shift.final_time_end ? minDiff : 0
					);
				});
			});
			for (let i = 0; i <= lateHours.length; i++) {
				let num = parseFloat(lateHours[i]);
				if (isNaN(num)) {
					continue;
				}
				late_hour += Number(num);
			}
			for (let i = 0; i <= lateMinutes.length; i++) {
				let num = parseFloat(lateMinutes[i]);
				if (isNaN(num)) {
					continue;
				}
				late_minute += Number(num);
			}
			return `${late_hour > 9 ? late_hour : `0${late_hour}`}:${
				late_minute > 9 ? late_minute : `0${late_minute}`
			}`;
		},

		finalHours(shift, date) {
			let origTotalHours =
				shift.orig_time_start && shift.orig_time_end
					? this.totalHours(shift.orig_time_start, shift.orig_time_end, date)
					: this.totalHours(shift.time_start, shift.time_end, date);
			let finalTotalHours = this.totalHours(
				shift.final_time_start,
				shift.final_time_end,
				date
			);

			let origHours = Math.floor(origTotalHours / 60);
			let origMinutes = Math.floor(origTotalHours % 60);
			let finalHours = Math.floor(finalTotalHours / 60);
			let finalMinutes = Math.floor(finalTotalHours % 60);

			return `${finalHours > 9 ? finalHours : `0${finalHours}`}:${
				finalMinutes > 9 ? finalMinutes : `0${finalMinutes}`
			}/${origHours > 9 ? origHours : `0${origHours}`}:${
				origMinutes > 9 ? origMinutes : `0${origMinutes}`
			}`;
		},

		getRate(shift, startTime, endTime, date) {
			let total_hours = this.totalHours(startTime, endTime, date) / 60;
			switch (shift.locum_detail_rate_type_id) {
				// Hourly
				case 1:
				case "1":
					return !shift.has_absences &&
						startTime &&
						endTime &&
						total_hours !== 0
						? shift.rate * total_hours
						: 0;
					break;
				// Half Day
				case 2:
				case "2":
					return !shift.has_absences &&
						startTime &&
						endTime &&
						total_hours !== 0
						? shift.rate / (total_hours / 2)
						: 0;
					break;
				// Whole Day
				case 3:
				case "3":
					return !shift.has_absences &&
						startTime &&
						endTime &&
						total_hours !== 0
						? shift.rate / total_hours
						: 0;
					break;
				default:
					return 0;
					break;
			}
		},
		getJobGrossRate(schedules, final) {
			let rate = 0;
			let rates = [];

			schedules.map(item => {
				if (item.shifts && item.shifts.length) {
					if (this.toComplete) {
						rates.push(
							...item.shifts.map(shift =>
								shift.has_absences
									? 0
									: final
									? this.getRate(
											shift,
											shift.final_time_start,
											shift.final_time_end,
											item.date
									  )
									: this.getRate(
											shift,
											shift.time_start,
											shift.time_end,
											item.date
									  )
							)
						);
					} else if (this.toInvoice) {
						rates.push(
							...item.shifts.map(shift =>
								shift.has_absences
									? 0
									: final
									? this.getRate(
											shift,
											shift.final_time_start,
											shift.final_time_end,
											item.date
									  )
									: this.getRate(
											shift,
											shift.time_start,
											shift.time_end,
											item.date
									  )
							)
						);
					} else {
						rates.push(
							...item.shifts.map(shift =>
								this.getRate(shift, shift.time_start, shift.time_end, item.date)
							)
						);
					}
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
		getTotalHours(schedule, final) {
			let hour = 0;
			let hours = [];
			schedule.forEach(sched => {
				sched.shifts.forEach(shift => {
					let time_start =
						this.toComplete || final
							? shift.final_time_start
							: shift.time_start;
					let time_end =
						this.toComplete || final ? shift.final_time_end : shift.time_end;
					let total_hours = this.totalHours(time_start, time_end, sched.date);
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
					err.field.includes(`s${index}`)
				);
				let errNames = rowError.map(err => err.field);
				this.formError.forEach((err, i) => {
					if (errNames.includes(err.field)) {
						this.formError.splice(i, errNames.length);
					}
				});
			}
			this.emitSchedule();
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
		addShift(shifts, index, date) {
			let rowError = [];

			if (shifts.length) {
				let last_shift = shifts[shifts.length - 1];
				let i = shifts.length - 1;
				let errIndex;

				if (!last_shift.shift_id) {
					rowError.push({
						field: `shift_id-s${index}-${i}`,
						message: "Shift is required."
					});
				} else {
					errIndex = rowError.findIndex(
						err => err.field === `shift_id-s${index}-${i}`
					);
					if (errIndex > -1) {
						rowError.splice(errIndex, 1);
					}
				}
				if (!last_shift.time_start) {
					rowError.push({
						field: `time_start-s${index}-${i}`,
						message: "Start Time is required."
					});
				} else {
					errIndex = rowError.findIndex(
						err => err.field === `time_start-s${index}-${i}`
					);
					if (errIndex > -1) {
						rowError.splice(errIndex, 1);
					}
				}

				if (!last_shift.time_end) {
					rowError.push({
						field: `time_end-s${index}-${i}`,
						message: "End Time is required."
					});
				} else {
					errIndex = rowError.findIndex(
						err => err.field === `time_end-s${index}-${i}`
					);
					if (errIndex > -1) {
						rowError.splice(errIndex, 1);
					}
				}

				if (!last_shift.locum_detail_rate_type_id) {
					rowError.push({
						field: `locum_detail_rate_type_id-s${index}-${i}`,
						message: "Rate type is required."
					});
				} else {
					errIndex = rowError.findIndex(
						err => err.field === `locum_detail_rate_type_id-s${index}-${i}`
					);
					if (errIndex > -1) {
						rowError.splice(errIndex, 1);
					}
				}

				if (!last_shift.rate) {
					rowError.push({
						field: `rate-s${index}-${i}`,
						message: "Rate is required."
					});
				} else {
					errIndex = rowError.findIndex(
						err => err.field === `rate-s${index}-${i}`
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
				err.field.includes(`s${index}`)
			);
			let errNames = rowError.map(err => err.field);

			this.formError.forEach((err, i) => {
				if (errNames.includes(err.field)) {
					this.formError.splice(i, errNames.length);
				}
			});
			this.confirmApply = "";
		},
		absent(shift) {
			shift.has_absences = !shift.has_absences;
			if (shift.has_absences) {
				shift.final_time_start = "";
				shift.final_time_end = "";
				// if (shift.has_absences == shift.orig_has_absences) {
				// 	shift.dispute = false;
				// } else {
				// 	shift.dispute = true;
				// }
			} else {
				shift.final_time_start = shift.orig_has_absences
					? ""
					: shift.orig_final_start;
				shift.final_time_end = shift.orig_has_absences
					? ""
					: shift.orig_final_end;

				// if (
				// 	shift.final_time_start === shift.orig_final_start &&
				// 	shift.orig_final_end === shift.final_time_end &&
				// 	shift.has_absences == shift.orig_has_absences
				// ) {
				// 	shift.dispute = false;
				// } else {
				// 	shift.dispute = true;
				// }
			}
		},
		isAbsent(shift) {
			if (shift.orig_final_start === shift.orig_final_end) {
				return true;
			}
			return false;
		},
		onChangeField(shift, date) {
			// if (shift.final_time_start && shift.final_time_end) {
			// 	shift.total = this.getRate(
			// 		shift,
			// 		shift.final_time_start,
			// 		shift.final_time_end,
			// 		date
			// 	);
			// 	if (
			// 		shift.final_time_start === shift.orig_final_start &&
			// 		shift.final_time_end === shift.orig_final_end
			// 	) {
			// 		shift.dispute = false;
			// 	} else {
			// 		shift.dispute = true;
			// 	}
			// }
		},
		dispute(shift, index, i) {
			shift.dispute = !shift.dispute;
			if (shift.dispute === false) {
				shift.final_time_start = shift.orig_final_start;
				shift.final_time_end = shift.orig_final_end;
				shift.remarks = "";
			} else {
				this.lateChange(shift, index, i, "dispute");
				shift.final_time_start = "";
				shift.final_time_end = "";
				shift.total = 0;
			}
		},
		isDisputed(shift) {
			if (!shift.has_absences) {
				if (
					shift.final_time_start === shift.orig_final_start &&
					shift.orig_final_end === shift.final_time_end &&
					shift.has_absences == shift.orig_has_absences
				) {
					shift.dispute = false;
				} else {
					shift.dispute = true;
				}
			} else {
				if (shift.has_absences == shift.orig_has_absences) {
					shift.dispute = false;
				} else {
					shift.dispute = true;
				}
			}
		}
	}
};
</script>
<style>
.message-modal.mini-modal {
	min-width: 25vw;
	z-index: 56;
}
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