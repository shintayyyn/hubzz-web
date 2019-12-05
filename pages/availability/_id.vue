<template>
  <div class="modal-container shadow-lg">
    <div class="p-4 md:p-8 max-w-3xl">
      <nuxt-link :to="'/availability'">
        <svgicon name="left-arrow" height="32" width="32" class="cursor-pointer" />
      </nuxt-link>
      <div class="flex justify-start font-bold text-sm sm:text-xl mt-8 mb-2">Availability</div>
      <div class="mt-4">
        <div class="relative bg-white rounded-lg shadow-lg p-4 md:p-8">
          <AppLoading :loading="loading" spinner />
          <AppFormError :formError="formError" v-if="formError.length > 0" />
          <div class="font-bold text-sm sm:text-md mt-4">I won't be available</div>
          <div class="flex flex-col w-full my-6">
            <div class="text-sm sm:text-md">On this date</div>
            <div
              class="text-md sm:text-lg font-bold mt-2"
            >{{$store.state.availability.selected_date}}</div>
          </div>
          <div class="flex flex-row flex-wrap items-center justify-between mt-4 relative">
            <div class="text-sm sm:text-md leading-loose mr-4">On theses shifts</div>
            <div
              class="rounded-lg bg-gray-300 px-2 py-1 text-sm sm:text-md flex items-center"
            >Select all that apply. Shifts that are already booked are greyed-out.</div>
            <div
              class="text-red-500 text-xs text-white"
              v-if="formError.find(item => item.field === 'shift_id') && formError.find(item => item.field === 'shift_id').message"
            >{{formError.find(item => item.field === 'shift_id').message.charAt(0).toUpperCase() + formError.find(item => item.field === 'shift_id').message.slice(1).replace(/_/g, " ")}}</div>
          </div>
          <div
            class="flex flex-row flex-wrap justify-around md:justify-between mt-4"
            :class="formError.find(item => item.field === 'shift_id') && 'error rounded-lg'"
          >
            <button
              class="relative border border-solid rounded-lg p-5 my-2 md:m-1 text-center text-xs sm:text-sm focus:outline-none w-full sm:w-1/3 md:w-1/6"
              :class="{
                'bg-gray-300 cursor-not-allowed': isDisabled(item.id),
                'bg-yellow-500': isSelected(item.id), 
                'hover:bg-yellow-500': !isSelected(item.id) && !isDisabled(item.id),
              }"
              style="box-sizing:content-box;"
              v-for="item in shifts"
              :key="item.id"
              :disabled="isDisabled(item.id)"
              @click="select(item.id)"
            >{{item.name}}</button>
          </div>
        </div>
      </div>
      <div class="mt-4">
        <AppButton :label="'Save'" @click="save" :disabled="loading" />
      </div>
    </div>
  </div>
