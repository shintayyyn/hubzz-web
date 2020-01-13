<template>
  <section class="relative">
    <div class="flex flex-row justify-start overflow-x-auto pb-3">
      <nuxt-link
        :to="{ path: `/surgery-management/practice-spokes/${$route.params.id}/surgery-billings`, query: { ...$route.query, status: 'to-be-invoiced' } }"
        class="md:mr-5 p-3 text-xs font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('surgery-management-practice-spokes-id-surgery-billings-index') && (!$route.query.status || $route.query.status.toLowerCase() === 'to-be-invoiced') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >To be Invoiced</nuxt-link>
      <nuxt-link
        :to="{ path: `/surgery-management/practice-spokes/${$route.params.id}/surgery-billings`, query: { ...$route.query, status: 'disputed' } }"
        class="md:mr-5 p-3 text-xs font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('surgery-management-practice-spokes-id-surgery-billings-index') && $route.query.status && $route.query.status.toLowerCase() === 'disputed' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Disputed Invoices</nuxt-link>
      <nuxt-link
        :to="{ path: `/surgery-management/practice-spokes/${$route.params.id}/surgery-billings`, query: { ...$route.query, status: 'issued' } }"
        class="md:mr-5 p-3 text-xs font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('surgery-management-practice-spokes-id-surgery-billings-index') && $route.query.status && $route.query.status.toLowerCase() === 'issued' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Invoiced</nuxt-link>
      <nuxt-link
        :to="{ path: `/surgery-management/practice-spokes/${$route.params.id}/surgery-billings`, query: { ...$route.query, status: 'approved' } }"
        class="md:mr-5 p-3 text-xs font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('surgery-management-practice-spokes-id-surgery-billings-index') && $route.query.status && $route.query.status.toLowerCase() === 'approved' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Approved Invoices</nuxt-link>
    </div>
    <transition name="fade" mode="out-in">
      <div v-if="showTable">
        <AppButton
          v-if="showRefresh"
          :label="'Refresh'"
          @click="refreshJobParts"
          :inStyle="'padding:5px 14px;margin-bottom:5px;font-size:14px;'"
        />
        <AppTable
          v-if="job_parts.length > 0"
          :total="total"
          :items="job_parts"
          :loading="loading"
          :currentPage="current_page"
          :perPage="params.limit"
          :columns="columns"
          :orderBy="params.order_by"
          :routerLink="!$route.query.status || ($route.query.status && $route.query.status === 'to-be-invoiced') ? '' : '/practice-billing'"
          :routerId="$route.query.status && $route.query.status !== 'to-be-invoiced' ? 'locum_invoice_id' : null"
          @pagechanged="pagechanged"
          @limitchanged="limitchanged"
          @sorted="sorted"
        >
          <!-- <template v-slot:actions="slotProps">
            <div class="flex justify-center">
              <button
                disabled
                v-if="slotProps.item.paid"
                class="px-4 py-2 font-bold rounded-lg focus:outline-none bg-green-600 text-white cursor-not-allowed"
              >Already Paid</button>
              <button
                disabled
                v-if="slotProps.item.items.filter(invoice => invoice.approved === false).length > 0 && slotProps.item.disputed_items_count === 0"
                class="px-4 py-2 font-bold rounded-lg focus:outline-none bg-gray-500 text-white cursor-not-allowed"
              >For Approval</button>
              <button
                @click.stop.prevent="onClick(slotProps.item)"
                v-if="slotProps.item.items.filter(invoice => invoice.approved === false).length === 0"
                class="px-4 py-2 font-bold rounded-lg focus:outline-none bg-yellow-400"
              >Mark as Paid</button>
            </div>
          </template>-->
        </AppTable>
        <div v-else class="flex justify-center">{{noJobPartsToDisplay}}</div>

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
          <nuxt-link
            :to="{ path: '/practice-billing', query: {...$route.query}}"
            v-if="['practice-billing-index-id'].includes($route.name) || paymentModal"
            class="shield"
          ></nuxt-link>
        </transition>
        <nuxt-child @updateInvoice="updateInvoice" />
      </div>
    </transition>
  </section>
