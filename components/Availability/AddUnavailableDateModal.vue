<template>
  <div class="p-8 max-w-lg">
    <div @click="$emit('close')" class="cursor-pointer">
      <svgicon name="left-arrow" height="32" width="32"/>
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
        <div class="flex flex-row flex-wrap justify-start mt-4">
          <div class="text-sm sm:text-md leading-loose mr-2">On theses shifts</div>
          <div
            class="rounded-lg bg-grey-light px-2 py-1 text-sm sm:text-md flex items-center"
            v-if="type === 'solo'"
          >Select all that apply. Shifts that are already booked are greyed-out.</div>
          <div
            class="rounded-lg bg-grey-light px-2 py-1 text-sm sm:text-md flex items-center"
            v-else
          >Select all that apply.</div>
          <div class="flex flex-row flex-wrap justify-center sm:justify-start mt-4">
            <button
              class="relative border border-solid rounded-lg p-5 m-2 text-center text-xs sm:text-sm focus:outline-none"
              :class="{
                'bg-grey-light': appointmentDate && appointmentDate.shift && appointmentDate.shift.id === item.id,
                'bg-yellow-dark cursor-pointer': form.shift_id.includes(item.id), 
                'hover:bg-yellow-dark cursor-pointer': !form.shift_id.includes(item.id) && appointmentDate && appointmentDate.shift && appointmentDate.shift.id !== item.id,
              }"
              style="box-sizing:content-box;width:90px"
              v-for="item in shifts"
              :key="item.id"
              :disabled="appointmentDate && appointmentDate.shift && appointmentDate.shift.id === item.id"
              @click="select(item.id)"
            >{{item.name}}</button>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-2">
      <template v-if="form.id">
        <AppButton :label="'Remove'" @click="remove" v-if="isRemove"/>
        <AppButton :label="'Update'" @click="update" v-else/>
      </template>
      <AppButton :label="'Add'" @click="add" v-else/>
    </div>
  </div>
</template>
<script>
import AppInput from '@/components/Base/AppInput'
import AppDate from '@/components/Base/AppDate'
import AppButton from '@/components/Base/AppButton'
export default {
  props: ['unavailableDate', 'appointmentDate', 'type'],
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
    }
  },
  computed: {
    shifts() {
      return this.$store.state.availability.shifts
    },
    isRemove() {
      return !Boolean(this.form.shift_id.length)
    }
  },
  created() {
    if (this.type === 'solo') {
      if (this.unavailableDate && this.appointmentDate) {
        this.unavailableDate.shifts = this.unavailableDate.shifts.filter(shift => shift.id !== this.appointmentDate.shift.id)
      }
      if (this.unavailableDate) {
        this.form.id = this.unavailableDate.id
        this.form.shift_id = this.unavailableDate.shifts.map(shift => shift.id)
      }
      this.form.date_start = this.$store.state.availability.selected_date
      this.form.date_end = this.$store.state.availability.selected_date
    }
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
      if (this.form.shift_id.length === 0) {
        return
      }
      this.form.date_start = this.$moment(this.form.date_start).format('YYYY-MM-DD')
      this.form.date_end = this.$moment(this.form.date_end).format('YYYY-MM-DD')
      this.$axios.$post(`/api/v1/locum/unavailabilities`, this.form).then(res => {
        this.$store.commit('availability/ADD_UNAVAILABILITIES', res.data.unavailabilities)
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: `${res.message}` })
        this.$emit('close')
      })
    },
    update() {
      this.$axios.$put(`/api/v1/locum/unavailabilities/${this.form.id}`, { shift_id: this.form.shift_id }).then(res => {
        this.$store.commit('availability/UPDATE_UNAVAILABILITIES', res.data.unavailability)
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'Shift updated' })
        this.$emit('close')
      })
    },
    remove() {
      this.$axios.$delete(`/api/v1/locum/unavailabilities/${this.form.id}`).then(res => {
        this.$store.commit('availability/REMOVE_UNAVAILABILITIES', this.form.id)
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: `${res.message}` })
        this.$emit('close')
      })
    }
  }
}
</script>

