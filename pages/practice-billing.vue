<template>
  <section class="billing-section">
    <div class="relative flex flex-col md:flex-row justify-between items-end md:items-center">
      <div class="flex justify-between md:justify-start w-full md:w-4/5">
        <nuxt-link
          style="font-family:Nunito"
          to="/practice-billing/invoices-from-locums"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.path === '/practice-billing/invoices-from-locums' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Invoices from Locums</nuxt-link>
        <nuxt-link
          style="font-family:Nunito"
          to="/practice-billing/paid-report"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.path === '/practice-billing/paid-report' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Paid report</nuxt-link>
        <nuxt-link
          style="font-family:Nunito"
          to="/practice-billing/pension-forms-from-locums"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.path === '/practice-billing/pension-forms-from-locums' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Pension forms from Locums</nuxt-link>
        <nuxt-link
          style="font-family:Nunito"
          to="/practice-billing/invoices-from-hubzz"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.path === '/practice-billing/invoices-from-hubzz' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Invoices from hubzz</nuxt-link>
      </div>
    </div>

    <div class="mt-5">
      <nuxt-child />
    </div>
  </section>
</template>

<script>
export default {
  middleware: 'isVerified',
  data() {
    return {
      modal: false
    }
  },
  watch: {
    modal(value) {
      value ? document.body.style.overflow = 'hidden' : document.body.style.overflow = 'auto'
    }
  },
  methods: {

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
</style>
