<template>
  <div class="flex flex-row flex-wrap justify-center md:justify-start">
    <div
      style="font-family:Nunito"
      @click.prevent="goTo('live')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.query.session_status === 'live' ? 'border rounded-lg border-yellow-400 bg-yellow-400' : 'text-gray-500'"
    >Live</div>
    <div
      style="font-family:Nunito"
      @click.prevent="goTo('applied')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.query.session_status === 'applied' ? 'border rounded-lg border-yellow-400 bg-yellow-400' : 'text-gray-500'"
    >Applied</div>
    <div
      style="font-family:Nunito"
      @click.prevent="goTo('allocated')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.query.session_status === 'allocated' ? 'border rounded-lg border-yellow-400 bg-yellow-400' : 'text-gray-500'"
    >Allocated</div>
    <div
      style="font-family:Nunito"
      @click.prevent="goTo('completed')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.query.session_status === 'completed' ? 'border rounded-lg border-yellow-400 bg-yellow-400' : 'text-gray-500'"
    >Completed</div>
    <div
      style="font-family:Nunito"
      @click.prevent="goTo('unfilled')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.query.session_status === 'unfilled' ? 'border rounded-lg border-yellow-400 bg-yellow-400' : 'text-gray-500'"
    >Unfilled</div>
    <div
      style="font-family:Nunito"
      @click.prevent="goTo('cancelled')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.query.session_status === 'cancelled' ? 'border rounded-lg border-yellow-400 bg-yellow-400' : 'text-gray-500'"
    >Cancelled</div>
    <div
      style="font-family:Nunito"
      @click.prevent="goTo('declined')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.query.session_status === 'declined' ? 'border rounded-lg border-yellow-400 bg-yellow-400' : 'text-gray-500'"
    >Declined</div>
  </div>
</template>
<script>
export default {
  methods: {
    goTo(type) {
      const query = {
        session_status: type
      }
      this.$router.push({ query })
    }
  }
}
</script>
