<template>
  <div>
    <div class="-mt-2">
      <AppSelect
        v-model="profession_id"
        :name="'Filter Locums by'"
        :label="'Filter Locums by'"
        :items="professions"
        :placeholder="'All'"
      />
    </div>
    <div class="mt-10 w-full text-center" v-if="locums.length == 0">
      <span>You have not rejected any locums.</span>
    </div>
    <div v-else class="flex flex-row flex-wrap justify-start">
      <AppLoading :loading="loading" :message="'Loading'" v-if="loading" />
      <div
        class="w-full md:w-1/3 lg:w-1/4 rounded-lg shadow-lg bg-gray-200 m-2 p-4 hover:bg-gray-400"
        v-for="user in locums"
        :key="user.id"
      >
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
            class="w-full mb-4 font-bold text-gray-500 text-sm sm:text-lg"
          >{{user.locum_detail.profession.name}}</div>
        </div>
      </div>
    </div>

    <div class="m-10 xl:-ml-32" v-if="locums.length > 0 && totalPages > 1">
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
        <MyLocumDetailModal @close="modal = false" :user="user" :jobs="jobs" />
        <!--insert :locum jobs here-->
      </div>
    </transition>
  </div>
</template>
<script>
import AppPagination from '@/components/Base/AppPagination'
import AppLoading from '@/components/Base/AppLoading'
import MyLocumDetailModal from '@/components/MyBanks/MyLocumDetailModal' //TEMPORARY
import AppSelect from '@/components/Base/AppSelect'
export default {
  components: {
    AppPagination,
    AppLoading,
    MyLocumDetailModal,
    AppPagination,
    AppSelect
  },
  data() {
    return {
      locums: [],
      total: 0,
      totalPages: 0,
      currentPage: 0,
      perPage: 0,
      loading: false,
      modal: false, //TEMPORARY
      user: null,//TEMPORARY
      jobs: null,
      professions: [],
      profession_id: null,
      filteredUsers: []
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
      this.getRejectedLocums()
    },
    profession_id: function () {
      this.getRejectedLocums()
    }
  },
  created() {
    const query = {
      ...this.$route.query,
      current_page: this.$route.query.current_page || 1
    }

    this.$axios.$get(`/api/v1/practice/locums/count?practice_locum_type=Rejected`).then(res => { //GET QUANTITY OF DATA
      this.total = res.data.count
      this.perPage = 6
      this.totalPages = Math.ceil(this.total / this.perPage)
      this.getRejectedLocums()
    })

    this.$axios.$get(`/api/v1/professions`).then(res => {
      this.professions = [];
      res.data.professions.forEach(item => {
        this.professions.push({ label: item.name, value: item.id });
      });
    });
    // this.locums = []
    // this.$axios.$get(`/api/v1/practice/locums?practice_locum_type=Rejected`).then(res => {
    //   console.log(res)
    //   this.locums = res.data.users
    // })
  },
  methods: {
    getRejectedLocums() {
      this.loading = true
      let offset = 0
      offset = this.perPage * (parseInt(this.$route.query.current_page) - 1)
      if (!this.profession_id) {
        this.$axios.$get(`/api/v1/practice/locums?practice_locum_type=Rejected&limit=${this.perPage}&offset=${offset}`).then(res => {
          this.locums = res.data.users
        })
      } else {
        this.$axios.$get(`/api/v1/practice/locums?profession_id=${this.profession_id}&practice_locum_type=Rejected&limit=${this.perPage}&offset=${offset}`).then(res => {
          this.locums = res.data.users
        })
      }
      this.loading = false
    },
    show(id) {
      // set id to store
      // this.$store.commit('myBanks/SET_MY_LOCUM_ID', id)
      // this.$store.commit('SET_MYLOCUMDETAIL_SHIELD', true)
      // let d = document.getElementsByClassName('my-locum-detail-modal')[0]
      // d.classList.toggle('toggled-right')
      // document.body.style.overflow = 'hidden'
      // this.$store.commit('SET_MYLOCUMDETAIL_MODAL', true)
      Promise.all([
        this.$axios.$get(`/api/v1/practice/locums/${id}`).then(res => {
          this.user = res.data.user
        }),
      ]).then(() => {
        this.$axios.$get(`/api/v1/practice/jobs?locum_detail_id=${this.user.locum_detail.id}`).then(res => {
          this.jobs = res.data.jobs
        }),
          this.modal = true
      })
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