</template>
<script>
import AppInput from "@/components/Base/AppInput";
import AppDate from "@/components/Base/AppDate";
import AppButton from "@/components/Base/AppButton";
import AppLoading from "@/components/Base/AppLoading";
import AppFormError from "@/components/Base/AppFormError";
import moment from "moment";
export default {
  components: {
    AppInput,
    AppDate,
    AppButton,
    AppLoading,
    AppFormError
  },
  data() {
    return {
      loading: false,
      shifts: [],
      form: {
        date_start: null,
        date_end: null,
        shift_id: []
      },
      formError: []
    };
  },
  computed: {
    getLocumOngoingJobs() {
      return this.$store.getters["jobs/getLocumOngoingJobs"];
    },
    getLocumAllocatedJobs() {
      return this.$store.getters["jobs/getLocumAllocatedJobs"];
    },
    getLocumUnavailabilities() {
      return this.$store.getters["jobs/getLocumUnavailabilities"];
    },
    selectedDate() {
      return this.$store.state.availability.selected_date;
    }
  },
  created() {
    this.$store.commit("availability/SELECT_DATE", this.$route.params.id);
    this.loading = true;
    this.$axios.$get(`/api/v1/shifts`).then(res => {
      this.shifts = res.data.shifts;
      this.loading = false;
    });
  },
  mounted() {
    let unavailableDate = null;
    this.ongoingDate = null;
    this.allocatedDate = null;

    if (
      this.getLocumUnavailabilities &&
      this.getLocumUnavailabilities.length > 0
    ) {
      let isUnavailable = this.getLocumUnavailabilities.find(
        unavailable => unavailable.date === this.selectedDate
      );
      if (isUnavailable) {
        unavailableDate = {
          id: isUnavailable.id,
          shifts: isUnavailable.shifts
        };
      }
    }

    if (this.getLocumOngoingJobs && this.getLocumOngoingJobs.length > 0) {
      let hasLocumOngoingJob = this.getLocumOngoingJobs.filter(job_part =>
        this.getDateArray(job_part.date_start, job_part.date_end).includes(
          this.selectedDate
        )
      );
      if (hasLocumOngoingJob && hasLocumOngoingJob.length > 0) {
        this.ongoingDate = hasLocumOngoingJob.map(item => {
          return item.job.shift;
        });
      }
    }

    if (this.getLocumAllocatedJobs && this.getLocumAllocatedJobs.length > 0) {
      let hasLocumAllocatedJob = this.getLocumAllocatedJobs.filter(job =>
        this.getDateArray(job.date_start, job.date_end).includes(
          this.selectedDate
        )
      );
      if (hasLocumAllocatedJob && hasLocumAllocatedJob.length > 0) {
        this.allocatedDate = hasLocumAllocatedJob.map(item => {
          return item.shift;
        });
      }
    }

    if (unavailableDate) {
      let shifts = unavailableDate.shifts;
      if (this.allocatedDate && this.allocatedDate.length > 0) {
        this.allocatedDate.forEach(item => {
          shifts = unavailableDate.shifts.filter(shift => shift.id !== item.id);
        });
      }
      if (this.ongoingDate && this.ongoingDate.length > 0) {
        this.ongoingDate.forEach(item => {
          shifts = unavailableDate.shifts.filter(shift => shift.id !== item.id);
        });
      }

      unavailableDate.shifts = shifts;

      this.form.shift_id = [];
      this.form.shift_id = unavailableDate.shifts.map(shift => shift.id);
    }
    this.form.date_start = this.$store.state.availability.selected_date;
    this.form.date_end = this.$store.state.availability.selected_date;
  },
  methods: {
    select(id) {
      let index = this.form.shift_id.findIndex(item => item === id);
      if (index >= 0) {
        this.form.shift_id.splice(index, 1);
      } else {
        this.form.shift_id.push(id);
      }
    },
    isSelected(id) {
      return this.form.shift_id.includes(id);
    },
    isDisabled(id) {
      return (
        (this.allocatedDate &&
          this.allocatedDate.length &&
          this.allocatedDate.find(shift => shift.id === id)) ||
        (this.ongoingDate &&
          this.ongoingDate.length &&
          this.ongoingDate.find(shift => shift.id === id))
      );
    },
    save() {
      this.formError = [];
      this.Validate(this.form, ["shift_id"]);
      if (!this.formError.length) {
        this.loading = true;
        this.$axios
          .$post(`/api/v1/locum/unavailabilities`, this.form)
          .then(res => {
            this.$store.commit(
              "jobs/ADD_LOCUM_UNAVAILABILITIES",
              res.data.unavailabilities
            );
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: [`${res.message}`]
            });
            this.$router.push({
              path: "/availability"
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
          })
          .finally(() => {
            this.loading = false;
          });
      } else {
        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "danger",
          text: ["Please fill up all the forms"]
        });
      }
    }
  }
};
</script>
<style scoped>
.modal-container {
  z-index: 510;
}
@media screen and (min-width: 1200px) {
  .modal-container {
    width: 80%;
  }
}
</style>