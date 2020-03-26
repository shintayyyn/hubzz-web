<template>
  <div class="p-4 md:p-8">
    <div>
      <svgicon name="left-arrow" height="32" width="32" class="cursor-pointer" @click="$emit('close')" />
    </div>

    <div class="flex flex-row flex-wrap justify-between items-center">
      <div class="font-bold text-lg mt-4">
        EXPENSES REPORTS
      </div>
      <AppButton :label="'Add expense report'" :inStyle="'padding:5px 14px;'" class="mb-4" @click="addExpenseReports" />
    </div>

    <div class="flex flex-row flex-wrap justify-start items-center">
      <AppDate v-model="date_start" :name="'date_start'" :label="'From'" :inStyle="'margin-bottom:0px'" />
      <div class="mx-2" />
      <AppDate v-model="date_end" :name="'date_end'" :label="'To'" :inStyle="'margin-bottom:0px'" />
    </div>

    <AppButton :label="'Show expense reports'" :inStyle="'padding:5px 14px;'" class="mb-4"
               @click="getExpenseReportsPromiseAll"
    />

    <transition name="slide" mode="out-in">
      <div v-if="modal" class="modal-container shadow-lg p-4 md:p-8">
        <div>
          <svgicon name="left-arrow" height="32" width="32" class="cursor-pointer" @click="modal = false" />
        </div>
        <div class="flex flex-col mb-4 relative">
          <AppInput v-model="form.description" :type="'textarea'" :name="'description'" :label="'Description'"
                    :error="formError.find(item => item.field === 'description')"
                    @input="CheckEmptyField(form.description, 'description')"
          />
          <AppInput v-model="form.total" :type="'number'" :name="'total'" :label="'Total'"
                    :error="formError.find(item => item.field === 'total')" :inStyle="'text-align:right'"
                    @input="CheckEmptyField(form.total, 'total')"
          />
          <AppDate v-model="form.date" :name="'date'" :label="'Date'"
                   :error="formError.find(item => item.field === 'date')" @input="CheckEmptyField(form.date, 'date')"
          />
          <AppLoading :loading="loading" spinner />
        </div>
        <AppButton :label="'Save report'" :inStyle="'padding:5px 14px;'" :disabled="loading" @click="save" />
      </div>
    </transition>

    <transition name="fade" mode="out-in">
      <div v-if="modal" class="shield" @click="modal = false" />
    </transition>

    <AppConfirmationModal :label="'Proceed to add delete this expense report?'" :confirmLabel="'Delete'"
                          :cancelLabel="'Cancel'" :modal="delete_modal" @confirm="remove" @cancel="delete_modal = false"
    />

    <AppLoading :loading="initialLoading" spinner />

    <template v-if="!initialLoading">
      <div class="flex flex-row flex-wrap justify-start">
        <div class="w-full lg:w-1/3 xl:max-w-sm">
          <div
            class="relative mx-1 my-1 statistics-card rounded-lg shadow-md px-4 md:px-8 py-4 bg-white hover:bg-gray-300"
          >
            <transition name="fade" mode="out-in">
              <AppLoading :loading="initialLoading" spinner />
            </transition>
            <div class="flex justify-start text-md sm:text-md">
              Filtered Date
            </div>
            <div v-if="!initialLoading" class="flex justify-end font-bold text-5xl">
              {{ filter_date_total }}
            </div>
          </div>
        </div>
        <div class="w-full lg:w-1/3 xl:max-w-sm">
          <div
            class="relative mx-1 my-1 statistics-card rounded-lg shadow-md px-4 md:px-8 py-4 bg-white hover:bg-gray-300 cursor-pointer"
            @click="filterExpenseReport('week')"
          >
            <transition name="fade" mode="out-in">
              <AppLoading :loading="initialLoading" spinner />
            </transition>
            <div class="flex justify-start text-md sm:text-md">
              This Week
            </div>
            <div v-if="!initialLoading" class="flex justify-end font-bold text-5xl">
              {{ week_total }}
            </div>
          </div>
        </div>
        <div class="w-full lg:w-1/3 xl:max-w-sm">
          <div
            class="relative mx-1 my-1 statistics-card rounded-lg shadow-md px-4 md:px-8 py-4 bg-white hover:bg-gray-300 cursor-pointer"
            @click="filterExpenseReport('month')"
          >
            <transition name="fade" mode="out-in">
              <AppLoading :loading="initialLoading" spinner />
            </transition>
            <div class="flex justify-start text-md sm:text-md">
              This Month
            </div>
            <div v-if="!initialLoading" class="flex justify-end font-bold text-5xl">
              {{ month_total }}
            </div>
          </div>
        </div>
      </div>

      <AppTable v-if="expense_reports.length > 0" :total="total" :items="expense_reports" :currentPage="current_page"
                :perPage="limit" :columns="columns" :orderBy="order_by" :loading="loading" :customWidth="480"
                @pagechanged="pagechanged" @limitchanged="limitchanged" @sorted="sorted"
      >
        <template v-slot:actions="slotProps">
          <div class="flex flex-wrap justify-center">
            <div
              class="mx-1 p-2 bg-yellow-500 hover:bg-yellow-400 font-bold rounded-lg focus:outline-none cursor-pointer"
              @click="editExpenseReports(slotProps.item.id)"
            >
              Edit
            </div>
            <div
              class="mx-1 p-2 bg-red-500 hover:bg-red-400 text-white font-bold rounded-lg focus:outline-none cursor-pointer"
              @click="removeExpenseReports(slotProps.item.id)"
            >
              Delete
            </div>
          </div>
        </template>
      </AppTable>

      <div v-if="!expense_reports.length && !loading" class="flex justify-center py-4">
        <span>You haven't added any Expense Reports on this date.</span>
      </div>

      <div v-if="expense_reports.length > 0" class="flex justify-end">
        <AppButton :label="exporting ? 'Exporting as PDF...' : 'Export as PDF'" :inStyle="'padding: 5px 14px;'"
                   :disabled="exporting" @click="exportExpenseReportAsPdf"
        />
      </div>
    </template>
  </div>
