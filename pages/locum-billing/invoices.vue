<template>
  <div>
    <transition name="fade" mode="out-in">
      <div
        v-if="$route.path === '/locum-billing/create' || deleteModal || paymentModal"
        class="invoice-shield"
      ></div>
    </transition>
    <transition name="drop" mode="out-in">
      <!-- <SignOut v-if="confirmation" @modal="confirmation = $event" /> -->
      <div class="confirmation fixed pin-t w-full flex justify-center" v-if="deleteModal">
        <div class="confirmation-modal border-solid rounded-b-lg bg-yellow-dark p-2">
          <div class="flex justify-center">
            <div class>Proceed to delete this invoice?</div>
          </div>
          <div class="flex justify-center my-1">
            <div class="mx-2">
              <button
                class="border border-solid bg-yellow-dark hover:text-white focus:outline-none text-black font-bold py-5 rounded-lg"
                @click.prevent="deleteInvoice"
                style="width:100px;"
              >Yes</button>
            </div>
            <div class="mx-2">
              <button
                class="border border-solid bg-yellow-dark hover:text-white focus:outline-none text-black font-bold py-5 rounded-lg"
                @click.prevent="deleteModal = false"
                style="width:100px;"
              >Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <nuxt-child />

    <div class="__jobs-section">
      <h1>Invoices</h1>
      <div class="overflow-x-auto">
        <div class="overflow-x-auto overflow-y-hidden">
          <table>
            <thead>
              <tr class="text-xs sm:text-sm text-left">
                <th>Type</th>
                <th>Practice / Surgery</th>
                <th @click="sortBy('date_created')">
                  Created
                  <svgicon name="sort" height="12" width="12" />
                </th>
                <th @click="sortBy('issued_at')">
                  Issued
                  <svgicon name="sort" height="12" width="12" />
                </th>
                <th>Invoice number</th>
                <th>Job numbers</th>
                <th>£ Amount</th>
                <th>Pension type</th>
                <th>Status</th>
                <th>Copies</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="getLocumInvoices.length === 0">
                <tr>
                  <td colspan="10" class="text-center">You haven't created any invoice/s yet</td>
                </tr>
              </template>
              <template v-else v-for="(invoice, index) in getLocumInvoices">
                <tr :key="invoice.id" class="__job-card shadow-md cursor-pointer text-xs text-left">
                  <td @click="show(invoice)">{{invoice.type}}</td>
                  <td @click="show(invoice)">{{invoice.surgery.name}}</td>
                  <td @click="show(invoice)">{{invoice.date_created | localDate}}</td>
                  <td @click="show(invoice)">{{invoice.issued_at | localDate}}</td>
                  <td @click="show(invoice)">{{invoice.invoice_number}}</td>
                  <td @click="show(invoice)">
                    <div
                      v-for="item in invoice.items.filter(item => item.type === 'Job Part' && item.job_part)"
                      :key="item.id"
                    >{{item.job_part.job_part_number}}</div>
                  </td>
                  <td @click="show(invoice)">£ {{invoice.total_amount}}</td>
                  <td @click="show(invoice)">pension type</td>
                  <td
                    @click="show(invoice)"
                  >{{invoice.paid_at ? 'Paid' : invoice.issued_at ? 'Issued' : ''}}</td>
                  <td @click="onClick(invoice, index)">
                    <button
                      v-if="!invoice.paid_at"
                      v-text="invoice.issued_at ? 'Mark as paid' : 'Delete'"
                      class="px-2 py-3 text-white rounded-lg"
                      :class="invoice.issued_at ? 'bg-green-dark' : 'bg-yellow-dark'"
                    ></button>
                  </td>
                </tr>
                <tr :key="`${invoice.id}-${index}`">
                  <td></td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
      <div class="absolute pin-b w-full" v-if="getLocumInvoices.length > 0 && totalPages > 1">
        <AppPagination
          :total="total"
          :totalPages="totalPages"
          :currentPage="current_page"
          @pagechanged="pagechanged"
        />
      </div>
    </div>
    <div
      v-if="paymentModal"
      class="rounded-lg shadow-md p-4 update-modal border"
      v-on-clickaway="closePaymentModal"
    >
      <AppDate
        v-model="form.paid_at"
        :name="'paid_at'"
        :label="'Receive payment on'"
        :error="formError.find(item => item.field === 'paid_at')"
      />
      <div class="flex flex-row flex-nowrap justify-center">
        <AppButton :label="'Save'" @click="updateInvoice" :inStyle="'padding:5px'" />
        <div class="mx-1"></div>
        <AppButton :label="'Cancel'" @click="paymentModal = false" :inStyle="'padding:5px'" />
      </div>
    </div>
  </div>
</template>

