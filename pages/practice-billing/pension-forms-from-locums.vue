<template>
  <section class="relative">
    <transition name="fade" mode="out-in">
      <div v-if="initialLoading" class="relative flex w-full" style="min-height:80px">
        <AppLoading :loading="initialLoading" spinner />
      </div>
      <div v-if="!initialLoading">
        <AppButton
          v-if="showRefresh"
          :label="'Refresh'"
          :inStyle="'padding:5px 14px;margin-bottom:5px;font-size:14px;'"
          @click="refreshInvoices"
        />
        <AppTable
          v-if="job_parts.length > 0"
          :total="total"
          :items="job_parts"
          :loading="loading"
          :currentPage="current_page"
          :perPage="limit"
          :columns="columns"
          :orderBy="order_by"
          @pagechanged="pagechanged"
          @limitchanged="limitchanged"
          @sorted="sorted"
        >
          <template v-slot:actions="slotProps">
            <div class="flex flex-wrap justify-center">
              <div
                class="my-1 p-2 bg-yellow-500 hover:bg-yellow-400 font-bold rounded-lg focus:outline-none cursor-pointer"
                @click="viewAsPdf(slotProps.item.locum_form_a_id, 'form-a')"
              >
                View Form A
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

        <transition name="fade" mode="out-in">
          <nuxt-link
            v-if="['practice-billing-index-id', 'practice-billing-index-id-edit'].includes($route.name)"
            :to="{ name: 'practice-billing-index', query: {...$route.query}}"
            class="shield"
          />
        </transition>
        <nuxt-child @updateInvoice="updateInvoice" />
      </div>
    </transition>
  </section>
</template>

<script>
import AppTable from "@/components/Base/AppTable"
import AppButton from "@/components/Base/AppButton"
import AppLoading from "@/components/Base/AppLoading"

