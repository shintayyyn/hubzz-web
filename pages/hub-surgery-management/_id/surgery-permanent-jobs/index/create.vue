<template>
  <CreatePermanentJobModal />
</template>

<script>
import CreatePermanentJobModal from "@/components/PermanentJob/CreatePermanentJobModal"

export default {
  components: {
    CreatePermanentJobModal,
  },
}
</script>

<style>
  .wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: auto;
    transition: all 0.3s ease-in-out;
    scroll-behavior: smooth;
  }

  .modal-container {
    z-index: 510;
  }
  @media (min-width: 1200px) {
    .modal-container {
      width: 80%;
    }
  }
</style>
