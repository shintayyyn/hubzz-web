<template>
  <transition name="fade" mode="out-in">
    <div class="loading-shield flex flex-col items-center justify-center shadow-md" v-if="loading">
      <h1 :class="inClass">{{ message }}</h1>
      <svgicon name="loader" width="60" height="60" />
    </div>
  </transition>
</template>
<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      required: true
    },
    inClass: String
  }
};
</script>

<style scoped>
.loading-shield {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 49;
  background-color: #f5f6f9;
  box-shadow: 10px 10px 0.1 10px #f5f6f9;
  opacity: 0.5;
}
.loader-message {
  position: -webkit-sticky;
  position: sticky;
  top: 50%;
  text-align: center;
  /* left: 50%; */
  /* transform: translate(-50%, -50%); */
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
