<template>
  <div ref="modalContainer" class="p-2">
    <!-- <div>
      <svgicon
        name="left-arrow"
        height="32"
        width="32"
        class="cursor-pointer"
        @click="$router.push('/roles-and-permissions/roles')"
      />
    </div> -->

    <div class="flex flex-col items-start">
      <AppInput
        v-model="form.name"
        :type="'text'"
        :name="'name'"
        :label="'Role Name'"
        :error="formError.find(item => item.field === 'name')"
        class="w-full"
      />
      <div class="relative w-full">
        <AppInput
          v-model="form.description"
          :type="'textarea'"
          :name="'description'"
          :label="'Description'"
          :error="formError.find(item => item.field === 'description')"
          :resize="false"
          :rows="2"
          :limit="255"
          class="w-full"
        />
      </div>
      
      <div class="rounded-lg border px-2 pt-4 pb-2">
        <div
          v-if="formError.find(item => item.field === 'permission_id')"
          class="text-red-500 text-xs"
        >
          {{ formError.find(item => item.field === 'permission_id').message }}
        </div>

        <div class="flex flex-wrap justify-start">
          <!-- <div class="w-full md:w-1/2 p-2" v-for="(role, index) in permissions" :key="index">
            <div class="flex flex-col">
              <div class="w-full flex flex-row items-center pb-1">
                <input
                  type="checkbox"
                  :id="role.permissions"
                  :checked="isChecked(role.permissions)"
                  @change="checkAll(index, $event.target.checked)"
                />
                <label
                  class="font-bold md:text-xl pl-1 leading-none flex items-center"
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
                    type="checkbox"
                    :id="permission.id"
                    :checked="permission.done"
                    @change="hasRelatedRole(permission)"
                  />
                  <label :for="permission.id" class="text-sm pl-1">{{permission.name}}</label>
                </div>
              </div>
            </div>
          </div>-->

          <div v-for="(role, index) in permissions" :key="index" class="w-full md:w-1/2 lg:w-1/3 p-2">
            <div class="flex flex-col">
              <div class="w-full flex flex-row items-center pb-1">
                <input
                  :id="role.category"
                  type="checkbox"
                  :checked="isChecked(role.permissions)"
                  @change="checkAll(index, $event.target.checked)"
                >
                <label
                  class="font-bold md:text-xl pl-1 leading-none flex items-center"
                  :for="role.category"
                >{{ role.category }} Management</label>
              </div>

              <div v-for="(item, hierarchyPermissionIndex) in hierarchyPermissions" :key="hierarchyPermissionIndex">
                <template v-if="role.category === item.category">
                  <div class="w-full p-2">
                    <div class="flex flex-col w-full">
                      <div class="pl-4 w-full">
                        <div
                          v-for="(permission, permissionIndex) in item.permissions"
                          :key="permission.id"
                          class="flex flex-col px-1 w-full"
                        >
                          <input
                            :id="permission.id"
                            v-model="permission.done"
                            type="checkbox"
                            :checked="permission.done"
                            @change="onChangeCategory(permissionIndex, item.permissions, $event.target.checked)"
                          >
                          <label
                            :for="permission.id"
                            class="text-sm pl-1"
                            :class="permissionIndex === 0 ? '' : item.permissions.length > 1 ? 'ml-8' : ''"
                          >{{ permission.name }}</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
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
</template>
<script>
import AppInput from "@/components/Base/AppInput"
import AppButton from "@/components/Base/AppButton"

