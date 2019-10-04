<template>
  <section>
    <div class="flex flex-col">
      <div>
        <nuxt-link
        to="/profile/branches-surgeries/create"
        class="inline-flex no-underline py-2 px-4 bg-yellow-500 text-sm font-semibold text-black hover:text-white rounded-lg shadow float-left"
        >Add Surgery</nuxt-link>
      </div>
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
          <template v-for="item in surgeries">
            <tr class="__job-card rounded-lg shadow-lg p-4 mt-4 cursor-pointer" :key="item.id">
              <td
                @click="show(item.id)"
                class="text-xs sm:text-sm px-1 rounded-l-lg"
              >{{item.surgery.name}}</td>
              <td @click="show(item.id)" class="text-xs sm:text-sm px-1">{{item.surgery.code}}</td>
              <td
                @click="show(item.id)"
                class="text-xs sm:text-sm px-1"
              >{{item.pay_for_surgery ? 'Yes':'No'}}</td>
              <td
                @click="show(item.id)"
                class="text-xs sm:text-sm px-1"
              >{{item.verify_job_creation ? 'Verified':'Not Verified'}}</td>
              <td class="w-10 text-xs sm:text-sm px-1 rounded-r-lg text-center">
                <div
                  @click="removeModal(item.id)"
                  class="cursor-pointer font-bold text-xs sm:text-sm"
                >X</div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <div v-else class="flex justify-center">no branches / surgeries</div>
    <transition name="fade" mode="out-in">
      <div
        class="shield"
        v-if="['profile-branches-surgeries-create',
          'profile-branches-surgeries-id-index',
          'profile-branches-surgeries-id-index-surgery-billings',
          'profile-branches-surgeries-id-index-surgery-sessions',
          'profile-branches-surgeries-id-index-surgery-sessions-index-live',
          'profile-branches-surgeries-id-index-surgery-sessions-index-applied',
          'profile-branches-surgeries-id-index-surgery-sessions-index-allocated',
          'profile-branches-surgeries-id-index-surgery-sessions-index-completed',
          'profile-branches-surgeries-id-index-surgery-sessions-index-unfilled',
          'profile-branches-surgeries-id-index-surgery-sessions-index-cancelled',
          'profile-branches-surgeries-id-index-surgery-sessions-index-declined',
          'profile-branches-surgeries-edit'].includes($route.name)"
      ></div>
    </transition>
    <nuxt-child />
    <RemoveSurgeryConfirmationModal
      :label="'Are you sure you want to delete this surgery?'"
      :confirmLabel="'Yes'"
      :cancelLabel="'Cancel'"
      :modal="modal"
      :terminationReason="''"
      @setReason="setExpulsionReason"
      @confirm="remove"
      @cancel="modal = false"
    />
  </section>
</template>
<script>
import AddSurgeryModal from "@/components/Profile/AddSurgeryModal";
import RemoveSurgeryConfirmationModal from "@/components/Profile/RemoveSurgeryConfirmationModal"
import AppConfirmationModal from "@/components/Base/AppConfirmationModal";

export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },
  components: {
    AddSurgeryModal,
    RemoveSurgeryConfirmationModal,
    AppConfirmationModal
  },

  data() {
    return {
      current_page: 1,
      modal: false,
      selectedSurgeryId: "",
      terminationReason: ""
    };
  },
  computed: {
    surgeries() {
      return this.$store.state.profile.surgeries;
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
      store.commit("profile/SET_SURGERIES", surgeries);
      return {
        practice
      };
    } catch (err) {
      throw err;
    }
  },
  methods: {
    show(id) {
      if (this.practice.type === "Hub") {
        this.$router.push(`/profile/branches-surgeries/${id}`);
      } else if (this.practice.type === "Spoke") {
        this.$router.push(`/profile/branches-surgeries/edit`);
      }
    },
    removeModal(id) {
      this.selectedSurgeryId = id;
      this.modal = true;
    },
    async remove() {
      console.log('reason',this.terminationReason)
      if (this.practice.type === "Hub") {
        await this.$axios.$delete(
          `/api/v1/practice/me/practice-surgeries/${this.selectedSurgeryId}`
        );
      } else if (this.practice.type === "Spoke") {
        await this.$axios.$delete(`/api/v1/practice/me/parent-surgery`);
      }
      this.$store.commit("profile/REMOVE_SURGERY", this.selectedSurgeryId);
      this.modal = false;
      this.selectedSurgeryId = "";
      this.$store.commit("SET_NOTIFICATION", {
        enabled: true,
        status: "success",
        text: ["Practice Surgery Deleted Successfully"]
      });
    },
    setExpulsionReason(terminationReason){
      this.terminationReason = terminationReason
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

