<template>
	<div class="flex flex-col items-center justify-center w-full">
		<div class="flex w-full justify-center xl:justify-start">
			<div class="flex md:mx-4" style="flex: 0 1 600px;">
				<h3>Finally,</h3>
			</div>
		</div>

		<div class="flex w-full justify-center xl:justify-start">
			<div class="md:mx-4 flex flex-col p-4 md:p-8 m-1 rounded-lg shadow-lg" style="flex: 0 1 600px;">
				<form class="w-full">
					<div class="flex items-center justify-between py-2 text-sm">
						<div class="leading-tight">
							<p>
								Upload passport
								<span class="text-red-500">*</span>
								<span class="text-xs italic">Visa if applicable</span>
							</p>
							<p class="text-xs">filename.doc</p>
						</div>
						<div
							class="flex flex-row flex-no-wrap justify-center items-center bg-yellow-500 hover:bg-yellow-400 px-4 py-2 rounded-lg cursor-pointer"
							@click="uploadCompliance('Passport')"
						>
							<span class="hidden md:block">Upload</span>
							<span class="block md:hidden">
								<svgicon class="fill-current" name="cloud-upload" width="20" height="20" />
							</span>
						</div>
					</div>
					<div class="flex items-center justify-between py-2 text-sm border-t">
						<div>
							<p>
								Upload CV
								<span class="text-red-500">*</span>
							</p>
							<p class="text-xs">filename.doc</p>
						</div>
						<div
							class="flex flex-row flex-no-wrap justify-center items-center bg-yellow-500 hover:bg-yellow-400 px-4 py-2 rounded-lg cursor-pointer"
							@click="uploadCompliance()"
						>
							<span class="hidden md:block">Upload</span>
							<span class="block md:hidden">
								<svgicon class="fill-current" name="cloud-upload" width="20" height="20" />
							</span>
						</div>
					</div>
					<div class="flex items-center justify-between py-2 text-sm border-t">
						<div>
							<p>
								Upload DBS Certificate
								<span class="text-red-500">*</span>
							</p>
							<p class="text-xs">filename.doc</p>
						</div>
						<div
							class="flex flex-row flex-no-wrap justify-center items-center bg-yellow-500 hover:bg-yellow-400 px-4 py-2 rounded-lg cursor-pointer"
							@click="uploadCompliance('DBS')"
						>
							<span class="hidden md:block">Upload</span>
							<span class="block md:hidden">
								<svgicon class="fill-current" name="cloud-upload" width="20" height="20" />
							</span>
						</div>
					</div>
					<template v-if="stage1details.view_permanent_jobs && !stage1details.view_locum_jobs">
						<div class="flex items-center justify-between py-2 text-sm border-t">
							<div>
								<p>Upload Medical Indemnity insurance certificate</p>
								<p class="text-xs">filename.doc</p>
							</div>
							<div
								class="flex flex-row flex-no-wrap justify-center items-center bg-yellow-500 hover:bg-yellow-400 px-4 py-2 rounded-lg cursor-pointer"
								@click="uploadCompliance()"
							>
								<span class="hidden md:block">Upload</span>
								<span class="block md:hidden">
									<svgicon class="fill-current" name="cloud-upload" width="20" height="20" />
								</span>
							</div>
						</div>
						<div class="flex items-center justify-between py-2 text-sm border-t">
							<div>
								<p>Upload Basic Life support certificate</p>
								<p class="text-xs">filename.doc</p>
							</div>
							<div
								class="flex flex-row flex-no-wrap justify-center items-center bg-yellow-500 hover:bg-yellow-400 px-4 py-2 rounded-lg cursor-pointer"
								@click="uploadCompliance()"
							>
								<span class="hidden md:block">Upload</span>
								<span class="block md:hidden">
									<svgicon class="fill-current" name="cloud-upload" width="20" height="20" />
								</span>
							</div>
						</div>
						<div class="flex items-center justify-between py-2 text-sm border-t">
							<p>Safeguarding</p>
							<div
								class="flex flex-row flex-no-wrap justify-center items-center bg-yellow-500 hover:bg-yellow-400 px-4 py-2 rounded-lg cursor-pointer"
								@click="uploadCompliance('Reference')"
							>
								<span class="hidden md:block">Upload</span>
								<span class="block md:hidden">
									<svgicon class="fill-current" name="cloud-upload" width="20" height="20" />
								</span>
							</div>
						</div>
					</template>

					<AppInput
						v-model="has_referral"
						:type="'single-checkbox'"
						:name="'has_referral'"
						:label="'Do you have any referral code with you?'"
					/>

					<template v-if="has_referral">
						<AppInput
							v-model="form.referral_code"
							:type="'text'"
							:name="'referral_code'"
							:label="'Referral Code'"
							:error="formError.find(item => item.field === 'referral_code')"
							required
						/>
					</template>

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
				</form>
			</div>
		</div>

		<div class="flex justify-center mt-4">
			<AppButton
				:label="'<<'"
				@click="$store.commit('sign-up/SET_ACTIVE_COMPONENT', 'LocumStage2pt1')"
			/>
			<div class="mx-2"></div>
			<AppButton :label="'Sign Up'" @click="signup" :inStyle="'padding:6px 16px;'" />
		</div>

		<div
			class="shield"
			v-if="modal || complianceModal"
			@click="complianceModal ? complianceModal=false : modal=false"
		></div>
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
		<transition name="fade" mode="out-in">
			<div class="flex justify-center upload-modal" v-if="complianceModal">
				<div class="relative border-solid rounded-lg bg-white p-4 shadow-lg w-4/5 md:w-2/5 xl:w-1/4">
					<div class="flex flex-col justify-center">
						<div class="flex justify-end font-bold cursor-pointer" @click="complianceModal = false">X</div>
						<template v-if="selectedComplianceTypeName === 'Passport'">
							<AppInput
								v-model="form.country_id"
								:type="'select'"
								:name="'country_id'"
								:label="'Country'"
								:placeholder="'Select...'"
								:error="formError.find(item => item.field === 'country_id')"
								:items="countries"
							/>
						</template>
						<template v-if="selectedComplianceTypeName === 'DBS'">
							<AppInput
								v-model="form.has_reference"
								:type="'single-checkbox'"
								:name="'has_reference'"
								:label="'Has Reference'"
								:error="formError.find(item => item.field === 'has_reference')"
							/>
						</template>
						<template v-if="selectedComplianceTypeName === 'Reference' || form.has_reference">
							<AppInput
								v-model="form.reference"
								:type="'textarea'"
								:name="'reference'"
								:label="'Reference'"
								:error="formError.find(item => item.field === 'reference')"
								@blur="formError.find(item => item.field === 'reference')"
								:limit="255"
								:resize="false"
								:rows="3"
							/>
						</template>
						<div
							class="hover:underline flex flex-row flex-no-wrap justify-center items-center bg-yellow-500 px-4 py-2 rounded cursor-pointer"
							:class="form.has_reference ? '-mt-6' : 'mt-2'"
						>
							<input
								type="file"
								name="file"
								id="file"
								class="inputfile hidden"
								@input="onFileInput($event, form.compliance_document_id)"
								@click.stop
							/>
							<svgicon name="cloud-upload" height="24" width="24" />
							<label for="file" class="leading-loose mx-2 cursor-pointer">Upload</label>
						</div>
						<div class="w-full text-center break-words" v-if="form.file">
							<small>Uploaded file: {{form.file.name}}</small>
						</div>
						<div class="w-full text-center break-words" v-else-if="file">
							<small>file: {{file.filename}}</small>
						</div>
						<transition name="drop-down">
							<div
								v-if="formError.find(item => item.field === 'file')"
								class="text-red-500 py-1 text-xs text-white"
							>{{ formError.find(item => item.field === 'file').message.charAt(0).toUpperCase() + formError.find(item => item.field === 'file').message.slice(1).replace(/_/g, " ") }}</div>
						</transition>
						<AppButton class="mt-8" :label="'Submit'" @click="upload" :inStyle="'padding:5px 14px;'" />
					</div>
				</div>
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
				privacy_policy: false,
				referral_code: null,
				compliance_document_id: "",
				file: null
			},
			has_referral: false,
			formError: [],
			modal: false,
			complianceModal: false,
			selectedComplianceTypeName: ""
		};
	},
	computed: {
		stage1details() {
			return this.$store.getters["sign-up/stage1Details"];
		}
	},
	watch: {
		credentialFormError(value) {
			if (value.length > 0) {
				value.forEach(item => {
					//   this.formError.push(item);
					this.formError.push({
						field:
							item.validation === "confirmed"
								? "password_confirmation"
								: item.field,
						message: item.message,
						validation: item.validation
					});
				});
			}
		},
		"form.privacy_policy"(value) {
			this.CheckEmptyField(this.form.privacy_policy, "privacy_policy");
		}
	},
	mounted() {},
	methods: {
		uploadCompliance(complianceName) {
			this.selectedComplianceTypeName = complianceName;
			this.complianceModal = true;
		},
		upload() {
			this.complianceModal = false;
			console.log(this.form.file);
		},
		signup() {
			this.formError = [];
			let notRequired = [];
			if ([false, "false"].includes(this.has_referral)) {
				notRequired.push("referral_code");
				this.form.referral_code = null;
			}
			this.Validate(this.form, notRequired);
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
.upload-modal {
	position: fixed;
	top: 25%;
	left: 0;
	right: 0;
	height: auto;
	z-index: 601;
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