<template>
  <section class="fixed z-50 w-full border-b shadow lg:shadow-none">
    <div class="flex flex-row justify-between">
      <div style="max-width: 200px; min-width: 200px" class="hidden xl:inline" />

      <div class="header-section flex flex-wrap items-center w-full justify-between bg-white">
        <div class="w-full lg:w-1/5 flex flex-wrap">
          <div class="w-1/3">
            <button class="burger cursor-pointer py-2 focus:outline-none h-full mr-4" @click="toggle">
              <div class="my-2 bg-yellow-500" />
              <div class="my-2 bg-yellow-500" />
            </button>
          </div>
          <div class="w-2/3" />
          <!-- <AppBreadcrumbs :fixed="false" /> -->
          <!-- <div
            v-if="
              $auth.user.domain === 'Practice' &&
                $auth.user.status === 'Active' &&
                ($auth.user.practice_detail.practice.status === 'Active' 
                || $auth.user.practice_detail.practice.status === 'Dormant') &&
                ($auth.user.practice_detail.practice.type === 'Hub' 
                ||$auth.user.practice_detail.practice.type === 'Stand Alone' 
                ||($auth.user.practice_detail.practice.type === 'Spoke' &&
                $auth.user.practice_detail.practice.parent_practice_id)) 
            "
            class="mx-2"
          > -->
          <!-- <div class="flex flex-col items-start">
              <AppButton
                :disabled="!authPermissions.includes('Create Sessions Job')"
                :label="'+ Create Job'"
                class="whitespace-no-wrap font-bold"
                :customTheme="'bg-info text-white'"
                @click="$router.push('/create-job')"
              />
            </div> -->
                
          <!-- @click="$store.commit('calendar/CREATE_JOB_MODAL', true)" -->
          <!-- @click="$router.push('/create-job')" -->
          <!-- <button
							class="block md:hidden button rounded-lg p-2 focus:outline-none cursor-pointer"
							:class="
								$route.name === 'messages-slug' ||
									$route.name === 'messages-create'
									? ''
									: 'mx-2'
							"
							@click="$store.commit('calendar/CREATE_JOB_MODAL', true)"
						>
							<svgicon name="create-job" color="#444 #555" width="21" height="21" />
						</button> -->
          <!-- </div> -->
        </div>

        <!-- <div class="w-1/3 flex justify-center">
					<button class="focus:outline-none" @click="goHome">
						<img src="/images/hubzz-icon-transparent.png" class="logo" />
					</button>
				</div> -->

        <div class="w-full lg:w-3/5 leading-loose py-2">
          <div v-if="$auth.loggedIn" class="flex flex-no-wrap justify-end items-center">
            <div
              v-if="
                $auth.user.domain === 'Practice' &&
                  $auth.user.status === 'Active' &&
                  ($auth.user.practice_detail.practice.status === 'Active' 
                  || $auth.user.practice_detail.practice.status === 'Dormant') &&
                  ($auth.user.practice_detail.practice.type === 'Hub' 
                  ||$auth.user.practice_detail.practice.type === 'Stand Alone' 
                  ||($auth.user.practice_detail.practice.type === 'Spoke' &&
                  $auth.user.practice_detail.practice.parent_practice_id)) 
              "
              class="mx-2"
            >
              <AppButton
                :disabled="!authPermissions.includes('Create Sessions Job')"
                :label="'+ Create Job'"
                class="whitespace-no-wrap font-bold"
                :customTheme="'bg-info text-white'"
                @click="$router.push('/create-job')"
              />
            </div>
            <div
              v-if="$auth.user.domain === 'Locum'"
              class="text-xs xl:text-sm mr-2 hidden md:block"
            >
              Hi, {{ $auth.user.personal_detail.first_name }}
            </div>

            <div class="flex justify-end mr-2">
              <!-- <div
								v-if="
                  $auth.user.domain === 'Practice' &&
                    $auth.user.status === 'Active' &&
                    ($auth.user.practice_detail.practice.status === 'Active' 
                    || $auth.user.practice_detail.practice.status === 'Dormant') &&
                    ($auth.user.practice_detail.practice.type === 'Hub' 
                    ||$auth.user.practice_detail.practice.type === 'Stand Alone' 
                    ||($auth.user.practice_detail.practice.type === 'Spoke' &&
                    $auth.user.practice_detail.practice.parent_practice_id)) 
                "
								class="mx-1"
							>
								<div class="flex flex-col">
									<AppButton
										:disabled="!authPermissions.includes('Create Sessions Job')"
										:label="'Create Job'"
										class="hidden md:block whitespace-no-wrap"
										:in-style="'padding-top: 0; padding-bottom: 0;'"
										@click="$store.commit('calendar/CREATE_JOB_MODAL', true)"
									/>
								</div>

								<button
									class="block md:hidden button rounded-lg p-2 focus:outline-none cursor-pointer"
									:class="
                    $route.name === 'messages-slug' ||
                      $route.name === 'messages-create'
                      ? ''
                      : 'mx-2'
                  "
									@click="$store.commit('calendar/CREATE_JOB_MODAL', true)"
								>
									<svgicon name="create-job" color="#444 #555" width="21" height="21" />
								</button>
							</div> -->
              <div
                v-if="$route.name != 'messages-slug' && $route.name != 'messages-create'"
                class="relative"
              >
                <AppButton
                  icon="message"
                  class="h-full message-btn"
                  :customTheme="'border-2'"
                  :label="'Messages'"
                  :badge="unreadMessages"
                  @click="$router.push('/messages')"
                />
                <!-- <span
									v-if="unreadMessages > 0"
									class="-m-2 absolute bg-red-600 text-white block border bottom-0 right-0 hidden md:flex h-6 w-6 font-bold text-xs p-1 items-center justify-center rounded-full"
								>{{ unreadMessages }}</span> -->
              </div>
              <!-- <button
								v-if="
                  $route.name != 'messages-slug' &&
                    $route.name != 'messages-create'
                "
								class="relative block md:hidden button rounded-lg p-2 focus:outline-none cursor-pointer"
								@click="$router.push('/messages')"
							>
								<svgicon name="chat" color="#888 #555 #fff" width="21" height="21" />
								<span
									v-if="unreadMessages > 0"
									class="-m-2 absolute bg-red-600 text-white border bottom-0 right-0 flex h-6 w-6 font-bold text-xs p-1 items-center justify-center rounded-full"
								>{{ unreadMessages }}</span>
							</button> -->
            </div>
            <AppNotifDropdown />
            <!-- <div class="relative" v-if="$auth.user.domain === 'Locum'">
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
						</div>-->
          </div>
        </div>
      </div>
    </div>

    <transition name="shield" mode="out-in">
      <div v-if="create_job_modal || expense_modal" class="shield" @click="close" />
    </transition>

    <transition name="slide" mode="out-in">
      <div v-if="create_job_modal" class="modal-container shadow-lg">
        <CreateJobModal :job="repost_job" />
      </div>
    </transition>
  </section>
