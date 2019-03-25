<template>
  <div class="w-full">
    <ProgressBar :percentage="percentage"/>

    <div class="w-full p-6">

      <div class="flex w-full justify-center xl:justify-start">
        <div class="mb-6 mt-1 mx-4" style="flex: 0 1 600px;">
          <nuxt-link to="/" style="color: inherit;">
            <svgicon name="arrow-left-solid" height="32" width="32"/>
          </nuxt-link>

          <h2 class="mt-1">Sign up for a Locum account</h2>
        </div>
      </div>

      <nuxt-child/>
    </div>
  </div>
</template>

<script>
  import ProgressBar from '~/components/SignUp/ProgressBar.vue'

  export default {
    layout: 'index',

    components: {
      ProgressBar
    },

    async asyncData () {
      console.log('asyncData pages sign-up locum')
    },

    computed: {
      percentage() {
        if (this.$route.name === 'sign-up-locum-account-details') {
          return 25
        }

        if (this.$route.name === 'sign-up-locum-address-details') {
          return 50
        }

        if (this.$route.name === 'sign-up-locum-professional-details') {
          return 75
        }

        if (this.$route.name === 'sign-up-locum-credential-details') {
          return 100
        }

        return 0
      }
    }
  }
</script>
