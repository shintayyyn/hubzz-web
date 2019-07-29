<template>
  <div class="p-8 max-w-lg">
    <div @click="$emit('close')" class="cursor-pointer">
      <svgicon name="left-arrow" height="32" width="32" />
    </div>
    <div class="flex justify-start font-bold text-sm sm:text-xl mt-8">Availability</div>
    <div class="mt-4">
      <div class="rounded-lg shadow-lg p-8">
        <div class="font-bold text-sm sm:text-md mt-4">
          I won't be available
          <span v-if="type === 'solo'">for</span>...
        </div>
        <div class="flex flex-row flex-wrap justify-between" v-if="type === 'range'">
          <div class="w-full p-0 sm:w-1/2 pr-2">
            <AppDate
              v-model="form.date_start"
              :name="'date_start'"
              :label="'From'"
              :error="formError.find(item => item.field === 'date_start')"
            />
          </div>
          <div class="w-full p-0 sm:w-1/2 pl-2">
            <AppDate
              v-model="form.date_end"
              :name="'date_end'"
              :label="'To'"
              :error="formError.find(item => item.field === 'date_end')"
            />
          </div>
        </div>
        <div class="flex flex-col w-full my-6" v-else>
          <div class="text-sm sm:text-md">On this date</div>
          <div class="text-md sm:text-lg font-bold mt-2">{{$store.state.availability.selected_date}}</div>
        </div>
        <div class="flex flex-row flex-wrap justify-start mt-4 relative">
          <div class="text-sm sm:text-md leading-loose mr-2">On theses shifts</div>
          <div
            class="rounded-lg bg-grey-light px-2 py-1 text-sm sm:text-md flex items-center"
            v-if="type === 'solo'"
          >
            Select all that apply. Shifts that are already booked are greyed-out.
            <div
              v-if="formError.find(item => item.field === 'shift_id')"
              class="absolute pin-r bg-red p-1 text-xs sm:text-base text-white"
            >Select atleast one shift</div>
          </div>
          <div
            class="rounded-lg bg-grey-light px-2 py-1 text-sm sm:text-md flex items-center"
            v-else
          >
            Select all that apply.
            <div
              v-if="formError.find(item => item.field === 'shift_id')"
              class="absolute pin-r bg-red p-1 text-xs sm:text-base text-white"
            >Select atleast one shift</div>
          </div>
        </div>

        <div class="flex flex-row flex-wrap justify-around md:justify-between mt-4">
          <button
            class="relative border border-solid rounded-lg p-5 my-2 md:m-1 text-center text-xs sm:text-sm focus:outline-none w-full sm:w-1/4 md:w-1/6"
            :class="{
                'bg-grey-light': isDisabled(item.id),
                'bg-yellow-dark': isSelected(item.id), 
                'hover:bg-yellow-dark': !isSelected(item.id) && isSelectable(item.id),
              }"
            style="box-sizing:content-box;"
            v-for="item in shifts"
            :key="item.id"
            :disabled="isDisabled(item.id)"
            @click="select(item.id)"
          >{{item.name}}</button>
        </div>
      </div>
    </div>
    <div class="mt-4">
      <template v-if="form.id">
        <AppButton :label="'Remove'" @click="remove" v-if="isRemove" />
        <AppButton :label="'Update'" @click="update" v-else />
      </template>
      <AppButton :label="'Add'" @click="add" v-else />
    </div>
  </div>
