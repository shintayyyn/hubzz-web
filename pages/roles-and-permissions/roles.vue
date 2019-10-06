<template>
  <section class="relative">
    <div class="flex overflow-x-auto whitespace-no-wrap">
      <button
        v-if="authPermissions.includes('Create Role')"
        class="rounded-lg bg-yellow-500 p-2 cursor-pointer font-semibold text-xs sm:text-sm focus:outline-none"
        @click="$router.push('/roles-and-permissions/roles/create')"
      >Create Role</button>
    </div>
    <div class="flex justify-start items-center">
      <AppInput
        class="px-1"
        v-model="params.search"
        :type="'text'"
        :name="'search'"
        :label="'Role'"
        :inStyle="'padding-top:0.5rem;padding-bottom:0.5rem'"
      />
    </div>
    <AppTable
      v-if="roles.length > 0"
      :total="totalRoles"
      :items="roles"
      :loading="loading"
      :currentPage="current_page"
      :perPage="params.limit"
      :columns="columns"
      :orderBy="params.order_by"
      @show="show"
      @remove="remove"
      @pagechanged="pagechanged"
      @limitchanged="limitchanged"
      @sorted="sorted"
    />
    <div v-else class="flex justify-center">You do not have any other Roles on this Practice</div>
    <transition name="fade" mode="out-in">
      <div
        class="shield"
        v-if="['roles-and-permissions-roles-id', 'roles-and-permissions-roles-create'].includes($route.name)"
      ></div>
    </transition>
    <nuxt-child @addRole="roles.push($event)" @updateRole="updateRole" />
  </section>
</template>
<script>
import AppTable from "@/components/Base/AppTable";
import AppInput from "@/components/Base/AppInput";
export default {
  components: {
    AppTable,
    AppInput
  },
  transition: {
    name: "fade",
    mode: "out-in"
  },
  data() {
    return {
      totalRoles: 0,
      roles: [],
      loading: false,
      current_page: 1,
      // app table filter

      // app table params
      params: {
        offset: 0,
        limit: 5,
        order_by: ["created_at:desc"],
        search: ""
      },
      // app table column
      columns: [
        {
          name: "Role",
          dataIndex: "name",
          class: "text-left",
          sortable: true
        },
        {
          name: "Created At",
          dataIndex: "created_at",
          class: "text-center localDate",
          sortable: true
        }
      ]
    };
  },
  computed: {
    authPermissions() {
      return this.$store.getters["auth/permissions"];
    }
  },
  watch: {
    "params.search"(value) {
      this.current_page = 1;
      this.params.offset = 0;
      this.params.search = value;
      this.getRolesCount(this.params);
    }
  },
  mounted() {
    this.$socket.on("Practice Notification Create Role", role => {
      // if (!this.roles.map(item => item.id).includes(role.id)) {
      //   this.roles.push(role);
      // }
      this.getRolesCount(this.params);
    });
    this.$socket.on("Practice Notification Delete Role", roleId => {
      // this.roles = this.roles.filter(item => item.id !== roleId);
      this.getRolesCount(this.params);
    });
    this.$socket.on("Practice Notification Update Role", role => {
      let index = this.roles.findIndex(item => item.id == role.id);
      if (index >= 0) {
        this.roles.splice(index, 1, role);
      }
    });
  },
  async asyncData({ app, store, error }) {
    try {
      const responseCount = await app.$axios.$get(
        `/api/v1/practice/practice-roles/count`
      );

      const response = await app.$axios.$get(
        `/api/v1/practice/practice-roles?limit=5&order_by=created_at:desc`
      );

      const totalRoles =
        responseCount.data && responseCount.data.count
          ? responseCount.data.count
          : 0;

      const roles =
        response.data && response.data.roles && response.data.roles.length
          ? response.data.roles
          : [];

      return {
        totalRoles,
        roles
      };
    } catch (err) {
      if (err.response && err.response.status === 401) {
        error(err.response.data);
        return;
      }
      throw err;
    }
  },
  methods: {
    getRolesCount(params) {
      this.$axios
        .$get(`/api/v1/practice/practice-roles/count`, { params })
        .then(res => {
          this.totalRoles = res.data.count;
          this.getRoles(this.params);
        });
    },
    getRoles(params) {
      this.loading = true;
      this.$axios
        .$get(`/api/v1/practice/practice-roles`, { params })
        .then(res => {
          this.loading = false;
          this.roles = [];
          res.data.roles.forEach(role => {
            this.roles.push({ ...role, removable: true });
          });
        })
        .catch(err => {
          console.log(err);
          this.loading = false;
        });
    },
    sorted(order_by) {
      this.current_page = 1;
      this.params.offset = 0;
      this.params.order_by = order_by;
      this.getRoles(this.params);
    },
    pagechanged(page) {
      this.current_page = page;
      this.params.offset = this.params.limit * (page - 1);
      this.getRoles(this.params);
    },
    limitchanged(limit) {
      this.current_page = 1;
      this.params.offset = 0;
      this.params.limit = limit;
      this.getRoles(this.params);
    },
    //
    updateRole(payload) {
      let index = this.roles.findIndex(role => role.id === payload.id);
      if (index >= 0) {
        this.roles.splice(index, 1, payload);
      }
    },
    remove() {
      this.$axios
        .$delete(`/api/v1/practice/practice-roles/${this.selectedRoleId}`)
        .then(res => {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: ["Success"]
          });
          this.closeModal();
        });
    },
    show(item) {
      if (this.authPermissions.includes("Show Role")) {
        this.$router.push(`/roles-and-permissions/roles/${item.id}`);
      }
    }
  }
};
</script>