<template>
  <div class="p-8">
    <div @click="$emit('close')" class="cursor-pointer">
      <svgicon name="left-arrow" height="32" width="32"/>
    </div>
    <div class="flex justify-start text-sm sm:text-xl mt-8">Create a new job</div>
    <div class="flex flex-row flex-wrap justify-start">
      <div class="mx-1">
        <div class="border p-2">TEST</div>
      </div>
      <div class="mx-1">
        <div class="border p-2">TEST</div>
      </div>
    </div>
  </div>
</template>
