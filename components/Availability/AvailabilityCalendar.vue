<template>
  <section class="relative">
    <div class="flex flex-row flex-wrap mx-1">
      <div class="w-1/2 text-left">
        <div
          class="text-xs lg:text-base"
        >{{$store.state.availability.months[selectedMonth]}} {{selectedYear}}</div>
      </div>
      <div class="w-1/2 flex flex-row flex-no-wrap justify-end">
        <span class="cursor-pointer" @click="adjustMonth('previous')">
          <svgicon name="arrow-left" height="15" width="15" />
        </span>
        <span class="mx-4"></span>
        <span class="cursor-pointer" @click="adjustMonth('next')">
          <svgicon name="arrow-right" height="15" width="15" />
        </span>
      </div>
    </div>

    <div class="flex flex-no-wrap justify-between text-xs lg:text-base mx-1 mt-5">
      <div class="w-full text-center text-gray-500 font-bold">MON</div>
      <div class="w-full text-center text-gray-500 font-bold">TUE</div>
      <div class="w-full text-center text-gray-500 font-bold">WED</div>
      <div class="w-full text-center text-gray-500 font-bold">THU</div>
      <div class="w-full text-center text-gray-500 font-bold">FRI</div>
      <div class="w-full text-center text-gray-500 font-bold">SAT</div>
      <div class="w-full text-center text-gray-500 font-bold">SUN</div>
    </div>

    <div class="flex flex-no-wrap justify-between mx-1 mt-5">
      <div class="flex flex-col w-full">
        <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 6">
          <div class="m-1 h-8 sm:h-12 md:h-16 lg:h-20 w-auto">&nbsp;</div>
        </div>
        <div v-for="(item, index) in daysInMonth" :key="index">
          <div
            @click="selectDate(item)"
            class="relative border border-solid rounded-lg m-1 cursor-pointer flex justify-center items-center h-8 sm:h-12 md:h-16 lg:h-20 w-auto"
            :class="$store.state.availability.date_today === item.fullDate ? 'border-yellow-500 text-lg font-bold':'hover:bg-gray-300'"
            v-if="item.day === 1"
          >
            <div class="text-xs lg:text-base z-10">{{(item.date)}}</div>
            <AvailabilityInfoDateCell :item="item" />
          </div>
        </div>
      </div>
      <div class="flex flex-col w-full">
        <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 5">
          <div class="m-1 h-8 sm:h-12 md:h-16 lg:h-20 w-auto">&nbsp;</div>
        </div>
        <div v-for="(item, index) in daysInMonth" :key="index">
          <div
            @click="selectDate(item)"
            class="relative border border-solid rounded-lg m-1 cursor-pointer flex justify-center items-center h-8 sm:h-12 md:h-16 lg:h-20 w-auto"
            :class="$store.state.availability.date_today === item.fullDate ? 'border-yellow-500 text-lg font-bold':'hover:bg-gray-300'"
            v-if="item.day === 2"
          >
            <div class="text-xs lg:text-base z-10">{{(item.date)}}</div>
            <AvailabilityInfoDateCell :item="item" />
          </div>
        </div>
      </div>
      <div class="flex flex-col w-full">
        <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 4">
          <div class="m-1 h-8 sm:h-12 md:h-16 lg:h-20 w-auto">&nbsp;</div>
        </div>
        <div v-for="(item, index) in daysInMonth" :key="index">
          <div
            @click="selectDate(item)"
            class="relative border border-solid rounded-lg m-1 cursor-pointer flex justify-center items-center h-8 sm:h-12 md:h-16 lg:h-20 w-auto"
            :class="$store.state.availability.date_today === item.fullDate ? 'border-yellow-500 text-lg font-bold':'hover:bg-gray-300'"
            v-if="item.day === 3"
          >
            <div class="text-xs lg:text-base z-10">{{(item.date)}}</div>
            <AvailabilityInfoDateCell :item="item" />
          </div>
        </div>
      </div>
      <div class="flex flex-col w-full">
        <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 3">
          <div class="m-1 h-8 sm:h-12 md:h-16 lg:h-20 w-auto">&nbsp;</div>
        </div>
        <div v-for="(item, index) in daysInMonth" :key="index">
          <div
            @click="selectDate(item)"
            class="relative border border-solid rounded-lg m-1 cursor-pointer flex justify-center items-center h-8 sm:h-12 md:h-16 lg:h-20 w-auto"
            :class="$store.state.availability.date_today === item.fullDate ? 'border-yellow-500 text-lg font-bold':'hover:bg-gray-300'"
            v-if="item.day === 4"
          >
            <div class="text-xs lg:text-base z-10">{{(item.date)}}</div>
            <AvailabilityInfoDateCell :item="item" />
          </div>
        </div>
      </div>
      <div class="flex flex-col w-full">
        <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 2">
          <div class="m-1 h-8 sm:h-12 md:h-16 lg:h-20 w-auto">&nbsp;</div>
        </div>
        <div v-for="(item, index) in daysInMonth" :key="index">
          <div
            @click="selectDate(item)"
            class="relative border border-solid rounded-lg m-1 cursor-pointer flex justify-center items-center h-8 sm:h-12 md:h-16 lg:h-20 w-auto"
            :class="$store.state.availability.date_today === item.fullDate ? 'border-yellow-500 text-lg font-bold':'hover:bg-gray-300'"
            v-if="item.day === 5"
          >
            <div class="text-xs lg:text-base z-10">{{(item.date)}}</div>
            <AvailabilityInfoDateCell :item="item" />
          </div>
        </div>
      </div>
      <div class="flex flex-col w-full">
        <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 1">
          <div class="m-1 h-8 sm:h-12 md:h-16 lg:h-20 w-auto">&nbsp;</div>
        </div>
        <div v-for="(item, index) in daysInMonth" :key="index">
          <div
            @click="selectDate(item)"
            class="relative border border-solid rounded-lg m-1 cursor-pointer flex justify-center items-center h-8 sm:h-12 md:h-16 lg:h-20 w-auto"
            :class="$store.state.availability.date_today === item.fullDate ? 'border-yellow-500 text-lg font-bold':'hover:bg-gray-300'"
            v-if="item.day === 6"
          >
            <div class="text-xs lg:text-base z-10">{{(item.date)}}</div>
            <AvailabilityInfoDateCell :item="item" />
          </div>
        </div>
      </div>
      <div class="flex flex-col w-full">
        <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 0">
          <div class="m-1 h-8 sm:h-12 md:h-16 lg:h-20 w-auto">&nbsp;</div>
        </div>
        <div v-for="(item, index) in daysInMonth" :key="index">
          <div
            @click="selectDate(item)"
            class="relative border border-solid rounded-lg m-1 cursor-pointer flex justify-center items-center h-8 sm:h-12 md:h-16 lg:h-20 w-auto"
            :class="$store.state.availability.date_today === item.fullDate ? 'border-yellow-500 text-lg font-bold':'hover:bg-gray-300'"
            v-if="item.day === 0"
          >
            <div class="text-xs lg:text-base z-10">{{(item.date)}}</div>
            <AvailabilityInfoDateCell :item="item" />
          </div>
        </div>
      </div>
    </div>
    <AppLoading :loading="loading" spinner />
  </section>
