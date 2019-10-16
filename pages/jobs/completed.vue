<template>
  <section class="relative">
    <AppLoading :loading="loadingJobs" spinner />
    <div class="relative flex flex-wrap justify-start items-center">
      <div class="px-1 w-full lg:w-1/4 md:w-1/3 sm:w-1/2">
        <AppInput
          class="px-1"
          v-model="params.job_number"
          :type="'text'"
          :name="'job_number'"
          :label="'Job number'"
        />
      </div>
      <div class="px-1 w-full lg:w-1/4 md:w-1/3 sm:w-1/2">
        <AppAutoComplete
          class="px-1"
          v-model="params.surgery_name"
          :name="'surgery_name'"
          :label="'Surgery'"
          :url="'/api/v1/locum/surgeries'"
          :inStyle="'padding-top:0.5rem;padding-bottom:0.5rem'"
        />
      </div>
      <div class="px-1 w-full lg:w-1/4 md:w-1/3 sm:w-1/2">
        <AppInput
          class="px-1"
          v-model="params.title"
          :type="'text'"
          :name="'title'"
          :label="'Title'"
        />
      </div>
      <div class="px-1 w-full lg:w-1/4 md:w-1/3 sm:w-1/2">
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
      <div class="px-1 w-full lg:w-1/4 md:w-1/3 sm:w-1/2">
        <AppInput
          class="px-1"
          v-model="params.rate"
          :type="'text'"
          :name="'rate'"
          :label="'Rate'"
          :inStyle="'padding-top:0.5rem;padding-bottom:0.5rem;text-align:right'"
        />
      </div>
      <div class="px-1 w-full lg:w-1/4 md:w-1/3 sm:w-1/2">
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
      <div class="px-1 w-full lg:w-1/4 md:w-1/3 sm:w-1/2">
        <AppDate v-model="params.date_start" :name="'date_start'" :label="'From'" />
      </div>
      <div class="px-1 w-full lg:w-1/4 md:w-1/3 sm:w-1/2">
        <AppDate v-model="params.date_end" :name="'date_end'" :label="'To'" />
      </div>
      <div class="px-1 w-full lg:w-1/4 md:w-1/3 sm:w-1/2">
        <AppPostCode
          class="px-1"
          v-model="params.near_post_code"
          :name="'near_post_code'"
          :label="'Post code'"
          @onSelect="onSelect"
          :inStyle="'padding-top:0.5rem;padding-bottom:0.5rem;border-style:solid'"
        />
      </div>
      <div class="px-1 w-full lg:w-1/4 md:w-1/3 sm:w-1/2">
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
      <div class="px-1 w-full">
        <AppButton
          :label="'Clear'"
          @click="clearFilters"
          :inStyle="'padding:5px 14px;margin-bottom:5px'"
        />
      </div>
    </div>
    <AppTable
      v-if="getLocumCompletedJobs.length > 0"
      :total="total"
      :items="jobs"
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
      v-if="!getLocumCompletedJobs.length && !loadingJobs"
      class="flex justify-center"
    >You have not yet completed any job</div>
    <transition name="fade" mode="out-in">
      <div
        class="shield"
        v-if="$route.name === 'jobs-completed-id'"
        @click="$router.push('/jobs/completed')"
      ></div>
    </transition>
    <nuxt-child />
  </section>
