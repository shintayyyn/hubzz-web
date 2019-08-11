<template>
  <div class="flex flex-row flex-wrap justify-start">
    <div class="p-1 w-full sm:w-1/4 order-1 sm:order-2">
      <div class="rounded-lg shadow-md p-4 flex flex-col">
        <AppSelect
          v-model="tax_year_end"
          :name="'tax_year_end'"
          :label="'Tax year end'"
          :placeholder="'Select...'"
          :items="yearLists"
        />
      </div>
    </div>
    <div class="p-1 w-full sm:w-3/4 order-2 sm:order-1">
      <div class="overflow-x-auto overflow-y-hidden">
        <table>
          <thead>
            <tr class="text-xs sm:text-sm text-left">
              <th>Month / Year</th>
              <th>Fees charged</th>
              <th>Expenses Charged</th>
              <th>Employers Superannuation</th>
              <th>Month total</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="lists.length === 0">
              <tr>
                <td colspan="10" class="text-center">No invoice has been raised for this year</td>
              </tr>
            </template>
            <template v-else v-for="(invoice, index) in lists">
              <tr :key="invoice.id" class="__job-card shadow-md cursor-pointer text-xs text-left" @click="showTax(item.id)">
                <td>{{invoice.month_year}}</td>
                <td>{{invoice.fees_charged}}</td>
                <td>£ {{invoice.expenses_charged}}</td>
                <td>£ {{invoice.employers_superannuation}}</td>
                <td>£ {{invoice.month_total}}</td>
              </tr>
              <tr :key="`${invoice.id}-${index}`">
                <td></td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
const lists = [
  {
    id: 1,
    month_year: 'June 2019',
    fees_charged: '2.00',
    expenses_charged: '369.00',
    employers_superannuation: '0.00',
    month_total: '31,095.00'
  },
  {
    id: 2,
    month_year: 'June 2019',
    fees_charged: '2.00',
    expenses_charged: '369.00',
    employers_superannuation: '0.00',
    month_total: '31,095.00'
  },
  {
    id: 3,
    month_year: 'June 2019',
    fees_charged: '2.00',
    expenses_charged: '369.00',
    employers_superannuation: '0.00',
    month_total: '31,095.00'
  },
]
const yearLists = [
  {
    value: '2020-08-01', label: '2 June, 2020'
  },
  {
    value: '2020-08-01', label: '2 June, 2020'
  },
  {
    value: '2020-08-01', label: '2 June, 2020'
  },
]
import AppSelect from '@/components/Base/AppSelect'
export default {
  components: {
    AppSelect
  },
  data() {
    return {
      lists,
      yearLists,
      tax_year_end: ''
    }
  },
  methods: {
    showTax(id) {
      
    }
  }
}
</script>


