<template>
  <section class="relative per-month-section">
    <div>
      <div class="flex flex-row flex-wrap justify-between mx-1" v-if="showRefresh">
        <AppButton
          :label="'Refresh'"
          @click="refreshJobs"
          :inStyle="'padding:5px 14px;margin-bottom:5px;font-size:14px;'"
        />
      </div>
      <div class="flex flex-row flex-wrap justify-between mx-1">
        <div class="w-2/3 py-1 sm:w-1/3">
          <div
            class="text-xs sm:text-sm"
          >{{$store.state.calendar.months[selectedMonth]}} {{selectedYear}}</div>
        </div>
        <div class="w-1/3 py-1 px-2 flex flex-no-wrap justify-end md:justify-center items-center">
          <span class="cursor-pointer" @click="adjustMonth('previous')">
            <svgicon name="arrow-left" height="12" width="12" />
          </span>
          <span class="mx-4"></span>
          <span class="cursor-pointer" @click="adjustMonth('next')">
            <svgicon name="arrow-right" height="12" width="12" />
          </span>
        </div>
        <div class="w-full text-right py-1 sm:w-1/3">
          <span
            class="cursor-pointer px-3 text-xs sm:text-sm hover:underline"
            :class="$store.state.calendar.view_type === 'per_month' ? 'py-1 px-3 bg-yellow-500':''"
            @click="$store.commit('calendar/TOGGLE_CALENDAR_VIEW_TYPE', 'per_month')"
          >Month</span>
          <span
            class="cursor-pointer px-3 text-xs sm:text-sm hover:underline"
            :class="$store.state.calendar.view_type === 'per_week' ? 'py-1 px-3 bg-yellow-500':''"
            @click="$store.commit('calendar/TOGGLE_CALENDAR_VIEW_TYPE', 'per_week')"
          >Week</span>
        </div>
      </div>
      <div class="flex flex-no-wrap justify-between text-xs sm:text-sm mx-1 mt-3 md:mt-5">
        <div class="w-full text-center text-gray-500 font-bold">MON</div>
        <div class="w-full text-center text-gray-500 font-bold">TUE</div>
        <div class="w-full text-center text-gray-500 font-bold">WED</div>
        <div class="w-full text-center text-gray-500 font-bold">THU</div>
        <div class="w-full text-center text-gray-500 font-bold">FRI</div>
        <div class="w-full text-center text-gray-500 font-bold">SAT</div>
        <div class="w-full text-center text-gray-500 font-bold">SUN</div>
      </div>

      <div class="flex flex-no-wrap justify-between mx-1 mt-2 md:mt-5">
        <div class="flex flex-col w-full">
          <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 6">
            <div class="m-1 h-8 sm:h-12 md:h-16 lg:h-20 w-auto">&nbsp;</div>
          </div>
          <div v-for="(item, index) in daysInMonth" :key="index">
            <div
              @click="$store.commit('calendar/SELECT_DATE', item.fullDate)"
              class="relative border border-solid rounded-lg m-1 cursor-pointer flex justify-center items-center h-8 sm:h-12 md:h-16 lg:h-20 w-auto"
              :class="[$store.state.calendar.date_today === item.fullDate ? 'border-yellow-500 text-lg font-bold':'hover:bg-gray-300', selectedDate === item.fullDate && 'bg-gray-200']"
              v-if="item.day === 1"
            >
              <div class="text-xs md:text-sm z-10">{{(item.date)}}</div>
              <PerMonthInfoDateCell :item="item" />
            </div>
          </div>
        </div>
        <div class="flex flex-col w-full">
          <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 5">
            <div class="m-1 h-8 sm:h-12 md:h-16 lg:h-20 w-auto">&nbsp;</div>
          </div>
          <div v-for="(item, index) in daysInMonth" :key="index">
            <div
              @click="$store.commit('calendar/SELECT_DATE', item.fullDate)"
              class="relative border border-solid rounded-lg m-1 cursor-pointer flex justify-center items-center h-8 sm:h-12 md:h-16 lg:h-20 w-auto"
              :class="[$store.state.calendar.date_today === item.fullDate ? 'border-yellow-500 bg-white text-lg font-bold':'hover:bg-gray-300', selectedDate === item.fullDate && 'bg-gray-200']"
              v-if="item.day === 2"
            >
              <div class="text-xs md:text-sm z-10">{{item.date}}</div>
              <PerMonthInfoDateCell :item="item" />
            </div>
          </div>
        </div>
        <div class="flex flex-col w-full">
          <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 4">
            <div class="m-1 h-8 sm:h-12 md:h-16 lg:h-20 w-auto">&nbsp;</div>
          </div>
          <div v-for="(item, index) in daysInMonth" :key="index">
            <div
              @click="$store.commit('calendar/SELECT_DATE', item.fullDate)"
              class="relative border border-solid rounded-lg m-1 cursor-pointer flex justify-center items-center h-8 sm:h-12 md:h-16 lg:h-20 w-auto"
              :class="[$store.state.calendar.date_today === item.fullDate ? 'border-yellow-500 bg-white text-lg font-bold':'hover:bg-gray-300', selectedDate === item.fullDate && 'bg-gray-200']"
              v-if="item.day === 3"
            >
              <div class="text-xs md:text-sm z-10">{{(item.date)}}</div>
              <PerMonthInfoDateCell :item="item" />
            </div>
          </div>
        </div>
        <div class="flex flex-col w-full">
          <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 3">
            <div class="m-1 h-8 sm:h-12 md:h-16 lg:h-20 w-auto">&nbsp;</div>
          </div>
          <div v-for="(item, index) in daysInMonth" :key="index">
            <div
              @click="$store.commit('calendar/SELECT_DATE', item.fullDate)"
              class="relative border border-solid rounded-lg m-1 cursor-pointer flex justify-center items-center h-8 sm:h-12 md:h-16 lg:h-20 w-auto"
              :class="[$store.state.calendar.date_today === item.fullDate ? 'border-yellow-500 bg-white text-lg font-bold':'hover:bg-gray-300', selectedDate === item.fullDate && 'bg-gray-200']"
              v-if="item.day === 4"
            >
              <div class="text-xs md:text-sm z-10">{{item.date}}</div>
              <PerMonthInfoDateCell :item="item" />
            </div>
          </div>
        </div>
        <div class="flex flex-col w-full">
          <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 2">
            <div class="m-1 h-8 sm:h-12 md:h-16 lg:h-20 w-auto">&nbsp;</div>
          </div>
          <div v-for="(item, index) in daysInMonth" :key="index">
            <div
              @click="$store.commit('calendar/SELECT_DATE', item.fullDate)"
              class="relative border border-solid rounded-lg m-1 cursor-pointer flex justify-center items-center h-8 sm:h-12 md:h-16 lg:h-20 w-auto"
              :class="[$store.state.calendar.date_today === item.fullDate ? 'border-yellow-500 text-lg font-bold':'hover:bg-gray-300', selectedDate === item.fullDate && 'bg-gray-200']"
              v-if="item.day === 5"
            >
              <div class="text-xs md:text-sm z-10">{{(item.date)}}</div>
              <PerMonthInfoDateCell :item="item" />
            </div>
          </div>
        </div>
        <div class="flex flex-col w-full">
          <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 1">
            <div class="m-1 h-8 sm:h-12 md:h-16 lg:h-20 w-auto">&nbsp;</div>
          </div>
          <div v-for="(item, index) in daysInMonth" :key="index">
            <div
              @click="$store.commit('calendar/SELECT_DATE', item.fullDate)"
              class="relative border border-solid rounded-lg m-1 cursor-pointer flex justify-center items-center h-8 sm:h-12 md:h-16 lg:h-20 w-auto"
              :class="[$store.state.calendar.date_today === item.fullDate ? 'border-yellow-500 text-lg font-bold':'hover:bg-gray-300', selectedDate === item.fullDate && 'bg-gray-200']"
              v-if="item.day === 6"
            >
              <div class="text-xs md:text-sm z-10">{{item.date}}</div>
              <PerMonthInfoDateCell :item="item" />
            </div>
          </div>
        </div>
        <div class="flex flex-col w-full">
          <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 0">
            <div class="m-1 h-8 sm:h-12 md:h-16 lg:h-20 w-auto">&nbsp;</div>
          </div>
          <div v-for="(item, index) in daysInMonth" :key="index">
            <div
              @click="$store.commit('calendar/SELECT_DATE', item.fullDate)"
              class="relative border border-solid rounded-lg m-1 cursor-pointer flex justify-center items-center h-8 sm:h-12 md:h-16 lg:h-20 w-auto"
              :class="[$store.state.calendar.date_today === item.fullDate ? 'border-yellow-500 text-lg font-bold':'hover:bg-gray-300', selectedDate === item.fullDate && 'bg-gray-200']"
              v-if="item.day === 0"
            >
              <div class="text-xs md:text-sm z-10">{{item.date}}</div>
              <PerMonthInfoDateCell :item="item" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <AppLoading :loading="$store.state.calendar.loading" />
  </section>
