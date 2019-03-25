<template>
  <div>
    <h1>credential details</h1>
    <nuxt-link to="/sign-up/locum/professional-details"><<</nuxt-link>
    <button>Sign Up</button>
  </div>
</template>

<script>
  export default {
    layout: 'index',

    async asyncData ({ redirect }) {
      console.log('asyncData pages sign-up locum credential-details')
    }
  }
</script>
