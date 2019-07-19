<template>
    <div>
        <PracticeDocuments/>
        <div class="modal-shield" v-if="shield"></div>
    </div>
</template>

<script>
import PracticeDocuments from '@/components/Profile/PracticeDocuments'
export default {
    components: {
        PracticeDocuments
    },
    computed:{
        shield() {
        return this.$store.state.practiceDocuments.shield
        }
    },
    watch: {
        shield(value) {
            if (value) {
                document.body.style.overflow = 'hidden'
            } else {
                document.body.style.overflow = 'auto'
            }
        }
    },

}
</script>
<style scoped>
.modal-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 509;
}
</style>