<template>
  <section>
    <div class="w-full md:w-1/2 lg:w-2/5">
      <AppInputSmall
        v-model="search"
        :type="'text'"
        :name="'search'"
        :button="true"
        :buttonLabel="'Search'"
        :placeholder="'Locum Name'"
        :disabled="loading"
        @click="getLocumsCount()"
      />
    </div>
    
    <div
      v-if="
        [
          'completed',
          'applied',
          'appointed',
          'rejected',
          'withdrawn',
          'lates',
        ].includes(practiceLocumType.toLowerCase())
          && loggedInPracticeType === 'Hub'
      "
      class="flex flex-row justify-start overflow-x-auto lg:overflow-y-hidden mb-3 border-b border-gray-500"
    >
      <nuxt-link
        :event="$store.state.jobs.loading_jobs ? '' : 'click'"
        :to="{ path: '/my-banks', query: { ...$route.query, surgeries_bank: undefined }}"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer"
        :class="
          !surgeriesBank
            ? 'border-b-4 border-gray-500'
            : 'text-gray-600'
        "
      >
        Banks
      </nuxt-link>

      <nuxt-link
        :event="$store.state.jobs.loading_jobs ? '' : 'click'"
        :to="{ path: '/my-banks', query: { ...$route.query, surgeries_bank: 'true' }}"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer"
        :class="
          surgeriesBank
            ? 'border-b-4 border-gray-500'
            : 'text-gray-600'
        "
      >
        Surgeries Banks
      </nuxt-link>
    </div>

    <div 
      v-if="practiceLocumType !== 'All'"
      class="flex flex-row justify-start overflow-x-auto lg:overflow-y-hidden mb-3 border-b border-gray-500"
    >
      <nuxt-link
        :event="$store.state.jobs.loading_jobs ? '' : 'click'"
        :to="{ path: '/my-banks', query: { ...$route.query, profession_category_name: undefined }}"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer"
        :class="
          professionCategoryName.toLowerCase() === 'gp'
            ? 'border-b-4 border-gray-500'
            : 'text-gray-600'
        "
      >
        GP
      </nuxt-link>

      <nuxt-link
        :event="$store.state.jobs.loading_jobs ? '' : 'click'"
        :to="{ path: '/my-banks', query: { ...$route.query, profession_category_name: 'Others' }}"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer"
        :class="
          professionCategoryName.toLowerCase() === 'others'
            ? 'border-b-4 border-gray-500'
            : 'text-gray-600'
        "
      >
        Others
      </nuxt-link>
    </div>

    <AppLoading :loading="loading" spinner />

    <transition name="fade" mode="out-in">
      <div v-if="toggleTable">
        <div class="flex flex-row flex-wrap justify-start">
          <div v-for="locum in locums" :key="locum.id" class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2">
            <div class="h-full rounded-lg shadow-lg bg-gray-300 hover:bg-gray-400 p-4">
              <nuxt-link :to="{ path: `/my-banks/${locum.id}`, query: {...$route.query}}">
                <div class="flex justify-end items-center">
                  <div
                    v-if="authPermissions.includes('Mark Locum as Favorite')"
                    class="flex justify-end items-center z-40"
                  >
                    <template v-if="locum.is_favorite">
                      <svgicon
                        name="on-star"
                        height="32"
                        width="32"
                        class="cursor-pointer fill-current text-gray-700 hover:text-gray-800"
                        @click.prevent.stop="favorite(locum.id)"
                      />
                    </template>

                    <template v-else>
                      <svgicon
                        name="off-star"
                        height="32"
                        width="32"
                        class="cursor-pointer fill-current text-gray-700 hover:text-gray-800"
                        @click.prevent.stop="favorite(locum.id)"
                      />
                    </template>
                  </div>

                  <button
                    class="ml-2 p-2 focus:outline-none hover:bg-gray-300 rounded-lg"
                    @click.prevent.stop="message(locum)"
                  >
                    <svgicon name="chat" height="24" width="24" color="#6b778b #4a5568 #fff" />
                  </button>
                </div>

                <div class="flex flex-wrap text-center mt-4 cursor-pointer">
                  <div class="w-full flex justify-center">
                    <AppAvatar
                      :src="locum.avatar && locum.avatar.file && locum.avatar.file.url ? locum.avatar.file.url : ''"
                    />
                  </div>

                  <div class="w-full font-bold text-sm sm:text-lg leading-tight mt-4">
                    {{ locum.name }}
                  </div>

                  <div class="w-full mb-4 font-bold text-gray-700 text-sm leading-tight">
                    {{ locum.email }}
                  </div>

                  <div class="w-full mb-2 font-bold text-gray-700 text-sm leading-tight">
                    {{ locum.profession_name }}
                  </div>
                </div>
              </nuxt-link>
            </div>
          </div>
        </div>

        <transition name="fade" mode="out-in">
          <div v-if="sendMessageModal" class="message-modal md:w-2/3 lg:w-1/2 xl:w-1/3">
            <SendMessageModal
              :user="user"
              :profileOption="true"
              @close="sendMessageModal=false"
              @showProfile="$router.push({ path: `/my-banks/${selectedId}`, query: {...$route.query}})"
            />
          </div>
        </transition>
        
        <div v-if="sendMessageModal" class="shield" @click="sendMessageModal=false" />

        <div v-if="locums.length > 0 && totalPages > 1" class="mt-5 flex justify-center">
          <AppPagination
            :total="total"
            :totalPages="totalPages"
            :currentPage="current_page"
            :perPage="perPage"
            @pagechanged="pagechanged"
          />
        </div>

        <div v-if="!locums.length" class="flex flex-row flex-wrap justify-center">
          <div>There are no locums connected to your practice yet.</div>
        </div>

        <transition name="fade" mode="out-in">
          <nuxt-link
            v-if="$route.name.includes('my-banks-index-locumId') && !sendMessageModal"
            class="shield border-red-500"
            :to="{ path: `/my-banks`, query: { ...$route.query}}"
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
import debounce from "lodash.debounce"
import AppLoading from "@/components/Base/AppLoading"
import AppAvatar from "@/components/Base/AppAvatar"
import AppPagination from "@/components/Base/AppPagination"
import SendMessageModal from "@/components/Messages/SendMessageModal"
import AppInputSmall from "@/components/Base/AppInputSmall"

