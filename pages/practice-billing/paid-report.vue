<template>
  <div>
    <AppTable
      v-if="invoices.length > 0"
      :total="totalInvoices"
      :items="invoices"
      :loading="loading"
      :currentPage="current_page"
      :perPage="params.limit"
      :columns="columns"
      :orderBy="params.order_by"
      @show="show"
      @pagechanged="pagechanged"
      @limitchanged="limitchanged"
      @sorted="sorted"
    ></AppTable>
    <div v-else class="flex justify-center">You do not have any paid invoices</div>
    <transition name="fade" mode="out-in">
      <div class="shield" v-if="$route.path != '/practice-billing/paid-report'"></div>
    </transition>
    <nuxt-child />
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
      invoices: [],
      loading: false,
      current_page: 1,
      //
      params: {
        offset: 0,
        limit: 5,
        status: "Paid",
        order_by: ["date_created:desc"]
      },
      //
      paymentModal: false,
      selectedInvoiceId: null,

      form: {
        paid_at: null
      },
      formError: [],
      //
      columns: [
        {
          name: "Locum",
          dataIndex: "locum_detail.user.personal_detail.first_name",
          class: "text-center"
        },
        {
          name: "Invoice Number",
          dataIndex: "invoice_number",
          class: "text-center"
        },
        {
          name: "Job Numbers",
          dataIndex: "items.job_part.job_part_number",
          class: "text-center"
        },
        {
          name: "£ Paid",
          dataIndex: "total_amount",
          class: "text-center"
        },
        {
          name: "Date paid",
          dataIndex: "paid_at",
          class: "text-center"
        },
        {
          name: "Amount",
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
        `/api/v1/practice/locum-invoices/count`
      );
      const totalInvoices =
        responseCount.data && responseCount.data.count
          ? responseCount.data.count
          : 0;
      return {
        invoices,
        totalInvoices
      };
    } catch (err) {
      throw err;
    }
  },

  computed: {
    authPermissions() {
      return this.$store.getters["auth/permissions"];
    }
  },
  methods: {
    getInvoicesCount(params) {
      this.$axios
        .$get(`/api/v1/practice/locum-invoices/count`, { params })
        .then(res => {
          this.totalInvoices = res.data.count;
          this.getInvoices(this.params);
        });
    },
    getInvoices(params) {
      this.loading = true;
      this.$axios
        .$get(`/api/v1/practice/locum-invoices`, { params })
        .then(res => {
          this.loading = false;
          this.invoices = [];
          res.data.invoices.forEach(invoice => {
            this.invoices.push(invoice);
          });
        })
        .catch(err => {
          console.log(err);
          this.loading = false;
        });
    },
    sorted(order_by) {
      this.current_page = 1;
      this.params.offset = 0;
      this.params.order_by = order_by;
      this.getInvoices(this.params);
    },
    pagechanged(page) {
      this.current_page = page;
      this.params.offset = this.params.limit * (page - 1);
      this.getInvoices(this.params);
    },
    limitchanged(limit) {
      this.current_page = 1;
      this.params.offset = 0;
      this.params.limit = limit;
      this.getInvoices(this.params);
    },
    show(item) {
      this.$router.push(`/practice-billing/paid-report/${item.id}`);
    }
  }
};
</script>
