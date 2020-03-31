<template>
	<div class="flex flex-col items-center justify-center w-full">
		<div class="flex w-full justify-center xl:justify-start">
			<div class="flex md:mx-4" style="flex: 0 1 600px;">
				<h3>Finally,</h3>
			</div>
		</div>

		<div class="flex w-full justify-center xl:justify-start">
			<div class="md:mx-4 flex flex-col p-4 md:p-8 m-1 rounded-lg shadow-lg" style="flex: 0 1 600px;">
				<form class="relative w-full">
					<AppLoading :loading="loading" spinner />
					<div
						v-for="(item, index) in form.mandatory_locum_compliance_documents"
						:key="item.compliance_document_id"
						class="flex justify-between text-sm"
						:class="[item.compliance_document_type_name !== 'Visa' || (item.compliance_document_type_name === 'Visa' && visa_countries.includes(country_id)) ? `py-2 ${index !== 0 ? 'border-t' : ''}` : '', item.child_compliance_documents && item.child_compliance_documents.length ? 'flex-col' : 'items-center ']"
					>
						<template
							v-if="item.compliance_document_type_name !== 'Visa' || (item.compliance_document_type_name === 'Visa' && visa_countries.includes(country_id))"
						>
							<div
								:class="item.child_compliance_documents && item.child_compliance_documents.length ? 'pb-2' : ''"
							>
								<p>
									{{item.compliance_document_name}}
									<span v-if="item.required" class="text-red-500">*</span>
								</p>
								<p v-if="item.file" class="text-xs">{{ item.file.name}}</p>
								<p
									class="text-xs"
									v-if="item.child_compliance_documents && item.child_compliance_documents.length"
								>Upload at least one (1)</p>
								<template
									v-if="formError.find(err => err.field === item.compliance_document_name.replace(/ /g, '_').toLowerCase())"
								>
									<p
										class="text-xs text-red-500"
									>{{ formError.find(err => err.field === item.compliance_document_name.replace(/ /g, "_").toLowerCase()).message }}</p>
								</template>
							</div>

							<div
								v-if="item.compliance_document_type_name !== 'Safeguarding'"
								class="flex flex-row flex-no-wrap justify-center items-center bg-yellow-500 hover:bg-yellow-400 px-4 py-2 rounded-lg cursor-pointer"
								@click="uploadCompliance(item)"
							>
								<span class="hidden md:block">Upload</span>
								<span class="block md:hidden">
									<svgicon class="fill-current" name="cloud-upload" width="20" height="20" />
								</span>
							</div>
						</template>
					</div>

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
								id="privacy_policy"
								v-model="form.privacy_policy"
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
								v-if="formError.find(item => item.field === 'privacy_policy')"
								class="py-1 text-xs text-red-500"
							>{{ formError.find(item => item.field === 'privacy_policy').message.charAt(0).toUpperCase() + formError.find(item => item.field === 'privacy_policy').message.slice(1).replace(/_/g, " ") }}</div>
						</transition>
					</div>
				</form>
			</div>
		</div>

		<div class="flex justify-center mt-4">
			<AppButton
				:label="'<<'"
				@click="$store.commit('sign-up/SET_ACTIVE_COMPONENT', 'LocumStage2pt1'), $store.commit('sign-up/SET_STAGE_2_PT_2_DETAILS', form)"
				:disabled="loading"
			/>
			<div class="mx-2" />
			<AppButton
				:label="!loading ? 'Sign Up' : 'Signing Up...'"
				:inStyle="'padding:6px 16px;'"
				@click="signup"
				:disabled="loading"
			/>
		</div>

		<div
			v-if="modal || complianceModal"
			class="shield"
			@click="complianceModal ? complianceModal=false : modal=false"
		/>
		<transition name="slide" mode="out-in">
			<div v-if="modal" class="py-8 modal-container">
				<div class="px-4 lg:px-10 pb-4">
					<svgicon
						name="left-arrow"
						height="32"
						width="32"
						class="cursor-pointer"
						@click="modal = false"
					/>
				</div>
				<TermsAndConditions />
			</div>
		</transition>
		<transition name="fade" mode="out-in">
			<div v-if="complianceModal" class="flex justify-center upload-modal">
				<div class="relative border-solid rounded-lg bg-white p-4 shadow-lg w-4/5 md:w-2/5 xl:w-1/4">
					<div class="flex flex-col justify-center">
						<div class="flex justify-end font-bold cursor-pointer" @click="complianceModal = false">X</div>
						<template v-if="selectedComplianceTypeName === 'Passport'">
							<AppInput
								v-model="toUploadCompliance.country_id"
								:type="'select'"
								:name="'country_id'"
								:label="'Country'"
								:placeholder="'Select...'"
								:error="modalError.find(item => item.field === 'country_id')"
								:items="countries"
							/>
						</template>
						<template v-if="selectedComplianceTypeName === 'DBS'">
							<AppInput
								v-model="toUploadCompliance.has_reference"
								:type="'single-checkbox'"
								:name="'has_reference'"
								:label="'Has Reference'"
								:error="modalError.find(item => item.field === 'has_reference')"
							/>
						</template>
						<template
							v-if="selectedComplianceTypeName === 'Reference' || toUploadCompliance.has_reference"
						>
							<AppInput
								v-model="toUploadCompliance.reference"
								:type="'textarea'"
								:name="'reference'"
								:label="'Reference'"
								:error="modalError.find(item => item.field === 'reference')"
								:limit="255"
								:resize="false"
								:rows="3"
								@blur="modalError.find(item => item.field === 'reference')"
							/>
						</template>
						<div
							class="hover:underline flex flex-row flex-no-wrap justify-center items-center bg-yellow-500 px-4 py-2 rounded"
							:class="toUploadCompliance.has_reference ? '-mt-6' : 'mt-2'"
						>
							<input
								id="file"
								type="file"
								name="file"
								class="inputfile hidden"
								@input="onFileInput($event)"
								@click.stop
							/>
							<svgicon name="cloud-upload" height="24" width="24" />
							<label for="file" class="leading-loose mx-2 cursor-pointer">Upload</label>
						</div>
						<div v-if="toUploadCompliance.file" class="w-full text-center break-words">
							<small>Uploaded file: {{ toUploadCompliance.file.name }}</small>
						</div>
						<transition name="drop-down">
							<div
								v-if="modalError.find(item => item.field === 'file')"
								class="text-red-500 py-1 text-xs text-white"
							>{{ modalError.find(item => item.field === 'file').message.charAt(0).toUpperCase() + modalError.find(item => item.field === 'file').message.slice(1).replace(/_/g, " ") }}</div>
						</transition>
						<AppButton
							class="mt-8"
							:label="'Save'"
							:inStyle="'padding:5px 14px;'"
							@click="upload(toUploadCompliance)"
						/>
					</div>
				</div>
			</div>
		</transition>
	</div>