</template>
<script>
import AppInput from '@/components/Base/AppInput'
import AppDate from '@/components/Base/AppDate'
import AppButton from '@/components/Base/AppButton'
export default {
  props: ['unavailableDate', 'appointmentDate', 'allocatedDate', 'type'],
  components: {
    AppInput,
    AppDate,
    AppButton
  },
  data() {
    return {
      form: {
        id: null,
        date_start: null,
        date_end: null,
        shift_id: []
      },
      formError: [],
      shifts_error: false
    }
  },
  computed: {
    shifts() {
      return this.$store.state.availability.shifts
    },
    isRemove() {
      return !Boolean(this.form.shift_id.length)
    },
  },
  created() {
    if (this.type === 'solo') {
      if (this.unavailableDate) {
        let shifts = this.unavailableDate.shifts
        if (this.appointmentDate) {
          shifts = this.unavailableDate.shifts.filter(shift => shift.id !== this.appointmentDate.shift.id)
        }
        if (this.allocatedDate && this.allocatedDate.length > 0) {
          this.allocatedDate.forEach(item => {
            shifts = this.unavailableDate.shifts.filter(shift => shift.id !== item.id)
          })
        }
        this.unavailableDate.shifts = shifts
        this.form.id = this.unavailableDate.id
        this.form.shift_id = this.unavailableDate.shifts.map(shift => shift.id)
      }
      this.form.date_start = this.$store.state.availability.selected_date
      this.form.date_end = this.$store.state.availability.selected_date
    }
  },
  watch: {
    'form.date_start'(value) {
      this.formError = this.formError.filter(error => error.field !== 'date_start')
    },
    'form.date_end'(value) {
      this.formError = this.formError.filter(error => error.field !== 'date_end')
    },
    'form.shift_id'(value) {
      this.formError = this.formError.filter(error => error.field !== 'shift_id')
    },
  },
  methods: {
    select(id) {
      let shiftId = this.form.shift_id.find(item => item === id)
      if (!shiftId) {
        this.form.shift_id.push(id)
      } else {
        let shiftIndex = this.form.shift_id.findIndex(item => item === id)
        this.form.shift_id.splice(shiftIndex, 1)
      }
    },
    add() {
      this.formError = [];
      this.Validate(this.form, ['id'])
      if (!this.formError.length) {
        this.form.date_start = this.$moment(this.form.date_start).format('YYYY-MM-DD')
        this.form.date_end = this.$moment(this.form.date_end).format('YYYY-MM-DD')
        this.$axios.$post(`/api/v1/locum/unavailabilities`, this.form).then(res => {
          this.$store.commit('jobs/ADD_LOCUM_UNAVAILABILITIES', res.data.unavailabilities)
          this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: [`${res.message}`] })
          this.$emit('close')
        }).catch(err => {
          err.response.data.error_messages.forEach(error => {
            this.formError.push(error)
          })
          this.$store.commit('SET_NOTIFICATION', {
            enabled: true,
            status: "danger",
            text: this.formError.map(error => error.message)
          })
        })
      } else {
        this.$store.commit('SET_NOTIFICATION', {
          enabled: true,
          status: "danger",
          text: ["Please fill up all the forms"]
        })
      }
    },
    update() {
      this.$axios.$put(`/api/v1/locum/unavailabilities/${this.form.id}`, { shift_id: this.form.shift_id }).then(res => {
        this.$store.commit('jobs/UPDATE_LOCUM_UNAVAILABILITIES', res.data.unavailability)
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: ['Shift updated'] })
        this.$emit('close')
      })
    },
    remove() {
      this.$axios.$delete(`/api/v1/locum/unavailabilities/${this.form.id}`).then(res => {
        this.$store.commit('jobs/REMOVE_LOCUM_UNAVAILABILITIES', this.form.id)
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: [`${res.message}`] })
        this.$emit('close')
      })
    },
    isSelectable(id) {
      // ! fix
      // return (
      //   (this.appointmentDate && this.appointmentDate.shift && this.appointmentDate.shift.id !== id) ||
      //   (this.allocatedDate && this.allocatedDate.length && !this.allocatedDate.map(shift => shift.id).includes(id))
      // )
    },
    isSelected(id) {
      return this.form.shift_id.includes(id)
    },
    isDisabled(id) {
      return (
        (this.allocatedDate && this.allocatedDate.length && this.allocatedDate.find(shift => shift.id === id)) ||
        (this.appointmentDate && this.appointmentDate.shift && this.appointmentDate.shift.id === id)
      )
    }
  }
}
</script>

