<template>
  <div class="flex flex-row flex-wrap justify-start">
    <div
      class="card rounded-lg shadow-lg m-2 p-5 hover:bg-grey"
      v-for="user in locums"
      :key="user.id"
    >
      <div class="flex flex-wrap text-center mt-4 cursor-pointer" @click="show(user.id)">
        <div class="w-full">
          <svgicon name="no-avatar" height="60" width="60" />
        </div>
        <div class="w-full font-bold text-sm sm:text-lg my-4">{{user.personal_detail.name}}</div>
        <div class="w-full font-bold text-grey-dark text-sm sm:text-lg">sample headline</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      locums: []
    }
  },
  created() {
    this.locums = []
    this.$axios.$get(`/api/v1/practice/locums?practice_locum_type=Rejected`).then(res => {
      console.log(res)
      this.locums = res.data.users
    })
  },
  methods: {
    show(id) {
      // set id to store
      this.$store.commit('myBanks/SET_MY_LOCUM_ID', id)
      this.$store.commit('SET_MYLOCUMDETAIL_SHIELD', true)
      let d = document.getElementsByClassName('my-locum-detail-modal')[0]
      d.classList.toggle('toggled-right')
      document.body.style.overflow = 'hidden'
      this.$store.commit('SET_MYLOCUMDETAIL_MODAL', true)
    }
  }
}
</script>
<style>
.card {
  min-width: 200px;
  height: 250px;
  box-sizing: content-box;
}
</style>


