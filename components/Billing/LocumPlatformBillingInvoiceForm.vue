<template>
	<section class="relative">
		<AppLoading :loading="!propInvoice && !propJobPart" spinner :message="'Loading'" />
		<template v-if="propInvoice || propJobPart">
			<div class="flex flex-col justify-start items-start border rounded-lg py-8 px-6 mb-4">
				<AppLoading :loading="exportLoading" spinner :message="'Exporting'" />
				<AppLoading :loading="saveLoading" spinner />

				<div :ref="'pdf-header'" class="flex justify-between w-full px-2">
					<div v-if="propInvoice" class="flex flex-wrap justify-between w-1/2">
						<div
							class="w-full sm:w-1/2 order-2 sm:order-1 text-xs sm:text-sm text-left rounded-lg border-2 border-gray-300 p-2 w-2/3"
						>
							<section>
								<div class="relative flex flex-col py-2">
									<div class="relative flex flex-row flex-no-wrap justify-between">
										<label class="text-base py-1">To: Accounts Department</label>
									</div>
									<div class="font-bold text-lg mt-2">{{ propInvoice.practice.name }}</div>
								</div>
							</section>
							<div class="text-xs sm:text-sm">
								<div>{{ propInvoice.practice.address_line_1 }}</div>
								<div>{{ propInvoice.practice.address_line_2 }}</div>
								<div>{{ propInvoice.practice.address_line_3 }}</div>
								<div>{{ propInvoice.practice.address_postcode }}</div>
							</div>
						</div>
					</div>
					<div v-if="propJobPart" class="flex flex-wrap justify-between w-1/2">
						<div
							class="w-full sm:w-1/2 order-2 sm:order-1 text-xs sm:text-sm text-left rounded-lg border-2 border-gray-300 p-2 w-2/3"
						>
							<section>
								<div class="relative flex flex-col py-2">
									<div class="relative flex flex-row flex-no-wrap justify-between">
										<label class="text-base py-1">To: Accounts Department</label>
									</div>
									<div class="font-bold text-lg mt-2">{{ propJobPart.practice_name }}</div>
								</div>
							</section>
							<div class="text-xs sm:text-sm">
								<div>{{ propJobPart.practice_address_line_1 }}</div>
								<div>{{ propJobPart.practice_address_line_2 }}</div>
								<div>{{ propJobPart.practice_address_line_3 }}</div>
								<div>{{ propJobPart.practice_address_postcode }}</div>
							</div>
						</div>
					</div>

					<div class="w-1/2 text-xs sm:text-sm sm:text-right leading-normal">
						<div v-if="propInvoice">{{ propInvoice.invoice_number }}</div>
						<div>{{ $auth.user.personal_detail.name }}</div>
						<div>{{ $auth.user.address_detail.address.line_1 }}</div>
						<div>{{ $auth.user.address_detail.address.line_2 }}</div>
						<div>{{ $auth.user.address_detail.address.line_3 }}</div>
						<div>{{ $auth.user.address_detail.address.post_code }}</div>
						<div>Tel {{ $auth.user.contact_detail.mobile_number }}</div>
						<div>{{ $auth.user.email }}</div>
						<div>{{ $auth.user.locum_detail.invoice_detail && $auth.user.locum_detail.invoice_detail.utr_number ? `UTR ${$auth.user.locum_detail.invoice_detail.utr_number}` : null }}</div>
					</div>
				</div>
				<template
					v-if="(propJobPart || (propInvoice && !['Approved','Paid'].includes(propInvoice.status)))"
				>
					<div
						class="w-full bg-orange-400 mt-4 py-1 text-center rounded font-bold mx-2 uppercase text-gray-700"
						v-if="(propInvoice && propInvoice.disputed_items_count > 0 && waitingForPracticeReply(propInvoice.items[0])) && propInvoice.status !== 'Draft'"
					>DISPUTED - Awaiting Practice Reply</div>
				</template>
				<p
					class="w-full bg-gray my-4 py-1 text-center text-white rounded font-bold mx-2"
				>INVOICE DETAILS</p>
				<div class="w-full flex justify-between px-4 text-gray-600">
					<div class="flex items-center">
						<p>Job No.</p>
						<p
							class="mx-2 border border-gray-600 rounded px-4 text-gray-700"
						>{{ job_part.job_part_number }}</p>
					</div>
					<div class="flex items-center">
						<p>Job Type</p>
						<p class="mx-2 border border-gray-600 rounded px-4 text-gray-700">{{ job_part.type }}</p>
					</div>
					<div class="flex items-center">
						<p>Duration</p>
						<p class="mx-2 border border-gray-600 rounded px-4 text-gray-700">
							{{ job_part.date_start }}
							<span class="text-gray-600">to</span>
							{{ job_part.date_end }}
						</p>
					</div>
					<div class="flex items-center">
						<p>Total Work Hours</p>
						<p
							class="mx-2 border border-gray-600 rounded px-4 text-gray-700"
							v-if="total_working_hours>0"
						>{{ total_working_hours | hoursMinutes }}</p>
						<p class="mx-2 border border-gray-600 rounded px-4 text-gray-700" v-else>0</p>
					</div>
				</div>

				<div class="w-full border-b">
					<AppSchedules
						:practice_rate="practice_rate"
						@getSchedule="getSchedule"
						:schedule="propJobPart? propJobPart.schedules : propInvoice.job_part_schedule_items"
						:error="formError.find(err => err.field === 'schedules')"
						:shiftErrors="shiftErrors"
						toInvoice
						:invoiceDetails="propInvoice"
						:toDisplay="propInvoice && propInvoice.status === 'Approved'"
						:type="'invoice'"
					/>
				</div>
				<div class="w-full flex justify-between py-4">
					<div class="flex items-end">
						<p class="text-sm">TOTAL LATES:</p>
						<p class="font-bold mx-2">{{ total_late_hours === '00:00' ? 'None' : total_late_hours }}</p>
					</div>
					<div class="flex items-end">
						<p class="text-sm">TOTAL ABSENCES:</p>
						<p class="font-bold mx-2">{{ total_absences > 0 ? total_absences : 'None'}}</p>
					</div>
					<div class="flex items-end">
						<p class="text-sm">TOTAL WORK HOURS:</p>
						<p
							class="font-bold mx-2"
							v-if="total_working_hours>0"
						>{{ total_working_hours | hoursMinutes }}</p>
						<p class="font-bold mx-2" v-else>0</p>
					</div>
					<div class="flex items-end">
						<p class="text-sm">TOTAL DEDUCTIONS:</p>
						<p class="font-bold mx-2">£ {{ total_deductions | currency}}</p>
					</div>
					<div class="flex items-end">
						<p class="text-sm">TOTAL WORK PAYMENT:</p>
						<p class="font-bold mx-2">£ {{ total_gross_locum_wages | currency }}</p>
					</div>
				</div>

				<div :ref="'pdf-footer'" class="flex w-full">
					<div class="w-1/2 mt-4">
						<div class="rounded-lg border-2 border-gray-300 mt-4 p-4 w-full sm:w-1/2 w-2/3">
							<div
								v-if="propInvoice && propInvoice.paid_under_payroll"
								class="flex flex-col text-xs sm:text-sm"
							>
								<div>Payment by BACS: xxxxx</div>
								<div>Account name: {{ propInvoice.payroll_account_name ? propInvoice.payroll_account_name : 'xxxxx' }}</div>
								<div>Bank: {{ propInvoice.payroll_bank_name ? propInvoice.payroll_bank_name : 'xxxxx' }}</div>
								<div>Sort code: {{ propInvoice.payroll_sort_code ? propInvoice.payroll_sort_code : 'xxxxx' }}</div>
								<div>Account number: {{ propInvoice.payroll_account_number ? propInvoice.payroll_account_number : 'xxxxx*OR' }}</div>
							</div>
							<div
								v-if="propInvoice && !propInvoice.paid_under_payroll"
								class="flex flex-col text-xs sm:text-sm"
							>
								<div>Payment by BACS: xxxxx</div>
								<div>Account name: {{ propInvoice.account_name ? propInvoice.account_name : 'xxxxx' }}</div>
								<div>Bank: {{ propInvoice.bank_name ? propInvoice.bank_name : 'xxxxx' }}</div>
								<div>Sort code: {{ propInvoice.sort_code ? propInvoice.sort_code : 'xxxxx' }}</div>
								<div>Account number: {{ propInvoice.account_number ? propInvoice.account_number : 'xxxxx*OR' }}</div>
							</div>
							<div
								v-if="propJobPart && !propInvoice && propInvoiceDetail && propInvoiceDetail.paid_under_payroll"
								class="flex flex-col text-xs sm:text-sm"
							>
								<div>Payment by BACS: xxxxx</div>
								<div>Account name: {{ propInvoiceDetail.payroll_detail.account_name ? propInvoiceDetail.payroll_detail.account_name : 'xxxxx' }}</div>
								<div>Bank: {{ propInvoiceDetail.payroll_detail.bank_name ? propInvoiceDetail.payroll_detail.bank_name : 'xxxxx' }}</div>
								<div>Sort code: {{ propInvoiceDetail.payroll_detail.sort_code ? propInvoiceDetail.payroll_detail.sort_code : 'xxxxx' }}</div>
								<div>Account number: {{ propInvoiceDetail.payroll_detail.account_number ? propInvoiceDetail.payroll_detail.account_number : 'xxxxx*OR' }}</div>
							</div>
							<div
								v-if="propJobPart && !propInvoice && propInvoiceDetail && !propInvoiceDetail.paid_under_payroll"
								class="flex flex-col text-xs sm:text-sm"
							>
								<div>Payment by BACS: xxxxx</div>
								<div>Account name: {{ propInvoiceDetail.bank_account.account_name ? propInvoiceDetail.bank_account.account_name : 'xxxxx' }}</div>
								<div>Bank: {{ propInvoiceDetail.bank_account.bank_name ? propInvoiceDetail.bank_account.bank_name : 'xxxxx' }}</div>
								<div>Sort code: {{ propInvoiceDetail.bank_account.sort_code ? propInvoiceDetail.bank_account.sort_code : 'xxxxx' }}</div>
								<div>Account number: {{ propInvoiceDetail.bank_account.account_number ? propInvoiceDetail.bank_account.account_number : 'xxxxx*OR' }}</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</template>

		<div class="flex flex-col md:flex-row justify-between" v-if="old">
			<div class="flex justify-end items-center w-full my-2 md:my-4">
				<label class="mx-1">Type:</label>
				<div
					class="text-xs sm:text-sm mx-1 py-2 px-3 border-2 rounded-lg font-bold flex items-center focus:outline-none bg-yellow-500 border-yellow-500"
				>Platform</div>
			</div>
		</div>
		<div
			v-if="old"
			id="htmlpdf"
			class="relative max-w-3xl mb-4 bg-white px-4 py-4 border shadow-md"
			:class="exportLoading ? 'mb-32' : ''"
		>
			<AppLoading :loading="exportLoading" spinner :message="'Exporting'" />
			<AppLoading :loading="saveLoading" spinner />

			<div :ref="'pdf-header'" class="flex flex-col">
				<div class="text-xs sm:text-sm sm:text-right leading-normal">
					<div v-if="propInvoice">{{ propInvoice.invoice_number }}</div>
					<div>{{ $auth.user.personal_detail.name }}</div>
					<div>{{ $auth.user.address_detail.address.line_1 }}</div>
					<div>{{ $auth.user.address_detail.address.line_2 }}</div>
					<div>{{ $auth.user.address_detail.address.line_3 }}</div>
					<div>{{ $auth.user.address_detail.address.post_code }}</div>
					<div>Tel {{ $auth.user.contact_detail.mobile_number }}</div>
					<div>{{ $auth.user.email }}</div>
					<div>{{ $auth.user.locum_detail.invoice_detail && $auth.user.locum_detail.invoice_detail.utr_number ? `UTR ${$auth.user.locum_detail.invoice_detail.utr_number}` : null }}</div>
				</div>
				<div v-if="propInvoice" class="flex flex-wrap justify-between my-2">
					<div
						class="w-full sm:w-1/2 order-2 sm:order-1 text-xs sm:text-sm text-left rounded-lg border-2 border-gray-300 p-2 w-2/3"
					>
						<section>
							<div class="relative flex flex-col py-2">
								<div class="relative flex flex-row flex-no-wrap justify-between">
									<label class="text-base py-1">To: Accounts Department</label>
								</div>
								<div class="font-bold text-lg mt-2">{{ propInvoice.practice.name }}</div>
							</div>
						</section>
						<div class="text-xs sm:text-sm">
							<div>{{ propInvoice.practice.address_line_1 }}</div>
							<div>{{ propInvoice.practice.address_line_2 }}</div>
							<div>{{ propInvoice.practice.address_line_3 }}</div>
							<div>{{ propInvoice.practice.address_postcode }}</div>
						</div>
					</div>
				</div>
				<div v-if="propJobPart" class="flex flex-wrap justify-between my-2">
					<div
						class="w-full sm:w-1/2 order-2 sm:order-1 text-xs sm:text-sm text-left rounded-lg border-2 border-gray-300 p-2 w-2/3"
					>
						<section>
							<div class="relative flex flex-col py-2">
								<div class="relative flex flex-row flex-no-wrap justify-between">
									<label class="text-base py-1">To: Accounts Department</label>
								</div>
								<div class="font-bold text-lg mt-2">{{ propJobPart.practice_name }}</div>
							</div>
						</section>
						<div class="text-xs sm:text-sm">
							<div>{{ propJobPart.practice_address_line_1 }}</div>
							<div>{{ propJobPart.practice_address_line_2 }}</div>
							<div>{{ propJobPart.practice_address_line_3 }}</div>
							<div>{{ propJobPart.practice_address_postcode }}</div>
						</div>
					</div>
				</div>
			</div>

			<div class="overflow-auto">
				<div class="items-table">
					<div :ref="'items-header'" class="flex justify-start">
						<div
							class="w-full bg-gray-900 text-white px-4 py-1 font-semibold border-r-2 border-white"
						>Description</div>
					</div>

					<div
						v-if="form.items && form.items.length > 0"
						:id="`invoice-item`"
						:ref="`invoice-item`"
						class="flex flex-col border-b-2 pb-2"
					>
						<div class="relative flex justify-start mt-2">
							<div class="w-full text-xs sm:text-sm px-4 py-1">{{ description }}</div>
							<div
								v-if="(propJobPart || (propInvoice && !['Approved','Paid'].includes(propInvoice.status)))"
								class="flex items-center align-middle sticky right-0 bg-white shadow-md"
							>
								<div class="px-2 flex-col">
									<AppInput
										v-model="form.items[0].dispute"
										:disabled="(propInvoice && propInvoice.items[0].approved && propInvoice.status !== 'Draft') || (propInvoice && waitingForPracticeReply(propInvoice.items[0]) && propInvoice.status !== 'Draft')"
										:type="'single-checkbox'"
										:name="'disputed'"
										:label="'Disputed'"
									/>
									<AppInput
										v-if="propInvoice && propInvoice.status !== 'Draft'"
										v-model="propInvoice.items[0].approved"
										disabled
										:type="'single-checkbox'"
										:name="'approved'"
										:label="'Approved'"
									/>
									<div
										v-if="(propInvoice && waitingForPracticeReply(propInvoice.items[0])) && propInvoice.status !== 'Draft'"
									>
										<div>Waiting for Practice Reply</div>
									</div>
								</div>
							</div>
						</div>

						<div
							v-if="(form.items[0].dispute && propJobPart) || (form.items[0].dispute && propInvoice && !['Approved', 'Paid'].includes(propInvoice.items[0].status)) || (propInvoice && propInvoice.items[0].approved === false && propInvoice.items[0].status === 'Approved')"
							class="flex flex-col justify-start mt-2 px-2"
						>
							<div class="flex">
								<div class="w-1/5 flex flex-col px-2">
									<label class="text-xs sm:text-sm" for="absent_days">Days of absent</label>
									<input
										v-model="form.items[0].absent_days"
										type="number"
										min="0"
										name="absent_days"
										class="border-b-2 focus:outline-none h-full p-2 py-3 sm:text-sm text-right text-xs w-full focus:border-yellow-500"
										@keypress="isNumber($event)"
									/>
								</div>
								<div class="w-1/5 flex flex-col px-2">
									<label class="text-xs sm:text-sm" for="late_hours">Hours of late</label>
									<div class="flex">
										<div class="flex items-center mr-2">
											<input
												v-model="form.late_hours"
												type="number"
												min="0"
												maxlength="8"
												name="late_hours"
												class="border-b-2 focus:outline-none h-full p-2 py-3 sm:text-sm text-right text-xs focus:border-yellow-500"
												:class="formError.find(item => item.field === 'late_hours') && formError.find(item => item.field === 'minutes') ? 'border-red-500' : ''"
												@keydown="inputNumberOnly($event), handleKeyDownEvent($event, 'late_hours', 8)"
												@blur="!form.late_hours ? form.late_hours = 0 : form.late_hours"
											/>
											<label for="late_hours" class="text-xs md:text-sm">hours</label>
										</div>
										<div class="flex items-center">
											<input
												v-model="form.late_minutes"
												type="number"
												min="0"
												name="late_minutes"
												class="border-b-2 focus:outline-none h-full p-2 py-3 sm:text-sm text-right text-xs focus:border-yellow-500"
												maxlength="2"
												max="60"
												:class="formError.find(item => item.field === 'hours') && formError.find(item => item.field === 'late_minutes') ? 'border-red-500' : ''"
												@keydown="inputNumberOnly($event), handleKeyDownEvent($event, 'late_minutes', 2)"
												@blur="!form.late_minutes ? form.late_minutes = 0 : form.late_minutes"
											/>
											<label for="late_minutes" class="text-xs md:text-sm">minutes</label>
										</div>
									</div>
								</div>
							</div>
							<div class="w-3/5 flex flex-col px-2 pt-2">
								<label class="text-xs sm:text-sm" for="final_hours">Final hours</label>
								<div class="flex">
									<div class="flex items-center mr-2">
										<input
											v-model="form.hours"
											type="number"
											min="0"
											maxlength="8"
											name="hours"
											class="border-b-2 focus:outline-none h-full p-2 py-3 sm:text-sm text-right text-xs focus:border-yellow-500"
											:class="formError.find(item => item.field === 'hours') && formError.find(item => item.field === 'minutes') ? 'border-red-500' : ''"
											@keydown="inputNumberOnly($event), handleKeyDownEvent($event, 'hours', 8)"
											@blur="!form.hours ? form.hours = 0 : form.hours"
										/>
										<label for="hours" class="text-xs md:text-sm">hours</label>
									</div>
									<div class="flex items-center">
										<input
											v-model="form.minutes"
											type="number"
											min="0"
											name="minutes"
											class="border-b-2 focus:outline-none h-full p-2 py-3 sm:text-sm text-right text-xs focus:border-yellow-500"
											maxlength="2"
											max="60"
											:class="formError.find(item => item.field === 'hours') && formError.find(item => item.field === 'minutes') ? 'border-red-500' : ''"
											@keydown="inputNumberOnly($event), handleKeyDownEvent($event, 'minutes', 2)"
											@blur="!form.minutes ? form.minutes = 0 : form.minutes"
										/>
										<label for="minutes" class="text-xs md:text-sm">minutes</label>
									</div>
								</div>
								<p
									v-if="formError.find(item => item.field === 'hours') && formError.find(item => item.field === 'minutes')"
									class="text-xs mx-2 text-red-500"
								>Final hours is required</p>
							</div>
						</div>

						<div
							v-if="(form.items[0].dispute && propJobPart) 
                || (form.items[0].dispute && propInvoice && !['Approved', 'Paid'].includes(propInvoice.items[0].status)) 
                || (propInvoice && propInvoice.items[0].approved === false && propInvoice.items[0].status === 'Approved')
                || (propInvoice && propInvoice.items[0].approved === true && propInvoice.items[0].remarks.length > 0)"
							class="flex justify-start mt-2 px-2"
						>
							<div class="flex flex-col w-full px-2">
								<label class="text-xs sm:text-sm" for="remarks">Update remarks</label>
								<textarea
									v-model="form.items[0].remarks"
									rows="3"
									name="remarks"
									class="w-full text-xs sm:text-sm resize-none border-b-2 border-gray-300 focus:border-yellow-500 focus:outline-none px-4 my-2"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- SUB TOTAL -->
			<div class="flex flex-col">
				<div
					v-if="propInvoice && propInvoice.ir35 && propInvoice.paid"
					:ref="'items-sub-total'"
					class="flex justify-between md:m-2 text-lg px-3 pt-3"
				>
					<span class="w-3/4 font-bold">Subtotal</span>
					<div class="w-1/4 flex justify-between">
						<div class="w-full text-right">£</div>
						<div class="w-full text-right">{{ subTotal | currency }}</div>
					</div>
				</div>
				<div
					v-if="propInvoice && propInvoice.ir35 && propInvoice.paid"
					:ref="'items-ni-total'"
					class="flex justify-between md:mx-2 text-lg px-3"
				>
					<span class="w-3/4 pl-2 text-sm">NI amount</span>
					<div class="w-1/4 flex justify-between">
						<div class="w-full text-right text-sm">£</div>
						<div class="w-full text-right text-sm">{{ propInvoice.ni_amount | currency }}</div>
					</div>
				</div>
				<div
					v-if="propInvoice && propInvoice.ir35 && propInvoice.paid"
					:ref="'items-paye-total'"
					class="flex justify-between md:mx-2 text-lg px-3"
				>
					<span class="w-3/4 pl-2 text-sm">PAYE amount</span>
					<div class="w-1/4 flex justify-between">
						<div class="w-full text-right text-sm">£</div>
						<div class="w-full text-right text-sm">{{ propInvoice.paye_amount | currency }}</div>
					</div>
				</div>
				<!-- ITEMS TOTAL -->
				<div :ref="'items-total'" class="flex justify-between md:m-2 text-lg px-3 py-2">
					<span class="w-3/4 font-bold">Total</span>
					<div class="w-1/4 flex justify-between">
						<div class="w-full text-right">£</div>
						<div class="w-full text-right">{{ totalAmount | currency }}</div>
					</div>
				</div>
			</div>

			<!-- items days worked -->
			<div :ref="'days-worked'" class="flex flex-row flex-wrap justify-between px-2">
				<div class="w-full flex flex-row flex-wrap justify-between md:px-2">
					<div class="w-full md:w-1/2 md:pr-1">
						<AppDate
							v-model="form.date_start"
							disabled
							:name="'date_start'"
							:label="'Days worked from'"
							:error="formError.find(item => item.field === 'date_start')"
							@input="CheckEmptyField(form.date_start, 'date_start')"
						/>
					</div>
					<div class="w-full md:w-1/2 md:pl-1">
						<AppDate
							v-model="form.date_end"
							disabled
							:name="'date_end'"
							:label="'To'"
							:error="formError.find(item => item.field === 'date_end')"
							@input="CheckEmptyField(form.date_end, 'date_end')"
						/>
					</div>
				</div>
			</div>

			<!-- PDF FOOTER -->
			<div :ref="'pdf-footer'" class="rounded-lg border-2 border-gray-300 mt-4 p-4">
				<div
					v-if="propInvoice && propInvoice.paid_under_payroll"
					class="flex flex-col text-xs sm:text-sm"
				>
					<div>Payment by BACS: xxxxx</div>
					<div>Account name: {{ propInvoice.payroll_account_name ? propInvoice.payroll_account_name : 'xxxxx' }}</div>
					<div>Bank: {{ propInvoice.payroll_bank_name ? propInvoice.payroll_bank_name : 'xxxxx' }}</div>
					<div>Sort code: {{ propInvoice.payroll_sort_code ? propInvoice.payroll_sort_code : 'xxxxx' }}</div>
					<div>Account number: {{ propInvoice.payroll_account_number ? propInvoice.payroll_account_number : 'xxxxx*OR' }}</div>
				</div>
				<div
					v-if="propInvoice && !propInvoice.paid_under_payroll"
					class="flex flex-col text-xs sm:text-sm"
				>
					<div>Payment by BACS: xxxxx</div>
					<div>Account name: {{ propInvoice.account_name ? propInvoice.account_name : 'xxxxx' }}</div>
					<div>Bank: {{ propInvoice.bank_name ? propInvoice.bank_name : 'xxxxx' }}</div>
					<div>Sort code: {{ propInvoice.sort_code ? propInvoice.sort_code : 'xxxxx' }}</div>
					<div>Account number: {{ propInvoice.account_number ? propInvoice.account_number : 'xxxxx*OR' }}</div>
				</div>
				<div
					v-if="propJobPart && !propInvoice && propInvoiceDetail && propInvoiceDetail.paid_under_payroll"
					class="flex flex-col text-xs sm:text-sm"
				>
					<div>Payment by BACS: xxxxx</div>
					<div>Account name: {{ propInvoiceDetail.payroll_detail.account_name ? propInvoiceDetail.payroll_detail.account_name : 'xxxxx' }}</div>
					<div>Bank: {{ propInvoiceDetail.payroll_detail.bank_name ? propInvoiceDetail.payroll_detail.bank_name : 'xxxxx' }}</div>
					<div>Sort code: {{ propInvoiceDetail.payroll_detail.sort_code ? propInvoiceDetail.payroll_detail.sort_code : 'xxxxx' }}</div>
					<div>Account number: {{ propInvoiceDetail.payroll_detail.account_number ? propInvoiceDetail.payroll_detail.account_number : 'xxxxx*OR' }}</div>
				</div>
				<div
					v-if="propJobPart && !propInvoice && propInvoiceDetail && !propInvoiceDetail.paid_under_payroll"
					class="flex flex-col text-xs sm:text-sm"
				>
					<div>Payment by BACS: xxxxx</div>
					<div>Account name: {{ propInvoiceDetail.bank_account.account_name ? propInvoiceDetail.bank_account.account_name : 'xxxxx' }}</div>
					<div>Bank: {{ propInvoiceDetail.bank_account.bank_name ? propInvoiceDetail.bank_account.bank_name : 'xxxxx' }}</div>
					<div>Sort code: {{ propInvoiceDetail.bank_account.sort_code ? propInvoiceDetail.bank_account.sort_code : 'xxxxx' }}</div>
					<div>Account number: {{ propInvoiceDetail.bank_account.account_number ? propInvoiceDetail.bank_account.account_number : 'xxxxx*OR' }}</div>
				</div>
			</div>
		</div>

		<div>
			<!-- save buttons -->
			<div class="flex flex-wrap items-center mb-6">
				<AppButton
					v-if="propJobPart || (propInvoice && !['Approved','Paid'].includes(propInvoice.status))"
					class="m-1"
					:label="`${propJobPart && !propInvoice ? 'Save as draft' : !propJobPart && propInvoice ? 'Save changes' : ''}`"
					:inStyle="'padding:5px 14px;font-size:1em'"
					:disabled="saveLoading || !sched_has_changes"
					@click="save(false)"
				/>

				<AppButton
					v-if="propJobPart || (propInvoice && propInvoice.issued === false)"
					class="m-1"
					:label="'Save as final'"
					:inStyle="'padding:5px 14px;font-size:1em'"
					:disabled="saveLoading"
					@click="save(true)"
				/>

				<AppButton
					v-if="propInvoice && !propJobPart && propInvoice.status !== 'Draft'"
					class="m-1"
					:label="'View as PDF'"
					:inStyle="'padding:5px 14px;font-size:1em'"
					@click="viewAsPdf(propInvoice.id)"
				/>
			</div>
		</div>
	</section>
