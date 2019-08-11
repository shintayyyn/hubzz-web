<template>
  <div class="border-solid rounded-b-lg bg-yellow-400 py-2 px-24">
    <div class="flex justify-center">
      <svgicon name="alert" height="20" width="20" />
      <div class="text-sm ml-2">Proceed to add this surgery?</div>
    </div>
    <div class="flex justify-center my-2">
      <div class="mx-2">
        <button
          class="border border-solid bg-yellow-400 hover:text-white focus:outline-none text-black font-bold py-5 rounded-lg"
          style="width:100px;"
          @click.prevent="$emit('add')"
        >Yes</button>
      </div>
      <div class="mx-2">
        <button
          class="border border-solid bg-yellow-400 hover:text-white focus:outline-none text-black font-bold py-5 rounded-lg"
          @click.prevent="$emit('close')"
          style="width:100px;"
        >Cancel</button>
      </div>
    </div>
  </div>
</template>