</template>
<script>
import AppTable from "@/components/Base/AppTable";
import AppDate from "@/components/Base/AppDate";
import AppButton from "@/components/Base/AppButton";
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
      showRefresh: false,
      total: 0,
      job_parts: [],
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
        status: ["Issued", "Disputed", "Paid"],
        order_by: []
      },
      // app table column
      columns: [
        {
          name: "Job Part Number",
          dataIndex: "job_part_number",
          sortable: true,
          class: "text-center"
        },
        {
          name: "Practice / Surgery",
          dataIndex: "job.platform_job.practice.surgery.name",
          sortable: true,
          class: "text-center"
        },
        {
          name: "Title",
          dataIndex: "job.title",
          sortable: true,
          class: "text-center"
        },
        {
          name: "Shift",
          dataIndex: "job.shift.name",
          sortable: true,
          class: "text-center"
        },
        {
          name: "Rate",
          dataIndex: "job.rate",
          sortable: true,
          class: "text-center"
        },
        {
          name: "per",
          dataIndex: "job.locum_detail_rate_type.name",
          class: "text-center",
          sortable: true
        },
        {
          name: "From",
          dataIndex: "job.date_start",
          sortable: true,
          class: "text-center"
        },
        {
          name: "To",
          dataIndex: "job.date_end",
          sortable: true,
          class: "text-center"
        },
        {
          name: "Completed At",
          dataIndex: "completed_at",
          sortable: true,
          class: "text-center"
        },
        {
          name: "Invoice status",
          dataIndex: "invoice_status",
          sortable: true,
          class: "text-center"
        },
        {
          name: "Tag",
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
      showTable: false
    };
  },
  computed: {
    authPermissions() {
      return this.$store.getters["auth/permissions"];
    },
    noJobPartsToDisplay() {
      let str = "";
      switch (
        this.$route.query.status && this.$route.query.status.toLowerCase()
      ) {
        case "to-be-invoiced":
          str = "This spoke do not have any completed job parts from Locums";
          break;
        case "disputed":
          str = "This spoke do not have any disputed job parts from Locums";
          break;
        case "invoiced":
          str = "This spoke do not have any invoiced job parts from Locums";
          break;
        case "approved":
          str = "This spoke do not have any approved job parts from Locums";
          break;
        default:
          str = "This spoke do not have any completed job parts from Locums";
      }
      return str;
    }
  },
  watch: {
    "$route.query"(newValue, oldValue) {
      let newStatus = newValue.status;
      let oldStatus = oldValue.status;
      if (newStatus && newStatus !== null && newStatus !== oldStatus) {
        this.current_page = 1;
        this.showTable = false;
        this.showRefresh = false;
        setTimeout(async () => {
          this.$nuxt.$loading.start();
          await this.getJobPartsPromiseAll();
          this.$nuxt.$loading.finish();
          this.showTable = true;
        }, 200);
      }
    }
  },
  async asyncData({ app, query, error }) {
    try {
      let status = [];
      let invoice_status = [];
      switch (query.status) {
        case "to-be-invoiced":
          status = ["Completed", "Terminated"];
          invoice_status = ["To Be Invoice"];
          break;
        case "disputed":
          status = ["Completed", "Terminated"];
          invoice_status = ["Disputed"];
          break;
        case "invoiced":
          status = ["Completed", "Terminated"];
          invoice_status = ["Invoiced"];
          break;
        case "approved":
          status = ["Approved"];
          invoice_status = [];
          break;
        default:
          status = ["Completed", "Terminated"];
          invoice_status = ["To Be Invoice"];
      }

      const params = {
        // offset: 0,
        // limit: 5,
        status,
        invoice_status,
        type: "Platform"
      };

      const [total, job_parts] = await Promise.all([
        app.$axios
          .$get(`/api/v1/practice/job-parts/count`, { params })
          .then(res => {
            const total = res.data.count;
            return total;
          }),
        app.$axios
          .$get(`/api/v1/practice/job-parts?offset=0&limit=5`, { params })
          .then(res => {
            const job_parts = res.data.job_parts;
            return job_parts;
          })
      ]);

      const showTable = true;

      return {
        total,
        job_parts,
        showTable
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
      "Practice Notification Locum Invoice Created",
      this.getLocumInvoiceRealTime
    );
    this.$socket.on(
      "Practice Notification Locum Invoice Paid",
      this.getLocumInvoiceRealTime
    );
    this.$socket.on(
      "Practice Notification Locum Invoice Updated",
      this.getLocumInvoiceRealTime
    );
  },
  destroyed() {
    this.removeListener();
  },
  methods: {
    getJobPartsPromiseAll() {
      let status = [];
      let invoice_status = [];
      switch (
        this.$route.query.status && this.$route.query.status.toLowerCase()
      ) {
        case "to-be-invoiced":
          status = ["Completed", "Terminated"];
          invoice_status = ["To Be Invoice"];
          break;
        case "disputed":
          status = ["Completed", "Terminated"];
          invoice_status = ["Disputed"];
          break;
        case "issued":
          status = ["Completed", "Terminated"];
          invoice_status = ["Invoiced"];
          break;
        case "approved":
          status = ["Approved"];
          invoice_status = [];
          break;
        default:
          status = ["Completed", "Terminated"];
          invoice_status = ["To Be Invoice"];
      }

      const params = {
        // offset: 0,
        // limit: 5,
        status,
        invoice_status,
        type: "Platform"
      };

      return Promise.all([
        this.$axios.$get(`/api/v1/practice/job-parts/count`, { params }),
        this.$axios.$get(`/api/v1/practice/job-parts?offset=0&limit=5`, {
          params
        })
      ])
        .then(([responseTotal, responseJobParts]) => {
          this.total = responseTotal.data.count;
          this.job_parts = responseJobParts.data.job_parts;
        })
        .catch(([errTotal, errJobParts]) => {
          console.log(
            "err",
            errTotal.response || errTotal || errJobParts.response || errJobParts
          );
          if (errTotal.response.data.message) {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "danger",
              text: [`${errTotal.response.data.message}`]
            });
          }
          if (errJobParts.response.data.message) {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "danger",
              text: [`${errJobParts.response.data.message}`]
            });
          }
        });
    },
    async refreshJobParts() {
      this.$store.commit("billing/CLEAR_PRACTICE_BILLING_NOTIFICATION");
      this.loading = true;
      await this.getJobPartsPromiseAll();
      this.loading = false;
      this.showRefresh = false;
    },
    getJobParts() {
      let status = [];
      let invoice_status = [];
      switch (
        this.$route.query.status && this.$route.query.status.toLowerCase()
      ) {
        case "to-be-invoiced":
          status = ["Completed", "Terminated"];
          invoice_status = ["To Be Invoice"];
          break;
        case "disputed":
          status = ["Completed", "Terminated"];
          invoice_status = ["Disputed"];
          break;
        case "invoiced":
          status = ["Completed", "Terminated"];
          invoice_status = ["Invoiced"];
          break;
        case "approved":
          status = ["Approved"];
          invoice_status = [];
          break;
        default:
          status = ["Completed", "Terminated"];
          invoice_status = ["To Be Invoice"];
      }

      const params = {
        // offset: 0,
        // limit: 5,
        status,
        invoice_status,
        type: "Platform",
        order_by: this.params.order_by
      };

      return this.$axios
        .$get(`/api/v1/practice/job-parts`, { params })
        .then(res => {
          this.job_parts = res.data.job_parts;
        })
        .catch(err => {
          console.log("err", err.response || err);
          if (err.response.data.message) {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "danger",
              text: [`${err.response.data.message}`]
            });
          }
        });
    },
    updateInvoice(invoice) {
      let index = this.job_parts.findIndex(item => item.id == invoice.id);
      if (index >= 0) {
        this.job_parts.splice(index, 1, invoice);
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
        "Practice Notification Locum Invoice Created",
        this.getLocumInvoiceRealTime
      );
      this.$socket.removeListener(
        "Practice Notification Locum Invoice Paid",
        this.getLocumInvoiceRealTime
      );
      this.$socket.removeListener(
        "Practice Notification Locum Invoice Updated",
        this.getLocumInvoiceRealTime
      );
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
    confirmPayment() {
      this.Validate(this.form);
      if (!this.formError.length) {
        this.$axios
          .$put(
            `/api/v1/practice/locum-invoices/${this.selectedInvoiceId}/paid`,
            this.form
          )
          .then(res => {
            let index = this.invoices.findIndex(
              invoice => invoice.id == res.data.locum_invoice.id
            );
            if (index >= 0) {
              this.invoices.splice(index, 1, res.data.locum_invoice);
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
    async sorted(order_by) {
      this.current_page = 1;
      this.params.offset = 0;
      this.params.order_by = order_by;
      this.loading = true;
      await this.getJobParts();
      this.loading = false;
    },
    async pagechanged(page) {
      this.current_page = page;
      this.params.offset = this.params.limit * (page - 1);
      this.loading = true;
      await this.getJobParts();
      this.loading = false;
    },
    async limitchanged(limit) {
      this.current_page = 1;
      this.params.offset = 0;
      this.params.limit = limit;
      this.loading = true;
      await this.getJobParts();
      this.loading = false;
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