</template>
<script>
import AppInput from "@/components/Base/AppInput";
import AppButton from "@/components/Base/AppButton";
import AppLoading from "@/components/Base/AppLoading";
import TermsAndConditions from "@/components/TermsAndConditions";
export default {
	components: {
		AppInput,
		AppButton,
		AppLoading,
		TermsAndConditions
	},
	data() {
		return {
			form: {
				privacy_policy: false,
				referral_code: null,
				mandatory_locum_compliance_documents: []
			},
			country_id: "",
			visa_countries: [],
			has_referral: false,
			formError: [],
			modalError: [],
			modal: false,
			complianceModal: false,
			selectedComplianceTypeName: "",
			countries: [],
			toUploadCompliance: null
		};
	},
	computed: {
		stage1details() {
			return this.$store.getters["sign-up/stage1Details"];
		},
		stage2details() {
			return this.$store.getters["sign-up/stage2pt2Details"];
		},
		mandatoryComplianceDocuments() {
			return this.$store.getters["sign-up/getMandatoryComplianceDocuments"];
		},
		loading() {
			return this.$store.getters["sign-up/signUpLoading"];
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
		},
		country_id(value) {
			let visa = this.form.mandatory_locum_compliance_documents.find(
				item => item.compliance_document_type_name === "Visa"
			);
			console.log(this.visa_countries);
			if (this.visa_countries.includes(value)) {
				visa.required = true;
			} else {
				visa.required = false;
				visa.file = null;
			}
		}
	},
	mounted() {
		let requiredMandatory = ["Passport", "CV", "DBS Certificate"];
		this.mandatoryComplianceDocuments.forEach(item => {
			let existing =
				this.stage2details &&
				this.stage2details.mandatory_locum_compliance_documents.length
					? this.stage2details.mandatory_locum_compliance_documents.find(
							mandatory =>
								mandatory.compliance_document_id === item.compliance_document_id
					  )
						? this.stage2details.mandatory_locum_compliance_documents.find(
								mandatory =>
									mandatory.compliance_document_id ===
									item.compliance_document_id
						  )
						: ""
					: "";
			if (item.compliance_document_type_name === "DBS") {
				this.form.mandatory_locum_compliance_documents.push({
					compliance_document_id: item.compliance_document_id,
					child_compliance_documents: item.child_compliance_documents,
					compliance_document_countries: item.compliance_document_countries,
					compliance_document_name: item.compliance_document_name,
					compliance_document_type_name: item.compliance_document_type_name,
					file: existing && existing.file ? existing.file : null,
					has_reference:
						existing && existing.has_reference ? existing.has_reference : false,
					reference: existing && existing.reference ? existing.reference : "",
					required: true
				});
			} else if (item.compliance_document_type_name === "Passport") {
				this.country_id = parseInt(existing.country_id);
				this.form.mandatory_locum_compliance_documents.push({
					compliance_document_id: item.compliance_document_id,
					child_compliance_documents: item.child_compliance_documents,
					compliance_document_countries: item.compliance_document_countries,
					compliance_document_name: item.compliance_document_name,
					compliance_document_type_name: item.compliance_document_type_name,
					file: existing && existing.file ? existing.file : null,
					country_id:
						existing && existing.country_id ? existing.country_id : null,
					required: true
				});
			} else {
				this.form.mandatory_locum_compliance_documents.push({
					compliance_document_id: item.compliance_document_id,
					child_compliance_documents: item.child_compliance_documents,
					compliance_document_countries: item.compliance_document_countries,
					compliance_document_name: item.compliance_document_name,
					compliance_document_type_name: item.compliance_document_type_name,
					file: existing && existing.file ? existing.file : null,
					required: requiredMandatory.includes(item.compliance_document_name)
						? true
						: this.stage1details.view_locum_jobs &&
						  this.stage1details.view_permanent_jobs
						? true
						: false
				});
			}
			if (
				item.child_compliance_documents &&
				item.child_compliance_documents.length
			) {
				item.child_compliance_documents.forEach(child => {
					let existingChild =
						this.stage2details &&
						this.stage2details.mandatory_locum_compliance_documents.length
							? this.stage2details.mandatory_locum_compliance_documents.find(
									mandatory =>
										mandatory.compliance_document_id ===
										child.compliance_document_id
							  )
								? this.stage2details.mandatory_locum_compliance_documents.find(
										mandatory =>
											mandatory.compliance_document_id ===
											child.compliance_document_id
								  )
								: ""
							: "";
					this.form.mandatory_locum_compliance_documents.push({
						compliance_document_id: child.compliance_document_id,
						compliance_document_name: child.compliance_document_name,
						compliance_document_type_name: child.compliance_document_type_name,
						file:
							existingChild && existingChild.file ? existingChild.file : null,
						parent: "Safeguarding",
						required: false
					});
				});
			}
			if (item.compliance_document_type_name === "Visa") {
				item.compliance_document_countries.forEach(country => {
					this.visa_countries.push(country.id);
				});
			}
		});
		this.$axios
			.$get(`/api/v1/countries`, {
				params: {
					limit: 9999
				}
			})
			.then(res => {
				res.data.countries.forEach(item =>
					this.countries.push({ label: item.name, value: item.id })
				);
			});
		this.has_referral = this.referral_code ? true : false;
		this.form.privacy_policy = this.stage2details.privacy_policy;
		this.form.referral_code = this.stage2details.referral_code;
	},
	methods: {
		uploadCompliance(item) {
			this.selectedComplianceTypeName = item.compliance_document_type_name;
			this.toUploadCompliance = item;
			this.complianceModal = true;
		},
		upload(compliance) {
			let index;
			let formErrorIndex;
			if (compliance.compliance_document_type_name === "Passport") {
				if (!compliance.country_id) {
					this.modalError.push({
						field: "country_id",
						message: "Country is required."
					});
				} else {
					index = this.modalError.findIndex(err => err.field === "country_id");
					if (index > -1) {
						this.modalError.splice(index, 1);
					}
				}
				if (compliance.country_id) {
					this.country_id = parseInt(compliance.country_id);
				}
			} else if (compliance.compliance_document_type_name === "DBS") {
				if (compliance.has_reference && !compliance.reference) {
					this.modalError.push({
						field: "reference",
						message: "Reference is required."
					});
				} else {
					index = this.modalError.findIndex(err => err.field === "reference");
					if (index > -1) {
						this.modalError.splice(index, 1);
					}
				}
			}

			if (compliance.required && !compliance.file) {
				this.modalError.push({ field: "file", message: "File is required." });
			} else {
				index = this.modalError.findIndex(err => err.field === "file");
				if (index > -1) {
					this.modalError.splice(index, 1);
				}
			}
			formErrorIndex = this.formError.findIndex(
				err =>
					err.field ===
					compliance.compliance_document_name.replace(/ /g, "_").toLowerCase()
			);
			if (formErrorIndex > -1) {
				this.formError.splice(formErrorIndex, 1);
			}
			if (!this.modalError.length) {
				this.complianceModal = false;
			}
		},
		onFileInput(e) {
			if (!e.target.files.length) {
				return;
			}
			let types = [
				"pdf",
				"jpeg",
				"msword",
				"tiff",
				"vnd.openxmlformats-officedocument.wordprocessingml.document",
				"vnd.openxmlformats-officedocument.wordprocessingml.template",
				"vnd.ms-word.document.macroEnabled.12",
				"vnd.ms-word.template.macroEnabled.12"
			];
			let file = e.target.files[0];
			let fileType = file.type.split("/")[1];
			if (!types.includes(fileType)) {
				this.$store.commit("SET_NOTIFICATION", {
					enabled: true,
					status: "alert",
					text: ["Invalid File Format"]
				});
				return;
			}
			this.toUploadCompliance.file = file;
		},
		signup() {
			this.formError = [];
			let notRequired = [];
			if ([false, "false"].includes(this.has_referral)) {
				notRequired.push("referral_code");
				this.form.referral_code = null;
			}
			this.form.mandatory_locum_compliance_documents.forEach(item => {
				if (item.compliance_document_type_name !== "Safeguarding") {
					if (item.required && !item.file) {
						this.formError.push({
							field: item.compliance_document_name
								.replace(/ /g, "_")
								.toLowerCase(),
							message: `${item.compliance_document_name} is required.`
						});
					}
					if (item.compliance_document_type_name === "Passport") {
						if (!item.country_id) {
							this.formError.push({
								field: "passport",
								message: `Country is required.`
							});
						}
					}
				} else {
					if (item.required) {
						let safeguardingChild = this.form.mandatory_locum_compliance_documents.filter(
							item => item.parent === "Safeguarding"
						);
						let safeguardingChildFiles = safeguardingChild.map(item =>
							item.file ? true : false
						);

						if (!safeguardingChildFiles.includes(true)) {
							this.formError.push({
								field: item.compliance_document_name
									.replace(/ /g, "_")
									.toLowerCase(),
								message: `Must at least upload one (1) Safeguarding File.`
							});
						}
					}
				}
			});
			console.log(this.formError);
			this.Validate(this.form, notRequired);
			if (!this.formError.length) {
				this.$store.commit("sign-up/SET_STAGE_2_PT_2_DETAILS", this.form);
				this.$store.commit("sign-up/SET_STAGE_2_PT_2_FORM_ERROR", []);
				this.$store.commit("sign-up/SET_SIGNUP_LOADING", true);
				setTimeout(() => {
					this.$store.dispatch("sign-up/registerLocum");
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