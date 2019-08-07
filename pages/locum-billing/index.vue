<template>
  <div>
    <transition name="fade" mode="out-in">
      <div
        v-if="$route.path === '/locum-billing/create'"
        class="invoice-shield"
      ></div>
    </transition>

    <nuxt-child/>

    <div>
      <h1>Invoices</h1>
      <table>
        <thead>
          <tr>
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
          <tr class="bg-grey cursor-pointer" v-for="invoice in invoices">
            <td>{{ invoice.type }}</td>
            <td>{{ invoice.surgery ? invoice.surgery.name : '' }}</td>
            <td>{{ invoice.date_created }}</td>
            <td>{{ invoice.issued_at }}</td>
            <td>{{ invoice.invoice_number }}</td>
            <td>{{ invoice.items ? invoice.items.filter(({ type, job_part }) => type === 'Job Part' && job_part).map(({ job_part }) => job_part.job_part_number).join('\n') : '' }}</td>
            <td>£{{ invoice.total_amount }}</td>
          </tr>
        </tbody>
      </table>
      <div v-for="invoice in invoices">
        <pre>{{ invoice }}</pre>
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

    async asyncData ({ app, error }) {
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
      }
    },

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
