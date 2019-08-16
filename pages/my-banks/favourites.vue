<template>
  <section v-if="!loading">
    <div v-if="locums.length">
      <div class="-mt-2">
        <AppSelect
          v-model="profession_id"
          :name="'Filter Locums by'"
          :label="'Filter Locums by'"
          :items="professions"
          :placeholder="'All'"
        />
      </div>
      <div class="flex flex-row flex-wrap justify-start">
        <div
          class="w-full md:w-1/3 lg:w-1/4 rounded-lg shadow-lg bg-gray-300 m-2 p-4 hover:bg-gray-500"
          v-for="(user, index) in locums"
          :key="user.id"
        >
          <div class="flex justify-end z-50">
            <svgicon
              name="on-star"
              height="32"
              width="32"
              class="cursor-pointer"
              @click="unfavorite(user.id, index)"
            />
          </div>

          <div class="flex flex-wrap text-center mt-4 cursor-pointer" @click="show(user.id)">
            <div class="w-full flex justify-center">
              <div class="relative avatar flex justify-center">
                <img
                  :src="user.avatar.file.url"
                  v-if="user.avatar && user.avatar.file && user.avatar.file.url"
                />
                <svgicon name="no-avatar" height="115" width="115" v-else />
              </div>
            </div>

            <div class="w-full font-bold text-sm sm:text-lg my-4">{{user.personal_detail.name}}</div>
            <div
              class="w-full mb-4 font-bold text-gray-600 text-sm sm:text-lg"
            >{{user.locum_detail.profession.name}}</div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="flex flex-row flex-wrap justify-center">
      <div>You have no favorite locums</div>
    </div>

    <div class="mt-5 flex justify-center" v-if="locums.length > 0 && totalPages > 1">
      <AppPagination
        :total="total"
        :totalPages="totalPages"
        :currentPage="current_page"
        @pagechanged="pagechanged"
      />
    </div>
    <transition name="fade" mode="out-in">
      <div class="shield" v-if="$route.name === 'my-banks-favourites-id'"></div>
    </transition>
    <nuxt-child />

    <!-- <div class="shield" v-if="modal"></div>
    <transition name="slide" mode="out-in">
      <div class="locum-modal shadow-lg" v-if="modal">
        <MyLocumDetailModal @close="modal = false" :user="user" :jobs="jobs" />
      </div>
    </transition>-->
  </section>
</template>
<script>
import AppPagination from '@/components/Base/AppPagination'
// import MyLocumDetailModal from '@/components/MyBanks/MyLocumDetailModal' 
import AppSelect from '@/components/Base/AppSelect'

export default {
  transition: {
    name: 'fade',
    mode: 'out-in'
  },
  components: {
    AppPagination,
    // MyLocumDetailModal,
    AppSelect
  },
  data() {
    return {
      locums: [],
      current_page: 1,
      total: 0,
      practice: null,
      loading: true,
      //
      profession_id: null,
      professions: [],

      // locums: [],
      // total: 0,
      // totalPages: 0,
      // currentPage: 0,
      // perPage: 0,
      // modal: false, //TEMPORARY
      // user: null, //TEMPORARY
      // jobs: null,
      // filteredUsers: []
    }
  },
  // beforeDestroy() {
  //   let query = Object.assign({}, this.$route.query)
  //   delete query.current_page
  //   this.$router.push({ query })
  // },
  computed: {
    offset() {
      return this.perPage * (this.current_page - 1);
    },
    perPage() {
      return 5;
    },
    totalPages() {
      return Math.ceil(this.total / this.perPage);
    },
  },
  // watch: {
  //   $route(to, from) {
  //     this.currentPage = parseInt(to.query.current_page)
  //     this.getFavoriteLocums()
  //   },
  //   profession_id: function () {
  //     this.getFavoriteLocums()
  //   }
  // },
  created() {
    this.getProfessions()
    this.getFavoriteLocumsCount()

    // this.$axios.$get(`/api/v1/practice/locums/count?practice_locum_type=Favorite`).then(res => { //GET QUANTITY OF DATA
    //   this.total = res.data.count
    //   this.perPage = 6
    //   this.totalPages = Math.ceil(this.total / this.perPage)
    //   this.getFavoriteLocums()
    // })

    // this.$axios.$get(`/api/v1/professions`).then(res => {
    //   this.professions = [];
    //   res.data.professions.forEach(item => {
    //     this.professions.push({ label: item.name, value: item.id });
    //   });
    // });

  },
  methods: {
    getProfessions() {
      this.$axios.$get(`/api/v1/professions`).then(res => {
        this.professions = [];
        res.data.professions.forEach(item => {
          this.professions.push({ label: item.name, value: item.id });
        });
      });
    },
    getFavoriteLocumsCount() {
      this.$axios.$get(`/api/v1/practice/locums/count?practice_locum_type=Favorite`).then(res => {
        this.total = res.data.count
        this.getFavoriteLocums(this.current_page)
      })
    },
    getFavoriteLocums(page) {
      this.current_page = page
      this.$axios.$get(`/api/v1/practice/locums?practice_locum_type=Favorite&offset=${this.offset}&limit=${this.perPage}`).then(res => {
        this.locums = res.data.users
        this.loading = false
      })
      // this.loading = true
      // let offset = 0
      // offset = this.perPage * (parseInt(this.$route.query.current_page) - 1)
      // if (!this.profession_id) {
      //   this.$axios.$get(`/api/v1/practice/locums?practice_locum_type=Favorite&limit=${this.perPage}&offset=${offset}`).then(res => {
      //     this.locums = res.data.users
      //   })
      // } else {
      //   this.$axios.$get(`/api/v1/practice/locums?profession_id=${this.profession_id}&practice_locum_type=Favorite&limit=${this.perPage}&offset=${offset}`).then(res => {
      //     this.locums = res.data.users
      //   })
      // }
      // this.loading = false
    },
    unfavorite(id, index) {
      this.$axios.$delete(`/api/v1/practice/locums/${id}/favorite`).then(res => {
        this.locums.splice(index, 1)
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: ['Remove to favourites'] })
      })
    },
    show(id) {
      this.$router.push(`/my-banks/favourites/${id}`)
      // set id to store
      // this.$store.commit('myBanks/SET_MY_LOCUM_ID', id)
      // this.$store.commit('SET_MYLOCUMDETAIL_SHIELD', true)
      // let d = document.getElementsByClassName('my-locum-detail-modal')[0]
      // d.classList.toggle('toggled-right')
      // document.body.style.overflow = 'hidden'
      // this.$store.commit('SET_MYLOCUMDETAIL_MODAL', true)

      // Promise.all([
      //   this.$axios.$get(`/api/v1/practice/locums/${id}`).then(res => {
      //     this.user = res.data.user
      //   }),
      // ]).then(() => {
      //   this.$axios.$get(`/api/v1/practice/jobs?locum_detail_id=${this.user.locum_detail.id}`).then(res => {
      //     this.jobs = res.data.jobs
      //   }),
      //     this.modal = true
      // })
    },
    pagechanged(e) {
      this.current_page = e
      this.getFavoriteLocums(this.current_page)
      // const query = {
      //   ...this.$route.query,
      //   current_page: e || 1
      // }
      // this.$router.push({ query })
    }
  }
}
</script>
<style >
.avatar-container {
  box-sizing: content-box;
  height: 170px;
}
.avatar {
  max-width: 170px;
  max-height: 170px;
  min-width: 170px;
  min-height: 170px;
}
img {
  border-radius: 50%;
}
.shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 511;
}
</style>


