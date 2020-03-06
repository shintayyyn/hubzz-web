<template>
  <section class="relative">
    <div class="flex overflow-x-auto whitespace-no-wrap">
      <AppButton
        :label="'Add User'"
        :inStyle="'padding:5px 14px;margin-bottom:5px; font-size:14px;'"
        @click="$router.push('/profile/users/create')"
      />
      <AppButton
        class="mx-2"
        :label="'Filter'"
        :inStyle="'padding:5px 14px;margin-bottom:5px; font-size:14px;'"
        @click="filterModal = !filterModal"
      />
      <AppButton
        v-if="showRefresh"
        :label="'Refresh'"
        :inStyle="'padding:5px 14px;margin-bottom:5px;font-size:14px;'"
        @click="refreshUsers"
      />
    </div>
    <div
      class="flex-wrap justify-start items-center z-10 absolute w-full bg-white shadow-xl p-3 rounded-lg"
      :class="filterModal ? 'flex' : 'hidden'"
    >
      <div class="flex flex-col md:flex-row h-full w-full items-end">
        <div class="md:px-1 h-full w-full lg:w-1/4 md:w-1/3">
          <AppInput
            v-model="params.search"
            class="px-1"
            :type="'text'"
            :name="'search'"
            :label="'Email'"
            :inStyle="'padding-top:0.5rem;padding-bottom:0.7rem'"
          />
        </div>
        <div class="md:px-1 h-full w-full lg:w-1/4 md:w-1/3">
          <AppInput
            v-model="params.practice_role"
            class="px-1"
            :type="'select'"
            :name="'practice_role'"
            :label="'Practice Role'"
            :items="filterPracticeRoles"
            :disabled="loading"
          />
        </div>
        <div class="md:px-1 h-full w-full lg:w-1/4 md:w-1/3">
          <AppInput
            v-model="params.role_id"
            class="px-1"
            :type="'select'"
            :name="'role_id'"
            :label="'User Role'"
            :items="filterUserRoles"
            :disabled="loading"
          />
        </div>
      </div>

      <div class="md:px-1 h-full flex w-full">
        <AppButton
          :label="'Clear'"
          :inStyle="'padding:5px 14px;margin-bottom:5px'"
          @click="clearFilters"
        />
        <AppButton
          class="mx-2"
          :label="'Search'"
          :inStyle="'padding:5px 14px;margin-bottom:5px'"
          @click="filterUsers"
        />
        <AppButton
          class="mx-2 md:hidden"
          :label="'Close'"
          :inStyle="'padding:5px 14px;margin-bottom:5px'"
          @click="filterModal = false"
        />
      </div>
    </div>
    <AppTable
      v-if="users.length > 0"
      :total="totalUsers"
      :items="users"
      :loading="loading"
      :currentPage="current_page"
      :perPage="params.limit"
      :columns="columns"
      :orderBy="params.order_by"
      @pagechanged="pagechanged"
      @limitchanged="limitchanged"
      @sorted="sorted"
    >
      <!-- :routerLink="'/profile/users'" -->

      <!-- <template v-slot:actions="slotProps">
				<div class="flex justify-center">
					<AppButton
						v-if="$auth.user.id !== slotProps.item.id"
						:label="'Delete'"
						:customTheme="'bg-red-600 hover:bg-red-700 text-white'"
						@click="toggleRemoveConfirmationModal(slotProps.item.id)"
					/>
				</div>
      </template>-->
      <template v-slot:status_slot="slotProps">
        <div class="flex items-center justify-center">
          <div
            class="rounded-full px-6 py-1"
            :class="statusStyle(slotProps.item.status)"
          >{{ slotProps.item.status }}</div>
        </div>
      </template>
      <template v-slot:actions="slotProps">
        <div class="flex items-center justify-center">
          <AppButton
            :disabled="$auth.user.id == slotProps.item.id ? true : false"
            class="mx-2"
            :label="'View'"
            @click="$router.push({ path: `/profile/users/${slotProps.item.id}`})"
          />
        </div>
      </template>
    </AppTable>
    <div v-else class="flex justify-center py-4 text-gray-600">No User Found</div>
    <transition name="fade" mode="out-in">
      <nuxt-link
        v-if="['profile-users-create', 'profile-users-edit'].includes($route.name) || $route.name.includes('profile-users-id')"
        class="shield"
        :to="'/profile/users'"
      />
    </transition>
    <nuxt-child @addUser="addUser" @updateUser="updateUser" />
    <AppConfirmationModal
      :label="'Proceed to delete this user?'"
      :confirmLabel="'Yes'"
      :cancelLabel="'Cancel'"
      :modal="modal"
      @confirm="remove"
      @cancel="modal = false"
    />
  </section>
