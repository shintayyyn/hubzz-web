<template>
  <div class="p-4">
    <AppLoading :loading="loading" spinner />
    <div class="flex flex-row flex-wrap justify-start">
      <div v-if="locums.length == 0 && !loading">
        This spoke has no banks
      </div>
      <div v-for="locum in locums" :key="locum.id" class="w-full md:w-1/3 lg:w-1/4 p-2">
        <div class="h-full rounded-lg shadow-lg bg-gray-300 hover:bg-gray-400 p-4">
          <nuxt-link
            :to="{ path: `/hub-surgery-management/${$route.params.id}/surgery-banks/${locum.id}`, query: {...$route.query}}"
          >
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
      <div v-if="locums.length > 0 && totalPages > 1" class="mt-5 flex justify-center">
        <AppPagination
          :total="total"
          :totalPages="totalPages"
          :currentPage="current_page"
          :perPage="perPage"
          @pagechanged="pagechanged"
        />
      </div>

      <transition name="fade" mode="out-in">
        <nuxt-link
          v-if="['hub-surgery-management-id-surgery-banks-locumId',].includes($route.name)"
          class="shield"
          :to="`/hub-surgery-management/${$route.params.id}/surgery-banks`"
        />
      </transition>
    </div>
    <nuxt-child />
  </div>
</template>

<script>
import AppAvatar from "@/components/Base/AppAvatar"
import AppPagination from "@/components/Base/AppPagination"
import AppLoading from "@/components/Base/AppLoading"
export default {
  transition: {
    name: "fade",
    mode: "out-in",
  },
  components: {
    AppAvatar,
    AppPagination,
    AppLoading,
  },
  
  props: {
    practiceSurgery: {
      type: Object,
      default: () => null,
    },
  },

  data () {
    return {
      locums: [],
      // practiceSpoke: "",
      params: {
        favorite_by_practice_id: "",
      },
      // for pagination
      total: 0,
      current_page: 1,
      loading: false,
      toggleTable: false,
      is_favorite: false,
      detailed: true,
    }
  },
  computed: {
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
  async asyncData ({ app, error, store, }) {
    try {
      const authPermissions = store.getters["permissions"]

      if (app.$auth.user.domain === 'Practice'
          && authPermissions.includes('View Surgery Banks') === false) {
        error({
          statusCode: 403,
          message: 'You are not authorized to view this page.',
        })
        return
      }

    } catch (err) {
      console.log('err', err.response || err)
      error({
        statusCode: 403,
        message: 'You are not authorized to view this page.',
      })
    }
  },
  created () {
    this.getLocumsCount()
  },
  methods: {
    getLocumsCount () {
      let params = {
        favorite_by_practice_id: this.practiceSurgery.child_practice_id,
      }
      this.loading = true
      this.$axios
        .$get(`/api/v1/practice/locums/count`, { params, })
        .then(res => {
          this.total = res.data.count
          this.getLocums(this.current_page)
        })
        .catch(err => {
          console.log("err", err)
        })
    },
    getLocums (page) {
      let params = {
        limit: this.perPage,
        offset: this.offset,
        favorite_by_practice_id: this.practiceSurgery.child_practice_id,
        detailed: true,
      }
      this.current_page = page
      this.$axios
        .$get(`/api/v1/practice/locums`, { params, })
        .then(res => {
          this.locums = res.data.users
          this.toggleTable = true
          this.loading = false
        })
        .catch(err => {
          console.log("err", err)
        })
    },
    pagechanged (e) {
      this.current_page = e
      this.getLocums(this.current_page)
    },
  },
}
</script>
<style>
.modal-container {
  z-index: 510;
}
@media screen and (min-width: 1200px) {
  .modal-container {
    width: 70%;
  }
}
</style>
