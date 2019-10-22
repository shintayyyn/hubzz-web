<template>
  <div>
    <AppTable
      :total="invoices.length"
      :items="invoices"
      :loading="loading"
      :currentPage="current_page"
      :perPage="params.limit"
      :columns="columns"
      :orderBy="params.order_by"
    ></AppTable>
  </div>
</template>
<script>
import AppTable from "@/components/Base/AppTable";
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },
  components: {
    AppTable
  },
  data() {
    return {
      totalInvoices: 0,
      // static data
      invoices: [
        {
          practice: 'OLDHAM FAMILY PRACTICE',
          issued: '10/08/2018 11:06:40',
          hubzz: 'hubzz',
          invoice_number: '000000001',
          job_numbers: 'H0000000002-1',
          total_amount: '£40',
          status: 'Issued'
        },
        {
          practice: 'OLDHAM FAMILY PRACTICE',
          issued: '10/08/2018 11:06:40',
          hubzz: 'hubzz',
          invoice_number: '000000002',
          job_numbers: 'H0000000005-2',
          total_amount: '£40',
          status: 'Issued'
        },
        {
          practice: 'OLDHAM FAMILY PRACTICE',
          issued: '10/08/2018 11:06:40',
          hubzz: 'hubzz',
          invoice_number: '000000003',
          job_numbers: 'H0000000004',
          total_amount: '£40',
          status: 'Issued'
        },
        {
          practice: 'OLDHAM FAMILY PRACTICE',
          issued: '10/08/2018 11:06:40',
          hubzz: 'hubzz',
          invoice_number: '000000004',
          job_numbers: 'H0000000002-1',
          total_amount: '£40',
          status: 'Issued'
        },
        {
          practice: 'OLDHAM FAMILY PRACTICE',
          issued: '10/08/2018 11:06:40',
          hubzz: 'hubzz',
          invoice_number: '000000005',
          job_numbers: 'H0000000005-2',
          total_amount: '£40',
          status: 'Issued'
        }
      ],
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
          name: "Practice / Surgery",
          dataIndex: "practice",
          class: "text-left"
        },
        {
          name: "Issued",
          dataIndex: "issued",
          class: "text-center localDate",
          sortable: true
        },
        {
          name: "Hubzz",
          dataIndex: "hubzz",
          class: "text-center"
        },
        {
          name: "Invoice number",
          dataIndex: "invoice_number",
        },
        {
          name: "Job numbers",
          dataIndex: "job_numbers",
        },
        {
          name: "£ Amount",
          dataIndex: "total_amount",
          class: "text-center"
        },
        {
          name: "Status",
          dataIndex: "status",
          class: "text-center"
        }
      ]
    };
  },
};
</script>