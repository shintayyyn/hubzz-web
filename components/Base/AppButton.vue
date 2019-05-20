<template>
  <section>
    <button
      @click.prevent="$emit('click')"
      class="rounded-lg p-6 font-bold text-lg focus:outline-none hover:text-white cursor-pointer"
    >{{label}}</button>
  </section>
</template>
<script>
export default {
  props: {
    label: String
  }
}
</script>
<style scoped>
button {
  transform: translate(2px, 2px);
  background: linear-gradient(to top, #f2d024, #efde86);
}
</style>

