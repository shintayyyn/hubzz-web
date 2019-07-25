<template>
  <section>
    <div>
      <div class="flex flex-row flex-wrap justify-start">
        <div
          class="card cursor-pointer rounded-lg shadow-lg m-2 p-5 hover:bg-grey"
          v-for="practice in practices"
          :key="practice.id"
        >
          <!-- <div class="flex justify-end z-50">
          <template v-if="practice.is_favorite">
            <svgicon
              name="on-star"
              height="32"
              width="32"
              class="cursor-pointer"
              @click="favorite(practice.id)"
            />
          </template>
          <template v-else>
            <svgicon
              name="off-star"
              height="32"
              width="32"
              class="cursor-pointer"
              @click="favorite(practice.id)"
            />
          </template>
          </div>-->
          <div class="flex flex-wrap text-center mt-4 cursor-pointer" @click="show(practice.id)">
            <div class="w-full">
              <svgicon name="no-avatar" height="60" width="60" />
            </div>
            <div class="w-full font-bold text-sm sm:text-lg my-4">{{practice.surgery.name}}</div>
            <div class="w-full font-bold text-grey-dark text-sm sm:text-lg">{{practice.email}}</div>
          </div>
        </div>
      </div>

      <div v-if="practices" class="m-10 xl:-ml-32">
        <AppPagination
          :total="total"
          :totalPages="totalPages"
          :currentPage="currentPage"
          @pagechanged="pagechanged"
          :loading="loading"
        />
      </div>

    </div>
    <div class="shield" v-if="modal"></div>
    <transition name="slide" mode="out-in">
      <div class="modal shadow-lg" v-if="modal">
        <MyPracticeDetailModal :practice="practice" @close="modal = false" />
      </div>
    </transition>
  </section>
</template>
<script>
import AppPagination from '@/components/Base/AppPagination'
import AppLoading from '@/components/Base/AppLoading'
import MyPracticeDetailModal from '@/components/MyPractice/MyPracticeDetailModal'
export default {
  components: {
    AppPagination,
    AppLoading,
    MyPracticeDetailModal
  },
  data() {
    return {
      practices: [],
      total: 0,
      totalPages: 0,
      currentPage: 0,
      perPage: 0,
      loading: false,
      modal: false,
      practice: null
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
      this.getUnsuccessfulPractices()
    }
  },
  created() {
        const query = {
      ...this.$route.query,
      current_page: this.$route.query.current_page || 1
    }

    this.$axios.$get(`/api/v1/locum/practices/count?locum_practice_type=Unsuccessful`).then(res => { //GET QUANTITY OF DATA
      this.total = res.data.count
      this.perPage = 6
      this.totalPages = Math.ceil(this.total / this.perPage)
      this.getUnsuccessfulPractices()
    })
    // this.$axios.$get(`/api/v1/locum/practices?locum_practice_type=Unsuccessful`).then(res => {
    //     this.practices = res.data.practices
    //   })
    },
  methods: {
    getUnsuccessfulPractices(){
      this.loading = true
      let offset = 0
      offset = this.perPage * (parseInt(this.$route.query.current_page) - 1)
      this.$axios.$get(`/api/v1/locum/practices?locum_practice_type=Unsuccessful&limit=${this.perPage}&offset=${offset}`).then(res => {
        this.practices = res.data.practices
      })
      this.loading=false
    },
    show(id) {
      this.$axios.$get(`/api/v1/locum/practices/${id}`).then(res => {
        this.practice = res.data.practice
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
<style >
.card {
  min-width: 200px;
  max-width: 200px;
  height: 250px;
  box-sizing: content-box;
}
.shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 509;
}
.modal {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  border-left: solid 2px #edf2f7;
  transition: all 0.3s ease-in-out;
  background-color: white;
  z-index: 510;
}
@media screen and (min-width: 1200px) {
  .modal {
    width: 80%;
  }
}
</style>


