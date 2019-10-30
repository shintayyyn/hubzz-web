<template>
  <div class="relative flex flex-col w-full mb-3">
    <div class="text-xs sm:text-sm font-bold">Job Parts</div>
    <AppTable
      :total="total"
      :items="parts"
      :currentPage="current_page"
      :perPage="params.limit"
      :columns="columns"
      :loading="loading"
      :routerLink="routerLink"
      :customWidth="'600'"
      @pagechanged="pagechanged"
      @limitchanged="limitchanged"
    />
  </div>
</template>
<script>
import AppTable from "@/components/Base/AppTable";
export default {
  components: {
    AppTable
  },

  props: ["job_id"],
  data() {
    return {
      parts: [],
      current_page: 1,
      // app table params
      params: {
        job_id: 0,
        offset: 0,
        limit: 5
      },
      total: 0,
      // app table
      columns: [
        {
          name: "Job Part Number",
          dataIndex: "job_part_number",
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
      ],
      loading: false
    };
  },

  computed: {
    totalPages() {
      return Math.ceil(this.total / this.perPage);
    },
    routerLink() {
      let url = "/jobs";
      if (this.$route.path.includes("related-jobs")) {
        url = `/my-practice/${this.$route.params.practiceId}/related-jobs`;
      }
      return url;
    }
  },
  created() {
    this.params.job_id = this.job_id;
    this.$axios
      .$get(`/api/v1/locum/job-parts/count?job_id=${this.job_id}`)
      .then(res => {
        this.total = res.data.count;
        this.getJobParts(this.params);
      });
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
<style scoped>
.shield {
  z-index: 511;
}
.modal-container {
  z-index: 512;
}
@media screen and (min-width: 1200px) {
  .modal-container {
    width: 70%;
  }
}
.wrapper {
  transition: all 0.3s linear;
}
</style>
