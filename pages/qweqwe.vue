<template>
  <div class="w-full flex p-8 items-center justify-center">
    <div class="flex-0">
      <AppDate v-model="start_date" :name="'date_start'" :label="'Start Date'" isAfter />
      <AppDate
        v-model="end_date"
        :name="'date_end'"
        :label="'End Date'"
        :startDate="start_date"
        isAfter
      />
      <AppMultipleDates
        v-model="schedule_dates"
        :name="'dates'"
        is-after
        multipleSelection
        isDisplay
        class="multiple-date-picker"
        :format="'DD/MM/YYYY'"
      />
      <div>
        <div>
          <span>start_date</span>
          <pre>{{ start_date }}</pre>
          <br>
        </div>
        <div>
          <span>end_date</span>
          <pre>{{ end_date }}</pre>
        </div>
        <div>
          <span>schedule_dates</span>
          <pre>{{ schedule_dates }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import AppDate from "@/components/Base/AppDate"
  import AppMultipleDates from "@/components/Base/AppMultipleDates"

  export default {
    layout: 'plain',

    components: {
      AppDate,
      AppMultipleDates,
    },

    data () {
      return {
        schedule_dates: [],
      }
    },

    computed: {
      sortedDates () {
        return [...this.schedule_dates].sort((dateA, dateB) => {
          const datetimeA = this.$moment(dateA, 'DD/MM/YYYY')

          const datetimeB = this.$moment(dateB, 'DD/MM/YYYY')

          if (datetimeA.isBefore(datetimeB)) {
            return -1
          }

          if (datetimeA.isAfter(datetimeB)) {
            return 1
          }

          return 0
        })
      },

      start_date: {
        get () {
          return this.sortedDates.length > 0
            ? this.$moment(this.sortedDates[0], 'DD/MM/YYYY').format('YYYY-MM-DD')
            : ''
        },

        set (startDate) {
          if (!startDate) {
            return
          }

          if (!this.start_date) {
            this.schedule_dates.push(this.$moment(startDate, 'YYYY-MM-DD').format('DD/MM/YYYY'))
            return
          }

          const newStartDate = this.$moment(startDate, 'YYYY-MM-DD')

          const oldStartDate = this.$moment(this.start_date, 'YYYY-MM-DD')
          
          if (newStartDate.isBefore(oldStartDate)) {
            let tempDate = newStartDate
            while (tempDate.isBefore(oldStartDate)) {
              this.schedule_dates.push(tempDate.format('DD/MM/YYYY'))
              tempDate = tempDate.add(1, 'days')
            }
            return
          }

          if (newStartDate.isAfter(oldStartDate)) {
            this.schedule_dates = this.schedule_dates.filter(date => !newStartDate.isAfter(this.$moment(date, 'DD/MM/YYYY')))
            this.schedule_dates.push(this.$moment(startDate, 'YYYY-MM-DD').format('DD/MM/YYYY'))
            return
          }
        },
      },

      end_date: {
        get () {
          return this.sortedDates.length > 0
            ? this.$moment(this.sortedDates[this.sortedDates.length - 1], 'DD/MM/YYYY').format('YYYY-MM-DD')
            : ''
        },

        set (endDate) {
          if (!endDate) {
            return
          }

          if (!this.end_date) {
            this.schedule_dates.push(this.$moment(endDate, 'YYYY-MM-DD').format('DD/MM/YYYY'))
            return
          }

          const newEndDate = this.$moment(endDate, 'YYYY-MM-DD')

          const oldEndDate = this.$moment(this.end_date, 'YYYY-MM-DD')
          
          if (newEndDate.isBefore(oldEndDate)) {
            this.schedule_dates = this.schedule_dates.filter(date => !newEndDate.isBefore(this.$moment(date, 'DD/MM/YYYY')))
            this.schedule_dates.push(this.$moment(endDate, 'YYYY-MM-DD').format('DD/MM/YYYY'))
            return
          }

          if (newEndDate.isAfter(oldEndDate)) {
            let tempDate = newEndDate
            while (tempDate.isAfter(oldEndDate)) {
              this.schedule_dates.push(tempDate.format('DD/MM/YYYY'))
              tempDate = tempDate.subtract(1, 'days')
            }
            return
          }
        },
      },
    },
  }
</script>
