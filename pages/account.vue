<template>
  <section class="account-section">
    <div class="flex flex-row flex-wrap justify-start">
      <template v-if="$auth.user.domain === 'Locum'">
        <nuxt-link
          to="/account/general"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.name === 'account-general'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >General</nuxt-link>
        <nuxt-link
          to="/account/profile"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.name === 'account-profile'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Profile</nuxt-link>
      </template>
      <template v-else-if="$auth.user.domain === 'Practice'">
        <nuxt-link
          to="/account/user"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.name === 'account-user'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >User</nuxt-link>
      </template>
      <nuxt-link
        to="/account/change-password"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.name === 'account-change-password'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Change Password</nuxt-link>
    </div>
    <div class="mt-5">
      <nuxt-child />
    </div>
  </section>
</template>
<script>
export default {
  async asyncData({ app, store, error }) {
    store.dispatch("signUp/getProfessions");
    store.dispatch("signUp/getQualifications");
    store.dispatch("signUp/getClinicalSystems");
    store.dispatch("signUp/getSpokenLanguages");
    store.dispatch("signUp/getPracticeTypes");
    store.dispatch("signUp/getMandatoryTrainings");
  }
}
</script>
