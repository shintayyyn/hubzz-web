<template>
  <div class="rounded-lg shadow-lg px-8 pb-8 pt-12">
    <div class="mt-5 flex justify-center">
      <nuxt-link
        class="w-full sm:w-3/4 flex justify-center rounded-lg border-4 border-yellow-500 bg-yellow-500 shadow-md py-8 no-underline text-black font-bold text-sm sm:text-xl focus:outline-none hover:text-white"
        :to="{ name: 'locum-change-email-request' }"
      >
        Locum
      </nuxt-link>
    </div>
    <div class="mt-5 flex justify-center">
      <nuxt-link
        class="w-full sm:w-3/4 flex justify-center rounded-lg border-4 border-yellow-500 shadow-md py-8 no-underline text-black font-bold text-sm sm:text-xl focus:outline-none hover:text-white hover:bg-yellow-500"
        :to="{ name: 'practice-change-email-request' }"
      >
        Practice
      </nuxt-link>
    </div>
  </div>
</template>

<script>
  export default {

    transition: {
      name: "fade",
      mode: "out-in"
    },

    layout: "auth",
  }
</script>


