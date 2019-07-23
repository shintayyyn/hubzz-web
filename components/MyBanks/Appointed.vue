<template>
  <div class="flex flex-row flex-wrap justify-start">
    <div
      class="card w-24 rounded-lg shadow-lg bg-grey-light m-2 p-4 hover:bg-grey"
      v-for="user in locums"
      :key="user.id"
    >
      <div class="flex justify-end z-50">
        <template v-if="user.is_favorite">
          <svgicon
            name="on-star"
            height="32"
            width="32"
            class="cursor-pointer"
            @click="favorite(user.id)"
          />
        </template>
        <template v-else>
          <svgicon
            name="off-star"
            height="32"
            width="32"
            class="cursor-pointer"
            @click="favorite(user.id)"
          />
        </template>
      </div>
      <div class="flex flex-wrap text-center mt-4 cursor-pointer" @click="show(user.id)">
        <div class="w-full">
          <div v-if="!user.avatar">
             <svgicon name="no-avatar" height="115" width="115"/>
          </div>
          <embed
          class="object-contain h-32 rounded-full mr-4"
          :src="user.avatar ? user.avatar.file.url:null" 
          >
        </div>
        <div class="w-full font-bold text-sm sm:text-lg my-4">{{user.personal_detail.name}}</div>
        <div class="w-full font-bold text-grey-dark text-sm sm:text-lg">{{user.locum_detail.headline}}</div>
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
    this.$axios.$get(`/api/v1/practice/locums?practice_locum_type=Appointed`).then(res => {
      console.log(res)
      this.locums = res.data.users
    })
  },
  methods: {
    favorite(id) {
      let locum = this.locums.find(locum => locum.id === id)
      if (!locum.is_favorite) {
        this.$axios.$post(`/api/v1/practice/locums/${id}/favorite`).then(res => {
          console.log(res)
          locum.is_favorite = !locum.is_favorite
          this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'Added to favourites' })
        })
      } else {
        this.$axios.$delete(`/api/v1/practice/locums/${id}/favorite`).then(res => {
          console.log(res)
          locum.is_favorite = !locum.is_favorite
          this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'Remove to favourites' })
        })
      }
    },
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


