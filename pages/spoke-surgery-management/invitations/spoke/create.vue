<template>
  <div class="modal-container shadow-lg p-4 md:p-8">
    <nuxt-link :to="`/spoke-surgery-management/invitations/spoke`" class="mb-2 cursor-pointer">
      <svgicon name="left-arrow" height="32" width="32" class="cursor-pointer" />
    </nuxt-link>
    <div class="flex justify-start font-bold text-sm sm:text-xl mt-8">Invite Hub</div>
    <div class="relative bg-white rounded-lg shadow-lg p-4 md:p-8 mt-4 max-w-5xl">
      <AppInput
        v-model="search_text"
        :type="'text'"
        :name="'search'"
        :placeholder="'Surgery Name, Surgery Code, or keywords'"
        @submit="search"
        :error="formError.find(item => item.field === 'surgery_id')"
      />
      <AppButton :label="'Search'" @click="search" :inStyle="'padding:5px 14px;'" />
    </div>

    <div v-if="showResult && practiceHubs.length === 0" class="mt-5">
      <div class="text-xs xl:text-base font-bold">{{ resultNotice }}</div>
    </div>
    <div
      class="rounded-lg shadow-lg overflow-auto mt-5 bg-white"
      v-if="showResult && practiceHubs.length > 0"
    >
      <div
        class="text-xs lg:text-base font-bold p-4"
      >Select by clicking on the practice that you wish to add</div>

      <div
        class="border-t-2 p-4 cursor-pointer hover:bg-gray-400"
        v-for="(item) in practiceHubs"
        :key="item.id"
        @click="select(item)"
      >
        <div class="flex flex-col justify-start text-xs xl:text-base">
          <div class="flex flex-col font-bold">
            <div>
              <span>{{item.surgery.name}}</span>
              <span
                class="p-1 px-4 rounded-lg text-sm mx-2 text-white"
                :class="item.type == 'Spoke' ? 'bg-blue-400' : 'bg-purple-400'"
              >{{item.type}}</span>
              <span
                v-if="item.invited === true"
                class="justify-right p-1 px-4 text-sm text-white font-semibold rounded-lg bg-green-400"
              >Invited</span>
            </div>
          </div>
          <div class="flex flex-row flex-no-wrap mt-1">
            <div class="rounded-lg bg-gray-300 py-1 px-2 mr-1">CCG</div>
            <div
              class="flex items-center"
            >{{item.surgery.clinical_commissioning_group ? item.surgery.clinical_commissioning_group.name : 'N/A'}}</div>
          </div>
          <div class="flex flex-row flex-no-wrap mt-1">
            <div class="rounded-lg bg-gray-300 py-1 px-2 mr-1">Practice Code</div>
            <div class="flex items-center">{{item.surgery.code}}</div>
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

    <AppConfirmationModal
      :label="'Proceed to invite this Hub?'"
      :confirmLabel="'Yes'"
      :cancelLabel="'Cancel'"
      :modal="toggle_invite_modal"
      @confirm="invite"
      @cancel="toggle_invite_modal = false"
    />
  </div>
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
      selectedPracticeId: null,
      search_text: "",
      showResult: false,
      toggle_invite_modal: false,
      practiceHubs: [],
      formError: [],
      resultNotice:
        "No practice matched that name. Try again with whole words, practice code or CCG."
    };
  },
  methods: {
    search() {
      if (this.search_text) {
        this.$axios
          .$get(
            `/api/v1/practice/practice-spokes?search=${this.search_text}&limit=10`,
            {
              params: {
                practice_type: "Hub"
              }
            }
          )
          .then(res => {
            this.practiceHubs =
              res.data && res.data.practices ? res.data.practices : [];
            this.showResult = true;
          })
          .catch(err => {
            console.log(err);
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "danger",
              text: ["Something went wrong!"]
            });
          });
      }
    },
    select(item) {
      this.selectedPracticeId = item.id;
      this.toggle_invite_modal = true;
    },
    invite() {
      this.$axios
        .$post(`/api/v1/practice/me/parent-surgery/invite`, {
          practice_id: this.selectedPracticeId
        })
        .then(res => {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`${res.message}`]
          });
          this.$router.push(`/spoke-surgery-management/invitations/spoke`);
          this.$emit("getPracticeHub");
        })
        .catch(err => {
          if (err.response.status === 400 && err.response.data.message) {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "danger",
              text: [err.response.data.message]
            });
          }
        })
        .finally(() => {
          // this.modal = false;
          this.toggle_invite_modal = false;
        });
    }
  }
};
</script>
<style>
.modal-container {
  z-index: 510;
}
@media screen and (min-width: 1200px) {
  .modal-container {
    width: 70%;
  }
}
</style>