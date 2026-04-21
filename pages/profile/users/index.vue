<template>
  <section class="relative">
    <AppFilter :enableSearch="false" class="w-full pt-2">
      <template
        v-if="authPermissions.includes('Create Profile Users')"
        v-slot:extraButtonFirst
      >
        <AppButton
          :label="'+ Add User'"
          customTheme="border mr-2 text-black font-semibold"
          :style="{ backgroundColor: '#FFC72C' }"
          @click="$router.push('/profile/users/create')"
        />
      </template>
      <template v-slot:filter>
        <div class="w-1/5">
          <AppInput
            v-model="search"
            :wrapperClass="'px-1'"
            :type="'text'"
            :placeholder="'Search name, email, username'"
            :name="'search'"
            border
          />
        </div>

        <div class="w-32">
          <AppInput
            v-model="practiceRole"
            :wrapperClass="'px-1'"
            :type="'select'"
            :name="'practice_role'"
            :placeholder="'Practice Role'"
            :items="practiceRoles"
            :disabled="loading"
            border
            nolabel
          />
        </div>

        <div class="w-32">
          <AppInput
            v-model="practiceUserRoleId"
            :wrapperClass="'px-1'"
            :type="'select'"
            :name="'role_id'"
            :placeholder="'User Role'"
            :items="practiceUserRoles"
            :disabled="loading"
            border
            nolabel
          />
        </div>

        <AppButton class="mx-2" :label="'Apply'" @click="filterUsers" />

        <AppButton
          :label="'Clear'"
          customTheme="border hover:bg-gray-200"
          @click="clearFilters"
        />
      </template>
    </AppFilter>
    <!-- <div class="flex overflow-x-auto whitespace-no-wrap mt-4 items-center"> -->
    <!-- <AppButton
        v-if="authPermissions.includes('Create Profile Users')"
        :label="'Add User'"
        customTheme="border mr-2"
        @click="$router.push('/profile/users/create')"
      /> -->

    <!-- <AppButton
        class="mx-2"
        :label="'Filter'"
        :inStyle="'padding:5px 14px;margin-bottom:5px; font-size:14px;'"
        customTheme="border-2"
        @click="filterModal = !filterModal"
      /> -->

    <!-- <button @click="filterModal = !filterModal" class="flex items-center justify-between text-sm p-1 border rounded mr-1">
        <p class="mx-2">Filter</p>
        <span class="mx-2"><svgicon name="caret-down" width="10" :style="filterModal ? 'transform: rotate(180deg)' : ''" /></span>
      </button>

      <transition name="fade">
      <div v-if="filterModal" class="md:px-1 h-full flex w-full">
        <AppButton
          :label="'Clear'"
          :inStyle="'padding:5px 14px;margin-bottom:0'"
          @click="clearFilters"
        />

        <AppButton
          class="mx-2"
          :label="'Search'"
          :inStyle="'padding:5px 14px;margin-bottom:0'"
          @click="filterUsers"
        />
      </div>
      </transition> -->

    <!-- <AppButton
        v-if="showRefresh"
        :label="'Refresh'"
        :inStyle="'padding:5px 14px;margin-bottom:0;font-size:14px;'"
        @click="refreshUsers"
      />-->
    <!-- </div> -->

    <!-- <transition name="drop-down">
    <div class="flex flex-col md:flex-row items-start mt-2" v-if="filterModal" >
      <div class="md:px-1 md:w-1/4">
        <AppInput
          v-model="search"
          :wrapperClass="'px-1'"
          :type="'text'"
          :placeholder="'Search name, email, username'"
          :name="'search'"
          :label="'Search'"
        />
      </div>

      <div class="md:px-1 md:w-1/4">
        <AppInput
          v-model="practiceRole"
          :wrapperClass="'px-1'"
          :type="'select'"
          :name="'practice_role'"
          :label="'Practice Role'"
          :items="practiceRoles"
          :disabled="loading"
        />
      </div>

      <div class="md:px-1 md:w-1/4">
        <AppInput
          v-model="practiceUserRoleId"
          :wrapperClass="'px-1'"
          :type="'select'"
          :name="'role_id'"
          :label="'User Role'"
          :items="practiceUserRoles"
          :disabled="loading"
        />
      </div>
    </div>
    </transition> -->

    <AppTable
      v-if="users.length > 0"
      :total="total"
      :items="users"
      :loading="loading"
      :currentPage="current_page"
      :perPage="limit"
      :columns="columns"
      :orderBy="order_by"
      @pagechanged="pagechanged"
      @limitchanged="limitchanged"
      @sorted="sorted"
    >
      <template v-slot:actions="slotProps">
        <div class="flex items-center justify-center">
          <AppButton
            :disabled="
              $auth.user.id == slotProps.item.id ||
                (slotProps.item.practice_detail &&
                slotProps.item.practice_detail.role &&
                slotProps.item.practice_detail.role.name &&
                slotProps.item.practice_detail.role.name ===
                'Practice User Admin')
                ? true
                : false
            "
            class="mx-2"
            :label="'View'"
            @click="
              $router.push({ path: `/profile/users/${slotProps.item.id}` })
            "
          />
        </div>
      </template>
    </AppTable>

    <div v-else class="flex justify-center py-4 text-gray-600">
      No User Found
    </div>

    <transition name="fade" mode="out-in">
      <nuxt-link
        v-if="
          ['profile-users-create', 'profile-users-edit'].includes(
            $route.name
          ) || $route.name.includes('profile-users-id')
        "
        class="shield"
        :to="'/profile/users'"
      />
    </transition>

    <nuxt-child @addUser="addUser" @updateUser="updateUser" />
  </section>
