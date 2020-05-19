<template>
  <section class="relative">
    <AppButton
      v-if="!['pension-form-b'].includes($route.query.status)"
      :label="'Filter'"
      :in-style="'padding:5px 14px;margin-bottom:5px;font-size:14px;'"
      @click="filterModal = !filterModal"
    />
    <div
      class="flex-wrap justify-start items-end z-10 absolute w-full bg-white shadow-lg p-3 rounded-lg"
      :class="filterModal ? 'flex' : 'hidden'"
    >
      <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
        <AppInput
          v-model="params.invoice_number"
          class="px-1"
          :type="'text'"
          :name="'invoice_number'"
          :label="'Invoice number'"
        />
      </div>
      <div class="md:px-1 flex w-full">
        <AppButton
          :disabled="disabledClearFilter"
          :label="'Clear'"
          :in-style="'padding:5px 14px;margin-bottom:5px'"
          @click="clearFilters"
        />
        <AppButton
          class="mx-2"
          :label="'Search'"
          :in-style="'padding:5px 14px;margin-bottom:5px'"
          @click="filterInvoices"
        />
        <AppButton
          class="mx-2 md:hidden"
          :label="'Close'"
          :in-style="'padding:5px 14px;margin-bottom:5px'"
          @click="filterModal = false"
        />
      </div>
    </div>

    <AppTable
      v-if="invoices.length > 0"
      :total="totalInvoices"
      :items="invoices"
      :loading="loading"
      :current-page="current_page"
      :per-page="params.limit"
      :columns="columns"
      :order-by="params.order_by"
      :router-link="'/practice-billing/invoices-from-hubzz'"
      @pagechanged="pagechanged"
      @limitchanged="limitchanged"
      @sorted="sorted"
    >
      <template v-slot:actions="slotProps">
        <div class="flex justify-center" @click.stop.prevent="onClick(slotProps.item)">
          <button
            class="px-4 py-2 font-bold rounded-lg focus:outline-none"
            :class="[slotProps.item.paid ? 'bg-green-600 text-white' : slotProps.item.disputed_items_count > 0 ? 'bg-gray-500 text-white' : 'bg-yellow-400']"
            v-text="`${slotProps.item.paid ? 'Already Paid' : slotProps.item.disputed_items_count > 0 ? 'Disputed' : 'Mark as paid'}`"
          />
        </div>
      </template>
    </AppTable>
    <div
      v-if="!invoices.length && !isFiltered"
      class="flex justify-center"
    >You do not have any Invoices from Hubzz</div>
    <div v-if="!invoices.length && isFiltered" class="flex justify-center">No Invoices Found</div>
    <transition name="fade" mode="out-in">
      <div
        v-if="['practice-billing-invoices-from-hubzz-id'].includes($route.name) || paymentModal"
        class="shield"
      />
    </transition>
    <nuxt-child />
  </section>
