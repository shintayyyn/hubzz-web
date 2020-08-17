<template>
  <div>
    <div class="flex flex-col">
      <nuxt-link
        v-for="report in reports"
        :key="`reports-${report.title}`"
        :to="report.url"
        class="inline-flex no-underline w-full py-2 md:p-3 rounded-lg shadow-lg hover:bg-gray-300 transition-hover my-2"
      >
        <div class="flex flex-no-wrap items-center text-sm w-full">
          <span class="px-2 whitespace-no-wrap font-semibold">{{ report.title }}</span>
          <span class="px-2 w-full leading-tight flex items-center">{{ report.subtitle }}</span>
          <div class="flex items-center px-1 md:px-0">
            <svgicon name="arrow-right" width="21" height="21" color="black" />
          </div>
        </div>
      </nuxt-link>
    </div>
    <nuxt-link
      v-if="$route.name !== 'practice-billing-invoices-from-hubzz-hubzz-billing-reports'"
      class="shield z-511 fixed inset-0 opacity-50"
      to="/practice-billing/invoices-from-hubzz/hubzz-billing-reports"
    />
    <nuxt-child />
  </div>
</template>

<script>
export default {
  data () {
    return {
      reports: [
        {
          title: 'REP-010',
          subtitle: 'Hubzz Invoices',
          url: '/practice-billing/invoices-from-hubzz/hubzz-billing-reports/practice-invoices',
        },
      ]
    }
  }
}
</script>

<style>

</style>