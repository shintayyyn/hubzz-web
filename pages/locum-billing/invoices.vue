<template>
  <section>
    <transition name="fade" mode="out-in">
      <div
        v-if="['locum-billing-invoices-id', 'locum-billing-invoices-create', 'locum-billing-invoices-id-edit'].includes($route.name) || confirmation_modal || paymentModal"
        class="shield"
      ></div>
    </transition>
    <nuxt-child />

    <div class="__jobs-section">
      <h1>Invoices</h1>
      <div class="overflow-x-auto overflow-y-hidden">
        <table>
          <thead>
            <tr class="text-xs sm:text-sm text-left">
              <th>Type</th>
              <th>Practice / Surgery</th>
              <th class="cursor-pointer" @click="sortBy('date_created')">
                Created
                <svgicon class="inline align-baseline" name="sort" height="12" width="12" />
              </th>
              <th class="cursor-pointer" @click="sortBy('issued_at')">
                Issued
                <svgicon class="inline align-baseline" name="sort" height="12" width="12" />
              </th>
              <th>Invoice number</th>
              <th>Job numbers</th>
              <th>£ Amount</th>
              <th>Pension type</th>
              <th>Status</th>
              <th>Copies</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="invoices.length === 0">
              <tr>
                <td colspan="10" class="text-center">You haven't created any invoice/s yet</td>
              </tr>
            </template>
            <template v-else v-for="(invoice, index) in invoices">
              <tr
                @click="show(invoice)"
                :key="invoice.id"
                class="__job-card shadow-md cursor-pointer text-xs text-left rounded-lg"
              >
                <td>{{invoice.type}}</td>
                <td>{{invoice.surgery.name}}</td>
                <td>{{invoice.date_created | localDate}}</td>
                <td>{{invoice.issued_at | localDate}}</td>
                <td>{{invoice.invoice_number}}</td>
                <td>
                  <div
                    v-for="item in invoice.items.filter(item => item.type === 'Job Part' && item.job_part)"
                    :key="item.id"
                  >{{item.job_part.job_part_number}}</div>
                </td>
                <td>£ {{invoice.total_amount}}</td>
                <td>pension type</td>
                <td>{{invoice.paid_at ? 'Paid' : invoice.issued_at ? 'Issued' : ''}}</td>
                <td>
                  <button
                    @click.stop.prevent="onClick(invoice, index)"
                    v-if="!invoice.paid_at"
                    v-text="invoice.issued_at ? 'Mark as paid' : 'Delete'"
                    class="px-4 py-2 font-bold rounded-lg focus:outline-none"
                    :class="invoice.issued_at ? 'text-white bg-green-600' : 'bg-yellow-500'"
                  ></button>
                </td>
              </tr>
              <tr :key="`${invoice.id}-${index}`">
                <td></td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
    <div class="bottom-0 w-full" v-if="invoices.length > 0 && totalPages > 1">
      <AppPagination
        :total="total"
        :totalPages="totalPages"
        :currentPage="current_page"
        @pagechanged="pagechanged"
      />
    </div>
    <div
      v-if="paymentModal"
      class="rounded-lg shadow-md p-4 update-modal border"
      v-on-clickaway="closePaymentModal"
    >
      <AppDate
        v-model="form.paid_at"
        :name="'paid_at'"
        :label="'Receive payment on'"
        :error="formError.find(item => item.field === 'paid_at')"
        isAfter
      />
      <div class="flex flex-row flex-no-wrap justify-center">
        <AppButton :label="'Save'" @click="updateInvoice" :inStyle="'padding:5px'" />
        <div class="mx-1"></div>
        <AppButton :label="'Cancel'" @click="paymentModal = false" :inStyle="'padding:5px'" />
      </div>
    </div>

    <AppConfirmationModal
      :label="'Proceed to delete this invoice?'"
      :confirmLabel="'Yes'"
      :cancelLabel="'Cancel'"
      :modal="confirmation_modal"
      @confirm="deleteInvoice"
      @cancel="confirmation_modal = false"
    />
  </section>
</template>

