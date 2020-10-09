<template>
  <section class="relative">
    <div class="flex flex-row justify-start overflow-x-auto pb-3">
      <nuxt-link
        :to="{ path: '/practice-billing/invoices-from-locums', query: { ...$route.query, status: 'to-be-invoiced' } }"
        class="md:mr-5 p-3 text-xs font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('practice-billing-invoices-from-locums') && (!$route.query.status || ($route.query.status && $route.query.status.toLowerCase() === 'to-be-invoiced')) ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >
        To be Invoiced
      </nuxt-link>

      <nuxt-link
        :to="{ path: '/practice-billing/invoices-from-locums', query: { ...$route.query, status: 'disputed' } }"
        class="md:mr-5 p-3 text-xs font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('practice-billing-invoices-from-locums') && ($route.query.status && $route.query.status.toLowerCase() === 'disputed') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >
        Disputed Invoices
      </nuxt-link>

      <nuxt-link
        :to="{ path: '/practice-billing/invoices-from-locums', query: { ...$route.query, status: 'issued' } }"
        class="md:mr-5 p-3 text-xs font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('practice-billing-invoices-from-locums') && ($route.query.status && $route.query.status.toLowerCase() === 'issued') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >
        Invoiced
      </nuxt-link>

      <nuxt-link
        :to="{ path: '/practice-billing/invoices-from-locums', query: { ...$route.query, status: 'approved' } }"
        class="md:mr-5 p-3 text-xs font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('practice-billing-invoices-from-locums') && ($route.query.status && $route.query.status.toLowerCase() === 'approved') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >
        Approved Invoices
      </nuxt-link>

      <nuxt-link
        :to="{ path: '/practice-billing/invoices-from-locums', query: { ...$route.query, status: 'solo-form' } }"
        class="md:mr-5 p-3 text-xs font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('practice-billing-invoices-from-locums') && ($route.query.status && $route.query.status.toLowerCase() === 'solo-form') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >
        Solo Forms
      </nuxt-link>

      <nuxt-link
        :to="{ path: '/practice-billing/invoices-from-locums', query: { ...$route.query, status: 'pension-form-a' } }"
        class="md:mr-5 p-3 text-xs font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('practice-billing-invoices-from-locums') && ($route.query.status && $route.query.status.toLowerCase() === 'pension-form-a') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >
        NHS Pension Form A
      </nuxt-link>
      <!-- <nuxt-link
        :to="{ path: '/practice-billing/invoices-from-locums/locum-billing-reports'}"
        class="md:mr-5 p-3 text-xs font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('practice-billing-invoices-from-locums-locum-billing-reports') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >
        Reports
      </nuxt-link> -->
    </div>
    <transition name="fade" mode="out-in">
      <div v-if="initialLoading" class="relative flex w-full" style="min-height:80px">
        <AppLoading :loading="initialLoading" spinner />
      </div>

      <div v-if="!initialLoading">
        <AppButton
          v-if="!['pension-form-b'].includes($route.query.status)"
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
              :name="'job_ir35'"
              :label="'Inside ir35'"
              :items="[{ label: 'Yes', value: true },{ label: 'No', value: false}, { label: 'All', value: null} ]"
            />
          </div>
          <div
            v-if="$route.query.status && $route.query.status.toLowerCase() !== 'to-be-invoiced'"
            class="md:px-1 w-full lg:w-1/4 md:w-1/3"
          >
            <AppInput
              v-model="invoice_number"
              class="px-1"
              :type="'text'"
              :name="'invoice_number'"
              :label="'Invoice number'"
            />
          </div>
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput
              v-model="job_part_number_includes"
              class="px-1"
              :type="'text'"
              :name="'job_part_number_includes'"
              :label="'Job Part number'"
            />
          </div>
          <div
            v-if="$route.query.status && ['approved', 'pension-form-a'].includes($route.query.status.toLowerCase())"
            class="md:px-1 w-full lg:w-1/4 md:w-1/3"
          >
            <AppInput
              v-model="is_paid"
              class="px-1"
              :type="'select'"
              :name="'is_paid'"
              :label="'Paid'"
              :items="[{ label: 'Yes', value: true },{ label: 'No', value: false}, { label: 'All', value: null} ]"
            />
          </div>
          <div class="md:px-1 flex w-full">
            <AppButton
              :disabled="disabledClearFilter"
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
          :total="jobPartCount"
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
                v-if="
                  slotProps.item.locum_invoice_id 
                    && slotProps.item.invoice_status !== 'To Be Invoice' 
                    && slotProps.item.status !== 'Approved' 
                    && $route.query.status !== 'issued'"
                class="my-1 py-2 px-3 bg-yellow-500 hover:bg-yellow-400 font-bold rounded-lg focus:outline-none cursor-pointer transition-hover"
                @click="$router.push({ path: `/practice-billing/invoices-from-locums/${slotProps.item.locum_invoice_id}/edit`, query: {...$route.query} })"
              >
                {{ authPermissions.includes('Process Billings') ? 'Edit' : 'View' }}
              </div>

              <div
                v-if="['approved', 'issued'].includes($route.query.status)"
                class="mx-1 py-2 px-3 bg-yellow-500 hover:bg-yellow-400 font-bold rounded-lg focus:outline-none cursor-pointer transition-hover"
                @click="$router.push({ path: `/practice-billing/invoices-from-locums/${slotProps.item.locum_invoice_id}`, query: {...$route.query} })"
              >
                View
              </div>

              <div
                v-if="
                  $route.query.status && $route.query.status === 'pension-form-a'
                    && slotProps.item.locum_form_a_id
                "
                class="my-1 py-2 px-3 bg-yellow-500 hover:bg-yellow-400 font-bold rounded-lg focus:outline-none cursor-pointer"
                @click="viewAsPdf(slotProps.item.locum_form_a_id, 'form-a')"
              >
                View Form A
              </div>

              <div
                v-if="
                  $route.query.status && $route.query.status === 'pension-form-a'
                    && slotProps.item.locum_form_a_id
                    && !slotProps.item.locum_form_a_paid_by_practice
                "
                class="my-1 py-2 px-3 bg-yellow-500 hover:bg-yellow-400 font-bold rounded-lg focus:outline-none cursor-pointer"
                @click.stop.prevent="locumFormAIdToBePaid = slotProps.item.locum_form_a_id, locumFormAPaidAt = null"
              >
                Mark as Paid
              </div>

              <div
                v-if="
                  $route.query.status && $route.query.status === 'solo-form'
                    && slotProps.item.ooh
                    && slotProps.item.locum_solo_form_id
                "
                class="my-1 py-2 px-3 bg-yellow-500 hover:bg-yellow-400 font-bold rounded-lg focus:outline-none cursor-pointer"
                @click="viewAsPdf(slotProps.item.locum_solo_form_id, 'solo-form')"
              >
                View Solo Form
              </div>

              <!-- v-if="slotProps.item.status === 'Approved' && slotProps.item.locum_invoice_item && !slotProps.item.locum_invoice_item.locum_invoice.paid_at
              && $route.query.status === 'approved'"-->
              <button
                v-if="
                  $route.query.status === 'approved' 
                    && !slotProps.item.locum_invoice_item.locum_invoice.paid_at
                    && authPermissions.includes('Process Billings')"
                class="my-1 py-2 px-3 font-bold rounded-lg focus:outline-none cursor-pointer transition-hover bg-yellow-400 hover:bg-yellow-500"
                @click.stop.prevent="select_invoice(slotProps.item.locum_invoice_id)"
              >
                Mark as Paid
              </button>

              <div
                v-if="
                  $route.query.status && $route.query.status === 'solo-form'
                    && slotProps.item.ooh
                    && slotProps.item.locum_solo_form_id
                    && slotProps.item.locum_solo_form_sent_to_locum === 0
                    && authPermissions.includes('Process Billings')
                "
                class="my-1 py-2 px-3 font-bold rounded-lg focus:outline-none"
                :class="slotProps.item.locum_form_a_sent_to_practice === 1 ? 'bg-gray-600 text-white cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-400 cursor-pointer'"
                @click="toggleSendFormAModal(slotProps.item.locum_invoice_id, slotProps.item.locum_solo_form_sent_to_locum)"
              >
                Send Form to Locum
              </div>
            </div>
            <div v-else class="text-gray-600">
              Disabled by Hub
            </div>
          </template>
        </AppTable>
        <div
          v-if="!job_parts.length && !isFiltered"
          class="flex justify-center"
        >
          {{ noJobPartsToDisplay }}
        </div>
        <div v-if="!job_parts.length && isFiltered" class="flex justify-center py-4">
          No Jobs Found
        </div>

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

        <div v-if="locumFormAIdToBePaid" class="p-2">
          <div class="rounded-lg shadow-md px-4 py-8 md:px-8 payment-modal border w-5/6 md:w-1/3">
            <AppDate
              v-model="locumFormAPaidAt"
              :name="'paid_at'"
              :label="'Payment made on'"
              :error="formError.find(item => item.field === 'paid_at')"
              is-before
            />

            <div class="flex flex-row flex-no-wrap justify-center">
              <AppButton
                class="mx-1"
                :label="'Save'"
                :in-style="'padding:5px 10px'"
                @click="formAPaidByPractice"
              />

              <AppButton
                class="mx-1"
                :label="'Cancel'"
                :in-style="'padding:5px 10px'"
                @click="locumFormAIdToBePaid = null"
              />
            </div>
          </div>
        </div>

        <AppConfirmationModal
          :label="'Send this Solo Form to Locum?'"
          :confirm-label="'Yes'"
          :cancel-label="'Cancel'"
          :modal="send_solo_form_modal"
          @confirm="sendForm"
          @cancel="send_solo_form_modal = false"
        />

        <transition name="fade" mode="out-in">
          <nuxt-link
            v-if="
              [
                'practice-billing-invoices-from-locums-id',
                'practice-billing-invoices-from-locums-id-edit'
              ].includes($route.name)
                || payment_modal
                || locumFormAIdToBePaid
            "
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
import AppConfirmationModal from "@/components/Base/AppConfirmationModal"
import AppTable from "@/components/Base/AppTable"
import AppDate from "@/components/Base/AppDate"
import AppButton from "@/components/Base/AppButton"
import AppInput from "@/components/Base/AppInput"
import AppLoading from "@/components/Base/AppLoading"

