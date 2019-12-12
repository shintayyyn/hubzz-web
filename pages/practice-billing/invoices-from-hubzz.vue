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
      :routerLink="'/practice-billing/invoices-from-hubzz'"
      @pagechanged="pagechanged"
      @limitchanged="limitchanged"
      @sorted="sorted"
    >
      <template v-slot:actions="slotProps">
        <div @click.stop.prevent="onClick(slotProps.item)" class="flex justify-center">
          <button
            v-text="`${slotProps.item.paid ? 'Already Paid' : slotProps.item.disputed_items_count > 0 ? 'Disputed' : 'Mark as paid'}`"
            class="px-4 py-2 font-bold rounded-lg focus:outline-none"
            :class="[slotProps.item.paid ? 'bg-green-600 text-white' : slotProps.item.disputed_items_count > 0 ? 'bg-gray-500 text-white' : 'bg-yellow-400']"
          ></button>
        </div>
      </template>
    </AppTable>
    <div v-if="paymentModal" class="p-2" v-on-clickaway="closePaymentModal">
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
    <transition name="fade" mode="out-in">
      <div
        class="shield"
        v-if="$route.path != '/practice-billing/invoices-from-hubzz' || paymentModal"
        @click="paymentModal ? paymentModal = false : $route.path != '/practice-billing/invoices-from-hubzz' ? $router.push('/practice-billing/invoices-from-hubzz') : null"
      ></div>
    </transition>
    <nuxt-child />
  </section>
</template>
<script>
import AppTable from "@/components/Base/AppTable";
import AppButton from "@/components/Base/AppButton";
import AppDate from "@/components/Base/AppDate";
import { mixin as clickaway } from "vue-clickaway";
export default {
  mixins: [clickaway],
  transition: {
    name: "fade",
    mode: "out-in"
  },
  components: {
    AppTable,
    AppDate,
    AppButton
  },
  data() {
    return {
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
        order_by: []
      },
      // app table column
      columns: [
        {
          name: "Practice / Surgery",
          dataIndex: "practice.surgery.name",
          class: "text-left"
        },
        {
          name: "Issued",
          dataIndex: "issued_at",
          class: "text-center localDate"
        },
        {
          name: "Invoice Number",
          dataIndex: "invoice_number",
          class: "text-left"
        },
        {
          name: "Invoice items",
          dataIndex: "practice_invoice_items",
          class: "text-left"
        },
        {
          name: "£ Amount",
          dataIndex: "total_amount",
          class: "text-center"
        },
        {
          name: "Paid At",
          dataIndex: "paid_at",
          class: "text-center"
        },
        {
          name: "Created At",
          dataIndex: "date_created",
          class: "text-center localDate"
        },
        {
          name: "Actions",
          dataIndex: "actions",
          class: "text-center"
        }
      ]
    };
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

      console.log("invoices from hubzz");

      return {
        totalInvoices,
        invoices
      };
    } catch (err) {
      console.log("practice-billing index err", err.response || err);
      error({
        statusCode: err.status || 500,
        message: err.message || "Something went wrong!"
      });
    }
  },
  mounted() {
    this.$socket.on(
      "Practice Notification Practice Invoice Paid",
      this.getPracticeInvoiceRealTime
    );
  },
  destroyed() {
    this.removeListener();
  },
  methods: {
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
    removeListener() {
      this.$socket.removeListener(
        "Practice Notification Practice Invoice Paid",
        this.getPracticeInvoiceRealTime
      );
    },
    getInvoicesCount(params) {
      this.$axios
        .$get(`/api/v1/practice/practice-invoices/count`, { params })
        .then(res => {
          this.totalInvoices = res.data.count;
          this.getInvoices(this.params);
        });
    },
    getInvoices(params) {
      this.loading = true;
      this.$axios
        .$get(`/api/v1/practice/practice-invoices`, { params })
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
    onClick(invoice, index) {
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