<template>
  <div class="flex flex-row flex-no-wrap justify-center md:mb-16">
    <div
      @click.prevent="$emit('nextTab', 'SignIn')"
      class="px-12 py-5 font-bold text-sm cursor-pointer"
      :class="activeComponent === 'SignIn' ? 'rounded-full bg-yellow-400 text-black' : 'text-grey-darker'"
    >Sign In</div>
    <div
      @click.prevent="$emit('nextTab', 'SignUp')"
      class="px-12 py-5 font-bold text-sm cursor-pointer"
      :class="activeComponent === 'SignUp' ? 'rounded-full bg-yellow-400 text-black' : 'text-grey-darker'"
    >Sign Up</div>
  </div>
</template>
<script>
export default {
  props: ["activeComponent"]
};
</script>

<style scoped>
</style>

