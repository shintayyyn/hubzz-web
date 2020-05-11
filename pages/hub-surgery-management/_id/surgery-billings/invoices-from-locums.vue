<template>
  <section class="relative">
    <div class="flex flex-row justify-start overflow-x-auto pb-3">
      <nuxt-link
        :to="{ path: `/hub-surgery-management/${$route.params.id}/surgery-billings/invoices-from-locums?status=to-be-invoiced` }"
        class="md:mr-5 p-3 text-xs font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('hub-surgery-management-id-surgery-billings-invoices-from-locums') && (!$route.query.status || ($route.query.status && $route.query.status.toLowerCase() === 'to-be-invoiced')) ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >To be Invoiced</nuxt-link>
      <nuxt-link
        :to="{ path: `/hub-surgery-management/${$route.params.id}/surgery-billings/invoices-from-locums?status=disputed` }"
        class="md:mr-5 p-3 text-xs font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('hub-surgery-management-id-surgery-billings-invoices-from-locums') && ($route.query.status && $route.query.status.toLowerCase() === 'disputed') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Disputed Invoices</nuxt-link>
      <nuxt-link
        :to="{ path: `/hub-surgery-management/${$route.params.id}/surgery-billings/invoices-from-locums?status=issued` }"
        class="md:mr-5 p-3 text-xs font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('hub-surgery-management-id-surgery-billings-invoices-from-locums') && ($route.query.status && $route.query.status.toLowerCase() === 'issued') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Invoiced</nuxt-link>
      <nuxt-link
        :to="{ path: `/hub-surgery-management/${$route.params.id}/surgery-billings/invoices-from-locums?status=approved` }"
        class="md:mr-5 p-3 text-xs font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('hub-surgery-management-id-surgery-billings-invoices-from-locums') && ($route.query.status && $route.query.status.toLowerCase() === 'approved') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Approved Invoices</nuxt-link>
      <nuxt-link
        :to="{ path: `/hub-surgery-management/${$route.params.id}/surgery-billings/invoices-from-locums?status=pension-form-a` }"
        class="md:mr-5 p-3 text-xs font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('hub-surgery-management-id-surgery-billings-invoices-from-locums') && ($route.query.status && $route.query.status.toLowerCase() === 'pension-form-a') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >NHS Pension Form A</nuxt-link>
    </div>
    <transition name="fade" mode="out-in">
      <div v-if="initialLoading" class="relative flex w-full" style="min-height:80px">
        <AppLoading :loading="initialLoading" spinner />
      </div>
      <div v-if="!initialLoading">
        <AppButton
          v-if="showRefresh"
          :label="'Refresh'"
          :in-style="'padding:5px 14px;margin-bottom:5px;font-size:14px;'"
          @click="refreshInvoices"
        />
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
            <div class="flex flex-wrap justify-center">
              <div
                v-if="slotProps.item.locum_invoice_id && slotProps.item.invoice_status !== 'To Be Invoice' && slotProps.item.status !== 'Approved'"
                class="my-1 p-2 bg-yellow-500 font-bold rounded-lg focus:outline-none"
                @click="$router.push({ path: `/hub-surgery-management/${$route.params.id}/surgery-billings/invoices-from-locums/${slotProps.item.locum_invoice_id}/edit`, query: {...$route.query} })"
              >Edit</div>
              <div
                v-if="slotProps.item.status === 'Approved' && slotProps.item.locum_invoice_item && $route.query.status !== 'pension-form-a'"
                class="mx-1 p-2 bg-yellow-500 font-bold rounded-lg focus:outline-none"
                @click="$router.push({ path: `/hub-surgery-management/${$route.params.id}/surgery-billings/invoices-from-locums/${slotProps.item.locum_invoice_id}`, query: {...$route.query} })"
              >View</div>
              <div
                v-if="
                  $route.query.status && $route.query.status === 'pension-form-a'
                    && slotProps.item.locum_form_a_id
                "
                class="my-1 py-2 px-3 bg-yellow-500 hover:bg-yellow-400 font-bold rounded-lg focus:outline-none cursor-pointer"
                @click="viewAsPdf(slotProps.item.locum_form_a_id, 'form-a')"
              >View Form A</div>

              <button
                v-if="slotProps.item.status === 'Approved' && slotProps.item.locum_invoice_item && !slotProps.item.locum_invoice_item.locum_invoice.paid_at && $route.query.status !== 'pension-form-a'"
                class="my-1 p-2 font-bold rounded-lg focus:outline-none bg-yellow-400"
                @click.stop.prevent="select_invoice(slotProps.item.locum_invoice_id)"
              >Mark as Paid</button>
            </div>
          </template>
        </AppTable>
        <div v-else class="flex justify-center">{{ noJobPartsToDisplay }}</div>

        <div v-if="payment_modal" class="p-2">
          <div class="rounded-lg shadow-md px-4 py-8 md:px-8 payment-modal border w-5/6 md:w-1/3">
            <AppDate
              v-model="form.paid_at"
              :name="'paid_at'"
              :label="'Payment made on'"
              :error="formError.find(item => item.field === 'paid_at')"
              isBefore
            />
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
              :label="'Ni Amount'"
              :in-style="'padding-top:0.5rem;padding-bottom:0.5rem;text-align:right'"
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
              :label="'Paye Amount'"
              :in-style="'padding-top:0.5rem;padding-bottom:0.5rem;text-align:right'"
              :error="formError.find(item => item.field === 'paye_amount')"
            />
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
            v-if="['hub-surgery-management-id-surgery-billings-invoices-from-locums-invoiceId', 'hub-surgery-management-id-surgery-billings-invoices-from-locums-invoiceId-edit'].includes($route.name) || payment_modal"
            :to="{ path: `/hub-surgery-management/${$route.params.id}/surgery-billings/invoices-from-locums`, query: {...$route.query}}"
            class="shield"
          />
        </transition>
        <nuxt-child :child-practice-id="childPracticeId" @updateInvoice="updateInvoice" />
      </div>
    </transition>
  </section>
