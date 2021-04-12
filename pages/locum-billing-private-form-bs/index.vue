<template>
  <section class="relative">
    <LocumBillingPrivateInvoicesTabs />

    <div class="flex flex-row justify-start overflow-x-auto pb-3">
      <nuxt-link
        :to="{ name: 'locum-billing-private-form-bs-create' }"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap shadow-md border-2 rounded-lg text-gray-800"
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
          @click="refreshInvoices"
        />

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
                @click="viewLocumFormBPdf(slotProps.item.id)"
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
          You do not have any form b's.
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
    form_bs_columns () {
      return [
        {
          name: "Practices / Surgeries",
          dataIndex: "practices.name",
          class: "text-center",
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

    viewLocumFormBPdf (locumFormBId) {
      window.open(`${process.env.API_URL}/api/v1/locum-form-b/${locumFormBId}/pdf`)
    },


    getJobPartsPromiseAll () {
      const params = {
        type: "Private",
      }

      return Promise.all([
        this.$axios.$get('/api/v1/locum/locum-invoices-form-b/count', {
          params: {
            ...params,
          },
        }),
        this.$axios.$get('/api/v1/locum/locum-invoices-form-b', {
          params: {
            ...params,
            offset: 0,
            limit: 15,
          },
        }),
      ])
        .then(([responseTotal, response,]) => {
          this.total = responseTotal.data.count

          this.locum_form_bs = response.data.locum_form_bs.map(item => {
            return {
              ...item,
              practices: item.forms.map(form => {
                return {
                  name: form.practice_name,
                }
              }),
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
      return this.$axios
        .$get('/api/v1/locum/locum-invoices-form-b', {
          params: {
            type: "Private",
            order_by: this.order_by,
            offset: this.offset,
            limit: this.limit,
          },
        })
        .then(res => {
          this.locum_form_bs = res.data.locum_form_bs.map(item => {
            return {
              ...item,
              practices: item.forms.map(form => {
                return {
                  name: form.practice_name,
                }
              }),
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
