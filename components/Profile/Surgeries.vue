<template>
  <section>
    <div class="flex flex-row justify-end">
      <button
        class="bg-yellow-dark rounded-full font-bold text-3xl hover:text-white focus:outline-none"
        style="width:40px;height:40px;"
        @click="modal = true"
      >+</button>
      <div class="ml-2 text-xs sm:text-sm" style="line-height:280%">Add Surgery</div>
    </div>
    <div class="list-section flex flex-col mt-4 pb-32">
      <!-- <AppLoading /> -->
      <div class="flex flex-row px-4 flex-nowrap justify-between">
        <div class="text-xs sm:text-sm w-full px-1">Practice</div>
        <div class="text-xs sm:text-sm w-full px-1">Practice code</div>
        <div class="text-xs sm:text-sm w-full px-1">Location</div>
      </div>
      <div class="relative">
        <AppLoading :loading="loading" :message="'Loading'" v-if="loading" />
        <div
          class="rounded-lg shadow-lg p-4 mt-4"
          v-for="(item, index) in results"
          :key="`${item.id}-${index}`"
        >
          <div class="flex flex-row flex-nowrap">
            <div class="text-xs sm:text-sm w-full px-1">{{item.surgery.name}}</div>
            <div class="text-xs sm:text-sm w-full px-1">{{item.surgery.code}}</div>
            <div
              class="text-xs sm:text-sm w-full px-1"
            >{{item.surgery.address.line_1}} {{item.surgery.address.line_2}} {{item.surgery.address.line_3}} {{item.surgery.address.post_code}}</div>
          </div>
        </div>
      </div>
      <div class="absolute pin-b my-4 w-full">
        <AppPagination
          :total="total"
          :totalPages="totalPages"
          :currentPage="currentPage"
          @pagechanged="pagechanged"
          :loading="loading"
        />
      </div>
    </div>

    <div class="add-surgery-shield" v-if="modal"></div>
    <transition name="slide" mode="out-in">
      <div class="add-surgery-modal shadow-lg" v-if="modal">
        <AddSurgeryModal @close="modal = false" @add="results.push($event)" />
      </div>
    </transition>
  </section>
</template>
<script>
import AddSurgeryModal from '@/components/Profile/AddSurgeryModal'
import AppPagination from '@/components/Base/AppPagination'
import AppLoading from '@/components/Base/AppLoading'
export default {
  components: {
    AddSurgeryModal,
    AppPagination,
    AppLoading,
  },

  data() {
    return {
      modal: false,
      results: [],
      total: 0,
      totalPages: 0,
      currentPage: 0,
      perPage: 0,
      loading: false,
    }
  },
  beforeDestroy() {
    if (this.$route.query.profile_tab === 'practice') {
      this.$router.push('/profile?profile_tab=practice')
    }
  },
  watch: {
    $route(to, from) {
      this.currentPage = parseInt(to.query.current_page)
      this.getSurgeries()
    }
  },
  created() {
    const query = {
      ...this.$route.query,
      current_page: this.$route.query.current_page || 1
    }
    this.currentPage = parseInt(this.$route.query.current_page)
    this.$router.push({ query })
    this.$axios.$get(`/api/v1/practice/practice-children/count`).then(res => {
      this.total = res.data.count
      this.perPage = 5
      this.totalPages = Math.ceil(this.total / this.perPage)
      this.getSurgeries()
    })
  },
  methods: {
    getSurgeries() {
      this.loading = true
      let offset = 0
      offset = this.perPage * (parseInt(this.$route.query.current_page) - 1)
      this.$axios.$get(`/api/v1/practice/practice-children?limit=${this.perPage}&offset=${offset}`).then(res => {
        this.results = []
        this.results.push(this.$auth.user.practice_detail.practice)
        res.data.practice_children.forEach(item => {
          this.results.push(item)
        })
        this.loading = false
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
<style scoped>
.add-surgery-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 511;
}
.add-surgery-modal {
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
  .add-surgery-modal {
    width: 70%;
  }
}
.list-section {
  position: relative;
  min-height: 600px;
}
</style>

