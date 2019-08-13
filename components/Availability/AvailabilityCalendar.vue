<template>
  <section>
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
            @click="selectDate(item.fullDate)"
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
            @click="selectDate(item.fullDate)"
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
            @click="selectDate(item.fullDate)"
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
            @click="selectDate(item.fullDate)"
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
            @click="selectDate(item.fullDate)"
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
            @click="selectDate(item.fullDate)"
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
            @click="selectDate(item.fullDate)"
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
  </section>
</template>
<script>
import AvailabilityInfoDateCell from '@/components/Availability/AvailabilityInfoDateCell'
export default {
  components: {
    AvailabilityInfoDateCell
  },
  data() {
    return {
      selectedMonth: 0,
      selectedYear: new Date().getFullYear(),
      daysInMonth: [],
      startOfMonth: null,
      endOfMonth: null,
    }
  },
  computed: {
    getLocumAllocatedPrivateJobs() {
      return this.$store.getters['jobs/getLocumAllocatedPrivateJobs']
    },
    getLocumAllocatedCurrentJobs() {
      return this.$store.getters['jobs/getLocumAllocatedCurrentJobs']
    },
    getLocumUnavailabilities() {
      return this.$store.getters['jobs/getLocumUnavailabilities']
    },
  },
  created() {
    this.startOfMonth = this.$moment().startOf('month').format('YYYY-MM-DD')
    this.endOfMonth = this.$moment().endOf('month').format('YYYY-MM-DD')
    let d = new Date()
    this.selectedMonth = d.getMonth()
    this.getDaysInMonth(this.selectedMonth, this.selectedYear)
    this.getJobs()
  },
  watch: {
    selectedMonth(value) {
      this.getDaysInMonth(value, this.selectedYear)
    }
  },
  methods: {
    getJobs() {
      this.$store.dispatch("jobs/fetchLocumJobs", {
        date_start: this.startOfMonth,
        date_end: this.endOfMonth,
        status: "Current"
      });

      this.$store.dispatch("jobs/fetchLocumUnavailabilities", {
        date_start: this.startOfMonth,
        date_end: this.endOfMonth,
      });
    },
    getDaysInMonth(month, selectedYear) {
      let date = new Date(selectedYear, month, 1);
      let days = [];
      while (date.getMonth() === month) {
        days.push(new Date(date));
        date.setDate(date.getDate() + 1);
      }
      let daysInMonth = []
      days.forEach(day => {
        daysInMonth.push({
          day: day.getDay(),
          date: day.getDate(),
          fullDate: this.$moment(new Date(day.getFullYear(), day.getMonth(), day.getDate()).toDateString()).format('YYYY-MM-DD')
        })
      })
      this.daysInMonth = daysInMonth
    },
    adjustMonth(type) {
      if (type === 'previous') {
        if (this.selectedMonth === 0) {
          this.selectedMonth = 11
          this.selectedYear--
        } else {
          this.selectedMonth--
        }
      }
      if (type === 'next') {
        if (this.selectedMonth === 11) {
          this.selectedMonth = 0
          this.selectedYear++
        } else {
          this.selectedMonth++
        }
      }
      this.startOfMonth = this.$moment(`${this.selectedYear}-${this.selectedMonth + 1}`).startOf('month').format('YYYY-MM-DD')
      this.endOfMonth = this.$moment(`${this.selectedYear}-${this.selectedMonth + 1}`).endOf('month').format('YYYY-MM-DD')
      this.getJobs()
    },
    selectDate(date) {
      this.$store.commit('availability/SELECT_DATE', date)
      let unavaibleDate
      let appointmentDate
      let allocatedDate
      if (this.getLocumUnavailabilities && this.getLocumUnavailabilities.length > 0) {
        let isUnavailable = this.getLocumUnavailabilities.find(unavailable => unavailable.date === date)
        if (isUnavailable) {
          unavaibleDate = {
            id: isUnavailable.id,
            shifts: isUnavailable.shifts
          }
        }
      }
      if (this.getLocumAllocatedPrivateJobs && this.getLocumAllocatedPrivateJobs.length > 0) {
        let hasLocumPrivateJob = this.getLocumAllocatedPrivateJobs.find(appointment => this.getDateArray(appointment.private_job.date_start, appointment.private_job.date_end).includes(date))
        if (hasLocumPrivateJob) {
          appointmentDate = {
            shift: hasLocumPrivateJob.private_job.shift
          }
        }
      }
      if (this.getLocumAllocatedCurrentJobs && this.getLocumAllocatedCurrentJobs.length > 0) {
        let hasLocumCurrentJob = this.getLocumAllocatedCurrentJobs.filter(job => this.getDateArray(job.platform_job.date_start, job.platform_job.date_end).includes(date))
        if (hasLocumCurrentJob && hasLocumCurrentJob.length > 0) {
          allocatedDate = hasLocumCurrentJob.map(item => {
            return item.platform_job.shift
          })
        }
      }
      this.$emit('open', unavaibleDate, appointmentDate, allocatedDate)
    },
  }
}
</script>


