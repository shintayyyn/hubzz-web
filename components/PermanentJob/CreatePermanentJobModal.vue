<template>
	<section ref="modalContainer" class="modal-container">
		<div class="p-4 md:p-8">
			<svgicon
				name="left-arrow"
				height="32"
				width="32"
				class="cursor-pointer"
				@click="$router.go(-1)"
			/>
			<div class="flex justify-start font-bold text-sm sm:text-xl mt-8">Create a Permanent Job</div>
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
						<AppDate
							v-model="form.date_posted"
							:name="'date_posted'"
							:label="'Date Posted'"
							is-after
							:error="formError.find(item => item.field === 'date_posted')"
							disabled
							@blur="CheckEmptyField(form.date_posted, 'date_posted')"
						/>
						<AppDate
							v-model="form.date_closing"
							:name="'date_closing'"
							:label="'Date Closing'"
							is-after
							:start-date="$moment(form.date_posted).add(1, 'days').format('YYYY-MM-DD')"
							:error="formError.find(item => item.field === 'date_closing')"
							@blur="CheckEmptyField(form.date_closing, 'date_closing')"
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
							@blur="CheckEmptyField(form.title, 'title')"
						/>
						<p class="text-sm">Description</p>
						<div class="mb-3 md:mb-6" v-if="!form.description_file">
							<no-ssr placeholder="Loading..." class>
								<quill-editor
									ref="myTextEditor"
									v-model="form.description"
									class="bg-white text-black border-b-2"
									:options="editorOption"
									@blur="CheckEmptyField(form.description, 'description')"
									@focus="onEditorFocus($event)"
									@ready="onEditorReady($event)"
								/>
							</no-ssr>
						</div>
						<!-- <p
							class="text-sm text-gray-600 italic"
							v-if="!form.description_file"
						>or upload the job specification</p>-->
						<div class="flex items-center">
							<div
								class="flex flex-row flex-no-wrap justify-center items-center px-4 py-1 my-2 text-sm rounded bg-yellow-500 cursor-pointer hover:underline"
							>
								<input
									id="fileInc"
									type="file"
									class="inputfile hidden"
									accept="image/jpeg, .pdf., .docx, .msword"
									@input="onFileInput($event)"
									@click.stop
								/>

								<svgicon name="cloud-upload" height="18" width="18" />

								<label for="fileInc" class="leading-loose mx-2 cursor-pointer">Upload</label>
							</div>
							<p
								v-if="form.description_file && form.description_file.name"
								class="text-sm mx-2"
							>{{ form.description_file.name }}</p>
						</div>
						<p
							class="text-xs cursor-pointer text-blue-500 hover:text-blue-600"
							v-if="form.description_file"
							@click="form.description_file = null"
						>Type the description instead</p>

						<div
							v-if="formError && formError.find(item => item.field === 'description')"
							class="text-red-500 py-1 text-xs"
						>{{ formError.find(item => item.field === 'description').message.charAt(0).toUpperCase() + formError.find(item => item.field === 'description').message.slice(1) }}</div>
						<AppInput
							v-model="form.report_to"
							:type="'text'"
							:name="'report_to'"
							:label="'Report to'"
							:error="formError.find(item => item.field === 'report_to')"
							@blur="CheckEmptyField(form.report_to, 'report_to')"
						/>
						<AppInput
							v-model="form.email"
							:type="'email'"
							:name="'email'"
							:label="'Email'"
							:error="formError.find(item => item.field === 'email')"
							@blur="CheckEmptyField(form.email, 'email')"
						/>
						<AppInput
							v-model="form.industry_type"
							:type="'select'"
							:name="'industry_type'"
							:placeholder="'Select...'"
							:label="'Industry Type'"
							:error="formError.find(item => item.field === 'industry_type')"
							:items="industry_types"
							@blur="CheckEmptyField(form.industry_type, 'industry_type')"
						/>
						<AppInput
							v-model="form.work_hours"
							:type="'select'"
							:name="'work_hours'"
							:placeholder="'Select...'"
							:label="'Job Type'"
							:error="formError.find(item => item.field === 'work_hours')"
							:items="work_hours_type"
							@blur="CheckEmptyField(form.work_hours, 'work_hours')"
						/>
						<AppInput
							v-model="form.salary_amount"
							:type="'number'"
							:name="'salary_amount'"
							:label="'Salary Amount (Optional)'"
							:min="0"
							:in-style="'text-align:right'"
							:limit="8"
						/>
						<AppInput
							v-model="form.salary_description_2"
							class="w-full pl-1"
							:type="'select'"
							:name="'salary_description_2'"
							:placeholder="'Select...'"
							:label="'Salary Description (Optional)'"
							:error="formError.find(item => item.field === 'salary_description_2')"
							:items="salary_description_type_2"
							:disabled="!form.salary_amount || form.salary_amount == 0"
							@blur="CheckEmptyField(form.salary_description_2, 'salary_description_2')"
						/>
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
			salary_amount_temporary: 0,
			form: {
				practice_id: "",
				profession_id: "",
				date_posted: this.$moment().format("YYYY-MM-DD"),
				date_closing: "",
				title: "",
				description: "",
				description_file: null,
				report_to: "",
				email: "",
				industry_type: "",
				work_hours: "",
				salary_amount: "",
				parent_practice_id: "",
				salary_description_2: ""
			},
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
				placeholder:
					"Please type the description or upload the job specification",
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
	computed: {
		// salary_amount_final:function () {
		//   return this.salary_amount_temporary ? this.salary_amount_temporary : 0
		// }
	},
	watch: {
		"form.salary_amount"() {
			this.validateNumber(this.form.salary_amount, "salary_amount");
		}
	},
	created() {
		this.loading = true;
		Promise.all([
			this.$axios.$get("/api/v1/practice/me/practice-job-practices"),
			this.$axios.$get("/api/v1/locum-detail-rate-types"),
			this.$axios.$get("/api/v1/shifts"),
			this.$axios.$get("/api/v1/professions"),
			(this.practice = this.$auth.user.practice_detail.practice)
		])
			.then(
				([
					responsePracticeLists,
					responseRateLists,
					responseShifts,
					responseProfessions
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
				this.form.parent_practice_id =
					this.practice.type === "Spoke" && this.practice.parent_practice_id
						? this.practice.parent_practice_id
						: null
				this.form.email = this.practice.email 
					? this.practice.email 
					: this.$auth.user.email 
						? this.$auth.user.email
						: null
				this.form.report_to = this.practice.report_to
					? this.practice.report_to
					: this.$auth.user.name 
						? this.$auth.user.name 
						: null
				this.loading = false
			});
	},
	methods: {
		validateNumber(value, fieldName) {
			let displayFieldName =
				fieldName.charAt(0).toUpperCase() +
				fieldName.slice(1).replace(/_/g, " ");
			let index = this.formError.findIndex(item => item.field === fieldName);
			if (
				parseInt(value) < 1 ||
				value.toString().includes("e") ||
				value === ""
			) {
				this.formError.push({
					field: fieldName,
					message: `${displayFieldName} is invalid`
				});
			} else {
				this.formError.splice(index, 1);
			}
		},
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
			if (
				this.form.practice_id !== this.$auth.user.practice_detail.practice.id &&
				(this.$auth.user.practice_detail.practice.type === "Hub" || this.$auth.user.practice_detail.practice.type === "Stand Alone")
			) {
				this.form.parent_practice_id = await this.$auth.user.practice_detail
					.practice.id;
			}
			this.formError = [];

			let notRequired = [
				"parent_practice_id",
				"salary_amount",
				"salary_description_2"
			];

			let salary_amount = this.form.salary_amount ? this.form.salary_amount : 0;

			if (this.form.description) {
				notRequired.push("description_file");
			}

			if (this.form.description_file) {
				notRequired.push("description");
			}

			this.Validate(this.form, notRequired);
			if (!this.formError.length) {
				if (!this.form.salary_amount) {
					this.form.salary_description_2 = "";
				}
				const formData = await new FormData();

				await formData.append("date_closing", this.form.date_closing);
				await formData.append("date_posted", this.form.date_posted);
				await formData.append("description", this.form.description);
				await formData.append("description_file", this.form.description_file);
				await formData.append("email", this.form.email);
				await formData.append("industry_type", this.form.industry_type);
				await formData.append(
					"parent_practice_id",
					this.form.parent_practice_id
				);
				await formData.append("practice_id", this.form.practice_id);
				await formData.append("profession_id", this.form.profession_id);
				await formData.append("report_to", this.form.report_to);
				// await formData.append("salary_amount", this.form.salary_amount);
				await formData.append(
					"salary_description_2",
					this.form.salary_description_2
				);
				await formData.append("title", this.form.title);
				await formData.append("work_hours", this.form.work_hours);
				await formData.append("salary_amount", salary_amount);
				console.log("salary_amount", parseFloat(salary_amount));

				// await this.$axios
				// 	.post(`/api/v1/practice/permanent-jobs`, {
				// 		...this.form,
				// 		salary_amount: this.form.salary_amount ? this.form.salary_amount : 0
				// 	})
				console.log("formData", formData);
				await this.$axios
					.post(`/api/v1/practice/permanent-jobs`, formData)
					.then(() => {
						this.$store.commit("SET_NOTIFICATION", {
							enabled: true,
							status: "success",
							text: ["Successfully Created Permanent Job"]
						});
						this.$router.push("/permanent-jobs");
					})
					.catch(err => {
						this.formError = err.response.data.error_messages;
						this.$nextTick(() => {
							this.$refs.modalContainer.scrollTop = 0;
						});
						this.$store.commit("SET_NOTIFICATION", {
							enabled: true,
							status: "danger",
							text: [err.response.data.message]
						});
					});
			} else {
				this.$nextTick(() => {
					this.$refs.modalContainer.scrollTop = 0;
				});
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
			let errIndex = this.formError.findIndex(
				err => err.field === "description"
			);
			if (errIndex > -1) {
				this.formError.splice(errIndex, 1);
			}
			this.form.description = "";
			this.form.description_file = file;
			// this.new_certificate_of_incorporation = true

			console.log("description", this.form);
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
