<template>
  <section>
    <div class="px-10">
      <MyLocumsTabs/>
    </div>
    <div class="px-10 mt-5">
      <FavouriteLocums v-if="$store.state.myLocums.myLocumsTabs === 'favourites'"/>
      <AllLocums v-if="$store.state.myLocums.myLocumsTabs === 'all'"/>
    </div>
  </section>
</template>
<script>
import MyLocumsTabs from '@/components/MyLocums/MyLocumsTabs'
import FavouriteLocums from '@/components/MyLocums/FavouriteLocums'
import AllLocums from '@/components/MyLocums/AllLocums'
export default {
  components: {
    MyLocumsTabs,
    FavouriteLocums,
    AllLocums
  },
  created() {
    // ! ask arvi get all favourite and all locums
  }
}
</script>
