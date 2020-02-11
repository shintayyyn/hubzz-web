<template>
	<section class="sign-in-card">
		<div class="flex flex-col">
			<div class="rounded-lg shadow-lg px-8 pb-8 pt-12">
				<div class="w-full flex flex-col">
					<AppInput
						v-model="form.password"
						:type="'password'"
						:name="'password'"
						:label="'New password'"
						:placeholder="''"
						:error="formError.find(item => item.field === 'password')"
						@blur="CheckEmptyField(form.password,'password')"
					/>
					<AppInput
						v-model="form.password_confirmation"
						:type="'password'"
						:name="'password_confirmation'"
						:label="'Repeat password to confirm'"
						:placeholder="''"
						:error="formError.find(item => item.field === 'password_confirmation')"
						@blur="CheckEmptyField(form.password_confirmation,'password_confirmation')"
					/>
				</div>
				<AppButton :label="'Change Password'" @click="reset" />
			</div>
		</div>
	</section>
</template>
<script>
import AppInput from "@/components/Base/AppInput";
import AppButton from "@/components/Base/AppButton";
export default {
	layout: "auth",
	components: {
		AppInput,
		AppButton
	},
	async asyncData({ app, params, error }) {
		try {
			let response = await app.$axios.$get(
				`/api/v1/forgot-password/${params.token}`
			);
			const forgot_password_token = response.data.forgot_password_token;
			return {
				forgot_password_token
			};
		} catch (err) {
			if ((err.response.data, error_messages)) {
				err.response.data.error_messages.forEach(error => {
					this.formError.push({
						field:
							error.field === "new_password"
								? "new_password_confirmation"
								: error.field,
						message: error.message,
						validation: error.validation
					});
				});
			}
			throw err;
		}
	},
	data() {
		return {
			form: {
				password: "",
				password_confirmation: ""
			},
			formError: []
		};
	},
	methods: {
		reset() {
			this.formError = [];
			this.Validate(this.form);
			if (!this.formError.length) {
				this.$axios
					.$post(
						`/api/v1/reset-password/${this.forgot_password_token.token}`,
						this.form
					)
					.then(res => {
						this.$store.commit("SET_NOTIFICATION", {
							enabled: true,
							status: "success",
							text: [res.message]
						});
						this.$router.push("/");
					})
					.catch(err => {
						this.formError = err.response.data.error_messages;
						console.log("???", err.response.data.error_messages);
					});
			}
		}
	}
};
</script>
<style scoped>
.sign-in-card {
	position: absolute;
	top: 0px;
	left: 0;
	right: 0;
	bottom: 0;
	margin: auto;
	max-width: 600px;
	height: 500px;
	padding: 1px;
}

@media screen and (max-width: 1205px) {
	.sign-in-card {
		position: relative;
		top: 30px;
	}
}
</style>
