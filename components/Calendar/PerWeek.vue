<template>
  <section>
    <div class="flex flex-row flex-wrap mx-1">
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
    </div>

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
        <template v-for="({id, date, day}, index) in daysInWeek">
          <div
            v-if="hasPracticeOngoingJobs(date, 'AM', day)"
            :key="`${date}-${index}-${id}-${id}`"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-job-active"
            @click="selectDateShift(date, 'AM')"
          />
          <!-- <div
            v-if="hasPracticeCompletedJobs(date, 'AM', day)"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-job-active"
            :key="`${date}-${index}-${id}-${id}`"
            @click="selectDateShift(date, 'AM')"
          ></div> -->
          <!-- <div
            v-else-if="hasPracticeAllocatedJobs(date, 'AM', day)"
            class="w-full cursor-pointer border-t-2 border-gray-300 bg-green-300"
            :key="`${date}-${index}-${id}-${id}`"
            @click="selectDateShift(date, 'AM')"
          ></div> -->
          <div
            v-else-if="hasPracticeAppliedJobs(date, 'AM', day)"
            :key="`${date}-${index}-${id}-${id}`"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-job-pending"
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
            v-else-if="hasPracticeAvailableJobs(date, 'AM', day)"
            :key="`${date}-${index}-${id}-${id}`"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-job-active"
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
            class="w-full cursor-pointer border-t-2 border-gray-400  hover:bg-gray-500"
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
            v-if="hasPracticeOngoingJobs(date, 'PM', day)"
            :key="`${date}-${index}-${id}-${id}`"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-job-active"
            @click="selectDateShift(date, 'PM')"
          />
          <!-- <div
            v-if="hasPracticeCompletedJobs(date, 'PM', day)"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-job-active"
            :key="`${date}-${index}-${id}-${id}`"
            @click="selectDateShift(date, 'PM')"
          ></div>
          <div
            v-else-if="hasPracticeAllocatedJobs(date, 'PM', day)"
            class="w-full cursor-pointer border-t-2 border-gray-300 bg-green-300"
            :key="`${date}-${index}-${id}`"
            @click="selectDateShift(date, 'PM')"
          ></div> -->
          <div
            v-else-if="hasPracticeAppliedJobs(date, 'PM', day)"
            :key="`${date}-${index}-${id}`"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-job-pending"
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
            v-else-if="hasPracticeAvailableJobs(date, 'PM', day)"
            :key="`${date}-${index}-${id}-${id}`"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-job-active"
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
            class="w-full cursor-pointer border-t-2 border-gray-400  hover:bg-gray-500"
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
            v-if="hasPracticeOngoingJobs(date, 'OOH', day)"
            :key="`${date}-${index}-${id}-${id}`"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-job-active"
            @click="selectDateShift(date, 'OOH')"
          />
          <!-- <div
            v-if="hasPracticeCompletedJobs(date, 'OOH', day)"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-job-active"
            :key="`${date}-${index}-${id}-${id}`"
            @click="selectDateShift(date, 'OOH')"
          ></div>
          <div
            v-else-if="hasPracticeAllocatedJobs(date, 'OOH', day)"
            class="w-full cursor-pointer border-t-2 border-gray-300 bg-green-300"
            :key="`${date}-${index}-${id}`"
            @click="selectDateShift(date, 'OOH')"
          ></div> -->
          <div
            v-else-if="hasPracticeAppliedJobs(date, 'OOH', day)"
            :key="`${date}-${index}-${id}`"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-job-pending"
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
            v-else-if="hasPracticeAvailableJobs(date, 'OOH', day)"
            :key="`${date}-${index}-${id}-${id}`"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-job-active"
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
            class="w-full cursor-pointer border-t-2 border-gray-400  hover:bg-gray-500"
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
            v-if="hasPracticeOngoingJobs(date, 'Whole Day', day)"
            :key="`${date}-${index}-${id}-${id}`"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-job-active"
            @click="selectDateShift(date, 'Whole Day')"
          />
          <!-- <div
            v-if="hasPracticeCompletedJobs(date, 'Whole Day', day)"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-job-active"
            :key="`${date}-${index}-${id}-${id}`"
            @click="selectDateShift(date, 'Whole Day')"
          ></div>
          <div
            v-else-if="hasPracticeAllocatedJobs(date, 'Whole Day', day)"
            class="w-full cursor-pointer border-t-2 border-gray-300 bg-green-300"
            :key="`${date}-${index}-${id}`"
            @click="selectDateShift(date, 'Whole Day')"
          ></div> -->
          <div
            v-else-if="hasPracticeAppliedJobs(date, 'Whole Day', day)"
            :key="`${date}-${index}-${id}`"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-job-pending"
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
            v-else-if="hasPracticeAvailableJobs(date, 'Whole Day', day)"
            :key="`${date}-${index}-${id}-${id}`"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-job-active"
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
            class="w-full cursor-pointer border-t-2 border-gray-400  hover:bg-gray-500"
            @click="selectDateShift(date, 'Whole Day')"
          />
        </template>
      </div>

      <!-- <div class="flex flex-no-wrap justify-between text-xs mx-1" style="height:50px;">
        <div class="w-full text-left my-auto" style="min-width: 60px">Reminder</div>
        <template v-for="({id, date}, index) in daysInWeek">
          <div
            v-if="hasPracticeAppliedJobsReminder(date, 'Reminder')"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-gray-900"
            :key="`${date}-${index}-${id}`"
            @click="selectDateShift(date, 'Reminder')"
          ></div>
          <div
            v-else-if="hasPracticeAvailableJobsReminder(date, 'Reminder')"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-gray-900"
            :key="`${date}-${index}-${id}`"
            @click="selectDateShift(date, 'Reminder')"
          ></div>
          <div
            v-else-if="currentDate(date)"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-gray-300 hover:bg-gray-400"
            :key="`${date}-${index}-${id}`"
            @click="selectDateShift(date, 'Reminder')"
          ></div>
          <div
            v-else
            class="w-full cursor-pointer border-t-2 border-gray-400  hover:bg-gray-500"
            :key="`${date}-${index}-${id}`"
            @click="selectDateShift(date, 'Reminder')"
          ></div>
        </template>
      </div> -->
    </template>

    <!-- LOCUM -->
    <template v-if="$auth.user.domain === 'Locum'">
      <div class="flex flex-no-wrap justify-between text-xs mx-1 mt-5" style="height:50px;">
        <div class="w-full text-left my-auto" style="min-width: 60px">
          AM
        </div>
        <template v-for="({id, date, day}, index) in daysInWeek">
          <div
            v-if="hasLocumOngoingJobs(date, 'AM', day)"
            :key="`${date}-${index}`"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-job-active"
            @click="selectDateShift(date, 'AM')"
          />
          <!-- <div
            v-if="hasLocumCompletedJobs(date, 'AM', day)"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-job-active"
            :key="`${date}-${index}`"
            @click="selectDateShift(date, 'AM')"
          ></div>
          <div
            v-else-if="hasLocumAllocatedJobs(date, 'AM', day)"
            class="w-full cursor-pointer border-t-2 border-gray-300 bg-green-300"
            :key="`${date}-${index}`"
            @click="selectDateShift(date, 'AM')"
          ></div>
          <div
            v-else-if="hasLocumUnavailabilities(date, 'AM')"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-pink-500"
            :key="`${date}-${index}-${id}`"
            @click="selectDateShift(date, 'AM')"
          ></div> -->
          <div
            v-else-if="hasLocumAvailableJobs(date, 'AM', day)"
            :key="`${date}-${index}`"
            class="w-full cursor-pointer border-t-2 border-gray-300 bg-job-active"
            @click="selectDateShift(date, 'AM')"
          />
          <div
            v-else-if="hasLocumMatchedJobs(date, 'AM', day)"
            :key="`${date}-${index}`"
            class="w-full cursor-pointer border-t-2 border-gray-300 bg-job-active"
            @click="selectDateShift(date, 'AM')"
          />
          <div
            v-else-if="hasLocumBankJobs(date, 'AM', day)"
            :key="`${date}-${index}`"
            class="w-full cursor-pointer border-t-2 border-gray-300 bg-job-active"
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
            class="w-full cursor-pointer border-t-2 border-gray-400  hover:bg-gray-500"
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
            v-if="hasLocumOngoingJobs(date, 'PM', day)"
            :key="`${date}-${index}`"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-job-active"
            @click="selectDateShift(date, 'PM')"
          />
          <!-- <div
            v-if="hasLocumCompletedJobs(date, 'PM', day)"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-job-active"
            :key="`${date}-${index}`"
            @click="selectDateShift(date, 'PM')"
          ></div>
          <div
            v-else-if="hasLocumAllocatedJobs(date, 'PM', day)"
            class="w-full cursor-pointer border-t-2 border-gray-300 bg-green-300"
            :key="`${date}-${index}`"
            @click="selectDateShift(date, 'PM')"
          ></div>
          <div
            v-else-if="hasLocumUnavailabilities(date, 'PM')"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-pink-500"
            :key="`${date}-${index}-${id}`"
            @click="selectDateShift(date, 'PM')"
          ></div> -->
          <div
            v-else-if="hasLocumAvailableJobs(date, 'PM', day)"
            :key="`${date}-${index}`"
            class="w-full cursor-pointer border-t-2 border-gray-300 bg-job-active"
            @click="selectDateShift(date, 'PM')"
          />
          <div
            v-else-if="hasLocumMatchedJobs(date, 'PM', day)"
            :key="`${date}-${index}`"
            class="w-full cursor-pointer border-t-2 border-gray-300 bg-job-active"
            @click="selectDateShift(date, 'PM')"
          />
          <div
            v-else-if="hasLocumBankJobs(date, 'PM', day)"
            :key="`${date}-${index}`"
            class="w-full cursor-pointer border-t-2 border-gray-300 bg-job-active"
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
            class="w-full cursor-pointer border-t-2 border-gray-400  hover:bg-gray-500"
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
            v-if="hasLocumOngoingJobs(date, 'OOH', day)"
            :key="`${date}-${index}-${id}`"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-job-active"
            @click="selectDateShift(date, 'OOH')"
          />
          <!-- <div
            v-if="hasLocumCompletedJobs(date, 'OOH', day)"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-job-active"
            :key="`${date}-${index}-${id}`"
            @click="selectDateShift(date, 'OOH')"
          ></div>
          <div
            v-else-if="hasLocumAllocatedJobs(date, 'OOH', day)"
            class="w-full cursor-pointer border-t-2 border-gray-300 bg-green-300"
            :key="`${date}-${index}`"
            @click="selectDateShift(date, 'OOH')"
          ></div>
          <div
            v-else-if="hasLocumUnavailabilities(date, 'OOH')"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-pink-500"
            :key="`${date}-${index}-${id}`"
            @click="selectDateShift(date, 'OOH')"
          ></div> -->
          <div
            v-else-if="hasLocumAvailableJobs(date, 'OOH', day)"
            :key="`${date}-${index}`"
            class="w-full cursor-pointer border-t-2 border-gray-300 bg-job-active"
            @click="selectDateShift(date, 'OOH')"
          />
          <div
            v-else-if="hasLocumMatchedJobs(date, 'OOH', day)"
            :key="`${date}-${index}`"
            class="w-full cursor-pointer border-t-2 border-gray-300 bg-job-active"
            @click="selectDateShift(date, 'OOH')"
          />
          <div
            v-else-if="hasLocumBankJobs(date, 'OOH', day)"
            :key="`${date}-${index}`"
            class="w-full cursor-pointer border-t-2 border-gray-300 bg-job-active"
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
            class="w-full cursor-pointer border-t-2 border-gray-400  hover:bg-gray-500"
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
            v-if="hasLocumOngoingJobs(date, 'Whole Day', day)"
            :key="`${date}-${index}-${id}`"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-job-active"
            @click="selectDateShift(date, 'Whole Day')"
          />
          <!-- <div
            v-if="hasLocumCompletedJobs(date, 'Whole Day', day)"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-job-active"
            :key="`${date}-${index}-${id}`"
            @click="selectDateShift(date, 'Whole Day')"
          ></div>
          <div
            v-else-if="hasLocumAllocatedJobs(date, 'Whole Day', day)"
            class="w-full cursor-pointer border-t-2 border-gray-300 bg-green-300"
            :key="`${date}-${index}`"
            @click="selectDateShift(date, 'Whole Day')"
          ></div>
          <div
            v-else-if="hasLocumUnavailabilities(date, 'Whole Day')"
            class="w-full cursor-pointer border-t-2 border-gray-400 bg-pink-500"
            :key="`${date}-${index}-${id}`"
            @click="selectDateShift(date, 'Whole Day')"
          ></div> -->
          <div
            v-else-if="hasLocumAvailableJobs(date, 'Whole Day', day)"
            :key="`${date}-${index}`"
            class="w-full cursor-pointer border-t-2 border-gray-300 bg-job-active"
            @click="selectDateShift(date, 'Whole Day')"
          />
          <div
            v-else-if="hasLocumMatchedJobs(date, 'Whole Day', day)"
            :key="`${date}-${index}`"
            class="w-full cursor-pointer border-t-2 border-gray-300 bg-job-active"
            @click="selectDateShift(date, 'Whole Day')"
          />
          <div
            v-else-if="hasLocumBankJobs(date, 'Whole Day', day)"
            :key="`${date}-${index}`"
            class="w-full cursor-pointer border-t-2 border-gray-300 bg-job-active"
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
            class="w-full cursor-pointer border-t-2 border-gray-400  hover:bg-gray-500"
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
            class="w-full cursor-pointer border-t-2 border-gray-400  hover:bg-gray-500"
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
    AppButton
  },
  data () {
    return {
      showRefresh: false,
      firstDayOfTheWeek: null,
      lastDayOfTheWeek: null
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
            .weekday()
        })
      }
      return weekLists
    },
    selectedYear () {
      return this.$moment(this.firstDayOfTheWeek).format("YYYY")
    }
  },
  beforeDestroy () {
    this.$store.commit("jobs/CLEAR_JOBS")
  },
  created () {
    let selectedDate = this.$store.state.calendar.selected_date

    this.firstDayOfTheWeek = this.$moment(selectedDate, "YYYY-MM-DD")
      .day("Monday")
      .format("YYYY-MM-DD")
    this.lastDayOfTheWeek = this.$moment(selectedDate, "YYYY-MM-DD")
      .add(1, "week")
      .day("Monday")
      .format("YYYY-MM-DD")

    this.getJobs()
  },
  mounted () {
    // locum
    if (this.$auth.loggedIn && this.$auth.user.domain === "Locum") {
      this.$socket.on("Locum Notification Job Available", this.getJobsRealTime)
      this.$socket.on("Locum Notification Job Matched", this.getJobsRealTime)
      this.$socket.on(
        "Locum Notification Job Unsuccessful",
        this.getJobsRealTime
      )
      this.$socket.on("Locum Notification Job Current", this.getJobsRealTime)
      this.$socket.on("Locum Notification Job Ongoing", this.getJobsRealTime)
      this.$socket.on(
        "Locum Notification Job Part Completed",
        this.getJobsRealTime
      )
      this.$socket.on("Locum Notification Job Completed", this.getJobsRealTime)
      this.$socket.on(
        "Locum Notification Locum Invoice Updated",
        this.getJobsRealTime
      )
      this.$socket.on("Locum Notification Job Cancelled", this.getJobsRealTime)

      this.$socket.on("Locum Notification Job Amended", this.getJobsRealTime)
      this.$socket.on("Locum Notification Job Updated", this.getJobsRealTime)
      this.$socket.on("Locum Notification Job Declined", this.getJobsRealTime)
      this.$socket.on(
        "Locum Notification Job Auto Declined",
        this.getJobsRealTime
      )
      this.$socket.on(
        "Locum Notification Job Unavailable",
        this.getJobsRealTime
      )
      this.$socket.on(
        "Locum Notification Job Unqualified",
        this.getJobsRealTime
      )
    }
    // practice
    if (this.$auth.loggedIn && this.$auth.user.domain === "Practice") {
      this.$socket.on(
        "Practice Notification Job Available",
        this.getJobsRealTime
      )
      this.$socket.on(
        "Practice Notification Job Application",
        this.getJobsRealTime
      )
      this.$socket.on(
        "Practice Notification Job Application Cancelled",
        this.getJobsRealTime
      )
      this.$socket.on(
        "Practice Notification Job Current",
        this.getJobsRealTime
      )
      this.$socket.on(
        "Practice Notification Job Ongoing",
        this.getJobsRealTime
      )
      this.$socket.on(
        "Practice Notification Job Part Completed",
        this.getJobsRealTime
      )
      this.$socket.on(
        "Practice Notification Job Completed",
        this.getJobsRealTime
      )
      this.$socket.on(
        "Practice Notification Locum Invoice Updated",
        this.getJobsRealTime
      )
      this.$socket.on(
        "Practice Notification Job Cancelled",
        this.getJobsRealTime
      )
      this.$socket.on(
        "Practice Notification Job Amended",
        this.getJobsRealTime
      )
      this.$socket.on(
        "Practice Notification Job Declined",
        this.getJobsRealTime
      )
      this.$socket.on(
        "Practice Notification Job Auto Declined",
        this.getJobsRealTime
      )
      this.$socket.on(
        "Practice Notification Job Update Accept",
        this.getJobsRealTime
      )
      this.$socket.on(
        "Practice Notification Job Unfilled",
        this.getJobsRealTime
      )
    }
  },
  destroyed () {
    this.removeListener()
  },

  methods: {
    selectDateShift (date, shift) {
      this.$store.commit("calendar/SELECT_DATE_SHIFT", {
        date: date,
        shift: shift
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
          shift: "AM"
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
          shift: "AM"
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
      console.log("per week")
      if (this.$auth.user.domain === "Practice") {
        this.$store.commit("calendar/TOGGLE_LOADING", true)
              // status: ["Allocated", "Applied", "Unfilled", "Declined", "Live"],
              // status: ["Ongoing", "Completed"],
        Promise.all([
          this.$axios.$get("/api/v1/practice/jobs", {
            params: {
              status: ["Unfilled", "Withdrawn", "Applied"],
              calendar_date_start: `${this.$moment(
                this.firstDayOfTheWeek,
                "YYYY-MM-DD"
              )
                .subtract(1, "days")
                .format("YYYY-MM-DD")}:gte`,
              calendar_date_end: `${this.lastDayOfTheWeek}:lte`,
              limit: 100000000
            }
          }),
          this.$axios.$get("/api/v1/practice/job-parts", {
            params: {
              status: ["Ongoing"],
              calendar_date_start: `${this.$moment(
                this.firstDayOfTheWeek,
                "YYYY-MM-DD"
              )
                .subtract(1, "days")
                .format("YYYY-MM-DD")}:gte`,
              calendar_date_end: `${this.lastDayOfTheWeek}:lte`,
              limit: 100000000
            }
          }),
          this.$axios.$get("/api/v1/practice/jobs", {
            params: {
              status: ["Live", "Applied"],
              platform_selection_date: [
                `${this.$moment(this.firstDayOfTheWeek, "YYYY-MM-DD")
                  .subtract(1, "days")
                  .format("YYYY-MM-DD")}:gte`,
                `${this.lastDayOfTheWeek}:lte`
              ],
              limit: 100000000
            }
          })
        ])
          .then(
            ([
              responseAllocatedAndAppliedAndUnfilledAndDeclinedAndLive,
              responseOngoingAndCompleted,
              // responseReminders
            ]) => {
              // this.$store.commit(
              //   "jobs/SET_PRACTICE_ALLOCATED_JOBS",
              //   responseAllocatedAndAppliedAndUnfilledAndDeclinedAndLive.data.jobs.filter(
              //     job => job.status === "Allocated"
              //   )
              // )
              this.$store.commit(
                "jobs/SET_PRACTICE_APPLIED_JOBS",
                responseAllocatedAndAppliedAndUnfilledAndDeclinedAndLive.data.jobs.filter(
                  job => job.status === "Applied"
                )
              )
              this.$store.commit(
                "jobs/SET_PRACTICE_UNFILLED_JOBS",
                responseAllocatedAndAppliedAndUnfilledAndDeclinedAndLive.data.jobs.filter(
                  job => job.status === "Unfilled"
                )
              )
              this.$store.commit(
                "jobs/SET_PRACTICE_DECLINED_JOBS",
                responseAllocatedAndAppliedAndUnfilledAndDeclinedAndLive.data.jobs.filter(
                  job => job.status === "Withdrawn"
                )
              )
              // this.$store.commit(
              //   "jobs/SET_PRACTICE_AVAILABLE_JOBS",
              //   responseAllocatedAndAppliedAndUnfilledAndDeclinedAndLive.data.jobs.filter(
              //     job => job.status === "Live"
              //   )
              // )
              this.$store.commit(
                "jobs/SET_PRACTICE_ONGOING_JOB_PARTS",
                responseOngoingAndCompleted.data.job_parts.filter(
                  jobPart => jobPart.status === "Ongoing"
                )
              )
              // this.$store.commit(
              //   "jobs/SET_PRACTICE_COMPLETED_JOB_PARTS",
              //   responseOngoingAndCompleted.data.job_parts.filter(
              //     jobPart => jobPart.status === "Completed"
              //   )
              // )
              // this.$store.commit(
              //   "jobs/SET_PRACTICE_AVAILABLE_JOBS_REMINDER",
              //   responseReminders.data.jobs.filter(job => job.status === "Live")
              // )
              // this.$store.commit(
              //   "jobs/SET_PRACTICE_APPLIED_JOBS_REMINDER",
              //   responseReminders.data.jobs.filter(
              //     job => job.status === "Applied"
              //   )
              // )
            }
          )
          .finally(() => {
            this.$store.commit("calendar/TOGGLE_LOADING", false)
          })
      }
      // LOCUM
      if (this.$auth.loggedIn && this.$auth.user.domain === "Locum") {
        this.$store.commit("calendar/TOGGLE_LOADING", true)
        // locum_status: ["Allocated", "Applied", "Available", "Matched"],
        // locum_status: ["Ongoing", "Completed"],
        Promise.all([
          this.$axios.$get("/api/v1/locum/jobs", {
            params: {
              locum_status: ["Applied"],
              calendar_date_start: `${this.$moment(
                this.firstDayOfTheWeek,
                "YYYY-MM-DD"
              )
                .subtract(1, "days")
                .format("YYYY-MM-DD")}:gte`,
              calendar_date_end: `${this.lastDayOfTheWeek}:lte`,
              limit: 100000000
            }
          }),
          this.$axios.$get("/api/v1/locum/job-parts", {
            params: {
              locum_status: ["Ongoing"],
              calendar_date_start: `${this.$moment(
                this.firstDayOfTheWeek,
                "YYYY-MM-DD"
              )
                .subtract(1, "days")
                .format("YYYY-MM-DD")}:gte`,
              calendar_date_end: `${this.lastDayOfTheWeek}:lte`,
              limit: 100000000
            }
          }),
          // this.$axios.$get("/api/v1/locum/unavailabilities", {
          //   params: {
          //     date_start: `${this.$moment(this.firstDayOfTheWeek, "YYYY-MM-DD")
          //       .subtract(1, "days")
          //       .format("YYYY-MM-DD")}:gte`,
          //     date_end: `${this.lastDayOfTheWeek}:lte`,
          //     limit: 100000000
          //   }
          // })
        ])
          .then(
            ([
              responseAllocatedAndAppliedAndAvailable,
              responseOngoingAndCompleted,
              // responseUnavailabilities
            ]) => {
              this.$store.commit(
                "jobs/SET_LOCUM_APPLIED_JOBS",
                responseAllocatedAndAppliedAndAvailable.data.jobs.filter(
                  job => job.locum_status === "Applied"
                )
              )
              // this.$store.commit(
              //   "jobs/SET_LOCUM_AVAILABLE_JOBS",
              //   responseAllocatedAndAppliedAndAvailable.data.jobs.filter(
              //     job => job.locum_status === "Available"
              //   )
              // )
              // this.$store.commit(
              //   "jobs/SET_LOCUM_MATCHED_JOBS",
              //   responseAllocatedAndAppliedAndAvailable.data.jobs.filter(
              //     job => job.locum_status === "Matched"
              //   )
              // )
              // this.$store.commit(
              //   "jobs/SET_LOCUM_BANK_JOBS",
              //   responseBank.data.jobs.filter(
              //     job => job.locum_status === "Matched"
              //   )
              // )
              // this.$store.commit(
              //   "jobs/SET_LOCUM_ALLOCATED_JOBS",
              //   responseAllocatedAndAppliedAndAvailable.data.jobs.filter(
              //     job => job.locum_status === "Allocated"
              //   )
              // )
              this.$store.commit(
                "jobs/SET_LOCUM_ONGOING_JOB_PARTS",
                responseOngoingAndCompleted.data.job_parts.filter(
                  jobPart => jobPart.locum_status === "Ongoing"
                )
              )
              // this.$store.commit(
              //   "jobs/SET_LOCUM_COMPLETED_JOB_PARTS",
              //   responseOngoingAndCompleted.data.job_parts.filter(
              //     jobPart => jobPart.locum_status === "Completed"
              //   )
              // )
              // this.$store.commit(
              //   "jobs/SET_LOCUM_UNAVAILABILITIES",
              //   responseUnavailabilities.data.unavailabilities.filter(
              //     unavailable =>
              //       unavailable.shifts && unavailable.shifts.length !== 0
              //   )
              // )
            }
          )
          .finally(() => {
            this.$store.commit("calendar/TOGGLE_LOADING", false)
          })
      }
    },
    async getJobsRealTime (job) {
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
    removeListener () {
      if (this.$auth.loggedIn && this.$auth.user.domain === "Locum") {
        this.$socket.removeListener(
          "Locum Notification Job Available",
          this.getJobsRealTime
        )
        this.$socket.removeListener(
          "Locum Notification Job Matched",
          this.getJobsRealTime
        )
        this.$socket.removeListener(
          "Locum Notification Job Unsuccessful",
          this.getJobsRealTime
        )
        this.$socket.removeListener(
          "Locum Notification Job Current",
          this.getJobsRealTime
        )
        this.$socket.removeListener(
          "Locum Notification Job Ongoing",
          this.getJobsRealTime
        )
        this.$socket.removeListener(
          "Locum Notification Job Part Completed",
          this.getJobsRealTime
        )
        this.$socket.removeListener(
          "Locum Notification Job Completed",
          this.getJobsRealTime
        )
        this.$socket.removeListener(
          "Locum Notification Locum Invoice Updated",
          this.getJobsRealTime
        )
        this.$socket.removeListener(
          "Locum Notification Job Cancelled",
          this.getJobsRealTime
        )
        this.$socket.removeListener(
          "Locum Notification Job Amended",
          this.getJobsRealTime
        )
        this.$socket.removeListener(
          "Locum Notification Job Updated",
          this.getJobsRealTime
        )
        this.$socket.removeListener(
          "Locum Notification Job Declined",
          this.getJobsRealTime
        )
        this.$socket.removeListener(
          "Locum Notification Job Auto Declined",
          this.getJobsRealTime
        )
        this.$socket.removeListener(
          "Locum Notification Job Unavailable",
          this.getJobsRealTime
        )
        this.$socket.removeListener(
          "Locum Notification Job Unqualified",
          this.getJobsRealTime
        )
      }
      if (this.$auth.loggedIn && this.$auth.user.domain === "Practice") {
        this.$socket.removeListener(
          "Practice Notification Job Available",
          this.getJobsRealTime
        )
        this.$socket.removeListener(
          "Practice Notification Job Application",
          this.getJobsRealTime
        )
        this.$socket.removeListener(
          "Practice Notification Job Application Cancelled",
          this.getJobsRealTime
        )
        this.$socket.removeListener(
          "Practice Notification Job Current",
          this.getJobsRealTime
        )
        this.$socket.removeListener(
          "Practice Notification Job Ongoing",
          this.getJobsRealTime
        )
        this.$socket.removeListener(
          "Practice Notification Job Part Completed",
          this.getJobsRealTime
        )
        this.$socket.removeListener(
          "Practice Notification Job Completed",
          this.getJobsRealTime
        )
        this.$socket.removeListener(
          "Practice Notification Locum Invoice Updated",
          this.getJobsRealTime
        )
        this.$socket.removeListener(
          "Practice Notification Job Cancelled",
          this.getJobsRealTime
        )
        this.$socket.removeListener(
          "Practice Notification Job Amended",
          this.getJobsRealTime
        )
        this.$socket.removeListener(
          "Practice Notification Job Declined",
          this.getJobsRealTime
        )
        this.$socket.removeListener(
          "Practice Notification Job Auto Declined",
          this.getJobsRealTime
        )
        this.$socket.removeListener(
          "Practice Notification Job Update Accept",
          this.getJobsRealTime
        )
        this.$socket.removeListener(
          "Practice Notification Job Unfilled",
          this.getJobsRealTime
        )
      }
    },
    // PRACTICE
    // PARTS
    hasPracticeOngoingJobs (date, type, day) {
      if (
        this.getPracticeOngoingJobs &&
        this.getPracticeOngoingJobs.length > 0
      ) {
        return this.getPracticeOngoingJobs.find(
          job_part =>
            this.getDateArray(job_part.date_start, job_part.date_end).includes(
              date
            ) &&
            job_part.job.shift.name === type &&
            ((job_part.job.include_saturday === false && day !== 6) ||
              job_part.job.include_saturday === true) &&
            ((job_part.job.include_sunday === false && day !== 0) ||
              job_part.job.include_sunday === true)
        )
      }
    },
    hasPracticeCompletedJobs (date, type, day) {
      if (
        this.getPracticeCompletedJobs &&
        this.getPracticeCompletedJobs.length > 0
      ) {
        return this.getPracticeCompletedJobs.find(
          job_part =>
            this.getDateArray(job_part.date_start, job_part.date_end).includes(
              date
            ) &&
            job_part.job.shift.name === type &&
            ((job_part.job.include_saturday === false && day !== 6) ||
              job_part.job.include_saturday === true) &&
            ((job_part.job.include_sunday === false && day !== 0) ||
              job_part.job.include_sunday === true)
        )
      }
    },
    // WHOLE
    hasPracticeAllocatedJobs (date, type, day) {
      if (
        this.getPracticeAllocatedJobs &&
        this.getPracticeAllocatedJobs.length > 0
      ) {
        return this.getPracticeAllocatedJobs.find(
          job =>
            this.getDateArray(job.date_start, job.date_end).includes(date) &&
            job.shift.name === type &&
            ((job.include_saturday === false && day !== 6) ||
              job.include_saturday === true) &&
            ((job.include_sunday === false && day !== 0) ||
              job.include_sunday === true)
        )
      }
    },
    hasPracticeAppliedJobs (date, type, day) {
      if (
        this.getPracticeAppliedJobs &&
        this.getPracticeAppliedJobs.length > 0
      ) {
        return this.getPracticeAppliedJobs.find(
          job =>
            this.getDateArray(job.date_start, job.date_end).includes(date) &&
            job.shift.name === type &&
            ((job.include_saturday === false && day !== 6) ||
              job.include_saturday === true) &&
            ((job.include_sunday === false && day !== 0) ||
              job.include_sunday === true)
        )
      }
    },
    hasPracticeUnfilledJobs (date, type, day) {
      if (
        this.getPracticeUnfilledJobs &&
        this.getPracticeUnfilledJobs.length > 0
      ) {
        return this.getPracticeUnfilledJobs.find(
          job =>
            this.getDateArray(job.date_start, job.date_end).includes(date) &&
            job.shift.name === type &&
            ((job.include_saturday === false && day !== 6) ||
              job.include_saturday === true) &&
            ((job.include_sunday === false && day !== 0) ||
              job.include_sunday === true)
        )
      }
    },
    hasPracticeDeclinedJobs (date, type, day) {
      if (
        this.getPracticeDeclinedJobs &&
        this.getPracticeDeclinedJobs.length > 0
      ) {
        return this.getPracticeDeclinedJobs.find(
          job =>
            this.getDateArray(job.date_start, job.date_end).includes(date) &&
            job.shift.name === type &&
            ((job.include_saturday === false && day !== 6) ||
              job.include_saturday === true) &&
            ((job.include_sunday === false && day !== 0) ||
              job.include_sunday === true)
        )
      }
    },
    hasPracticeAvailableJobs (date, type, day) {
      if (
        this.getPracticeAvailableJobs &&
        this.getPracticeAvailableJobs.length > 0
      ) {
        return this.getPracticeAvailableJobs.find(
          job =>
            this.getDateArray(job.date_start, job.date_end).includes(date) &&
            job.shift.name === type &&
            ((job.include_saturday === false && day !== 6) ||
              job.include_saturday === true) &&
            ((job.include_sunday === false && day !== 0) ||
              job.include_sunday === true)
        )
      }
    },
    // REMINDERS
    hasPracticeAppliedJobsReminder (date, type) {
      if (
        this.getPracticeAppliedJobsReminder &&
        this.getPracticeAppliedJobsReminder.length > 0
      ) {
        return this.getPracticeAppliedJobsReminder.find(
          job => job.platform_job.selection_date === date && type === "Reminder"
        )
      }
    },
    hasPracticeAvailableJobsReminder (date, type) {
      if (
        this.getPracticeAvailableJobsReminder &&
        this.getPracticeAvailableJobsReminder.length > 0
      ) {
        return this.getPracticeAvailableJobsReminder.find(
          job => job.platform_job.selection_date === date && type === "Reminder"
        )
      }
    },
    // LOCUM
    // PARTS
    hasLocumOngoingJobs (date, type, day) {
      if (this.getLocumOngoingJobs && this.getLocumOngoingJobs.length > 0) {
        return this.getLocumOngoingJobs.find(
          job_part =>
            this.getDateArray(job_part.date_start, job_part.date_end).includes(
              date
            ) &&
            job_part.job.shift.name === type &&
            ((job_part.job.include_saturday === false && day !== 6) ||
              job_part.job.include_saturday === true) &&
            ((job_part.job.include_sunday === false && day !== 0) ||
              job_part.job.include_sunday === true)
        )
      }
    },
    hasLocumCompletedJobs (date, type, day) {
      if (this.getLocumCompletedJobs && this.getLocumCompletedJobs.length > 0) {
        return this.getLocumCompletedJobs.find(
          job_part =>
            this.getDateArray(job_part.date_start, job_part.date_end).includes(
              date
            ) &&
            job_part.job.shift.name === type &&
            ((job_part.job.include_saturday === false && day !== 6) ||
              job_part.job.include_saturday === true) &&
            ((job_part.job.include_sunday === false && day !== 0) ||
              job_part.job.include_sunday === true)
        )
      }
    },
    // WHOLE
    hasLocumAllocatedJobs (date, type, day) {
      if (this.getLocumAllocatedJobs && this.getLocumAllocatedJobs.length > 0) {
        return this.getLocumAllocatedJobs.find(
          job =>
            this.getDateArray(job.date_start, job.date_end).includes(date) &&
            job.shift.name === type &&
            ((job.include_saturday === false && day !== 6) ||
              job.include_saturday === true) &&
            ((job.include_sunday === false && day !== 0) ||
              job.include_sunday === true)
        )
      }
    },
    hasLocumAvailableJobs (date, type, day) {
      if (this.getLocumAvailableJobs && this.getLocumAvailableJobs.length > 0) {
        return this.getLocumAvailableJobs.find(
          job =>
            this.getDateArray(job.date_start, job.date_end).includes(date) &&
            job.shift.name === type &&
            ((job.include_saturday === false && day !== 6) ||
              job.include_saturday === true) &&
            ((job.include_sunday === false && day !== 0) ||
              job.include_sunday === true)
        )
      }
    },
    hasLocumMatchedJobs (date, type, day) {
      if (this.getLocumMatchedJobs && this.getLocumMatchedJobs.length > 0) {
        return this.getLocumMatchedJobs.find(
          job =>
            this.getDateArray(job.date_start, job.date_end).includes(date) &&
            job.shift.name === type &&
            ((job.include_saturday === false && day !== 6) ||
              job.include_saturday === true) &&
            ((job.include_sunday === false && day !== 0) ||
              job.include_sunday === true)
        )
      }
    },
    hasLocumBankJobs (date, type, day) {
      if (this.getLocumBankJobs && this.getLocumBankJobs.length > 0) {
        return this.getLocumBankJobs.find(
          job =>
            this.getDateArray(job.date_start, job.date_end).includes(date) &&
            job.shift.name === type &&
            ((job.include_saturday === false && day !== 6) ||
              job.include_saturday === true) &&
            ((job.include_sunday === false && day !== 0) ||
              job.include_sunday === true)
        )
      }
    },
    hasLocumAppliedJobs (date, day) {
      return this.getLocumAppliedJobs.find(
        job =>
          this.getDateArray(job.date_start, job.date_end).includes(date)
           &&
          ((job.include_saturday === false && day !== 6) ||
            job.include_saturday === true) &&
          ((job.include_sunday === false && day !== 0) ||
            job.include_sunday === true)
      )
    },
    // UNAVAILABILITIES
    hasLocumUnavailabilities (date, type) {
      if (
        this.getLocumUnavailabilities &&
        this.getLocumUnavailabilities.length > 0
      ) {
        return this.getLocumUnavailabilities.find(
          job =>
            job.date === date && job.shifts.find(shift => shift.name === type)
        )
      }
    }
  }
}
</script>
<style scoped>
.bg-job-active {
	background-color: #38b460;
}
.bg-job-active:hover {
	background-color: #33a055;
}

.bg-job-pending {
	background-color: #ffa901;
}

.bg-job-pending:hover {
	background-color: #e69e0f;
}

.bg-job-unfilled {
	background-color: #cd1424;
}

.bg-job-unfilled:hover {
	background-color: #ac111e;
}
</style>
