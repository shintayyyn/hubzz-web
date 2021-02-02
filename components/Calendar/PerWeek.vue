<template>
  <section class="py-3">
    <div class="flex flex-row flex-wrap justify-between mx-1">
        <div class="w-1/2 flex items-center justify-between">
          <span class="cursor-pointer mx-2" @click="adjustWeek('previous')">
            <svgicon name="caret-down" class="fill-current" height="16" width="16" style="transform: rotate(180deg)" />
          </span>
          <div
            class="font-bold text-gray-800"
          >
            {{ $moment(daysInWeek[0].date).format('MMM') }} {{ $moment(daysInWeek[0].date).format('YYYY') }} - {{ $moment(daysInWeek[6].date).format('MMM') }} {{ $moment(daysInWeek[6].date).format('YYYY') }}
          </div>
           

          <span class="cursor-pointer mx-2" @click="adjustWeek('next')">
            <svgicon name="caret-down" class="fill-current" height="16" width="16" />
          </span>
        </div>
        <div class="w-1/2 flex items-center" :class="showRefresh ? 'justify-between' : 'justify-end'">
          <div v-if="showRefresh" class="ml-2">
            <AppButton
              :label="'Refresh'"
              :in-style="'font-size:12px;'"
              :inClass="'text-xs py-1 px-4 rounded'"
              @click="refreshJobs"
            />
          </div>
          <div class="flex items-center">
            <span
            class="text-xs py-1 px-4 rounded"
            :class="$store.state.calendar.view_type === 'per_month' ? 'bg-orange-500 text-white font-bold cursor-default':'border hover:bg-gray-400 cursor-pointer'"
            @click="$store.commit('calendar/TOGGLE_CALENDAR_VIEW_TYPE', 'per_month')"
            >Month</span>

            <span
              class="text-xs py-1 px-4 rounded ml-2"
              :class="$store.state.calendar.view_type === 'per_week' ? 'bg-orange-500 text-white font-bold cursor-default':'border hover:bg-gray-400 cursor-pointer'"
              @click="$store.commit('calendar/TOGGLE_CALENDAR_VIEW_TYPE', 'per_week')"
            >Week</span>
          </div>
        </div>
      </div>
    <!-- <div class="flex flex-row flex-wrap mx-1">
      <div class="w-2/3 py-1 sm:w-1/3">
        <div class="flex flex-col">
          <div v-if="showRefresh" class="flex flex-row flex-wrap justify-between mt-1">
            <AppButton
              :label="'Refresh'"
              :in-style="'padding:5px 14px;margin-bottom:5px;font-size:14px;'"
              @click="refreshJobs"
            />
          </div>

          <div
            class="text-xs sm:text-sm"
          >
            {{ $moment(daysInWeek[0].date).format('MMM') }} {{ $moment(daysInWeek[0].date).format('YYYY') }} - {{ $moment(daysInWeek[6].date).format('MMM') }} {{ $moment(daysInWeek[6].date).format('YYYY') }}
          </div>
        </div>
      </div>

      <div class="w-1/3 py-1 px-2 flex flex-no-wrap justify-end md:justify-center items-center">
        <span class="cursor-pointer" @click="adjustWeek('previous')">
          <svgicon name="arrow-left" height="12" width="12" />
        </span>

        <span class="mx-4" />

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
    </div> -->

    <div class="flex flex-no-wrap justify-between text-xs sm:text-sm mx-1 mt-3 md:mt-5">
      <div class="w-full text-center text-gray-500 font-bold" style="min-width: 60px" />

      <div class="w-full text-center text-gray-500 font-bold">
        MON
      </div>

      <div class="w-full text-center text-gray-500 font-bold">
        TUE
      </div>

      <div class="w-full text-center text-gray-500 font-bold">
        WED
      </div>

      <div class="w-full text-center text-gray-500 font-bold">
        THU
      </div>

      <div class="w-full text-center text-gray-500 font-bold">
        FRI
      </div>

      <div class="w-full text-center text-gray-500 font-bold">
        SAT
      </div>

      <div class="w-full text-center text-gray-500 font-bold">
        SUN
      </div>
    </div>

    <div class="flex flex-no-wrap justify-between text-xs sm:text-sm mx-1 mt-3 md:mt-5">
      <div class="w-full text-center text-gray-600" style="min-width: 60px" />

      <div
        v-for="({id, date}, index) in daysInWeek"
        :key="index"
        class="w-full text-center text-gray-600 font-bold"
      >
        {{ $moment(date).format('DD') }}
      </div>
    </div>

    <!-- PRACTICE -->
    <template v-if="$auth.user.domain === 'Practice'">
      <div class="flex flex-no-wrap justify-between text-xs mx-1 mt-5" style="height:50px;">
        <div class="w-full text-left my-auto" style="min-width: 60px">
          AM
        </div>

        <template v-for="({ id, date, day }, index) in daysInWeek">
          <div
            v-if="hasPracticeAllocatedJobs(date, 'AM', day)"
            :key="`${date}-${index}-${id}-${id}`"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-job-active"
            @click="selectDateShift(date, 'AM')"
          />

          <div
            v-else-if="hasPracticeUnfilledJobs(date, 'AM', day)"
            :key="`${date}-${index}-${id}-${id}`"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-job-unfilled"
            @click="selectDateShift(date, 'AM')"
          />

          <div
            v-else-if="hasPracticeDeclinedJobs(date, 'AM', day)"
            :key="`${date}-${index}-${id}-${id}`"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-job-unfilled"
            @click="selectDateShift(date, 'AM')"
          />

          <div
            v-else-if="hasPracticeAppliedJobs(date, 'AM', day)"
            :key="`${date}-${index}-${id}-${id}`"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-job-pending"
            @click="selectDateShift(date, 'AM')"
          />

          <div
            v-else-if="hasPracticeAvailableJobs(date, 'AM', day)"
            :key="`${date}-${index}-${id}-${id}`"
            class="w-full cursor-pointer border-t-2 border-gray-300 bg-gray-300 hover:bg-gray-400"
            @click="selectDateShift(date, 'AM')"
          />

          <div
            v-else-if="currentDate(date)"
            :key="`${date}-${index}-${id}-${id}`"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-gray-300 hover:bg-gray-400"
            @click="selectDateShift(date, 'AM')"
          />

          <div
            v-else
            :key="`${date}-${index}-${id}`"
            class="w-full cursor-pointer border-t-2 border-gray-400 hover:bg-gray-500"
            @click="selectDateShift(date, 'AM')"
          />
        </template>
      </div>

      <div class="flex flex-no-wrap justify-between text-xs mx-1" style="height:50px;">
        <div class="w-full text-left my-auto" style="min-width: 60px">
          PM
        </div>

        <template v-for="({id, date, day}, index) in daysInWeek">
          <div
            v-if="hasPracticeAllocatedJobs(date, 'PM', day)"
            :key="`${date}-${index}-${id}`"
            class="w-full cursor-pointer border-t-2 border-gray-300 bg-job-active"
            @click="selectDateShift(date, 'PM')"
          />

          <div
            v-else-if="hasPracticeUnfilledJobs(date, 'PM', day)"
            :key="`${date}-${index}-${id}`"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-job-unfilled"
            @click="selectDateShift(date, 'PM')"
          />

          <div
            v-else-if="hasPracticeDeclinedJobs(date, 'PM', day)"
            :key="`${date}-${index}-${id}`"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-job-unfilled"
            @click="selectDateShift(date, 'PM')"
          />

          <div
            v-else-if="hasPracticeAppliedJobs(date, 'PM', day)"
            :key="`${date}-${index}-${id}`"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-job-pending"
            @click="selectDateShift(date, 'PM')"
          />

          <div
            v-else-if="hasPracticeAvailableJobs(date, 'PM', day)"
            :key="`${date}-${index}-${id}-${id}`"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-gray-300 hover:bg-gray-400"
            @click="selectDateShift(date, 'PM')"
          />

          <div
            v-else-if="currentDate(date)"
            :key="`${date}-${index}-${id}`"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-gray-300 hover:bg-gray-400"
            @click="selectDateShift(date, 'PM')"
          />

          <div
            v-else
            :key="`${date}-${index}-${id}`"
            class="w-full cursor-pointer border-t-2 border-gray-400 hover:bg-gray-500"
            @click="selectDateShift(date, 'PM')"
          />
        </template>
      </div>

      <div class="flex flex-no-wrap justify-between text-xs mx-1" style="height:50px;">
        <div class="w-full text-left my-auto" style="min-width: 60px">
          OOH
        </div>

        <template v-for="({id, date, day}, index) in daysInWeek">
          <div
            v-if="hasPracticeAllocatedJobs(date, 'OOH', day)"
            :key="`${date}-${index}-${id}`"
            class="w-full cursor-pointer border-t-2 border-gray-300 bg-job-active"
            @click="selectDateShift(date, 'OOH')"
          />

          <div
            v-else-if="hasPracticeUnfilledJobs(date, 'OOH', day)"
            :key="`${date}-${index}-${id}`"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-job-unfilled"
            @click="selectDateShift(date, 'OOH')"
          />

          <div
            v-else-if="hasPracticeDeclinedJobs(date, 'OOH', day)"
            :key="`${date}-${index}-${id}`"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-job-unfilled"
            @click="selectDateShift(date, 'OOH')"
          />

          <div
            v-else-if="hasPracticeAppliedJobs(date, 'OOH', day)"
            :key="`${date}-${index}-${id}`"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-job-pending"
            @click="selectDateShift(date, 'OOH')"
          />

          <div
            v-else-if="hasPracticeAvailableJobs(date, 'OOH', day)"
            :key="`${date}-${index}-${id}-${id}`"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-gray-300 hover:bg-gray-400"
            @click="selectDateShift(date, 'OOH')"
          />

          <div
            v-else-if="currentDate(date)"
            :key="`${date}-${index}-${id}`"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-gray-300 hover:bg-gray-400"
            @click="selectDateShift(date, 'OOH')"
          />

          <div
            v-else
            :key="`${date}-${index}-${id}`"
            class="w-full cursor-pointer border-t-2 border-gray-400 hover:bg-gray-500"
            @click="selectDateShift(date, 'OOH')"
          />
        </template>
      </div>

      <div class="flex flex-no-wrap justify-between text-xs mx-1" style="height:50px;">
        <div class="w-full text-left my-auto" style="min-width: 60px">
          Whole Day
        </div>

        <template v-for="({id, date, day}, index) in daysInWeek">
          <div
            v-if="hasPracticeAllocatedJobs(date, 'Whole Day', day)"
            :key="`${date}-${index}-${id}`"
            class="w-full cursor-pointer border-t-2 border-gray-300 bg-job-active"
            @click="selectDateShift(date, 'Whole Day')"
          />

          <div
            v-else-if="hasPracticeUnfilledJobs(date, 'Whole Day', day)"
            :key="`${date}-${index}-${id}`"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-job-unfilled"
            @click="selectDateShift(date, 'Whole Day')"
          />

          <div
            v-else-if="hasPracticeDeclinedJobs(date, 'Whole Day', day)"
            :key="`${date}-${index}-${id}`"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-job-unfilled"
            @click="selectDateShift(date, 'Whole Day')"
          />

          <div
            v-else-if="hasPracticeAppliedJobs(date, 'Whole Day', day)"
            :key="`${date}-${index}-${id}`"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-job-pending"
            @click="selectDateShift(date, 'Whole Day')"
          />

          <div
            v-else-if="hasPracticeAvailableJobs(date, 'Whole Day', day)"
            :key="`${date}-${index}-${id}-${id}`"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-gray-300 hover:bg-gray-400"
            @click="selectDateShift(date, 'Whole Day')"
          />

          <div
            v-else-if="currentDate(date)"
            :key="`${date}-${index}-${id}`"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-gray-300 hover:bg-gray-400"
            @click="selectDateShift(date, 'Whole Day')"
          />

          <div
            v-else
            :key="`${date}-${index}-${id}`"
            class="w-full cursor-pointer border-t-2 border-gray-400 hover:bg-gray-500"
            @click="selectDateShift(date, 'Whole Day')"
          />
        </template>
      </div>
    </template>

    <!-- LOCUM -->
    <template v-if="$auth.user.domain === 'Locum'">
      <div class="flex flex-no-wrap justify-between text-xs mx-1 mt-5" style="height:50px;">
        <div class="w-full text-left my-auto" style="min-width: 60px">
          AM
        </div>

        <template v-for="({id, date, day}, index) in daysInWeek">
          <div
            v-if="hasLocumAllocatedJobs(date, 'AM', day)"
            :key="`${date}-${index}`"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-job-active"
            :class="currentDate(date) ? 'currentDate' : ''"
            @click="selectDateShift(date, 'AM')"
          />

          <div
            v-else-if="hasLocumPrivateAllocatedJobs(date, 'AM', day)"
            :key="`${date}-${index}`"
            class="w-full cursor-pointer border-t-2 border-gray-300 bg-job-active"
            @click="selectDateShift(date, 'AM')"
          />

          <div
            v-else-if="hasLocumPrivateOngoingJobs(date, 'AM', day)"
            :key="`${date}-${index}`"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-blue-500 hover:bg-blue-600"
            :class="currentDate(date) ? 'currentDate' : ''"
            @click="selectDateShift(date, 'AM')"
          />

          <div
            v-else-if="currentDate(date)"
            :key="`${date}-${index}-${id}`"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-gray-300 hover:bg-gray-400"
            @click="selectDateShift(date, 'AM')"
          />

          <div
            v-else
            :key="`${date}-${index}-${id}`"
            class="w-full cursor-pointer border-t-2 border-gray-400 hover:bg-gray-500"
            @click="selectDateShift(date, 'AM')"
          />
        </template>
      </div>

      <div class="flex flex-no-wrap justify-between text-xs mx-1" style="height:50px;">
        <div class="w-full text-left my-auto" style="min-width: 60px">
          PM
        </div>

        <template v-for="({id, date, day}, index) in daysInWeek">
          <div
            v-if="hasLocumAllocatedJobs(date, 'PM', day)"
            :key="`${date}-${index}`"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-job-active"
            :class="currentDate(date) ? 'currentDate' : ''"
            @click="selectDateShift(date, 'PM')"
          />

          <div
            v-else-if="hasLocumPrivateAllocatedJobs(date, 'PM', day)"
            :key="`${date}-${index}`"
            class="w-full cursor-pointer border-t-2 border-gray-300 bg-job-active"
            @click="selectDateShift(date, 'PM')"
          />

          <div
            v-else-if="hasLocumPrivateOngoingJobs(date, 'PM', day)"
            :key="`${date}-${index}`"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-blue-500 hover:bg-blue-600"
            :class="currentDate(date) ? 'currentDate' : ''"
            @click="selectDateShift(date, 'PM')"
          />

          <div
            v-else-if="currentDate(date)"
            :key="`${date}-${index}-${id}`"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-gray-300 hover:bg-gray-400"
            @click="selectDateShift(date, 'PM')"
          />
          <div
            v-else
            :key="`${date}-${index}-${id}`"
            class="w-full cursor-pointer border-t-2 border-gray-400 hover:bg-gray-500"
            @click="selectDateShift(date, 'PM')"
          />
        </template>
      </div>

      <div class="flex flex-no-wrap justify-between text-xs mx-1" style="height:50px;">
        <div class="w-full text-left my-auto" style="min-width: 60px">
          OOH
        </div>

        <template v-for="({id, date, day}, index) in daysInWeek">
          <div
            v-if="hasLocumAllocatedJobs(date, 'OOH', day)"
            :key="`${date}-${index}-${id}`"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-job-active"
            :class="currentDate(date) ? 'currentDate' : ''"
            @click="selectDateShift(date, 'OOH')"
          />

          <div
            v-else-if="hasLocumPrivateAllocatedJobs(date, 'OOH', day)"
            :key="`${date}-${index}`"
            class="w-full cursor-pointer border-t-2 border-gray-300 bg-job-active"
            @click="selectDateShift(date, 'OOH')"
          />

          <div
            v-else-if="hasLocumPrivateOngoingJobs(date, 'OOH', day)"
            :key="`${date}-${index}-${id}`"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-blue-500 hover:bg-blue-600"
            :class="currentDate(date) ? 'currentDate' : ''"
            @click="selectDateShift(date, 'OOH')"
          />

          <div
            v-else-if="currentDate(date)"
            :key="`${date}-${index}-${id}`"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-gray-300 hover:bg-gray-400"
            @click="selectDateShift(date, 'OOH')"
          />

          <div
            v-else
            :key="`${date}-${index}-${id}`"
            class="w-full cursor-pointer border-t-2 border-gray-400 hover:bg-gray-500"
            @click="selectDateShift(date, 'OOH')"
          />
        </template>
      </div>

      <div class="flex flex-no-wrap justify-between text-xs mx-1" style="height:50px;">
        <div class="w-full text-left my-auto" style="min-width: 60px">
          Whole-day
        </div>

        <template v-for="({id, date, day}, index) in daysInWeek">
          <div
            v-if="hasLocumAllocatedJobs(date, 'Whole Day', day)"
            :key="`${date}-${index}-${id}`"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-job-active"
            :class="currentDate(date) ? 'currentDate' : ''"
            @click="selectDateShift(date, 'Whole Day')"
          />

          <div
            v-else-if="hasLocumPrivateAllocatedJobs(date, 'Whole Day', day)"
            :key="`${date}-${index}`"
            class="w-full cursor-pointer border-t-2 border-gray-300 bg-job-active"
            @click="selectDateShift(date, 'Whole Day')"
          />

          <div
            v-else-if="hasLocumPrivateOngoingJobs(date, 'Whole Day', day)"
            :key="`${date}-${index}-${id}`"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-blue-500 hover:bg-blue-600"
            :class="currentDate(date) ? 'currentDate' : ''"
            @click="selectDateShift(date, 'Whole Day')"
          />

          <div
            v-else-if="currentDate(date)"
            :key="`${date}-${index}-${id}`"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-gray-300 hover:bg-gray-400"
            @click="selectDateShift(date, 'Whole Day')"
          />

          <div
            v-else
            :key="`${date}-${index}-${id}`"
            class="w-full cursor-pointer border-t-2 border-gray-400 hover:bg-gray-500"
            @click="selectDateShift(date, 'Whole Day')"
          />
        </template>
      </div>

      <div class="flex flex-no-wrap justify-between text-xs mx-1" style="height:50px;">
        <div class="w-full text-left my-auto" style="min-width: 60px">
          Applied
        </div>

        <template v-for="({id, date, day}, index) in daysInWeek">
          <div
            v-if="hasLocumAppliedJobs(date, day)"
            :key="`${date}-${index}-${id}`"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-job-pending"
            :class="currentDate(date) ? 'currentDate' : ''"
            @click="selectDateShift(date, 'Available')"
          />

          <div
            v-else-if="currentDate(date)"
            :key="`${date}-${index}-${id}`"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-gray-300 hover:bg-gray-400"
            @click="selectDateShift(date, 'Available')"
          />

          <div
            v-else
            :key="`${date}-${index}-${id}`"
            class="w-full cursor-pointer border-t-2 border-gray-400 hover:bg-gray-500"
            @click="selectDateShift(date, 'Available')"
          />
        </template>
      </div>

      <div class="flex flex-no-wrap justify-between text-xs mx-1" style="height:50px;">
        <div class="w-full text-left my-auto" style="min-width: 60px">
          Interview
        </div>

        <template v-for="({id, date, day}, index) in daysInWeek">
          <div
            v-if="hasLocumPermanentJobs(date, day)"
            :key="`${date}-${index}-${id}`"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-blue-400 hover:bg-blue-500"
            :class="currentDate(date) ? 'currentDate' : ''"
            @click="selectDateShift(date, 'Available')"
          />

          <div
            v-else-if="currentDate(date)"
            :key="`${date}-${index}-${id}`"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-gray-300 hover:bg-gray-400"
            @click="selectDateShift(date, 'Available')"
          />

          <div
            v-else
            :key="`${date}-${index}-${id}`"
            class="w-full cursor-pointer border-t-2 border-gray-400 hover:bg-gray-500"
            @click="selectDateShift(date, 'Available')"
          />
        </template>
      </div>
    </template>

    <AppLoading :loading="$store.state.calendar.loading" />
  </section>
