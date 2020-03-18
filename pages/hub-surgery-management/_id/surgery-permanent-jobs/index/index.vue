<template>
  <div>
    <template v-if="$auth.user.domain === 'Practice'">
      <AppTable
        v-if="permanent_job_count > 0"
        class="w-full"
        :total="permanent_job_count"
        :items="permanent_jobs"
        :currentPage="current_page"
        :perPage="params.limit"
        :columns="columns"
        :loading="loading"
        :routerLink="`/hub-surgery-management/${$route.params.id}/surgery-permanent-jobs`"
        @pagechanged="pagechanged"
        @limitchanged="limitchanged"
      >
        <template v-slot:salary_slot="slotProps">
          <template v-if="slotProps.item.salary_amount !== 0">
            {{ slotProps.item.salary_amount | currency }}
          </template>
          <template v-else>
            N/A
          </template>
        </template>

        <template v-slot:status_slot="slotProps">
          <div class="flex items-center justify-center">
            <div
              class="rounded-full px-6 py-1"
              :class="statusStyle(slotProps.item.status)"
            >
              {{ slotProps.item.status }}
            </div>
          </div>
        </template>

        <template
          v-if="$route.query.status === 'Closed'"
          v-slot:closing_tag="slotProps"
        >
          <div class="flex items-center justify-center">
            <div
              class="rounded-full px-6 py-1 bg-yellow-400 text-black"
            >
              {{ jobClosingTag(slotProps.item) }}
            </div>
          </div>
        </template>
      </AppTable>
      <p
        v-else
        class="text-gray-600 px-3 py-2"
      >
        No {{ $route.query.status ? $route.query.status : 'Available' }} jobs yet.
      </p>
    </template>
  </div>
</template>

