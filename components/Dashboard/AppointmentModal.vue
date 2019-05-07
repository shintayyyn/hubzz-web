<template>
  <div
    class="absolute pin-r pin-y z-10 p-10 bg-white shadow-lg"
    style="height:1800px"
    :style="$store.state.mobile ? 'width:100%' : 'width:90%'"
  >
    <!-- :class="[$store.state.blur_bg_2 ? 'blurClass2' : '', 'bgClass2']" -->
    <div
      v-if="true"
      class="absolute pin-t z-50"
      :class="$store.state.mobile ? 'w-full pin-x':'flex justify-center w-full pin-x'"
    >
      <div class="border-solid rounded-b-lg bg-red py-2 px-24" v-if="errorMessage">
        <div class="flex justify-center">
          <svgicon name="exclamation-mark" height="20" width="20"/>
          <div class="ml-2 text-xs text-white leading-loose">{{errorMessage}}</div>
          <div
            class="ml-4 text-base text-white leading-normal font-bold cursor-pointer hover:text-yellow"
            @click="errorMessage = ''"
          >X</div>
        </div>
      </div>
    </div>
    <div @click="$store.commit('TOGGLE_APPOINTMENT_MODAL', false)" class="cursor-pointer">
      <svgicon name="left-arrow" height="32" width="32"/>
    </div>
    <div class="font-bold text-lg my-5" style="font-family: Nunito">Appointment</div>
    <div class="w-5/6 border-solid rounded-lg shadow-lg p-5">
      <form class="w-full">
        <div class="relative flex flex-col">
          <div class="flex flex-row justify-between">
            <label for="practice" class="text-sm" style="width:50%">Practice</label>
          </div>
          <div class="flex flex-row justify-between mt-4">
            <div
              class="flex flex-col border-b-2 border-grey-light"
              style="width:100%"
              :class="[setFocus === 'practice' ? 'border-yellow':'', formError.find(item => item.field === 'practice') ? 'border-red':'']"
            >
              <select
                class="focus:outline-none font-bold text-sm"
                style="height:40px;"
                @focus="setFocus = 'practice'"
                @blur="setFocus = ''"
                v-model="form.practice"
              >
                <template v-if="surgeries.length > 0">
                  <option
                    v-for="(item, index) in surgeries"
                    :key="index"
                    :value="item"
                  >{{item.name}}</option>
                </template>
                <option v-else value selected disabled>Add a surgery first..</option>
              </select>
            </div>
          </div>
          <div
            class="absolute pin-t pin-r bg-red text-white p-1 text-xs xl:text-base"
            v-if="formError.find(item => item.field === 'practice')"
          >{{formError.find(item => item.field === 'practice').message}}</div>
        </div>

        <button
          class="rounded-lg bg-yellow-dark shadow-md m-2 p-2 text-sm font-bold hover:text-white focus:outline-none"
          @click.prevent="$store.commit('TOGGLE_SURGERY_MODAL', true)"
        >Add</button>

        <div class="relative flex flex-row flex-wrap">
          <div class="w-full lg:w-1/3 px-3">
            <div class="relative flex flex-col mt-8">
              <div class="flex flex-row justify-between">
                <label for="from" class="text-sm">From</label>
              </div>
              <div class="flex flex-row justify-between mt-4">
                <div
                  class="flex flex-col border-b-2 border-grey-light"
                  style="width:100%"
                  :class="[setFocus === 'from' ? 'border-yellow':'', formError.find(item => item.field === 'from') ? 'border-red':'']"
                >
                  <input
                    type="date"
                    ref="from"
                    class="focus:outline-none font-bold text-sm text-center"
                    style="height:40px;"
                    @focus="setFocus = 'from'"
                    @blur="setFocus = ''"
                    v-model="form.from"
                    :min="$moment().format('YYYY-MM-DD')"
                  >
                </div>
              </div>
              <div
                class="absolute pin-t pin-r bg-red text-white p-1 text-xs xl:text-base"
                v-if="formError.find(item => item.field === 'from')"
              >{{formError.find(item => item.field === 'from').message}}</div>
            </div>
          </div>
          <div class="w-full lg:w-1/3 px-3">
            <div class="relative flex flex-col mt-8">
              <div class="flex flex-row justify-between">
                <label for="to" class="text-sm">To</label>
              </div>
              <div class="flex flex-row justify-between mt-4">
                <div
                  class="flex flex-col border-b-2 border-grey-light"
                  style="width:100%"
                  :class="[setFocus === 'to' ? 'border-yellow':'', formError.find(item => item.field === 'to') ? 'border-red':'']"
                >
                  <input
                    type="date"
                    ref="to"
                    class="focus:outline-none font-bold text-sm text-center"
                    style="height:40px;"
                    @focus="setFocus = 'to'"
                    @blur="setFocus = ''"
                    v-model="form.to"
                    :min="$moment().format('YYYY-MM-DD')"
                  >
                </div>
              </div>
              <div
                class="absolute pin-t pin-r bg-red text-white p-1 text-xs xl:text-base"
                v-if="formError.find(item => item.field === 'to')"
              >{{formError.find(item => item.field === 'to').message}}</div>
            </div>
          </div>
          <div class="w-full lg:w-1/3 px-3">
            <div class="relative flex flex-col mt-8">
              <div class="flex flex-row justify-between">
                <label for="shift" class="text-sm">Shift</label>
              </div>
              <div class="flex flex-row justify-between mt-4">
                <div
                  class="flex flex-col border-b-2 border-grey-light"
                  style="width:100%"
                  :class="[setFocus === 'shift' ? 'border-yellow':'', formError.find(item => item.field === 'shift') ? 'border-red':'']"
                >
                  <select
                    class="focus:outline-none font-bold text-sm"
                    style="height:40px;"
                    @focus="setFocus = 'shift'"
                    @blur="setFocus = ''"
                    v-model="form.shift"
                  >
                    <option value selected disabled>Select..</option>
                    <option v-for="(item,index) in shifts" :key="index">{{item}}</option>
                  </select>
                </div>
              </div>
              <div
                class="absolute pin-t pin-r bg-red text-white p-1 text-xs xl:text-base"
                v-if="formError.find(item => item.field === 'shift')"
              >{{formError.find(item => item.field === 'shift').message}}</div>
            </div>
          </div>
        </div>

        <div class="relative flex flex-row flex-wrap">
          <div class="w-full lg:w-1/3 px-3">
            <div class="relative flex flex-col mt-8">
              <div class="flex flex-row justify-between">
                <label for="rate" class="text-sm">Rate £</label>
              </div>
              <div class="flex flex-row justify-between mt-4">
                <div
                  class="flex flex-col border-b-2 border-grey-light"
                  style="width:100%"
                  :class="[setFocus === 'rate' ? 'border-yellow':'', formError.find(item => item.field === 'rate') ? 'border-red':'']"
                >
                  <input
                    type="text"
                    ref="rate"
                    class="focus:outline-none font-bold text-sm text-right"
                    style="height:40px;"
                    @focus="setFocus = 'rate'"
                    @blur="setFocus = ''"
                    v-model="form.rate"
                  >
                </div>
              </div>
              <div
                class="absolute pin-t pin-r bg-red text-white p-1 text-xs xl:text-base"
                v-if="formError.find(item => item.field === 'rate')"
              >{{formError.find(item => item.field === 'rate').message}}</div>
            </div>
          </div>
          <div class="w-full lg:w-1/3 px-3">
            <div class="relative flex flex-col mt-8">
              <div class="flex flex-row justify-between">
                <label for="per" class="text-sm">per</label>
              </div>
              <div class="flex flex-row justify-between mt-4">
                <div
                  class="flex flex-col border-b-2 border-grey-light"
                  style="width:100%"
                  :class="[setFocus === 'per' ? 'border-yellow':'', formError.find(item => item.field === 'per') ? 'border-red':'']"
                >
                  <select
                    class="focus:outline-none font-bold text-sm"
                    style="height:40px;"
                    @focus="setFocus = 'per'"
                    @blur="setFocus = ''"
                    v-model="form.per"
                  >
                    <option value="hour">hour</option>
                    <option value="session">session</option>
                  </select>
                </div>
              </div>
              <div
                class="absolute pin-t pin-r bg-red text-white p-1 text-xs xl:text-base"
                v-if="formError.find(item => item.field === 'per')"
              >{{formError.find(item => item.field === 'per').message}}</div>
            </div>
          </div>
        </div>

        <div class="relative flex flex-row flex-wrap">
          <div class="w-full lg:w-1/2 px-3">
            <div class="relative flex flex-col mt-8">
              <div class="flex flex-row justify-between">
                <label for="total_hours" class="text-sm">Total hours</label>
              </div>
              <div class="flex flex-row justify-between mt-4">
                <div
                  class="flex flex-col border-b-2 border-grey-light"
                  style="width:100%"
                  :class="[setFocus === 'total_hours' ? 'border-yellow':'', formError.find(item => item.field === 'total_hours') ? 'border-red':'']"
                >
                  <input
                    type="text"
                    ref="total_hours"
                    class="focus:outline-none font-bold text-sm text-right"
                    style="height:40px;"
                    @focus="setFocus = 'total_hours'"
                    @blur="setFocus = ''"
                    v-model="form.total_hours"
                  >
                </div>
              </div>
              <div
                class="absolute pin-t pin-r bg-red text-white p-1 text-xs xl:text-base"
                v-if="formError.find(item => item.field === 'total_hours')"
              >{{formError.find(item => item.field === 'total_hours').message}}</div>
            </div>
          </div>
        </div>

        <div class="relative flex flex-row flex-wrap">
          <div class="w-full px-3">
            <div class="relative flex flex-col mt-8">
              <div class="flex flex-row justify-between">
                <label for="private_notes" class="text-sm">Private notes</label>
              </div>
              <div class="flex flex-row justify-between mt-4">
                <div
                  class="flex flex-col border-b-2 border-grey-light"
                  style="width:100%"
                  :class="[setFocus === 'private_notes' ? 'border-yellow':'', formError.find(item => item.field === 'private_notes') ? 'border-red':'']"
                >
                  <textarea
                    rows="10"
                    @focus="setFocus = 'private_notes'"
                    @blur="setFocus = ''"
                    v-model="form.private_notes"
                    class="text-sm font-bold focus:outline-none"
                  ></textarea>
                </div>
              </div>
              <div
                class="absolute pin-t pin-r bg-red text-white p-1 text-xs xl:text-base"
                v-if="formError.find(item => item.field === 'private_notes')"
              >{{formError.find(item => item.field === 'private_notes').message}}</div>
            </div>
          </div>
        </div>

        <div class="relative flex flex-row flex-wrap m-2">
          <!-- <button
            class="rounded-lg bg-yellow-dark shadow-md p-6 text-lg font-bold hover:text-white focus:outline-none"
            @click.prevent="update"
            v-if="editAppointmentDate"
          >Update</button>-->
          <button
            class="rounded-lg bg-yellow-dark shadow-md p-6 text-lg font-bold hover:text-white focus:outline-none"
            @click.prevent="save(editAppointmentDate ? 'update':'add')"
          >Save</button>
        </div>
      </form>
    </div>
    <transition name="slide">
      <SurgeryModal v-if="$store.state.surgery_modal" @addSurgery="addSurgery"/>
    </transition>
  </div>
