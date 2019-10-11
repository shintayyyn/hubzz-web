<template>
  <div class="modal-container shadow-lg">
    <div class="p-4 md:p-8">
      <div @click="$router.push('/roles-and-permissions/roles')" class="cursor-pointer">
        <svgicon name="left-arrow" height="32" width="32" />
      </div>
      <div class="flex flex-col mt-4">
        <AppInput
          v-model="form.name"
          :type="'text'"
          :name="'name'"
          :label="'Role Name'"
          :error="formError.find(item => item.field === 'name')"
        />
        <AppInput
          v-model="form.description"
          :type="'textarea'"
          :name="'description'"
          :label="'Description'"
          :error="formError.find(item => item.field === 'description')"
          :resize="false"
          :rows="3"
        />
        <div class="rounded-lg shadow-md px-2 py-2 md:px-4">
          <div class="flex flex-wrap justify-start">
            <div class="w-full md:w-1/2 p-2" v-for="(role, index) in permissions" :key="index">
              <div class="flex flex-col">
                <div class="w-full flex flex-row items-center">
                  <input
                    type="checkbox"
                    :id="role.permissions"
                    :checked="isChecked(role.permissions)"
                    @change="checkAll(index, $event.target.checked)"
                  />
                  <label class="font-bold text-xl pl-1" :for="role.permissions">{{role.category}} Management</label>
                </div>
                <div class="flex flex-col px-1">
                  <div
                    class="w-full flex flex-row items-center"
                    v-for="permission in role.permissions"
                    :key="permission.id"
                  >
                    <input v-model="permission.done" type="checkbox" :id="permission.id" :checked="permission.done" />
                    <label :for="permission.id" class="text-sm pl-1">{{permission.name}}</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="my-4">
          <AppButton :label="'Create'" @click="create" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import AppInput from "@/components/Base/AppInput";
import AppButton from "@/components/Base/AppButton";
export default {
  components: {
    AppInput,
    AppButton
  },
  data() {
    return {
      permissions: [],
      form: {
        name: "",
        description: "",
        permission_id: []
      },
      formError: []
    };
  },
  async asyncData({ app, error }) {
    try {
    } catch (err) {
      if (err.response && err.response.status === 401) {
        error(err.response.data);
        return;
      }
      throw err;
    }
  },
  mounted() {
    this.getPermissions();
  },
  methods: {
    getPermissions() {
      this.$axios.$get(`/api/v1/practice/practice-permissions`).then(res => {
        res.data.permissions.forEach(permission => {
          this.permissions.push({ ...permission, done: false });
        });
        this.setCategory();
      });
    },
    setCategory() {
      let categories = [];
      this.permissions.forEach(permission => {
        if (categories.length === 0) {
          categories.push({
            category: permission.category,
            permissions: []
          });
        } else {
          let hasSameCategory = categories.find(
            item => item.category === permission.category
          );
          if (!hasSameCategory) {
            categories.push({
              category: permission.category,
              permissions: []
            });
          }
        }
      });
      this.setPermissions(categories);
    },
    setPermissions(categories) {
      this.permissions.forEach(permission => {
        let foundCategory = categories.find(
          item => item.category === permission.category
        );
        foundCategory.permissions.push(permission);
      });
      this.permissions = categories;
    },
    isChecked(permissions) {
      return !permissions.map(item => item.done).includes(false);
    },
    checkAll(index, checked) {
      this.permissions[index].permissions.forEach(item => {
        item.done = checked;
      });
    },
    create() {
      this.formError = [];
      this.Validate(this.form, ["permission_id"]);
      if (!this.formError.length) {
        let ids = [];
        this.permissions.forEach(item => {
          item.permissions.forEach(permission => {
            if (permission.done) {
              ids.push(permission.id);
            }
          });
        });
        this.form.permission_id = ids;
        this.$axios
          .$post(`/api/v1/practice/practice-roles`, this.form)
          .then(res => {
            this.$emit("addRole", res.data.role);
            this.$router.push(`/roles-and-permissions/roles`);
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: [`${res.message}`]
            });
          });
      }
    }
  }
};
</script>
<style scoped>
.modal-container {
  z-index: 510;
}
@media screen and (min-width: 1200px) {
  .modal-container {
    width: 80%;
  }
}
</style>