<template>
  <div>
    <PracticePermanentJobModal/>
  </div>
</template>

<script>
import PracticePermanentJobModal from "@/components/PermanentJob/PracticePermanentJobModal";
export default {
  components: {
		PracticePermanentJobModal
  },
  data(){
    return{

    }
  },
  created(){
    console.log('route name', this.$route.name)
  }
}
</script>

<style>

</style>