<script>
import AppDate from '@/components/Base/AppDate'
import AppButton from '@/components/Base/AppButton'
import AppPagination from '@/components/Base/AppPagination'
import { mixin as clickaway } from "vue-clickaway";
export default {
  mixins: [clickaway],
  components: {
    AppDate,
    AppButton,
    AppPagination,
  },
  transition: {
    name: 'fade',
    mode: 'out-in'
  },

  async asyncData({ app, error }) {
    try {
      const params = {
        offset: 0,
        limit: 5,
        order_by: 'date_created:desc'
      }
      const response = await app.$axios.get('/api/v1/locum/invoices', { params })
      const invoices = response.data && response.data.data && response.data.data.invoices ? response.data.data.invoices : []
      const responseCount = await app.$axios.get('/api/v1/locum/invoices/count')
      const count = responseCount.data && response.data.data && responseCount.data.data.count ? responseCount.data.data.count : 0
      return {
        invoices,
        count
      }
    } catch (err) {
      console.log('locum-billing index err', err.response || err)
      error({
        statusCode: err.status || 500,
        message: err.message || 'Something went wrong!',
      })
    }
  },
  data() {
    return {
      current_page: 1,
      params: {
        order_by: 'date_created:desc',
      },
      // sort
      sortType: '',
      issued_at: true,
      paid_at: true,
      date_created: false,
      //
      count: 0,
      invoices: [],
      paymentModal: false,
      deleteModal: false,
      form: {
        paid_at: null
      },
      formError: [],
      selectedInvoiceId: null,
    }
  },
  computed: {
    getLocumInvoices() {
      return this.$store.getters['billing/getLocumInvoices']
    },
    offset() {
      return this.perPage * (this.current_page - 1);
    },
    perPage() {
      return 5;
    },
    total() {
      return this.$store.state.billing.locum_invoice_count;
    },
    totalPages() {
      return Math.ceil(this.total / this.perPage);
    },
  },
  mounted() {
    this.$store.commit('billing/SET_INVOICES', this.invoices)
    this.$store.commit('billing/SET_INVOICE_COUNT', this.count)
  },
  methods: {
    pagechanged(e) {
      this.current_page = e
      this.getInvoice(this.current_page, this.params)
    },
    sortBy(sortedBy) {
      switch (sortedBy) {
        case 'issued_at':
          this.issued_at = !this.issued_at
          this.sortType = this.issued_at
          break;
        case 'paid_at':
          this.paid_at = !this.paid_at
          this.sortType = this.paid_at
          break;
        case 'date_created':
          this.date_created = !this.date_created
          this.sortType = this.date_created
          break;
      }
      this.params.order_by = `${sortedBy}:${this.sortType ? 'asc' : 'desc'}`
      this.current_page = 1
      this.getInvoice(this.current_page, this.params)
    },
    getInvoice(page, params) {
      this.current_page = page
      const defaultParams = {
        offset: this.offset,
        limit: this.perPage
      }
      let invoiceParams = { ...params, ...defaultParams }
      this.$axios.$get('/api/v1/locum/invoices', { params: invoiceParams }).then(res => {
        this.$store.commit('billing/SET_INVOICES', res.data.invoices)
      })
    },

    show(item) {
      if (item.status === 'Issued' || item.status === 'Paid' || item.issued_at) {
        this.$router.push(`/locum-billing/invoices/${item.id}`)
      } else {
        this.$router.push(`/locum-billing/invoices/${item.id}/edit`)
      }
    },
    onClick(invoice, index) {
      this.selectedInvoiceId = null
      this.form.paid_at = null
      if (invoice.issued_at) {
        this.paymentModal = true
        this.selectedInvoiceId = invoice.id
      } else {
        this.deleteModal = true
        this.selectedInvoiceId = invoice.id
      }
    },
    closePaymentModal() {
      this.paymentModal = false
    },
    updateInvoice() {
      this.Validate(this.form)
      if (!this.formError.length) {
        this.form.paid_at = this.$moment(this.form.paid_at).format('YYYY-MM-DD')
        this.$store.commit('billing/UPDATE_INVOICE', res.data.invoice)
        this.paymentModal = false
      }

      return
      this.$axios.$put(`/api/v1/locum/invoices/${this.selectedInvoiceId}/paid`, this.form).then(res => {
      })
    },
    deleteInvoice() {
      this.$axios.$delete(`/api/v1/locum/invoices/${this.selectedInvoiceId}`).then(res => {
        this.$store.commit('billing/REMOVE_INVOICE', this.selectedInvoiceId)
        this.deleteModal = false
      })
    }
  }

}
</script>

<style scoped>
.calendar-container {
  min-width: 1000px;
}
.invoice-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 511;
}
/* .calendar {
  min-width: 80px;
  height: auto;
}
@media screen and (min-width: 468px) {
  .calendar {
    width: 160px;
  }
} */
/* confirmation */
.confirmation {
  z-index: 600;
}
.confirmation-modal {
  width: 100%;
}
.update-modal {
  position: fixed;
  background-color: white;
  z-index: 512;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
@media screen and (min-width: 991px) {
  .confirmation-modal {
    width: auto;
  }
}
button:active {
  transform: translate(2px, 2px);
}
</style>
