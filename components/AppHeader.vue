<template>
  <section class="fixed z-50 w-full shadow lg:shadow-none">
    <div class="flex flex-row justify-between">
      <div style="max-width: 200px; min-width: 200px" class="hidden xl:inline"></div>
      <div class="header-section flex w-full justify-between bg-white">
        <div class="w-1/3">
          <button class="burger cursor-pointer py-2 focus:outline-none h-full" @click="toggle">
            <div class="my-2 bg-yellow-500"></div>
            <div class="my-2 bg-yellow-500"></div>
          </button>
        </div>
        <div class="w-1/3 flex justify-center">
          <button @click="goHome" class="focus:outline-none">
            <img src="/images/hubzz-icon-transparent.png" class="logo" />
          </button>
        </div>
        <div class="w-1/3 leading-loose py-2">
          <div class="flex flex-wrap justify-end items-center" v-if="$auth.loggedIn">
            <div
              class="text-xs xl:text-sm mr-2 hidden md:block"
              v-if="$auth.user.domain === 'Locum'"
            >Hi, {{$auth.user.personal_detail.first_name}}</div>
            <div class="flex justify-end mr-2">
              <div
                v-if="
									$auth.user.domain === 'Practice' &&
									$auth.user.status === 'Active' &&
                    				$auth.user.practice_detail.practice.status === 'Active'
								"
                class="mx-1"
              >
                <AppButton
                  v-if="authPermissions.includes('Create Sessions Job') && !notAllowed"
                  :label="'Create Job'"
                  @click="$store.commit('calendar/CREATE_JOB_MODAL', true)"
                  class="hidden md:block whitespace-no-wrap"
                  :inStyle="'padding-top: 0; padding-bottom: 0;'"
                />
                <button
                  @click="$store.commit('calendar/CREATE_JOB_MODAL', true)"
                  class="block md:hidden button rounded-lg p-2 focus:outline-none cursor-pointer"
                  :class="
										$route.name === 'messages-slug' ||
										$route.name === 'messages-new'
											? ''
											: 'mx-2'
									"
                >
                  <svgicon name="create-job" color="#444 #555" width="21" height="21"></svgicon>
                </button>
              </div>
              <div
                class="relative"
                v-if="$route.name != 'messages-slug' && $route.name != 'messages-new'"
              >
                <AppButton
                  :label="'Messages'"
                  @click="$router.push('/messages')"
                  class="hidden md:block"
                  :inStyle="'padding-top: 0; padding-bottom: 0;'"
                />
                <span
                  class="-m-2 absolute bg-yellow-500 block border bottom-0 right-0 hidden md:flex h-6 w-6 font-bold text-xs p-1 items-center justify-center rounded-full"
                  v-if="unreadMessages.length > 0"
                >{{ unreadMessages.length }}</span>
              </div>
              <button
                v-if="
									$route.name != 'messages-slug' &&
									$route.name != 'messages-new'
								"
                @click="$router.push('/messages')"
                class="relative block md:hidden button rounded-lg p-2 focus:outline-none cursor-pointer"
              >
                <svgicon name="chat" color="#888 #555 #fff" width="21" height="21"></svgicon>
                <span
                  class="-m-2 absolute bg-yellow-500 block border bottom-0 flex h-5 w-5 text-xs p-1 items-center justify-center right-0 rounded-full"
                  v-if="unreadMessages.length > 0"
                >{{ unreadMessages.length }}</span>
              </button>
            </div>

            <div class="relative" v-if="$auth.user.domain === 'Locum'">
              <AppButton
                :label="'Expenses'"
                @click="expense_modal = true"
                class="hidden md:block mt-2 mr-2 lg:mt-0 lg:mr-0"
                :inStyle="'padding-top: 0; padding-bottom: 0;'"
              />
              <button
                @click="expense_modal = true"
                class="block md:hidden button rounded-lg p-2 focus:outline-none cursor-pointer"
              >
                <svgicon name="create-job" color="#444 #555" width="21" height="21"></svgicon>
              </button>
            </div>
            <!-- {{ $auth.user.email }} -->
          </div>
        </div>
      </div>
    </div>
    <transition name="shield" mode="out-in">
      <div class="shield" v-if="create_job_modal || expense_modal" @click="close"></div>
    </transition>
    <transition name="slide" mode="out-in">
      <template v-if="expense_modal">
        <div class="expense-modal shadow-lg">
          <ExpenseReportsModal @close="expense_modal = false" />
        </div>
      </template>
    </transition>
    <transition name="slide" mode="out-in">
      <template v-if="create_job_modal">
        <div class="modal-container shadow-lg">
          <CreateJobModal :job="repost_job" />
        </div>
      </template>
    </transition>
  </section>
</template>
<script>
import AppButton from "@/components/Base/AppButton";
import CreateJobModal from "@/components/CreateJobModal";
import ExpenseReportsModal from "@/components/ExpenseReportsModal";
export default {
  components: {
    AppButton,
    ExpenseReportsModal,
    CreateJobModal
  },
  data() {
    return {
      notAllowed: false,
      expense_modal: false
    };
  },
  async created() {
    if (this.$auth.user.domain === "Practice") {
      if (this.$auth.user.practice_detail.practice.type === "Spoke") {
        if (this.$auth.user.practice_detail.practice.parent_practice_id) {
          if (
            this.$auth.user.practice_detail.practice
              .allow_surgery_create_sessions == false
          ) {
            this.notAllowed = true;
          }
        }
      }
    }
  },
  computed: {
    create_job_modal() {
      return this.$store.state.calendar.create_job_modal;
    },
    unreadMessages() {
      return this.$store.getters["chat/getUnreadMessages"];
    },
    authPermissions() {
      return this.$store.getters["permissions"];
    },
    repost_job() {
      return this.$store.state.calendar.repost_job;
    }
  },
  watch: {
    create_job_modal(value) {
      if (value) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
    },
    unreadMessages(value) {
      console.log("new message", value);
    }
  },
  methods: {
    toggle() {
      this.$store.commit("TOGGLE_SIDEBAR", true);
      document.body.style.overflow = "hidden";
    },
    close() {
      this.expense_modal = false;
      this.$store.commit("calendar/CREATE_JOB_MODAL", false);
      document.body.style.overflow = "hidden";
    },
    goHome() {
      if (this.$route.path != "/dashboard") {
        this.$router.push("/dashboard");
      }
    }
  }
};
</script>

<style scoped>
.shield {
  z-index: 600;
}
.expense-modal {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  border-left: solid 4px #ccc;
  transition: all 0.3s ease-in-out;
  background-color: white;
  scroll-behavior: smooth;
  z-index: 601;
}
.modal-container {
  z-index: 601;
}
@media (min-width: 1200px) {
  .modal-container {
    width: 80%;
  }
  .expense-modal {
    width: 80%;
    /* height: 80%; */
  }
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
.header-section {
  padding: 0 20px;
  min-height: 50px;
}
@media (min-width: 1200px) {
  .burger {
    display: none;
  }
}
@media (min-width: 480px) {
  .header-section {
    padding: 0 5%;
  }
}
@media (min-width: 320px) {
  .header-section {
    padding: 0 3%;
  }
}
a {
  text-decoration: none;
  color: black;
}
</style>
