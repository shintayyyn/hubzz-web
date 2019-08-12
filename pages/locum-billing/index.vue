<template>
  <div>
    <transition name="fade" mode="out-in">
      <div v-if="$route.path === '/locum-billing/create'" class="invoice-shield"></div>
    </transition>

    <nuxt-child />

    <div>
      <h1>Invoices</h1>
      <div class="overflow-x-auto overflow-y-hidden">
        <table>
          <thead>
            <tr class="text-xs sm:text-sm text-left">
              <th>Type</th>
              <th>Practice / Surgery</th>
              <th>Created</th>
              <th>Issued</th>
              <th>Invoice number</th>
              <th>Job numbers</th>
              <th>£ Amount</th>
              <th>Pension type</th>
              <th>Status</th>
              <th>Copies</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="invoices.length === 0">
              <tr>
                <td colspan="10" class="text-center">You haven't created any invoice/s yet</td>
              </tr>
            </template>
            <template v-for="(invoice, index) in invoices">
              <tr :key="invoice.id" class="__job-card shadow-md cursor-pointer text-xs text-left">
                <!-- @click="show(invoice)" -->
                <td>{{invoice.type}}</td>
                <td>{{invoice.surgery.name}}</td>
                <td>{{invoice.date_created | localDate}}</td>
                <td>{{invoice.issued_at | localDate}}</td>
                <td>{{invoice.invoice_number}}</td>
                <td>
                  <div
                    v-for="item in invoice.items.filter(item => item.type === 'Job Part' && item.job_part)"
                    :key="item.id"
                  >{{item.job_part.job_part_number}}</div>
                </td>
                <td>£ {{invoice.total_amount}}</td>
                <td>pension type</td>
                <td>{{invoice.paid_at ? 'Paid' : invoice.issued_at ? 'Issued' : ''}}</td>
                <td>
                  <div class="relative">
                    <button
                      v-if="!invoice.paid_at"
                      v-text="invoice.issued_at ? 'Mark as paid' : 'Delete'"
                      class="px-2 py-3 text-white rounded-lg"
                      :class="invoice.issued_at ? 'bg-green-dark' : 'bg-yellow-dark'"
                      @click="update(invoice)"
                    ></button>
                    <div class="relative z-50" v-if="modal">
                      <div
                        class="absolute pin-r border rounded-tl-lg rounded-bl-lg rounded-br-lg calendar bg-white shadow-md px-1"
                      >
                        <AppDate
                          v-model="form.paid_at"
                          :name="'paid_at'"
                          :label="'Receive payment on'"
                        />
                        <AppButton :label="'Save'" :inStyle="'padding:2px'" />
                      </div>
                    </div>
                  </div>
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
  </div>
</template>

<script>
import AppDate from '@/components/Base/AppDate'
import AppButton from '@/components/Base/AppButton'
import { mixin as clickaway } from "vue-clickaway";
export default {
  mixins: [clickaway],
  components: {
    AppDate,
    AppButton,
  },
  transition: {
    name: 'fade',
    mode: 'out-in'
  },

  async asyncData({ app, error }) {
    try {
      const response = await app.$axios.get('/api/v1/locum/invoices')

      const invoices = response.data && response.data.data && response.data.data.invoices ? response.data.data.invoices : []

      console.log('invoices', invoices)

      return {
        invoices,
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
      invoices: [],
      modal: false,
      confirmation: false,
      form: {
        paid_at: null
      }
    }
  },
  created() {
    console.log('creating')
  },
  methods: {
    show(item) {
      if (item.status === 'Issued' || item.status === 'Paid') {
        this.$router.push(`/locum-billing/${item.id}`)
      } else {
        this.$router.push(`/locum-billing/${item.id}/edit`)
      }
    },
    update(invoice) {
      if (invoice.issued_at) {
        this.modal = true
      } else {
        this.confirmation = true
      }
    }
  }

}
</script>

<style scoped>
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
.calendar {
  min-width: 80px;
  height: auto;
}
@media screen and (min-width: 468px) {
  .calendar {
    width: 160px;
  }
}
</style>
