<template>
  <div class="flex flex-no-wrap justify-start">
    <div
      style="font-family:Nunito"
      @click.prevent="$store.commit('invite/SET_ACTIVE_TAB', 'invite_locums')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$store.state.invite.activeTab === 'invite_locums' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
    >Invite Locums</div>
    <div
      style="font-family:Nunito"
      @click.prevent="$store.commit('invite/SET_ACTIVE_TAB', 'invite_practices')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$store.state.invite.activeTab === 'invite_practices' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
    >Invite Practices</div>
  </div>
</template>
<script>
export default {

}
</script>