</template>

<script>
import AppButton from "@/components/Base/AppButton"
import CreateJobModal from "@/components/CreateJobModal"
import AppNotifDropdown from "@/components/AppNotifDropdown"
// import AppBreadcrumbs from "@/components/Base/AppBreadcrumbs"

export default {
  components: {
    AppButton,
    CreateJobModal,
    AppNotifDropdown,
    // AppBreadcrumbs,
  },

  data () {
    return {
      notAllowed: false,
      expense_modal: false,
    }
  },

  computed: {
    create_job_modal () {
      return this.$store.state.calendar.create_job_modal
    },

    unreadMessages () {
      return this.$store.getters["chat/getUnreadMessagesTotal"]
    },

    authPermissions () {
      return this.$store.getters["permissions"]
    },

    repost_job () {
      return this.$store.state.calendar.repost_job
    },

    links () {
      return this.$store.state.breadcrumbs
    },
  },

  watch: {
    create_job_modal (value) {
      if (value) {
        document.body.style.overflow = "hidden"
      } else {
        document.body.style.overflow = "auto"
      }
    },
  },

  async created () {
    this.$store.dispatch("chat/fetchTotalUnreadMessages")
  },

  methods: {
    toggle () {
      this.$store.commit("TOGGLE_SIDEBAR", true)
      document.body.style.overflow = "hidden"
    },

    close () {
      this.expense_modal = false
      this.$store.commit("calendar/CREATE_JOB_MODAL", false)
      document.body.style.overflow = "hidden"
    },

    goHome () {
      if (this.$route.path != "/dashboard") {
        this.$router.push("/dashboard")
      }
    },
  },
}
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
		width: 90%;
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
    padding: 1px 3% 0;
}

@media (min-width: 1280px) {
	.burger {
		display: none;
	}
}
@media (min-width: 768px) {
	.message-btn {
		min-width: 150px;
	}
}

 @media (min-width: 720px) {
    .header-section {
      padding: 1px 1% 0;
    }
  }

a {
	text-decoration: none;
	color: black;
}
</style>
