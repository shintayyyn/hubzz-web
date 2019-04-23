<template>
  <div>
    <h1>index</h1>
  </div>
</template>

<script>
  export default {
    layout: 'index',

    async asyncData ({ redirect }) {
      console.log('asyncData pages sign-up locum index')
      redirect('/sign-up/locum/account-details')
    }
  }
</script>
