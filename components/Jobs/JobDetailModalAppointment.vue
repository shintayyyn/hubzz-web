<template>
  <section>
    <AppConfirmationModal
      :label="'Delete this appointment?'"
      :confirmLabel="'Yes'"
      :cancelLabel="'Cancel'"
      :modal="delete_modal"
      @confirm="remove"
      @cancel="delete_modal = false"
    />
    <div class="flex flex-col items-start p-4 md:p-8 w-full">
      <nuxt-link
        :to="{ path: ['dashboard-create','dashboard-id'].includes($route.name)? '/dashboard' : '/jobs', query: {...$route.query}}"
        class="cursor-pointer"
      >
        <svgicon name="left-arrow" height="32" width="32" />
      </nuxt-link>
      <div class="flex flex-row justify-start font-bold mt-8">Appointment</div>
      <div class="relative bg-white rounded-lg shadow-lg px-4 md:px-8 py-4 mt-4 max-w-4xl">
        <AppLoading :loading="loading" spinner />
        <AppInput
          v-model="form.private_practice_id"
          :type="'select'"
          :name="'private_practice_id'"
          :label="'Practice'"
          :placeholder="'Select...'"
          :items="practices"
          :error="this.formError.find(item => item.field === 'private_practice_id')"
        />
        <div class="-mt-10 pt-4">
          <AppButton :label="'Add'" @click="surgery_modal = true" :inStyle="'padding:8px 16px;'" />
        </div>
        <div class="flex flex-row flex-wrap justify-start mt-8">
          <div class="px-1 w-full sm:w-1/2 md:w-1/4">
            <AppDate
              v-model="form.date_start"
              :name="'date_start'"
              :label="'From'"
              isAfter
              :error="this.formError.find(item => item.field === 'date_start')"
            />
          </div>
          <div class="px-1 w-full sm:w-1/2 md:w-1/4">
            <AppTime
              v-model="form.time_start"
              :name="'time_start'"
              :label="'Start time'"
              :error="this.formError.find(item => item.field === 'time_start')"
            />
          </div>
          <div class="px-1 w-full sm:w-1/2 md:w-1/4">
            <AppDate
              v-model="form.date_end"
              :name="'date_end'"
              :label="'To'"
              isAfter
              :error="this.formError.find(item => item.field === 'date_end')"
            />
          </div>
          <div class="px-1 w-full sm:w-1/2 md:w-1/4">
            <AppTime
              v-model="form.time_end"
              :name="'time_end'"
              :label="'End time'"
              :error="this.formError.find(item => item.field === 'time_end')"
            />
          </div>
        </div>
        <div class="w-full flex flex-row flex-wrap justify-start mt-4">
          <div class="px-1 w-full sm:w-1/2 md:w-1/3">
            <AppInput
              v-model="form.shift_id"
              :type="'select'"
              :name="'shift_id'"
              :label="'Shift'"
              :placeholder="'Select...'"
              :items="shifts"
              :error="this.formError.find(item => item.field === 'shift_id')"
            />
          </div>
          <div class="px-1 w-full sm:w-1/2 md:w-1/3">
            <AppInput
              v-model="form.rate"
              :type="'number'"
              :name="'rate'"
              :label="'Rate £'"
              :placeholder="''"
              :inStyle="'text-align:right'"
              :error="this.formError.find(item => item.field === 'rate')"
            />
          </div>
          <div class="px-1 w-full sm:w-1/2 md:w-1/3">
            <AppInput
              v-model="form.locum_detail_rate_type_id"
              :type="'select'"
              :name="'locum_detail_rate_type_id'"
              :label="'per'"
              :placeholder="'Select...'"
              :items="rate_types"
              :error="this.formError.find(item => item.field === 'locum_detail_rate_type_id')"
            />
          </div>
        </div>
        <div class="flex flex-row flex-wrap justify-start mt-4">
          <div class="flex flex-wrap items-center mt-2">
            <AppInput
              v-model="form.total_hours"
              :type="'number'"
              :name="'total_hours'"
              :label="'Total hours'"
              :placeholder="''"
              :inStyle="'text-align:right'"
              :error="this.formError.find(item => item.field === 'total_hours')"
            />
            <div class="text-xs sm:text-sm mx-2">hours</div>
          </div>
        </div>
        <div class="mt-4">
          <AppInput
            v-model="form.description"
            :type="'textarea'"
            :name="'description'"
            :label="'Private notes'"
            :resize="false"
          />
        </div>
        <div class="flex flex-no-wrap justify-start">
          <template v-if="!job">
            <AppButton :label="'Save'" @click="create" :disabled="loading" />
          </template>
          <template v-else>
            <AppButton :label="'Delete'" @click="delete_modal = true" :disabled="loading" />
            <div class="mx-1"></div>
            <AppButton :label="'Save'" @click="edit" :disabled="loading" />
          </template>
        </div>
      </div>
    </div>

    <transition name="fade" mode="out-in">
      <div class="shield" v-if="surgery_modal" @click="surgery_modal = false"></div>
    </transition>
    <transition name="slide" mode="out-in">
      <div class="modal-container shadow-lg" v-if="surgery_modal">
        <AddSurgeryModal @close="surgery_modal = false" />
      </div>
    </transition>
  </section>
