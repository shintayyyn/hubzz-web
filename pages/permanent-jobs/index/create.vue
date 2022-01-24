<template>
  <CreatePermanentJobModal isPage />
</template>

<script>
import CreatePermanentJobModal from "@/components/PermanentJob/CreatePermanentJobModal"
export default {
  components: {
    CreatePermanentJobModal,
  },
  async asyncData ({ app, store, error, }) {
    try {
      const authPermissions = store.getters["permissions"]

      if (app.$auth.user.domain === 'Locum') {
        error({
          statusCode: 403,
          message: 'You are not authorized to view this page.',
        })
        return
      }

      if (app.$auth.user.domain === 'Practice'
          && authPermissions.includes('Create Permanent Job') === false) {
        error({
          statusCode: 403,
          message: 'You are not authorized to view this page.',
        })
        return
      }

    } catch (err) {
      error({
        statusCode: 403,
        message: 'You are not authorized to view this page.',
      })
    }
  },
}
</script>
<style scoped>
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
  .shield {
    z-index: 509;
  }
</style>
