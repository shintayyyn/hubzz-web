<template>
  <div class="">
    <AppBreadcrumbs :links="links" />
    <div class="px-2">
      <div class="flex flex-col mb-4 relative">
        <div class="flex flex-col mb-3 md:mb-6 py-2">
          <div class="relative flex flex-wrap leading-none items-center">
            <label class="text-xs sm:text-sm py-1">
              <span>Type</span>
              
              <span class="text-red-500">*</span>
            </label>
          </div>

          <div class="flex flex-row justify-start mt-1">
            <div class="flex flex-col w-full">
              <div class="flex items-center justify-start">
                <button
                  :class="[
                    'rounded-lg',
                    'px-3',
                    'py-1',
                    'mx-1',
                    'my-0',
                    'focus:outline-none',
                    'transition-all',
                    'border',
                    'text-gray-900',
                    form.type === 'Platform'
                      ? 'bg-gradient-yellow'
                      : 'border-gray-900',
                    'font-bold',
                  ]"
                  @click="form.type = form.type === 'Platform' ? null : 'Platform'"
                >
                  Platform
                </button>

                <button
                  :class="[
                    'rounded-lg',
                    'px-3',
                    'py-1',
                    'mx-1',
                    'my-0',
                    'focus:outline-none',
                    'transition-all',
                    'border',
                    'text-gray-900',
                    form.type === 'Private'
                      ? 'bg-gradient-yellow'
                      : 'border-gray-900',
                    'font-bold',
                  ]"
                  @click="form.type = form.type === 'Private' ? null : 'Private'"
                >
                  Private
                </button>
              </div>

              <transition name="drop-down">
                <div v-if="formError.find(item => item.field === 'type')" class="text-red-500 py-1 text-xs text-white">
                  {{ formError.find(item => item.field === 'type').message }}
                </div>
              </transition>
            </div>
          </div>
        </div>

        <AppInput
          v-if="form.type === 'Platform'"
          v-model="form.practice_id"
          :label="'Practice'"
          :type="'select'"
          :name="'practice_id'"
          :placeholder="'Select...'"
          :error="formError.find(item => item.field === 'practice_id')"
          :items="practicesSelectionList"
          :required="true"
        />

        <AppInput
          v-if="form.type === 'Private'"
          v-model="form.private_practice_id"
          :label="'Private Practice'"
          :type="'select'"
          :name="'private_practice_id'"
          :placeholder="'Select...'"
          :error="formError.find(item => item.field === 'private_practice_id')"
          :items="privatePracticesSelectionList"
          :required="true"
        />

        <AppInput
          v-model="form.description"
          :type="'textarea'"
          :name="'description'"
          :label="'Description'"
          :error="formError.find(item => item.field === 'description')"
          :resize="false"
          :limit="225"
          :required="true"
        />

        <AppInput
          v-model="form.total"
          :type="'number'"
          :name="'total'"
          :label="'Total'"
          :error="formError.find(item => item.field === 'total')"
          :inStyle="'text-align:right'"
          :required="true"
        />

        <AppDate
          v-model="form.date"
          :name="'date'"
          :label="'Date'"
          :isBefore="true"
          :error="formError.find(item => item.field === 'date')"
          :required="true"
        />

        <AppLoading :loading="loading" spinner />
      </div>

      <AppButton :label="'Save report'" :inStyle="'padding:5px 14px;'" :disabled="loading" @click="save" />
    </div>
  </div>
</template>

<script>
import AppConfirmationModal from "@/components/Base/AppConfirmationModal"
import AppLoading from "@/components/Base/AppLoading"
import AppInput from "@/components/Base/AppInput"
import AppDate from "@/components/Base/AppDate"
import AppButton from "@/components/Base/AppButton"
import AppTable from "@/components/Base/AppTable"
import AppBreadcrumbs from "@/components/Base/AppBreadcrumbs"

