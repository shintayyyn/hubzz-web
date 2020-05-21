<template>
  <div class="py-2">
    <AppButton
      v-if="surgeries && surgeries.length > 0"
      :label="'Share my banks'"
      class="bg-yellow-500 text-sm"
      :inStyle="'padding:5px 14px;margin-left:5px;'"
      @click="shareMyBanks"
    />
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
      <template v-slot:shared="slotProps">
        <div
          v-if="true"
          class="flex flex-row flex-wrap justify-center"
          @click="slotProps.item.invitation_rejected ? null : checkItem(slotProps.item.id)"
        >
          <input
            type="checkbox"
            :checked="selectedItems.includes(slotProps.item.id)"
            :disabled="slotProps.item.invitation_rejected"
          />
          <label class="text-xs sm:text-sm py-1 flex items-center" />
        </div>
      </template>
    </AppTable>
    <div v-else class="flex justify-center py-4 text-gray-500">You do not have any spokes.</div>
    <transition name="fade" mode="out-in">
      <nuxt-link
        v-if="$route.name.includes('hub-surgery-management-id')"
        :to="`/hub-surgery-management`"
        class="shield"
      />
    </transition>
  </div>
</template>
<script>
import AppConfirmationModal from "@/components/Base/AppConfirmationModal";
import AppTable from "@/components/Base/AppTable";
import AppButton from "@/components/Base/AppButton";
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },
  components: {
    AppConfirmationModal,
    AppTable,
    AppButton
  },
  data() {
    return {
      surgeries: [],
      loading: false,
      current_page: 1,
      params: {
        offset: 0,
        limit: 5,
        order_by: [],
        is_invitation_accepted: true
      },
      columns: [
        {
          name: "Shared my banks",
          dataIndex: "shared",
          class: "text-center"
        },
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
  async asyncData({ app, error }) {
    try {
      const responsePracticeType = await app.$axios.$get(
        `/api/v1/practice/me/practice-type`
      );
      let practice =
        responsePracticeType.data && responsePracticeType.data.practice
          ? responsePracticeType.data.practice
          : null;

      let surgeries = [];
      let selectedItems = [];
      let totalSurgeries = 0;

      const responseCount = await app.$axios.$get(
        `/api/v1/practice/me/practice-surgeries/count`,
        {
          params: {
            is_invitation_accepted: true
          }
        }
      );

      totalSurgeries =
        responseCount.data && responseCount.data.count
          ? responseCount.data.count
          : 0;

      const response = await app.$axios.$get(
        `/api/v1/practice/me/practice-surgeries?limit=5`,
        {
          params: {
            is_invitation_accepted: true
          }
        }
      );
      if (response.data && response.data.practice_surgeries) {
        response.data.practice_surgeries.forEach(surgery => {
          surgeries.push(surgery);
          if (surgery.share_my_banks === true) {
            selectedItems.push(surgery.id);
          }
          // surgeries.push({ ...surgery, removable: true });
        });
      }

      return {
        practice,
        surgeries,
        selectedItems,
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
    this.addSocketListeners();
  },
  destroyed() {
    this.removeSocketListener();
  },
  methods: {
    addSocketListeners() {
      this.$socket.on(
        "Practice Notification Accept Surgery",
        this.getSurgeriesCount
      );
    },
    removeSocketListener() {
      this.$socket.removeListener(
        "Practice Notification Accept Surgery",
        this.getSurgeriesCount
      );
    },
    shareMyBanks() {
      this.$axios
        .$put(
          `/api/v1/practice/me/practice-surgeries/parent-practice/${this.practice.id}`,
          { surgeryIds: this.selectedItems }
        )
        .then(() => {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`Sharing MyBanks Update Success`]
          });
        });
    },
    checkItem(childPracticeId) {
      let index = this.selectedItems.findIndex(
        item => item === childPracticeId
      );
      if (index >= 0) {
        this.selectedItems = this.selectedItems.filter(
          item => item !== childPracticeId
        );
      } else if (index < 0) {
        this.selectedItems.push(childPracticeId);
      }
    },
    getSurgeriesCount(params) {
      this.$axios
        .$get(`/api/v1/practice/me/practice-surgeries/count`, { params })
        .then(res => {
          this.totalSurgeries = res.data.count;
          this.getSurgeries(this.params);
        })
        .catch(err => {
          console.log(err);
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
          this.selectedItems = [];
          this.surgeries.forEach(surgery => {
            if (surgery.share_my_banks === true) {
              this.selectedItems.push(surgery.id);
            }
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
        case "Rejected":
          return "bg-red-600 text-white";
        case "Termination Requested":
          return "bg-orange-500 text-white";
        case "Terminated":
          return "bg-red-700 text-white";
        default:
          return "bg-yellow-400 text-black";
      }
    }
  }
};
</script>