<template>
	<div class="flex flex-col items-center justify-center w-full">
		<div class="flex w-full justify-center xl:justify-start">
			<div class="flex md:m-4" style="flex: 0 1 600px;">
				<h4>Your Professional details</h4>
			</div>
		</div>

		<div class="flex w-full justify-center xl:justify-start">
			<div class="md:mx-4 flex flex-col p-4 md:p-8 m-1 rounded-lg shadow-lg" style="flex: 0 1 600px;">
				<form class="w-full">
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
					<template v-if="form.profession_id">
						<AppInput
							v-model="form.gmc_or_nmc_number"
							:type="'text'"
							:name="'gmc_or_nmc_number'"
							:label="'Your GMC / NMC Number'"
							:placeholder="'GMC / NMC Number'"
							:error="formError.find(item => item.field === 'gmc_or_nmc_number')"
							:info="'For compliance; to be verified by the hubzz team'"
							required
							@blur="CheckEmptyField(form.gmc_or_nmc_number, 'gmc_or_nmc_number')"
							@keydown="inputNumberOnly($event)"
						/>

						<AppInput
							v-model="form.mpl_or_npl_number"
							:type="'text'"
							:name="'mpl_or_npl_number'"
							:label="'Your MPL / NPL Number'"
							:placeholder="'MPL / NPL Number'"
							:error="formError.find(item => item.field === 'mpl_or_npl_number')"
							:info="'For compliance; to be verified by the hubzz team'"
							@blur="CheckEmptyField(form.mpl_or_npl_number, 'mpl_or_npl_number')"
							@keydown="inputNumberOnly($event)"
						/>

						<AppInput
							v-model="form.nhs_smart_card_id_number"
							:type="'text'"
							:name="'nhs_smart_card_id_number'"
							:label="'Your NHS Smart Card ID number'"
							:placeholder="'NHS Smart Card ID number'"
							@keydown="inputNumberOnly($event)"
						/>
						<AppFilterSearch
							v-model="form.qualification_id"
							:name="'qualification_id'"
							:label="'Specialty'"
							:placeholder="'Select...'"
							:error="formError.find(item => item.field === 'qualification_id')"
							:info="'Choose at least one qualification'"
							:url="'/api/v1/qualifications'"
							:professionCategoryId="selectedProfession ? selectedProfession.profession_category.id.toString() : null"
							required
							@add="CheckEmptyField(form.qualification_id, 'qualification_id')"
							@remove="CheckEmptyField(form.qualification_id, 'qualification_id')"
						/>
					</template>

					<AppFilterSearch
						v-model="form.clinical_system_id"
						:name="'clinical_system_id'"
						:label="'Clinical systems'"
						:placeholder="'Select...'"
						:error="formError.find(item => item.field === 'clinical_system_id')"
						:info="'Choose at least one IT system'"
						:url="'/api/v1/clinical-systems'"
						required
						@add="CheckEmptyField(form.clinical_system_id, 'clinical_system_id')"
						@remove="CheckEmptyField(form.clinical_system_id, 'clinical_system_id')"
					/>

					<AppFilterSearch
						v-model="form.spoken_language_id"
						:name="'spoken_language_id'"
						:label="'Spoken languages'"
						:placeholder="'Select...'"
						:info="'Choose other languages you can speak'"
						:url="'/api/v1/spoken-languages'"
						:defaultItem="'English'"
					/>

					<div>Select which jobs to view:</div>

					<AppInput
						v-model="form.view_locum_jobs"
						:type="'single-checkbox'"
						:name="'view_locum_jobs'"
						:label="'Permanent / Salaried Roles'"
						:error="formError.find(item => item.field === 'view_locum_jobs')"
					/>

					<AppInput
						v-model="form.view_permanent_jobs"
						:type="'single-checkbox'"
						:name="'view_permanent_jobs'"
						:label="'Hubzz Jobs'"
						:error="formError.find(item => item.field === 'view_permanent_jobs')"
					/>

					<div class="flex flex-col my-8">
						<div class="relative flex flex-row justify-between">
							<label for="rates" class="text-xs sm:text-sm py-1">
								Your preferred rates £
								<small>(minimum)</small>
							</label>
							<div class="rounded-lg bg-gray-300 p-1 text-xs sm:text-sm">To match available jobs with</div>
						</div>
						<div class="flex flex-row flex-wrap justify-between">
							<div class="flex flex-col w-full sm:w-1/3 px-1">
								<!-- <label for="rates" class="text-xs sm:text-sm py-1">Per Hour</label> -->
								<div class="flex flex-row flex-no-wrap">
									<AppInput
										v-model="form.min_rate_per_hour"
										:type="'number'"
										:name="'min_rate_per_hour'"
										:label="'Per Hour £'"
										:error="formError.find(item => item.field === 'min_rate_per_hour')"
										required
										@blur="CheckEmptyField(form.min_rate_per_hour, 'min_rate_per_hour')"
									/>
									<!-- <div class="mx-1"></div> -->
									<!-- <AppInput
                    v-model="form.max_rate_per_hour"
                    :type="'number'"
                    :name="'max_rate_per_hour'"
                    :label="'To £'"
                    :error="formError.find(item => item.field === 'max_rate_per_hour')"
                    @blur="CheckEmptyField(form.max_rate_per_hour, 'max_rate_per_hour')"
                    required
									/>-->
								</div>
							</div>
							<div class="flex flex-col w-full sm:w-1/3 px-1">
								<!-- <label for="rates" class="text-xs sm:text-sm py-1">Minimum Per Half Day Session</label> -->
								<div class="flex flex-row flex-no-wrap">
									<AppInput
										v-model="form.min_rate_per_half_day_session"
										:type="'number'"
										:name="'min_rate_per_half_day_session'"
										:label="'Per Half Day Session £'"
										:error="formError.find(item => item.field === 'min_rate_per_half_day_session')"
										required
										@blur="CheckEmptyField(form.min_rate_per_half_day_session, 'min_rate_per_half_day_session')"
									/>
									<!-- <div class="mx-1"></div>
                  <AppInput
                    v-model="form.max_rate_per_half_day_session"
                    :type="'number'"
                    :name="'max_rate_per_half_day_session'"
                    :label="'To £'"
                    :error="formError.find(item => item.field === 'max_rate_per_half_day_session')"
                    @blur="CheckEmptyField(form.max_rate_per_half_day_session, 'max_rate_per_half_day_session')"
                    required
									/>-->
								</div>
							</div>
							<div class="flex flex-col w-full sm:w-1/3 px-1">
								<!-- <label for="rates" class="text-xs sm:text-sm py-1">Per Whole Day Session</label> -->
								<div class="flex flex-row flex-no-wrap">
									<AppInput
										v-model="form.min_rate_per_whole_day_session"
										:type="'number'"
										:name="'min_rate_per_whole_day_session'"
										:label="'Per Whole Day Session £'"
										:error="formError.find(item => item.field === 'min_rate_per_whole_day_session')"
										required
										@blur="CheckEmptyField(form.min_rate_per_whole_day_session, 'min_rate_per_whole_day_session')"
									/>
									<!-- <div class="mx-1"></div>
                  <AppInput
                    v-model="form.max_rate_per_whole_day_session"
                    :type="'number'"
                    :name="'max_rate_per_whole_day_session'"
                    :label="'To £'"
                    :error="formError.find(item => item.field === 'max_rate_per_whole_day_session')"
                    @blur="CheckEmptyField(form.max_rate_per_whole_day_session, 'max_rate_per_whole_day_session')"
                    required
									/>-->
								</div>
							</div>
						</div>
					</div>

					<AppInput
						v-model="form.practice_type_id"
						:type="'multi-checkbox'"
						:name="'practice_type_id'"
						:label="'What type of practices are you willing to work?'"
						:error="formError.find(item => item.field === 'practice_type_id')"
						:lists="practiceTypes"
						required
						@checked="form.practice_type_id.push(parseInt($event)), CheckEmptyField(form.practice_type_id, 'practice_type_id')"
						@unchecked="form.practice_type_id = form.practice_type_id.filter(id => id !== parseInt($event)), CheckEmptyField(form.practice_type_id, 'practice_type_id')"
					/>

					<AppInput
						v-model="form.mandatory_training_id"
						:type="'multi-checkbox'"
						:name="'mandatory_training_id'"
						:label="'Please select mandatory training courses completed.'"
						:lists="mandatoryTrainings"
						@checked="form.mandatory_training_id.push(parseInt($event)), CheckEmptyField(form.mandatory_training_id, 'mandatory_training_id')"
						@unchecked="form.mandatory_training_id = form.mandatory_training_id.filter(id => id !== parseInt($event)), CheckEmptyField(form.mandatory_training_id, 'mandatory_training_id')"
						@uncheckAll="form.mandatory_training_id = []"
					/>
				</form>
			</div>
		</div>

		<div class="flex justify-center mt-4">
			<AppButton
				:label="'<<'"
				@click="$store.commit('sign-up/SET_ACTIVE_COMPONENT', 'LocumAddressDetails')"
			/>
			<div class="mx-2" />
			<AppButton :label="'Next'" :inStyle="'padding:6px 16px;'" @click="next" />
		</div>
	</div>
