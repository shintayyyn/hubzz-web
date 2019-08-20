<template>
  <div class="modal shadow-lg">
    <div class="p-8 max-w-4xl">
      <div @click="$router.push('/my-banks/favourites')" class="cursor-pointer">
        <svgicon name="left-arrow" height="32" width="32" />
      </div>

      <div class="flex flex-no-wrap mt-4 ml-6 justify-start">
        <nuxt-link
          :to="`/my-banks/favourites/${$route.params.id}`"
          class="mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.name === 'my-banks-favourites-ids' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Profile</nuxt-link>
        <nuxt-link
          :to="`/my-banks/favourites/${$route.params.id}/related-jobs`"
          class="mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.name === 'my-banks-favourites-ids-related-jobs' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Related Jobs</nuxt-link>
      </div>

      <nuxt-child />
      <!-- <div>
        <transition name="fade" mode="out-in">
          <Component :is="activeComponent" :user="user" :jobs="jobs" />
        </transition>
      </div>-->
    </div>
  </div>
</template>
<script>
import LocumDetailModalTabs from '@/components/MyBanks/LocumDetailModalTabs'
import LocumDetailModal from '@/components/MyBanks/LocumDetailModal'
import LocumJobs from '@/components/MyBanks/LocumJobs'
export default {
  props: ['user', 'jobs'],
  components: {
    LocumDetailModalTabs,
    locum_detail: LocumDetailModal,
    locum_jobs: LocumJobs
  },

  computed: {
    activeComponent() {
      return this.$route.query.my_locum
    }
  },
}
</script>
<style scoped>
.modal {
  position: fixed;
  top: 0;
  right: 0;
  margin-right: 0%;
  width: 100%;
  height: 100%;
  overflow: auto;
  /* border-left: solid 2px #edf2f7; */
  transition: all 0.3s ease-in-out;
  /* background-color: rgb(80, 80, 80); */
  background: #fff;
  z-index: 512;
}
@media screen and (min-width: 1200px) {
  .modal {
    width: 70%;
  }
}
</style>
