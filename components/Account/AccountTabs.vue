<template>
  <div class="flex flex-no-wrap justify-start">
    <template v-if="$auth.user.domain === 'Locum'">
      <div
        style="font-family:Nunito"
        @click.prevent="$store.commit('account/setActiveTab', 'general')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$store.state.account.accountTab === 'general' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
      >General</div>
      <div
        style="font-family:Nunito"
        @click.prevent="$store.commit('account/setActiveTab', 'profile')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$store.state.account.accountTab === 'profile' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
      >Profile</div>
    </template>
    <template v-else-if="$auth.user.domain === 'Practice'">
      <div
        style="font-family:Nunito"
        @click.prevent="$store.commit('account/setActiveTab', 'user')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$store.state.account.accountTab === 'user' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
      >User</div>
    </template>
    <div
      style="font-family:Nunito"
      @click.prevent="$store.commit('account/setActiveTab', 'change-password')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$store.state.account.accountTab === 'change-password' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
    >Change Password</div>
  </div>
</template>

