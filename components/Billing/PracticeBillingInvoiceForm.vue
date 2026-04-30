<template>
  <section class="relative">
    <div
      class="flex flex-col justify-start items-start border rounded-lg py-8 px-6 mb-4"
    >
      <div :ref="'pdf-header'" class="flex justify-between w-full px-2">
        <div class="flex flex-wrap justify-between w-1/2">
          <div
            class="w-full sm:w-1/2 order-2 sm:order-1 text-xs sm:text-sm text-left rounded-lg border-2 border-gray-300 p-2 w-2/3"
          >
            <section>
              <div class="relative flex flex-col py-2">
                <div
                  class="relative flex flex-row flex-no-wrap justify-between"
                >
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

        <div class="w-1/2 text-xs sm:text-sm text-right leading-normal">
          <div>{{ propInvoice.locum_user.name }}</div>
          <div>{{ propInvoice.address_line_1 }}</div>
          <div>{{ propInvoice.address_line_2 }}</div>
          <div>{{ propInvoice.address_line_3 }}</div>
          <div>{{ propInvoice.postcode }}</div>
          <div
            v-if="
              $auth.user &&
                $auth.user.contact_detail &&
                $auth.user.contact_detail.mobile_number
            "
          >
            Tel {{ propInvoice.mobile_number }}
          </div>
          <div>{{ propInvoice.locum_user.email }}</div>
          <div>
            {{
              propInvoice.utr_number &&
                propInvoice.employment_type === "Self-Employed"
                ? `UTR ${propInvoice.utr_number}`
                : ""
            }}
          </div>
          <div>
            {{
              propInvoice.company_registration_number &&
                propInvoice.employment_type === "Limited Company"
                ? `Company Registration Number ${propInvoice.company_registration_number}`
                : ""
            }}
          </div>
          <div>
            {{
              propInvoice.locum_user_vat_number
                ? `VAT Number: ${propInvoice.locum_user_vat_number}`
                : ""
            }}
          </div>
          <div>
            <span>Invoice Number:</span>
            <span>{{ propInvoice.invoice_number }}</span>
          </div>
        </div>
      </div>

      <div
        v-if="
          propInvoice &&
            propInvoice.last_disputed_by === 'Practice' &&
            !propInvoice.approved
        "
        class="w-full bg-orange-400 mt-4 py-1 text-center rounded font-bold mx-2 uppercase text-gray-700"
      >
        DISPUTED - Awaiting Locum Reply
      </div>

      <div
        v-if="propInvoice.status === 'Disputed'"
        class="w-full bg-orange-400 mt-4 py-1 text-center rounded font-bold mx-2 text-gray-700"
      >
        DISPUTED BY LOCUM

        <p v-if="getRemarks()">
          Reason: {{ getRemarks() }}
        </p>
      </div>

      <p
        class="w-full bg-gray my-4 py-1 text-center text-white rounded font-bold mx-2"
      >
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

          <p
            v-if="total_working_hours > 0"
            class="mx-2 border border-gray-600 rounded px-4 text-gray-700"
          >
            {{ total_working_hours | hoursMinutes }}
          </p>

          <p
            v-else
            class="mx-2 border border-gray-600 rounded px-4 text-gray-700"
          >
            0
          </p>
        </div>
      </div>

      <div class="w-full border-b overflow-x-auto">
        <AppSchedules
          ref="appSchedulesInput"
          :practice_rate="practice_rate"
          :schedule="propInvoice.job_part_schedule_items"
          :error="formError.find(err => err.field === 'schedules')"
          :shiftErrors="shiftErrors"
          toInvoice
          :type="'invoice'"
          :invoiceDetails="propInvoice"
          :invoiceStatus="$route.query.status"
          :tax_rates="tax_rates"
          :locum_vat_registered="propInvoice.locum_user_vat_registered"
          :toDisplay="
            !disputeByPractice ||
              propInvoice.approved ||
              propInvoice.last_disputed_by === 'Practice' ||
              $route.query.status === 'issued' ||
              !propInvoice.disputed_items_count
          "
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
              {{ total_late_hours === "00:00" ? "None" : total_late_hours }}
            </p>
          </div>

          <div class="flex flex-wrap justify-between">
            <p class="text-sm w-1/2">
              TOTAL ABSENCES:
            </p>

            <p class="font-bold w-1/2 text-right">
              {{ total_absences > 0 ? total_absences : "None" }}
            </p>
          </div>

          <div class="flex flex-wrap justify-between">
            <p class="text-sm w-1/2">
              TOTAL WORK HOURS:
            </p>

            <p
              v-if="total_working_hours > 0"
              class="font-bold w-1/2 text-right"
            >
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

          <div
            v-if="
              propInvoice && (isOOH || (!isOOH && propInvoice.generate_form))
            "
            class="flex flex-wrap justify-between"
          >
            <p class="text-sm w-1/2">
              FORM TYPE:
            </p>

            <p class="font-bold w-1/2 text-right">
              {{ isOOH ? "Solo Form" : "Form A" }}
            </p>
          </div>

          <div class="flex flex-wrap justify-between">
            <p class="text-sm w-1/2">
              STATUS:
            </p>

            <p class="font-bold w-1/2 text-right">
              {{ propInvoice && propInvoice.status }}
            </p>
          </div>

          <div
            v-if="
              propInvoice &&
                (isOOH ||
                propInvoice.generate_form ||
                propInvoice.locum_form_a_id ||
                propInvoice.locum_solo_form_id)
            "
            class="flex flex-wrap justify-between"
          >
            <p class="text-sm w-1/2">
              GENERATE FORM:
            </p>

            <p class="font-bold w-1/2 text-right">
              {{
                propInvoice &&
                  (isOOH ||
                  propInvoice.generate_form ||
                  propInvoice.locum_form_a_id ||
                  propInvoice.locum_solo_form_id)
                  ? "Yes"
                  : "No"
              }}
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

          <template
            v-if="
              propInvoice &&
                (propInvoice.approved || propInvoice.status === 'Invoiced') &&
                propInvoice.tax_amount
            "
          >
            <div class="flex flex-wrap justify-between">
              <p class="text-sm w-1/2">
                TAX AMOUNT:
              </p>

              <p class="font-bold w-1/2 text-right">
                £ {{ propInvoice.tax_amount | currency }}
              </p>
            </div>

            <div class="flex flex-wrap justify-between">
              <p class="text-sm w-1/2">
                TAXED TOTAL WORK PAYMENT:
              </p>

              <p class="font-bold w-1/2 text-right">
                £ {{ propInvoice.job_part_taxed_total_rate | currency }}
              </p>
            </div>
          </template>

          <template
            v-if="
              (!propInvoice ||
                !(propInvoice.approved || propInvoice.status === 'Invoiced')) &&
                propInvoice.locum_user_vat_registered
            "
          >
            <div class="flex flex-wrap justify-between">
              <p class="text-sm w-1/2">
                TAX AMOUNT:
              </p>

              <p class="font-bold w-1/2 text-right">
                £ {{ tax_amount | currency }}
              </p>
            </div>

            <div class="flex flex-wrap justify-between">
              <p class="text-sm w-1/2">
                TAXED TOTAL WORK PAYMENT:
              </p>

              <p class="font-bold w-1/2 text-right">
                £ {{ taxed_gross_rate | currency }}
              </p>
            </div>
          </template>

          <template v-if="false">
            <div
              v-if="
                (propInvoice &&
                  propInvoice.job_part_total_rate !==
                  propInvoice.job_part_taxed_total_rate) ||
                  propInvoice.locum_user_vat_registered
              "
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
              v-if="
                (propInvoice &&
                  propInvoice.job_part_total_rate !==
                  propInvoice.job_part_taxed_total_rate) ||
                  propInvoice.locum_user_vat_registered
              "
              class="flex flex-wrap justify-between"
            >
              <p class="text-sm w-1/2">
                TAXED TOTAL WORK PAYMENT:
              </p>

              <p class="font-bold w-1/2 text-right">
                £ {{ taxed_gross_rate | currency }}
              </p>
            </div>
          </template>

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
            v-if="
              propInvoice &&
                (isOOH ||
                propInvoice.generate_form ||
                propInvoice.locum_form_a_id ||
                propInvoice.locum_solo_form_id)
            "
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
          <div
            class="rounded-lg border-2 border-gray-300 mt-4 p-4 w-full sm:w-2/3 w-3/4"
          >
            <div
              v-if="propInvoice && propInvoice.paid_under_payroll"
              class="flex flex-col text-xs sm:text-sm"
            >
              <div>Payment by BACS: xxxxx</div>
              <div>
                Payroll company name:
                {{
                  propInvoice.payroll_account_name
                    ? propInvoice.payroll_account_name
                    : "xxxxx"
                }}
              </div>
              <div>
                Bank:
                {{
                  propInvoice.payroll_bank_name
                    ? propInvoice.payroll_bank_name
                    : "xxxxx"
                }}
              </div>
              <div>
                Sort code:
                {{
                  propInvoice.payroll_sort_code
                    ? propInvoice.payroll_sort_code
                    : "xxxxx"
                }}
              </div>
              <div>
                Payroll bank account number:
                {{
                  propInvoice.payroll_account_number
                    ? propInvoice.payroll_account_number
                    : "xxxxx*OR"
                }}
              </div>
              <div>
                Payroll reference number:
                {{
                  propInvoice.payroll_reference_number
                    ? propInvoice.payroll_reference_number
                    : "xxxxx*OR"
                }}
              </div>
            </div>

            <div
              v-if="propInvoice && !propInvoice.paid_under_payroll"
              class="flex flex-col text-xs sm:text-sm"
            >
              <div>Payment by BACS: xxxxx</div>
              <div>
                Account name:
                {{
                  propInvoice.account_name ? propInvoice.account_name : "xxxxx"
                }}
              </div>
              <div>
                Bank:
                {{ propInvoice.bank_name ? propInvoice.bank_name : "xxxxx" }}
              </div>
              <div>
                Sort code:
                {{ propInvoice.sort_code ? propInvoice.sort_code : "xxxxx" }}
              </div>
              <div>
                Account number:
                {{
                  propInvoice.account_number
                    ? propInvoice.account_number
                    : "xxxxx*OR"
                }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- SOLO FORM DETAILS MODAL -->
    <transition name="fade">
      <div
        v-if="toggle_modal"
        class="rounded-lg shadow-md px-4 py-8 md:px-8 accept-modal border w-5/6 md:w-1/3"
      >
        <p class="font-bold uppercase">
          Solo Form Details
        </p>

        <div class="flex flex-col my-8" style="max-height:500px;overflow:auto">
          <AppInput
            v-model="form.ea_code"
            :type="'text'"
            :name="'ea_code'"
            :label="'PCSE Code'"
            :error="formError.find(item => item.field === 'ea_code')"
            required
            @blur="CheckEmptyField(form.ea_code, 'PCSE Code', 'PCSE Code')"
          />

          <AppInput
            v-model="form.national_insurance_number"
            :type="'text'"
            :name="'national_insurance_number'"
            :label="'National Insurance number'"
            :error="
              formError.find(item => item.field === 'national_insurance_number')
            "
            required
            @blur="
              CheckEmptyField(
                form.national_insurance_number,
                'national_insurance_number'
              )
            "
            @keypress="inputNumberOnly($event)"
          />

          <AppInput
            v-model="form.sd_number"
            :type="'text'"
            :limit="8"
            :name="'sd_number'"
            :label="'NHS Pension Scheme Membership number'"
            :error="formError.find(item => item.field === 'sd_number')"
            required
            @blur="CheckEmptyField(form.sd_number, 'sd_number')"
            @keypress="inputNumberOnly($event)"
          />

          <AppInput
            v-model="form.paying_reference"
            :type="'text'"
            :limit="4"
            :name="'paying_reference'"
            :label="'Paying reference number'"
            :error="formError.find(item => item.field === 'paying_reference')"
            required
            @blur="CheckEmptyField(form.paying_reference, 'paying_reference')"
            @keypress="inputNumberOnly($event)"
          />

          <AppInput
            v-model="form.percentage_rate"
            :type="'select'"
            :name="'percentage_rate'"
            :label="'Percentage rate (D)'"
            :items="[
              { label: '5%', value: 5 },
              { label: '5.6%', value: 5.6 },
              { label: '7.1%', value: 7.1 },
              { label: '9.3%', value: 9.3 },
              { label: '12.5%', value: 12.5 },
              { label: '13.5%', value: 13.5 },
              { label: '14.5%', value: 14.5 }
            ]"
            required
          />

          <AppInput
            v-model="form.professional_nhs_expenses"
            :type="'number'"
            :name="'professional_nhs_expenses'"
            :label="'Professional NHS Expense (B)'"
            :error="
              formError.find(item => item.field === 'professional_nhs_expenses')
            "
            required
            @blur="
              CheckEmptyField(
                form.professional_nhs_expenses,
                'professional_nhs_expenses'
              )
            "
          />

          <AppInput
            v-model="form.added_year_contributions"
            :type="'number'"
            :name="'added_year_contributions'"
            :label="
              'Additional contributions for Added Years, Additional Pension, NHS AVC Scheme (F)'
            "
            :error="
              formError.find(item => item.field === 'added_year_contributions')
            "
            required
            @blur="
              CheckEmptyField(
                form.added_year_contributions,
                'added_year_contributions'
              )
            "
          />

          <AppInput
            v-model="form.added_early_retirement_contributions"
            :type="'number'"
            :name="'added_early_retirement_contributions'"
            :label="
              'Additional contributions for Early Retirement Reduction Buy Out (G)'
            "
            :error="
              formError.find(
                item => item.field === 'added_early_retirement_contributions'
              )
            "
            required
            @blur="
              CheckEmptyField(
                form.added_early_retirement_contributions,
                'added_early_retirement_contributions'
              )
            "
          />

          <AppInput
            v-model="form.nhsps_employer_contributions"
            :type="'number'"
            :name="'nhsps_employer_contributions'"
            :label="'NHSPS employer contributions'"
            :error="
              formError.find(
                item => item.field === 'nhsps_employer_contributions'
              )
            "
            required
            @blur="
              CheckEmptyField(
                form.nhsps_employer_contributions,
                'nhsps_employer_contributions'
              )
            "
          />

          <AppInput
            v-model="form.nhs_pension_scheme_employing_authority_name"
            :type="'text'"
            :name="'nhs_pension_scheme_employing_authority_name'"
            :label="'NHSPS employing authority name'"
            :error="
              formError.find(
                item =>
                  item.field === 'nhs_pension_scheme_employing_authority_name'
              )
            "
            required
            @blur="
              CheckEmptyField(
                form.nhs_pension_scheme_employing_authority_name,
                'nhs_pension_scheme_employing_authority_name'
              )
            "
          />
        </div>

        <div class="flex justify-end">
          <AppButton
            :label="'Cancel'"
            class="mr-2"
            @click="toggle_modal = false"
          />
          <AppButton :label="'Accept'" @click="save(true)" />
        </div>
      </div>
    </transition>
    <!-- SOLO FORM DETAILS MODAL ENDS HERE -->

    <div v-if="toggle_modal" class="shield" />

    <div
      v-if="authPermissions.includes('Process Billings')"
      class="flex flex-wrap justify-start items-center mb-6"
    >
      <AppButton
        v-if="
          propInvoice &&
            !propInvoice.approved &&
            allowToBill &&
            propInvoice.last_disputed_by !== 'Practice'
        "
        class="m-1"
        :label="'Accept & Approve'"
        :inStyle="'padding:5px 14px;font-size:1em'"
        :disabled="saveLoading || sched_has_changes || shiftErrors.length > 0"
        @click="toggleModal(true)"
      />

      <!-- <AppButton
        v-if="
          propInvoice &&
            !propInvoice.approved &&
            allowToBill &&
            propInvoice.last_disputed_by !== 'Practice'
        "
        class="m-1"
        :label="disputeByPractice ? 'Undispute' : 'Dispute'"
        :inStyle="'padding:5px 14px;font-size:1em;'"
        :disabled="saveLoading || shiftErrors.length > 0"
        @click="toggleDispute"
      /> -->

      <!-- new -->
      <AppButton
        v-if="
          propInvoice &&
            !propInvoice.approved &&
            allowToBill &&
            propInvoice.last_disputed_by !== 'Practice' &&
            $route.query.status !== 'issued' &&
            $route.query.status !== 'invoiced'
        "
        class="m-1"
        :label="disputeByPractice ? 'Undispute' : 'Dispute'"
        :inStyle="'padding:5px 14px;font-size:1em;'"
        :disabled="saveLoading || shiftErrors.length > 0"
        @click="toggleDispute"
      />
      <!-- end -->

      <!-- <AppButton
        v-if="
          true ||
            disputeByPractice ||
            (propInvoice &&
              !propInvoice.approved &&
              allowToBill &&
              sched_has_changes &&
              propInvoice.last_disputed_by !== 'Practice')

        "
        class="m-1"
        :label="'Save Changes'"
        :inStyle="'padding:5px 14px;font-size:1em'"
        :disabled="!sched_has_changes || saveLoading || shiftErrors.length  > 0"
        @click="save(false)"
      /> -->

      <!-- new -->
      <AppButton
        v-if="
          $route.query.status !== 'issued' &&
            $route.query.status !== 'invoiced' &&
            (true ||
            disputeByPractice ||
            (propInvoice &&
            !propInvoice.approved &&
            allowToBill &&
            sched_has_changes &&
            propInvoice.last_disputed_by !== 'Practice'))
        "
        class="m-1"
        :label="'Save Changes'"
        :inStyle="'padding:5px 14px;font-size:1em'"
        :disabled="!sched_has_changes || saveLoading || shiftErrors.length > 0"
        @click="save(false)"
      />
      <!-- end -->

      <AppButton
        v-if="propInvoice && propInvoice.issued"
        class="m-1"
        :label="'View as PDF'"
        :inStyle="'padding:5px 14px;font-size:1em'"
        @click="viewAsPdf(propInvoice.id)"
      />
    </div>
  </section>
