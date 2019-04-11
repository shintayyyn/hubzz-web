<template>
  <div class="flex flex-no-wrap justify-start">
    <div style="font-family:Nunito" @click.prevent="$store.commit('account/setActiveTab', 'general')" class="mr-5 p-3 text-sm font-bold cursor-pointer" :class="$store.state.account.activeTab === 'general' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'">General</div>
    <div style="font-family:Nunito" @click.prevent="$store.commit('account/setActiveTab', 'profile')" class="mr-5 p-3 text-sm font-bold cursor-pointer" :class="$store.state.account.activeTab === 'profile' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'">Profile</div>
    <div style="font-family:Nunito" @click.prevent="$store.commit('account/setActiveTab', 'change-password')" class="mr-5 p-3 text-sm font-bold cursor-pointer" :class="$store.state.account.activeTab === 'change-password' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'">Change Password</div>
  </div>
</template>
<script>
export default {

}
</script>
