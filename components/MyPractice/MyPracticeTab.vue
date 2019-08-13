<template>
  <div class="flex flex-row flex-wrap justify-start">
    <div
      style="font-family:Nunito"
      @click.prevent="goTo('favorites')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.query.my_practice_tab === 'favorites' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
    >Favorites</div>
    <div
      style="font-family:Nunito"
      @click.prevent="goTo('completed')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.query.my_practice_tab === 'completed' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
    >Completed</div>
    <div
      style="font-family:Nunito"
      @click.prevent="goTo('all')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.query.my_practice_tab === 'all' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
    >All</div>
    <div
      style="font-family:Nunito"
      @click.prevent="goTo('unsuccessful')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.query.my_practice_tab === 'unsuccessful' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
    >Unsuccessful</div>
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

