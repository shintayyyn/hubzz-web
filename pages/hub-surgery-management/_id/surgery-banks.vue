<template>
  <nuxt-child :practiceSurgery="practiceSurgery"/>
</template>
<script>
export default {
  props: {
    practiceSurgery: {
      type: Object,
      default: () => null,
    },
  },
}
</script>