export default {
  components: {
    AppInput,
    AppButton,
  },

  data () {
    return {
      permissions: [],
      hierarchyPermissions: [],
      form: {
        name: "",
        description: "",
        permission_id: [],
      },
      formError: [],
    }
  },

  mounted () {
    this.getPermissions()
  },

  methods: {
    getPermissions () {
      this.$axios.$get(`/api/v1/practice/practice-permissions`).then(res => {
        res.data.permissions.forEach(permission => {
          this.permissions.push({ ...permission, done: false, })
        })
        this.setCategory()
      })
    },

    setSubcategories (permission) {
      let subCategories = []
      permission.forEach(item => {
        item.permissions.forEach(item => {
          if (subCategories.length === 0) {
            subCategories.push({
              category: item.category,
              subcategory: item.subcategory,
              permissions: [],
            })
          } else {
            let foundCategory = subCategories.find(
              categ => categ.subcategory === item.subcategory
            )
            if (!foundCategory) {
              subCategories.push({
                category: item.category,
                subcategory: item.subcategory,
                permissions: [],
              })
            }
          }
        })
      })
      this.setHierarchy(subCategories)
    },

    setHierarchy (subCategories) {
      this.permissions.forEach(item => {
        item.permissions.forEach(permission => {
          let findSub = subCategories.find(
            sub =>
              sub.category === permission.category
							&& sub.subcategory === permission.subcategory
          )
          findSub.permissions.push(permission)
        })
      })
      this.hierarchyPermissions = subCategories
    },

    onChangeCategory (index, permissions, e) {
      if (index === 0) {
        permissions.forEach(item => {
          item.done = e
        })
      } else {
        let findParent = permissions.find((item, index) => index === 0)
        let hasCheck = []
        permissions.forEach((item, index) => {
          if (index > 0) hasCheck.push(item.done)
        })
        if (findParent && findParent.done === false) findParent.done = true
        // else findParent.done = false;
      }
    },
    setCategory () {
      let categories = []
      this.permissions.forEach(permission => {
        if (categories.length === 0) {
          categories.push({
            category: permission.category,
            permissions: [],
          })
        } else {
          let hasSameCategory = categories.find(
            item => item.category === permission.category
          )
          if (!hasSameCategory) {
            categories.push({
              category: permission.category,
              permissions: [],
            })
          }
        }
      })
      this.setPermissions(categories)
    },
    setPermissions (categories) {
      this.permissions.forEach(permission => {
        let foundCategory = categories.find(
          item => item.category === permission.category
        )
        foundCategory.permissions.push(permission)
      })
      this.permissions = categories
      this.setSubcategories(categories)
    },
    isChecked (permissions) {
      return !permissions.map(item => item.done).includes(false)
    },
    checkAll (index, checked) {
      console.log("index", index)
      console.log(this.permissions)
      this.permissions[index].permissions.forEach(item => {
        item.done = checked
      })
    },
    create () {
      this.formError = []
      let ids = []
      this.permissions.forEach(item => {
        item.permissions.forEach(permission => {
          if (permission.done) {
            ids.push(permission.id)
          }
        })
      })
      this.form.permission_id = ids
      this.Validate(this.form)
      console.log("errors", this.formError)
      console.log("form", this.form)
      if (!this.formError.length) {
        if (this.form.permission_id.length > 0) {
          this.$axios
            .$post(`/api/v1/practice/practice-roles`, this.form)
            .then(res => {
              this.$emit("addRole", res.data.role)
              this.$router.push(`/roles-and-permissions/roles`)
              this.$store.commit("SET_NOTIFICATION", {
                enabled: true,
                status: "success",
                text: [`${res.message}`,],
              })
            })
            .catch((err) => {
              console.log('err', err.response || err)
              this.$nextTick(() => {
                this.$refs.modalContainer.scrollTop = 0
              })
            })
        }
      } else {
        this.$nextTick(() => {
          this.$refs.modalContainer.scrollTop = 0
        })
      }
    },
    hasRelatedRole (permission) {
      let errIndex = this.formError.findIndex(
        item => item.field === "permission_id"
      )
      if (errIndex > -1) {
        this.formError.splice(errIndex, 1)
      }
      let hasRelatedRolesList = ["View Profile Practice",]
      let roles = this.permissions.find(
        item => item.category === permission.category
      )
      hasRelatedRolesList.forEach(item => {
        if (permission.name !== item && permission.name.includes(item)) {
          let findRole = roles.permissions.find(role => role.name === item)
          if (permission.done === true && findRole.done === false) {
            findRole.done = true
          }
        }
      })
    },
  },
}
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
