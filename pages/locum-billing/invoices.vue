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
      <div class="relative flex w-full" v-if="initialLoading" style="min-height:80px">
        <AppLoading :loading="initialLoading" spinner />
      </div>
      <div v-if="!initialLoading">
        <AppButton
          v-if="!['pension-form-a', 'pension-form-b'].includes($route.query.status)"
          :label="'Filter'"
          @click="filterModal = !filterModal"
          :inStyle="'padding:5px 14px;margin-bottom:5px;font-size:14px;'"
        />
        <AppButton
          v-if="showRefresh"
          :label="'Refresh'"
          @click="refreshInvoices"
          :inStyle="'padding:5px 14px;margin-bottom:5px;font-size:14px;'"
        />
        <div
          class="flex-wrap justify-start items-end z-10 absolute w-full bg-white shadow-lg p-3 rounded-lg"
          :class="filterModal ? 'flex' : 'hidden'"
        >
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput
              class="px-1"
              v-model="job_ir35"
              :type="'select'"
              :name="'type'"
              :label="'Inside ir35'"
              :items="[{ label: 'Yes', value: true },{ label: 'No', value: false}, { label: 'All', value: null} ]"
            />
          </div>
          <div class="md:px-1 flex w-full">
            <AppButton
              :label="'Clear'"
              @click="clearFilters"
              :inStyle="'padding:5px 14px;margin-bottom:5px'"
            />
            <AppButton
              class="mx-2"
              :label="'Search'"
              @click="filterJobParts"
              :inStyle="'padding:5px 14px;margin-bottom:5px'"
            />
            <AppButton
              class="mx-2 md:hidden"
              :label="'Close'"
              @click="filterModal = false"
              :inStyle="'padding:5px 14px;margin-bottom:5px'"
            />
          </div>
        </div>
        <template
          v-if="(!$route.query.status || ($route.query.status && $route.query.status !== 'pension-form-b'))"
        >
          <AppTable
            v-if="job_parts.length > 0"
            :total="total"
            :items="job_parts"
            :currentPage="current_page"
            :perPage="limit"
            :columns="columns"
            :orderBy="order_by"
            :loading="loading"
            @pagechanged="pagechanged"
            @limitchanged="limitchanged"
            @sorted="sorted"
          >
            <template v-slot:actions="slotProps">
              <div class="flex flex-wrap justify-center">
                <div
                  v-if="!slotProps.item.locum_invoice_id"
                  @click="$router.push({ path: `/locum-billing/invoices/${slotProps.item.id}/create`, query: {...$route.query} })"
                  class="my-1 p-2 bg-green-700 hover:bg-green-600 text-white font-bold rounded-lg focus:outline-none cursor-pointer"
                >Generate Invoice</div>
                <div
                  class="flex justify-between my-1"
                  v-if="slotProps.item.locum_invoice_id && slotProps.item.locum_status !== 'Approved'"
                >
                  <div
                    @click="$router.push({ path: `/locum-billing/invoices/${slotProps.item.locum_invoice_id}/edit`, query: {...$route.query} })"
                    class="mx-1 p-2 bg-yellow-500 hover:bg-yellow-400 font-bold rounded-lg focus:outline-none cursor-pointer"
                  >Edit</div>
                  <button
                    @click.stop.prevent="select_invoice(slotProps.item.locum_invoice_id, 'deleteInvoice')"
                    class="mx-1 p-2 bg-red-700 hover:bg-red-600 text-white font-bold rounded-lg focus:outline-none"
                  >Delete</button>
                </div>
                <div
                  v-if="['approved'].includes($route.query.status)"
                  @click="$router.push({ path: `/locum-billing/invoices/${slotProps.item.locum_invoice_id}`, query: {...$route.query} })"
                  class="my-1 p-2 bg-yellow-500 hover:bg-yellow-400 font-bold rounded-lg focus:outline-none cursor-pointer"
                >View</div>
                <div
                  v-if="$route.query.status && $route.query.status === 'pension-form-a' && slotProps.item.nhs_claimable && slotProps.item.locum_form_a_id"
                  @click="viewAsPdf(slotProps.item.locum_form_a_id, 'form-a')"
                  class="my-1 p-2 bg-yellow-500 hover:bg-yellow-400 font-bold rounded-lg focus:outline-none cursor-pointer"
                >View Form A</div>
              </div>
            </template>
          </AppTable>
          <div
            v-if="!job_parts.length && !isFiltered"
            class="flex justify-center"
          >{{noJobPartsToDisplay}}</div>
          <div v-if="!job_parts.length && isFiltered" class="flex justify-center py-4">No Jobs Found</div>
        </template>

        <template v-if="($route.query.status && $route.query.status === 'pension-form-b')">
          <AppTable
            v-if="locum_form_bs.length > 0"
            :total="total"
            :items="locum_form_bs"
            :currentPage="current_page"
            :perPage="limit"
            :columns="form_bs_columns"
            :orderBy="order_by"
            :loading="loading"
            @pagechanged="pagechanged"
            @limitchanged="limitchanged"
            @sorted="sorted"
          >
            <template v-slot:actions="slotProps">
              <div class="flex justify-center">
                <div
                  @click="viewAsPdf(slotProps.item.id, 'form-b')"
                  class="my-1 p-2 bg-yellow-500 hover:bg-yellow-400 font-bold rounded-lg focus:outline-none cursor-pointer"
                >View Form B</div>
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
import AppInput from "@/components/Base/AppInput";
import AppLoading from "@/components/Base/AppLoading";
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },
  components: {
    AppDate,
    AppInput,
    AppLoading,
    AppButton,
    AppConfirmationModal,
    AppTable
  },
  data() {
    return {
      initialLoading: false,
      loading: false,
      filterModal: false,
      isFiltered: false,
      total: 0,
      job_parts: [],
      locum_form_bs: [],

      showRefresh: false,
      current_page: 1,

      offset: 0,
      limit: 5,
      order_by: [],
      job_ir35: null,

      form_bs_columns: [
        {
          name: "Type",
          dataIndex: "type"
        },
        {
          name: "Practice",
          dataIndex: "practice"
        },
        {
          name: "Date Created",
          dataIndex: "date_created",
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
        {
          name: "Issued",
          dataIndex: "issued_at",
          class: "text-center localDate",
          sortable: true
        },
        {
          name: "Invoice Number",
          dataIndex: "invoice_number"
        },
        {
          name: "Job Number",
          dataIndex: "job_part_number"
        },
        {
          name: "£ Amount",
          dataIndex: "total_amount",
          class: "text-center",
          sortable: true
        },
        {
          name: "NHS Claimable",
          dataIndex: "nhs_claimable",
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
      columns.push({
        name: "Actions",
        dataIndex: "actions",
        class: "text-center"
      });
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
    }
  },
  async asyncData({ app, query, error }) {
    try {
      let url = `/api/v1/locum/job-parts`;
      let invoice_status = [];
      let locum_status = [];
      let locum_invoiceable = null;
      let nhs_claimable = null;
      let queryStatus = query.status;

      switch (queryStatus && queryStatus.toLowerCase()) {
        case "to-be-invoiced":
          invoice_status.push("To Be Invoice");
          locum_status = ["Completed", "Declined", "Cancelled"];
          locum_invoiceable = true;
          break;
        case "disputed":
          invoice_status.push("Disputed");
          locum_invoiceable = true;
          break;
        case "issued":
          invoice_status.push("Invoiced");
          locum_invoiceable = true;
          break;
        case "approved":
          invoice_status.push("Invoiced");
          locum_status.push("Approved");
          locum_invoiceable = true;
          break;
        case "pension-form-a":
          invoice_status.push("Invoiced");
          locum_status.push("Approved");
          locum_invoiceable = true;
          nhs_claimable = true;
          break;
        case "pension-form-b":
          url = `/api/v1/locum/locum-invoices-form-b`;
          break;
        default:
          invoice_status.push("To Be Invoice");
          locum_status = ["Completed", "Declined", "Cancelled"];
          locum_invoiceable = true;
      }

      let locum_form_bs = [];
      let [total, job_parts] = await Promise.all([
        app.$axios
          .$get(`${url}/count`, {
            params: {
              invoice_status,
              locum_status,
              locum_invoiceable,
              nhs_claimable,
              job_type: "Platform",
              type: "Platform"
            }
          })
          .then(res => {
            let total = res.data.count;
            return total;
          }),
        app.$axios
          .$get(`${url}`, {
            params: {
              invoice_status,
              locum_status,
              locum_invoiceable,
              nhs_claimable,
              job_type: "Platform",
              type: "Platform",
              offset: 0,
              limit: 5
            }
          })
          .then(res => {
            let job_parts = null;
            let locum_form_bs = null;
            if (res.data && res.data.job_parts) {
              return res.data.job_parts;
            } else if (res.data && res.data.locum_form_bs) {
              return res.data.locum_form_bs;
            }
          })
      ]);

      if (url === `/api/v1/locum/job-parts`) {
        job_parts = job_parts.map(jobPart => {
          let total = jobPart.locum_invoice_id
            ? jobPart.locum_invoice_item.total
            : jobPart.job.locum_detail_rate_type.name === "Per Hour"
            ? jobPart.job.rate * jobPart.final_hours
            : (jobPart.job.rate / jobPart.job.total_hours) *
              jobPart.final_hours;

          total =
            jobPart.locum_invoice_item &&
            jobPart.locum_invoice_item.locum_invoice &&
            jobPart.locum_invoice_item.locum_invoice.paid_at
              ? total -
                jobPart.locum_invoice_item.locum_invoice.ni_amount -
                jobPart.locum_invoice_item.locum_invoice.paye_amount
              : total;
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
            total_amount: total
              .toFixed(2)
              .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"),
            paid:
              jobPart.locum_status === "Approved" &&
              jobPart.locum_invoice_item.locum_invoice.paid_at
                ? "Yes"
                : "No",
            nhs_claimable: jobPart.locum_invoice_id
              ? jobPart.locum_invoices_nhs_claimable
              : jobPart.locum_details_nhs_claimable
          };
        });
      } else if (url === `/api/v1/locum/locum-invoices-form-b`) {
        job_parts.forEach(item => {
          locum_form_bs.push({
            ...item,
            date_created: app
              .$moment(item.date_created, "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]")
              .format("DD-MM-YYYY"),
            practice: item.forms[0].practice_name
          });
        });
      }

      return {
        total,
        job_parts,
        locum_form_bs
      };
    } catch (err) {
      console.log("err", err.response || err);
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
      let invoice_status = [];
      let locum_status = [];
      let locum_invoiceable = null;
      let nhs_claimable = null;
      let queryStatus = this.$route.query.status;

      switch (queryStatus && queryStatus.toLowerCase()) {
        case "to-be-invoiced":
          invoice_status.push("To Be Invoice");
          locum_status = ["Completed", "Declined", "Cancelled"];
          locum_invoiceable = true;
          break;
        case "disputed":
          invoice_status.push("Disputed");
          locum_status = ["Completed", "Declined", "Cancelled"];
          locum_invoiceable = true;
          break;
        case "issued":
          invoice_status.push("Invoiced");
          locum_status = ["Completed", "Declined", "Cancelled"];
          locum_invoiceable = true;
          break;
        case "approved":
          invoice_status.push("Invoiced");
          locum_status.push("Approved");
          locum_invoiceable = true;
          break;
        case "pension-form-a":
          invoice_status.push("Invoiced");
          locum_status.push("Approved");
          locum_invoiceable = true;
          nhs_claimable = true;
          break;
        case "pension-form-b":
          url = `/api/v1/locum/locum-invoices-form-b`;
          break;
        default:
          invoice_status.push("To Be Invoice");
          locum_status = ["Completed", "Declined", "Cancelled"];
          locum_invoiceable = true;
      }
      return Promise.all([
        this.$axios.$get(`${url}/count`, {
          params: {
            invoice_status,
            locum_status,
            locum_invoiceable,
            nhs_claimable,
            job_type: "Platform",
            type: "Platform",
            job_ir35: this.job_ir35
          }
        }),
        this.$axios.$get(`${url}`, {
          params: {
            invoice_status,
            locum_status,
            locum_invoiceable,
            nhs_claimable,
            job_type: "Platform",
            type: "Platform",
            job_ir35: this.job_ir35,
            offset: 0,
            limit: 5
          }
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

              total =
                jobPart.locum_invoice_item &&
                jobPart.locum_invoice_item.locum_invoice &&
                jobPart.locum_invoice_item.locum_invoice.paid_at
                  ? total -
                    jobPart.locum_invoice_item.locum_invoice.ni_amount -
                    jobPart.locum_invoice_item.locum_invoice.paye_amount
                  : total;
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
                total_amount: total
                  .toFixed(2)
                  .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"),
                paid:
                  jobPart.locum_status === "Approved" &&
                  jobPart.locum_invoice_item.locum_invoice.paid_at
                    ? "Yes"
                    : "No",
                nhs_claimable: jobPart.locum_invoice_id
                  ? jobPart.locum_invoices_nhs_claimable
                  : jobPart.locum_details_nhs_claimable
              };
            });
          } else if (response.data && response.data.locum_form_bs) {
            this.locum_form_bs = response.data.locum_form_bs.map(item => {
              return {
                ...item,
                date_created: this.$moment(
                  item.date_created,
                  "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"
                ).format("DD-MM-YYYY"),
                practice: item.forms[0].practice_name
              };
            });
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
      let url = `/api/v1/locum/job-parts`;
      let invoice_status = [];
      let locum_status = [];
      let locum_invoiceable;
      let nhs_claimable;
      let queryStatus = this.$route.query.status;

      switch (queryStatus && queryStatus.toLowerCase()) {
        case "to-be-invoiced":
          invoice_status.push("To Be Invoice");
          locum_status = ["Completed", "Declined", "Cancelled"];
          locum_invoiceable = true;
          break;
        case "disputed":
          invoice_status.push("Disputed");
          locum_status = ["Completed", "Declined", "Cancelled"];
          locum_invoiceable = true;
          break;
        case "issued":
          invoice_status.push("Invoiced");
          locum_status = ["Completed", "Declined", "Cancelled"];
          locum_invoiceable = true;
          break;
        case "approved":
          invoice_status.push("Invoiced");
          locum_status.push("Approved");
          locum_invoiceable = true;
          break;
        case "pension-form-a":
          invoice_status.push("Invoiced");
          locum_status.push("Approved");
          nhs_claimable = true;
          break;
        case "pension-form-b":
          url = `/api/v1/locum/locum-invoices-form-b`;
          break;
        default:
          invoice_status.push("To Be Invoice");
          locum_status = ["Completed", "Declined", "Cancelled"];
          locum_invoiceable = true;
      }
      return this.$axios
        .$get(`${url}`, {
          params: {
            invoice_status,
            locum_status,
            locum_invoiceable,
            nhs_claimable,
            job_type: "Platform",
            type: "Platform",
            offset: this.offset,
            limit: this.limit,
            job_ir35: this.job_ir35,
            order_by: this.order_by
          }
        })
        .then(res => {
          if (res.data && res.data.job_parts) {
            let job_parts = res.data.job_parts;

            this.job_parts = job_parts.map(jobPart => {
              let total = jobPart.locum_invoice_id
                ? jobPart.locum_invoice_item.total
                : jobPart.job.locum_detail_rate_type.name === "Per Hour"
                ? jobPart.job.rate * jobPart.final_hours
                : (jobPart.job.rate / jobPart.job.total_hours) *
                  jobPart.final_hours;

              total =
                jobPart.locum_invoice_item &&
                jobPart.locum_invoice_item.locum_invoice &&
                jobPart.locum_invoice_item.locum_invoice.paid_at
                  ? total -
                    jobPart.locum_invoice_item.locum_invoice.ni_amount -
                    jobPart.locum_invoice_item.locum_invoice.paye_amount
                  : total;
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
                total_amount: total
                  .toFixed(2)
                  .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"),
                paid:
                  jobPart.locum_status === "Approved" &&
                  jobPart.locum_invoice_item.locum_invoice.paid_at
                    ? "Yes"
                    : "No",
                nhs_claimable: jobPart.locum_invoice_id
                  ? jobPart.locum_invoices_nhs_claimable
                  : jobPart.locum_details_nhs_claimable
              };
            });
          } else if (res.data && res.data.locum_form_bs) {
            this.locum_form_bs = res.data.locum_form_bs.map(item => {
              return {
                ...item,
                date_created: this.$moment(
                  item.date_created,
                  "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"
                ).format("DD-MM-YYYY"),
                practice: item.forms[0].practice_name
              };
            });
          }
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
</style>
