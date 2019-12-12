<template>
  <section class="billing-section">
    <div class="flex flex-row justify-start overflow-x-auto py-3">
      <div class="relative">
        <nuxt-link
          to="/practice-billing"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="$route.path === '/practice-billing' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Invoices from Locums</nuxt-link>
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
  middleware: "isVerified"
};
</script>