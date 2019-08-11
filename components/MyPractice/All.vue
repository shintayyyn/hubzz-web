<template>
  <section>
    <div>
      <div class="flex flex-row flex-wrap justify-start">
        <div
          class="card cursor-pointer rounded-lg shadow-lg m-2 p-5 bg-gray-200"
          v-for="practice in practices"
          :key="practice.id"
        >
          <div class="flex justify-end z-50">
            <template v-if="practice.is_favorite">
              <svgicon
                name="on-star"
                height="32"
                width="32"
                class="cursor-pointer"
                @click="unfavorite(practice.id)"
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
          </div>
          <div class="flex flex-wrap text-center mt-4 cursor-pointer" @click="show(practice.id)">
            <div class="w-full">
              <svgicon name="no-avatar" height="60" width="60" />
            </div>
            <div class="w-full font-bold text-sm sm:text-lg my-4">{{practice.surgery.name}}</div>
            <div class="w-full font-bold text-grey-dark text-sm sm:text-lg">{{practice.email}}</div>
          </div>
        </div>
      </div>

      <div class="mt-5 flex justify-center" v-if="practices.length > 0 && totalPages > 1">
        <AppPagination
          :total="total"
          :totalPages="totalPages"
          :currentPage="currentPage"
          @pagechanged="pagechanged"
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
import MyPracticeDetailModal from '@/components/MyPractice/MyPracticeDetailModal'
export default {
  components: {
    AppPagination,
    MyPracticeDetailModal
  },
  data() {
    return {
      practices: [],
      perPage: 5,
      total: 0,
      currentPage: parseInt(this.$route.query.current_page),
      modal: false,
      practice: null
    }
  },
  beforeDestroy() {
    let query = Object.assign({}, this.$route.query)
    delete query.current_page
    this.$router.push({ query })
  },
  computed: {
    totalPages() {
      return Math.ceil(this.total / this.perPage);
    }
  },
  watch: {
    practices(newValue, oldValue) {
      if (newValue.length !== 0 && (oldValue.length > newValue.length)) {
        this.getPractices()
      }
      if (newValue.length === 0 && this.$route.query.current_page !== 1) {
        this.pagechanged(this.totalPages)
      }
    },
    $route(to, from) {
      if (from.query.current_page !== to.query.current_page) {
        this.getPractices()
      }
    }
  },
  created() {
    const query = {
      ...this.$route.query,
      current_page: this.$route.query.current_page || 1
    }
    this.$router.push({ query })
    this.getPracticesCount()
    this.getPractices()

  },
  methods: {
    getPracticesCount() {
      this.$axios.$get(`/api/v1/locum/practices/count`).then(res => { //GET QUANTITY OF DATA
        this.total = res.data.count
      })
    },
    getPractices() {
      let offset = 0;
      offset = this.perPage * (parseInt(this.$route.query.current_page) - 1);
      this.$axios.$get(`/api/v1/locum/practices?limit=${this.perPage}&offset=${offset}`).then(res => {
        this.practices = res.data.practices
      })
    },

    favorite(id) {
      this.$axios.$post(`/api/v1/locum/practices/${id}/favorite`).then(res => {
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: [`${res.message}`] })
      })
    },

    unfavorite(id, index) {
      this.practices.splice(index, 1)
      this.$axios.$delete(`/api/v1/locum/practices/${id}/favorite`).then(res => {
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: [`${res.message}`] })
      })
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


