<template>
  <section class="relative">
    <div class="flex flex-row justify-start overflow-x-auto pb-3">
      <nuxt-link
        :to="{ path: '/locum-billing/private-invoices', query: { ...$route.query, status: 'to-be-invoiced' } }"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('locum-billing-private-invoices') && (!$route.query.status || $route.query.status === 'to-be-invoiced') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >To be invoiced</nuxt-link>
      <nuxt-link
        :to="{ path: '/locum-billing/private-invoices', query: { ...$route.query, status: 'disputed' } }"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name === 'locum-billing-private-invoices' && $route.query.status === 'disputed' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Disputed Invoices</nuxt-link>
      <nuxt-link
        :to="{ path: '/locum-billing/private-invoices', query: { ...$route.query, status: 'issued' } }"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name === 'locum-billing-private-invoices' && $route.query.status === 'issued' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Invoiced</nuxt-link>
      <nuxt-link
        :to="{ path: '/locum-billing/private-invoices', query: { ...$route.query, status: 'approved' } }"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class=" $route.name === 'locum-billing-private-invoices' && $route.query.status === 'approved' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Approved Invoices</nuxt-link>
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
          v-if="billing_job_parts.length > 0"
          :total="total"
          :items="billing_job_parts"
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
              <nuxt-link
                :to="`/locum-billing/invoices/${slotProps.item.locum_invoice_id}`"
                v-if="slotProps.item.locum_invoice_id"
                class="mx-1 px-4 py-2 bg-yellow-500 font-bold rounded-lg focus:outline-none"
              >Edit</nuxt-link>
              <button
                @click.stop.prevent="onClick(slotProps.item.locum_invoice_id)"
                v-if="slotProps.item.locum_invoice_id"
                class="mx-1 px-4 py-2 bg-red-700 text-white font-bold rounded-lg focus:outline-none"
              >Delete</button>
              <nuxt-link
                :to="{ path: `/locum-billing/private-invoices/create/${slotProps.item.id}` }"
                v-if="!slotProps.item.locum_invoice_id"
                class="mx-1 px-4 py-2 bg-green-700 text-white font-bold rounded-lg focus:outline-none"
              >Generate Invoice</nuxt-link>
            </div>
          </template>
        </AppTable>
        <div v-else class="flex justify-center">{{noJobPartsToDisplay}}</div>
      </div>
    </transition>

    <!--   <AppConfirmationModal
      :label="'Proceed to delete this invoice?'"
      :confirmLabel="'Yes'"
      :cancelLabel="'Cancel'"
      :modal="deleteModal"
      @confirm="deleteInvoice"
      @cancel="deleteModal = false"
    />-->
    <transition name="fade" mode="out-in">
      <nuxt-link
        :to="'/locum-billing/private-invoices'"
        v-if="['locum-billing-private-invoices-edit-invoice_id', 'locum-billing-private-invoices-create-job_part_id'].includes($route.name) || deleteModal"
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
      showTable: false,
      total: 0,
      billing_job_parts: [],

      showRefresh: false,
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
          dataIndex: "job.type"
        },
        {
          name: "Practice / Surgery",
          dataIndex: "practice.name",
          class: "text-center"
        },
        // {
        //   name: "Created At",
        //   dataIndex: "date_created",
        //   class: "text-center localDate",
        //   sortable: true
        // },
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
          dataIndex: "amount",
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
    },
    noJobPartsToDisplay() {
      let str = "";
      switch (
        this.$route.query.status && this.$route.query.status.toLowerCase()
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
        default:
          locum_status = ["Completed", "Terminated"];
          invoice_status = ["To Be Invoice"];
      }

      const params = {
        locum_status,
        invoice_status,
        job_type: "Private"
      };

      const [total, job_parts] = await Promise.all([
        app.$axios
          .$get(`/api/v1/locum/job-parts/count`, { params })
          .then(res => {
            const total = res.data.count;
            return total;
          }),
        app.$axios
          .$get(`/api/v1/locum/job-parts?offset=0&limit=5`, { params })
          .then(res => {
            const job_parts = res.data.job_parts;
            return job_parts;
          })
      ]);

      const billing_job_parts = [];
      job_parts.forEach(jobPart => {
        billing_job_parts.push({
          ...jobPart,
          practice:
            jobPart.job.type === "Platform"
              ? jobPart.job.platform_job.practice
              : jobPart.job.private_job.private_practice,
          date_created: jobPart.issued ? "date created" : "",
          issued_at: jobPart.issued ? "issued date" : "",
          invoice_number: jobPart.issued ? "invoiced number" : "",
          job_part_number: jobPart.job_part_number,
          amount: "amount",
          status: "status"
        });
      });

      const showTable = true;

      return {
        showTable,
        total,
        billing_job_parts
      };
    } catch (err) {
      console.log("err", err.response || err);
      if (err.response.data.message) {
        if (err.response.data.message) {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "danger",
            text: [`${err.response.data.message}`]
          });
        }
      }
      throw err;
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
    getJobPartsPromiseAll() {
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
        job_type: "Private"
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

          this.billing_job_parts = [];
          job_parts.forEach(jobPart => {
            this.billing_job_parts.push({
              ...jobPart,
              practice:
                jobPart.job.type === "Platform"
                  ? jobPart.job.platform_job.practice
                  : jobPart.job.private_job.private_practice,
              date_created: jobPart.issued ? "date created" : "",
              issued_at: jobPart.issued ? "issued date" : "",
              invoice_number: jobPart.issued ? "invoiced number" : "",
              job_part_number: jobPart.job_part_number,
              amount: "amount",
              status: "status"
            });
          });
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
    async refreshInvoices() {
      this.$store.commit("billing/CLEAR_LOCUM_BILLING_NOTIFICATION");
      this.loading = true;
      await this.getInvoicesPromiseAll();
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
    getInvoicesPromiseAll() {
      let params = {
        offset: 0,
        limit: 5
      };
      return Promise.all([
        this.$axios.$get(`/api/v1/locum/locum-invoices/count`),
        this.$axios.$get(`/api/v1/locum/locum-invoices`, { params })
      ])
        .then(([responseTotal, responseInvoices]) => {
          this.total = responseTotal.data.count;
          this.invoices = responseInvoices.data.locum_invoices;
        })
        .catch(([errTotal, errInvoices]) => {
          console.log("err", errTotal.response || errTotal);
          console.log("err", errInvoices.response || errInvoices);
          if (errTotal.response.data.message) {
            if (errTotal.response.data.message) {
              this.$store.commit("SET_NOTIFICATION", {
                enabled: true,
                status: "danger",
                text: [`${errTotal.response.data.message}`]
              });
            }
            if (errInvoices.response.data.message) {
              this.$store.commit("SET_NOTIFICATION", {
                enabled: true,
                status: "danger",
                text: [`${errInvoices.response.data.message}`]
              });
            }
          }
        })
        .finally(() => {});
    },
    getInvoices(params) {
      return this.$axios
        .$get(`/api/v1/locum/locum-invoices`, { params })
        .then(res => {
          this.invoices = res.data.locum_invoices;
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
    onClick(id) {
      this.selectedInvoiceId = null;
      this.deleteModal = true;
      this.selectedInvoiceId = id;
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
    async sorted(order_by) {
      this.current_page = 1;
      this.params.offset = 0;
      this.params.order_by = order_by;
      this.loading = true;
      await this.getInvoices();
      this.loading = false;
    },
    async pagechanged(page) {
      this.current_page = page;
      this.params.offset = this.params.limit * (page - 1);
      this.loading = true;
      await this.getInvoices();
      this.loading = false;
    },
    async limitchanged(limit) {
      this.current_page = 1;
      this.params.offset = 0;
      this.params.limit = limit;
      this.loading = true;
      await this.getInvoices();
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