</template>
<script>
import AppInput from "@/components/Base/AppInput";
import AppDate from "@/components/Base/AppDate";
import AppTime from "@/components/Base/AppTime";
import AppButton from "@/components/Base/AppButton";
import AddSurgeryModal from "@/components/AddSurgeryModal";
import AppFormError from "@/components/Base/AppFormError";
import AppLoading from "@/components/Base/AppLoading";
import AppConfirmationModal from "@/components/Base/AppConfirmationModal";
export default {
  props: ["job"],
  components: {
    AppInput,
    AppDate,
    AppTime,
    AppButton,
    AddSurgeryModal,
    AppLoading,
    AppFormError,
    AppConfirmationModal
  },
  data() {
    return {
      loading: false,
      delete_modal: false,
      surgery_modal: false,
      shifts: [],
      rate_types: [],
      form: {
        private_practice_id: "",
        date_start: "",
        time_start: "",
        date_end: "",
        time_end: "",
        shift_id: "",
        locum_detail_rate_type_id: "",
        rate: "",
        total_hours: "",
        description: ""
      },
      formError: []
    };
  },
  watch: {
    "form.private_practice_id"(value) {
      this.formError = this.formError.filter(
        error => error.field !== "private_practice_id"
      );
    },
    "form.date_start"(value) {
      this.formError = this.formError.filter(
        error => error.field !== "date_start"
      );
    },
    "form.date_end"(value) {
      let a_year = this.$moment(this.form.date_start).get("year");
      let a_month = this.$moment(this.form.date_start).get("month");
      let a_date = this.$moment(this.form.date_start).get("date");
      let b_year = this.$moment(value).get("year");
      let b_month = this.$moment(value).get("month");
      let b_date = this.$moment(value).get("date");

      let range = this.$moment([b_year, b_month, b_date]).diff(
        this.$moment([a_year, a_month, a_date]),
        "days"
      );
      if (range < 0) {
        this.formError.push({
          field: "form.date_end",
          message: "Invalid End Date"
        });
      } else {
        let index = this.formError.findIndex(item =>
          item.field.includes("date_end")
        );
        this.formError.splice(index, 1);
      }
      this.formError = this.formError.filter(
        error => error.field !== "date_end"
      );
    },
    "form.time_start"(value) {
      this.formError = this.formError.filter(
        error => error.field !== "time_start"
      );
    },
    "form.time_end"(value) {
      this.formError = this.formError.filter(
        error => error.field !== "time_end"
      );
    },
    "form.shift_id"(value) {
      this.formError = this.formError.filter(
        error => error.field !== "shift_id"
      );
    },
    "form.locum_detail_rate_type_id"(value) {
      this.formError = this.formError.filter(
        error => error.field !== "locum_detail_rate_type_id"
      );
    },
    "form.rate"(value) {
      this.formError = this.formError.filter(error => error.field !== "rate");
    },
    "form.total_hours"(value) {
      this.formError = this.formError.filter(
        error => error.field !== "total_hours"
      );
    }
  },
  async created() {
    this.loading = true;
    Promise.all([
      this.$axios.$get("/api/v1/locum/private-practices"),
      this.$axios.$get("/api/v1/shifts"),
      this.$axios.$get("/api/v1/locum-detail-rate-types")
    ])
      .then(([responsePrivatePractices, responseShifts, responseRateTypes]) => {
        this.$store.commit(
          "SET_LOCUM_PRIVATE_PRACTICES",
          responsePrivatePractices.data.private_practices
        );

        this.shifts = [];
        responseShifts.data.shifts.forEach(item => {
          this.shifts.push({ label: item.name, value: item.id });
        });

        this.rate_types = [];
        responseRateTypes.data.locum_detail_rate_types.forEach(item => {
          this.rate_types.push({ label: item.name, value: item.id });
        });
      })
      .finally(() => {
        this.loading = false;
      });
  },
  mounted() {
    if (this.job) {
      // ! get private practice id
      this.form.private_practice_id = this.job.private_practice_id;
      this.form.date_start = this.job.date_start;
      this.form.time_start = this.job.time_start;
      this.form.date_end = this.job.date_end;
      this.form.time_end = this.job.time_end;
      this.form.shift_id = this.job.shift.id;
      this.form.locum_detail_rate_type_id = this.job.locum_detail_rate_type.id;
      this.form.rate = this.job.rate;
      this.form.total_hours = this.job.total_hours;
      this.form.description = this.job.description;
    }
  },
  computed: {
    practices() {
      return this.$store.getters["getLocumPrivatePractices"];
    }
  },
  methods: {
    getJobParts(jobId) {
      return this.$axios.$get(`/api/v1/locum/job-parts?job_id=${jobId}`);
    },
    async create() {
      this.formError = [];

      let startDateTime = this.$moment(
        `${this.form.date_start} ${this.form.time_start}`,
        "YYYY-MM-DD HH:mm"
      ).format("YYYY-MM-DD HH:mm");
      let endDateTime = this.$moment(
        `${this.form.date_end} ${this.form.time_end}`,
        "YYYY-MM-DD HH:mm"
      ).format("YYYY-MM-DD HH:mm");

      if (this.$moment(this.startDateTime).isSameOrAfter(this.endDateTime)) {
        this.formError.push({
          field: "date_end",
          message: "Invalid End Date"
        });
        this.formError.push({
          field: "date_start",
          message: "Invalid Start Date"
        });
      }
      this.Validate(this.form, ["description"]);
      if (!this.formError.length) {
        try {
          this.loading = true;
          const jobResponse = await this.$axios.$post(
            `/api/v1/locum/jobs`,
            this.form
          );

          const job =
            jobResponse.data && jobResponse.data.job
              ? jobResponse.data.job
              : null;

          if (job) {
            if (
              job.locum_status === "Ongoing" ||
              job.locum_status === "Completed"
            ) {
              const jobPartsResponse = await this.getJobParts(job.id);

              const jobParts =
                jobPartsResponse.data &&
                jobPartsResponse.data.job_parts &&
                jobPartsResponse.data.job_parts.length > 0
                  ? jobPartsResponse.data.job_parts
                  : [];

              if (jobParts && jobParts.length > 0) {
                jobParts.forEach(jobPart => {
                  if (jobPart.locum_status === "Ongoing") {
                    this.$store.commit(
                      "jobs/ADD_LOCUM_ONGOING_JOB_PART",
                      jobPart
                    );
                  }
                  if (jobPart.locum_status === "Completed") {
                    this.$store.commit(
                      "jobs/ADD_LOCUM_COMPLETED_JOB_PART",
                      jobPart
                    );
                  }
                });
              }
            }

            if (job.locum_status === "Allocated") {
              this.$store.commit("jobs/ADD_LOCUM_ALLOCATED_JOB", job);
            }
          }

          this.$emit("close");
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`${jobResponse.message}`]
          });
          this.loading = false;
        } catch (err) {
          console.log("err", err.response || err);
          if (err.response.data.message) {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "danger",
              text: [`${err.response.data.message}`]
            });
          } else if (err.response.data.error_messages) {
            err.response.data.error_messages.forEach(error => {
              this.formError.push(error);
            });
          }
          this.loading = false;
        }
      } else {
        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "danger",
          text: ["Make sure you fill up the form correct."]
        });
      }
    },
    edit() {
      this.formError = [];
      this.Validate(this.form, ["description"]);
      if (!this.formError.length) {
        this.$axios
          .$put(`/api/v1/locum/jobs/${this.job.id}`, this.form)
          .then(res => {
            if (this.$route.name === "dashboard-id") {
              this.job.job_parts.forEach(jobPart => {
                this.$store.commit(
                  "jobs/REMOVE_LOCUM_ONGOING_JOB_PART",
                  jobPart.id
                );
              });
              this.job.job_parts.forEach(jobPart => {
                this.$store.commit(
                  "jobs/REMOVE_LOCUM_COMPLETED_JOB_PART",
                  jobPart.id
                );
              });
              this.$store.commit(
                "jobs/REMOVE_LOCUM_ALLOCATED_JOB",
                this.job.id
              );

              if (res.data.job.locum_status === "Allocated") {
                this.$store.commit(
                  "jobs/ADD_LOCUM_ALLOCATED_JOB",
                  res.data.job
                );
              }
              if (res.data.job.locum_status === "Ongoing") {
                this.getJobParts(res.data.job.id).then(res => {
                  res.data.job_parts.forEach(jobPart => {
                    this.$store.commit(
                      "jobs/ADD_LOCUM_ONGOING_JOB_PART",
                      jobPart
                    );
                  });
                });
              }
              if (res.data.job.locum_status === "Completed") {
                this.getJobParts(res.data.job.id).then(res => {
                  res.data.job_parts.forEach(jobPart => {
                    this.$store.commit(
                      "jobs/ADD_LOCUM_COMPLETED_JOB_PART",
                      jobPart
                    );
                  });
                });
              }
            }
            if (this.$route.name === "jobs-index-id") {
              this.$emit("appointmentUpdated");
            }
            this.$emit("close");
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: [`${res.message}`]
            });
          })
          .catch(err => {
            err.response.data.error_messages.forEach(error => {
              this.formError.push(error);
            });
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "danger",
              text: this.formError.map(error => error.message)
            });
          });
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
        if (this.job.locum_status === "Allocated") {
          this.$store.commit("jobs/REMOVE_LOCUM_ALLOCATED_JOB", this.job.id);
        }
        if (this.job.locum_status === "Ongoing") {
          this.job.job_parts
            .map(jobPart => jobPart.id)
            .forEach(id => {
              this.$store.commit("jobs/REMOVE_LOCUM_ONGOING_JOB_PART", id);
            });
        }
        this.$emit("close");
        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "success",
          text: [`${res.message}`]
        });
      });
    }
  }
};
</script>
<style scoped>
.modal-container {
  z-index: 512;
}
@media screen and (min-width: 1200px) {
  .modal-container {
    width: 70%;
  }
}

.shield {
  z-index: 511;
}
</style>


