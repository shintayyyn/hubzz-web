<template>
  <div class="h-full w-full flex flex-col overflow-auto xl:justify-center">

    <!-- <IndexTabControl/> -->

    <div class="flex justify-center items-start" style="height: 600px;">
      <div class="flex flex-col rounded-lg shadow-lg m-2 px-4 py-10" style="width: 600px;">
        <div class="flex justify-center p-2 sm:text-xl">
          <span>New to Hubzz? Get started here</span>
        </div>
        <nuxt-link class="w-3/5 self-center flex justify-center items-center rounded-lg text-black no-underline sm:text-xl p-6 m-2" to="/sign-up/locum" style="background-color: #FFDA3A;">I'm looking for work</nuxt-link>
        <nuxt-link class="w-3/5 self-center flex justify-center items-center rounded-lg text-black no-underline sm:text-xl p-6 m-2" to="/sign-up/practice" style="border: 2px solid #FFDA3A;">I'm looking for locums</nuxt-link>
      </div>
    </div>

  </div>
</template>

<script>
  // import IndexTabControl from '~/components/IndexTabControl.vue'

  export default {
    layout: 'index',

    components: {
      // IndexTabControl
    },

    async asyncData () {
      console.log('asyncData pages sign-up')
    }
  }
</script>
