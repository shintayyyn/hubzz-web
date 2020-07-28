<template>
  <section class="relative">
    <div class="flex flex-col md:flex-row justify-between">
      <div class="flex flex-wrap items-center">
        <AppButton
          v-if="selectedItems.length > 0"
          class="m-1"
          :label="'Generate Form B'"
          :inStyle="'padding:5px 14px;font-size:1em'"
          :disabled="saveLoading"
          @click="generate_form_b_modal = true"
        />
      </div>
      <div class="flex flex-row flex-wrap justify-start items-center my-2 md:my-4">
        <label class="mx-1">Type:</label>
        <div
          class="text-xs sm:text-sm mx-1 py-2 px-3 border-2 rounded-lg font-bold flex items-center focus:outline-none bg-yellow-500 border-yellow-500"
        >
          {{ type }}
        </div>
      </div>
    </div>

    <transition name="fade" mode="out-in">
      <div v-if="initialLoading" class="relative flex w-full" style="min-height:80px">
        <AppLoading :loading="initialLoading" spinner />
      </div>
      <div v-if="!initialLoading">
        <div class="font-bold">
          Select Form A's to be generated to Form B
        </div>
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
            <div
              class="flex flex-row flex-wrap justify-center"
              @click="checkItem(slotProps.item.locum_form_a_id)"
            >
              <input
                type="checkbox"
                :checked="selectedItems.includes(slotProps.item.locum_form_a_id)"
              >
              <label class="text-xs sm:text-sm py-1 flex items-center" />
            </div>
          </template>
        </AppTable>
        <div v-else class="flex justify-center">
          No Form A's has been created yet.
        </div>
      </div>
    </transition>
    <AppConfirmationModal
      :label="'Generate Form B?'"
      :confirmLabel="'Yes'"
      :cancelLabel="'Cancel'"
      :modal="generate_form_b_modal"
      @confirm="save"
      @cancel="generate_form_b_modal = false"
    />
  </section>
</template>

<script>
import AppButton from "@/components/Base/AppButton"
import AppTable from "@/components/Base/AppTable"
import AppLoading from "@/components/Base/AppLoading"
import AppConfirmationModal from "@/components/Base/AppConfirmationModal"
import { mixin as clickaway, } from "vue-clickaway"
export default {
  components: {
    AppButton,
    AppTable,
    AppConfirmationModal,
    AppLoading,
  },
  mixins: [clickaway,],
  props: {
    type: {
      type: String,
      default: () => null,
    },
  },
  data () {
    return {
      generate_form_b_modal: false,
      initialLoading: false,
      loading: false,
      saveLoading: false,
      filterModal: false,
      isFiltered: false,
      total: 0,
      job_parts: [],

      selectedItems: [],

      showRefresh: false,
      current_page: 1,

      form: {
        locum_user_id: null,
        type: null,
        items: [],
      },

      offset: 0,
      limit: 5,
      order_by: [],
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
          name: "Job Title",
          dataIndex: "job_title",
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
          name: "Paid",
          dataIndex: "paid",
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
  },
  async created () {
    this.initialLoading = true
    await this.getJobPartsPromiseAll()
    this.initialLoading = false
  },
  methods: {
    checkItem (invoiceId) {
      let index = this.selectedItems.findIndex(item => item === invoiceId)
      if (index >= 0) {
        this.selectedItems = this.selectedItems.filter(
          item => item !== invoiceId
        )
      } else if (index < 0) {
        this.selectedItems.push(invoiceId)
      }
    },
    getJobPartsPromiseAll () {
      return Promise.all([
        this.$axios.$get(`/api/v1/locum/job-parts/count`, {
          params: {
            invoice_status: this.type === "Platform" ? ["Invoiced",] : null,
            locum_status: ["Approved",],
            locum_invoiceable: this.type === "Platform" ? true : null,
            nhs_claimable: true,
            job_type: this.type,
            type: this.type,
            generate_form: true,
            can_generate_form_b: true,
          },
        }),
        this.$axios.$get(`/api/v1/locum/job-parts`, {
          params: {
            invoice_status: this.type === "Platform" ? ["Invoiced",] : null,
            locum_status: ["Approved",],
            locum_invoiceable: this.type === "Platform" ? true : null,
            nhs_claimable: true,
            job_type: this.type,
            type: this.type,
            can_generate_form_b: true,
            generate_form: true,
            offset: 0,
            limit: 5,
          },
        }),
      ])
        .then(([responseTotal, response,]) => {
          this.total = responseTotal.data.count
          let job_parts = response.data.job_parts

          this.job_parts = job_parts.map(jobPart => {
            let total = jobPart.locum_invoice_item.locum_invoice.total_amount

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
              nhs_claimable: jobPart.locum_invoices_nhs_claimable
                ? jobPart.locum_invoices_nhs_claimable
                : jobPart.locum_details_nhs_claimable,
            }
          })
        })
        .catch(([errTotal, err,]) => {
          console.log(
            "err",
            errTotal.response || errTotal || err.response || err
          )
          throw err
        })
    },
    getJobParts () {
      return this.$axios
        .$get(`/api/v1/locum/job-parts`, {
          params: {
            invoice_status: this.type === "Platform" ? ["Invoiced",] : null,
            locum_status: ["Approved",],
            locum_invoiceable: this.type === "Platform" ? true : null,
            nhs_claimable: true,
            job_type: this.type,
            type: this.type,
            can_generate_form_b: true,
            generate_form: true,
            offset: this.offset,
            limit: this.limit,
          },
        })
        .then(res => {
          let job_parts = res.data.job_parts

          this.job_parts = job_parts.map(jobPart => {
            let total = jobPart.locum_invoice_item.locum_invoice.total_amount

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
              nhs_claimable: jobPart.locum_invoices_nhs_claimable
                ? jobPart.locum_invoices_nhs_claimable
                : jobPart.locum_details_nhs_claimable,
            }
          })
        })
        .catch(err => {
          console.log("err", err.response || err)
        })
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
    save () {
      this.saveLoading = true
      this.$axios
        .$post(`/api/v1/locum/locum-invoices-form-b`, {
          locum_user_id: this.$auth.user.id,
          type: this.type,
          items: this.selectedItems,
        })
        .then(res => {
          console.log(res)
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`${res.message}`,],
          })
          this.$emit("createFormB", res.data.locum_invoice_form_b)
        })
        .catch(err => {
          console.log("err", err.response || err)
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`${err.response.data.message}`,],
          })
          throw err
        })
        .finally(() => {
          this.generate_form_b_modal = false
          this.saveLoading = false
        })
    },
  },
}
</script>
