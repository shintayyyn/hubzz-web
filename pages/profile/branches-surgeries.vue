<template>
  <section>
    <div class="list-section flex flex-col mt-4 pb-32" v-if="surgeries.length > 0">
      <div class="flex flex-row px-4 flex-no-wrap justify-between">
        <div class="text-xs sm:text-sm w-full px-1">Surgery</div>
        <div class="text-xs sm:text-sm w-full px-1">Practice code</div>
        <div class="text-xs sm:text-sm w-full px-1">Pay for surgery</div>
        <div class="text-xs sm:text-sm w-full px-1">Verify job creation</div>
      </div>
      <div
        class="__job-card rounded-lg shadow-lg p-4 mt-4"
        v-for="item in surgeries"
        :key="item.id"
      >
        <div class="relative flex flex-row flex-no-wrap cursor-pointer">
          <div @click="show(item.id)" class="text-xs sm:text-sm w-full px-1">{{item.surgery.name}}</div>
          <div @click="show(item.id)" class="text-xs sm:text-sm w-full px-1">{{item.surgery.code}}</div>
          <div
            @click="show(item.id)"
            class="text-xs sm:text-sm w-full px-1"
          >{{item.pay_for_surgery ? 'Yes':'No'}}</div>
          <div
            @click="show(item.id)"
            class="text-xs sm:text-sm w-full px-1"
          >{{item.verify_job_creation ? 'Verified':'Not Verified'}}</div>
          <div @click="removeModal(item.id)" class="absolute right-0 font-bold text-xs sm:text-sm">X</div>
        </div>
      </div>
    </div>
    <div v-else class="flex justify-center">no branches / surgeries</div>
    <transition name="fade" mode="out-in">
      <div
        class="shield"
        v-if="['profile-branches-surgeries-create', 'profile-branches-surgeries-id', 'profile-branches-surgeries-edit'].includes($route.name)"
      ></div>
    </transition>
    <nuxt-child />
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
import AddSurgeryModal from '@/components/Profile/AddSurgeryModal'
import AppConfirmationModal from '@/components/Base/AppConfirmationModal'
export default {
  transition: {
    name: 'fade',
    mode: 'out-in'
  },
  components: {
    AddSurgeryModal,
    AppConfirmationModal,
  },

  data() {
    return {
      current_page: 1,
      modal: false,
      selectedSurgeryId: ''
    }
  },
  computed: {
    surgeries() {
      return this.$store.state.profile.surgeries
    },
  },
  async asyncData({ app, store, error }) {
    try {
      const responsePracticeType = await app.$axios.$get(`/api/v1/practice/me/practice-type`)
      let practice = responsePracticeType.data
        && responsePracticeType.data.practice
        ? responsePracticeType.data.practice
        : null

      let surgeries = []
      let parent_surgery = null
      if (practice.type === 'Hub') {
        surgeries = practice.practice_surgeries
      } else if (practice.type === 'Spoke') {
        if (practice.parent_surgery) {
          let surgery = {
            id: practice.parent_surgery.id,
            pay_for_surgery: practice.pay_for_surgery,
            verify_job_creation: practice.verify_job_creation,
            surgery: practice.parent_surgery
          }
          surgeries.push(surgery)
        }
      }
      store.commit('profile/SET_SURGERIES', surgeries)
      return {
        practice
      }
    } catch (err) {
      throw err
    }
  },
  methods: {
    show(id) {
      if (this.practice.type === 'Hub') {
        this.$router.push(`/profile/branches-surgeries/${id}`)
      } else if (this.practice.type === 'Spoke') {
        this.$router.push(`/profile/branches-surgeries/edit`)
      }
    },
    removeModal(id) {
      this.selectedSurgeryId = id
      this.modal = true
    },
    async remove() {
      if (this.practice.type === 'Hub') {
        await this.$axios.$delete(`/api/v1/practice/me/practice-surgeries/${this.selectedSurgeryId}`)
      } else if (this.practice.type === 'Spoke') {
        await this.$axios.$delete(`/api/v1/practice/me/parent-surgery`)
      }
      this.$store.commit('profile/REMOVE_SURGERY', this.selectedSurgeryId)
      this.modal = false
      this.selectedSurgeryId = ''
      this.$store.commit("SET_NOTIFICATION", {
        enabled: true,
        status: "success",
        text: ['Practice Surgery Deleted Successfully']
      });
    }
  }
}
</script>
<style scoped>
.shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 509;
}
.list-section {
  position: relative;
  min-height: 600px;
}
</style>

