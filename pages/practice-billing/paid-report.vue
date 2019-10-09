<template>
  <div>
    <div class="__jobs-section">
      <h1>Invoices</h1>
      <div class="overflow-x-auto">
        <div class="overflow-x-auto overflow-y-hidden p-2">
          <table>
            <thead>
              <tr class="text-xs sm:text-sm text-left">
                <th>Locum</th>
                <th>Invoice number</th>
                <th>Job numbers</th>
                <th>£ Paid</th>
                <th>Date paid</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="getPracticeInvoices.length === 0">
                <tr>
                  <td colspan="10" class="text-center">You didn't have any paid invoice/s yet</td>
                </tr>
              </template>
              <template v-else v-for="(invoice, index) in getPracticeInvoices">
                <tr :key="invoice.id" class="__job-card shadow-md cursor-pointer text-xs text-left">
                  <td @click="show(invoice)">{{invoice.locum_detail.user.personal_detail.name}}</td>
                  <td @click="show(invoice)">{{invoice.issued_at | localDate}}</td>
                  <td @click="show(invoice)">{{invoice.locum}}</td>
                  <td @click="show(invoice)">{{invoice.invoice_number}}</td>
                  <td @click="show(invoice)">
                    <div v-for="(item, index) in invoice.items" :key="index">{{item.job_part.job_part_number}}</div>
                    <!-- <div
                      v-for="item in invoice.items.filter(item => item.type === 'Job Part' && item.job_part)"
                      :key="item.id"
                    >{{item.job_part.job_part_number}}</div>-->
                  </td>
                  <td @click="show(invoice)">£ {{invoice.total_amount}}</td>
                  <td @click="show(invoice)">{{invoice.status}}</td>
                  <!-- <td
                    @click="show(invoice)"
                  >{{invoice.paid_at ? 'Paid' : invoice.issued_at ? 'Issued' : ''}}</td>-->
                  <td @click="onClick(invoice, index)" v-if="!invoice.paid_at">
                    <button
                      v-text="'Mark as paid'"
                      class="px-2 py-3 text-white rounded-lg bg-green-600"
                    ></button>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
          
        </div>
      </div>
      <div class="my-2" v-if="getPracticeInvoices.length">
        <span class="font-bold px-4">Total: £ {{ totalAmount | currency }}</span>
      </div>
    </div>
    <div class="bottom-0 w-full" v-if="getPracticeInvoices.length > 0 && totalPages > 1">
      <AppPagination
        :total="total"
        :totalPages="totalPages"
        :currentPage="current_page"
        @pagechanged="pagechanged"
      />
    </div>
  </div>
</template>
<script>
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },
  async asyncData({ app, error }) {
    try {
      let params = {
        offset: 0,
        limit: 5,
        order_by: "date_paid:desc",
        status: "Paid"
      };
      const response = await app.$axios.$get(
        `/api/v1/practice/locum-invoices`,
        { params }
      );
      const invoices =
        response.data && response.data.invoices && response.data.invoices.length
          ? response.data.invoices
          : [];
      const responseCount = await app.$axios.$get(
        `/api/v1/practice/locum-invoices/count`,
        { params }
      );
      const count =
        responseCount.data && responseCount.data.count
          ? responseCount.data.count
          : 0;
      return {
        invoices,
        count
      };
    } catch (err) {
      throw err;
    }
  },
  data() {
    return {
      current_page: 1,
      params: {
        order_by: "date_paid:desc"
      },
      // sort
      sortType: "",
      date_paid: false,
      //
      count: 0,
      invoices: [],
      paymentModal: false,
      deleteModal: false,
      form: {
        paid_at: null
      },
      formError: [],
      selectedInvoiceId: null
    };
  },
  computed: {
    getPracticeInvoices() {
      return this.$store.getters["billing/getPracticeInvoices"];
    },
    offset() {
      return this.perPage * (this.current_page - 1);
    },
    perPage() {
      return 5;
    },
    total() {
      return this.$store.state.billing.practice_invoice_count;
    },
    totalPages() {
      return Math.ceil(this.total / this.perPage);
    },
    totalAmount() {
      if (!this.getPracticeInvoices.length) {
        return 0;
      }
      console.log("qwe",this.getPracticeInvoices)
      return this.getPracticeInvoices
        .map(invoice => invoice.total_amount)
        .reduce((accumulator, currentValue) => accumulator + currentValue);
    }
  },
  mounted() {
    this.$store.commit("billing/SET_PRACTICE_INVOICES", this.invoices);
    this.$store.commit("billing/SET_PRACTICE_INVOICE_COUNT", this.count);
  },
  methods: {
    show(item) {
      this.$router.push(`/practice-billing/invoices-from-locums/${item.id}`);
    },
  }
};
</script>
