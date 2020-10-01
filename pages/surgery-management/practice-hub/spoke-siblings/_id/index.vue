<template>
  <div class="modal-container p-4 md:p-8">
    <div>
      <div class="my-2">
        <nuxt-link :to="'/surgery-management/practice-hub/spoke-siblings'" class="cursor-pointer">
          <svgicon name="left-arrow" height="32" width="32" />
        </nuxt-link>
      </div>
      <div class="font-bold text-lg px-2">Banks</div>
      <div
        v-if="practiceSibling.share_banks_to_other_surgeries == false"
      >The Banks of this spokes are not shared.</div>

      <div
        v-if="practiceSibling.share_banks_to_other_surgeries == true"
        class="flex flex-row flex-wrap justify-start"
      >
        <div v-if="locums.length < 1">This spoke has no banks.</div>
        <div
          v-else
          class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2"
          v-for="locum in locums"
          :key="locum.id"
        >
          <div class="h-full w-full flex flex-row flex-wrap justify-start">
            <div class="h-full w-full rounded-lg shadow-lg bg-gray-300 hover:bg-gray-400 p-4">
              <nuxt-link
                :to="{ path: `/surgery-management/practice-hub/spoke-siblings/${$route.params.id}/sibling-bank/${locum.id}`, query: {...$route.query}}"
              >
                <div
                  class="flex justify-end z-50"
                  v-if="authPermissions.includes('Mark Locum as Favorite')"
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

                <div class="flex flex-wrap text-center mt-4 cursor-pointer">
                  <div class="w-full flex justify-center">
                    <AppAvatar
                      :src="locum.avatar && locum.avatar.file && locum.avatar.file.url ? locum.avatar.file.url : ''"
                    />
                  </div>
                  <div
                    class="w-full font-bold text-sm sm:text-lg my-4 leading-tight"
                  >{{locum.personal_detail.name}}</div>
                  <div
                    class="w-full mb-4 font-bold text-gray-700 text-sm leading-tight"
                  >{{locum.locum_detail.profession.name}}</div>
                </div>
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-5 flex justify-center" v-if="locums.length > 0 && totalPages > 1">
        <AppPagination
          :total="total"
          :totalPages="totalPages"
          :currentPage="current_page"
          :perPage="perPage"
          @pagechanged="pagechanged"
        />
      </div>
    </div>
    <nuxt-child />
  </div>
</template>
<script>
import AppAvatar from "@/components/Base/AppAvatar";
import AppPagination from "@/components/Base/AppPagination";
export default {
  components: {
    AppAvatar,
    AppPagination
  },
  data() {
    return {
      locums: [],
      practiceSibling: "",
      params: {
        favorite_by_practice_id: ""
      },
      // for pagination
      total: 0,
      current_page: 1,
      loading: false,
      toggleTable: false,
      is_favorite: false,
      detailed: true
    };
  },
  created() {
    this.getLocumsCount();
  },
  computed: {
    offset() {
      return this.perPage * (this.current_page - 1);
    },
    perPage() {
      return 8;
    },
    totalPages() {
      return Math.ceil(this.total / this.perPage);
    },
    authPermissions() {
      return this.$store.getters["permissions"];
    }
  },
  async asyncData({ app, route, store }) {
    try {
      // let params = {
      //   favorite_by_practice_id : route.params.id
      // }
      // let response = await app.$axios.$get(`/api/v1/practice/locums/count`, { params })
      // const total = response.data.count
      // params = {
      //   limit
      // }
      // response = await app.$axios.$get(`/api/v1/practice/locums`,{ params })
      // const locums = response.data.users
      let params = {
        id: route.params.id
      };
      let response = await app.$axios.$get(
        `/api/v1/practice/me/parent-surgery/practice-siblings`,
        { params }
      );
      const practiceSibling = response.data.practice_siblings;
      return {
        // total,
        // locums,
        practiceSibling
      };
    } catch (err) {
      console.log("get locum error!", err);
    }
  },
  methods: {
    getLocumsCount() {
      console.log("route", this.$route.params.id);
      let params = {
        favorite_by_practice_id: this.$route.params.id
      };
      console.log("get locums count");
      this.loading = true;
      this.$axios
        .$get(`/api/v1/practice/locums/count`, { params })
        .then(res => {
          console.log(res);
          this.total = res.data.count;
          this.getLocums(this.current_page);
        })
        .catch(err => {
          console.log("err", err);
        });
    },
    getLocums(page) {
      console.log("get locums");
      let params = {
        limit: this.perPage,
        offset: this.offset,
        favorite_by_practice_id: this.$route.params.id,
        detailed: true
      };
      this.current_page = page;
      this.$axios
        .$get(`/api/v1/practice/locums`, { params })
        .then(res => {
          console.log(res);
          this.locums = res.data.users;
          this.toggleTable = true;
          this.loading = false;
        })
        .catch(err => {
          console.log("err", err);
        });
    },
    pagechanged(e) {
      this.current_page = e;
      this.getLocums(this.current_page);
    }
  }
};
</script>

<style>
.modal-container {
  z-index: 510;
}
@media screen and (min-width: 1200px) {
  .modal-container {
    width: 80%;
  }
}
</style>