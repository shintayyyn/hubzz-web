<template>
  <section class="relative">
    <div
      class="flex flex-row justify-start overflow-x-auto pb-3"
      v-if="$route.query.jobStatus && $route.query.jobStatus.toLowerCase() === 'applied'"
    >
      <nuxt-link
        :event="$store.state.jobs.loading_jobs ? '' : 'click'"
        :to="`/hub-surgery-management/${$route.params.id}/surgery-sessions?jobStatus=Applied&bank=false`"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.query.jobStatus && $route.query.jobStatus.toLowerCase() === 'applied' && (!$route.query.bank || $route.query.bank && $route.query.bank === 'false') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Non-Bank</nuxt-link>
      <nuxt-link
        :event="$store.state.jobs.loading_jobs ? '' : 'click'"
        :to="`/hub-surgery-management/${$route.params.id}/surgery-sessions?jobStatus=Applied&bank=true`"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.query.jobStatus && $route.query.jobStatus.toLowerCase() === 'applied' && $route.query.bank && $route.query.bank === 'true' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Child Bank</nuxt-link>
    </div>
    <transition name="fade" mode="out-in">
      <div class="relative flex w-full" v-if="initialLoading" style="min-height:80px">
        <AppLoading :loading="initialLoading" spinner />
      </div>
      <div v-if="!initialLoading">
        <AppTable
          v-if="jobs.length > 0"
          :total="total"
          :items="jobs"
          :currentPage="current_page"
          :perPage="limit"
          :columns="columns"
          :orderBy="order_by"
          :loading="loading"
          :routerLink="`/hub-surgery-management/${$route.params.id}/surgery-sessions`"
          @pagechanged="pagechanged"
          @limitchanged="limitchanged"
          @sorted="sorted"
        >
          <template v-slot:actions="slotProps">
            <div class="flex flex-wrap justify-center">
              <div
                @click="$router.push({ path: `/hub-surgery-management/${$route.params.id}/surgery-sessions/${slotProps.item.id}`, query: {...$route.query} })"
                class="my-1 p-2 bg-yellow-400 font-bold rounded-lg focus:outline-none"
              >View</div>
            </div>
          </template>
        </AppTable>
        <div
          v-if="!jobs.length && !loading && !isFiltered"
          class="flex justify-center py-4"
        >{{noJobsToDisplay}}</div>
        <div
          v-if="!jobs.length && !loading && isFiltered"
          class="flex justify-center py-4"
        >No Jobs Found</div>
        <transition name="fade" mode="out-in">
          <nuxt-link
            class="shield"
            v-if="$route.name === 'hub-surgery-management-id-surgery-sessions-index-sessionId'"
            :to="{ path: `/hub-surgery-management/${$route.params.id}/surgery-sessions`, query: {...$route.query}}"
          ></nuxt-link>
        </transition>
        <div>
          <nuxt-child />
        </div>
      </div>
    </transition>
  </section>
