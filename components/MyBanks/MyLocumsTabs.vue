<template>
  <div class="flex flex-no-wrap justify-start">
    <div
      style="font-family:Nunito"
      @click.prevent="$store.commit('myBanks/SET_MY_LOCUMS_TAB', 'favourites')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$store.state.myBanks.myLocumsTabs === 'favourites' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
    >Favourites</div>
    <div
      style="font-family:Nunito"
      @click.prevent="$store.commit('myBanks/SET_MY_LOCUMS_TAB', 'all')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$store.state.myBanks.myLocumsTabs === 'all' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
    >All</div>
    <div
      style="font-family:Nunito"
      @click.prevent="$store.commit('myBanks/SET_MY_LOCUMS_TAB', 'rejected')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$store.state.myBanks.myLocumsTabs === 'rejected' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
    >Rejected</div>
  </div>
</template>

