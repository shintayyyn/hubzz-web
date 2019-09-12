<template>
  <section v-if="!loading">
    <div v-if="practices.length > 0">
      <MyPractices :practices="practices" @show="show" @favorite="favorite" />

      <div class="m-10 xl:-ml-32" v-if="practices.length > 0 && totalPages > 1">
        <AppPagination
          :total="total"
          :totalPages="totalPages"
          :currentPage="current_page"
          @pagechanged="pagechanged"
        />
      </div>
    </div>
    <div v-else class="flex flex-row flex-wrap justify-center">
      <div>You do not have any Completed Job for any Practices</div>
    </div>
    <div class="shield" v-if="$route.name.includes('my-practice-completed-practiceId')"></div>
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
      return 5;
    },
    totalPages() {
      return Math.ceil(this.total / this.perPage);
    }
  },
  watch: {
    $route(value) {
      if (value.name.includes("my-practice-completed-practiceId")) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
    }
  },
  created() {
    this.getCompletedPracticesCount();
  },
  methods: {
    getCompletedPracticesCount() {
      this.$axios
        .$get(`/api/v1/locum/practices/count?locum_practice_type=Completed`)
        .then(res => {
          //GET QUANTITY OF DATA
          this.total = res.data.count;
          this.getCompletedPractices(this.current_page);
        });
    },
    getCompletedPractices(page) {
      this.current_page = page;
      this.$axios
        .$get(
          `/api/v1/locum/practices?locum_practice_type=Completed&offset=${this.offset}&limit=${this.perPage}`
        )
        .then(res => {
          this.practices = res.data.practices;
          this.loading = false;
        });
    },
    favorite(id) {
      let practice = this.practices.find(practice => practice.id === id);
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
          });
      }
    },
    show(id) {
      this.$router.push(`/my-practice/completed/${id}`);
    },
    pagechanged(e) {
      this.current_page = e;
      this.getCompletedPractices(this.current_page);
    }
  }
};
</script>


