<template>
  <section class="relative max-w-3xl">
    <div class="flex items-center justify-end py-2">
      <label class="mx-1">Type:</label>
      <div
        class="text-xs sm:text-sm mx-1 py-2 px-3 border-2 rounded-lg font-bold flex items-center focus:outline-none bg-yellow-500 border-yellow-500"
      >Platform</div>
    </div>
    <!-- pdf form -->
    <div
      id="htmlpdf"
      class="relative max-w-3xl mb-2 md:mb-4 bg-white px-4 py-4 border shadow-md mb-32"
    >
      <AppLoading :loading="exportLoading" spinner :message="'Exporting'" />
      <AppLoading :loading="saveLoading" spinner />
      <!-- pdf header -->
      <div :ref="'pdf-header'" class="flex flex-col">
        <div class="text-xs sm:text-sm sm:text-right leading-normal">
          <div>{{ propInvoice.locum_user.name }}</div>
          <div>{{ propInvoice.address_line_1 }}</div>
          <div>{{ propInvoice.address_line_2 }}</div>
          <div>{{ propInvoice.address_line_3 }}</div>
          <div>{{ propInvoice.postcode }}</div>
          <div>Tel {{ propInvoice.mobile_number }}</div>
          <div>{{ propInvoice.locum_user.email }}</div>
          <div>{{ `UTR ${propInvoice.utr_number}` }}</div>
        </div>
        <div class="flex flex-wrap justify-between my-2">
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
      </div>

      <div class="overflow-auto">
        <div class="items-table">
          <!-- thead / items header -->
          <div :ref="'items-header'" class="flex justify-start">
            <!-- <div
              class="w-1/2 bg-gray-900 text-white px-4 py-1 font-semibold border-r-2 border-white"
            >
              Description
            </div>
            <div
              class="w-1/2 bg-gray-900 text-white px-4 py-1 font-semibold flex justify-between"
            >
              Total
            </div>-->
            <div
              class="w-full bg-gray-900 text-white px-4 py-1 font-semibold border-r-2 border-white"
            >Description</div>
          </div>
          <!-- items / selected invoice -->
          <div
            v-if="form.items && form.items.length > 0"
            :id="`invoice-item`"
            :ref="`invoice-item`"
            class="flex flex-col border-b-2 pb-2"
          >
            <!-- item description / total / dispute checkbox -->
            <!-- <div class="relative flex justify-start mt-2">
              <div class="w-1/2 text-xs sm:text-sm px-4 py-1 border-gray-300">
                {{ description }}
              </div>
              <div
                class="text-xs sm:text-sm border-gray-300 px-4 py-1 text-right w-1/2"
              >
                {{ total | currency }}
              </div>
            -->
            <div class="relative flex justify-start mt-2">
              <div class="w-full text-xs sm:text-sm px-4 py-1 border-gray-300">{{ description }}</div>
              <div
                v-if="(propInvoice && !['Paid','Approved'].includes(propInvoice.status))"
                class="flex items-center align-middle sticky right-0 bg-white shadow-md"
              >
                <div class="px-2 flex-col">
                  <AppInput
                    v-if="propInvoice.items[0].disputed"
                    v-model="form.items[0].dispute"
                    disabled
                    :type="'single-checkbox'"
                    :name="'disputed'"
                    :label="'Disputed'"
                  />
                  <AppInput
                    v-model="isApproved"
                    :disabled="propInvoice.items[0].approved || waitingForLocumReply(propInvoice.items[0])"
                    :type="'single-checkbox'"
                    :name="'approved'"
                    :label="'Approved'"
                  />
                  <div v-if="waitingForLocumReply(propInvoice.items[0])">
                    <div>Waiting for Locum Reply</div>
                  </div>
                </div>
              </div>
            </div>
            <!-- dispute invoice attendance forms -->
            <div
              v-if="form.items[0].dispute && isApproved === false"
              class="flex justify-start mt-2 px-2"
            >
              <div class="w-1/5 flex flex-col pr-2">
                <label for="absent_days">Days of absent</label>
                <input
                  v-model="form.items[0].absent_days"
                  type="number"
                  min="0"
                  name="absent_days"
                  class="border-b-2 focus:outline-none h-full p-2 py-3 sm:text-sm text-right text-xs w-full focus:border-yellow-500"
                  @keypress="isNumber($event)"
                />
              </div>
              <div class="w-1/5 flex flex-col pr-2">
                <label for="late_hours">Hours of late</label>
                <input
                  v-model="form.items[0].late_hours"
                  type="number"
                  min="0"
                  name="late_hours"
                  class="border-b-2 focus:outline-none h-full p-2 py-3 sm:text-sm text-right text-xs w-full focus:border-yellow-500"
                  @keypress="isNumber($event)"
                />
              </div>
              <div class="w-3/5 flex flex-col">
                <label for="final_hours">Final hours</label>
                <!-- <label for="final_hours">Final hours</label>
                <input
                  v-model="form.items[0].final_hours"
                  type="number"
                  min="0"
                  name="final_hours"
                  class="border-b-2 focus:outline-none h-full p-2 py-3 sm:text-sm text-right text-xs w-full focus:border-yellow-500"
                  @keypress="isNumber($event)"
                >-->
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
                  class="text-xs mx-2 text-red-500"
                  v-if="formError.find(item => item.field === 'hours') && formError.find(item => item.field === 'minutes')"
                >Final hours is required</p>
              </div>
            </div>
            <!-- disputed invoice update form -->
            <div
              v-if="form.items[0].dispute && isApproved === false"
              class="flex justify-start mt-2 px-2"
            >
              <div class="flex flex-col w-full px-2">
                <label for="remarks">Update remarks</label>
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
            <div class="w-full text-right">{{ total_amount | currency }}</div>
          </div>
        </div>
      </div>

      <div :ref="'days-worked'" class="flex flex-row flex-wrap justify-between px-2">
        <div class="w-full md:w-1/2 pr-1">
          <AppDate
            v-model="form.date_start"
            :name="'date_start'"
            :label="'Days worked from'"
            :error="formError.find(item => item.field === 'date_start')"
            :disabled="true"
          />
        </div>
        <div class="w-full md:w-1/2 pl-1">
          <AppDate
            v-model="form.date_end"
            :name="'date_end'"
            :label="'To'"
            :error="formError.find(item => item.field === 'date_end')"
            :disabled="true"
          />
        </div>
      </div>

      <!-- <div :ref="'items-total'" class="flex justify-between m-2 px-2">
        <span class="font-bold">Total</span>
        <div>
          <div class="flex justify-end">
            <div
              v-if="formError.find(item => item.field === 'total_amount')"
              class="rounded-lg bg-red-500 p-1 text-xs sm:text-sm text-white"
            >{{ formError.find(item => item.field === 'total_amount').message }}</div>
          </div>
          £ {{ total_amount | currency }}
        </div>
      </div>-->

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
      </div>
    </div>

    <div class="flex justify-start items-center mb-6">
      <AppButton
        v-if="propInvoice && !['Approved', 'Paid'].includes(propInvoice.status) && allowToBill"
        class="m-1"
        :label="'Save changes'"
        :inStyle="'padding:5px 14px;font-size:1em'"
        :disabled="saveLoading"
        @click="save(false)"
      />
      <AppButton
        v-if="propInvoice && propInvoice.status !== 'Draft'"
        class="m-1"
        :label="'View as PDF'"
        :inStyle="'padding:5px 14px;font-size:1em'"
        @click="viewAsPdf(propInvoice.id)"
      />
    </div>
  </section>
