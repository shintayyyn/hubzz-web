<template>
  <section class="billing-section">
    <div class="flex flex-row justify-start overflow-x-auto py-3">
      <nuxt-link
        v-if="practiceSurgery.allow_surgery_bill_locum === false || practiceSurgery.allow_surgery_bill_locum === 0"
        :to="{ path: `/hub-surgery-management/${$route.params.id}/surgery-billings/invoices-from-locums` }"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('hub-surgery-management-id-surgery-billings-invoices-from-locums')? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Invoices from Locums</nuxt-link>
      <nuxt-link
        v-if="practiceSurgery.allow_surgery_bill_hubzz === false || practiceSurgery.allow_surgery_bill_hubzz === 0"
        :to="{ path: `/hub-surgery-management/${$route.params.id}/surgery-billings/invoices-from-hubzz` }"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name === 'hub-surgery-management-id-surgery-billings-invoices-from-hubzz' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Invoices from hubzz</nuxt-link>
    </div>
    <div>
      <nuxt-child :childPracticeId="practiceSurgery.child_practice_id" />
    </div>
  </section>
</template>
<script>
export default {
  props: ["practiceSurgery"],
  transition: {
    name: "fade",
    mode: "out-in"
  }
};
</script>