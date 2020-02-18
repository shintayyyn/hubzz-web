<template>
  <div>
    <template v-if="$auth.user.domain ===  'Practice'">
			<AppTable
				class="w-full"
				v-if="permanent_job_count > 0"
				:total="permanent_job_count"
				:items="permanent_jobs"
				:currentPage="current_page"
				:perPage="params.limit"
				:columns="columns"
				:loading="loading"
				:routerLink="`/hub-surgery-management/${$route.params.id}/surgery-permanent-jobs`"
				@pagechanged="pagechanged"
				@limitchanged="limitchanged"
			></AppTable>
			<p
				v-else
				class="text-gray-600 px-3 py-2"
			>No {{ $route.query.status ? $route.query.status : 'Available'}} jobs yet.</p>
		</template>
  </div>
</template>

<script>
import AppTable from "@/components/Base/AppTable";
export default {
  components:{
    AppTable,
  },
  data(){
    return {
      total: 0,
			current_page: 1,
			// app table params
			params: {
				job_id: null,
				limit: 5,
				offset: 0
			},
			loading: false,
      columns: [
				{
					name: "Title",
					dataIndex: "title"
				},
				{
					name: "Surgery",
					dataIndex: "practice.name"
				},
				{
					name: "Salary",
					dataIndex: "salary_amount",
					class: "text-center"
				},
				{
					name: "Posted",
					dataIndex: "date_posted",
					class: "text-center localDate"
				},
				{
					name: "Closes",
					dataIndex: "date_closing",
					class: "text-center localDate"
				},
				// {
				// 	name: "Role",
				// 	dataIndex: "role",
				// 	class: "text-center"
				// },
				{
					name: "Work Hours",
					dataIndex: "work_hours",
					class: "text-center"
				},
				{
					name: "Profession",
					dataIndex: "professions.name",
					class: "text-center"
				},
				{
					name: "Industry",
					dataIndex: "industry_type",
					class: "text-center"
				}
      ], 
      practice_surgery: '',
      permanent_job_count: 0,
			permanent_jobs: [],

			permanent_job_applications_count: 0,
			permanent_job_applications: [],
    }
  },
  middleware({ query, redirect, error }) {
		if (
			query.status &&
			!["available", "closed", "unfilled", "pending"].includes(query.status.toLowerCase())
		) {
			return error({
				status: 404,
				message: "This Permanent Job Status is Invalid"
			});
		}
  },
  created(){
    console.log('permanent jobs', this.$route.name)
  },
  watch: {
		"$route.query.status"(newStatus, oldStatus) {
			let params = {};
      console.log('new status', newStatus)
      params = {
        job_posting_status: newStatus ? newStatus : "Available",
        practice_id: this.practice_surgery.child_practice_id
      };
      setTimeout(async () => {
        this.loading = true;
        await this.getSurgeryPermanentJobs(params);
        this.loading = false;
      })
    
		}
  },
  
  async asyncData({ app, route, store, auth }) {
		try {
      let response = await app.$axios.$get(`/api/v1/practice/me/practice-surgeries/${route.params.id}`)

      const practice_surgery = response.data.practice_surgery

			let permanent_job_count = "";
			let permanent_jobs = "";

			let permanent_job_applications_count = "";
			let permanent_job_applications = "";

      let params = {};
      
      params = {
        job_posting_status: route.query.status
          ? route.query.status
          : "Available",
        practice_id: practice_surgery.child_practice_id
      };

      response = await app.$axios.$get(
        `/api/v1/practice/permanent-jobs/count`,
        { params }
      );

      permanent_job_count =
        response.data && response.data.count ? response.data.count : null;
    
      response = await app.$axios.$get(`/api/v1/practice/permanent-jobs`, {
        params
      });

      permanent_jobs =
        response.data && response.data.permanent_jobs
          ? response.data.permanent_jobs
          : null;
            
			return {
        practice_surgery,
				permanent_job_count,
				permanent_jobs,
				permanent_job_applications_count,
				permanent_job_applications,
				params
			};
		} catch (err) {
			if (err.response && err.response.status === 401) {
				error(err.response.data);
				return;
			}
			throw err;
		}
  },
  
  methods:{
    async getSurgeryPermanentJobs(params) {
    await this.$axios
      .$get("/api/v1/practice/permanent-jobs/count", { params })
      .then(res => {
        console.log("permanent", res);
        this.permanent_job_count =
          res.data && res.data.count ? res.data.count : null;
      });

    await this.$axios
      .$get(`/api/v1/practice/permanent-jobs`, { params })
      .then(res => {
        this.permanent_jobs =
          res.data && res.data.permanent_jobs
            ? res.data.permanent_jobs
            : null;
      });
    },
    async pagechanged(page) {
			this.current_page = page;
			this.params.offset = this.params.limit * (page - 1);
			this.loading = true;
			this.getSurgeryPermanentJobs(this.params);
			this.loading = false;
    },
    async limitchanged(limit) {
			this.current_page = 1;
			this.params.offset = 0;
			this.params.limit = limit;
			this.params.offset = 0;
			this.params.limit = limit;
			this.loading = true;
			this.getSurgeryPermanentJobs(this.params);
			this.loading = false;
		}
  },

  
}
</script>

<style>

</style>