<template>
  <div class="p-4 md:p-8">
    <div>
      <svgicon
        name="left-arrow"
        height="32"
        width="32"
        @click="$emit('close')"
        class="cursor-pointer"
      />
    </div>
    <div class="font-bold text-lg mt-4">EXPENSES REPORTS</div>
    <div class="flex flex-row flex-wrap justify-between items-center">
      <AppButton
        :label="'Add expense report'"
        @click="addModal"
        :inStyle="'padding:5px 14px;'"
        class="mb-4"
      />
      <div class="mr-20">
        <!-- <AppButton
          :label="'Go back to Current date'"
          @click="date = $moment().format('YYYY-MM-DD')"
          :inStyle="'padding:0px 5px;font-size:1em'"
          class="mb-4"
        />-->
        <AppDate
          v-model="date"
          :name="'date'"
          :label="'Date'"
          :inStyle="'margin-bottom:0px'"
          isBefore
        />
      </div>
    </div>
    <transition name="slide" mode="out-in">
      <div v-if="modal" class="modal-container shadow-lg p-4 md:p-8">
        <div>
          <svgicon
            name="left-arrow"
            height="32"
            width="32"
            @click="closeModal"
            class="cursor-pointer"
          />
        </div>
        <div class="flex flex-col mb-4 relative">
          <AppInput
            v-model="form.description"
            :type="'textarea'"
            :name="'description'"
            :label="'Description'"
            :error="formError.find(item => item.field === 'description')"
            @input="CheckEmptyField(form.description, 'description')"
          />
          <AppInput
            v-model="form.total"
            :type="'number'"
            :name="'total'"
            :label="'Total'"
            :error="formError.find(item => item.field === 'total')"
            @input="CheckEmptyField(form.total, 'total')"
            :inStyle="'text-align:right'"
          />
          <AppDate
            v-model="form.date"
            :name="'date'"
            :label="'Date'"
            :error="formError.find(item => item.field === 'date')"
            @input="CheckEmptyField(form.date, 'date')"
          />
          <AppButton
            :label="'Save report'"
            @click="save"
            :inStyle="'padding:5px 14px;'"
            :disabled="loading"
          />
          <AppLoading :loading="loading" spinner />
        </div>
      </div>
    </transition>
    <transition name="fade" mode="out-in">
      <div class="shield" v-if="modal" @click="closeModal"></div>
    </transition>
    <AppLoading :loading="initialLoading" spinner />
    <template v-if="!initialLoading">
      <div class="flex flex-row flex-wrap justify-start">
        <div class="w-full lg:w-1/3 xl:max-w-sm">
          <div
            class="relative mx-1 my-1 statistics-card rounded-lg shadow-md px-4 md:px-8 py-4 bg-white hover:bg-gray-300"
            @click="filterExpenseReports('week')"
          >
            <transition name="fade" mode="out-in">
              <AppLoading :loading="initialLoading" spinner />
            </transition>
            <div class="flex justify-start text-md sm:text-md">This Week</div>
            <div class="flex justify-end font-bold text-5xl" v-if="!initialLoading">{{week_total}}</div>
          </div>
        </div>
        <div class="w-full lg:w-1/3 xl:max-w-sm">
          <div
            class="relative mx-1 my-1 statistics-card rounded-lg shadow-md px-4 md:px-8 py-4 bg-white hover:bg-gray-300"
            @click="filterExpenseReports('month')"
          >
            <transition name="fade" mode="out-in">
              <AppLoading :loading="initialLoading" spinner />
            </transition>
            <div class="flex justify-start text-md sm:text-md">This Month</div>
            <div class="flex justify-end font-bold text-5xl" v-if="!initialLoading">{{month_total}}</div>
          </div>
        </div>
      </div>
      <AppTable
        v-if="expense_reports.length > 0"
        :total="total"
        :items="expense_reports"
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
          <div class="flex flex-wrap justify-center">
            <div
              @click="editExpenseReports(slotProps.item.id)"
              class="mx-1 p-2 bg-yellow-500 hover:bg-yellow-400 font-bold rounded-lg focus:outline-none cursor-pointer"
            >Edit</div>
          </div>
        </template>
      </AppTable>
      <div
        v-if="!expense_reports.length && !loading"
        class="flex justify-center py-4"
      >You haven't added any Expense Reports on this date.</div>
    </template>
  </div>
