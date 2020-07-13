<template>
  <transition name="fade" mode="out-in">
    <div
      v-if="loading"
      :class="inClass"
      class="loading-shield flex flex-col items-center justify-center"
    >
      <svgicon
        v-if="spinner"
        name="loader"
        width="60"
        height="60"
        :color="color"
      />

      <h1 v-if="message" class="loader-message">
        {{ message }}
      </h1>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false,
    },

    message: {
      type: String,
      default: () => null,
    },

    spinner: {
      type: Boolean,
      default: false,
    },

    color: {
      type: String,
      default: "gray",
    },

    inClass: {
      type: String,
      default: () => null,
    },

  },
}
</script>

<style scoped>
  .loading-shield {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 45;
    background-color: rgba(255, 255, 255, 0.7);
    opacity: 0.5;
  }
  .loader-message {
    position: -webkit-sticky;
    position: sticky;
    text-align: center;
    z-index: 501;
  }
  .loader-message:after {
    content: " .";
    animation: dots 1s steps(5, end) infinite;
  }
  @keyframes dots {
    0%,
    20% {
      color: rgba(0, 0, 0, 0);
      text-shadow: 0.25em 0 0 rgba(0, 0, 0, 0), 0.5em 0 0 rgba(0, 0, 0, 0);
    }
    40% {
      color: #333;
      text-shadow: 0.25em 0 0 rgba(0, 0, 0, 0), 0.5em 0 0 rgba(0, 0, 0, 0);
    }
    60% {
      text-shadow: 0.25em 0 0 #333, 0.5em 0 0 rgba(0, 0, 0, 0);
    }
    80%,
    100% {
      text-shadow: 0.25em 0 0 #333, 0.5em 0 0 #333;
    }
  }
</style>
