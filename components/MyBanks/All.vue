<template>
  <div>
    <AppLoading :loading="loading" :message="'Loading'" v-if="loading" />
    <div class = "flex flex-row flex-wrap w-full justify-start">
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
          <div class="w-full mb-4 font-bold text-grey-dark text-sm sm:text-lg">{{user.locum_detail.profession.name}}</div>
          <!-- <div class="w-full font-bold text-grey-dark text-sm sm:text-lg">{{user.locum_detail.headline}}</div> -->
        </div>
      </div>
    </div>
  
    <div v-if="locums" class="m-10 xl:-ml-32">
      <AppPagination
        :total="total"
        :totalPages="totalPages"
        :currentPage="currentPage"
        @pagechanged="pagechanged"
        :loading="loading"
      />
    </div>
    <div class="locum-shield" v-if="modal"></div>
    <transition name="slide" mode="out-in">
      <div class="locum-modal shadow-lg" v-if="modal">
        <LocumDetailModal @close="modal = false" :user="user"/> <!--insert :locum jobs here-->
      </div>
    </transition>
  </div>
</template>
<script>
import AppPagination from '@/components/Base/AppPagination'
import AppLoading from '@/components/Base/AppLoading'
import LocumDetailModal from '@/components/MyBanks/LocumDetailModal' //TEMPORARY
export default {
  components: {
    AppPagination,
    AppLoading,
    LocumDetailModal
  },
  data() {
    return {
      locums: [],
      total: 0,
      totalPages: 0,
      currentPage: 0,
      perPage: 0,
      loading: false,
      modal:false, //TEMPORARY
      user:null //TEMPORARY
    }
  },
  beforeDestroy() {
    let query = Object.assign({}, this.$route.query)
    delete query.current_page
    this.$router.push({ query })
  },
  watch: {
    $route(to, from) {
      this.currentPage = parseInt(to.query.current_page)
      this.getAllLocums()
    }
  },
  created() {
    const query = {
      ...this.$route.query,
      current_page: this.$route.query.current_page || 1
    }

    this.$axios.$get(`/api/v1/practice/locums/count`).then(res => { //GET QUANTITY OF DATA
      this.total = res.data.count
      this.perPage = 6
      this.totalPages = Math.ceil(this.total / this.perPage)
      this.getAllLocums()
    })

    // this.$axios.$get(`/api/v1/practice/locums`).then(res => {
    //   console.log(res)
    //   this.locums = res.data.users
    // })
  },
  methods: {
    getAllLocums(){
      this.loading = true
      let offset = 0
      offset = this.perPage * (parseInt(this.$route.query.current_page) - 1)
      this.$axios.$get(`/api/v1/practice/locums?limit=${this.perPage}&offset=${offset}`).then(res => {
        this.locums = res.data.users
      })
      this.loading=false
    },
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
      // this.$store.commit('myBanks/SET_MY_LOCUM_ID', id)
      // this.$store.commit('SET_MYLOCUMDETAIL_SHIELD', true)
      // let d = document.getElementsByClassName('my-locum-detail-modal')[0]
      // d.classList.toggle('toggled-right')
      // document.body.style.overflow = 'hidden'
      // this.$store.commit('SET_MYLOCUMDETAIL_MODAL', true)
      console.log('hey')
       this.$axios.$get(`/api/v1/practice/locums/${id}`).then(res => {  //TEMPORARY 
        this.user = res.data.user
        this.modal = true                                           
      })
      //call jobs
    },
    pagechanged(e) {
      const query = {
        ...this.$route.query,
        current_page: e || 1
      }
      this.$router.push({ query })
    }
  }
}
</script>
<style>
.card {
  min-width: 100px;
  height: 250px;
  box-sizing: content-box;
}
.locum-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 511;
}
.locum-modal {
  position: fixed;
  top: 0;
  right: 0;
  margin-right: 0%;
  width: 100%;
  height: 100%;
  overflow: auto;
  border-left: solid 2px #edf2f7;
  transition: all 0.3s ease-in-out;
  background-color: white;
  z-index: 512;
}
@media screen and (min-width: 1200px) {
  .locum-modal {
    width: 80%;
  }
}
</style>


