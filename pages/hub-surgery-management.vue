<template>
  <section>
    <div class="flex flex-col">
      <div>
        <nuxt-link
          to="/hub-surgery-management/create"
          class="inline-flex no-underline py-2 px-4 bg-yellow-500 text-sm font-semibold text-black hover:text-white rounded-lg shadow float-left"
        >Invite Spoke</nuxt-link>
      </div>
    </div>

    <AppTable
      v-if="surgeries.length > 0"
      :total="totalSurgeries"
      :items="surgeries"
      :loading="loading"
      :currentPage="current_page"
      :perPage="params.limit"
      :columns="columns"
      :orderBy="params.order_by"
      :customWidth="700"
      @pagechanged="pagechanged"
      @limitchanged="limitchanged"
      @sorted="sorted"
    >
      <template v-slot:status_slot="slotProps">
        <div class="flex items-center justify-center">
          <div
            class="rounded-full px-6 py-1"
            :class="statusStyle(slotProps.item)"
          >{{ getStatus(slotProps.item) }}</div>
        </div>
      </template>

      <template v-slot:actions="slotProps">
        <div class="flex flex-wrap justify-center">
          <AppButton
            :label="'View'"
            class="m-1"
            @click="$router.push({ path: `/hub-surgery-management/${slotProps.item.id}`})"
          />
          <AppButton
            v-if="getStatus(slotProps.item) === 'Invited' || getStatus(slotProps.item) === 'Rejected'"
            :label="getStatus(slotProps.item) === 'Invited' ? 'Cancel Invitation' : 'Remove'"
            class="m-1"
            :customTheme="'bg-red-600 hover:bg-red-700 text-white font-bold'"
            @click="toCancelInvitation(slotProps.item.id)"
          />
        </div>
      </template>
    </AppTable>
    <div v-else class="flex justify-center py-4 text-gray-500">No Branches / Surgeries</div>
    <AppConfirmationModal
      :label="'Are you sure you want to cancel your invitation?'"
      :confirmLabel="'Yes'"
      :cancelLabel="'Cancel'"
      :modal="modal"
      @confirm="remove"
      @cancel="modal = false"
    />
    <transition name="fade" mode="out-in">
      <nuxt-link
        v-if="$route.name === 'hub-surgery-management-create' || $route.name.includes('hub-surgery-management-id')"
        :to="`/hub-surgery-management`"
        class="shield"
      />
    </transition>
    <nuxt-child @addSurgery="surgeries.push($event)" @updateSurgery="updateSurgery" />
  </section>
</template>
<script>
import AddSurgeryModal from "@/components/Profile/AddSurgeryModal";
import RemoveSurgeryConfirmationModal from "@/components/Profile/RemoveSurgeryConfirmationModal";
import AppConfirmationModal from "@/components/Base/AppConfirmationModal";
import AppTable from "@/components/Base/AppTable";
import AppButton from "@/components/Base/AppButton";

