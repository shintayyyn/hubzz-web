<template>
	<div class="flex flex-col items-center justify-center w-full">
		<div class="flex w-full justify-center xl:justify-start">
			<div class="flex md:mx-4" style="flex: 0 1 600px;">
				<h3>What's your account details?</h3>
			</div>
		</div>

		<div class="flex w-full justify-center xl:justify-start">
			<div class="md:mx-4 flex flex-col p-4 md:p-8 m-1 rounded-lg shadow-lg" style="flex: 0 1 600px;">
				<form class="w-full">
					<div class="flex justify-between text-sm">
						<div>Select which jobs to view:</div>
						<div class="bg-gray-300 rounded px-2">Must select atleast one</div>
					</div>

					<AppInput
						v-model="form.view_locum_jobs"
						:type="'single-checkbox'"
						:name="'view_locum_jobs'"
						:label="'Hubzz Jobs'"
						:error="formError.find(item => item.field === 'view_locum_jobs')"
					/>

					<AppInput
						v-model="form.view_permanent_jobs"
						:type="'single-checkbox'"
						:name="'view_permanent_jobs'"
						:label="'Permanent / Salaried Roles'"
						:error="formError.find(item => item.field === 'view_permanent_jobs')"
					/>

					<AppInput
						v-model="form.profession_id"
						:type="'select'"
						:name="'profession_id'"
						:label="'Profession'"
						:placeholder="'Select...'"
						:error="formError.find(item => item.field === 'profession_id')"
						:items="professions"
						required
						@blur="CheckEmptyField(form.profession_id, 'profession_id')"
					/>

					<AppInput
						v-model="form.title"
						:type="'text'"
						:name="'title'"
						:label="'Title'"
						:placeholder="'(ex. Mr., Ms., Mrs.)'"
					/>

					<AppInput
						v-model="form.first_name"
						:type="'text'"
						:name="'first_name'"
						:label="'First name'"
						:placeholder="'Your first name'"
						:error="formError.find(error => error.field === 'first_name')"
						required
						@blur="CheckEmptyField(form.first_name, 'first_name')"
					/>

					<AppInput
						v-model="form.last_name"
						:type="'text'"
						:name="'last_name'"
						:label="'Last name'"
						:placeholder="'Your last name'"
						:error="formError.find(error => error.field === 'last_name')"
						required
						@blur="CheckEmptyField(form.last_name, 'last_name')"
					/>
					<AppInput
						v-model="form.suffix"
						:type="'text'"
						:name="'suffix'"
						:label="'Suffix'"
						:placeholder="'(ex. Ph.D., M.D., etc.)'"
					/>

					<AppInput
						v-model="form.email"
						:type="'email'"
						:name="'email'"
						:label="'Email'"
						:info="'If you have an NHS email address, please use this'"
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
				</form>
			</div>
		</div>
		<div class="flex justify-center mt-4">
			<AppButton :label="'Next'" :inStyle="'padding:6px 16px;'" @click="next" />
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
			form: {
				title: "",
				first_name: "",
				last_name: "",
				suffix: "",
				profession_id: "",
				view_permanent_jobs: false,
				view_locum_jobs: false,
				email: "",
				password: "",
				password_confirmation: ""
			},
			formError: [],
			modal: false
		};
	},
	computed: {
		stage1Details() {
			return this.$store.getters["sign-up/stage1Details"];
		},
		stage1FormError() {
			return this.$store.getters["sign-up/stage1DetailsFormError"];
		},
		professions() {
			return this.$store.getters["sign-up/getProfessions"];
		}
	},
	mounted() {
		this.form.title = this.stage1Details.title;
		this.form.first_name = this.stage1Details.first_name;
		this.form.last_name = this.stage1Details.last_name;
		this.form.suffix = this.stage1Details.suffix;
		this.form.profession_id = this.stage1Details.profession_id;
		this.form.view_permanent_jobs = this.stage1Details.view_permanent_jobs;
		this.form.view_locum_jobs = this.stage1Details.view_locum_jobs;
		this.form.email = this.stage1Details.email;
		this.form.password = this.stage1Details.password;
		this.form.password_confirmation = this.stage1Details.password_confirmation;

		if (this.stage1FormError.length > 0) {
			this.stage1FormError.forEach(item => {
				this.formError.push(item);
			});
		}
		this.$axios.$get(`/api/v1/professions`).then(res => {});
	},
	async created() {
		const response = await this.$axios.$get(`/api/v1/professions`);
		this.professions_categories =
			response.data &&
			response.data.professions &&
			response.data.professions.length > 0
				? response.data.professions
				: [];
	},
	methods: {
		next() {
			this.formError = [];
			let notRequired = ["title", "suffix"];
			if ([false, "false"].includes(this.has_referral)) {
				notRequired.push("referral_code");
				this.form.referral_code = null;
			}
			if (
				["true", true].includes(this.form.view_locum_jobs) ||
				["true", true].includes(this.form.view_permanent_jobs)
			) {
				notRequired.push("view_locum_jobs", "view_permanent_jobs");
			}
			this.form.view_locum_jobs =
				this.form.view_locum_jobs === "" ? false : this.form.view_locum_jobs;

			this.form.view_permanent_jobs =
				this.form.view_permanent_jobs === ""
					? false
					: this.form.view_permanent_jobs;
			this.Validate(this.form, notRequired);
			if (!this.formError.length) {
				this.$store.commit("sign-up/SET_STAGE_1_DETAILS", this.form);
				this.$store.commit("sign-up/SET_STAGE_1_FORM_ERROR", []);
				this.$store.commit("sign-up/SET_ACTIVE_COMPONENT", "LocumStage2pt1");
			} else {
				this.$store.commit("sign-up/SET_STAGE_1_FORM_ERROR", this.formError);
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