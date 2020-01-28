<template>
  <div>
    <div v-if="$auth.user.domain === 'Locum'">
      <PermanentJob/>
    </div>
    <div v-else >
      <PracticePermanentJob  
        :permanent_job="permanent_job" 
        :permanent_job_applications="permanent_job_applications" 
      />
    </div>
      
  </div>

</template>
<script>
import AppButton from "@/components/Base/AppButton";
import PermanentJob from "@/components/PermanentJob/PermanentJobModal";
import PracticePermanentJob from "@/components/PermanentJob/PracticePermanentJob";
export default {
	components: {
		// AppButton,
		PermanentJob,
		PracticePermanentJob
  },
  data (){
    return {
      permanent_job: '',
      permanent_job_application: '',
      permanent_job_applications: [],
    }
  },
  async asyncData({ app, route, store }) {
    try {
      // let permanent_job = ''
      // let permanent_job_applications = ''
      // let permanent_job_application = ''

      if(app.$auth.user.domain === 'Locum') {

      } 

      if (app.$auth.user.domain === 'Practice') {
        let response = await app.$axios.$get(`/api/v1/practice/permanent-jobs/${route.params.id}`)
        const permanent_job = response.data.permanent_job
        response = await app.$axios.$get(`/api/v1/practice/permanent-job-applications?permanent_job_id=${route.params.id}`)
        const permanent_job_applications = response.data.permanent_job_applications
      }
    
      return{
        permanent_job,
        permanent_job_application,
        permanent_job_applications,
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
				error(err.response.data);
				return;
			}
    }
  }
};
</script>

<style scoped>
.modal-container {
	z-index: 510;
	margin: 0;
}
@media screen and (min-width: 1200px) {
	.modal-container {
		width: 80%;
	}
}
</style>