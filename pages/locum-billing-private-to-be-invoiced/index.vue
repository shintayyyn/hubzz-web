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
                v-if="!slotProps.item.locum_invoice_id"
                class="rounded text-xs px-2  hover:bg-orange-300 cursor-pointer"
                @click="$router.push({ name: 'locum-billing-private-invoices-jobPartId-create', params: { jobPartId: slotProps.item.id } })"
              >
                Generate Invoice
              </div>
            </div>
          </template>
        </AppTable>

        <div v-else class="flex justify-center">
          You do not have any completed job parts.
        </div>
      </div>
    </transition>
  </section>
</template>

<script>
import LocumBillingPrivateInvoicesTabs from "@/components/LocumBilling/LocumBillingPrivateInvoicesTabs"
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

      invoice_id: null,
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
          name: "Job Part Number",
          dataIndex: "job_part_number",
          sortable: true,
          width: 130,
        },
        {
          name: "£ Rate",
          dataIndex: "job_part_rate_ranged_formatted",
          class: "text-center",
          sortable: true,
          width: 130,
        },
        {
          name: "Rate Type",
          dataIndex: "job_part_rate_type_names_formatted",
          sortable: true,
          class: "text-center",
          width: 170,
        },
        {
          name: "£ Amount",
          dataIndex: "job_part_gross_rate_formatted",
          class: "text-center",
          sortable: true,
          width: 130,
        },
        {
          name: "Dates",
          dataIndex: "dates_formatted",
          class: "text-center",
          sortable: true,
          width: 220,
        },
        {
          name: "Time",
          dataIndex: "time_formatted",
          class: "text-center",
          sortable: true,
          width: 150,
        },
        {
          name: "Actions",
          dataIndex: "actions",
          class: "text-center",
          initialDropdown: 'Edit',
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
    this.getJobPartsPromiseAll().finally(() => {
      this.initialLoading = false
    })
  },

  methods: {

    getJobPartsPromiseAll () {
      let url = `/api/v1/locum/job-parts`
      let locum_status = []
      let has_solo_form
      let has_form_a

      locum_status = ["Completed", "Private",]

      return Promise.all([
        this.$axios.$get(`${url}/count`, {
          params: {
            locum_status,
            has_solo_form,
            has_form_a,
            job_type: "Private",
            type: "Private",
          },
        }),
        this.$axios.$get(`${url}`, {
          params: {
            locum_status,
            has_solo_form,
            has_form_a,
            job_type: "Private",
            type: "Private",
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

    getJobParts () {
      let url = `/api/v1/locum/job-parts`
      let locum_status = []
      let nhs_claimable
      let ooh

      locum_status = ["Completed", "Private",]

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
      await this.getJobPartsPromiseAll()
      this.loading = false
      this.showRefresh = false
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
