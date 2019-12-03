<template>
  <section class="relative">
    <transition name="fade" mode="out-in">
      <div v-if="toggleTable">
        <AppLoading :loading="loading" spinner />
        <div class="flex flex-row flex-wrap justify-start">
          <div
            class="w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:max-w-sm p-2"
            v-for="practice in practices"
            :key="practice.id"
          >
            <div class="h-full rounded-lg shadow-lg bg-gray-300 p-4 hover:bg-gray-400">
              <nuxt-link
                class="w-full font-bold text-sm sm:text-lg leading-tight"
                :to="{ path: `/my-practice/${practice.id}`, query: {...$route.query}}"
              >
                <div class="flex items-end justify-between z-50">
                  {{practice.surgery.name}}
                  <svgicon
                    v-model="is_favorite"
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
            v-if="$route.name.includes('my-practice-index-practiceId')"
            :to="{ path: `/my-practice`, query: { ...$route.query}}"
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
  middleware({ query, redirect, error }) {
    if (!query.status) {
      redirect(`/my-practice?status=Favorite`);
    }
    if (
      query.status &&
      !["favorite", "completed", "applied", "unsuccessful"].includes(
        query.status.toLowerCase()
      )
    ) {
      return error({
        status: 404,
        message: "This MyPractice Status is Invalid"
      });
    }
  },
  data() {
    return {
      practices: [],
      total: 0,
      current_page: 1,
      loading: false,
      toggleTable: false,
      is_favorite: false
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
        this.toggleTable = false;
        this.getPracticesCount();
      }
    }
  },
  created() {
    this.getPracticesCount();
  },
  methods: {
    getPracticesCount() {
      this.loading = true;
      this.$axios
        .$get(
          `/api/v1/locum/practices/count?locum_practice_type=${this.$route.query.status}`
        )
        .then(res => {
          this.total = res.data.count;
          this.getPractices(this.current_page);
        })
        .catch(err => {
          console.log("err", err);
        });
    },
    getPractices(page) {
      this.current_page = page;
      this.$axios
        .$get(
          `/api/v1/locum/practices?locum_practice_type=${this.$route.query.status}&offset=${this.offset}&limit=${this.perPage}`
        )
        .then(res => {
          this.practices = res.data.practices;
          this.toggleTable = true;
          this.loading = false;
        })
        .catch(err => {
          console.log("err", err);
        });
    },
    favorite(id) {
      let practice = this.practices.find(practice => practice.id === id);
      if (!practice.is_favorite) {
        this.$axios
          .$post(`/api/v1/locum/practices/${id}/favorite`)
          .then(res => {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: ["Added to favourites"]
            });
          });
      } else {
        this.$axios
          .$delete(`/api/v1/locum/practices/${id}/favorite`)
          .then(res => {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: ["Remove to favourites"]
            });
          });
        if (this.$route.query.status.toLowerCase() === "favorite") {
          this.practices.splice(
            this.practices.findIndex(practice => practice.id === id),
            1
          );
        }
      }
      practice.is_favorite = !practice.is_favorite;
    },
    pagechanged(e) {
      this.current_page = e;
      this.getPractices(this.current_page);
    }
  }
};
</script>