</template>
<script>
import AppLoading from "@/components/Base/AppLoading";
import AppInput from "@/components/Base/AppInput";
import AppDate from "@/components/Base/AppDate";
import AppButton from "@/components/Base/AppButton";
import AppTable from "@/components/Base/AppTable";
export default {
  components: {
    AppLoading,
    AppInput,
    AppDate,
    AppTable,
    AppButton
  },
  data() {
    return {
      initialLoading: false,
      loading: false,
      expense_reports: [],
      total: 0,

      modal: false,
      form: {
        description: "",
        total: 0,
        date: null
      },
      formError: [],

      current_page: 1,
      offset: 0,
      limit: 20,
      order_by: ["date:asc"],

      date: null,
      week_total: 0,
      month_total: 0,
      filter_date_total: 0
    };
  },
  computed: {
    columns() {
      let columns = [];
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
      );
      return columns;
    },
    totalAmount() {
      return this.expense_reports && this.expense_reports.length > 0
        ? this.expense_reports
            .map(item => item.total)
            .reduce((acc, currentVal) => acc + currentVal)
        : 0;
    }
  },
  watch: {
    async date(newValue, oldValue) {
      this.form.date = newValue;
      if (newValue && oldValue) {
        this.date = newValue;
        this.initialLoading = true;
        await this.getExpenseReportsWeekTotal();
        await this.getExpenseReportsMonthTotal();
        await this.filterExpenseReports("current");
        // await this.getExpenseReportsPromiseAll();
        this.initialLoading = false;
      }
    }
  },
  async mounted() {
    this.date = this.$moment().format("YYYY-MM-DD");
    this.initialLoading = true;
    await this.getExpenseReportsWeekTotal();
    await this.getExpenseReportsMonthTotal();
    await this.getExpenseReportsPromiseAll();
    this.initialLoading = false;
  },
  methods: {
    getExpenseReportsWeekTotal() {
      let date_start = this.$moment(this.date, "YYYY-MM-DD")
        .day("Monday")
        .format("YYYY-MM-DD");
      let date_end = this.$moment(date_start, "YYYY-MM-DD")
        .add(6, "days")
        .format("YYYY-MM-DD");
      this.getExpenseReportsTotal(date_start, date_end, "week");
    },
    getExpenseReportsMonthTotal() {
      let month = this.$moment(this.date).month();
      let year = this.$moment(this.date).year();
      let date_start = this.getDaysInMonth(month, year)[0].fullDate;
      let date_end = this.getDaysInMonth(month, year)[
        this.getDaysInMonth(month, year).length - 1
      ].fullDate;
      this.getExpenseReportsTotal(date_start, date_end, "month");
    },
    async getExpenseReportsTotal(date_start, date_end, type) {
      try {
        let response = await this.$axios.$get("/api/v1/locum/locum-expenses", {
          params: {
            date_start: this.$moment(date_start).format("YYYY-MM-DD"),
            date_end: this.$moment(date_end).format("YYYY-MM-DD"),
            total: true
          }
        });

        let total =
          response.data && response.data.locum_expenses
            ? response.data.locum_expenses
            : 0;

        switch (type) {
          case "week":
            return (this.week_total = total);
            break;
          case "month":
            return (this.month_total = total);
            break;
          case "filter_date":
            return (this.filter_date_total = total);
            break;
        }
      } catch (err) {
        this.initialLoading = false;
        throw err;
      }
    },
    async getExpenseReportsPromiseAll() {
      try {
        return Promise.all([
          this.$axios.$get("/api/v1/locum/locum-expenses/count", {
            params: {
              date_start: this.date,
              date_end: this.date,
              order_by: this.order_by
            }
          }),
          this.$axios.$get("/api/v1/locum/locum-expenses", {
            params: {
              date_start: this.date,
              date_end: this.date,
              order_by: this.order_by,
              offset: this.offset,
              limit: this.limit
            }
          })
        ]).then(([responseCount, responseExpenseReports]) => {
          this.total = responseCount.data.count;
          this.expense_reports =
            responseExpenseReports.data &&
            responseExpenseReports.data.locum_expenses
              ? responseExpenseReports.data.locum_expenses
              : [];
        });
      } catch (err) {
        this.initialLoading = false;
        throw err;
      }
    },
    async filterExpenseReports(type) {
      let date_start;
      let date_end;
      if (type === "week") {
        date_start = this.$moment(this.date, "YYYY-MM-DD")
          .day("Monday")
          .format("YYYY-MM-DD");
        date_end = this.$moment(date_start, "YYYY-MM-DD")
          .add(6, "days")
          .format("YYYY-MM-DD");

        this.getExpenseReportsPromiseAll();
      } else if (type === "month") {
        let month = this.$moment(this.date).month();
        let year = this.$moment(this.date).year();
        date_start = this.getDaysInMonth(month, year)[0].fullDate;
        date_end = this.getDaysInMonth(month, year)[
          this.getDaysInMonth(month, year).length - 1
        ].fullDate;
      } else if (type === "current") {
        date_start = this.date;
        date_end = this.date;
      }

      try {
        return Promise.all([
          this.$axios.$get("/api/v1/locum/locum-expenses/count", {
            params: {
              date_start: date_start,
              date_end: date_end,
              order_by: this.order_by
            }
          }),
          this.$axios.$get("/api/v1/locum/locum-expenses", {
            params: {
              date_start: date_start,
              date_end: date_end,
              order_by: this.order_by,
              offset: this.offset,
              limit: this.limit
            }
          })
        ]).then(([responseCount, responseExpenseReports]) => {
          this.total = responseCount.data.count;
          this.expense_reports =
            responseExpenseReports.data &&
            responseExpenseReports.data.locum_expenses
              ? responseExpenseReports.data.locum_expenses
              : [];
        });
      } catch (err) {
        this.initialLoading = false;
        throw err;
      }
    },
    async save() {
      this.Validate(this.form);
      if (!this.formError.length) {
        try {
          this.loading = true;
          let response = await this.$axios.$post(
            `/api/v1/locum/locum-expenses`,
            this.form
          );
          this.loading = false;
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`${response.message}`]
          });
          this.closeModal();
          this.expense_reports.push(response.data.locum_expense);
          this.getExpenseReportsWeekTotal();
          this.getExpenseReportsMonthTotal();
        } catch (e) {
          throw e;
        }
      }
    },
    async editExpenseReports(id) {
      let foundExpenseReport = this.expense_reports.find(
        item => item.id === id
      );
      if (foundExpenseReport) {
        this.form.description = foundExpenseReport.description;
        this.form.total = foundExpenseReport.total;
        this.form.date = foundExpenseReport.date;
        this.modal = true;
      }
    },
    addModal() {
      this.form.date = this.date;
      this.modal = true;
    },
    closeModal() {
      this.form.description = "";
      this.form.total = 0;
      this.form.date = null;
      this.modal = false;
    },
    getDaysInMonth(month, selectedYear) {
      let date = new Date(selectedYear, month, 1);
      let days = [];
      while (date.getMonth() === month) {
        days.push(new Date(date));
        date.setDate(date.getDate() + 1);
      }
      let daysInMonth = [];

      days.forEach(day => {
        let fullDate = this.$moment(day, "ddd MMM DD YYYY HH:mm:ss zzZ").format(
          "YYYY-MM-DD"
        );
        if (this.$moment().format("YYYY-MM-DD") >= fullDate) {
          daysInMonth.push({
            fullDate
          });
        }
      });
      return daysInMonth;
    },
    async sorted(order_by) {
      let orderBy = order_by.map(item => {
        let order = item.split(":")[1];
        let sorting = item.split(":")[0];
        switch (sorting) {
          case "date_time_start":
            sorting = "date_start";
            break;
          case "date_time_end":
            sorting = "date_end";
            break;
          case "rate_name":
            sorting = "rate";
            break;
          default:
            sorting;
        }
        return `${sorting}:${order}`;
      });
      this.current_page = 1;
      this.offset = 0;
      this.order_by = orderBy;
      this.loading = true;
      await this.getJobs();
      this.loading = false;
    },
    async pagechanged(page) {
      this.current_page = page;
      this.offset = this.limit * (page - 1);
      this.loading = true;
      await this.getJobs();
      this.loading = false;
    },
    async limitchanged(limit) {
      this.current_page = 1;
      this.offset = 0;
      this.limit = limit;
      this.loading = true;
      await this.getJobs();
      this.loading = false;
    }
  }
};
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