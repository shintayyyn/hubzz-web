<template>
  <div>
    <span class="md:hidden bg-yellow-500 text-center py-1 px-4 text-sm rounded-lg cursor-pointer" @click="showFilter ? showFilter = false : showFilter = true">Filter</span>
    <div class="absolute left-0 top-0 w-full bg-white rounded-lg p-4 text-sm -mt-32 mb-4 md:mt-0 md:mb-0 md:static md:text-base md:flex flex-row flex-wrap"
     style="z-index: 56" v-if="$auth.user.domain === 'Locum' && showFilter">
      <div class="md:hidden w-full text-right text-xl font-bold -mt-2 hover:text-gray-600"><span class="cursor-pointer" @click="showFilter = false">x</span></div>
      <div class="w-full md:w-1/3 p-1">
        <AppInput
          v-model="params.shift_id"
          :type="'select'"
          :name="'shift_id'"
          :label="'Shift'"
          :placeholder="'Select...'"
          :items="shifts"
        />
      </div>
      <div class="w-full md:w-1/3 p-1">
        <AppInput
          v-model="params.rate"
          :type="'text'"
          :name="'rate'"
          :label="'Rate'"
          :placeholder="''"
        />
      </div>
      <div class="w-full md:w-1/3 p-1">
        <AppInput
          v-model="params.locum_detail_rate_type_id"
          :type="'select'"
          :name="'locum_detail_rate_type_id'"
          :label="'per'"
          :placeholder="'Select...'"
          :items="rate_types"
        />
      </div>
      <div class="w-full md:w-1/4 p-1">
        <AppPostCode
          v-model="params.near_post_code"
          :name="'near_post_code'"
          :label="'Post code'"
          @onSelect="onSelect"
          :inStyle="'background-color:#dae1e7;border-color:white; padding: 1rem .5rem'"
        />
      </div>
      <div class="w-full md:w-1/4 p-1">
        <AppInput
          v-model="params.miles"
          :type="'text'"
          :name="'miles'"
          :label="'Miles'"
          :placeholder="''"
          :inStyle="'text-align:right'"
        />
      </div>
      <div class="w-full md:w-1/4 p-1">
        <AppAutoComplete
          v-model="params.surgery_name"
          :name="'surgery_name'"
          :label="'Surgery'"
          :url="'/api/v1/locum/surgeries'"
        />
      </div>
      <div class="w-full md:w-1/4 flex flex-row justify-center items-center">
        <AppButton :label="'Clear'" @click="$emit('clear')" :inStyle="'padding:5px 14px'" />
        <div class="mx-1"></div>
        <AppButton :label="'Search'" @click="$emit('getJobs')" :inStyle="'padding:5px 14px'" />
      </div>
    </div>
    <div class="md:flex flex-row flex-wrap" v-if="$auth.user.domain === 'Practice' && showFilter">
      <div class="w-full md:w-1/3 p-1">
        <AppInput
          v-model="params.shift_id"
          :type="'select'"
          :name="'shift'"
          :label="'Shift'"
          :placeholder="'Select...'"
          :items="shifts"
        />
      </div>
      <div class="w-full md:w-1/3 p-1">
        <AppInput
          v-model="params.rate"
          :type="'text'"
          :name="'rate'"
          :label="'Rate'"
          :placeholder="''"
        />
      </div>
      <div class="w-full md:w-1/3 p-1">
        <AppInput
          v-model="params.locum_detail_rate_type_id"
          :type="'select'"
          :name="'locum_detail_rate_type_id'"
          :label="'per'"
          :placeholder="'Select...'"
          :items="rate_types"
        />
      </div>
      <div class="w-full md:w-1/4 flex flex-row">
        <AppButton :label="'Clear'" @click="$emit('clear')" :inStyle="'padding:5px 14px'" />
        <div class="mx-1"></div>
        <AppButton :label="'Search'" @click="$emit('getJobs')" :inStyle="'padding:5px 14px'" />
      </div>
    </div>
    <div class="shield md:hidden" v-if="showFilter" @click="showFilter = false"></div>
  </div>
</template>
<script>
import AppInput from "@/components/Base/AppInput";
import AppPostCode from "@/components/Base/AppPostCode";
import AppButton from "@/components/Base/AppButton";
import AppAutoComplete from "@/components/Base/AppAutoComplete";
export default {
  components: {
    AppInput,
    AppPostCode,
    AppButton,
    AppAutoComplete
  },
  props: ["params"],
  data() {
    return {
      shifts: [],
      rate_types: [],
      showFilter: false
    };
  },
  mounted(){
    if (window.innerWidth > 767){
      this.showFilter = true
    }
  },
  created() {
    this.getShifts();
    this.getRateType();
    // if (window.innerWidth > 639){
    //   this.showFilter = true
    // }
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
