<template>
  <section>
    <div class="px-5 mb-5">
      <div class="text-sm font-bold cursor-pointer">My Locums</div>
    </div>
    <div class="px-4 lg:px-10">
      <MyBanksTab/>
    </div>
    <div class="px-4 lg:px-10 mt-5">
      <FavouriteLocums v-if="$store.state.myBanks.activeTab === 'favourites'"/>
      <AllLocums v-if="$store.state.myBanks.activeTab === 'all'"/>
      <RejectedLocums v-if="$store.state.myBanks.activeTab === 'rejected'"/>
      <WithdrawnLocums v-if="$store.state.myBanks.activeTab === 'withdrawn'"/>
    </div>
  </section>
</template>
<script>
import MyBanksTab from '@/components/MyBanks/MyBanksTab'
import FavouriteLocums from '@/components/MyBanks/FavouriteLocums'
import AllLocums from '@/components/MyBanks/AllLocums'
import RejectedLocums from '@/components/MyBanks/RejectedLocums'
import WithdrawnLocums from '@/components/MyBanks/WithdrawnLocums'
export default {
  components: {
    MyBanksTab,
    FavouriteLocums,
    AllLocums,
    RejectedLocums,
    WithdrawnLocums
  },
}
</script>
