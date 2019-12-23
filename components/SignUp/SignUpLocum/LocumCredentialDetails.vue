<template>
	<div class="flex flex-col items-center justify-center w-full">
		<div class="flex w-full justify-center xl:justify-start">
			<div class="flex md:mx-4" style="flex: 0 1 600px;">
				<h3>Finally,</h3>
			</div>
		</div>

		<div class="flex w-full justify-center xl:justify-start">
			<div class="flex md:m-4" style="flex: 0 1 600px;">
				<span>For your sign-in credentials</span>
			</div>
		</div>

		<div class="flex w-full justify-center xl:justify-start">
			<div class="md:mx-4 flex flex-col p-4 md:p-8 m-1 rounded-lg shadow-lg" style="flex: 0 1 600px;">
				<form class="w-full">
					<AppInput
						v-model="form.email"
						:type="'email'"
						:name="'email'"
						:label="'Email'"
						:placeholder="'Your email address'"
						:error="formError.find(item => item.field === 'email')"
						@blur="CheckEmptyField(form.email, 'email')"
						required
					/>
					<AppInput
						v-model="form.password"
						:type="'password'"
						:name="'password'"
						:label="'Password'"
						:placeholder="'Password'"
						:error="formError.find(item => item.field === 'password')"
						@blur="CheckEmptyField(form.password, 'password')"
						required
					/>
					<AppInput
						v-model="form.password_confirmation"
						:type="'password'"
						:name="'password_confirmation'"
						:label="'Repeat password to verify'"
						:placeholder="'Repeat password'"
						:password="form.password"
						:error="formError.find(item => item.field === 'password_confirmation')"
						@blur="CheckEmptyField(form.password_confirmation, 'password_confirmation')"
						required
					/>

					<div class="flex flex-col py-2 mb-6">
						<div class="flex flex-row flex-no-wrap justify-between">
							<input
								v-model="form.privacy_policy"
								id="privacy_policy"
								type="checkbox"
								class="checkbox mt-1 mr-1"
							/>
							<label for="privacy_policy" class="text-xs sm:text-sm py-1">
								I agree with the
								<span
									class="cursor-pointer underline"
									@click="modal = true"
								>Terms and Conditions and Privacy Policy</span> of Hubzz
								<span class="text-red-500">*</span>
							</label>
						</div>
						<transition name="drop-down">
							<div
								class="py-1 text-xs text-red-500"
								v-if="formError.find(item => item.field === 'privacy_policy')"
							>{{formError.find(item => item.field === 'privacy_policy').message.charAt(0).toUpperCase() + formError.find(item => item.field === 'privacy_policy').message.slice(1).replace(/_/g, " ")}}</div>
						</transition>
					</div>
					<!-- <AppInput
						v-model="form.privacy_policy"
						:type="'single-checkbox'"
						:name="'privacy_policy'"
						:label="'Terms and Conditions and Privacy Policy of Hubzz'"
						:error="formError.find(item => item.field === 'privacy_policy')"
					/>
					/>-->
				</form>
			</div>
		</div>

		<div class="flex justify-center mt-4">
			<AppButton
				:label="'<<'"
				@click="$store.commit('sign-up/SET_ACTIVE_COMPONENT', 'LocumPayrollDetails')"
			/>
			<div class="mx-2"></div>
			<AppButton :label="'Next'" @click="next" :inStyle="'padding:6px 16px;'" />
		</div>

		<div class="shield" v-if="modal" @click="modal=false"></div>
		<transition name="slide" mode="out-in">
			<div class="py-8 modal-container" v-if="modal">
				<div class="px-4 lg:px-10 pb-4">
					<svgicon
						name="left-arrow"
						height="32"
						width="32"
						@click="modal = false"
						class="cursor-pointer"
					/>
				</div>
				<TermsAndConditions />
			</div>
		</transition>
	</div>
</template>
<script>
import AppInput from "@/components/Base/AppInput";
import AppButton from "@/components/Base/AppButton";
import TermsAndConditions from "@/components/TermsAndConditions";
export default {
	components: {
		AppInput,
		AppButton,
		TermsAndConditions
	},
	data() {
		return {
			form: {
				email: "",
				password: "",
				password_confirmation: "",
				privacy_policy: false
			},
			formError: [],
			modal: false
		};
	},
	computed: {
		credentialDetails() {
			return this.$store.getters["sign-up/credentialDetails"];
		},
		credentialFormError() {
			return this.$store.getters["sign-up/credentialFormError"];
		}
	},
	watch: {
		credentialFormError(value) {
			if (value.length > 0) {
				value.forEach(item => {
					this.formError.push(item);
				});
			}
		},
		"form.email"(value) {
			this.CheckEmptyField(this.form.email, "email");
		},

		"form.password"(value) {
			this.CheckEmptyField(this.form.password, "password");
		},

		"form.password_confirmation"(value) {
			this.CheckEmptyField(
				this.form.password_confirmation,
				"password_confirmation"
			);
		},
		"form.privacy_policy"(value) {
			this.CheckEmptyField(this.form.privacy_policy, "privacy_policy");
		}
	},
	mounted() {
		this.form.email = this.credentialDetails.email;
		this.form.password = this.credentialDetails.password;
		this.form.password_confirmation = this.credentialDetails.password_confirmation;
		this.form.privacy_policy = false;
		if (this.credentialFormError.length > 0) {
			this.credentialFormError.forEach(item => {
				this.formError.push(item);
			});
		}
	},
	methods: {
		next() {
			this.formError = [];
			this.Validate(this.form);
			if (!this.formError.length) {
				this.$store.commit("sign-up/SET_CREDENTIAL_DETAILS", this.form);
				this.$store.commit("sign-up/SET_CREDENTIAL_DETAIL_FORM_ERROR", []);
				setTimeout(() => {
					this.$store.dispatch("sign-up/registeredLocum");
				}, 1000);
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
		width: 50%;
	}
}
.shield {
	z-index: 509;
}
</style>