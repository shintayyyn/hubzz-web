<template>
  <div>
    <nuxt-child />

    <div class="__jobs-section">
      <h1>Invoices</h1>
      <div class="overflow-x-auto">
        <div class="overflow-x-auto overflow-y-hidden">
          <table class="border-separate" style="border-spacing: 0 10px">
            <thead>
              <tr class="text-xs sm:text-sm text-left">
                <th>Practice / Surgery</th>
                <th @click="sortBy('issued_at')" class="cursor-pointer">
                  Issued
                  <svgicon class="inline align-baseline" name="sort" height="12" width="12" />
                </th>
                <th>Locum</th>
                <th>Invoice number</th>
                <th>Job numbers</th>
                <th>£ Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="getPracticeInvoices.length === 0">
                <tr>
                  <td
                    colspan="8"
                    class="absolute inset-x-auto md:static md:text-center"
                  >You don't have any invoice/s yet</td>
                </tr>
              </template>
              <template v-else v-for="(invoice, index) in getPracticeInvoices">
                <tr
                  @click="show(invoice)"
                  :key="invoice.id"
                  class="__job-card shadow-md cursor-pointer text-xs text-left"
                >
                  <td>{{invoice.surgery.name}}</td>
                  <td>{{invoice.issued_at | localDate}}</td>
                  <td>{{invoice.locum_detail.user.personal_detail.first_name}}</td>
                  <td>{{invoice.invoice_number}}</td>
                  <td>
                    <div
                      v-for="item in invoice.items.filter(item => item.type === 'Job Part' && item.job_part)"
                      :key="item.id"
                    >{{item.job_part.job_part_number}}</div>
                  </td>
                  <td>£ {{invoice.total_amount}}</td>
                  <td>{{invoice.status}}</td>
                  <td @click.stop.prevent="onClick(invoice, index)">
                    <button
                      v-if="!invoice.paid_at"
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
    <div class="bottom-0 w-full" v-if="getPracticeInvoices.length > 0 && totalPages > 1">
      <AppPagination
        :total="total"
        :totalPages="totalPages"
        :currentPage="current_page"
        @pagechanged="pagechanged"
      />
    </div>
    <div v-if="paymentModal" class="p-2" v-on-clickaway="closePaymentModal">
      <div class="rounded-lg shadow-md px-4 py-8 md:px-8 update-modal border w-5/6 md:w-1/3">
        <AppDate
          v-model="form.paid_at"
          :name="'paid_at'"
          :label="'Receive payment on'"
          :error="formError.find(item => item.field === 'paid_at')"
        />
        <div class="flex flex-row flex-no-wrap justify-center">
          <AppButton
            class="mx-1"
            :label="'Save'"
            @click="updateInvoice"
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

    <div
      class="shield"
      v-if="$route.path != '/practice-billing/invoices-from-locums' || paymentModal"
      @click="paymentModal ? '' : $router.go(-1)"
    ></div>
  </div>
</template>

<script>
import AppDate from "@/components/Base/AppDate";
import AppButton from "@/components/Base/AppButton";
import AppPagination from "@/components/Base/AppPagination";
import { mixin as clickaway } from "vue-clickaway";
export default {
  mixins: [clickaway],
  components: {
    AppDate,
    AppButton,
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
      const response = await app.$axios.get("/api/v1/practice/locum-invoices", {
        params
      });
      const invoices =
        response.data && response.data.data && response.data.data.invoices
          ? response.data.data.invoices
          : [];
      const responseCount = await app.$axios.get(
        "/api/v1/practice/locum-invoices/count"
      );

      const count =
        responseCount.data &&
        response.data.data &&
        responseCount.data.data.count
          ? responseCount.data.data.count
          : 0;
      return {
        invoices,
        count
      };
    } catch (err) {
      console.log("practice-billing index err", err.response || err);
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
      date_created: false,
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
    }
  },
  mounted() {
    this.$store.commit("billing/SET_PRACTICE_INVOICES", this.invoices);
    this.$store.commit("billing/SET_PRACTICE_INVOICE_COUNT", this.count);
    console.log("details", this.getPracticeInvoices);
  },
  beforeDestroy() {
    this.$store.commit("billing/CLEAR_INVOICES");
  },
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
        .$get("/api/v1/practice/locum-invoices", { params: invoiceParams })
        .then(res => {
          this.$store.commit(
            "billing/SET_PRACTICE_INVOICES",
            res.data.invoices
          );
        });
    },
    show(item) {
      if (item.file) {
        this.$router.push(`/practice-billing/invoices-from-locums/${item.id}`);
      }
    },
    onClick(invoice, index) {
      this.selectedInvoiceId = null;
      this.form.paid_at = null;
      this.paymentModal = true;
      this.selectedInvoiceId = invoice.id;
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
            `/api/v1/practice/locum-invoices/${this.selectedInvoiceId}/paid`,
            this.form
          )
          .then(res => {
            this.$store.commit(
              "billing/UPDATE_PRACTICE_INVOICE",
              res.data.invoice
            );
            this.paymentModal = false;
          });
      }
    }
  }
};
</script>

<style scoped>
.shield {
  z-index: 511;
}

table tr td {
  padding: 10px 15px;
}
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