</template>

<script>
import AppLoading from "@/components/Base/AppLoading"
import AppButton from "@/components/Base/AppButton"

export default {
  components: {
    AppLoading,
    AppButton,
  },

  data () {
    return {
      showRefresh: false,
      firstDayOfTheWeek: null,
      lastDayOfTheWeek: null,
    }
  },

  computed: {
    // PRACTICE
    // PARTS
    getPracticeOngoingJobs () {
      return this.$store.getters["jobs/getPracticeOngoingJobs"]
    },

    getPracticeCompletedJobs () {
      return this.$store.getters["jobs/getPracticeCompletedJobs"]
    },

    getPracticeAllocatedPartJobs () {
      return this.$store.getters["jobs/getPracticeAllocatedPartJobs"]
    },

    // WHOLE
    getPracticeAllocatedJobs () {
      return this.$store.getters["jobs/getPracticeAllocatedJobs"]
    },

    getPracticeAppliedJobs () {
      return this.$store.getters["jobs/getPracticeAppliedJobs"]
    },

    getPracticeUnfilledJobs () {
      return this.$store.getters["jobs/getPracticeUnfilledJobs"]
    },

    getPracticeDeclinedJobs () {
      return this.$store.getters["jobs/getPracticeDeclinedJobs"]
    },

    getPracticeAvailableJobs () {
      return this.$store.getters["jobs/getPracticeAvailableJobs"]
    },

    // REMINDERS
    getPracticeAvailableJobsReminder () {
      return this.$store.getters["jobs/getPracticeAvailableJobsReminder"]
    },

    getPracticeAppliedJobsReminder () {
      return this.$store.getters["jobs/getPracticeAppliedJobsReminder"]
    },

    // LOCUM
    // PARTS
    getLocumOngoingJobs () {
      return this.$store.getters["jobs/getLocumOngoingJobs"]
    },

    getLocumCompletedJobs () {
      return this.$store.getters["jobs/getLocumCompletedJobs"]
    },

    getLocumAllocatedPartJobs () {
      return this.$store.getters["jobs/getLocumAllocatedPartJobs"]
    },

    // WHOLE
    getLocumAllocatedJobs () {
      return this.$store.getters["jobs/getLocumAllocatedJobs"]
    },

    getLocumAppliedJobs () {
      return this.$store.getters["jobs/getLocumAppliedJobs"]
    },

    getLocumAvailableJobs () {
      return this.$store.getters["jobs/getLocumAvailableJobs"]
    },

    getLocumMatchedJobs () {
      return this.$store.getters["jobs/getLocumMatchedJobs"]
    },

    getLocumBankJobs () {
      return this.$store.getters["jobs/getLocumBankJobs"]
    },

    getLocumPrivateJobParts () {
      return this.$store.getters["jobs/getLocumPrivateJobParts"]
    },

    getLocumPermanentJobs () {
      return this.$store.getters["jobs/getLocumPermanentJobs"]
    },

    // UNAVAILABILITIES
    getLocumUnavailabilities () {
      return this.$store.getters["jobs/getLocumUnavailabilities"]
    },

    daysInWeek () {
      let weekLists = []
      for (let i = 0; i < 7; i++) {
        weekLists.push({
          id: weekLists.length,
          date: this.$moment(this.firstDayOfTheWeek)
            .add(i, "days")
            .format("YYYY-MM-DD"),
          day: this.$moment(this.firstDayOfTheWeek)
            .add(i, "days")
            .weekday(),
        })
      }
      return weekLists
    },

    selectedYear () {
      return this.$moment(this.firstDayOfTheWeek).format("YYYY")
    },
  },

  beforeDestroy () {
    this.$store.commit("jobs/CLEAR_JOBS")
  },

  mounted () {
    if (this.$auth.loggedIn && this.$auth.user.domain === "Locum") {
      this.$socket.on(
        "Locum Notification Job Allocated",
        this.jobsRealTimeHandler
      )
      this.$socket.on(
        "Locum Notification Job Ongoing",
        this.jobsRealTimeHandler
      )
      this.$socket.on(
        "Locum Notification Locum Invoice Updated",
        this.jobsRealTimeHandler
      )
      this.$socket.on(
        "Locum Notification Job Cancelled",
        this.jobsRealTimeHandler
      )
      this.$socket.on(
        "Locum Notification Job Amended",
        this.jobsRealTimeHandler
      )
      this.$socket.on(
        "Locum Notification Job Updated",
        this.jobsRealTimeHandler
      )
      this.$socket.on(
        "Locum Notification Job Declined",
        this.jobsRealTimeHandler
      )
      this.$socket.on(
        "Locum Notification Job Auto Declined",
        this.jobsRealTimeHandler
      )
      this.$socket.on(
        "Locum Notification Job Unqualified",
        this.jobsRealTimeHandler
      )
    }

    if (this.$auth.loggedIn && this.$auth.user.domain === "Practice") {
      this.$socket.on(
        "Practice Notification Job Updated",
        this.jobsRealTimeHandler
      )
      this.$socket.on(
        "Practice Notification Job Application",
        this.jobsRealTimeHandler
      )
      this.$socket.on(
        "Practice Notification Job Application Cancelled",
        this.jobsRealTimeHandler
      )
      this.$socket.on(
        "Practice Notification Job Allocated",
        this.jobsRealTimeHandler
      )
      this.$socket.on(
        "Practice Notification Job Ongoing",
        this.jobsRealTimeHandler
      )
      this.$socket.on(
        "Practice Notification Locum Invoice Updated",
        this.jobsRealTimeHandler
      )
      this.$socket.on(
        "Practice Notification Job Cancelled",
        this.jobsRealTimeHandler
      )
      this.$socket.on(
        "Practice Notification Job Amended",
        this.jobsRealTimeHandler
      )
      this.$socket.on(
        "Practice Notification Job Declined",
        this.jobsRealTimeHandler
      )
      this.$socket.on(
        "Practice Notification Job Auto Declined",
        this.jobsRealTimeHandler
      )
      this.$socket.on(
        "Practice Notification Job Update Accept",
        this.jobsRealTimeHandler
      )
      this.$socket.on(
        "Practice Notification Job Unfilled",
        this.jobsRealTimeHandler
      )
    }

    const selectedDate = this.$store.state.calendar.selected_date

    this.firstDayOfTheWeek = this.$moment(selectedDate, "YYYY-MM-DD")
      .day("Monday")
      .format("YYYY-MM-DD")

    this.lastDayOfTheWeek = this.$moment(selectedDate, "YYYY-MM-DD")
      .add(1, "week")
      .day("Monday")
      .format("YYYY-MM-DD")

    this.getJobs()
  },

  destroyed () {
    if (this.$auth.loggedIn && this.$auth.user.domain === "Locum") {
      this.$socket.removeListener(
        "Locum Notification Job Allocated",
        this.jobsRealTimeHandler
      )
      this.$socket.removeListener(
        "Locum Notification Job Ongoing",
        this.jobsRealTimeHandler
      )
      this.$socket.removeListener(
        "Locum Notification Locum Invoice Updated",
        this.jobsRealTimeHandler
      )
      this.$socket.removeListener(
        "Locum Notification Job Cancelled",
        this.jobsRealTimeHandler
      )
      this.$socket.removeListener(
        "Locum Notification Job Amended",
        this.jobsRealTimeHandler
      )
      this.$socket.removeListener(
        "Locum Notification Job Updated",
        this.jobsRealTimeHandler
      )
      this.$socket.removeListener(
        "Locum Notification Job Declined",
        this.jobsRealTimeHandler
      )
      this.$socket.removeListener(
        "Locum Notification Job Auto Declined",
        this.jobsRealTimeHandler
      )
      this.$socket.removeListener(
        "Locum Notification Job Unqualified",
        this.jobsRealTimeHandler
      )
    }

    if (this.$auth.loggedIn && this.$auth.user.domain === "Practice") {
      this.$socket.removeListener(
        "Practice Notification Job Updated",
        this.jobsRealTimeHandler
      )
      this.$socket.removeListener(
        "Practice Notification Job Application",
        this.jobsRealTimeHandler
      )
      this.$socket.removeListener(
        "Practice Notification Job Application Cancelled",
        this.jobsRealTimeHandler
      )
      this.$socket.removeListener(
        "Practice Notification Job Allocated",
        this.jobsRealTimeHandler
      )
      this.$socket.removeListener(
        "Practice Notification Job Ongoing",
        this.jobsRealTimeHandler
      )
      this.$socket.removeListener(
        "Practice Notification Locum Invoice Updated",
        this.jobsRealTimeHandler
      )
      this.$socket.removeListener(
        "Practice Notification Job Cancelled",
        this.jobsRealTimeHandler
      )
      this.$socket.removeListener(
        "Practice Notification Job Amended",
        this.jobsRealTimeHandler
      )
      this.$socket.removeListener(
        "Practice Notification Job Declined",
        this.jobsRealTimeHandler
      )
      this.$socket.removeListener(
        "Practice Notification Job Auto Declined",
        this.jobsRealTimeHandler
      )
      this.$socket.removeListener(
        "Practice Notification Job Update Accept",
        this.jobsRealTimeHandler
      )
      this.$socket.removeListener(
        "Practice Notification Job Unfilled",
        this.jobsRealTimeHandler
      )
    }
  },

  methods: {
    selectDateShift (date, shift) {
      this.$store.commit("calendar/SELECT_DATE_SHIFT", {
        date: date,
        shift: shift,
      })
    },

    adjustWeek (type) {
      if (type === "next") {
        this.firstDayOfTheWeek = this.$moment(this.daysInWeek[6].date)
          .add(1, "days")
          .format("YYYY-MM-DD")
        this.lastDayOfTheWeek = this.$moment(this.daysInWeek[6].date)
          .add(0, "days")
          .format("YYYY-MM-DD")

        this.$store.commit("calendar/SELECT_DATE_SHIFT", {
          date: this.$moment(
            this.$store.state.calendar.selected_date_shift.date,
            "YYYY-MM-DD"
          )
            .add(7, "days")
            .format("YYYY-MM-DD"),
          shift: "AM",
        })
      }
      if (type === "previous") {
        this.firstDayOfTheWeek = this.$moment(this.daysInWeek[0].date)
          .subtract(7, "days")
          .format("YYYY-MM-DD")
        this.lastDayOfTheWeek = this.$moment(this.daysInWeek[0].date)
          .add(6, "days")
          .format("YYYY-MM-DD")

        this.$store.commit("calendar/SELECT_DATE_SHIFT", {
          date: this.$moment(
            this.$store.state.calendar.selected_date_shift.date,
            "YYYY-MM-DD"
          )
            .subtract(7, "days")
            .format("YYYY-MM-DD"),
          shift: "AM",
        })
      }

      this.getJobs()
    },

    currentDate (date) {
      if (date === this.$moment().format("YYYY-MM-DD")) {
        return true
      } else {
        return false
      }
    },

    getJobs () {
      this.$emit(
        "getCalendarJobAndJobParts",
        this.firstDayOfTheWeek,
        this.lastDayOfTheWeek
      )
    },

    async jobsRealTimeHandler (job) {
      if (!job) {
        return
      }

      this.showRefresh = true
    },

    async refreshJobs () {
      this.showRefresh = false
      this.$store.commit("jobs/CLEAR_PRACTICE_JOB_NOTIFICATION")
      this.getJobs()
    },

    // PRACTICE
    // PARTS
    hasPracticeOngoingJobs (date, type) {
      if (
        this.getPracticeOngoingJobs
				&& this.getPracticeOngoingJobs.length > 0
      ) {
        return this.getPracticeOngoingJobs.find(
          job_part =>
            job_part.dates.includes(date)
						&& job_part.job.shifts.find(s => s.name === type)
        )
      }
    },

    hasPracticeCompletedJobs (date, type) {
      if (
        this.getPracticeCompletedJobs
				&& this.getPracticeCompletedJobs.length > 0
      ) {
        return this.getPracticeCompletedJobs.find(
          job_part =>
            job_part.dates.includes(date)
						&& job_part.job.shifts.find(s => s.name === type)
        )
      }
    },

    hasPracticeAllocatedJobs (date, type) {
      if (
        this.getPracticeAllocatedPartJobs
				&& this.getPracticeAllocatedPartJobs.length > 0
      ) {
        return this.getPracticeAllocatedPartJobs.find(
          job_part =>
            job_part.dates.includes(date)
						&& job_part.job.shifts.find(s => s.name === type)
        )
      }
    },

    // WHOLE
    // hasPracticeAllocatedJobs (date, type, day) {
    //   if (
    //     this.getPracticeAllocatedJobs &&
    //     this.getPracticeAllocatedJobs.length > 0
    //   ) {
    //     return this.getPracticeAllocatedJobs.find(
    //       job =>
    //         this.getDateArray(job.date_start, job.date_end).includes(date) &&
    //         job.shift.name === type &&
    //         ((job.include_saturday === false && day !== 6) ||
    //           job.include_saturday === true) &&
    //         ((job.include_sunday === false && day !== 0) ||
    //           job.include_sunday === true)
    //     )
    //   }
    // },
    hasPracticeAppliedJobs (date, type) {
      if (
        this.getPracticeAppliedJobs
				&& this.getPracticeAppliedJobs.length > 0
      ) {
        return this.getPracticeAppliedJobs.find(
          job =>
            job.dates.includes(date) && job.shifts.find(s => s.name === type)
        )
      }
    },

    hasPracticeUnfilledJobs (date, type) {
      if (
        this.getPracticeUnfilledJobs
				&& this.getPracticeUnfilledJobs.length > 0
      ) {
        return this.getPracticeUnfilledJobs.find(
          job =>
            job.dates.includes(date) && job.shifts.find(s => s.name === type)
        )
      }
    },

    hasPracticeDeclinedJobs (date, type) {
      if (
        this.getPracticeDeclinedJobs
				&& this.getPracticeDeclinedJobs.length > 0
      ) {
        return this.getPracticeDeclinedJobs.find(
          job =>
            job.dates.includes(date) && job.shifts.find(s => s.name === type)
        )
      }
    },

    hasPracticeAvailableJobs (date, type) {
      if (
        this.getPracticeAvailableJobs
				&& this.getPracticeAvailableJobs.length > 0
      ) {
        return this.getPracticeAvailableJobs.find(
          job => job.dates[0] === date && job.shifts.find(s => s.name === type)
        )
      }
    },

    // REMINDERS
    hasPracticeAppliedJobsReminder (date, type) {
      if (
        this.getPracticeAppliedJobsReminder
				&& this.getPracticeAppliedJobsReminder.length > 0
      ) {
        return this.getPracticeAppliedJobsReminder.find(
          job => job.platform_job.selection_date === date && type === "Reminder"
        )
      }
    },

    hasPracticeAvailableJobsReminder (date, type) {
      if (
        this.getPracticeAvailableJobsReminder
				&& this.getPracticeAvailableJobsReminder.length > 0
      ) {
        return this.getPracticeAvailableJobsReminder.find(
          job => job.platform_job.selection_date === date && type === "Reminder"
        )
      }
    },

    // LOCUM
    // PARTS
    // hasLocumOngoingJobs (date, type, day) {
    //   if (this.getLocumOngoingJobs && this.getLocumOngoingJobs.length > 0) {
    //     return this.getLocumOngoingJobs.find(
    //       job_part =>
    //         job_part.dates.includes(date) &&
    //         job_part.job.shift.name === type
    //     )
    //   }
    // },
    // hasLocumCompletedJobs (date, type, day) {
    //   if (this.getLocumCompletedJobs && this.getLocumCompletedJobs.length > 0) {
    //     return this.getLocumCompletedJobs.find(
    //       job_part =>
    //         this.getDateArray(job_part.date_start, job_part.date_end).includes(
    //           date
    //         ) &&
    //         job_part.job.shift.name === type &&
    //         ((job_part.job.include_saturday === false && day !== 6) ||
    //           job_part.job.include_saturday === true) &&
    //         ((job_part.job.include_sunday === false && day !== 0) ||
    //           job_part.job.include_sunday === true)
    //     )
    //   }
    // },
    // WHOLE
    hasLocumAllocatedJobs (date, type) {
      if (
        this.getLocumAllocatedPartJobs
				&& this.getLocumAllocatedPartJobs.length > 0
      ) {
        return this.getLocumAllocatedPartJobs.find(
          job_part =>
            job_part.dates.includes(date)
						&& job_part.job.shifts.find(s => s.name === type)
        )
      }
    },
    // hasLocumAvailableJobs (date, type, day) {
    //   if (this.getLocumAvailableJobs && this.getLocumAvailableJobs.length > 0) {
    //     return this.getLocumAvailableJobs.find(
    //       job =>
    //         this.getDateArray(job.date_start, job.date_end).includes(date) &&
    //         job.shift.name === type &&
    //         ((job.include_saturday === false && day !== 6) ||
    //           job.include_saturday === true) &&
    //         ((job.include_sunday === false && day !== 0) ||
    //           job.include_sunday === true)
    //     )
    //   }
    // },
    // hasLocumMatchedJobs (date, type, day) {
    //   if (this.getLocumMatchedJobs && this.getLocumMatchedJobs.length > 0) {
    //     return this.getLocumMatchedJobs.find(
    //       job =>
    //         this.getDateArray(job.date_start, job.date_end).includes(date) &&
    //         job.shift.name === type &&
    //         ((job.include_saturday === false && day !== 6) ||
    //           job.include_saturday === true) &&
    //         ((job.include_sunday === false && day !== 0) ||
    //           job.include_sunday === true)
    //     )
    //   }
    // },
    // hasLocumBankJobs (date, type, day) {
    //   if (this.getLocumBankJobs && this.getLocumBankJobs.length > 0) {
    //     return this.getLocumBankJobs.find(
    //       job =>
    //         this.getDateArray(job.date_start, job.date_end).includes(date) &&
    //         job.shift.name === type &&
    //         ((job.include_saturday === false && day !== 6) ||
    //           job.include_saturday === true) &&
    //         ((job.include_sunday === false && day !== 0) ||
    //           job.include_sunday === true)
    //     )
    //   }
    // },
    hasLocumAppliedJobs (date) {
      return this.getLocumAppliedJobs.find(job => job.dates.includes(date))
    },

    hasLocumPrivateOngoingJobs (date, type) {
      return this.getLocumPrivateJobParts.find(
        job_part =>
          job_part.locum_status === "Ongoing"
					&& job_part.dates.includes(date)
					&& job_part.job.shift.name === type
      )
    },

    hasLocumPrivateAllocatedJobs (date, type) {
      return this.getLocumPrivateJobParts.find(
        job_part =>
          job_part.locum_status === "Allocated"
					&& job_part.dates.includes(date)
					&& job_part.job.shift.name === type
      )
    },

    hasLocumPermanentJobs (date) {
      return this.getLocumPermanentJobs.find(
        job =>
          this.$moment(job.invitation_schedule).format("YYYY-MM-DD") === date
      )
    },
    // UNAVAILABILITIES
    // hasLocumUnavailabilities (date, type) {
    //   if (
    //     this.getLocumUnavailabilities &&
    //     this.getLocumUnavailabilities.length > 0
    //   ) {
    //     return this.getLocumUnavailabilities.find(
    //       job =>
    //         job.date === date && job.shifts.find(shift => shift.name === type)
    //     )
    //   }
    // }
  },
}
</script>
