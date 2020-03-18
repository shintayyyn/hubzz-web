<template>
  <section class="flex flex-col items-start w-full">
    <div class="w-full">
      <AppInput
        v-model="search"
        :type="'text'"
        :name="'search'"
        :placeholder="'ID, Practice Name, Profession Name or keywords'"
      />
    </div>
    <template v-if="$auth.user.domain === 'Practice'">
      <AppTable
        v-if="permanent_jobs_for_practice_count > 0"
        class="w-full"
        :total="permanent_jobs_for_practice_count"
        :items="permanent_jobs_for_practice"
        :current-page="current_page"
        :per-page="params.limit"
        :columns="practiceColumns"
        :loading="loading"
        :router-link="'/permanent-jobs'"
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

    <template v-if="$auth.user.domain === 'Locum'">
      <AppTable
        v-if="permanent_jobs_for_locum_count > 0"
        class="w-full"
        :total="permanent_jobs_for_locum_count"
        :items="permanent_jobs_for_locum"
        :current-page="current_page"
        :per-page="params.limit"
        :columns="locumColumns"
        :loading="loading"
        :router-link="'/permanent-jobs'"
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
              class="rounded-full px-6 py-1 text-black"
              :class="jobClosingTag(slotProps.item) === 'Rejected' ? 'bg-red-500 text-white' : 'bg-yellow-400'"
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
    <div
      v-if="['permanent-jobs-index-id','permanent-jobs-index-create'].includes($route.name)"
      class="shield"
      @click="$router.go(-1)"
    />
    <nuxt-child />
  </section>