export default {
  transition: {
    name: "fade",
    mode: "out-in",
  },

  components: {
    AppLoading,
    AppAvatar,
    AppPagination,
    SendMessageModal,
    AppInputSmall,
  },

  middleware ({ query, error, }) {
    if (
      query.practice_locum_type
      && ![
        "favorite",
        "completed",
        "successful",
        "applied",
        "appointed",
        "rejected",
        "withdrawn",
        "lates",
        "all",
      ].includes(query.practice_locum_type.toLowerCase())
    ) {
      return error({
        status: 404,
        message: "This MyBanks Status is Invalid",
      })
    }
  },

  data () {
    return {
      search: '',
      locums: [],
      total: 0,
      current_page: 1,
      loading: false,
      toggleTable: false,
      is_favorite: false,
      detailed: true,
      sendMessageModal: false,
      user: [],
      selectedId: null,
    }
  },

  computed: {
    loggedInPracticeType () {
      if (
        this.$auth.loggedIn
        && this.$auth.user
        && this.$auth.user.domain === 'Practice'
        && this.$auth.user.practice_detail
        && this.$auth.user.practice_detail.practice
      ) {
        return this.$auth.user.practice_detail.practice.type
      }

      return 'Stand Alone'
    },

    practiceLocumType () {
      return this.$route.query.practice_locum_type || 'Favorite'
    },

    surgeriesBank () {
      return this.$route.query.surgeries_bank === 'true'
    },

    professionCategoryName () {
      return this.$route.query.profession_category_name || 'GP'
    },

    offset () {
      return this.perPage * (this.current_page - 1)
    },

    perPage () {
      return 8
    },

    totalPages () {
      return Math.ceil(this.total / this.perPage)
    },

    authPermissions () {
      return this.$store.getters["permissions"]
    },
  },

  watch: {
    search (value) {
      this.searchSubmit(value)
    },

    practiceLocumType () {
      this.toggleTable = false
      this.getLocumsCount()
    },

    surgeriesBank () {
      this.toggleTable = false
      this.getLocumsCount()
    },

    professionCategoryName () {
      this.toggleTable = false
      this.getLocumsCount()
    },
  },
  
  created () {
    if(!this.$route.name.includes('reports')){
      this.getLocumsCount()
    }
  },
  
  methods: {
    searchSubmit: debounce (function () {
      this.getLocumsCount()
      // this.$router.push('/my-banks?practice_locum_type=All')
    }, 500),
    
    message (user) {
      this.selectedId = user.id
      this.user = user
      this.sendMessageModal = true
    },
    
    getLocumsCount () {
      this.loading = true
      this.$axios.get(`/api/v1/practice/locums/count`, {
        params: {
          search: this.search,
          practice_locum_type: this.practiceLocumType,
          practice_locum_type_surgeries : this.surgeriesBank,
          profession_category_name: this.practiceLocumType === 'All' ? '' : this.professionCategoryName,
          dont_show_deactivated_or_deleted_locum: true,
        },
      }).then((response) => {
        this.total = response.data.data.count
        this.getLocums(this.current_page)
      }).catch(err => {
        console.log('err', err.response || err)
      })
    },
    
    getLocums (page) {
      this.current_page = page
      this.$axios.get(`/api/v1/practice/locums`, {
        params: {
          search: this.search,
          practice_locum_type: this.practiceLocumType,
          practice_locum_type_surgeries : this.surgeriesBank,
          profession_category_name: this.practiceLocumType === 'All' ? '' : this.professionCategoryName,
          dont_show_deactivated_or_deleted_locum: true,
          limit: this.perPage,
          offset: this.offset,
        },
      }).then((response) => {
        this.locums = response.data.data.users
      }).catch(err => {
        console.log('err', err.response || err)
      }).finally(() => {
        this.toggleTable = true
        this.loading = false
      })
    },
    
    favorite (id) {
      let locum = this.locums.find(locum => locum.id === id)
      if (!locum.is_favorite) {
        this.$axios.post(`/api/v1/practice/locums/${id}/favorite`).then(() => {
          this.$store.commit('SET_NOTIFICATION', {
            enabled: true,
            status: 'success',
            text: ['Added to favourites',],
          })

          locum.is_favorite = true
        }).catch(err => {
          if (err.response.data) {
            this.$store.commit('SET_NOTIFICATION', {
              enabled: true,
              status: 'danger',
              text: [`${err.response.message}`,],
            })
          }
        })
      } else {
        this.$axios.delete(`/api/v1/practice/locums/${id}/favorite`).then(() => {
          this.$store.commit('SET_NOTIFICATION', {
            enabled: true,
            status: 'success',
            text: ['Remove to favourites',],
          })

          locum.is_favorite = false
        }).catch(err => {
          if (err.response.data) {
            this.$store.commit('SET_NOTIFICATION', {
              enabled: true,
              status: 'danger',
              text: [`${err.response.message}`,],
            })
          }
        })

        if (this.practiceLocumType.toLowerCase() === 'favorite') {
          const index = this.locums.findIndex(locum => locum.id === id)
          if (index > -1) {
            this.locums.splice(index, 1)
          }
        }
      }
    },
    
    pagechanged (e) {
      this.current_page = e
      this.getLocums(this.current_page)
    },
  },
}
</script>

<style>
  .chat-svg:hover {
    color: #535c6d #3c4453 #fff;
  }
</style>