</template>
<script>
import AppTable from "@/components/Base/AppTable";
import AppButton from "@/components/Base/AppButton";
import AppInput from "@/components/Base/AppInput";
export default {
  components: {
    AppTable,
    AppInput,
    AppButton
  },
  transition: {
    name: "fade",
    mode: "out-in"
  },
  data() {
    return {
      filterModal: false,
      invoice_number: null,
      isFiltered: false,

      totalInvoices: 0,
      invoices: [],
      loading: false,
      current_page: 1,
      modal: false,
      // payment
      paymentModal: false,
      selectedInvoiceId: null,
      form: {
        paid_at: null
      },
      formError: [],
      // app table params
      params: {
        offset: 0,
        limit: 5,
        order_by: [],
        invoice_number: null
      },
      // app table column
      columns: [
        {
          name: "Practice / Surgery",
          dataIndex: "practice.name",
          class: "text-left"
        },
        {
          name: "Issued",
          dataIndex: "date_created",
          class: "text-center localDate"
        },
        {
          name: "Invoice Number",
          dataIndex: "invoice_number",
          class: "text-left"
        },
        {
          name: "£ Amount",
          dataIndex: "total_amount",
          class: "text-center currency"
        },
        {
          name: "Paid At",
          dataIndex: "paid_at",
          class: "text-center localDate"
        }
      ]
    };
  },
  computed: {
    disabledClearFilter() {
      let invoiceNumber =
        this.params.invoice_number === "" ? null : this.params.invoice_number;

      if (invoiceNumber === null) {
        return true;
      }
      return false;
    }
  },
  async asyncData({ app, error }) {
    try {
      const params = {
        offset: 0,
        limit: 5
      };

      const responseCount = await app.$axios.get(
        "/api/v1/practice/practice-invoices/count"
      );

      const totalInvoices =
        responseCount.data &&
        responseCount.data.data &&
        responseCount.data.data.count
          ? responseCount.data.data.count
          : 0;

      const response = await app.$axios.get(
        "/api/v1/practice/practice-invoices",
        {
          params
        }
      );

      const invoices =
        response.data &&
        response.data.data &&
        response.data.data.practice_invoices
          ? response.data.data.practice_invoices
          : [];

      return {
        totalInvoices,
        invoices
      };
    } catch (err) {
      if (err.response && err.response.status === 401) {
        console.log("something went wrong");
        error(err.response.data);
        return;
      } else {
        console.log("practice-billing index err", err.response || err);
        error({
          statusCode: err.status || 500,
          message: err.message || "Something went wrong!"
        });
      }
      throw err;
    }
  },
  methods: {
    async filterInvoices() {
      this.current_page = 1;
      this.params.offset = 0;
      this.params.limit = 5;
      //   this.initialLoading = true
      //   this.isFiltered = true
      await this.getInvoicesCount(this.params);
      //   this.initialLoading = false
      this.filterModal = false;
    },
    clearFilters() {
      this.params.offset = 0;
      this.params.limit = 5;
      this.params.order_by = [];
      this.params.invoice_number = null;
      this.filterInvoices();
    },
    getPracticeInvoiceRealTime({ id }) {
      if (!id) {
        return;
      }
      if (this.invoices.map(invoice => invoice.id).includes(id)) {
        // update
        this.$axios
          .$get(`/api/v1/practice/practice-invoices/${id}`)
          .then(res => {
            let index = this.invoices.findIndex(
              invoice => invoice.id == res.data.practice_invoice.id
            );
            if (index >= 0) {
              this.invoices.splice(index, 1, res.data.practice_invoice);
            }
          });
      }
    },
    getInvoicesCount(params) {
      console.log("1", params);
      this.$axios
        .$get(`/api/v1/practice/practice-invoices/count`, {
          params
        })
        .then(res => {
          this.totalInvoices = res.data.count;
          this.getInvoices(this.params);
        });
    },
    getInvoices(params) {
      this.loading = true;
      this.$axios
        .$get(`/api/v1/practice/practice-invoices`, {
          params
        })
        .then(res => {
          this.loading = false;
          this.invoices = [];
          res.data.practice_invoices.forEach(invoice => {
            this.invoices.push(invoice);
          });
        })
        .catch(err => {
          console.log(err);
          this.loading = false;
        });
    },
    onClick(invoice) {
      if (invoice.paid || invoice.disputed_items_count > 0) {
        return;
      }
      this.selectedInvoiceId = null;
      this.form.paid_at = null;
      this.paymentModal = true;
      this.selectedInvoiceId = invoice.id;
    },
    confirmPayment() {
      this.Validate(this.form);
      if (!this.formError.length) {
        this.$axios
          .$put(
            `/api/v1/practice/practice-invoices/${this.selectedInvoiceId}/paid`,
            this.form
          )
          .then(res => {
            console.log(res);
            let index = this.invoices.findIndex(
              invoice => invoice.id == res.data.practice_invoice.id
            );
            if (index >= 0) {
              this.invoices.splice(index, 1, res.data.practice_invoice);
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
    closePaymentModal() {
      this.paymentModal = false;
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