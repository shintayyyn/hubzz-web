<template>
  <section>
    <div class="px-5 mb-5">
      <div class="text-sm font-bold cursor-pointer">My Locums</div>
    </div>
    <div class="px-4 lg:px-10">
      <MyLocumsTabs/>
    </div>
    <div class="px-4 lg:px-10 mt-5">
      <FavouriteLocums v-if="$store.state.myLocums.myLocumsTabs === 'favourites'"/>
      <AllLocums v-if="$store.state.myLocums.myLocumsTabs === 'all'"/>
      <RejectedLocums v-if="$store.state.myLocums.myLocumsTabs === 'rejected'"/>
      <WithdrawnLocums v-if="$store.state.myLocums.myLocumsTabs === 'withdrawn'"/>
    </div>
  </section>
</template>
<script>
import MyLocumsTabs from '@/components/MyLocums/MyLocumsTabs'
import FavouriteLocums from '@/components/MyLocums/FavouriteLocums'
import AllLocums from '@/components/MyLocums/AllLocums'
import RejectedLocums from '@/components/MyLocums/RejectedLocums'
import WithdrawnLocums from '@/components/MyLocums/WithdrawnLocums'
export default {
  components: {
    MyLocumsTabs,
    FavouriteLocums,
    AllLocums,
    RejectedLocums,
    WithdrawnLocums
  },
  created() {
    // ! ask arvi get all favourite and all locums
  }
}
</script>
