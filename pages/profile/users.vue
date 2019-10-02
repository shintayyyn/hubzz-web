<template>
  <section class="relative list-section">
    <button
      class="rounded-lg bg-yellow-500 p-2 cursor-pointer font-semibold text-xs sm:text-sm focus:outline-none"
      @click="$router.push('/profile/users/create')"
      v-if="authPermissions.includes('Create Profile Users')"
    >Add User</button>
    <AppLoading :loading="loading" :message="'Loading'" />
    <div
      class="mt-10 w-full text-center"
      v-if="!loading && users.length === 0"
    >You do not have any other User on this Practice</div>
    <div v-if="users.length > 0" class="overflow-x-auto overflow-y-hidden">
      <table>
        <thead>
          <tr>
            <th class="text-xs sm:text-sm text-left px-1">Name</th>
            <th class="text-xs sm:text-sm text-left px-1">Email</th>
            <th class="text-xs sm:text-sm text-left px-1">Role</th>
            <th class="text-xs sm:text-sm text-left px-1">Created at</th>
            <th class="w-10"></th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(item, index) in users">
            <tr
              @click="show(item)"
              class="__job-card rounded-lg shadow-md cursor-pointer text-xs text-left"
              :key="item.id"
            >
              <td>{{item.personal_detail.first_name}} {{item.personal_detail.last_name}}</td>
              <td>{{item.email}}</td>
              <td>{{item.practice_detail.role ? item.practice_detail.role.name : `(none)`}}</td>
              <td>{{item.created_at | localDate}}</td>
              <td class="w-10 text-xs sm:text-sm px-1 rounded-r-lg text-center">
                <div
                  v-if="$auth.user.id != item.id && item.practice_detail.role.id != 1 && authPermissions.includes('Delete Profile Users')"
                  @click.stop.prevent="removeModal(item)"
                  class="rounded-lg bg-red-500 p-2 text-white cursor-pointer font-semibold text-xs sm:text-sm"
                >Remove</div>
              </td>
            </tr>
            <tr :key="`${item.id}-${index}`">
              <td></td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <div class="absolute bottom-0 w-full" v-if="users.length > 0 && totalPages > 1">
      <AppPagination
        :total="total"
        :totalPages="totalPages"
        :currentPage="current_page"
        @pagechanged="pagechanged"
      />
    </div>
    <transition name="fade" mode="out-in">
      <div
        class="shield"
        v-if="['profile-users-create', 'profile-users-edit'].includes($route.name) || $route.name.includes('profile-users-id')"
        @click="$router.push('/profile/users')"
      ></div>
    </transition>
    <nuxt-child @addedUser="addUser" />
    <AppConfirmationModal
      :label="'Are you sure you want to delete this User?'"
      :confirmLabel="'Yes'"
      :cancelLabel="'Cancel'"
      :modal="modal"
      @confirm="remove"
      @cancel="modal = false"
    />
  </section>
</template>
<script>
import AppButton from "@/components/Base/AppButton";
import AddSurgeryModal from "@/components/Profile/AddSurgeryModal";
import AppConfirmationModal from "@/components/Base/AppConfirmationModal";
import AppLoading from "@/components/Base/AppLoading";
import AppPagination from "@/components/Base/AppPagination";
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },
  components: {
    AppButton,
    AddSurgeryModal,
    AppLoading,
    AppPagination,
    AppConfirmationModal
  },

  data() {
    return {
      users: [],
      total: 0,
      current_page: 1,
      loading: false,
      //
      selectedUserId: null,
      modal: false,
      loading: false
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
    },
    authPermissions() {
      return this.$store.getters["auth/permissions"];
    }
  },
  async asyncData({ app, store, error }) {
    try {
      if (
        !app.$auth.user.practice_detail.role.permissions
          .map(item => item.name)
          .includes("View Profile Users")
      ) {
        error({
          statusCode: 401,
          message: "You're Not Authorized To View This Page"
        });
      }
      const responseCount = await app.$axios.$get(
        `/api/v1/practice/practice-users/count`
      );
      const total =
        responseCount.data && responseCount.data.count
          ? responseCount.data.count
          : 0;

      const responseUsers = await app.$axios.$get(
        `/api/v1/practice/practice-users?limit=5`
      );
      let users =
        responseUsers.data && responseUsers.data.users
          ? responseUsers.data.users
          : [];

      return {
        users,
        total
      };
    } catch (err) {
      throw err;
    }
  },
  methods: {
    getUsers() {
      let params = {
        offset: this.offset,
        limit: this.perPage
      };
      this.loading = true;
      this.$axios
        .$get(`/api/v1/practice/practice-users`, { params })
        .then(res => {
          this.users = res.data.users;
          this.loading = false;
        });
    },
    addUser(user) {
      this.users.push(user);
    },
    removeModal(item) {
      if (
        this.$auth.user.id != item.id &&
        item.practice_detail.role.id != 1 &&
        this.authPermissions.includes("Delete Profile Users")
      ) {
        this.selectedUserId = item.id;
        this.modal = true;
      }
    },
    remove() {
      alert("User Remove");
    },
    show(item) {
      if (
        this.$auth.user.id != item.id &&
        item.practice_detail.role.id != 1 &&
        this.authPermissions.includes("Show Profile Users")
      ) {
        this.$router.push(`/profile/users/${item.id}`);
      }
    },
    pagechanged(e) {
      this.current_page = e;
      this.getUsers();
    }
  }
};
</script>
<style scoped>
.shield {
  z-index: 509;
}
.list-section {
  position: relative;
  min-height: 800px;
}
</style>