<script>
import AppTable from "@/components/Base/AppTable"
export default {
  components:{
    AppTable,
  },
  data (){
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
      
      defaultColumns: [
        {
          name: "ID",
          dataIndex: "id",
          class:"text-center"
        },
				{
					name: "Title",
					dataIndex: "title"
				},
				{
					name: "Surgery",
					dataIndex: "practice.name"
				},
				{
					name: "Salary £",
					slotName: "salary_slot",
					dataIndex: "",
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
      columns: [],

      practice_surgery: '',
      permanent_job_count: 0,
			permanent_jobs: [],

			permanent_job_applications_count: 0,
			permanent_job_applications: [],
    }
  },
  middleware ({ query, error }) {
		if (
			query.status &&
			!["available", "closed", "unfilled", "pending"].includes(query.status.toLowerCase())
		) {
			return error({
				status: 404,
				message: "This Permanent Job Status is Invalid"
			})
		}
  },
  watch: {
		"$route.query.status" (newStatus) {
      this.params = {}
      this.current_page = 1
      Promise.all([
        this.columns = []
      ]).then(() => {
        if (!newStatus || newStatus !== "Closed" || newStatus === "Pending") {
          if(!newStatus) {
            newStatus = "Available"
          } 
          this.columns = [
            ...this.defaultColumns,
            {
              name: "Status",
              slot: true,
              slotName: "status_slot",
              dataIndex: "",
              class: "text-center"
            },
          ]
        } else if (newStatus === "Closed") {
          this.columns = [
            ...this.defaultColumns,
            {
              name: "Closed At",
              dataIndex: "closed_at",
              class: "text-center localDate"
            },
            {
              name: "Status",
              slot: true,
              slotName: "status_slot",
              dataIndex: "",
              class: "text-center"
            },
            {
              name: "Closing tag",
              slot: true,
              slotName: "closing_tag",
              dataIndex: "",
              class: "text-center"
            },
          ]
        }

        console.log('new status', newStatus)
        this.params = {
          job_posting_status: newStatus,
          practice_id: this.practice_surgery.child_practice_id,
          limit: 5
        }
        setTimeout(async () => {
          this.loading = true
          await this.getSurgeryPermanentJobs(this.params)
          this.loading = false
        })
      })
     
		}
  },
  
  async asyncData ({ app, route }) {
		try {
      let response = await app.$axios.$get(`/api/v1/practice/me/practice-surgeries/${route.params.id}`)

      const practice_surgery = response.data.practice_surgery

			let permanent_job_count = ""
      let permanent_jobs = ""

			let permanent_job_applications_count = ""
			let permanent_job_applications = ""

      let params = {}
      
      params = {
        job_posting_status: route.query.status
          ? route.query.status
          : "Available",
        practice_id: practice_surgery.child_practice_id,
        limit: 5,
      }

      response = await app.$axios.$get(
        `/api/v1/practice/permanent-jobs/count`,
        { params }
      )

      permanent_job_count =
        response.data && response.data.count ? response.data.count : null
    
      response = await app.$axios.$get(`/api/v1/practice/permanent-jobs`, {
        params
      })

      permanent_jobs =
        response.data && response.data.permanent_jobs
          ? response.data.permanent_jobs
          : null
      
      response = await app.$axios.$get(`/api/v1/practice/permanent-job-applications`)

      permanent_job_applications = 
        response.data && 
        response.data.permanent_job_applications 
        ? response.data.permanent_job_applications 
        : null
      
      permanent_jobs = permanent_jobs.map(permanent_job => {
        const permanent_job_app_found = permanent_job_applications.find(
          permanent_job_application => permanent_job_application.permanent_job_id === permanent_job.id
        )
        if (permanent_job_app_found) {
          // DIFFERENT STATUSES ONLY IF IN AVAILABLE TAB
          if (route.query.status === permanent_job.job_posting_status) {
            permanent_job.status = permanent_job.job_posting_status
          } else {
            permanent_job.status = 'Applied'
          } 
        } else {
          permanent_job.status = permanent_job.job_posting_status
        }
        return permanent_job
      })

			return {
        practice_surgery,
				permanent_job_count,
				permanent_jobs,
				permanent_job_applications_count,
				permanent_job_applications,
				params
			}
		} catch (err) {
			if (err.response && err.response.status === 401) {
        console.log('something went wrong')
				return
			}
			throw err
		}
  },
  created (){
    this.columns =[
      ...this.defaultColumns,
      {
        name: "Status",
        slot: true,
        slotName: "status_slot",
        dataIndex: "",
        class: "text-center"
      },
    ]
    if(this.$route.query.status){
      this.columns = [
        ...this.defaultColumns,
        {
          name: "Closed At",
          dataIndex: "closed_at",
          class: "text-center localDate"
        },
        {
          name: "Status",
          slot: true,
          slotName: "status_slot",
          dataIndex: "",
          class: "text-center"
        },
        {
          name: "Closing Tag",
          slot: true,
          slotName: "closing_tag",
          dataIndex: "",
          class: "text-center"
        },
      ]
    }
  },
  
  methods:{
    statusStyle (jobStatus) {
			switch (jobStatus) {
				case "Available":
					return "bg-green-500 text-white"
				case "Applied":
					return "bg-yellow-600 text-white"
				case "For Interview":
					return "bg-green-600 text-white"
				case "Accepted":
					return "bg-green-700 text-white"
				case "Rejected":
					return "bg-red-700 text-white"
				case "Closed":
					return "bg-gray-700 text-white"
				case "Unsuccessful":
					return "bg-gray-400"
				default:
					return "bg-yellow-400 text-black"
			}
		},
    async getSurgeryPermanentJobs (params) {
      console.log('params', params)
      await this.$axios
        .$get("/api/v1/practice/permanent-jobs/count", { params })
        .then(res => {
          console.log("permanent", res)
          this.permanent_job_count =
            res.data && res.data.count ? res.data.count : null
          console.log('permanent job count', res.data.count)
        })

      await this.$axios
        .$get(`/api/v1/practice/permanent-jobs`, { params })
        .then(res => {
          this.permanent_jobs =
            res.data && res.data.permanent_jobs
              ? res.data.permanent_jobs
              : null
          console.log('permanent jobs', res.data.permanent_jobs)
        })
      
      await this.$axios
        .$get(`/api/v1/practice/permanent-job-applications/count`)
        .then(res => {
          this.permanent_job_applications_count =
            res.data && res.data.count ? res.data.count : null
          console.log('permanent applications count', res.data.count)
        })

      await this.$axios
      .$get(`/api/v1/practice/permanent-job-applications`)
      .then(res => {
        this.permanent_job_applications =
          res.data && res.data.permanent_job_applications
            ? res.data.permanent_job_applications
            : null
        console.log('permanent applications', res.data.permanent_job_applications)
      })

      this.permanent_jobs = await this.permanent_jobs.map(permanent_job => {
        const permanent_job_app_found = this.permanent_job_applications.find(
          permanent_job_application =>
            permanent_job_application.permanent_job_id === permanent_job.id
        )
          
        if (permanent_job_app_found) {
          if (this.$route.query.status) {
            permanent_job.status = permanent_job.job_posting_status
          } else {
            permanent_job.status = 'Applied'
          } 
        } else {
          permanent_job.status = permanent_job.job_posting_status
        }
        console.log('permanent_job', permanent_job)
        return permanent_job
			})
    },
    jobClosingTag (item) {
      let closingTag = ''
      if(this.$auth.user.domain === 'Locum') {
        const permJobApp = item.permanent_job_applications.find(permJobApp => 
          permJobApp.applicant_locum_user_id === this.$auth.user.id
        )
        if(permJobApp && permJobApp.application_status === 'Rejected') {
          closingTag = 'Rejected'
        } else {
          closingTag = item.hired_through
        }
      } else {
        closingTag = item.hired_through
      }
      
      switch(closingTag) {
        case "Direct Hiring":
          return "Hired Directly"
        case "Through HUBZZ":
          return "Hired Through Hubzz"
        case "Rejected":
          return "Rejected"
        case "Unfilled":
          return "Unfilled"
        default:
          return "Closed By Practice"
      }
    },
    async pagechanged (page) {
			this.current_page = page
			this.params.offset = this.params.limit * (page - 1)
			this.loading = true
			this.getSurgeryPermanentJobs(this.params)
			this.loading = false
    },
    async limitchanged (limit) {
			this.current_page = 1
			this.params.offset = 0
			this.params.limit = limit
			this.params.offset = 0
			this.params.limit = limit
			this.loading = true
			this.getSurgeryPermanentJobs(this.params)
			this.loading = false
		}
  },
}
</script>

<style>

</style>