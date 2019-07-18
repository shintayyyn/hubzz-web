<template>
  <section class="sessions-tab">
    <SessionsTabs/>
    <div class="mt-5">
      <transition name="fade" mode="out-in">
        <Component :is="activeComponent"/>
      </transition>
    </div>
    <div class="modal-shield" v-if="shield"></div>
    <nuxt-child/>
  </section>
</template>
<script>
import SessionsTabs from '@/components/Sessions/SessionsTabs'
import Live from '@/components/Sessions/Live'
import Applied from '@/components/Sessions/Applied'
import Allocated from '@/components/Sessions/Allocated'
import Completed from '@/components/Sessions/Completed'
import Unfilled from '@/components/Sessions/Unfilled'
import Cancelled from '@/components/Sessions/Cancelled'
import Declined from '@/components/Sessions/Declined'
export default {
  components: {
    SessionsTabs,
    Live,
    Applied,
    Allocated,
    Completed,
    Unfilled,
    Cancelled,
    Declined,
  },
  middleware:'isVerified',
  computed: {
    activeComponent() {
      return this.$route.query.session_status
    },
    shield() {
      return this.$store.state.jobs.shield
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
  created() {
    const query = {
      ...this.$route.query,
      session_status: this.$route.query.session_status || 'live'
    }
    this.$router.push({ query })
  }
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