export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },
  components: {
    // AddSurgeryModal,
    // RemoveSurgeryConfirmationModal,
    AppConfirmationModal,
    AppTable,
    AppButton
  },

  data() {
    return {
      modal: false,
      selectedSurgeryId: "",
      //
      current_page: 1,
      surgeries: [],
      terminationReason: "",
      totalSurgeries: 0,
      loading: false,
      // app table filter
      sampleFilter: [],
      // app table params
      params: {
        offset: 0,
        limit: 5,
        order_by: []
      },
      // for app table component
      columns: [
        {
          name: "Surgery",
          dataIndex: "child_practice.surgery.name",
          class: "text-left"
          // sortable: true
        },
        {
          name: "Practice Code",
          dataIndex: "child_practice.surgery.code",
          class: "text-center"
        },
        {
          name: "Status",
          slot: true,
          slotName: "status_slot",
          dataIndex: "",
          class: "text-center"
        },
        {
          name: "Actions",
          dataIndex: "actions",
          class: "text-center"
        }
      ]
    };
  },
  computed: {
    authPermissions() {
      return this.$store.getters["permissions"];
    }
  },
  async asyncData({ app, store, error }) {
    try {
      const responsePracticeType = await app.$axios.$get(
        `/api/v1/practice/me/practice-type`
      );
      let practice =
        responsePracticeType.data && responsePracticeType.data.practice
          ? responsePracticeType.data.practice
          : null;

      let surgeries = [];
      let parent_surgery = null;
      let totalSurgeries = 0;

      const responseCount = await app.$axios.$get(
        `/api/v1/practice/me/practice-surgeries/count`
      );

      totalSurgeries =
        responseCount.data && responseCount.data.count
          ? responseCount.data.count
          : 0;

      const response = await app.$axios.$get(
        `/api/v1/practice/me/practice-surgeries?limit=5`
      );
      if (response.data && response.data.practice_surgeries) {
        response.data.practice_surgeries.forEach(surgery => {
          surgeries.push(surgery);
          // surgeries.push({ ...surgery, removable: true });
        });
      }

      return {
        practice,
        surgeries,
        totalSurgeries
      };
    } catch (err) {
      if (err.response && err.response.status === 401) {
        error(err.response.data);
        return;
      }
      throw err;
    }
  },
  mounted() {
    this.$socket.on(
      "Practice Notification Accept Surgery",
      this.getSurgeriesRealTime
    );
    this.$socket.on(
      "Practice Notification Create Surgery",
      this.getSurgeriesRealTime
    );
    this.$socket.on(
      "Practice Notification Update Surgery",
      this.getSurgeriesRealTime
    );
    this.$socket.on(
      "Practice Notification Delete Surgery",
      this.getSurgeriesRealTime
    );
  },
  async created() {
    await this.surgeries.map(surgery => {
      surgery.status = this.getStatus(surgery);
    });
  },
  methods: {
    getSurgeriesRealTime() {
      this.getSurgeriesCount(this.params);
    },
    removeListener() {
      this.$socket.removeListener(
        "Practice Notification Accept Surgery",
        getSurgeriesRealTime
      );
      this.$socket.removeListener(
        "Practice Notification Create Surgery",
        getSurgeriesRealTime
      );
      this.$socket.removeListener(
        "Practice Notification Update Surgery",
        getSurgeriesRealTime
      );
      this.$socket.removeListener(
        "Practice Notification Delete Surgery",
        getSurgeriesRealTime
      );
    },
    getSurgeriesCount(params) {
      this.$axios
        .$get(`/api/v1/practice/me/practice-surgeries/count`, { params })
        .then(res => {
          this.totalSurgeries = res.data.count;
          this.getSurgeries(this.params);
        });
    },
    getSurgeries(params) {
      this.loading = true;
      this.$axios
        .$get(`/api/v1/practice/me/practice-surgeries`, { params })
        .then(res => {
          this.loading = false;
          this.surgeries = [];
          res.data.practice_surgeries.forEach(surgery => {
            surgery.status = this.getStatus(surgery);
            this.surgeries.push(surgery);
            // this.surgeries.push({ ...surgery, removable: true });
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    sorted(order_by) {
      this.current_page = 1;
      this.params.offset = 0;
      this.params.order_by = order_by;
      this.getSurgeries(this.params);
    },
    pagechanged(page) {
      this.current_page = page;
      this.params.offset = this.params.limit * (page - 1);
      this.getSurgeries(this.params);
    },
    limitchanged(limit) {
      this.current_page = 1;
      this.params.offset = 0;
      this.params.limit = limit;
      this.getSurgeries(this.params);
    },
    addSurgery(payload) {
      if (!this.surgeries.map(item => item.id).includes(payload.id)) {
        this.surgeries.push(payload);
      }
    },
    updateSurgery(payload) {
      this.getSurgeriesCount(this.params);
      // let index = this.surgeries.findIndex(
      // 	surgery => surgery.id === payload.id
      // );
      // if (index >= 0) {
      // 	this.surgeries.splice(index, 1, payload);
      // }
    },
    toCancelInvitation(id) {
      this.selectedSurgeryId = id;
      this.modal = true;
    },
    async remove() {
      this.loading = true;
      if (!this.authPermissions.includes("Delete Profile Surgeries")) {
        return;
      }
      console.log(this.selectedSurgeryId, this.practice.type);
      if (this.practice.type === "Hub") {
        await this.$axios
          .$delete(
            `/api/v1/practice/me/practice-surgeries/${this.selectedSurgeryId}`
          )
          .then(() => {
            this.loading = false;
            this.surgeries = this.surgeries.filter(
              surgery => surgery.id !== this.selectedSurgeryId
            );
            this.modal = false;
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: ["Invitation Successfully Deleted"]
            });
          })
          .catch(err => {
            this.loading = false;
            this.modal = false;
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "danger",
              text: [err.response.data.message]
            });
          });
      }
    },
    show(item) {
      if (this.authPermissions.includes("Show Profile Surgeries")) {
        if (this.practice.type === "Hub") {
          this.$router.push(`/profile/practice-spokes/${item.id}`);
        } else if (this.practice.type === "Spoke") {
          this.$router.push(`/profile/practice-spokes/edit`);
        }
      }
    },
    setExpulsionReason(terminationReason) {
      this.terminationReason = terminationReason;
    },
    getStatus(surgery) {
      let status = "Invited";
      if (surgery.terminated_at) {
        status = "Terminated";
      } else if (surgery.termination_requested_at) {
        if (surgery.invitation_accepted_at) {
          status = "Termination Requested";
        } else {
          status = "Cancellation Requested";
        }
      } else if (surgery.invitation_rejected_at) {
        status = "Rejected";
      } else if (surgery.invitation_accepted_at) {
        status = "Active";
      }
      return status;
    },
    statusStyle(surgery) {
      this.getStatus(surgery);
      switch (this.getStatus(surgery)) {
        case "Active":
          return "bg-green-500 text-white";
          break;
        case "Rejected":
          return "bg-red-600 text-white";
          break;
        case "Termination Requested":
          return "bg-orange-500 text-white";
          break;
        case "Terminated":
          return "bg-red-700 text-white";
          break;
        default:
          return "bg-yellow-400 text-black";
      }
    }
  }
};
</script>
<style scoped>
.list-section {
  position: relative;
  min-height: 600px;
}
</style>
