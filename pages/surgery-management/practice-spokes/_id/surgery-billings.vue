<template>
  <section class="billing-section">
    <div class="flex flex-row justify-start overflow-x-auto py-3">
      <nuxt-link
        v-if="practiceSurgery.allow_surgery_bill_locum === false"
        :to="{ name: `surgery-management-practice-spokes-id-surgery-billings-index-invoiceId`, params: {...$route.params} }"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('surgery-management-practice-spokes-id-surgery-billings-index') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Invoices from Locums</nuxt-link>
      <!-- <nuxt-link
        v-if="practiceSurgery.allow_surgery_bill_locum === false"
        :to="{ name: `surgery-management-practice-spokes-id-surgery-billings-pension-forms-from-locums` }"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('surgery-management-practice-spokes-id-surgery-billings-pension-forms-from-locums') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Pension forms from Locums</nuxt-link>-->
      <nuxt-link
        v-if="practiceSurgery.allow_surgery_bill_hubzz === false"
        :to="{ name: `surgery-management-practice-spokes-id-surgery-billings-invoices-from-hubzz` }"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('surgery-management-practice-spokes-id-surgery-billings-invoices-from-hubzz') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
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