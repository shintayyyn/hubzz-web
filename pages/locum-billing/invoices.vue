<template>
  <section class="relative">
    <div class="flex flex-row justify-start overflow-x-auto pb-3">
      <nuxt-link
        :to="{ path: '/locum-billing/invoices', query: { ...$route.query, status: 'to-be-invoiced' } }"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('locum-billing-invoices') && (!$route.query.status || ($route.query.status && $route.query.status.toLowerCase() === 'to-be-invoiced')) ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >To be invoiced</nuxt-link>
      <nuxt-link
        :to="{ path: '/locum-billing/invoices', query: { ...$route.query, status: 'disputed' } }"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('locum-billing-invoices') && ($route.query.status && $route.query.status.toLowerCase() === 'disputed') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Disputed Invoices</nuxt-link>
      <nuxt-link
        :to="{ path: '/locum-billing/invoices', query: { ...$route.query, status: 'issued' } }"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('locum-billing-invoices') && ($route.query.status && $route.query.status.toLowerCase() === 'issued') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Invoiced</nuxt-link>
      <nuxt-link
        :to="{ path: '/locum-billing/invoices', query: { ...$route.query, status: 'approved' } }"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class=" $route.name.includes('locum-billing-invoices') && ($route.query.status && $route.query.status.toLowerCase() === 'approved') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Approved Invoices</nuxt-link>
      <nuxt-link
        :to="{ path: '/locum-billing/invoices', query: { ...$route.query, status: 'pension-form-a' } }"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class=" $route.name.includes('locum-billing-invoices') && ($route.query.status && $route.query.status.toLowerCase() === 'pension-form-a') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >NHS Pensions Form A</nuxt-link>
      <nuxt-link
        :to="{ path: '/locum-billing/invoices', query: { ...$route.query, status: 'pension-form-b' } }"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('locum-billing-invoices') && ($route.query.status && $route.query.status.toLowerCase() === 'pension-form-b') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >NHS Pensions Form B</nuxt-link>
    </div>
    <div
      class="flex flex-row justify-start overflow-x-auto pb-3"
      v-if="$route.name.includes('locum-billing-invoices') && ($route.query.status && $route.query.status.toLowerCase() === 'pension-form-b')"
    >
      <nuxt-link
        :to="{ name: 'locum-billing-invoices-form-b-create', query: { ...$route.query, status: 'pension-form-b' } }"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap shadow-md border-2 rounded-lg text-gray-800"
      >Generate NHS Form B</nuxt-link>
    </div>

    <transition name="fade" mode="out-in">
      <div v-if="showTable">
        <AppButton
          v-if="showRefresh"
          :label="'Refresh'"
          @click="refreshInvoices"
          :inStyle="'padding:5px 14px;margin-bottom:5px;font-size:14px;'"
        />
        <template
          v-if="(!$route.query.status || ($route.query.status && $route.query.status !== 'pension-form-b'))"
        >
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
              <div class="flex flex-wrap justify-center">
                <div
                  v-if="!slotProps.item.locum_invoice_id"
                  @click="$router.push({ path: `/locum-billing/invoices/${slotProps.item.id}/create`, query: {...$route.query} })"
                  class="my-1 p-2 bg-green-700 text-white font-bold rounded-lg focus:outline-none"
                >Generate Invoice</div>
                <div
                  class="flex justify-between my-1"
                  v-if="slotProps.item.locum_invoice_id && slotProps.item.locum_status !== 'Approved'"
                >
                  <div
                    @click="$router.push({ path: `/locum-billing/invoices/${slotProps.item.locum_invoice_id}/edit`, query: {...$route.query} })"
                    class="mx-1 p-2 bg-yellow-500 font-bold rounded-lg focus:outline-none"
                  >Edit</div>
                  <button
                    @click.stop.prevent="select_invoice(slotProps.item.locum_invoice_id, 'deleteInvoice')"
                    class="mx-1 p-2 bg-red-700 text-white font-bold rounded-lg focus:outline-none w-full"
                  >Delete</button>
                </div>
                <div
                  v-if="slotProps.item.locum_invoice_id && slotProps.item.status === 'Approved'"
                  @click="$router.push({ path: `/locum-billing/invoices/${slotProps.item.locum_invoice_id}`, query: {...$route.query} })"
                  class="my-1 p-2 bg-yellow-500 hover:bg-yellow-400 font-bold rounded-lg focus:outline-none"
                >View</div>
                <div
                  v-if="slotProps.item.locum_invoice_id && slotProps.item.status === 'Approved' && !slotProps.item.locum_form_a_id && !slotProps.item.locum_invoice_item.locum_invoice.paid_at"
                  class="my-1 p-2 font-bold"
                >Waiting For Payment</div>
                <div
                  v-if="slotProps.item.locum_invoice_id && slotProps.item.status === 'Approved' && !slotProps.item.locum_form_a_id && slotProps.item.profession.name === 'GP' && slotProps.item.locum_invoice_item.locum_invoice.paid_at"
                  @click="select_invoice(slotProps.item.locum_invoice_id, 'generateFormA')"
                  class="my-1 p-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg focus:outline-none w-full"
                >Generate Form A</div>
                <div
                  @click="viewAsPdf(slotProps.item.locum_form_a_id, 'form-a')"
                  v-if="slotProps.item.locum_invoice_id && slotProps.item.status === 'Approved' && slotProps.item.locum_form_a_id && slotProps.item.profession.name === 'GP' "
                  class="my-1 p-2 bg-yellow-400 hover:bg-yellow-500 font-bold rounded-lg focus:outline-none"
                >View NHS Form A</div>
              </div>
            </template>
          </AppTable>
          <div v-if="job_parts.length === 0" class="flex justify-center">{{noJobPartsToDisplay}}</div>
        </template>

        <template v-if="($route.query.status && $route.query.status === 'pension-form-b')">
          <AppTable
            v-if="locum_form_bs.length > 0"
            :total="total"
            :items="locum_form_bs"
            :currentPage="current_page"
            :perPage="params.limit"
            :columns="form_bs_columns"
            :orderBy="params.order_by"
            @pagechanged="pagechanged"
            @limitchanged="limitchanged"
            @sorted="sorted"
          >
            <template v-slot:actions="slotProps">
              <div class="flex justify-center">
                <div
                  @click="viewAsPdf(slotProps.item.id, 'form-b')"
                  class="mx-1 px-4 py-2 bg-yellow-400 font-bold rounded-lg focus:outline-none"
                >View NHS Form B</div>
              </div>
            </template>
          </AppTable>
          <div v-if="locum_form_bs.length === 0" class="flex justify-center">{{noJobPartsToDisplay}}</div>
        </template>
      </div>
    </transition>

    <AppConfirmationModal
      :label="'Proceed to delete this draft?'"
      :confirmLabel="'Yes'"
      :cancelLabel="'Cancel'"
      :modal="delete_invoice_modal"
      @confirm="deleteInvoice"
      @cancel="delete_invoice_modal = false"
    />

    <AppConfirmationModal
      :label="'Generate NHS Form A for this Invoice?'"
      :confirmLabel="'Yes'"
      :cancelLabel="'Cancel'"
      :modal="generate_form_a_modal"
      @confirm="generateFormA"
      @cancel="generate_form_a_modal = false"
    />

    <transition name="fade" mode="out-in">
      <nuxt-link
        :to="{ name: 'locum-billing-invoices', query: {...$route.query}}"
        v-if="['locum-billing-invoices-id', 'locum-billing-invoices-id-create', 'locum-billing-invoices-id-edit', 'locum-billing-invoices-form-b-create'].includes($route.name) || delete_invoice_modal"
        class="shield"
      ></nuxt-link>
    </transition>
    <nuxt-child
      @createInvoice="createInvoice"
      @updateInvoice="updateInvoice"
      @createFormB="createFormB"
    />
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
      locum_form_bs: [],

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

      form_bs_columns: [
        {
          name: "Type",
          dataIndex: "type"
        },
        {
          name: "Date Created",
          dataIndex: "date_created",
          sortable: true,
          class: "text-center"
        },
        {
          name: "Actions",
          dataIndex: "actions",
          class: "text-center"
        }
      ],

      delete_invoice_modal: false,
      generate_form_a_modal: false,
      invoice_id: null
    };
  },
  computed: {
    authPermissions() {
      return this.$store.getters["permissions"];
    },
    noJobPartsToDisplay() {
      let str = "";
      let queryStatus = this.$route.query.status;
      switch (queryStatus && queryStatus.toLowerCase()) {
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
        this.params.offset = 0;
        this.params.limit = 5;
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
      let url = `/api/v1/locum/job-parts`;
      let params = null;
      let queryStatus = query.status;

      switch (queryStatus && queryStatus.toLowerCase()) {
        case "to-be-invoiced":
          params = {
            locum_status: ["Completed", "Terminated"],
            invoice_status: ["To Be Invoice"],
            job_type: "Platform"
          };
          break;
        case "disputed":
          params = {
            locum_status: ["Completed", "Terminated"],
            invoice_status: ["Disputed"],
            job_type: "Platform"
          };
          break;
        case "issued":
          params = {
            locum_status: ["Completed", "Terminated"],
            invoice_status: ["Invoiced"],
            job_type: "Platform"
          };
          break;
        case "approved":
          params = {
            locum_status: ["Approved"],
            invoice_status: ["Invoiced"],
            job_type: "Platform"
          };
          break;
        case "pension-form-a":
          params = {
            locum_status: ["Approved"],
            invoice_status: ["Invoiced"],
            // can_generate_form_b: true,
            job_type: "Platform"
          };
          break;
        case "pension-form-b":
          params = {
            type: "Platform"
          };
          url = `/api/v1/locum/locum-invoices-form-b`;
          break;
        default:
          params = {
            locum_status: ["Completed", "Terminated"],
            invoice_status: ["To Be Invoice"],
            job_type: "Platform"
          };
      }

      let locum_form_bs = [];
      let [total, job_parts] = await Promise.all([
        app.$axios.$get(`${url}/count`, { params }).then(res => {
          let total = res.data.count;
          return total;
        }),
        app.$axios.$get(`${url}?offset=0&limit=5`, { params }).then(res => {
          let job_parts = null;
          let locum_form_bs = null;
          if (res.data && res.data.job_parts) {
            return res.data.job_parts;
          } else if (res.data && res.data.locum_form_bs) {
            return res.data.locum_form_bs;
          }
        })
      ]);

      // ! for the meantime
      if (url === `/api/v1/locum/job-parts`) {
        job_parts = job_parts.map(jobPart => {
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
      } else if (url === `/api/v1/locum/locum-invoices-form-b`) {
        job_parts.forEach(item => {
          locum_form_bs.push(item);
        });
      }

      const showTable = true;

      return {
        showTable,
        total,
        job_parts,
        locum_form_bs
      };
    } catch (err) {
      console.log("err", err.response || err);
      // error({
      //   statusCode: err.status || 500,
      //   message: err.message || "Something went wrong!"
      // });
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
    viewAsPdf(formId, type) {
      let url =
        type === "form-a" ? `/api/v1/locum-form-a` : `/api/v1/locum-form-b`;
      window.open(`${process.env.API_URL}${url}/${formId}/pdf`);
    },
    generateFormA() {
      this.$axios
        .$post(`/api/v1/locum/locum-invoices-form-a`, {
          locum_invoice_id: this.invoice_id
        })
        .then(res => {
          let index = this.job_parts.findIndex(
            item => item.locum_invoice_id === this.invoice_id
          );
          if (index >= 0) {
            let jobPart = this.job_parts[index];
            jobPart.locum_form_a_id = res.data.locum_invoice_form_a.id;
            this.job_parts.splice(index, 1, jobPart);
          }

          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`${res.message}`]
          });
        })
        .catch(err => {
          console.log("err", err.response || err);
          if (err.response && err.response.data && err.response.data.message) {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: [`${res.date.message}`]
            });
          }
          throw err;
        })
        .finally(() => {
          this.generate_form_a_modal = false;
        });
    },
    getJobPartsPromiseAll() {
      let url = `/api/v1/locum/job-parts`;
      let params = null;
      let queryStatus = this.$route.query.status;

      switch (queryStatus && queryStatus.toLowerCase()) {
        case "to-be-invoiced":
          params = {
            locum_status: ["Completed", "Terminated"],
            invoice_status: ["To Be Invoice"],
            job_type: "Platform"
          };
          break;
        case "disputed":
          params = {
            locum_status: ["Completed", "Terminated"],
            invoice_status: ["Disputed"],
            job_type: "Platform"
          };
          break;
        case "issued":
          params = {
            locum_status: ["Completed", "Terminated"],
            invoice_status: ["Invoiced"],
            job_type: "Platform"
          };
          break;
        case "approved":
          params = {
            locum_status: ["Approved"],
            invoice_status: ["Invoiced"],
            job_type: "Platform"
          };
          break;
        case "pension-form-a":
          params = {
            locum_status: ["Approved"],
            invoice_status: ["Invoiced"],
            // can_generate_form_b: true,
            job_type: "Platform"
          };
          break;
        case "pension-form-b":
          params = {
            type: "Platform"
          };
          url = `/api/v1/locum/locum-invoices-form-b`;
          break;
        default:
          params = {
            locum_status: ["Completed", "Terminated"],
            invoice_status: ["To Be Invoice"],
            job_type: "Platform"
          };
      }

      return Promise.all([
        this.$axios.$get(`${url}/count`, { params }),
        this.$axios.$get(`${url}?offset=0&limit=5`, {
          params
        })
      ])
        .then(([responseTotal, response]) => {
          this.total = responseTotal.data.count;
          if (response.data && response.data.job_parts) {
            let job_parts = response.data.job_parts;

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
          } else if (response.data && response.data.locum_form_bs) {
            this.locum_form_bs = response.data.locum_form_bs.map(item => item);
          }
        })
        .catch(([errTotal, err]) => {
          console.log(
            "err",
            errTotal.response || errTotal || err.response || err
          );
          throw err;
        });
    },
    getJobParts() {
      let url = `/api/v1/locum/job-parts`;
      let params = null;
      let queryStatus = this.$route.query.status;

      switch (queryStatus && queryStatus.toLowerCase()) {
        case "to-be-invoiced":
          params = {
            locum_status: ["Completed", "Terminated"],
            invoice_status: ["To Be Invoice"],
            job_type: "Platform",
            offset: this.params.offset,
            limit: this.params.limit
          };
          break;
        case "disputed":
          params = {
            locum_status: ["Completed", "Terminated"],
            invoice_status: ["Disputed"],
            job_type: "Platform",
            offset: this.params.offset,
            limit: this.params.limit
          };
          break;
        case "issued":
          params = {
            locum_status: ["Completed", "Terminated"],
            invoice_status: ["Invoiced"],
            job_type: "Platform",
            offset: this.params.offset,
            limit: this.params.limit
          };
          break;
        case "approved":
          params = {
            locum_status: ["Approved"],
            invoice_status: ["Invoiced"],
            job_type: "Platform",
            offset: this.params.offset,
            limit: this.params.limit
          };
          break;
        case "pension-form-a":
          params = {
            locum_status: ["Approved"],
            invoice_status: ["Invoiced"],
            // can_generate_form_b: true,
            job_type: "Platform",
            offset: this.params.offset,
            limit: this.params.limit
          };
          break;
        case "pension-form-b":
          params = {
            type: "Platform",
            offset: this.params.offset,
            limit: this.params.limit
          };
          url = `/api/v1/locum/locum-invoices-form-b`;
          break;
        default:
          params = {
            locum_status: ["Completed", "Terminated"],
            invoice_status: ["To Be Invoice"],
            job_type: "Platform",
            ...this.params
          };
      }
      return this.$axios
        .$get(`${url}`, { params })
        .then(res => {
          if (res.data && res.data.job_parts) {
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
          } else if (res.data && res.data.locum_form_bs) {
            this.locum_form_bs = res.data.locum_form_bs.map(item => item);
          }
        })
        .catch(err => {
          console.log("err", err.response || err);
          // error({
          //   statusCode: err.status || 500,
          //   message: err.message || "Something went wrong!"
          // });
        });
    },
    async refreshInvoices() {
      this.loading = true;
      this.current_page = 1;
      this.params.offset = 0;
      this.params.limit = 5;
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
    select_invoice(id, type) {
      this.invoice_id = id;
      if (type === "deleteInvoice") {
        this.delete_invoice_modal = true;
      } else if (type === "generateFormA") {
        this.generate_form_a_modal = true;
      }
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
          let queryStatus = this.$route.query.status.toLowerCase();

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
        })
        .finally(() => {
          this.delete_invoice_modal = false;
        });
    },
    createFormB(invoice) {
      this.locum_form_bs.push(invoice);
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
          queryStatus &&
          queryStatus.toLowerCase() === "to-be-invoiced" &&
          invoice.status === "Draft"
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
            (queryStatus && queryStatus.toLowerCase() === "to-be-invoiced")) &&
            invoice.status === "Draft") ||
          (queryStatus &&
            queryStatus.toLowerCase() === "issued" &&
            invoice.status === "Issued") ||
          (queryStatus &&
            queryStatus.toLowerCase() === "disputed" &&
            invoice.status === "Disputed") ||
          (queryStatus &&
            queryStatus.toLowerCase() === "approved" &&
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
