<template>
  <section class="relative">
    <AppLoading :loading="!propInvoice && !propJobPart" spinner :message="'Loading'" />

    <template v-if="propInvoice || propJobPart">
      <div class="flex flex-col justify-start items-start border rounded-lg py-8 px-6 mb-4">
        <AppLoading :loading="exportLoading" spinner :message="'Exporting'" />

        <AppLoading :loading="saveLoading" spinner />

        <div :ref="'pdf-header'" class="flex justify-between w-full px-2">
          <div v-if="propInvoice" class="flex flex-wrap justify-between w-1/2">
            <div class="w-full sm:w-1/2 order-2 sm:order-1 text-xs sm:text-sm text-left rounded-lg border-2 border-gray-300 p-2 w-2/3">
              <section>
                <div class="relative flex flex-col py-2">
                  <div class="relative flex flex-row flex-no-wrap justify-between">
                    <label class="text-base py-1">To: Accounts Department</label>
                  </div>

                  <div class="font-bold text-lg mt-2">
                    {{ propInvoice.practice.name }}
                  </div>
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
            <div class="w-full sm:w-1/2 order-2 sm:order-1 text-xs sm:text-sm text-left rounded-lg border-2 border-gray-300 p-2 w-2/3">
              <section>
                <div class="relative flex flex-col py-2">
                  <div class="relative flex flex-row flex-no-wrap justify-between">
                    <label class="text-base py-1">To: Accounts Department</label>
                  </div>

                  <div class="font-bold text-lg mt-2">
                    {{ propJobPart.practice_name }}
                  </div>
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

          <div class="w-1/2 text-xs sm:text-sm text-right leading-normal">
            <div>{{ $auth.user.personal_detail.name }}</div>
            <div>{{ $auth.user.address_detail.address.line_1 }}</div>
            <div>{{ $auth.user.address_detail.address.line_2 }}</div>
            <div>{{ $auth.user.address_detail.address.line_3 }}</div>
            <div>{{ $auth.user.address_detail.address.post_code }}</div>
            <div v-if="$auth.user.contact_detail.mobile_number">
              Tel {{ $auth.user.contact_detail.mobile_number }}
            </div>
            <div>{{ $auth.user.email }}</div>

            <template v-if="propJobPart">
              <div>
                {{ 
                  $auth.user.locum_detail.invoice_detail 
                    && $auth.user.locum_detail.invoice_detail.utr_number 
                    && $auth.user.locum_detail.invoice_detail.employment_type === 'Self-Employed' 
                    ? `UTR ${$auth.user.locum_detail.invoice_detail.utr_number}` 
                    : null 
                }}
              </div>
              
              <div>
                {{ 
                  $auth.user.locum_detail.invoice_detail 
                    && $auth.user.locum_detail.invoice_detail.company_registration_number 
                    && $auth.user.locum_detail.invoice_detail.employment_type === 'Limited Company' 
                    ? `Company Registration Number ${$auth.user.locum_detail.invoice_detail.company_registration_number}` 
                    : null 
                }}
              </div>
            </template>

            <template v-if="propInvoice">
              <div>
                {{ 
                  propInvoice.utr_number && propInvoice.employment_type === 'Self-Employed' 
                    ? `UTR ${propInvoice.utr_number}` 
                    : null 
                }}
              </div>
              
              <div>
                {{ 
                  propInvoice.company_registration_number && propInvoice.employment_type === 'Limited Company' 
                    ? `Company Registration Number ${propInvoice.company_registration_number}` 
                    : null 
                }}
              </div>
            </template>

            <div>{{ $auth.user.vat_registered && $auth.user.vat_number ? `VAT Number: ${$auth.user.vat_number}` : '' }}</div>
            <div v-if="propInvoice">
              <span>Invoice Number:</span>
              <span>{{ propInvoice.invoice_number }}</span>
            </div>
          </div>
        </div>

        <div
          v-if="propInvoice && propInvoice.last_disputed_by === 'Locum' && propInvoice.issued && !propInvoice.approved"
          class="w-full bg-orange-400 mt-4 py-1 text-center rounded font-bold mx-2 uppercase text-gray-700"
        >
          DISPUTED - Awaiting Practice Reply
        </div>

        <div
          v-if="propInvoice && propInvoice.last_disputed_by === 'Practice' && propInvoice.issued && !propInvoice.approved"
          class="w-full bg-orange-400 mt-4 py-1 text-center rounded font-bold mx-2 uppercase text-gray-700"
        >
          DISPUTED
        </div>

        <p class="w-full bg-gray my-4 py-1 text-center text-white rounded font-bold mx-2">
          INVOICE DETAILS
        </p>

        <div class="w-full flex flex-wrap justify-between px-4 text-gray-600">
          <div class="p-2 flex items-center">
            <p>Job No.</p>

            <p class="mx-2 border border-gray-600 rounded px-4 text-gray-700">
              {{ job_part.job_part_number }}
            </p>
          </div>

          <div class="p-2 flex items-center">
            <p>Job Type</p>
            <p class="mx-2 border border-gray-600 rounded px-4 text-gray-700">
              {{ job_part.type }}
            </p>
          </div>

          <div class="p-2 flex items-center">
            <p>Duration</p>
            
            <p class="mx-2 border border-gray-600 rounded px-4 text-gray-700">
              {{ job_part.date_start }}
              <span class="text-gray-600">to</span>
              {{ job_part.date_end }}
            </p>
          </div>

          <div class="p-2 flex items-center">
            <p>Total Work Hours</p>
            <p v-if="total_working_hours > 0" class="mx-2 border border-gray-600 rounded px-4 text-gray-700">
              {{ total_working_hours | hoursMinutes }}
            </p>

            <p v-else class="mx-2 border border-gray-600 rounded px-4 text-gray-700">
              0
            </p>
          </div>
        </div>

        <div class="w-full border-b">
          <AppSchedules
            v-if="!taxRatesLoading"
            :practice_rate="practice_rate"
            :schedule="propJobPart? propJobPart.schedules : propInvoice.job_part_schedule_items"
            :error="formError.find(err => err.field === 'schedules')"
            :shiftErrors="shiftErrors"
            toInvoice
            :invoiceDetails="propInvoice"
            :toDisplay="propInvoice && propInvoice.issued && (propInvoice.approved || propInvoice.last_disputed_by === 'Locum' || !propInvoice.disputed_items_count)"
            :type="'invoice'"
            :invoiceStatus="$route.query.status"
            :tax_rates="tax_rates"
            :locum_vat_registered="locum_vat_registered"
            @getSchedule="getSchedule"
          />
        </div>

        <div class="w-full flex flex-wrap justify-between py-4">
          <div class="flex flex-col w-full sm:w-1/2 px-2">
            <div class="flex flex-wrap justify-between">
              <p class="text-sm w-1/2">
                TOTAL LATES:
              </p>

              <p class="font-bold w-1/2 text-right">
                {{ total_late_hours === '00:00' ? 'None' : total_late_hours }}
              </p>
            </div>

            <div class="flex flex-wrap justify-between">
              <p class="text-sm w-1/2">
                TOTAL ABSENCES:
              </p>

              <p class="font-bold w-1/2 text-right">
                {{ total_absences > 0 ? total_absences : 'None' }}
              </p>
            </div>

            <div class="flex flex-wrap justify-between">
              <p class="text-sm w-1/2">
                TOTAL WORK HOURS:
              </p>

              <p v-if="total_working_hours > 0" class="font-bold w-1/2 text-right">
                {{ total_working_hours | hoursMinutes }}
              </p>

              <p v-else class="font-bold w-1/2 text-right">
                0
              </p>
            </div>

            <div class="flex flex-wrap justify-between">
              <p class="text-sm w-1/2">
                TOTAL DEDUCTIONS:
              </p>

              <p class="font-bold w-1/2 text-right">
                £ {{ total_deductions | currency }}
              </p>
            </div>

            <div class="flex flex-wrap justify-between">
              <p class="text-sm w-1/2">
                FORM TYPE:
              </p>

              <p class="font-bold w-1/2 text-right">
                {{ isOOH ? 'Solo Form' : 'Form A' }}
              </p>
            </div>

            <div class="flex flex-wrap justify-between">
              <p class="text-sm w-1/2">
                STATUS:
              </p>

              <p class="font-bold w-1/2 text-right">
                {{ propInvoice && propInvoice.status || propJobPart && 'To be invoiced' }}
              </p>
            </div>

            <div
              class="flex flex-wrap justify-between"
            >
              <p class="text-sm w-1/2">
                GENERATE FORM:
              </p>

              <p class="font-bold w-1/2 text-right">
                {{ (propInvoice && (propInvoice.ooh || propInvoice.generate_form)) || form.generate_form ? 'Yes' : 'No' }}
              </p>
            </div>
          </div>

          <div class="flex flex-col w-full sm:w-1/2 px-2 pt-5 sm:pt-0">
            <div class="flex flex-wrap justify-between">
              <p class="text-sm w-1/2">
                TOTAL WORK PAYMENT:
              </p>

              <p class="font-bold w-1/2 text-right">
                £ {{ total_gross_locum_wages | currency }}
              </p>
            </div>

            <div 
              v-if="(propInvoice && propInvoice.job_part_total_rate !== propInvoice.job_part_taxed_total_rate) || locum_vat_registered"
              class="flex flex-wrap justify-between"
            >
              <p class="text-sm w-1/2">
                TAX AMOUNT:
              </p>

              <p class="font-bold w-1/2 text-right">
                £ {{ tax_amount | currency }}
              </p>
            </div>

            <div 
              v-if="(propInvoice && propInvoice.job_part_total_rate !== propInvoice.job_part_taxed_total_rate) || locum_vat_registered"
              class="flex flex-wrap justify-between"
            >
              <p class="text-sm w-1/2">
                TAXED TOTAL WORK PAYMENT:
              </p>

              <p class="font-bold w-1/2 text-right">
                £ {{ taxed_gross_rate | currency }}
              </p>
            </div>

            <template v-if="propInvoice && propInvoice.approved">
              <div class="flex flex-wrap justify-between">
                <p class="text-sm w-1/2">
                  NI / PAYE:
                </p>

                <p class="font-bold w-1/2 text-right">
                  <span class="mr-5">-</span>
                  £ {{ ni_paye_amount | currency }}
                </p>
              </div>

              <div class="flex flex-wrap justify-between border-t-4 pt-2">
                <p class="text-sm w-1/2">
                  GRAND TOTAL:
                </p>

                <p class="font-bold w-1/2 text-right">
                  £ {{ grand_total | currency }}
                </p>
              </div>
            </template>

            <div
              v-if="(propInvoice && (propInvoice.ooh || propInvoice.generate_form)) || form.generate_form"
              class="flex flex-wrap justify-between mt-4 p-2 border border-gray-600 bg-gray-300"
            >
              <p class="text-sm w-1/2">
                PENSION AMOUNT:
              </p>

              <p class="font-bold w-1/2 text-right">
                £ {{ pension_amount | currency }}
              </p>
            </div>
          </div>
        </div>

        <div :ref="'pdf-footer'" class="flex w-full">
          <div class="w-1/2 mt-4">
            <div class="rounded-lg border-2 border-gray-300 mt-4 p-4 w-full sm:w-2/3 w-3/4">
              <div v-if="propInvoice && propInvoice.paid_under_payroll" class="flex flex-col text-xs sm:text-sm">
                <div>Payment by BACS: xxxxx</div>
                <div>Payroll company name: {{ propInvoice.payroll_account_name ? propInvoice.payroll_account_name : 'xxxxx' }}</div>
                <div>Bank: {{ propInvoice.payroll_bank_name ? propInvoice.payroll_bank_name : 'xxxxx' }}</div>
                <div>Sort code: {{ propInvoice.payroll_sort_code ? propInvoice.payroll_sort_code : 'xxxxx' }}</div>
                <div>Payroll bank account number: {{ propInvoice.payroll_account_number ? propInvoice.payroll_account_number : 'xxxxx*OR' }}</div>
                <div>Payroll reference number: {{ propInvoice.payroll_reference_number ? propInvoice.payroll_reference_number : 'xxxxx*OR' }}</div>
              </div>

              <div v-if="propInvoice && !propInvoice.paid_under_payroll" class="flex flex-col text-xs sm:text-sm">
                <div>Payment by BACS: xxxxx</div>
                <div>Account name: {{ propInvoice.account_name ? propInvoice.account_name : 'xxxxx' }}</div>
                <div>Bank: {{ propInvoice.bank_name ? propInvoice.bank_name : 'xxxxx' }}</div>
                <div>Sort code: {{ propInvoice.sort_code ? propInvoice.sort_code : 'xxxxx' }}</div>
                <div>Account number: {{ propInvoice.account_number ? propInvoice.account_number : 'xxxxx*OR' }}</div>
              </div>

              <div v-if="propJobPart && !propInvoice && propInvoiceDetail && propInvoiceDetail.paid_under_payroll" class="flex flex-col text-xs sm:text-sm">
                <div>Payment by BACS: xxxxx</div>
                <div>Payroll company name: {{ propInvoiceDetail.payroll_detail.account_name ? propInvoiceDetail.payroll_detail.account_name : 'xxxxx' }}</div>
                <div>Bank: {{ propInvoiceDetail.payroll_detail.bank_name ? propInvoiceDetail.payroll_detail.bank_name : 'xxxxx' }}</div>
                <div>Sort code: {{ propInvoiceDetail.payroll_detail.sort_code ? propInvoiceDetail.payroll_detail.sort_code : 'xxxxx' }}</div>
                <div>Payroll bank account number: {{ propInvoiceDetail.payroll_detail.account_number ? propInvoiceDetail.payroll_detail.account_number : 'xxxxx*OR' }}</div>
                <div>Payroll reference number: {{ propInvoiceDetail.payroll_detail.payroll_reference_number ? propInvoiceDetail.payroll_detail.payroll_reference_number : 'xxxxx*OR' }}</div>
              </div>

              <div v-if="propJobPart && !propInvoice && propInvoiceDetail && !propInvoiceDetail.paid_under_payroll" class="flex flex-col text-xs sm:text-sm">
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

    <div>
      <div v-if="propJobPart && !propInvoice && claimNhs && !isOOH" class="flex flex-wrap items-center mx-2">
        <AppInput
          v-model="form.generate_form"
          :type="'single-checkbox'"
          :name="'generate_form'"
          :label="'Generate form A?'"
        />
      </div>

      <div class="flex flex-wrap items-center mb-6">
        <AppButton
          v-if="
            propJobPart
              || (propInvoice && !propInvoice.approved && propInvoice.last_disputed_by === 'Practice')
              || (propInvoice && !propInvoice.issued)
          "
          class="m-1"
          :label="`${propJobPart && !propInvoice ? 'Save as draft' : !propJobPart && propInvoice ? 'Save changes' : ''}`"
          :inStyle="'padding:5px 14px;font-size:1em'"
          :disabled="saveLoading || !sched_has_changes || shiftErrors.length > 0"
          @click="save(false)"
        />

        <AppButton
          v-if="propJobPart || (propInvoice && !propInvoice.issued)"
          class="m-1"
          :label="'Save as final'"
          :inStyle="'padding:5px 14px;font-size:1em'"
          :disabled="saveLoading || shiftErrors.length > 0"
          @click="save(true)"
        />

        <AppButton
          v-if="propInvoice && !propJobPart && propInvoice.issued"
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
import AppInput from "@/components/Base/AppInput"
import AppButton from "@/components/Base/AppButton"
import AppLoading from "@/components/Base/AppLoading"
import AppSchedules from "@/components/Base/AppSchedules"

