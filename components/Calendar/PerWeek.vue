<template>
  <section>
    <div class="flex flex-row flex-wrap mx-1">
      <div class="w-2/3 py-1 sm:w-1/3">
        <div
          class="text-xs sm:text-sm"
        >{{$moment(daysInWeek[0].date).format('MMM')}} {{$moment(daysInWeek[0].date).format('YYYY')}} - {{$moment(daysInWeek[6].date).format('MMM')}} {{$moment(daysInWeek[6].date).format('YYYY')}}</div>
      </div>
      <div class="w-1/3 py-1 flex flex-row flex-no-wrap justify-center">
        <span class="cursor-pointer" @click="adjustWeek('previous')">
          <svgicon name="arrow-left" height="12" width="12" />
        </span>
        <span class="mx-4"></span>
        <span class="cursor-pointer" @click="adjustWeek('next')">
          <svgicon name="arrow-right" height="12" width="12" />
        </span>
      </div>
      <div class="w-full py-1 text-right sm:w-1/3">
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
      <div class="w-full text-center text-gray-500 font-bold" style="min-width: 60px"></div>
      <div class="w-full text-center text-gray-500 font-bold">MON</div>
      <div class="w-full text-center text-gray-500 font-bold">TUE</div>
      <div class="w-full text-center text-gray-500 font-bold">WED</div>
      <div class="w-full text-center text-gray-500 font-bold">THU</div>
      <div class="w-full text-center text-gray-500 font-bold">FRI</div>
      <div class="w-full text-center text-gray-500 font-bold">SAT</div>
      <div class="w-full text-center text-gray-500 font-bold">SUN</div>
    </div>

    <div class="flex flex-no-wrap justify-between text-xs sm:text-sm mx-1 mt-3 md:mt-5">
      <div class="w-full text-center text-gray-600" style="min-width: 60px"></div>
      <div
        class="w-full text-center text-gray-600 font-bold"
        v-for="({id, date}, index) in daysInWeek"
        :key="index"
      >{{$moment(date).format('DD')}}</div>
    </div>
    <!-- PRACTICE -->
    <template v-if="$auth.user.domain === 'Practice'">
      <div class="flex flex-no-wrap justify-between text-xs mx-1 mt-5" style="height:50px;">
        <div class="w-full text-left my-auto" style="min-width: 60px">AM</div>
        <template v-for="({id, date}, index) in daysInWeek">
          <div
            v-if="hasPracticeCurrentJobs(date, 'AM')"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-green-400 hover:bg-gray-300"
            :key="`${date}-${index}-${id}-${id}`"
            @click="selectDateShift(date, 'AM')"
          ></div>
          <div
            v-else-if="hasPracticeAppliedJobs(date, 'AM')"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-orange-200 hover:bg-gray-300"
            :key="`${date}-${index}-${id}-${id}`"
            @click="selectDateShift(date, 'AM')"
          ></div>
          <div
            v-else-if="hasPracticeUnfilledJobs(date, 'AM')"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-red-500 hover:bg-gray-300"
            :key="`${date}-${index}-${id}-${id}`"
            @click="selectDateShift(date, 'AM')"
          ></div>
          <div
            v-else-if="hasPracticeDeclinedJobs(date, 'AM')"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-red-500 hover:bg-gray-300"
            :key="`${date}-${index}-${id}-${id}`"
            @click="selectDateShift(date, 'AM')"
          ></div>
          <div
            v-else-if="currentDate(date)"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-gray-300"
            :key="`${date}-${index}-${id}-${id}`"
            @click="selectDateShift(date, 'AM')"
          ></div>
          <div
            v-else
            class="w-full cursor-pointer border-t-2 border-gray-400 hover:bg-gray-300"
            :key="`${date}-${index}-${id}`"
            @click="selectDateShift(date, 'AM')"
          ></div>
        </template>
      </div>

      <div class="flex flex-no-wrap justify-between text-xs mx-1" style="height:50px;">
        <div class="w-full text-left my-auto" style="min-width: 60px">PM</div>
        <template v-for="({id, date}, index) in daysInWeek">
          <div
            v-if="hasPracticeCurrentJobs(date, 'PM')"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-green-400 hover:bg-gray-300"
            :key="`${date}-${index}-${id}`"
            @click="selectDateShift(date, 'PM')"
          ></div>
          <div
            v-else-if="hasPracticeAppliedJobs(date, 'PM')"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-orange-200 hover:bg-gray-300"
            :key="`${date}-${index}-${id}`"
            @click="selectDateShift(date, 'PM')"
          ></div>
          <div
            v-else-if="hasPracticeUnfilledJobs(date, 'PM')"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-red-500 hover:bg-gray-300"
            :key="`${date}-${index}-${id}`"
            @click="selectDateShift(date, 'PM')"
          ></div>
          <div
            v-else-if="hasPracticeDeclinedJobs(date, 'PM')"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-red-500 hover:bg-gray-300"
            :key="`${date}-${index}-${id}`"
            @click="selectDateShift(date, 'PM')"
          ></div>
          <div
            v-else-if="currentDate(date)"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-gray-300"
            :key="`${date}-${index}-${id}`"
            @click="selectDateShift(date, 'PM')"
          ></div>
          <div
            v-else
            class="w-full cursor-pointer border-t-2 border-gray-400 hover:bg-gray-300"
            :key="`${date}-${index}-${id}`"
            @click="selectDateShift(date, 'PM')"
          ></div>
        </template>
      </div>

      <div class="flex flex-no-wrap justify-between text-xs mx-1" style="height:50px;">
        <div class="w-full text-left my-auto" style="min-width: 60px">OOH</div>
        <template v-for="({id, date}, index) in daysInWeek">
          <div
            v-if="hasPracticeCurrentJobs(date, 'OOH')"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-green-400 hover:bg-gray-300"
            :key="`${date}-${index}-${id}`"
            @click="selectDateShift(date, 'OOH')"
          ></div>
          <div
            v-else-if="hasPracticeAppliedJobs(date, 'OOH')"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-orange-200 hover:bg-gray-300"
            :key="`${date}-${index}-${id}`"
            @click="selectDateShift(date, 'OOH')"
          ></div>
          <div
            v-else-if="hasPracticeUnfilledJobs(date, 'OOH')"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-red-500 hover:bg-gray-300"
            :key="`${date}-${index}-${id}`"
            @click="selectDateShift(date, 'OOH')"
          ></div>
          <div
            v-else-if="hasPracticeDeclinedJobs(date, 'OOH')"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-red-500 hover:bg-gray-300"
            :key="`${date}-${index}-${id}`"
            @click="selectDateShift(date, 'OOH')"
          ></div>
          <div
            v-else-if="currentDate(date)"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-gray-300"
            :key="`${date}-${index}-${id}`"
            @click="selectDateShift(date, 'OOH')"
          ></div>
          <div
            v-else
            class="w-full cursor-pointer border-t-2 border-gray-400 hover:bg-gray-300"
            :key="`${date}-${index}-${id}`"
            @click="selectDateShift(date, 'OOH')"
          ></div>
        </template>
      </div>

      <div class="flex flex-no-wrap justify-between text-xs mx-1" style="height:50px;">
        <div class="w-full text-left my-auto" style="min-width: 60px">Whole Day</div>
        <template v-for="({id, date}, index) in daysInWeek">
          <div
            v-if="hasPracticeCurrentJobs(date, 'Whole Day')"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-green-400 hover:bg-gray-300"
            :key="`${date}-${index}-${id}`"
            @click="selectDateShift(date, 'Whole Day')"
          ></div>
          <div
            v-else-if="hasPracticeAppliedJobs(date, 'Whole Day')"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-orange-200 hover:bg-gray-300"
            :key="`${date}-${index}-${id}`"
            @click="selectDateShift(date, 'Whole Day')"
          ></div>
          <div
            v-else-if="hasPracticeUnfilledJobs(date, 'Whole Day')"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-red-500 hover:bg-gray-300"
            :key="`${date}-${index}-${id}`"
            @click="selectDateShift(date, 'Whole Day')"
          ></div>
          <div
            v-else-if="hasPracticeDeclinedJobs(date, 'Whole Day')"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-red-500 hover:bg-gray-300"
            :key="`${date}-${index}-${id}`"
            @click="selectDateShift(date, 'Whole Day')"
          ></div>
          <div
            v-else-if="currentDate(date)"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-gray-300"
            :key="`${date}-${index}-${id}`"
            @click="selectDateShift(date, 'Whole Day')"
          ></div>
          <div
            v-else
            class="w-full cursor-pointer border-t-2 border-gray-400 hover:bg-gray-300"
            :key="`${date}-${index}-${id}`"
            @click="selectDateShift(date, 'Whole Day')"
          ></div>
        </template>
      </div>

      <div class="flex flex-no-wrap justify-between text-xs mx-1" style="height:50px;">
        <div class="w-full text-left my-auto" style="min-width: 60px">Reminder</div>
        <template v-for="({id, date}, index) in daysInWeek">
          <div
            v-if="hasPracticeAppliedJobsReminder(date, 'Reminder')"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-gray-900 hover:bg-gray-300"
            :key="`${date}-${index}-${id}`"
            @click="selectDateShift(date, 'Reminder')"
          ></div>
          <div
            v-else-if="hasPracticeAvailableJobsReminder(date, 'Reminder')"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-gray-900 hover:bg-gray-300"
            :key="`${date}-${index}-${id}`"
            @click="selectDateShift(date, 'Reminder')"
          ></div>
          <div
            v-else-if="currentDate(date)"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-gray-300"
            :key="`${date}-${index}-${id}`"
            @click="selectDateShift(date, 'Reminder')"
          ></div>
          <div
            v-else
            class="w-full cursor-pointer border-t-2 border-gray-400 hover:bg-gray-300"
            :key="`${date}-${index}-${id}`"
            @click="selectDateShift(date, 'Reminder')"
          ></div>
        </template>
      </div>
    </template>

    <!-- LOCUM -->
    <template v-if="$auth.user.domain === 'Locum'">
      <div class="flex flex-no-wrap justify-between text-xs mx-1 mt-5" style="height:50px;">
        <div class="w-full text-left my-auto" style="min-width: 60px">AM</div>
        <template v-for="({id, date}, index) in daysInWeek">
          <div
            v-if="hasLocumOngoingJobs(date, 'AM')"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-green-400 hover:bg-gray-300"
            :key="`${date}-${index}`"
            @click="selectDateShift(date, 'AM')"
          ></div>
          <div
            v-else-if="hasLocumAllocatedPrivateJobs(date, 'AM')"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-green-400 hover:bg-gray-300"
            :key="`${date}-${index}-${id}`"
            @click="selectDateShift(date, 'AM')"
          ></div>
          <div
            v-else-if="hasLocumAllocatedPlatformJob(date, 'AM')"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-green-400 hover:bg-gray-300"
            :key="`${date}-${index}-${id}`"
            @click="selectDateShift(date, 'AM')"
          ></div>
          <div
            v-else-if="hasLocumUnavailabilities(date, 'AM')"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-pink-500 hover:bg-gray-300"
            :key="`${date}-${index}-${id}`"
            @click="selectDateShift(date, 'AM')"
          ></div>
          <div
            v-else-if="currentDate(date)"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-gray-300"
            :key="`${date}-${index}-${id}`"
            @click="selectDateShift(date, 'AM')"
          ></div>
          <div
            v-else
            class="w-full cursor-pointer border-t-2 border-gray-400 hover:bg-gray-300"
            :key="`${date}-${index}-${id}`"
            @click="selectDateShift(date, 'AM')"
          ></div>
        </template>
      </div>
      <div class="flex flex-no-wrap justify-between text-xs mx-1" style="height:50px;">
        <div class="w-full text-left my-auto" style="min-width: 60px">PM</div>
        <template v-for="({id, date}, index) in daysInWeek">
          <div
            v-if="hasLocumOngoingJobs(date, 'PM')"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-green-400 hover:bg-gray-300"
            :key="`${date}-${index}`"
            @click="selectDateShift(date, 'PM')"
          ></div>
          <div
            v-else-if="hasLocumAllocatedPrivateJobs(date, 'PM')"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-green-400 hover:bg-gray-300"
            :key="`${date}-${index}-${id}`"
            @click="selectDateShift(date, 'PM')"
          ></div>
          <div
            v-else-if="hasLocumAllocatedPlatformJob(date, 'PM')"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-green-400 hover:bg-gray-300"
            :key="`${date}-${index}-${id}`"
            @click="selectDateShift(date, 'PM')"
          ></div>
          <div
            v-else-if="hasLocumUnavailabilities(date, 'PM')"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-pink-500 hover:bg-gray-300"
            :key="`${date}-${index}-${id}`"
            @click="selectDateShift(date, 'PM')"
          ></div>
          <div
            v-else-if="currentDate(date)"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-gray-300"
            :key="`${date}-${index}-${id}`"
            @click="selectDateShift(date, 'PM')"
          ></div>
          <div
            v-else
            class="w-full cursor-pointer border-t-2 border-gray-400 hover:bg-gray-300"
            :key="`${date}-${index}-${id}`"
            @click="selectDateShift(date, 'PM')"
          ></div>
        </template>
      </div>
      <div class="flex flex-no-wrap justify-between text-xs mx-1" style="height:50px;">
        <div class="w-full text-left my-auto" style="min-width: 60px">OOH</div>
        <template v-for="({id, date}, index) in daysInWeek">
          <div
            v-if="hasLocumOngoingJobs(date, 'OOH')"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-green-400 hover:bg-gray-300"
            :key="`${date}-${index}-${id}`"
            @click="selectDateShift(date, 'OOH')"
          ></div>
          <div
            v-else-if="hasLocumAllocatedPrivateJobs(date, 'OOH')"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-green-400 hover:bg-gray-300"
            :key="`${date}-${index}-${id}`"
            @click="selectDateShift(date, 'OOH')"
          ></div>
          <div
            v-else-if="hasLocumAllocatedPlatformJob(date, 'OOH')"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-green-400 hover:bg-gray-300"
            :key="`${date}-${index}-${id}`"
            @click="selectDateShift(date, 'OOH')"
          ></div>
          <div
            v-else-if="hasLocumUnavailabilities(date, 'OOH')"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-pink-500 hover:bg-gray-300"
            :key="`${date}-${index}-${id}`"
            @click="selectDateShift(date, 'OOH')"
          ></div>
          <div
            v-else-if="currentDate(date)"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-gray-300"
            :key="`${date}-${index}-${id}`"
            @click="selectDateShift(date, 'OOH')"
          ></div>
          <div
            v-else
            class="w-full cursor-pointer border-t-2 border-gray-400 hover:bg-gray-300"
            :key="`${date}-${index}-${id}`"
            @click="selectDateShift(date, 'OOH')"
          ></div>
        </template>
      </div>
      <div class="flex flex-no-wrap justify-between text-xs mx-1" style="height:50px;">
        <div class="w-full text-left my-auto" style="min-width: 60px">Whole-day</div>
        <template v-for="({id, date}, index) in daysInWeek">
          <div
            v-if="hasLocumOngoingJobs(date, 'Whole Day')"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-green-400 hover:bg-gray-300"
            :key="`${date}-${index}-${id}`"
            @click="selectDateShift(date, 'Whole Day')"
          ></div>
          <div
            v-else-if="hasLocumAllocatedPrivateJobs(date, 'Whole Day')"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-green-400 hover:bg-gray-300"
            :key="`${date}-${index}-${id}`"
            @click="selectDateShift(date, 'Whole Day')"
          ></div>
          <div
            v-else-if="hasLocumAllocatedPlatformJob(date, 'Whole Day')"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-green-400 hover:bg-gray-300"
            :key="`${date}-${index}-${id}`"
            @click="selectDateShift(date, 'Whole Day')"
          ></div>
          <div
            v-else-if="hasLocumUnavailabilities(date, 'Whole Day')"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-pink-500 hover:bg-gray-300"
            :key="`${date}-${index}-${id}`"
            @click="selectDateShift(date, 'Whole Day')"
          ></div>
          <div
            v-else-if="currentDate(date)"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-gray-300"
            :key="`${date}-${index}-${id}`"
            @click="selectDateShift(date, 'Whole Day')"
          ></div>
          <div
            v-else
            class="w-full cursor-pointer border-t-2 border-gray-400 hover:bg-gray-300"
            :key="`${date}-${index}-${id}`"
            @click="selectDateShift(date, 'Whole Day')"
          ></div>
        </template>
      </div>
      <div class="flex flex-no-wrap justify-between text-xs mx-1" style="height:50px;">
        <div class="w-full text-left my-auto" style="min-width: 60px">Applied</div>
        <template v-for="({id, date}, index) in daysInWeek">
          <div
            v-if="hasLocumAppliedJobs(date, 'Available')"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-orange-200 hover:bg-gray-300"
            :key="`${date}-${index}-${id}`"
            @click="selectDateShift(date, 'Available')"
          ></div>
          <div
            v-else-if="currentDate(date)"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-gray-300"
            :key="`${date}-${index}-${id}`"
            @click="selectDateShift(date, 'Available')"
          ></div>
          <div
            v-else
            class="w-full cursor-pointer border-t-2 border-gray-400 hover:bg-gray-300"
            :key="`${date}-${index}-${id}`"
            @click="selectDateShift(date, 'Available')"
          ></div>
        </template>
      </div>
    </template>
  </section>
