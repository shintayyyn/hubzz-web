<template>
  <div>
    <div
      class="relative h-full w-full"
    >
      <div
        class="inset-0 absolute"
        style="
          border-radius: 50%;
        "
        :style="`
          background-color: ${minColor};
          background-image: linear-gradient(to right, transparent 50%, ${maxColor} 0);
        `"
      />
      <div
        v-if="degrees > 180"
        class="inset-0 absolute bg-blue-300"
        style="
          margin-left: 50%;
          border-radius: 0 100% 100% 0 / 50%;
          transform-origin: left;
          transition: 300ms linear all;
        "
        :style="`
          background-color: ${maxColor};
          transform: rotate(${degrees - 180}deg);
        `"
      />
      <div
        v-if="180 > degrees"
        class="inset-0 absolute bg-blue-300"
        style="
          margin-left: 50%;
          border-radius: 0 100% 100% 0 / 50%;
          transform-origin: left;
          transition: 100ms linear all;
        "
        :style="`
          background-color: ${minColor};
          transform: rotate(${degrees}deg);
        `"
      />
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      min: {
        type: Number,
        default: 0,
      },
      max: {
        type: Number,
        default: 100,
      },
      minColor: {
        type: String,
        default: '#505561'
      },
      maxColor: {
        type: String,
        default: '#FFC72C'
      },
      value: {
        type: Number,
        default: 60,
      },
    },

    computed: {
      degrees () {
        return (Math.min(this.value, this.max) - this.min) / (this.max - this.min) * 360
      },
    },
  }
</script>
