<template>
  <div
    class="loading-section bg-grey-dark flex justify-center items-center"
    v-if="$store.state.loading.enabled"
  >
    <div class="loader font-bold">
      <h1>{{$store.state.loading.message}}</h1>
    </div>
  </div>
</template>
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
  /* color: linear-gradient(to top, #f2d024, #efde86); */
  /* border: 6px solid #f3f3f3;
  border-top: 6px solid #f2d024;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 2s linear infinite;
  -webkit-animation: spin 2s linear infinite; */
}

/* @keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@-webkit-keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
} */
</style>
