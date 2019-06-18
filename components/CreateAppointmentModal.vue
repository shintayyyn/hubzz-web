<template>
  <div class="create-appointment-modal shadow-lg" v-if="$auth.user.domain === 'Locum' ">
    <div class="p-8 max-w-xl">
      <div @click="close" class="cursor-pointer">
        <svgicon name="left-arrow" height="32" width="32"/>
      </div>
      <div class="flex justify-start font-bold text-sm sm:text-xl mt-8">Appointment</div>
      <div class="rounded-lg shadow-lg px-8 py-4 mt-4">
        <AppSelect
          v-model="form.private_practice_id"
          :name="'private_practice_id'"
          :label="'Practice'"
          :placeholder="'Select...'"
          :error="formError.find(item => item.field === 'private_practice_id')"
          :items="practices"
        />
        <AppButton :label="'Add'" @click="add" :inStyle="'padding:5px;'"/>
        <div class="flex flex-row flex-wrap justify-start mt-8">
          <div class="px-1">
            <AppInput
              v-model="form.date_start"
              :type="'date'"
              :name="'date_start'"
              :label="'From'"
              :error="formError.find(item => item.field === 'date_start')"
              :placeholder="'mm/dd/yyyy'"
            />
          </div>
          <div class="px-1">
            <AppInput
              v-model="form.date_end"
              :type="'date'"
              :name="'date_end'"
              :label="'To'"
              :error="formError.find(item => item.field === 'date_end')"
              :placeholder="'mm/dd/yyyy'"
            />
          </div>
          <div class="px-1 leading-loose">
            <AppSelect
              v-model="form.shift_id"
              :name="'shift_id'"
              :label="'Shift'"
              :placeholder="'Select...'"
              :error="formError.find(item => item.field === 'shift_id')"
              :items="shifts"
            />
          </div>
        </div>
        <div class="flex flex-row flex-wrap justify-start mt-4">
          <div class="flex flex-wrap items-center mt-2">
            <div class="text-xs sm:text-sm px-2 mb-2">Rate £</div>
            <input
              type="text"
              name="rate"
              v-model="form.rate"
              class="border-b-2 focus:border-yellow focus:outline-none py-2 font-bold text-xs sm:text-sm text-right"
            >
          </div>
          <div class="flex flex-wrap items-center mt-2">
            <div class="text-xs sm:text-sm px-2 mb-2">per</div>
            <select
              v-model="form.locum_detail_rate_type_id"
              name="locum_detail_rate_type_id"
              class="py-2 font-bold text-xs sm:text-sm"
            >
              <option
                :value="item.value"
                v-for="item in rate_types"
                :key="item.value"
              >{{item.label}}</option>
            </select>
          </div>
        </div>
        <div class="flex flex-row flex-wrap justify-start mt-4">
          <div class="flex flex-wrap items-center mt-2">
            <div class="text-xs sm:text-sm px-2 mb-2">Total hours</div>
            <input
              type="text"
              name="total_hours"
              v-model="form.total_hours"
              class="border-b-2 focus:border-yellow focus:outline-none py-2 font-bold text-xs sm:text-sm text-right"
            >
            <div class="text-xs sm:text-sm px-2 mb-2">hours</div>
          </div>
        </div>
        <div class="mt-4">
          <AppTextarea
            v-model="form.private_notes"
            :name="'private_notes'"
            :label="'Private notes'"
            :placeholder="''"
          />
        </div>
        <template v-if="!appointmentJob">
          <AppButton :label="'Save'" @click="save"/>
        </template>
        <template v-else>
          <AppButton :label="'Save'" @click="edit"/>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import AppInput from '@/components/Base/AppInput'
import AppSelect from '@/components/Base/AppSelect'
import AppTextarea from '@/components/Base/AppTextarea'
import AppButton from '@/components/Base/AppButton'
export default {
  components: {
    AppInput,
    AppSelect,
    AppTextarea,
    AppButton
  },
  data() {
    return {
      shifts: [],
      rate_types: [],
      form: {
        private_practice_id: '',
        date_start: '',
        date_end: '',
        shift_id: '',
        locum_detail_rate_type_id: '',
        rate: '',
        total_hours: '',
        private_notes: ''
      },
      formError: []
    }
  },
  created() {
    this.getPractices()
    this.getShifts()
    this.getRateType()
    //
    if (this.appointmentJob) {
      this.form.private_practice_id = this.appointmentJob.private_job.private_practice.id
      this.form.date_start = this.appointmentJob.private_job.date_start
      this.form.date_end = this.appointmentJob.private_job.date_end
      this.form.shift_id = this.appointmentJob.private_job.shift.id
      this.form.locum_detail_rate_type_id = this.appointmentJob.private_job.locum_detail_rate_type.id
      this.form.rate = this.appointmentJob.private_job.rate
      this.form.total_hours = this.appointmentJob.private_job.total_hours
      this.form.private_notes = this.appointmentJob.private_job.private_notes
    }
  },
  computed: {
    practices() {
      return this.$store.getters['getLocumPrivatePractices']
    },
    appointmentJob() {
      return this.$store.state.jobs.appointment_job
    }
  },
  methods: {
    getPractices() {
      this.$axios.$get(`/api/v1/locum/private-practices`).then(res => {
        this.$store.commit('SET_LOCUM_PRIVATE_PRACTICES', res.data.private_practices)
      })
    },
    getShifts() {
      this.$axios.$get(`/api/v1/shifts`).then(res => {
        this.shifts = []
        res.data.shifts.forEach(item => {
          this.shifts.push({ label: item.name, value: item.id })
        })
      })
    },
    getRateType() {
      this.$axios.$get(`/api/v1/locum-detail-rate-types`).then(res => {
        this.rate_types = []
        res.data.locum_detail_rate_types.forEach(item => {
          this.rate_types.push({ label: item.name, value: item.id })
        })
      })
    },
    add() {
      this.$store.commit('TOGGLE_ADD_SURGERY_MODAL', true)
    },
    close() {
      this.$store.commit('TOGGLE_CREATE_APPOINTMENT_MODAL', false)
      document.body.style.overflow = 'auto'
    },
    save() {
      this.$axios.$post(`/api/v1/locum/jobs`, this.form).then(res => {
        this.$store.commit('TOGGLE_CREATE_APPOINTMENT_MODAL', '')
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: `${res.message}` })
      })
    },
    edit() {
      this.$axios.$put(`/api/v1/locum/jobs/${this.appointmentJob.private_job.id}`, this.form).then(res => {
        console.log(res)
        this.$store.commit('TOGGLE_CREATE_APPOINTMENT_MODAL', '')
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: `${res.message}` })
      })
    }
  }
}
</script>
<style scoped>
.create-appointment-modal {
  position: fixed;
  top: 0;
  right: 0;
  margin-right: 0%;
  width: 100%;
  height: 100%;
  overflow: auto;
  border-left: solid 2px #edf2f7;
  transition: all 0.3s ease-in-out;
  background-color: white;
  z-index: 510;
}
@media screen and (min-width: 1200px) {
  .create-appointment-modal {
    width: 80%;
  }
}
</style>


