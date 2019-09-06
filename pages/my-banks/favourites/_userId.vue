<template>
  <div class="modal shadow-lg">
    <div class="p-8 max-w-5xl">
      <div @click="$router.push(`/my-banks/favourites`)" class="cursor-pointer">
        <svgicon name="left-arrow" height="32" width="32" />
      </div>
      <div class="flex flex-row justify-start mt-8">
        <MyLocumTabs :locumType="'favourites'" />
      </div>
      <div class="mt-5">
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
.modal {
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
  .modal {
    width: 80%;
  }
}
</style>
