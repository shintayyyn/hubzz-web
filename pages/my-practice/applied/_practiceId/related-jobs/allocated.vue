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
      <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
        <AppInput
          class="px-1"
          v-model="params.type"
          :type="'select'"
          :name="'type'"
          :label="'Type'"
          :items="practiceTypeList"
        />
      </div>
      <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
        <AppInput
          class="px-1"
          v-model="params.job_number"
          :type="'text'"
          :name="'job_number'"
          :label="'Job part number'"
        />
      </div>
      <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
        <AppAutoComplete
          class="px-1"
          v-model="params.surgery_id"
          :name="'surgery_id'"
          :label="'Surgery'"
          :url="'/api/v1/locum/surgeries'"
          :inStyle="'padding-top:0.5rem;padding-bottom:0.5rem'"
        />
      </div>
      <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
        <AppInput
          class="px-1"
          v-model="params.title"
          :type="'text'"
          :name="'title'"
          :label="'Job Title'"
        />
      </div>
      <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
        <AppInput
          class="px-1"
          v-model="params.shift_id"
          :type="'select'"
          :name="'shift_id'"
          :label="'Shift'"
          :items="shifts"
        />
      </div>

      <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
        <AppInput
          class="px-1"
          v-model="params.rate"
          :type="'text'"
          :name="'rate'"
          :label="'Rate'"
          :inStyle="'padding-top:0.5rem;padding-bottom:0.5rem;text-align:right'"
        />
      </div>
      <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
        <AppInput
          class="px-1"
          v-model="params.rate_type_id"
          :type="'select'"
          :name="'rate_type_id'"
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
      v-if="getLocumAllocatedJobs.length > 0"
      :total="total"
      :items="getLocumAllocatedJobs"
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
      v-if="!getLocumAllocatedJobs.length && !loadingJobs"
      class="flex justify-center py-4"
    >You do not have any allocated jobs</div>
    <transition name="fade" mode="out-in">
      <div
        class="shield"
        v-if="$route.name === 'my-practice-applied-practiceId-related-jobs-allocated-jobId'"
        @click="$router.push(`/my-practice/applied/${$route.params.practiceId}/related-jobs/allocated`)"
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
  props: ["shifts", "rates", "invoiceStatusList", "practiceTypeList"],
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
        order_by: ["date_created:desc"],
        job_number: "",
        title: "",
        type: "",
        surgery_id: "",
        shift_id: "",
        rate: "",
        rate_type_id: "",
        near_post_code: "",
        miles: "",
        calendar_date_start: "",
        calendar_date_end: "",
        time_start: "",
        time_end: ""
      },
      // app table column
      columns: [
        {
          name: "Job Part Number",
          dataIndex: "job_number",
          sortable: true
        },
        {
          name: "Surgery",
          dataIndex: "surgery_name",
          class: "text-center",
          sortable: true
        },
        {
          name: "Title",
          dataIndex: "title",
          class: "text-center",
          sortable: true
        },
        {
          name: "Shift",
          dataIndex: "shift_name",
          class: "text-center",
          sortable: true
        },
        {
          name: "Rate",
          dataIndex: "rate_name",
          sortable: true,
          class: "text-center"
        },
        {
          name: "per",
          dataIndex: "rate_type_name",
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
        }
      ],
      filterToggle: false
    };
  },
  computed: {
    getLocumAllocatedJobs() {
      return this.$store.getters["jobs/getLocumAllocatedJobs"];
    },
    total() {
      return this.$store.state.jobs.locum_allocated_jobs_count;
    },
    loadingJobs() {
      return this.$store.state.jobs.loading_jobs;
    }
  },
  watch: {
    "params.type"(value) {
      this.filterOut({ field: "type", value });
    },
    "params.job_number"(value) {
      this.filterOut({ field: "job_number", value });
    },
    "params.surgery_id"(value) {
      this.filterOut({ field: "surgery_id", value });
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
    "params.rate_type_id"(value) {
      this.filterOut({ field: "rate_type_id", value });
    },
    "params.near_post_code"(value) {
      if (!value) {
        this.filterOut({ field: "near_post_code", value });
      }
    },
    "params.miles"(value) {
      this.filterOut({ field: "miles", value });
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
      this.$store.commit("jobs/CLEAR_LOCUM_ALLOCATED_BADGE");
    }, 1000);
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
      this.$store.commit("jobs/SET_LOCUM_ALLOCATED_JOBS", []);
      this.getJobs(this.params);
    }, 500),
    getJobsCount(params) {
      this.$store.commit("jobs/TOGGLE_LOADING", true);
      this.$store
        .dispatch("jobs/fetchLocumJobs", {
          locum_status: ["Allocated"],
          countOnly: true,
          job_practice_id: this.$route.params.practiceId,
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
          locum_status: ["Allocated"],
          job_practice_id: this.$route.params.practiceId,
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
      this.params.type = "";
      this.params.job_number = "";
      this.params.surgery_id = "";
      this.params.title = "";
      this.params.shift_id = "";
      this.params.rate = "";
      this.params.rate_type_id = "";
      this.params.calendar_date_start = "";
      this.params.calendar_date_end = "";
      this.params.time_start = "";
      this.params.time_end = "";
      this.params.order_by = ["date_created:desc"];
    },
    show(item) {
      this.$router.push(
        `/my-practice/applied/${this.$route.params.practiceId}/related-jobs/allocated/${item.id}`
      );
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
