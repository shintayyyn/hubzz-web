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
            <AppInput
              v-model="form.date_start"
              :type="'date'"
              :name="'date_start'"
              :label="'From'"
              :placeholder="''"
              :error="formError.find(item => item.field === 'date_start')"
            />
          </div>
          <div class="w-full p-0 sm:w-1/2 pl-2">
            <AppInput
              v-model="form.date_end"
              :type="'date'"
              :name="'date_end'"
              :label="'To'"
              :placeholder="''"
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
          <div class="flex flex-row flex-wrap justify-start mt-4">
            <div
              class="relative border border-solid rounded-lg p-5 m-2 text-center cursor-pointer text-xs sm:text-sm"
              :class="form.shift_id.includes(item.id) ? 'bg-yellow-dark': 'hover:bg-yellow-dark'"
              style="box-sizing:content-box;width:90px"
              v-for="item in shifts"
              :key="item.id"
              @click="select(item.id)"
            >{{item.name}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-2">
      <template v-if="updateShift">
        <AppButton :label="'Remove'" @click="remove" v-if="isRemove"/>
        <AppButton :label="'Update'" @click="update" v-else/>
      </template>
      <AppButton :label="'Add'" @click="add" v-else/>
    </div>
  </div>
</template>
<script>
import AppInput from '@/components/Base/AppInput'
import AppButton from '@/components/Base/AppButton'
export default {
  components: {
    AppInput,
    AppButton
  },
  data() {
    return {
      form: {
        date_start: null,
        date_end: null,
        shift_id: []
      },
      formError: []
    }
  },
  computed: {
    shifts() {
      return this.$store.state.availability.shifts
    },
    type() {
      return this.$store.state.availability.add_type
    },
    updateShift() {
      return this.$store.state.availability.update_shift
    },
    isRemove() {
      return !Boolean(this.form.shift_id.length)
    }
  },
  created() {
    if (this.type === 'solo') {
      this.form.date_start = this.$store.state.availability.selected_date
      this.form.date_end = this.$store.state.availability.selected_date
    }
    // get selected shift
    if (this.updateShift) {
      this.form.shift_id = this.updateShift.shifts.map(item => item.id)
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
      this.$axios.$post(`/api/v1/locum/unavailabilities`, this.form).then(res => {
        console.log(res)
        this.$store.commit('availability/ADD_UNAVAILABILITIES', res.data.unavailabilities)
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: `${res.message}` })
        document.body.style.overflow = 'auto'
        this.$store.commit('TOGGLED_RIGHT', '')
        this.$store.commit('SET_ADDUNAVAILABLEDATE_MODAL', false)
        this.$store.commit('SET_ADDUNAVAILABLEDATE_SHIELD', false)
      })
    },
    update() {
      this.$axios.$put(`/api/v1/locum/unavailabilities/${this.updateShift.shiftId}`, { shift_id: this.form.shift_id }).then(res => {
        console.log(res)
        this.$store.commit('availability/UPDATE_UNAVAILABILITIES', res.data.unavailability)
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'Shift updated' })
        document.body.style.overflow = 'auto'
        this.$store.commit('TOGGLED_RIGHT', '')
        this.$store.commit('SET_ADDUNAVAILABLEDATE_MODAL', false)
        this.$store.commit('SET_ADDUNAVAILABLEDATE_SHIELD', false)
      })
    },
    remove() {
      this.$axios.$delete(`/api/v1/locum/unavailabilities/${this.updateShift.shiftId}`).then(res => {
        console.log(res)
        this.$store.commit('availability/REMOVE_UNAVAILABILITIES', this.updateShift.shiftId)
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: `${res.message}` })
        document.body.style.overflow = 'auto'
        this.$store.commit('TOGGLED_RIGHT', '')
        this.$store.commit('SET_ADDUNAVAILABLEDATE_MODAL', false)
        this.$store.commit('SET_ADDUNAVAILABLEDATE_SHIELD', false)
      })
    }
  }
}
</script>

