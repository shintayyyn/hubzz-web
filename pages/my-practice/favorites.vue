<template>
  <section v-if="!loading">
    <div v-if="practices.length > 0">
      <MyPractices :practices="practices" @show="show" @unfavorite="unfavorite" />
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
    <div class="shield" v-if="tabs.includes($route.name)"></div>
    <nuxt-child />
  </section>
</template>
<script>
const tabs = [
  "my-practice-favorites-practiceId",
  "my-practice-favorites-practiceId-profile",
  "my-practice-favorites-practiceId-users",
  "my-practice-favorites-practiceId-surgeries",
  "my-practice-favorites-practiceId-standard-terms",
  "my-practice-favorites-practiceId-related-jobs"
];
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
      tabs,
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

    unfavorite({ practiceId, index }) {
      this.practices.splice(index, 1);
      this.$axios
        .$delete(`/api/v1/locum/practices/${practiceId}/favorite`)
        .then(res => {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`${res.message}`]
          });
        });
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
<style scoped>
.shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 509;
}
</style>


