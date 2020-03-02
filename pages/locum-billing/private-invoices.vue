<template>
  <section class="relative">
    <div class="flex flex-row justify-start overflow-x-auto pb-3">
      <nuxt-link
        :to="{ name: 'locum-billing-private-invoices', query: { ...$route.query, status: 'to-be-invoiced' } }"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('locum-billing-private-invoices') && (!$route.query.status || $route.query.status === 'to-be-invoiced') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >
        To be invoiced
      </nuxt-link>
      <nuxt-link
        :to="{ name: 'locum-billing-private-invoices', query: { ...$route.query, status: 'issued' } }"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('locum-billing-private-invoices') && $route.query.status === 'issued' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >
        Invoiced
      </nuxt-link>
      <nuxt-link
        :to="{ name: 'locum-billing-private-invoices', query: { ...$route.query, status: 'solo-form' } }"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class=" $route.name.includes('locum-billing-private-invoices') && ($route.query.status && $route.query.status.toLowerCase() === 'solo-form') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >
        Solo Forms
      </nuxt-link>
      <nuxt-link
        :to="{ name: 'locum-billing-private-invoices', query: { ...$route.query, status: 'pension-form-a' } }"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class=" $route.name.includes('locum-billing-private-invoices') && $route.query.status === 'pension-form-a' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >
        NHS Pensions Form A
      </nuxt-link>
      <nuxt-link
        :to="{ name: 'locum-billing-private-invoices', query: { ...$route.query, status: 'pension-form-b' } }"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('locum-billing-private-invoices') && $route.query.status === 'pension-form-b' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >
        NHS Pensions Form B
      </nuxt-link>
    </div>
    <div
      v-if="$route.name.includes('locum-billing-private-invoices') && $route.query.status === 'pension-form-b'"
      class="flex flex-row justify-start overflow-x-auto pb-3"
    >
      <nuxt-link
        :to="{ name: 'locum-billing-private-invoices-form-b-create', query: { ...$route.query, status: 'pension-form-b' } }"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap shadow-md border-2 rounded-lg text-gray-800"
      >
        Generate NHS Form B
      </nuxt-link>
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

        <template
          v-if="(!$route.query.status || ($route.query.status && $route.query.status !== 'pension-form-b'))"
        >
          <AppTable
            v-if="job_parts.length > 0"
            :total="total"
            :items="job_parts"
            :current-page="current_page"
            :per-page="limit"
            :columns="columns"
            :order-by="order_by"
            :loading="loading"
            @pagechanged="pagechanged"
            @limitchanged="limitchanged"
            @sorted="sorted"
          >
            <template v-slot:actions="slotProps">
              <div class="flex flex-row flex-wrap justify-center">
                <div
                  v-if="!slotProps.item.locum_invoice_id"
                  class="my-1 p-2 bg-green-700 hover:bg-green-600 text-white font-bold rounded-lg focus:outline-none cursor-pointer"
                  @click="$router.push({ path: `/locum-billing/private-invoices/${slotProps.item.id}/create`, query: {...$route.query }})"
                >
                  Generate Invoice
                </div>
                <div
                  v-if="$route.query.status && $route.query.status === 'issued' && slotProps.item.locum_invoice_id && slotProps.item.locum_status === 'Approved'"
                  class="flex justify-between my-1"
                >
                  <div
                    class="mx-1 p-2 bg-yellow-500 hover:bg-yellow-400 font-bold rounded-lg focus:outline-none cursor-pointer"
                    @click="$router.push({ name: `locum-billing-private-invoices-id-edit`, params: { id: slotProps.item.locum_invoice_id }, query: {...$route.query }})"
                  >
                    Edit
                  </div>
                  <button
                    class="mx-1 p-2 bg-red-700 hover:bg-red-600 text-white font-bold rounded-lg focus:outline-none"
                    @click.stop.prevent="select_invoice(slotProps.item.locum_invoice_id, 'deleteInvoice')"
                  >
                    Delete
                  </button>
                </div>
                <button
                  v-if="$route.query.status && $route.query.status === 'issued' && slotProps.item.locum_invoice_id && slotProps.item.locum_status === 'Approved' && !slotProps.item.locum_invoice_item.locum_invoice.paid_at"
                  class="my-1 p-2 bg-yellow-500 hover:bg-yellow-400 font-bold rounded-lg focus:outline-none cursor-pointer"
                  @click.stop.prevent="select_invoice(slotProps.item.locum_invoice_id, 'markAsPaid')"
                >
                  Mark as Paid
                </button>
                <template v-if="$route.query.status && $route.query.status === 'issued'">
                  <div
                    v-if="slotProps.item.nhs_claimable && !slotProps.item.locum_form_a_id && !slotProps.item.locum_solo_form_id"
                    class="my-1 p-2 bg-yellow-500 hover:bg-yellow-400 font-bold rounded-lg focus:outline-none cursor-pointer text-xs"
                    @click="select_invoice(slotProps.item.locum_invoice_id, 'generateFormA')"
                  >
                    Generate Form A
                  </div>
                  <div
                    v-if="!slotProps.item.locum_form_a_id && !slotProps.item.locum_solo_form_id"
                    class="my-1 p-2 bg-yellow-500 hover:bg-yellow-400 font-bold rounded-lg focus:outline-none cursor-pointer text-xs"
                    @click="select_invoice(slotProps.item.locum_invoice_id, 'generateSoloForm')"
                  >
                    Generate Solo Form
                  </div>
                </template>
                <div
                  v-if="$route.query.status && $route.query.status === 'solo-form' && slotProps.item.locum_solo_form_id"
                  class="my-1 p-2 bg-yellow-500 hover:bg-yellow-400 font-bold rounded-lg focus:outline-none cursor-pointer"
                  @click="viewAsPdf(slotProps.item.locum_solo_form_id, 'solo-form')"
                >
                  View Solo Form
                </div>
                <div
                  v-if="$route.query.status && $route.query.status === 'pension-form-a' && slotProps.item.nhs_claimable && slotProps.item.locum_form_a_id"
                  class="my-1 p-2 bg-yellow-500 hover:bg-yellow-400 font-bold rounded-lg focus:outline-none cursor-pointer"
                  @click="viewAsPdf(slotProps.item.locum_form_a_id, 'form-a')"
                >
                  View Form A
                </div>
              </div>
            </template>
          </AppTable>
          <div v-else class="flex justify-center">
            {{ noJobPartsToDisplay }}
          </div>
        </template>
        <template v-if="($route.query.status && $route.query.status === 'pension-form-b')">
          <AppTable
            v-if="locum_form_bs.length > 0"
            :total="total"
            :items="locum_form_bs"
            :current-page="current_page"
            :per-page="limit"
            :columns="form_bs_columns"
            :order-by="order_by"
            :loading="loading"
            @pagechanged="pagechanged"
            @limitchanged="limitchanged"
            @sorted="sorted"
          >
            <template v-slot:actions="slotProps">
              <div class="flex justify-center">
                <div
                  class="my-1 p-2 bg-yellow-500 hover:bg-yellow-400 font-bold rounded-lg focus:outline-none cursor-pointer"
                  @click="viewAsPdf(slotProps.item.id, 'form-b')"
                >
                  View Form B
                </div>
              </div>
            </template>
          </AppTable>
          <div
            v-if="locum_form_bs.length === 0"
            class="flex justify-center"
          >
            {{ noJobPartsToDisplay }}
          </div>
        </template>
      </div>
    </transition>

    <AppConfirmationModal
      :label="'Proceed to delete this invoice?'"
      :confirm-label="'Yes'"
      :cancel-label="'Cancel'"
      :modal="delete_invoice_modal"
      @confirm="deleteInvoice"
      @cancel="delete_invoice_modal = false"
    />

    <AppConfirmationModal
      :label="'Generate NHS Form A for this Private Invoice?'"
      :confirm-label="'Yes'"
      :cancel-label="'Cancel'"
      :modal="generate_form_a_modal"
      @confirm="generateFormA"
      @cancel="generate_form_a_modal = false"
    />

    <AppConfirmationModal
      :label="'Generate Solo Form for this Private Invoice?'"
      :confirm-label="'Yes'"
      :cancel-label="'Cancel'"
      :modal="generate_solo_form_modal"
      @confirm="generateSoloForm"
      @cancel="generate_solo_form_modal = false"
    />

    <div v-if="payment_modal" class="p-2">
      <div class="rounded-lg shadow-md px-4 py-8 md:px-8 payment-modal border w-5/6 md:w-1/3">
        <AppDate
          v-model="form.paid_at"
          :name="'paid_at'"
          :label="'Received payment on'"
          :error="formError.find(item => item.field === 'paid_at')"
          is-before
        />
        <AppInput
          v-model="form.ni"
          :type="'select'"
          :name="'ni'"
          :label="'Ni'"
          :items="[{ label: 'false', value: false }, { label: 'true', value: true }]"
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
          :label="'Paye'"
          :items="[{ label: 'false', value: false }, { label: 'true', value: true }]"
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
        v-if="['locum-billing-private-invoices-id', 'locum-billing-private-invoices-id-create', 'locum-billing-private-invoices-id-edit', 'locum-billing-private-invoices-form-b-create'].includes($route.name) || generate_solo_form_modal || delete_invoice_modal || payment_modal || generate_form_a_modal"
        :to="{ name: 'locum-billing-private-invoices', query: {...$route.query }}"
        :event="payment_modal || generate_form_a_modal || generate_solo_form_modal || delete_invoice_modal ? '' : 'click'"
        class="shield"
      />
    </transition>
    <nuxt-child
      @createInvoice="createInvoice"
      @updateInvoice="updateInvoice"
      @createFormB="createFormB"
    />
  </section>
