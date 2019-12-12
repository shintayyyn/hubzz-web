<template>
  <section>
    <AppConfirmationModal
      :label="'Proceed to add this surgery?'"
      :confirmLabel="'Yes'"
      :cancelLabel="'Cancel'"
      :modal="add_modal"
      @confirm="add"
      @cancel="add_modal = false"
    />

    <div class="p-4 md:p-8 max-w-5xl">
      <div @click="$emit('close')" class="cursor-pointer">
        <svgicon name="left-arrow" height="32" width="32" />
      </div>
      <div class="flex justify-start font-bold text-sm sm:text-xl mt-8">Add Surgery</div>
      <div class="rounded-lg shadow-lg px-4 md:px-8 py-4 mt-4">
        <AppInput
          v-model="search_text"
          :type="'text'"
          :name="'search'"
          :error="formError.find(item => item.field === 'search_text')"
          :placeholder="'Surgery Name, Surgery Code, or keywords'"
        />
        <AppButton :label="'Search'" @click="search" :inStyle="'padding:5px 14px;'" />
      </div>
      <div v-if="showResult && surgeries.length === 0" class="mt-5">
        <div
          class="text-xs xl:text-base font-bold"
        >No practice matched that name. Try again with whole words, practice code or CCG.</div>
      </div>
      <div
        class="rounded-lg shadow-lg overflow-auto mt-5"
        v-if="showResult && surgeries.length > 0"
      >
        <div
          class="text-xs lg:text-base font-bold p-4"
        >Select by clicking on the practice that you wish to add</div>
        <div
          class="border-t-2 p-4"
          :class="[selectedSurgeries.includes(item.id) ? 'bg-gray-200': selectedSurgery.id === item.id ? 'bg-yellow-500':'hover:bg-gray-400 cursor-pointer']"
          v-for="(item) in surgeries"
          :key="item.id"
          @click="select(item)"
        >
          <div class="relative flex flex-col justify-start text-xs xl:text-base">
            <span v-if="selectedSurgeries.includes(item.id)" class="absolute right-0">
              <svgicon name="success-checkmark" width="25" height="25" />
            </span>
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
  </section>
</template>
<script>
import AppInput from "@/components/Base/AppInput";
import AppButton from "@/components/Base/AppButton";
import AppConfirmationModal from "@/components/Base/AppConfirmationModal";
export default {
  components: {
    AppInput,
    AppButton,
    AppConfirmationModal
  },
  data() {
    return {
      search_text: "",
      surgeries: [],
      selectedSurgery: {},
      showResult: false,
      add_modal: false,
      formError: [],
      selectedSurgeries: []
    };
  },
  methods: {
    search() {
      if (!this.search_text) {
        this.formError.push({
          field: "search_text",
          message: "Search for surgery"
        });
      } else {
        this.$axios
          .$get(`/api/v1/locum/private-practices`)
          .then(res => {
            res.data.private_practices.find(item => {
              this.selectedSurgeries.push(item.surgery.id);
            });
          })
          .catch(err => {
            console.log("err", err.response || err);
            if (err.response.data.message) {
              this.$store.commit("SET_NOTIFICATION", {
                enabled: true,
                status: "danger",
                text: [`${err.response.data.message}`]
              });
            }
          });
        this.$axios
          .$get(
            `/api/v1/surgeries?search=${this.search_text}&has_parent=false&is_parent=false&limit=10`
          )
          .then(res => {
            this.surgeries = res.data.surgeries;
            this.showResult = true;
          })
          .catch(err => {
            console.log("err", err.response || err);
            if (err.response.data.message) {
              this.$store.commit("SET_NOTIFICATION", {
                enabled: true,
                status: "danger",
                text: [`${err.response.data.message}`]
              });
            }
          });
      }
    },
    select(item) {
      if (!this.selectedSurgeries.includes(item.id)) {
        this.selectedSurgery = item;
        this.add_modal = true;
      }
    },
    add() {
      this.$axios
        .$post(`/api/v1/locum/private-practices`, {
          surgery_id: this.selectedSurgery.id
        })
        .then(res => {
          this.$store.commit(
            "ADD_LOCUM_PRIVATE_PRACTICE",
            res.data.private_practice
          );
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`${res.message}`]
          });
          this.add_modal = false;
          this.$emit("close");
        })
        .catch(err => {
          console.log("err", err.response || err);
          if (err.response.data.message) {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "danger",
              text: [`${err.response.data.message}`]
            });
          }
        });
    }
  }
};
</script>

<style scoped>
</style>