</template>
<script>
import AppInput from "@/components/Base/AppInput";
import AppButton from "@/components/Base/AppButton";
import AppFilterSearch from "@/components/Base/AppFilterSearch";
import AppRate from "@/components/Base/AppRate";
import { parse } from "cookie";
export default {
	components: {
		AppInput,
		AppButton,
		AppFilterSearch,
		AppRate
	},
	data() {
		return {
			selectedProfession: null,
			professions_categories: [],
			pratice_types: [],
			form: {
				gmc_or_nmc_number: "",
				mpl_or_npl_number: "",
				nhs_smart_card_id_number: "",
				profession_id: "",
				qualification_id: [],
				clinical_system_id: [],
				spoken_language_id: [],
				min_rate_per_hour: 0,
				max_rate_per_hour: 0,
				min_rate_per_half_day_session: 0,
				max_rate_per_half_day_session: 0,
				min_rate_per_whole_day_session: 0,
				max_rate_per_whole_day_session: 0,
				practice_type_id: [],
				mandatory_training_id: [],
				view_locum_jobs: false,
				view_permanent_jobs: false
			},
			formError: []
		};
	},
	computed: {
		professions() {
			return this.$store.getters["sign-up/getProfessions"];
		},
		gpQualifications() {
			return this.$store.getters["sign-up/getGpQualifications"];
		},
		othersQualifications() {
			return this.$store.getters["sign-up/getOthersQualifications"];
		},
		clinicalSystems() {
			return this.$store.getters["sign-up/getClinicalSystems"];
		},
		spokenLanguages() {
			return this.$store.getters["sign-up/getSpokenLanguages"];
		},
		practiceTypes() {
			return this.$store.getters["sign-up/getPracticeTypes"];
		},
		mandatoryTrainings() {
			return this.$store.getters["sign-up/getMandatoryTrainings"];
		},
		professionalDetails() {
			return this.$store.getters["sign-up/professionalDetails"];
		},
		professionalFormError() {
			return this.$store.getters["sign-up/professionalFormError"];
		}
	},
	watch: {
		"form.profession_id"(newValue, oldValue) {
			if (newValue) {
				if (newValue && oldValue) {
					this.form.qualification_id = [];
				}
				if (
					this.professions_categories &&
					this.professions_categories.length > 0
				) {
					this.selectedProfession = this.professions_categories.find(
						item => item.id == newValue
					);
				}
			}
		}
	},
	async created() {
		const response = await this.$axios.$get(`/api/v1/professions`);
		this.professions_categories =
			response.data &&
			response.data.professions &&
			response.data.professions.length > 0
				? response.data.professions
				: [];
		// console.log(this.professions_categories);
		this.pratice_types = this.practiceTypes;
		// console.log(this.pratice_types);
		this.form.gmc_or_nmc_number = this.professionalDetails.gmc_or_nmc_number;
		this.form.mpl_or_npl_number = this.professionalDetails.mpl_or_npl_number;
		this.form.nhs_smart_card_id_number = this.professionalDetails.nhs_smart_card_id_number;
		this.form.profession_id = this.professionalDetails.profession_id;
		this.form.view_locum_jobs = this.professionalDetails.view_locum_jobs;
		this.form.view_permanent_jobs = this.professionalDetails.view_permanent_jobs;

		// if (this.form.profession_id == 1) {
		//   this.professionalDetails.qualification_id.forEach(qualification => {
		//     this.form.qualification_id.push(
		//       this.gpQualifications.find(item => item.value === qualification.value)
		//     );
		//   });
		// } else if (this.form.profession_id != 1) {
		//   this.professionalDetails.qualification_id.forEach(qualification => {
		//     this.form.qualification_id.push(
		//       this.othersQualifications.find(
		//         item => item.value === qualification.id
		//       )
		//     );
		//   });
		// }
		this.form.qualification_id = [...this.professionalDetails.qualification_id];

		// this.professionalDetails.clinical_system_id.forEach(clinical => {
		//   this.form.clinical_system_id.push(
		//     this.clinicalSystems.find(item => item.value === clinical.value)
		//   );
		// });
		this.form.clinical_system_id = [
			...this.professionalDetails.clinical_system_id
		];

		// this.professionalDetails.spoken_language_id.forEach(spoken => {
		//   this.form.spoken_language_id.push(
		//     this.spokenLanguages.find(item => item.value === spoken.value)
		//   );
		// });
		this.form.spoken_language_id = [
			...this.professionalDetails.spoken_language_id
		];

		this.form.min_rate_per_hour = this.professionalDetails.min_rate_per_hour;
		this.form.max_rate_per_hour = this.professionalDetails.max_rate_per_hour;
		this.form.min_rate_per_half_day_session = this.professionalDetails.min_rate_per_half_day_session;
		this.form.max_rate_per_half_day_session = this.professionalDetails.max_rate_per_half_day_session;
		this.form.min_rate_per_whole_day_session = this.professionalDetails.min_rate_per_whole_day_session;
		this.form.max_rate_per_whole_day_session = this.professionalDetails.max_rate_per_whole_day_session;

		this.form.practice_type_id = [];
		this.professionalDetails.practice_type_id.forEach(id => {
			this.form.practice_type_id.push(id);
		});

		this.form.mandatory_training_id = [];
		this.professionalDetails.mandatory_training_id.forEach(id => {
			this.form.mandatory_training_id.push(id);
		});
		if (this.professionalFormError.length > 0) {
			this.professionalFormError.forEach(item => {
				this.formError.push(item);
			});
		}
	},
	methods: {
		next() {
			this.formError = [];
			this.form.max_rate_per_hour = 999999999;
			this.form.max_rate_per_half_day_session = 999999999;
			this.form.max_rate_per_whole_day_session = 999999999;
			let notRequired = [
				"nhs_smart_card_id_number",
				"spoken_language_id",
				"mandatory_training_id",
				"mpl_or_npl_number"
			];
			if (
				["true", true].includes(this.form.view_locum_jobs) ||
				["true", true].includes(this.form.view_permanent_jobs)
			) {
				notRequired.push("view_locum_jobs", "view_permanent_jobs");
			}
			this.Validate(this.form, notRequired);
			if (!this.formError.length) {
				this.$store.commit("sign-up/SET_PROFESSIONAL_DETAILS", {
					...this.form,
					profession_category_id: this.selectedProfession.profession_category.id
				});
				this.$store.commit("sign-up/SET_PROFESSIONAL_DETAIL_FORM_ERROR", []);

				this.$store.commit(
					"sign-up/SET_ACTIVE_COMPONENT",
					"LocumPayrollDetails"
				);
			}
		}
	}
};
</script>
