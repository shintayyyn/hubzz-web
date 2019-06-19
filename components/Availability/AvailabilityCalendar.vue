<template>
  <section>
    <div class="flex flex-row flex-wrap mx-1">
      <div class="w-1/2 text-left">
        <div
          class="text-xs lg:text-base"
        >{{$store.state.availability.months[selectedMonth]}} {{selectedYear}}</div>
      </div>
      <div class="w-1/2 text-right">
        <span class="cursor-pointer" @click="adjustMonth('previous')">
          <svgicon name="arrow-left" height="15" width="15"/>
        </span>
        <span class="mx-4"></span>
        <span class="cursor-pointer" @click="adjustMonth('next')">
          <svgicon name="arrow-right" height="15" width="15"/>
        </span>
      </div>
    </div>

    <div class="flex flex-nowrap justify-between text-xs lg:text-base mx-1 mt-5">
      <div class="w-full text-center text-grey font-bold">SUN</div>
      <div class="w-full text-center text-grey font-bold">MON</div>
      <div class="w-full text-center text-grey font-bold">TUE</div>
      <div class="w-full text-center text-grey font-bold">WED</div>
      <div class="w-full text-center text-grey font-bold">THU</div>
      <div class="w-full text-center text-grey font-bold">FRI</div>
      <div class="w-full text-center text-grey font-bold">SAT</div>
    </div>

    <div class="flex flex-nowrap justify-between mx-1 mt-5">
      <div class="flex flex-col w-full">
        <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 7">
          <div class="m-1 h-8 sm:h-12 md:h-16 lg:h-20 w-auto">&nbsp;</div>
        </div>
        <div v-for="(item, index) in daysInMonth" :key="index">
          <div
            @click="selectDate(item.fullDate)"
            class="relative border border-solid rounded-lg m-1 cursor-pointer flex justify-center items-center h-8 sm:h-12 md:h-16 lg:h-20 w-auto"
            :class="$store.state.availability.date_today === item.fullDate ? 'border-yellow-dark text-lg font-bold':'hover:bg-grey-light'"
            v-if="item.day === 0"
          >
            <div class="text-xs lg:text-base z-10">{{(item.date)}}</div>
            <AvailabilityInfoDateCell
              :unavailabilities="unavailabilities"
              :appointment_jobs="appointment_jobs"
              :item="item"
            />
          </div>
        </div>
      </div>
      <div class="flex flex-col w-full">
        <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 6">
          <div class="m-1 h-8 sm:h-12 md:h-16 lg:h-20 w-auto">&nbsp;</div>
        </div>
        <div v-for="(item, index) in daysInMonth" :key="index">
          <div
            @click="selectDate(item.fullDate)"
            class="relative border border-solid rounded-lg m-1 cursor-pointer flex justify-center items-center h-8 sm:h-12 md:h-16 lg:h-20 w-auto"
            :class="$store.state.availability.date_today === item.fullDate ? 'border-yellow-dark text-lg font-bold':'hover:bg-grey-light'"
            v-if="item.day === 1"
          >
            <div class="text-xs lg:text-base z-10">{{(item.date)}}</div>
            <AvailabilityInfoDateCell
              :unavailabilities="unavailabilities"
              :appointment_jobs="appointment_jobs"
              :item="item"
            />
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
            :class="$store.state.availability.date_today === item.fullDate ? 'border-yellow-dark text-lg font-bold':'hover:bg-grey-light'"
            v-if="item.day === 2"
          >
            <div class="text-xs lg:text-base z-10">{{(item.date)}}</div>
            <AvailabilityInfoDateCell
              :unavailabilities="unavailabilities"
              :appointment_jobs="appointment_jobs"
              :item="item"
            />
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
            :class="$store.state.availability.date_today === item.fullDate ? 'border-yellow-dark text-lg font-bold':'hover:bg-grey-light'"
            v-if="item.day === 3"
          >
            <div class="text-xs lg:text-base z-10">{{(item.date)}}</div>
            <AvailabilityInfoDateCell
              :unavailabilities="unavailabilities"
              :appointment_jobs="appointment_jobs"
              :item="item"
            />
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
            :class="$store.state.availability.date_today === item.fullDate ? 'border-yellow-dark text-lg font-bold':'hover:bg-grey-light'"
            v-if="item.day === 4"
          >
            <div class="text-xs lg:text-base z-10">{{(item.date)}}</div>
            <AvailabilityInfoDateCell
              :unavailabilities="unavailabilities"
              :appointment_jobs="appointment_jobs"
              :item="item"
            />
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
            :class="$store.state.availability.date_today === item.fullDate ? 'border-yellow-dark text-lg font-bold':'hover:bg-grey-light'"
            v-if="item.day === 5"
          >
            <div class="text-xs lg:text-base z-10">{{(item.date)}}</div>
            <AvailabilityInfoDateCell
              :unavailabilities="unavailabilities"
              :appointment_jobs="appointment_jobs"
              :item="item"
            />
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
            :class="$store.state.availability.date_today === item.fullDate ? 'border-yellow-dark text-lg font-bold':'hover:bg-grey-light'"
            v-if="item.day === 6"
          >
            <div class="text-xs lg:text-base z-10">{{(item.date)}}</div>
            <AvailabilityInfoDateCell
              :unavailabilities="unavailabilities"
              :appointment_jobs="appointment_jobs"
              :item="item"
            />
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
    }
  },
  computed: {
    unavailabilities() {
      return this.$store.state.availability.unavailabilities
    },
    appointment_jobs() {
      return this.$store.state.availability.appointment_jobs
    }
  },
  created() {
    // get current month and year
    let d = new Date()
    this.selectedMonth = d.getMonth()

    // get days in current month
    this.getDaysInMonth(this.selectedMonth, this.selectedYear)

    this.getAppointmentJobs()
  },
  watch: {
    selectedMonth(value) {
      this.getDaysInMonth(value, this.selectedYear)
    }
  },
  methods: {
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

      // get Unavailabilities
      this.getUnavailabilities(this.daysInMonth[0].fullDate, this.daysInMonth[this.daysInMonth.length - 1].fullDate)
    },
    getUnavailabilities(date_start, date_end) {
      this.$axios.$get(`/api/v1/locum/unavailabilities`, { date_start: date_start, date_end: date_end }).then(res => {
        this.$store.commit('availability/SET_UNAVAILABILITES', res.data.unavailabilities)
      })
    },
    getAppointmentJobs() {
      this.$axios.$get(`/api/v1/locum/calendars/monthly/${this.selectedYear}/${this.selectedMonth + 1}`).then(res => {
        if (res.data.jobs && res.data.jobs.length > 0) {
          this.$store.commit('availability/SET_APPOINTMENT_JOBS', res.data.jobs)
        }
      })
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
    },
    selectDate(date) {
      this.$store.commit('availability/SELECT_DATE', date)
      let appointmentObj = {}
      let unavailabilityObj = {}
      let hasAppointment = this.$store.state.availability.appointment_jobs.find(job => this.getDateArray(job.private_job.date_start, job.private_job.date_end).includes(date))
      if (hasAppointment) {
        appointmentObj = { disabledShift: hasAppointment.private_job.shift }
      }
      let unavailabilities = this.$store.state.availability.unavailabilities.find(item => item.date === date)
      if (unavailabilities) {
        unavailabilityObj = { id: unavailabilities.id, shifts: unavailabilities.shifts }
        const newObj = Object.assign(appointmentObj, unavailabilityObj)
        // this.$emit('update', newObj)
        this.$emit('open', newObj)
      } else {
        const newObj = Object.assign(appointmentObj, {})
        // this.$emit('add', newObj)
        this.$emit('open', newObj)
      }

    },
    getDateArray(start, end) {
      let arr = new Array();
      let dt = new Date(start);
      while (dt <= new Date(end)) {
        arr.push(this.$moment(new Date(dt)).format('YYYY-MM-DD'));
        dt.setDate(dt.getDate() + 1);
      }
      return arr;
    }
  }
}
</script>


