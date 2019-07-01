<template>
  <div class="flex flex-no-wrap justify-start">
    <div
      style="font-family:Nunito"
      @click.prevent="goTo('favourites')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.query.my_banks_tab === 'favourites' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
    >Favourites</div>
    <div
      style="font-family:Nunito"
      @click.prevent="goTo('all')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.query.my_banks_tab === 'all' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
    >All</div>
    <div
      style="font-family:Nunito"
      @click.prevent="goTo('rejected')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.query.my_banks_tab === 'rejected' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
    >Rejected</div>
    <div
      style="font-family:Nunito"
      @click.prevent="goTo('withdrawn')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.query.my_banks_tab === 'withdrawn' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
    >Withdrawn</div>
  </div>
</template>
<script>
export default {
  methods: {
    goTo(type) {
      const query = {
        ...this.$route.query,
        my_banks_tab: type
      }
      this.$router.push({ query })
    }
  }
}
</script>


