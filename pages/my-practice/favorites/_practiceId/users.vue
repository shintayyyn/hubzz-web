<template>
  <section>
    <div class="overflow-x-auto overflow-y-hidden">
      <MyPracticeUsers :practice_users="practice_users" @show="show" />
    </div>
    <div class="absolute bottom-0 w-full" v-if="practice_users.length > 0 && totalPages > 1">
      <AppPagination
        :total="totalCount"
        :totalPages="totalPages"
        :currentPage="current_page"
        @pagechanged="pagechanged"
      />
    </div>
    <div
      class="shield"
      v-if="$route.name.includes('my-practice-favorites-practiceId-users-userId')"
    ></div>
    <nuxt-child />
  </section>
</template>
<script>
const practice_roles = [
  {
    label: "Pratice Staff",
    value: "Pratice Staff"
  },
  {
    label: "Practice Manager",
    value: "Practice Manager"
  },
  {
    label: "Partner",
    value: "Partner"
  }
];
import AppPagination from "@/components/Base/AppPagination";
import MyPracticeUsers from "@/components/MyPractice/MyPracticeUsers";
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },
  components: {
    AppPagination,
    MyPracticeUsers
  },
  data() {
    return {
      practice_roles,
      params: {
        search: "",
        practice_role: "",
        status: ""
      },
      practice_users: [],
      current_page: 1,
      limit: 0,
      totalCount: 0,
      totalPages: 0
    };
  },
  computed: {
    offset() {
      return this.limit * (this.current_page - 1);
    }
  },
  async asyncData({ app, params, error }) {
    try {
      const responseCount = await app.$axios.$get(
        `/api/v1/locum/practices/${params.practiceId}/practice-users/count`
      );
      const responseUsers = await app.$axios.$get(
        `/api/v1/locum/practices/${params.practiceId}/practice-users`
      );

      let totalCount =
        responseCount.data && responseCount.data.count
          ? responseCount.data.count
          : 0;
      let practice_users =
        responseUsers.data && responseUsers.data.users
          ? responseUsers.data.users
          : [];

      const limit = 10;
      const totalPages = Math.ceil(totalCount / limit);

      return {
        limit,
        totalCount,
        totalPages,
        practice_users
      };
    } catch (err) {
      throw err;
    }
  },
  methods: {
    show(id) {
      this.$router.push(
        `/my-practice/favorites/${this.$route.params.practiceId}/users/${id}`
      );
    },
    pagechanged(e) {
      this.current_page = e;
      this.getUsers(this.current_page, this.params);
    },
    async getUsers(page, params) {
      try {
        params = { ...params, offset: this.offset, limit: this.limit };

        const responseUsers = await this.$axios.$get(
          `/api/v1/locum/practices/${this.$route.params.practiceId}/practice-users/count`,
          { params }
        );

        this.practice_users =
          responseUsers.data && responseUsers.data.users
            ? responseUsers.data.users
            : [];
      } catch (err) {
        throw err;
      }
    }
  }
};
</script>