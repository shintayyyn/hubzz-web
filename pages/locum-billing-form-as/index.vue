<template>
  <section class="relative">
    <div class="flex flex-row justify-start overflow-x-auto pb-3">
      <nuxt-link
        :to="{ path: '/locum-billing/invoices', query: { ...$route.query, status: 'to-be-invoiced' } }"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('locum-billing-invoices') && (!$route.query.status || ($route.query.status && $route.query.status.toLowerCase() === 'to-be-invoiced')) ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >
        To be invoiced
      </nuxt-link>

      <nuxt-link
        :to="{ path: '/locum-billing/invoices', query: { ...$route.query, status: 'disputed' } }"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('locum-billing-invoices') && ($route.query.status && $route.query.status.toLowerCase() === 'disputed') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >
        Disputed Invoices
      </nuxt-link>

      <nuxt-link
        :to="{ path: '/locum-billing/invoices', query: { ...$route.query, status: 'issued' } }"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('locum-billing-invoices') && ($route.query.status && $route.query.status.toLowerCase() === 'issued') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >
        Invoiced
      </nuxt-link>

      <nuxt-link
        :to="{ path: '/locum-billing/invoices', query: { ...$route.query, status: 'approved' } }"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class=" $route.name.includes('locum-billing-invoices') && ($route.query.status && $route.query.status.toLowerCase() === 'approved') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >
        Approved Invoices
      </nuxt-link>

      <nuxt-link
        v-if="$auth.user.locum_detail.profession.profession_category.name === 'GP'"
        :to="{ path: '/locum-billing/invoices', query: { ...$route.query, status: 'solo-form' } }"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class=" $route.name.includes('locum-billing-invoices') && ($route.query.status && $route.query.status.toLowerCase() === 'solo-form') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >
        Solo Forms
      </nuxt-link>

      <nuxt-link
        v-if="$auth.user.locum_detail.profession.profession_category.name === 'GP'"
        :to="{ path: '/locum-billing/invoices', query: { ...$route.query, status: 'pension-form-a' } }"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class=" $route.name.includes('locum-billing-invoices') && ($route.query.status && $route.query.status.toLowerCase() === 'pension-form-a') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >
        NHS Pensions Form A (OLD)
      </nuxt-link>
      
      <nuxt-link
        v-if="$auth.user.locum_detail.profession.profession_category.name === 'GP'"
        :to="{ name: 'locum-billing-form-as' }"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name === 'locum-billing-form-as' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >
        NHS Pensions Form A
      </nuxt-link>

      <nuxt-link
        v-if="$auth.user.locum_detail.profession.profession_category.name === 'GP'"
        :to="{ path: '/locum-billing/invoices', query: { ...$route.query, status: 'pension-form-b' } }"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('locum-billing-invoices') && ($route.query.status && $route.query.status.toLowerCase() === 'pension-form-b') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >
        NHS Pensions Form B
      </nuxt-link>
    </div>

    <transition name="fade" mode="out-in">
      <div v-if="initialLoading" class="relative flex w-full" style="min-height:80px">
        <AppLoading :loading="initialLoading" spinner />
      </div>
    </transition>

    <transition name="fade" mode="out-in">
      <div v-if="!initialLoading">
        <AppButton
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

          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
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

          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
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
          v-if="locumFormAs.length > 0"
          :total="locumFormAsCount"
          :items="locumFormAs"
          :current-page="currentPage"
          :per-page="limit"
          :columns="columns"
          :order-by="order_by"
          :loading="loading"
          @pagechanged="pagechanged"
          @limitchanged="limitchanged"
          @sorted="sorted"
        >
          <template v-slot:actions="slotProps">
            <div class="flex flex-wrap justify-center">
              <div
                class="my-1 py-2 px-3 bg-yellow-500 hover:bg-yellow-400 font-bold rounded-lg focus:outline-none cursor-pointer"
                @click="viewLocumFormA(slotProps.item.locum_form_a_id)"
              >
                View Form A
              </div>

              <div
                v-if="!slotProps.item.locum_form_a_sent_to_practice"
                class="my-1 py-2 px-3 font-bold rounded-lg focus:outline-none"
                :class="
                  slotProps.item.locum_form_a_sent_to_practice
                    ? 'bg-gray-600 text-white cursor-not-allowed'
                    : 'bg-yellow-500 hover:bg-yellow-400 cursor-pointer'
                "
                @click="locumInvoiceIdToSend = slotProps.item.locum_invoice_id"
              >
                Send Form to Practice
              </div>

              <div
                v-if="slotProps.item.locum_form_a_sent_to_practice && !slotProps.item.locum_form_a_paid"
                class="my-1 py-2 px-3 bg-yellow-500 hover:bg-yellow-400 font-bold rounded-lg focus:outline-none cursor-pointer"
                @click.stop.prevent="form.paid_at = null, locumFormAIdToPay = slotProps.item.locum_form_a_id"
              >
                Mark as Paid
              </div>
            </div>
          </template>
        </AppTable>

        <div v-if="!locumFormAs.length && !isFiltered" class="flex justify-center">
          You do not have any nhs form a.
        </div>

        <div v-if="!locumFormAs.length && isFiltered" class="flex justify-center py-4">
          No nhs form a found.
        </div>
      </div>
    </transition>

    <div v-if="locumFormAIdToPay" class="p-2">
      <div class="rounded-lg shadow-md px-4 py-8 md:px-8 payment-modal border w-5/6 md:w-1/3">
        <AppDate
          v-model="form.paid_at"
          :name="'paid_at'"
          :label="'Payment made on'"
          :error="formError.find(formError => formError.field === 'paid_at')"
          is-before
        />

        <div class="flex flex-row flex-no-wrap justify-center">
          <AppButton class="mx-1" :label="'Save'" :in-style="'padding:5px 10px'" @click="payFormA" />

          <AppButton
            class="mx-1"
            :label="'Cancel'"
            :in-style="'padding:5px 10px'"
            @click="locumFormAIdToPay = null"
          />
        </div>
      </div>
    </div>

    <AppConfirmationModal
      :label="'Send this Form A to Practice?'"
      :confirm-label="'Yes'"
      :cancel-label="'Cancel'"
      :modal="locumInvoiceIdToSend"
      @confirm="sendForm"
      @cancel="locumInvoiceIdToSend = null"
    />

    <transition name="fade" mode="out-in">
      <nuxt-link
        v-if="locumFormAIdToPay"
        :to="{ name: 'locum-billing-form-as' }"
        class="shield"
        @click.native="locumFormAIdToPay = null"
      />
    </transition>

    <nuxt-child />
  </section>
