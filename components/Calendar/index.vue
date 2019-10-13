<template>
  <section>
    <div class="calendar border border-solid shadow-md my-4 rounded-lg lg:max-w-6xl">
      <div class="flex flex-row flex-wrap w-full h-full">
        <div
          class="relative w-full lg:w-2/3 p-2 sm:p-5"
          :class="authPermissions.includes('Create Sessions Job') ? 'pb-16 md:pb-20' : ''"
        >
          <PerMonth v-if="$store.state.calendar.view_type === 'per_month'" />
          <PerWeek v-if="$store.state.calendar.view_type === 'per_week'" />
          <div class="absolute bottom-0 right-0 mx-2 sm:mx-5 my-3 md:my-5">
            <div
              v-if="authPermissions.includes('Create Sessions Job')"
              class="rounded-full h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 text-2xl sm:text-3xl md:text-4xl flex items-center focus:outline-none justify-center bg-yellow-500 font-semibold cursor-pointer shadow-md hover:text-white"
              @click="create"
            >+</div>
          </div>
        </div>
        <div class="w-full lg:w-1/3">
          <Info @viewPracticeJob="viewPracticeJob" @viewLocumJob="viewLocumJob" />
        </div>
      </div>
    </div>
    <div
      class="shield"
      v-if="toggleScroll"
      @click="locum_modal ? locum_modal = false : practice_modal = false"
    ></div>
    <transition name="slide" mode="out-in">
      <template v-if="locum_appointment_modal">
        <JobDetailModalAppointment
          v-if="locum_appointment_modal"
          @close="locum_appointment_modal = false"
          :job="locum_appointment_job"
        />
      </template>
      <template v-if="locum_modal">
        <div class="modal-container">
          <JobDetailModal @close="locum_modal = false" :job="locum_job" />
        </div>
      </template>
      <!-- <div class="modal-container shadow-lg" v-if="create_job_modal">
        <CreateJobModal />
      </div>-->
      <template v-if="practice_modal">
        <div class="modal-container">
          <!-- <JobDetailModal @close="practice_modal = false" :job="practice_job" /> -->
        </div>
      </template>
    </transition>
  </section>
</template>
<script>
import PerMonth from "@/components/Calendar/PerMonth";
import PerWeek from "@/components/Calendar/PerWeek";
import Info from "@/components/Calendar/Info";
// locums
import JobDetailModal from "@/components/Jobs/JobDetailModal";
import JobDetailModalAppointment from "@/components/Jobs/JobDetailModalAppointment";

// practice
// import CreateJobModal from "@/components/CreateJobModal";
// import JobDetailModal from "@/components/Sessions/JobDetailModal";

export default {
  components: {
    PerMonth,
    PerWeek,
    Info,
    JobDetailModal,
    JobDetailModalAppointment
    // CreateJobModal,
    // JobDetailModal
  },
  data() {
    return {
      practice_modal: false,
      practice_job: null,
      locum_modal: false,
      locum_job: null,
      locum_appointment_modal: false,
      locum_appointment_job: null
    };
  },
  created() {
    this.$store.commit("calendar/SET_DATE_TODAY");
  },
  computed: {
    toggleScroll() {
      return (
        this.locum_appointment_modal || this.locum_modal || this.practice_modal
        // this.create_job_modal
      );
    },
    create_job_modal() {
      return this.$store.state.calendar.create_job_modal;
    },
    authPermissions() {
      return this.$store.getters["auth/permissions"];
    }
  },
  watch: {
    toggleScroll(value) {
      if (value) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
    }
  },
  methods: {
    create() {
      if (this.$auth.user.domain === "Locum") {
        this.createAppointmentJob();
      } else {
        this.$store.commit("calendar/CREATE_JOB_MODAL", true);
      }
    },
    // locum
    createAppointmentJob() {
      this.locum_appointment_modal = true;
      this.locum_appointment_job = null;
    },
    viewLocumJob(job) {
      if (job.type === "Private") {
        this.locum_appointment_modal = true;
        this.locum_appointment_job = job;
        return;
      }
      this.locum_modal = true;
      this.locum_job = job;
    },
    // practice
    viewPracticeJob(job) {
      this.practice_modal = true;
      this.practice_job = job;
    }
  }
};
</script>
<style>
.calendar {
  height: auto;
  /* max-width: 1000px; */
}
@media screen and (min-width: 991px) {
  .calendar {
    height: auto;
  }
}
.modal-container {
  z-index: 510;
}
@media screen and (min-width: 1200px) {
  .modal-container {
    width: 80%;
  }
}
/* .shield {
  z-index: 509;
} */
</style>