</template>
<script>
export default {
  data() {
    return {
      firstDayOfTheWeek: null,
      lastDayOfTheWeek: null
    };
  },
  beforeDestroy() {
    this.$store.commit("jobs/CLEAR_JOBS");
  },
  created() {
    let selectedDate = this.$store.state.calendar.selected_date;
    this.firstDayOfTheWeek = this.$moment(selectedDate)
      .day("Monday")
      .format("YYYY-MM-DD");
    this.lastDayOfTheWeek = this.$moment(selectedDate)
      .add(1, "week")
      .day("sunday")
      .format("YYYY-MM-DD");
    this.getJobs();
  },
  computed: {
    //practice
    getPracticeAllocatedJobs() {
      return this.$store.getters["jobs/getPracticeAllocatedJobs"];
    },
    getPracticeAppliedJobs() {
      return this.$store.getters["jobs/getPracticeAppliedJobs"];
    },
    getPracticeUnfilledJobs() {
      return this.$store.getters["jobs/getPracticeUnfilledJobs"];
    },
    getPracticeDeclinedJobs() {
      return this.$store.getters["jobs/getPracticeDeclinedJobs"];
    },
    getPracticeAvailableJobsReminder() {
      return this.$store.getters["jobs/getPracticeAvailableJobsReminder"];
    },
    getPracticeAppliedJobsReminder() {
      return this.$store.getters["jobs/getPracticeAppliedJobsReminder"];
    },
    // locum
    getLocumOngoingJobs() {
      return this.$store.getters["jobs/getLocumOngoingJobs"];
    },
    getLocumAllocatedPrivateJobs() {
      return this.$store.getters["jobs/getLocumAllocatedPrivateJobs"];
    },
    getLocumAllocatedPlatformJobs() {
      return this.$store.getters["jobs/getLocumAllocatedPlatformJobs"];
    },
    getLocumAppliedJobs() {
      return this.$store.getters["jobs/getLocumAppliedJobs"];
    },
    getLocumUnavailabilities() {
      return this.$store.getters["jobs/getLocumUnavailabilities"];
    },
    daysInWeek() {
      let weekLists = [];
      for (let i = 0; i < 7; i++) {
        // weekLists.push(
        //   this.$moment(this.firstDayOfTheWeek)
        //     .add(i, "days")
        //     .format("YYYY-MM-DD")
        // );
        weekLists.push({
          id: weekLists.length,
          date: this.$moment(this.firstDayOfTheWeek)
            .add(i, "days")
            .format("YYYY-MM-DD")
        });
      }
      return weekLists;
    },
    selectedYear() {
      return this.$moment(this.firstDayOfTheWeek).format("YYYY");
    }
  },
  methods: {
    selectDateShift(date, shift) {
      this.$store.commit("calendar/SELECT_DATE_SHIFT", {
        date: date,
        shift: shift
      });
    },
    adjustWeek(type) {
      if (type === "next") {
        this.firstDayOfTheWeek = this.$moment(this.daysInWeek[6].date)
          .add(1, "days")
          .format("YYYY-MM-DD");
        this.lastDayOfTheWeek = this.$moment(this.daysInWeek[6].date)
          .add(0, "days")
          .format("YYYY-MM-DD");
      }
      if (type === "previous") {
        this.firstDayOfTheWeek = this.$moment(this.daysInWeek[0].date)
          .subtract(7, "days")
          .format("YYYY-MM-DD");
        this.lastDayOfTheWeek = this.$moment(this.daysInWeek[0].date)
          .add(6, "days")
          .format("YYYY-MM-DD");
      }

      this.$store.commit("calendar/SELECT_DATE_SHIFT", {
        date: this.$moment(this.$store.state.calendar.selected_date_shift.date)
          .add(7, "days")
          .format("YYYY-MM-DD"),
        shift: "AM"
      });
      this.getJobs();
    },
    currentDate(date) {
      if (date === this.$moment(new Date()).format("YYYY-MM-DD")) {
        return true;
      } else {
        return false;
      }
    },
    getJobs() {
      if (this.$auth.user.domain === "Practice") {
        this.$store.dispatch("jobs/fetchPracticeJobs", {
          data_start: `${this.firstDayOfTheWeek}:gte`,
          date_end: `${this.lastDayOfTheWeek}:lte`,
          status: ["Allocated"]
        });

        this.$store.dispatch("jobs/fetchPracticeJobs", {
          data_start: `${this.firstDayOfTheWeek}:gte`,
          date_end: `${this.lastDayOfTheWeek}:lte`,
          status: ["Applied"]
        });

        this.$store.dispatch("jobs/fetchPracticeJobs", {
          data_start: `${this.firstDayOfTheWeek}:gte`,
          date_end: `${this.lastDayOfTheWeek}:lte`,
          status: "Unfilled"
        });

        this.$store.dispatch("jobs/fetchPracticeJobs", {
          data_start: `${this.firstDayOfTheWeek}:gte`,
          date_end: `${this.lastDayOfTheWeek}:lte`,
          status: ["Declined"]
        });

        this.$store.dispatch("jobs/fetchPracticeJobsReminder", {
          platform_selection_date_start: `${this.firstDayOfTheWeek}:gte`,
          platform_selection_date_end: `${this.lastDayOfTheWeek}:lte`,
          status: ["Available"]
        });
      }
      if (this.$auth.user.domain === "Locum") {
        this.$store.dispatch("jobs/fetchLocumJobs", {
          calendar_date_start: `${this.firstDayOfTheWeek}:gte`,
          calendar_date_end: `${this.lastDayOfTheWeek}:lte`,
          limit: 100000000,
          locum_status: ["Allocated", "Applied"]
        });
        this.$store.dispatch("jobs/fetchLocumJobParts", {
          calendar_date_start: `${this.firstDayOfTheWeek}:gte`,
          calendar_date_end: `${this.lastDayOfTheWeek}:lte`,
          limit: 100000000,
          locum_status: ["Ongoing"]
        });
        this.$store.dispatch("jobs/fetchLocumUnavailabilities", {
          date_start: `${this.firstDayOfTheWeek}:gte`,
          date_end: `${this.lastDayOfTheWeek}:lte`,
          limit: 100000000
        });
      }
    },
    // practice
    hasPracticeCurrentJobs(date, type) {
      if (
        this.getPracticeAllocatedJobs &&
        this.getPracticeAllocatedJobs.length > 0
      ) {
        return this.getPracticeAllocatedJobs.find(
          job =>
            this.getDateArray(job.date_start, job.date_end).includes(date) &&
            job.shift.name === type
        );
      }
    },
    hasPracticeAppliedJobs(date, type) {
      if (
        this.getPracticeAppliedJobs &&
        this.getPracticeAppliedJobs.length > 0
      ) {
        return this.getPracticeAppliedJobs.find(
          job =>
            this.getDateArray(job.date_start, job.date_end).includes(date) &&
            job.shift.name === type
        );
      }
    },
    hasPracticeUnfilledJobs(date, type) {
      if (
        this.getPracticeUnfilledJobs &&
        this.getPracticeUnfilledJobs.length > 0
      ) {
        return this.getPracticeUnfilledJobs.find(
          job =>
            this.getDateArray(job.date_start, job.date_end).includes(date) &&
            job.shift.name === type
        );
      }
    },
    hasPracticeDeclinedJobs(date, type) {
      if (
        this.getPracticeDeclinedJobs &&
        this.getPracticeDeclinedJobs.length > 0
      ) {
        return this.getPracticeDeclinedJobs.find(
          job =>
            this.$moment(job.platform_job.declined_at).format("YYYY-MM-DD") ===
              date && job.shift.name === type
        );
      }
    },
    hasPracticeAppliedJobsReminder(date, type) {
      if (
        this.getPracticeAppliedJobsReminder &&
        this.getPracticeAppliedJobsReminder.length > 0
      ) {
        return this.getPracticeAppliedJobsReminder.find(
          job => job.platform_job.selection_date === date && type === "Reminder"
        );
      }
    },
    hasPracticeAvailableJobsReminder(date, type) {
      if (
        this.getPracticeAvailableJobsReminder &&
        this.getPracticeAvailableJobsReminder.length > 0
      ) {
        return this.getPracticeAvailableJobsReminder.find(
          job => job.platform_job.selection_date === date && type === "Reminder"
        );
      }
    },
    // locums
    hasLocumOngoingJobs(date, type) {
      if (this.getLocumOngoingJobs && this.getLocumOngoingJobs.length > 0) {
        return this.getLocumOngoingJobs.find(
          job_part =>
            this.getDateArray(job_part.date_start, job_part.date_end).includes(
              date
            ) && job_part.job.shift.name === type
        );
      }
    },
    hasLocumAllocatedPrivateJobs(date, type) {
      if (
        this.getLocumAllocatedPrivateJobs &&
        this.getLocumAllocatedPrivateJobs.length > 0
      ) {
        return this.getLocumAllocatedPrivateJobs.find(
          job =>
            this.getDateArray(job.date_start, job.date_end).includes(date) &&
            job.shift.name === type
        );
      }
    },
    hasLocumAllocatedPlatformJob(date, type) {
      if (
        this.getLocumAllocatedPlatformJobs &&
        this.getLocumAllocatedPlatformJobs.length > 0
      ) {
        return this.getLocumAllocatedPlatformJobs.find(
          job =>
            this.getDateArray(job.date_start, job.date_end).includes(date) &&
            job.shift.name === type
        );
      }
    },
    hasLocumAppliedJobs(date, type) {
      return this.getLocumAppliedJobs.find(job =>
        this.getDateArray(job.date_start, job.date_end).includes(date)
      );
    },
    hasLocumUnavailabilities(date, type) {
      if (
        this.getLocumUnavailabilities &&
        this.getLocumUnavailabilities.length > 0
      ) {
        return this.getLocumUnavailabilities.find(
          job =>
            job.date === date && job.shifts.find(shift => shift.name === type)
        );
      }
    }
  }
};
</script>
<style scoped>
</style>
