<template>
  <section v-if="!loading">
    <div v-if="practices.length > 0">
      <div class="flex flex-row flex-wrap justify-start">
        <div
          class="w-full md:w-1/3 lg:w-1/4 rounded-lg shadow-lg bg-gray-300 m-2 p-4 hover:bg-gray-500"
          v-for="(practice, index) in practices"
          :key="practice.id"
        >
          <div class="flex justify-end z-50">
            <svgicon
              name="on-star"
              height="32"
              width="32"
              class="cursor-pointer"
              @click="unfavorite(practice.id, index)"
            />
          </div>
          <div class="flex flex-wrap text-center mt-4 cursor-pointer" @click="show(practice.id)">
            <div class="w-full flex justify-center">
              <div class="relative avatar flex justify-center">
                <img
                  :src="practice.user.avatar.file.url"
                  v-if="practice.user && practice.user.avatar && practice.user.avatar.file && practice.user.avatar.file.url"
                />
                <svgicon name="no-avatar" height="115" width="115" v-else />
              </div>
            </div>

            <div class="w-full font-bold text-sm sm:text-lg my-4">{{practice.surgery.name}}</div>
            <div
              class="w-full mb-4 font-bold text-gray-600 text-sm sm:text-lg"
            >{{practice.surgery.address.line_1}} {{practice.surgery.address.line_2}} {{practice.surgery.address.line_3}} {{practice.surgery.address.post_code}}</div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="flex flex-row flex-wrap justify-center">
      <div>You haven't favorite any Practices yet</div>
    </div>
    <div class="mt-5 flex justify-center" v-if="practices.length > 0 && totalPages > 1">
      <AppPagination
        :total="total"
        :totalPages="totalPages"
        :currentPage="current_page"
        @pagechanged="pagechanged"
      />
    </div>
    <div class="shield" v-if="$route.name === 'my-practice-favorites-id'"></div>
    <nuxt-child />
  </section>
</template>
<script>
import AppPagination from '@/components/Base/AppPagination'
export default {
  transition: {
    name: 'fade',
    mode: 'out-in'
  },
  components: {
    AppPagination,
  },
  data() {
    return {
      practices: [],
      current_page: 1,
      total: 0,
      practice: null,
      loading: true
    }
  },
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
  created() {
    this.getFavoritePracticesCount()
  },
  methods: {
    getFavoritePracticesCount() {
      this.$axios.$get(`/api/v1/locum/practices/count?locum_practice_type=Favorite`).then(res => { //GET QUANTITY OF DATA
        this.total = res.data.count
        this.getFavoritePractices(this.current_page)
      })
    },
    getFavoritePractices(page) {
      this.current_page = page
      this.$axios.$get(`/api/v1/locum/practices?locum_practice_type=Favorite&offset=${this.offset}&limit=${this.perPage}`).then(res => {
        this.practices = res.data.practices
        this.loading = false
      })
    },

    unfavorite(id, index) {
      this.practices.splice(index, 1)
      this.$axios.$delete(`/api/v1/locum/practices/${id}/favorite`).then(res => {
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: [`${res.message}`] })
      })
    },

    show(id) {
      this.$router.push(`/my-practice/favorites/${id}`)
    },

    pagechanged(e) {
      this.current_page = e
      this.getFavoritePractices(this.current_page)
    }
  }
}
</script>
<style scoped>
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
  z-index: 509;
}
/* .modal {
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
} */
</style>