</template>

<script>
import AppButton from "@/components/Base/AppButton";
import AppInput from "@/components/Base/AppInput";
import { mixin as clickaway } from "vue-clickaway";
import AppSchedules from "@/components/Base/AppSchedules";

export default {
  components: {
    AppButton,
    AppInput,
    AppSchedules
  },

  mixins: [clickaway],

  props: {
    propInvoice: {
      type: Object,
      default: () => null
    },

    propId: {
      type: [String, Number],
      default: () => null
    }
  },

  data() {
    return {
      toggle_modal: false,

      old: false,
      exportLoading: false,
      saveLoading: false,
      form: {
        job_part_schedule_items: [],
        items: [],
        tax_amount: 0,
        total_amount: 0,
        date_start: null,
        date_end: null,
        minutes: 0,
        hours: 0,
        late_minutes: 0,
        late_hours: 0,
        //
        ea_code: null,
        national_insurance_number: null,
        sd_number: null,
        paying_reference: null,
        percentage_rate: null,
        professional_nhs_expenses: null,
        added_year_contributions: null,
        added_early_retirement_contributions: null,
        nhsps_employer_contributions: null,
        nhs_pension_scheme_employing_authority_name: null
      },

      formError: [],

      isApproved: false,
      allowToBill: false,

      // split rates
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
      // solo_form_pension_amount: 0

      tax_rates: {},

      disputeByPractice: false
    };
  },

  computed: {
    authPermissions() {
      return this.$store.getters["permissions"];
    },

    isOOH() {
      return (
        this.propInvoice &&
        this.propInvoice.ooh &&
        this.propInvoice.profession_name === "GP"
      );
    },

    ni_paye_amount() {
      let ni_amount =
        this.propInvoice && this.propInvoice.ni
          ? this.propInvoice.ni_amount
          : 0;
      let paye_amount =
        this.propInvoice && this.propInvoice.paye
          ? this.propInvoice.paye_amount
          : 0;
      return ni_amount + paye_amount;
    },

    grand_total() {
      if (this.propInvoice && this.propInvoice.approved) {
        return this.propInvoice.job_part_gross_rate;
      }
      return (
        (this.propInvoice.locum_user_vat_registered
          ? this.taxed_gross_rate
          : this.total_gross_locum_wages) - this.ni_paye_amount
      );
    },

    total_work_payment() {
      return this.total_gross_locum_wages;
    },

    pension_amount() {
      // propInvoice && (this.isOOH || (!this.isOOH && propInvoice.generate_form))
      // this.propInvoice && this.propInvoice.generate_form
      if (
        this.propInvoice &&
        (this.isOOH || (!this.isOOH && this.propInvoice.generate_form))
      ) {
        if (this.propInvoice.approved) {
          if (this.propInvoice.locum_form_a_id) {
            return this.propInvoice.pension_amount;
            // return this.propInvoice.locum_form_a_pension_amount
          }

          if (this.propInvoice.locum_solo_form_id) {
            return this.propInvoice.locum_solo_form_pension_amount;
          }
        }

        if (!this.propInvoice.approved) {
          if (!this.isOOH) {
            return this.total_work_payment * 0.9 * 0.1438;
          }

          if (this.isOOH) {
            const boxA = this.total_work_payment;
            const boxB = 0; // professional_nhs_expenses
            const boxC = boxA - boxB; // gp_nhs_pensionable_pay
            const boxD = 0; // percentage_rate
            const boxE = Math.round(boxC * (boxD / 100) * 100) / 100; // employee_contributions
            const boxF = 0; // added_year_contributions
            const boxG = 0; // added_early_retirement_contributions
            const boxH = boxE + boxF + boxG; // total_employee_contributions
            // const boxI = boxC - boxH // total_paid_to_member
            const boxJ = 0 + Math.round(boxC * (14.38 / 100) * 100) / 100; // nhs_pension_scheme_employer_contributions
            const boxK = boxH + boxJ; // total_nhs_pension_scheme_contributions

            return boxK;
          }
        }
      }

      return 0;
    },

    subTotal() {
      let type = this.propInvoice.items[0].job_part.job.locum_detail_rate_type
        .name;

      let finalHours =
        (parseInt(this.form.hours) * 60 + parseInt(this.form.minutes)) / 60;

      let totalHours = this.propInvoice.items[0].job_part.job.total_hours / 60;

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
    },

    totalAmount() {
      // Job Part Total Rate (Per Hour) = (Final Hours + (Final Minutes / 60)) * Rate
      // Job Part Total Rate (Per Session) = (Final Hours + (Final Minutes / 60)) * (Rate / (Total Hours + (Total Minutes / 60)))

      let type = this.propInvoice.items[0].job_part.job.locum_detail_rate_type
        .name;

      let finalHours =
        (parseInt(this.form.hours) * 60 + parseInt(this.form.minutes)) / 60;

      let totalHours = this.propInvoice.items[0].job_part.job.total_hours / 60;

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
    },

    description() {
      const jobPartNumber = this.propInvoice.items[0].job_part.job_part_number;
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
    },
    job_part() {
      let jobPartNumber;
      let jobType;
      let jobRate;
      let jobRateTypeName;
      let formattedDateStart;
      let formattedDateEnd;
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
      let practice_rates = this.$auth.user.practice_detail.practice.rates;
      let rate_type_id = this.propInvoice.items[0].job_part.job
        .locum_detail_rate_type.id;
      let practice_rate = practice_rates.find(
        item => item.id.toString() === rate_type_id.toString()
      );
      let rate = 0;
      if (practice_rate) {
        rate = practice_rate.rate;
      } else {
        rate = 0;
      }
      return rate;
    }
  },

  watch: {
    isApproved(value) {
      // if (value) {
      //   this.form.items[0].description = `Job number ${this.propInvoice.items[0].job_part.job_part_number} ${this.propInvoice.items[0].job_part.job.type} Job at £${this.propInvoice.items[0].job_part.job.rate} ${this.propInvoice.items[0].job_part.job.locum_detail_rate_type.name} from ${this.propInvoice.items[0].job_part.date_start} to ${this.propInvoice.items[0].job_part.date_end} / ${this.propInvoice.items[0].job_part.job.shift.name} / Total hours of ${this.propInvoice.items[0].final_hours}`
      //   this.form.items[0].absent_days = this.propInvoice.items[0].absent_days
      //   this.form.items[0].late_hours = this.propInvoice.items[0].late_hours
      //   this.form.items[0].final_hours = this.propInvoice.items[0].final_hours
      //   this.form.items[0].remarks = this.propInvoice.items[0].remarks
      //   this.form.items[0].total =
      //     this.propInvoice.items[0].job_part.job.locum_detail_rate_type.name ===
      //       "Per Hour"
      //       ? this.propInvoice.items[0].job_part.job.rate *
      //       this.propInvoice.items[0].final_hours
      //       : this.propInvoice.items[0].job_part.job.rate
      //   this.form.total_amount =
      //     this.propInvoice.items[0].job_part.job.locum_detail_rate_type.name ===
      //       "Per Hour"
      //       ? this.propInvoice.items[0].job_part.job.rate *
      //       this.propInvoice.items[0].final_hours
      //       : this.propInvoice.items[0].job_part.job.rate
      // } else if (value === false) {
      //   this.form.items[0].description = this.propInvoice.items[0].description
      //   this.form.items[0].absent_days = this.propInvoice.items[0].absent_days
      //   this.form.items[0].late_hours = this.propInvoice.items[0].late_hours
      //   this.form.items[0].final_hours = this.propInvoice.items[0].final_hours
      //   this.form.items[0].remarks = this.propInvoice.items[0].remarks
      //   this.form.items[0].total = this.propInvoice.items[0].total
      // }
      this.form.items[0].approve = value;
    }
  },

  created() {
    Promise.all([
      this.$axios
        .$get("/api/v1/tax-rates", { cache: true })
        .then(response => response.data.tax_rates)
    ]).then(responses => {
      const [taxRates] = responses;
      this.tax_rates = taxRates;
    });
  },

  mounted() {
    this.resetInput();
    this.getPracticeProfile();
  },

  methods: {
    getRemarks() {
      const remarks = this.propInvoice?.job_part_schedule_items
        ?.map?.(({ remarks }) => remarks)
        .join(", ");

      return remarks || "";
    },

    toggleDispute() {
      this.disputeByPractice = !this.disputeByPractice;
      this.$refs.appSchedulesInput.initialize();
    },

    resetInput() {
      if (this.propInvoice) {
        this.form.date_start = this.propInvoice.date_start;
        this.form.date_end = this.propInvoice.date_end;

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
        this.isApproved = this.propInvoice.items[0].approved;

        if (
          this.$auth.user.practice_detail &&
          this.$auth.user.practice_detail.practice.type !== "Spoke"
        ) {
          this.allowToBill = true;
        } else if (
          this.$auth.user.practice_detail.practice.type === "Spoke" &&
          !this.$auth.user.practice_detail.practice.parent_practice_id
        ) {
          this.allowToBill = true;
        } else if (
          this.$auth.user.practice_detail.practice.parent_practice_id &&
          this.$auth.user.practice_detail.practice.allow_surgery_bill_locum ===
            true
        ) {
          this.allowToBill = true;
        }
      }

      this.form.hours = Math.floor(this.form.items[0].final_hours / 60);
      this.form.minutes = Math.floor(this.form.items[0].final_hours % 60);
      this.form.late_hours = Math.floor(this.form.items[0].late_hours / 60);
      this.form.late_minutes = Math.floor(this.form.items[0].late_hours % 60);
    },

    getPracticeProfile() {
      this.$axios
        .get(`/api/v1/practice/me/practice-profile`, { cache: true })
        .then(response => (this.practice = response.data.data.practice));
    },

    totalHours(start, end, date) {
      let startDate = this.$moment(date + " " + start, "DD/MM/YYYY HH:mm");
      let endDate = this.$moment(date + " " + end, "DD/MM/YYYY HH:mm");
      return start && end
        ? this.$moment(endDate, "DD/MM/YYYY HH:mm").diff(startDate, "minutes")
        : 0;
    },

    getSchedule(
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
      this.schedule = schedule;

      this.form.job_part_schedule_items = [];

      let absentCount = 0;

      schedule.forEach((sched, scheduleIndex) => {
        if (sched.shifts && sched.shifts.length) {
          sched.shifts.forEach((shift, shiftIndex) => {
            const timeStart = shift.has_absences
              ? shift.time_start
              : shift.final_time_start;

            const timeEnd = shift.has_absences
              ? shift.time_start
              : shift.final_time_end;

            this.form.job_part_schedule_items.push({
              id: shift.id,
              time_start: timeStart,
              time_end: timeEnd,
              total: shift.total,
              approve: shift.dispute,
              remarks: shift.remarks,
              late_hours_reason: "",
              description: "",
              invoiced_break_in_minutes: shift.has_absences
                ? "0"
                : shift.invoiced_break_in_minutes,
              invoiced_break_payable: shift.has_absences
                ? "false"
                : shift.invoiced_break_payable
            });

            shift.has_absences ? (absentCount += 1) : "";

            if (shift.final_time_start) {
              const index = this.shiftErrors.findIndex(
                err =>
                  err.field ===
                  `final_time_start-s${scheduleIndex}-${shiftIndex}`
              );

              if (index > -1) {
                this.shiftErrors.splice(index, 1);
              }
            }

            if (shift.final_time_end) {
              const index = this.shiftErrors.findIndex(
                err =>
                  err.field === `final_time_end-s${scheduleIndex}-${shiftIndex}`
              );

              if (index > -1) {
                this.shiftErrors.splice(index, 1);
              }
            }

            if (
              shift.invoiced_break_in_minutes &&
              shift.final_time_start &&
              shift.final_time_end &&
              sched.date &&
              parseInt(shift.invoiced_break_in_minutes) >
                this.totalHours(
                  shift.final_time_start,
                  shift.final_time_end,
                  sched.date
                )
            ) {
              this.shiftErrors.push({
                field: `invoiced_break_in_minutes-s${scheduleIndex}-${shiftIndex}`,
                message: "Invalid break in minutes."
              });
            } else {
              const index = this.shiftErrors.findIndex(
                err =>
                  err.field ===
                  `invoiced_break_in_minutes-s${scheduleIndex}-${shiftIndex}`
              );

              if (index > -1) {
                this.shiftErrors.splice(index, 1);
              }
            }
          });
        }
      });

      this.total_late_hours = total_lates;

      this.total_absences = absentCount;

      this.total_deductions = deductions;

      this.total_working_hours = total_working_hours;

      this.total_gross_locum_wages = total_gross_locum_wages;
      this.form.total_amount =
        this.propInvoice && this.propInvoice.locum_user_vat_registered
          ? taxed_gross_rate
          : total_gross_locum_wages;
      this.tax_amount =
        this.propInvoice && this.propInvoice.approved
          ? this.propInvoice.tax_amount
          : tax_amount;
      this.taxed_gross_rate = taxed_gross_rate;
      this.hasShiftError = hasError;
      this.sched_has_changes =
        this.$route.query.status === "issued" ? false : hasChanges;
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

    async toggleModal(approved) {
      if (this.isOOH) {
        this.toggle_modal = true;
        this.form.ea_code = this.practice ? this.practice.pcse_ea_code : "";
        this.form.national_insurance_number = null;
        this.form.sd_number = null;
        this.form.paying_reference = null;
        this.form.percentage_rate = 0;
        this.form.professional_nhs_expenses = 0;
        this.form.added_year_contributions = 0;
        this.form.added_early_retirement_contributions = 0;
        this.form.nhsps_employer_contributions = 0;
        this.form.nhs_pension_scheme_employing_authority_name = null;
      } else {
        this.save(approved);
      }
    },

    save(approved) {
      this.formError = [];

      this.shiftErrors = [];

      if (this.schedule.length) {
        this.schedule.forEach((sched, scheduleIndex) => {
          sched.shifts.forEach((shift, shiftIndex) => {
            if (!shift.has_absences) {
              if (!shift.final_time_start) {
                this.shiftErrors.push({
                  field: `final_time_start-s${scheduleIndex}-${shiftIndex}`,
                  message: "Final Start is required"
                });
              }

              if (!shift.final_time_end) {
                this.shiftErrors.push({
                  field: `final_time_end-s${scheduleIndex}-${shiftIndex}`,
                  message: "Final End is required"
                });
              }
            }

            if (
              shift.invoiced_break_in_minutes &&
              shift.final_time_start &&
              shift.final_time_end &&
              sched.date &&
              parseInt(shift.invoiced_break_in_minutes) >
                this.totalHours(
                  shift.final_time_start,
                  shift.final_time_end,
                  sched.date
                )
            ) {
              this.shiftErrors.push({
                field: `invoiced_break_in_minutes-s${scheduleIndex}-${shiftIndex}`,
                message: "Invalid break in minutes."
              });
            }
          });
        });
      }

      let notRequired = [
        "total_amount",
        "tax_amount",
        "hours",
        "minutes",
        "late_hours",
        "late_minutes"
      ];

      if (!this.isOOH || !approved) {
        notRequired.push(
          "ea_code",
          "national_insurance_number",
          "sd_number",
          "paying_reference",
          "percentage_rate",
          "professional_nhs_expenses",
          "added_year_contributions",
          "added_early_retirement_contributions",
          "nhsps_employer_contributions",
          "nhs_pension_scheme_employing_authority_name"
        );
      }

      const preferredDisplayName = [
        {
          field: "ea_code",
          display: "PCSE Code"
        },
        {
          field: "sd_number",
          display: "NHS Pension Scheme Membership Number"
        }
      ];

      this.Validate(this.form, notRequired, preferredDisplayName);

      if (!this.formError.length && !this.shiftErrors.length) {
        this.form.total_amount = this.total_gross_locum_wages;
        this.form.job_part_schedule_items.forEach(item => {
          item.approve = approved;
        });

        this.saveLoading = true;

        if (this.propInvoice.locum_user_vat_registered === true) {
          this.form.total_amount = this.taxed_gross_rate;
        } else {
          this.form.total_amount = this.total_gross_locum_wages;
        }

        this.form.tax_amount = this.tax_amount;

        this.$axios
          .$put(
            `/api/v1/practice/locum-invoices/${
              this.propId ? this.propId : this.$route.params.id
            }`,
            {
              ...this.form
            }
          )
          .then(res => {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: [`${res.message}`]
            });
            this.toggle_modal = false;
            this.$emit("updateInvoice", res.data.locum_invoice);
          })
          .catch(err => {
            console.log("err", err.response || err);
            if (
              err.response &&
              err.response.data &&
              err.response.data.error_messages
            ) {
              this.formError = err.response.data.error_messages;
            }
          })
          .finally(() => {
            this.saveLoading = false;
          });

        // for testing only
        // this.saveLoading = false
      }
    },

    waitingForLocumReply(item) {
      let count = this.$moment(item.disputed_by_locum_at).diff(
        item.disputed_by_practice_at,
        "seconds"
      );
      if (count < 0) {
        return true;
      }
      return false;
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
.accept-modal {
  position: fixed;
  background-color: white;
  z-index: 512;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.items-table {
  width: 733px;
}

.bg-gray {
  background-color: #707070;
}
</style>
