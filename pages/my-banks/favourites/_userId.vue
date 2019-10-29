<template>
  <div class="modal-container bg-white shadow-lg">
    <div class="p-4 md:p-8">
      <div @click="$router.push(`/my-banks/favourites`)" class="cursor-pointer">
        <svgicon name="left-arrow" height="32" width="32" />
      </div>
      <div class="flex flex-row justify-start mt-4">
        <MyLocumTabs :locumType="'favourites'" />
      </div>
      <div class="mt-4">
        <nuxt-child />
      </div>
    </div>
  </div>
</template>
<script>
import MyLocumTabs from "@/components/MyBanks/MyLocumTabs";
export default {
  components: {
    MyLocumTabs
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
