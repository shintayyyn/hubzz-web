<template>
  <section v-if="!loading">
    <div class="-mt-2">
      <AppInput
        v-model="profession_id"
        :type="'select'"
        :name="'Filter Locums by'"
        :label="'Filter Locums by'"
        :placeholder="'All'"
        :items="professions"
      />
    </div>
    <div v-if="users.length > 0">
      <MyLocums :users="users" @show="show" @favorite="favorite" />

      <div class="mt-5 flex justify-center" v-if="users.length > 0 && totalPages > 1">
        <AppPagination
          :total="total"
          :totalPages="totalPages"
          :currentPage="current_page"
          @pagechanged="pagechanged"
        />
      </div>
    </div>
    <div v-else class="flex flex-row flex-wrap justify-center">
      <div>There are no favourite locums connected to your practice yet.</div>
    </div>
    <div
      class="shield"
      v-if="$route.name.includes('my-banks-withdrawn-userId')"
      @click="$router.push(`/my-banks/withdrawn`)"
    ></div>
    <nuxt-child />
  </section>
</template>
<script>
import AppPagination from "@/components/Base/AppPagination";
import MyLocums from "@/components/MyBanks/MyLocums";
import AppInput from "@/components/Base/AppInput";
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },
  components: {
    AppPagination,
    AppInput,
    MyLocums
  },
  data() {
    return {
      professions: [],
      users: [],
      current_page: 1,
      total: 0,
      user: null,
      loading: true,

      params: {
        profession_id: ""
      },

      profession_id: "All"
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
    this.getProfessions();
    this.getLocumsCount();
  },
  watch: {
    $route(value) {
      if (value.name.includes("my-banks-withdrawn-userId")) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
    },
    profession_id(value) {
      if (value === "All") {
        this.params.profession_id = "";
      } else {
        this.params.profession_id = value;
      }
      this.getLocumsCount();
    }
  },
  methods: {
    getProfessions() {
      this.$axios.$get(`/api/v1/professions`).then(res => {
        this.professions = [];
        this.professions.push({ label: "All", value: "All" });
        res.data.professions.forEach(item => {
          this.professions.push({ label: item.name, value: item.id });
        });
      });
    },
    getLocumsCount() {
      this.$axios
        .$get(`/api/v1/practice/locums/count?practice_locum_type=Declined`)
        .then(res => {
          this.total = res.data.count;
          if (this.total > 0) {
            this.getLocums(this.current_page);
          } else {
            this.loading = false;
          }
        });
    },
    getLocums(page) {
      this.current_page = page;
      let defaultParams = {
        offset: this.offset,
        limit: this.perPage,
        practice_locum_type: "Declined"
      };
      let locumParams = { ...defaultParams, ...this.params };
      this.$axios
        .$get(`/api/v1/practice/locums`, { params: locumParams })
        .then(res => {
          this.users = res.data.users;
          this.loading = false;
        });
    },
    favorite(id, index) {
      let locum = this.users.find(locum => locum.id === id);
      if (!locum.is_favorite) {
        this.$axios
          .$post(`/api/v1/practice/locums/${id}/favorite`)
          .then(res => {
            locum.is_favorite = !locum.is_favorite;
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
            locum.is_favorite = !locum.is_favorite;
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: ["Removed to favourites"]
            });
          });
      }
    },
    show(id) {
      this.$router.push(`/my-banks/withdrawn/${id}`);
    },
    pagechanged(e) {
      this.current_page = e;
      this.getLocums(this.current_page);
    }
  }
};
</script>
<style scoped>
.shield {
  z-index: 509;
}
</style>


