<template>
  <div class="p-4">
    <template v-if="!hasParentPractice">
      <div v-if="practiceHub" class="flex flex-col md:flex-row w-full pb-2 md:pb-0">
        <div class="md:w-1/2">
          <p class="text-lg font-semibold">Practice Hub</p>
          <div class="flex flex-col mx-2">
            <div class="flex flex-col mt-4 md:flex-row w-full leading-tight">
              <p class="md:w-1/3 font-semibold">Practice Name</p>
              <p class="md:w-2/3 mx-2 md:mx-0">{{ practiceHub.surgery.name }}</p>
            </div>
            <div class="flex flex-col mt-4 md:flex-row w-full leading-tight">
              <p class="md:w-1/3 font-semibold">Practice Code</p>
              <p class="md:w-2/3 mx-2 md:mx-0">{{ practiceHub.code }}</p>
            </div>
            <div class="flex flex-col mt-4 md:flex-row w-full leading-tight">
              <p class="md:w-1/3 font-semibold">CCG</p>
              <p class="md:w-2/3 mx-2 md:mx-0">{{ practiceHub.clinical_commissioning_group_name }}</p>
            </div>
            <div class="flex flex-col mt-4 md:flex-row w-full leading-tight">
              <p class="md:w-1/3 font-semibold">Contact Number</p>
              <p class="md:w-2/3 mx-2 md:mx-0">{{ practiceHub.phone_number }}</p>
            </div>
            <div class="flex flex-col mt-4 md:flex-row w-full leading-tight">
              <div class="md:w-1/3 font-semibold">Address</div>
              <div class="md:w-2/3">
                <div
                  class="md:mx-0"
                >{{ practiceHub && practiceHub.address_line_1 ? practiceHub.address_line_1: null }}</div>
                <div
                  class="md:mx-0"
                >{{ practiceHub && practiceHub.address_line_2 ? practiceHub.address_line_2: null }}</div>
                <div
                  class="md:mx-0"
                >{{ practiceHub && practiceHub.address_line_3 ? practiceHub.address_line_3: null }}</div>
                <div
                  class="md:mx-0"
                >{{ practiceHub && practiceHub.address_line_4 ? practiceHub.address_line_4: null }}</div>
                <div
                  class="md:mx-0"
                >{{ practiceHub && practiceHub.address_line_5 ? practiceHub.address_line_5: null }}</div>
              </div>
            </div>

            <div class="flex flex-col md:flex-row w-full mt-2 leading-tight">
              <p class="md:w-1/3 font-semibold">Report To</p>
              <p
                class="md:w-2/3 mx-2 md:mx-0"
              >{{ practiceHub.report_to ? practiceHub.report_to : 'N/A' }}</p>
            </div>
            <div class="flex flex-col md:flex-row w-full mt-2 leading-tight">
              <p class="md:w-1/3 font-semibold">Email Address</p>
              <p class="md:w-2/3 mx-2 md:mx-0">{{ practiceHub.email ? practiceHub.email : 'N/A' }}</p>
            </div>
          </div>
          <AppButton
            :label="'Cancel Invitation'"
            class="mt-4"
            :inStyle="'padding:5px 14px;'"
            @click="toggle_cancel_invitation_modal = true"
          />
        </div>
      </div>
    </template>
    <template v-if="hasParentPractice">
      <div class="py-4 text-center text-gray-500">You already have Practice Hub</div>
    </template>
    <AppConfirmationModal
      :label="'Are you sure you want to cancel your invitation?'"
      :confirmLabel="'Yes'"
      :cancelLabel="'Cancel'"
      :modal="toggle_cancel_invitation_modal"
      @confirm="remove"
      @cancel="toggle_cancel_invitation_modal = false"
    />
    <transition name="fade" mode="out-in">
      <nuxt-link
        v-if="['spoke-surgery-management-invitations-spoke-create',].includes($route.name)"
        :to="'/spoke-surgery-management/invitations/spoke'"
        class="shield"
      />
    </transition>
    <nuxt-child />
  </div>
</template>
<script>
import AppConfirmationModal from "@/components/Base/AppConfirmationModal";
import AppButton from "@/components/Base/AppButton";
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },
  components: {
    AppConfirmationModal,
    AppButton
  },
  data() {
    return {
      hasParentPractice: false,
      toggle_cancel_invitation_modal: false,
      practiceHub: null
    };
  },
  async asyncData({ app, route, store }) {
    try {
      let res = await app.$axios.$get(`/api/v1/practice/me/parent-surgery`);

      let practiceHub =
        res.data && res.data.practice && res.data.practice.hub_practice
          ? res.data.practice.hub_practice
          : null;

      let hasParentPractice =
        res &&
        res.data &&
        res.data.practice &&
        res.data.practice.parent_practice_id
          ? res.data.practice.parent_practice_id
          : null;

      return {
        practiceHub,
        hasParentPractice: hasParentPractice ? true : false
      };
    } catch (err) {
      throw err;
    }
  },
  mounted() {
    this.addSocketListeners();
  },
  destroyed() {
    this.removeSocketListener();
  },
  methods: {
    addSocketListeners() {
      this.$socket.on(
        "Practice Notification Create Hub",
        this.getHubPromiseAll
      );
      this.$socket.on(
        "Practice Notification Delete Hub",
        this.getHubPromiseAll
      );
      this.$socket.on(
        "Practice Notification Accept Surgery",
        this.getHubPromiseAll
      );
      this.$socket.on(
        "Practice Notification Reject Hub",
        this.getHubPromiseAll
      );
    },
    removeSocketListener() {
      this.$socket.removeListener(
        "Practice Notification Create Hub",
        this.getHubPromiseAll
      );
      this.$socket.removeListener(
        "Practice Notification Delete Hub",
        this.getHubPromiseAll
      );
      this.$socket.removeListener(
        "Practice Notification Accept Surgery",
        this.getHubPromiseAll
      );
      this.$socket.removeListener(
        "Practice Notification Reject Hub",
        this.getHubPromiseAll
      );
    },
    getHubPromiseAll() {
      this.$axios.$get(`/api/v1/practice/me/parent-surgery`).then(res => {
        this.practiceHub =
          res.data && res.data.practice && res.data.practice.hub_practice
            ? res.data.practice.hub_practice
            : null;
        this.hasParentPractice =
          res &&
          res.data &&
          res.data.practice &&
          res.data.practice.parent_practice_id
            ? true
            : false;
      });
    },
    remove() {
      this.$axios
        .$delete(`/api/v1/practice/me/parent-surgery/invite`)
        .then(res => {
          this.practiceHub =
            res.data && res.data.practice && res.data.practice.hub_practice
              ? res.data.practice.hub_practice
              : null;
          this.toggle_cancel_invitation_modal = false;
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: ["Cancel Invitation Successfully"]
          });
        });
    }
  }
};
</script>