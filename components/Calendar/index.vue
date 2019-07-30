<template>
  <section>
    <div class="calendar border border-solid shadow-md my-4 rounded-lg">
      <div class="flex flex-row flex-wrap w-full h-full">
        <div class="relative w-full lg:w-2/3 p-5 pb-12 md:pb-20">
          <PerMonth v-if="$store.state.calendar.view_type === 'per_month'" />
          <PerWeek v-if="$store.state.calendar.view_type === 'per_week'" />
          <div class="absolute pin-b pin-r mx-5 my-3 md:my-5">
            <div
              class="rounded-full h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 text-2xl sm:text-3xl md:text-4xl flex items-center focus:outline-none justify-center bg-yellow-dark font-semibold cursor-pointer shadow-md hover:text-white"
              @click="create"
            >+</div>
          </div>
        </div>
        <div class="w-full lg:w-1/3">
          <Info
            @viewAppointmentJob="viewAppointmentJob"
            @viewLocumCurrentJob="viewLocumCurrentJob"
            @viewLocumAppliedJob="viewLocumAppliedJob"
            @viewPracticeAllocatedJob="viewPracticeAllocatedJob"
            @viewPracticeUnfilledJob="viewPracticeUnfilledJob"
            @viewPracticeDeclinedJob="viewPracticeDeclinedJob"
            @viewPracticeAppliedJob="viewPracticeAppliedJob"
            @viewPracticeLiveJob="viewPracticeLiveJob"
          />
        </div>
      </div>
    </div>
    <div class="modal-shield" v-if="toggleScroll"></div>
    <transition name="slide" mode="out-in">
      <div class="modal-container shadow-lg" v-if="modal">
        <CreateAppointmentModal @close="modal = false" :job="job" />
      </div>
      <div class="modal-container shadow-lg" v-if="locum_current_modal">
        <LocumAllocatedDetailModal @close="locum_current_modal = false" :job="locum_current_job" />
      </div>
      <div class="modal-container shadow-lg" v-if="locum_applied_modal">
        <LocumAppliedDetailModal @close="locum_applied_modal = false" :job="locum_applied_job" />
      </div>
      <div class="modal-container shadow-lg" v-if="practice_create_modal">
        <CreateJobModal @close="practice_create_modal = false" :job="practice_create_job" />
      </div>
      <div class="modal-container shadow-lg" v-if="practice_allocated_modal">
        <AllocatedDetailModal
          @close="practice_allocated_modal = false"
          :job="practice_allocated_job"
        />
      </div>
      <div class="modal-container shadow-lg" v-if="practice_unfilled_modal">
        <UnfilledDetailModal @close="practice_unfilled_modal = false" :job="practice_unfilled_job" />
      </div>
      <div class="modal-container shadow-lg" v-if="practice_declined_modal">
        <DeclinedDetailModal @close="practice_declined_modal = false" :job="practice_declined_job" />
      </div>
      <div class="modal-container shadow-lg" v-if="practice_applied_modal">
        <AppliedDetailModal @close="practice_applied_modal = false" :job="practice_applied_job" />
      </div>
      <div class="modal-container shadow-lg" v-if="practice_live_modal">
        <LiveDetailModal @close="practice_live_modal = false" :job="practice_live_job" />
      </div>
    </transition>
  </section>
</template>
<script>
import PerMonth from '@/components/Calendar/PerMonth'
import PerWeek from '@/components/Calendar/PerWeek'
import Info from '@/components/Calendar/Info'
// locums
import CreateAppointmentModal from '@/components/CreateAppointmentModal'
import LocumAllocatedDetailModal from '@/components/Jobs/LocumAllocatedDetailModal'
import LocumAppliedDetailModal from '@/components/Jobs/LocumAppliedDetailModal'
// practice
import CreateJobModal from '@/components/CreateJobModal'
import AllocatedDetailModal from '@/components/Sessions/AllocatedDetailModal'
import UnfilledDetailModal from '@/components/Sessions/UnfilledDetailModal'
import DeclinedDetailModal from '@/components/Sessions/DeclinedDetailModal'
import AppliedDetailModal from '@/components/Sessions/AppliedDetailModal'
import LiveDetailModal from '@/components/Sessions/LiveDetailModal'

export default {
  components: {
    PerMonth,
    PerWeek,
    Info,
    CreateAppointmentModal,
    LocumAllocatedDetailModal,
    LocumAppliedDetailModal,
    CreateJobModal,
    AllocatedDetailModal,
    UnfilledDetailModal,
    DeclinedDetailModal,
    AppliedDetailModal,
    LiveDetailModal,
  },
  data() {
    return {
      modal: false,
      job: null,
      locum_current_modal: false,
      locum_current_job: null,
      locum_applied_modal: false,
      locum_applied_job: null,
      practice_create_modal: false,
      practice_create_job: null,
      practice_allocated_modal: false,
      practice_allocated_job: null,
      practice_unfilled_modal: false,
      practice_unfilled_job: null,
      practice_declined_modal: false,
      practice_declined_job: null,
      practice_applied_modal: false,
      practice_applied_job: null,
      practice_live_modal: false,
      practice_live_job: null,

    }
  },


  created() {
    this.$store.commit('calendar/SET_DATE_TODAY')
  },
  computed: {
    toggleScroll() {
      return this.modal | this.locum_current_modal | this.locum_applied_modal | this.practice_create_modal
        | this.practice_allocated_modal | this.practice_unfilled_modal | this.practice_declined_modal | this.practice_applied_modal
        | this.practice_live_modal
    },
  },
  watch: {
    toggleScroll(value) {
      if (value) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = 'auto'
      }
    },
  },
  methods: {
    create() {
      if (this.$auth.user.domain === 'Locum') {
        this.createAppointmentJob()
      } else {
        this.createJob()
      }
    },
    // locum
    createAppointmentJob() {
      this.modal = true
      this.job = null
    },
    viewAppointmentJob(job) {
      this.modal = true
      this.job = job
    },
    viewLocumCurrentJob(job) {
      this.locum_current_modal = true
      this.locum_current_job = job
    },
    viewLocumAppliedJob(job) {
      this.locum_applied_modal = true
      this.locum_applied_job = job
    },
    // practice
    createJob(job) {
      this.practice_create_modal = true
      this.practice_create_job = null
    },
    viewPracticeAllocatedJob(job) {
      this.practice_allocated_modal = true
      this.practice_allocated_job = job
    },
    viewPracticeUnfilledJob(job) {
      this.practice_unfilled_modal = true
      this.practice_unfilled_job = job
    },
    viewPracticeDeclinedJob(job) {
      this.practice_declined_modal = true
      this.practice_declined_job = job
    },
    viewPracticeAppliedJob(job) {
      console.log(job)
      this.practice_applied_modal = true
      this.practice_applied_job = job
    },
    viewPracticeLiveJob(job) {
      this.practice_live_modal = true
      this.practice_live_job = job
    },
  }
}
</script>
<style>
.calendar {
  height: auto;
  max-width: 1000px;
}
@media screen and (min-width: 991px) {
  .calendar {
    height: auto;
  }
}
.modal-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 509;
}
.modal-container {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  border-left: solid 2px #edf2f7;
  transition: all 0.3s ease-in-out;
  background-color: white;
  z-index: 510;
}
@media screen and (min-width: 1200px) {
  .modal-container {
    width: 80%;
  }
}
</style>


