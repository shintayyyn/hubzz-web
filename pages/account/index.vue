<template>
	<div class="relative bg-white rounded-lg shadow-lg p-4 md:p-8 max-w-3xl">
		<AppLoading :loading="loading" spinner />
		<AppFormError :formError="formError" v-if="formError.length > 0" />
		<template v-if="$auth.user.domain === 'Practice'">
			<AppInput
				v-model="practiceForm.email"
				:type="'email'"
				:name="'email'"
				:label="'Email address'"
				:error="formError.find(item => item.field === 'email')"
				@submit="save"
				@blur="CheckEmptyField(practiceForm.email, 'email')"
			/>
			<div class="-mt-6 mb-4" v-if="email_verifiedAt">
				<span
					class="text-xs"
				>E-mail is Verified on {{$moment(email_verifiedAt).format('MMM DD, YYYY | hh:mm A')}}</span>
			</div>
			<div class="-mt-6 mb-4" v-if="!email_verifiedAt">
				<span class="text-red-500 text-xs">E-mail is not yet verified.</span>
				<span
					class="p-1 bg-gray-800 rounded text-xs text-white cursor-pointer whitespace-no-wrap"
					@click="resendEmailVerification()"
				>Click here to re-send</span>
			</div>
			<AppInput
				v-model="practiceForm.title"
				:type="'text'"
				:name="'title'"
				:label="'Title'"
				@submit="save"
			/>
			<AppInput
				v-model="practiceForm.first_name"
				:type="'text'"
				:name="'first_name'"
				:label="'First name'"
				:error="formError.find(item => item.field === 'first_name')"
				@submit="save"
				@blur="CheckEmptyField(practiceForm.first_name, 'first_name')"
			/>
			<AppInput
				v-model="practiceForm.last_name"
				:type="'text'"
				:name="'last_name'"
				:label="'Last name'"
				:error="formError.find(item => item.field === 'last_name')"
				@submit="save"
				@blur="CheckEmptyField(practiceForm.last_name, 'last_name')"
			/>
			<AppInput
				v-model="practiceForm.suffix"
				:type="'text'"
				:name="'suffix'"
				:label="'Suffix'"
				@submit="save"
			/>
			<AppInput
				v-model="practiceForm.practice_role"
				:type="'select'"
				:name="'practice_role'"
				:label="'Role'"
				:placeholder="'Role...'"
				:items="roles"
			/>
			<div class="text-left mt-5">
				<AppButton :label="'Save changes'" @click="save('practice')" />
			</div>
		</template>
		<template v-if="$auth.user.domain === 'Locum'">
			<AppInput
				v-model="locumForm.email"
				:type="'email'"
				:name="'email'"
				:label="'Email address'"
				:error="formError.find(item => item.field === 'email')"
				@submit="save"
				@blur="CheckEmptyField(locumForm.email, 'email')"
			/>
			<div class="-mt-4 mb-4">
				<template v-if="email_verifiedAt">
					<span
						class="text-xs"
					>E-mail is Verified on {{$moment(email_verifiedAt).format('MMM DD, YYYY | hh:mm A')}}</span>
				</template>
				<template v-else>
					<span class="text-red-500 text-xs">E-mail is not yet verified.</span>
					<span
						class="my-1 p-1 bg-gray-800 rounded text-xs text-white cursor-pointer whitespace-no-wrap"
						@click="resendEmailVerification()"
					>Click here to re-send</span>
				</template>
			</div>
			<AppInput
				v-model="locumForm.title"
				:type="'text'"
				:name="'title'"
				:label="'Title'"
				:error="formError.find(item => item.field === 'title')"
				@submit="save"
			/>
			<AppInput
				v-model="locumForm.first_name"
				:type="'text'"
				:name="'first_name'"
				:label="'First name'"
				:error="formError.find(item => item.field === 'first_name')"
				@submit="save"
				@blur="CheckEmptyField(locumForm.first_name, 'first_name')"
			/>
			<AppInput
				v-model="locumForm.last_name"
				:type="'text'"
				:name="'last_name'"
				:label="'Last name'"
				:error="formError.find(item => item.field === 'last_name')"
				@submit="save"
				@blur="CheckEmptyField(locumForm.last_name, 'last_name')"
			/>
			<AppInput
				v-model="locumForm.suffix"
				:type="'text'"
				:name="'suffix'"
				:label="'Suffix'"
				@submit="save"
			/>
			<AppInput
				v-model="locumForm.gender"
				:type="'select'"
				:name="'gender'"
				:label="'Gender'"
				:error="formError.find(item => item.field === 'gender')"
				:items="[{ label: 'Male', value: 'Male'}, { label: 'Female', value: 'Female' }]"
				@blur="CheckEmptyField(locumForm.gender, 'gender')"
			/>
			<AppInput
				v-model="locumForm.mobile_number"
				:type="'text'"
				:name="'mobile_number'"
				:label="'Mobile Number'"
				:error="formError.find(item => item.field === 'mobile_number')"
				@submit="save"
				@blur="CheckEmptyField(locumForm.mobile_number, 'mobile_number')"
			/>
			<AppInput
				v-model="locumForm.home_number"
				:type="'text'"
				:name="'home_number'"
				:label="'Home Number'"
				@submit="save"
			/>
			<AppInput
				v-model="locumForm.work_number"
				:type="'text'"
				:name="'work_number'"
				:label="'Work Number'"
				@submit="save"
			/>
			<div class="rounded-lg bg-gray-400 p-4 md:p-8 my-2">
				<AppPostCode
					v-model="locumForm.post_code"
					:name="'post_code'"
					:label="'Post code'"
					:error="formError.find(item => item.field === 'post_code')"
					:inStyle="'background-color:#dae1e7;border-color:white'"
					@blur="CheckEmptyField(locumForm.post_code, 'post_code')"
				/>
				<AppInput
					v-model="locumForm.address_line_1"
					:type="'text'"
					:name="'address_line_1'"
					:label="'Address line 1'"
					:error="formError.find(item => item.field === 'address_line_1')"
					:inStyle="'background-color:#dae1e7;border-color:white;padding:16px 8px;'"
					@submit="save"
					@blur="CheckEmptyField(locumForm.address_line_1, 'address_line_1')"
				/>
				<AppInput
					v-model="locumForm.address_line_2"
					:type="'text'"
					:name="'address_line_2'"
					:label="'Address line 2 (optional)'"
					:inStyle="'background-color:#dae1e7;border-color:white;padding:16px 8px;'"
					@submit="save"
				/>
				<AppInput
					v-model="locumForm.address_line_3"
					:type="'text'"
					:name="'address_line_3'"
					:label="'City / Town / District'"
					:error="formError.find(item => item.field === 'address_line_3')"
					:inStyle="'background-color:#dae1e7;border-color:white;padding:16px 8px;'"
					@submit="save"
					@blur="CheckEmptyField(locumForm.address_line_3, 'address_line_3')"
				/>
			</div>
			<div class="text-left mt-5">
				<AppButton :label="'Save changes'" @click="save('locum')" />
			</div>
		</template>
	</div>
