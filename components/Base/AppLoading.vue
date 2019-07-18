<template>
  <div class="loading-section bg-grey-light flex justify-center items-center">
    <!-- <div class="loader font-bold">
      <h1>{{message}}</h1>
    </div>-->
  </div>
</template>
<script>
export default {
  props: {
    message: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.loading-section {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.5;
  z-index: 999;
}
h1 {
  z-index: 999;
  background: -webkit-linear-gradient(#f2d024, #efde86);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
h1:after {
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
    color: white;
    text-shadow: 0.25em 0 0 rgba(0, 0, 0, 0), 0.5em 0 0 rgba(0, 0, 0, 0);
  }
  60% {
    text-shadow: 0.25em 0 0 white, 0.5em 0 0 rgba(0, 0, 0, 0);
  }
  80%,
  100% {
    text-shadow: 0.25em 0 0 white, 0.5em 0 0 white;
  }
}
.loader {
  /* z-index: 999; */
}
</style>
