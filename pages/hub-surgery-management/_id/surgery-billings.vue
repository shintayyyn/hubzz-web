<template>
  <section class="billing-section">
    <div v-if="!$route.params.invoiceId" class="flex flex-row justify-start overflow-x-auto border-b border-gray-500">
      <nuxt-link
        :to="{ path: `/hub-surgery-management/${$route.params.id}/surgery-billings/invoices-from-locums` }"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('hub-surgery-management-id-surgery-billings-invoices-from-locums')? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >
        Invoices from Locums
      </nuxt-link>
      <nuxt-link
        :to="{ path: `/hub-surgery-management/${$route.params.id}/surgery-billings/invoices-from-hubzz` }"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name === 'hub-surgery-management-id-surgery-billings-invoices-from-hubzz' ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >
        Invoices from hubzz
      </nuxt-link>
    </div>
    <div>
      <nuxt-child :childPracticeId="practiceSurgery.child_practice_id" />
    </div>
  </section>
</template>

<script>
export default {
  props: {
    practiceSurgery: {
      type: Object,
      default: () => null,
    },
  },
  async asyncData ({ app, error, store, }) {
    try {
      const authPermissions = store.getters["permissions"]

      if (app.$auth.user.domain === 'Practice'
          && authPermissions.includes('View Surgery Billings') === false) {
        error({
          statusCode: 403,
          message: 'You are not authorized to view this page.',
        })
        return
      }

    } catch (err) {
      console.log('err', err.response || err)
      error({
        statusCode: 403,
        message: 'You are not authorized to view this page.',
      })
    }
  },

  transition: {
    name: "fade",
    mode: "out-in",
  },
}
</script>
