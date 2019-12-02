<template>
  <section class="relative">
    <div class="flex overflow-x-auto whitespace-no-wrap">
      <AppButton
        class="mr-2"
        :label="'Add User'"
        @click="$router.push('/profile/users/create')"
        :inStyle="'padding:5px 14px;margin-bottom:5px; font-size:14px;'"
      />
      <AppButton :label="'Filter'" @click="showFilter()" :inStyle="'padding:5px 14px;margin-bottom:5px; font-size:14px;'" />
    </div>
    <div
      class="flex-wrap justify-start items-center z-10 absolute w-full bg-white shadow-xl p-3 rounded-lg"
      :class="filterToggle ? 'flex' : 'hidden'"
    >
      <AppInput
        class="px-1 w-full md:w-1/3"
        v-model="params.search"
        :type="'text'"
        :name="'search'"
        :label="'Email'"
        :inStyle="'padding-top:0.5rem;padding-bottom:0.7rem'"
      />
      <AppInput
        class="px-1 w-full md:w-1/3"
        v-model="params.practice_role"
        :type="'select'"
        :name="'practice_role'"
        :label="'Practice Role'"
        :items="filterPracticeRoles"
        :disabled="loading"
      />
      <AppInput
        class="px-1 w-full md:w-1/3"
        v-model="params.role_id"
        :type="'select'"
        :name="'role_id'"
        :label="'User Role'"
        :items="filterUserRoles"
        :disabled="loading"
      />
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
      :routerLink="'/profile/users'"
      @pagechanged="pagechanged"
      @limitchanged="limitchanged"
      @sorted="sorted"
    >
      <template v-slot:actions="slotProps">
        <div v-if="slotProps.item.practice_detail.role.name !== 'Practice User Admin'">
          <div
            class="text-black font-semibold text-xs sm:text-sm text-center"
            @click.stop.prevent="toggleRemoveConfirmationModal(slotProps.item.id)"
          >
            X
          </div>
        </div>
      </template>
    </AppTable>
    <div v-else class="flex justify-center py-4 text-gray-600">You do not have any other User on this Practice</div>
    <transition name="fade" mode="out-in">
      <nuxt-link
        class="shield"
        v-if="['profile-users-create', 'profile-users-edit'].includes($route.name) || $route.name.includes('profile-users-id')"
        :to="'/profile/users'"
      ></nuxt-link>
    </transition>
    <nuxt-child @addedUser="addUser" @updateUser="updateUser" />
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
      selectedSurgeryId: null,
      modal: false,
      filterToggle: false,
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
          name: "Name",
          dataIndex: "personal_detail.first_name",
          class: "text-left",
          sortable: true
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
          dataIndex: "practice_detail.role.name",
          class: "text-center"
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
      this.getUsersCount(this.params);
    },
    "params.role_id"(value) {
      this.current_page = 1;
      this.params.offset = 0;
      this.params.role_id = value;
      this.getUsersCount(this.params);
      this.showFilter();
    },
    "params.practice_role"(value) {
      this.current_page = 1;
      this.params.offset = 0;
      this.params.practice_role = value;
      this.getUsersCount(this.params);
      this.showFilter();
    }
  },
  mounted() {
    this.$socket.on("Practice Notification Create User", user => {
      this.getUsersCount(this.params);
    });
    this.$socket.on("Practice Notification Delete User", userId => {
      this.getUsersCount(this.params);
    });
    this.$socket.on("Practice Notification Update User", user => {
      let index = this.users.findIndex(item => item.id == user.id);
      if (index >= 0) {
        this.users.splice(index, 1, user);
      }
    });
    // get roles for filter
    this.$axios.$get(`/api/v1/practice/practice-roles`).then(res => {
      this.filterUserRoles.push({ label: "All", value: null });
      res.data.roles.forEach(role => {
        this.filterUserRoles.push({ label: role.name, value: role.id });
      });
    });
  },
  async asyncData({ app, store, error }) {
    try {
      const responseCount = await app.$axios.$get(`/api/v1/practice/practice-users/count`);
      const totalUsers = responseCount.data && responseCount.data.count ? responseCount.data.count : 0;

      const responseUsers = await app.$axios.$get(`/api/v1/practice/practice-users?limit=5&order_by=created_at:desc`);

      let users = [];

      if (responseUsers.data && responseUsers.data.users) {
        responseUsers.data.users.forEach(user => {
          if (user.practice_detail.role && user.practice_detail.role.name == "Practice User Admin") {
            users.push(user);
          } else {
            users.push({ ...user, removable: true });
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
  },
  methods: {
    showFilter() {
      return (this.filterToggle = !this.filterToggle);
    },
    getUsersCount(params) {
      this.$axios.$get(`/api/v1/practice/practice-users/count`, { params }).then(res => {
        this.totalUsers = res.data.count;
        this.getUsers(this.params);
      });
    },
    getUsers(params) {
      this.loading = true;
      this.$axios
        .$get(`/api/v1/practice/practice-users`, { params })
        .then(res => {
          this.loading = false;
          this.users = [];
          res.data.users.forEach(user => {
            if (user.practice_detail.role_id == 1) {
              this.users.push(user);
            } else {
              this.users.push({ ...user, removable: true });
            }
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
      this.getUsers(this.params);
    },
    pagechanged(page) {
      this.current_page = page;
      this.params.offset = this.params.limit * (page - 1);
      this.getUsers(this.params);
    },
    limitchanged(limit) {
      this.current_page = 1;
      this.params.offset = 0;
      this.params.limit = limit;
      this.getUsers(this.params);
    },
    addUser(user) {
      // this.users.push(user);
    },
    updateUser(user) {
      // let index = this.users.findIndex(item => item.id == user.id);
      // if (index >= 0) {
      //   this.users.splice(index, 1, user);
      // }
    },
    toggleRemoveConfirmationModal(id) {
      this.selectedSurgeryId = id;
      this.modal = true;
    },
    remove() {
      this.loading = true;
      this.$axios
        .$delete(`/api/v1/practice/practice-users/${this.selectedSurgeryId}`, this.form)
        .then(res => {
          this.loading = false;
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`${res.message}`]
          });
          let index = this.users.findIndex(item => item.id == this.selectedSurgeryId);
          if (index >= 0) {
            this.users.splice(index, 1);
          }
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
    }
  }
};
</script>
<style scoped>
.shield {
  z-index: 509;
}
</style>
