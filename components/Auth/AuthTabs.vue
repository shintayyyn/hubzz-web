<template>
  <div class="flex flex-row flex-no-wrap justify-center md:mb-16">
    <button
      @click.prevent="$emit('nextTab', 'SignIn')"
      class="px-12 py-5 font-bold text-sm cursor-pointer focus:outline-none"
      :class="activeComponent === 'SignIn' ? 'rounded-full bg-yellow-500 text-black' : 'text-gray-600'"
    >Sign In</button>
    <button
      @click.prevent="$emit('nextTab', 'SignUp')"
      class="px-12 py-5 font-bold text-sm cursor-pointer focus:outline-none"
      :class="activeComponent === 'SignUp' ? 'rounded-full bg-yellow-500 text-black' : 'text-gray-600'"
    >Sign Up</button>
  </div>
</template>
<script>
export default {
  props: ["activeComponent"]
};
</script>

<style scoped>
</style>

