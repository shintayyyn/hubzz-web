<template>
  <div class="pt-2">
    <PracticePermanentJobModal isPage />
  </div>
</template>

<script>
import PracticePermanentJobModal from "@/components/PermanentJob/PracticePermanentJobModal"
export default {
  components: {
		PracticePermanentJobModal
  },
  data () {
    return{

    }
  },
  created () {
    console.log('route name', this.$route.name)
  }
}
</script>

<style>
.modal-container {
	z-index: 510;
	margin: 0;
}
@media screen and (min-width: 1200px) {
	.modal-container {
		width: 70%;
	}
}
</style>