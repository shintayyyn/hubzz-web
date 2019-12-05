<template>
  <section class="relative">
    <AppButton
      v-if="showRefresh"
      :label="'Refresh'"
      @click="refreshInvoices"
      :inStyle="'padding:5px 14px;margin-bottom:5px;font-size:14px;'"
    />
    <AppTable
      v-if="invoices.length > 0"
      :total="totalInvoices"
      :items="invoices"
      :loading="loading"
      :currentPage="current_page"
      :perPage="params.limit"
      :columns="columns"
      :orderBy="params.order_by"
      :routerLink="'/locum-billing/invoices'"
      @pagechanged="pagechanged"
      @limitchanged="limitchanged"
      @sorted="sorted"
    >
      <template v-slot:actions="slotProps">
        <div @click.stop.prevent="onClick(slotProps.item)" class="flex justify-center">
          <button
            v-if="slotProps.item.status === 'Draft'"
            class="px-4 py-2 bg-yellow-500 font-bold rounded-lg focus:outline-none"
          >Delete</button>
        </div>
      </template>
    </AppTable>
    <div v-else class="flex justify-center">You do not have any created invoice</div>

    <AppConfirmationModal
      :label="'Proceed to delete this invoice?'"
      :confirmLabel="'Yes'"
      :cancelLabel="'Cancel'"
      :modal="deleteModal"
      @confirm="deleteInvoice"
      @cancel="deleteModal = false"
    />
    <transition name="fade" mode="out-in">
      <nuxt-link
        :to="'/locum-billing/invoices'"
        v-if="['locum-billing-invoices-id', 'locum-billing-invoices-create', 'locum-billing-invoices-id-edit'].includes($route.name) || deleteModal"
        class="shield"
      ></nuxt-link>
    </transition>
    <nuxt-child @addInvoice="addInvoice" @updateInvoice="updateInvoice" />
  </section>
</template>

<script>
import AppDate from "@/components/Base/AppDate";
import AppButton from "@/components/Base/AppButton";
import AppConfirmationModal from "@/components/Base/AppConfirmationModal";
import AppTable from "@/components/Base/AppTable";
export default {
  components: {
    AppDate,
    AppButton,
    AppConfirmationModal,
    AppTable
  },
  transition: {
    name: "fade",
    mode: "out-in"
  },
  data() {
    return {
      showRefresh: false,

      totalInvoice: 0,
      invoices: [],
      loading: false,
      current_page: 1,
      // params
      params: {
        offset: 0,
        limit: 5,
        order_by: []
      },
      // columns
      columns: [
        {
          name: "Type",
          dataIndex: "type"
        },
        {
          name: "Practice / Surgery",
          dataIndex: "surgery.name",
          class: "text-center"
        },
        {
          name: "Created At",
          dataIndex: "date_created",
          class: "text-center localDate",
          sortable: true
        },
        {
          name: "Issued",
          dataIndex: "issued_at",
          class: "text-center localDate"
        },
        {
          name: "Invoice Number",
          dataIndex: "invoice_number",
          sortable: true
        },
        {
          name: "Job Numbers",
          dataIndex: "items.job_part.job_part_number"
        },
        {
          name: "£ Amount",
          dataIndex: "total_amount",
          sortable: true,
          class: "text-center"
        },
        {
          name: "Status",
          dataIndex: "status",
          sortable: true,
          class: "text-center"
        },
        {
          name: "Actions",
          dataIndex: "actions",
          class: "text-center"
        }
      ],
      // payment
      deleteModal: false,
      selectedInvoiceId: null,
      form: {
        paid_at: null
      },
      formError: []
    };
  },
  computed: {
    authPermissions() {
      return this.$store.getters["auth/permissions"];
    }
  },
  async asyncData({ app, error }) {
    try {
      const params = {
        offset: 0,
        limit: 5
      };
      const response = await app.$axios.get("/api/v1/locum/locum-invoices", {
        params
      });
      const invoices =
        response.data && response.data.data && response.data.data.locum_invoices
          ? response.data.data.locum_invoices
          : [];
      const responseTotal = await app.$axios.get(
        "/api/v1/locum/locum-invoices/count"
      );
      const totalInvoices =
        responseTotal.data &&
        response.data.data &&
        responseTotal.data.data.count
          ? responseTotal.data.data.count
          : 0;
      return {
        totalInvoices,
        invoices
      };
    } catch (err) {
      console.log("locum-billing index err", err.response || err);
      error({
        statusCode: err.status || 500,
        message: err.message || "Something went wrong!"
      });
    }
  },
  mounted() {
    this.$socket.on(
      "Locum Notification Locum Invoice Created",
      this.getLocumInvoiceRealTime
    );
    this.$socket.on(
      "Locum Notification Locum Invoice Paid",
      this.getLocumInvoiceRealTime
    );
    this.$socket.on(
      "Locum Notification Locum Invoice Updated",
      this.getLocumInvoiceRealTime
    );
  },
  destroyed() {
    this.removeListener();
  },
  methods: {
    async refreshInvoices() {
      this.loading = true;
      this.$store.commit("billing/CLEAR_LOCUM_BILLING_NOTIFICATION");
      await this.getInvoicesCount(this.params);
      await this.getInvoices(this.params);
      this.loading = false;
      this.showRefresh = false;
    },
    updateInvoice(invoice) {
      let index = this.invoices.findIndex(item => item.id == invoice.id);
      if (index >= 0) {
        this.invoices.splice(index, 1, invoice);
      }
    },
    getLocumInvoiceRealTime({ id }) {
      if (!id) {
        return;
      }
      this.showRefresh = true;
    },
    removeListener() {
      this.$socket.removeListener(
        "Locum Notification Locum Invoice Create",
        this.getLocumInvoiceRealTime
      );
      this.$socket.removeListener(
        "Locum Notification Locum Invoice Paid",
        this.getLocumInvoiceRealTime
      );
      this.$socket.removeListener(
        "Locum Notification Locum Invoice Updated",
        this.getLocumInvoiceRealTime
      );
    },
    getInvoicesCount(params) {
      this.loading = true;
      this.$axios
        .$get(`/api/v1/locum/locum-invoices/count`, { params })
        .then(res => {
          this.totalInvoices = res.data.count;
          this.getInvoices(this.params);
        })
        .catch(err => {
          this.loading = false;
          console.log(err);
        })
        .finally(() => {
          return;
        });
    },
    getInvoices(params) {
      this.$axios
        .$get(`/api/v1/locum/locum-invoices`, { params })
        .then(res => {
          this.loading = false;
          this.invoices = [];
          res.data.locum_invoices.forEach(invoice => {
            this.invoices.push(invoice);
          });
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          this.loading = false;
          return;
        });
    },
    onClick(invoice) {
      this.selectedInvoiceId = null;
      this.deleteModal = true;
      this.selectedInvoiceId = invoice.id;
    },
    deleteInvoice() {
      this.$axios
        .$delete(`/api/v1/locum/locum-invoices/${this.selectedInvoiceId}`)
        .then(res => {
          this.invoices = this.invoices.filter(
            invoice => invoice.id !== this.selectedInvoiceId
          );
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`${res.message}`]
          });
          this.deleteModal = false;
        });
    },
    addInvoice(invoice) {
      this.invoices.unshift(invoice);
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
    }
  }
};
</script>

<style scoped>
.shield {
  z-index: 511;
}
.update-modal {
  position: fixed;
  background-color: white;
  z-index: 512;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
