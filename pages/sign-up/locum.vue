<template>
  <div>
    <div>    
      <h1>locum</h1>
    </div>

    <div>
      <nuxt-link to="/">back</nuxt-link>
    </div>

    <div>
      <strong>Sign up for a Locum account</strong>
    </div>

    <nuxt-child/>
  </div>
</template>

<script>
  export default {
    layout: 'index',

    async asyncData () {
      console.log('asyncData pages sign-up locum')
    }
  }
</script>
