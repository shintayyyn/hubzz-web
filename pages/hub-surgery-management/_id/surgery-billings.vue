<template>
  <section class="billing-section">
    <div class="flex flex-row justify-start overflow-x-auto py-3">
      <nuxt-link
        :to="{ path: `/hub-surgery-management/${$route.params.id}/surgery-billings/invoices-from-locums` }"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('hub-surgery-management-id-surgery-billings-invoices-from-locums')? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >
        Invoices from Locums
      </nuxt-link>
      <nuxt-link
        :to="{ path: `/hub-surgery-management/${$route.params.id}/surgery-billings/invoices-from-hubzz` }"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name === 'hub-surgery-management-id-surgery-billings-invoices-from-hubzz' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
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