</template>

<script>
  import AppConfirmationModal from "@/components/Base/AppConfirmationModal"
  import AppLoading from "@/components/Base/AppLoading"
  import AppInput from "@/components/Base/AppInput"
  import AppDate from "@/components/Base/AppDate"
  import AppButton from "@/components/Base/AppButton"
  import AppTable from "@/components/Base/AppTable"

  export default {
    components: {
      AppConfirmationModal,
      AppLoading,
      AppInput,
      AppDate,
      AppTable,
      AppButton
    },

    data () {
      return {
        selectedExpenseReportId: null,
        initialLoading: false,
        loading: false,
        expense_reports: [],
        total: 0,

        modal: false,
        delete_modal: false,
        form: {
          description: "",
          total: 0,
          date: null
        },
        formError: [],

        current_page: 1,
        offset: 0,
        limit: 10,
        order_by: ["date:asc"],

        date_start: null,
        date_end: null,
        filter_date_total: 0,
        week_total: 0,
        month_total: 0,

        exporting: false,
      }
    },

    computed: {
      columns () {
        let columns = []
        columns.push(
          {
            name: "Description",
            dataIndex: "description",
            class: "text-left"
          },
          {
            name: "Date",
            dataIndex: "date",
            class: "text-center localDate"
          },
          {
            name: "Total",
            dataIndex: "total",
            class: "text-center"
          },
          {
            name: "Actions",
            dataIndex: "actions",
            class: "text-center"
          }
        )
        return columns
      },

      totalAmount () {
        return this.expense_reports && this.expense_reports.length > 0
          ? this.expense_reports
            .map(item => item.total)
            .reduce((acc, currentVal) => acc + currentVal)
          : 0
      }
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
            total: true
          }
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
            this.filter_date_total = expenseTotal
          }),

          this.getExpenseTotal({
            dateStart: this.$moment(week_date_start).format("YYYY-MM-DD"),
            dateEnd: this.$moment(week_date_end).format("YYYY-MM-DD"),
          }).then((expenseTotal) => {
            this.week_total = expenseTotal
          }),

          this.getExpenseTotal({
            dateStart: this.$moment(month_date_start).format("YYYY-MM-DD"),
            dateEnd: this.$moment(month_date_end).format("YYYY-MM-DD"),
          }).then((expenseTotal) => {
            this.month_total = expenseTotal
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
              this.filter_date_total = expenseTotal
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
              }
            }),
            this.$axios.$get("/api/v1/locum/locum-expenses", {
              params: {
                date_start: this.date_start,
                date_end: this.date_end,
                order_by: this.order_by,
                limit: this.limit,
                offset: (this.current_page - 1) * this.limit,
              }
            })
          ]).then(([responseCount, responseExpenseReports]) => {
            this.total = responseCount.data.count
            this.expense_reports =
              responseExpenseReports.data &&
                responseExpenseReports.data.locum_expenses
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
        this.Validate(this.form)
        this.form.date = this.$moment(this.form.date).format("YYYY-MM-DD")
        if (!this.formError.length) {
          try {
            this.loading = true
            let response
            if (this.selectedExpenseReportId) {
              response = await this.$axios.$put(
                `/api/v1/locum/locum-expenses/${this.selectedExpenseReportId}`,
                this.form
              )
            } else if (!this.selectedExpenseReportId) {
              response = await this.$axios.$post(
                `/api/v1/locum/locum-expenses`,
                this.form
              )
            }
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: [`${response.message}`]
            })
            this.selectedExpenseReportId = null
            this.form.description = ""
            this.form.total = 0
            this.form.date = null
            this.modal = false
            await this.getExpenseReportsTotal()
            await this.getExpenseReports()
            this.loading = false
          } catch (e) {
            throw e
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
        let foundExpenseReport = this.expense_reports.find(
          item => item.id === id
        )
        if (foundExpenseReport) {
          this.selectedExpenseReportId = id
          this.form.description = foundExpenseReport.description
          this.form.total = foundExpenseReport.total
          this.form.date = foundExpenseReport.date
          this.modal = true
        }
      },

      async removeExpenseReports (id) {
        this.selectedExpenseReportId = id
        this.delete_modal = true
      },

      addExpenseReports () {
        this.selectedExpenseReportId = null
        this.form.description = ""
        this.form.total = 0
        this.form.date = null
        this.modal = true
      },

      closeModal () {
        this.form.description = ""
        this.form.total = 0
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
              fullDate
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
          const url = window.URL.createObjectURL(new Blob([response.data]))

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
        }).finally(() => {
          this.exporting = false
        })
      },
    },
  }
</script>

<style scoped>
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