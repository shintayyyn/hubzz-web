<template>
  <div>
    <div class="flex flex-row flex-wrap" v-if="$auth.user.domain === 'Locum'">
      <div class="w-full sm:w-1/3 p-1">
        <AppSelect
          v-model="params.shift_id"
          :name="'shift'"
          :label="'Shift'"
          :placeholder="'Select...'"
          :items="shifts"
        />
      </div>
      <div class="w-full sm:w-1/3 p-1">
        <AppInput
          v-model="params.rate"
          :type="'text'"
          :name="'rate'"
          :label="'Rate'"
          :placeholder="''"
        />
      </div>
      <div class="w-full sm:w-1/3 p-1">
        <AppSelect
          v-model="params.locum_detail_rate_type_id"
          :name="'locum_detail_rate_type_id'"
          :label="'per'"
          :placeholder="'Select...'"
          :items="rate_types"
        />
      </div>
      <div class="w-full sm:w-1/4 p-1">
        <AppPostCode
          v-model="params.near_post_code"
          :name="'near_post_code'"
          :label="'Post code'"
          @onSelect="onSelect"
          :inStyle="'background-color:#dae1e7;border-color:white; padding: 1rem .5rem'"
        />
      </div>
      <div class="w-full sm:w-1/4 p-1">
        <AppInput
          v-model="params.miles"
          :type="'text'"
          :name="'miles'"
          :label="'Miles'"
          :placeholder="''"
          :inStyle="'text-align:right'"
        />
      </div>
      <div class="w-full sm:w-1/4 p-1">
        <AppAutoComplete
          v-model="params.surgery_name"
          :name="'surgery_name'"
          :label="'Surgery'"
          :url="'/api/v1/locum/surgeries'"
        />
      </div>
      <div class="w-full sm:w-1/4 flex flex-row">
        <AppButton :label="'Clear'" @click="$emit('clear')" :inStyle="'padding:5px 14px'" />
        <div class="mx-1"></div>
        <AppButton :label="'Search'" @click="$emit('getJobs')" :inStyle="'padding:5px 14px'" />
      </div>
    </div>
    <div class="flex flex-row flex-wrap" v-if="$auth.user.domain === 'Practice'">
      <div class="w-full sm:w-1/3 p-1">
        <AppSelect
          v-model="params.shift_id"
          :name="'shift'"
          :label="'Shift'"
          :placeholder="'Select...'"
          :items="shifts"
        />
      </div>
      <div class="w-full sm:w-1/3 p-1">
        <AppInput
          v-model="params.rate"
          :type="'text'"
          :name="'rate'"
          :label="'Rate'"
          :placeholder="''"
        />
      </div>
      <div class="w-full sm:w-1/3 p-1">
        <AppSelect
          v-model="params.locum_detail_rate_type_id"
          :name="'locum_detail_rate_type_id'"
          :label="'per'"
          :placeholder="'Select...'"
          :items="rate_types"
        />
      </div>
      <div class="w-full sm:w-1/4 flex flex-row">
        <AppButton :label="'Clear'" @click="$emit('clear')" :inStyle="'padding:5px 14px'" />
        <div class="mx-1"></div>
        <AppButton :label="'Search'" @click="$emit('getJobs')" :inStyle="'padding:5px 14px'" />
      </div>
    </div>
  </div>
</template>
<script>
import AppInput from "@/components/Base/AppInput";
import AppSelect from "@/components/Base/AppSelect";
import AppPostCode from "@/components/Base/AppPostCode";
import AppButton from "@/components/Base/AppButton";
import AppAutoComplete from "@/components/Base/AppAutoComplete";
export default {
  components: {
    AppInput,
    AppSelect,
    AppPostCode,
    AppButton,
    AppAutoComplete
  },
  props: ["params"],
  data() {
    return {
      shifts: [],
      rate_types: []
    };
  },
  created() {
    this.getShifts();
    this.getRateType();
  },
  methods: {
    onSelect(value) {
      let address_components = value.details.result.address_components;
      let postal_code = address_components.find(component =>
        component.types.includes("postal_code")
      );
      if (!postal_code) {
        this.params.near_post_code = "";

        return;
      }
      this.params.near_post_code = postal_code.long_name;
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
    }
  }
};
</script>