</template>
<script>
import AppTable from "@/components/Base/AppTable";
import AppLoading from "@/components/Base/AppLoading";
import AppDate from "@/components/Base/AppDate";
import AppButton from "@/components/Base/AppButton";
import AppInput from "@/components/Base/AppInput";
export default {
  components: {
    AppTable,
    AppLoading,
    AppDate,
    AppButton,
    AppInput
  },
  props: {
    childPracticeId: {
      type: Number,
      required: true
    }
  },
  transition: {
    name: "fade",
    mode: "out-in"
  },
  data() {
    return {
      initialLoading: false,
      showTable: false,
      total: 0,
      job_parts: [],

      showRefresh: false,
      loading: false,
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

      columns.push({
        name: "Practice / Surgery",
        dataIndex: "practice_name",
        class: "text-center"
      });

      if (queryStatus !== "to-be-invoiced") {
        columns.push({
          name: "Invoice Number",
          dataIndex: "invoice_number"
        });
      }

      columns.push(
        {
          name: "Job Part Number",
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
      if (queryStatus === "approved" || queryStatus === "pension-form-a") {
        columns.push({
          name: "Approved At",
          dataIndex: "approved_at",
          class: "text-center localDate"
        });
      } else if (queryStatus === "to-be-invoiced") {
        columns.push({
          name: "Completed At",
          dataIndex: "completed_at",
          class: "text-center localDate",
          sortable: true
        });
      } else {
        columns.push({
          name: "Issued",
          dataIndex: "issued_at",
          class: "text-center localDate",
          sortable: true
        });
      }

      columns.push({
        name: "Locum",
        dataIndex: "locum_first_name",
        class: "text-center"
      });

      if (queryStatus !== "to-be-invoiced") {
        columns.push({
          name: "Actions",
          dataIndex: "actions",
          class: "text-center"
        });
      }

      return columns;
    },
    authPermissions() {
      return this.$store.getters["permissions"];
    },
    noJobPartsToDisplay() {
      let str = "";
      let queryStatus = this.$route.query.status;
      switch (queryStatus && queryStatus.toLowerCase()) {
        case "to-be-invoiced":
          str = "This spoke do not have any completed job parts.";
          break;
        case "disputed":
          str = "This spoke do not have any disputed invoices.";
          break;
        case "issued":
          str = "This spoke do not have any invoiced job parts.";
          break;
        case "approved":
          str = "This spoke do not have any approved job parts.";
          break;
        case "pension-form-a":
          str = "This spoke do not have any nhs form a.";
          break;
        case "pension-form-b":
          str = "This spoke do not have any nhs form b.";
          break;
        default:
          str = "This spoke do not have any completed job parts.";
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
  async asyncData({ app, query, route, error }) {
    try {
      let childPracticeId = null;
      await app.$axios
        .$get(`/api/v1/practice/me/practice-surgeries/${route.params.id}`)
        .then(res => {
          childPracticeId = res.data.practice_surgery.child_practice_id;
        });

      let status = [];
      let invoice_status = [];
      let locum_invoiceable;
      let nhs_claimable;
      let sent_to_practice;
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
        case "pension-form-a":
          invoice_status.push("Invoiced");
          status.push("Approved");
          locum_invoiceable = true;
          nhs_claimable = true;
          sent_to_practice = true;
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
              nhs_claimable,
              sent_to_practice,
              type: "Platform",
              job_practice_id: [childPracticeId]
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
              nhs_claimable,
              sent_to_practice,
              type: "Platform",
              job_practice_id: [childPracticeId],
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
          under_parent_practice: jobPart.parent_practice_id ? "Yes" : "No"
        };
      });

      const showTable = true;

      return {
        total,
        job_parts,
        showTable
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
    viewAsPdf(formId, type) {
      let url =
        type === "form-a"
          ? `/api/v1/locum-form-a`
          : type === "solo-form"
          ? `/api/v1/locum-solo-form`
          : `/api/v1/locum-form-b`;
      window.open(`${process.env.API_URL}${url}/${formId}/pdf`);
    },
    getJobPartsPromiseAll() {
      let status = [];
      let invoice_status = [];
      let locum_invoiceable;
      let nhs_claimable;
      let sent_to_practice;
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
        case "pension-form-a":
          invoice_status.push("Invoiced");
          status.push("Approved");
          locum_invoiceable = true;
          nhs_claimable = true;
          sent_to_practice = true;
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
            nhs_claimable,
            sent_to_practice,
            type: "Platform",
            job_practice_id: [this.childPracticeId]
          }
        }),
        this.$axios.$get(`/api/v1/practice/job-parts`, {
          params: {
            invoice_status,
            status,
            locum_invoiceable,
            nhs_claimable,
            sent_to_practice,
            type: "Platform",
            job_practice_id: [this.childPracticeId],
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
              under_parent_practice: jobPart.parent_practice_id ? "Yes" : "No"
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
    getJobParts() {
      let status = [];
      let invoice_status = [];
      let locum_invoiceable;
      let nhs_claimable;
      let sent_to_practice;
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
        case "pension-form-a":
          invoice_status.push("Invoiced");
          status.push("Approved");
          locum_invoiceable = true;
          nhs_claimable = true;
          sent_to_practice = true;
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
            nhs_claimable,
            sent_to_practice,
            type: "Platform",
            job_practice_id: [this.childPracticeId],
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
              under_parent_practice: jobPart.parent_practice_id ? "Yes" : "No"
            };
          });
        })
        .catch(err => {
          console.log("err", err.response || err);
          this.$nuxt.error({
            statusCode: err.status || 500,
            message: err.message || "Something went wrong!"
          });
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
      let queryStatus = this.$route.query.status
        ? this.$route.query.status.toLowerCase()
        : null;

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
      if ([false, "false"].includes(this.form.ni)) {
        notRequired.push("ni_amount");
      }
      if ([false, "false"].includes(this.form.paye)) {
        notRequired.push("paye_amount");
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
      this.current_page = 1;
      this.offset = 0;
      this.order_by = order_by;
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