<template>
  <div class="flex flex-row flex-wrap justify-start">
    <template v-if="$auth.user.domain === 'Locum'">
      <div
        @click.prevent="goTo('general')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.query.account_tab === 'general' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >General</div>
      <div
        @click.prevent="goTo('profile')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.query.account_tab === 'profile' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Profile</div>
    </template>
    <template v-else-if="$auth.user.domain === 'Practice'">
      <div
        @click.prevent="goTo('user')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.query.account_tab === 'user' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >User</div>
    </template>
    <div
      @click.prevent="goTo('change-password')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.query.account_tab === 'change-password' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
    >Change Password</div>
  </div>
</template>
<script>
export default {
  methods: {
    goTo(type) {
      const query = {
        ...this.$route.query,
        account_tab: type
      }
      this.$router.push({ query })
    }
  }
}
</script>

<style scoped>
</style>