</template>
<script>
import debounce from "lodash.debounce";
import AppTable from "@/components/Base/AppTable";
import AppLoading from "@/components/Base/AppLoading";
import { mapGetters } from "vuex";
export default {
  components: {
    AppTable,
    AppLoading
  },
  props: ["spokePracticeId"],
  middleware({ query, redirect, error }) {
    if (
      query.jobStatus &&
      ![
        "pending",
        "allocated",
        "ongoing",
        "live",
        "applied",
        "unfilled",
        "withdrawn",
        "cancelled",
        "completed",
        "approved"
      ].includes(query.jobStatus.toLowerCase())
    ) {
      return error({ status: 404, message: "This Session Status is Invalid" });
    }
  },
  data() {
    return {
      total: 0,
      jobs: [],
      initialLoading: false,
      loading: false,
      current_page: 1,
      // app table params
      offset: 0,
      limit: 5,
      order_by: [],
      job_number: "",
      job_part_number: "",
      title: "",
      job_title: "",
      type: "",
      job_type: "",
      practice_id: "",
      job_practice_id: "",
      shift_id: "",
      job_shift_id: "",
      rate: "",
      job_rate: "",
      rate_type_id: "",
      job_rate_type_id: "",
      near_post_code: "",
      miles: "",
      calendar_date_start: "",
      calendar_date_end: "",
      time_start: "",
      time_end: "",
      invoice_status: "",
      viewing_locum_user_id: [],
      title_includes: "",
      job_title_includes: "",
      job_number_includes: "",
      job_part_number_includes: "",
      shifts: [],
      rates: [],
      filterModal: false,
      isFiltered: false,
      showRefresh: false
    };
  },
  computed: {
    isJobPart() {
      if (
        !this.$route.query.jobStatus ||
        (this.$route.query.jobStatus &&
          ![
            "ongoing",
            "completed",
            "approved",
            "cancelled",
            "withdrawn"
          ].includes(this.$route.query.jobStatus.toLowerCase()))
      ) {
        return false;
      }
      if (
        this.$route.query.jobStatus &&
        ["ongoing", "completed", "approved", "cancelled", "withdrawn"].includes(
          this.$route.query.jobStatus.toLowerCase()
        )
      ) {
        return true;
      }
    },
    noJobsToDisplay() {
      let queryStatus = this.$route.query.status
        ? this.$route.query.status.toLowerCase()
        : "";
      switch (queryStatus) {
        case "pending":
        case "allocated":
        case "ongoing":
        case "declined":
        case "approved":
        case "unfilled":
        case "live":
          return `You do not have any ${queryStatus} jobs`;
        case "applied":
          return `There were no Locums who applied on your jobs yet`;
        case "completed":
        case "cancelled":
          return `You have not yet ${queryStatus} any job`;
        default:
          return "You do not have any allocated jobs";
      }
    },
    columns() {
      let columns = [];
      let queryStatus = this.$route.query.jobStatus
        ? this.$route.query.jobStatus.toLowerCase()
        : "allocated";
      if (
        ["ongoing", "completed", "approved", "cancelled", "withdrawn"].includes(
          queryStatus
        )
      ) {
        columns.push(
          {
            name: "Job Part Number",
            dataIndex: "job_part_number",
            sortable: true
          },
          {
            name: "Practice",
            dataIndex: "practice_name",
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
            dataIndex: "job.shift.name",
            class: "text-center",
            sortable: true
          },
          {
            name: "Rate",
            dataIndex: "job.rate",
            sortable: true,
            class: "text-center"
          },
          {
            name: "per",
            dataIndex: "job.locum_detail_rate_type.name",
            class: "text-center",
            sortable: true
          }
        );
      } else if (
        ![
          "ongoing",
          "completed",
          "approved",
          "cancelled",
          "withdrawn"
        ].includes(queryStatus)
      ) {
        columns.push(
          {
            name: "Job Number",
            dataIndex: "job_number",
            sortable: true
          },
          {
            name: "Practice",
            dataIndex: "practice_name",
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
            dataIndex: "rate",
            sortable: true,
            class: "text-center"
          },
          {
            name: "per",
            dataIndex: "rate_type_name",
            class: "text-center",
            sortable: true
          }
        );
      }
      columns.push(
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
      );
      if (queryStatus === "allocated") {
        columns.push({
          name: "Assigned",
          dataIndex: "assigned_to",
          class: "text-center"
        });
      }
      if (queryStatus === "withdrawn") {
        columns.push({
          name: "Withdrawn At",
          dataIndex: "job.platform_job.declined_at",
          class: "text-center localDate"
        });
      }
      if (queryStatus === "cancelled") {
        columns.push({
          name: "Cancelled At",
          dataIndex: "job.platform_job.cancelled_at",
          class: "text-center localDate"
        });
      }
      if (["completed", "approved"].includes(queryStatus)) {
        columns.push(
          {
            name: "Completed At",
            dataIndex: "completed_at",
            class: "text-center localDate"
          },
          {
            name: "Invoice status",
            dataIndex: "invoice_status",
            class: "text-center"
          },
          {
            name: "Tag",
            dataIndex: "status",
            class: "text-center"
          }
        );
      }
      return columns;
    }
  },
  watch: {
    async "$route.query"(newValue, oldValue) {
      let newStatus = newValue.jobStatus;
      let oldStatus = oldValue.jobStatus;
      let newBank = newValue.bank;
      let oldBank = oldValue.bank;
      if (
        (newStatus && newStatus !== null && newStatus !== oldStatus) ||
        (newBank && newBank !== null && newBank !== oldBank)
      ) {
        this.current_page = 1;
        this.filterModal = false;
        this.showRefresh = false;
        this.total = 0;
        this.jobs = [];
        this.isFiltered = false;
        this.initialLoading = true;
        await this.getJobsPromiseAll();
        this.initialLoading = false;
      }
    }
  },
  async asyncData({ app, params, route, query, store, auth, error }) {
    try {
      let status = [];
      let queryStatus = query.jobStatus;
      let bankStatus = query.bank;

      if (!queryStatus) {
        status = ["Allocated"];
      } else if (queryStatus) {
        switch (queryStatus) {
          case "Completed":
            status = ["Completed", "Terminated"];
            break;
          case "Withdrawn":
            status = ["Declined"];
            break;
          default:
            status = [`${queryStatus}`];
            break;
        }
      }

      let isJobPart = false;
      if (
        queryStatus &&
        ["ongoing", "completed", "approved", "cancelled", "withdrawn"].includes(
          queryStatus.toLowerCase()
        )
      ) {
        isJobPart = true;
      }

      let offset = 0;
      let limit = 5;
      let order_by = [];
      let job_number = "";
      let job_part_number = "";
      let title = "";
      let job_title = "";
      let type = "";
      let job_type = "";
      let practice_id = "";
      let job_practice_id = "";
      let private_practice_id = "";
      let job_private_practice_id = "";
      let shift_id = "";
      let job_shift_id = "";
      let rate = "";
      let job_rate = "";
      let rate_type_id = "";
      let job_rate_type_id = "";
      let near_post_code = "";
      let miles = "";
      let calendar_date_start = "";
      let calendar_date_end = "";
      let time_start = "";
      let time_end = "";
      let invoice_status = "";
      let viewing_locum_user_id = [];
      let title_includes = "";
      let job_title_includes = "";
      let job_number_includes = "";
      let job_part_number_includes = "";
      let spokePracticeId = null;

      await app.$axios
        .$get(`/api/v1/practice/me/practice-surgeries/${route.params.id}`)
        .then(res => {
          spokePracticeId =
            res.data &&
            res.data.practice_surgery &&
            res.data.practice_surgery.child_practice_id
              ? res.data.practice_surgery.child_practice_id
              : null;
        });

      const [total, jobs] = await Promise.all([
        app.$axios
          .$get(`/api/v1/practice/${isJobPart ? "job-parts" : "jobs"}/count`, {
            params: {
              status,
              order_by: [],
              job_number: !isJobPart ? job_number : "",
              job_part_number: isJobPart ? job_part_number : "",
              title: !isJobPart ? title : "",
              job_title: isJobPart ? job_title : "",
              type: !isJobPart ? type : "",
              job_type: isJobPart ? job_type : "",
              practice_id: !isJobPart ? spokePracticeId : "",
              job_practice_id: isJobPart ? spokePracticeId : "",
              shift_id: !isJobPart ? shift_id : "",
              job_shift_id: isJobPart ? job_shift_id : "",
              rate: !isJobPart ? rate : "",
              job_rate: isJobPart ? job_rate : "",
              rate_type_id: !isJobPart ? rate_type_id : "",
              job_rate_type_id: isJobPart ? job_rate_type_id : "",
              near_post_code: isJobPart ? near_post_code : "",
              miles: isJobPart ? miles : "",
              calendar_date_start: isJobPart ? calendar_date_start : "",
              calendar_date_end: isJobPart ? calendar_date_end : "",
              time_start: isJobPart ? time_start : "",
              time_end: isJobPart ? time_end : "",
              invoice_status: isJobPart ? invoice_status : "",
              viewing_locum_user_id: [],
              title_includes: "",
              job_title_includes: "",
              job_number_includes: "",
              job_part_number_includes: "",
              has_favorite_applicants:
                queryStatus === "Applied" && bankStatus === "true"
                  ? true
                  : queryStatus === "Applied" &&
                    (bankStatus === "false" || !bankStatus)
                  ? false
                  : null
            }
          })
          .then(res => {
            let total = 0;
            total = res.data.count;
            return total;
          }),
        app.$axios
          .$get(`/api/v1/practice/${isJobPart ? "job-parts" : "jobs"}`, {
            params: {
              offset: 0,
              limit: 5,
              status,
              order_by: [],
              job_number: !isJobPart ? job_number : "",
              job_part_number: isJobPart ? job_part_number : "",
              title: !isJobPart ? title : "",
              job_title: isJobPart ? job_title : "",
              type: !isJobPart ? type : "",
              job_type: isJobPart ? job_type : "",
              practice_id: !isJobPart ? spokePracticeId : "",
              job_practice_id: isJobPart ? spokePracticeId : "",
              shift_id: !isJobPart ? shift_id : "",
              job_shift_id: isJobPart ? job_shift_id : "",
              rate: !isJobPart ? rate : "",
              job_rate: isJobPart ? job_rate : "",
              rate_type_id: !isJobPart ? rate_type_id : "",
              job_rate_type_id: isJobPart ? job_rate_type_id : "",
              near_post_code: isJobPart ? near_post_code : "",
              miles: isJobPart ? miles : "",
              calendar_date_start: isJobPart ? calendar_date_start : "",
              calendar_date_end: isJobPart ? calendar_date_end : "",
              time_start: isJobPart ? time_start : "",
              time_end: isJobPart ? time_end : "",
              invoice_status: isJobPart ? invoice_status : "",
              viewing_locum_user_id: [],
              title_includes: "",
              job_title_includes: "",
              job_number_includes: "",
              job_part_number_includes: "",
              has_favorite_applicants:
                queryStatus === "Applied" && bankStatus === "true"
                  ? true
                  : queryStatus === "Applied" &&
                    (bankStatus === "false" || !bankStatus)
                  ? false
                  : null
            }
          })
          .then(res => {
            let jobs = 0;
            jobs =
              res.data && res.data.jobs
                ? res.data.jobs
                : res.data.job_parts
                ? res.data.job_parts
                : [];
            return jobs;
          })
      ]);

      return {
        total,
        jobs
      };
    } catch (err) {
      throw err;
    }
  },
  methods: {
    getJobsPromiseAll() {
      let status = [];
      let queryStatus = this.$route.query.jobStatus;
      let bankStatus = this.$route.query.bank;

      if (!queryStatus) {
        status = ["Allocated"];
      } else if (queryStatus) {
        switch (queryStatus) {
          case "Completed":
            status = ["Completed", "Terminated"];
            break;
          case "Withdrawn":
            status = ["Declined"];
            break;
          default:
            status = [`${queryStatus}`];
            break;
        }
      }
      return Promise.all([
        this.$axios.$get(
          `/api/v1/practice/${this.isJobPart ? "job-parts" : "jobs"}/count`,
          {
            params: {
              status,
              order_by: [],
              job_number: !this.isJobPart ? this.job_number : "",
              job_part_number: this.isJobPart ? this.job_part_number : "",
              title: !this.isJobPart ? this.title : "",
              job_title: this.isJobPart ? this.job_title : "",
              type: !this.isJobPart ? this.type : "",
              job_type: this.isJobPart ? this.job_type : "",
              practice_id: !this.isJobPart ? this.spokePracticeId : "",
              job_practice_id: this.isJobPart ? this.spokePracticeId : "",
              shift_id: !this.isJobPart ? this.shift_id : "",
              job_shift_id: this.isJobPart ? this.job_shift_id : "",
              rate: !this.isJobPart ? this.rate : "",
              job_rate: this.isJobPart ? this.job_rate : "",
              rate_type_id: !this.isJobPart ? this.rate_type_id : "",
              job_rate_type_id: this.isJobPart ? this.job_rate_type_id : "",
              near_post_code: this.isJobPart ? this.near_post_code : "",
              miles: this.isJobPart ? this.miles : "",
              calendar_date_start: this.isJobPart
                ? this.calendar_date_start
                : "",
              calendar_date_end: this.isJobPart ? this.calendar_date_end : "",
              time_start: this.isJobPart ? this.time_start : "",
              time_end: this.isJobPart ? this.time_end : "",
              invoice_status: this.isJobPart ? this.invoice_status : "",
              viewing_locum_user_id: this.viewing_locum_user_id,
              title_includes: this.title_includes,
              job_title_includes: this.job_title_includes,
              job_number_includes: this.job_number_includes,
              has_favorite_applicants:
                queryStatus === "Applied" && bankStatus === "true"
                  ? true
                  : queryStatus === "Applied" &&
                    (bankStatus === "false" || !bankStatus)
                  ? false
                  : null
            }
          }
        ),
        this.$axios.$get(
          `/api/v1/practice/${this.isJobPart ? "job-parts" : "jobs"}`,
          {
            params: {
              offset: 0,
              limit: 5,
              status,
              order_by: [],
              job_number: !this.isJobPart ? this.job_number : "",
              job_part_number: this.isJobPart ? this.job_part_number : "",
              title: !this.isJobPart ? this.title : "",
              job_title: this.isJobPart ? this.job_title : "",
              type: !this.isJobPart ? this.type : "",
              job_type: this.isJobPart ? this.job_type : "",
              practice_id: !this.isJobPart ? this.spokePracticeId : "",
              job_practice_id: this.isJobPart ? this.spokePracticeId : "",
              shift_id: !this.isJobPart ? this.shift_id : "",
              job_shift_id: this.isJobPart ? this.job_shift_id : "",
              rate: !this.isJobPart ? this.rate : "",
              job_rate: this.isJobPart ? this.job_rate : "",
              rate_type_id: !this.isJobPart ? this.rate_type_id : "",
              job_rate_type_id: this.isJobPart ? this.job_rate_type_id : "",
              near_post_code: this.isJobPart ? this.near_post_code : "",
              miles: this.isJobPart ? this.miles : "",
              calendar_date_start: this.isJobPart
                ? this.calendar_date_start
                : "",
              calendar_date_end: this.isJobPart ? this.calendar_date_end : "",
              time_start: this.isJobPart ? this.time_start : "",
              time_end: this.isJobPart ? this.time_end : "",
              invoice_status: this.isJobPart ? this.invoice_status : "",
              viewing_locum_user_id: this.viewing_locum_user_id,
              title_includes: this.title_includes,
              job_title_includes: this.job_title_includes,
              job_number_includes: this.job_number_includes,
              job_part_number_includes: this.job_part_number_includes,

              has_favorite_applicants:
                queryStatus === "Applied" && bankStatus === "true"
                  ? true
                  : queryStatus === "Applied" &&
                    (bankStatus === "false" || !bankStatus)
                  ? false
                  : null
            }
          }
        )
      ])
        .then(([responseCount, responseJobs]) => {
          this.jobs =
            responseJobs.data && responseJobs.data.jobs
              ? responseJobs.data.jobs
              : responseJobs.data.job_parts
              ? responseJobs.data.job_parts
              : [];
          this.total = responseCount.data.count;
        })
        .catch(err => {
          console.log("err", err.response || err);
          throw err;
        });
    },
    getJobs() {
      let status = [];
      let queryStatus = this.$route.query.jobStatus;
      let bankStatus = this.$route.query.bank;

      if (!queryStatus) {
        status = ["Allocated"];
      } else if (queryStatus) {
        switch (queryStatus) {
          case "Completed":
            status = ["Completed", "Terminated"];
            break;
          case "Withdrawn":
            status = ["Declined"];
            break;
          default:
            status = [`${queryStatus}`];
            break;
        }
      }

      return this.$axios
        .$get(`/api/v1/practice/${this.isJobPart ? "job-parts" : "jobs"}`, {
          params: {
            offset: this.offset,
            limit: this.limit,
            status,
            order_by: this.order_by,
            job_number: !this.isJobPart ? this.job_number : "",
            job_part_number: this.isJobPart ? this.job_part_number : "",
            title: !this.isJobPart ? this.title : "",
            job_title: this.isJobPart ? this.job_title : "",
            type: !this.isJobPart ? this.type : "",
            job_type: this.isJobPart ? this.job_type : "",
            practice_id: !this.isJobPart ? this.spokePracticeId : "",
            job_practice_id: this.isJobPart ? this.spokePracticeId : "",
            shift_id: !this.isJobPart ? this.shift_id : "",
            job_shift_id: this.isJobPart ? this.job_shift_id : "",
            rate: !this.isJobPart ? this.rate : "",
            job_rate: this.isJobPart ? this.job_rate : "",
            rate_type_id: !this.isJobPart ? this.rate_type_id : "",
            job_rate_type_id: this.isJobPart ? this.job_rate_type_id : "",
            near_post_code: this.isJobPart ? this.near_post_code : "",
            miles: this.isJobPart ? this.miles : "",
            calendar_date_start: this.isJobPart ? this.calendar_date_start : "",
            calendar_date_end: this.isJobPart ? this.calendar_date_end : "",
            time_start: this.isJobPart ? this.time_start : "",
            time_end: this.isJobPart ? this.time_end : "",
            invoice_status: this.isJobPart ? this.invoice_status : "",
            viewing_locum_user_id: this.viewing_locum_user_id,
            title_includes: this.title_includes,
            job_title_includes: this.job_title_includes,
            job_number_includes: this.job_number_includes,
            has_favorite_applicants:
              queryStatus === "Applied" && bankStatus === "true"
                ? true
                : queryStatus === "Applied" &&
                  (bankStatus === "false" || !bankStatus)
                ? false
                : null
          }
        })
        .then(res => {
          this.jobs =
            res.data && res.data.jobs
              ? res.data.jobs
              : res.data.job_parts
              ? res.data.job_parts
              : [];
        })
        .catch(err => {
          console.log("err", err.response || err);
          throw err;
        });
    },
    async refreshJobs() {
      this.current_page = 1;
      this.offset = 0;
      this.limit = 5;
      this.initialLoading = true;
      await this.getJobsPromiseAll();
      this.initialLoading = false;
      this.showRefresh = false;
    },
    async sorted(order_by) {
      let orderBy = order_by.map(item => {
        let order = item.split(":")[1];
        let sorting = item.split(":")[0];
        switch (sorting) {
          case "date_time_start":
            sorting = "date_start";
            break;
          case "date_time_end":
            sorting = "date_end";
            break;
          case "calendar_date_start":
            sorting = "calendar_date_start";
            break;
          case "calendar_date_end":
            sorting = "calendar_date_end";
            break;
          case "job.rate":
            sorting = "job_rate";
            break;
          case "job.locum_detail_rate_type.name":
            sorting = "job_rate_type_name";
            break;
          default:
            sorting;
        }
        return `${sorting}:${order}`;
      });
      this.current_page = 1;
      this.offset = 0;
      this.order_by = orderBy;
      this.loading = true;
      await this.getJobs();
      this.loading = false;
    },
    async pagechanged(page) {
      this.current_page = page;
      this.offset = this.limit * (page - 1);
      this.loading = true;
      await this.getJobs();
      this.loading = false;
    },
    async limitchanged(limit) {
      this.current_page = 1;
      this.offset = 0;
      this.limit = limit;
      this.loading = true;
      await this.getJobs();
      this.loading = false;
    }
  }
};
</script>

