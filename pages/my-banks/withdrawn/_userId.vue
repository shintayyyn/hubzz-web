<template>
  <div class="modal-container shadow-lg">
    <div class="p-8 max-w-5xl">
      <div @click="$router.push(`/my-banks/withdrawn`)" class="cursor-pointer">
        <svgicon name="left-arrow" height="32" width="32" />
      </div>
      <div class="flex flex-row justify-start mt-8">
        <LocumTabs :locumType="'withdrawn'" :tabs="tabs" />
      </div>
      <div class="mt-5">
        <nuxt-child />
      </div>
    </div>
  </div>
</template>
<script>
const tabs = [
  'my-banks-withdrawn-userId-related-jobs-available', 'my-banks-withdrawn-userId-related-jobs-applied',
  'my-banks-withdrawn-userId-related-jobs-current', 'my-banks-withdrawn-userId-related-jobs-completed',
  'my-banks-withdrawn-userId-related-jobs-unsuccessful', 'my-banks-withdrawn-userId-related-jobs-cancelled',
  'my-banks-withdrawn-userId-related-jobs-declined', 'my-banks-withdrawn-userId-related-jobs',
]
import LocumTabs from '@/components/MyBanks/LocumTabs'
export default {
  components: {
    LocumTabs
  },
  data() {
    return {
      tabs,
    }
  }
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
</style>
