<template>
	<section class="modal-container">
		<div class="p-4 md:p-8">
			<nuxt-link :to="{path:`/permanent-jobs`,query:$route.query}">
				<svgicon name="left-arrow" height="32" width="32" class="cursor-pointer" />
			</nuxt-link>

			<div class="flex justify-start items-center flex-wrap px-2">
				<h4 class="text-lg md:text-xl font-bold">
					<span>{{permanent_job.title}}</span>
				</h4>
				<span
					class="mx-4 py-2 px-4 rounded font-semibold"
					:class="statusStyle(permanent_job.job_posting_status)"
				>{{ permanent_job.job_posting_status }}</span>
				<AppButton :label="editJobLabel(edit)" @click="edit = !edit" />
			</div>
			<div class="flex flex-col md:flex-row">
				<div class="mx-2 w-full md:w-3/5 lg:w-2/3">
					<div class="bg-white rounded-lg shadow-lg p-4 mb-4 flex flex-col items-start">
						<template v-if="!edit">
							<div class="w-full flex flex-col md:flex-row">
								<div class="w-full md:flex-w-1/2">
									<p class="font-bold">Practice</p>
									<p class="pl-2 pb-3">{{permanent_job ? permanent_job.practice.name : ''}}</p>

									<p class="font-bold">Salary</p>
									<p class="pl-2 pb-3">{{permanent_job ? permanent_job.salary_amount : ''}}</p>

									<p class="font-bold">Posted</p>
									<p
										class="pl-2 pb-3"
									>{{permanent_job ? $moment(permanent_job.date_posted).format('DD/MM/YYYY') : ''}}</p>

									<p class="font-bold">Closes</p>
									<p
										class="pl-2 pb-3"
									>{{permanent_job ? $moment(permanent_job.date_closing).format('DD/MM/YYYY') : ''}}</p>
								</div>

								<div class="w-full md:flex-w-1/2">
									<p class="font-bold">Email</p>
									<p class="pl-2 pb-3">{{permanent_job ? permanent_job.email : ''}}</p>

									<p class="font-bold">Report to</p>
									<p class="pl-2 pb-3">{{permanent_job ? permanent_job.report_to : ''}}</p>

									<p class="font-bold">Role</p>
									<p class="pl-2 pb-3">{{permanent_job ? permanent_job.professions.name : ''}}</p>

									<p class="font-bold">Hours</p>
									<p class="pl-2 pb-3">{{ permanent_job ? permanent_job.work_hours : ''}}</p>

									<p class="font-bold">Industry</p>
									<p class="pl-2 pb-3">{{ permanent_job ? permanent_job.industry_type : ''}}</p>
								</div>
							</div>

							<p class="font-bold">Description</p>
							<div>
								<no-ssr>
									<quill-editor
										class="border-none"
										:options="options"
										:content="permanent_job.description"
										disabled
									></quill-editor>
								</no-ssr>
							</div>
						</template>
						<template v-else>
							<div class="w-full flex flex-col md:flex-row">
								<div class="w-full md:flex-w-1/2 pr-2">
									<p class="font-bold">Title</p>
									<AppInput
										v-model="form.title"
										:type="'text'"
										:name="'title'"
										:error="formError.find(item => item.field === 'title')"
									/>

									<p class="font-bold">Practice</p>
									<AppInput
										v-model="form.practice_id"
										:type="'select'"
										:name="'practice_id'"
										:placeholder="'Select...'"
										:error="formError.find(item => item.field === 'practice_id')"
										:items="practice_lists"
										@blur="CheckEmptyField(form.practice_id, 'practice_id')"
									/>

									<p class="font-bold">Salary</p>
									<div class="flex flex-wrap">
										<AppInput
											class="w-full pr-1"
											v-model="form.salary_amount"
											:type="'number'"
											:name="'salary_amount'"
											:label="'Salary Amount'"
											:error="formError.find(item => item.field === 'salary_amount')"
											@blur="CheckEmptyField(form.salary_amount, 'salary_amount')"
										/>
										<AppInput
											class="w-full md:w-1/2 pr-1"
											v-model="form.salary_description_1"
											:type="'select'"
											:name="'salary_description_1'"
											:placeholder="'Select...'"
											:label="'Salary Description 1'"
											:error="formError.find(item => item.field === 'salary_description_1')"
											:items="salary_description_type_1"
											@blur="CheckEmptyField(form.salary_description_1, 'salary_description_1')"
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

									<AppDate
										v-model="form.date_posted"
										:name="'date_posted'"
										:label="'Date Posted'"
										isAfter
										:error="formError.find(item => item.field === 'date_posted')"
									/>
									<AppDate
										v-model="form.date_closing"
										:name="'date_closing'"
										:label="'Date Closing'"
										isAfter
										:startDate="form.date_posted"
										:error="formError.find(item => item.field === 'date_closing')"
									/>
								</div>

								<div class="w-full md:flex-w-1/2 pl-2">
									<p class="font-bold">E-Mail</p>
									<AppInput
										v-model="form.email"
										:type="'text'"
										:name="'email'"
										:error="formError.find(item => item.field === 'email')"
									/>

									<p class="font-bold">Report to</p>
									<AppInput
										v-model="form.report_to"
										:type="'text'"
										:name="'report_to'"
										:error="formError.find(item => item.field === 'report_to')"
									/>

									<p class="font-bold">Role</p>
									<AppInput
										v-model="form.profession_id"
										:type="'select'"
										:name="'profession_id'"
										:placeholder="'Select...'"
										:error="formError.find(item => item.field === 'profession_id')"
										:items="professions"
										@blur="CheckEmptyField(form.profession_id, 'profession_id')"
									/>

									<p class="font-bold">Hours</p>
									<AppInput
										v-model="form.work_hours"
										:type="'select'"
										:name="'work_hours'"
										:placeholder="'Select...'"
										:label="'Work Hours'"
										:error="formError.find(item => item.field === 'work_hours')"
										:items="work_hours_type"
										@blur="CheckEmptyField(form.work_hours, 'work_hours')"
									/>

									<p class="font-bold">Industry</p>
									<AppInput
										v-model="form.industry_type"
										:type="'select'"
										:name="'industry_type'"
										:placeholder="'Select...'"
										:error="formError.find(item => item.field === 'industry_type')"
										:items="industry_types"
										@blur="CheckEmptyField(form.industry_type, 'industry_type')"
									/>
								</div>
							</div>

							<p class="font-bold">Description</p>
							<no-ssr placeholder="Loading...">
								<quill-editor
									class="bg-white text-black border-b-2 mb-3 md:mb-6 w-full"
									ref="myTextEditor"
									v-model="form.description"
									:options="editorOption"
									@blur="CheckEmptyField(form.description, 'description')"
									@focus="onEditorFocus($event)"
									@ready="onEditorReady($event)"
								></quill-editor>
							</no-ssr>
							<!-- <p class="font-bold">Update Remarks</p>
							<AppInput
								v-model="form.update_remarks"
								:type="'textarea'"
								:name="'update_remarks'"
								:error="formError.find(item => item.field === 'update_remarks')"
								:resize="false"
								:rows="4"
							/>-->
							<AppButton @click="editPermanentJob()" :label="'Save Changes'" />
						</template>
					</div>
				</div>

				<div v-if="permanent_job" class="mx-2 w-full md:w-2/5 lg:w-1/3">
					<PermanentJobCandidates
						v-if="permanent_job.job_posting_status !== 'Closed'"
						:permanent_job="permanent_job"
					/>
					<!-- <div v-if="permanent_job.appointed_to_locum_user_id">
						<p>Locum</p>
					</div>-->
					<PermanentJobMap :permanent_job="permanent_job" />

					<AppButton
						v-if="permanent_job.job_posting_status !== 'Closed'"
						class="my-4"
						:label="'Close Job'"
						@click="toCloseJob = !toCloseJob"
					/>

					<div v-if="toCloseJob === true">
						<AppInput
							v-model="form.hired_through"
							:label="'Closing Job Due to External Reason? (Optional)'"
							:type="'select'"
							:name="'hired_through'"
							:placeholder="'Select...'"
							:items="hired_through"
						/>

						<AppButton class="my-4" :label="'Confirm'" @click="forceCloseJob()" />
					</div>
				</div>
			</div>
		</div>
	</section>
