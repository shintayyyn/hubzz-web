<template>
	<section class="modal-container">
		<div class="p-4 md:p-8">
			<svgicon
				name="left-arrow"
				height="32"
				width="32"
				@click="$router.go(-1)"
				class="cursor-pointer"
			/>
			<div class="flex justify-start font-bold text-sm sm:text-xl mt-8">Create a permanent job</div>
			<div class="flex flex-col md:flex-row pb-4">
				<div class="md:w-1/2 px-2">
					<h4 class="font-bold pt-4">Practice</h4>
					<div class="bg-white rounded-lg shadow-lg px-4 py-4">
						<AppInput
							v-model="form.practice_id"
							:type="'select'"
							:name="'practice_id'"
							:placeholder="'Select...'"
							:error="formError.find(item => item.field === 'practice_id')"
							:items="practice_lists"
							@blur="CheckEmptyField(form.practice_id, 'practice_id')"
						/>
					</div>
					<h4 class="font-bold pt-4">Criteria</h4>
					<div class="bg-white rounded-lg shadow-lg px-4 py-4">
						<AppInput
							v-model="form.profession_id"
							:type="'select'"
							:name="'profession_id'"
							:label="'Role'"
							:placeholder="'Select...'"
							:error="formError.find(item => item.field === 'profession_id')"
							:items="professions"
							@blur="CheckEmptyField(form.profession_id, 'profession_id')"
						/>
						<!-- <template v-if="form.profession_id">
							<AppFilterSearch
								v-model="form.qualification_id"
								:name="'qualification_id'"
								:label="'Specialty'"
								:placeholder="'Select...'"
								:error="formError.find(item => item.field === 'qualification_id')"
								:info="'Choose at least one qualification'"
								:url="'/api/v1/qualifications'"
								:professionCategoryId="selectedProfession.profession_category.id.toString()"
							/>

							<AppFilterSearch
								v-model="form.clinical_system_id"
								:name="'clinical_system_id'"
								:label="'Clinical systems'"
								:placeholder="'Select...'"
								:error="formError.find(item => item.field === 'clinical_system_id')"
								:info="'Choose at least one IT system'"
								:url="'/api/v1/clinical-systems'"
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
							
						<template v-if="form.profession_id">
							<div class="relative flex flex-col pt-2">
								<div class>Compliance documents</div>
							</div>
							<AppInput
								v-if="compliances.length > 0"
								v-model="form.compliance_document_id"
								:type="'multi-checkbox'"
								:error="formError.find(item => item.field === 'compliance_document_id')"
								@checked="form.compliance_document_id.push($event)"
								@unchecked="form.compliance_document_id.splice(form.compliance_document_id.findIndex(item => item === $event), 1)"
								:name="'compliance_document_id'"
								:label="`${selectedProfession.profession_category.id === 1 ? 'For GPs:' : selectedProfession.profession_category.id === 2 ? 'For Nurses, et al:' : ''}`"
								:placeholder="''"
								:lists="compliances"
							/>
							<div class="mb-6 text-center md:text-left mt-2" v-if="compliances.length === 0">
								<AppButton :label="'Go to Profile to add items here'" @click="goToProfile" />
							</div>
							</template>
						</template>-->
					</div>
					<div class="bg-white rounded-lg shadow-lg px-4 py-4 mt-4">
						<!-- <AppInput
							v-model="form.parent_practice_id"
							:type="'select'"
							:name="'parent_practice_id'"
							:label="'Parent Practice ID'"
							:placeholder="'Select...'"
							:error="formError.find(item => item.field === 'parent_practice_id')"
							:items="practice_lists"
							@blur="CheckEmptyField(form.parent_practice_id, 'parent_practice_id')"
						/>-->
						<!-- <AppInput
							v-model="form.appointed_to_locum"
							:type="'text'"
							:name="'appointed_to_locum'"
							:label="'Appointed to Locum'"
							:error="formError.find(item => item.field === 'appointed_to_locum')"
							@blur="CheckEmptyField(form.appointed_to_locum, 'appointed_to_locum')"
						/>-->
						<AppDate v-model="form.date_posted" :name="'date_posted'" :label="'Date Posted'" isAfter />
						<AppDate
							v-model="form.date_closing"
							:name="'date_closing'"
							:label="'Date Closing'"
							isAfter
							:startDate="form.date_posted"
						/>
					</div>
				</div>
				<div class="md:w-1/2 px-2">
					<h4 class="font-bold pt-4">Overview</h4>
					<div class="bg-white rounded-lg shadow-lg px-4 py-4">
						<!-- <AppInput
							v-model="form.parent_practice_id"
							:type="'select'"
							:name="'parent_practice_id'"
							:label="'Parent Practice'"
							:placeholder="'Select...'"
							:error="formError.find(item => item.field === 'parent_practice_id')"
							:items="practice_lists"
							@blur="CheckEmptyField(form.parent_practice_id, 'parent_practice_id')"
						/>-->
						<AppInput
							v-model="form.title"
							:type="'text'"
							:name="'title'"
							:label="'Title'"
							:error="formError.find(item => item.field === 'title')"
						/>
						<p class="text-sm">Description</p>
						<no-ssr placeholder="Loading...">
							<quill-editor
								class="bg-white text-black border-b-2 mb-3 md:mb-6"
								ref="myTextEditor"
								v-model="form.description"
								:options="editorOption"
								@blur="CheckEmptyField(form.description, 'description')"
								@focus="onEditorFocus($event)"
								@ready="onEditorReady($event)"
							></quill-editor>
						</no-ssr>
						<AppInput
							v-model="form.report_to"
							:type="'text'"
							:name="'report_to'"
							:label="'Report to'"
							:error="formError.find(item => item.field === 'report_to')"
						/>
						<AppInput
							v-model="form.email"
							:type="'email'"
							:name="'email'"
							:label="'Email'"
							:error="formError.find(item => item.field === 'email')"
						/>
						<AppInput
							v-model="form.industry_type"
							:type="'select'"
							:name="'industry_type'"
							:placeholder="'Select...'"
							:label="'Industry Type'"
							:error="formError.find(item => item.field === 'industry_type')"
							:items="industry_types"
							@blur="CheckEmptyField(form.practice_id, 'industry_type')"
						/>
						<AppInput
							v-model="form.work_hours"
							:type="'select'"
							:name="'work_hours'"
							:placeholder="'Select...'"
							:label="'Work Hours'"
							:error="formError.find(item => item.field === 'work_hours')"
							:items="work_hours_type"
							@blur="CheckEmptyField(form.practice_id, 'work_hours')"
						/>
						<!-- <div class="flex items-center z-50 relative justify-between">
							<p class="text-sm py-2 mb-2">{{ salary_range ? 'Salary Range' : 'Salary' }}</p>
							<AppInput
								v-model="salary_range"
								:type="'single-checkbox'"
								:name="'salary_amount'"
								:label="'Range'"
							/>
						</div>-->
						<div class="flex flex-wrap -mt-8">
							<AppInput
								:class="salary_range ? 'w-full md:w-1/2 pr-1' : 'w-full'"
								v-model="form.salary_amount"
								:type="'number'"
								:name="'salary_amount'"
								:label="'Salary Amount'"
								:error="formError.find(item => item.field === 'salary_amount')"
							/>
							<!-- <AppInput
								v-if="salary_range"
								class="w-full md:w-1/2 pl-1"
								v-model="form.salary_amount"
								:type="'number'"
								:name="'salary_amount'"
								:error="salary_range && formError.find(item => item.field === 'salary_amount')"
							/>-->
						</div>
						<div class="flex flex-wrap">
							<AppInput
								class="w-full md:w-1/2 pr-1"
								v-model="form.salary_description_1"
								:type="'select'"
								:name="'salary_description_1'"
								:placeholder="'Select...'"
								:label="'Salary Description 1'"
								:error="formError.find(item => item.field === 'salary_description_1')"
								:items="salary_description_type_1"
								@blur="CheckEmptyField(form.salary_description_2, 'salary_description_1')"
							/>
							<AppInput
								class="w-full md:w-1/2 pl-1"
								v-model="form.salary_description_2"
								:type="'select'"
								:name="'salary_description_2'"
								:placeholder="'Select...'"
								:label="'Salary Description 2'"
								:error="formError.find(item => item.field === 'salary_description_2')"
								:items="salary_description_type_2"
								@blur="CheckEmptyField(form.salary_description_2, 'salary_description_2')"
							/>
						</div>
						<!-- <AppInput
							v-model="form.practice_rate"
							:type="'number'"
							:name="'practice_rate'"
							:label="'Practice Rate'"
							:error="formError.find(item => item.field === 'practice_rate')"
						/>-->
					</div>
				</div>
			</div>
			<div class="flex">
				<AppButton :label="'Create'" class="ml-auto mr-2" @click="createPermanentJob()" />
			</div>
		</div>
	</section>