</template>

<script>
import AppTable from "@/components/Base/AppTable";
import AppInput from "@/components/Base/AppInput";
import AppButton from "@/components/Base/AppButton";
import AppFilter from "@/components/Base/AppFilter";

export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },

  components: {
    AppTable,
    AppInput,
    AppButton,
    AppFilter
  },

  data() {
    return {
      filterModal: false,
      total: 0,
      users: [],
      loading: false,
      current_page: 1,
      // app table filter
      practiceUserRoles: [],
      practiceRoles: [
        {
          label: "All",
          value: ""
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
      offset: 0,
      limit: 5,
      order_by: ["created_at:desc"],
      search: "",
      practiceUserRoleId: null,
      practiceRole: null,

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
          class: "text-center"
        },
        // {
        //   name: "Suffix",
        //   dataIndex: "personal_detail.suffix",
        //   class: "text-center",
        // },
        {
          name: "Username",
          dataIndex: "username",
          class: "text-center",
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
          dataIndex: "user_role",
          class: "text-center"
        },
        {
          name: "Created At",
          dataIndex: "created_at_in_gb_formatted",
          class: "text-center",
          sortable: true
        },
        {
          name: "Status",
          dataIndex: "status",
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

  async asyncData({ app, redirect, error }) {
    if (app.$auth.user.domain === "Practice") {
      let permissions = app.$auth.user.practice_detail.role.permissions.map(
        permission => permission.name
      );

      if (permissions.includes("View Profile Users")) {
        try {
          const responseCount = await app.$axios.$get(
            `/api/v1/practice/practice-users/count`
          );
          const total =
            responseCount.data && responseCount.data.count
              ? responseCount.data.count
              : 0;

          const responseUsers = await app.$axios.$get(
            `/api/v1/practice/practice-users?offset=0&limit=5&order_by=created_at:desc`
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
                  fullname: `${user.personal_detail.first_name} ${user.personal_detail.last_name}`,
                  user_role: user.practice_detail.role
                    ? user.practice_detail.role.name
                    : null
                });
              } else {
                users.push({
                  ...user,
                  fullname: `${user.personal_detail.first_name} ${user.personal_detail.last_name}`,
                  user_role: user.practice_detail.role
                    ? user.practice_detail.role.name
                    : null,
                  removable: true
                });
              }
            });
          }
          return {
            total,
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
    this.practiceUserRoles = [];
    this.$axios
      .get(`/api/v1/practice/practice-roles`, {
        params: {
          limit: 1000000
        }
      })
      .then(response => {
        const practiceUserRoles = response.data.data.roles;

        this.practiceUserRoles.push({
          label: "All",
          value: ""
        });

        practiceUserRoles.forEach(practiceUserRole => {
          this.practiceUserRoles.push({
            label: practiceUserRole.name,
            value: practiceUserRole.id
          });
        });
      });
  },

  methods: {
    getUsersPromiseAll() {
      const params = {
        search: this.search,
        practice_role: this.practiceRole,
        role_id: this.practiceUserRoleId
      };

      return Promise.all([
        this.$axios.$get(`/api/v1/practice/practice-users/count`, {
          params: {
            ...params
          }
        }),
        this.$axios.$get(`/api/v1/practice/practice-users`, {
          params: {
            ...params,
            offset: 0,
            limit: 5
          }
        })
      ]).then(([responseCount, responseUsers]) => {
        this.total = responseCount.data.count;

        this.users = [];
        return responseUsers.data.users.forEach(user => {
          if (
            user.practice_detail.role &&
            user.practice_detail.role.name == "Practice User Admin"
          ) {
            this.users.push({
              ...user,
              fullname: `${user.personal_detail.first_name} ${user.personal_detail.last_name}`,
              user_role: user.practice_detail.role
                ? user.practice_detail.role.name
                : null
            });
          } else {
            this.users.push({
              ...user,
              fullname: `${user.personal_detail.first_name} ${user.personal_detail.last_name}`,
              user_role: user.practice_detail.role
                ? user.practice_detail.role.name
                : null,
              removable: true
            });
          }
        });
      });
    },

    getUsers() {
      const params = {
        search: this.search,
        practice_role: this.practiceRole,
        role_id: this.practiceUserRoleId
      };

      return this.$axios
        .$get(`/api/v1/practice/practice-users`, {
          params: {
            ...params,
            offset: this.offset,
            limit: 5
          }
        })
        .then(res => {
          this.users = [];
          return res.data.users.forEach(user => {
            if (
              user.practice_detail.role &&
              user.practice_detail.role.name == "Practice User Admin"
            ) {
              this.users.push({
                ...user,
                fullname: `${user.personal_detail.first_name} ${user.personal_detail.last_name}`,
                user_role: user.practice_detail.role
                  ? user.practice_detail.role.name
                  : null
              });
            } else {
              this.users.push({
                ...user,
                fullname: `${user.personal_detail.first_name} ${user.personal_detail.last_name}`,
                user_role: user.practice_detail.role
                  ? user.practice_detail.role.name
                  : null,
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

    async filterUsers() {
      this.current_page = 1;
      this.offset = 0;
      this.loading = true;
      await this.getUsersPromiseAll();
      this.loading = false;
      this.filterModal = false;
    },

    async sorted(order_by) {
      this.current_page = 1;
      this.offset = 0;
      this.order_by = order_by;
      this.loading = true;
      await this.getUsers();
      this.loading = false;
    },

    async pagechanged(page) {
      this.current_page = page;
      this.offset = this.limit * (page - 1);
      this.loading = true;
      await this.getUsers();
      this.loading = false;
    },

    async limitchanged(limit) {
      this.current_page = 1;
      this.offset = 0;
      this.limit = limit;
      this.loading = true;
      await this.getUsers();
      this.loading = false;
    },

    clearFilters() {
      this.offset = 0;
      this.limit = 5;
      this.order_by = ["created_at:desc"];
      this.search = "";
      this.practiceUserRoleId = null;
      this.practiceRole = null;
      this.filterUsers();
    },

    addUser(user) {
      console.log(user);
      this.getUsers();
      // if (
      //   user.practice_detail.role &&
      //   user.practice_detail.role.name == "Practice User Admin"
      // ) {
      //   this.users.push({
      //     ...user,
      //     fullname: `${user.personal_detail.first_name} ${
      //       user.personal_detail.last_name
      //     }`,
      //     user_role: user.practice_detail.role
      //       ? user.practice_detail.role.name
      //       : null
      //   });
      // } else {
      //   this.users.push({
      //     ...user,
      //     fullname: `${user.personal_detail.first_name} ${
      //       user.personal_detail.last_name
      //     }`,
      //     user_role: user.practice_detail.role
      //       ? user.practice_detail.role.name
      //       : null,
      //     removable: true
      //   });
      // }
      // this.users.push({
      //   ...user,
      //   fullname: `${user.personal_detail.first_name} ${
      //     user.personal_detail.last_name
      //   }`,
      //   user_role: user.practice_detail.role
      //     ? user.practice_detail.role.name
      //     : null
      // });
    },
    updateUser() {
      this.getUsers();
      // let index = this.users.findIndex(item => item.id === user.id);
      // if (index >= 0) {
      //   this.users.splice(index, 1, {
      //     ...user,
      //     fullname: `${user.personal_detail.first_name} ${
      //       user.personal_detail.last_name
      //     }`,
      //     user_role: user.practice_detail.role
      //       ? user.practice_detail.role.name
      //       : null
      //   });
      // }
    },
    statusStyle(status) {
      switch (status) {
      case "Active":
        return "bg-green-500 text-white";
      case "Disabled":
        return "bg-gray-300 text-gray-600";
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
