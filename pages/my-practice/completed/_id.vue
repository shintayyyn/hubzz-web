<template>
  <div class="modal shadow-lg">
    <MyPracticeDetailModal :practice="practice" @close="$router.push('/my-practice/completed')" />
  </div>
</template>
<script>
import { gmapApi } from 'vue2-google-maps'
import MyPracticeDetailModal from '@/components/MyPractice/MyPracticeDetailModal'
export default {
  transition: {
    name: 'slide',
    mode: 'out-in'
  },
  components: {
    MyPracticeDetailModal
  },
  computed: {
    google: gmapApi,
    latLang() {
      return this.practice.surgery.address.coordinates
    },
  },
  async asyncData({ app, error, params }) {
    try {
      const response = await app.$axios.$get(`/api/v1/locum/practices/${params.id}`)
      const practice = response.data && response.data.practice ? response.data.practice : null
      return {
        practice
      }
    } catch (err) {
      console.log(err)
    }
  },
}
</script>
