<template>
  <section class="header-section bg-white fixed w-full z-50">
    <!-- <transition name="slide" mode="in-out">
      <CreateJobModal v-if="$store.state.calendar.create_job_modal" />
    </transition>-->
    <div class="px-4 flex flex-row flex-wrap justify-between" style="z-index: 600">
      <div class="w-1/3 py-2">
        <div class="burger cursor-pointer" @click="toggle">
          <div class="my-2 bg-yellow-500"></div>
          <div class="my-2 bg-yellow-500"></div>
        </div>
      </div>
      <div class="w-1/3 sm:w-1/3 py-2">
        <img src="/images/hubzz-icon-transparent.png" class="logo mx-auto" />
      </div>
      <div class="w-1/3 text-right leading-loose py-2">
        <div class="flex flex-col md:flex-row justify-end md:items-center" v-if="$auth.loggedIn">
          <div class="flex justify-end">
            <div v-if="$auth.user.domain === 'Practice' && $auth.user.status === 'Active'">
              <AppButton
                :label="'Create Job'"
                @click="$store.commit('calendar/CREATE_JOB_MODAL', true)"
                :inStyle="'font-size: medium; padding:10px;'"
                class="hidden md:block mb-2 md:mx-2 leading-none"
              />
              <button
                @click="$store.commit('calendar/CREATE_JOB_MODAL', true)"
                class="block md:hidden button rounded-lg p-2 focus:outline-none cursor-pointer mx-2"
              >
                <svgicon name="create-job" color="#000" width="21" height="21"></svgicon>
              </button>
            </div>
            <AppButton
              :label="'Messages'"
              @click="$router.push('/messages')"
              :inStyle="'font-size: medium; padding:2px 14px;'"
              class="hidden md:block"
            />
            <button
              @click="$router.push('/messages')"
              class="block md:hidden button rounded-lg p-2 focus:outline-none cursor-pointer"
            >
              <svgicon name="write-message" color="#000" width="21" height="21"></svgicon>
            </button>
          </div>
          <div
            class="text-xs xl:text-sm ml-4"
            v-if="$auth.user.domain === 'Locum'"
          >{{$auth.user.email}}</div>
        </div>
      </div>
    </div>
    <transition name="slide" mode="out-in">
      <div class="modal-container shadow-lg" ref="modalContainer" v-if="create_job_modal">
        <CreateJobModal />
      </div>
    </transition>
    <div class="modal-shield" v-if="create_job_modal"></div>
  </section>
</template>
<script>
import AppButton from "@/components/Base/AppButton";
import CreateJobModal from "@/components/CreateJobModal";
export default {
  components: {
    AppButton,
    CreateJobModal
  },
  computed: {
    create_job_modal() {
      return this.$store.state.calendar.create_job_modal;
    }
  },
  watch: {
    create_job_modal(value) {
      if (value) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
    }
  },
  methods: {
    toggle() {
      this.$store.commit("TOGGLE_SIDEBAR", true);
      document.body.style.overflow = "hidden";
    }
  }
};
</script>

<style scoped>
.header-section {
  width: 100%;
  /* margin-bottom: 20px; */
}
.burger {
  display: block;
}
.burger div:first-child {
  width: 30px;
  height: 2px;
}
.burger div:nth-child(2) {
  width: 20px;
  height: 2px;
}
.logo {
  width: 25px;
}
@media screen and (min-width: 1200px) {
  .burger {
    display: none;
  }
  .header-section {
    /* margin-bottom: 50px; */
    max-width: 1466px;
    margin-left: 200px;
  }
}
a {
  text-decoration: none;
  color: black;
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
</style>
