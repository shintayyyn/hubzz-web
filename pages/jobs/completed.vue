<template>
  <section class="relative">
    <AppLoading :loading="loadingJobs" spinner />
    <AppButton
      class="relative md:hidden"
      :label="'Filter'"
      @click="showFilter"
      :inStyle="'padding:5px 14px;margin-bottom:5px; font-size:14px;'"
    />
    <div
      class="md:relative md:flex flex-wrap justify-start items-center"
      :class="filterToggle ? 'z-10 absolute w-full bg-white shadow-md p-3' : 'hidden'"
    >
      <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
        <AppInput
          class="px-1"
          v-model="params.job_type"
          :type="'select'"
          :name="'job_type'"
          :label="'Type'"
          :items="practiceTypeList"
        />
      </div>
      <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
        <AppInput
          class="px-1"
          v-model="params.job_part_number"
          :type="'text'"
          :name="'job_part_number'"
          :label="'Job part number'"
        />
      </div>
      <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
        <AppAutoComplete
          class="px-1"
          v-model="params.job_surgery_id"
          :name="'job_surgery_id'"
          :label="'Surgery'"
          :url="'/api/v1/locum/surgeries'"
          :inStyle="'padding-top:0.5rem;padding-bottom:0.5rem'"
        />
      </div>
      <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
        <AppInput
          class="px-1"
          v-model="params.job_title"
          :type="'text'"
          :name="'job_title'"
          :label="'Job Title'"
        />
      </div>
      <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
        <AppInput
          class="px-1"
          v-model="params.job_shift_id"
          :type="'select'"
          :name="'job_shift_id'"
          :label="'Shift'"
          :items="shifts"
        />
      </div>

      <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
        <AppInput
          class="px-1"
          v-model="params.job_rate"
          :type="'text'"
          :name="'job_rate'"
          :label="'Rate'"
          :inStyle="'padding-top:0.5rem;padding-bottom:0.5rem;text-align:right'"
        />
      </div>
      <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
        <AppInput
          class="px-1"
          v-model="params.job_rate_type_id"
          :type="'select'"
          :name="'job_rate_type_id'"
          :label="'per'"
          :items="rates"
        />
      </div>
      <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
        <AppPostCode
          class="px-1"
          v-model="params.near_post_code"
          :name="'near_post_code'"
          :label="'Post code'"
          @onSelect="onSelect"
        />
      </div>
      <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
        <AppInput
          class="px-1"
          v-model="params.miles"
          :type="'text'"
          :name="'miles'"
          :label="'Miles'"
        />
      </div>
      <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
        <AppInput
          class="px-1"
          v-model="params.invoice_status"
          :type="'select'"
          :name="'invoice_status'"
          :label="'Status'"
          :items="invoiceStatusList"
        />
      </div>
      <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
        <AppDate
          v-model="params.calendar_date_start"
          :name="'calendar_date_start'"
          :label="'From'"
          :format="'YYYY-MM-DD'"
        />
      </div>
      <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
        <AppTime v-model="params.time_start" :name="'time_start'" :label="'Start Time'" />
      </div>
      <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
        <AppDate
          v-model="params.calendar_date_end"
          :name="'calendar_date_end'"
          :label="'To'"
          :format="'YYYY-MM-DD'"
        />
      </div>
      <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
        <AppTime v-model="params.time_end" :name="'time_end'" :label="'End Time'" />
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
          @click="showFilter"
          :inStyle="'padding:5px 14px;margin-bottom:5px'"
        />
      </div>
    </div>
    <AppTable
      v-if="getLocumCompletedJobs.length > 0"
      :total="total"
      :items="getLocumCompletedJobs"
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
      class="flex justify-center py-4"
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
import AppTime from "@/components/Base/AppTime";
import AppPostCode from "@/components/Base/AppPostCode";
import AppAutoComplete from "@/components/Base/AppAutoComplete";
import AppButton from "@/components/Base/AppButton";
import AppLoading from "@/components/Base/AppLoading";
export default {
  props: ["invoiceStatusList", "practiceTypeList", "shifts", "rates"],
  transition: {
    name: "fade",
    mode: "out-in"
  },
  components: {
    AppTable,
    AppInput,
    AppDate,
    AppTime,
    AppPostCode,
    AppAutoComplete,
    AppButton,
    AppLoading
  },
  data() {
    return {
      current_page: 1,
      // app table params
      params: {
        offset: 0,
        limit: 5,
        order_by: ["job_date_created:desc"],
        job_part_number: "",
        job_title: "",
        job_type: "",
        job_surgery_id: "",
        job_shift_id: "",
        job_rate: "",
        job_rate_type_id: "",
        near_post_code: "",
        miles: "",
        calendar_date_start: "",
        calendar_date_end: "",
        time_start: "",
        time_end: "",
        invoice_status: ""
      },
      // app table column
      columns: [
        {
          name: "Job Part Number",
          dataIndex: "job_part_number",
          sortable: true
        },
        {
          name: "Surgery",
          dataIndex: "job_surgery_name",
          class: "text-center",
          sortable: true
        },
        {
          name: "Title",
          dataIndex: "job_title",
          class: "text-center",
          sortable: true
        },
        {
          name: "Shift",
          dataIndex: "job_shift",
          class: "text-center",
          sortable: true
        },
        {
          name: "Rate",
          dataIndex: "job_rate",
          sortable: true,
          class: "text-center"
        },
        {
          name: "per",
          dataIndex: "job_rate_type",
          class: "text-center",
          sortable: true
        },
        {
          name: "From",
          dataIndex: "date_start",
          sortable: true,
          class: "text-center"
        },
        {
          name: "To",
          dataIndex: "date_end",
          sortable: true,
          class: "text-center"
        },
        {
          name: "Completed At",
          dataIndex: "completed_at",
          class: "text-center localDate",
          sortable: true
        },
        {
          name: "Status",
          dataIndex: "invoice_status",
          class: "text-center"
        }
      ],
      filterToggle: false
    };
  },
  computed: {
    getLocumCompletedJobs() {
      return this.$store.getters["jobs/getLocumCompletedJobs"];
    },
    total() {
      return this.$store.state.jobs.locum_completed_jobs_count;
    },
    loadingJobs() {
      return this.$store.state.jobs.loading_jobs;
    }
  },
  watch: {
    "params.job_type"(value) {
      this.filterOut({ field: "job_type", value });
    },
    "params.job_part_number"(value) {
      this.filterOut({ field: "job_part_number", value });
    },
    "params.job_surgery_id"(value) {
      this.filterOut({ field: "job_surgery_id", value });
    },
    "params.job_title"(value) {
      this.filterOut({ field: "job_title", value });
    },
    "params.job_shift_id"(value) {
      this.filterOut({ field: "job_shift_id", value });
    },
    "params.job_rate"(value) {
      this.filterOut({ field: "job_rate", value });
    },
    "params.job_rate_type_id"(value) {
      this.filterOut({ field: "job_rate_type_id", value });
    },
    "params.near_post_code"(value) {
      if (!value) {
        this.filterOut({ field: "near_post_code", value });
      }
    },
    "params.miles"(value) {
      this.filterOut({ field: "miles", value });
    },
    "params.invoice_status"(value) {
      this.filterOut({ field: "invoice_status", value });
    },
    "params.calendar_date_start"(value) {
      this.filterOut({ field: "calendar_date_start", value });
    },
    "params.time_start"(value) {
      this.filterOut({ field: "time_start", value });
    },
    "params.calendar_date_end"(value) {
      this.filterOut({ field: "calendar_date_end", value });
    },
    "params.time_end"(value) {
      this.filterOut({ field: "time_end", value });
    }
  },
  beforeDestroy() {
    this.$store.commit("jobs/CLEAR_JOBS");
  },
  created() {
    this.getJobsCount();
    setTimeout(() => {
      this.$store.commit("jobs/CLEAR_LOCUM_COMPLETED_BADGE");
    }, 500);
  },
  methods: {
    showFilter() {
      return (this.filterToggle = !this.filterToggle);
    },
    filterOut: debounce(function({ field, value }) {
      this.current_page = 1;
      this.params.offset = 0;
      this.params[field] = value;
      this.$store.commit("jobs/TOGGLE_LOADING", true);
      this.$store.commit("jobs/SET_LOCUM_COMPLETED_JOB_PARTS", []);
      this.getJobs(this.params);
    }, 500),
    getJobsCount(params) {
      this.$store.commit("jobs/TOGGLE_LOADING", true);
      this.$store
        .dispatch("jobs/fetchLocumJobParts", {
          locum_status: ["Completed"],
          countOnly: true,
          ...params
        })
        .finally(() => {
          this.getJobs(this.params);
        });
    },
    getJobs(params) {
      this.$store
        .dispatch("jobs/fetchLocumJobParts", {
          locum_status: ["Completed"],
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
      this.params.job_type = "";
      this.params.job_part_number = "";
      this.params.job_surgery_id = "";
      this.params.job_title = "";
      this.params.job_shift_id = "";
      this.params.job_rate = "";
      this.params.job_rate_type_id = "";
      this.params.calendar_date_start = "";
      this.params.calendar_date_end = "";
      this.params.time_start = "";
      this.params.time_end = "";
      this.params.invoice_status = "";
      this.params.order_by = ["job_date_created:desc"];
    },
    show(item) {
      this.$router.push(`/jobs/${item.id}?status=${item.locum_status}`);
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