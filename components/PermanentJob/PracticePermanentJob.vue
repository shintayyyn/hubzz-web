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
			<div class="flex items-center flex-wrap">
				<h4 class="text-lg md:text-xl font-bold">{{permanent_job.title}}</h4>
				<AppButton class="ml-4" :label="edit ? 'Cancel Editing' : 'Edit Job'" @click="edit = !edit" />
			</div>
			<div class="flex flex-col md:flex-row">
				<div class="mx-2 w-full md:w-3/5 lg:w-2/3">
					<div class="bg-white rounded-lg shadow-lg p-4 mb-4 flex flex-col items-start">
						<template v-if="!edit">
							<!-- <img src="https://via.placeholder.com/150" class="py-2" /> -->
							<div class="w-full flex flex-col md:flex-row">
								<div class="w-full md:flex-w-1/2">
									<p class="font-bold">Practice</p>
									<p class="pl-2 pb-3">{{permanent_job ? permanent_job.practice.name : ''}}</p>

									<p class="font-bold">Salary</p>
									<p class="pl-2 pb-3">{{permanent_job ? permanent_job.salary_amount : ''}}</p>

									<p class="font-bold">Posted</p>
									<p class="pl-2 pb-3">{{permanent_job ? $moment(permanent_job.date_posted).format('YYYY-MM-DD') : ''}}</p>

									<p class="font-bold">Closes</p>
									<p class="pl-2 pb-3">{{permanent_job ? $moment(permanent_job.date_closing).format('YYYY-MM-DD') : ''}}</p>
								</div>

								<div class="w-full md:flex-w-1/2">
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
							<span v-html="permanent_job ? permanent_job.description : ''"></span>
						</template>
						<template v-else>
							<div class="w-full flex flex-col md:flex-row">
								<div class="w-full md:flex-w-1/2 pr-2">
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

									<p class="font-bold">Posted</p>
									<AppDate v-model="form.date_posted" :name="'date_posted'" :label="'Date Posted'" isAfter />

									<p class="font-bold">Closes</p>
									<AppDate v-model="form.date_closing" :name="'date_closing'" :label="'Date Posted'" isAfter />
								</div>

								<div class="w-full md:flex-w-1/2 pl-2">
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
										@blur="CheckEmptyField(form.practice_id, 'work_hours')"
									/>

									<p class="font-bold">Industry</p>
									<AppInput
										v-model="form.industry_type"
										:type="'select'"
										:name="'industry_type'"
										:placeholder="'Select...'"
										:error="formError.find(item => item.field === 'industry_type')"
										:items="industry_types"
										@blur="CheckEmptyField(form.practice_id, 'industry_type')"
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
							<p class="font-bold">Update Remarks</p>
							<AppInput
								v-model="form.update_remarks"
								:type="'textarea'"
								:name="'update_remarks'"
								:error="formError.find(item => item.field === 'update_remarks')"
								:resize="false"
								:rows="4"
							/>
							<AppInput
								v-model="form.update_accepted_until"
								:type="'select'"
								:name="'update_accepted_until'"
								:label="'Set deadline for appointed Locum to accept these changes (per hour)'"
								:error="formError.find(item => item.field === 'update_accepted_until')"
								:items="[
                  { label: '12', value: 12 * 60 },
                  { label: '13', value: 13 * 60 },
                  { label: '14', value: 14 * 60 },
                  { label: '15', value: 15 * 60 },
                  { label: '16', value: 16 * 60 },
                  { label: '17', value: 17 * 60 },
                  { label: '18', value: 18 * 60 },
                  { label: '19', value: 19 * 60 },
                  { label: '20', value: 20 * 60 },
                  { label: '21', value: 21 * 60 },
                  { label: '22', value: 22 * 60 },
                  { label: '23', value: 23 * 60 },
                  { label: '24', value: 24 * 60 },
                ]"
							/>
							<AppButton @click="editPermanentJob()" :label="'Save Changes'" />
						</template>
					</div>
				</div>
        
				<div v-if="permanent_job" class="mx-2 w-full md:w-2/5 lg:w-1/3">
					<PermanentJobDetailCandidates :permanent_job="permanent_job"/>
					<PermanentJobMap :permanent_job="permanent_job" />

          <AppButton 
            class="ml-4" 
            :label="'Close Job'" 
            @click="toCloseJob = !toCloseJob" />

          <div v-if="toCloseJob === true">
            <AppInput
              v-model="form.hired_through"
              :type="'select'"
              :name="'hired_through'"
              :placeholder="'Select...'"
              :items="hired_through"
            />

            <AppButton 
              class="ml-4" 
              :label="'Confirm'" 
              @click="forceCloseJob()"/>
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
import PermanentJobShowCandidates from "@/components/PermanentJob/PermanentJobShowCandidates";
import PermanentJobDetailCandidates from "@/components/PermanentJob/PermanentJobDetailCandidates";
import PermanentJobMap from "@/components/PermanentJob/PermanentJobMap";
export default {
	components: {
		AppInput,
		AppButton,
    AppDate,
		PermanentJobDetailCandidates,
		PermanentJobMap
	},
	data() {
		return {
      edit: false,
      toCloseJob: false,
      modal: false,
      permanent_job: '',
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
				practice_rate: 0,
        approved_at: "",
        hired_through: "",
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
      put_hired_through: '',

      postingProfession: '',

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
    this.$axios.$get(`/api/v1/practice/permanent-jobs/${this.$route.params.id}`).then(res => {
      this.permanent_job = res.data.permanent_job
    })
		Promise.all([
			this.$axios.$get("/api/v1/practice/me/practice-practices"),
			this.$axios.$get("/api/v1/locum-detail-rate-types"),
			this.$axios.$get("/api/v1/shifts"),
			this.$axios.$get("/api/v1/professions"),
      this.$axios.$get("/api/v1/me"),
      
		])
			.then(
				([
					responsePracticeLists,
					responseRateLists,
					responseShifts,
					responseProfessions,
          responseMe,
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
        this.loading = false;
      });
      
    this.form.date_posted = this.permanent_job.date_posted;
    this.form.date_closing = this.permanent_job.date_closing;
		this.form.practice_id = this.permanent_job.practice_id;
		this.form.salary_description_1 = this.permanent_job.salary_description_1;
		this.form.salary_description_2 = this.permanent_job.salary_description_2;
    this.form.description = this.permanent_job.description;
    this.form.report_to = this.permanent_job.report_to

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
        value: "Through HUBZZ",
      },
      {
        label: "Direct Hiring",
        value: "Direct Hiring",
      }
    ]
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
    editPermanentJob(){
      this.$axios.$put(`/api/v1/practice/permanent-job/${this.permanent_job.id}`, this.form).then(res => {
         this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "success",
          text: ["Successfully Rejected Locum"]
        });
      })
    },
    forceCloseJob(){
      this.$axios.$put(`/api/v1/practice/permanent-jobs/${this.permanent_job.id}/force-close-job`, {
        hired_through: this.form.hired_through,
      }).then(res => {
         this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "success",
          text: ["Successfully Closed Job"]
        });
      }).finally(() => {
        this.$router.go(-1)
      })
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