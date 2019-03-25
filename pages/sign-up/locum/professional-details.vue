<template>
  <div>
    <h1>professional details</h1>
    <nuxt-link to="/sign-up/locum/address-details"><<</nuxt-link>
    <nuxt-link to="/sign-up/locum/credential-details">Next</nuxt-link>
  </div>
</template>

<script>
  export default {
    layout: 'index',

    async asyncData ({ redirect }) {
      console.log('asyncData pages sign-up locum professional-details')
    }
  }
</script>
