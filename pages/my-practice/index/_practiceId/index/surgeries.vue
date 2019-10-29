<template>
  <div class="list-section flex flex-col mt-4 pb-32" v-if="surgeries.length > 0">
    <div class="flex flex-row px-2 flex-no-wrap justify-between font-bold">
      <div class="text-xs sm:text-sm w-full px-1">Surgery</div>
      <div class="text-xs sm:text-sm w-full px-1 text-center">Practice code</div>
      <div class="text-xs sm:text-sm w-full px-1 text-center">CCG</div>
    </div>
    <div
      class="rounded-lg shadow-md px-2 py-3 mt-4"
      v-for="surgery in surgeries"
      :key="surgery.id"
    >
      <div class="relative flex flex-row flex-no-wrap">
        <div class="text-xs sm:text-sm w-full px-1">{{surgery.name}}</div>
        <div class="text-xs sm:text-sm w-full px-1 text-center">{{surgery.code}}</div>
        <div class="text-xs sm:text-sm w-full px-1 text-center">{{surgery.clinical_commissioning_group.name}}</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },
  props: ["practice"],
  computed: {
    surgeries() {
      return this.practice ? [this.practice.surgery] : [];
    }
  }
};
</script>