</template>
<script>
import AppButton from "@/components/Base/AppButton";
import AppInput from "@/components/Base/AppInput";
import AppFilterSearch from "@/components/Base/AppFilterSearch";
import AppDate from "@/components/Base/AppDate";
import PermanentJobShowCandidate from "@/components/PermanentJob/PermanentJobShowCandidate";
import PermanentJobCandidates from "@/components/PermanentJob/PermanentJobCandidates";
import PermanentJobMap from "@/components/PermanentJob/PermanentJobMap";
export default {
	components: {
		AppInput,
		AppButton,
		AppDate,
		PermanentJobCandidates,
		PermanentJobMap
	},
	data() {
		return {
			options: {
				modules: {
					toolbar: null
				}
			},
			edit: false,
			toCloseJob: false,
			modal: false,
			permanent_job: "",
			form: {
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
				practice_id: "",
				profession_id: "",
				hired_through: ""
			},
			salary_range: false,
			practice_lists: [],
			work_hours_type: [],
			industry_types: [],
			salary_description_type_1: [],
			salary_description_type_2: [],
			professions: [],
			professions_categories: [],

			hired_through: [],
			put_hired_through: "",

			postingProfession: "",

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
			// displayOption: {
			// 	modules: {
			// 		toolbar: null
			// 	}
			// }
		};
	},
	created() {
		this.loading = true;
		this.getPermanentJob();
		Promise.all([
			this.$axios.$get("/api/v1/practice/me/practice-practices"),
			this.$axios.$get("/api/v1/locum-detail-rate-types"),
			this.$axios.$get("/api/v1/shifts"),
			this.$axios.$get("/api/v1/professions")
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
				this.form.title = this.permanent_job.title;
				this.form.description = this.permanent_job.description;
				this.form.date_posted = this.$moment(
					this.permanent_job.date_posted
				).format("YYYY-MM-DD");
				this.form.date_closing = this.$moment(
					this.permanent_job.date_closing
				).format("YYYY-MM-DD");
				this.form.email = this.permanent_job.email;
				this.form.report_to = this.permanent_job.report_to;
				this.form.industry_type = this.permanent_job.industry_type;
				this.form.salary_amount = this.permanent_job.salary_amount;
				this.form.salary_description_1 = this.permanent_job.salary_description_1;
				this.form.salary_description_2 = this.permanent_job.salary_description_2;
				this.form.work_hours = this.permanent_job.work_hours;
				this.form.practice_id = this.permanent_job.practice_id;
				this.form.profession_id = this.permanent_job.profession_id;
				this.loading = false;
			});
		this.work_hours_type = [
			{
				label: "Part Time",
				value: "Part Time"
			},
			{
				label: "Full Time",
				value: "Full Time"
			}
		];
		this.industry_types = [
			{
				label: "NHS",
				value: "NHS"
			},
			{
				label: "Private",
				value: "Private"
			}
		];
		this.salary_description_type_1 = [
			{
				label: "Attractive",
				value: "Attractive"
			},
			{
				label: "Average",
				value: "Average"
			}
		];
		this.salary_description_type_2 = [
			{
				label: "Negotiable",
				value: "Negotiable"
			},
			{
				label: "Non-negotiable",
				value: "Non-negotiable"
			}
		];
		this.hired_through = [
			{
				label: "Through HUBZZ",
				value: "Through HUBZZ"
			},
			{
				label: "Direct Hiring",
				value: "Direct Hiring"
			}
		];
	},
	watch: {
		edit(value) {
			if (value === false) {
				this.getPermanentJob();
			} else {
				this.form.title = this.permanent_job.title;
				this.form.description = this.permanent_job.description;
				this.form.date_posted = this.$moment(
					this.permanent_job.date_posted
				).format("YYYY-MM-DD");
				this.form.date_closing = this.$moment(
					this.permanent_job.date_closing
				).format("YYYY-MM-DD");
				this.form.email = this.permanent_job.email;
				this.form.report_to = this.permanent_job.report_to;
				this.form.industry_type = this.permanent_job.industry_type;
				this.form.salary_amount = this.permanent_job.salary_amount;
				this.form.salary_description_1 = this.permanent_job.salary_description_1;
				this.form.salary_description_2 = this.permanent_job.salary_description_2;
				this.form.work_hours = this.permanent_job.work_hours;
				this.form.practice_id = this.permanent_job.practice_id;
				this.form.profession_id = this.permanent_job.profession_id;
				this.loading = false;
			}
		},
		"form.date_posted"(value) {
			if (this.$moment(value).isAfter(this.form.date_closing)) {
				this.formError.push({
					field: "date_closing",
					message: "Date Closing is not valid"
				});
			}
		},
		"form.date_closing"(value) {
			if (this.$moment(value).isBefore(this.form.date_posted)) {
				this.formError.push({
					field: "date_posted",
					message: "Date Posted is not valid"
				});
			}
			let index = this.formError.findIndex(
				item => item.field === "date_closing"
			);
			if (this.$moment(value).isAfter(this.form.date_posted)) {
				this.formError.splice(index, 1);
			}
		}
	},
	methods: {
		getPermanentJob() {
			this.$axios
				.$get(`/api/v1/practice/permanent-jobs/${this.$route.params.id}`)
				.then(res => {
					this.permanent_job = res.data.permanent_job;
				})
				.finally(() => {
					console.log("permanent job", this.permanent_job);
				});
		},
		editJobLabel(edit) {
			if (
				edit === false &&
				this.permanent_job.job_posting_status == "Available"
			) {
				return "Edit Job";
			} else if (
				edit === false &&
				this.permanent_job.job_posting_status == "Closed"
			) {
				return "Re-post Job";
			} else {
				return "Cancel Editing";
			}
		},
		editPermanentJob() {
			this.formError = [];

			let notRequired = ["hired_through"];
			this.Validate(this.form, notRequired);
			if (!this.formError.length) {
				this.$axios
					.$put(
						`/api/v1/practice/permanent-jobs/${this.permanent_job.id}`,
						this.form
					)
					.then(res => {
						this.$store.commit("SET_NOTIFICATION", {
							enabled: true,
							status: "success",
							text: ["Successfully Edited Job"]
						});
						this.edit = false;
					})
					.catch(err => {
						this.formError = err.response.data.error_messages;
					});
			}
		},
		forceCloseJob() {
			this.$axios
				.$put(
					`/api/v1/practice/permanent-jobs/${this.permanent_job.id}/force-close-job`,
					{
						hired_through: this.form.hired_through
					}
				)
				.then(res => {
					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "success",
						text: ["Successfully Closed Job"]
					});
				})
				.finally(() => {
					this.$router.go(-1);
				});
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
		statusStyle(jobPostingStatus) {
			switch (jobPostingStatus) {
				case "Available":
					return "bg-green-500 text-white";
					break;
				case "Closed":
					return "bg-gray-700 text-white";
					break;
				default:
					return "bg-yellow-400 text-black";
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
.quill-editor .ql-container,
.wrapper {
	overflow-y: auto;
}
.quill-editor .ql-container {
	max-height: 300px;
	padding: 8px 0;
}
.wrapper {
	max-height: 500px;
}
</style>