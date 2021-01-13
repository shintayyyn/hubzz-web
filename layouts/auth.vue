<template>
  <div class="w-screen h-screen flex flex-col overflow-hidden">
    <!-- <div class="__bg_logo flex justify-center items-center pt-5 pb-8">
      <div class="absolute top-0 left-0 p-1 m-1">
        <template v-if="false">
          <button class="bg-white text-black p-1 m-1" @click="toggle">
            Toggle
          </button>
          <a class="bg-white text-black p-1 m-1"
             href="https://wa.me/?text=Have+you+heard+the+buzz+about+hubzz%3F%0D%0A%0D%0AJoin+hubzz+at+locum.ml"
             target="_blank"
          >Share</a>
          <a class="bg-white text-black p-1 m-1"
             href="whatsapp://send?text=Have+you+heard+the+buzz+about+hubzz%3F%0D%0A%0D%0AJoin+hubzz+at+locum.ml"
             data-action="share/whatsapp/share" target="_blank"
          >Share ..</a>
        </template>
      </div>
      <nuxt-link to="/" class="__logo">
        <img src="~/assets/images/hubzz-logo.png">
      </nuxt-link>
    </div> -->

    <div class="__main relative h-full">
      <nuxt />
      <div class="absolute bottom-0">
        <AppNotification />
      </div>
    </div>

    <div class="__privacy_notice md:w-1/2 mx-auto mb-2 absolute bottom-0 left-0 right-0 flex text-sm px-3 py-4 rounded-lg" 
         style="background-color: #f9a423"
         :style="`z-index: ${showPrivacyNotice ? 100 : -100}; opacity: ${showPrivacyNotice ? 1 : 0};`"
    >
      <div  class="flex items-center justify-between w-full px-8">
        <h2 class="font-bold">
          Cookie Policy
        </h2>
        <div class="text-center">
          <p>We use cookies to improve your experience on our site.</p>
          <p>To find out more, read our
          <nuxt-link to="/" class="underline hover:no-underline">
            privacy policy.
          </nuxt-link></p>
        </div>
        <div class="flex justify-end items-center">
          <button class="" @click="acceptCookies">
            <svgicon
              name="times-solid"
              width="18"
              height="18"
              class="fill-current mr-1"
            />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import AppNotification from "@/components/AppNotification"
  export default {
    components: {
      AppNotification
    },

    middleware: "isAuthenticated",

    transitions: "fade",

    data () {
      return {
        showPrivacyNotice: false,
      }
    },

    mounted () {
      this.showPrivacyNotice = !this.$cookies.get("cookies-accepted")
      this.$store.dispatch("sign-up/getProfessions")
      this.$store.dispatch("sign-up/getQualifications")
      this.$store.dispatch("sign-up/getClinicalSystems")
      this.$store.dispatch("sign-up/getSpokenLanguages")
      this.$store.dispatch("sign-up/getPracticeTypes")
      this.$store.dispatch("sign-up/getMandatoryTrainings")
    },

    methods: {
      acceptCookies () {
        this.$cookies.set("cookies-accepted", true)

        this.showPrivacyNotice = !this.$cookies.get("cookies-accepted")
      },

      toggle () {
        if (this.$cookies.get("cookies-accepted")) {
          this.$cookies.remove("cookies-accepted")
        } else {
          this.$cookies.set("cookies-accepted", true)
        }

        this.showPrivacyNotice = !this.$cookies.get("cookies-accepted")
      }
    }
  }
</script>

<style>
  
  .__privacy_notice {
    transition: 0.8s;
  }

  .__layout_index .__bg_logo {
    background-image: url("/images/hubzz-bg.png");
    background-repeat: no-repeat;
    background-size: 150%;
    background-position: right;
    background-color: #55565a;
  }

  .__layout_index .__main {
    flex: 1;
  }

  .__logo {
    zoom: 0.75;
  }

  @media (min-width: 1200px) {
    .__layout_index .__bg_logo {
      flex: 0 0 40%;
      background-size: 175%;
      background-position: top right;
    }

    .__layout_index .__main {
      flex: 0 0 60%;
    }

    .__logo {
      zoom: 1.25;
    }
  }

  /* .fade-enter-active,
.fade-leave-active {
  transition: all 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
} */
</style>