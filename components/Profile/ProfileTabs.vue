<template>
  <div>
    <div class="relative flex flex-nowrap">
      <div
        style="font-family:Nunito"
        @click.prevent="$store.commit('profile/SET_PROFILE_TAB', 'practice')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$store.state.profile.profileTab === 'practice' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
      >Practice</div>
      <div
        style="font-family:Nunito"
        @click.prevent="$store.commit('profile/SET_PROFILE_TAB', 'surgeries')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$store.state.profile.profileTab === 'surgeries' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
      >Branches / Surgeries</div>
    </div>
  </div>
</template>
<script>
export default {

}
</script>
