<template>
  <section class="relative __jobs-section">
    <AppLoading :loading="loadingJobs" spinner />
    <AppButton
      class="relative md:hidden"
      :label="'Filter'"
      @click="showFilter()"
      :inStyle="'padding:5px 14px;margin-bottom:5px; font-size:14px;'"
    />
    <div
      class="md:relative md:flex flex-wrap justify-start items-center"
      :class="filterToggle ? 'z-10 absolute w-full bg-white shadow-md p-3' : 'hidden'"
    >
      <div class="md:px-1 w-full md:w-1/3">
        <AppInput
          class="px-1"
          v-model="params.shift_id"
          :type="'select'"
          :name="'shift_id'"
          :label="'Shift'"
          :placeholder="'Select...'"
          :items="shifts"
        />
      </div>
      <div class="md:px-1 w-full md:w-1/3">
        <AppInput
          class="px-1"
          v-model="params.rate"
          :type="'text'"
          :name="'rate'"
          :label="'Rate'"
          :inStyle="'padding-top:0.5rem;padding-bottom:0.5rem;text-align:right'"
        />
      </div>
      <div class="md:px-1 w-full md:w-1/3">
        <AppInput
          class="px-1"
          v-model="params.locum_detail_rate_type_id"
          :type="'select'"
          :name="'locum_detail_rate_type_id'"
          :label="'per'"
          :placeholder="'Select...'"
          :items="rates"
        />
      </div>
      <div class="md:px-1 w-full md:w-1/3">
        <AppPostCode
          class="px-1"
          v-model="params.near_post_code"
          :name="'near_post_code'"
          :label="'Post code'"
          @onSelect="onSelect"
          :inStyle="'padding-top:0.5rem;padding-bottom:0.5rem;border-style:solid'"
        />
      </div>
      <div class="md:px-1 w-full md:w-1/3">
        <AppInput
          class="px-1"
          v-model="params.miles"
          :type="'text'"
          :name="'miles'"
          :label="'Miles'"
          :placeholder="''"
          :inStyle="'padding-top:0.5rem;padding-bottom:0.5rem;text-align:right'"
        />
      </div>
      <div class="md:px-1 flex w-full">
        <AppButton
          :label="'Clear'"
          @click="clearFilters"
          :inStyle="'padding:5px 14px;margin-bottom:5px'"
        />
        <AppButton
          class="mx-2 md:hidden"
          :label="'Close'"
          @click="showFilter()"
          :inStyle="'padding:5px 14px;margin-bottom:5px'"
        />
      </div>
    </div>
    <AppTable
      v-if="getLocumAppliedJobs.length > 0"
      :total="total"
      :items="getLocumAppliedJobs"
      :currentPage="current_page"
      :perPage="params.limit"
      :columns="columns"
      :orderBy="params.order_by"
      :loading="loadingJobs"
      @show="show"
      @pagechanged="pagechanged"
      @limitchanged="limitchanged"
      @sorted="sorted"
    ></AppTable>
    <div
      v-if="!getLocumAppliedJobs.length && !loadingJobs"
      class="flex justify-center py-4"
    >You have not yet applied for a job</div>
    <transition name="fade" mode="out-in">
      <div
        class="shield"
        v-if="$route.name === 'my-practice-applied-practiceId-related-jobs-applied-jobId'"
        @click="$router.push(`/my-practice/applied/${$route.params.practiceId}/related-jobs/applied`)"
      ></div>
    </transition>
    <nuxt-child />
  </section>
