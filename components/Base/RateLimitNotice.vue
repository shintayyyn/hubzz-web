<template>
  <div v-if="seconds > 0" class="text-sm text-red-500" :class="wrapperClass">
    {{ message }} Try again in {{ seconds }}s.
  </div>
</template>

<script>
export default {
  props: {
    seconds: {
      type: Number,
      required: true,
    },
    message: {
      type: String,
      default: 'Too many attempts.',
    },
    wrapperClass: {
      type: String,
      default: 'mb-2',
    },
  },
}
</script>
