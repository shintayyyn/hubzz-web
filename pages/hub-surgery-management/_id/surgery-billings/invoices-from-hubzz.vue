<template>
  <section class="relative">
    <div class="my-2">
      <AppTable
        v-if="invoices.length > 0"
        :total="totalInvoices"
        :items="invoices"
        :loading="loading"
        :currentPage="current_page"
        :perPage="params.limit"
        :columns="columns"
        :orderBy="params.order_by"
        :routerLink="'/practice-billing/invoices-from-hubzz'"
        :customWidth="800"
        @pagechanged="pagechanged"
        @limitchanged="limitchanged"
        @sorted="sorted"
      >
        <template v-slot:actions="slotProps">
          <div class="flex justify-center" @click.stop.prevent="onClick(slotProps.item)">
            <button
              class="rounded text-xs px-2 text-left cursor-pointer"
              :class="[slotProps.item.paid ? 'bg-green-600 text-white' : slotProps.item.disputed_items_count > 0 ? 'bg-gray-500 text-white' : 'bg-yellow-400']"
              v-text="`${slotProps.item.paid ? 'Already Paid' : slotProps.item.disputed_items_count > 0 ? 'Disputed' : 'Mark as paid'}`"
            />
          </div>
        </template>
      </AppTable>
      <div v-else>
        This spoke has no Hubzz Invoices
      </div>
    </div>
    

    <div v-if="paymentModal" v-on-clickaway="closePaymentModal" class="p-2">
      <div class="rounded-lg shadow-md px-4 py-8 md:px-8 update-modal border w-5/6 md:w-1/3">
        <AppDate
          v-model="form.paid_at"
          :name="'paid_at'"
          :label="'Payment made on'"
          :error="formError.find(item => item.field === 'paid_at')"
          isBefore
        />
        <div class="flex flex-row flex-no-wrap justify-center">
          <AppButton
            class="mx-1"
            :label="'Save'"
            :inStyle="'padding:5px 10px'"
            @click="confirmPayment"
          />
          <AppButton
            class="mx-1"
            :label="'Cancel'"
            :inStyle="'padding:5px 10px'"
            @click="paymentModal = false"
          />
        </div>
      </div>
    </div>

    <transition name="fade" mode="out-in">
      <div
        v-if="['practice-billing-invoices-from-hubzz-id'].includes($route.name) || paymentModal"
        class="shield"
        @click="paymentModal ? paymentModal = false : $route.path != '/practice-billing/invoices-from-hubzz' ? $router.push('/practice-billing/invoices-from-hubzz') : null"
      />
    </transition>

    <nuxt-child />
  </section>
</template>

<script>
import AppTable from "@/components/Base/AppTable"
import AppButton from "@/components/Base/AppButton"
import AppDate from "@/components/Base/AppDate"
import { mixin as clickaway, } from "vue-clickaway"

