<template>
  <div class="flex flex-row flex-wrap justify-start">
    <div
      style="font-family:Nunito"
      @click.prevent="goTo('live')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.query.session_status === 'live' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
    >Live</div>
    <div
      style="font-family:Nunito"
      @click.prevent="goTo('applied')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.query.session_status === 'applied' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
    >Applied</div>
    <div
      style="font-family:Nunito"
      @click.prevent="goTo('allocated')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.query.session_status === 'allocated' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
    >Allocated</div>
    <div
      style="font-family:Nunito"
      @click.prevent="goTo('completed')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.query.session_status === 'completed' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
    >Completed</div>
    <div
      style="font-family:Nunito"
      @click.prevent="goTo('unfilled')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.query.session_status === 'unfilled' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
    >Unfilled</div>
    <div
      style="font-family:Nunito"
      @click.prevent="goTo('cancelled')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.query.session_status === 'cancelled' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
    >Cancelled</div>
    <div
      style="font-family:Nunito"
      @click.prevent="goTo('declined')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.query.session_status === 'declined' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
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