</template>

<script>
import AppDate from "@/components/Base/AppDate"
import AppInput from "@/components/Base/AppInput"
import AppButton from "@/components/Base/AppButton"
import AppConfirmationModal from "@/components/Base/AppConfirmationModal"
import AppTable from "@/components/Base/AppTable"
import AppLoading from "@/components/Base/AppLoading"
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },
  components: {
    AppDate,
    AppInput,
    AppButton,
    AppConfirmationModal,
    AppLoading,
    AppTable
  },
  data () {
    return {
      initialLoading: false,
      loading: false,
      total: 0,
      job_parts: [],
      locum_form_bs: [],

      showRefresh: false,
      current_page: 1,

      offset: 0,
      limit: 5,
      order_by: [],

      form: {
        paid_at: null,
        ni: false,
        ni_amount: null,
        paye: false,
        paye_amount: null
      },
      formError: [],

      delete_invoice_modal: false,
      generate_form_a_modal: false,
      generate_solo_form_modal: false,
      payment_modal: false,
      invoice_id: null
    }
  },
  computed: {
    form_bs_columns () {
      let columns = []
      columns.push(
        {
          name: "Practices / Surgeries",
          dataIndex: "practices.name",
          class: "text-center"
        },
        {
          name: "Date Created",
          dataIndex: "date_created",
          class: "text-center localDate"
        },
        {
          name: "Actions",
          dataIndex: "actions",
          class: "text-center"
        }
      )
      return columns
    },
    columns () {
      let columns = []
      let queryStatus = this.$route.query.status
        ? this.$route.query.status.toLowerCase()
        : "to-be-invoiced"
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
          class: "text-center currency",
          sortable: true
        },
        {
          name: "OOH",
          dataIndex: "ooh",
          class: "text-center"
        },
        {
          name: "NHS Claimable",
          dataIndex: "nhs_claimable",
          class: "text-center"
        }
      )
      if (["issued", "pension-form-a"].includes(queryStatus)) {
        columns.push({
          name: "Paid",
          dataIndex: "paid",
          class: "text-center"
        })
      }
      columns.push({
        name: "Actions",
        dataIndex: "actions",
        class: "text-center"
      })
      return columns
    },
    authPermissions () {
      return this.$store.getters["permissions"]
    },
    noJobPartsToDisplay () {
      let str = ""
      switch (
        this.$route.query.status && this.$route.query.status.toLowerCase()
      ) {
        case "to-be-invoiced":
          str = "You do not have any completed job parts."
          break
        case "issued":
          str = "You do not have any issued invoices."
          break
        case "solo-form":
          str = "You do not have any solo forms."
          break
        case "pension-form-a":
          str = "You do not have any form a's."
          break
        case "pension-form-b":
          str = "You do not have any form b's."
          break
        default:
          str = "You do not have any completed job parts."
      }
      return str
    }
  },
  watch: {
    async "$route.query" (newValue, oldValue) {
      let newStatus = newValue.status
      let oldStatus = oldValue.status
      if (newStatus && newStatus !== null && newStatus !== oldStatus) {
        this.current_page = 1
        this.showRefresh = false
        this.total = 0
        this.job_parts = []
        this.initialLoading = true
        await this.getJobPartsPromiseAll()
        this.initialLoading = false
      }
    },
    "form.ni" (value) {
      if ([false, "false"].includes(value)) {
        this.form.ni_amount = 0
      }
    },
    "form.paye" (value) {
      if ([false, "false"].includes(value)) {
        this.form.paye_amount = 0
      }
    }
  },
  async asyncData ({ app, query, error }) {
    try {
      let url = `/api/v1/locum/job-parts`
      let locum_status = []
      let nhs_claimable
      let ooh
      let queryStatus = query.status

      switch (queryStatus && queryStatus.toLowerCase()) {
        case "to-be-invoiced":
          locum_status = ["Completed", "Private"]
          break
        case "issued":
          locum_status = ["Approved"]
          break
        case "solo-form":
          locum_status = ["Approved"]
          ooh = true
          break
        case "pension-form-a":
          locum_status = ["Approved"]
          nhs_claimable = true
          ooh = false
          break
        case "pension-form-b":
          url = `/api/v1/locum/locum-invoices-form-b`
          break
        default:
          locum_status = ["Completed", "Private"]
      }

      let locum_form_bs = []
      let [total, job_parts] = await Promise.all([
        app.$axios
          .$get(`${url}/count`, {
            params: {
              locum_status,
              nhs_claimable,
              ooh,
              job_type: "Private",
              type: "Private"
            }
          })
          .then(res => {
            const total = res.data.count
            return total
          }),
        app.$axios
          .$get(`${url}`, {
            params: {
              locum_status,
              nhs_claimable,
              ooh,
              job_type: "Private",
              type: "Private",
              offset: 0,
              limit: 5
            }
          })
          .then(res => {
            if (res.data && res.data.job_parts) {
              return res.data.job_parts
            } else if (res.data && res.data.locum_form_bs) {
              return res.data.locum_form_bs
            }
          })
      ])

      if (url === `/api/v1/locum/job-parts`) {
        job_parts = job_parts.map(jobPart => {
          let total = jobPart.locum_invoice_id
            ? jobPart.locum_invoice_item.total
            : jobPart.job.locum_detail_rate_type.name === "Per Hour"
            ? jobPart.job.rate * jobPart.final_hours
            : (jobPart.job.rate / jobPart.job.total_hours) *
              jobPart.final_hours

          total =
            jobPart.locum_invoice_item &&
            jobPart.locum_invoice_item.locum_invoice &&
            jobPart.locum_invoice_item.locum_invoice.paid_at
              ? total -
                jobPart.locum_invoice_item.locum_invoice.ni_amount -
                jobPart.locum_invoice_item.locum_invoice.paye_amount
              : total

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
              jobPart.locum_status === "Approved" &&
              jobPart.locum_invoice_item.locum_invoice.paid_at
                ? "Yes"
                : "No",
            nhs_claimable: jobPart.locum_invoice_id
              ? jobPart.locum_invoices_nhs_claimable
              : jobPart.locum_details_nhs_claimable
          }
        })
      } else if (url === `/api/v1/locum/locum-invoices-form-b`) {
        job_parts.forEach(item => {
          locum_form_bs.push({
            ...item,
            date_created: app
              .$moment(item.date_created, "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]")
              .format("DD-MM-YYYY"),
            practices: item.forms.map(form => {
              return {
                name: form.practice_name
              }
            })
          })
        })
      }

      return {
        total,
        job_parts,
        locum_form_bs
      }
    } catch (err) {
      console.log("err", err.response || err)
      error({
        statusCode: err.status || 500,
        message: err.message || "Something went wrong!"
      })
    }
  },
  mounted () {
    this.$socket.on(
      "Locum Notification Locum Invoice Created",
      this.getLocumInvoiceRealTime
    )
    this.$socket.on(
      "Locum Notification Locum Invoice Paid",
      this.getLocumInvoiceRealTime
    )
    this.$socket.on(
      "Locum Notification Locum Invoice Updated",
      this.getLocumInvoiceRealTime
    )
  },
  destroyed () {
    this.removeListener()
  },
  methods: {
    viewAsPdf (formId, type) {
      let url
      switch (type) {
        case "form-a":
          url = "/api/v1/locum-form-a"
          break
        case "form-b":
          url = "/api/v1/locum-form-b"
          break
        case "solo-form":
          url = "/api/v1/locum-solo-form"
          break
      }
      window.open(`${process.env.API_URL}${url}/${formId}/pdf`)
    },
    createFormB () {
      this.getJobParts()
      // this.locum_form_bs.push(invoice);
    },
    getJobPartsPromiseAll () {
      let url = `/api/v1/locum/job-parts`
      let locum_status = []
      let nhs_claimable
      let ooh
      let queryStatus = this.$route.query.status

      switch (queryStatus && queryStatus.toLowerCase()) {
        case "to-be-invoiced":
          locum_status = ["Completed", "Private"]
          break
        case "issued":
          locum_status = ["Approved"]
          break
        case "solo-form":
          locum_status = ["Approved"]
          ooh = true
          break
        case "pension-form-a":
          locum_status = ["Approved"]
          nhs_claimable = true
          ooh = false
          break
        case "pension-form-b":
          url = `/api/v1/locum/locum-invoices-form-b`
          break
        default:
          locum_status = ["Completed", "Private"]
      }

      return Promise.all([
        this.$axios.$get(`${url}/count`, {
          params: {
            locum_status,
            nhs_claimable,
            ooh,
            job_type: "Private",
            type: "Private"
          }
        }),
        this.$axios.$get(`${url}`, {
          params: {
            locum_status,
            nhs_claimable,
            ooh,
            job_type: "Private",
            type: "Private",
            offset: 0,
            limit: 5
          }
        })
      ])
        .then(([responseTotal, response]) => {
          this.total = responseTotal.data.count

          if (response.data && response.data.job_parts) {
            let job_parts = response.data.job_parts
            this.job_parts = job_parts.map(jobPart => {
              let total = jobPart.locum_invoice_id
                ? jobPart.locum_invoice_item.total
                : jobPart.job.locum_detail_rate_type.name === "Per Hour"
                ? jobPart.job.rate * jobPart.final_hours
                : (jobPart.job.rate / jobPart.job.total_hours) *
                  jobPart.final_hours

              total =
                jobPart.locum_invoice_item &&
                jobPart.locum_invoice_item.locum_invoice &&
                jobPart.locum_invoice_item.locum_invoice.paid_at
                  ? total -
                    jobPart.locum_invoice_item.locum_invoice.ni_amount -
                    jobPart.locum_invoice_item.locum_invoice.paye_amount
                  : total

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
                  jobPart.locum_status === "Approved" &&
                  jobPart.locum_invoice_item.locum_invoice.paid_at
                    ? "Yes"
                    : "No",
                nhs_claimable: jobPart.locum_invoice_id
                  ? jobPart.locum_invoices_nhs_claimable
                  : jobPart.locum_details_nhs_claimable
              }
            })
          } else if (response.data && response.data.locum_form_bs) {
            this.locum_form_bs = response.data.locum_form_bs.map(item => {
              return {
                ...item,
                date_created: this.$moment(
                  item.date_created,
                  "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"
                ).format("DD-MM-YYYY"),
                practices: item.forms.map(form => {
                  return {
                    name: form.practice_name
                  }
                })
              }
            })
          }
        })
        .catch(([errTotal, errJobParts]) => {
          console.log(
            "err",
            errTotal.response || errTotal || errJobParts.response || errJobParts
          )
        })
    },
    getJobParts () {
      let url = `/api/v1/locum/job-parts`
      let locum_status = []
      let nhs_claimable
      let ooh
      let queryStatus = this.$route.query.status

      switch (queryStatus && queryStatus.toLowerCase()) {
        case "to-be-invoiced":
          locum_status = ["Completed", "Private"]
          break
        case "issued":
          locum_status = ["Approved"]
          break
        case "solo-form":
          locum_status = ["Approved"]
          ooh = true
          break
        case "pension-form-a":
          locum_status = ["Approved"]
          nhs_claimable = true
          ooh = false
          break
        case "pension-form-b":
          url = `/api/v1/locum/locum-invoices-form-b`
          break
        default:
          locum_status = ["Completed", "Private"]
      }

      return this.$axios
        .$get(`${url}`, {
          params: {
            locum_status,
            nhs_claimable,
            ooh,
            job_type: "Private",
            type: "Private",
            order_by: this.order_by,
            offset: this.offset,
            limit: this.limit
          }
        })
        .then(res => {
          if (res.data && res.data.job_parts) {
            let job_parts = res.data.job_parts

            this.job_parts = job_parts.map(jobPart => {
              let total = jobPart.locum_invoice_id
                ? jobPart.locum_invoice_item.total
                : jobPart.job.locum_detail_rate_type.name === "Per Hour"
                ? jobPart.job.rate * jobPart.final_hours
                : (jobPart.job.rate / jobPart.job.total_hours) *
                  jobPart.final_hours

              total =
                jobPart.locum_invoice_item &&
                jobPart.locum_invoice_item.locum_invoice &&
                jobPart.locum_invoice_item.locum_invoice.paid_at
                  ? total -
                    jobPart.locum_invoice_item.locum_invoice.ni_amount -
                    jobPart.locum_invoice_item.locum_invoice.paye_amount
                  : total

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
                  jobPart.locum_status === "Approved" &&
                  jobPart.locum_invoice_item.locum_invoice.paid_at
                    ? "Yes"
                    : "No",
                nhs_claimable: jobPart.locum_invoice_id
                  ? jobPart.locum_invoices_nhs_claimable
                  : jobPart.locum_details_nhs_claimable
              }
            })
          } else if (res.data && res.data.locum_form_bs) {
            this.locum_form_bs = res.data.locum_form_bs.map(item => {
              return {
                ...item,
                date_created: this.$moment(
                  item.date_created,
                  "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"
                ).format("DD-MM-YYYY"),
                practices: item.forms.map(form => {
                  return {
                    name: form.practice_name
                  }
                })
              }
            })
          }
        })
        .catch(err => {
          console.log("err", err.response || err)
        })
    },
    async refreshInvoices () {
      this.$store.commit("billing/CLEAR_LOCUM_BILLING_NOTIFICATION")
      this.loading = true
      await this.getJobPartsPromiseAll()
      this.loading = false
      this.showRefresh = false
    },
    getLocumInvoiceRealTime ({ id }) {
      if (!id) {
        return
      }
      this.showRefresh = true
    },
    removeListener () {
      this.$socket.removeListener(
        "Locum Notification Locum Invoice Create",
        this.getLocumInvoiceRealTime
      )
      this.$socket.removeListener(
        "Locum Notification Locum Invoice Paid",
        this.getLocumInvoiceRealTime
      )
      this.$socket.removeListener(
        "Locum Notification Locum Invoice Updated",
        this.getLocumInvoiceRealTime
      )
    },
    select_invoice (id, type) {
      this.invoice_id = id
      if (type === "deleteInvoice") {
        this.delete_invoice_modal = true
      } else if (type === "generateFormA") {
        this.generate_form_a_modal = true
      } else if (type === "generateSoloForm") {
        this.generate_solo_form_modal = true
      } else if (type === "markAsPaid") {
        this.payment_modal = true
      }
    },
    deleteInvoice () {
      this.$axios
        .$delete(`/api/v1/locum/locum-invoices/${this.invoice_id}`)
        .then(res => {
          let queryStatus = this.$route.query.status

          let job_part = this.job_parts.find(item => {
            return item.locum_invoice_id === this.invoice_id
          })

          job_part.locum_invoice_id = null
          job_part.total_amount =
            job_part.job.locum_detail_rate_type.name === "Per Hour"
              ? job_part.final_hours * job_part.job.rate
              : job_part.job.rate

          let index = this.job_parts.findIndex(item => item.id === job_part.id)
          if (index >= 0) {
            if (
              !queryStatus ||
              (queryStatus === "to-be-invoiced" &&
                job_part.invoice_status === "To Be Invoice")
            ) {
              this.job_parts.splice(index, 1, job_part)
            } else if (job_part.invoice_status !== "To Be Invoice") {
              this.job_parts.splice(index, 1)
            }
          }

          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`${res.message}`]
          })
          this.delete_invoice_modal = false
        })
        .catch(err => {
          console.log("err", err.response || err)
          if (err.response.data.message) {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: [`${err.response.data.message}`]
            })
          }
        })
    },
    createInvoice () {
      this.getJobParts()
      // console.log(invoice);
      // let queryStatus = this.$route.query.status;

      // let job_part = this.job_parts.find(
      //   item => item.id === invoice.items[0].job_part.id
      // );
      // job_part.locum_invoice_id = invoice.id;
      // job_part.total_amount = invoice.items[0].total;

      // let index = this.job_parts.findIndex(item => item.id === job_part.id);
      // if (index >= 0) {
      //   if (
      //     (!queryStatus || queryStatus === "to-be-invoiced") &&
      //     invoice.status === "Draft"
      //   ) {
      //     this.job_parts.splice(index, 1, job_part);
      //   } else if (
      //     (!queryStatus || queryStatus === "to-be-invoiced") &&
      //     invoice.status !== "Draft"
      //   ) {
      //     this.job_parts.splice(index, 1);
      //   }
      // }
    },
    updateInvoice () {
      this.getJobParts()
      // let queryStatus = this.$route.query.status;

      // let job_part = this.job_parts.find(
      //   item => item.id === invoice.items[0].job_part.id
      // );
      // job_part.locum_invoice_id = invoice.id;
      // job_part.total_amount = invoice.items[0].total;

      // let index = this.job_parts.findIndex(item => item.id === job_part.id);
      // if (index >= 0) {
      //   if (
      //     ((!queryStatus ||
      //       (queryStatus && queryStatus === "to-be-invoiced")) &&
      //       invoice.status === "Draft") ||
      //     (queryStatus &&
      //       queryStatus === "issued" &&
      //       invoice.status === "Issued") ||
      //     (queryStatus &&
      //       queryStatus === "disputed" &&
      //       invoice.status === "Disputed") ||
      //     (queryStatus &&
      //       queryStatus === "approved" &&
      //       invoice.status === "Approved")
      //   ) {
      //     this.job_parts.splice(index, 1, job_part);
      //   } else {
      //     this.job_parts.splice(index, 1);
      //   }
      // }
    },
    generateFormA () {
      this.$axios
        .$post(`/api/v1/locum/locum-invoices-form-a`, {
          locum_invoice_id: this.invoice_id
        })
        .then(res => {
          let index = this.job_parts.findIndex(
            item => item.locum_invoice_id === this.invoice_id
          )
          if (index >= 0) {
            let jobPart = this.job_parts[index]
            jobPart.locum_form_a_id = res.data.locum_invoice_form_a.id
            this.job_parts.splice(index, 1, jobPart)
          }

          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`${res.message}`]
          })
        })
        .catch(err => {
          console.log("err", err.response || err)
          if (err.response.data.message) {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "danger",
              text: [`${err.response.data.message}`]
            })
          }
          throw err
        })
        .finally(() => {
          this.generate_form_a_modal = false
        })
    },
    generateSoloForm () {
      this.$axios
        .$post(`/api/v1/locum/locum-solo-form`, {
          locum_invoice_id: this.invoice_id
        })
        .then(res => {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`${res.message}`]
          })
        })
        .catch(err => {
          console.log("err", err.response || err)
          if (err.response.data.message) {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "danger",
              text: [`${err.response.data.message}`]
            })
          }
          throw err
        })
        .finally(() => {
          this.generate_solo_form_modal = false
        })
    },
    confirmPayment () {
      let notRequired = ["ni", "paye"]
      if ([false, "false"].includes(this.form.ni)) {
        notRequired.push("ni_amount")
      }
      if ([false, "false"].includes(this.form.paye)) {
        notRequired.push("paye_amount")
      }
      this.formError = []
      this.Validate(this.form, notRequired)
      if (!this.formError.length) {
        this.$axios
          .$put(
            `/api/v1/locum/locum-invoices/${this.invoice_id}/paid`,
            this.form
          )
          .then(res => {
            this.getJobParts()
            // let job_part = this.job_parts.find(
            //   item => item.id === res.data.locum_invoice.items[0].job_part.id
            // );

            // let index = this.job_parts.findIndex(
            //   item => item.id === job_part.id
            // );

            // if (index >= 0) {
            //   job_part.locum_invoice_item.locum_invoice.paid_at =
            //     res.data.locum_invoice.paid_at;
            //   job_part.locum_invoice_item.locum_invoice.ni =
            //     res.data.locum_invoice.ni;
            //   job_part.locum_invoice_item.locum_invoice.ni_amount =
            //     res.data.locum_invoice.ni_amount;
            //   job_part.locum_invoice_item.locum_invoice.paye =
            //     res.data.locum_invoice.paye;
            //   job_part.locum_invoice_item.locum_invoice.paye_amount =
            //     res.data.locum_invoice.paye_amount;
            //   this.job_parts.splice(index, 1, job_part);
            // }

            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: [`${res.message}`]
            })

            this.payment_modal = false
            this.form.ni = false
            this.form.ni_amount = null
            this.form.paye = false
            this.form.paye_amount = null
          })
          .catch(err => {
            console.log("err", err.response || err)
            throw err
          })
      }
    },

    async sorted (order_by) {
      this.current_page = 1
      this.offset = 0
      this.order_by = order_by
      this.loading = true
      await this.getJobParts()
      this.loading = false
    },
    async pagechanged (page) {
      this.current_page = page
      this.offset = this.limit * (page - 1)
      this.loading = true
      await this.getJobParts()
      this.loading = false
    },
    async limitchanged (limit) {
      this.current_page = 1
      this.offset = 0
      this.limit = limit
      this.loading = true
      await this.getJobParts()
      this.loading = false
    }
  }
}
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
