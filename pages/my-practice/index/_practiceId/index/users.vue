<template>
  <section class="relative">
    <AppTable
      v-if="users.length > 0"
      :total="users.length"
      :items="users"
      :columns="columns"
      :orderBy="params.order_by"
      :routerLink="`/my-practice/${$route.params.practiceId}/users`"
    ></AppTable>
    <transition name="fade" mode="out-in">
      <nuxt-link
        class="shield"
        v-if="$route.name.includes('my-practice-index-practiceId-index-users-userId')"
        :to="`/my-practice/${$route.params.practiceId}/users?status=${$route.query.status}`"
      ></nuxt-link>
    </transition>
    <div>
      <nuxt-child />
    </div>
  </section>
</template>
<script>
import AppTable from "@/components/Base/AppTable";
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },
  components: {
    AppTable
  },
  data() {
    return {
      // app table column
      columns: [
        {
          name: "User",
          dataIndex: "personal_detail.name",
          class: "text-left"
        },
        {
          name: "Practice Role",
          dataIndex: "practice_detail.practice_role",
          class: "text-center"
        },
        {
          name: "Surgery",
          dataIndex: "practice_detail.practice.surgery.name",
          class: "text-center"
        },
        {
          name: "Email",
          dataIndex: "email",
          class: "text-center"
        },
        {
          name: "Created At",
          dataIndex: "created_at",
          class: "text-center localDate"
        }
      ],
      // app table params
      params: {
        order_by: ["created_at:desc"]
      }
    };
  },
  async asyncData({ app, params, error }) {
    try {
      const response = await app.$axios.$get(
        `/api/v1/locum/practices/${params.practiceId}/practice-users`
      );
      const users =
        response.data && response.data.users ? response.data.users : [];

      return {
        users
      };
    } catch (err) {
      throw err;
    }
  },
  methods: {
    // show(item) {
    //   this.$router.push({
    //     path: `/my-practice/${this.$route.params.practiceId}/users/${item.id}`,
    //     query: { ...this.$route.query }
    //   });
    // }
  }
};
</script>