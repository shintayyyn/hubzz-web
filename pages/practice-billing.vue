<template>
  <section class="billing-section">
    <div class="flex flex-row justify-start overflow-x-auto py-3">
      <nuxt-link
        :to="{ path: '/practice-billing' }"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('practice-billing-index') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Invoices from Locums</nuxt-link>
      <nuxt-link
        :to="{ name: 'practice-billing-pension-forms-from-locums' }"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('practice-billing-pension-forms-from-locums') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Pension forms from Locums</nuxt-link>
      <nuxt-link
        v-if="$auth.user.practice_detail.practice.type !== 'Spoke' || $auth.user.practice_detail.practice.allow_surgery_bill_hubzz" 
        :to="{ name: 'practice-billing-invoices-from-hubzz' }"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('practice-billing-invoices-from-hubzz') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Invoices from hubzz</nuxt-link>
    </div>
    <div>
      <nuxt-child />
    </div>
  </section>
</template>

<script>
export default {
  middleware: "isVerified",
  created (){
    console.log('auth',this.$auth.user.practice_detail.practice.type )
  }
};
</script>