<template>
  <section class="relative __jobs_section" style="min-height: 768px;">
    <button
      class="rounded-lg bg-yellow-500 p-2 cursor-pointer font-semibold text-xs sm:text-sm focus:outline-none"
      @click="$router.push('/roles-and-permissions/roles/create')"
    >Create Role</button>
    <div
      class="mt-10 w-full text-center"
      v-if="!loading && roles.length === 0 "
    >You do not have any created roles</div>
    <div v-if="roles.length > 0" class="overflow-x-auto overflow-y-hidden">
      <table>
        <thead>
          <tr class="text-xs sm:text-sm text-left">
            <th>
              Role
              <svgicon class="inline align-baseline" name="sort" height="12" width="12" />
            </th>
            <th style="text-align:right">
              Created At
              <svgicon class="inline align-baseline" name="sort" height="12" width="12" />
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(role, index) in roles">
            <tr
              @click="role.id !== 1 ? $router.push(`/roles-and-permissions/roles/${role.id}`) : null"
              :key="role.id"
              class="__job-card shadow-md cursor-pointer text-xs text-left"
            >
              <td>{{role.name}}</td>
              <td style="text-align:right">{{role.created_at | localDate('dateOnly') }}</td>
            </tr>
            <tr :key="`${role.id}-${index}`">
              <td></td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <div class="absolute bottom-0 w-full" v-if="roles.length > 0 && totalPages > 1">
      <AppPagination
        :total="total"
        :totalPages="totalPages"
        :currentPage="current_page"
        @pagechanged="pagechanged"
        :loading="loading"
      />
    </div>
    <div
      class="shield"
      v-if="['roles-and-permissions-roles-id', 'roles-and-permissions-roles-create'].includes($route.name)"
    ></div>
    <nuxt-child @addRole="roles.push($event)" @updateRole="updateRole" @removeRole="removeRole" />
  </section>
</template>
<script>
import AppPagination from "@/components/Base/AppPagination";
export default {
  components: {
    AppPagination
  },
  transition: {
    name: "fade",
    mode: "out-in"
  },
  data() {
    return {
      current_page: 1,
      total: 0,
      loading: false,
      roles: []
    };
  },
  computed: {
    offset() {
      return this.perPage * (this.current_page - 1);
    },
    perPage() {
      return 10;
    },
    totalPages() {
      return Math.ceil(this.total / this.perPage);
    }
  },
  async asyncData({ app, store, error }) {
    try {
      if (process.client) {
        document.body.style.cursor = "wait";
      }

      const responseCount = await app.$axios.$get(
        `/api/v1/practice/practice-roles/count`
      );

      const response = await app.$axios.$get(
        `/api/v1/practice/practice-roles?limit=${10}`
      );

      const total =
        responseCount.data && responseCount.data.count
          ? responseCount.data.count
          : 0;

      const roles =
        response.data && response.data.roles && response.data.roles.length
          ? response.data.roles
          : [];

      if (process.client) {
        document.body.style.cursor = "auto";
      }

      return {
        roles,
        total
      };
    } catch (err) {
      throw err;
    }
  },
  methods: {
    pagechanged(e) {
      this.current_page = e;
      this.getRoles();
    },
    getRoles() {
      let params = {
        offset: this.offset,
        limit: this.perPage
      };
      this.$axios
        .$get(`/api/v1/practice/practice-roles`, { params })
        .then(res => {
          this.roles = res.data.roles;
        });
    },
    removeRole(payload) {
      this.roles = this.roles.filter(role => role.id !== parseInt(payload));
    },
    updateRole(payload) {
      let index = this.roles.findIndex(role => role.id === payload.id);
      if (index >= 0) {
        this.roles.splice(index, 1, payload);
      }
    }
  }
};
</script>