</template>

<script>
import AppButton from "@/components/Base/AppButton"
import AppConfirmationModal from "@/components/Base/AppConfirmationModal"
import AppTable from "@/components/Base/AppTable"
import AppInput from "@/components/Base/AppInput"
import AppDate from "@/components/Base/AppDate"
import AppLoading from "@/components/Base/AppLoading"
export default {
  transition: {
    name: "fade",
    mode: "out-in",
  },

  components: {
    AppInput,
    AppDate,
    AppLoading,
    AppButton,
    AppConfirmationModal,
    AppTable,
  },

  data () {
    return {
      initialLoading: true,
      loading: false,

      filterModal: false,
      isFiltered: false,

      locumFormAsCount: 0,
      locumFormAs: [],

      showRefresh: false,
      currentPage: 1,

      offset: 0,
      limit: 5,
      order_by: [],

      job_ir35: null,
      invoice_number: null,
      job_part_number_includes: null,
      is_paid: null,

      locumFormAIdToPay: null,

      generate_form_a_modal: false,

      locumInvoiceIdToSend: null,

      form: {
        paid_at: null,
      },

      formError: [],
    }
  },

  computed: {
    columns () {
      return [
        {
          name: 'Practice / Surgery',
          dataIndex: 'practice_name',
          class: 'text-center',
          sortable: true,
        },
        {
          name: 'Job Part Number',
          dataIndex: 'job_part_number',
          sortable: true,
        },
        {
          name: 'Job Title',
          dataIndex: 'job_title',
          sortable: true,
        },
        {
          name: '£ Amount',
          dataIndex: 'job_part_gross_rate_formatted',
          class: 'text-center',
          sortable: true,
        },
        {
          name: 'OOH',
          dataIndex: 'ooh',
          class: 'text-center',
          sortable: true,
        },
        {
          name: 'NHS Claimable',
          dataIndex: 'nhs_claimable_formatted',
          class: 'text-center',
          sortable: true,
        },
        {
          name: 'Paid By Practice At',
          dataIndex: 'locum_form_a_paid_by_practice_at_formatted',
          class: 'text-center',
        },
        {
          name: 'Paid By Locum At',
          dataIndex: 'locum_form_a_paid_at_formatted',
          class: 'text-center',
        },
        {
          name: 'Approved At',
          dataIndex: 'approved_at_in_gb_formatted',
          class: 'text-center',
          sortable: true,
        },
        {
          name: 'Actions',
          dataIndex: 'actions',
          class: 'text-center',
        },
      ]
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

  mounted () {
    this.$socket.on('Locum Notification Locum Form A Paid', this.showRefreshLocumFormAs)
    this.$socket.on('Locum Notification Locum A Paid By Practice', this.showRefreshLocumFormAs)
    this.$socket.on('Locum Notification Locum A Sent To Practice', this.showRefreshLocumFormAs)

    this.filterModal = false
    this.showRefresh = false
    this.clearFilters()
    this.initialLoading = true
    this.getJobPartsPromiseAll().finally(() => {
      this.initialLoading = false
    })
  },

  destroyed () {
    this.$socket.removeListener('Locum Notification Locum Form A Paid', this.showRefreshLocumFormAs)
    this.$socket.removeListener('Locum Notification Locum A Paid By Practice', this.showRefreshLocumFormAs)
    this.$socket.removeListener('Locum Notification Locum A Sent To Practice', this.showRefreshLocumFormAs)
  },

  methods: {
    showRefreshLocumFormAs () {
      this.showRefresh = true
    },
    
    sendForm () {
      this.$axios
        .$put(
          `/api/v1/locum/locum-invoices-form-a/${this.locumInvoiceIdToSend}/send-to-practice`
        )
        .then(res => {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`${res.message}`,],
          })
          this.locumInvoiceIdToSend = null

          const updatedFormA = this.locumFormAs.find(
            jobPart =>
              jobPart.locum_invoice_id
              === res.data.locum_form_a.locum_invoice_id
          )

          if (updatedFormA) {
            updatedFormA.locum_form_a_sent_to_practice = true
          }
        })
    },

    viewLocumFormA (locumFormAId) {
      window.open(`${process.env.API_URL}/api/v1/locum-form-a/${locumFormAId}/pdf`)
    },

    getJobPartsPromiseAll () {
      return Promise.all([
        this.$axios.$get('/api/v1/locum/job-parts/count', {
          params: {
            invoice_status: 'Invoiced',
            locum_status: 'Approved',
            locum_invoiceable: true,
            nhs_claimable: true,
            ooh: false,
            generate_form: true,
            job_type: "Platform",
            type: "Platform",
            job_ir35: this.job_ir35,
            is_paid: this.is_paid,
            invoice_number: this.invoice_number,
            job_part_number_includes: this.job_part_number_includes,
          },
        }),
        this.$axios.$get('/api/v1/locum/job-parts', {
          params: {
            invoice_status: 'Invoiced',
            locum_status: 'Approved',
            locum_invoiceable: true,
            nhs_claimable: true,
            ooh: false,
            generate_form: true,
            job_type: "Platform",
            type: "Platform",
            job_ir35: this.job_ir35,
            is_paid: this.is_paid,
            invoice_number: this.invoice_number,
            job_part_number_includes: this.job_part_number_includes,
            offset: 0,
            limit: 5,
          },
        }),
      ])
        .then(([responseTotal, response,]) => {
          this.locumFormAsCount = responseTotal.data.count
          this.locumFormAs = response.data.job_parts
        })
    },

    async filterJobParts () {
      this.currentPage = 1
      this.offset = 0
      this.limit = 5
      this.initialLoading = true
      this.isFiltered = true
      await this.getJobPartsPromiseAll()
      this.initialLoading = false
      this.filterModal = false
    },

    getJobParts () {
      let invoice_status = []
      let locum_status = []
      let locum_invoiceable
      let nhs_claimable
      let ooh
      let sent_to_locum
      let generate_form

      invoice_status.push("Invoiced")
      locum_status.push("Approved")
      locum_invoiceable = true
      nhs_claimable = true
      ooh = false
      generate_form = true

      return this.$axios
        .$get('/api/v1/locum/job-parts', {
          params: {
            invoice_status,
            locum_status,
            locum_invoiceable,
            nhs_claimable,
            ooh,
            sent_to_locum,
            generate_form,
            job_type: "Platform",
            type: "Platform",
            offset: this.offset,
            limit: this.limit,
            job_ir35: this.job_ir35,
            is_paid: this.is_paid,
            invoice_number: this.invoice_number,
            job_part_number_includes: this.job_part_number_includes,
            order_by: this.order_by,
          },
        })
        .then(res => {
          this.locumFormAs = res.data.job_parts
        })
        .catch(err => {
          console.log("err", err.response || err)
        })
    },

    async refreshInvoices () {
      this.loading = true
      this.currentPage = 1
      this.offset = 0
      this.limit = 5
      await this.getJobPartsPromiseAll()
      this.loading = false
      this.showRefresh = false
    },

    payFormA () {
      this.$axios
        .put(`/api/v1/locum/locum-form-as/${this.locumFormAIdToPay}/paid`, this.form)
        .then((response) => {
          const locumFormA = response.data.data.locum_form_a

          let jobPart = this.locumFormAs.find(jobPart => jobPart.locum_form_a_id === locumFormA.id)

          if (jobPart) {
            jobPart.locum_form_a_paid = locumFormA.paid
            jobPart.locum_form_a_paid_formatted = locumFormA.paid_formatted
            jobPart.locum_form_a_paid_at = locumFormA.paid_at
            jobPart.locum_form_a_paid_at = locumFormA.paid_at_formatted
          }

          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`${response.data.message}`,],
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
          this.locumFormAIdToPay = null
        })
    },
    
    async sorted (order_by) {
      this.currentPage = 1
      this.offset = 0
      this.order_by = order_by
      this.loading = true
      await this.getJobParts()
      this.loading = false
    },

    async pagechanged (page) {
      this.currentPage = page
      this.offset = this.limit * (page - 1)
      this.loading = true
      await this.getJobParts()
      this.loading = false
    },

    async limitchanged (limit) {
      this.currentPage = 1
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
