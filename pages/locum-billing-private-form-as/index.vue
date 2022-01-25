<template>
  <section class="relative">
    <LocumBillingPrivateInvoicesTabs />

    <transition name="fade" mode="out-in">
      <div v-if="initialLoading" class="relative flex w-full" style="min-height:80px">
        <AppLoading :loading="initialLoading" spinner />
      </div>

      <div v-if="!initialLoading">
        <AppButton
          v-if="showRefresh"
          :label="'Refresh'"
          @click="refreshInvoices"
        />

        <AppTable
          v-if="job_parts.length > 0"
          :total="total"
          :items="job_parts"
          :current-page="current_page"
          :per-page="limit"
          :columns="columns"
          :order-by="order_by"
          :loading="loading"
          :customWidth="800"
          @pagechanged="pagechanged"
          @limitchanged="limitchanged"
          @sorted="sorted"
        >
          <template v-slot:actions="slotProps">
            <div class="flex flex-col bg-white border rounded border-gray-500">
              <div
                v-if="slotProps.item.locum_form_a_id"
                class="rounded text-xs px-2  hover:bg-orange-300 cursor-pointer"
                @click="viewLocumFormAPdf(slotProps.item.locum_form_a_id)"
              >
                View Form A
              </div>

              <div
                v-if="slotProps.item.locum_form_a_id && !slotProps.item.locum_form_a_paid"
                class="rounded text-xs px-2  hover:bg-orange-300 cursor-pointer"
                @click="locumFormAIdToPay = slotProps.item.locum_form_a_id"
              >
                Mark as Paid
              </div>
            </div>
          </template>
        </AppTable>

        <div v-else class="flex justify-center">
          You do not have any NHS Pension Form A.
        </div>
      </div>
    </transition>

    <div v-if="locumFormAIdToPay" class="p-2">
      <div class="rounded-lg shadow-md px-4 py-8 md:px-8 payment-modal border w-5/6 md:w-1/3">
        <AppDate
          v-model="form.paid_at"
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
            @click="payPrivateLocumFormA"
          />

          <AppButton
            class="mx-1"
            :label="'Cancel'"
            :in-style="'padding:5px 10px'"
            @click="locumFormAIdToPay = null"
          />
        </div>
      </div>
    </div>

    <transition name="fade" mode="out-in">
      <nuxt-link
        v-if="locumFormAIdToPay"
        :to="{ name: 'locum-billing-private-form-as' }"
        :event="'click'"
        class="shield"
      />
    </transition>
  </section>
</template>

<script>
import LocumBillingPrivateInvoicesTabs from "@/components/LocumBilling/LocumBillingPrivateInvoicesTabs"
import AppDate from "@/components/Base/AppDate"
import AppButton from "@/components/Base/AppButton"
import AppTable from "@/components/Base/AppTable"
import AppLoading from "@/components/Base/AppLoading"