</template>
<script>
import PerMonthInfoDateCell from "@/components/Calendar/PerMonthInfoDateCell";
import AppLoading from "@/components/Base/AppLoading";
import AppButton from "@/components/Base/AppButton";
export default {
  components: {
    AppLoading,
    AppButton,
    PerMonthInfoDateCell
  },
  data() {
    return {
      showRefresh: false,
      selectedMonth: null,
      selectedYear: new Date().getFullYear(),
      daysInMonth: [],
      startOfMonth: null,
      endOfMonth: null
    };
  },
  computed: {
    authPermissions() {
      return this.$store.getters["auth/permissions"];
    },
    selectedDate() {
      return this.$store.state.calendar.selected_date;
    }
  },
  watch: {
    selectedMonth(value) {
      this.getDaysInMonth(value, this.selectedYear);
    }
  },
  beforeDestroy() {
    this.$store.commit("jobs/CLEAR_JOBS");
  },
  created() {
    let selectedDate = this.$store.state.calendar.selected_date;
    this.startOfMonth = this.$moment(selectedDate)
      .startOf("month")
      .format("YYYY-MM-DD");
    this.endOfMonth = this.$moment(selectedDate)
      .endOf("month")
      .format("YYYY-MM-DD");
    let d = new Date(selectedDate);
    this.selectedMonth = d.getMonth();
    this.getDaysInMonth(this.selectedMonth, this.selectedYear);
    this.getJobs();
  },
  mounted() {
    // locum
    if (this.$auth.loggedIn && this.$auth.user.domain === "Locum") {
      this.$socket.on("Locum Notification Job Current", this.getJobsRealTime);
      this.$socket.on("Locum Notification Job Ongoing", this.getJobsRealTime);
      this.$socket.on("Locum Notification Job Cancelled", this.getJobsRealTime);
      this.$socket.on(
        "Locum Notification Job Part Completed",
        this.getJobsRealTime
      );
      this.$socket.on("Locum Notification Job Updated", this.getJobsRealTime);
      this.$socket.on("Locum Notification Job Applied", this.getJobsRealTime);
    }
    // practice
    if (this.$auth.loggedIn && this.$auth.user.domain === "Practice") {
      this.$socket.on(
        "Practice Notification Job Current",
        this.getJobsRealTime
      );
      this.$socket.on(
        "Practice Notification Job Available",
        this.getJobsRealTime
      );
      this.$socket.on(
        "Practice Notification Job Applied",
        this.getJobsRealTime
      );
      this.$socket.on(
        "Practice Notification Job Declined",
        this.getJobsRealTime
      );
      this.$socket.on(
        "Practice Notification Job Cancelled",
        this.getJobsRealTime
      );
      this.$socket.on(
        "Practice Notification Job Part Approved",
        this.getJobsRealTime
      );
      this.$socket.on(
        "Practice Notification Job Part Completed",
        this.getJobsRealTime
      );
      this.$socket.on(
        "Practice Notification Job Updated",
        this.getJobsRealTime
      );
    }
  },
  destroyed() {
    this.removeListener();
  },
  methods: {
    // PRACTICE
    async getJobsRealTime(job) {
      if (!job) {
        return;
      }
      console.log("job from socket", job);
      this.showRefresh = true;
    },
    async refreshJobs() {
      this.showRefresh = false;
      this.$store.commit("jobs/CLEAR_PRACTICE_JOB_NOTIFICATION");
      this.getJobs();
    },
    removeListener() {
      if (this.$auth.loggedIn && this.$auth.user.domain === "Locum") {
        this.$socket.removeListener(
          "Locum Notification Job Ongoing",
          this.getJobsRealTime
        );
        this.$socket.removeListener(
          "Locum Notification Job Current",
          this.getJobsRealTime
        );
        this.$socket.removeListener(
          "Locum Notification Job Cancelled",
          this.getJobsRealTime
        );
        this.$socket.removeListener(
          "Locum Notification Job Part Completed",
          this.getJobsRealTime
        );
        this.$socket.removeListener(
          "Locum Notification Job Updated",
          this.getJobsRealTime
        );
        this.$socket.removeListener(
          "Locum Notification Job Applied",
          this.getJobsRealTime
        );
      }
      if (this.$auth.loggedIn && this.$auth.user.domain === "Practice") {
        this.$socket.removeListener(
          "Practice Notification Job Current",
          this.getJobsRealTime
        );
        this.$socket.removeListener(
          "Practice Notification Job Available",
          this.getJobsRealTime
        );
        this.$socket.removeListener(
          "Practice Notification Job Applied",
          this.getJobsRealTime
        );
        this.$socket.removeListener(
          "Practice Notification Job Declined",
          this.getJobsRealTime
        );
        this.$socket.removeListener(
          "Practice Notification Job Cancelled",
          this.getJobsRealTime
        );
        this.$socket.removeListener(
          "Practice Notification Job Part Approved",
          this.getJobsRealTime
        );
        this.$socket.removeListener(
          "Practice Notification Job Part Completed",
          this.getJobsRealTime
        );
        this.$socket.removeListener(
          "Practice Notification Job Completed",
          this.getJobsRealTime
        );
        this.$socket.removeListener(
          "Practice Notification Job Updated",
          this.getJobsRealTime
        );
      }
    },
    getJobs() {
      // PRACTICE
      if (
        this.$auth.loggedIn &&
        this.$auth.user.domain === "Practice" &&
        this.authPermissions.includes("View Sessions Job")
      ) {
        this.$store.commit("calendar/TOGGLE_LOADING", true);

        Promise.all([
          this.$axios.$get("/api/v1/practice/jobs", {
            params: {
              status: ["Allocated", "Applied", "Unfilled", "Declined"],
              calendar_date_start: `${this.startOfMonth}:gte`,
              calendar_date_end: `${this.endOfMonth}:lte`,
              limit: 100000000
            }
          }),
          this.$axios.$get("/api/v1/practice/job-parts", {
            params: {
              status: ["Ongoing"],
              calendar_date_start: `${this.startOfMonth}:gte`,
              calendar_date_end: `${this.endOfMonth}:lte`,
              limit: 100000000
            }
          }),
          this.$axios.$get("/api/v1/practice/jobs", {
            params: {
              platform_selection_date: [
                `${this.startOfMonth}:gte`,
                `${this.endOfMonth}:lte`
              ],
              limit: 100000000,
              status: ["Live", "Applied"]
            }
          })
        ]).then(
          ([
            responseAllocatedandAppliedAndUnfilledAndDeclined,
            responseOngoing,
            responseReminders
          ]) => {
            this.$store.commit(
              "jobs/SET_PRACTICE_ALLOCATED_JOBS",
              responseAllocatedandAppliedAndUnfilledAndDeclined.data.jobs.filter(
                job => job.status === "Allocated"
              )
            );
            this.$store.commit(
              "jobs/SET_PRACTICE_APPLIED_JOBS",
              responseAllocatedandAppliedAndUnfilledAndDeclined.data.jobs.filter(
                job => job.status === "Applied"
              )
            );
            this.$store.commit(
              "jobs/SET_PRACTICE_UNFILLED_JOBS",
              responseAllocatedandAppliedAndUnfilledAndDeclined.data.jobs.filter(
                job => job.status === "Unfilled"
              )
            );
            this.$store.commit(
              "jobs/SET_PRACTICE_DECLINED_JOBS",
              responseAllocatedandAppliedAndUnfilledAndDeclined.data.jobs.filter(
                job => job.status === "Declined"
              )
            );
            this.$store.commit(
              "jobs/SET_PRACTICE_ONGOING_JOB_PARTS",
              responseOngoing.data.job_parts.filter(
                jobPart => jobPart.status === "Ongoing"
              )
            );
            this.$store.commit(
              "jobs/SET_PRACTICE_ALLOCATED_JOB_PARTS",
              responseOngoing.data.job_parts.filter(
                jobPart => jobPart.status === "Allocated"
              )
            );
            this.$store.commit(
              "jobs/SET_PRACTICE_AVAILABLE_JOBS_REMINDER",
              responseReminders.data.jobs.filter(
                job => job.status === "Available"
              )
            );
            this.$store.commit(
              "jobs/SET_PRACTICE_APPLIED_JOBS_REMINDER",
              responseReminders.data.jobs.filter(
                job => job.status === "Applied"
              )
            );
            this.$store.commit("calendar/TOGGLE_LOADING", false);
          }
        );
      }
      // LOCUM
      if (this.$auth.loggedIn && this.$auth.user.domain === "Locum") {
        this.$store.commit("calendar/TOGGLE_LOADING", true);
        Promise.all([
          this.$axios.$get("/api/v1/locum/jobs", {
            params: {
              locum_status: ["Applied"],
              calendar_date_start: `${this.startOfMonth}:gte`,
              calendar_date_end: `${this.endOfMonth}:lte`,
              limit: 100000000
            }
          }),
          this.$axios.$get("/api/v1/locum/job-parts", {
            params: {
              locum_status: ["Ongoing", "Allocated"],
              calendar_date_start: `${this.startOfMonth}:gte`,
              calendar_date_end: `${this.endOfMonth}:lte`,
              limit: 100000000
            }
          }),
          this.$axios.$get("/api/v1/locum/unavailabilities", {
            params: {
              date_start: `${this.startOfMonth}:gte`,
              date_end: `${this.endOfMonth}:lte`,
              limit: 100000000
            }
          })
        ]).then(
          ([responseApplied, responseOngoing, responseUnavailabilities]) => {
            this.$store.commit(
              "jobs/SET_LOCUM_APPLIED_JOBS",
              responseApplied.data.jobs
            );
            this.$store.commit(
              "jobs/SET_LOCUM_ONGOING_JOB_PARTS",
              responseOngoing.data.job_parts.filter(
                jobPart => jobPart.locum_status === "Ongoing"
              )
            );
            this.$store.commit(
              "jobs/SET_LOCUM_ALLOCATED_JOB_PARTS",
              responseOngoing.data.job_parts.filter(
                jobPart => jobPart.locum_status === "Allocated"
              )
            );
            this.$store.commit(
              "jobs/SET_LOCUM_UNAVAILABILITIES",
              responseUnavailabilities.data.unavailabilities
            );
            this.$store.commit("calendar/TOGGLE_LOADING", false);
          }
        );
      }
    },
    getDaysInMonth(month, selectedYear) {
      let date = new Date(selectedYear, month, 1);
      let days = [];
      while (date.getMonth() === month) {
        days.push(new Date(date));
        date.setDate(date.getDate() + 1);
      }
      let daysInMonth = [];
      days.forEach(day => {
        daysInMonth.push({
          day: day.getDay(),
          date: day.getDate(),
          fullDate: this.$moment(day).format("YYYY-MM-DD")
        });
      });
      this.daysInMonth = daysInMonth;
    },
    adjustMonth(type) {
      if (type === "previous") {
        if (this.selectedMonth === 0) {
          this.selectedMonth = 11;
          this.selectedYear--;
        } else {
          this.selectedMonth--;
        }
      }
      if (type === "next") {
        if (this.selectedMonth === 11) {
          this.selectedMonth = 0;
          this.selectedYear++;
        } else {
          this.selectedMonth++;
        }
      }
      this.startOfMonth = this.$moment(
        `${this.selectedYear}-${this.selectedMonth + 1}`
      )
        .startOf("month")
        .format("YYYY-MM-DD");
      this.endOfMonth = this.$moment(
        `${this.selectedYear}-${this.selectedMonth + 1}`
      )
        .endOf("month")
        .format("YYYY-MM-DD");

      this.$store.commit(
        "calendar/SELECT_DATE",
        this.$moment(this.$store.state.calendar.selected_date)
          .set("month", this.selectedMonth)
          .format("YYYY-MM-DD")
      );
      this.getJobs();
    }
  }
};
</script>