export default {
  transition: {
    name: 'slide',
    mode: 'out-in',
  },

  components: {
    AppConfirmationModal,
    AppLoading,
    AppInput,
    AppDate,
    AppTable,
    AppButton,
    AppBreadcrumbs
  },

  data () {
    return {
      selectedExpenseReportId: null,
      initialLoading: false,
      loading: false,
      expenseReports: [],
      total: 0,

      modal: false,
      delete_modal: false,
      form: {
        type: null,
        practice_id: null,
        private_practice_id: null,
        description: "",
        total: 0,
        date: null,
      },
      formError: [],

      current_page: 1,
      offset: 0,
      limit: 10,
      order_by: ["date:asc",],

      date_start: null,
      date_end: null,
      filterDateTotal: 0,
      weekTotal: 0,
      monthTotal: 0,

      exporting: false,

      gettingPractices: false,
      practices: [],
      gettingPrivatePractices: false,
      privatePractices: [],

      links: [
        {
          title: 'Dashboard',
          url: '/dashboard'
        },
        {
          title: 'Expenses Reports',
          url: '/dashboard/expenses'
        },
        {
          title: 'Create'
        }
      ]
    }
  },

  computed: {
    privatePracticesSelectionList () {
      return this.privatePractices.map(privatePractice => ({
        label: privatePractice.name,
        value: privatePractice.id,
      }))
    },

    practicesSelectionList () {
      return this.practices.map(practice => ({
        label: practice.name,
        value: practice.id,
      }))
    },
  },

   mounted () {
    this.gettingPrivatePractices = true
    this.$axios.get('/api/v1/locum/private-practices?limit=999').then((response) => {
      this.privatePractices = response.data.data.private_practices
    }).catch((err) => {
      console.log('err', err.response || err)
    }).finally(() => {
      this.gettingPrivatePractices = false
    })

    this.gettingPrivatePractices = true
    this.$axios.get('/api/v1/locum/practices?limit=999&locum_practice_type=Completed').then((response) => {
      this.practices = response.data.data.practices
    }).catch((err) => {
      console.log('err', err.response || err)
    }).finally(() => {
      this.gettingPrivatePractices = false
    })
  },

  watch: {
    'form.type' () {
      this.formError = this.formError.filter(formError => formError.field !== 'type')

      if (!this.form.type) {
        this.formError.push({
          field: 'type',
          message: 'Type is required.',
          validation: 'required',
        })
      }
    },

    'form.practice_id' () {
      this.formError = this.formError.filter(formError => formError.field !== 'practice_id')

      if (!this.form.practice_id && this.form.type === 'Platform') {
        this.formError.push({
          field: 'practice_id',
          message: 'Practice is required.',
          validation: 'required',
        })
      }
    },

    'form.private_practice_id' () {
      this.formError = this.formError.filter(formError => formError.field !== 'private_practice_id')

      if (!this.form.private_practice_id && this.form.type === 'Private') {
        this.formError.push({
          field: 'private_practice_id',
          message: 'Private Practice is required.',
          validation: 'required',
        })
      }
    },

    'form.description' () {
      this.formError = this.formError.filter(formError => formError.field !== 'description')

      if (!this.form.description) {
        this.formError.push({
          field: 'description',
          message: 'Description is required.',
          validation: 'required',
        })
      }
    },

    'form.total' () {
      this.formError = this.formError.filter(formError => formError.field !== 'total')

      if (!this.form.total) {
        this.formError.push({
          field: 'total',
          message: 'Total is required.',
          validation: 'required',
        })
      }
    },

    'form.date' () {
      this.formError = this.formError.filter(formError => formError.field !== 'date')

      if (!this.form.date) {
        this.formError.push({
          field: 'date',
          message: 'Date is required.',
          validation: 'required',
        })
      }
    },
  },

  methods: {
      async save () {
      this.formError = []

      if (this.form.description && this.form.description.length > 255) {
        this.formError.push({field: 'description', message: 'Description is too long.',})
      }

      const notRequired = []

      if (this.form.type === 'Platform') {
        notRequired.push('private_practice_id')
      }

      if (this.form.type === 'Private') {
        notRequired.push('practice_id')
      }

      if (!this.form.type) {
        notRequired.push('private_practice_id')
        notRequired.push('practice_id')
      }

      this.Validate(this.form, notRequired)

      const formData = {
        ...this.form,
        date: this.$moment(this.form.date).format("YYYY-MM-DD"),
      }

      if (!this.formError.length) {
        try {
          this.loading = true

          let response = await this.$axios.$post(`/api/v1/locum/locum-expenses`, formData)

          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`${response.message}`,],
          })

          this.$router.push('/dashboard/expenses')
          this.loading = false
        } catch (err) {
          console.log('err', err.response || err)

          let message = null

          if (err.response) {
            if (err.response.status === 400 && err.response.data.error_messages) {
              this.formError = err.response.data.error_messages
            }

            message = err.response.data.message
          } else if (err.request) {
            message = 'Something went wrong!'
          } else {
            message = err.message
          }

          if (message) {
            this.$store.commit('SET_NOTIFICATION', {
              enabled: true,
              status: 'danger',
              text: [`${message}`,],
            })
          }

          this.loading = false
        }
      }
    },

  },
}
</script>

<style scoped>
  .expense-modal {
    position: fixed;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    border-left: solid 4px #ccc;
    transition: all 0.3s ease-in-out;
    background-color: white;
    scroll-behavior: smooth;
    z-index: 601;
  }

  @media (min-width: 1200px) {
    .expense-modal {
      width: 80%;
      /* height: 80%; */
    }
  }

  .statistics-card {
    min-height: 130px;
    /* display: flex;
  align-items: center; */
  }

  .modal-container {
    z-index: 510;
  }

  @media screen and (min-width: 1200px) {
    .modal-container {
      width: 70%;
    }
  }
</style>
