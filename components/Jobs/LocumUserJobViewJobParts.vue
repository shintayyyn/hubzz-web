<template>
  <div class="relative flex flex-col w-full mb-4">
    <div class="text-md font-bold">
      Job Parts
    </div>

    <AppTable
      v-if="parts.length > 0"
      :total="jobPartCount"
      :items="parts"
      :currentPage="currentPage"
      :perPage="params.limit"
      :columns="columns"
      :loading="loading"
      :routerLink="routerLink"
      :customWidth="600"
      minHeight="unset"
      @pagechanged="pagechanged"
      @limitchanged="limitchanged"
    />
  </div>
</template>

<script>
import AppTable from "@/components/Base/AppTable"

export default {
  components: {
    AppTable,
  },

  props: {
    jobId: {
      type: Number,
      required: true,
    },

    disabledLink: {
      type: Boolean,
      default: false,
    },
  },

  data () {
    return {
      loading: false,
      jobPartCount: 0,
      parts: [],
      currentPage: 1,
      // app table params
      params: {
        job_id: null,
        limit: 5,
        offset: 0,
      },
      // app table
      columns: [
        {
          name: "Job Part Number",
          dataIndex: "job_part_number",
          class: "text-center",
        },
        {
          name: "Date Start",
          dataIndex: "date_start_in_gb_formatted",
          class: "text-center",
        },
        {
          name: "Date End",
          dataIndex: "date_end_in_gb_formatted",
          class: "text-center",
        },
        {
          name: "Status",
          dataIndex: "locum_job_part_status",
          class: "text-center",
        },
      ],
    }
  },

  computed: {
    totalPages () {
      return Math.ceil(this.jobPartCount / this.params.limit)
    },
  },

  async mounted () {
    this.loading = true
    this.params.job_id = this.jobId
    try {
      Promise.all([
        this.$axios.$get(`/api/v2/locum/locum-user-job-parts/count`, {
          params: this.params,
        }),
        this.$axios.$get(`/api/v2/locum/locum-user-job-parts?job_relation_only=true`, {
          params: this.params,
        }),
      ])
        .then(([responseCount, responseJobParts,]) => {
          this.jobPartCount = responseCount.data.count
          this.parts = responseJobParts.data.job_parts
        })
        .finally(() => {
          this.loading = false
        })
    } catch (err) {
      console.log("err", err.response || err)
      if (err.response.data.message) {
        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "danger",
          text: [`${err.response.data.message}`,],
        })
      }
      this.loading = false
      throw err
    }
  },

  methods: {
    routerLink (jobPart) {
      if (this.disabledLink) {
        return this.$route
      }

      if (
        this.$route.name === "jobs-index-id"
        || this.$route.name === "jobs-index-id-job-parts-jobPartId"
      ) {
        return {
          name: "jobs-index-id-job-parts-jobPartId",
          params: {
            ...this.$route.params,
            jobPartId: jobPart.id,
          },
          query: {
            ...this.$route.query,
          },
        }
      }

      if (this.$route.name === "locum-job-parts-index-jobPartId") {
        return {
          name: "locum-job-parts-index-jobPartId",
          params: {
            jobPartId: jobPart.id,
          },
          query: {
            ...this.$route.query,
          },
        }
      }

      if (
        this.$route.name
          === "my-practice-index-platform-practiceId-index-related-jobs-index"
        || this.$route.name
          === "my-practice-index-platform-practiceId-index-related-jobs-index-jobId"
      ) {
        return {
          name:
            "my-practice-index-platform-practiceId-index-related-jobs-index-jobId",
          params: {
            ...this.$route.params,
            jobId: jobPart.id,
          },
          query: {
            ...this.$route.query,
          },
        }
      }

      return {
        name: "dashboard-id",
        params: {
          id: jobPart.id,
        },
        query: {
          ...this.$route.query,
        },
      }
    },

    getJobParts (params) {
      this.loading = true
      this.$axios.$get(`/api/v2/locum/locum-user-job-parts?job_relation_only=true`, { params, }).then(res => {
        this.loading = false
        this.parts = res.data.job_parts
      })
    },

    pagechanged (page) {
      this.currentPage = page
      this.params.offset = this.params.limit * (page - 1)
      this.getJobParts(this.params)
    },

    limitchanged (limit) {
      this.currentPage = 1
      this.params.offset = 0
      this.params.limit = limit
      this.getJobParts(this.params)
    },
  },
}
</script>
