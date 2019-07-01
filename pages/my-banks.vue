<template>
  <section class="my-banks-section">
    <div class="mb-5 text-sm font-bold cursor-pointer">My Locums</div>
    <MyBanksTab/>
    <div class="mt-5">
      <transition name="fade" mode="out-in">
        <Component :is="activeComponent"/>
      </transition>
    </div>
  </section>
</template>
<script>
import MyBanksTab from '@/components/MyBanks/MyBanksTab'
import Favourites from '@/components/MyBanks/Favourites'
import All from '@/components/MyBanks/All'
import Rejected from '@/components/MyBanks/Rejected'
import Withdrawn from '@/components/MyBanks/Withdrawn'
export default {
  components: {
    MyBanksTab,
    Favourites,
    All,
    Rejected,
    Withdrawn
  },
  created() {
    const query = {
      ...this.$route.query,
      my_banks_tab: this.$route.query.my_banks_tab || 'favourites'
    }
    this.$router.push({ query })
  },
  computed: {
    activeComponent() {
      return this.$route.query.my_banks_tab
    }
  },
}
</script>
