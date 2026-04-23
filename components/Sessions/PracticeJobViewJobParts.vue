<template>
  <div class="relative flex flex-col w-full border rounded-lg p-4">
    <div class="text-md font-bold">
      Job Parts
    </div>

    <div
      v-if="jobParts.length === 0 && loading"
      class="relative flex w-full"
      style="min-height:80px"
    >
      <AppLoading :loading="loading" spinner />
    </div>

    <AppTable
      v-if="jobParts.length > 0"
      :total="count"
      :items="jobParts"
      :currentPage="currentPage"
      :perPage="limit"
      :columns="columns"
      :loading="loading"
      :routerLink="routerLink"
      minHeight="unset"
      :customWidth="650"
      @pagechanged="_currentPage => (currentPage = _currentPage)"
      @limitchanged="_limit => (limit = _limit)"
    >
      <template v-slot:complete="slotProps">
        <button
          v-if="slotProps.item.practice_job_part_status === 'Ongoing'"
          class="text-white px-3 py-1 rounded-lg text-xs transition-hover focus:outline-none"
          :class="
            slotProps.item.practice_job_part_status === 'Ongoing' &&
              ($route.name.includes('hub-surgery-management')
                ? authPermissions.includes('Update Surgery Sessions')
                : authPermissions.includes('Complete Sessions Job'))
              ? 'bg-green-500 hover:bg-green-600 '
              : 'cursor-not-allowed bg-gray-400'
          "
          @click.prevent="
            slotProps.item.practice_job_part_status === 'Ongoing' &&
              ($route.name.includes('hub-surgery-management')
                ? authPermissions.includes('Update Surgery Sessions')
                : authPermissions.includes('Complete Sessions Job'))
              ? actionJob(slotProps.item, 'complete')
              : ''
          "
        >
          Complete
        </button>
      </template>

      <template v-slot:terminate="slotProps">
        <button
          v-if="slotProps.item.practice_job_part_status === 'Ongoing'"
          class="text-white px-3 py-1 rounded-lg text-xs transition-hover focus:outline-none"
          :class="
            slotProps.item.practice_job_part_status === 'Ongoing' &&
              ($route.name.includes('hub-surgery-management')
                ? authPermissions.includes('Update Surgery Sessions')
                : authPermissions.includes('Cancel Sessions Job'))
              ? 'bg-red-500 hover:bg-red-600 '
              : 'cursor-not-allowed bg-gray-400'
          "
          @click.prevent="
            slotProps.item.practice_job_part_status === 'Ongoing' &&
              ($route.name.includes('hub-surgery-management')
                ? authPermissions.includes('Update Surgery Sessions')
                : authPermissions.includes('Cancel Sessions Job'))
              ? actionJob(slotProps.item, 'terminate')
              : ''
          "
        >
          Terminate
        </button>
      </template>
    </AppTable>
  </div>
</template>

<script>
import AppTable from "@/components/Base/AppTable";
import AppLoading from "@/components/Base/AppLoading";

export default {
  components: {
    AppTable,
    AppLoading
  },

  props: {
    jobId: {
      type: [String, Number],
      default: () => null
    },

    disabledLink: {
      type: Boolean,
      default: false
    },

    cantCompleteJob: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      loading: false,
      currentPage: 1,
      limit: 5,
      allJobParts: []
    };
  },

  computed: {
    count() {
      return this.allJobParts.length;
    },

    authPermissions() {
      return this.$store.getters["permissions"];
    },

    totalPages() {
      return Math.ceil(this.count / this.limit);
    },

    offset() {
      return this.limit * (this.currentPage - 1);
    },

    jobParts() {
      const jobParts = this.allJobParts
        ? [...this.allJobParts].slice(this.offset, this.offset + this.limit)
        : [];

      return jobParts;
    },

    columns() {
      const columns = [
        {
          name: "Job Part Number",
          dataIndex: "job_part_number",
          class: "text-center"
        },
        {
          name: "Date Start",
          dataIndex: "date_start_in_gb_formatted",
          class: "text-center",
          width: 100
        },
        {
          name: "Date End",
          dataIndex: "date_end_in_gb_formatted",
          class: "text-center",
          width: 100
        },
        {
          name: "Status",
          dataIndex: "practice_job_part_status",
          class: "text-center"
        }
      ];

      if (
        !this.cantCompleteJob &&
        this.jobParts.some(item => item.practice_job_part_status === "Ongoing")
      ) {
        columns.push(
          {
            name: "",
            slot: true,
            slotName: "complete",
            dataIndex: "",
            class: "text-center",
            width: 100
          },
          {
            name: "",
            slot: true,
            slotName: "terminate",
            dataIndex: "",
            class: "text-center",
            width: 100
          }
        );
      }

      return columns;
    }
  },

  mounted() {
    this.loading = true;
    this.$axios
      .get(`/api/v2/practice/practice-jobs/${this.jobId}`, { cache: true })
      .then(response => {
        this.allJobParts = response.data.data.job.job_parts;
      })
      .catch(err => {
        console.log("err", err.response || err);

        if (err.response && err.response.data && err.response.data.message) {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "danger",
            text: [`${err.response.data.message}`]
          });
        } else {
          this.$nuxt.error(err);
        }
      })
      .finally(() => {
        this.loading = false;
      });
  },

  methods: {
    routerLink(jobPart) {
      if (this.disabledLink) {
        return this.$route;
      }

      if (
        this.$route.name ===
          "hub-surgery-management-id-surgery-sessions-index-sessionId" ||
        this.$route.name ===
          "hub-surgery-management-id-surgery-sessions-index-sessionId-job-parts-jobPartId"
      ) {
        return {
          name:
            "hub-surgery-management-id-surgery-sessions-index-sessionId-job-parts-jobPartId",
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
        this.$route.name === "sessions-index-id" ||
        this.$route.name === "sessions-index-id-job-parts-jobPartId"
      ) {
        return {
          name: "sessions-index-id-job-parts-jobPartId",
          params: {
            ...this.$route.params,
            jobPartId: jobPart.id
          },
          query: {
            ...this.$route.query
          }
        };
      }

      if (this.$route.name === "job-parts-index-jobPartId") {
        return {
          name: "job-parts-index-jobPartId",
          params: {
            jobPartId: jobPart.id
          },
          query: {
            ...this.$route.query
          }
        };
      }

      if (
        this.$route.name ===
          "my-banks-index-locumId-index-related-jobs-index" ||
        this.$route.name ===
          "my-banks-index-locumId-index-related-jobs-index-jobId"
      ) {
        return {
          name: "my-banks-index-locumId-index-related-jobs-index-jobId",
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

    actionJob(job, action) {
      console.log("job", job.job_part_number);
      let jobType = job.job_part_number ? "job-parts" : "sessions";
      let jobId = job.id;

      this.$router.push(`/${jobType}/${jobId}/${action}`);
    }
  }
};
</script>
