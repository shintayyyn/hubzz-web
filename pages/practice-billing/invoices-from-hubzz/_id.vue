<template>
  <div class="max-w-5xl h-screen">
    <!-- <div class="flex flex-row flex-wrap justify-start">
      <nuxt-link 
        :to="{ name: 'practice-billing-invoices-from-hubzz' }"
      >
        <svgicon name="left-arrow" height="32" width="32" />
      </nuxt-link>
    </div> -->
    
    <!-- billing -->
    <section class="pt-2">
      <div class="flex flex-row flex-wrap justify-start items-center my-2">
        <label class="mx-1 py-2 px-3">Type:</label>
        <div class="text-xs sm:text-sm mx-1 py-1 px-3 border-2 rounded-lg font-bold flex items-center focus:outline-none bg-sunglow border-sunglow">
          Platform
        </div>
      </div>
      <div
        v-if="practiceInvoice.paid_at_in_gb_formatted" 
        class="mx-4 font-semibold"
      >
        {{ '* This invoice has been marked as paid on ' + practiceInvoice.paid_at_in_gb_formatted }}
      </div>
      <div
        v-if="practiceInvoice.unpaid_at_in_gb_formatted" 
        class="mx-4 font-semibold"
      >
        <div>{{ `* This invoice has been marked Invalid on ${practiceInvoice.unpaid_at_in_gb_formatted}` }}</div>
        <div v-if="practiceInvoice.unpaid_reason">
          {{ `For the reason: ${practiceInvoice.unpaid_reason}` }}
        </div>
      </div>

      <div class="mx-4 my-2">
        <HubzzBillingForm 
          :forViewing="true"
          :practice="practice"
          :practiceInvoice="practiceInvoice" 
          :invoiceItems="invoiceItems"
          :disputedItems="disputedItems"
          :debitItems="debitItems"
          :creditItems="creditItems"
          :dateStart="practiceInvoice.date_start"
          :dateEnd="practiceInvoice.date_end"
        />
      </div>
    </section>
  </div>
</template>
<script>
import HubzzBillingForm from "@/components/Billing/HubzzBillingForm"
export default {
  transition: {
    name: "slide",
    mode: "out-in",
  },
  components: {
    HubzzBillingForm,
  },
  computed: {
    issuedOrPaid () {
      return this.practiceInvoice.paid_at
        ? this.practiceInvoice.paid_at
        : this.practiceInvoice.issued_at
    },
  },
  async asyncData ({ app, params, }) {
    try {
      if (process.client) {
        document.body.style.cursor = "wait"
      }
      let response = await app.$axios.get(`/api/v1/me`)
      const practice = response.data.data.user.practice_detail.practice
      console.log('practice', practice)
      response = await app.$axios.get(
        `/api/v1/practice/practice-invoices/${params.id}`
      )
      const practiceInvoice = response.data
        && response.data.data
        && response.data.data.practice_invoice
        ? response.data.data.practice_invoice
        : null

      if (process.client) {
        document.body.style.cursor = "auto"
      }

      const practiceInvoiceItems = practiceInvoice.practice_invoice_items

      let invoiceItems = []
      let disputedItems = []
      let debitItems = []
      let creditItems = []
      console.log('practiceInvoiceItems', practiceInvoiceItems)
      
      for (let i = 0; i < practiceInvoiceItems.length; i++) {
        const newItem = {
          id: null,
          job_part_id: practiceInvoiceItems[i].id,
          description: practiceInvoiceItems[i].description,
          total: practiceInvoiceItems[i].total.toFixed(2),
          total_hours: practiceInvoiceItems[i].job_part ? (practiceInvoiceItems[i].job_part.final_hours)/60 : null,
        }

        if (
          practiceInvoiceItems[i].type.includes('Job Part - Approved') 
          || practiceInvoiceItems[i].type.includes('Job Part - Issued')
          || practiceInvoiceItems[i].type.includes('Job Part - Invoiced')
          || practiceInvoiceItems[i].type.includes('Job Part - To Be Invoiced')
        ) {
          console.log('normal invoice item has been pushed')
          newItem.id = invoiceItems.length + 1
          invoiceItems.push(newItem)
        } else if (practiceInvoiceItems[i].type.includes('Job Part - Disputed')){
          console.log('disputed invoice item has been pushed')
          newItem.id = disputedItems.length + 1
          disputedItems.push(newItem)
        } else if (practiceInvoiceItems[i].type.includes('Debit')) {
          console.log('debit invoice item has been pushed')
          newItem.id = debitItems.length + 1
          debitItems.push(newItem)
        } else if (practiceInvoiceItems[i].type.includes('Credit')) {
          console.log('credit invoice item has been pushed')
          newItem.id = creditItems.length + 1
          creditItems.push(newItem)
        } else {
          console.log('it didnt work lol')
        }
      }
      
      return {
        practiceInvoice,
        practice,
        invoiceItems,
        disputedItems,
        debitItems,
        creditItems,
      }
    } catch (err) {
      // if (err && err.response.status === 404) {
      //   return error({ status: 404, message: "This page could not be found" })
      // } else if (err & (err.response.status === 500)) {
      //   return error({ status: 500, message: "Something went wrong!" })
      // }
      throw err
    }
  },

  // mounted() {
  //   this.surgery_name = this.practiceInvoice.practice.name
  //   this.form.date_start = this.practiceInvoice.date_start
  //   this.form.date_end = this.practiceInvoice.date_end
  //   document.body.style.overflow = "hidden"
  // },

  destroyed () {
    document.body.style.overflow = "auto"
  },
  
  methods: {
  },
}
</script>

<style scoped>
.invoice-modal {
  position: fixed;
  top: 0;
  right: 0;
  margin-right: 0%;
  width: 100%;
  height: 100%;
  overflow: auto;
  /* border-left: solid 2px #edf2f7; */
  transition: all 0.3s ease-in-out;
  /* background-color: rgb(80, 80, 80); */
  background: #fff;
  z-index: 512;
}
@media screen and (min-width: 1200px) {
  .invoice-modal {
    width: 70%;
  }
}
.save-button {
  border-color: #ecc94b;
  background-color: #ecc94b;
}
.save-button:hover {
  color: #fff;
  /* background-color: rgb(80, 80, 80); */
  background-color: #d1b244;
  border-color: #d1b244;
  cursor: pointer;
}
.option-list {
  transition: all 0.3s ease-in-out;
  height: 0;
}
.slide-down {
  transition: all 0.3s ease-in-out;
  height: 200px;
}
/* surgery */
.loader-surgery {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  opacity: 0.5;
  color: #ccc;
}
/* absolute bg-gray-300 w-full h-full top-0 bottom-0 left-0 right-0 */
</style>
