<template>
    <div>
        surgery billing
    </div>
</template>
<script>
export default {
    async asyncData({app, route}){
      try{
        console.log('route name', route.name)
      }catch(err){
        console.log('get surgery sessions error!!!', err)
      }
    }
}
</script>
<style scoped>
.modal-container {
  z-index: 510;
}
@media screen and (min-width: 1200px) {
  .modal-container {
    width: 70%;
  }
}
</style>