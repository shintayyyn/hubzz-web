<template>
  <section class="relative __jobs_section" style="min-height: 768px;">
    <button
      v-if="authPermissions.includes('Create Role')"
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
            <th class="text-xs sm:text-sm text-left px-1">
              Role
              <svgicon class="inline align-baseline" name="sort" height="12" width="12" />
            </th>
            <th class="text-xs sm:text-sm text-left px-1">
              Created At
              <svgicon class="inline align-baseline" name="sort" height="12" width="12" />
            </th>
            <th class="w-10"></th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(role, index) in roles">
            <tr
              @click="authPermissions.includes('Show Role') ? $router.push(`/roles-and-permissions/roles/${role.id}`) : null"
              :key="role.id"
              class="__job-card shadow-md text-xs text-left"
              :class="authPermissions.includes('Show Role') ? 'cursor-pointer': ''"
            >
              <td>{{role.name}}</td>
              <td>{{role.created_at | localDate('dateOnly') }}</td>
              <td class="w-10 text-xs sm:text-sm px-1 rounded-r-lg text-center">
                <div
                  @click.stop.prevent="removeModal(role.id)"
                  class="rounded-lg bg-red-500 p-2 text-white cursor-pointer font-semibold text-xs sm:text-sm"
                >Remove</div>
              </td>
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
    <nuxt-child @addRole="roles.push($event)" @updateRole="updateRole" />
    <AppConfirmationModal
      :label="'Proceed to delete this Role?'"
      :confirmLabel="'Yes'"
      :cancelLabel="'Cancel'"
      :modal="remove_modal"
      @confirm="remove"
      @cancel="closeModal"
    />
  </section>
</template>
<script>
import AppPagination from "@/components/Base/AppPagination";
import AppConfirmationModal from "@/components/Base/AppConfirmationModal";
export default {
  components: {
    AppPagination,
    AppConfirmationModal
  },
  transition: {
    name: "fade",
    mode: "out-in"
  },
  data() {
    return {
      remove_modal: false,
      selectedRoleId: null,
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
    },
    authPermissions() {
      return this.$store.getters["auth/permissions"];
    }
  },
  mounted() {
    this.$socket.on("practiceNotificationCreateRole", role => {
      if (!this.roles.map(item => item.id).includes(role.id)) {
        this.roles.push(role);
      }
    });
    this.$socket.on("practiceNotificationDeleteRole", role => {
      this.roles = this.roles.filter(item => item.id !== role.id);
    });
    this.$socket.on("practiceNotificationUpdateRole", role => {
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

      return {
        roles,
        total
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
    updateRole(payload) {
      let index = this.roles.findIndex(role => role.id === payload.id);
      if (index >= 0) {
        this.roles.splice(index, 1, payload);
      }
    },
    removeModal(id) {
      this.remove_modal = true;
      this.selectedRoleId = id;
    },
    closeModal() {
      this.selectedRoleId = null;
      this.remove_modal = false;
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
    }
  }
};
</script>