<template>
  <section v-if="!loading">
    <div v-if="practices.length > 0">
      <MyPractices
        :practices="practices"
        @show="show"
        @unfavorite="unfavorite"
        @favorite="favorite"
      />
      <div class="mt-5 flex justify-center" v-if="practices.length > 0 && totalPages > 1">
        <AppPagination
          :total="total"
          :totalPages="totalPages"
          :currentPage="current_page"
          @pagechanged="pagechanged"
        />
      </div>
    </div>
    <div v-else class="flex flex-row flex-wrap justify-center">
      <div>You do not have any Associated Job for any Practices</div>
    </div>
    <div class="shield" v-if="tabs.includes($route.name)"></div>
    <nuxt-child />
  </section>
</template>
<script>
const tabs = [
  "my-practice-all-practiceId",
  "my-practice-all-practiceId-profile",
  "my-practice-all-practiceId-users",
  "my-practice-all-practiceId-surgeries",
  "my-practice-all-practiceId-standard-terms",
  "my-practice-all-practiceId-related-jobs"
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
    this.getPracticesCount();
  },
  methods: {
    getPracticesCount() {
      this.$axios.$get(`/api/v1/locum/practices/count`).then(res => {
        this.total = res.data.count;
        this.getPractices(this.current_page);
      });
    },
    getPractices(page) {
      this.current_page = page;
      this.$axios
        .$get(
          `/api/v1/locum/practices?offset=${this.offset}&limit=${this.perPage}`
        )
        .then(res => {
          this.practices = res.data.practices;
          this.loading = false;
        });
    },
    favorite({ practiceId, index }) {
      this.$axios
        .$post(`/api/v1/locum/practices/${practiceId}/favorite`)
        .then(res => {
          this.practices.splice(index, 1, res.data.practice);
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`${res.message}`]
          });
        });
    },
    unfavorite({ practiceId, index }) {
      this.$axios
        .$delete(`/api/v1/locum/practices/${practiceId}/favorite`)
        .then(res => {
          this.practices.splice(index, 1, res.data.practice);
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`${res.message}`]
          });
        });
    },
    show(id) {
      this.$router.push(`/my-practice/all/${id}`);
    },
    pagechanged(e) {
      this.current_page = e;
      this.getPractices(this.current_page);
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


