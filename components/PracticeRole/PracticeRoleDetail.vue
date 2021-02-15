<template>
  <section class="relative">
    <AppLoading :loading="loading" spinner />
    <div class="">
      <!-- <div>
        <svgicon
          name="left-arrow"
          height="32"
          width="32"
          class="cursor-pointer"
          @click="$emit('close')"
        />
      </div> -->
      <div class="flex flex-col">
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
          :limit="255"
          :error="formError.find(item => item.field === 'description')"
        />
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
										<input
											v-model="permission.done"
											:id="permission.id"
											type="checkbox"
											:checked="permission.done"
											@change="hasRelatedRole(permission)"
										/>
										<label class="text-sm pl-1" :for="permission.id">{{permission.name}}</label>
									</div>
								</div>
							</div>
						</div>-->
            <div v-for="(role, index) in permissions" :key="index" class="w-full md:w-1/2 lg:w-1/3 p-2">
              <div class="flex flex-col">
                <div class="w-full flex flex-row items-center pb-1">
                  <!-- <input
										type="checkbox"
										:id="role.permissions"
										:checked="isChecked(role.permissions)"
										@change="checkAll(index, $event.target.checked, role)"
									/>
									{{index}} -->
                  <label
                    class="font-bold md:text-xl pl-1 leading-none flex items-center"
                    :for="role.permissions"
                  >{{ role.category }} Management</label>
                </div>
                <div v-for="(item, index) in hierarchyPermissions" :key="index">
                  <template v-if="role.category === item.category">
                    <div class="w-full p-2">
                      <div class="flex flex-col">
                        <div class="pl-4">
                          <div
                            v-for="(permission, index) in item.permissions"
                            :key="permission.id"
                            class="flex flex-col px-1"
                          >
                            <input
                              :id="permission.id"
                              v-model="permission.done"
                              type="checkbox"
                              :checked="permission.done"
                              @change="onChangeCategory(index, item.permissions, $event.target.checked)"
                            >
                            <label
                              :for="permission.id"
                              class="text-sm pl-1"
                              :class="index === 0 ? '' : item.permissions.length > 1 ? 'ml-8' : ''"
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
        <div class="flex flex-wrap justify-start my-4">
          <AppButton
            v-if="authPermissions.includes('Update Role')" 
            :label="'Save'" 
            @click="save" 
          />
          <AppButton
            v-if="authPermissions.includes('Delete Role')" 
            :label="'Delete'" 
            :customTheme="'bg-red-600 hover:bg-red-700 text-white mx-2'" 
            @click="deleteRole" 
          />
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import AppInput from "@/components/Base/AppInput"
import AppButton from "@/components/Base/AppButton"
import AppLoading from "@/components/Base/AppLoading"
export default {
  components: {
    AppLoading,
    AppInput,
    AppButton,
  },
  props: ["role",],
  data () {
    return {
      loading: false,
      remove_modal: false,
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
  computed: {
    authPermissions () {
      return this.$store.getters["permissions"]
    },
  },
  created () {
    this.form.name = this.role.name
    this.form.description = this.role.description
    this.getPermissions()
  },
  methods: {
    hasRelatedRole (permission) {
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
    async getPermissions () {
      let params = {}
      params = {
        practice_type: await this.$auth.user.practice_detail.practice.type,
      }
      await this.$axios.$get(`/api/v1/practice/practice-permissions`, {
        params,
      }).then(res => {
        res.data.permissions.forEach(permission => {
          let hasPermission = this.role.permissions.find(
            item => item.id === permission.id
          )
          if (hasPermission) {
            this.permissions.push({ ...permission, done: true, })
          } else {
            this.permissions.push({ ...permission, done: false, })
          }
        })
        this.setCategory()
      })
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
      console.log('subCategories', subCategories)
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
    isChecked (permissions) {
      let checkedPermissions = []
      checkedPermissions = permissions.filter( item => item.done === true)
      if(checkedPermissions.length > 0) {
        return true
      } else {
        return false
      }
    },
    checkAll (index, checked, role) {
      // console.log('tdsa', this.)
      console.log('index banana', index)
      console.log('role', role)
      this.permissions[index].permissions.forEach(item => {
        item.done = checked
      })
    },
    save () {
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
      if (!this.formError.length) {
        this.loading = true
        this.$axios
          .$put(
            `/api/v1/practice/practice-roles/${this.$route.params.id}`,
            this.form
          )
          .then(res => {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: [`${res.message}`,],
            })
            this.loading = false
            this.$emit("updateRole", res.data.role)
            this.$emit("close")
          })
          .catch(err => {
            this.$emit("scrollToTop")
          })
      } else {
        this.$emit("scrollToTop")
      }
    },
    deleteRole () {
      this.$axios.$delete(`/api/v1/practice/practice-roles/${this.$route.params.id}`)
        .then(res => {
          console.log(res)
          this.$router.push(`/roles-and-permissions/roles`)
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`${res.message}`,],
          })
        })
        .catch(err => {
          console.log('err', err.response)
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "danger",
            text: [`${err.response.data.message}`,],
          })
        })
    },
  },
}
</script>
