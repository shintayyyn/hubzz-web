<template>
  <div class="flex flex-nowrap justify-start px-5">
    <template v-if="$auth.user.domain === 'Locum'">
      <nuxt-link to="/account/general">
        <div
          style="font-family:Nunito"
          class="mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.path === '/account/general' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
        >General</div>
      </nuxt-link>
      <nuxt-link to="/account/profile">
        <div
          style="font-family:Nunito"
          class="mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.path === '/account/profile' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
        >Profile</div>
      </nuxt-link>
    </template>
    <template v-else-if="$auth.user.domain === 'Practice'">
      <nuxt-link to="/account/user">
        <div
          style="font-family:Nunito"
          class="mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.path === '/account/user' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
        >User</div>
      </nuxt-link>
    </template>
    <nuxt-link to="/account/change-password">
      <div
        style="font-family:Nunito"
        class="mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.path === '/account/change-password' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
      >Change Password</div>
    </nuxt-link>
  </div>
</template>
<style scoped>
a {
  text-decoration: none;
  color: black;
}
</style>


