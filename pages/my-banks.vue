<template>
  <section>
    <div class="px-10">
      <MyLocumsTabs/>
    </div>
    <div class="px-10 mt-5">
      <FavouriteLocums v-if="$store.state.myBanks.myLocumsTabs === 'favourites'"/>
      <AllLocums v-if="$store.state.myBanks.myLocumsTabs === 'all'"/>
      <RejectedLocums v-if="$store.state.myBanks.myLocumsTabs === 'rejected'"/>
    </div>
  </section>
</template>
<script>
import MyLocumsTabs from '@/components/MyBanks/MyLocumsTabs'
import FavouriteLocums from '@/components/MyBanks/FavouriteLocums'
import AllLocums from '@/components/MyBanks/AllLocums'
import RejectedLocums from '@/components/MyBanks/RejectedLocums'
export default {
  components: {
    MyLocumsTabs,
    FavouriteLocums,
    AllLocums,
    RejectedLocums
  },
  created() {
    // ! ask arvi get all favourite and all locums
  }
}
</script>
