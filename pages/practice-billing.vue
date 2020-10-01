<template>
  <section class="billing-section">
    <div class="flex flex-row justify-start overflow-x-auto py-3">
      <nuxt-link
        :to="{ path: '/practice-billing/invoices-from-locums' }"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('practice-billing-invoices-from-locums') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >
        Invoices from Locums
      </nuxt-link>

      <!-- <nuxt-link
        :to="{ name: 'practice-billing-pension-forms-from-locums' }"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('practice-billing-pension-forms-from-locums') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Pension forms from Locums</nuxt-link>-->

      <nuxt-link
        v-if="authPermissions.includes('View Billings')"
        :to="{ name: 'practice-billing-invoices-from-hubzz'}"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('practice-billing-invoices-from-hubzz') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >
        Invoices from hubzz
      </nuxt-link>

      <nuxt-link
        v-if="practice
          && (practice.type !== 'Spoke' 
          || (practice.type === 'Spoke' && !practice.parent_practice_id) 
          || (practice.type === 'Spoke' && practice.parent_practice_id && practice.allow_surgery_bill_hubzz))
          && authPermissions.includes('View Billings')"
        :to="{ name: 'practice-billing-invoicing-details' }"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('practice-billing-invoicing-details') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >
        Invoicing Details
      </nuxt-link>

      <nuxt-link
        :to="{ name: 'practice-billing-finance-reports-hq-invoice' }"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('practice-billing-finance-reports') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >
        Finance Reports
      </nuxt-link>

      <nuxt-link
        :to="{ name: 'practice-billing-reports' }"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('practice-billing-reports') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >
        Reports
      </nuxt-link>
    </div>

    <div>
      <nuxt-child />
    </div>
  </section>
</template>

<script>
export default {
  middleware: "isVerified",

  transition: (to, from) => {
    if (
      (from && from.name.includes('practice-billing-reports'))
      || (to && to.name.includes('practice-billing-reports'))
    ) {
      return {
        name: '',
        mode: 'out-in',
      }
    }
    
    return {
      name: 'page',
      mode: 'out-in',
    }
  },

  data () {
    return {
      practice: null,
    }
  },

  computed: {
    authPermissions () {
      return this.$store.getters["permissions"]
    },
  },

  async asyncData ({ app, store, error, }) {
    try {
      const authPermissions = store.getters["permissions"]

      if (!app.$auth.user || app.$auth.user.domain === 'Locum') {
        error({
          statusCode: 403,
          message: 'You are not authorized to view this page.',
        })

        return
      }

      if (app.$auth.user.domain === 'Practice'
          && authPermissions.includes('View Billings') === false) {
        error({
          statusCode: 403,
          message: 'You are not authorized to view this page.',
        })
        return
      }

      if (app.$auth.user.domain === 'Practice' 
        && app.$auth.user.practice_detail 
        && app.$auth.user.practice_detail.practice
        && app.$auth.user.practice_detail.practice.type === 'Spoke'
        && app.$auth.user.practice_detail.practice.parent_practice_id === null) {
        error({
          statusCode: 403,
          message: 'You are not authorized to view this page.',
        })

        return
      }

      return {
        practice: app.$auth.user && app.$auth.user.domain === 'Practice' && app.$auth.user.practice_detail
          ? app.$auth.user.practice_detail.practice
          : null,
      }
    } catch (err) {
      console.log('err', err.response || err)
      error(err)
    }
  },

  mounted () {
    if (this.$route.name === "practice-billing") {
      this.$router.push("/practice-billing/invoices-from-locums")
    }
  },
}
</script>