</template>
<script>
import AppInput from "@/components/Base/AppInput";
import AppButton from "@/components/Base/AppButton";
import AppFilterSearch from "@/components/Base/AppFilterSearch";
import AppDate from "@/components/Base/AppDate";

export default {
	components: {
		AppInput,
		AppButton,
		AppDate
	},
	data() {
		return {
			practice: "",
			form: {
				practice_id: "",
				parent_practice_id: "",
				title: "",
				description: "",
				date_posted: "",
				date_closing: "",
				email: "",
				report_to: "",
				industry_type: "",
				salary_amount: 0,
				salary_description_1: "",
				salary_description_2: "",
				work_hours: 0,
				// appointed_to_locum: "",
				profession_id: "",
				// practice_rate: 0,
				approved_at: "",

				qualification_id: "",
				clinical_system_id: "",
				spoken_language_id: ""
			},

			salary_range: false,
			practice_lists: [],
			professions: [],
			professions_categories: [],
			selectedProfession: {
				profession_category: {}
			},
			industry_types: [
				{
					label: "NHS",
					value: "NHS"
				},
				{
					label: "Private",
					value: "Private"
				}
			],
			work_hours_type: [
				{
					label: "Part Time",
					value: "Part Time"
				},
				{
					label: "Full Time",
					value: "Full Time"
				}
			],
			salary_description_type_1: [
				{
					label: "Attractive",
					value: "Attractive"
				},
				{
					label: "Average",
					value: "Average"
				}
			],
			salary_description_type_2: [
				{
					label: "Negotiable",
					value: "Negotiable"
				},
				{
					label: "Non-negotiable",
					value: "Non-negotiable"
				}
			],
			formError: [],
			// quill
			editorOption: {
				placeholder: "Please type the description here",
				modules: {
					toolbar: [
						["bold", "italic", "underline", "strike"],
						["blockquote", "code-block"],
						[{ header: 1 }, { header: 2 }],
						[{ list: "ordered" }, { list: "bullet" }],
						[{ script: "sub" }, { script: "super" }],
						[{ indent: "-1" }, { indent: "+1" }],
						[{ direction: "rtl" }],
						[{ size: ["small", false, "large", "huge"] }],
						[{ header: [1, 2, 3, 4, 5, 6, false] }],
						[{ font: [] }],
						[{ color: [] }, { background: [] }],
						[{ align: [] }],
						["clean"],
						["link"]
					]
				}
			}
		};
	},
	created() {
		this.loading = true;
		Promise.all([
			this.$axios.$get("/api/v1/practice/me/practice-job-practices"),
			this.$axios.$get("/api/v1/locum-detail-rate-types"),
			this.$axios.$get("/api/v1/shifts"),
			this.$axios.$get("/api/v1/professions"),
			this.$axios.$get("/api/v1/me"),
			(this.practice = this.$auth.user.practice_detail.practice)
		])
			.then(
				([
					responsePracticeLists,
					responseRateLists,
					responseShifts,
					responseProfessions,
					responseMe
				]) => {
					this.practice_lists = [];
					responsePracticeLists.data.practices.forEach(item => {
						this.practice_lists.push({
							label: item.surgery.name,
							value: item.id
						});
					});
					this.rate_lists = [];
					responseRateLists.data.locum_detail_rate_types.forEach(item => {
						this.rate_lists.push({ label: item.name, value: item.id });
					});
					this.shifts = [];
					responseShifts.data.shifts.forEach(item => {
						this.shifts.push({ label: item.name, value: item.id });
					});
					this.professions = [];
					responseProfessions.data.professions.forEach(item => {
						this.professions.push({ label: item.name, value: item.id });
						this.professions_categories.push(item);
					});
				}
			)
			.finally(() => {
				console.log("practice lists", this.practice_lists);
				this.loading = false;
			});
	},
	watch: {
		"form.profession_id"(newValue, oldValue) {
			// this.CheckEmptyField(newValue, "profession_id");
			// if (newValue && oldValue) {
			// 	this.form.qualification_id = [];
			// }
			// if (newValue) {
			// 	this.selectedProfession = this.professions_categories.find(
			// 		item => item.id == newValue
			// 	);
			// 	if (this.selectedProfession.profession_category.id == 1) {
			// 		this.compliances = this.gp_compliance_documents_lists;
			// 		return;
			// 	}
			// 	if (this.selectedProfession.profession_category.id == 2) {
			// 		this.compliances = this.others_compliance_documents_lists;
			// 		return;
			// 	}
			// }
		}
	},
	methods: {
		onEditorBlur(editor) {
			console.log("editor blur!", editor);
		},
		onEditorFocus(editor) {
			console.log("editor focus!", editor);
		},
		onEditorReady(editor) {
			console.log("editor ready!", editor);
		},
		async createPermanentJob() {
			console.log("form", this.form);
			await this.$axios
				.post(`/api/v1/practice/permanent-jobs`, this.form)
				.then(res => {
					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "success",
						text: ["Successfully Created Permanent Job"]
					});
				});
		}
	}
};
</script>

<style>
.modal-container {
	margin: 0;
	z-index: 510;
}
@media (min-width: 1200px) {
	.modal-container {
		width: 80%;
	}
}
.shield {
	z-index: 509;
}
.ql-editor {
	max-height: 300px;
	overflow-y: auto;
	padding: 8px 0;
}
</style>