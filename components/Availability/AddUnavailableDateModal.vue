<template>
  <div class="p-8 max-w-3xl">
    <div @click="$emit('close')" class="cursor-pointer">
      <svgicon name="left-arrow" height="32" width="32" />
    </div>
    <div class="flex justify-start font-bold text-sm sm:text-xl mt-8 mb-2">Availability</div>
    <div class="mt-4">
      <div class="rounded-lg shadow-lg p-8">
        <AppFormError :formError="formError" v-if="formError.length > 0" />
        <div class="font-bold text-sm sm:text-md mt-4">
          I won't be available
          <span v-if="type === 'solo'">for</span>...
        </div>
        <div class="flex flex-row flex-wrap justify-between" v-if="type === 'range'">
          <div class="w-full p-0 sm:w-1/2 pr-2">
            <AppDate
              v-model="form.date_start"
              :name="'date_start'"
              :label="'From'"
              :error="formError.find(item => item.field === 'date_start')"
              @blur="CheckEmptyField(form.date_start,'date_start')"
            />
          </div>
          <div class="w-full p-0 sm:w-1/2 pl-2">
            <AppDate
              v-model="form.date_end"
              :name="'date_end'"
              :label="'To'"
              :error="formError.find(item => item.field === 'date_end')"
              @blur="CheckEmptyField(form.date_end,'date_end')"
            />
          </div>
        </div>
        <div class="flex flex-col w-full my-6" v-else>
          <div class="text-sm sm:text-md">On this date</div>
          <div class="text-md sm:text-lg font-bold mt-2">{{$store.state.availability.selected_date}}</div>
        </div>
        <div class="flex flex-row flex-wrap justify-start mt-4 relative">
          <div class="text-sm sm:text-md leading-loose mr-2">On theses shifts</div>
          <div
            class="rounded-lg bg-gray-300 px-2 py-1 text-sm sm:text-md flex items-center"
            v-if="type === 'solo'"
          >Select all that apply. Shifts that are already booked are greyed-out.</div>
          <div
            class="rounded-lg bg-gray-300 px-2 py-1 text-sm sm:text-md flex items-center"
            v-else
          >Select all that apply.</div>
          <div
            class="absolute right-0 bg-red-500 p-1 text-xs sm:text-base text-white"
            v-if="formError.find(item => item.field === 'shift_id') && formError.find(item => item.field === 'shift_id').message"
          >{{formError.find(item => item.field === 'shift_id').message}}</div>
        </div>

        <div class="flex flex-row flex-wrap justify-around md:justify-between mt-4">
          <button
            class="relative border border-solid rounded-lg p-5 my-2 md:m-1 text-center text-xs sm:text-sm focus:outline-none w-full sm:w-1/3 md:w-1/6"
            :class="{
                'bg-gray-300': isDisabled(item.id),
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
      <template v-if="form.id">
        <AppButton :label="'Remove'" @click="remove" v-if="isRemove" />
        <AppButton :label="'Update'" @click="update" v-else />
      </template>
      <AppButton :label="'Add'" @click="add" v-else />
    </div>
  </div>
</template>
<script>
import AppInput from "@/components/Base/AppInput";
import AppDate from "@/components/Base/AppDate";
import AppButton from "@/components/Base/AppButton";
import AppFormError from "@/components/Base/AppFormError";
export default {
  props: [
    "unavailableDate",
    "appointmentDate",
    "allocatedDate",
    "ongoingDate",
    "partDate",
    "type"
  ],
  components: {
    AppFormError,
    AppInput,
    AppDate,
    AppButton,
    AppFormError
  },
  data() {
    return {
      form: {
        id: null,
        date_start: null,
        date_end: null,
        shift_id: []
      },
      formError: []
    };
  },
  computed: {
    shifts() {
      return this.$store.state.availability.shifts;
    },
    isRemove() {
      return !Boolean(this.form.shift_id.length);
    }
  },
  created() {
    if (this.type === "solo") {
      if (this.unavailableDate) {
        let shifts = this.unavailableDate.shifts;
        if (this.appointmentDate) {
          shifts = this.unavailableDate.shifts.filter(
            shift => shift.id !== this.appointmentDate.shift.id
          );
        }
        if (this.allocatedDate && this.allocatedDate.length > 0) {
          this.allocatedDate.forEach(item => {
            shifts = this.unavailableDate.shifts.filter(
              shift => shift.id !== item.id
            );
          });
        }
        if (this.ongoingDate && this.ongoingDate.length > 0) {
          this.ongoingDate.forEach(item => {
            shifts = this.unavailableDate.shifts.filter(
              shift => shift.id !== item.id
            );
          });
        }
        if (this.partDate && this.partDate.length > 0) {
          this.partDate.forEach(item => {
            shifts = this.unavailableDate.shifts.filter(
              shift => shift.id !== item.id
            );
          });
        }
        this.unavailableDate.shifts = shifts;
        this.form.id = this.unavailableDate.id;
        this.form.shift_id = this.unavailableDate.shifts.map(shift => shift.id);
      }
      this.form.date_start = this.$store.state.availability.selected_date;
      this.form.date_end = this.$store.state.availability.selected_date;
    }
  },
  watch: {
    "form.date_start"(value) {
      this.CheckEmptyField(this.form.date_start, "date_start");
    },
    "form.date_end"(value) {
      this.CheckEmptyField(this.form.date_end, "date_end");
    },
    "form.shift_id"(value) {
      if (this.type === "range") {
        this.CheckEmptyField(this.form.shift_id, "shift_id");
      }
    }
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
    add() {
      this.formError = [];
      this.Validate(this.form, ["id"]);
      if (!this.formError.length) {
        this.form.date_start = this.$moment(this.form.date_start).format(
          "YYYY-MM-DD"
        );
        this.form.date_end = this.$moment(this.form.date_end).format(
          "YYYY-MM-DD"
        );
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
            this.$emit("close");
          })
          .catch(err => {
            this.form.date_start = this.$moment(this.form.date_start).format(
              "MM/DD/YYYY"
            );
            this.form.date_end = this.$moment(this.form.date_end).format(
              "MM/DD/YYYY"
            );
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
    update() {
      this.$axios
        .$put(`/api/v1/locum/unavailabilities/${this.form.id}`, {
          shift_id: this.form.shift_id
        })
        .then(res => {
          this.$store.commit(
            "jobs/UPDATE_LOCUM_UNAVAILABILITIES",
            res.data.unavailability
          );
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: ["Shift updated"]
          });
          this.$emit("close");
        });
    },
    remove() {
      this.$axios
        .$delete(`/api/v1/locum/unavailabilities/${this.form.id}`)
        .then(res => {
          this.$store.commit(
            "jobs/REMOVE_LOCUM_UNAVAILABILITIES",
            this.form.id
          );
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`${res.message}`]
          });
          this.$emit("close");
        });
    },
    isSelected(id) {
      return this.form.shift_id.includes(id);
    },
    isDisabled(id) {
      return (
        (this.allocatedDate &&
          this.allocatedDate.length &&
          this.allocatedDate.find(shift => shift.id === id)) ||
        (this.appointmentDate &&
          this.appointmentDate.shift &&
          this.appointmentDate.shift.id === id) ||
        (this.ongoingDate &&
          this.ongoingDate.length &&
          this.ongoingDate.find(shift => shift.id === id)) ||
        (this.partDate &&
          this.partDate.length &&
          this.partDate.find(shift => shift.id === id))
      );
    }
  }
};
</script>

