<template>
  <div class="flex flex-col items-center justify-center w-full">
    <div class="flex w-full justify-center xl:justify-start">
      <div class="md:mx-4 flex flex-col p-4 m-1 rounded-lg border w-full">
        <div class="w-full">
          <AppInput
            v-model="search_text"
            :type="'text'"
            :name="'search_text'"
            :label="'Search for a Practice'"
            :error="this.formError.find(item => item.field === 'search_text')"
            :placeholder="'Practice code, name of practice'"
            @keyup.enter.native="search"
          />
        </div>
        <div class="flex flex-nowrap">
          <AppButton :label="'Search Practice'" @click="search" :inStyle="'padding:5px 14px;'" />
          <div class="mx-1"></div>
          <AppButton
            :label="'Input manually'"
            @click="inputManually"
            :inStyle="'padding:5px 14px;'"
          />
        </div>
      </div>
    </div>

    <div v-if="showResult && surgeries.length === 0" class="flex flex-col items-center mt-5 md:mx-4">
      <div
        class="text-xs xl:text-base font-bold"
      >No practice matched that name. Try again with whole words, practice code or CCG.</div>
      <AppButton
        class="rounded-lg shadow-lg mt-5"
        :label="'Input manually'"
        @click="inputManually"
      />
    </div>

    <div class="flex w-full justify-center xl:justify-start">
      <div
        class="rounded-lg border mt-4 md:mx-4 m-1 w-full"
        v-if="showResult && surgeries.length > 0"
      >
        <div
          class="text-xs lg:text-base font-bold p-4"
        >Select by clicking on the practice that you wish to add</div>
        <div
          class="border-t-2 p-4 cursor-pointer"
          :class="selectedSurgeryId === item.id ? 'bg-sunglow':'hover:bg-gray-200'"
          v-for="(item) in surgeries"
          :key="item.id"
          @click="selectedSurgeryId = item.id"
          @dblclick="inputAutomatically"
        >
          <div class="flex flex-col justify-start text-xs xl:text-base">
            <div class="font-bold">{{item.name}}</div>
            <div
              class="mt-2 text-sm"
            >{{item.address.line_1}}, {{item.address.line_2}}, {{item.address.line_3}}, {{item.address.post_code}}</div>
            <div class="flex flex-row flex-no-wrap mt-1 text-sm">
              <div class="rounded-lg bg-gray-300 py-1 px-2 mr-1 text-sm">CCG</div>
              <div class="flex items-center text-sm">{{item.clinical_commissioning_group.name}}</div>
            </div>
            <div class="flex flex-row flex-no-wrap mt-1 text-sm">
              <div class="rounded-lg bg-gray-300 py-1 px-2 mr-1">Practice Code</div>
              <div class="flex items-center">{{item.code}}</div>
            </div>
          </div>
        </div>
        <div class="border-t-2 px-4 py-2 text-xs xl:text-sm">
          <p class="font-bold">These are just top 10 matches from your search term.</p>
          <p
            class="font-bold"
          >Try again with practice code or its full name if the practice isn't in the result.</p>
        </div>
      </div>
    </div>

    <div
      class="fixed bottom-0 right-0 m-4 md:static"
      v-if="selectedSurgeryId && surgeries.length > 0"
    >
      <AppButton class="rounded-lg shadow-lg" :label="'Next'" @click="inputAutomatically" />
    </div>
  </div>
</template>
<script>
import AppInput from "@/components/Base/AppInput";
import AppButton from "@/components/Base/AppButton";
export default {
  components: {
    AppInput,
    AppButton
  },
  data() {
    return {
      search_text: "",
      surgeries: [],
      selectedSurgeryId: null,
      showResult: false,
      modal: false,
      formError: []
    };
  },
  computed: {
    surgeryId() {
      return this.$store.getters["sign-up/surgeryId"];
    },
    search_results() {
      return this.$store.getters["sign-up/search_results"];
    }
  },
  mounted() {
    if (
      this.search_results &&
      this.search_results.length > 0 &&
      this.surgeryId
    ) {
      this.surgeries = this.search_results;
      this.selectedSurgeryId = this.surgeryId;
      this.showResult = true;
    }
  },
  methods: {
    search() {
      this.formError = [];
      if (!this.search_text) {
        this.formError.push({
          field: "search_text",
          message: "Try with whole words, practice code or CCG."
        });
        this.showResult = false;
      } else {
        this.$axios
          .$get(
            `/api/v1/surgeries?search=${this.search_text}&has_parent=false&is_parent=false&limit=10`
          )
          .then(res => {
            this.surgeries = res.data.surgeries;
            this.showResult = true;
          });
      }
    },
    inputManually() {
      this.$store.commit("sign-up/SET_PRACTICE_DETAILS", {
        search_results: null,
        surgery_id: null,
        name: null,
        phone_number: null,
        code: null,
        clinical_commissioning_group_name: null,
        address_line_1: null,
        address_line_2: null,
        address_line_3: null,
        address_line_4: null,
        address_line_5: null,
        postcode: null,
        coordinates_x: null,
        coordinates_y: null
      });
      this.$store.commit("sign-up/SET_PRACTICE_SURGERY_DETAILS", {
        name: null,
        phone_number: null,
        code: null,
        clinical_commissioning_group_name: null,
        address_line_1: null,
        address_line_2: null,
        address_line_3: null,
        address_line_4: null,
        address_line_5: null,
        postcode: null,
        coordinates_x: null,
        coordinates_y: null
      });
      this.$emit("nextTab", "PracticeSurgeryDetails");
    },
    inputAutomatically() {
      let item = this.surgeries.find(
        item => item.id === this.selectedSurgeryId
      );
      this.$store.commit("sign-up/SET_PRACTICE_DETAILS", {
        surgery_id: item.id,
        name: item.name,
        phone_number: item.phone_number,
        code: item.code,
        clinical_commissioning_group_name:
          item.clinical_commissioning_group.name,
        address_line_1: item.address_line_1,
        address_line_2: item.address_line_2,
        address_line_3: item.address_line_3,
        address_line_4: item.address_line_4,
        address_line_5: item.address_line_5,
        postcode: item.address.post_code,
        coordinates_x: item.address.coordinates
          ? item.address.coordinates.x
          : null,
        coordinates_y: item.address.coordinates
          ? item.address.coordinates.y
          : null,
        search_results: this.surgeries
      });
      this.$emit("nextTab", "PracticeSurgeryDetails");
    }
  }
};
</script>
