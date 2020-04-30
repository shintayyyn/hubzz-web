<template>
  <section class="relative">
    <div class="flex flex-row justify-start overflow-x-auto pb-3">
      <nuxt-link
        :to="{ path: '/practice-billing/invoices-from-locums', query: { ...$route.query, status: 'to-be-invoiced' } }"
        class="md:mr-5 p-3 text-xs font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('practice-billing-invoices-from-locums') && (!$route.query.status || ($route.query.status && $route.query.status.toLowerCase() === 'to-be-invoiced')) ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >To be Invoiced</nuxt-link>
      <nuxt-link
        :to="{ path: '/practice-billing/invoices-from-locums', query: { ...$route.query, status: 'disputed' } }"
        class="md:mr-5 p-3 text-xs font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('practice-billing-invoices-from-locums') && ($route.query.status && $route.query.status.toLowerCase() === 'disputed') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Disputed Invoices</nuxt-link>
      <nuxt-link
        :to="{ path: '/practice-billing/invoices-from-locums', query: { ...$route.query, status: 'issued' } }"
        class="md:mr-5 p-3 text-xs font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('practice-billing-invoices-from-locums') && ($route.query.status && $route.query.status.toLowerCase() === 'issued') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Invoiced</nuxt-link>
      <nuxt-link
        :to="{ path: '/practice-billing/invoices-from-locums', query: { ...$route.query, status: 'approved' } }"
        class="md:mr-5 p-3 text-xs font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('practice-billing-invoices-from-locums') && ($route.query.status && $route.query.status.toLowerCase() === 'approved') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Approved Invoices</nuxt-link>
    </div>
    <transition name="fade" mode="out-in">
      <div v-if="initialLoading" class="relative flex w-full" style="min-height:80px">
        <AppLoading :loading="initialLoading" spinner />
      </div>
      <div v-if="!initialLoading">
        <AppButton
          v-if="!['pension-form-a', 'pension-form-b'].includes($route.query.status)"
          :label="'Filter'"
          :in-style="'padding:5px 14px;margin-bottom:5px;font-size:14px;'"
          @click="filterModal = !filterModal"
        />
        <AppButton
          v-if="showRefresh"
          :label="'Refresh'"
          :in-style="'padding:5px 14px;margin-bottom:5px;font-size:14px;'"
          @click="refreshInvoices"
        />
        <div
          class="flex-wrap justify-start items-end z-10 absolute w-full bg-white shadow-lg p-3 rounded-lg"
          :class="filterModal ? 'flex' : 'hidden'"
        >
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput
              v-model="job_ir35"
              class="px-1"
              :type="'select'"
              :name="'type'"
              :label="'Inside ir35'"
              :items="[{ label: 'Yes', value: true },{ label: 'No', value: false}, { label: 'All', value: null} ]"
            />
          </div>
          <div class="md:px-1 flex w-full">
            <AppButton
              :label="'Clear'"
              :in-style="'padding:5px 14px;margin-bottom:5px'"
              @click="clearFilters"
            />
            <AppButton
              class="mx-2"
              :label="'Search'"
              :in-style="'padding:5px 14px;margin-bottom:5px'"
              @click="filterJobParts"
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
          v-if="job_parts.length > 0"
          :total="total"
          :items="job_parts"
          :loading="loading"
          :current-page="current_page"
          :per-page="limit"
          :columns="columns"
          :order-by="order_by"
          @pagechanged="pagechanged"
          @limitchanged="limitchanged"
          @sorted="sorted"
        >
          <template v-slot:actions="slotProps">
            <div
              v-if="practice.type !== 'Spoke' || 
                (practice.type === 'Spoke' && !practice.parent_practice_id) ||
                (practice.type === 'Spoke' && practice.parent_practice_id && practice.allow_surgery_bill_locum === true)"
              class="flex flex-wrap justify-center"
            >
              <div
                v-if="slotProps.item.locum_invoice_id && slotProps.item.invoice_status !== 'To Be Invoice' && slotProps.item.status !== 'Approved'"
                class="my-1 py-2 px-3 bg-yellow-500 hover:bg-yellow-400 font-bold rounded-lg focus:outline-none cursor-pointer transition-hover"
                @click="$router.push({ path: `/practice-billing/invoices-from-locums/${slotProps.item.locum_invoice_id}/edit`, query: {...$route.query} })"
              >Edit</div>
              <div
                v-if="slotProps.item.status === 'Approved' && slotProps.item.locum_invoice_item"
                class="mx-1 py-2 px-3 bg-yellow-500 hover:bg-yellow-400 font-bold rounded-lg focus:outline-none cursor-pointer transition-hover"
                @click="$router.push({ path: `/practice-billing/invoices-from-locums/${slotProps.item.locum_invoice_id}`, query: {...$route.query} })"
              >View</div>
              <button
                v-if="slotProps.item.status === 'Approved' && slotProps.item.locum_invoice_item && !slotProps.item.locum_invoice_item.locum_invoice.paid_at"
                class="my-1 py-2 px-3 font-bold rounded-lg focus:outline-none cursor-pointer transition-hover bg-yellow-400 hover:bg-yellow-500"
                @click.stop.prevent="select_invoice(slotProps.item.locum_invoice_id)"
              >Mark as Paid</button>
            </div>
            <div v-else class="text-gray-600">Disabled by Hub</div>
          </template>
        </AppTable>
        <div
          v-if="!job_parts.length && !isFiltered"
          class="flex justify-center"
        >{{ noJobPartsToDisplay }}</div>
        <div v-if="!job_parts.length && isFiltered" class="flex justify-center py-4">No Jobs Found</div>

        <div v-if="payment_modal" class="p-2">
          <div class="rounded-lg shadow-md px-4 py-8 md:px-8 payment-modal border w-5/6 md:w-1/3">
            <AppDate
              v-model="form.paid_at"
              :name="'paid_at'"
              :label="'Payment made on'"
              :error="formError.find(item => item.field === 'paid_at')"
              is-before
            />
            <template v-if="ir35">
              <AppInput
                v-model="form.ni"
                :type="'select'"
                :name="'ni'"
                :label="'NI'"
                :items="[{ label: 'No', value: false }, { label: 'Yes', value: true }]"
              />
              <AppInput
                v-if="[true, 'true'].includes(form.ni)"
                v-model="form.ni_amount"
                :type="'number'"
                :name="'ni_amount'"
                :label="'NI Amount'"
                :in-style="'padding-top:0.5rem;padding-bottom:0.5rem;text-align:right'"
                :limit="8"
                :error="formError.find(item => item.field === 'ni_amount')"
              />
              <AppInput
                v-model="form.paye"
                :type="'select'"
                :name="'paye'"
                :label="'PAYE'"
                :items="[{ label: 'No', value: false }, { label: 'Yes', value: true }]"
              />
              <AppInput
                v-if="[true, 'true'].includes(form.paye)"
                v-model="form.paye_amount"
                :type="'number'"
                :name="'paye_amount'"
                :label="'PAYE Amount'"
                :in-style="'padding-top:0.5rem;padding-bottom:0.5rem;text-align:right'"
                :limit="8"
                :error="formError.find(item => item.field === 'paye_amount')"
              />
            </template>
            <div class="flex flex-row flex-no-wrap justify-center">
              <AppButton
                class="mx-1"
                :label="'Save'"
                :in-style="'padding:5px 10px'"
                @click="confirmPayment"
              />
              <AppButton
                class="mx-1"
                :label="'Cancel'"
                :in-style="'padding:5px 10px'"
                @click="payment_modal = false"
              />
            </div>
          </div>
        </div>

        <transition name="fade" mode="out-in">
          <nuxt-link
            v-if="['practice-billing-invoices-from-locums-id', 'practice-billing-invoices-from-locums-id-edit'].includes($route.name) || payment_modal"
            :to="{ name: 'practice-billing-invoices-from-locums', query: {...$route.query}}"
            class="shield"
          />
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
import AppInput from "@/components/Base/AppInput";
import AppLoading from "@/components/Base/AppLoading";
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },
  components: {
    AppTable,
    AppDate,
    AppButton,
    AppLoading,
    AppInput
  },
  data() {
    return {
      user: "",
      practice: "",

      initialLoading: false,
      loading: false,
      filterModal: false,
      isFiltered: false,
      total: 0,
      job_parts: [],

      showRefresh: false,
      current_page: 1,

      offset: 0,
      limit: 5,
      order_by: [],
      job_ir35: null,

      payment_modal: false,
      invoice_id: null,
      form: {
        paid_at: null,
        ni: false,
        ni_amount: null,
        paye: false,
        paye_amount: null
      },
      formError: []
    };
  },
  computed: {
    columns() {
      let columns = [];
      let queryStatus = this.$route.query.status
        ? this.$route.query.status.toLowerCase()
        : "to-be-invoiced";

      columns.push(
        {
          name: "Practice / Surgery",
          dataIndex: "practice_name",
          class: "text-center"
        },
        // {
        //   name: "Issued",
        //   dataIndex: "issued_at",
        //   class: "text-center localDate",
        //   sortable: true
        // },
        {
          name: "Invoice Number",
          dataIndex: "invoice_number"
        },
        {
          name: "Job Number",
          dataIndex: "job_part_number"
        },
        {
          name: "Job Title",
          dataIndex: "job_title"
        },
        {
          name: "£ Amount",
          dataIndex: "total_amount",
          class: "text-center currency",
          sortable: true
        },
        {
          name: "Under IR35",
          dataIndex: "job_ir35",
          class: "text-center"
        },
        {
          name: "Under Parent Practice",
          dataIndex: "under_parent_practice",
          class: "text-center"
        }
      );
      if (["approved", "pension-form-a"].includes(queryStatus)) {
        columns.push({
          name: "Paid",
          dataIndex: "paid",
          class: "text-center"
        });
      }
      if (queryStatus === 'approved') {
        columns.push({
          name: "Approved At",
          dataIndex: "approved_at",
          class: "text-center localDate"
        })
      }else {
        columns.push({
          name: "Issued",
          dataIndex: "issued_at",
          class: "text-center localDate",
          sortable: true
        })
      }
      columns.push({
        name: "Actions",
        dataIndex: "actions",
        class: "text-center"
      });
      return columns;
    },
    ir35() {
      if (!this.invoice_id) {
        return false;
      }
      let selectedInvoice = this.job_parts.find(
        item => item.locum_invoice_id === this.invoice_id
      );
      return selectedInvoice.job_ir35 ? selectedInvoice.job_ir35 : false;
    },
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
        case "pension-form-a":
          str = "You do not have any nhs form a.";
          break;
        case "pension-form-b":
          str = "You do not have any nhs form b.";
          break;
        default:
          str = "You do not have any completed job parts.";
      }
      return str;
    }
  },
  watch: {
    async "$route.query"(newValue, oldValue) {
      let newStatus = newValue.status;
      let oldStatus = oldValue.status;
      if (newStatus && newStatus !== null && newStatus !== oldStatus) {
        this.current_page = 1;
        this.filterModal = false;
        this.showRefresh = false;
        this.total = 0;
        this.job_parts = [];
        this.clearFilters();
        this.isFiltered = false;
        this.initialLoading = true;
        await this.getJobPartsPromiseAll();
        this.initialLoading = false;
      }
    },
    "form.ni"(value) {
      if ([false, "false"].includes(value)) {
        this.form.ni_amount = 0;
      }
    },
    "form.paye"(value) {
      if ([false, "false"].includes(value)) {
        this.form.paye_amount = 0;
      }
    }
  },
  async asyncData({ app, query, error }) {
    try {
      let invoice_status = [];
      let status = [];
      let locum_invoiceable;
      let queryStatus = query.status;

      switch (queryStatus && queryStatus.toLowerCase()) {
        case "to-be-invoiced":
          invoice_status.push("To Be Invoice");
          status = ["Completed", "Declined", "Cancelled"];
          locum_invoiceable = true;
          break;
        case "disputed":
          invoice_status.push("Disputed");
          status = ["Completed", "Declined", "Cancelled"];
          locum_invoiceable = true;
          break;
        case "issued":
          invoice_status.push("Invoiced");
          status = ["Completed", "Declined", "Cancelled"];
          locum_invoiceable = true;
          break;
        case "approved":
          invoice_status.push("Invoiced");
          status.push("Approved");
          locum_invoiceable = true;
          break;
        default:
          invoice_status.push("To Be Invoice");
          status = ["Completed", "Declined", "Cancelled"];
          locum_invoiceable = true;
      }

      let [total, job_parts] = await Promise.all([
        app.$axios
          .$get(`/api/v1/practice/job-parts/count`, {
            params: {
              invoice_status,
              status,
              locum_invoiceable,
              type: "Platform",
              job_practice_id: [app.$auth.user.practice_id]
            }
          })
          .then(res => {
            const total = res.data.count;
            return total;
          }),
        app.$axios
          .$get(`/api/v1/practice/job-parts`, {
            params: {
              invoice_status,
              status,
              locum_invoiceable,
              type: "Platform",
              job_practice_id: [app.$auth.user.practice_id],
              offset: 0,
              limit: 5
            }
          })
          .then(res => {
            const job_parts = res.data.job_parts;
            return job_parts;
          })
      ]);

      job_parts = job_parts.map(jobPart => {
        // Job Part Total Rate (Per Hour) = (Final Hours + (Final Minutes / 60)) * Rate
        // Job Part Total Rate (Per Session) = (Final Hours + (Final Minutes / 60)) * (Rate / (Total Hours + (Total Minutes / 60)))

        let type;
        let finalHours;
        let totalHours;
        let total;

        if (jobPart.locum_invoice_item) {
          total = jobPart.locum_invoice_item.locum_invoice.total_amount;

          if (jobPart.locum_invoice_item.locum_invoice.paid_at) {
            total =
              total -
              jobPart.locum_invoice_item.locum_invoice.ni_amount -
              jobPart.locum_invoice_item.locum_invoice.paye_amount;
          }
        } else if (!jobPart.locum_invoice_item) {
          type = jobPart.job.locum_detail_rate_type.name;
          finalHours = jobPart.final_hours / 60;
          totalHours = jobPart.job.total_hours / 60;
          total = 0;

          switch (type) {
            case "Per Hour":
              total = finalHours * jobPart.job.rate;
              break;
            default:
              total = finalHours * (jobPart.job.rate / totalHours);
              break;
          }
        }

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
          total_amount: total,
          paid:
            jobPart.status === "Approved" &&
            jobPart.locum_invoice_item.locum_invoice.paid_at
              ? "Yes"
              : "No",
          under_parent_practice:
            jobPart.locum_invoice_id &&
            jobPart.locum_invoice_item.locum_invoice.parent_practice_id
              ? "Yes"
              : "No"
        };
      });

      return {
        total,
        job_parts
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
  created() {
    this.user = this.$auth.user;
    this.practice = this.$auth.user.practice_detail.practice;
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
      let locum_invoiceable;
      let queryStatus = this.$route.query.status;

      switch (queryStatus && queryStatus.toLowerCase()) {
        case "to-be-invoiced":
          invoice_status.push("To Be Invoice");
          status = ["Completed", "Declined", "Cancelled"];
          locum_invoiceable = true;
          break;
        case "disputed":
          invoice_status.push("Disputed");
          status = ["Completed", "Declined", "Cancelled"];
          locum_invoiceable = true;
          break;
        case "issued":
          invoice_status.push("Invoiced");
          status = ["Completed", "Declined", "Cancelled"];
          locum_invoiceable = true;
          break;
        case "approved":
          invoice_status.push("Invoiced");
          status.push("Approved");
          locum_invoiceable = true;
          break;
        default:
          invoice_status.push("To Be Invoice");
          status = ["Completed", "Declined", "Cancelled"];
          locum_invoiceable = true;
      }

      return Promise.all([
        this.$axios.$get(`/api/v1/practice/job-parts/count`, {
          params: {
            invoice_status,
            status,
            locum_invoiceable,
            type: "Platform",
            job_ir35: this.job_ir35,
            job_practice_id: [this.$auth.user.practice_id]
          }
        }),
        this.$axios.$get(`/api/v1/practice/job-parts`, {
          params: {
            invoice_status,
            status,
            locum_invoiceable,
            type: "Platform",
            job_ir35: this.job_ir35,
            job_practice_id: [this.$auth.user.practice_id],
            offset: 0,
            limit: 5
          }
        })
      ])
        .then(([responseTotal, responseJobParts]) => {
          this.total = responseTotal.data.count;
          let job_parts = responseJobParts.data.job_parts;
          this.job_parts = job_parts.map(jobPart => {
            let type;
            let finalHours;
            let totalHours;
            let total;

            if (jobPart.locum_invoice_item) {
              total = jobPart.locum_invoice_item.locum_invoice.total_amount;

              if (jobPart.locum_invoice_item.locum_invoice.paid_at) {
                total =
                  total -
                  jobPart.locum_invoice_item.locum_invoice.ni_amount -
                  jobPart.locum_invoice_item.locum_invoice.paye_amount;
              }
            } else if (!jobPart.locum_invoice_item) {
              type = jobPart.job.locum_detail_rate_type.name;
              finalHours = jobPart.final_hours / 60;
              totalHours = jobPart.job.total_hours / 60;
              total = 0;

              switch (type) {
                case "Per Hour":
                  total = finalHours * jobPart.job.rate;
                  break;
                default:
                  total = finalHours * (jobPart.job.rate / totalHours);
                  break;
              }
            }

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
              total_amount: total,
              paid:
                jobPart.status === "Approved" &&
                jobPart.locum_invoice_item.locum_invoice.paid_at
                  ? "Yes"
                  : "No",
              under_parent_practice:
                jobPart.locum_invoice_id &&
                jobPart.locum_invoice_item.locum_invoice.parent_practice_id
                  ? "Yes"
                  : "No"
            };
          });
        })
        .catch(([errTotal, errJobParts]) => {
          console.log(
            "err",
            errTotal.response || errTotal || errJobParts.response || errJobParts
          );
        });
    },
    async filterJobParts() {
      this.current_page = 1;
      this.offset = 0;
      this.limit = 5;
      this.initialLoading = true;
      this.isFiltered = true;
      await this.getJobPartsPromiseAll();
      this.initialLoading = false;
      this.filterModal = false;
    },
    getJobParts() {
      let status = [];
      let invoice_status = [];
      let locum_invoiceable;
      let queryStatus = this.$route.query.status;
      switch (queryStatus && queryStatus.toLowerCase()) {
        case "to-be-invoiced":
          invoice_status.push("To Be Invoice");
          status = ["Completed", "Declined", "Cancelled"];
          locum_invoiceable = true;
          break;
        case "disputed":
          invoice_status.push("Disputed");
          status = ["Completed", "Declined", "Cancelled"];
          locum_invoiceable = true;
          break;
        case "issued":
          invoice_status.push("Invoiced");
          status = ["Completed", "Declined", "Cancelled"];
          locum_invoiceable = true;
          break;
        case "approved":
          invoice_status.push("Invoiced");
          status.push("Approved");
          locum_invoiceable = true;
          break;
        default:
          invoice_status.push("To Be Invoice");
          status = ["Completed", "Declined", "Cancelled"];
          locum_invoiceable = true;
      }

      return this.$axios
        .$get(`/api/v1/practice/job-parts`, {
          params: {
            invoice_status,
            status,
            locum_invoiceable,
            type: "Platform",
            job_ir35: this.job_ir35,
            job_practice_id: [this.$auth.user.practice_id],
            offset: this.offset,
            limit: this.limit,
            order_by: this.order_by
          }
        })
        .then(res => {
          let job_parts = res.data.job_parts;

          this.job_parts = job_parts.map(jobPart => {
            let type;
            let finalHours;
            let totalHours;
            let total;

            if (jobPart.locum_invoice_item) {
              total = jobPart.locum_invoice_item.locum_invoice.total_amount;

              if (jobPart.locum_invoice_item.locum_invoice.paid_at) {
                total =
                  total -
                  jobPart.locum_invoice_item.locum_invoice.ni_amount -
                  jobPart.locum_invoice_item.locum_invoice.paye_amount;
              }
            } else if (!jobPart.locum_invoice_item) {
              type = jobPart.job.locum_detail_rate_type.name;
              finalHours = jobPart.final_hours / 60;
              totalHours = jobPart.job.total_hours / 60;
              total = 0;

              switch (type) {
                case "Per Hour":
                  total = finalHours * jobPart.job.rate;
                  break;
                default:
                  total = finalHours * (jobPart.job.rate / totalHours);
                  break;
              }
            }

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
              total_amount: total,
              paid:
                jobPart.status === "Approved" &&
                jobPart.locum_invoice_item.locum_invoice.paid_at
                  ? "Yes"
                  : "No",
              under_parent_practice:
                jobPart.locum_invoice_id &&
                jobPart.locum_invoice_item.locum_invoice.parent_practice_id
                  ? "Yes"
                  : "No"
            };
          });
        })
        .catch(err => {
          console.log("err", err.response || err);
        });
    },
    async refreshInvoices() {
      this.loading = true;
      this.current_page = 1;
      this.offset = 0;
      this.limit = 5;
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
    select_invoice(id) {
      this.payment_modal = true;
      this.invoice_id = id;
    },
    updateInvoice(invoice) {
      let queryStatus = this.$route.query.status.toLowerCase();

      let job_part = this.job_parts.find(
        item => item.id === invoice.items[0].job_part.id
      );
      job_part.locum_invoice_id = invoice.id;
      job_part.total_amount = invoice.total_amount;

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
    confirmPayment() {
      let notRequired = ["ni", "paye"];
      if (this.ir35 === false) {
        notRequired.push("ni_amount");
        notRequired.push("paye_amount");
        this.form.ni = false;
        this.form.ni_amount = null;
        this.form.paye = false;
        this.form.paye_amount = null;
      } else if (this.ir35 === true) {
        if ([false, "false"].includes(this.form.ni)) {
          notRequired.push("ni_amount");
        }
        if ([false, "false"].includes(this.form.paye)) {
          notRequired.push("paye_amount");
        }
      }

      this.formError = [];
      this.Validate(this.form, notRequired);
      if (!this.formError.length) {
        this.$axios
          .$put(
            `/api/v1/practice/locum-invoices/${this.invoice_id}/paid`,
            this.form
          )
          .then(res => {
            let job_part = this.job_parts.find(
              item => item.id === res.data.locum_invoice.items[0].job_part.id
            );

            let index = this.job_parts.findIndex(
              item => item.id === job_part.id
            );

            if (index >= 0) {
              job_part.locum_invoice_item.locum_invoice.paid_at =
                res.data.locum_invoice.paid_at;
              job_part.locum_invoice_item.locum_invoice.ni =
                res.data.locum_invoice.ni;
              job_part.locum_invoice_item.locum_invoice.ni_amount =
                res.data.locum_invoice.ni_amount;
              job_part.locum_invoice_item.locum_invoice.paye =
                res.data.locum_invoice.paye;
              job_part.locum_invoice_item.locum_invoice.paye_amount =
                res.data.locum_invoice.paye_amount;
              this.job_parts.splice(index, 1, job_part);
            }

            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: [`${res.message}`]
            });

            this.payment_modal = false;
            this.form.ni = false;
            this.form.ni_amount = null;
            this.form.paye = false;
            this.form.paye_amount = null;
          })
          .catch(err => {
            console.log("err", err.response || err);
            throw err;
          });
      }
    },
    async sorted(order_by) {
      let orderBy = order_by.map(item => {
        let order = item.split(":")[1];
        let sorting = item.split(":")[0];
        switch (sorting) {
          default:
            sorting;
        }
        return `${sorting}:${order}`;
      });
      this.current_page = 1;
      this.offset = 0;
      this.order_by = orderBy;
      this.loading = true;
      await this.getJobParts();
      this.loading = false;
    },
    async pagechanged(page) {
      this.current_page = page;
      this.offset = this.limit * (page - 1);
      this.loading = true;
      await this.getJobParts();
      this.loading = false;
    },
    async limitchanged(limit) {
      this.current_page = 1;
      this.offset = 0;
      this.limit = limit;
      this.loading = true;
      await this.getJobParts();
      this.loading = false;
    },
    clearFilters() {
      this.offset = 0;
      this.limit = 5;
      this.order_by = [];
      this.job_ir35 = null;
    }
  }
};
</script>
<style scoped>
.shield {
  z-index: 511;
}
.payment-modal {
  position: fixed;
  background-color: white;
  z-index: 512;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>