<template>
  <section class="billing-section">
    <div class="flex flex-row justify-start overflow-x-auto py-3">
      <nuxt-link
        :to="{ path: `/surgery-management/practice-spokes/${$route.params.id}/surgery-billings` }"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name === 'surgery-management-practice-spokes-id-surgery-billings-index' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Invoices from Locums</nuxt-link>
      <nuxt-link
        :to="{ path: `/surgery-management/practice-spokes/${$route.params.id}/surgery-billings/pension-forms-from-locums` }"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('surgery-management-practice-spokes-id-surgery-billings-pension-forms-from-locums') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Pension forms from Locums</nuxt-link>
      <nuxt-link
        :to="{ path: `/surgery-management/practice-spokes/${$route.params.id}/surgery-billings/invoices-from-hubzz` }"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('surgery-management-practice-spokes-id-surgery-billings-invoices-from-hubzz') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Invoices from hubzz</nuxt-link>
    </div>
    <div>
      <nuxt-child />
    </div>
  </section>
</template>
<script>
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },
  data(){
    return{
      practice_surgery: ''
    }
  },
  async asyncData({ app, route, store }) {
    try {
      console.log("route name", route.name);
      let response = await app.$axios.$get(`/api/v1/practice/me/practice-surgeries/${route.params.id}`)
      const practice_surgery = response.data.practice_surgery
      console.log('practice surgery', practice_surgery)
      return {
        practice_surgery
      }
    } catch (err) {
      console.log("get surgery sessions error!!!", err);
    }
  }
};
</script>