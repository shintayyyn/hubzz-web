<template>
  <div>
    <!-- responsive table -->
    <!-- <div class="flex flex-col">
      <div class="hidden md:flex font-bold my-4">
        <span class="w-1/6 pl-4">Practice/Surgery</span>
        <span class="text-center w-1/6">Issued</span>
        <span class="text-center w-1/6">Hubzz</span>
        <span class="w-1/6">Invoice Number</span>
        <span class="w-1/6">Job Number</span>
        <span class="text-center w-1/12">Amount</span>
        <span class="text-center w-1/6">Status</span>
      </div>
      <div class="flex flex-col md:flex-row bg-gray-100 hover:bg-gray-200 rounded-lg py-4 px-4 md:px-0 mb-3 leading-none text-sm border-l-8 border-yellow-500 md:border-none shadow-lg">
        <div class="flex flex-col md:flex-row md:items-center w-full md:w-1/6 md:pl-4 py-2 md:py-0">
          <span class="md:hidden font-bold">PRACTICE/SURGERY</span>
          <span>OLDHAM FAMILY PRACTICE</span>
        </div>
        <div class="flex flex-col md:flex-row md:items-center justify-center md:text-center w-full md:w-1/6 py-2 md:py-0">
          <span class="md:hidden font-bold">Issued</span>
          <span>10/08/2018 11:06:40</span>
        </div>
        <div class="flex flex-col md:flex-row md:items-center justify-center w-full md:w-1/6 py-2 md:py-0">
          <span class="md:hidden font-bold">Hubzz</span>
          <span>HUBZZ</span>
        </div>
        <div class="flex flex-col md:flex-row md:items-center w-full md:w-1/6 py-2 md:py-0">
          <span class="md:hidden font-bold">Invoice Number</span>
          <span>0000000004</span>
        </div>
        <div class="flex flex-col md:flex-row md:items-center w-full md:w-1/6 py-2 md:py-0">
          <span class="md:hidden font-bold">Job Number</span>
          <span>H000000001-1</span>
        </div>
        <div class="flex flex-col md:flex-row md:items-center justify-center w-full md:w-1/12 py-2 md:py-0">
          <span class="md:hidden font-bold">Amount</span>
          <span>£ 40</span>
        </div>
        <div class="flex flex-col md:flex-row md:items-center justify-center w-full md:w-1/6 py-2 md:py-0">
          <span class="md:hidden font-bold">Status</span>
          <span>Issued</span>
        </div>
      </div>
    </div> -->

    <!-- overflow table -->
    <div class="__jobs-section">
      <h1>Invoices</h1>
      <div class="overflow-x-auto">
        <div class="overflow-x-auto overflow-y-hidden">
          <table>
            <thead>
              <tr class="text-xs sm:text-sm text-left">
                <th>Practice / Surgery</th>
                <th class="cursor-pointer">
                  Issued
                  <svgicon class="inline align-baseline" name="sort" height="12" width="12" />
                </th>
                <th>Hubzz</th>
                <th>Invoice number</th>
                <th>Job numbers</th>
                <th>£ Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <!-- <template v-if="getPracticeInvoices.length === 0">
                <tr>
                  <td
                    colspan="8"
                    class="absolute inset-x-auto md:static md:text-center"
                  >You don't have any invoice/s yet</td>
                </tr>
              </template> -->
              <template >
                <tr class="__job-card shadow-md cursor-pointer text-xs text-left">
                  <td>OLDHAM FAMILY PRACTICE</td>
                  <td>10/08/2018 11:06:40</td>
                  <td>HUBZZ</td>
                  <td>0000000004</td>
                  <td>H000000001-1
                    <!-- <div v-for="(item, index) in invoice.items" :key="index">{{item.job_part.job_part_number}}</div> -->
                  <td>£ 40</td>
                  <td>Issued</td>
                  <td class="text-center">
                    <button
                      v-text="'Mark as paid'"
                      class="px-2 py-3 text-white rounded-lg focus:outline-none bg-green-600 hover:bg-green-700"
                    ></button>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },
};
</script>