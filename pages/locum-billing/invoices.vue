<template>
  <section class="relative">
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
            v-if="!slotProps.item.paid_at"
            v-text="slotProps.item.issued_at ? 'Mark as paid' : 'Delete'"
            class="px-4 py-2 font-bold rounded-lg focus:outline-none"
            :class="slotProps.item.issued_at ? 'text-white bg-green-600' : 'bg-yellow-500'"
          ></button>
        </div>
      </template>
    </AppTable>
    <div v-else class="flex justify-center">You do not have any created invoice</div>

    <div v-if="paymentModal" class="p-2">
      <div class="rounded-lg shadow-md px-4 py-8 md:px-8 update-modal border w-5/6 md:w-1/3">
        <AppDate
          v-model="form.paid_at"
          :name="'paid_at'"
          :label="'Received payment on'"
          :error="formError.find(item => item.field === 'paid_at')"
          isAfter
        />
        <div class="flex flex-row flex-no-wrap justify-center">
          <AppButton
            class="mx-1"
            :label="'Save'"
            @click="confirmPayment"
            :inStyle="'padding:5px 10px'"
          />
          <AppButton
            class="mx-1"
            :label="'Cancel'"
            @click="paymentModal = false"
            :inStyle="'padding:5px 10px'"
          />
        </div>
      </div>
    </div>
    <AppConfirmationModal
      :label="'Proceed to delete this invoice?'"
      :confirmLabel="'Yes'"
      :cancelLabel="'Cancel'"
      :modal="deleteModal"
      @confirm="deleteInvoice"
      @cancel="deleteModal = false"
    />
    <transition name="fade" mode="out-in">
      <div
        v-if="['locum-billing-invoices-id', 'locum-billing-invoices-create', 'locum-billing-invoices-id-edit'].includes($route.name) || deleteModal || paymentModal"
        class="shield"
        @click="close"
      ></div>
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
      totalInvoice: 0,
      invoices: [],
      loading: false,
      current_page: 1,
      // params
      params: {
        offset: 0,
        limit: 5,
        order_by: ["date_created:desc"]
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
      paymentModal: false,
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
        limit: 5,
        order_by: "date_created:desc"
      };
      const response = await app.$axios.get("/api/v1/locum/invoices", {
        params
      });
      const invoices =
        response.data && response.data.data && response.data.data.invoices
          ? response.data.data.invoices
          : [];
      const responseTotal = await app.$axios.get(
        "/api/v1/locum/invoices/count"
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
  methods: {
    close() {
      if (this.deleteModal) {
        this.deleteModal = false;
      } else if (this.paymentModal) {
        this.paymentModal = false;
      } else {
        // this.$router.go(-1);
        this.$router.push("/locum-billing/invoices");
      }
    },
    getInvoicesCount(params) {
      this.$axios.$get(`/api/v1/locum/invoices/count`, { params }).then(res => {
        this.totalInvoices = res.data.count;
        this.getInvoices(this.params);
      });
    },
    getInvoices(params) {
      this.loading = true;
      this.$axios
        .$get(`/api/v1/locum/invoices`, { params })
        .then(res => {
          this.loading = false;
          this.invoices = [];
          res.data.invoices.forEach(invoice => {
            this.invoices.push(invoice);
          });
        })
        .catch(err => {
          console.log(err);
          this.selectedInvoiceId = null;
          this.loading = false;
        });
    },
    onClick(invoice) {
      this.form.paid_at = null;
      if (invoice.issued_at) {
        this.paymentModal = true;
      } else {
        this.deleteModal = true;
      }
      this.selectedInvoiceId = invoice.id;
    },
    closePaymentModal() {
      this.paymentModal = false;
    },
    confirmPayment() {
      this.Validate(this.form);
      if (!this.formError.length) {
        this.form.paid_at = this.$moment(this.form.paid_at).format(
          "YYYY-MM-DD"
        );
        this.$axios
          .$put(
            `/api/v1/locum/invoices/${this.selectedInvoiceId}/paid`,
            this.form
          )
          .then(res => {
            let index = this.invoices.findIndex(
              invoice => invoice.id == res.data.invoice.id
            );
            if (index >= 0) {
              this.invoices.splice(index, 1, res.data.invoice);
            }

            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: [`${res.message}`]
            });
            this.paymentModal = false;
          });
      }
    },
    deleteInvoice() {
      this.$axios
        .$delete(`/api/v1/locum/invoices/${this.selectedInvoiceId}`)
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
    updateInvoice(invoice) {
      let index = this.invoices.findIndex(item => item.id == invoice.id);
      if (index >= 0) {
        this.invoices.splice(index, 1, invoice);
      }
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
/* confirmation */
.confirmation {
  z-index: 600;
}
.confirmation-modal {
  width: 100%;
}
.update-modal {
  position: fixed;
  background-color: white;
  z-index: 512;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
@media screen and (min-width: 991px) {
  .confirmation-modal {
    width: auto;
  }
}
button:active {
  transform: translate(2px, 2px);
}
</style>
