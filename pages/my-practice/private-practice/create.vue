<template>
  <div class="modal-container shadow-lg">
    <AddSurgeryModal
      @close="$router.push({ name: 'my-practice-private-practice' })"
      @addPractice="$emit('addPractice', $event)"
    />
  </div>
</template>
<script>
import AddSurgeryModal from "@/components/AddSurgeryModal";
export default {
  components: {
    AddSurgeryModal
  }
};
</script>
<style scoped>
.modal-container {
  z-index: 510;
}
@media screen and (min-width: 1200px) {
  .modal-container {
    width: 80%;
  }
}
</style>