export default {
  components: {
    AppInput,
    AppButton,
    AppLoading,
    AppSchedules,
  },

  props: {
    propInvoiceDetail: {
      type: Object,
      default: () => null,
    },
    propInvoice: {
      type: Object,
      default: () => null,
    },
    propJobPart: {
      type: Object,
      default: () => null,
    },
    claimNhs: {
      type: Boolean,
      default: false,
    },
  },

  data () {
    return {
      old: false,
      exportLoading: false,
      saveLoading: false,
      form: {
        date_start: null,
        date_end: null,
        items: [],
        tax_amount: 0,
        total_amount: 0,
        final: false,
        ir35: false,
        generate_form: false,
        // minutes: 0,
        // hours: 0,
        // late_hours: 0,
        // late_minutes: 0,
        job_part_schedule_items: [],
      },
      formError: [],
      disputed: false,
      shiftErrors: [],
      schedule: [],
      total_working_hours: 0,
      total_gross_locum_wages: 0,
      tax_amount: 0,
      taxed_gross_rate: 0,
      total_deductions: 0,
      total_late_hours: "",
      total_absences: 0,
      hasShiftError: false,
      sched_has_changes: false,
      practice: null,

      taxRatesLoading: false,
      locum_vat_registered: false,
      tax_rates: {},
    }
  },

  computed: {
    isOOH () {
      return this.propInvoice && this.propInvoice.ooh
        ? true
        : this.propJobPart && this.propJobPart.ooh
          ? true
          : false
    },

    ni_paye_amount () {
      let ni_amount
        = this.propInvoice && this.propInvoice.ni
          ? this.propInvoice.ni_amount
          : 0
      let paye_amount
        = this.propInvoice && this.propInvoice.paye
          ? this.propInvoice.paye_amount
          : 0
      return ni_amount + paye_amount
    },

    grand_total () {
      if (this.propInvoice && this.propInvoice.approved) {
        return this.propInvoice.job_part_gross_rate
      }
      return (this.propInvoice.locum_user_vat_registered ? this.taxed_gross_rate : this.total_gross_locum_wages) - this.ni_paye_amount
    },

    total_work_payment () {
      return this.total_gross_locum_wages
    },

    pension_amount () {
      // propInvoice && ((!propInvoice.ooh && propInvoice.generate_form) || (propInvoice.ooh))
      // this.propInvoice && this.propInvoice.generate_form
      if (
        this.propInvoice
        && (
          (!this.propInvoice.ooh && this.propInvoice.generate_form)
          || this.propInvoice.ooh
        )
      ) {
        if (this.propInvoice.approved) {
          if (this.propInvoice.locum_form_a_id) {
            return this.propInvoice.pension_amount
            // return this.propInvoice.locum_form_a_pension_amount
          }

          if (this.propInvoice.locum_solo_form_id) {
            return this.propInvoice.locum_solo_form_pension_amount
          }
        }

        // disputed and invoiced and draft
        if (!this.propInvoice.approved) {
          if (!this.propInvoice.ooh) {
            return this.total_work_payment * 0.9 * 0.1438
          }

          if (this.propInvoice.ooh && this.practice) {
            const boxA = this.total_work_payment
            const boxB = 0 // professional_nhs_expenses
            const boxC = boxA - boxB // gp_nhs_pensionable_pay
            const boxD = 0 // percentage_rate
            const boxE = Math.round(boxC * (boxD / 100) * 100) / 100 // employee_contributions
            const boxF = 0 // added_year_contributions
            const boxG = 0 // added_early_retirement_contributions
            const boxH = boxE + boxF + boxG // total_employee_contributions
            // const boxI = boxC - boxH // total_paid_to_member
            const boxJ = 0 + (Math.round((boxC * (14.38 / 100)) * 100) / 100) // nhs_pension_scheme_employer_contributions
            const boxK = boxH + boxJ // total_nhs_pension_scheme_contributions

            return boxK
          }
        }
      }

      if (this.propJobPart && this.form.generate_form) {
        if (!this.propJobPart.ooh) {
          return this.total_work_payment * 0.9 * 0.1438
        }

        if (this.propJobPart.ooh) {
          const boxA = this.total_work_payment
          const boxB = 0 // professional_nhs_expenses
          const boxC = boxA - boxB // gp_nhs_pensionable_pay
          const boxD = 0 // percentage_rate
          const boxE = Math.round(boxC * (boxD / 100) * 100) / 100 // employee_contributions
          const boxF = 0 // added_year_contributions
          const boxG = 0 // added_early_retirement_contributions
          const boxH = boxE + boxF + boxG // total_employee_contributions
          // const boxI = boxC - boxH // total_paid_to_member
          const boxJ = 0 + (Math.round((boxC * (14.38 / 100)) * 100) / 100) // nhs_pension_scheme_employer_contributions
          const boxK = boxH + boxJ // total_nhs_pension_scheme_contributions

          return boxK
        }
      }

      return 0
    },

    subTotal () {
      if (this.propJobPart && !this.propInvoice) {
        let type = this.propJobPart.job.locum_detail_rate_type.name

        let finalHours
          = (parseInt(this.form.hours) * 60 + parseInt(this.form.minutes)) / 60

        let totalHours = this.propJobPart.job.total_hours / 60

        let total = 0

        switch (type) {
        case "Per Hour":
          total = finalHours * this.propJobPart.job.rate
          break
        default:
          total = finalHours * (this.propJobPart.job.rate / totalHours)
          break
        }

        return total
      }

      if (this.propInvoice && !this.propJobPart) {
        let type = this.propInvoice.items[0].job_part.job.locum_detail_rate_type
          .name

        let finalHours
          = (parseInt(this.form.hours) * 60 + parseInt(this.form.minutes)) / 60

        let totalHours
          = this.propInvoice.items[0].job_part.job.total_hours / 60

        let total = 0

        switch (type) {
        case "Per Hour":
          total = finalHours * this.propInvoice.items[0].job_part.job.rate
          break
        default:
          total
              = finalHours
              * (this.propInvoice.items[0].job_part.job.rate / totalHours)
          break
        }

        return total
      }

      return 0
    },

    totalAmount () {
      if (this.propJobPart && !this.propInvoice) {
        let type = this.propJobPart.job.locum_detail_rate_type.name

        let finalHours
          = (parseInt(this.form.hours) * 60 + parseInt(this.form.minutes)) / 60

        let totalHours = this.propJobPart.job.total_hours / 60

        let total = 0

        switch (type) {
        case "Per Hour":
          total = finalHours * this.propJobPart.job.rate
          break
        default:
          total = finalHours * (this.propJobPart.job.rate / totalHours)
          break
        }

        return total
      }

      // Job Part Total Rate (Per Hour) = (Final Hours + (Final Minutes / 60)) * Rate
      // Job Part Total Rate (Per Session) = (Final Hours + (Final Minutes / 60)) * (Rate / (Total Hours + (Total Minutes / 60)))

      if (this.propInvoice && !this.propJobPart) {
        let type = this.propInvoice.items[0].job_part.job.locum_detail_rate_type
          .name

        let finalHours
          = (parseInt(this.form.hours) * 60 + parseInt(this.form.minutes)) / 60

        let totalHours
          = this.propInvoice.items[0].job_part.job.total_hours / 60

        let total = 0

        switch (type) {
        case "Per Hour":
          total = finalHours * this.propInvoice.items[0].job_part.job.rate
          break
        default:
          total
              = finalHours
              * (this.propInvoice.items[0].job_part.job.rate / totalHours)
          break
        }

        if (this.propInvoice) {
          total
            = total - this.propInvoice.ni_amount - this.propInvoice.paye_amount
        }

        return total
      }

      return 0
    },

    description () {
      if (this.propJobPart && !this.propInvoice) {
        const jobPartNumber = this.propJobPart.job_part_number
        const jobType = this.propJobPart.job.type
        const jobRate = this.propJobPart.job.rate
        const jobRateTypeName = this.propJobPart.job.locum_detail_rate_type
          .name
        const formattedDateStart = this.$moment(
          this.propJobPart.date_start
        ).format("DD/MM/YYYY")
        const formattedDateEnd = this.$moment(this.propJobPart.date_end).format(
          "DD/MM/YYYY"
        )
        const shiftName = this.propJobPart.job.shift.name
        const finalHoursInMinutesHours = parseInt(this.form.hours)
        const hourOrHours = finalHoursInMinutesHours > 1 ? "s" : ""
        const finalHoursInMinutesMinutes = parseInt(this.form.minutes)
        const minuteOrMinutes = finalHoursInMinutesMinutes > 1 ? "s" : ""
        const hasMinutes
          = finalHoursInMinutesMinutes > 0
            ? ` and ${finalHoursInMinutesMinutes} minute${minuteOrMinutes}`
            : ""
        const description
          = `Job number ${jobPartNumber} ${jobType} Job at £${jobRate} ${jobRateTypeName}`
          + ` from ${formattedDateStart} to ${formattedDateEnd} / ${shiftName} /`
          + ` Total of ${finalHoursInMinutesHours} hour${hourOrHours}${hasMinutes}`

        return description
      }

      if (this.propInvoice && !this.propJobPart) {
        const jobPartNumber = this.propInvoice.items[0].job_part
          .job_part_number
        const jobType = this.propInvoice.items[0].job_part.job.type
        const jobRate = this.propInvoice.items[0].job_part.job.rate
        const jobRateTypeName = this.propInvoice.items[0].job_part.job
          .locum_detail_rate_type.name
        const formattedDateStart = this.$moment(
          this.propInvoice.date_start
        ).format("DD/MM/YYYY")
        const formattedDateEnd = this.$moment(this.propInvoice.date_end).format(
          "DD/MM/YYYY"
        )
        const shiftName = this.propInvoice.items[0].job_part.job.shift.name
        const finalHoursInMinutesHours = parseInt(this.form.hours)
        const hourOrHours = finalHoursInMinutesHours > 1 ? "s" : ""
        const finalHoursInMinutesMinutes = parseInt(this.form.minutes)
        const minuteOrMinutes = finalHoursInMinutesMinutes > 1 ? "s" : ""
        const hasMinutes
          = finalHoursInMinutesMinutes > 0
            ? ` and ${finalHoursInMinutesMinutes} minute${minuteOrMinutes}`
            : ""
        const description
          = `Job number ${jobPartNumber} ${jobType} Job at £${jobRate} ${jobRateTypeName}`
          + ` from ${formattedDateStart} to ${formattedDateEnd} / ${shiftName} /`
          + ` Total of ${finalHoursInMinutesHours} hour${hourOrHours}${hasMinutes}`

        return description
      }

      return ""
    },

    job_part () {
      let jobPartNumber
      let jobType
      let jobRate
      let jobRateTypeName
      let formattedDateStart
      let formattedDateEnd
      if (this.propJobPart && !this.propInvoice) {
        jobPartNumber = this.propJobPart.job_part_number
        jobType = this.propJobPart.job.type
        jobRate = this.propJobPart.job.rate
        jobRateTypeName = this.propJobPart.job.locum_detail_rate_type.name
        formattedDateStart = this.$moment(this.propJobPart.date_start).format(
          "DD/MM/YYYY"
        )
        formattedDateEnd = this.$moment(this.propJobPart.date_end).format(
          "DD/MM/YYYY"
        )
      }
      if (this.propInvoice && !this.propJobPart) {
        jobPartNumber = this.propInvoice.items[0].job_part.job_part_number
        jobType = this.propInvoice.items[0].job_part.job.type
        jobRate = this.propInvoice.items[0].job_part.job.rate
        jobRateTypeName = this.propInvoice.items[0].job_part.job
          .locum_detail_rate_type.name
        formattedDateStart = this.$moment(this.propInvoice.date_start).format(
          "DD/MM/YYYY"
        )
        formattedDateEnd = this.$moment(this.propInvoice.date_end).format(
          "DD/MM/YYYY"
        )
      }
      return {
        job_part_number: jobPartNumber,
        type: jobType,
        rate: jobRate,
        locum_detail_rate_type: jobRateTypeName,
        date_start: formattedDateStart,
        date_end: formattedDateEnd,
      }
    },

    practice_rate () {
      let practice_rate = this.propJobPart ? this.propJobPart.practice_rate : 0
      let rate = 0
      if (practice_rate) {
        rate = practice_rate.rate
      } else {
        rate = 0
      }
      return rate
    },

    dispute () {
      return (
        this.form
        && this.form.items
        && this.form.items.length > 0
        && this.form.items[0].dispute
      )
    },
  },

  watch: {
    dispute () {
      if (!this.dispute) {
        this.setInitialState()
        this.form.items[0].dispute = false
      }
    },
  },

  created () {
    this.taxRatesLoading = true
    Promise.all([
      this.$axios.$get("/api/v1/tax-rates").then(response => 
        response.data.tax_rates
      ),
    ])
      .then(responses => {
        const [taxRates,] = responses
        this.tax_rates = taxRates
        this.locum_vat_registered = this.$auth.user.vat_registered
      })
      .finally(() => {
        this.taxRatesLoading = false
      })
  },

  mounted () {
    this.setInitialState()
    let practice_id
      = this.propInvoice && this.propInvoice.practice_id
        ? this.propInvoice.practice_id
        : this.propJobPart && this.propJobPart.practice_id
          ? this.propJobPart.practice_id
          : null

    this.getPractice(practice_id)
  },

  methods: {
    getPractice (practice_id) {
      this.$axios.$get(`/api/v1/locum/practices/${practice_id}`).then(res => {
        this.practice
          = res.data && res.data.practice ? res.data.practice : null
      })
    },

    totalHours (start, end, date) {
      let startDate = this.$moment(date + " " + start, "DD/MM/YYYY HH:mm")
      let endDate = this.$moment(date + " " + end, "DD/MM/YYYY HH:mm")
      return start && end
        ? this.$moment(endDate, "DD/MM/YYYY HH:mm").diff(startDate, "minutes")
        : 0
    },

    getSchedule (
      schedule,
      total_gross_locum_wages, //getJobGrossRate
      tax_amount, //getJobTaxRate
      taxed_gross_rate, // getJobTaxedGrossRate
      total_working_hours,
      deductions,
      total_lates,
      hasError,
      hasChanges
    ) {
      this.schedule = schedule

      this.form.job_part_schedule_items = []

      let absentCount = 0

      schedule.forEach((sched, scheduleIndex) => {
        if (sched.shifts && sched.shifts.length) {
          sched.shifts.forEach((shift, shiftIndex) => {
            const timeStart = shift.final_time_start
              ? shift.final_time_start
              : shift.time_start

            const timeEnd = shift.final_time_end
              ? shift.final_time_end
              : shift.time_start

            this.form.job_part_schedule_items.push({
              id: shift.id,
              time_start: timeStart,
              time_end: timeEnd,
              total: shift.total,
              dispute: shift.dispute,
              remarks: shift.remarks,
              late_hours_reason: "",
              description: "",
              invoiced_break_in_minutes: shift.has_absences ? '0' : shift.invoiced_break_in_minutes,
              invoiced_break_payable: shift.has_absences ? 'false' : shift.invoiced_break_payable,
            })

            shift.has_absences ? (absentCount += 1) : ""

            // if (shift.final_time_start !== "") {
            // 	let startIndex = this.shiftErrors.findIndex(
            // 		err => err.field === `final_time_start-s${scheduleIndex}-${shiftIndex}`
            // 	);

            // 	if (startIndex > -1) {
            // 		this.shiftErrors.splice(startIndex, 1);
            // 	}
            // }

            // if (shift.final_time_end !== "") {
            // 	let endIndex = this.shiftErrors.findIndex(
            // 		err => err.field === `final_time_end-s${scheduleIndex}-${shiftIndex}`
            // 	);

            // 	if (endIndex > -1) {
            // 		this.shiftErrors.splice(endIndex, 1);
            // 	}
            // }

            if (
              shift.invoiced_break_in_minutes
              && shift.final_time_start
              && shift.final_time_end
              && sched.date
              && parseInt(shift.invoiced_break_in_minutes) > this.totalHours(shift.final_time_start, shift.final_time_end, sched.date)
            ) {
              this.shiftErrors.push({
                field: `invoiced_break_in_minutes-s${scheduleIndex}-${shiftIndex}`,
                message: "Invalid break in minutes.",
              })
            } else {
              const index = this.shiftErrors.findIndex(
                err => err.field === `invoiced_break_in_minutes-s${scheduleIndex}-${shiftIndex}`
              )

              if (index > -1) {
                this.shiftErrors.splice(index, 1)
              }
            }
          })
        }
      })

      this.total_late_hours = total_lates

      this.total_absences = absentCount

      this.total_deductions = deductions

      this.total_working_hours = total_working_hours

      this.total_gross_locum_wages = total_gross_locum_wages
      // this.form.total_amount = this.propInvoice && this.propInvoice.locum_user_vat_registered 
      //   ? this.$auth.user.vat_registered === true
      //     ? taxed_gross_rate 
      //     : total_gross_locum_wages 
      //   : total_gross_locum_wages

      this.tax_amount = this.propInvoice
        && (
          this.propInvoice.approved
          || this.propInvoice.status === 'Invoiced'
        )
        ? this.propInvoice.tax_amount
        : tax_amount

      this.taxed_gross_rate = taxed_gross_rate

      this.hasShiftError = hasError

      this.sched_has_changes = hasChanges
    },

    setInitialState () {
      if (this.propJobPart && !this.propInvoice) {
        this.form.type = this.propJobPart.job.type
        this.form.practice_id = this.propJobPart.job.practice_id
        this.form.date_start = this.propJobPart.date_start
        this.form.date_end = this.propJobPart.date_end
        this.form.job_part_schedule_items = this.propJobPart.schedules
        // Job Part Total Rate (Per Hour) = (Final Hours + (Final Minutes / 60)) * Rate
        // Job Part Total Rate (Per Session) = (Final Hours + (Final Minutes / 60)) * (Rate / (Total Hours + (Total Minutes / 60)))

        let type = this.propJobPart.job.locum_detail_rate_type.name

        let finalHours = this.propJobPart.final_hours / 60

        let totalHours = this.propJobPart.job.total_hours / 60

        let total = 0

        switch (type) {
        case "Per Hour":
          total = finalHours * this.propJobPart.job.rate
          break
        default:
          total = finalHours * (this.propJobPart.job.rate / totalHours)
          break
        }

        const jobPartNumber = this.propJobPart.job_part_number
        const jobType = this.propJobPart.job.type
        const jobRate = this.propJobPart.job.rate
        const jobRateTypeName = this.propJobPart.job.locum_detail_rate_type
          .name
        const formattedDateStart = this.$moment(
          this.propJobPart.date_start
        ).format("DD/MM/YYYY")
        const formattedDateEnd = this.$moment(this.propJobPart.date_end).format(
          "DD/MM/YYYY"
        )
        const shiftName = this.propJobPart.job.shift.name
        const finalHoursInMinutesHours = Math.floor(
          this.propJobPart.final_hours / 60
        )
        const hourOrHours = finalHoursInMinutesHours > 1 ? "s" : ""
        const finalHoursInMinutesMinutes = Math.floor(
          this.propJobPart.final_hours % 60
        )
        const minuteOrMinutes = finalHoursInMinutesMinutes > 1 ? "s" : ""
        const hasMinutes
          = finalHoursInMinutesMinutes > 0
            ? ` and ${finalHoursInMinutesMinutes} minute${minuteOrMinutes}`
            : ""
        const description
          = `Job number ${jobPartNumber} ${jobType} Job at £${jobRate} ${jobRateTypeName}`
          + ` from ${formattedDateStart} to ${formattedDateEnd} / ${shiftName} /`
          + ` Total of ${finalHoursInMinutesHours} hour${hourOrHours}${hasMinutes}`

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
            remarks: "",
          },
        ]

        // this.form.total_amount = this.propInvoice && this.propInvoice.locum_user_vat_registered 
        //   ? this.$auth.user.vat_registered === true
        //     ? this.taxed_gross_rate 
        //     : this.total_gross_locum_wages 
        //   : this.total_gross_locum_wages

        this.form.final = false
        this.form.ir35 = this.propJobPart.job_ir35
      }

      if (this.propInvoice && !this.propJobPart) {
        this.form.locum_invoice_id = this.propInvoice.id
        this.form.date_start = this.propInvoice.date_start
        this.form.date_end = this.propInvoice.date_end
        this.form.job_part_schedule_items = this.propInvoice.job_part_schedule_items

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
            remarks: this.propInvoice.items[0].remarks,
          },
        ]

        this.form.total_amount = this.propInvoice.total_amount
        this.form.final = false
        this.form.ir35 = this.propInvoice.ir35
        this.form.generate_form = this.propInvoice.generate_form
      }

      this.form.hours = Math.floor(this.form.items[0].final_hours / 60)
      this.form.minutes = Math.floor(this.form.items[0].final_hours % 60)
      this.form.late_hours = Math.floor(this.form.items[0].late_hours / 60)
      this.form.late_minutes = Math.floor(this.form.items[0].late_hours % 60)
      
      console.log('initalstate', this.form)
    },

    handleKeyDownEvent (e, formField, limit) {
      let acceptedKeys = [
        "Backspace",
        "Tab",
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
      ]
      if (
        this.form[formField].length >= limit
        && !acceptedKeys.includes(e.key)
      ) {
        e.preventDefault()
      }
    },

    hasValue (value, field) {
      if (value == 0) {
        this.form[field] = ""
      }
    },

    save (final) {
      this.formError = []
      this.shiftErrors = []

      if (this.schedule.length) {
        this.schedule.forEach((sched, scheduleIndex) => {
          sched.shifts.forEach((shift, shiftIndex) => {
            if (!shift.has_absences) {
              if (!shift.final_time_start) {
                this.shiftErrors.push({
                  field: `final_time_start-s${scheduleIndex}-${shiftIndex}`,
                  message: "Final Start is required",
                })
              }

              if (!shift.final_time_end) {
                this.shiftErrors.push({
                  field: `final_time_end-s${scheduleIndex}-${shiftIndex}`,
                  message: "Final End is required",
                })
              }
            }

            if (
              shift.invoiced_break_in_minutes
              && shift.final_time_start
              && shift.final_time_end
              && sched.date
              && parseInt(shift.invoiced_break_in_minutes) > this.totalHours(shift.final_time_start, shift.final_time_end, sched.date)
            ) {
              this.shiftErrors.push({
                field: `invoiced_break_in_minutes-s${scheduleIndex}-${shiftIndex}`,
                message: "Invalid break in minutes.",
              })
            }
          })
        })
      }

      this.Validate(this.form, [
        "final",
        "ir35",
        "total_amount",
        "tax_amount",
        "hours",
        "minutes",
        "late_hours",
        "late_minutes",
        "generate_form",
      ])

      if (!this.formError.length && !this.shiftErrors.length) {
        this.saveLoading = true

        if (this.propJobPart && !this.propInvoice) {
          if (this.locum_vat_registered === true) {
            this.form.total_amount = this.taxed_gross_rate
            this.form.tax_amount = this.tax_amount
          } else {
            this.form.total_amount = this.total_gross_locum_wages
            this.form.tax_amount = 0
          }

          this.form.final = final

          console.log('this.form', this.form)

          this.$axios
            .$post(`/api/v1/locum/locum-invoices`, this.form)
            .then(res => {
              this.$store.commit("SET_NOTIFICATION", {
                enabled: true,
                status: "success",
                text: final === true ? [`${res.message}`,] : [`Draft Invoice Created Successfully`,],
              })

              this.$emit("createInvoice", res.data.locum_invoice)
            })
            .catch(err => {
              console.log("err", err.response || err)

              if (err.response.data.message) {
                this.$store.commit("SET_NOTIFICATION", {
                  enabled: true,
                  status: "error",
                  text: [`${err.response.data.message}`,],
                })
              } else if (err.response.data.error_messages) {
                err.response.data.error_messages.forEach(error => {
                  this.formError.push(error)
                })
              } else {
                this.formError.push(err.response.data)
              }

              throw err
            })
            .finally(() => {
              this.saveLoading = false
            })

          // this.saveLoading = false
        } else if (this.propInvoice && !this.propJobPart) {
          if (this.locum_vat_registered === true) {
            this.form.total_amount = this.taxed_gross_rate
            this.form.tax_amount = this.tax_amount
          } else {
            this.form.total_amount = this.total_gross_locum_wages
            this.form.tax_amount = 0
          }

          this.form.final = final

          this.$axios
            .$put(
              `/api/v1/locum/locum-invoices/${this.$route.params.id}`,
              this.form
            )
            .then(res => {
              this.$store.commit("SET_NOTIFICATION", {
                enabled: true,
                status: "success",
                text: final === true ? [`${res.message}`,] : [`Draft Invoice Created Successfully`,],
              })

              this.$emit("updateInvoice", res.data.locum_invoice)
            })
            .catch(err => {
              console.log("err", err.response || err)

              if (err.response.data.message) {
                this.$store.commit("SET_NOTIFICATION", {
                  enabled: true,
                  status: "success",
                  text: [`${err.response.data.message}`,],
                })
              } else if (err.response.data.error_messages) {
                err.response.data.error_messages.forEach(error => {
                  this.formError.push(error)
                })
              } else {
                this.formError.push(err.response.data)
              }

              throw err
            })
            .finally(() => {
              this.saveLoading = false
            })
          // this.saveLoading = false
        }
      } else {
        console.log('error', this.formError)
      }

      this.saveLoading = false
    },

    waitingForPracticeReply (item) {
      return (
        !item.disputed_by_practice_at
        || this.$moment(item.disputed_by_practice_at).diff(
          item.disputed_by_locum_at,
          "seconds"
        ) < 0
      )
    },

    viewAsPdf (invoiceId) {
      window.open(
        `${process.env.API_URL}/api/v1/locum-invoices/${invoiceId}/pdf`
      )
    },
  },
}
</script>

<style scoped>
/* .items-table { */
/* width: 733px; */
/* } */
.bg-gray {
  background-color: #707070;
}
</style>
