<template>
  <section>
    <div class="flex flex-col">
      <div>
        <nuxt-link
          to="/surgery-management/practice-spokes/create"
          class="inline-flex no-underline py-2 px-4 bg-yellow-500 text-sm font-semibold text-black hover:text-white rounded-lg shadow float-left"
        >Invite Spoke</nuxt-link>
      </div>
    </div>

    <AppConfirmationModal
      :label="'Are you sure you want to cancel your invitation?'"
      :confirmLabel="'Yes'"
      :cancelLabel="'Cancel'"
      :modal="modal"
      @confirm="remove"
      @cancel="modal = false"
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
      :routerLink="'/surgery-management/practice-spokes'"
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
        <div
          v-if="getStatus(slotProps.item) === 'Invited' || getStatus(slotProps.item) === 'Rejected'"
          class="flex items-center justify-center"
          @click.stop.prevent="toCancelInvitation(slotProps.item.id)"
        >
          <div class="flex flex-row text-white bg-red-600 rounded-lg p-2 px-4">
            <div class="m-1">
              <!-- <svgicon
                name="cancel"
                height="15"
                width="15"
                color="white"
              />-->
            </div>
            <div>Cancel Invitation</div>
          </div>
        </div>
      </template>
    </AppTable>
    <div v-else class="flex justify-center py-4 text-gray-500">No Branches / Surgeries</div>
    <transition name="fade" mode="out-in">
      <div
        v-if="
          [
            'surgery-management-practice-spokes-create',
            'surgery-management-practice-spokes-id',
            'surgery-management-practice-spokes-id-surgery-sessions-index',
            'surgery-management-practice-spokes-id-surgery-sessions-index-sessionId',
            'surgery-management-practice-spokes-id-surgery-billings-index',
            'surgery-management-practice-spokes-id-surgery-billings-pension-forms-from-locums',
            'surgery-management-practice-spokes-id-surgery-billings-invoices-from-hubzz',
            'surgery-management-practice-spokes-id-surgery-banks',
            'surgery-management-practice-spokes-id-request-for-termination',
            'surgery-management-practice-spokes-edit',
            'surgery-management-practice-spokes-id-surgery-banks-locumId',
            'surgery-management-practice-spokes-id-surgery-billings-index-id',
            'surgery-management-practice-spokes-id-surgery-sessions-index',
            'surgery-management-practice-spokes-id-surgery-billings',
            'surgery-management-practice-spokes-id-surgery-billings-index-invoiceId'
          ].includes($route.name)
        "
        class="shield"
        @click="$router.push('/surgery-management/practice-spokes')"
      />
    </transition>
    <nuxt-child @addSurgery="surgeries.push($event)" @updateSurgery="updateSurgery" />
  </section>
</template>

<script>
import AppConfirmationModal from "@/components/Base/AppConfirmationModal";
import AppTable from "@/components/Base/AppTable";

export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },

  components: {
    AppConfirmationModal,
    AppTable
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
          class: "text-left",
          sortable: true
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

  // mounted () {
  //   this.$socket.on("Practice Notification Create Surgery", () => {
  //     this.getSurgeriesCount(this.params)
  //   })
  //   this.$socket.on("Practice Notification Practice Surgery Updated", surgery => {
  //     let index = this.surgeries.findIndex(item => item.id == surgery.id)
  //     if (index >= 0) {
  //       this.surgeries.splice(index, 1, surgery)
  //     }
  //   })
  //   this.$socket.on("Practice Notification Delete Surgery", () => {
  //     this.getSurgeriesCount(this.params)
  //   })
  // },

  async created() {
    await this.surgeries.map(surgery => {
      surgery.status = this.getStatus(surgery);
    });
  },

  methods: {
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
    updateSurgery() {
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
      if (
        !this.authPermissions.includes(
          "Invitation Processes Surgery Management"
        )
      ) {
        return;
      }
      if (this.practice.type === "Hub") {
        await this.$axios.$delete(
          `/api/v1/practice/me/practice-surgeries/${this.selectedSurgeryId}`
        );
      }
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
    },
    show(item) {
      if (
        this.authPermissions.includes("Invitation Processes Surgery Management")
      ) {
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

<style scoped>
.list-section {
  position: relative;
  min-height: 600px;
}
</style>
