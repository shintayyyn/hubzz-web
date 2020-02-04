<template>
  <div>
    <div v-if="$auth.user.domain === 'Locum'">
      <LocumPermanentJobModal/>
    </div>
    <div v-else >
      <PracticePermanentJobModal/>
    </div>
  </div>
</template>
<script>
import AppButton from "@/components/Base/AppButton";
import LocumPermanentJobModal from "@/components/PermanentJob/LocumPermanentJobModal";
import PracticePermanentJobModal from "@/components/PermanentJob/PracticePermanentJobModal";
export default {
	components: {
		// AppButton,
		LocumPermanentJobModal,
		PracticePermanentJobModal
  },
  data (){
    return {
      permanent_job: '',
      permanent_job_applications: [],
    }
  },
  async asyncData({ app, route, store }) {
    try {
      
      // if (app.$auth.user.domain === 'Practice') {
      //   let response = await app.$axios.$get(`/api/v1/practice/permanent-jobs/${route.params.id}`)
      //   const permanent_job = response.data.permanent_job
      //   console.log('permanentn job', permanent_job)
      //   response = await app.$axios.$get(`/api/v1/practice/permanent-job-applications?permanent_job_id=${route.params.id}`)
      //   const permanent_job_applications = response.data.permanent_job_applications
      // }
    
      // return{
      //   permanent_job,
      //   permanent_job_applications,
      // }
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