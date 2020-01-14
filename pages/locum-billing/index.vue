<template>
  <section class="relative">
    <div class="flex flex-row justify-start overflow-x-auto pb-3">
      <nuxt-link
        :to="{ path: '/locum-billing', query: { ...$route.query, status: 'to-be-invoiced' } }"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('locum-billing-index') && (!$route.query.status || $route.query.status === 'to-be-invoiced') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >To be invoiced</nuxt-link>
      <nuxt-link
        :to="{ path: '/locum-billing', query: { ...$route.query, status: 'disputed' } }"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('locum-billing-index') && $route.query.status === 'disputed' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Disputed Invoices</nuxt-link>
      <nuxt-link
        :to="{ path: '/locum-billing', query: { ...$route.query, status: 'issued' } }"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('locum-billing-index') && $route.query.status === 'issued' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Invoiced</nuxt-link>
      <nuxt-link
        :to="{ path: '/locum-billing', query: { ...$route.query, status: 'approved' } }"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class=" $route.name.includes('locum-billing-index') && $route.query.status === 'approved' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Approved Invoices</nuxt-link>
      <nuxt-link
        :to="{ path: '/locum-billing', query: { ...$route.query, status: 'pension-form-a' } }"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class=" $route.name.includes('locum-billing-index') && $route.query.status === 'pension-form-a' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >NHS Pensions Form A</nuxt-link>
    </div>
    <transition name="fade" mode="out-in">
      <div v-if="showTable">
        <AppButton
          v-if="showRefresh"
          :label="'Refresh'"
          @click="refreshInvoices"
          :inStyle="'padding:5px 14px;margin-bottom:5px;font-size:14px;'"
        />
        <AppTable
          v-if="job_parts.length > 0"
          :total="total"
          :items="job_parts"
          :currentPage="current_page"
          :perPage="params.limit"
          :columns="columns"
          :orderBy="params.order_by"
          @pagechanged="pagechanged"
          @limitchanged="limitchanged"
          @sorted="sorted"
        >
          <template v-slot:actions="slotProps">
            <div class="flex justify-center">
              <div
                @click="$router.push({ path: `/locum-billing/${slotProps.item.locum_invoice_id}/edit`, query: {...$route.query} })"
                v-if="slotProps.item.locum_invoice_id && slotProps.item.locum_status !== 'Approved'"
                class="mx-1 px-4 py-2 bg-yellow-500 font-bold rounded-lg focus:outline-none"
              >Edit</div>
              <!-- && slotProps.item.invoice_status === 'To Be Invoice' -->
              <button
                v-if="slotProps.item.locum_invoice_id && slotProps.item.locum_status !== 'Approved'"
                @click.stop.prevent="select_invoice(slotProps.item.locum_invoice_id)"
                class="mx-1 px-4 py-2 bg-red-700 text-white font-bold rounded-lg focus:outline-none"
              >Delete</button>
              <div
                @click="$router.push({ path: `/locum-billing/${slotProps.item.id}/create`, query: {...$route.query} })"
                v-if="!slotProps.item.locum_invoice_id"
                class="mx-1 px-4 py-2 bg-green-700 text-white font-bold rounded-lg focus:outline-none"
              >Generate Invoice</div>
              <!-- <div
                v-if="slotProps.item.locum_invoice_id && slotProps.item.status === 'Approved'"
                @click="viewPdf(slotProps.item.locum_invoice_id)"
                class="mx-1 px-4 py-2 bg-yellow-400 font-bold rounded-lg focus:outline-none"
              >View Pdf</div>-->
              <!-- <div
                v-if="slotProps.item.locum_invoice_id && slotProps.item.status === 'Approved'"
                @click="$router.push({ path: `/locum-billing/${slotProps.item.locum_invoice_id}`, query: {...$route.query} })"
                class="mx-1 px-4 py-2 bg-yellow-500 font-bold rounded-lg focus:outline-none"
              >View</div>-->
              <div
                v-if="slotProps.item.locum_invoice_id && slotProps.item.status === 'Approved' && !slotProps.item.locum_form_a_id && slotProps.item.profession_category_name === 'GP'"
                @click="generate(slotProps.item.locum_invoice_id)"
                class="mx-1 px-4 py-2 bg-yellow-400 font-bold rounded-lg focus:outline-none"
              >Generate Form A</div>
              <div
                @click="viewAsPdf(slotProps.item.locum_form_a_id)"
                v-if="slotProps.item.locum_invoice_id && slotProps.item.status === 'Approved' && slotProps.item.locum_form_a_id && slotProps.item.profession_category_name === 'GP'"
                class="mx-1 px-4 py-2 bg-yellow-400 font-bold rounded-lg focus:outline-none"
              >View NHS Form A</div>
              <div
                @click="$router.push({ path: `/locum-billing/${slotProps.item.locum_invoice_id}`, query: {...$route.query} })"
                v-if="slotProps.item.locum_invoice_id && slotProps.item.locum_status === 'Approved' && slotProps.item.locum_invoice_item && slotProps.item.locum_invoice_item.locum_invoice.paid_at"
                class="mx-1 px-4 py-2 bg-yellow-400 font-bold rounded-lg focus:outline-none"
              >Already Paid</div>
            </div>
          </template>
        </AppTable>
        <div v-else class="flex justify-center">{{noJobPartsToDisplay}}</div>
      </div>
    </transition>

    <AppConfirmationModal
      :label="'Proceed to delete this draft?'"
      :confirmLabel="'Yes'"
      :cancelLabel="'Cancel'"
      :modal="delete_modal"
      @confirm="deleteInvoice"
      @cancel="delete_modal = false"
    />

    <transition name="fade" mode="out-in">
      <nuxt-link
        :to="{ name: 'locum-billing-index', query: {...$route.query}}"
        v-if="['locum-billing-index-id', 'locum-billing-index-id-create', 'locum-billing-index-id-edit'].includes($route.name) || delete_modal"
        class="shield"
      ></nuxt-link>
    </transition>
    <nuxt-child @createInvoice="createInvoice" @updateInvoice="updateInvoice" />
  </section>
