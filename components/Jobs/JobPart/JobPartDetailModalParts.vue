<template>
  <div class="relative flex flex-col w-full my-5">
    <div class="text-md font-bold">Job Parts</div>
    <div v-if="parts.length === 0 && loading" class="relative flex w-full" style="min-height:80px">
      <AppLoading :loading="loading" spinner />
    </div>
    <AppTable
      v-if="parts.length > 0"
      :total="total"
      :items="parts"
      :currentPage="current_page"
      :perPage="params.limit"
      :columns="columns"
      :loading="loading"
      :routerLink="routerLink"
      :customWidth="600"
      @pagechanged="pagechanged"
      @limitchanged="limitchanged"
    />
  </div>
</template>
<script>
import AppLoading from "@/components/Base/AppLoading";
import AppTable from "@/components/Base/AppTable";
export default {
  components: {
    AppTable,
    AppLoading
  },

  props: {
    job_id: {
      type: [String, Number],
      default: () => null
    },
    disabledLink: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      loading: false,
      total: 0,
      parts: [],
      current_page: 1,
      // app table params
      params: {
        job_id: null,
        limit: 5,
        offset: 0
      },
      // app table
      columns: [
        {
          name: "Job Part Number",
          dataIndex: "job_part_number",
          class: "text-center"
        },
        {
          name: "Date Start",
          dataIndex: "date_start",
          class: "text-center"
        },
        {
          name: "Date End",
          dataIndex: "date_end",
          class: "text-center"
        },
        {
          name: "Status",
          dataIndex: "locum_status",
          class: "text-center"
        }
      ]
    };
  },

  computed: {
    totalPages() {
      return Math.ceil(this.total / this.params.limit);
    }
  },

  async mounted() {
    this.loading = true;
    this.params.job_id = this.job_id;
    try {
      Promise.all([
        this.$axios.$get(`/api/v1/locum/job-parts/count`, {
          params: this.params
        }),
        this.$axios.$get(`/api/v1/locum/job-parts`, {
          params: this.params
        })
      ])
        .then(([responseCount, responseJobParts]) => {
          this.total = responseCount.data.count;
          let parts = responseJobParts.data.job_parts;
          parts = parts.map(part => {
            return {
              ...part,
              date_start: this.$moment(part.date_start, "YYYY-MM-DD").format(
                "DD-MM-YYYY"
              ),
              date_end: this.$moment(part.date_end, "YYYY-MM-DD").format(
                "DD-MM-YYYY"
              ),
              locum_status:
                part.locum_status === "Declined"
                  ? "Withdrawn"
                  : part.locum_status === "Matched"
                  ? "Available"
                  : part.locum_status
            };
          });
          this.parts = parts;
        })
        .finally(() => {
          this.loading = false;
        });
    } catch (err) {
      console.log("err", err.response || err);
      if (err.response.data.message) {
        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "danger",
          text: [`${err.response.data.message}`]
        });
      }
      this.loading = false;
      throw err;
    }
  },

  methods: {
    routerLink(jobPart) {
      if (this.disabledLink) {
        return this.$route;
      }

      if (
        this.$route.name === "jobs-index-id" ||
        this.$route.name === "jobs-index-id-job-parts-jobPartId"
      ) {
        return {
          name: "jobs-index-id-job-parts-jobPartId",
          params: {
            ...this.$route.params,
            jobPartId: jobPart.id
          },
          query: {
            ...this.$route.query
          }
        };
      }

      if (
        this.$route.name ===
          "my-practice-index-platform-practiceId-index-related-jobs-index" ||
        this.$route.name ===
          "my-practice-index-platform-practiceId-index-related-jobs-index-jobId"
      ) {
        return {
          name:
            "my-practice-index-platform-practiceId-index-related-jobs-index-jobId",
          params: {
            ...this.$route.params,
            jobId: jobPart.id
          },
          query: {
            ...this.$route.query
          }
        };
      }

      return {
        name: "dashboard-id",
        params: {
          id: jobPart.id
        },
        query: {
          ...this.$route.query
        }
      };
    },

    getJobParts(params) {
      this.loading = true;
      this.$axios.$get(`/api/v1/locum/job-parts`, { params }).then(res => {
        this.loading = false;
        this.parts = res.data.job_parts;
      });
    },
    pagechanged(page) {
      this.current_page = page;
      this.params.offset = this.params.limit * (page - 1);
      this.getJobParts(this.params);
    },
    limitchanged(limit) {
      this.current_page = 1;
      this.params.offset = 0;
      this.params.limit = limit;
      this.getJobParts(this.params);
    }
  }
};
</script>
