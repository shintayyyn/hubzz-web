<template>
  <div class="py-2 mt-2">
    <AppLoading :loading="loading" />

    <AppButton
      v-if="practiceSurgeries && practiceSurgeries.length > 0"
      :label="'Share my banks'"
      class="bg-yellow-500 text-sm"
      :inStyle="'padding:5px 14px;margin-left:5px;'"
      @click="shareMyBanks"
    />

    <AppTable
      v-if="practiceSurgeries.length > 0"
      :total="totalSurgeries"
      :items="practiceSurgeries"
      :loading="loading"
      :currentPage="currentPage"
      :perPage="limit"
      :columns="columns"
      :orderBy="orderBy"
      :customWidth="700"
      @pagechanged="pagechanged"
      @limitchanged="limitchanged"
      @sorted="sorted"
    >
      <template v-slot:status_slot="slotProps">
        <div class="text-sm">
          {{ getStatus(slotProps.item) }}
        </div>
      </template>

      <template v-slot:actions="slotProps">
        <div class="flex flex-wrap justify-center">
          <AppButton
            :label="'View'"
            class="m-1"
            @click="
              $router.push({
                path: `/hub-surgery-management/${slotProps.item.id}`
              })
            "
          />

          <AppButton
            v-if="
              getStatus(slotProps.item) === 'Invited' ||
                getStatus(slotProps.item) === 'Rejected'
            "
            :label="
              getStatus(slotProps.item) === 'Invited'
                ? 'Cancel Invitation'
                : 'Remove'
            "
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
          @click="
            slotProps.item.invitation_rejected
              ? null
              : toggleItem(slotProps.item.id)
          "
        >
          <input
            type="checkbox"
            :checked="selectedItems.includes(slotProps.item.id)"
            :disabled="slotProps.item.invitation_rejected"
          >

          <label class="text-xs sm:text-sm py-1 flex items-center" />
        </div>
      </template>
    </AppTable>

    <div v-else class="flex justify-center py-4 text-gray-500">
      You do not have any spokes.
    </div>

    <!-- <transition name="fade" mode="out-in">
      <nuxt-link
        v-if="$route.name.includes('hub-surgery-management-id')"
        :to="`/hub-surgery-management`"
        class="shield"
      />
    </transition> -->
  </div>
</template>

<script>
import AppLoading from "@/components/Base/AppLoading";
import AppTable from "@/components/Base/AppTable";
import AppButton from "@/components/Base/AppButton";

export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },

  components: {
    AppLoading,
    AppTable,
    AppButton
  },

  data() {
    return {
      practiceSurgeries: [],
      selectedItems: [],
      loading: false,
      currentPage: 1,
      limit: 10,
      orderBy: [],
      columns: [
        {
          name: "Shared my banks",
          dataIndex: "shared",
          class: "text-center",
          width: 150
        },
        {
          name: "Surgery",
          dataIndex: "child_practice.surgery.name",
          class: "text-left"
          // sortable: true,
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
          class: "text-center",
          width: 120
        }
      ]
    };
  },

  computed: {
    offset() {
      return this.limit * (this.currentPage - 1);
    },

    practice() {
      return this.$auth.loggedIn &&
        this.$auth.user &&
        this.$auth.user.practice_detail &&
        this.$auth.user.practice_detail.practice
        ? this.$auth.user.practice_detail.practice
        : null;
    }
  },

  mounted() {
    this.$socket.on(
      "Practice Notification Accept Surgery",
      this.getPracticeSurgeries
    );
    this.getPracticeSurgeries();
  },

  destroyed() {
    this.$socket.removeListener(
      "Practice Notification Accept Surgery",
      this.getPracticeSurgeries
    );
  },

  methods: {
    shareMyBanks() {
      this.$axios
        .put(
          `/api/v1/practice/me/practice-surgeries/parent-practice/${this.practice.id}`,
          {
            surgeryIds: this.selectedItems
          }
        )
        .then(() => {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`Sharing MyBanks Update Success`]
          });
        });
    },

    toggleItem(practiceSurgeryId) {
      const index = this.selectedItems.findIndex(
        id => id === practiceSurgeryId
      );

      if (index > -1) {
        this.selectedItems.splice(index, 1);
      } else {
        this.selectedItems.push(practiceSurgeryId);
      }
    },

    getPracticeSurgeries() {
      this.loading = true;
      Promise.all([
        this.$axios
          .get("/api/v1/practice/me/practice-surgeries/count", {
            cache: true,
            params: {
              is_invitation_accepted: true
            }
          })
          .then(response => response.data.data.count),

        this.$axios
          .get("/api/v1/practice/me/practice-surgeries", {
            cache: true,
            params: {
              is_invitation_accepted: true,
              order_by: this.orderBy,
              limit: this.limit,
              offset: this.offset
            }
          })
          .then(response => response.data.data.practice_surgeries)
      ])
        .then(([practiceSurgeriesCount, practiceSurgeries]) => {
          this.totalSurgeries = practiceSurgeriesCount;

          this.practiceSurgeries = practiceSurgeries.map(practiceSurgery => {
            practiceSurgery.status = this.getStatus(practiceSurgery);
            return practiceSurgery;
          });

          this.selectedItems = this.practiceSurgeries
            .filter(practiceSurgery => practiceSurgery.share_my_banks)
            .map(practiceSurgery => practiceSurgery.id);
        })
        .catch(err => {
          console.log("err", err.response || err);
        })
        .finally(() => {
          this.loading = false;
        });
    },

    sorted(orderBy) {
      this.currentPage = 1;
      this.orderBy = orderBy;
      this.getPracticeSurgeries();
    },

    pagechanged(page) {
      this.currentPage = page;
      this.getPracticeSurgeries();
    },

    limitchanged(limit) {
      this.currentPage = 1;
      this.limit = limit;
      this.getPracticeSurgeries();
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
