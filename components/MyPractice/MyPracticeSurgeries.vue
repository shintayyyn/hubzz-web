<template>
  <div class="list-section flex flex-col mt-4 pb-32" v-if="surgeries.length > 0">
    <div class="flex flex-row px-4 flex-no-wrap justify-between">
      <div class="text-xs sm:text-sm w-full px-1">Surgery</div>
      <div class="text-xs sm:text-sm w-full px-1">Practice code</div>
      <div class="text-xs sm:text-sm w-full px-1">CCG</div>
    </div>
    <div
      class="__job-card rounded-lg shadow-lg p-4 mt-4"
      v-for="surgery in surgeries"
      :key="surgery.id"
    >
      <div class="relative flex flex-row flex-no-wrap cursor-pointer">
        <div class="text-xs sm:text-sm w-full px-1">{{surgery.name}}</div>
        <div class="text-xs sm:text-sm w-full px-1">{{surgery.code}}</div>
        <div class="text-xs sm:text-sm w-full px-1">{{surgery.clinical_commissioning_group.name}}</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["surgeries"]
};
</script>