</template>
<script>
import AppLoading from "@/components/Base/AppLoading";
import AppButton from "@/components/Base/AppButton";
import AppDate from "@/components/Base/AppDate";
import AppInput from "@/components/Base/AppInput";
import AppFilterSearch from "@/components/Base/AppFilterSearch";
import AppFormError from "@/components/Base/AppFormError";
import { mixin as clickaway } from "vue-clickaway";
export default {
  components: {
    AppLoading,
    AppButton,
    AppDate,
    AppInput,
    AppFilterSearch,
    AppFormError
  },
  mixins: [clickaway],
  props: {
    propInvoice: {
      type: Object
    },
    propId: null
  },
  data() {
    return {
      exportLoading: false,
      saveLoading: false,
      form: {
        items: [],
        total_amount: 0,
        date_start: null,
        date_end: null,
        minutes: 0,
        hours: 0
      },
      formError: [],

      isApproved: false,
      allowToBill: false
    };
  },
  computed: {
    subTotal() {
      let hours = this.form.hours * 60 + this.form.minutes;

      let type = this.propInvoice.items[0].job_part.job.locum_detail_rate_type
        .name;
      let total = 0;
      switch (type) {
        case "Per Hour":
          total = this.propInvoice.items[0].job_part.job.rate * hours;
          break;
        case "Per Half Day Session":
        case "Per Whole Day Session":
          total =
            (this.propInvoice.items[0].job_part.job.rate /
              this.propInvoice.items[0].job_part.job.total_hours) *
            hours;
          break;
      }
      return total;
    },
    totalAmount() {
      let total;
      if (this.form.items && this.form.items.length > 0) {
        total = this.form.items[0].total;
        if (this.propInvoice) {
          total =
            total - this.propInvoice.ni_amount - this.propInvoice.paye_amount;
        }
        return total;
      }
      return 0;
    },
    total_amount() {
      // let hours =
      //   this.form.items.length > 0 ? this.form.items[0].final_hours : 0;

      let hours = this.form.hours * 60 + this.form.minutes;

      let type = this.propInvoice.items[0].job_part.job.locum_detail_rate_type
        .name;
      let total = 0;
      switch (type) {
        case "Per Hour":
          total = this.propInvoice.items[0].job_part.job.rate * hours;
          break;
        case "Per Half Day Session":
        case "Per Whole Day Session":
          total =
            (this.propInvoice.items[0].job_part.job.rate /
              this.propInvoice.items[0].job_part.job.total_hours) *
            hours;
          break;
      }
      if (this.propInvoice.status === "Paid") {
        total =
          total - this.propInvoice.ni_amount - this.propInvoice.paye_amount;
      }
      return total;
    },
    description() {
      console.log(this.form.hours);
      let hour =
        parseInt(this.form.hours) === 0 || this.form.hours === ""
          ? ""
          : parseInt(this.form.hours) > 1
          ? "hours"
          : "hour";
      let minute =
        parseInt(this.form.minutes) === 0 || this.form.minutes === ""
          ? ""
          : this.form.minutes > 1
          ? "minutes"
          : "minute";
      let hasAnd = hour > 0 ? true : false;
      return `Job number ${
        this.propInvoice.items[0].job_part.job_part_number
      } ${this.propInvoice.items[0].job_part.job.type}
        Job at £${this.propInvoice.items[0].job_part.job.rate} ${
        this.propInvoice.items[0].job_part.job.locum_detail_rate_type.name
      }
        from ${this.propInvoice.date_start} to ${this.propInvoice.date_end}
        / ${this.propInvoice.items[0].job_part.job.shift.name} / Total of ${
        this.form.hours > 0 ? this.form.hours : ""
      } ${hour} ${hasAnd ? "and" : ""} ${
        this.form.minutes > 0 ? this.form.minutes : ""
      } ${minute}`;
    },
    total() {
      let hours =
        this.form.items.length > 0 ? this.form.items[0].final_hours : 0;

      let type = this.propInvoice.items[0].job_part.job.locum_detail_rate_type
        .name;
      let total = 0;
      switch (type) {
        case "Per Hour":
          total = this.propInvoice.items[0].job_part.job.rate * hours;
          break;
        case "Per Half Day Session":
        case "Per Whole Day Session":
          total =
            (this.propInvoice.items[0].job_part.job.rate /
              this.propInvoice.items[0].job_part.job.total_hours) *
            hours;
          break;
      }
      return total;
    }
  },
  watch: {
    isApproved(value) {
      if (value) {
        this.form.items[0].description = `Job number ${this.propInvoice.items[0].job_part.job_part_number} ${this.propInvoice.items[0].job_part.job.type} Job at £${this.propInvoice.items[0].job_part.job.rate} ${this.propInvoice.items[0].job_part.job.locum_detail_rate_type.name} from ${this.propInvoice.items[0].job_part.date_start} to ${this.propInvoice.items[0].job_part.date_end} / ${this.propInvoice.items[0].job_part.job.shift.name} / Total hours of ${this.propInvoice.items[0].final_hours}`;
        this.form.items[0].absent_days = this.propInvoice.items[0].absent_days;
        this.form.items[0].late_hours = this.propInvoice.items[0].late_hours;
        this.form.items[0].final_hours = this.propInvoice.items[0].final_hours;
        this.form.items[0].remarks = this.propInvoice.items[0].remarks;
        this.form.items[0].total =
          this.propInvoice.items[0].job_part.job.locum_detail_rate_type.name ===
          "Per Hour"
            ? this.propInvoice.items[0].job_part.job.rate *
              this.propInvoice.items[0].final_hours
            : this.propInvoice.items[0].job_part.job.rate;
        this.form.total_amount =
          this.propInvoice.items[0].job_part.job.locum_detail_rate_type.name ===
          "Per Hour"
            ? this.propInvoice.items[0].job_part.job.rate *
              this.propInvoice.items[0].final_hours
            : this.propInvoice.items[0].job_part.job.rate;
      } else if (value === false) {
        this.form.items[0].description = this.propInvoice.items[0].description;
        this.form.items[0].absent_days = this.propInvoice.items[0].absent_days;
        this.form.items[0].late_hours = this.propInvoice.items[0].late_hours;
        this.form.items[0].final_hours = this.propInvoice.items[0].final_hours;
        this.form.items[0].remarks = this.propInvoice.items[0].remarks;
        this.form.items[0].total = this.propInvoice.items[0].total;
      }
      this.form.items[0].approve = value;
    }
  },
  mounted() {
    if (this.propInvoice) {
      this.form.date_start = this.propInvoice.date_start;
      this.form.date_end = this.propInvoice.date_end;

      // Per Hour = (Final Hours + (Final Minutes / 60)) * Rate
      // Per Session = (Total Hours + (Total Minutes / 60)) / Rate * (Final Hours + (Final Minutes / 60))

      let total =
        this.propInvoice.items[0].job_part.job.locum_detail_rate_type.name ===
        "Per Hour"
          ? this.propInvoice.items[0].job_part.job.rate *
            (this.propInvoice.items[0].job_part.final_hours / 60)
          : (this.propInvoice.items[0].job_part.job.rate /
              (this.propInvoice.items[0].job_part.job.total_hours / 60)) *
            (this.propInvoice.items[0].job_part.final_hours / 60);

      this.form.items = [
        {
          type: "Job Part",
          job_part_id: this.propInvoice.items[0].job_part.id,
          description: this.propInvoice.items[0].description,
          total: total,
          dispute: this.propInvoice.items[0].disputed,
          approve: this.propInvoice.items[0].approved,
          absent_days: this.propInvoice.items[0].absent_days,
          final_hours: this.propInvoice.items[0].final_hours,
          late_hours: this.propInvoice.items[0].late_hours,
          remarks: this.propInvoice.items[0].remarks
        }
      ];

      this.form.total_amount = total
        .toFixed(2)
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");

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
    this.form.minutes = this.form.items[0].final_hours % 60;
  },
  methods: {
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
      if (
        [0, "0"].includes(this.form.hours) &&
        [0, "0"].includes(this.form.minutes)
      ) {
        this.formError.push({
          field: "minutes",
          message: "Minutes is required"
        });
        this.formError.push({
          field: "hours",
          message: "Hours is required"
        });
      } else {
        this.form.hours = !this.form.hours ? 0 : this.form.hours;
        this.form.minutes = !this.form.minutes ? 0 : this.form.minutes;
        this.form.items[0].final_hours =
          this.form.hours * 60 + parseInt(this.form.minutes);
      }
      this.Validate(this.form, ["total_amount", "hours", "minutes"]);
      if (!this.formError.length) {
        this.form.items[0].description = this.description;
        this.form.items[0].total = this.total;
        this.form.total_amount = this.total_amount;
        // return;
        this.saveLoading = true;
        this.$axios
          .$put(
            `/api/v1/practice/locum-invoices/${
              this.propId ? this.propId : this.$route.params.id
            }`,
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
          })
          .finally(() => {
            this.saveLoading = false;
          });
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
      // this.$axios
      //   .$post(`/api/v1/locum/locum-invoice-forms`, {
      //     locum_invoice_id: invoiceId
      //   })
      //   .then(res => {
      //     console.log(res);
      //   });
      window.open(
        `${process.env.API_URL}/api/v1/locum-invoices/${invoiceId}/pdf`
      );
    },
    async exportToPdf() {
      this.exportLoading = true;
      if (process.client) {
        document.body.style.cursor = "wait";
      }

      let doc = this.$jspdf("p", "mm");
      let pageHeight = 1020;
      let yPosition = 0;

      // PDF HEADER
      const canvasPdfHeader = await this.$html2canvas(this.$refs["pdf-header"]);
      const imgWidthPdfHeader = 210;
      const imgHeightPdfHeader =
        (canvasPdfHeader.height * imgWidthPdfHeader) / canvasPdfHeader.width;
      const imgDataPdfHeader = canvasPdfHeader.toDataURL("image/png");

      pageHeight = pageHeight - this.$refs["pdf-header"].offsetHeight;

      doc.addImage(
        imgDataPdfHeader,
        "PNG",
        0,
        yPosition,
        imgWidthPdfHeader,
        imgHeightPdfHeader
      );

      yPosition = yPosition + imgHeightPdfHeader;

      // ITEMS HEADER
      const canvasItemsHeader = await this.$html2canvas(
        this.$refs["items-header"]
      );
      const imgWidthItemsHeader = 210;
      const imgHeightItemsHeader =
        (canvasItemsHeader.height * imgWidthItemsHeader) /
        canvasItemsHeader.width;
      const imgDataItemsHeader = canvasItemsHeader.toDataURL("image/png");

      pageHeight = pageHeight - this.$refs["items-header"].offsetHeight;

      doc.addImage(
        imgDataItemsHeader,
        "PNG",
        0,
        yPosition,
        imgWidthItemsHeader,
        imgHeightItemsHeader
      );

      yPosition = yPosition + imgHeightItemsHeader;

      // ITEMS
      const canvasItems = await this.$html2canvas(this.$refs["invoice-item"]);

      const imgWidthItems = 210;
      const imgHeightItems =
        (canvasItems.height * imgWidthItems) / canvasItems.width;
      const imgDataItems = canvasItems.toDataURL("image/png");

      pageHeight = pageHeight - this.$refs["invoice-item"].offsetHeight;

      doc.addImage(
        imgDataItems,
        "PNG",
        0,
        yPosition,
        imgWidthItems,
        imgHeightItems
      );

      yPosition = yPosition + imgHeightItems;

      // let totalSelectedJobParts = this.selectedJobParts.length;

      // for (let i = 0; i < totalSelectedJobParts; i++) {
      //   // minus the current item invoice height to the pageHeight
      //   pageHeight = pageHeight - this.$refs[`item-${i}`][0].offsetHeight;
      //   // if all pageHeight is used, add page
      //   if (pageHeight < 0) {
      //     pageHeight = 1020;
      //     yPosition = 0;
      //     doc.addPage();
      //     // add header to every new page, also subtract its height to page height
      //     doc.addImage(
      //       imgDataItemsHeader,
      //       "PNG",
      //       0,
      //       yPosition,
      //       imgWidthItemsHeader,
      //       imgHeightItemsHeader
      //     );

      //     yPosition = yPosition + imgHeightItemsHeader;

      //     pageHeight = pageHeight - this.$refs["items-header"].offsetHeight;
      //     pageHeight = pageHeight - this.$refs[`item-${i}`][0].offsetHeight;
      //   }

      //   // draw canvas
      //   let canvasItem = await this.$html2canvas(this.$refs[`item-${i}`][0]);
      //   let imgWidthItem = 210;
      //   let imgHeightItem =
      //     (canvasItem.height * imgWidthItem) / canvasItem.width;
      //   let imgDataItem = canvasItem.toDataURL("image/png");

      //   // add image
      //   doc.addImage(
      //     imgDataItem,
      //     "PNG",
      //     0,
      //     yPosition,
      //     imgWidthItem,
      //     imgHeightItem
      //   );

      //   yPosition = yPosition + imgHeightItem;
      // }

      // sum up their offsetHeight
      let daysWorkedOffsetHeight = this.$refs["days-worked"].offsetHeight;
      let itemsTotalOffsetHeight = this.$refs["items-total"].offsetHeight;
      let pdfFooterOffsetHeight = this.$refs["pdf-footer"].offsetHeight;

      let totalOffsetHeight =
        daysWorkedOffsetHeight + itemsTotalOffsetHeight + pdfFooterOffsetHeight;

      pageHeight = pageHeight - totalOffsetHeight;

      // DAYS WORKED
      const canvasDaysWorked = await this.$html2canvas(
        this.$refs["days-worked"]
      );
      const imgWidthDaysWorked = 210;
      const imgHeightDaysWorked =
        (canvasDaysWorked.height * imgWidthDaysWorked) / canvasDaysWorked.width;
      const imgDataDaysWorked = canvasDaysWorked.toDataURL("image/png");

      // ITEMS TOTAL
      const canvasItemsTotal = await this.$html2canvas(
        this.$refs["items-total"]
      );
      const imgWidthItemsTotal = 210;
      const imgHeightItemsTotal =
        (canvasItemsTotal.height * imgWidthItemsTotal) / canvasItemsTotal.width;
      const imgDataItemsTotal = canvasItemsTotal.toDataURL("image/png");

      // PDF FOOTER
      const canvasPdfFooter = await this.$html2canvas(this.$refs["pdf-footer"]);
      const imgWidthPdfFooter = 210;
      const imgHeightPdfFooter =
        (canvasPdfFooter.height * imgWidthPdfFooter) / canvasPdfFooter.width;
      const imgDataPdfFooter = canvasPdfFooter.toDataURL("image/png");

      if (pageHeight < 0) {
        pageHeight = 1020;
        doc.addPage();
      }

      yPosition =
        295 - (imgHeightDaysWorked + imgHeightItemsTotal + imgHeightPdfFooter);

      doc.addImage(
        imgDataDaysWorked,
        "PNG",
        0,
        yPosition,
        imgWidthDaysWorked,
        imgHeightDaysWorked
      );

      yPosition = yPosition + imgHeightDaysWorked;

      doc.addImage(
        imgDataItemsTotal,
        "PNG",
        0,
        yPosition,
        imgWidthItemsTotal,
        imgHeightItemsTotal
      );

      yPosition = yPosition + imgHeightItemsTotal;

      doc.addImage(
        imgDataPdfFooter,
        "PNG",
        0,
        yPosition,
        imgWidthPdfFooter,
        imgHeightPdfFooter
      );

      yPosition = yPosition + imgHeightPdfFooter;

      doc.save("test.pdf");
      this.exportLoading = false;
      if (process.client) {
        document.body.style.cursor = "auto";
      }
    }
  }
};
</script>
<style scoped>
.items-table {
  width: 733px;
}
</style>