</template>
<script>
import SurgeryModal from '@/components/Dashboard/SurgeryModal'
const shifts = [
  'AM', 'PM',
  'WHOLE DAY', 'OOH'
]
export default {
  components: {
    SurgeryModal
  },
  data() {
    return {
      shifts,
      form: {
        job_number: `00${this.$store.state.dashboard.appointmentDates.length + 1}`,
        practice: '',
        from: null,
        to: null,
        shift: '',
        rate: '',
        per: 'hour',
        total_hours: '',
        private_notes: ''
      },
      formError: [],
      setFocus: '',
      appointmentDates: [],
      errorMessage: ''
    }
  },
  computed: {
    surgeries() {
      return this.$store.state.dashboard.surgeries
    },
    editAppointmentDate() {
      return this.$store.state.dashboard.editAppointmentDate
    }
  },
  watch: {
    // just to set the default selected practice
    surgeries(value) {
      value.length > 0 ? this.form.practice = value[0] : ''
    }
  },
  beforeDestroy() {
    this.$store.commit('dashboard/SET_EDIT_APPOINTMENT_DATE', null)
  },
  mounted() {
    if (this.editAppointmentDate) {
      this.form.practice = this.editAppointmentDate.practice,
        this.form.job_number = this.editAppointmentDate.job_number,
        this.form.from = this.editAppointmentDate.from,
        this.form.to = this.editAppointmentDate.to,
        this.form.shift = this.editAppointmentDate.shifts,
        this.form.rate = this.editAppointmentDate.rate,
        this.form.per = this.editAppointmentDate.per,
        this.form.total_hours = this.editAppointmentDate.total_hours,
        this.form.private_notes = this.editAppointmentDate.private_notes
    } else {
      this.surgeries.length ? this.form.practice = this.surgeries[0] : this.form.practice = ''
    }
    // get added surgeries/practices from API
    // set to store
    // this.$store.commit('SET_SURGERIES', [])
  },
  methods: {
    addSurgery(surgery) {
      // post request to API
      // add the selected surgery into the lists/store
      this.$store.commit('dashboard/ADD_SURGERY', surgery)
    },
    save(type) {
      try {
        this.formError = []
        this.errorMessage = ''
        this.Validate(this.form, ['private_notes'])
        this.ValidateDate(this.form.from, this.form.to)
        let dates = this.getDateArray(this.form.from, this.form.to)
        if (this.$store.state.dashboard.appointmentDates.length > 0) {
          this.validateAppointmentDates(dates, this.form.shift)
        }
        if (!this.formError.length) {
          // post request to API
          // get the job number from response
          // set to store
          this.$store.commit(`dashboard/${type === 'add' ? 'ADD_APPOINTMENT_DATE' : 'UPDATE_APPOINTMENT_DATE'}`, {
            // job number should come from api
            job_number: this.form.job_number, practice: this.form.practice,
            from: this.$moment(this.form.from).format('YYYY-MM-DD'), to: this.$moment(this.form.to).format('YYYY-MM-DD'),
            shifts: this.form.shift, rate: this.form.rate, per: this.form.per,
            total_hours: this.form.total_hours, private_notes: this.form.private_notes
          })
          this.$store.commit('TOGGLE_APPOINTMENT_MODAL', false)
        }
      } catch (e) {
        console.log(e)
      }
    },
    update() {
      try {
        this.formError = []
        this.errorMessage = ''
        this.Validate(this.form, ['private_notes'])
        this.ValidateDate(this.form.from, this.form.to)
        let dates = this.getDateArray(this.form.from, this.form.to)
        if (this.$store.state.dashboard.appointmentDates.length > 0) {
          this.validateAppointmentDates(dates, this.form.shift)
        }
        if (!this.formError.length) {
          // put request to API
          // get the response
          // set to store
          this.$store.commit('dashboard/UPDATE_APPOINTMENT_DATE', {
            // job number should come from api
            job_number: this.form.job_number, practice: this.form.practice,
            from: this.$moment(this.form.from).format('YYYY-MM-DD'), to: this.$moment(this.form.to).format('YYYY-MM-DD'),
            shifts: this.form.shift, rate: this.form.rate, per: this.form.per,
            total_hours: this.form.total_hours, private_notes: this.form.private_notes
          })
          this.$store.commit('TOGGLE_APPOINTMENT_MODAL', false)
        }
      } catch (e) {
        console.log(e)
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
    },
    validateAppointmentDates(newDates, newShift) {
      let hasError = false
      // get all the old appointments from api/store excluding the present one
      let oldAppointmentFromAPI = this.$store.state.dashboard.appointmentDates.filter(item => item.job_number !== this.form.job_number)
      oldAppointmentFromAPI.forEach(oldAppointment => {
        // get the span date of each old appointment
        let oldDates = this.getDateArray(oldAppointment.from, oldAppointment.to)
        // and their shifts
        let oldShift = oldAppointment.shifts
        // validate
        newDates.forEach(newDate => {
          oldDates.forEach(oldDate => {
            // if the old date and new date is same and either of the appointment has a whole day shift return err
            if (oldDate === newDate && (oldShift === 'WHOLE DAY' || newShift === 'WHOLE DAY')) {
              hasError = true
            }
            if (oldDate === newDate && oldShift === newShift) {
              hasError = true
            }
          })
        })
      })
      if (hasError) {
        this.errorMessage = "Dates on your appointment clash with your other appointments"
        this.formError.push(
          { field: 'from', message: 'Conflict Dates', validation: 'conflict' },
          { field: 'to', message: 'Conflict Dates', validation: 'conflict' },
          { field: 'shift', message: 'Conflict Dates', validation: 'conflict' }
        )
      }
    }
  }
}
</script>
<style>
.bgClass2 {
  transition: all 0.3s ease-in-out;
}
.blurClass2 {
  filter: blur(2px);
  opacity: 0.8;
}
button:active {
  transform: translate(5px, 5px);
}
</style>

