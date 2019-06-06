<template>
  <div class="flex flex-row flex-wrap justify-start">
    <div
      style="font-family:Nunito"
      @click.prevent="$store.commit('session/SET_ACTIVE_TAB', 'live')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$store.state.session.activeTab === 'live' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
    >Live</div>
    <div
      style="font-family:Nunito"
      @click.prevent="$store.commit('session/SET_ACTIVE_TAB', 'applied')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$store.state.session.activeTab === 'applied' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
    >Applied</div>
    <div
      style="font-family:Nunito"
      @click.prevent="$store.commit('session/SET_ACTIVE_TAB', 'allocated')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$store.state.session.activeTab === 'allocated' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
    >Allocated</div>
    <div
      style="font-family:Nunito"
      @click.prevent="$store.commit('session/SET_ACTIVE_TAB', 'completed')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$store.state.session.activeTab === 'completed' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
    >Completed</div>
    <div
      style="font-family:Nunito"
      @click.prevent="$store.commit('session/SET_ACTIVE_TAB', 'unfilled')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$store.state.session.activeTab === 'unfilled' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
    >Unfilled</div>
    <div
      style="font-family:Nunito"
      @click.prevent="$store.commit('session/SET_ACTIVE_TAB', 'cancelled')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$store.state.session.activeTab === 'cancelled' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
    >Cancelled</div>
    <div
      style="font-family:Nunito"
      @click.prevent="$store.commit('session/SET_ACTIVE_TAB', 'declined')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$store.state.session.activeTab === 'declined' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
    >Declined</div>
  </div>
</template>
<script>
export default {

}
</script>