export default {
  components: {
    AppTable,
    AppDate,
    AppButton,
  },

  mixins: [clickaway,],

  transition: {
    name: "fade",
    mode: "out-in",
  },

  data () {
    return {
      totalInvoices: 0,
      invoices: [],
      loading: false,
      current_page: 1,
      modal: false,
      // payment
      paymentModal: false,
      selectedInvoiceId: null,
      form: {
        paid_at: null,
      },
      formError: [],
      // app table params
      params: {
        offset: 0,
        limit: 15,
        order_by: [],
      },
      // app table column
      columns: [
        {
          name: "Practice / Surgery",
          dataIndex: "practice.name",
          class: "text-left",
        },
        {
          name: "Issued",
          dataIndex: "issued_at_in_gb_formatted",
          class: "text-center",
        },
        {
          name: "Invoice Number",
          dataIndex: "invoice_number",
          class: "text-left",
          width: 130,
        },
        {
          name: "£ Amount",
          dataIndex: "total_amount",
          class: "text-center",
        },
        {
          name: "Paid At",
          dataIndex: "paid_at",
          class: "text-center",
          width: 150,
        },
        {
          name: "Created At",
          dataIndex: "date_created_in_gb_formatted",
          class: "text-center",
          width: 150,
        },
        {
          name: "Actions",
          dataIndex: "actions",
          class: "text-center",
          width: 120,
        },
      ],
    }
  },

  async asyncData ({ app, error, params, }) {
    try {
      const {
        id: practiceSurgeryId,
      } = params

      const [
        totalInvoices,
        invoices,
      ] = await Promise.all([
        app.$axios.get('/api/v1/practice/practice-invoices/count', {
          params: {
            practice_surgery_id: practiceSurgeryId,
          },
        }).then(response => response.data.data.count),

        app.$axios.get('/api/v1/practice/practice-invoices', {
          params: {
            practice_surgery_id: practiceSurgeryId,
            limit: 15,
            offset: 0,
          },
        }).then(response => response.data.data.practice_invoices),
      ])

      return {
        totalInvoices,
        invoices,
      }
    } catch (err) {
      console.log("practice-billing index err", err.response || err)
      error({
        statusCode: err.status || 500,
        message: err.message || "Something went wrong!",
      })
    }
  },

  mounted () {
    this.$socket.on('Practice Notification Practice Invoice Paid', this.getPracticeInvoiceRealTime)
  },

  destroyed () {
    this.$socket.removeListener('Practice Notification Practice Invoice Paid', this.getPracticeInvoiceRealTime)
  },

  methods: {

    getPracticeInvoiceRealTime (practiceInvoice) {
      const {
        id: practiceInvoiceId,
      } = practiceInvoice

      if (!practiceInvoiceId) {
        return
      }

      if (this.invoices.map(practiceInvoice => practiceInvoice.id).includes(practiceInvoiceId)) {
        this.$axios
          .get(`/api/v1/practice/practice-invoices/${practiceInvoiceId}`)
          .then((response) => {
            let index = this.invoices.findIndex(invoice => invoice.id == practiceInvoiceId)
            if (index > -1) {
              this.invoices.splice(index, 1, response.data.data.practice_invoice)
            }
          })
      }
    },
      
    getInvoices (params) {
      this.loading = true

      const {
        id: practiceSurgeryId,
      } = this.$route.params

      this.loading = true
      Promise.all([
        this.$axios.get('/api/v1/practice/practice-invoices/count', {
          params: {
            practice_surgery_id: practiceSurgeryId,
          },
        }).then(response => response.data.data.count),

        this.$axios.get('/api/v1/practice/practice-invoices', {
          params: {
            ...params,
            practice_surgery_id: practiceSurgeryId,
          },
        }).then(response => response.data.data.practice_invoices),
      ]).then((results) => {
        const [
          totalInvoices,
          invoices,
        ] = results

        this.totalInvoices = totalInvoices
        this.invoices = invoices
      }).catch((err) => {
        console.log('err', err.response || err)
      }).finally(() => {
        this.loading = true
      })
    },

    onClick (invoice) {
      if (invoice.paid || invoice.disputed_items_count > 0) {
        return
      }

      this.selectedInvoiceId = null
      this.form.paid_at = null
      this.paymentModal = true
      this.selectedInvoiceId = invoice.id
    },

    confirmPayment () {
      this.Validate(this.form)
      if (!this.formError.length) {
        this.$axios
          .$put(
            `/api/v1/practice/practice-invoices/${this.selectedInvoiceId}/paid`,
            this.form
          )
          .then(res => {
            console.log(res)
            let index = this.invoices.findIndex(
              invoice => invoice.id == res.data.practice_invoice.id
            )
            if (index >= 0) {
              this.invoices.splice(index, 1, res.data.practice_invoice)
            }

            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: [`${res.message}`,],
            })
            this.paymentModal = false
          })
      }
    },

    closePaymentModal () {
      this.paymentModal = false
    },

    sorted (order_by) {
      this.current_page = 1
      this.params.offset = 0
      this.params.order_by = order_by
      this.getInvoices(this.params)
    },

    pagechanged (page) {
      this.current_page = page
      this.params.offset = this.params.limit * (page - 1)
      this.getInvoices(this.params)
    },

    limitchanged (limit) {
      this.current_page = 1
      this.params.offset = 0
      this.params.limit = limit
      this.getInvoices(this.params)
    },

  },

}
</script>

<style scoped>
  .shield {
    z-index: 511;
  }
  .update-modal {
    position: fixed;
    background-color: white;
    z-index: 512;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>
