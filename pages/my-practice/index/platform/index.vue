<template>
  <section>
    <transition name="fade" mode="out-in">
      <div>
        <AppLoading :loading="loading" spinner />
        <div class="flex flex-row flex-wrap justify-start">
          <div
            v-for="practice in practices"
            :key="practice.id"
            class="w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:max-w-sm p-2"
          >
            <div class="relative h-full rounded-lg shadow-lg bg-gray-300 p-4 hover:bg-gray-400">
              <nuxt-link
                class="w-full font-bold text-sm sm:text-lg leading-tight"
                :to="{ path: `/my-practice/platform/${practice.id}`, query: {...$route.query}}"
              >
                <div class="flex items-start justify-between z-50">
                  <span>{{ practice.surgery.name }}</span>
                  <span>
                    <svgicon
                      v-model="practice.is_favorite"
                      :name="practice.is_favorite ? 'on-star' : 'off-star'"
                      height="28"
                      width="28"
                      class="cursor-pointer fill-current text-gray-700 hover:text-gray-800"
                      @click.prevent.stop="favorite(practice.id)"
                    />
                  </span>
                </div>

                <div class="w-full font-bold text-gray-700 text-xs leading-tight pt-1">
                  {{ practice.surgery.address.line_1 }} {{ practice.surgery.address.line_2 }} {{ practice.surgery.address.line_3 }} {{ practice.surgery.address.post_code }}
                </div>
              </nuxt-link>

              <AppLoading :loading="favoriteLoadingPracticeIds.includes(practice.id)" spinner />
            </div>
          </div>
        </div>

        <div v-if="practices.length > 0 && totalPages > 1" class="mt-5 flex justify-center">
          <AppPagination
            :total="total"
            :totalPages="totalPages"
            :perPage="perPage"
            :currentPage="current_page"
            @pagechanged="pagechangedHandler"
            @limitchanged="limitchangedHandler"
          />
        </div>

        <div v-if="!practices.length && !loading" class="flex flex-row flex-wrap justify-center">
          <div>{{ noResultMessage }}</div>
        </div>

        <transition name="fade" mode="out-in">
          <nuxt-link
            v-if="$route.name.includes('my-practice-index-platform-practiceId')"
            class="shield"
            :to="{ path: `/my-practice/platform`, query: { ...$route.query}}"
          />
        </transition>

        <div>
          <nuxt-child />
        </div>
      </div>
    </transition>
  </section>
</template>

<script>
import AppLoading from "@/components/Base/AppLoading"
import AppPagination from "@/components/Base/AppPagination"

export default {
  components: {
    AppLoading,
    AppPagination,
  },

  data () {
    return {
      loading: true,
      favoriteLoadingPracticeIds: [],
      current_page: 1,
      practices: [],
      total: 0,
      perPage: 12,
    }
  },

  computed: {
    offset () {
      return this.perPage * (this.current_page - 1)
    },

    totalPages () {
      return Math.ceil(this.total / this.perPage)
    },

    noResultMessage () {
      if (!this.$route.query.status || this.$route.query.status.toLowerCase() === 'favorite') {
        return 'You do not have a favourite practice.'
      }

      if (this.$route.query.status && this.$route.query.status.toLowerCase() === 'completed') {
        return 'You do not have any Associated Job for any Practices'
      }

      if (this.$route.query.status && this.$route.query.status.toLowerCase() === 'applied') {
        return 'You do not have any Associated Job for any Practices'
      }

      if (this.$route.query.status && this.$route.query.status.toLowerCase() === 'unsuccessful') {
        return 'You do not have any unsuccessful jobs'
      }
      
      return 'You do not have any jobs'
    },
  },

  watch: {
    "$route.query" ({ status: newStatus, }, { status: oldStatus, }) {
      if (newStatus && newStatus !== null && newStatus !== oldStatus) {
        this.current_page = 1
        this.practices = []
        this.loading = true
        this.getPracticesPromiseAll().finally(() => {
          this.loading = false
        })
      }
    },
  },
  
  mounted () {
    this.loading = true
    this.getPracticesPromiseAll().finally(() => {
      this.loading = false
    })
  },

  methods: {
    getPracticesPromiseAll () {
      const queryStatus = this.$route.query && this.$route.query.status
        ? this.$route.query.status
        : "Favorite"

      return Promise.all([
        this.$axios.get('/api/v1/locum/practices/count', {
          params: {
            locum_practice_type: queryStatus,
            dont_show_deactivated_or_deleted_practice: true,
          },
        }).then(response => this.total = response.data.data.count),

        this.getPractices(),
      ]).catch((err) => {
        console.log("err", err.response || err)

        if (err.response.data.message) {
          return this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`${err.response.data.message}`,],
          })
        }
      })
    },

    getPractices () {
      const queryStatus = this.$route.query && this.$route.query.status
        ? this.$route.query.status
        : "Favorite"

      return this.$axios.get('/api/v1/locum/practices', {
        params: {
          locum_practice_type: queryStatus,
          dont_show_deactivated_or_deleted_practice: true,
          limit: this.perPage,
          offset: this.offset,
        },
      })
        .then(response => this.practices = response.data.data.practices)
        .catch((err) => {
          console.log("err", err.response || err)

          if (err.response.data.message) {
            return this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: [`${err.response.data.message}`,],
            })
          }
        })
    },

    favorite (id) {
      let queryStatus = this.$route.query.status
      let practice = this.practices.find(practice => practice.id === id)
      if (!practice.is_favorite) {
        this.favoriteLoadingPracticeIds.push(id)

        this.$axios
          .$post(`/api/v1/locum/practices/${id}/favorite`)
          .then(() => {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: ["Added to favourites",],
            })
            practice.is_favorite = !practice.is_favorite
          })
          .catch(err => {
            console.log("err", err.response || err)
            if (err.response.data.message) {
              this.$store.commit("SET_NOTIFICATION", {
                enabled: true,
                status: "danger",
                text: [`${err.response.data.message}`,],
              })
            }
          })
          .finally(() => {
            const index = this.favoriteLoadingPracticeIds.indexOf(id)

            if (index > -1) {
              this.favoriteLoadingPracticeIds.splice(index, 1)
            }
          })
      } else if (practice.is_favorite) {
        this.favoriteLoadingPracticeIds.push(id)

        this.$axios
          .$delete(`/api/v1/locum/practices/${id}/favorite`)
          .then(() => {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: ["Remove to favourites",],
            })
            practice.is_favorite = !practice.is_favorite

            if (!queryStatus || queryStatus.toLowerCase() === "favorite") {
              const practiceIndex = this.practices.findIndex(practice => practice.id === id)

              if (practiceIndex > -1) {
                this.practices.splice(practiceIndex, 1)
              }
            }
          })
          .catch(err => {
            console.log("err", err)
            if (err.response.data.message) {
              this.$store.commit("SET_NOTIFICATION", {
                enabled: true,
                status: "danger",
                text: [`${err.response.data.message}`,],
              })
            }
          })
          .finally(() => {
            const index = this.favoriteLoadingPracticeIds.indexOf(id)

            if (index > -1) {
              this.favoriteLoadingPracticeIds.splice(index, 1)
            }
          })
      }
    },

    pagechangedHandler (page) {
      this.current_page = page
      this.loading = true
      this.getPractices().finally(() => {
        this.loading = false
      })
    },

    limitchangedHandler (limit) {
      this.perPage = limit
      this.current_page = 1
      this.loading = true
      this.getPractices().finally(() => {
        this.loading = false
      })
    },
  },
}
</script>