</template>

<script>
import AppDate from "@/components/Base/AppDate";
import AppButton from "@/components/Base/AppButton";
import AppConfirmationModal from "@/components/Base/AppConfirmationModal";
import AppTable from "@/components/Base/AppTable";
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },
  components: {
    AppDate,
    AppButton,
    AppConfirmationModal,
    AppTable
  },
  data() {
    return {
      showTable: false,
      total: 0,
      job_parts: [],

      showRefresh: false,
      loading: false,
      current_page: 1,

      params: {
        offset: 0,
        limit: 5,
        order_by: []
      },

      columns: [
        {
          name: "Type",
          dataIndex: "job.type"
        },
        {
          name: "Practice / Surgery",
          dataIndex: "practice_name",
          class: "text-center"
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
          name: "Job Number",
          dataIndex: "job_part_number"
        },
        {
          name: "£ Amount",
          dataIndex: "total_amount",
          sortable: true,
          class: "text-center"
        },
        {
          name: "Actions",
          dataIndex: "actions",
          class: "text-center"
        }
      ],

      delete_modal: false,
      invoice_id: null
    };
  },
  computed: {
    authPermissions() {
      return this.$store.getters["auth/permissions"];
    },
    noJobPartsToDisplay() {
      let str = "";
      switch (
        this.$route.query.status &&
        this.$route.query.status.toLowerCase()
      ) {
        case "to-be-invoiced":
          str = "You do not have any completed job parts.";
          break;
        case "disputed":
          str = "You do not have any disputed invoices.";
          break;
        case "issued":
          str = "You do not have any invoiced job parts.";
          break;
        case "approved":
          str = "You do not have any approved job parts.";
          break;
        default:
          str = "You do not have any completed job parts.";
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
      let locum_status = [];
      let invoice_status = [];
      let has_pension_form = false;
      let queryStatus = query.status;
      switch (queryStatus && queryStatus.toLowerCase()) {
        case "to-be-invoiced":
          locum_status = ["Completed", "Terminated"];
          invoice_status = ["To Be Invoice"];
          break;
        case "disputed":
          locum_status = ["Completed", "Terminated"];
          invoice_status = ["Disputed"];
          break;
        case "issued":
          locum_status = ["Completed", "Terminated"];
          invoice_status = ["Invoiced"];
          break;
        case "approved":
          locum_status = ["Approved"];
          invoice_status = [];
          break;
        case "pension-form-a":
          locum_status = ["Approved"];
          invoice_status = [];
          has_pension_form = true;
          break;
        default:
          locum_status = ["Completed", "Terminated"];
          invoice_status = ["To Be Invoice"];
      }

      const params = {
        locum_status,
        invoice_status,
        has_pension_form,
        job_type: "Platform"
      };

      let [total, job_parts] = await Promise.all([
        app.$axios
          .$get(`/api/v1/locum/job-parts/count`, { params })
          .then(res => {
            let total = res.data.count;
            return total;
          }),
        app.$axios
          .$get(`/api/v1/locum/job-parts?offset=0&limit=5`, { params })
          .then(res => {
            let job_parts = res.data.job_parts;
            return job_parts;
          })
      ]);

      job_parts = job_parts.map(jobPart => {
        let total = jobPart.locum_invoice_id
          ? jobPart.locum_invoice_item.total
          : jobPart.job.locum_detail_rate_type.name === "Per Hour"
          ? jobPart.job.rate * jobPart.final_hours
          : (jobPart.job.rate / jobPart.job.total_hours) * jobPart.final_hours;
        return {
          ...jobPart,
          practice_name:
            jobPart.job.type === "Platform"
              ? jobPart.job.platform_job.practice.name
              : jobPart.job.private_job.private_practice.name,
          issued_at: jobPart.locum_invoice_id
            ? jobPart.locum_invoice_item.locum_invoice.issued_at
            : null,
          invoice_number: jobPart.locum_invoice_id
            ? jobPart.locum_invoice_item.locum_invoice.invoice_number
            : null,
          total_amount: total.toFixed(2)
        };
      });

      const showTable = true;

      return {
        showTable,
        total,
        job_parts
      };
    } catch (err) {
      console.log("err", err.response || err);
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
    viewAsPdf(formId) {
      window.open(`${process.env.API_URL}/api/v1/locum-form-a/${formId}/pdf`);
      // this.$axios.$get(`/api/v1/locum-invoices/${invoiceId}/pdf`).then(res => {
      //   console.log(res);
      // });
    },
    generate(invoiceId) {
      this.$axios
        .$post(`/api/v1/locum/locum-invoice-forms`, {
          locum_invoice_id: invoiceId
        })
        .then(res => {
          console.log(res);
        });
    },
    getJobPartsPromiseAll() {
      let locum_status = [];
      let invoice_status = [];
      let queryStatus = this.$route.query.status;

      // if (queryStatus && queryStatus.toLowerCase() === "pension-form-a") {
      //   this.$axios.$get(`/api/v1/locum/locum-invoice-forms`).then(res => {
      //     console.log(res);
      //   });
      // }
      let has_pension_form = false;

      switch (queryStatus && queryStatus.toLowerCase()) {
        case "to-be-invoiced":
          locum_status = ["Completed", "Terminated"];
          invoice_status = ["To Be Invoice"];
          break;
        case "disputed":
          locum_status = ["Completed", "Terminated"];
          invoice_status = ["Disputed"];
          break;
        case "issued":
          locum_status = ["Completed", "Terminated"];
          invoice_status = ["Invoiced"];
          break;
        case "approved":
          locum_status = ["Approved"];
          invoice_status = [];
          break;
        case "pension-form-a":
          locum_status = ["Approved"];
          invoice_status = [];
          has_pension_form = true;
          break;
        default:
          locum_status = ["Completed", "Terminated"];
          invoice_status = ["To Be Invoice"];
      }

      const params = {
        locum_status,
        invoice_status,
        has_pension_form,
        job_type: "Platform"
      };

      return Promise.all([
        this.$axios.$get(`/api/v1/locum/job-parts/count`, { params }),
        this.$axios.$get(`/api/v1/locum/job-parts?offset=0&limit=5`, {
          params
        })
      ])
        .then(([responseTotal, responseJobParts]) => {
          this.total = responseTotal.data.count;
          let job_parts = responseJobParts.data.job_parts;

          this.job_parts = job_parts.map(jobPart => {
            let total = jobPart.locum_invoice_id
              ? jobPart.locum_invoice_item.total
              : jobPart.job.locum_detail_rate_type.name === "Per Hour"
              ? jobPart.job.rate * jobPart.final_hours
              : (jobPart.job.rate / jobPart.job.total_hours) *
                jobPart.final_hours;
            return {
              ...jobPart,
              practice_name:
                jobPart.job.type === "Platform"
                  ? jobPart.job.platform_job.practice.name
                  : jobPart.job.private_job.private_practice.name,
              issued_at: jobPart.locum_invoice_id
                ? jobPart.locum_invoice_item.locum_invoice.issued_at
                : null,
              invoice_number: jobPart.locum_invoice_id
                ? jobPart.locum_invoice_item.locum_invoice.invoice_number
                : null,
              total_amount: total.toFixed(2)
            };
          });
        })
        .catch(([errTotal, errJobParts]) => {
          console.log(
            "err",
            errTotal.response || errTotal || errJobParts.response || errJobParts
          );
          throw err;
        });
    },
    getJobParts() {
      let locum_status = [];
      let invoice_status = [];
      let queryStatus = this.$route.query.status;
      switch (queryStatus && queryStatus.toLowerCase()) {
        case "to-be-invoiced":
          locum_status = ["Completed", "Terminated"];
          invoice_status = ["To Be Invoice"];
          break;
        case "disputed":
          locum_status = ["Completed", "Terminated"];
          invoice_status = ["Disputed"];
          break;
        case "issued":
          locum_status = ["Completed", "Terminated"];
          invoice_status = ["Invoiced"];
          break;
        case "approved":
          locum_status = ["Approved"];
          invoice_status = [];
          break;
        default:
          locum_status = ["Completed", "Terminated"];
          invoice_status = ["To Be Invoice"];
      }

      const params = {
        locum_status,
        invoice_status,
        job_type: "Platform",
        ...this.params
      };

      return this.$axios
        .$get(`/api/v1/locum/job-parts`, { params })
        .then(res => {
          let job_parts = res.data.job_parts;

          this.job_parts = job_parts.map(jobPart => {
            return {
              ...jobPart,
              practice_name:
                jobPart.job.type === "Platform"
                  ? jobPart.job.platform_job.practice.name
                  : jobPart.job.private_job.private_practice.name,
              issued_at: jobPart.locum_invoice_id
                ? jobPart.locum_invoice_item.locum_invoice.issued_at
                : null,
              invoice_number: jobPart.locum_invoice_id
                ? jobPart.locum_invoice_item.locum_invoice.invoice_number
                : null,
              total_amount: jobPart.locum_invoice_id
                ? jobPart.locum_invoice_item.total
                : jobPart.job.locum_detail_rate_type.name === "Per Hour"
                ? jobPart.job.rate * jobPart.final_hours
                : (jobPart.job.rate / jobPart.job.total_hours) *
                  jobPart.final_hours
            };
          });
        })
        .catch(err => {
          console.log("err", err.response || err);
          error({
            statusCode: err.status || 500,
            message: err.message || "Something went wrong!"
          });
        });
    },
    async refreshInvoices() {
      this.$store.commit("billing/CLEAR_LOCUM_BILLING_NOTIFICATION");
      this.loading = true;
      await this.getJobPartsPromiseAll();
      this.loading = false;
      this.showRefresh = false;
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
    select_invoice(id) {
      this.delete_modal = true;
      this.invoice_id = id;
    },
    deleteInvoice() {
      this.$axios
        .$delete(`/api/v1/locum/locum-invoices/${this.invoice_id}`)
        .then(res => {
          let job_part = this.job_parts.find(item => {
            return item.locum_invoice_id === this.invoice_id;
          });
          let index = this.job_parts.findIndex(item => {
            return item.locum_invoice_id === this.invoice_id;
          });
          let queryStatus = this.$route.query.status;

          if (
            !queryStatus ||
            (queryStatus && queryStatus.toLowerCase() === "to-be-invoiced")
          ) {
            job_part.locum_invoice_id = null;
          } else if (
            queryStatus &&
            ["disputed", "issued"].includes(queryStatus.toLowerCase())
          ) {
            this.job_parts.splice(index, 1);
          }

          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`${res.message}`]
          });
          this.delete_modal = false;
        })
        .catch(err => {
          console.log("err", err.response || err);
          if (err.response.data.message) {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: [`${res.date.message}`]
            });
          }
          throw err;
        });
    },
    createInvoice(invoice) {
      let queryStatus = this.$route.query.status;

      let job_part = this.job_parts.find(
        item => item.id === invoice.items[0].job_part.id
      );
      job_part.locum_invoice_id = invoice.id;

      let index = this.job_parts.findIndex(item => item.id === job_part.id);
      if (index >= 0) {
        if (
          !queryStatus ||
          (queryStatus === "to-be-invoiced" && invoice.status === "Draft")
        ) {
          this.job_parts.splice(index, 1, job_part);
        } else if (invoice.status !== "Draft") {
          this.job_parts.splice(index, 1);
        }
      }
    },
    updateInvoice(invoice) {
      let queryStatus = this.$route.query.status;

      let job_part = this.job_parts.find(
        item => item.id === invoice.items[0].job_part.id
      );
      job_part.locum_invoice_id = invoice.id;

      let index = this.job_parts.findIndex(item => item.id === job_part.id);
      if (index >= 0) {
        if (
          ((!queryStatus ||
            (queryStatus && queryStatus === "to-be-invoiced")) &&
            invoice.status === "Draft") ||
          (queryStatus &&
            queryStatus === "issued" &&
            invoice.status === "Issued") ||
          (queryStatus &&
            queryStatus === "disputed" &&
            invoice.status === "Disputed") ||
          (queryStatus &&
            queryStatus === "approved" &&
            invoice.status === "Approved")
        ) {
          this.job_parts.splice(index, 1, job_part);
        } else {
          this.job_parts.splice(index, 1);
        }
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
</style>
