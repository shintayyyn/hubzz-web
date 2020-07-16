<template>
  <div>
    <transition name="slide">
      <div v-if="$auth.user.domain === 'Locum'">
        <LocumPermanentJobModal />
      </div>
      <div v-else class="modal-container">
        <PracticePermanentJobModal />
      </div>
    </transition>
  </div>
</template>
<script>
import LocumPermanentJobModal from "@/components/PermanentJob/LocumPermanentJobModal"
import PracticePermanentJobModal from "@/components/PermanentJob/PracticePermanentJobModal"
export default {
  components: {
    LocumPermanentJobModal,
    PracticePermanentJobModal,
  },
}
</script>

<style scoped>
.modal-container {
	z-index: 510;
	margin: 0;
}
@media screen and (min-width: 1200px) {
	.modal-container {
		width: 90%;
	}
}
</style>
