<template>
  <section class="billing-section">
    <div class="flex flex-row justify-start overflow-x-auto py-3">
      <div class="relative">
        <nuxt-link
          to="/practice-billing/invoices-from-locums"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="$route.name.includes('practice-billing-invoices-from-locums') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Invoices from Locums</nuxt-link>
      </div>
      <div class="relative">
        <nuxt-link
          to="/practice-billing/paid-report"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="$route.name.includes('practice-billing-paid-report') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Paid report</nuxt-link>
      </div>
      <div class="relative">
        <nuxt-link
          to="/practice-billing/pension-forms-from-locums"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="$route.path === '/practice-billing/pension-forms-from-locums' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Pension forms from Locums</nuxt-link>
      </div>
      <div class="relative">
        <nuxt-link
          to="/practice-billing/invoices-from-hubzz"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
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
  middleware: "isVerified",
  data() {
    return {
      modal: false
    };
  },
  watch: {
    modal(value) {
      value
        ? (document.body.style.overflow = "hidden")
        : (document.body.style.overflow = "auto");
    }
  },
  methods: {}
};
</script>

<style scoped>
.shield {
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