<script>
import AppDate from "@/components/Base/AppDate";
import AppButton from "@/components/Base/AppButton";
import AppConfirmationModal from "@/components/Base/AppConfirmationModal";
import AppPagination from "@/components/Base/AppPagination";
import { mixin as clickaway } from "vue-clickaway";
export default {
  mixins: [clickaway],
  components: {
    AppDate,
    AppButton,
    AppConfirmationModal,
    AppPagination
  },
  transition: {
    name: "fade",
    mode: "out-in"
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
      const total =
        responseTotal.data &&
        response.data.data &&
        responseTotal.data.data.count
          ? responseTotal.data.data.count
          : 0;
      return {
        invoices,
        total
      };
    } catch (err) {
      console.log("locum-billing index err", err.response || err);
      error({
        statusCode: err.status || 500,
        message: err.message || "Something went wrong!"
      });
    }
  },
  data() {
    return {
      current_page: 1,
      params: {
        order_by: "date_created:desc"
      },
      // sort
      sortType: "",
      issued_at: true,
      paid_at: true,
      date_created: false,
      //
      total: 0,
      invoices: [],
      paymentModal: false,
      // deleteModal: false,
      confirmation_modal: false,
      form: {
        paid_at: null
      },
      formError: [],
      selectedInvoiceId: null
    };
  },
  computed: {
    // getLocumInvoices() {
    //   return this.$store.getters["billing/getLocumInvoices"];
    // },
    offset() {
      return this.perPage * (this.current_page - 1);
    },
    perPage() {
      return 5;
    },
    // total() {
    //   return this.$store.state.billing.locum_invoice_count;
    // },
    totalPages() {
      return Math.ceil(this.total / this.perPage);
    }
  },
  mounted() {
    // this.$store.commit("billing/SET_LOCUM_INVOICES", this.invoices);
    // this.$store.commit("billing/SET_LOCUM_INVOICE_COUNT", this.count);
  },
  // beforeDestroy() {
  //   this.$store.commit("billing/CLEAR_INVOICES");
  // },
  methods: {
    pagechanged(e) {
      this.current_page = e;
      this.getInvoice(this.current_page, this.params);
    },
    sortBy(sortedBy) {
      switch (sortedBy) {
        case "issued_at":
          this.issued_at = !this.issued_at;
          this.sortType = this.issued_at;
          break;
        case "paid_at":
          this.paid_at = !this.paid_at;
          this.sortType = this.paid_at;
          break;
        case "date_created":
          this.date_created = !this.date_created;
          this.sortType = this.date_created;
          break;
      }
      this.params.order_by = `${sortedBy}:${this.sortType ? "asc" : "desc"}`;
      this.current_page = 1;
      this.getInvoice(this.current_page, this.params);
    },
    getInvoice(page, params) {
      this.current_page = page;
      const defaultParams = {
        offset: this.offset,
        limit: this.perPage
      };
      let invoiceParams = { ...params, ...defaultParams };
      this.$axios
        .$get("/api/v1/locum/invoices", { params: invoiceParams })
        .then(res => {
          // this.$store.commit("billing/SET_LOCUM_INVOICES", res.data.invoices);
          this.invoices = res.data.invoices;
        });
    },

    show(item) {
      if (
        item.status === "Issued" ||
        item.status === "Paid" ||
        item.issued_at
      ) {
        this.$router.push(`/locum-billing/invoices/${item.id}`);
      } else {
        this.$router.push(`/locum-billing/invoices/${item.id}/edit`);
      }
    },
    onClick(invoice, index) {
      this.selectedInvoiceId = null;
      this.form.paid_at = null;
      if (invoice.issued_at) {
        this.paymentModal = true;
        this.selectedInvoiceId = invoice.id;
      } else {
        // this.deleteModal = true;
        this.confirmation_modal = true;
        this.selectedInvoiceId = invoice.id;
      }
    },
    closePaymentModal() {
      this.paymentModal = false;
    },
    updateInvoice() {
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
            // this.$store.commit(
            //   "billing/UPDATE_LOCUM_INVOICE",
            //   res.data.invoice
            // );
            let index = this.invoices.findIndex(
              invoice => invoice.id === res.data.invoice.id
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
          // this.$store.commit(
          //   "billing/REMOVE_LOCUM_INVOICE",
          //   this.selectedInvoiceId
          // );
          this.invoices = this.invoices.filter(
            invoice => invoice.id !== this.selectedInvoiceId
          );
          this.confirmation_modal = false;
          this.getInvoice(this.current_page, this.params);
        });
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