</template>
<script>
import AvailabilityInfoDateCell from "@/components/Availability/AvailabilityInfoDateCell";
import AppLoading from "@/components/Base/AppLoading";
export default {
  components: {
    AvailabilityInfoDateCell,
    AppLoading
  },
  data() {
    return {
      loading: false,
      selectedMonth: 0,
      selectedYear: new Date().getFullYear(),
      daysInMonth: [],
      startOfMonth: null,
      endOfMonth: null
    };
  },
  computed: {
    getLocumOngoingJobs() {
      return this.$store.getters["jobs/getLocumOngoingJobs"];
    },
    getLocumAllocatedJobs() {
      return this.$store.getters["jobs/getLocumAllocatedJobs"];
    },
    getLocumUnavailabilities() {
      return this.$store.getters["jobs/getLocumUnavailabilities"];
    }
  },
  created() {
    this.startOfMonth = this.$moment()
      .startOf("month")
      .format("YYYY-MM-DD");
    this.endOfMonth = this.$moment()
      .endOf("month")
      .format("YYYY-MM-DD");
    let d = new Date();
    this.selectedMonth = d.getMonth();
    this.getDaysInMonth(this.selectedMonth, this.selectedYear);
    this.getJobs();
  },
  watch: {
    selectedMonth(newValue, oldValue) {
      if (newValue && oldValue) {
        this.getDaysInMonth(newValue, this.selectedYear);
      }
    }
  },
  methods: {
    getJobs() {
      // this.$store.commit("calendar/TOGGLE_LOADING", true);
      this.loading = true;
      Promise.all([
        this.$axios.$get("/api/v1/locum/jobs", {
          params: {
            locum_status: ["Allocated"],
            calendar_date_start: `${this.startOfMonth}:gte`,
            calendar_date_end: `${this.endOfMonth}:lte`,
            limit: 100000000
          }
        }),
        this.$axios.$get("/api/v1/locum/job-parts", {
          params: {
            locum_status: ["Ongoing"],
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
      ])
        .then(
          ([responseAllocated, responseOngoing, responseUnavailabilities]) => {
            this.$store.commit(
              "jobs/SET_LOCUM_ALLOCATED_JOBS",
              responseAllocated.data.jobs.filter(
                job => job.locum_status === "Allocated"
              )
            );
            this.$store.commit(
              "jobs/SET_LOCUM_ONGOING_JOB_PARTS",
              responseOngoing.data.job_parts.filter(
                jobPart => jobPart.locum_status === "Ongoing"
              )
            );
            this.$store.commit(
              "jobs/SET_LOCUM_UNAVAILABILITIES",
              responseUnavailabilities.data.unavailabilities
            );
          }
        )
        .finally(() => {
          // this.$store.commit("calendar/TOGGLE_LOADING", false);
          this.loading = false;
        });
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
        let date = day.getDate();
        let fullDate = this.$moment(day, "ddd MMM DD YYYY HH:mm:ss zzZ").format(
          "YYYY-MM-DD"
        );
        daysInMonth.push({
          day: day.getDay(),
          date,
          fullDate
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
      this.getJobs();
    },
    selectDate(date) {
      // if (!date.unavailableId) {
      //   this.$router.push({
      //     path: `/availability/create`,
      //     query: { ...this.$route.query, type: "solo" }
      //   });
      // } else if (date.unavailableId) {
      //   this.$router.push({
      //     path: `/availability/${date.fullDate}`,
      //     query: { ...this.$route.query, type: "solo" }
      //   });
      // }
      let selectedDate = date.fullDate;
      let unavailableDate = null;
      let allocatedDate = null;
      let ongoingDate = null;

      if (
        this.getLocumUnavailabilities &&
        this.getLocumUnavailabilities.length > 0
      ) {
        let isUnavailable = this.getLocumUnavailabilities.find(
          unavailable => unavailable.date === selectedDate
        );
        if (isUnavailable) {
          unavailableDate = {
            id: isUnavailable.id,
            shifts: isUnavailable.shifts
          };
        }
      }
      if (this.getLocumOngoingJobs && this.getLocumOngoingJobs.length > 0) {
        let hasLocumOngoingJob = this.getLocumOngoingJobs.filter(job_part =>
          this.getDateArray(job_part.date_start, job_part.date_end).includes(
            selectedDate
          )
        );
        if (hasLocumOngoingJob && hasLocumOngoingJob.length > 0) {
          ongoingDate = hasLocumOngoingJob.map(item => {
            return item.job.shift;
          });
        }
      }
      if (this.getLocumAllocatedJobs && this.getLocumAllocatedJobs.length > 0) {
        let hasLocumAllocatedJob = this.getLocumAllocatedJobs.filter(job =>
          this.getDateArray(job.date_start, job.date_end).includes(selectedDate)
        );
        if (hasLocumAllocatedJob && hasLocumAllocatedJob.length > 0) {
          allocatedDate = hasLocumAllocatedJob.map(item => {
            return item.shift;
          });
        }
      }

      // console.log("selectedDate", selectedDate);
      // console.log("unavailableDate", unavailableDate);
      // console.log("allocatedDate", allocatedDate);
      // console.log("ongoingDate", ongoingDate);
      this.$emit("open", {
        selectedDate,
        unavailableDate,
        allocatedDate,
        ongoingDate
      });
    }
  }
};
</script>


