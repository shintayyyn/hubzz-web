<template>
  <section class="relative">
    <div class="flex flex-row justify-start overflow-x-auto pb-3">
      <nuxt-link
        :to="{ path: '/practice-billing', query: { ...$route.query, status: 'to-be-invoiced' } }"
        class="md:mr-5 p-3 text-xs font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('practice-billing-index') && (!$route.query.status || ($route.query.status  && $route.query.status.toLowerCase() === 'to-be-invoiced')) ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >To be Invoiced</nuxt-link>
      <nuxt-link
        :to="{ path: '/practice-billing', query: { ...$route.query, status: 'disputed' } }"
        class="md:mr-5 p-3 text-xs font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('practice-billing-index') && ($route.query.status && $route.query.status.toLowerCase() === 'disputed') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Disputed Invoices</nuxt-link>
      <nuxt-link
        :to="{ path: '/practice-billing', query: { ...$route.query, status: 'issued' } }"
        class="md:mr-5 p-3 text-xs font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('practice-billing-index') && ($route.query.status && $route.query.status.toLowerCase() === 'issued') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Invoiced</nuxt-link>
      <nuxt-link
        :to="{ path: '/practice-billing', query: { ...$route.query, status: 'approved' } }"
        class="md:mr-5 p-3 text-xs font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('practice-billing-index') && ($route.query.status && $route.query.status.toLowerCase() === 'approved') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Approved Invoices</nuxt-link>
    </div>
    <transition name="fade" mode="out-in">
      <div class="relative flex w-full" v-if="initialLoading" style="min-height:80px">
        <AppLoading :loading="initialLoading" spinner />
      </div>
      <div v-if="!initialLoading">
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
          :loading="loading"
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
                v-if="slotProps.item.locum_invoice_id && slotProps.item.invoice_status !== 'To Be Invoice' && slotProps.item.status !== 'Approved'"
                @click="$router.push({ path: `/practice-billing/${slotProps.item.locum_invoice_id}/edit`, query: {...$route.query} })"
                class="my-1 p-2 bg-yellow-500 font-bold rounded-lg focus:outline-none"
              >Edit</div>
              <div
                v-if="slotProps.item.status === 'Approved' && slotProps.item.locum_invoice_item"
                @click="$router.push({ path: `/practice-billing/${slotProps.item.locum_invoice_id}`, query: {...$route.query} })"
                class="mx-1 p-2 bg-yellow-500 hover:bg-yellow-400 font-bold rounded-lg focus:outline-none cursor-pointer"
              >View</div>
              <button
                v-if="slotProps.item.status === 'Approved' && slotProps.item.locum_invoice_item && !slotProps.item.locum_invoice_item.locum_invoice.paid_at"
                @click.stop.prevent="select_invoice(slotProps.item.locum_invoice_id)"
                class="my-1 p-2 font-bold rounded-lg focus:outline-none cursor-pointer bg-yellow-400 hover:bg-yellow-500"
              >Mark as Paid</button>
              <div
                v-if="slotProps.item.status === 'Approved' && slotProps.item.locum_invoice_item && slotProps.item.locum_invoice_item.locum_invoice.paid_at"
                class="my-1 p-2 font-bold"
              >Already Paid</div>
            </div>
          </template>
        </AppTable>
        <div
          v-if="!job_parts.length && !isFiltered"
          class="flex justify-center"
        >{{noJobPartsToDisplay}}</div>
        <div v-if="!job_parts.length && isFiltered" class="flex justify-center py-4">No Jobs Found</div>

        <div v-if="payment_modal" class="p-2">
          <div class="rounded-lg shadow-md px-4 py-8 md:px-8 payment-modal border w-5/6 md:w-1/3">
            <AppDate
              v-model="form.paid_at"
              :name="'paid_at'"
              :label="'Received payment on'"
              :error="formError.find(item => item.field === 'paid_at')"
              isBefore
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
                :inStyle="'padding-top:0.5rem;padding-bottom:0.5rem;text-align:right'"
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
                :inStyle="'padding-top:0.5rem;padding-bottom:0.5rem;text-align:right'"
                :error="formError.find(item => item.field === 'paye_amount')"
              />
            </template>
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
                @click="payment_modal = false"
                :inStyle="'padding:5px 10px'"
              />
            </div>
          </div>
        </div>

        <transition name="fade" mode="out-in">
          <nuxt-link
            :to="{ name: 'practice-billing-index', query: {...$route.query}}"
            v-if="['practice-billing-index-id', 'practice-billing-index-id-edit'].includes($route.name) || payment_modal"
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
      initialLoading: false,
      loading: false,
      filterModal: false,
      isFiltered: false,
      showTable: false,
      total: 0,
      job_parts: [],

      showRefresh: false,
      current_page: 1,

      offset: 0,
      limit: 5,
      order_by: [],
      job_ir35: null,

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
    // ir35() {
    //   return true;
    //   if (!this.invoice_id) {
    //     return false;
    //   }
    //   let selectedInvoice = this.job_parts.find(
    //     item => item.locum_invoice_id === this.invoice_id
    //   );
    //   return selectedInvoice.job_ir35 ? selectedInvoice.job_ir35 : false;
    // },
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
          str = "You do not have any nhs from a.";
          break;
        case "pension-form-b":
          str = "You do not have any nhs from b.";
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
      let status = [];
      let invoice_status = [];
      let queryStatus = query.status;
      switch (queryStatus && queryStatus.toLowerCase()) {
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
          invoice_status = ["Invoiced"];
          break;
        default:
          status = ["Completed", "Terminated"];
          invoice_status = ["To Be Invoice"];
      }

      const params = {
        status,
        invoice_status,
        type: "Platform",
        job_practice_id: [app.$auth.user.practice_id]
      };

      let [total, job_parts] = await Promise.all([
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
    getJobPartsPromiseAll() {
      let status = [];
      let invoice_status = [];
      let queryStatus = this.$route.query.status;
      switch (queryStatus && queryStatus.toLowerCase()) {
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
          invoice_status = ["Invoiced"];
          break;
        default:
          status = ["Completed", "Terminated"];
          invoice_status = ["To Be Invoice"];
      }

      const params = {
        status,
        invoice_status,
        type: "Platform",
        job_practice_id: [this.$auth.user.practice_id]
      };

      return Promise.all([
        this.$axios.$get(`/api/v1/practice/job-parts/count`, { params }),
        this.$axios.$get(`/api/v1/practice/job-parts?offset=0&limit=5`, {
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
          error({
            statusCode: err.status || 500,
            message: err.message || "Something went wrong!"
          });
        });
    },
    getJobParts() {
      let status = [];
      let invoice_status = [];
      let queryStatus = this.$route.query.status;
      switch (queryStatus && queryStatus.toLowerCase()) {
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
          invoice_status = ["Invoiced"];
          break;
        default:
          status = ["Completed", "Terminated"];
          invoice_status = ["To Be Invoice"];
      }

      const params = {
        status,
        invoice_status,
        type: "Platform",
        job_practice_id: [this.$auth.user.practice_id],
        ...this.params
      };

      return this.$axios
        .$get(`/api/v1/practice/job-parts`, { params })
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
.payment-modal {
  position: fixed;
  background-color: white;
  z-index: 512;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>