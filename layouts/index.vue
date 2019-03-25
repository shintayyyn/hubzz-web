<template>
  <div class="__layout_index">

    <div class="__bg_logo">
      <button @click="toggle" class="absolute pin-t pin-l p-1 m-1 bg-white">Toggle</button>
      <nuxt-link to="/" class="__logo">
        <img src="~/assets/images/hubzz-logo.png">
      </nuxt-link>
    </div>

    <div class="__main">
      <nuxt/>
    </div>

    <div class="__privacy_notice" :class="showPrivacyNotice ? '' : 'hide'">
      <div class="__message">
        <h2>Your Privacy</h2>
        <div>
          <span>We use cookies to improve your experience on our site. To find out more, read our </span>
          <nuxt-link to="/">privacy policy.</nuxt-link>
        </div>
      </div>
      <div class="__button">
        <button @click="acceptCookies">OK</button>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    async asyncData ({ app }) {
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
    }
  }
</script>

<style>
  .__layout_index {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .__layout_index .__bg_logo {
    min-height: 188px;

    display: flex;
    justify-content: center;
    align-items: center;

    background-image: url('/images/hubzz-bg.png');
    background-repeat: no-repeat;
    background-size: 150%;
    background-position: right;
    background-color: #55565a;

    padding: 1.25rem 0 3.5rem 0;
  }

  .__layout_index .__main {
    flex: 1;
  }

  .__privacy_notice {
    transition: .8s;

    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;

    display: flex;

    font-size: .90rem;

    background-color: #FFDA3A;

    padding: .75rem 1rem;
  }

  .__privacy_notice.hide {
    opacity: 0;
  }

  .__privacy_notice .__message {
    flex: 0 0 80%;
  }

  .__privacy_notice .__button {
    flex: 0 0 20%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .__privacy_notice .__button button {
    padding: .5rem;
    border-radius: 1rem;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.12), 0 2px 4px 0 rgba(0, 0, 0, 0.08);
  }

  .__privacy_notice .__button button:hover {
    color: white;
  }

  @media (min-width: 1280px) {
    .__layout_index {
      flex-direction: row;
    }

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
</style>
