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
			<div class="flex flex-row flex-no-wrap justify-start items-center mt-4 md:mt-8">
				<h4 class="text-lg md:text-xl font-bold flex items-center">
					<span>{{ permanent_job.title }}</span>
				</h4>
				<span
					class="px-4 py-1 rounded-lg w-32 text-center mx-2"
					:class="statusStyle(permanent_job.status)"
				>{{ permanent_job.status }}</span>

				<AppButton
					v-if="permanent_job.status == 'Available'"
					class="mx-2"
					:label="toApply ? 'Cancel':'Apply'"
					@click="toApply = !toApply"
				/>
				<AppButton
					v-if="permanent_job.status == 'Applied'"
					class="mx-2"
					:label="'Cancel Application'"
					@click="cancelApplication()"
				/>
			</div>

      <div 
        v-if="toApply === true"
        class="md:w-1/2 px-2 my-6"
      >
        <p class="text-sm">Please write a short pitch to apply for this Permanent Job (Optional)</p>
        <div class="mb-3 md:mb-6">
          <no-ssr placeholder="Loading..." class>
            <quill-editor
              class="bg-white text-black border-b-2"
              ref="myTextEditor"
              v-model="job_application.job_application_pitch"
              :options="editorOption"
              @focus="onEditorFocus($event)"
              @ready="onEditorReady($event)"
            ></quill-editor>
          </no-ssr>
        </div>
        <AppButton
					class="mx-2"
					:label="'Send Application'"
					@click="apply()"
				/>
      </div>

			<div v-if="permanent_job_application && permanent_job_application.invitation_schedule">
				<span class="font-bold">Congratulations!</span>
				You have been invited for interview. Please attend on {{ $moment(permanent_job_application.invitation_schedule, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]').format('DD/MM/YYYY, h:mm:ss a') }} GMT
			</div>

			<div class="flex flex-col md:flex-row">
				<div class="w-full md:w-3/5 lg:w-2/3 pr-2">
					<div class="bg-white rounded-lg shadow-lg p-4">
						<p class="font-bold">Practice</p>
						<p class="pl-2 pb-3">{{permanent_job ? permanent_job.practice.name : null}}</p>
						<p class="font-bold">Description</p>
						<!-- <div class="my-4">
							<span v-html="permanent_job ? permanent_job.description : null"></span>
						</div>-->
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
						<p class="font-bold">Salary</p>
						<p class="pl-2 pb-3">{{permanent_job ? permanent_job.salary_amount : null}}</p>

						<p class="font-bold">Posted</p>
						<p
							class="pl-2 pb-3"
						>{{permanent_job ? $moment(permanent_job.date_posted).format('DD/MM/YYYY') : null}}</p>

						<p class="font-bold">Closes</p>
						<p
							class="pl-2 pb-3"
						>{{permanent_job ? $moment(permanent_job.date_closing).format('DD/MM/YYYY') : null}}</p>

						<p class="font-bold">Report to</p>
						<p class="pl-2 pb-3">{{permanent_job ? permanent_job.report_to : null}}</p>

						<p class="font-bold">Role</p>
						<p class="pl-2 pb-3">{{permanent_job ? permanent_job.professions.name : null}}</p>

						<p class="font-bold">Hours</p>
						<p class="pl-2 pb-3">{{permanent_job ? permanent_job.work_hours : null}}</p>

						<p class="font-bold">Industry</p>
						<p class="pl-2 pb-3">{{permanent_job ? permanent_job.industry_type : null}}</p>
					</div>
				</div>
				<div class="w-full md:w-2/5 lg:w-1/3 md:pl-2">
					<PermanentJobMap v-if="permanent_job" :permanent_job="permanent_job" />
				</div>
			</div>
		</div>


	</section>
</template>
<script>
import AppButton from "@/components/Base/AppButton";
import PermanentJobMap from "@/components/PermanentJob/PermanentJobMap";
export default {
	components: {
		AppButton,
		PermanentJobMap
	},
	data() {
		return {
      toApply: false,
      job_application: {
        job_application_pitch: "",
      },
			job: {
				description: "",
				applied: false
			},
			options: {
				modules: {
					toolbar: null
				}
			},
			permanent_job: "",
			permanent_job_applications: "",
			permanent_job_application: "",

      // quill
			editorOption: {
				placeholder: "Please write your pitch here",
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
		this.getJob();
	},
	methods: {
		async getJob() {
			let permanent_job = "";
			let permanent_job_applications = "";
			let permanent_job_application = "";

			await this.$axios
				.$get(`/api/v1/locum/permanent-jobs/${this.$route.params.id}`)
				.then(res => {
					permanent_job = res.data.permanent_job;
				});

			await this.$axios
				.$get(`/api/v1/locum/permanent-job-applications`)
				.then(res => {
					permanent_job_applications = res.data.permanent_job_applications;
				});

			permanent_job_application = permanent_job_applications.find(
				item => item.permanent_job_id === permanent_job.id
			);
			this.permanent_job_application = permanent_job_application;

			console.log("permanent  job app", this.permanent_job_application);
			if (this.permanent_job_application) {
				console.log("app", this.permanent_job_application);
				permanent_job.status = this.permanent_job_application.application_status;
				this.permanent_job = permanent_job;
			} else if (
				this.$moment(permanent_job.date_closing).format() <=
				this.$moment().format()
			) {
				console.log("haha");
				permanent_job.status = "Closed";
				this.permanent_job = permanent_job;
			} else {
				console.log("hoho");
				permanent_job.status = "Available";
				this.permanent_job = permanent_job;
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

		apply() {
			this.$axios
				.$put(
					`/api/v1/locum/permanent-job-applications/${this.permanent_job.id}/apply`,
					{
						locum_user_id: this.$auth.user.id,
            job_application_pitch: this.job_application.job_application_pitch
					}
				)
				.then(res => {
					this.job.applied = true;
          this.toApply = false
					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "success",
						text: ["You have successfully Applied to this job"]
					});
					this.getJob();
				});
		},

		cancelApplication() {
			this.$axios
				.$delete(
					`/api/v1/locum/permanent-job-applications/${this.permanent_job.id}/delete-application`
				)
				.then(res => {
					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "success",
						text: ["Application is now successfully Cancelled"]
					});
					this.getJob();
				});
		},

		statusStyle(jobStatus) {
			switch (jobStatus) {
				case "Available":
					return "bg-green-500 text-white";
					break;
				case "Applied":
					return "bg-yellow-600 text-white";
					break;
				case "For Interview":
					return "bg-green-600 text-white";
					break;
				case "Accepted":
					return "bg-green-700 text-white";
					break;
				case "Rejected":
					return "bg-red-700 text-white";
					break;
				case "Closed":
					return "bg-gray-700 text-white";
					break;
				case "Unsuccessful":
					return "bg-gray-400";
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
</style>