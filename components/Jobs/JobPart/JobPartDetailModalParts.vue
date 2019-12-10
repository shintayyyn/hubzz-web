<template>
  <div class="relative flex flex-col w-full my-5">
    <div class="text-md font-bold">Job Parts</div>
    <div class="relative flex w-full" v-if="parts.length === 0 && loading" style="min-height:80px">
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

  props: ["job_id", "disabledLink"],
  data() {
    return {
      loading: false,
      total: 0,
      parts: [],
      current_page: 1,
      // app table params
      params: {
        job_id: null,
        offset: 0,
        limit: 5
      },
      // app table
      columns: [
        {
          name: "Job Part Number",
          dataIndex: "job_part_number",
          class: "text-center"
        },
        {
          name: "Date End",
          dataIndex: "date_end",
          class: "text-center"
        },
        {
          name: "Date Start",
          dataIndex: "date_start",
          class: "text-center"
        },
        {
          name: "Status",
          dataIndex: "status",
          class: "text-center"
        }
      ]
    };
  },

  computed: {
    totalPages() {
      return Math.ceil(this.total / this.perPage);
    },
    routerLink() {
      if (this.disabledLink) {
        return null;
      }
      let url = "";
      if (this.$route.path.includes("related-jobs")) {
        url = `/my-practice/${this.$route.params.practiceId}/related-jobs`;
      } else if (this.$route.path.includes("/jobs")) {
        url = "/jobs";
      } else if (this.$route.path.includes("/dashboard")) {
        url = "/dashboard";
      }
      return url;
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
        this.$axios.$get(`/api/v1/locum/job-parts`, { params: this.params })
      ])
        .then(([responseCount, responseJobParts]) => {
          this.total = responseCount.data.count;
          this.parts = responseJobParts.data.job_parts;
        })
        .finally(() => {
          this.loading = false;
        });
    } catch (err) {
      console.log("err", err.response.data);
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
