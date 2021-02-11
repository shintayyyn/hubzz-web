<template>
  <div class="">
    <AppBreadcrumbs :links="links" />
    <div class="px-2">
      <!-- <div>
        <svgicon name="left-arrow" height="32" width="32" class="cursor-pointer" @click="$router.push('/dashboard')" />
      </div> -->

      <div class="flex flex-row flex-wrap justify-between items-center">
        <div class="font-bold text-lg mt-4">
          EXPENSES REPORTS
        </div>

        <AppButton :label="'Add expense report'" :inStyle="'padding:5px 14px;'" class="mb-4" @click="$router.push('/dashboard/expenses/create')" />
      </div>

      <div class="flex flex-row flex-wrap justify-start items-center">
        <AppDate v-model="date_start" :name="'date_start'" :label="'From'" :inStyle="'margin-bottom:0px'" />

        <div class="mx-2" />

        <AppDate v-model="date_end" :name="'date_end'" :label="'To'" :inStyle="'margin-bottom:0px'" />
      </div>

      <AppButton
        :label="'Show expense reports'"
        :inStyle="'padding:5px 14px;'"
        class="mb-4"
        @click="getExpenseReportsPromiseAll"
      />

      <transition name="slide" mode="out-in">
        <div v-if="modal" class="modal-container shadow-lg p-4 md:p-8">
          <div>
            <svgicon
              name="left-arrow"
              height="32"
              width="32"
              class="cursor-pointer"
              @click="modal = false"
            />
          </div>

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
      </transition>

      <transition name="fade" mode="out-in">
        <div v-if="modal" class="shield" @click="modal = false" />
      </transition>

      <AppConfirmationModal
        :label="'Proceed to delete this expense report?'"
        :confirmLabel="'Delete'"
        :cancelLabel="'Cancel'"
        :modal="delete_modal"
        @confirm="remove"
        @cancel="delete_modal = false"
      />

      <AppLoading :loading="initialLoading" spinner />

      <template v-if="!initialLoading">
        <div class="flex flex-row flex-wrap justify-start">
          <div class="w-full lg:w-1/3">
            <div
              class="h-full relative mx-1 my-1 statistics-card rounded-lg shadow-md px-4 md:px-8 py-4 bg-white hover:bg-gray-300"
            >
              <transition name="fade" mode="out-in">
                <AppLoading :loading="initialLoading" spinner />
              </transition>

              <div class="flex justify-start text-md sm:text-md">
                Filtered Date
              </div>

              <div v-if="!initialLoading" class="flex justify-end font-bold text-3xl md:text-5xl break-all">
                £ {{ filterDateTotal.toFixed(2) | currency }}
              </div>
            </div>
          </div>

          <div class="w-full lg:w-1/3">
            <div
              class="h-full relative mx-1 my-1 statistics-card rounded-lg shadow-md px-4 md:px-8 py-4 bg-white hover:bg-gray-300 cursor-pointer"
              @click="filterExpenseReport('week')"
            >
              <transition name="fade" mode="out-in">
                <AppLoading :loading="initialLoading" spinner />
              </transition>

              <div class="flex justify-start text-md sm:text-md">
                This Week
              </div>

              <div v-if="!initialLoading" class="flex justify-end font-bold text-3xl md:text-5xl break-all">
                £ {{ weekTotal.toFixed(2) | currency }}
              </div>
            </div>
          </div>

          <div class="w-full lg:w-1/3">
            <div
              class="h-full relative mx-1 my-1 statistics-card rounded-lg shadow-md px-4 md:px-8 py-4 bg-white hover:bg-gray-300 cursor-pointer"
              @click="filterExpenseReport('month')"
            >
              <transition name="fade" mode="out-in">
                <AppLoading :loading="initialLoading" spinner />
              </transition>

              <div class="flex justify-start text-md sm:text-md">
                This Month
              </div>

              <div v-if="!initialLoading" class="flex justify-end font-bold text-3xl md:text-5xl break-all">
                £ {{ monthTotal.toFixed(2) | currency }}
              </div>
            </div>
          </div>
        </div>

        <AppTable
          v-if="expenseReports.length > 0"
          :total="total"
          :items="expenseReports"
          :currentPage="current_page"
          :perPage="limit"
          :columns="columns"
          :orderBy="order_by"
          :loading="loading"
          :customWidth="480"
          @pagechanged="pagechanged"
          @limitchanged="limitchanged"
          @sorted="sorted"
        >
          <template v-slot:actions="slotProps">
            <div class="flex flex-col bg-white border rounded border-gray-500">
              <div
                class="rounded text-xs px-2  hover:bg-orange-300 cursor-pointer"
                @click="$router.push(`/dashboard/expenses/${slotProps.item.id}`)"
              >
                <!-- @click="editExpenseReports(slotProps.item.id)" -->
                Edit
              </div>

              <div
                class="rounded text-xs px-2  hover:bg-orange-300 cursor-pointer"
                @click="removeExpenseReports(slotProps.item.id)"
              >
                Delete
              </div>
            </div>
          </template>

          <template v-slot:date="slotProps">
            {{ $moment(slotProps.item.date).format("DD/MM/YYYY") }}
          </template>

          <template v-slot:total="slotProps">
            £ {{ slotProps.item.total.toFixed(2) | currency }}
          </template>
        </AppTable>

        <div v-if="!expenseReports.length && !loading" class="flex justify-center py-4">
          You haven't added any Expense
          Reports on this date.
        </div>

        <div v-if="expenseReports.length > 0" class="flex justify-end mt-4">
          <AppButton
            :label="exporting ? 'Exporting as PDF...' : 'Export as PDF'"
            :inStyle="'padding: 5px 14px;'"
            :disabled="exporting" @click="exportExpenseReportAsPdf"
          />
        </div>
      </template>
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
          title: 'Expenses Reports'
        }
      ]
    }
  },

  computed: {
    columns () {
      let columns = []
      columns.push(
        {
          name: "Type",
          dataIndex: "type",
          class: "text-left",
        },
        {
          name: "Practice Name",
          dataIndex: "locum_expense_practice_name",
          class: "text-left",
        },
        {
          name: "Date",
          dataIndex: "date",
          slotName: "date",
          class: "",
        },
        {
          name: "Description",
          dataIndex: "description",
          class: "text-left",
        },
        {
          name: "Total",
          dataIndex: "total",
          slotName: "total",
          class: "text-center",
        },
        {
          name: "Actions",
          dataIndex: "actions",
          class: "dropdown",
          initialDropdown: 'Edit',
          width: 110
        }
      )

      return columns
    },

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

  mounted () {
    this.date_start = this.$moment().format("YYYY-MM-DD")
    this.date_end = this.$moment().format("YYYY-MM-DD")

    this.initialLoading = true
    Promise.all([
      this.getExpenseReportsTotal(),
      this.getExpenseReportsPromiseAll(),
    ]).finally(() => {
      this.initialLoading = false
    })

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

  methods: {
    getExpenseTotal (data) {
      const {
        dateStart,
        dateEnd,
      } = data

      return this.$axios.$get(`/api/v1/locum/locum-expenses`, {
        params: {
          date_start: dateStart,
          date_end: dateEnd,
          total: true,
        },
      }).then((response) => {
        return response.data && response.data.locum_expenses
          ? response.data.locum_expenses
          : 0
      })
    },

    getExpenseReportsTotal () {
      let week_date_start = this.$moment()
        .day('Monday')
        .format('YYYY-MM-DD')

      let week_date_end = this.$moment()
        .day('Monday')
        .add(6, 'days')
        .format('YYYY-MM-DD')

      let month = this.$moment().month()

      let year = this.$moment().year()

      let month_date_start = this.getDaysInMonth(month, year)[0].fullDate

      let month_date_end = this.getDaysInMonth(month, year)[
        this.getDaysInMonth(month, year).length - 1
      ].fullDate

      return Promise.all([
        this.getExpenseTotal({
          dateStart: this.date_start,
          dateEnd: this.date_end,
        }).then((expenseTotal) => {
          this.filterDateTotal = expenseTotal
        }),

        this.getExpenseTotal({
          dateStart: this.$moment(week_date_start).format("YYYY-MM-DD"),
          dateEnd: this.$moment(week_date_end).format("YYYY-MM-DD"),
        }).then((expenseTotal) => {
          this.weekTotal = expenseTotal
        }),

        this.getExpenseTotal({
          dateStart: this.$moment(month_date_start).format("YYYY-MM-DD"),
          dateEnd: this.$moment(month_date_end).format("YYYY-MM-DD"),
        }).then((expenseTotal) => {
          this.monthTotal = expenseTotal
        }),
      ])
    },

    async getExpenseReportsPromiseAll () {
      try {
        return Promise.all([
          this.getExpenseTotal({
            dateStart: this.date_start,
            dateEnd: this.date_end,
          }).then((expenseTotal) => {
            this.filterDateTotal = expenseTotal
          }),

          this.pagechanged(1),
        ])
      } catch (err) {
        this.initialLoading = false
        throw err
      }
    },

    async filterExpenseReport (type) {
      let date_start
      let date_end
      if (type === "week") {
        date_start = this.$moment()
          .day("Monday")
          .format("YYYY-MM-DD")
        date_end = this.$moment()
          .day("Monday")
          .add(6, "days")
          .format("YYYY-MM-DD")
      } else if (type === "month") {
        let month = this.$moment().month()
        let year = this.$moment().year()
        date_start = this.getDaysInMonth(month, year)[0].fullDate
        date_end = this.getDaysInMonth(month, year)[
          this.getDaysInMonth(month, year).length - 1
        ].fullDate
      }
      this.loading = true
      this.date_start = date_start
      this.date_end = date_end
      await this.getExpenseReportsPromiseAll()
      this.loading = false
    },

    async getExpenseReports () {
      try {
        return Promise.all([
          this.$axios.$get("/api/v1/locum/locum-expenses/count", {
            params: {
              date_start: this.date_start,
              date_end: this.date_end,
            },
          }),
          this.$axios.$get("/api/v1/locum/locum-expenses", {
            params: {
              date_start: this.date_start,
              date_end: this.date_end,
              order_by: this.order_by,
              limit: this.limit,
              offset: (this.current_page - 1) * this.limit,
            },
          }),
        ]).then(([responseCount, responseExpenseReports,]) => {
          this.total = responseCount.data.count
          this.expenseReports
            = responseExpenseReports.data
              && responseExpenseReports.data.locum_expenses
              ? responseExpenseReports.data.locum_expenses
              : []
        })
      } catch (err) {
        this.loading = false
        throw err
      }
    },

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

          let response

          if (this.selectedExpenseReportId) {
            response = await this.$axios.$put(`/api/v1/locum/locum-expenses/${this.selectedExpenseReportId}`, formData)
          } else if (!this.selectedExpenseReportId) {
            response = await this.$axios.$post(`/api/v1/locum/locum-expenses`, formData)
          }

          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`${response.message}`,],
          })

          this.selectedExpenseReportId = null

          this.form.description = ""

          this.form.total = '0'

          this.form.date = null

          this.modal = false

          await this.getExpenseReportsTotal()

          await this.getExpenseReports()

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

    async remove () {
      this.loading = true
      await this.$axios.$delete(
        `/api/v1/locum/locum-expenses/${this.selectedExpenseReportId}`
      )
      await this.getExpenseReportsTotal()
      await this.getExpenseReports()
      this.selectedExpenseReportId = null
      this.delete_modal = false
      this.loading = false
    },

    async editExpenseReports (id) {
      let foundExpenseReport = this.expenseReports.find(item => item.id === id)

      if (foundExpenseReport) {
        this.selectedExpenseReportId = id
        this.form.type = foundExpenseReport.type
        this.form.practice_id = foundExpenseReport.practice_id
        this.form.private_practice_id = foundExpenseReport.private_practice_id
        this.form.description = foundExpenseReport.description
        this.form.total = foundExpenseReport.total ? foundExpenseReport.total.toString() : '0'
        this.form.date = foundExpenseReport.date
        this.formError = []
        this.modal = true
      }
    },

    async removeExpenseReports (id) {
      this.selectedExpenseReportId = id
      this.delete_modal = true
    },

    addExpenseReports () {
      this.selectedExpenseReportId = null
      this.form.type = null
      this.form.practice_id = ""
      this.form.private_practice_id = ""
      this.form.description = ""
      this.form.total = '0'
      this.form.date = null
      this.formError = []
      this.modal = true
    },

    closeModal () {
      this.form.description = ""
      this.form.total = '0'
      this.form.date = null
      this.modal = false
    },

    getDaysInMonth (month, selectedYear) {
      let date = new Date(selectedYear, month, 1)
      let days = []
      while (date.getMonth() === month) {
        days.push(new Date(date))
        date.setDate(date.getDate() + 1)
      }
      let daysInMonth = []

      days.forEach(day => {
        let fullDate = this.$moment(day, "ddd MMM DD YYYY HH:mm:ss zzZ").format(
          "YYYY-MM-DD"
        )
        if (this.$moment().format("YYYY-MM-DD") >= fullDate) {
          daysInMonth.push({
            fullDate,
          })
        }
      })
      return daysInMonth
    },

    async sorted (order_by) {
      let orderBy = order_by.map(item => {
        let order = item.split(":")[1]
        let sorting = item.split(":")[0]
        switch (sorting) {
        case "date_time_start":
          sorting = "date_start"
          break
        case "date_time_end":
          sorting = "date_end"
          break
        case "rate_name":
          sorting = "rate"
          break
        default:
          sorting
        }
        return `${sorting}:${order}`
      })
      this.current_page = 1
      this.offset = 0
      this.order_by = orderBy
      this.loading = true
      await this.getExpenseReports()
      this.loading = false
    },

    async pagechanged (page) {
      this.current_page = page
      this.offset = this.limit * (page - 1)
      this.loading = true
      await this.getExpenseReports()
      this.loading = false
    },

    async limitchanged (limit) {
      this.current_page = 1
      this.offset = 0
      this.limit = limit
      this.loading = true
      await this.getExpenseReports()
      this.loading = false
    },

    exportExpenseReportAsPdf () {
      const dateStart = this.date_start
      const dateEnd = this.date_end
      const formattedDateStart = this.$moment(dateStart, 'YYYY-MM-DD').format('DD/MM/YYYY')
      const formattedDateEnd = this.$moment(dateEnd, 'YYYY_MM_DD').format('DD_MM_YYYY')
      const filename = `expenses_${formattedDateStart}_${formattedDateEnd}.pdf`

      this.exporting = true
      this.$axios.get("/api/v1/locum/locum-expenses/pdf", {
        params: {
          date_start: dateStart,
          date_end: dateEnd,
        },
        responseType: 'blob',
      }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data,]))
        const link = document.createElement('a')
        link.setAttribute('href', url)
        link.setAttribute('download', filename)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        // const fileReader = new window.FileReader()
        // fileReader.onload = function () {
        //   const url = fileReader.result
        //   const link = document.createElement('a')
        //   link.setAttribute('href', url)
        //   link.setAttribute('download', filename)
        //   document.body.appendChild(link)
        //   link.click()
        //   document.body.removeChild(link)
        // }
        // fileReader.readAsDataURL(response.data)
      }).catch((err) => {
        console.log('err', err)

        if (err.response && err.response.data && err.response.data.text) {
          err.response.data.text().then((data) => {
            const json = JSON.parse(data)

            this.$store.commit('SET_NOTIFICATION', {
              enabled: true,
              status: 'danger',
              text: [json.message,],
            })
          })

          return
        }

        this.$store.commit('SET_NOTIFICATION', {
          enabled: true,
          status: 'danger',
          text: ['Something went wrong!',],
        })
      }).finally(() => {
        this.exporting = false
      })
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
