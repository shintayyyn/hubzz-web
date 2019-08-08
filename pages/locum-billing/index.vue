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
            <template v-for="(item, index) in invoices">
              <tr
                :key="item.id"
                class="__job-card shadow-md cursor-pointer text-xs text-left"
                @click="show(item)"
              >
                <td>{{item.type}}</td>
                <td>{{item.surgery.name}}</td>
                <td>{{item.date_created | localDate}}</td>
                <td>{{item.issued_at | localDate}}</td>
                <td>{{item.invoice_number}}</td>
                <td>
                  <div v-for="part in item.items" :key="part.id">{{part.job.job_number}}</div>
                </td>
                <td>£ {{item.total_amount}}</td>
                <td>pension type</td>
                <td>{{item.paid_at ? 'Paid' : item.issued_at ? 'Issued' : ''}}</td>
                <td>
                  <button
                    v-if="!item.paid_at"
                    v-text="item.issued_at ? 'Mark as paid' : 'Delete'"
                    class="px-2 py-3 text-white rounded-lg"
                    :class="item.issued_at ? 'bg-green-dark' : 'bg-yellow-dark'"
                  ></button>
                </td>
              </tr>
              <tr :key="`${item.id}-${index}`">
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
export default {

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

  methods: {
    show(item) {
      if (!item.issued_at) {
        this.$router.push('/locum-billing/create')
      } else {
        // open pdf viewer
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
</style>
