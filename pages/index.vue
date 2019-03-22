<template>
  <div>
    <div>
      <strong>
        <big>Index</big>
      </strong>
    </div>
  </div>
</template>

<script>
  export default {
    async asyncData({ store, redirect }) {
      try {
        if (!store.$auth.loggedIn) {
          redirect('/sign-in')
          return
        }
      } catch (err) {
        console.log('index asyncData pages index err', err)
      }
    }
  }
</script>
