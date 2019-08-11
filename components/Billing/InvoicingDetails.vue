<template>
  <section>
    <div class="flex flex-row flex-wrap justify-start">
      <div class="w-full md:w-1/2 p-2">
        <p style="font-family:Nunito" class="text-sm font-bold">Bank account</p>
        <div class="border-solid rounded-lg shadow-lg mt-5 p-10">
          <div
            class="mb-4 border-b border-b-2 border-grey py-2"
            :class="{'border-yellow-400':setFocus === 'account_name', 'border-red-300': formError.includes('account_name')}"
          >
            <label for="account_name" class="block text-sm mb-2">Account Name</label>
            <em
              v-if="formError.includes('account_name')"
              class="text-xs text-red-400 float-right"
            >Required</em>
            <input
              @focus="setFocus = 'account_name'"
              @blur="setFocus = ''"
              v-model="form.account_name"
              type="text"
              name="account_name"
              id="account_name"
              placeholder="The business name that's registered to the bank account"
              class="appearance-none bg-transparent border-none w-full text-grey-darker mr-3 py-1 px-2 leading-tight focus:outline-none"
            />
          </div>
          <div
            class="mb-4 border-b border-b-2 border-grey py-2"
            :class="{'border-yellow-400':setFocus === 'bank_name', 'border-red-300': formError.includes('bank_name')}"
          >
            <label for="bank_name" class="block text-sm mb-2">Bank Name</label>
            <em
              v-if="formError.includes('bank_name')"
              class="text-xs text-red-400 float-right"
            >Required</em>
            <input
              @focus="setFocus = 'bank_name'"
              @blur="setFocus = ''"
              v-model="form.bank_name"
              type="text"
              name="bank_name"
              id="bank_name"
              placeholder="The name of your bank"
              class="appearance-none bg-transparent border-none w-full text-grey-darker mr-3 py-1 px-2 leading-tight focus:outline-none"
            />
          </div>
          <div
            class="mb-4 border-b border-b-2 border-grey py-2"
            :class="{'border-yellow-400':setFocus === 'sort_code', 'border-red-300': formError.includes('sort_code')}"
          >
            <label for="sort_code" class="block text-sm mb-2">Sort code</label>
            <em
              v-if="formError.includes('sort_code')"
              class="text-xs text-red-400 float-right"
            >Required</em>
            <input
              @focus="setFocus = 'sort_code'"
              @blur="setFocus = ''"
              v-model="form.sort_code"
              type="text"
              name="sort_code"
              id="sort_code"
              placeholder="e.g. 12-34-56"
              class="appearance-none bg-transparent border-none w-full text-grey-darker mr-3 py-1 px-2 leading-tight focus:outline-none"
            />
          </div>
          <div
            class="mb-4 border-b border-b-2 border-grey py-2"
            :class="{'border-yellow-400':setFocus === 'account_number', 'border-red-300': formError.includes('account_number')}"
          >
            <label for="account_number" class="block text-sm mb-2">Account number</label>
            <em
              v-if="formError.includes('account_number')"
              class="text-xs text-red-400 float-right"
            >Required</em>
            <input
              @focus="setFocus = 'account_number'"
              @blur="setFocus = ''"
              v-model="form.account_number"
              type="text"
              name="account_number"
              id="account_number"
              placeholder="e.g. 12-34-56"
              class="appearance-none bg-transparent border-none w-full text-grey-darker mr-3 py-1 px-2 leading-tight focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div class="w-full md:w-1/2 p-2">
        <p style="font-family:Nunito" class="text-sm font-bold">Details</p>
        <div class="border-solid rounded-lg shadow-lg mt-5 p-10">
          <label for="tax_year_end_month" class="text-sm mb-2">Your tax year end date</label>
          <select
            :size="setFocus === 'tax_year_end_month' ? 5 : 0"
            name="tax_year_end_month"
            id="tax_year_end_month"
            class="p-2 font-semibold"
            v-model="form.tax_year_end_month"
          >
            <option v-for="(item, index) in months" :key="index" :value="item">{{item}}</option>
          </select>
          <select
            :size="setFocus === 'tax_year_end_date' ? 5 : 0"
            name="tax_year_end_date"
            id="tax_year_end_date"
            class="p-2 font-semibold"
            v-model="form.tax_year_end_date"
          >
            <option v-for="(item, index) in daysInMonth" :key="index" :value="item">{{item}}</option>
          </select>

          <label for="job_type" class="block text-sm mb-2 mt-10">Are you...?</label>
          <select
            :size="setFocus === 'job_type' ? 5 : 0"
            name="job_type"
            id="job_type"
            class="p-2 font-semibold w-full"
            v-model="form.type"
          >
            <option v-for="(item, index) in lists" :key="index" :value="item">{{item}}</option>
          </select>

          <div
            class="mb-4 border-b border-b-2 border-grey py-2 mt-5"
            :class="{'border-yellow-400':setFocus === 'utr_number', 'border-red-300': formError.includes('utr_number')}"
          >
            <label for="utr_number" class="block text-sm mb-2">UTR Number</label>
            <em
              v-if="formError.includes('utr_number')"
              class="text-xs text-red-400 float-right"
            >Required</em>
            <input
              @focus="setFocus = 'utr_number'"
              @blur="setFocus = ''"
              v-model="form.utr_number"
              type="text"
              name="utr_number"
              id="utr_number"
              placeholder="The name of your bank"
              class="appearance-none bg-transparent border-none w-full text-grey-darker mr-3 py-1 px-2 leading-tight focus:outline-none"
            />
          </div>
        </div>

        <div class="mt-4">
          <button
            class="bg-yellow-400 hover:text-white focus:outline-none text-black font-bold text-xl p-6 rounded-lg shadow-md"
            @click.prevent="save"
          >Save changes</button>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
const lists = ["Self-employed", "Limited company"];
export default {
  data() {
    return {
      months,
      lists,
      selectedYear: new Date().getFullYear(),
      daysInMonth: [],
      form: {
        account_name: "",
        bank_name: "",
        sort_code: "",
        account_number: "",
        tax_year_end_month: "",
        tax_year_end_date: "",
        type: "",
        utr_number: ""
      },
      setFocus: "",
      formError: []
    };
  },
  watch: {
    "form.tax_year_end_month"(value) {
      let index = this.months.findIndex(item => item === value);
      this.getDaysInMonth(index, this.selectedYear);
    }
  },
  created() {
    // get current month and year
    let d = new Date();
    let selectedMonth = d.getMonth();

    // get days in current month
    this.getDaysInMonth(selectedMonth, this.selectedYear);

    this.form.tax_year_end_month = this.months[selectedMonth];
    this.form.tax_year_end_date = 1;
    this.form.type = this.lists[0];
  },
  methods: {
    getDaysInMonth(month, selectedYear) {
      let date = new Date(selectedYear, month, 1);
      let days = [];
      while (date.getMonth() === month) {
        days.push(new Date(date));
        date.setDate(date.getDate() + 1);
      }
      let daysInMonth = [];
      days.forEach(day => {
        daysInMonth.push(day.getDate());
      });
      this.daysInMonth = daysInMonth;
    },
    save() { }
  }
};
</script>
