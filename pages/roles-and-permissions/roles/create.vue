<template>
	<div class="modal-container shadow-lg" ref="modalContainer">
		<div class="p-4 md:p-8">
			<div>
				<svgicon
					name="left-arrow"
					height="32"
					width="32"
					class="cursor-pointer"
					@click="$router.push('/roles-and-permissions/roles')"
				/>
			</div>
			<div class="flex flex-col items-start mt-4">
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
				<div class="rounded-lg shadow-md p-2 md:p-4">
					<div class="flex flex-wrap justify-start">
						<div class="w-full md:w-1/2 p-2" v-for="(role, index) in permissions" :key="index">
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
										/>
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
	// watch: {
	// 	"form.description"(value) {
	// 		if (value.length > 255) {
	// 			if (!this.formError.find(item => item.field === "description")) {
	// 				this.formError.push({ field: "description", message: "Too much" });
	// 			}
	// 		} else {
	// 			let index = this.formError.findIndex(
	// 				item => item.field === "description"
	// 			);
	// 			if (index <= 0) {
	// 				this.formError.splice(index, 1);
	// 			}
	// 		}
	// 	}
	// },
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
					})
					.catch(err => {
						this.$nextTick(() => {
							this.$refs.modalContainer.scrollTop = 0;
						});
					});
			} else {
				this.$nextTick(() => {
					this.$refs.modalContainer.scrollTop = 0;
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