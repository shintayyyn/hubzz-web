<template>
  <div class="flex flex-no-wrap justify-start">
    <div
      style="font-family:Nunito"
      @click.prevent="goTo('favorites')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.query.my_practice_tab === 'favorites' ? 'border rounded-lg border-yellow-400 bg-yellow-400' : 'text-gray-500'"
    >Favorites</div>
    <div
      style="font-family:Nunito"
      @click.prevent="goTo('completed')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.query.my_practice_tab === 'completed' ? 'border rounded-lg border-yellow-400 bg-yellow-400' : 'text-gray-500'"
    >Completed</div>
    <div
      style="font-family:Nunito"
      @click.prevent="goTo('all')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.query.my_practice_tab === 'all' ? 'border rounded-lg border-yellow-400 bg-yellow-400' : 'text-gray-500'"
    >All</div>
    <div
      style="font-family:Nunito"
      @click.prevent="goTo('unsuccessful')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.query.my_practice_tab === 'unsuccessful' ? 'border rounded-lg border-yellow-400 bg-yellow-400' : 'text-gray-500'"
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

