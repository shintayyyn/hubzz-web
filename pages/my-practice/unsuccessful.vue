<template>
  <section v-if="!loading">
    <div v-if="practices.length > 0">
      <MyPractices :practices="practices" @show="show" />

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
      <div>You do not have any Unsuccessful Job for any Practices</div>
    </div>
    <div class="shield" v-if="tabs.includes($route.name)"></div>
    <nuxt-child />
  </section>
</template>
<script>
const tabs = [
  "my-practice-completed-practiceId",
  "my-practice-completed-practiceId-profile",
  "my-practice-completed-practiceId-users",
  "my-practice-completed-practiceId-surgeries",
  "my-practice-completed-practiceId-standard-terms",
  "my-practice-completed-practiceId-related-jobs"
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
    this.getUnsuccessfulPracticesCount();
  },
  methods: {
    getUnsuccessfulPracticesCount() {
      this.$axios
        .$get(`/api/v1/locum/practices/count?locum_practice_type=Unsuccessful`)
        .then(res => {
          this.total = res.data.count;
          this.getUnsuccessfulPractices(this.current_page);
        });
    },
    getUnsuccessfulPractices(page) {
      this.$axios
        .$get(
          `/api/v1/locum/practices?locum_practice_type=Unsuccessful&offset=${this.offset}&limit=${this.perPage}`
        )
        .then(res => {
          this.practices = res.data.practices;
          this.loading = false;
        });
    },
    show(id) {
      this.$router.push(`/my-practice/unsuccessful/${id}`);
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


