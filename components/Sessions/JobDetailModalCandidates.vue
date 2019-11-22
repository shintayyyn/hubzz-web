<template>
  <div class="flex flex-col w-full">
    <div class="text-xs sm:text-sm font-bold">Candidates</div>
    <div
      class="rounded-lg shadow-lg m-0 my-4 py-3 px-5 cursor-pointer"
      v-for="user in applicants"
      :key="user.id"
      @click="show(user.id)"
    >
      <div class="flex flex-row flex-no-wrap justify-between items-center">
        <AppAvatar
          :height="'40px'"
          :width="'40px'"
          :src="user.avatar && user.avatar.file && user.avatar.file.url ? user.avatar.file.url : ''"
        />
        <div class="text-xs sm:text-sm font-bold leading-loose">{{user.personal_detail.name}}</div>
        <div class="flex">
          <svgicon name="arrow-right" height="20" width="20" />
        </div>
      </div>
    </div>
    <div class="bottom-0 w-full">
      <AppPagination
        :total="total"
        :totalPages="totalPages"
        :currentPage="current_page"
        @pagechanged="pagechanged"
        @limitchanged="limitchanged"
        :loading="loading"
        :perPage="params.limit"
      />
    </div>
  </div>
</template>
<script>
import AppAvatar from "~/components/Base/AppAvatar";
import AppPagination from "@/components/Base/AppPagination";
export default {
  components: {
    AppAvatar,
    AppPagination
  },
  props: ["job"],
  data() {
    return {
      total: 0,
      applicants: [],
      current_page: 1,
      loading: false,
      params: {
        offset: 0,
        limit: 20
      }
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.total / this.params.limit);
    }
  },
  created() {
    this.getApplicantsCount();
  },
  methods: {
    getApplicantsCount() {
      this.$axios
        .$get(`/api/v1/practice/jobs/${this.job.id}/applicants/count`)
        .then(res => {
          this.total = res.data.count;
          this.getApplicants(this.params);
        });
    },
    getApplicants(params) {
      this.$axios
        .$get(`/api/v1/practice/jobs/${this.job.id}/applicants`, {
          params
        })
        .then(res => {
          this.applicants = res.data.users;
        });
    },
    pagechanged(page) {
      this.current_page = page;
      this.params.offset = this.params.limit * (page - 1);
      this.getApplicants(this.params);
    },
    limitchanged(limit) {
      this.current_page = 1;
      this.params.offset = 0;
      this.params.limit = limit;
      this.getApplicants(this.params);
    },
    show(id) {
      this.$axios.$get(`/api/v1/practice/locums/${id}`).then(res => {
        const user = res.data.user;
        this.$emit("show", user);
      });
    }
  }
};
</script>
<style scoped>
.avatar {
  max-width: 40px;
  max-height: 40px;
  min-width: 40px;
  min-height: 40px;
}
img {
  border-radius: 50%;
}
</style>