</template>
<script>
import AppInput from "@/components/Base/AppInput";
import AppButton from "@/components/Base/AppButton";
import AppLoading from "@/components/Base/AppLoading";
import AppFormError from "@/components/Base/AppFormError";
import AppPostCode from "@/components/Base/AppPostCode";
const roles = [
	{ value: "Practice Staff", label: "Practice Staff" },
	{ value: "Practice Manager", label: "Practice Manager" },
	{ value: "Partner", label: "Partner" }
];
export default {
	transition: {
		name: "fade",
		mode: "out-in"
	},
	components: {
		AppInput,
		AppButton,
		AppLoading,
		AppFormError,
		AppPostCode
	},
	data() {
		return {
			loading: false,
			formError: [],
			email_verifiedAt: "",
			roles,

			practiceForm: {
				email: "",
				title: "",
				first_name: "",
				last_name: "",
				suffix: "",
				practice_role: ""
			},

			locumForm: {
				email: "",
				title: "",
				first_name: "",
				last_name: "",
				suffix: "",
				gender: "",
				mobile_number: "",
				home_number: "",
				work_number: "",
				post_code: "",
				address_line_1: "",
				address_line_2: "",
				address_line_3: ""
			}
		};
	},
	async asyncData({ app, error }) {
		try {
			const response = await app.$axios.$get("/api/v1/me");
			const user =
				response.data && response.data && response.data.user
					? response.data.user
					: null;
			return {
				user
			};
		} catch (err) {
			throw err;
		}
	},
	mounted() {
		if (this.$auth.user.domain === "Practice") {
			this.practiceForm.email = this.user.email;
			this.practiceForm.title = this.user.personal_detail.title;
			this.practiceForm.first_name = this.user.personal_detail.first_name;
			this.practiceForm.last_name = this.user.personal_detail.last_name;
			this.practiceForm.suffix = this.user.personal_detail.suffix;
			this.practiceForm.practice_role = this.user.practice_detail.practice_role;
			this.email_verifiedAt = this.user.email_verified_at;
		}

		if (this.$auth.user.domain === "Locum") {
			this.locumForm.email = this.user.email;
			this.locumForm.title = this.user.personal_detail.title;
			this.locumForm.first_name = this.user.personal_detail.first_name;
			this.locumForm.last_name = this.user.personal_detail.last_name;
			this.locumForm.suffix = this.user.personal_detail.suffix;
			this.locumForm.gender = this.user.personal_detail.gender;
			this.locumForm.mobile_number = this.user.contact_detail.mobile_number;
			this.locumForm.home_number = this.user.contact_detail.home_number;
			this.locumForm.work_number = this.user.contact_detail.work_number;
			this.locumForm.address_line_1 = this.user.address_detail.address.line_1;
			this.locumForm.address_line_2 = this.user.address_detail.address.line_2;
			this.locumForm.address_line_3 = this.user.address_detail.address.line_3;
			this.locumForm.post_code = this.user.address_detail.address.post_code;
			this.email_verifiedAt = this.user.email_verified_at;
		}

		this.$socket.on(
			"User Notification Email Pending",
			this.getEmailVerificationRealTime
		);
		this.$socket.on(
			"User Notification Email Verified",
			this.getEmailVerificationRealTime
		);
	},
	destroyed() {
		this.removeListener();
	},
	methods: {
		async getEmailVerificationRealTime() {
			await this.$auth.fetchUser();
			this.email_verifiedAt = this.$auth.user.email_verified_at;
		},
		removeListener() {
			this.$socket.removeListener(
				"User Notification Email Pending",
				this.getEmailVerificationRealTime
			);
			this.$socket.removeListener(
				"User Notification Email Verified",
				this.getEmailVerificationRealTime
			);
		},
		resendEmailVerification() {
			this.$axios
				.$post(`/api/v1/email-verification/resend`)
				.then(res => {
					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "success",
						text: [`${res.message}`]
					});
				})
				.catch(err => {
					console.log("err", err.response || err);
					if (err.response.data.message) {
						this.$store.commit("SET_NOTIFICATION", {
							enabled: true,
							status: "danger",
							text: [`${err.response.data.message}`]
						});
						throw err;
					}
				});
		},
		save(domain) {
			if (domain === "practice") {
				this.formError = [];
				this.Validate(this.practiceForm, ["title", "suffix"]);
				if (!this.formError.length) {
					this.loading = true;
					this.$axios
						.$put(`/api/v1/practice/me/account`, this.practiceForm)
						.then(res => {
							this.$store.commit("SET_NOTIFICATION", {
								enabled: true,
								status: "success",
								text: ["Saved"]
							});
						})
						.catch(err => {
							console.log("err", err.response || err);
							if (err.response.data.message) {
								this.$store.commit("SET_NOTIFICATION", {
									enabled: true,
									status: "danger",
									text: [`${err.response.data.message}`]
								});
							}
							if (err.response.data.error_messages) {
								err.response.data.error_messages.forEach(error => {
									this.formError.push(error);
								});
							}
						})
						.finally(() => {
							this.scrollToTop();
							this.loading = false;
						});
				} else {
					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "danger",
						text: ["Please fill up all the forms"]
					});
					this.scrollToTop();
				}
			}

			if (domain === "locum") {
				this.formError = [];
				this.Validate(this.locumForm, [
					"title",
					"suffix",
					"home_number",
					"work_number",
					"address_line_2"
				]);
				if (!this.formError.length) {
					this.loading = true;
					this.$axios
						.$put(`/api/v1/locum/me/account`, this.locumForm)
						.then(res => {
							this.$store.commit("SET_NOTIFICATION", {
								enabled: true,
								status: "success",
								text: ["Saved"]
							});
							this.CheckUserVerification();
						})
						.catch(err => {
							console.log("err", err.response || err);
							if (err.response.data.message) {
								this.$store.commit("SET_NOTIFICATION", {
									enabled: true,
									status: "danger",
									text: [`${err.response.data.message}`]
								});
							}
							if (err.response.data.error_messages) {
								err.response.data.error_messages.forEach(error => {
									this.formError.push(error);
								});
							}
						})
						.finally(() => {
							this.scrollToTop();
							this.loading = false;
						});
				} else {
					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "danger",
						text: ["Please fill up all the forms"]
					});
					this.scrollToTop();
				}
			}
		}
	}
};
</script>