</template>
<script>
// var moment = require("moment")
import debounce from "lodash.debounce"
import AppTable from "@/components/Base/AppTable"
import AppInput from "@/components/Base/AppInput"
export default {
	components: {
		// AppButton,
    AppTable,
    AppInput,
	},
	// eslint-disable-next-line no-unused-vars
	middleware ({ query, redirect, error }) {
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

	data () {
		return {
      search: '',
			total: 0,
			current_page: 1,
			// app table params
			params: {
				job_id: null,
				limit: 5,
        offset: 0,
        search: '',
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
          dataIndex: "title",
          class:"text-center"
				},
				{
					name: "Surgery",
          dataIndex: "practice.name",
          class:"text-center"
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
        },
			],

			locumColumns: [],
      practiceColumns: [],

			permanent_job_count: 0,
      permanent_jobs: [],
      
      permanent_jobs_for_practice: [],
      permanent_jobs_for_practice_count: 0,

			permanent_job_applications_count: 0,
			permanent_job_applications: [],

			permanent_jobs_for_locum_count: 0,
			permanent_jobs_for_locum: []
		}
	},

	watch: {
		// eslint-disable-next-line no-unused-vars
		"$route.query.status" (newStatus, oldStatus) {
      this.params = {}
      this.current_page = 1
      
      Promise.all([
        this.locumColumns = [],
        this.practiceColumns = [],
      ]).then(() => {
        if(this.$auth.user.domain === "Locum") {
          this.locumColumns = this.defaultColumns
        } else if (this.$auth.user.domain === "Practice") {
          this.practiceColumns = this.defaultColumns
        }
        if (!newStatus || newStatus !== "Closed" || newStatus === "Pending") {
          if(!newStatus) {
            newStatus = "Available"
          } 
          if(this.$auth.user.domain === "Locum") {
            this.locumColumns = [
              ...this.defaultColumns,
              {
                name: "Status",
                slot: true,
                slotName: "status_slot",
                dataIndex: "",
                class: "text-center"
              },
            ]
          } else if (this.$auth.user.domain === "Practice") {
            this.practiceColumns = [
              ...this.defaultColumns,
              {
                name: "Status",
                slot: true,
                slotName: "status_slot",
                dataIndex: "",
                class: "text-center"
              },
            ]
          }
        } else if (newStatus === "Closed") {
          if(this.$auth.user.domain === "Locum") {
            this.locumColumns = [
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
          
          } else if (this.$auth.user.domain === "Practice") {
            this.practiceColumns = [
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
        }
        if (this.$auth.user.domain === "Locum") {
          console.log('get for locum in watch')
          this.params = {
            job_posting_status: newStatus ? newStatus : 'Available',
            locum_user_id: this.$auth.user.id,
            profession_id: this.$auth.user.locum_detail.profession.id,
            near_post_code: this.$auth.user.locum_postcode,
            limit: 5,
          }
          setTimeout(async () => {
            this.loading = true
            await this.getPermanentJobsForLocum(this.params)
            this.loading = false
          })
          this.loading = false
        } else if (this.$auth.user.domain === "Practice") {
          this.params = {
            job_posting_status: newStatus ? newStatus : 'Available',
            practice_id: this.$auth.user.practice_id,
            limit: 5,
          }
          console.log('get for practice in watch', this.params)

          setTimeout(async () => {
            this.loading = true
            await this.getPermanentJobsForPractice(this.params)
            this.loading = false
          })
        } 
      })
    },

    search (value) {
      this.searchSubmit(value)
    }
    
	},  

	async asyncData ({ app, route, }) {
		try {
      // FOR PRACTICE ONLY
      let permanent_jobs_for_practice = ""
      let permanent_jobs_for_practice_count = ""
			// FOR LOCUM ONLY
			let permanent_job_applications_count = ""
			let permanent_job_applications = ""
			let permanent_jobs_for_locum = ""
			let permanent_jobs_for_locum_count = ""
      let params = {}
      
      // ------------------FOR LOCUM---------------
			if (app.$auth.user.domain === "Locum") {
				params = {
					job_posting_status: route.query.status
						? route.query.status
            : "Available",
          locum_user_id: app.$auth.user.id,
					profession_id: app.$auth.user.locum_detail.profession.id,
          near_post_code: app.$auth.user.locum_postcode,
         limit: 5,
        }
				let response = await app.$axios.$get(
					`/api/v1/locum/permanent-jobs/count`,
					{ params }
				)
				permanent_jobs_for_locum_count =
					response.data && response.data.count ? response.data.count : null

				response = await app.$axios.$get(`/api/v1/locum/permanent-jobs`, {
					params
				})
				permanent_jobs_for_locum =
					response.data && response.data.permanent_jobs
						? response.data.permanent_jobs
						: null

				response = await app.$axios.$get(
					`/api/v1/locum/permanent-job-applications/count`
				)
				permanent_job_applications_count =
					response.data && response.data.count ? response.data.count : null

				response = await app.$axios.$get(
					`/api/v1/locum/permanent-job-applications`
				)
				permanent_job_applications =
					response.data && response.data.permanent_job_applications
						? response.data.permanent_job_applications
						: null

				permanent_jobs_for_locum = permanent_jobs_for_locum.map(permanent_job => {
					const permanent_job_app_found = permanent_job_applications.find(
						permanent_job_application =>
							permanent_job_application.permanent_job_id === permanent_job.id
					)
					if (permanent_job_app_found) {
            if(permanent_job_app_found.application_status === 'Rejected') {
              permanent_job.status = 'Closed'
            } else {
              permanent_job.status = permanent_job_app_found.application_status
            }
					} else {
						if (permanent_job.job_posting_status === 'Closed') {
              permanent_job.status = "Closed"
            } else if (permanent_job.job_posting_status === 'Unfilled' ) {
              permanent_job.status = "Unfilled"
            } else if (permanent_job.job_posting_status === 'Available' ) {
              permanent_job.status = "Available"
            }
					}
					return permanent_job
        }) 
         // ------------------FOR PRACTICE---------------
			} else if (app.$auth.user.domain === "Practice") {
				params = {
					job_posting_status: route.query.status
						? route.query.status
						: "Available",
          practice_id: app.$auth.user.practice_id,
         limit: 5,
				}
				let response = await app.$axios.$get(
					`/api/v1/practice/permanent-jobs/count`,
					{ params }
				)
				permanent_jobs_for_practice_count =
					response.data && response.data.count ? response.data.count : null
      
				response = await app.$axios.$get(`/api/v1/practice/permanent-jobs`, {
					params
				})

				permanent_jobs_for_practice =
					response.data && response.data.permanent_jobs
						? response.data.permanent_jobs
            : null
        
        response = await app.$axios.$get(
					`/api/v1/practice/permanent-job-applications`
				)
				permanent_job_applications =
					response.data && response.data.permanent_job_applications
						? response.data.permanent_job_applications
						: null

				permanent_jobs_for_practice = permanent_jobs_for_practice.map(permanent_job => {
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
        
        // permanent_jobs_for_practice_count = permanent_jobs_for_practice.length
			}
			return {
				permanent_jobs_for_practice_count,
        permanent_jobs_for_practice,
        permanent_jobs_for_locum_count,
				permanent_jobs_for_locum,
				permanent_job_applications_count,
				permanent_job_applications,
				params
			}
		} catch (err) {
			if (err.response && err.response.status === 401) {
        console.log('something went wrong')
				// error(err.response.data)
				return
			}
			throw err
		}
  },
  
  created () {
    if(this.$auth.user.domain === "Locum") {
      this.locumColumns = [
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
        this.locumColumns = [
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
    }else if (this.$auth.user.domain === "Practice") {
      this.practiceColumns =[
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
        this.practiceColumns = [
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
    }
  },

	methods: {
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
		getJobs (params) {
			if (this.$auth.user.domain === "Locum") {
        console.log('get for locum in pagechanged')
				this.getPermanentJobsForLocum(params)
			}
			if (this.$auth.user.domain === "Practice") {
        console.log('get for practice in page changed')
				this.getPermanentJobsForPractice(params)
			}
    },
    
    searchSubmit: debounce(function (value) {
      console.log('get for locum in search')
      this.params.search = value
      
			if (this.$auth.user.domain === "Locum") {
				this.getPermanentJobsForLocum(this.params)
			}
			if (this.$auth.user.domain === "Practice") {
				this.getPermanentJobsForPractice(this.params)
      }
      
    }, 500),

		async getPermanentJobsForLocum (params) {
      // params = {
      //   ...params,
      //   search: this.params.search,
      // }
      
			await this.$axios
				.$get(`/api/v1/locum/permanent-jobs/count`, { params })
				.then(res => {
					this.permanent_jobs_for_locum_count =
						res.data && res.data.count ? res.data.count : null
				})

			await this.$axios
				.$get(`/api/v1/locum/permanent-jobs`, { params })
				.then(res => {
					this.permanent_jobs_for_locum =
						res.data && res.data.permanent_jobs
							? res.data.permanent_jobs
							: null
				})

			await this.$axios
				.$get(`/api/v1/locum/permanent-job-applications/count`)
				.then(res => {
					this.permanent_job_applications_count =
						res.data && res.data.count ? res.data.count : null
				})

			await this.$axios
				.$get(`/api/v1/locum/permanent-job-applications`)
				.then(res => {
					this.permanent_job_applications =
						res.data && res.data.permanent_job_applications
							? res.data.permanent_job_applications
							: null
        })
      console.log('get for locum in function', this.permanent_jobs_for_locum)

			this.permanent_jobs_for_locum = await this.permanent_jobs_for_locum.map(permanent_job => {
				const permanent_job_app_found = this.permanent_job_applications.find(
					permanent_job_application =>
						permanent_job_application.permanent_job_id === permanent_job.id
				)

        if (permanent_job_app_found) {
          if(permanent_job_app_found.application_status === 'Rejected') {
            permanent_job.status = 'Closed'
          } else {
            permanent_job.status = permanent_job_app_found.application_status
          }
        } else {
          if (permanent_job.job_posting_status === 'Closed') {
            permanent_job.status = "Closed"
          } else if (permanent_job.job_posting_status === 'Unfilled' ) {
            permanent_job.status = "Unfilled"
          }  else if (permanent_job.job_posting_status === 'Available' ) {
            permanent_job.status = "Available"
          }
        }
				return permanent_job
      })
		},

		async getPermanentJobsForPractice (params) {
      params = {
        ...params,
        search: this.params.search,
      }
			await this.$axios
				.$get("/api/v1/practice/permanent-jobs/count", { params })
				.then(res => {
					this.permanent_jobs_for_practice_count =
						res.data && res.data.count ? res.data.count : null
				})

			await this.$axios
				.$get(`/api/v1/practice/permanent-jobs`, { params })
				.then(res => {
					this.permanent_jobs_for_practice =
						res.data && res.data.permanent_jobs
							? res.data.permanent_jobs
							: null
        })
      
      await this.$axios
				.$get(`/api/v1/practice/permanent-job-applications/count`)
				.then(res => {
					this.permanent_job_applications_count =
						res.data && res.data.count ? res.data.count : null
				})

			await this.$axios
				.$get(`/api/v1/practice/permanent-job-applications`)
				.then(res => {
					this.permanent_job_applications =
						res.data && res.data.permanent_job_applications
							? res.data.permanent_job_applications
							: null
        })

      console.log('get for practice in function', this.permanent_jobs_for_practice)

			this.permanent_jobs_for_practice = await this.permanent_jobs_for_practice.map(permanent_job => {
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
        
        return permanent_job
			})
		},
		// async sorted (order_by) {
		// 	let orderBy = order_by.map(item => {
		// 		let order = item.split(":")[1]
		// 		let sorting = item.split(":")[0]
		// 		switch (sorting) {
		// 			case "date_time_start":
		// 				sorting = "date_start"
		// 				break
		// 			case "date_time_end":
		// 				sorting = "date_end"
		// 				break
		// 			case "rate_name":
		// 				sorting = "rate"
		// 				break
		// 			default:
		// 				sorting
		// 		}
		// 		return `${sorting}:${order}`
		// 	})
		// 	this.current_page = 1
		// 	this.params.offset = 0
		// 	this.params.order_by = orderBy
		// 	this.jobPartParams.offset = 0
		// 	this.jobPartParams.order_by = orderBy
		// 	this.loading = true
		// 	await this.getJobs(this.isJobPart ? this.jobPartParams : this.params)
		// 	this.loading = false
		// },
		async pagechanged (page) {
      this.current_page = page
      this.params.offset = this.params.limit * (page - 1)
			this.loading = true
			this.getJobs(this.params)
			this.loading = false
		},
		async limitchanged (limit) {
			this.current_page = 1
			this.params.offset = 0
			this.params.limit = limit
			this.loading = true
			this.getJobs(this.params)
			this.loading = false
		}
	}
}
</script>
