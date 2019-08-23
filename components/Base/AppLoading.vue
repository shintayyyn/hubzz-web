<template>
  <div class="loading-shield shadow-md" v-if="loading">
    <h1 class="loader-message" :class="inClass">Loading</h1>
  </div>
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
}
</script>

<style scoped>
.loading-shield {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 400;
  background-color: #f5f6f9;
  box-shadow: 10px 10px 0.1 10px #f5f6f9;
  opacity: 0.5;
}
.loader-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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
