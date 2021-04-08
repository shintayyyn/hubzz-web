<template>
  <div class="flex flex-row justify-start overflow-x-auto border-b border-gray-500 mb-4 pt-1">
    <nuxt-link
      v-if="false"
      :to="{ name: 'locum-billing-private-invoices', query: { ...$route.query, status: 'issued' } }"
      class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
      :class="$route.name.includes('locum-billing-private-invoices') && $route.query.status === 'issued' ? 'border-b-4 border-gray-500' : 'text-gray-600'"
    >
      (OLD) Invoiced
    </nuxt-link>

    <nuxt-link
      v-if="false && $auth.user.locum_detail.profession.profession_category.name === 'GP'"
      :to="{ name: 'locum-billing-private-invoices', query: { ...$route.query, status: 'solo-form' } }"
      class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
      :class=" $route.name.includes('locum-billing-private-invoices') && ($route.query.status && $route.query.status.toLowerCase() === 'solo-form') ? 'border-b-4 border-gray-500' : 'text-gray-600'"
    >
      (OLD) Solo Forms
    </nuxt-link>

    <nuxt-link
      v-if="false && $auth.user.locum_detail.profession.profession_category.name === 'GP'"
      :to="{ name: 'locum-billing-private-invoices', query: { ...$route.query, status: 'pension-form-a' } }"
      class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
      :class=" $route.name.includes('locum-billing-private-invoices') && $route.query.status === 'pension-form-a' ? 'border-b-4 border-gray-500' : 'text-gray-600'"
    >
      (OLD) NHS Pensions Form A
    </nuxt-link>

    <nuxt-link
      v-if="false && $auth.user.locum_detail.profession.profession_category.name === 'GP'"
      :to="{ name: 'locum-billing-private-invoices', query: { ...$route.query, status: 'pension-form-b' } }"
      class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
      :class="$route.name.includes('locum-billing-private-invoices') && $route.query.status === 'pension-form-b' ? 'border-b-4 border-gray-500' : 'text-gray-600'"
    >
      (OLD) NHS Pensions Form B
    </nuxt-link>

    <nuxt-link
      :to="{ name: 'locum-billing-private-to-be-invoiced' }"
      class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
      :class="$route.name.includes('locum-billing-private-to-be-invoiced') ? 'border-b-4 border-gray-500' : 'text-gray-600'"
    >
      To be invoiced
    </nuxt-link>

    <nuxt-link
      :to="{ name: 'locum-billing-private-invoiced' }"
      class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
      :class="$route.name.includes('locum-billing-private-invoiced') ? 'border-b-4 border-gray-500' : 'text-gray-600'"
    >
      Invoiced
    </nuxt-link>

    <nuxt-link
      v-if="$auth.user.locum_detail.profession.profession_category.name === 'GP'"
      :to="{ name: 'locum-billing-private-solo-forms' }"
      class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
      :class="$route.name.includes('locum-billing-private-solo-forms') ? 'border-b-4 border-gray-500' : 'text-gray-600'"
    >
      Solo Forms
    </nuxt-link>

    <nuxt-link
      v-if="$auth.user.locum_detail.profession.profession_category.name === 'GP'"
      :to="{ name: 'locum-billing-private-form-as' }"
      class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
      :class="$route.name.includes('locum-billing-private-form-as') ? 'border-b-4 border-gray-500' : 'text-gray-600'"
    >
      NHS Pensions Form A
    </nuxt-link>

    <nuxt-link
      v-if="$auth.user.locum_detail.profession.profession_category.name === 'GP'"
      :to="{ name: 'locum-billing-private-form-bs' }"
      class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
      :class="$route.name.includes('locum-billing-private-form-bs') ? 'border-b-4 border-gray-500' : 'text-gray-600'"
    >
      NHS Pensions Form B
    </nuxt-link>
  </div>
</template>