export default {
  transition: {
    name: "fade",
    mode: "out-in",
  },

  components: {
    LocumBillingPrivateInvoicesTabs,
    AppDate,
    AppButton,
    AppLoading,
    AppTable,
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
      limit: 15,
      order_by: [],

      form: {
        paid_at: null,
        ni: false,
        ni_amount: null,
        paye: false,
        paye_amount: null,
      },
      formError: [],

      delete_invoice_modal: false,
      generate_form_a_modal: false,
      generate_solo_form_modal: false,
      payment_modal: false,
      invoice_id: null,

      locumSoloFormIdToPay: null,
      locumFormAIdToPay: null,
    }
  },

  computed: {
    columns () {
      return [
        {
          name: "Practice / Surgery",
          dataIndex: "practice_name",
          class: "text-center",
          sortable: true,
        },
        {
          name: "Issued",
          dataIndex: "issued_at_in_gb_formatted",
          class: "text-center",
          sortable: true,
        },
        {
          name: "Invoice Number",
          dataIndex: "invoice_number",
          width: 130,
        },
        {
          name: "Job Part Number",
          dataIndex: "job_part_number",
          sortable: true,
          width: 130,
        },
        {
          name: "£ Amount",
          dataIndex: "job_part_gross_rate_formatted",
          class: "text-center",
          sortable: true,
          width: 130,
        },
        {
          name: "Paid At",
          dataIndex: "locum_form_a_paid_at_formatted",
          class: "text-center",
          width: 100,
        },
        {
          name: "Actions",
          dataIndex: "actions",
          class: 'dropdown',
          initialDropdown: 'View Form A',
          width: 120,
        },
      ]
    },
  },

  mounted () {
    this.current_page = 1
    this.showRefresh = false
    this.total = 0
    this.job_parts = []
    this.initialLoading = true
    this.getCountAndPrivateLocumFormAs().finally(() => {
      this.initialLoading = false
    })
  },

  methods: {
    payPrivateLocumFormA () {
      if (!this.locumFormAIdToPay) {
        return
      }

      this.$axios.put(`/api/v1/locum/locum-form-as/${this.locumFormAIdToPay}/paid`, {
        paid_at: this.form.paid_at,
      }).then((response) => {
        const jobPart = this.job_parts
          .find(jobPart => jobPart.locum_invoice_id === response.data.data.locum_form_a.locum_invoice_id)

        jobPart.locum_form_a_paid = 1

        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "success",
          text: [`${response.data.message}`,],
        })
      }).catch((err) => {
        console.log('err', err.response || err)

        let message = null

        if (err.response) {
          if (err.response.status === 400 && err.response.data.error_messages) {
            this.formError = err.response.data.error_messages
          } else {
            message = err.response.data.message
          }
        } else if (err.request) {
          message = 'Something went wrong!'
        } else {
          message = err.message
        }

        if (message) {
          this.$store.commit('SET_NOTIFICATION', {
            enabled: true,
            status: 'danger',
            text: [`${message}`,],
          })
        }
      }).finally(() => {
        this.locumFormAIdToPay = null
      })
    },

    viewLocumFormAPdf (locumFormAId) {
      window.open(`${process.env.API_URL}/api/v1/locum-form-a/${locumFormAId}/pdf`)
    },

    getCountAndPrivateLocumFormAs () {
      const params = {
        locum_status: ["Approved",],
        has_form_a: true,
        job_type: "Private",
        type: "Private",
      }

      return Promise.all([
        this.$axios.$get('/api/v1/locum/job-parts/count', {
          params: {
            ...params,
          },
        }),
        this.$axios.$get('/api/v1/locum/job-parts', {
          params: {
            ...params,
            offset: 0,
            limit: 15,
          },
        }),
      ])
        .then(([responseTotal, response,]) => {
          this.total = responseTotal.data.count

          let job_parts = response.data.job_parts

          this.job_parts = job_parts.map(jobPart => {
            let total = jobPart.locum_invoice_id
              ? jobPart.locum_invoice_item.total
              : jobPart.job.locum_detail_rate_type.name === "Hourly"
                ? jobPart.job.rate * jobPart.final_hours
                : (jobPart.job.rate / jobPart.job.total_hours)
                * jobPart.final_hours

            total
              = jobPart.locum_invoice_item
              && jobPart.locum_invoice_item.locum_invoice
              && jobPart.locum_invoice_item.locum_invoice.paid_at
                ? total
                  - jobPart.locum_invoice_item.locum_invoice.ni_amount
                  - jobPart.locum_invoice_item.locum_invoice.paye_amount
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
                jobPart.locum_status === "Approved"
                && jobPart.locum_invoice_item.locum_invoice.paid_at
                  ? "Yes"
                  : "No",
            }
          })
        })
        .catch(([errTotal, errJobParts,]) => {
          console.log(
            "err",
            errTotal.response || errTotal || errJobParts.response || errJobParts
          )
        })
    },

    getPrivateLocumFormAs () {
      return this.$axios
        .$get('/api/v1/locum/job-parts', {
          params: {
            locum_status: ["Approved",],
            nhs_claimable: true,
            ooh: false,
            job_type: "Private",
            type: "Private",
            order_by: this.order_by,
            offset: this.offset,
            limit: this.limit,
          },
        })
        .then(res => {
          let job_parts = res.data.job_parts

          this.job_parts = job_parts.map(jobPart => {
            let total = jobPart.locum_invoice_id
              ? jobPart.locum_invoice_item.total
              : jobPart.job.locum_detail_rate_type.name === "Hourly"
                ? jobPart.job.rate * jobPart.final_hours
                : (jobPart.job.rate / jobPart.job.total_hours)
                * jobPart.final_hours

            total
              = jobPart.locum_invoice_item
              && jobPart.locum_invoice_item.locum_invoice
              && jobPart.locum_invoice_item.locum_invoice.paid_at
                ? total
                  - jobPart.locum_invoice_item.locum_invoice.ni_amount
                  - jobPart.locum_invoice_item.locum_invoice.paye_amount
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
                jobPart.locum_status === "Approved"
                && jobPart.locum_invoice_item.locum_invoice.paid_at
                  ? "Yes"
                  : "No",
            }
          })
        })
        .catch(err => {
          console.log("err", err.response || err)
        })
    },

    async refreshInvoices () {
      this.$store.commit("billing/CLEAR_LOCUM_BILLING_NOTIFICATION")
      this.loading = true
      await this.getCountAndPrivateLocumFormAs()
      this.loading = false
      this.showRefresh = false
    },

    async sorted (order_by) {
      this.current_page = 1
      this.offset = 0
      this.order_by = order_by
      this.loading = true
      await this.getPrivateLocumFormAs()
      this.loading = false
    },

    async pagechanged (page) {
      this.current_page = page
      this.offset = this.limit * (page - 1)
      this.loading = true
      await this.getPrivateLocumFormAs()
      this.loading = false
    },

    async limitchanged (limit) {
      this.current_page = 1
      this.offset = 0
      this.limit = limit
      this.loading = true
      await this.getPrivateLocumFormAs()
      this.loading = false
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
