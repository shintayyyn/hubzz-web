<template>
  <section class="relative">
    <transition name="fade" mode="out-in">
      <div>
        <AppLoading :loading="loading" spinner />

        <div
          class="flex flex-row flex-wrap"
          :class="practices.length === 0 ? 'justify-center': 'justify-start'"
        >
          <div
            v-for="practice in practices"
            :key="practice.id"
            class="w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:max-w-sm p-2"
          >
            <div class="relative h-full rounded-lg shadow-lg bg-gray-300 p-4 hover:bg-gray-400">
              <nuxt-link
                class="w-full leading-tight"
                :to="{ path: `/my-practice/private-practice/${practice.id}`, query: {...$route.query}}"
              >
                <div class="flex font-bold text-sm sm:text-lg">
                  {{ practice.surgery.name }}
                </div>

                <div
                  class="w-full font-bold text-gray-700 text-xs leading-tight pt-1"
                >
                  {{ practice.address_line_1 }} {{ practice.address_line_2 }} {{ practice.address_line_3 }} {{ practice.address_post_code }}
                </div>
              </nuxt-link>
            </div>
          </div>

          <div class="w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:max-w-sm p-2">
            <div
              class="relative h-full rounded-lg shadow-lg bg-yellow-300 p-4 hover:bg-yellow-400 flex justify-center items-center cursor-pointer"
            >
              <div
                class="flex font-bold text-sm sm:text-lg"
                @click="$router.push('/my-practice/private-practice/create')"
              >
                Add Private Practice
              </div>
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

        <div v-if="!practices.length" class="flex flex-row flex-wrap justify-center">
          <div>You do not have any Associated Job for any Practices</div>
        </div>

        <transition name="fade" mode="out-in">
          <nuxt-link
            v-if="['my-practice-private-practice-practiceId', 'my-practice-private-practice-create'].includes($route.name)"
            class="shield"
            :to="{ name: `my-practice-private-practice`, query: { ...$route.query}}"
          />
        </transition>

        <div>
          <nuxt-child
            @removePractice="removePrivatePractice"
            @addPractice="addPrivatePractice"
          />
        </div>
      </div>
    </transition>
  </section>
</template>

<script>
import AppLoading from "@/components/Base/AppLoading"
import AppPagination from "@/components/Base/AppPagination"
export default {
  transition: {
    name: "fade",
    mode: "out-in",
  },

  components: {
    AppLoading,
    AppPagination,
  },

  data () {
    return {
      loading: false,
      current_page: 1,
      practices: [],
      total: 0,
      perPage: 5,
    }
  },

  computed: {
    offset () {
      return this.perPage * (this.current_page - 1)
    },

    totalPages () {
      return Math.ceil(this.total / this.perPage)
    },
  },

  mounted () {
    this.loading = true
    this.getPrivatePracticesPromiseAll().finally(() => {
      this.loading = false
    })
  },

  methods: {
    getPrivatePracticesPromiseAll () {
      return Promise.all([
        this.$axios.get('/api/v1/locum/private-practices/count')
          .then(response => this.total = response.data.data.count),

        this.getPrivatePractices(),
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

    getPrivatePractices () {
      return this.$axios.get('/api/v1/locum/private-practices', {
        params: {
          limit: this.perPage,
          offset: this.offset,
        },
      }).then(response => this.practices = response.data.data.private_practices).catch((err) => {
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

    addPrivatePractice (addedPractice) {
      let index = this.practices.findIndex(
        practice => practice.id === addedPractice.id
      )
      if (index < 0) {
        this.practices.push(addedPractice)
      }
    },

    removePrivatePractice (id) {
      let index = this.practices.findIndex(practice => practice.id === id)
      if (index >= 0) {
        this.practices.splice(index, 1)
      }
    },

    pagechangedHandler (page) {
      this.current_page = page
      this.loading = true
      this.getPrivatePractices().finally(() => {
        this.loading = false
      })
    },

    limitchangedHandler (limit) {
      this.perPage = limit
      this.current_page = 1
      this.loading = true
      this.getPrivatePractices().finally(() => {
        this.loading = false
      })
    },
  },
}
</script>
