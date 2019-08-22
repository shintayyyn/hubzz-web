<template>
  <section v-if="!loading">
    <div class="-mt-2">
      <AppSelect
        v-model="profession_id"
        :name="'Filter Locums by'"
        :label="'Filter Locums by'"
        :items="professions"
        :placeholder="'All'"
      />
    </div>
    <div v-if="users.length > 0">
      <div class="flex flex-row flex-wrap justify-start">
        <div
          class="w-full md:w-1/3 lg:w-1/4 rounded-lg shadow-lg bg-gray-300 m-2 p-4 hover:bg-gray-500"
          v-for="(user, index) in users"
          :key="user.id"
        >
          <div class="flex justify-end z-50">
            <template v-if="user.is_favorite">
              <svgicon
                name="on-star"
                height="32"
                width="32"
                class="cursor-pointer"
                @click="favorite(user.id, index)"
              />
            </template>
            <template v-else>
              <svgicon
                name="off-star"
                height="32"
                width="32"
                class="cursor-pointer"
                @click="favorite(user.id, index)"
              />
            </template>
          </div>
          <div class="flex flex-wrap text-center pt-4 cursor-pointer" @click="show(user.id)">
            <div class="w-full flex justify-center">
              <div class="relative avatar flex justify-center">
                <div class="w-full h-full">
                  <img
                    class="object-cover h-full"
                    :src="user.avatar.file.url"
                    v-if="user.avatar && user.avatar.file && user.avatar.file.url"
                  />
                  <svgicon v-else name="no-avatar" height="115" width="115" />
                </div>
              </div>
            </div>

            <div class="w-full font-bold text-sm sm:text-lg my-4">{{user.personal_detail.name}}</div>
            <div
              class="w-full mb-4 font-bold text-gray-600 text-sm sm:text-lg"
            >{{user.locum_detail.profession.name}}</div>
          </div>
        </div>
      </div>

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
    <div class="shield" v-if="tabs.includes($route.name)"></div>
    <nuxt-child />
  </section>
</template>
<script>
import AppPagination from "@/components/Base/AppPagination";
import AppSelect from "@/components/Base/AppSelect";
const tabs = [
  "my-banks-favourites-userId",
  "my-banks-favourites-userId-profile",
  "my-banks-favourites-userId-related-jobs",
  "my-banks-favourites-userId-related-jobs-available",
  "my-banks-favourites-userId-related-jobs-applied",
  "my-banks-favourites-userId-related-jobs-current",
  "my-banks-favourites-userId-related-jobs-completed",
  "my-banks-favourites-userId-related-jobs-unsuccessful",
  "my-banks-favourites-userId-related-jobs-cancelled",
  "my-banks-favourites-userId-related-jobs-declined"
];
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },
  components: {
    AppPagination,
    AppSelect
  },
  data() {
    return {
      tabs,
      professions: [],
      users: [],
      current_page: 1,
      total: 0,
      modal: false,
      user: null,
      loading: true,

      params: {
        profession_id: "1"
      },

      profession_id: "1"
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
    profession_id(value) {
      this.params.profession_id = value;
      this.getLocums(this.current_page);
    }
  },
  methods: {
    getProfessions() {
      this.$axios.$get(`/api/v1/professions`).then(res => {
        this.professions = [];
        res.data.professions.forEach(item => {
          this.professions.push({ label: item.name, value: item.id });
        });
      });
    },
    getLocumsCount() {
      this.$axios.$get(`/api/v1/practice/locums/count`).then(res => {
        this.total = res.data.count;
        this.getLocums(this.current_page);
      });
    },
    getLocums(page) {
      this.current_page = page;
      let defaultParams = {
        offset: this.offset,
        limit: this.perPage,
        practice_locum_type: "Favorite"
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
              text: ["Remove to favourites"]
            });
            this.users.splice(index, 1);
          });
      }
    },
    show(id) {
      this.$router.push(`/my-banks/favourites/${id}`);
    },
    pagechanged(e) {
      this.current_page = e;
      this.getLocums(this.current_page);
    }
  }
};
</script>
<style scoped>
.avatar-container {
  box-sizing: content-box;
  height: 170px;
}
.avatar {
  max-width: 170px;
  max-height: 170px;
  min-width: 170px;
  min-height: 170px;
}
.avatar img {
  border-radius: 50%;
}
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


