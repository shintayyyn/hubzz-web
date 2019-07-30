<template>
  <section>
    <div class="confirmation-shield" v-if="confirmation_modal"></div>
    <transition name="drop" mode="out-in">
      <div class="confirmation-modal flex justify-center" v-if="confirmation_modal">
        <div class="border-solid rounded-b-lg bg-yellow-dark py-2 px-24">
          <div class="flex justify-center">
            <svgicon name="alert" height="20" width="20" />
            <div class="text-sm ml-2">Delete this appointment?</div>
          </div>
          <div class="flex justify-center my-2">
            <div class="mx-2">
              <button
                class="border border-solid bg-yellow-dark hover:text-white focus:outline-none text-black font-bold py-5 rounded-lg"
                style="width:100px;"
                @click.prevent="remove"
              >Yes</button>
            </div>
            <div class="mx-2">
              <button
                class="border border-solid bg-yellow-dark hover:text-white focus:outline-none text-black font-bold py-5 rounded-lg"
                @click.prevent="confirmation_modal = false"
                style="width:100px;"
              >Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <div class="p-8 max-w-xl">
      <div @click="close" class="cursor-pointer">
        <svgicon name="left-arrow" height="32" width="32" />
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
        <AppButton :label="'Add'" @click="modal = true" :inStyle="'padding:5px;'" />
        <div class="flex flex-row flex-wrap justify-start mt-8">
          <div class="px-1">
            <AppDate
              v-model="form.date_start"
              :name="'date_start'"
              :label="'From'"
              :error="formError.find(item => item.field === 'date_start')"
            />
          </div>
          <div class="px-1">
            <AppDate
              v-model="form.date_end"
              :name="'date_end'"
              :label="'To'"
              :error="formError.find(item => item.field === 'date_end')"
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
          <AppInput
            v-model="form.rate"
            :type="'text'"
            :name="'rate'"
            :label="'Rate £'"
            :placeholder="''"
            :error="formError.find(item => item.field === 'rate')"
            :inStyle="'text-align:right'"
          />
          <div class="mx-2"></div>
          <AppSelect
            v-model="form.locum_detail_rate_type_id"
            :name="'locum_detail_rate_type_id'"
            :label="'per'"
            :placeholder="'Select...'"
            :error="formError.find(item => item.field === 'locum_detail_rate_type_id')"
            :items="rate_types"
          />
        </div>
        <div class="flex flex-row flex-wrap justify-start mt-4">
          <div class="flex flex-wrap items-center mt-2">
            <AppInput
              v-model="form.total_hours"
              :type="'text'"
              :name="'total_hours'"
              :label="'Total hours'"
              :placeholder="''"
              :error="formError.find(item => item.field === 'total_hours')"
              :inStyle="'text-align:right'"
            />
            <div class="text-xs sm:text-sm mx-2 mb-2">hours</div>
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
        <div class="flex flex-nowrap justify-start">
          <template v-if="!job">
            <AppButton :label="'Save'" @click="save" />
          </template>
          <template v-else>
            <AppButton :label="'Delete'" @click="confirmation_modal = true" />
            <div class="mx-1"></div>
            <AppButton :label="'Save'" @click="edit" />
          </template>
        </div>
      </div>
    </div>
    <div class="add-surgery-shield" v-if="modal"></div>
    <transition name="slide" mode="out-in">
      <div class="add-surgery-modal shadow-lg" v-if="modal">
        <AddSurgeryModal @close="modal = false" />
      </div>
    </transition>
  </section>
