<template>
  <div
    class="create-appointment-modal shadow-lg"
    v-if="$auth.user.domain === 'Locum' && $store.state.toggled_create_appointment_modal"
  >
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
      practices: [],
      form: {
        private_practice_id: '',
        date_start: '',
        date_end: '',
        shift_id: '',
        locum_detail_rate_type_id: '',
        rate: '',
        total_hourse: '',
        private_notes: ''
      },
      formError: []
    }
  },
  created() {
    this.$on('addSelectedPractice', (data) => {
      console.log(data)
    })
    // get practices
    this.getPractices()
  },
  methods: {
    getPractices() {
      this.$axios.$get(`/api/v1/locum/private-practices`).then(res => {
        this.practices = []
        res.data.private_practices.forEach(item => {
          this.practices.push({ label: item.surgery.name, value: item.surgery.id })
        })
      })
    },
    add() {
      this.$store.commit('TOGGLE_ADD_SURGERY_MODAL', true)
    },
    close() {
      this.$store.commit('TOGGLE_CREATE_APPOINTMENT_MODAL', false)
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


