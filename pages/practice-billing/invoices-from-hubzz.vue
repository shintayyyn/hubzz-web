<template>
  <section class="relative">
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
    <div v-if="!invoices.length" class="flex justify-center">No Invoices From Hubzz Found</div>
    <!-- <div v-if="paymentModal" class="p-2" v-on-clickaway="closePaymentModal">
      <div class="rounded-lg shadow-md px-4 py-8 md:px-8 update-modal border w-5/6 md:w-1/3">
        <AppDate
          v-model="form.paid_at"
          :name="'paid_at'"
          :label="'Payment made on'"
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
    </div>-->
    <!-- @click="paymentModal ? paymentModal = false : $route.path != '/practice-billing/invoices-from-hubzz' ? $router.push('/practice-billing/invoices-from-hubzz') : null" -->
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
// import AppButton from "@/components/Base/AppButton"
// import AppDate from "@/components/Base/AppDate"
import { mixin as clickaway } from "vue-clickaway";
export default {
  components: {
    AppTable
    // AppDate,
    // AppButton
  },
  mixins: [clickaway],
  transition: {
    name: "fade",
    mode: "out-in"
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
        },
        {
          name: "Created At",
          dataIndex: "date_created",
          class: "text-center localDate"
        }
        // {
        //   name: "Actions",
        //   dataIndex: "actions",
        //   class: "text-center"
        // }
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
    // this.$socket.on(
    //   "Practice Notification Practice Invoice Paid",
    //   this.getPracticeInvoiceRealTime
    // );
  },
  // destroyed() {
  //   this.removeListener();
  // },
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
    // removeListener() {
    //   this.$socket.removeListener(
    //     "Practice Notification Practice Invoice Paid",
    //     this.getPracticeInvoiceRealTime
    //   );
    // },
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