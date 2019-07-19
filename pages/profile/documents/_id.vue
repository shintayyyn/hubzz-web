<template>
  <div class="modal-container shadow-lg">
    <transition name="slide" mode="out-in">
      <PracticeDocumentDetailModal :practiceDocument="practiceDocument"/>
    </transition>
    <nuxt-child/>
  </div>
</template>
<script>
import PracticeDocumentDetailModal from '@/components/Profile/PracticeDocumentDetailModal'

export default {
  components: {
    PracticeDocumentDetailModal,
  },
  async asyncData({ app, route, store, error }) {
    try {
      let response = await app.$axios.get(`/api/v1/practice/practice-documents/${route.params.id}`)
      const practiceDocument = response.data.data.practice_document

      console.log(practiceDocument)
      return {
        practiceDocument
      }
    } catch (err) {
      if (err && err.response.status === 404) {
        return error({ status: 404, message: 'This page could not be found' })
      }
      throw err
    }
  },
  beforeDestroy() {
    this.$store.commit('practiceDocuments/TOGGLE_SHIELD', false)
  },
  created() {
    console.log("it works")
    this.$store.commit('practiceDocuments/TOGGLE_SHIELD', true)
  },
}
</script>

<style scoped>
.modal-container {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  border-left: solid 2px #edf2f7;
  transition: all 0.3s ease-in-out;
  background-color: white;
  z-index: 510;
}
@media screen and (min-width: 1200px) {
  .modal-container {
    width: 80%;
  }
}
/* .modal-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 509;
} */
</style>
