<template>
  <div>
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
      <template v-slot:actions="slotProps">
        <div class="flex flex-wrap justify-center">
          <button
            class="rounded-lg px-4 py-1 shadow-lg focus:outline-none bg-yellow-500 font-bold m-1"
            @click="$router.push({ path: `/spoke-surgery-management/invitations/stand-alone/${slotProps.item.id}`})"
          >Accept</button>
          <button
            class="rounded-lg px-4 py-1 shadow-lg focus:outline-none bg-red-600 text-gray-200 font-bold m-1"
            @click="toggleRejectModal(slotProps.item.id)"
          >Reject</button>
        </div>
      </template>
    </AppTable>
    <div v-else class="flex justify-center py-4 text-gray-500">You do not have any invitation.</div>
    <AppConfirmationModal
      :label="'Are you sure you want to cancel your invitation?'"
      :confirmLabel="'Yes'"
      :cancelLabel="'Cancel'"
      :modal="toggle_reject_modal"
      @confirm="remove"
      @cancel="toggle_reject_modal = false"
    />
    <transition name="fade" mode="out-in">
      <div
        v-if="['spoke-surgery-management-invitations-stand-alone-invitationId'].includes($route.name)"
        class="shield"
        @click="$router.push('/spoke-surgery-management/invitations/stand-alone')"
      />
    </transition>
    <nuxt-child @acceptSpoke="acceptSpoke" />
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
      toggle_reject_modal: false,
      selectedSurgeryId: null,
      surgeries: [],
      totalSurgeries: 0,
      loading: false,
      current_page: 1,
      params: {
        offset: 0,
        limit: 5,
        order_by: []
      },
      columns: [
        {
          name: "Surgery",
          dataIndex: "name",
          class: "text-left"
        },
        {
          name: "Practice Code",
          dataIndex: "code",
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
      let surgeries = [];
      let totalSurgeries = 0;

      const resCount = await app.$axios.$get(
        `/api/v1/practice/me/practice-surgeries/spoke-invitations/count`
      );

      totalSurgeries =
        resCount.data && resCount.data.count ? resCount.data.count : 0;

      const res = await app.$axios.$get(
        `/api/v1/practice/me/practice-surgeries/spoke-invitations?limit=5`
      );

      if (res.data && res.data.invitations) {
        res.data.invitations.forEach(surgery => {
          surgeries.push(surgery);
        });
      }

      return {
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
  methods: {
    acceptSpoke(id) {
      let index = this.surgeries.findIndex(surgery => surgery.id === id);
      if (index >= 0) {
        this.surgeries.splice(index, 1);
      }
    },
    remove() {
      this.$axios
        .delete(`/api/v1/practice/practice-spokes/${this.selectedSurgeryId}`)
        .then(res => {
          let index = this.surgeries.findIndex(
            surgery => surgery.id === this.selectedSurgeryId
          );
          if (index >= 0) {
            this.surgeries.splice(index, 1);
          }
          this.toggle_reject_modal = false;
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: ["Reject Invitation Successfully"]
          });
        });
    },
    toggleRejectModal(id) {
      this.selectedSurgeryId = id;
      this.toggle_reject_modal = true;
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
    }
  }
};
</script>