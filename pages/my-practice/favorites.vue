<template>
  <section v-if="!loading">
    <div v-if="practices.length > 0">
      <MyPractices :practices="practices" @show="show" @favorite="favorite" />
    </div>
    <div v-else class="flex flex-row flex-wrap justify-center">
      <div>You haven't favorite any Practices yet</div>
    </div>
    <div class="mt-5 flex justify-center" v-if="practices.length > 0 && totalPages > 1">
      <AppPagination
        :total="total"
        :totalPages="totalPages"
        :currentPage="current_page"
        @pagechanged="pagechanged"
      />
    </div>
    <div
      class="shield"
      v-if="$route.name.includes('my-practice-favorites-practiceId')"
      @click="$router.push('/my-practice/favorites')"
    ></div>
    <nuxt-child />
  </section>
</template>
<script>
import AppPagination from "@/components/Base/AppPagination";
import MyPractices from "@/components/MyPractice/MyPractices";
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },
  components: {
    AppPagination,
    MyPractices
  },
  data() {
    return {
      practices: [],
      current_page: 1,
      total: 0,
      practice: null,
      loading: true
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
    }
  },
  watch: {
    $route(value) {
      if (value.name.includes("my-practice-favorites-practiceId")) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
    }
  },
  created() {
    this.getFavoritePracticesCount();
  },
  methods: {
    getFavoritePracticesCount() {
      this.$axios
        .$get(`/api/v1/locum/practices/count?locum_practice_type=Favorite`)
        .then(res => {
          //GET QUANTITY OF DATA
          this.total = res.data.count;
          this.getFavoritePractices(this.current_page);
        });
    },
    getFavoritePractices(page) {
      this.current_page = page;
      this.$axios
        .$get(
          `/api/v1/locum/practices?locum_practice_type=Favorite&offset=${this.offset}&limit=${this.perPage}`
        )
        .then(res => {
          this.practices = res.data.practices;
          this.loading = false;
        });
    },
    favorite(id) {
      let practice = this.practices.find(practice => practice.id === id);
      let index = this.practices.findIndex(practice => practice.id === id);
      if (!practice.is_favorite) {
        this.$axios
          .$post(`/api/v1/locum/practices/${id}/favorite`)
          .then(res => {
            practice.is_favorite = !practice.is_favorite;
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
            practice.is_favorite = !practice.is_favorite;
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: ["Remove to favourites"]
            });
            this.practices.splice(index, 1);
          });
      }
    },
    show(id) {
      this.$router.push(`/my-practice/favorites/${id}`);
    },
    pagechanged(e) {
      this.current_page = e;
      this.getCompletedPractices(this.current_page);
    }
  }
};
</script>