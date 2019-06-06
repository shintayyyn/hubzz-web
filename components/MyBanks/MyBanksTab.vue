<template>
  <div class="flex flex-no-wrap justify-start">
    <div
      style="font-family:Nunito"
      @click.prevent="$store.commit('myBanks/setActiveTab', 'favourites')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$store.state.myBanks.activeTab === 'favourites' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
    >Favourites</div>
    <div
      style="font-family:Nunito"
      @click.prevent="$store.commit('myBanks/setActiveTab', 'all')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$store.state.myBanks.activeTab === 'all' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
    >All</div>
    <div
      style="font-family:Nunito"
      @click.prevent="$store.commit('myBanks/setActiveTab', 'rejected')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$store.state.myBanks.activeTab === 'rejected' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
    >Rejected</div>
    <div
      style="font-family:Nunito"
      @click.prevent="$store.commit('myBanks/setActiveTab', 'withdrawn')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$store.state.myBanks.activeTab === 'withdrawn' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
    >Withdrawn</div>
  </div>
</template>

