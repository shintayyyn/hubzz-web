<template>
  <section>
    <div class="p-8 max-w-5xl">
      <div @click="$emit('close')" class="cursor-pointer">
        <svgicon name="left-arrow" height="32" width="32" />
      </div>
      <div class="flex flex-col mt-8">
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
        <div class="rounded-lg shadow-md p-4">
          <div class="flex flex-wrap justify-start">
            <div class="w-full md:w-1/2 p-2" v-for="(role, index) in permissions" :key="index">
              <div class="flex flex-col">
                <div class="w-full flex flex-row items-center">
                  <input
                    type="checkbox"
                    :checked="isChecked(role.permissions)"
                    @change="checkAll(index, $event.target.checked)"
                  />
                  <div class="font-bold text-xl pl-1">{{role.category}} Management</div>
                </div>
                <div class="flex flex-col px-1">
                  <div
                    class="w-full flex flex-row items-center"
                    v-for="permission in role.permissions"
                    :key="permission.id"
                  >
                    <input v-model="permission.done" type="checkbox" :checked="permission.done" />
                    <div class="text-sm pl-1">{{permission.name}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="m-2 flex flex-wrap justify-start">
          <AppButton :label="'Delete'" @click="remove_modal = true" />
          <div class="mx-1"></div>
          <AppButton :label="'Save'" @click="save" />
        </div>
      </div>
    </div>
    <AppConfirmationModal
      :label="'Proceed to delete this Role?'"
      :confirmLabel="'Yes'"
      :cancelLabel="'Cancel'"
      :modal="remove_modal"
      @confirm="remove"
      @cancel="remove_modal = false"
    />
  </section>
</template>
<script>
import AppInput from "@/components/Base/AppInput";
import AppButton from "@/components/Base/AppButton";
import AppConfirmationModal from "@/components/Base/AppConfirmationModal";
export default {
  props: ["role"],
  components: {
    AppInput,
    AppButton,
    AppConfirmationModal
  },
  data() {
    return {
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
            this.$emit("updateRole", res.data.role);
            // this.$emit("close");
          });
      }
    },
    remove() {
      this.$axios
        .$delete(`/api/v1/practice/practice-roles/${this.$route.params.id}`)
        .then(res => {
          this.$emit("removeRole", this.$route.params.id);
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`${res.message}`]
          });
          this.$emit("close");
        });
    }
  }
};
</script>