export default {
  transition: {
    name: "fade",
    mode: "out-in",
  },
  components: {
    AppTable,
    AppButton,
    AppLoading,
  },
  data () {
    return {
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
    }
  },
  computed: {
    columns () {
      let columns = []
      // let queryStatus = this.$route.query.status
      //   ? this.$route.query.status.toLowerCase()
      //   : "to-be-invoiced"

      columns.push(
        {
          name: "Practice / Surgery",
          dataIndex: "practice_name",
          class: "text-center",
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
        },
        {
          name: "Job Number",
          dataIndex: "job_part_number",
        },
        {
          name: "£ Amount",
          dataIndex: "total_amount",
          class: "text-center currency",
          sortable: true,
        },
        {
          name: "NHS Claimable",
          dataIndex: "nhs_claimable",
          class: "text-center",
        },
        {
          name: "Locum",
          dataIndex: "locum_first_name",
          class: "text-center",
        },
        {
          name: "Actions",
          dataIndex: "actions",
          class: "text-center",
        }
      )
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
      default:
        str = "You do not have any completed job parts."
      }
      return str
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
        this.total = 0
        this.job_parts = []
        this.clearFilters()
        this.isFiltered = false
        this.initialLoading = true
        await this.getJobPartsPromiseAll()
        this.initialLoading = false
      }
    },
  },

  async asyncData ({ app, error, }) {
    try {
      let [total, job_parts,] = await Promise.all([
        app.$axios
          .$get(`/api/v1/practice/job-parts/count`, {
            params: {
              invoice_status: ["Invoiced",],
              status: ["Approved",],
              locum_invoiceable: true,
              nhs_claimable: true,
              type: "Platform",
              job_practice_id: [app.$auth.user.practice_id,],
            },
          })
          .then(res => {
            const total = res.data.count
            return total
          }),
        app.$axios
          .$get(`/api/v1/practice/job-parts`, {
            params: {
              invoice_status: ["Invoiced",],
              status: ["Approved",],
              locum_invoiceable: true,
              nhs_claimable: true,
              type: "Platform",
              job_practice_id: [app.$auth.user.practice_id,],
              offset: 0,
              limit: 5,
            },
          })
          .then(res => {
            const job_parts = res.data.job_parts
            return job_parts
          }),
      ])

      job_parts = job_parts.map(jobPart => {
        let total = jobPart.locum_invoice_id
          ? jobPart.locum_invoice_item.total
          : jobPart.job.locum_detail_rate_type.name === "Per Hour"
            ? jobPart.job.rate * jobPart.final_hours
            : (jobPart.job.rate / jobPart.job.total_hours) * jobPart.final_hours

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
            jobPart.status === "Approved"
            && jobPart.locum_invoice_item.locum_invoice.paid_at
              ? "Yes"
              : "No",
          nhs_claimable: jobPart.locum_invoice_id
            ? jobPart.locum_invoices_nhs_claimable
            : jobPart.locum_details_nhs_claimable,
        }
      })

      return {
        total,
        job_parts,
      }
    } catch (err) {
      console.log("err", err.response || err)
      error({
        statusCode: err.status || 500,
        message: err.message || "Something went wrong!",
      })
    }
  },

  mounted () {
    this.$socket.on(
      "Practice Notification Locum Invoice Created",
      this.getLocumInvoiceRealTime
    )
    this.$socket.on(
      "Practice Notification Locum Invoice Paid",
      this.getLocumInvoiceRealTime
    )
    this.$socket.on(
      "Practice Notification Locum Invoice Updated",
      this.getLocumInvoiceRealTime
    )
  },

  destroyed () {
    this.removeListener()
  },

  methods: {
    viewAsPdf (formId, type) {
      let url
        = type === "form-a" ? `/api/v1/locum-form-a` : `/api/v1/locum-form-b`
      window.open(`${process.env.API_URL}${url}/${formId}/pdf`)
    },

    getJobPartsPromiseAll () {
      return Promise.all([
        this.$axios.$get(`/api/v1/practice/job-parts/count`, {
          params: {
            invoice_status: ["Invoiced",],
            status: ["Approved",],
            locum_invoiceable: true,
            nhs_claimable: true,
            type: "Platform",
            job_practice_id: [this.$auth.user.practice_id,],
          },
        }),
        this.$axios.$get(`/api/v1/practice/job-parts`, {
          params: {
            invoice_status: ["Invoiced",],
            status: ["Approved",],
            locum_invoiceable: true,
            nhs_claimable: true,
            type: "Platform",
            job_practice_id: [this.$auth.user.practice_id,],
            offset: 0,
            limit: 5,
          },
        }),
      ])
        .then(([responseTotal, responseJobParts,]) => {
          this.total = responseTotal.data.count
          let job_parts = responseJobParts.data.job_parts
          this.job_parts = job_parts.map(jobPart => {
            let total = jobPart.locum_invoice_id
              ? jobPart.locum_invoice_item.total
              : jobPart.job.locum_detail_rate_type.name === "Per Hour"
                ? jobPart.job.rate * jobPart.final_hours
                : (jobPart.job.rate / jobPart.job.total_hours)
                * jobPart.final_hours
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
                jobPart.status === "Approved"
                && jobPart.locum_invoice_item.locum_invoice.paid_at
                  ? "Yes"
                  : "No",
              nhs_claimable: jobPart.locum_invoice_id
                ? jobPart.locum_invoices_nhs_claimable
                : jobPart.locum_details_nhs_claimable,
            }
          })
        })
        .catch((err) => {
          console.log("err", err.response || err)

          this.$nuxt.error({
            statusCode: err.status || 500,
            message: err.message || "Something went wrong!",
          })
        })
    },

    getJobParts () {
      return this.$axios
        .$get(`/api/v1/practice/job-parts`, {
          params: {
            invoice_status: ["Invoiced",],
            status: ["Approved",],
            locum_invoiceable: true,
            nhs_claimable: true,
            type: "Platform",
            job_practice_id: [this.$auth.user.practice_id,],
            offset: this.offset,
            limit: this.limit,
            order_by: this.order_by,
          },
        })
        .then(res => {
          let job_parts = res.data.job_parts

          this.job_parts = job_parts.map(jobPart => {
            let total = jobPart.locum_invoice_id
              ? jobPart.locum_invoice_item.total
              : jobPart.job.locum_detail_rate_type.name === "Per Hour"
                ? jobPart.job.rate * jobPart.final_hours
                : (jobPart.job.rate / jobPart.job.total_hours)
                * jobPart.final_hours

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
                jobPart.status === "Approved"
                && jobPart.locum_invoice_item.locum_invoice.paid_at
                  ? "Yes"
                  : "No",
              nhs_claimable: jobPart.locum_invoice_id
                ? jobPart.locum_invoices_nhs_claimable
                : jobPart.locum_details_nhs_claimable,
            }
          })
        })
        .catch(err => {
          console.log("err", err.response || err)
          this.nuxt.error({
            statusCode: err.status || 500,
            message: err.message || "Something went wrong!",
          })
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
    removeListener () {
      this.$socket.removeListener(
        "Practice Notification Locum Invoice Created",
        this.getLocumInvoiceRealTime
      )
      this.$socket.removeListener(
        "Practice Notification Locum Invoice Paid",
        this.getLocumInvoiceRealTime
      )
      this.$socket.removeListener(
        "Practice Notification Locum Invoice Updated",
        this.getLocumInvoiceRealTime
      )
    },
    select_invoice (id) {
      this.invoice_id = id
    },
    updateInvoice (invoice) {
      let queryStatus = this.$route.query.status.toLowerCase()

      let job_part = this.job_parts.find(
        item => item.id === invoice.items[0].job_part.id
      )
      job_part.locum_invoice_id = invoice.id
      job_part.total_amount = invoice.total_amount

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
              text: [`${res.message}`,],
            })

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
      this.limit = 5
      this.order_by = []
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