</template>
<script>
import AppTable from "@/components/Base/AppTable";
import AppInput from "@/components/Base/AppInput";
import AppConfirmationModal from "@/components/Base/AppConfirmationModal";
import AppButton from "@/components/Base/AppButton";
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },
  components: {
    AppConfirmationModal,
    AppTable,
    AppInput,
    AppButton
  },

  data() {
    return {
      selectedUserId: null,
      modal: false,
      showRefresh: false,
      filterModal: false,
      //
      totalUsers: 0,
      users: [],
      loading: false,
      current_page: 1,
      // app table filter
      filterUserRoles: [],
      filterPracticeRoles: [
        {
          label: "All",
          value: null
        },
        {
          label: "Practice Staff",
          value: "Practice Staff"
        },
        {
          label: "Practice Manager",
          value: "Practice Manager"
        },
        {
          label: "Partner",
          value: "Partner"
        }
      ],
      // app table params
      params: {
        offset: 0,
        limit: 5,
        order_by: ["created_at:desc"],
        search: "",
        role_id: null,
        practice_role: null
      },
      // app table column
      columns: [
        {
          name: "Title",
          dataIndex: "personal_detail.title",
          class: "text-left"
        },
        {
          name: "Name",
          dataIndex: "fullname",
          class: "text-left"
        },
        {
          name: "Suffix",
          dataIndex: "personal_detail.suffix",
          class: "text-left"
        },
        {
          name: "Email",
          dataIndex: "email",
          class: "text-center",
          sortable: true
        },
        {
          name: "Practice Role",
          dataIndex: "practice_detail.practice_role",
          class: "text-center"
        },
        {
          name: "User Role",
          dataIndex: "user_role",
          class: "text-center"
        },
        {
          name: "Created At",
          dataIndex: "created_at",
          class: "text-center localDate",
          sortable: true
        },
        {
          name: "Status",
          slot: true,
          slotName: "status_slot",
          dataIndex: "",
          class: "text-center"
        },
        {
          name: "Actions",
          dataIndex: "actions",
          class: "text-center"
        }
      ]
    };
  },
  computed: {
    authPermissions() {
      return this.$store.getters["permissions"];
    }
  },

  watch: {
    $route(to, from) {
      if (from.name === "profile-users-id") {
        this.getUsers(this.params);
      }
    }
  },
  async asyncData({ app, redirect, store, error }) {
    if (app.$auth.user.domain === "Practice") {
      let permissions = app.$auth.user.practice_detail.role.permissions.map(
        permission => permission.name
      );

      if (permissions.includes("View Profile Users")) {
        try {
          const responseCount = await app.$axios.$get(
            `/api/v1/practice/practice-users/count`
          );
          const totalUsers =
            responseCount.data && responseCount.data.count
              ? responseCount.data.count
              : 0;

          const responseUsers = await app.$axios.$get(
            `/api/v1/practice/practice-users?limit=5&order_by=created_at:desc`
          );

          let users = [];

          if (responseUsers.data && responseUsers.data.users) {
            responseUsers.data.users.forEach(user => {
              if (
                user.practice_detail.role &&
                user.practice_detail.role.name == "Practice User Admin"
              ) {
                users.push({
                  ...user,
                  fullname: `${user.personal_detail.first_name} ${
                    user.personal_detail.last_name
                  }`,
                  user_role: user.practice_detail.role
                    ? user.practice_detail.role.name
                    : null
                });
              } else {
                users.push({
                  ...user,
                  fullname: `${user.personal_detail.first_name} ${
                    user.personal_detail.last_name
                  }`,
                  user_role: user.practice_detail.role
                    ? user.practice_detail.role.name
                    : null,
                  removable: true
                });
              }
            });
          }
          return {
            totalUsers,
            users
          };
        } catch (err) {
          if (err.response && err.response.status === 401) {
            error(err.response.data);
            return;
          }
          throw err;
        }
      } else if (permissions.includes("View Profile Practice")) {
        redirect("/profile");
      } else if (permissions.includes("View Profile Practice Document")) {
        redirect(`/profile/practice-documents`);
      } else {
        error({ statusCode: 401, message: "Your Practice is Not Authorized" });
      }
    }
  },
  mounted() {
    this.$socket.on("Practice Notification Create User", this.getUsersRealTime);
    this.$socket.on("Practice Notification Delete User", this.getUsersRealTime);
    this.$socket.on("Practice Notification Update User", this.getUsersRealTime);
    // get roles for filter
    this.$axios.$get(`/api/v1/practice/practice-roles`).then(res => {
      this.filterUserRoles.push({ label: "All", value: null });
      res.data.roles.forEach(role => {
        this.filterUserRoles.push({ label: role.name, value: role.id });
      });
    });
  },
  methods: {
    async getUsersRealTime(user) {
      if (!user) {
        return;
      }
      this.showRefresh = true;
    },
    async refreshUsers() {
      this.current_page = 1;
      this.params.offset = 0;
      this.params.limit = 10;
      this.loading = true;
      await this.getUsersCount(this.params);
      await this.getUsers(this.params);
      this.loading = false;
      this.showRefresh = false;
    },
    async filterUsers() {
      this.current_page = 1;
      this.params.offset = 0;
      this.loading = true;
      await this.getUsersCount(this.params);
      await this.getUsers(this.params);
      this.loading = false;
      this.filterModal = false;
    },
    getUsersCount(params) {
      return this.$axios
        .$get(`/api/v1/practice/practice-users/count`, { params })
        .then(res => {
          return (this.totalUsers = res.data.count);
        })
        .catch(err => {
          console.log("err", err.response || err.message);
          if (err.response.data.message) {
            return this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "danger",
              text: [err.response.data.message]
            });
          }
        });
    },
    getUsers(params) {
      return this.$axios
        .$get(`/api/v1/practice/practice-users`, { params })
        .then(res => {
          this.users = [];
          return res.data.users.forEach(user => {
            if (user.practice_detail.role_id == 1) {
              this.users.push({
                ...user,
                fullname: `${user.personal_detail.first_name} ${
                  user.personal_detail.last_name
                }`
              });
            } else {
              this.users.push({
                ...user,
                fullname: `${user.personal_detail.first_name} ${
                  user.personal_detail.last_name
                }`,
                removable: true
              });
            }
          });
        })
        .catch(err => {
          console.log("err", err.response || err.message);
          if (err.response.data.message) {
            return this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "danger",
              text: [err.response.data.message]
            });
          }
        });
    },
    async sorted(order_by) {
      this.current_page = 1;
      this.params.offset = 0;
      this.params.order_by = order_by;
      this.loading = true;
      await this.getUsers(this.params);
      this.loading = false;
    },
    async pagechanged(page) {
      this.current_page = page;
      this.params.offset = this.params.limit * (page - 1);
      this.loading = true;
      await this.getUsers(this.params);
      this.loading = false;
    },
    async limitchanged(limit) {
      this.current_page = 1;
      this.params.offset = 0;
      this.params.limit = limit;
      this.loading = true;
      await this.getUsers(this.params);
      this.loading = false;
    },
    clearFilters() {
      this.params.offset = 0;
      this.params.limit = 5;
      this.params.order_by = ["created_at:desc"];
      this.params.search = "";
      this.params.role_id = null;
      this.params.practice_role = null;
    },
    addUser(user) {
      this.users.push({
        ...user,
        fullname: `${user.personal_detail.first_name} ${
          user.personal_detail.last_name
        }`,
        user_role: user.practice_detail.role
          ? user.practice_detail.role.name
          : null
      });
    },
    updateUser(user) {
      let index = this.users.findIndex(item => item.id === user.id);
      if (index >= 0) {
        this.users.splice(index, 1, {
          ...user,
          fullname: `${user.personal_detail.first_name} ${
            user.personal_detail.last_name
          }`,
          user_role: user.practice_detail.role
            ? user.practice_detail.role.name
            : null
        });
      }
    },
    toggleRemoveConfirmationModal(id) {
      this.selectedUserId = id;
      this.modal = true;
    },
    remove() {
      this.loading = true;
      this.$axios
        .$delete(
          `/api/v1/practice/practice-users/${this.selectedUserId}`,
          this.form
        )
        .then(res => {
          this.loading = false;
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`${res.message}`]
          });
          let index = this.users.findIndex(
            item => item.id == this.selectedUserId
          );
          if (index >= 0) {
            this.users.splice(index, 1);
          }
          this.modal = false;
        })
        .catch(err => {
          this.loading = false;
          this.modal = false;
          this.formError = err.response.data.error_messages;
        });
    },
    show(item) {
      // if (
      //   (!item.practice_detail.role || item.practice_detail.role.id != 1) &&
      //   this.authPermissions.includes("Show Profile Users")
      // ) {
      //   this.$router.push(`/profile/users/${item.id}`);
      // }
    },
    statusStyle(status) {
      switch (status) {
        case "Active":
          return "bg-green-500 text-white";
          break;
        case "Disabled":
          return "bg-gray-300 text-gray-600";
          break;
        default:
          return;
      }
    }
  }
};
</script>
<style scoped>
.shield {
  z-index: 509;
}
</style>
