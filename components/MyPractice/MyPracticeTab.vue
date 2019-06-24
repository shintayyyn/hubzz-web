<template>
  <div class="flex flex-no-wrap justify-start">
    <div
      style="font-family:Nunito"
      @click.prevent="goTo('favourites')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.query.my_practice_tab === 'favourites' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
    >Favourites</div>
    <div
      style="font-family:Nunito"
      @click.prevent="goTo('all')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.query.my_practice_tab === 'all' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
    >All</div>
  </div>
</template>
<script>
export default {
  methods: {
    goTo(type) {
      const query = {
        ...this.$route.query,
        my_practice_tab: type
      }
      this.$router.push({ query })
    }
  }
}
</script>

