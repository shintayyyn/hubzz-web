<template>
  <section class="relative">
    <transition name="fade" mode="out-in">
      <div v-if="showTable">
        <AppLoading :loading="loading" spinner />
        <div class="flex flex-row flex-wrap justify-start">
          <div
            class="w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:max-w-sm p-2"
            v-for="practice in practices"
            :key="practice.id"
          >
            <div class="relative h-full rounded-lg shadow-lg bg-gray-300 p-4 hover:bg-gray-400">
              <nuxt-link
                class="w-full font-bold text-sm sm:text-lg leading-tight"
                :to="{ path: `/my-practice/platform/${practice.id}`, query: {...$route.query}}"
              >
                <div class="flex items-end justify-between z-50">
                  {{practice.surgery.name}}
                  <svgicon
                    v-model="practice.is_favorite"
                    :name="practice.is_favorite ? 'on-star' : 'off-star'"
                    height="28"
                    width="28"
                    class="cursor-pointer fill-current text-gray-700 hover:text-gray-800"
                    @click.prevent.stop="favorite(practice.id)"
                  />
                </div>
                <div
                  class="w-full font-bold text-gray-700 text-xs leading-tight pt-1"
                >{{practice.surgery.address.line_1}} {{practice.surgery.address.line_2}} {{practice.surgery.address.line_3}} {{practice.surgery.address.post_code}}</div>
              </nuxt-link>
              <AppLoading :loading="favoriteLoading" spinner />
            </div>
          </div>
        </div>
        <div class="mt-5 flex justify-center" v-if="practices.length > 0 && totalPages > 1">
          <AppPagination
            :total="total"
            :totalPages="totalPages"
            :currentPage="current_page"
            @pagechanged="pagechanged"
          />
        </div>
        <div v-if="!practices.length" class="flex flex-row flex-wrap justify-center">
          <div>You do not have any Associated Job for any Practices</div>
        </div>
        <transition name="fade" mode="out-in">
          <nuxt-link
            class="shield"
            v-if="$route.name.includes('my-practice-index-platform-practiceId')"
            :to="{ path: `/my-practice/platform`, query: { ...$route.query}}"
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
import AppPagination from "@/components/Base/AppPagination";
export default {
  components: {
    AppLoading,
    AppPagination
  },
  // middleware({ query, redirect, error, route }) {
  //   if (!query.status && route.name === "my-practice-index") {
  //     // api (Favorite only)
  //     redirect(`/my-practice?status=Favorite`);
  //   }
  //   if (
  //     query.status &&
  //     !["favorite", "completed", "applied", "unsuccessful"].includes(
  //       query.status.toLowerCase()
  //     )
  //   ) {
  //     return error({
  //       status: 404,
  //       message: "This MyPractice Status is Invalid"
  //     });
  //   }
  // },
  data() {
    return {
      loading: false,
      favoriteLoading: false,
      current_page: 1,
      showTable: false,
      practices: [],
      total: 0
    };
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
    }
  },
  watch: {
    "$route.query"({ status: newStatus }, { status: oldStatus }) {
      if (newStatus && newStatus !== null && newStatus !== oldStatus) {
        this.current_page = 1;
        this.showTable = false;
        setTimeout(async () => {
          this.$nuxt.$loading.start();
          await this.getPracticesPromiseAll();
          this.$nuxt.$loading.finish();
          this.showTable = true;
        }, 200);
      }
    }
  },
  async asyncData({ app, params, query, error }) {
    if (
      query.status &&
      !["favorite", "completed", "applied", "unsuccessful"].includes(
        query.status.toLowerCase()
      )
    ) {
      return error({
        status: 404
      });
    }

    try {
      const [total, practices] = await Promise.all([
        app.$axios
          .$get(
            `/api/v1/locum/practices/count?locum_practice_type=${
              query.status ? query.status : "Favorite"
            }`
          )
          .then(res => {
            const total = res.data && res.data.count ? res.data.count : 0;
            return total;
          }),
        app.$axios
          .$get(
            `/api/v1/locum/practices?locum_practice_type=${
              query.status ? query.status : "Favorite"
            }&offset=0&limit=5`
          )
          .then(res => {
            const practices =
              res.data && res.data.practices ? res.data.practices : [];
            return practices;
          })
      ]);

      const showTable = true;

      return {
        total,
        practices,
        showTable
      };
    } catch (err) {
      throw err;
    }
  },

  methods: {
    getPracticesPromiseAll() {
      let queryStatus =
        this.$route.query && this.$route.query.status
          ? this.$route.query.status
          : "Favorite";
      return Promise.all([
        this.$axios.$get(
          `/api/v1/locum/practices/count?locum_practice_type=${queryStatus}`
        ),
        this.$axios.$get(
          `/api/v1/locum/practices?locum_practice_type=${queryStatus}&offset=${this.offset}&limit=${this.perPage}`
        )
      ]).then(([responseCount, responsePractices]) => {
        this.total = responseCount.data.count;
        this.practices = responsePractices.data.practices;
      });
    },
    getPractices() {
      let queryStatus =
        this.$route.query && this.$route.query.status
          ? this.$route.query.status
          : "Favorite";
      return this.$axios
        .$get(
          `/api/v1/locum/practices?locum_practice_type=${queryStatus}&offset=${this.offset}&limit=${this.perPage}`
        )
        .then(res => {
          return (this.practices = res.data.practices);
        })
        .catch(err => {
          console.log("err", err.response || err);
          if (err.response.data.message) {
            return this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: [`${err.response.data.message}`]
            });
          }
        });
    },
    favorite(id) {
      let queryStatus = this.$route.query.status;
      let practice = this.practices.find(practice => practice.id === id);
      if (!practice.is_favorite) {
        this.favoriteLoading = true;
        this.$axios
          .$post(`/api/v1/locum/practices/${id}/favorite`)
          .then(res => {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: ["Added to favourites"]
            });
            practice.is_favorite = !practice.is_favorite;
          })
          .catch(err => {
            console.log("err", err.response || err);
            if (err.response.data.message) {
              this.$store.commit("SET_NOTIFICATION", {
                enabled: true,
                status: "danger",
                text: [`${err.response.data.message}`]
              });
            }
          })
          .finally(() => {
            this.favoriteLoading = false;
          });
      } else if (practice.is_favorite) {
        this.favoriteLoading = true;
        this.$axios
          .$delete(`/api/v1/locum/practices/${id}/favorite`)
          .then(res => {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: ["Remove to favourites"]
            });
            practice.is_favorite = !practice.is_favorite;
            if (!queryStatus || queryStatus.toLowerCase() === "favorite") {
              this.practices.splice(
                this.practices.findIndex(practice => practice.id === id),
                1
              );
            }
          })
          .catch(err => {
            console.log("err", err);
            if (err.response.data.message) {
              this.$store.commit("SET_NOTIFICATION", {
                enabled: true,
                status: "danger",
                text: [`${err.response.data.message}`]
              });
            }
          })
          .finally(() => {
            this.favoriteLoading = false;
          });
      }
    },
    async pagechanged(e) {
      this.current_page = e;
      this.loading = true;
      await this.getPractices();
      this.loading = false;
    }
  }
};
</script>
