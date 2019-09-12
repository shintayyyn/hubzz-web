<template>
  <div class="modal-container shadow-lg">
    <AppConfirmationModal
      :label="'Proceed to add this surgery?'"
      :confirmLabel="'Yes'"
      :cancelLabel="'Cancel'"
      :modal="modal"
      @confirm="add"
      @cancel="modal = false"
    />

    <div class="p-8 max-w-3xl">
      <div @click="$router.push('/profile/branches-surgeries')" class="cursor-pointer">
        <svgicon name="left-arrow" height="32" width="32" />
      </div>
      <div class="flex justify-start font-bold text-sm sm:text-xl mt-8">Add Surgery</div>
      <div class="relative rounded-lg shadow-lg p-8 mt-4">
        <AppInput
          v-model="search_text"
          :type="'text'"
          :name="'search'"
          :placeholder="'Surgery Name, Surgery Code, or keywords'"
          @submit="search"
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
          class="border-t-2 p-4 cursor-pointer"
          :class="selectedSurgery.id === item.id ? 'bg-yellow-500':'hover:bg-gray-500'"
          v-for="(item) in surgeries"
          :key="item.id"
          @click="select(item)"
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
  </div>
</template>
<script>
import AppInput from "@/components/Base/AppInput";
import AppButton from "@/components/Base/AppButton";
import AppConfirmationModal from "@/components/Base/AppConfirmationModal";
export default {
  transition: {
    name: "slide",
    mode: "out-in"
  },
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
      modal: false,
      formError: []
    };
  },
  async asyncData({ app, error }) {
    try {
      const response = await app.$axios.$get(
        `/api/v1/practice/me/practice-type`
      );
      const type =
        response.data && response.data.practice && response.data.practice.type
          ? response.data.practice.type
          : null;
      return {
        type
      };
    } catch (err) {
      throw err;
    }
  },
  methods: {
    search() {
      if (!this.search_text) {
        return;
      } else {
        this.$axios
          .$get(
            `/api/v1/surgeries?search=${this.search_text}&has_parent=false&is_parent=false&limit=10`
          )
          .then(res => {
            this.surgeries = res.data.surgeries;
            this.showResult = true;
          })
          .catch(err => {
            console.log(err.response);
          });
      }
    },
    select(item) {
      console.log(item);
      this.formError = [];
      this.selectedSurgery = item;
      this.modal = true;
    },
    add() {
      console.log(this.type);
      if (this.type === "Hub") {
        this.$axios
          .$post(`/api/v1/practice/me/practice-surgeries`, {
            surgery_id: this.selectedSurgery.id
          })
          .then(res => {
            this.modal = false;
            this.$store.commit(
              "profile/ADD_SURGERY",
              res.data.practice_surgery
            );
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: [`${res.message}`]
            });
            this.$router.push("/profile/branches-surgeries");
          })
          .catch(err => {
            this.modal = false;
            this.formError = err.response.data.error_messages;
          });
      } else if (this.type === "Spoke") {
        this.$axios
          .$post(`/api/v1/practice/me/parent-surgery`, {
            surgery_id: this.selectedSurgery.id
          })
          .then(res => {
            this.modal = false;
            let surgery = {
              id: res.data.practice.parent_surgery.id,
              pay_for_surgery: res.data.practice.pay_for_surgery,
              verify_job_creation: res.data.practice.verify_job_creation,
              surgery: res.data.practice.parent_surgery
            };
            this.$store.commit("profile/ADD_SURGERY", surgery);
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: [`${res.message}`]
            });
            this.$router.push("/profile/branches-surgeries");
          })
          .catch(err => {
            this.modal = false;
            this.formError = err.response.data.error_messages;
          });
      }
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
.add-surgery-confirmation-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: auto;
  z-index: 514;
}
</style>

