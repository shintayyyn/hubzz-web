<template>
  <div class="__layout_index w-screen h-screen flex flex-col xl:flex-row">
    <div class="__bg_logo flex justify-center items-center pt-5 pb-8">
      <div class="absolute top-0 left-0 p-1 m-1">
        <button class="bg-white text-black p-1 m-1" @click="toggle">Toggle</button>
        <a
          class="bg-white text-black p-1 m-1"
          href="https://wa.me/?text=Have+you+heard+the+buzz+about+hubzz%3F%0D%0A%0D%0AJoin+hubzz+at+locum.ml"
          target="_blank"
        >Share</a>
      </div>
      <nuxt-link to="/" class="__logo">
        <img src="~/assets/images/hubzz-logo.png" />
      </nuxt-link>
    </div>

    <div class="__main overflow-auto relative">
      <nuxt />
    </div>

    <div
      class="__privacy_notice absolute bottom-0 left-0 right-0 flex text-sm px-3 py-4"
      style="background-color: #FFDA3A"
      :style="`z-index: ${showPrivacyNotice ? 100 : -100}; opacity: ${showPrivacyNotice ? 1 : 0};`"
    >
      <div style="flex: 0 0 80%;">
        <h2>Your Privacy</h2>
        <div>
          <span>We use cookies to improve your experience on our site. To find out more, read our</span>
          <nuxt-link to="/">privacy policy.</nuxt-link>
        </div>
      </div>
      <div style="flex: 0 0 20%;" class="flex justify-end items-center">
        <button class="p-2 rounded-full shadow-lg hover:text-white" @click="acceptCookies">OK</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  middleware: 'isAuthenticated',
  // transitions: 'fade',
  async asyncData({ app }) {
    console.log('layout index asyncData')
  },

  data() {
    return {
      showPrivacyNotice: false
    }
  },

  methods: {
    acceptCookies() {
      this.$cookies.set('cookies-accepted', true)

      this.showPrivacyNotice = !this.$cookies.get('cookies-accepted')
    },

    toggle() {
      if (this.$cookies.get('cookies-accepted')) {
        this.$cookies.remove('cookies-accepted')
      } else {
        this.$cookies.set('cookies-accepted', true)
      }

      this.showPrivacyNotice = !this.$cookies.get('cookies-accepted')
    }
  },

  mounted() {
    this.showPrivacyNotice = !this.$cookies.get('cookies-accepted')
    this.$store.dispatch('signUp/getProfessions')
    this.$store.dispatch('signUp/getQualifications')
    this.$store.dispatch('signUp/getClinicalSystems')
    this.$store.dispatch('signUp/getSpokenLanguages')
    this.$store.dispatch('signUp/getPracticeTypes')
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