</template>
<script>
import AppInput from '@/components/Base/AppInput'
import AppDate from '@/components/Base/AppDate'
import AppSelect from '@/components/Base/AppSelect'
import AppTextarea from '@/components/Base/AppTextarea'
import AppButton from '@/components/Base/AppButton'
import AddSurgeryModal from '@/components/AddSurgeryModal'
export default {
  props: ['job'],
  components: {
    AppInput,
    AppDate,
    AppSelect,
    AppTextarea,
    AppButton,
    AddSurgeryModal
  },
  data() {
    return {
      confirmation_modal: false,
      modal: false,
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
  watch: {
    'form.private_practice_id'(value) {
      this.formError = this.formError.filter(error => error.field !== 'private_practice_id')
    },
    'form.date_start'(value) {
      this.formError = this.formError.filter(error => error.field !== 'date_start')
    },
    'form.date_end'(value) {
      this.formError = this.formError.filter(error => error.field !== 'date_end')
    },
    'form.shift_id'(value) {
      this.formError = this.formError.filter(error => error.field !== 'shift_id')
    },
    'form.locum_detail_rate_type_id'(value) {
      this.formError = this.formError.filter(error => error.field !== 'locum_detail_rate_type_id')
    },
    'form.rate'(value) {
      this.formError = this.formError.filter(error => error.field !== 'rate')
    },
    'form.total_hours'(value) {
      this.formError = this.formError.filter(error => error.field !== 'total_hours')
    },
  },
  created() {
    this.getPractices()
    this.getShifts()
    this.getRateType()
    if (this.job) {
      this.form.private_practice_id = this.job.private_job.private_practice.id
      this.form.date_start = this.job.private_job.date_start
      this.form.date_end = this.job.private_job.date_end
      this.form.shift_id = this.job.private_job.shift.id
      this.form.locum_detail_rate_type_id = this.job.private_job.locum_detail_rate_type.id
      this.form.rate = this.job.private_job.rate
      this.form.total_hours = this.job.private_job.total_hours
      this.form.private_notes = this.job.private_job.private_notes
    }
  },
  computed: {
    practices() {
      return this.$store.getters['getLocumPrivatePractices']
    },
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
    close() {
      if (this.$route.fullPath === '/dashboard') {
        this.$emit('close')
      }
      else {
        const query = {
          ...this.$route.query
        }
        this.$router.push({ path: `/jobs`, query })
      }
    },
    save() {
      this.formError = []
      this.Validate(this.form, ['private_notes'])
      if (!this.formError.length) {
        this.form.date_start = this.$moment(this.form.date_start).format('YYYY-MM-DD')
        this.form.date_end = this.$moment(this.form.date_end).format('YYYY-MM-DD')
        this.$axios.$post(`/api/v1/locum/jobs`, this.form).then(res => {
          this.$store.commit('jobs/ADD_LOCUM_ALLOCATED_JOB', res.data.job)
          this.close()
          this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: [`${res.message}`] })
        }).catch(err => {
          err.response.data.error_messages.forEach(error => {
            this.formError.push(error)
          })
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "danger",
            text: this.formError.map(error => error.message),
          });
        })
      } else {
        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "danger",
          text: ["Please fill up all the forms"],
        });
      }
    },
    edit() {
      this.formError = []
      this.Validate(this.form, ['private_notes'])
      if (!this.formError.length) {
        this.$axios.$put(`/api/v1/locum/jobs/${this.job.id}`, this.form).then(res => {
          if (res.data.job.locum_status === 'Current') {
            this.$store.commit('jobs/UPDATE_LOCUM_ALLOCATED_JOB', res.data.job)
          } else if (res.data.job.locum_status === 'Completed') {
            this.$store.commit('jobs/REMOVE_LOCUM_ALLOCATED_JOB', res.data.job.id)
          }
          this.close()
          this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: [`${res.message}`] })
        }).catch(err => {
          err.response.data.error_messages.forEach(error => {
            this.formError.push(error)
          })
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "danger",
            text: this.formError.map(error => error.message)
          });
        })
      } else {
        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "danger",
          text: ["Please fill up all the forms"]
        });
      }
    },
    remove() {
      this.$axios.$delete(`/api/v1/locum/jobs/${this.job.id}`).then(res => {
        this.$store.commit('jobs/REMOVE_LOCUM_ALLOCATED_JOB', this.job.id)
        this.close()
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: [`${res.message}`] })
      })
    }
  }
}
</script>
<style scoped>
.confirmation-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 511;
}
.confirmation-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: auto;
  z-index: 512;
}
.add-surgery-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 511;
}
.add-surgery-modal {
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
  z-index: 512;
}
@media screen and (min-width: 1200px) {
  .add-surgery-modal {
    width: 70%;
  }
}
</style>


