<template>
  <div class="modal-container shadow-lg">
    <div class="p-8 max-w-xl">
      <div @click="$router.push('/profile/branches-surgeries')" class="cursor-pointer">
        <svgicon name="left-arrow" height="32" width="32" />
      </div>
      <div class="flex flex-row justify-start mt-8">
        <div class="leading-loose font-bold text-md sm:text-lg">{{practice_surgery.surgery.name}}</div>
        <div
          class="mx-2 text-sm sm:text-sm p-2 text-gray-700 font-bold"
        >{{practice_surgery.surgery.code}}</div>
      </div>
      <div class="rounded-lg shadow-lg p-8">
        <div class="flex flex-col flex-wrap justify-between">
          <div class="w-full p-1">
            <AppSelect
              v-model="form.pay_for_surgery"
              :name="'pay_for_surgery'"
              :label="'Pay for surgery'"
              :placeholder="'Select...'"
              :items="[{ label: 'Yes', value: true }, { label: 'No', value: false }]"
            />
          </div>
          <div class="w-full p-1">
            <AppSelect
              v-model="form.verify_job_creation"
              :name="'verify_job_creation'"
              :label="'Verify job creation'"
              :placeholder="'Select...'"
              :items="[{ label: 'Yes', value: true }, { label: 'No', value: false }]"
            />
          </div>
        </div>
        <div class="flex flex-row justify-start">
          <AppButton :label="'Save'" @click="save" :inStyle="'padding:5px'" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import AppSelect from '@/components/Base/AppSelect'
import AppButton from '@/components/Base/AppButton'
export default {
  components: {
    AppSelect,
    AppButton,
  },
  data() {
    return {
      form: {
        pay_for_surgery: '',
        verify_job_creation: ''
      }
    }
  },
  async asyncData({ app, store, params, error }) {
    try {
      const response = await app.$axios.$get(`/api/v1/practice/me/practice-surgeries/${params.id}`)
      const practice_surgery = response.data && response.data.practice_surgery ? response.data.practice_surgery : null
      return {
        practice_surgery
      }
    } catch (err) {
      throw err
    }
  },
  created() {
    this.form.pay_for_surgery = this.practice_surgery.pay_for_surgery
    this.form.verify_job_creation = this.practice_surgery.verify_job_creation
  },
  methods: {
    save() {
      this.$axios.$put(`/api/v1/practice/me/practice-surgeries/${this.$route.params.id}`, this.form).then(res => {
        this.$store.commit('profile/UPDATE_SURGERY', res.data.practice_surgery)
        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "success",
          text: ["Surgery Update Success"]
        });
        this.$router.push('/profile/branches-surgeries')
      })
    }
  }
}
</script>

<style scoped>
.modal-container {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  border-left: solid 2px #edf2f7;
  transition: all 0.3s ease-in-out;
  background-color: white;
  z-index: 510;
}
@media screen and (min-width: 1200px) {
  .modal-container {
    width: 70%;
  }
}
</style>