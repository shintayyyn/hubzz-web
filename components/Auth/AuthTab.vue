<template>
  <div class="flex justify-center items-center my-8">
    <div class="px-12 py-5 font-bold"
      :class="$store.state.activeTab === 'sign_in' ? 'rounded-full bg-yellow-dark':'text-grey cursor-pointer'"
      @click.prevent="$store.commit('SET_ACTIVE_TAB', 'sign_in')">Sign In</div>
    <div class="px-12 py-5 font-bold"
      :class="$store.state.activeTab === 'sign_up' ? 'rounded-full bg-yellow-dark':'text-grey cursor-pointer'"
      @click.prevent="$store.commit('SET_ACTIVE_TAB', 'sign_up')">Sign Up</div>
  </div>
</template>


