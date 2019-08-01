<template>
  <section class="jobs-section">
    <JobsTabs />
    <div class="mt-5">
      <transition name="fade" mode="out-in">
        <Component :is="activeComponent" />
      </transition>
    </div>
    <div class="modal-shield" v-if="shield"></div>
    <nuxt-child />
  </section>
</template>
<script>
import JobsTabs from '@/components/Jobs/JobsTabs'
import Allocated from '@/components/Jobs/Allocated'
import Available from '@/components/Jobs/Available'
import Matched from '@/components/Jobs/Matched'
import Applied from '@/components/Jobs/Applied'
import Unsuccessful from '@/components/Jobs/Unsuccessful'
import Declined from '@/components/Jobs/Declined'
import Cancelled from '@/components/Jobs/Cancelled'
import Completed from '@/components/Jobs/Completed'
export default {
  components: {
    JobsTabs,
    Allocated,
    Available,
    Matched,
    Applied,
    Unsuccessful,
    Declined,
    Cancelled,
    Completed
  },
  middleware: 'isVerified',
  computed: {
    activeComponent() {
      return this.$route.query.job_status
    },
    shield() {
      return this.$store.state.jobs.modal_shield
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
      job_status: this.$route.query.job_status || 'allocated'
    }
    this.$router.push({ query })
  },
  mounted() {
    this.$axios.$post('api/v1/socket/join-room', { socket_id: this.$socket.id, room_name: 'jobroom' }).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err.response.data)
    })
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