</template>
<script>
import AppTable from "@/components/Base/AppTable";
import AppInput from "@/components/Base/AppInput";
import AppPostCode from "@/components/Base/AppPostCode";
import AppButton from "@/components/Base/AppButton";
import AppLoading from "@/components/Base/AppLoading";
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },
  components: {
    AppTable,
    AppInput,
    AppPostCode,
    AppButton,
    AppLoading
  },
  data() {
    return {
      current_page: 1,
      // app table filter
      rates: [],
      shifts: [],
      // app table params
      params: {
        offset: 0,
        limit: 5,
        order_by: ["date_created:desc"],
        shift_id: "",
        rate: "",
        locum_detail_rate_type_id: "",
        near_post_code: "",
        miles: ""
      },
      // app table column
      columns: [
        {
          name: "Job number",
          dataIndex: "job_number",
          class: "text-left"
        },
        {
          name: "Practice",
          dataIndex: "platform_job.practice.surgery.name",
          class: "text-center"
        },
        {
          name: "Title",
          dataIndex: "title",
          class: "text-center"
        },
        {
          name: "Shift",
          dataIndex: "shift.name",
          class: "text-center"
        },
        {
          name: "Rate",
          dataIndex: "rate",
          class: "text-center"
        },
        {
          name: "per",
          dataIndex: "locum_detail_rate_type.name",
          class: "text-center"
        },
        {
          name: "From",
          dataIndex: "date_start",
          class: "text-center localDate",
          sortable: true
        },
        {
          name: "To",
          dataIndex: "date_end",
          class: "text-center localDate",
          sortable: true
        }
      ],
      filterToggle: false
    };
  },
  computed: {
    getLocumAppliedJobs() {
      return this.$store.getters["jobs/getLocumAppliedJobs"];
    },
    total() {
      return this.$store.state.jobs.locum_applied_jobs_count;
    },
    loadingJobs() {
      return this.$store.state.jobs.loading_jobs;
    }
  },
  watch: {
    "params.shift_id"(value) {
      this.current_page = 1;
      this.params.offset = 0;
      this.params.shift_id = value;
      this.getJobsCount(this.params);
    },
    "params.rate"(value) {
      this.current_page = 1;
      this.params.offset = 0;
      this.params.rate = value;
      this.getJobsCount(this.params);
    },
    "params.locum_detail_rate_type_id"(value) {
      this.current_page = 1;
      this.params.offset = 0;
      this.params.locum_detail_rate_type_id = value;
      this.getJobsCount(this.params);
    },
    "params.near_post_code"(value) {
      if (value === "") {
        this.current_page = 1;
        this.params.offset = 0;
        this.params.near_post_code = value;
        this.getJobsCount(this.params);
      }
    },
    "params.miles"(value) {
      this.current_page = 1;
      this.params.offset = 0;
      this.params.miles = value;
      this.getJobsCount(this.params);
    }
  },
  beforeDestroy() {
    this.$store.commit("jobs/CLEAR_JOBS");
  },
  created() {
    this.getRateType();
    this.getShifts();
    this.getJobsCount();
    setTimeout(() => {
      this.$store.commit("jobs/CLEAR_LOCUM_APPLIED_BADGE");
    }, 1000);
  },
  methods: {
    showFilter() {
      return (this.filterToggle = !this.filterToggle);
    },
    getJobsCount(params) {
      this.$store.commit("jobs/TOGGLE_LOADING", true);
      this.$store
        .dispatch("jobs/fetchLocumJobs", {
          locum_status: ["Applied"],
          countOnly: true,
          // job_practice_id: this.$route.params.practiceId,
          job_type: "Platform",
          ...params
        })
        .finally(() => {
          this.getJobs(this.params);
        });
    },
    getJobs(params) {
      this.$store
        .dispatch("jobs/fetchLocumJobs", {
          locum_status: ["Applied"],
          // job_practice_id: this.$route.params.practiceId,
          job_type: "Platform",
          ...params
        })
        .finally(() => {
          this.$store.commit("jobs/TOGGLE_LOADING", false);
        });
    },
    sorted(order_by) {
      this.current_page = 1;
      this.params.offset = 0;
      this.params.order_by = order_by;
      this.getJobs(this.params);
    },
    pagechanged(page) {
      this.current_page = page;
      this.params.offset = this.params.limit * (page - 1);
      this.getJobs(this.params);
    },
    limitchanged(limit) {
      this.current_page = 1;
      this.params.offset = 0;
      this.params.limit = limit;
      this.getJobs(this.params);
    },
    clearFilters() {
      this.params.shift_id = "";
      this.params.rate = "";
      this.params.locum_detail_rate_type_id = "";
      this.params.near_post_code = "";
      this.params.miles = "";
      this.params.surgery_name = "";
      this.params.order_by = ["date_created:desc"];
      this.getJobs(this.params);
    },
    show(item) {
      this.$router.push(
        `/my-practice/applied/${this.$route.params.practiceId}/related-jobs/applied/${item.id}`
      );
    },
    getShifts() {
      this.$axios.$get(`/api/v1/shifts`).then(res => {
        this.shifts = [];
        res.data.shifts.forEach(item => {
          this.shifts.push({ label: item.name, value: item.id });
        });
      });
    },
    getRateType() {
      this.$axios.$get(`/api/v1/locum-detail-rate-types`).then(res => {
        this.rates = [];
        res.data.locum_detail_rate_types.forEach(item => {
          this.rates.push({ label: item.name, value: item.id });
        });
      });
    },
    onSelect(value) {
      let address_components = value.details.result.address_components;
      let postal_code = address_components.find(component =>
        component.types.includes("postal_code")
      );
      if (!postal_code) {
        this.params.near_post_code = "";

        return;
      }
      this.params.near_post_code = postal_code.long_name;
      this.getJobsCount(this.params);
    }
  }
};
</script>
