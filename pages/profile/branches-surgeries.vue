<template>
  <section>
    <div class="flex overflow-x-auto whitespace-no-wrap">
      <button
        class="rounded-lg bg-yellow-500 p-2 cursor-pointer font-semibold text-xs sm:text-sm focus:outline-none"
        @click="$router.push('/profile/branches-surgeries/create')"
        v-if="authPermissions.includes('Create Profile Surgeries')"
      >Add Surgeries</button>
    </div>
    <div class="list-section flex flex-col mt-4 pb-32 overflow-x-auto" v-if="surgeries.length > 0">
      <table>
        <thead>
          <tr>
            <th class="text-xs sm:text-sm text-left px-1">Surgery</th>
            <th class="text-xs sm:text-sm text-left px-1">Practice code</th>
            <th class="text-xs sm:text-sm text-left px-1">Pay for surgery</th>
            <th class="text-xs sm:text-sm text-left px-1">Verify job creation</th>
            <th class="w-10"></th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(item, index) in surgeries">
            <tr
              @click="show(item)"
              class="__job-card rounded-lg shadow-lg p-4 mt-4 cursor-pointer"
              :key="item.id"
            >
              <td class="text-xs sm:text-sm px-1 rounded-l-lg">{{item.surgery.name}}</td>
              <td class="text-xs sm:text-sm px-1">{{item.surgery.code}}</td>
              <td class="text-xs sm:text-sm px-1">{{item.pay_for_surgery ? 'Yes':'No'}}</td>
              <td
                class="text-xs sm:text-sm px-1"
              >{{item.verify_job_creation ? 'Verified':'Not Verified'}}</td>
              <td class="w-10 text-xs sm:text-sm px-1 rounded-r-lg text-center">
                <div
                  v-if="authPermissions.includes('Delete Profile Surgeries')"
                  @click.stop.prevent="removeModal(item)"
                  class="cursor-pointer font-bold text-xs sm:text-sm"
                >X</div>
              </td>
            </tr>
            <tr :key="`${item.id}-${index}`">
              <td></td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <div v-else class="flex justify-center">no branches / surgeries</div>
    <transition name="fade" mode="out-in">
      <div
        class="shield"
        v-if="['profile-branches-surgeries-create', 'profile-branches-surgeries-id', 'profile-branches-surgeries-edit'].includes($route.name)"
      ></div>
    </transition>
    <nuxt-child @addSurgery="surgeries.push($event)" @updateSurgery="updateSurgery" />
    <AppConfirmationModal
      :label="'Are you sure you want to delete this surgery?'"
      :confirmLabel="'Yes'"
      :cancelLabel="'Cancel'"
      :modal="modal"
      @confirm="remove"
      @cancel="modal = false"
    />
  </section>
</template>
<script>
import AddSurgeryModal from "@/components/Profile/AddSurgeryModal";
import AppConfirmationModal from "@/components/Base/AppConfirmationModal";
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },
  components: {
    AddSurgeryModal,
    AppConfirmationModal
  },

  data() {
    return {
      current_page: 1,
      modal: false,
      selectedSurgeryId: "",
      surgeries: []
    };
  },
  computed: {
    authPermissions() {
      return this.$store.getters["auth/permissions"];
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
      if (practice.type === "Hub") {
        surgeries = practice.practice_surgeries;
      } else if (practice.type === "Spoke") {
        if (practice.parent_surgery) {
          let surgery = {
            id: practice.parent_surgery.id,
            pay_for_surgery: practice.pay_for_surgery,
            verify_job_creation: practice.verify_job_creation,
            surgery: practice.parent_surgery
          };
          surgeries.push(surgery);
        }
      }
      return {
        practice,
        surgeries
      };
    } catch (err) {
      throw err;
    }
  },
  methods: {
    show(item) {
      if (this.authPermissions.includes("Show Profile Surgeries")) {
        if (this.practice.type === "Hub") {
          this.$router.push(`/profile/branches-surgeries/${item.id}`);
        } else if (this.practice.type === "Spoke") {
          this.$router.push(`/profile/branches-surgeries/edit`);
        }
      }
    },
    removeModal(item) {
      if (this.authPermissions.includes("Delete Profile Surgeries")) {
        this.selectedSurgeryId = item.id;
        this.modal = true;
      }
    },
    async remove() {
      if (this.practice.type === "Hub") {
        await this.$axios.$delete(
          `/api/v1/practice/me/practice-surgeries/${this.selectedSurgeryId}`
        );
      } else if (this.practice.type === "Spoke") {
        await this.$axios.$delete(`/api/v1/practice/me/parent-surgery`);
      }
      this.surgeries = this.surgeries.filter(
        surgery => surgery.id !== this.selectedSurgeryId
      );
      this.modal = false;
      this.selectedSurgeryId = "";
      this.$store.commit("SET_NOTIFICATION", {
        enabled: true,
        status: "success",
        text: ["Practice Surgery Deleted Successfully"]
      });
    },
    updateSurgery(payload) {
      let index = this.surgeries.findIndex(
        surgery => surgery.id === payload.id
      );
      if (index >= 0) {
        this.surgeries.splice(index, 1, payload);
      }
    }
  }
};
</script>
<style scoped>
.shield {
  z-index: 509;
}
.list-section {
  position: relative;
  min-height: 600px;
}
</style>

