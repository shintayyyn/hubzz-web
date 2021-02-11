<template>
  <nuxt-child :child-practice-id="childPracticeId" />
</template>
<script>
export default {
  props: {
    childPracticeId: {
      type: Number,
      required: true,
    },
  },
}
</script>