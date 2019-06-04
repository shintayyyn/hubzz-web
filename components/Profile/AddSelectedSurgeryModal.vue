<template>
  <div class="border-solid rounded-b-lg bg-yellow-dark py-2 px-24">
    <div class="flex justify-center">
      <svgicon name="alert" height="20" width="20"/>
      <div class="text-sm ml-2">Proceed to add this surgery?</div>
    </div>
    <div class="flex justify-center my-2">
      <div class="mx-2">
        <button
          class="border border-solid bg-yellow-dark hover:text-white focus:outline-none text-black font-bold py-5 rounded-lg"
          style="width:100px;"
          @click.prevent="add"
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
    add() {
      // get selected surgery from profile store then post request
      this.$axios.$post(`/api/v1/practice/practice-children`, { surgery_id: this.$store.state.profile.selected_surgery_id }).then(res => {
        // add selected surgery to profile store and to be pick up by surgeries components
        this.$store.commit('profile/ADD_SURGERY', res.data.practice_child)
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'Successfully added practice child' })
        this.$store.commit('SET_ADDSURGERY_SHIELD', false)
        this.$store.commit('SET_ADDSELECTEDSURGERY_MODAL', false)
        this.$store.commit('SET_ADDSELECTEDSURGERY_SHIELD', false)
        let d = document.getElementsByClassName('add-surgery-modal')[0]
        d.classList.toggle('toggled-right')
        document.body.style.overflow = 'auto'
      })
    },
    close() {
      this.$store.commit('SET_ADDSELECTEDSURGERY_MODAL', false)
      this.$store.commit('SET_ADDSELECTEDSURGERY_SHIELD', false)
    }
  }
}
</script>

