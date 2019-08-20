<template>
  <section>
    <div class="list-section flex flex-col mt-4 pb-32" v-if="surgeries.length > 0">
      <div class="flex flex-row px-4 flex-no-wrap justify-between">
        <div class="text-xs sm:text-sm w-full px-1">Practice</div>
        <div class="text-xs sm:text-sm w-full px-1">Practice code</div>
        <div class="text-xs sm:text-sm w-full px-1">Location</div>
        <div></div>
      </div>
      <div
        class="rounded-lg shadow-lg p-4 mt-4"
        v-for="(item, index) in surgeries"
        :key="`${item.id}-${index}`"
      >
        <div class="flex flex-row flex-no-wrap">
          <div class="text-xs sm:text-sm w-full px-1">{{item.surgery.name}}</div>
          <div class="text-xs sm:text-sm w-full px-1">{{item.surgery.code}}</div>
          <div
            class="text-xs sm:text-sm w-full px-1"
          >{{item.surgery.address.line_1}} {{item.surgery.address.line_2}} {{item.surgery.address.line_3}} {{item.surgery.address.post_code}}</div>
        </div>
      </div>
    </div>
    <div v-else class="flex justify-center">no branches / surgeries</div>
    <div class="bottom-0 w-full" v-if="surgeries.length > 0 && totalPages > 1">
      <AppPagination
        :total="total"
        :totalPages="totalPages"
        :currentPage="current_page"
        @pagechanged="pagechanged"
      />
    </div>
    <transition name="fade" mode="out-in">
      <div class="modal-shield" v-if="$route.name === 'profile-branches-surgeries-create'"></div>
    </transition>
    <nuxt-child />
  </section>
</template>
<script>
import AddSurgeryModal from '@/components/Profile/AddSurgeryModal'
import AppPagination from '@/components/Base/AppPagination'
import AppLoading from '@/components/Base/AppLoading'
export default {
  transition: {
    name: 'fade',
    mode: 'out-in'
  },
  components: {
    AddSurgeryModal,
    AppPagination,
    AppLoading,
  },

  data() {
    return {
      current_page: 1,
    }
  },
  computed: {
    surgeries() {
      return this.$store.state.profile.surgeries
    },
    offset() {
      return this.perPage * (this.current_page - 1);
    },
    perPage() {
      return 5;
    },
    total() {
      return this.$store.state.profile.surgeries_count;
    },
    totalPages() {
      return Math.ceil(this.total / this.perPage);
    },
  },
  async asyncData({ app, store, error }) {
    try {
      const responseCount = await app.$axios.$get(`/api/v1/practice/practice-children/count`)
      const count = responseCount.data && responseCount.data.count ? responseCount.data.count : 0
      store.commit('profile/SET_SURGERIES_COUNT', count)
      let params = {
        offset: 0,
        limit: 5
      }
      const responseSurgery = await app.$axios.$get(`/api/v1/practice/practice-children`, { params })
      let surgeries = responseSurgery.data && responseSurgery.data.practice_children && responseSurgery.data.practice_children.length ? responseSurgery.data.practice_children : []
      // surgeries = [store.$auth.user.practice_detail.practice, ...surgeries]
      store.commit('profile/SET_SURGERIES', surgeries)
    } catch (err) {
      throw err
    }
  },
  methods: {
    getSurgeries(page) {
      let offset = 0
      offset = this.perPage * (parseInt(page) - 1)
      this.$axios.$get(`/api/v1/practice/practice-children?limit=${this.perPage}&offset=${offset}`).then(res => {
        this.$store.commit('profile/SET_SURGERIES', res.data.practice_children)
      })
    },
    pagechanged(e) {
      this.current_page = e
      this.getSurgeries(this.current_page)
    }
  }
}
</script>
<style scoped>
.modal-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 511;
}
.list-section {
  position: relative;
  min-height: 600px;
}
</style>

