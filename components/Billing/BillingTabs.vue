<template>
  <div class="relative flex flex-col md:flex-row justify-between items-end md:items-center">
    <div class="flex justify-between md:justify-start w-full md:w-4/5">
      <div
        style="font-family:Nunito"
        @click.prevent="goTo('invoices')"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.query.billing_tab === 'invoices' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
      >Invoices</div>
      <div
        style="font-family:Nunito"
        @click.prevent="goTo('invoicing-details')"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.query.billing_tab === 'invoicing-details' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
      >Invoicing details</div>
      <div
        style="font-family:Nunito"
        @click.prevent="goTo('finance-reports')"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.query.billing_tab === 'finance-reports' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
      >Finance reports</div>
      <div
        style="font-family:Nunito"
        @click.prevent="goTo('tax-reports')"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.query.billing_tab === 'tax-reports' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
      >Tax reports</div>
    </div>
    <div
      v-if="$route.query.billing_tab === 'invoices'"
      style="font-family:Nunito"
      class="w-1/5 p-3 text-sm text-right cursor-pointer"
      @click="$emit('add')"
    >
      Add invoice
      <!-- <span class="rounded-full h-4 w-4 bg-yellow-dark font-semibold text-xl px-3 py-1">+</span> -->
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    goTo(type) {
      const query = {
        ...this.$route.query,
        billing_tab: type
      }
      this.$router.push({ query })
    }
  }
}
</script>
