<template>
  <section class="relative">
    <div class="flex flex-row justify-start overflow-x-auto border-b border-gray-500 mb-4 pt-1">
      <nuxt-link
        :to="{ path: '/locum-billing/invoices', query: { ...$route.query, status: 'to-be-invoiced' } }"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('locum-billing-invoices') && (!$route.query.status || ($route.query.status && $route.query.status.toLowerCase() === 'to-be-invoiced')) ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >
        To be invoiced
      </nuxt-link>

      <nuxt-link
        :to="{ path: '/locum-billing/invoices', query: { ...$route.query, status: 'disputed' } }"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('locum-billing-invoices') && ($route.query.status && $route.query.status.toLowerCase() === 'disputed') ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >
        Disputed Invoices
      </nuxt-link>

      <nuxt-link
        :to="{ path: '/locum-billing/invoices', query: { ...$route.query, status: 'issued' } }"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('locum-billing-invoices') && ($route.query.status && $route.query.status.toLowerCase() === 'issued') ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >
        Invoiced
      </nuxt-link>

      <nuxt-link
        :to="{ path: '/locum-billing/invoices', query: { ...$route.query, status: 'approved' } }"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class=" $route.name.includes('locum-billing-invoices') && ($route.query.status && $route.query.status.toLowerCase() === 'approved') ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >
        Approved Invoices
      </nuxt-link>
      
      <nuxt-link
        v-if="$auth.user.locum_detail.profession.profession_category.name === 'GP'"
        :to="{ name: 'locum-billing-solo-forms' }"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name === 'locum-billing-solo-forms' ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >
        Solo Forms
      </nuxt-link>
      
      <nuxt-link
        v-if="$auth.user.locum_detail.profession.profession_category.name === 'GP'"
        :to="{ name: 'locum-billing-form-as' }"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name === 'locum-billing-form-as' ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >
        NHS Pensions Form A
      </nuxt-link>

      <nuxt-link
        v-if="$auth.user.locum_detail.profession.profession_category.name === 'GP' || hasFormB"
        :to="{ path: '/locum-billing/invoices', query: { ...$route.query, status: 'pension-form-b' } }"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('locum-billing-invoices') && ($route.query.status && $route.query.status.toLowerCase() === 'pension-form-b') ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >
        NHS Pensions Form B
      </nuxt-link>
    </div>

    <div
      v-if="$route.name.includes('locum-billing-invoices') && ($route.query.status && $route.query.status.toLowerCase() === 'pension-form-b')"
      class="flex flex-row justify-start overflow-x-auto"
    >
      <nuxt-link
        :to="{ name: 'locum-billing-invoices-form-b-create', query: { ...$route.query, status: 'pension-form-b' } }"
        class="default-btn rounded-md p-2 focus:outline-none transition-hover text-sm flex items-center button bg-sunglow hover:bg-sunglow-dark"
      >
        <div class="mx-1">
          <svgicon
            name="create-job"
            width="18"
            height="18"
            class="fill-current text-black"
          />
        </div>
        <div>
          Generate NHS Form B
        </div>
      </nuxt-link>
    </div>

    <AppFilter :enableSearch="false" v-if="(!job_parts.length && isFiltered) || (!initialLoading && job_parts.length > 0) || (initialLoading && isFiltered)">
      <template v-slot:extraButton>
        <AppButton
          v-if="showRefresh"
          :label="'Refresh'"
          customTheme="border"
          @click="refreshInvoices"
        />
      </template>
      <template v-slot:filter>
        <div class="w-32">
          <AppInput
            v-model="job_ir35"
            :wrapperClass="'px-1'"
            :type="'select'"
            :name="'job_ir35'"
            :placeholder="'Inside ir35'"
            :items="[{ label: 'All', value: '' }, { label: 'Yes', value: true }, { label: 'No', value: false }]"
            nolabel
            border
          />
        </div>

        <div v-if="$route.query.status && $route.query.status.toLowerCase() !== 'to-be-invoiced'" class="">
          <AppInput
            v-model="invoice_number"
            :wrapperClass="'px-1'"
            :type="'text'"
            :name="'invoice_number'"
            :label="'Invoice number'"
            nolabel
            border
          />
        </div>

        <div class="">
          <AppInput
            v-model="job_part_number_includes"
            :wrapperClass="'px-1'"
            :type="'text'"
            :name="'job_part_number_includes'"
            :label="'Job Part Number'"
            nolabel
            border
          />
        </div>

        <div v-if="$route.query.status && ['approved'].includes($route.query.status.toLowerCase())" class="w-32">
          <AppInput
            v-model="is_paid"
            :wrapperClass="'px-1'"
            :type="'select'"
            :name="'is_paid'"
            :placeholder="'Paid'"
            :items="[{ label: 'All', value: ''}, { label: 'Yes', value: true }, { label: 'No', value: false }]"
            nolabel
            border
          />
        </div>
        <AppButton
          class="mx-1"
          :label="'Apply'"
          @click="filterJobParts"
        />
        <AppButton
          :disabled="disabledClearFilter"
          :label="'Clear'"
          customTheme="border hover:bg-gray-200"
          @click="clearFilters"
        />
      </template>
    </AppFilter>

    <transition name="fade" mode="out-in">
      <div v-if="initialLoading" class="relative flex w-full" style="min-height:80px">
        <AppLoading :loading="initialLoading" spinner />
      </div>

      <div v-if="!initialLoading">
        <!-- <div class="flex items-center">
          <button  v-if="!['pension-form-b'].includes($route.query.status)" @click="filterModal = !filterModal" class="flex items-center justify-between text-sm p-1 border rounded mr-1">
            <p class="mx-2">Filter</p>
            <span class="mx-2"><svgicon name="caret-down" width="10" :style="filterModal ? 'transform: rotate(180deg)' : ''" /></span>
          </button>
          
          <transition name="fade">
          <div v-if="filterModal" class="md:px-1 flex w-full">
            <AppButton
              :disabled="disabledClearFilter"
              :label="'Clear'"
              :in-style="'padding:5px 14px;margin-bottom:0'"
              @click="clearFilters"
            />

            <AppButton
              class="mx-2"
              :label="'Search'"
              :in-style="'padding:5px 14px;margin-bottom:0'"
              @click="filterJobParts"
            />
          </div>
          </transition>
        </div>

        <AppButton
          v-if="showRefresh"
          :label="'Refresh'"
          :in-style="'padding:5px 14px;margin-bottom:0;font-size:14px;'"
          customTheme="border-2"
          @click="refreshInvoices"
        />

        <transition name="drop-down">
        <div class="flex flex-col md:flex-row items-start mt-2" v-if="filterModal" >
          <div class="md:px-1 w-full md:w-1/4">
            <AppInput
              v-model="job_ir35"
              :wrapperClass="'px-1'"
              :type="'select'"
              :name="'job_ir35'"
              :label="'Inside ir35'"
              :items="[{ label: 'All', value: null }, { label: 'Yes', value: true }, { label: 'No', value: false }]"
            />
          </div>

          <div
            v-if="$route.query.status && $route.query.status.toLowerCase() !== 'to-be-invoiced'"
            class="md:px-1 w-full md:w-1/4"
          >
            <AppInput
              v-model="invoice_number"
              :wrapperClass="'px-1'"
              :type="'text'"
              :name="'invoice_number'"
              :label="'Invoice number'"
            />
          </div>

          <div class="md:px-1 w-full md:w-1/4">
            <AppInput
              v-model="job_part_number_includes"
              :wrapperClass="'px-1'"
              :type="'text'"
              :name="'job_part_number_includes'"
              :label="'Job Part number'"
            />
          </div>

          <div
            v-if="$route.query.status && ['approved'].includes($route.query.status.toLowerCase())"
            class="md:px-1 w-full md:w-1/4"
          >
            <AppInput
              v-model="is_paid"
              :wrapperClass="'px-1'"
              :type="'select'"
              :name="'is_paid'"
              :label="'Paid'"
              :items="[{ label: 'All', value: null}, { label: 'Yes', value: true }, { label: 'No', value: false }]"
            />
          </div>
        </div>
        </transition> -->

        <template
          v-if="(!$route.query.status || ($route.query.status && $route.query.status !== 'pension-form-b'))"
        >
          <AppTable
            v-if="job_parts.length > 0"
            :total="jobPartCount"
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
              <div class="flex flex-col bg-white border rounded border-gray-500">
                <div
                  v-if="!slotProps.item.locum_invoice_id"
                  class="rounded text-xs px-2  hover:bg-orange-300 cursor-pointer"
                  @click="$router.push({ path: `/locum-billing/invoices/${slotProps.item.id}/create`, query: {...$route.query} })"
                >
                  Generate Invoice
                </div>

                <template
                  v-if="
                    slotProps.item.locum_invoice_id
                      && slotProps.item.locum_job_part_status !== 'Approved' && !['approved', 'issued'].includes($route.query.status)
                  "
                >
                  <div
                    class="rounded text-xs px-2  hover:bg-orange-300 cursor-pointer"
                    @click="$router.push({ path: `/locum-billing/invoices/${slotProps.item.locum_invoice_id}/edit`, query: {...$route.query} })"
                  >
                    Edit
                  </div>
                  <button
                    v-if="!$route.query.status || $route.query.status.toLowerCase() === 'to-be-invoiced'"
                    class="rounded text-xs px-2  hover:bg-orange-300 cursor-pointer text-left"
                    @click.stop.prevent="showDeleteInvoiceModal(slotProps.item.locum_invoice_id)"
                  >
                    Delete
                  </button>
                </template>

                <div
                  v-if="['approved', 'issued'].includes($route.query.status)"
                  class="rounded text-xs px-2  hover:bg-orange-300 cursor-pointer"
                  @click="$router.push({ path: `/locum-billing/invoices/${slotProps.item.locum_invoice_id}`, query: {...$route.query} })"
                >
                  View
                </div>
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
        </template>

        <template v-if="($route.query.status && $route.query.status === 'pension-form-b')">
          <AppTable
            v-if="locum_form_bs.length > 0"
            :total="jobPartCount"
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
              <div class="flex flex-col bg-white border rounded border-gray-500">
                <div
                  class="rounded text-xs px-2  hover:bg-orange-300 cursor-pointer"
                  @click="openFormBPdf(slotProps.item.id, 'form-b')"
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
      :label="'Proceed to delete this draft?'"
      :confirm-label="'Yes'"
      :cancel-label="'Cancel'"
      :modal="delete_invoice_modal"
      @confirm="deleteInvoice"
      @cancel="delete_invoice_modal = false, invoice_id = null"
    />

    <transition name="fade" mode="out-in">
      <nuxt-link
        v-if="
          [
            'locum-billing-invoices-id',
            'locum-billing-invoices-id-create',
            'locum-billing-invoices-id-edit',
            'locum-billing-invoices-form-b-create',
          ].includes($route.name)
            || delete_invoice_modal
        "
        :to="{ name: 'locum-billing-invoices', query: {...$route.query}}"
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
import AppButton from "@/components/Base/AppButton"
import AppConfirmationModal from "@/components/Base/AppConfirmationModal"
import AppTable from "@/components/Base/AppTable"
import AppInput from "@/components/Base/AppInput"
import AppLoading from "@/components/Base/AppLoading"
import AppFilter from "@/components/Base/AppFilter"
export default {
  transition: {
    name: "fade",
    mode: "out-in",
  },

  components: {
    AppInput,
    AppLoading,
    AppButton,
    AppConfirmationModal,
    AppTable,
    AppFilter
  },

  data () {
    return {
      hasFormA: false,
      hasFormB: false,

      initialLoading: true,
      loading: false,
      filterModal: false,
      isFiltered: false,
      jobPartCount: 0,
      job_parts: [],
      locum_form_bs: [],

      showRefresh: false,
      current_page: 1,

      offset: 0,
      limit: 15,
      order_by: [],
      job_ir35: null,
      invoice_number: null,
      job_part_number_includes: null,
      is_paid: null,

      form_bs_columns: [
        {
          name: "Type",
          dataIndex: "type",
        },
        {
          name: "Practice",
          dataIndex: "locum_form_a_practice_names",
        },
        {
          name: "Date Created",
          dataIndex: "date_created_in_gb_formatted",
          class: "text-center",
        },
        {
          name: "Actions",
          dataIndex: "actions",
          class: "text-center",
          width: 130,
        },
      ],

      delete_invoice_modal: false,
      invoice_id: null,
    }
  },

  computed: {
    ir35 () {
      if (!this.invoice_id) {
        return false
      }
      let selectedInvoice = this.job_parts.find(
        item => item.locum_invoice_id === this.invoice_id
      )
      return selectedInvoice.job_ir35 ? selectedInvoice.job_ir35 : false
    },

    locumProfessionCategoryName () {
      return this.$auth.loggedIn && this.$auth.user
        ? this.$auth.user.profession_category_name
        : null
    },

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
          dataIndex: "locum_invoice_invoice_number",
          sortable: true,
          width: 130
        })
      }

      columns.push(
        {
          name: "Job Part Number",
          dataIndex: "job_part_number",
          sortable: true,
          width: 150,
        },
        {
          name: "Job Title",
          dataIndex: "title",
          sortable: true,
        },
        {
          name: "£ Amount",
          dataIndex: "job_part_gross_rate_formatted",
          class: "text-center",
          sortable: true,
          width: 130,
        },
      )

      if (this.locumProfessionCategoryName === 'GP') {
        columns.push(
          {
            name: "OOH",
            dataIndex: "ooh",
            class: "text-center",
            sortable: true,
            width: 80,
          },
          {
            name: "NHS Claimable",
            dataIndex: "nhs_claimable_formatted",
            class: "text-center",
            sortable: true,
            width: 130,
          }
        )
      }

      if (["approved",].includes(queryStatus)) {
        columns.push({
          name: "Paid Invoice",
          dataIndex: "locum_invoice_paid_formatted",
          class: "text-center",
          sortable: true,
          width: 100,
        })
      }

      if (["approved",].includes(queryStatus)) {
        columns.push({
          name: "Paid At",
          dataIndex: "locum_invoice_paid_at_in_gb_formatted",
          class: "text-center",
          sortable: true,
          width: 120,
        })
      }

      if (queryStatus === "approved") {
        columns.push({
          name: "Approved At",
          dataIndex: "approved_at_in_gb_formatted",
          class: "text-center",
          sortable: true,
          width: 150,
        })
      } else if (queryStatus === "to-be-invoiced") {
        columns.push({
          name: "Completed At",
          dataIndex: "completed_at_in_gb_formatted",
          class: "text-center",
          sortable: true,
          width: 150,
        })
      } else {
        columns.push({
          name: "Issued",
          dataIndex: "locum_invoice_issued_at_in_gb_formatted",
          class: "text-center",
          sortable: true,
          width: 150,
        })
      }

      columns.push({
        name: "Actions",
        dataIndex: "actions",
        class: queryStatus !== 'to-be-invoiced' ? "text-center" : 'dropdown',
        width: queryStatus !== 'to-be-invoiced' ? 100 : 150,
      })

      return columns
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
      case "pension-form-b":
        str = "You do not have any nhs form b."
        break
      default:
        str = "You do not have any completed job parts."
      }
      return str
    },

    disabledClearFilter () {
      return !this.is_paid
        && !this.job_ir35
        && !this.invoice_number
        && !this.job_part_number_includes
    },
  },

  watch: {
    async "$route.query" (newValue, oldValue) {
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
        await this.getInvoiceableJobPartsPromiseAll()
        this.initialLoading = false
      }
    },
  },

  mounted () {
    this.$socket.on("Locum Notification Locum Invoice Created", this.getLocumInvoiceRealTime)
    this.$socket.on("Locum Notification Locum Invoice Paid", this.getLocumInvoiceRealTime)
    this.$socket.on("Locum Notification Locum Invoice Updated", this.getLocumInvoiceRealTime)

    this.current_page = 1
    this.filterModal = false
    this.showRefresh = false
    this.jobPartCount = 0
    this.job_parts = []
    this.clearFilters()
    this.isFiltered = false
    this.initialLoading = true
    this.getInvoiceableJobPartsPromiseAll().finally(() => {
      this.initialLoading = false
    })
  },

  destroyed () {
    this.$socket.removeListener("Locum Notification Locum Invoice Created", this.getLocumInvoiceRealTime)
    this.$socket.removeListener("Locum Notification Locum Invoice Paid", this.getLocumInvoiceRealTime)
    this.$socket.removeListener("Locum Notification Locum Invoice Updated", this.getLocumInvoiceRealTime)
  },

  methods: {
    openFormBPdf (locumFormBId) {
      window.open(`${process.env.API_URL}/api/v1/locum-form-b/${locumFormBId}/pdf`)
    },

    getInvoiceableJobPartsPromiseAll () {
      let url = `/api/v2/locum/locum-user-job-parts`

      let queryStatus = this.$route.query.status

      let locumJobPartStatus = null
      let locumInvoiceStatus = "To Be Invoiced"

      switch (queryStatus && queryStatus.toLowerCase()) {
      case "to-be-invoiced":
        locumJobPartStatus = ["Completed", "Cancelled",]
        locumInvoiceStatus = "To Be Invoiced"
        break
      case "disputed":
        locumJobPartStatus = ["Completed", "Cancelled",]
        locumInvoiceStatus = "Disputed"
        break
      case "issued":
        locumJobPartStatus = ["Completed", "Cancelled",]
        locumInvoiceStatus = "Invoiced"
        break
      case "approved":
        locumJobPartStatus = "Approved"
        locumInvoiceStatus = "Approved"
        break
      case "pension-form-b":
        url = `/api/v1/locum/locum-invoices-form-b`
        break
      default:
        locumJobPartStatus = ["Completed", "Cancelled",]
        locumInvoiceStatus = "To Be Invoiced"
      }

      const params = {
        locum_job_part_status: locumJobPartStatus,
        locum_invoiceable: true,
        locum_invoice_status: locumInvoiceStatus,
        type: "Platform",
        ir35: this.job_ir35,
        locum_invoice_paid: this.is_paid,
        locum_invoice_number_includes: this.invoice_number,
        job_part_number_includes: this.job_part_number_includes,
      }

      return Promise.all([
        this.$axios.$get(`${url}/count`, {
          params: {
            ...params,
          },
        }),
        this.$axios.$get(`${url}`, {
          params: {
            ...params,
            offset: 0,
            limit: 15,
          },
        }),
      ])
        .then(([responseTotal, response,]) => {
          this.jobPartCount = responseTotal.data.count
          if (response.data && response.data.job_parts) {
            let job_parts = response.data.job_parts

            this.job_parts = job_parts.map(jobPart => {
              return {
                ...jobPart,
              }
            })
          } else if (response.data && response.data.locum_form_bs) {
            this.locum_form_bs = response.data.locum_form_bs.map(item => {
              return {
                ...item,
                practice: item.forms[0].practice_name,
              }
            })
          }
        })
        .catch(([errTotal, err,]) => {
          console.log(
            "err",
            errTotal.response || errTotal || err.response || err
          )
          throw err
        })
    },

    async filterJobParts () {
      this.current_page = 1
      this.offset = 0
      this.limit = 15
      this.initialLoading = true
      this.isFiltered = true
      await this.getInvoiceableJobPartsPromiseAll()
      this.initialLoading = false
      this.filterModal = false
    },

    getJobParts () {
      let url = `/api/v2/locum/locum-user-job-parts`

      let queryStatus = this.$route.query.status

      let locumJobPartStatus = null
      let locumInvoiceStatus = "To Be Invoiced"

      switch (queryStatus && queryStatus.toLowerCase()) {
      case "to-be-invoiced":
        locumJobPartStatus = ["Completed", "Cancelled",]
        locumInvoiceStatus = "To Be Invoiced"
        break
      case "disputed":
        locumJobPartStatus = ["Completed", "Cancelled",]
        locumInvoiceStatus = "Disputed"
        break
      case "issued":
        locumJobPartStatus = ["Completed", "Cancelled",]
        locumInvoiceStatus = "Invoiced"
        break
      case "approved":
        locumJobPartStatus = "Approved"
        locumInvoiceStatus = "Approved"
        break
      case "pension-form-b":
        url = `/api/v1/locum/locum-invoices-form-b`
        break
      default:
        locumJobPartStatus = ["Completed", "Cancelled",]
        locumInvoiceStatus = "To Be Invoiced"
      }

      const params = {
        locum_job_part_status: locumJobPartStatus,
        locum_invoiceable: true,
        locum_invoice_status: locumInvoiceStatus,
        type: "Platform",
        ir35: this.job_ir35,
        locum_invoice_paid: this.is_paid,
        locum_invoice_number_includes: this.invoice_number,
        job_part_number_includes: this.job_part_number_includes,
      }
      
      return this.$axios
        .$get(`${url}`, {
          params: {
            ...params,
            order_by: this.order_by,
            offset: this.offset,
            limit: this.limit,
          },
        })
        .then(res => {
          if (res.data && res.data.job_parts) {
            let job_parts = res.data.job_parts

            this.job_parts = job_parts.map(jobPart => {
              return {
                ...jobPart,
              }
            })
          } else if (res.data && res.data.locum_form_bs) {
            this.locum_form_bs = res.data.locum_form_bs.map(item => {
              return {
                ...item,
                practice: item.forms[0].practice_name,
              }
            })
          }
        })
        .catch(err => {
          console.log("err", err.response || err)
        })
    },

    async refreshInvoices () {
      this.loading = true
      this.current_page = 1
      this.offset = 0
      this.limit = 15
      await this.getInvoiceableJobPartsPromiseAll()
      this.loading = false
      this.showRefresh = false
    },

    getLocumInvoiceRealTime ({ id, }) {
      if (!id) {
        return
      }
      this.showRefresh = true
    },

    showDeleteInvoiceModal (id) {
      this.invoice_id = id
      this.delete_invoice_modal = true
    },

    deleteInvoice () {
      this.$axios
        .$delete(`/api/v1/locum/locum-invoices/${this.invoice_id}`)
        .then(res => {
          let job_part = this.job_parts.find(item => {
            return item.locum_invoice_id === this.invoice_id
          })
          let index = this.job_parts.findIndex(item => {
            return item.locum_invoice_id === this.invoice_id
          })
          let queryStatus = this.$route.query.status

          if (
            !queryStatus
            || (queryStatus && queryStatus.toLowerCase() === "to-be-invoiced")
          ) {
            job_part.locum_invoice_id = null
          } else if (
            queryStatus
            && ["disputed", "issued",].includes(queryStatus.toLowerCase())
          ) {
            this.job_parts.splice(index, 1)
          }

          this.refreshInvoices()

          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`${res.message}`,],
          })
        })
        .catch(err => {
          console.log("err", err.response || err)
          if (err.response.data.message) {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: [`${err.response.data.message}`,],
            })
          }
          throw err
        })
        .finally(() => {
          this.delete_invoice_modal = false
        })
    },
    
    async createFormB () {
      this.loading = true
      await this.getJobParts()
      this.loading = false
    },

    async createInvoice () {
      this.loading = true
      await this.getJobParts()
      this.loading = false
    },

    async updateInvoice () {
      this.loading = true
      await this.getJobParts()
      this.loading = false
    },

    async sorted (order_by) {
      let orderBy = order_by.map(item => {
        let order = item.split(":")[1]
        let sorting = item.split(":")[0]
        switch (sorting) {
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
      this.limit = 15
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
</style>
