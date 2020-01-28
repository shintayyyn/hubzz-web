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
			<div class="flex justify-between items-center flex-wrap mb-4">
				<h4 class="text-lg md:text-xl font-bold flex items-center">
					Salaried GP / Locum GP
					<span
						v-if="job.applied"
						class="text-sm bg-green-500 px-4 py-2 ml-4 rounded-lg text-white"
					>Applied</span>
				</h4>
				<AppButton class="ml-2" :label="'Apply'" @click="apply()" v-if="!job.applied" />
			</div>
			<div class="flex flex-col md:flex-row">
				<div class="w-full md:w-3/5 lg:w-2/3 pr-2">
					<div class="bg-white rounded-lg shadow-lg p-4">
						<p class="w-1/3 font-bold">Practice</p>
						<p>{{permanent_job.practice.name}}</p>
						<div class="my-4">
							<span v-html="permanent_job.description"></span>
						</div>
					</div>
				</div>
				<div class="w-full md:w-2/5 lg:w-1/3 md:pl-2">
					<div class="bg-white rounded-lg shadow-lg p-4 my-2 md:my-0">
						<p class="w-1/3 font-bold">Salary</p>
						<p class="pl-2 pb-3">{{permanent_job.salary_amount}}</p>

						<p class="w-1/3 font-bold">Posted</p>
						<p class="pl-2 pb-3">{{$moment(permanent_job.date_posted).format('YYYY-MM-DD')}}</p>

						<p class="w-1/3 font-bold">Closes</p>
						<p class="pl-2 pb-3">{{$moment(permanent_job.date_closing).format('YYYY-MM-DD')}}</p>

						<p class="w-1/3 font-bold">Report to</p>
						<p class="pl-2 pb-3">{{permanent_job.report_to}}</p>

						<p class="w-1/3 font-bold">Role</p>
						<p class="pl-2 pb-3">Locum / Sessional GP, Salaried GP</p>

						<p class="w-1/3 font-bold">Hours</p>
						<p class="pl-2 pb-3">{{permanent_job.work_hours}}</p>

						<p class="w-1/3 font-bold">Industry</p>
						<p class="pl-2 pb-3">{{permanent_job.industry_type}}</p>
					</div>
					<PermanentJobMap :permanent_job="permanent_job" />
				</div>
			</div>
		</div>
	</section>
</template>
<script>
import AppButton from "@/components/Base/AppButton";
import PermanentJobMap from "@/components/PermanentJob/PermanentJobMap";
export default {
  props:["permanent_job"],
	components: {
		AppButton,
		PermanentJobMap
	},
	data() {
		return {
			job: {
				description: "",
				applied: false
			}
		};
	},
	created() {
    console.log('user', this.$auth.user)
		this.job.description =
			"<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Suspendisse interdum consectetur libero id faucibus nisl tincidunt eget nullam. Libero justo laoreet sit amet cursus sit. In vitae turpis massa sed elementum tempus egestas sed sed. Proin nibh nisl condimentum id venenatis a condimentum. Morbi tempus iaculis urna id volutpat. Et netus et malesuada fames ac turpis. Scelerisque purus semper eget duis. Libero justo laoreet sit amet. Tempor nec feugiat nisl pretium fusce id velit ut. Ac feugiat sed lectus vestibulum mattis ullamcorper velit sed ullamcorper. Mattis aliquam faucibus purus in massa tempor nec feugiat nisl. Vestibulum rhoncus est pellentesque elit ullamcorper. Duis at consectetur lorem donec. In egestas erat imperdiet sed euismod nisi. Semper feugiat nibh sed pulvinar proin.</p>";
	},
	methods: {
		apply() {
      this.$axios.$put(`/api/v1/locum/permanent-job-applications/${this.permanent_job.id}/apply`,{
        locum_user_id: this.$auth.user.id
      }).then(res => {
        this.job.applied = true;
        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "success",
          text: "Applied"
        });
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
</style>