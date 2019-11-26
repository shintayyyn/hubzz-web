<template>
  <section class="relative">
    <AppLoading :loading="loading" spinner />
    <div class="p-4 md:p-8">
      <div>
        <svgicon name="left-arrow" height="32" width="32" @click="$emit('close')" class="cursor-pointer"/>
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
          :resize="false"
          :rows="3"
        />
        <div class="rounded-lg shadow-md px-2 py-4 md:px-4">
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
                  <label
                    class="font-bold text-xl pl-1"
                    :for="role.permissions"
                  >{{role.category}} Management</label>
                </div>
                <div class="flex flex-col px-1">
                  <div
                    class="w-full flex flex-row items-center"
                    v-for="permission in role.permissions"
                    :key="permission.id"
                  >
                    <input
                      v-model="permission.done"
                      :id="permission.id"
                      type="checkbox"
                      :checked="permission.done"
                    />
                    <label class="text-sm pl-1" :for="permission.id">{{permission.name}}</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-wrap justify-start my-4">
          <AppButton :label="'Save'" @click="save" />
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import AppInput from "@/components/Base/AppInput";
import AppButton from "@/components/Base/AppButton";
import AppLoading from "@/components/Base/AppLoading";
export default {
  props: ["role"],
  components: {
    AppLoading,
    AppInput,
    AppButton
  },
  data() {
    return {
      loading: false,
      remove_modal: false,
      permissions: [],
      form: {
        name: "",
        description: "",
        permission_id: []
      },
      formError: []
    };
  },
  created() {
    this.form.name = this.role.name;
    this.form.description = this.role.description;
    this.getPermissions();
  },
  methods: {
    getPermissions() {
      this.$axios.$get(`/api/v1/practice/practice-permissions`).then(res => {
        res.data.permissions.forEach(permission => {
          let hasPermission = this.role.permissions.find(
            item => item.id === permission.id
          );
          if (hasPermission) {
            this.permissions.push({ ...permission, done: true });
          } else {
            this.permissions.push({ ...permission, done: false });
          }
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
    save() {
      this.Validate(this.form, ["permission_id"]);
      if (!this.formError.length) {
        this.loading = true;
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
          .$put(
            `/api/v1/practice/practice-roles/${this.$route.params.id}`,
            this.form
          )
          .then(res => {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: [`${res.message}`]
            });
            this.loading = false;
            this.$emit("updateRole", res.data.role);
          });
      }
    }
  }
};
</script>