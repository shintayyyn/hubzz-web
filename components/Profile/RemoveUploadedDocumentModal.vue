<template>
  <div class="border-solid rounded-b-lg bg-yellow-dark py-2 px-24">
    <div class="flex justify-center">
      <svgicon name="alert" height="20" width="20"/>
      <div class="text-sm ml-2">Proceed to remove the uploaded document?</div>
    </div>
    <div class="flex justify-center my-2">
      <div class="mx-2">
        <button
          class="border border-solid bg-yellow-dark hover:text-white focus:outline-none text-black font-bold py-5 rounded-lg"
          style="width:100px;"
          @click.prevent="remove"
        >Yes</button>
      </div>
      <div class="mx-2">
        <button
          class="border border-solid bg-yellow-dark hover:text-white focus:outline-none text-black font-bold py-5 rounded-lg"
          @click.prevent="close"
          style="width:100px;"
        >Cancel</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    remove() {
      // remove file thru api
      this.$store.commit('SET_REMOVEUPLOADED_MODAL', false)
      this.$store.commit('SET_REMOVEUPLOADED_SHIELD', false)
    },
    close() {
      this.$store.commit('SET_REMOVEUPLOADED_MODAL', false)
      this.$store.commit('SET_REMOVEUPLOADED_SHIELD', false)
    }
  }
}
</script>