export default {
  transition: {
    name: "fade",
    mode: "out-in",
  },

  components: {
    AppConfirmationModal,
    AppTable,
    AppDate,
    AppButton,
    AppLoading,
    AppInput,
  },

  data () {
    return {
      user: "",
      practice: "",

      initialLoading: false,
      loading: false,
      filterModal: false,
      isFiltered: false,
      jobPartCount: 0,
      job_parts: [],

      showRefresh: false,
      current_page: 1,

      offset: 0,
      limit: 5,
      order_by: [],
      job_ir35: null,
      invoice_number: null,
      job_part_number_includes: null,
      is_paid: null,

      payment_modal: false,
      invoice_id: null,
      send_solo_form_modal: false,
      form: {
        paid_at: null,
        ni: false,
        ni_amount: null,
        paye: false,
        paye_amount: null,
      },
      formError: [],

      locumFormAPaidAt: null,
      locumFormAIdToBePaid: null,
    }
  },

  computed: {
    columns () {
      let columns = []
      let queryStatus = this.$route.query.status
        ? this.$route.query.status.toLowerCase()
        : "to-be-invoiced"

      columns.push({
        name: "Practice / Surgery",
        dataIndex: "practice_name",
        class: "text-center",
        sortable: true,
      })

      if (queryStatus !== "to-be-invoiced") {
        columns.push({
          name: "Invoice Number",
          dataIndex: "invoice_number",
          sortable: true,
        })
      }

      columns.push(
        {
          name: "Job Part Number",
          dataIndex: "job_part_number",
          sortable: true,
        },
        {
          name: "Job Title",
          dataIndex: "job_title",
          sortable: true,
        },
        {
          name: "£ Amount",
          dataIndex: "job_part_gross_rate_formatted",
          class: "text-center",
          sortable: true,
        },
        {
          name: "Under IR35",
          dataIndex: "job_ir35",
          class: "text-center",
        },
        {
          name: "Under Parent Practice",
          dataIndex: "under_parent_practice",
          class: "text-center",
        }
      )

      if (["approved",].includes(queryStatus)) {
        columns.push({
          name: "Paid Invoice",
          dataIndex: "paid_formatted",
          class: "text-center",
          sortable: true,
        })

        columns.push({
          name: "Paid At",
          dataIndex: "paid_at_in_gb_formatted",
          class: "text-center",
          sortable: true,
        })
      }

      if (["pension-form-a",].includes(queryStatus)) {
        columns.push({
          name: "Paid By Practice At",
          dataIndex: "locum_form_a_paid_by_practice_at_formatted",
          class: "text-center",
        })

        columns.push({
          name: "Paid By Locum At",
          dataIndex: "locum_form_a_paid_at_formatted",
          class: "text-center",
        })
      }

      if (queryStatus === "approved" || queryStatus === "pension-form-a" || queryStatus === "solo-form") {
        columns.push({
          name: "Approved At",
          dataIndex: "approved_at_in_gb_formatted",
          class: "text-center",
          sortable: true,
        })
      } else if (queryStatus === "to-be-invoiced") {
        columns.push({
          name: "Completed At",
          dataIndex: "completed_at_in_gb_formatted",
          class: "text-center",
          sortable: true,
        })
      } else {
        columns.push({
          name: "Issued",
          dataIndex: "issued_at_in_gb_formatted",
          class: "text-center",
          sortable: true,
        })
      }

      columns.push({
        name: "Locum",
        dataIndex: "locum_first_name",
        class: "text-center",
      })

      if (queryStatus !== "to-be-invoiced") {
        columns.push({
          name: "Actions",
          dataIndex: "actions",
          class: "text-center",
        })
      }

      return columns
    },
    ir35 () {
      if (!this.invoice_id) {
        return false
      }
      let selectedInvoice = this.job_parts.find(
        item => item.locum_invoice_id === this.invoice_id
      )
      return selectedInvoice.job_ir35 ? selectedInvoice.job_ir35 : false
    },
    authPermissions () {
      return this.$store.getters["permissions"]
    },
    noJobPartsToDisplay () {
      let str = ""
      let queryStatus = this.$route.query.status
      switch (queryStatus && queryStatus.toLowerCase()) {
      case "to-be-invoiced":
        str = "You do not have any completed job parts."
        break
      case "disputed":
        str = "You do not have any disputed invoices."
        break
      case "issued":
        str = "You do not have any invoiced job parts."
        break
      case "approved":
        str = "You do not have any approved job parts."
        break
      case "pension-form-a":
        str = "You do not have any nhs form a."
        break
      case "pension-form-b":
        str = "You do not have any nhs form b."
        break
      case "solo-form":
        str = "You do not have any solo forms."
        break
      default:
        str = "You do not have any completed job parts."
      }
      return str
    },
    disabledClearFilter () {
      let jobIr35 = this.job_ir35 === "" ? null : this.job_ir35
      let isPaid = this.is_paid === "" ? null : this.is_paid
      let invoiceNumber
        = this.invoice_number === "" ? null : this.invoice_number
      let jobPartNumberIncludes
        = this.job_part_number_includes === ""
          ? null
          : this.job_part_number_includes

      if (
        isPaid === null
        && jobIr35 === null
        && invoiceNumber === null
        && jobPartNumberIncludes === null
      ) {
        return true
      }
      return false
    },
  },

  watch: {
    async "$route.query" (newValue, oldValue) {
      console.log('oldvaue', oldValue)
      console.log('newvalue', newValue)
      let newStatus = newValue.status
      let oldStatus = oldValue.status
      if (newStatus && newStatus !== null && newStatus !== oldStatus) {
        this.current_page = 1
        this.filterModal = false
        this.showRefresh = false
        this.jobPartCount = 0
        this.job_parts = []
        this.clearFilters()
        this.isFiltered = false
        this.initialLoading = true
        await this.getJobPartsPromiseAll()
        this.initialLoading = false
      }
    },
    "form.ni" (value) {
      if ([false, "false",].includes(value)) {
        this.form.ni_amount = 0
      }
    },
    "form.paye" (value) {
      if ([false, "false",].includes(value)) {
        this.form.paye_amount = 0
      }
    },
  },

  created () {
    this.user = this.$auth.user
    this.practice = this.$auth.user && this.$auth.user.domain === 'Practice' && this.$auth.user.practice_detail
      ? this.$auth.user.practice_detail.practice
      : null
  },

  mounted () {
    this.$socket.on("Practice Notification Locum Invoice Created", this.getLocumInvoiceRealTime)
    this.$socket.on("Practice Notification Locum Invoice Paid", this.getLocumInvoiceRealTime)
    this.$socket.on("Practice Notification Locum Invoice Updated", this.getLocumInvoiceRealTime)

    this.initialLoading = true
    this.getJobPartsPromiseAll().catch((err) => {
      console.log('err', err.response || err)
    }).finally(() => {
      this.initialLoading = false
    })
  },

  destroyed () {
    this.$socket.removeListener("Practice Notification Locum Invoice Created", this.getLocumInvoiceRealTime)
    this.$socket.removeListener("Practice Notification Locum Invoice Paid", this.getLocumInvoiceRealTime)
    this.$socket.removeListener("Practice Notification Locum Invoice Updated", this.getLocumInvoiceRealTime)
  },

  methods: {
    toggleSendFormAModal (locumInvoiceId, alreadySent) {
      if (alreadySent) return
      this.send_solo_form_modal = true
      this.invoice_id = locumInvoiceId
    },
    sendForm () {
      this.$axios
        .$put(
          `/api/v1/practice/locum-invoices-solo-form/${this.invoice_id}/send-to-locum`
        )
        .then(res => {
          console.log(res)
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`${res.message}`,],
          })
          this.send_solo_form_modal = false
          let updatedSoloForm = this.job_parts.find(
            jobPart =>
              jobPart.locum_invoice_id
              === res.data.locum_solo_form.locum_invoice_id
          )
          updatedSoloForm.locum_solo_form_sent_to_locum = 1
        })
    },
    viewAsPdf (formId, type) {
      let url
        = type === "form-a"
          ? `/api/v1/locum-form-a`
          : type === "solo-form"
            ? `/api/v1/locum-solo-form`
            : `/api/v1/locum-form-b`
      window.open(`${process.env.API_URL}${url}/${formId}/pdf`)
    },
    
    getJobPartsPromiseAll () {
      let status = []
      let invoice_status = []
      let locum_invoiceable
      let nhs_claimable
      let ooh
      // let generate_form
      let sent_to_practice
      let queryStatus = this.$route.query.status

      switch (queryStatus && queryStatus.toLowerCase()) {
      case "to-be-invoiced":
        invoice_status.push("To Be Invoiced")
        status = ["Completed", "Declined", "Cancelled",]
        locum_invoiceable = true
        break
      case "disputed":
        invoice_status.push("Disputed")
        status = ["Completed", "Declined", "Cancelled",]
        locum_invoiceable = true
        break
      case "issued":
        invoice_status.push("Invoiced")
        status = ["Completed", "Declined", "Cancelled",]
        locum_invoiceable = true
        break
      case "approved":
        invoice_status.push("Invoiced")
        status.push("Approved")
        locum_invoiceable = true
        break
      case "solo-form":
        invoice_status.push("Invoiced")
        status.push("Approved")
        locum_invoiceable = true
        ooh = true
        // generate_form = true
        break
      case "pension-form-a":
        invoice_status.push("Invoiced")
        status.push("Approved")
        locum_invoiceable = true
        nhs_claimable = true
        sent_to_practice = true
        break
      default:
        invoice_status.push("To Be Invoiced")
        status = ["Completed", "Declined", "Cancelled",]
        locum_invoiceable = true
      }

      return Promise.all([
        this.$axios.$get(`/api/v1/practice/job-parts/count`, {
          params: {
            invoice_status,
            status,
            locum_invoiceable,
            nhs_claimable,
            ooh,
            sent_to_practice,
            type: "Platform",
            job_ir35: this.job_ir35,
            is_paid: this.is_paid,
            invoice_number: this.invoice_number,
            job_part_number_includes: this.job_part_number_includes,
            job_practice_id: [this.$auth.user.practice_id,],
          },
        }),
        this.$axios.$get(`/api/v1/practice/job-parts`, {
          params: {
            invoice_status,
            status,
            locum_invoiceable,
            nhs_claimable,
            ooh,
            sent_to_practice,
            type: "Platform",
            job_ir35: this.job_ir35,
            is_paid: this.is_paid,
            invoice_number: this.invoice_number,
            job_part_number_includes: this.job_part_number_includes,
            job_practice_id: [this.$auth.user.practice_id,],
            offset: 0,
            limit: 5,
          },
        }),
      ])
        .then(([responseTotal, responseJobParts,]) => {
          this.jobPartCount = responseTotal.data.count
          let job_parts = responseJobParts.data.job_parts
          this.job_parts = job_parts.map(jobPart => {
            return {
              ...jobPart,
              under_parent_practice: jobPart.parent_practice_id ? "Yes" : "No",
            }
          })
        })
        .catch((err) => {
          console.log('err', err.response || err)
          this.$nuxt.error(err)
        })
    },

    async filterJobParts () {
      this.current_page = 1
      this.offset = 0
      this.limit = 5
      this.initialLoading = true
      this.isFiltered = true
      await this.getJobPartsPromiseAll()
      this.initialLoading = false
      this.filterModal = false
    },

    getJobParts () {
      let status = []
      let invoice_status = []
      let locum_invoiceable
      let nhs_claimable
      let ooh
      // let generate_form
      let sent_to_practice
      let queryStatus = this.$route.query.status

      switch (queryStatus && queryStatus.toLowerCase()) {
      case "to-be-invoiced":
        invoice_status.push("To Be Invoiced")
        status = ["Completed", "Declined", "Cancelled",]
        locum_invoiceable = true
        break
      case "disputed":
        invoice_status.push("Disputed")
        status = ["Completed", "Declined", "Cancelled",]
        locum_invoiceable = true
        break
      case "issued":
        invoice_status.push("Invoiced")
        status = ["Completed", "Declined", "Cancelled",]
        locum_invoiceable = true
        break
      case "approved":
        invoice_status.push("Invoiced")
        status.push("Approved")
        locum_invoiceable = true
        break
      case "solo-form":
        invoice_status.push("Invoiced")
        status.push("Approved")
        locum_invoiceable = true
        ooh = true
        // generate_form = true
        break
      case "pension-form-a":
        invoice_status.push("Invoiced")
        status.push("Approved")
        locum_invoiceable = true
        nhs_claimable = true
        sent_to_practice = true
        break
      default:
        invoice_status.push("To Be Invoiced")
        status = ["Completed", "Declined", "Cancelled",]
        locum_invoiceable = true
      }

      return this.$axios
        .$get(`/api/v1/practice/job-parts`, {
          params: {
            invoice_status,
            status,
            locum_invoiceable,
            nhs_claimable,
            ooh,
            sent_to_practice,
            type: "Platform",
            job_ir35: this.job_ir35,
            is_paid: this.is_paid,
            invoice_number: this.invoice_number,
            job_part_number_includes: this.job_part_number_includes,
            job_practice_id: [this.$auth.user.practice_id,],
            offset: this.offset,
            limit: this.limit,
            order_by: this.order_by,
          },
        })
        .then(res => {
          let job_parts = res.data.job_parts

          this.job_parts = job_parts.map(jobPart => {
            return {
              ...jobPart,
              under_parent_practice: jobPart.parent_practice_id ? "Yes" : "No",
            }
          })
        })
        .catch(err => {
          console.log("err", err.response || err)
        })
    },
    async refreshInvoices () {
      this.loading = true
      this.current_page = 1
      this.offset = 0
      this.limit = 5
      await this.getJobPartsPromiseAll()
      this.loading = false
      this.showRefresh = false
    },
    getLocumInvoiceRealTime ({ id, }) {
      if (!id) {
        return
      }
      this.showRefresh = true
    },

    select_invoice (id) {
      this.payment_modal = true
      this.form.paid_at = null
      this.form.ni = false
      this.form.ni_amount = null
      this.form.paye = false
      this.form.paye_amount = null
      this.invoice_id = id
    },

    updateInvoice (invoice) {
      let queryStatus = this.$route.query.status
        ? this.$route.query.status.toLowerCase()
        : null

      let job_part = this.job_parts.find(
        item => item.id === invoice.items[0].job_part.id
      )

      if (job_part) {
        job_part.locum_invoice_id = invoice.id
        job_part.job_part_gross_rate_formatted = invoice.job_part_gross_rate_formatted
        
        let index = this.job_parts.findIndex(item => item.id === job_part.id)
        if (index >= 0) {
          if (
            ((!queryStatus
              || (queryStatus && queryStatus === "to-be-invoiced"))
              && invoice.status === "Draft")
            || (queryStatus
              && queryStatus === "issued"
              && invoice.status === "Issued")
            || (queryStatus
              && queryStatus === "disputed"
              && invoice.status === "Disputed")
            || (queryStatus
              && queryStatus === "approved"
              && invoice.status === "Approved")
          ) {
            this.job_parts.splice(index, 1, job_part)
          } else {
            this.job_parts.splice(index, 1)
          }
        }
      }
    },
    
    confirmPayment () {
      let notRequired = ["ni", "paye",]
      if (this.ir35 === false) {
        notRequired.push("ni_amount")
        notRequired.push("paye_amount")
        this.form.ni = false
        this.form.ni_amount = null
        this.form.paye = false
        this.form.paye_amount = null
      } else if (this.ir35 === true) {
        if ([false, "false",].includes(this.form.ni)) {
          notRequired.push("ni_amount")
        }
        if ([false, "false",].includes(this.form.paye)) {
          notRequired.push("paye_amount")
        }
      }

      this.formError = []
      this.Validate(this.form, notRequired)
      if (!this.formError.length) {
        this.$axios
          .$put(
            `/api/v1/practice/locum-invoices/${this.invoice_id}/paid`,
            this.form
          )
          .then(res => {
            let job_part = this.job_parts.find(
              item => item.id === res.data.locum_invoice.items[0].job_part.id
            )

            let index = this.job_parts.findIndex(
              item => item.id === job_part.id
            )

            if (index >= 0) {
              job_part.locum_invoice_item.locum_invoice.paid_at
                = res.data.locum_invoice.paid_at
              job_part.locum_invoice_item.locum_invoice.ni
                = res.data.locum_invoice.ni
              job_part.locum_invoice_item.locum_invoice.ni_amount
                = res.data.locum_invoice.ni_amount
              job_part.locum_invoice_item.locum_invoice.paye
                = res.data.locum_invoice.paye
              job_part.locum_invoice_item.locum_invoice.paye_amount
                = res.data.locum_invoice.paye_amount
              this.job_parts.splice(index, 1, job_part)
            }

            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: [`${res.message}`,],
            })

            this.payment_modal = false
            this.form.ni = false
            this.form.ni_amount = null
            this.form.paye = false
            this.form.paye_amount = null
          })
          .catch(err => {
            console.log("err", err.response || err)

            let message = null

            if (err.response) {
              if (
                err.response.status === 400
                && err.response.data.error_messages
              ) {
                this.formError = err.response.data.error_messages
              } else {
                message = err.response.data.message
              }
            } else if (err.request) {
              message = "Something weng wrong!"
            } else {
              message = err.message
            }

            if (message) {
              this.$store.commit("SET_NOTIFICATION", {
                enabled: true,
                status: "danger",
                text: [`${message}`,],
              })
            }
          })
      }
    },

    formAPaidByPractice () {
      if (!this.locumFormAIdToBePaid) {
        return
      }
      
      this.formError = []

      this.Validate({
        paid_at: this.locumFormAPaidAt,
      })

      if (!this.formError.length) {
        this.$axios.put(`/api/v1/practice/locum-form-as/${this.locumFormAIdToBePaid}/paid`, {
          paid_at: this.locumFormAPaidAt,
        }).then((response) => {
          const locumFormA = response.data.data.locum_form_a

          const jobPart = this.job_parts.find(jobPart => jobPart.locum_form_a_id === locumFormA.id)

          const index = this.job_parts.findIndex(jobPart => jobPart.locum_form_a_id === locumFormA.id)

          if (jobPart && index > -1) {
            jobPart.locum_form_a_paid_by_practice = locumFormA.paid_by_practice
            jobPart.locum_form_a_paid_by_practice_formatted = locumFormA.paid_by_practice_formatted
            jobPart.locum_form_a_paid_by_practice_at = locumFormA.paid_by_practice_at
            jobPart.locum_form_a_paid_by_practice_at_formatted = locumFormA.paid_by_practice_at_formatted

            this.job_parts.splice(index, 1, jobPart)
          }

          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`${response.data.message}`,],
          })

          this.locumFormAIdToBePaid = null
          this.locumFormAPaidAt = null
        }).catch((err) => {
          console.log("err", err.response || err)

          let message = null

          if (err.response) {
            if (err.response.data.error_messages && err.response.data.error_messages.length > 0) {
              this.formError = err.response.data.error_messages
            } else {
              message = err.response.data.message
            }
          } else if (err.request) {
            message = "Something weng wrong!"
          } else {
            message = err.message
          }

          if (message) {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "danger",
              text: [`${message}`,],
            })
          }
        })
      }
    },

    async sorted (order_by) {
      let orderBy = order_by.map(item => {
        let order = item.split(":")[1]
        let sorting = item.split(":")[0]
        switch (sorting) {
        case "practice.name":
          sorting = "practice_name"
          break
        default:
          sorting
        }
        return `${sorting}:${order}`
      })
      this.current_page = 1
      this.offset = 0
      this.order_by = orderBy
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
    },
    clearFilters () {
      this.offset = 0
      this.limit = 5
      this.order_by = []
      this.job_ir35 = null
      this.is_paid = null
      this.invoice_number = null
      this.job_part_number_includes = null
      this.filterJobParts()
    },
  },
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
