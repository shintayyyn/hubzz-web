<template>
  <div class="flex justify-center items-center px-8 py-4 my-4 __tab_control">
    <nuxt-link class="py-4 px-10 outline-none rounded-full no-underline whitespace-no-wrap text-grey-darkest font-bold text-xs sm:text-base" to="/sign-in">Sign In</nuxt-link>
    <nuxt-link class="py-4 px-10 outline-none rounded-full no-underline whitespace-no-wrap text-grey-darkest font-bold text-xs sm:text-base" to="/sign-up">Sign Up</nuxt-link>
  </div>
</template>

<style>
  .__tab_control > a.nuxt-link-active {
    background-color: #FFDA3A;
    color: #000;
  }
</style>
