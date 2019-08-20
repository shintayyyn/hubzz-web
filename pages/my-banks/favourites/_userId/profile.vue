<template>
  <div class="max-w-5xl">
    <LocumProfile :user="user" />
  </div>
</template>
<script>
import LocumProfile from '@/components/MyBanks/LocumProfile'
export default {
  transition: {
    name: 'fade',
    mode: 'out-in'
  },
  components: {
    LocumProfile
  },
  async asyncData({ app, params, error }) {
    try {
      const response = await app.$axios.$get(`/api/v1/practice/locums/${params.userId}`)
      const user = response.data && response.data.user ? response.data.user : null
      return {
        user
      }
    } catch (err) {
      throw err
    }
  },
}
</script>