</template>

<script>
import AppInput from "@/components/Base/AppInput";
import AppButton from "@/components/Base/AppButton";
import AppLoading from "@/components/Base/AppLoading";
import AppDate from "@/components/Base/AppDate";
import AppSchedules from "@/components/Base/AppSchedules";

export default {
	components: {
		AppInput,
		AppButton,
		AppLoading,
		AppDate,
		AppSchedules
	},

	props: {
		propInvoiceDetail: {
			type: Object,
			default: () => null
		},
		propInvoice: {
			type: Object,
			default: () => null
		},
		propJobPart: {
			type: Object,
			default: () => null
		}
	},

	data() {
		return {
			old: false,
			exportLoading: false,
			saveLoading: false,
			form: {
				date_start: null,
				date_end: null,
				items: [],
				total_amount: 0,
				final: false,
				ir35: false,
				// minutes: 0,
				// hours: 0,
				// late_hours: 0,
				// late_minutes: 0,
				job_part_schedule_items: []
			},
			formError: [],
			disputed: false,
			shiftErrors: [],
			schedule: [],
			total_working_hours: 0,
			total_gross_locum_wages: 0,
			total_deductions: 0,
			total_late_hours: "",
			total_absences: 0,
			hasShiftError: false,
			sched_has_changes: false
		};
	},

	computed: {
		subTotal() {
			if (this.propJobPart && !this.propInvoice) {
				let type = this.propJobPart.job.locum_detail_rate_type.name;

				let finalHours =
					(parseInt(this.form.hours) * 60 + parseInt(this.form.minutes)) / 60;

				let totalHours = this.propJobPart.job.total_hours / 60;

				let total = 0;

				switch (type) {
					case "Per Hour":
						total = finalHours * this.propJobPart.job.rate;
						break;
					default:
						total = finalHours * (this.propJobPart.job.rate / totalHours);
						break;
				}

				return total;
			}

			if (this.propInvoice && !this.propJobPart) {
				let type = this.propInvoice.items[0].job_part.job.locum_detail_rate_type
					.name;

				let finalHours =
					(parseInt(this.form.hours) * 60 + parseInt(this.form.minutes)) / 60;

				let totalHours =
					this.propInvoice.items[0].job_part.job.total_hours / 60;

				let total = 0;

				switch (type) {
					case "Per Hour":
						total = finalHours * this.propInvoice.items[0].job_part.job.rate;
						break;
					default:
						total =
							finalHours *
							(this.propInvoice.items[0].job_part.job.rate / totalHours);
						break;
				}

				return total;
			}

			return 0;
		},

		totalAmount() {
			if (this.propJobPart && !this.propInvoice) {
				let type = this.propJobPart.job.locum_detail_rate_type.name;

				let finalHours =
					(parseInt(this.form.hours) * 60 + parseInt(this.form.minutes)) / 60;

				let totalHours = this.propJobPart.job.total_hours / 60;

				let total = 0;

				switch (type) {
					case "Per Hour":
						total = finalHours * this.propJobPart.job.rate;
						break;
					default:
						total = finalHours * (this.propJobPart.job.rate / totalHours);
						break;
				}

				return total;
			}

			// Job Part Total Rate (Per Hour) = (Final Hours + (Final Minutes / 60)) * Rate
			// Job Part Total Rate (Per Session) = (Final Hours + (Final Minutes / 60)) * (Rate / (Total Hours + (Total Minutes / 60)))

			if (this.propInvoice && !this.propJobPart) {
				let type = this.propInvoice.items[0].job_part.job.locum_detail_rate_type
					.name;

				let finalHours =
					(parseInt(this.form.hours) * 60 + parseInt(this.form.minutes)) / 60;

				let totalHours =
					this.propInvoice.items[0].job_part.job.total_hours / 60;

				let total = 0;

				switch (type) {
					case "Per Hour":
						total = finalHours * this.propInvoice.items[0].job_part.job.rate;
						break;
					default:
						total =
							finalHours *
							(this.propInvoice.items[0].job_part.job.rate / totalHours);
						break;
				}

				if (this.propInvoice) {
					total =
						total - this.propInvoice.ni_amount - this.propInvoice.paye_amount;
				}

				return total;
			}

			return 0;
		},

		description() {
			if (this.propJobPart && !this.propInvoice) {
				const jobPartNumber = this.propJobPart.job_part_number;
				const jobType = this.propJobPart.job.type;
				const jobRate = this.propJobPart.job.rate;
				const jobRateTypeName = this.propJobPart.job.locum_detail_rate_type
					.name;
				const formattedDateStart = this.$moment(
					this.propJobPart.date_start
				).format("DD/MM/YYYY");
				const formattedDateEnd = this.$moment(this.propJobPart.date_end).format(
					"DD/MM/YYYY"
				);
				const shiftName = this.propJobPart.job.shift.name;
				const finalHoursInMinutesHours = parseInt(this.form.hours);
				const hourOrHours = finalHoursInMinutesHours > 1 ? "s" : "";
				const finalHoursInMinutesMinutes = parseInt(this.form.minutes);
				const minuteOrMinutes = finalHoursInMinutesMinutes > 1 ? "s" : "";
				const hasMinutes =
					finalHoursInMinutesMinutes > 0
						? ` and ${finalHoursInMinutesMinutes} minute${minuteOrMinutes}`
						: "";
				const description =
					`Job number ${jobPartNumber} ${jobType} Job at £${jobRate} ${jobRateTypeName}` +
					` from ${formattedDateStart} to ${formattedDateEnd} / ${shiftName} /` +
					` Total of ${finalHoursInMinutesHours} hour${hourOrHours}${hasMinutes}`;

				return description;
			}

			if (this.propInvoice && !this.propJobPart) {
				const jobPartNumber = this.propInvoice.items[0].job_part
					.job_part_number;
				const jobType = this.propInvoice.items[0].job_part.job.type;
				const jobRate = this.propInvoice.items[0].job_part.job.rate;
				const jobRateTypeName = this.propInvoice.items[0].job_part.job
					.locum_detail_rate_type.name;
				const formattedDateStart = this.$moment(
					this.propInvoice.date_start
				).format("DD/MM/YYYY");
				const formattedDateEnd = this.$moment(this.propInvoice.date_end).format(
					"DD/MM/YYYY"
				);
				const shiftName = this.propInvoice.items[0].job_part.job.shift.name;
				const finalHoursInMinutesHours = parseInt(this.form.hours);
				const hourOrHours = finalHoursInMinutesHours > 1 ? "s" : "";
				const finalHoursInMinutesMinutes = parseInt(this.form.minutes);
				const minuteOrMinutes = finalHoursInMinutesMinutes > 1 ? "s" : "";
				const hasMinutes =
					finalHoursInMinutesMinutes > 0
						? ` and ${finalHoursInMinutesMinutes} minute${minuteOrMinutes}`
						: "";
				const description =
					`Job number ${jobPartNumber} ${jobType} Job at £${jobRate} ${jobRateTypeName}` +
					` from ${formattedDateStart} to ${formattedDateEnd} / ${shiftName} /` +
					` Total of ${finalHoursInMinutesHours} hour${hourOrHours}${hasMinutes}`;

				return description;
			}

			return "";
		},

		job_part() {
			let jobPartNumber;
			let jobType;
			let jobRate;
			let jobRateTypeName;
			let formattedDateStart;
			let formattedDateEnd;
			if (this.propJobPart && !this.propInvoice) {
				jobPartNumber = this.propJobPart.job_part_number;
				jobType = this.propJobPart.job.type;
				jobRate = this.propJobPart.job.rate;
				jobRateTypeName = this.propJobPart.job.locum_detail_rate_type.name;
				formattedDateStart = this.$moment(this.propJobPart.date_start).format(
					"DD/MM/YYYY"
				);
				formattedDateEnd = this.$moment(this.propJobPart.date_end).format(
					"DD/MM/YYYY"
				);
			}
			if (this.propInvoice && !this.propJobPart) {
				jobPartNumber = this.propInvoice.items[0].job_part.job_part_number;
				jobType = this.propInvoice.items[0].job_part.job.type;
				jobRate = this.propInvoice.items[0].job_part.job.rate;
				jobRateTypeName = this.propInvoice.items[0].job_part.job
					.locum_detail_rate_type.name;
				formattedDateStart = this.$moment(this.propInvoice.date_start).format(
					"DD/MM/YYYY"
				);
				formattedDateEnd = this.$moment(this.propInvoice.date_end).format(
					"DD/MM/YYYY"
				);
			}
			return {
				job_part_number: jobPartNumber,
				type: jobType,
				rate: jobRate,
				locum_detail_rate_type: jobRateTypeName,
				date_start: formattedDateStart,
				date_end: formattedDateEnd
			};
		},

		practice_rate() {
			let practice_rate = this.propJobPart ? this.propJobPart.practice_rate : 0;
			let rate = 0;
			if (practice_rate) {
				rate = practice_rate.rate;
			} else {
				rate = 0;
				// practice_rates[practice_rates.length - 1].rate
			}
			return rate;
		},

		// subTotal () {
		//   return this.form.items && this.form.items.length > 0
		//     ? this.form.items[0].total
		//     : 0
		// },

		// totalAmount () {
		//   if (this.form.items && this.form.items.length > 0) {
		//     let total = this.form.items[0].total

		//     if (this.propInvoice) {
		//       total =
		//         total - this.propInvoice.ni_amount - this.propInvoice.paye_amount
		//     }

		//     return total
		//   }

		//   return 0
		// }

		dispute() {
			return (
				this.form &&
				this.form.items &&
				this.form.items.length > 0 &&
				this.form.items[0].dispute
			);
		}
	},

	watch: {
		dispute() {
			if (!this.dispute) {
				this.setInitialState();
				this.form.items[0].dispute = false;
			}
		}
	},

	mounted() {
		this.setInitialState();
	},

	methods: {
		getSchedule(
			schedule,
			total_gross_locum_wages,
			total_working_hours,
			deductions,
			total_lates,
			hasError,
			hasChanges
		) {
			this.schedule = schedule;
			this.form.job_part_schedule_items = [];
			let absentCount = 0;
			schedule.forEach((sched, index) => {
				if (sched.shifts && sched.shifts.length) {
					sched.shifts.forEach((shift, i) => {
						let timeStart = shift.has_absences
							? shift.time_start
							: shift.final_time_start;
						let timeEnd = shift.has_absences
							? shift.time_start
							: shift.final_time_end;
						this.form.job_part_schedule_items.push({
							id: shift.id,
							time_start: timeStart,
							time_end: timeEnd,
							total: shift.total,
							dispute: shift.dispute,
							remarks: shift.remarks,
							late_hours_reason: "",
							description: ""
						});
						shift.has_absences ? (absentCount += 1) : "";

						// if (shift.final_time_start !== "") {
						// 	let startIndex = this.shiftErrors.findIndex(
						// 		err => err.field === `final_time_start-s${index}-${i}`
						// 	);
						// 	if (startIndex > -1) {
						// 		this.shiftErrors.splice(startIndex, 1);
						// 	}
						// }
						// if (shift.final_time_end !== "") {
						// 	let endIndex = this.shiftErrors.findIndex(
						// 		err => err.field === `final_time_end-s${index}-${i}`
						// 	);
						// 	if (endIndex > -1) {
						// 		this.shiftErrors.splice(endIndex, 1);
						// 	}
						// }
					});
				}
			});
			this.total_late_hours = total_lates;
			this.total_absences = absentCount;
			this.total_deductions = deductions;
			this.total_working_hours = total_working_hours;
			this.total_gross_locum_wages = total_gross_locum_wages;
			this.form.total_amount = total_gross_locum_wages;
			this.hasShiftError = hasError;
			this.sched_has_changes = hasChanges;
		},
		setInitialState() {
			if (this.propJobPart && !this.propInvoice) {
				this.form.type = this.propJobPart.job.type;
				this.form.practice_id = this.propJobPart.job.practice_id;
				this.form.date_start = this.propJobPart.date_start;
				this.form.date_end = this.propJobPart.date_end;
				this.form.job_part_schedule_items = this.propJobPart.schedules;
				// Job Part Total Rate (Per Hour) = (Final Hours + (Final Minutes / 60)) * Rate
				// Job Part Total Rate (Per Session) = (Final Hours + (Final Minutes / 60)) * (Rate / (Total Hours + (Total Minutes / 60)))

				let type = this.propJobPart.job.locum_detail_rate_type.name;

				let finalHours = this.propJobPart.final_hours / 60;

				let totalHours = this.propJobPart.job.total_hours / 60;

				let total = 0;

				switch (type) {
					case "Per Hour":
						total = finalHours * this.propJobPart.job.rate;
						break;
					default:
						total = finalHours * (this.propJobPart.job.rate / totalHours);
						break;
				}

				const jobPartNumber = this.propJobPart.job_part_number;
				const jobType = this.propJobPart.job.type;
				const jobRate = this.propJobPart.job.rate;
				const jobRateTypeName = this.propJobPart.job.locum_detail_rate_type
					.name;
				const formattedDateStart = this.$moment(
					this.propJobPart.date_start
				).format("DD/MM/YYYY");
				const formattedDateEnd = this.$moment(this.propJobPart.date_end).format(
					"DD/MM/YYYY"
				);
				const shiftName = this.propJobPart.job.shift.name;
				const finalHoursInMinutesHours = Math.floor(
					this.propJobPart.final_hours / 60
				);
				const hourOrHours = finalHoursInMinutesHours > 1 ? "s" : "";
				const finalHoursInMinutesMinutes = Math.floor(
					this.propJobPart.final_hours % 60
				);
				const minuteOrMinutes = finalHoursInMinutesMinutes > 1 ? "s" : "";
				const hasMinutes =
					finalHoursInMinutesMinutes > 0
						? ` and ${finalHoursInMinutesMinutes} minute${minuteOrMinutes}`
						: "";
				const description =
					`Job number ${jobPartNumber} ${jobType} Job at £${jobRate} ${jobRateTypeName}` +
					` from ${formattedDateStart} to ${formattedDateEnd} / ${shiftName} /` +
					` Total of ${finalHoursInMinutesHours} hour${hourOrHours}${hasMinutes}`;

				this.form.items = [
					{
						type: "Job Part",
						job_part_id: this.propJobPart.id,
						description,
						total: total,
						dispute: this.propJobPart.disputed,
						absent_days: this.propJobPart.absent_days,
						final_hours: this.propJobPart.final_hours.toFixed(2),
						late_hours: this.propJobPart.late_hours,
						remarks: ""
					}
				];

				this.form.total_amount = total;
				this.form.final = false;
				this.form.ir35 = this.propJobPart.job_ir35;
			}

			if (this.propInvoice && !this.propJobPart) {
				this.form.locum_invoice_id = this.propInvoice.id;
				this.form.date_start = this.propInvoice.date_start;
				this.form.date_end = this.propInvoice.date_end;
				this.form.job_part_schedule_items = this.propInvoice.job_part_schedule_items;

				this.form.items = [
					{
						type: "Job Part",
						job_part_id: this.propInvoice.items[0].job_part.id,
						description: this.propInvoice.items[0].description,
						total: this.propInvoice.items[0].total,

						dispute: this.propInvoice.items[0].disputed,
						absent_days: this.propInvoice.items[0].absent_days,
						final_hours: this.propInvoice.items[0].final_hours,
						late_hours: this.propInvoice.items[0].late_hours,
						remarks: this.propInvoice.items[0].remarks
					}
				];

				this.form.total_amount = this.propInvoice.total_amount;
				this.form.final = false;
				this.form.ir35 = this.propInvoice.ir35;
			}

			this.form.hours = Math.floor(this.form.items[0].final_hours / 60);
			this.form.minutes = Math.floor(this.form.items[0].final_hours % 60);
			this.form.late_hours = Math.floor(this.form.items[0].late_hours / 60);
			this.form.late_minutes = Math.floor(this.form.items[0].late_hours % 60);
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

		hasValue(value, field) {
			if (value == 0) {
				this.form[field] = "";
			}
		},

		save(final) {
			this.formError = [];
			this.shiftErrors = [];

			if (this.schedule.length) {
				this.schedule.forEach((sched, index) => {
					sched.shifts.forEach((shift, i) => {
						if (!shift.has_absences) {
							if (!shift.final_time_start) {
								this.shiftErrors.push({
									field: `final_time_start-s${index}-${i}`,
									message: "Final Start is required"
								});
							}
							if (!shift.final_time_end) {
								this.shiftErrors.push({
									field: `final_time_end-s${index}-${i}`,
									message: "Final End is required"
								});
							}
						}
					});
				});
			}

			this.Validate(this.form, [
				"final",
				"ir35",
				"total_amount",
				"hours",
				"minutes",
				"late_hours",
				"late_minutes"
			]);

			if (!this.formError.length && !this.shiftErrors.length) {
				this.saveLoading = true;

				if (this.propJobPart && !this.propInvoice) {
					this.form.total_amount = this.total_gross_locum_wages;

					this.form.final = final;

					this.$axios
						.$post(`/api/v1/locum/locum-invoices`, this.form)
						.then(res => {
							this.$store.commit("SET_NOTIFICATION", {
								enabled: true,
								status: "success",
								text: [`${res.message}`]
							});

							this.$emit("createInvoice", res.data.locum_invoice);
						})
						.catch(err => {
							console.log("err", err.response || err);

							if (err.response.data.message) {
								this.$store.commit("SET_NOTIFICATION", {
									enabled: true,
									status: "error",
									text: [`${err.response.data.message}`]
								});
							} else if (err.response.data.error_messages) {
								err.response.data.error_messages.forEach(error => {
									this.formError.push(error);
								});
							} else {
								this.formError.push(err.response.data);
							}

							throw err;
						})
						.finally(() => {
							this.saveLoading = false;
						});
				} else if (this.propInvoice && !this.propJobPart) {
					this.form.total_amount = this.total_gross_locum_wages;

					this.form.final = final;

					this.$axios
						.$put(
							`/api/v1/locum/locum-invoices/${this.$route.params.id}`,
							this.form
						)
						.then(res => {
							this.$store.commit("SET_NOTIFICATION", {
								enabled: true,
								status: "success",
								text: [`${res.message}`]
							});

							this.$emit("updateInvoice", res.data.locum_invoice);
						})
						.catch(err => {
							console.log("err", err.response || err);

							if (err.response.data.message) {
								this.$store.commit("SET_NOTIFICATION", {
									enabled: true,
									status: "success",
									text: [`${err.response.data.message}`]
								});
							} else if (err.response.data.error_messages) {
								err.response.data.error_messages.forEach(error => {
									this.formError.push(error);
								});
							} else {
								this.formError.push(err.response.data);
							}

							throw err;
						})
						.finally(() => {
							this.saveLoading = false;
						});
				}
			} else {
				console.log(this.formError);
			}
		},

		waitingForPracticeReply(item) {
			return (
				!item.disputed_by_practice_at ||
				this.$moment(item.disputed_by_practice_at).diff(
					item.disputed_by_locum_at,
					"seconds"
				) < 0
			);
		},

		viewAsPdf(invoiceId) {
			window.open(
				`${process.env.API_URL}/api/v1/locum-invoices/${invoiceId}/pdf`
			);
		}
	}
};
</script>

<style scoped>
/* .items-table { */
/* width: 733px; */
/* } */
.bg-gray {
	background-color: #707070;
}
</style>