<template>
  <div class="flex flex-col items-center justify-center w-full">
    <div class="flex w-full justify-center xl:justify-start">
      <div class="mx-4 flex flex-col p-8 m-1 rounded-lg shadow-lg w-full">
        <div class="w-full">
          <AppInput
            v-model="search_text"
            :type="'text'"
            :name="'search_text'"
            :label="'Search for a Practice'"
            :error="this.formError.find(item => item.field === 'search_text')"
            :placeholder="'Practice code, name of practice'"
          />
        </div>
        <AppButton :label="'Search'" @click="search" :inStyle="'padding:5px 14px;'" />
      </div>
    </div>

    <div v-if="showResult && surgeries.length === 0" class="mt-5 mx-4">
      <div
        class="text-xs xl:text-base font-bold"
      >No practice matched that name. Try again with whole words, practice code or CCG.</div>
    </div>

    <div class="flex w-full justify-center xl:justify-start">
      <div
        class="rounded-lg shadow-lg mt-5 mx-4 m-1 w-full"
        v-if="showResult && surgeries.length > 0"
      >
        <div
          class="text-xs lg:text-base font-bold p-4"
        >Select by clicking on the practice that you wish to add</div>
        <div
          class="border-t-2 p-4 cursor-pointer"
          :class="selectedSurgeryId === item.id ? 'bg-yellow-500':'hover:bg-gray-400'"
          v-for="(item) in surgeries"
          :key="item.id"
          @click="selectedSurgeryId = item.id"
        >
          <div class="flex flex-col justify-start text-xs xl:text-base">
            <div class="font-bold">{{item.name}}</div>
            <div
              class="mt-4"
            >{{item.address.line_1}}, {{item.address.line_2}}, {{item.address.line_3}}, {{item.address.post_code}}</div>
            <div class="flex flex-row flex-no-wrap mt-1">
              <div class="rounded-lg bg-gray-300 py-1 px-2 mr-1">CCG</div>
              <div class="flex items-center">{{item.clinical_commissioning_group.name}}</div>
            </div>
            <div class="flex flex-row flex-no-wrap mt-1">
              <div class="rounded-lg bg-gray-300 py-1 px-2 mr-1">Practice Code</div>
              <div class="flex items-center">{{item.code}}</div>
            </div>
          </div>
        </div>
        <div class="border-t-2 p-4 text-xs xl:text-base">
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
      <AppButton class="rounded-lg shadow-lg" :label="'Next'" @click="next" />
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
      return this.$store.state.signUp.practice_details.surgery_id;
    },
    search_results() {
      return this.$store.state.signUp.search_results;
    }
  },
  mounted() {
    console.log(window.scrollY);
    if (this.search_results.length > 0 && this.surgeryId) {
      this.surgeries = this.search_results;
      this.selectedSurgeryId = this.surgeryId;
      this.showResult = true;
    }
  },
  watch: {
    "form.search_text"(value) {
      // splice from formerror
      let index = this.formError.findIndex(
        item => item.field === "search_text"
      );
      if (index >= 0) {
        this.formError.splice(index, 1);
      }
      // validate
      if (!value) {
        // required
        this.formError.push({
          field: "search_text",
          message: "Try with whole words, practice code or CCG."
        });
      }
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
    next() {
      try {
        let item = this.surgeries.find(
          item => item.id === this.selectedSurgeryId
        );
        this.$store.commit("signUp/SET_PRACTICE_DETAILS", {
          surgery_id: item.id,
          search_results: this.surgeries
        });
        this.$emit("nextTab", "PracticeAccountDetails");
      } catch (e) {}
    }
  }
};
</script>
<style scoped>
/* .add-surgery-confirmation-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: auto;
  z-index: 514;
}
.shield {
  z-index: 513;
} */
</style>
