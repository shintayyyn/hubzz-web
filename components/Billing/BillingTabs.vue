<template>
  <div class="flex flex-no-wrap justify-start">
    <div
      style="font-family:Nunito"
      @click.prevent="goTo('invoices')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.query.billing_tab === 'invoices' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
    >Invoices</div>
    <div
      style="font-family:Nunito"
      @click.prevent="goTo('invoicing-details')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.query.billing_tab === 'invoicing-details' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
    >Invoicing details</div>
    <div
      style="font-family:Nunito"
      @click.prevent="goTo('finance-reports')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.query.billing_tab === 'finance-reports' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
    >Finance reports</div>
    <div
      style="font-family:Nunito"
      @click.prevent="goTo('tax-reports')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.query.billing_tab === 'tax-reports' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
    >Tax reports</div>
    <div
      v-if="$route.query.billing_tab === 'invoices'"
      style="font-family:Nunito"
      class="mr-5 p-3 text-sm cursor-pointer absolute pin-r"
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
