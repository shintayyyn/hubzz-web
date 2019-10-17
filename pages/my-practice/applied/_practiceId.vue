<template>
  <div class="modal-container shadow-lg">
    <div class="p-4 md:p-8">
      <div @click="$router.push(`/my-practice/applied`)" class="cursor-pointer">
        <svgicon name="left-arrow" height="32" width="32" />
      </div>
      <div class="flex flex-row justify-start mt-8">
        <MyPracticeTabs :practiceType="'applied'" />
      </div>
      <div class="mt-5">
        <nuxt-child />
      </div>
    </div>
  </div>
</template>
<script>
import { gmapApi } from "vue2-google-maps";
import MyPracticeTabs from "@/components/MyPractice/MyPracticeTabs";
export default {
  components: {
    MyPracticeTabs
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