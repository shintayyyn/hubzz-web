<template>
  <div class="flex flex-row flex-wrap justify-start">
    <div class="pl-4 w-full sm:w-1/4 order-1 sm:order-2">
      <div class="rounded-lg shadow-md p-4 flex flex-col">
        <AppInput
          v-model="tax_year_end"
          :type="'select'"
          :name="'tax_year_end'"
          :label="'Tax year end'"
          :placeholder="'Select...'"
          :items="yearLists"
        />
      </div>
    </div>
    <div class="w-full sm:w-3/4 order-2 sm:order-1">
      <AppTable
        :total="lists.length"
        :items="lists"
        :loading="loading"
        :currentPage="current_page"
        :perPage="params.limit"
        :columns="columns"
        :orderBy="params.order_by"
        :sticky="'first'"
        @show="showTax"
      ></AppTable>
      <!-- <div class="overflow-x-auto overflow-y-hidden">
        <table>
          <thead>
            <tr class="text-xs sm:text-sm text-left">
              <th>Month / Year</th>
              <th class="text-center">Fees charged</th>
              <th class="text-center">Expenses Charged</th>
              <th class="text-center">Employers Superannuation</th>
              <th class="text-center">Month total</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="lists.length === 0">
              <tr>
                <td colspan="10" class="text-center">No invoice has been raised for this year</td>
              </tr>
            </template>
            <template v-else v-for="(invoice, index) in lists">
              <tr
                :key="invoice.id"
                class="cursor-pointer text-xs text-left"
                @click="showTax(invoice.id)"
              >
                <td>{{invoice.month_year}}</td>
                <td class="text-center">{{invoice.fees_charged}}</td>
                <td class="text-center">£ {{invoice.expenses_charged}}</td>
                <td class="text-center">£ {{invoice.employers_superannuation}}</td>
                <td class="text-center">£ {{invoice.month_total}}</td>
              </tr>
            </template>
          </tbody>
        </table>
      </div> -->
    </div>
  </div>
</template>
<script>
const lists = [
  {
    id: 1,
    month_year: "June 2019",
    fees_charged: "2.00",
    expenses_charged: "369.00",
    employers_superannuation: "0.00",
    month_total: "31,095.00"
  },
  {
    id: 2,
    month_year: "June 2019",
    fees_charged: "2.00",
    expenses_charged: "369.00",
    employers_superannuation: "0.00",
    month_total: "31,095.00"
  },
  {
    id: 3,
    month_year: "June 2019",
    fees_charged: "2.00",
    expenses_charged: "369.00",
    employers_superannuation: "0.00",
    month_total: "31,095.00"
  }
];
const yearLists = [
  {
    value: "2020-08-01",
    label: "2 June, 2020"
  },
  {
    value: "2020-08-01",
    label: "2 June, 2020"
  },
  {
    value: "2020-08-01",
    label: "2 June, 2020"
  }
];
import AppInput from "@/components/Base/AppInput";
import AppTable from "@/components/Base/AppTable";
export default {
  components: {
    AppInput,
    AppTable
  },
  data() {
    return {
      lists,
      yearLists,
      tax_year_end: "",
      // table
      totalInvoices: 0,
      loading: false,
      current_page: 1,
      //
      params: {
        offset: 0,
        limit: 5,
        status: "Paid",
        order_by: ["date_created:desc"]
      },
      columns: [
        {
          name: "Month / Year",
          dataIndex: "month_year",
        },
        {
          name: "Fees Charged",
          dataIndex: "fees_charged",
          class: "text-center",
        },
        {
          name: "Expenses Charge",
          dataIndex: "expenses_charged",
          class: "text-center"
        },
        {
          name: "Employers Superannuation",
          dataIndex: "employers_superannuation",
          class: "text-center"
        },
        {
          name: "Month total",
          dataIndex: "month_total",
          class: "text-center"
        }
      ]
    };
  },
  methods: {
    showTax(id) {
      console.log("id:", id);
    }
  }
};
</script>
<style>