</template>
<script>
import debounce from "lodash.debounce";
import AppTable from "@/components/Base/AppTable";
import AppInput from "@/components/Base/AppInput";
import AppDate from "@/components/Base/AppDate";
import AppPostCode from "@/components/Base/AppPostCode";
import AppAutoComplete from "@/components/Base/AppAutoComplete";
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
    AppDate,
    AppPostCode,
    AppAutoComplete,
    AppButton,
    AppLoading
  },
  data() {
    return {
      jobs: [],
      current_page: 1,
      // app table filter
      rates: [],
      shifts: [],
      // app table params
      params: {
        offset: 0,
        limit: 5,
        order_by: ["date_created:desc"],
        job_number: "",
        surgery_name: "",
        title: "",
        shift_id: "",
        rate: "",
        date_start: "",
        date_end: "",
        locum_detail_rate_type_id: "",
        near_post_code: "",
        miles: ""
      },
      // app table column
      columns: [
        {
          name: "Job part number",
          dataIndex: "job_part_number",
          sortable: true
        },
        {
          name: "Practice",
          dataIndex: "job.platform_job.practice.surgery.name"
        },
        {
          name: "Title",
          dataIndex: "job.title"
        },
        {
          name: "Shift",
          dataIndex: "job.shift.name"
        },
        {
          name: "Rate",
          dataIndex: "job.rate",
          sortable: true
        },
        {
          name: "per",
          dataIndex: "job.locum_detail_rate_type.name"
        },
        {
          name: "From",
          dataIndex: "date_start",
          sortable: true
        },
        {
          name: "To",
          dataIndex: "date_end",
          sortable: true
        },
        {
          name: "Created At",
          dataIndex: "job.date_created",
          class: "text-center localDate",
          sortable: true
        },
        {
          name: "Assigned",
          dataIndex:
            "job.platform_job.appointed_to_locum.user.personal_detail.name"
        },
        {
          name: "Status",
          dataIndex: "invoiced_status"
        }
      ]
    };
  },
  computed: {
    getLocumCompletedJobs() {
      return this.$store.getters["jobs/getLocumCompletedJobs"];
    },
    total() {
      return this.$store.state.jobs.locum_completed_jobs_count;
    },
    totalPages() {
      return Math.ceil(this.total / this.perPage);
    },
    loadingJobs() {
      return this.$store.state.jobs.loading_jobs;
    }
  },
  watch: {
    "params.job_number"(value) {
      this.filterOut({ field: "job_number", value });
    },
    "params.surgery_name"(value) {
      this.filterOut({ field: "surgery_name", value });
    },
    "params.title"(value) {
      this.filterOut({ field: "title", value });
    },
    "params.shift_id"(value) {
      this.filterOut({ field: "shift_id", value });
    },
    "params.rate"(value) {
      this.filterOut({ field: "rate", value });
    },
    "params.locum_detail_rate_type_id"(value) {
      this.filterOut({ field: "locum_detail_rate_type_id", value }).then(
        res => {
          this.getJobsCount(this.params);
        }
      );
    },
    "params.date_start"(value) {
      this.filterOut({ field: "date_start", value });
    },
    "params.date_end"(value) {
      this.filterOut({ field: "date_end", value });
    },
    "params.near_post_code"(value) {
      if (value === "") {
        this.filterOut({ field: "near_post_code", value });
      }
    },
    "params.miles"(value) {
      this.filterOut({ field: "miles", value });
    },
    getLocumCompletedJobs(newValue, oldValue) {
      if (newValue) {
        this.jobs = [];
        this.getLocumCompletedJobs.forEach(job => {
          let invoiceStatus = "TO BE INVOICED";
          if (job.disputed) {
            invoiceStatus = "DISPUTED";
          }
          if (job.invoiced && job.issued) {
            invoiceStatus = "INVOICED";
          }
          this.jobs.push({
            ...job,
            invoiced_status: invoiceStatus
          });
        });
      }
      console.log(newValue, oldValue);
      console.log(this.jobs);
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
      this.$store.commit("jobs/CLEAR_LOCUM_COMPLETED_BADGE");
    }, 1000);
  },
  // mounted() {
  //   this.jobs = [];
  //   this.getLocumCompletedJobs.forEach(job => {
  //     let invoiceStatus = "TO BE INVOICED";
  //     if (job.disputed) {
  //       invoiceStatus = "DISPUTED";
  //     }
  //     if (job.invoiced && job.issued) {
  //       invoiceStatus = "INVOICED";
  //     }
  //     this.jobs.push({
  //       ...job,
  //       invoiced_status: invoiceStatus
  //     });
  //   });
  // },
  methods: {
    filterOut: debounce(function({ field, value }) {
      this.current_page = 1;
      this.params.offset = 0;
      this.params[field] = value;
      this.getJobs(this.params);
    }, 500),
    getJobsCount(params) {
      this.$store.commit("jobs/TOGGLE_LOADING", true);
      this.$store
        .dispatch("jobs/fetchLocumJobs", {
          status: "Completed",
          countOnly: true,
          ...params
        })
        .finally(() => {
          this.getJobs(this.params);
        });
    },
    getJobs(params) {
      this.$store
        .dispatch("jobs/fetchLocumJobs", { status: "Completed", ...params })
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
      this.$router.push(`/jobs/${item.id}?status=${item.locum_status}`);
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