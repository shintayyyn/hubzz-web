<template>
  <section class="relative">
    <transition name="fade" mode="out-in">
      <div v-if="toggleTable">
        <AppLoading :loading="loading" spinner />
        <div class="flex flex-row flex-wrap justify-start">
          <div
            class="w-full md:w-1/3 lg:w-1/4 p-2 "
            v-for="locum in locums"
            :key="locum.id"
          >
          <div class="h-full rounded-lg shadow-lg bg-gray-300 hover:bg-gray-400 p-4">
            <nuxt-link :to="{ path: `/my-banks/${locum.id}`, query: {...$route.query}}">
              <div
                class="flex justify-end z-50 "
                v-if="authPermissions.includes('Favorite MyBanks Locum')"
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
        <div class="mt-5 flex justify-center" v-if="locums.length > 0 && totalPages > 1">
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
            class="shield"
            v-if="$route.name.includes('my-banks-index-locumId')"
            :to="{ path: `/my-banks`, query: { ...$route.query}}"
          ></nuxt-link>
        </transition>
        <div>
          <nuxt-child />
        </div>
      </div>
    </transition>
  </section>
</template>
<script>
import AppLoading from "@/components/Base/AppLoading";
import AppAvatar from "@/components/Base/AppAvatar";
import AppPagination from "@/components/Base/AppPagination";
export default {
  components: {
    AppLoading,
    AppAvatar,
    AppPagination
  },
  middleware({ query, redirect, error }) {
    if (!query.status) {
      // api (Favorite only)
      redirect(`/my-banks?status=Favorite`);
    }
    if (
      query.status &&
      !["favorite", "applied", "appointed", "rejected", "withdrawn"].includes(
        query.status.toLowerCase()
      )
    ) {
      return error({
        status: 404,
        message: "This MyBanks Status is Invalid"
      });
    }
  },
  data() {
    return {
      locums: [],
      total: 0,
      current_page: 1,
      loading: false,
      toggleTable: false,
      is_favorite: false,
      detailed: true
    };
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
      return this.$store.getters["auth/permissions"];
    }
  },
  watch: {
    "$route.query"({ status: newStatus }, { status: oldStatus }) {
      if (newStatus && newStatus !== null && newStatus !== oldStatus) {
        this.toggleTable = false;
        this.getLocumsCount();
      }
    }
  },
  created() {
    this.getLocumsCount();
  },
  methods: {
    getLocumsCount() {
      console.log("get locums count");
      this.loading = true;
      this.$axios
        .$get(
          `/api/v1/practice/locums/count?practice_locum_type=${this.$route.query.status}`
        )
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
      this.current_page = page;
      this.$axios
        .$get(
          `/api/v1/practice/locums?practice_locum_type=${this.$route.query.status}&offset=${this.offset}&limit=${this.perPage}`, { params: { detailed: true } }
        )
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
    favorite(id) {
      let locum = this.locums.find(locum => locum.id === id);
      console.log(locum);
      if (!locum.is_favorite) {
        this.$axios
          .$post(`/api/v1/practice/locums/${id}/favorite`)
          .then(res => {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: ["Added to favourites"]
            });
          });
      } else {
        this.$axios
          .$delete(`/api/v1/practice/locums/${id}/favorite`)
          .then(res => {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: ["Remove to favourites"]
            });
          });
        if (this.$route.query.status.toLowerCase() === "favorite") {
          this.locums.splice(
            this.locums.findIndex(locum => locum.id === id),
            1
          );
        }
      }
      locum.is_favorite = !locum.is_favorite;
    },
    pagechanged(e) {
      this.current_page = e;
      this.getLocums(this.current_page);
    }
  }
};
</script>
