<template>
  <section>
    <AppConfirmationModal
      :label="'Delete this appointment?'"
      :confirmLabel="'Yes'"
      :cancelLabel="'Cancel'"
      :modal="confirmation_modal"
      @confirm="remove"
      @cancel="confirmation_modal = false"
    />

    <div class="p-4 md:p-8">
      <div @click="close" class="cursor-pointer">
        <svgicon name="left-arrow" height="32" width="32" />
      </div>
      <div class="flex justify-start font-bold text-sm sm:text-xl mt-8">Appointment</div>
      <AppFormError :formError="formError" v-if="formError.length > 0" id="error" />
      <div class="rounded-lg shadow-lg px-4 md:px-8 py-4 mt-4">
        <AppInput
          v-model="form.private_practice_id"
          :type="'select'"
          :name="'private_practice_id'"
          :label="'Practice'"
          :placeholder="'Select...'"
          :items="practices"
        />
        <div class="-mt-10 pt-4">
          <AppButton :label="'Add'" @click="modal = true" :inStyle="'padding:5px 14px;'" />
        </div>
        <div class="flex flex-row flex-wrap justify-start mt-8 items-center max-w-4xl">
          <div class="px-1 w-full sm:w-1/2 md:w-1/4">
            <AppDate v-model="form.date_start" :name="'date_start'" :label="'From'" isAfter/>
          </div>
          <div class="px-1 w-full sm:w-1/2 md:w-1/4">
            <AppTime v-model="form.time_start" :name="'time_start'" :label="'Start time'"/>
          </div>
          <div class="px-1 w-full sm:w-1/2 md:w-1/4">
            <AppDate v-model="form.date_end" :name="'date_end'" :label="'To'" isAfter/>
          </div>
          <div class="px-1 w-full sm:w-1/2 md:w-1/4">
            <AppTime v-model="form.time_end" :name="'time_end'" :label="'End time'" />
          </div>
        </div>
        <div class="flex flex-row flex-wrap justify-start items-center mt-4 max-w-2xl">
          <div class="px-1 w-full sm:w-1/2 md:w-1/3">
            <AppInput
              v-model="form.shift_id"
              :type="'select'"
              :name="'shift_id'"
              :label="'Shift'"
              :placeholder="'Select...'"
              :items="shifts"
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
            />
          </div>
        </div>
        <div class="flex flex-row flex-wrap justify-start items-center mt-4 max-w-md">
          <div class="flex flex-wrap items-center mt-2">
            <AppInput
              v-model="form.total_hours"
              :type="'number'"
              :name="'total_hours'"
              :label="'Total hours'"
              :placeholder="''"
              :inStyle="'text-align:right'"
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
            <AppButton :label="'Save'" @click="create" />
          </template>
          <template v-else>
            <AppButton :label="'Delete'" @click="confirmation_modal = true" />
            <div class="mx-1"></div>
            <AppButton :label="'Save'" @click="edit" />
          </template>
        </div>
      </div>
    </div>

    <div class="shield" v-if="modal"></div>
    <transition name="slide" mode="out-in">
      <div class="add-surgery-modal shadow-lg" v-if="modal">
        <AddSurgeryModal @close="modal = false" />
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
import AppConfirmationModal from "@/components/Base/AppConfirmationModal";
export default {
  props: ["job"],
  components: {
    AppInput,
    AppDate,
    AppTime,
    AppButton,
    AddSurgeryModal,
    AppFormError,
    AppConfirmationModal
  },
  data() {
    return {
      confirmation_modal: false,
      modal: false,
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
      let a_year = this.$moment(this.form.date_start).get('year')
      let a_month = this.$moment(this.form.date_start).get('month')
      let a_date = this.$moment(this.form.date_start).get('date')
      let b_year = this.$moment(value).get('year')
      let b_month = this.$moment(value).get('month')
      let b_date = this.$moment(value).get('date')

      let range = this.$moment([b_year, b_month, b_date]).diff(this.$moment([a_year, a_month, a_date]), 'days')
      if (range < 0){
        this.formError.push({field: "form.date_end", message: "Invalid End Date"})
      }else{
        let index = this.formError.findIndex(item => item.field.includes("date_end"))
        this.formError.splice(index, 1)
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
  created() {
    this.getPractices();
    this.getShifts();
    this.getRateType();
    if (this.job) {
      this.form.private_practice_id = this.job.private_job.private_practice.id;
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
    getPractices() {
      this.$axios.$get(`/api/v1/locum/private-practices`).then(res => {
        this.$store.commit(
          "SET_LOCUM_PRIVATE_PRACTICES",
          res.data.private_practices
        );
      });
    },
    getShifts() {
      this.$axios.$get(`/api/v1/shifts`).then(res => {
        this.shifts = [];
        res.data.shifts.forEach(item => {
          this.shifts.push({ label: item.name, value: item.id });
        });
      });
    },
    getRateType() {
      this.$axios.$get(`/api/v1/locum-detail-rate-types`).then(res => {
        this.rate_types = [];
        res.data.locum_detail_rate_types.forEach(item => {
          this.rate_types.push({ label: item.name, value: item.id });
        });
      });
    },
    close() {
      this.$emit("close");
    },
    create() {
      // this.formError = [];
      this.Validate(this.form, ["description"]);
      if (!this.formError.length) {
        // this.form.date_start = this.$moment(this.form.date_start).format(
        //   "YYYY-MM-DD"
        // );
        // this.form.date_end = this.$moment(this.form.date_end).format(
        //   "YYYY-MM-DD"
        // );
        this.$axios
          .$post(`/api/v1/locum/jobs`, this.form)
          .then(res => {
            if (res.data.job.locum_status === "Allocated") {
              this.$store.commit("jobs/ADD_LOCUM_ALLOCATED_JOB", res.data.job);
            }
            if (res.data.job.locum_status === "Ongoing") {
              this.$store.dispatch("jobs/fetchLocumJobParts", {
                locum_status: ["Ongoing"],
                job_id: res.data.job.id,
                type: "ADD"
              });
            }
            this.close();
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
            if (res.data.job.locum_status === "Allocated") {
              this.$store.commit(
                "jobs/UPDATE_LOCUM_ALLOCATED_JOB",
                res.data.job
              );
            }
            if (res.data.job.locum_status === "Ongoing") {
              let updatedJobPartIndex = [];
              this.$store.state.jobs.locum_ongoing_job_parts.forEach(
                (oldJobPart, index) => {
                  if (oldJobPart.job.id === res.data.job.id) {
                    updatedJobPartIndex.push(index);
                    this.$store.commit(
                      "jobs/REMOVE_LOCUM_ONGOING_JOB_PART",
                      oldJobPart.id
                    );
                  }
                }
              );
              this.$store.dispatch("jobs/fetchLocumJobParts", {
                locum_status: ["Ongoing"],
                job_id: res.data.job.id,
                updatedJobPartIndex
              });
            }
            if (res.data.job.locum_status === "Completed") {
              let updatedJobPartIndex = [];
              this.$store.state.jobs.locum_completed_job_parts.forEach(
                (oldJobPart, index) => {
                  if (oldJobPart.job.id === res.data.job.id) {
                    updatedJobPartIndex.push(index);
                    this.$store.commit(
                      "jobs/REMOVE_LOCUM_COMPLETED_JOB_PART",
                      oldJobPart.id
                    );
                  }
                }
              );
              this.$store.dispatch("jobs/fetchLocumJobParts", {
                locum_status: ["Completed"],
                job_id: res.data.job.id,
                updatedJobPartIndex
              });
            }
            if (res.data.job.locum_status === "Approved") {
              let updatedJobPartIndex = [];
              this.$store.state.jobs.locum_approved_job_parts.forEach(
                (oldJobPart, index) => {
                  if (oldJobPart.job.id === res.data.job.id) {
                    updatedJobPartIndex.push(index);
                    this.$store.commit(
                      "jobs/REMOVE_LOCUM_APPROVED_JOB_PART",
                      oldJobPart.id
                    );
                  }
                }
              );
              this.$store.dispatch("jobs/fetchLocumJobParts", {
                locum_status: ["Approved"],
                job_id: res.data.job.id,
                updatedJobPartIndex
              });
            }
            this.close();
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
        // this.$nextTick(() => {
        //   this.$refs.modalContainer.scrollTop = 0;
        // });
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
        this.close();
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
.shield {
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


