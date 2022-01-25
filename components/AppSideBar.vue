<template>
  <section>
    <div class="sidebar relative" :class="{'toggled-left': $store.state.toggled_sidebar}">
      <div class="sidebar-nav pt-8 xl:pt-10">
        <div class="flex flex-row justify-center pb-4">
          <div class="flex justify-center">
            <img src="~/assets/images/hubzz_logo.png" class="w-3/5">
          </div>
          
          <button
            class="absolute top-0 right-0 my-2 mx-3 close-button cursor-pointer focus:outline-none text-2xl font-bold text-sunglow hover:text-sunglow-dark transition-hover"
            @click="close"
          >
            <svgicon name="times-solid" class="fill-current" width="18" />
          </button>
        </div>
        

        <div v-for="(navigationTab, index) in navigationTabs" :key="index" class="text-sm relative">
          <span v-if="navigationTab.active" class="absolute ml-3 mt-4 bg-sunglow p-1.5 h-1.5 rounded-sm" />

          <nuxt-link
            :to="navigationTab.route"
            :event="$route.path.includes(navigationTab.route) ? 'click' : 'click'"
            class="block no-underline pl-4 py-3 mx-4 transition-hover"
            :class="navigationTab.active ? 'text-white font-bold' : 'text-gray-500 hover:text-white hover:font-bold'"
          >
            <span>{{ navigationTab.navigationTabTitle }}</span>
          </nuxt-link>
        </div>

        <div class="text-sm relative ml-4">
          <button
            class="block no-underline p-4 transition-hover focus:outline-none text-gray-500 hover:text-white hover:font-bold"
            @click.prevent="showSignOutModal = true, checkSurvey()"
          >
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
    
    <div v-if="survey" class="shield" @click.prevent="survey = null, surveyResponseSubmitted = false" />

    <div v-if="survey">
      <div v-if="!surveyResponseSubmitted" class="rounded-lg shadow-md px-4 py-8 md:px-8 survey-modal border w-5/6 md:w-1/2 overflow-scroll" style="max-height: 70vh;">
        <div v-for="surveyResponseAnswer in surveyResponseAnswers" :key="surveyResponseAnswer.survey_question_id">
          <div v-if="surveyResponseAnswer.question_type === 'Text'" class="mb-4">
            <h1 class="text-lg">
              {{ surveyResponseAnswer.question }}
            </h1>
            <input v-model="surveyResponseAnswer.answer" class="w-full p-2 border rounded-lg bg-yellow-500 shadow-lg" type="text">
          </div>

          <div v-if="surveyResponseAnswer.question_type === 'Text Box'" class="mb-4">
            <h1 class="text-lg">
              {{ surveyResponseAnswer.question }}
            </h1>
            <textarea v-model="surveyResponseAnswer.answer" class="w-full p-2 border rounded-lg bg-yellow-500 shadow-lg" rows="4" />
          </div>
          
          <div v-if="surveyResponseAnswer.question_type === 'Rating'" class="mb-4">
            <h1 class="text-lg">
              {{ surveyResponseAnswer.question }}
            </h1>
            <div class="flex flex-wrap">
              <span
                v-for="number in 10"
                :key="number"
                class="flex justify-center border rounded-lg px-3 py-2 m-1 shadow-lg cursor-pointer"
                :class="`${(surveyResponseAnswer.answer || 0) >= number ? 'bg-yellow-500' : 'bg-gray-200'}`"
                :style="{ width: '28px', height: '32px', transition: '.1s' }"
                @click="surveyResponseAnswer.answer = number"
              />
            </div>
          </div>
        </div>

        <div class="flex flex-row flex-no-wrap justify-end">
          <button
            class="px-4 py-2 bg-yellow-400 border border-white rounded-lg shaodw-lg text-sm font-bold"
            @click="submitServeyResponse"
          >
            {{ submittingServeyResponse ? 'Submitting...' : 'Submit' }}
          </button>
        </div>
      </div>

      <div v-if="surveyResponseSubmitted" class="rounded-lg shadow-md px-4 py-8 md:px-8 survey-modal border w-5/6 md:w-1/2 overflow-scroll" style="max-height: 70vh;">
        <h1 class="text-lg">
          Survey Response Submitted. Thank You.
        </h1>

        <div class="flex flex-row flex-no-wrap justify-end">
          <button
            class="px-4 py-2 bg-yellow-400 border border-white rounded-lg shaodw-lg text-sm font-bold"
            @click="survey = null, surveyResponseSubmitted = false"
          >
            Ok
          </button>
        </div>
      </div>
    </div>

    <div class="error-alert w-5/6 md:w-1/2">
      <transition name="drop">
        <div
          v-if="errorAlerts.length > 0"
          class="relative rounded-lg py-2 px-4 my-2 flex justify-center text-center"
          style="min-width: 200px"
          :class="`border border-red-500 bg-red-200 text-red-600`"
        >
          <span class="mr-2 inline-block align-middle">
            <svgicon :name="`exclamation-mark`" height="20" width="20" :color="`#e53e3e`" />
          </span>

          <span class="mr-2 inline-block align-middle">
            <svgicon :name="`times`" height="20" width="20" :color="`#e53e3e`" />
          </span>

          <div class="font-bold text-sm leading-normal inline-block">
            {{ errorAlerts[errorAlerts.length - 1] }}
          </div>
        </div>
      </transition>
    </div>

    <AppConfirmationModal
      :showShield="!survey"
      :label="'Proceed to sign-out?'"
      :confirmLabel="'Yes'"
      :cancelLabel="'Cancel'"
      :modal="showSignOutModal"
      @confirm="logout"
      @cancel="showSignOutModal = false"
    />

    <AppConfirmationModal
      :label="'Your Profile Has Been Deleted, Contact Hubzz For More Info'"
      :confirmLabel="'Yes'"
      :modal="confirmation_modal"
      @confirm="confirm"
    />

    <AppConfirmationModal
      :label="'Your Account Has Been Deactivated'"
      :confirmLabel="'Logout'"
      :modal="showLocumAccountDeactivatedModal"
      @confirm="logout"
    />

    <AppConfirmationModal
      :label="'Your Practice Has Been Deactivated'"
      :confirmLabel="'Logout'"
      :modal="showPracticeDeactivatedModal"
      @confirm="logout"
    />

    <AppConfirmationModal
      :label="'Your Account Has Been Deleted'"
      :confirmLabel="'Ok'"
      :modal="showUserAccountDeletedModal || showPracticeUserDeletedModal"
      @confirm="confirm"
    />

    <AppConfirmationModal
      :label="'Your Practice Has Been Deleted'"
      :confirmLabel="'Ok'"
      :modal="showPracticeDeletedModal"
      @confirm="confirm"
    />
  </section>
</template>

<script>
import AppConfirmationModal from "@/components/Base/AppConfirmationModal"

export default {
  components: {
    AppConfirmationModal,
  },

  data () {
    return {
      user: null,
      showSignOutModal: false,
      confirmation_modal: false,
      eligibleToSpoke: false,
      showLocumAccountDeactivatedModal: false,
      showUserAccountDeletedModal: false,
      showPracticeDeactivatedModal: false,
      showPracticeDeletedModal: false,
      showPracticeUserDeletedModal: false,
      survey: null,
      loadingSurvey: false,
      surveyResponseAnswers: [],
      submittingServeyResponse: false,
      surveyResponseSubmitted: false,
      errorAlerts: [
        // 'qweqweqweqweqweqweqweqwe',
        // 'asdasdasdasdasdasd kakshd hdk qdhasldkjasdkhasdasdasdasdasdasd kakshd hdk qdhasldkjasdkhasdasdasdasdasdasd kakshd hdk qdhasldkjasdkh',
        // `
        // qwewqeqweasdas
        // qweqwe
        // qweqweqweqweqwewqedkhasdasdasdasdasdasd asdasdasdasdasd asdasdasdasdsadsadasdasdasdasdasd akshd hdk qdhasldkjasdkhasd  dkhasdasdasdasdasdasd kakshd hdk qdhasldkjasdkhasddkhasdasdasdasdasdasd kakshd hdk qdhasldkjasdkhasd
        // qwedasdasdasd
        // qwe
        // wqeqwewqedkhasdasdasdasdasdasd kakshd hdk qdhasldkjasdkhasd
        // qweqweqweeqweqwewqe`,
      ],
    }
  },

  computed: {
    authPermissions () {
      return this.$store.getters["permissions"]
    },

    view_locum_jobs () {
      return this.$store.getters["getViewLocumJobs"]
    },

    view_permanent_jobs () {
      return this.$store.getters["getViewPermanentJobs"]
    },

    navigationTabs () {
      if (!this.user) {
        return []
      }

      const { domain, status: accountStatus, } = this.user

      if (domain === "Locum") {
        const locumTabList = []

        locumTabList.push({
          navigationTabTitle: "Dashboard",
          route: "/dashboard",
          active: `/${this.$route.path.split('/')[1]}` === '/dashboard',
        })

        locumTabList.push({
          navigationTabTitle: "Profile",
          route: "/account",
          active: `/${this.$route.path.split('/')[1]}` === '/account',
        })

        if (accountStatus !== 'Deactivated') {
          locumTabList.push({
            navigationTabTitle: "Compliance",
            route: "/compliance",
            active: `/${this.$route.path.split('/')[1]}` === '/compliance',
          })

          if (this.view_locum_jobs) {
            locumTabList.push({
              navigationTabTitle: "Availability",
              route: "/availability",
              active: `/${this.$route.path.split('/')[1]}` === '/availability',
            })
          }
        }

        if (
          ["Active", "Dormant",].includes(accountStatus)
          && this.view_locum_jobs
        ) {
          locumTabList.push({
            navigationTabTitle: "My Practice",
            route: "/my-practice",
            active: `/${this.$route.path.split('/')[1]}` === '/my-practice',
          })
        }

        if (
          ["Active", "Dormant",].includes(accountStatus)
          && this.view_locum_jobs
        ) {
          // locumTabList.push({
          //   navigationTabTitle: "Jobs",
          //   route: "/jobs",
          //   active: `/${this.$route.path.split('/')[1]}` === '/jobs' || `/${this.$route.path.split('/')[1]}` === '/locum-job-parts',
          // })

          locumTabList.push({
            navigationTabTitle: "Jobs",
            route: "/locum-job-parts",
            active:['/jobs','/locum-job-parts' ,'/locum-job-reports',].includes(`/${this.$route.path.split('/')[1]}`),
          })
        }

        if (
          ["Active", "Dormant",].includes(accountStatus)
          && this.view_permanent_jobs
        ) {
          locumTabList.push({
            navigationTabTitle: "Salaried Roles",
            route: "/permanent-jobs",
            active: `/${this.$route.path.split('/')[1]}` === '/permanent-jobs',
          })
        }

        if (
          ["Active", "Dormant",].includes(accountStatus)
          && this.view_locum_jobs
        ) {
          locumTabList.push({
            navigationTabTitle: "Billing",
            route: "/locum-billing",
            active: `/${this.$route.path.split('/')[1]}` === '/locum-billing'
              || this.$route.name === 'locum-billing-form-as'
              || this.$route.name === 'locum-billing-solo-forms'

              || this.$route.name.includes('locum-billing-private-to-be-invoiced')
              || this.$route.name.includes('locum-billing-private-invoiced')
              || this.$route.name.includes('locum-billing-private-invoices')
              || this.$route.name.includes('locum-billing-private-solo-forms')
              || this.$route.name.includes('locum-billing-private-form-as')
              || this.$route.name.includes('locum-billing-private-form-bs')

              || `/${this.$route.path.split('/')[1]}` === '/locum-billing-reports',
          })
        }

        // if (["Active", "Dormant",].includes(accountStatus)) {
        //   locumTabList.push({
        //     navigationTabTitle: "Reports",
        //     route: "/locum-reports",
        //     active: `/${this.$route.path.split('/')[1]}` === '/locum-reports',
        //   })
        // }

        if (accountStatus !== 'Deactivated') {
          locumTabList.push({
            navigationTabTitle: "Invite",
            route: "/invite",
            active: `/${this.$route.path.split('/')[1]}` === '/invite',
          })
        }

        locumTabList.push({
          navigationTabTitle: "FAQs",
          route: "/faq",
          active: `/${this.$route.path.split('/')[1]}` === '/faq',
        })

        locumTabList.push({
          navigationTabTitle: "Terms and Conditions",
          route: "/terms-and-conditions",
          active: `/${this.$route.path.split('/')[1]}` === '/terms-and-conditions',
        })

        locumTabList.push({
          navigationTabTitle: "Contact Us",
          route: "/contact-us",
          active: `/${this.$route.path.split('/')[1]}` === '/contact-us',
        })

        return locumTabList
      }

      if (domain === "Practice") {
        const practiceUser = this.$auth.user

        const practice = practiceUser.practice_detail
          ? practiceUser.practice_detail.practice
          : null

        const {
          status: practiceStatus = null,
          type: practiceType = null,
          hub_type: hubType = null,
          parent_practice_id: parentPracticeId = null,
        } = practice || {}

        const practiceTabList = []

        practiceTabList.push({
          navigationTabTitle: "Dashboard",
          route: "/dashboard",
          active: `/${this.$route.path.split('/')[1]}` === '/dashboard',
        })

        practiceTabList.push({
          navigationTabTitle: "Account",
          route: "/account",
          active: `/${this.$route.path.split('/')[1]}` === '/account',
        })

        if (this.authPermissions.includes("View Profile Practice")) {
          practiceTabList.push({
            navigationTabTitle: "Profile",
            route: "/profile",
            active: `/${this.$route.path.split('/')[1]}` === '/profile',
          })
        } else if (this.authPermissions.includes("View Profile Users")) {
          practiceTabList.push({
            navigationTabTitle: "Profile",
            route: "/profile/users",
            active: `/${this.$route.path.split('/')[1]}` === '/profile',
          })
        }

        if (
          accountStatus === "Active"
          && ["Active", "Dormant",].includes(practiceStatus)
          && practiceType === "Hub"
          && (this.authPermissions.includes("View Surgery Management") 
              || this.authPermissions.includes("View Surgery Sessions")
              || this.authPermissions.includes("View Surgery Billings")
              || this.authPermissions.includes("View Surgery Banks")
              || this.authPermissions.includes("View Surgery Permanent Jobs")
          )
        ) {
          practiceTabList.push({
            navigationTabTitle: "Surgery Management",
            route: "/hub-surgery-management",
            active: `/${this.$route.path.split('/')[1]}` === '/hub-surgery-management',
          })
        }

        if (
          accountStatus === "Active"
          && ["Active", "Dormant",].includes(practiceStatus)
          && practiceType === "Spoke"
          && (this.authPermissions.includes("View Surgery Management")
              || this.authPermissions.includes("View Surgery Sessions")
              || this.authPermissions.includes("View Surgery Billings")
              || this.authPermissions.includes("View Surgery Banks")
              || this.authPermissions.includes("View Surgery Permanent Jobs")
          )
        ) {
          practiceTabList.push({
            navigationTabTitle: "Surgery Management",
            route: "/spoke-surgery-management",
            active: `/${this.$route.path.split('/')[1]}` === '/spoke-surgery-management',
          })
        }

        if (
          accountStatus === "Active"
          && ["Active", "Dormant",].includes(practiceStatus)
          && practiceType === "Stand Alone"
          && (this.authPermissions.includes("View Surgery Management")
              || this.authPermissions.includes("View Surgery Sessions")
              || this.authPermissions.includes("View Surgery Billings")
              || this.authPermissions.includes("View Surgery Banks")
              || this.authPermissions.includes("View Surgery Permanent Jobs")
          )
          && this.eligibleToSpoke
        ) {
          practiceTabList.push({
            navigationTabTitle: "Surgery Management",
            route: "/spoke-surgery-management",
            active: `/${this.$route.path.split('/')[1]}` === '/spoke-surgery-management',
          })
        }

        if (
          accountStatus === "Active"
          && ["Active", "Dormant",].includes(practiceStatus)
          && (["Hub", "Stand Alone",].includes(practiceType) 
              || (practiceType === 'Spoke' && parentPracticeId !== null))
          && hubType !== "Type 2"
          && this.authPermissions.includes("View My Banks")
        ) {
          practiceTabList.push({
            navigationTabTitle: "My Banks",
            route: "/my-banks",
            active: ['/my-banks', '/my-banks-reports',].includes(`/${this.$route.path.split('/')[1]}`),
          })
        }

        if (
          accountStatus === "Active"
          && ["Active", "Dormant",].includes(practiceStatus)
          && (["Hub", "Stand Alone",].includes(practiceType) 
              || (practiceType === 'Spoke' && parentPracticeId !== null))
          && hubType !== "Type 2"
          && (this.authPermissions.includes("View My Banks") === false && this.authPermissions.includes("View Practice Reports"))
        ) {
          practiceTabList.push({
            navigationTabTitle: "My Banks (Reports Only)",
            route: "/my-banks-reports",
            active: `/${this.$route.path.split('/')[1]}` === '/my-banks-reports',
          })
        }

        if (
          accountStatus === "Active"
          && ["Active", "Dormant",].includes(practiceStatus)
          && (["Hub", "Stand Alone",].includes(practiceType) 
              || (practiceType === 'Spoke' && parentPracticeId !== null))
          && this.authPermissions.includes("View Sessions Job")
          && hubType !== "Type 2"
        ) {
          // practiceTabList.push({
          //   navigationTabTitle: "Sessions",
          //   route: "/sessions",
          //   active: `/${this.$route.path.split('/')[1]}` === '/sessions' || `/${this.$route.path.split('/')[1]}` === '/job-parts',
          // })

          practiceTabList.push({
            navigationTabTitle: "Sessions",
            route: "/job-parts",
            active: ['/sessions', '/job-parts', '/practice-job-reports',].includes(`/${this.$route.path.split('/')[1]}`) ,
          })
        }
        if (
          accountStatus === "Active"
          && ["Active", "Dormant",].includes(practiceStatus)
          && (["Hub", "Stand Alone",].includes(practiceType) 
              || (practiceType === 'Spoke' && parentPracticeId !== null))
          && (this.authPermissions.includes("View Sessions Job") === false && this.authPermissions.includes("View Practice Reports"))
          && hubType !== "Type 2"
        ) {

          practiceTabList.push({
            navigationTabTitle: "Sessions (Reports Only)",
            route: "/practice-job-reports",
            active: `/${this.$route.path.split('/')[1]}` === '/practice-job-reports',
          })
        }

        if (
          accountStatus === "Active"
          && ["Active", "Dormant",].includes(practiceStatus)
          && (["Hub", "Stand Alone",].includes(practiceType) 
              || (practiceType === 'Spoke' && parentPracticeId !== null))
          && this.authPermissions.includes("View Permanent Job")
        ) {
          practiceTabList.push({
            navigationTabTitle: "Salaried Roles",
            route: "/permanent-jobs",
            active: `/${this.$route.path.split('/')[1]}` === '/permanent-jobs',
          })
        }

        if (
          accountStatus === "Active"
          && ["Active", "Dormant",].includes(practiceStatus)
          && (["Hub", "Stand Alone",].includes(practiceType) 
              || (practiceType === 'Spoke' && parentPracticeId !== null))
          && this.authPermissions.includes("View Billings")
          && hubType !== "Type 2"
        ) {
          practiceTabList.push({
            navigationTabTitle: "Billing",
            route: "/practice-billing",
            active: `/${this.$route.path.split('/')[1]}` === '/practice-billing'
              || this.$route.name === 'practice-billing-form-as'
              || `/${this.$route.path.split('/')[1]}` === '/practice-billing-reports',
          })
        }
        
        if (
          accountStatus === "Active"
          && ["Active", "Dormant",].includes(practiceStatus)
          && (["Hub", "Stand Alone",].includes(practiceType) 
              || (practiceType === 'Spoke' && parentPracticeId !== null))
          && (this.authPermissions.includes("View Billings") === false && this.authPermissions.includes("View Practice Reports"))
          && hubType !== "Type 2"
        ) {
          practiceTabList.push({
            navigationTabTitle: "Billing (Reports Only)",
            route: "/practice-billing-reports",
            active: `/${this.$route.path.split('/')[1]}` === '/practice-billing-reports',
          })
        }

        // if (
        //   accountStatus === "Active"
        //   && ["Active", "Dormant",].includes(practiceStatus)
        //   && (["Hub", "Stand Alone",].includes(practiceType) 
        //     || (practiceType === 'Spoke' && parentPracticeId !== null))
        // ) {
        //   practiceTabList.push({
        //     navigationTabTitle: "Reports",
        //     route: "/practice-reports",
        //     active: `/${this.$route.path.split('/')[1]}` === '/practice-reports',
        //   })
        // }

        practiceTabList.push({
          navigationTabTitle: "Invite",
          route: "/invite",
          active: `/${this.$route.path.split('/')[1]}` === '/invite',
        })

        if (
          accountStatus === "Active"
          && ["Active", "Dormant",].includes(practiceStatus)
          && this.authPermissions.includes("View Role")
        ) {
          practiceTabList.push({
            navigationTabTitle: "Roles and Permissions",
            route: "/roles-and-permissions",
            active: `/${this.$route.path.split('/')[1]}` === '/roles-and-permissions',
          })
        }

        practiceTabList.push({
          navigationTabTitle: "FAQs",
          route: "/faq",
          active: `/${this.$route.path.split('/')[1]}` === '/faq',
        })

        practiceTabList.push({
          navigationTabTitle: "Terms and Conditions",
          route: "/terms-and-conditions",
          active: `/${this.$route.path.split('/')[1]}` === '/terms-and-conditions',
        })

        practiceTabList.push({
          navigationTabTitle: "Contact Us",
          route: "/contact-us",
          active: `/${this.$route.path.split('/')[1]}` === '/contact-us',
        })

        return practiceTabList
      }

      return []
    },
  },

  watch: {
    view_locum_jobs () {
      this.getInit()
    },
    view_permanent_jobs () {
      this.getInit()
    },
  },

  async created () {
    if (
      this.$auth.loggedIn
      && this.$auth.user.domain === "Practice"
      && this.$auth.user.practice_detail.practice.type === "Stand Alone"
      && this.authPermissions.includes("View Surgery Management")
    ) {
      let hasHubInvitation = false
      let hasSpokeInvitation = false

      await this.$axios
        .$get(`/api/v1/practice/me/parent-surgery/invitations-count`)
        .then(res => {
          hasHubInvitation = res.data.count > 0
        })

      await this.$axios
        .$get(`/api/v1/practice/me/practice-surgeries/spoke-invitations/count`)
        .then(res => {
          hasSpokeInvitation = res.data.count > 0
        })

      this.eligibleToSpoke = hasHubInvitation || hasSpokeInvitation
      this.getInit()
    } else {
      this.getInit()
      this.$store.dispatch("getViewJobsPermissions")
      console.log(this.view_locum_jobs)
      console.log(this.view_permanent_jobs)
    }
  },

  mounted () {
    this.$loggedOutBroadcastChannel.addEventListener("message", this.loggedOutHandler)

    this.$socket.on('Practice Notification Update Profile', this.updatePermissions)
    this.$socket.on('Practice Notification Delete Profile', this.toggleConfirmationModal)

    this.$socket.on('Locum Notification Account Deactivated', this.locumAccountDeactivatedHandler)
    this.$socket.on('Locum Notification Account Deactivated By Admin', this.locumAccountDeactivatedHandler)

    this.$socket.on('User Notification Account Deleted', this.accountDeletedHandler)

    this.$socket.on('Practice Notification Practice Deactivated', this.practiceDeactivatedHandler)
    this.$socket.on('Practice Notification Practice Deactivated By Admin', this.practiceDeactivatedHandler)

    this.$socket.on('Practice Notification Practice Deleted', this.practiceDeletedHandler)

    this.$socket.on('Practice Notification Practice User Deleted', this.practiceUserDeletedHandler)

    if (this.$auth.user && this.$auth.user.domain === 'Locum' && this.$auth.user.status === 'Deactivated') {
      this.locumAccountDeactivatedHandler()
    }

    if (this.$auth.user && this.$auth.user.domain === 'Practice' && this.$auth.user.practice_status === 'Deactivated') {
      this.practiceDeactivatedHandler()
    }
  },

  destroyed () {
    this.$loggedOutBroadcastChannel.removeEventListener("message", this.loggedOutHandler)

    this.$socket.removeListener('Practice Notification Update Profile', this.updatePermissions)
    this.$socket.removeListener('Practice Notification Delete Profile', this.toggleConfirmationModal)

    this.$socket.removeListener('Locum Notification Account Deactivated', this.locumAccountDeactivatedHandler)
    this.$socket.removeListener('Locum Notification Account Deactivated By Admin', this.locumAccountDeactivatedHandler)

    this.$socket.removeListener('User Notification Account Deleted', this.accountDeletedHandler)

    this.$socket.removeListener('Practice Notification Practice Deactivated', this.practiceDeactivatedHandler)
    this.$socket.removeListener('Practice Notification Practice Deactivated By Admin', this.practiceDeactivatedHandler)

    this.$socket.removeListener('Practice Notification Practice Deleted', this.practiceDeletedHandler)

    this.$socket.removeListener('Practice Notification Practice User Deleted', this.practiceUserDeletedHandler)
  },

  methods: {
    checkSurvey () {
      const domain = this.$auth.user && this.$auth.user.domain && this.$auth.user.domain.toLowerCase()
      console.log('checkSurvey', domain)
      if (domain) {
        this.loadingSurvey = true
        this.$axios.get(`/api/v1/surveys/${domain}`).then((response) => {
          const survey = response.data.data.survey
          this.survey = survey
          if (survey && survey.survey_questions) {
            this.surveyResponseAnswers = survey.survey_questions.map((surveyQuestion) => {

              return {
                survey_question_id: surveyQuestion.id,
                question_type: surveyQuestion.question_type,
                question: surveyQuestion.question,
                answer: '',
              }
            })
          }
        }).catch((err) => {
          console.log('err', err.response || err)

          let message = null

          if (err.response) {
            if (err.response.status === 400 && err.response.data.error_messages && err.response.data.error_messages.length > 0) {
              message = err.response.data.error_messages.map(errorMessage => errorMessage.message).join(',')
            } else {
              message = err.response.data.message
            }
          } else if (err.request) {
            message = 'Something went wrong!'
          } else {
            message = err.message
          }
        
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "danger",
            text: [`${message}`,],
          })
        }).finally(() => {
          this.loadingSurvey = false
        })
      }
    },

    errorHandler (err) {
      console.log('err', err.response || err)

      let message = null

      if (err.response) {
        if (err.response.status === 400 && err.response.data.error_messages && err.response.data.error_messages.length > 0) {
          message = err.response.data.error_messages.map(errorMessage => errorMessage.message).join(',')
        } else {
          message = err.response.data.message
        }
      } else if (err.request) {
        message = 'Something went wrong!'
      } else {
        message = err.message
      }

      // this.errorAlerts.push(message)

      // return

      if (message) {
        this.$store.commit('SET_NOTIFICATION', {
          enabled: true,
          status: 'danger',
          text: [`${message}`,],
        })
      }
    },

    submitServeyResponse () {
      console.log('submitServeyResponse', this.surveyResponseAnswers)
      this.submittingServeyResponse = true
      this.$axios.post('/api/v1/survey-responses', {
        survey_id: this.survey.id,
        survey_response_answers: this.surveyResponseAnswers,
      }).then(() => {
        this.surveyResponseSubmitted = true
      }).catch(this.errorHandler).finally(() => {
        this.submittingServeyResponse = false
      })
    },

    locumAccountDeactivatedHandler () {
      this.showLocumAccountDeactivatedModal = true
    },

    accountDeletedHandler () {
      this.showUserAccountDeletedModal = true
    },

    practiceDeactivatedHandler () {
      this.showPracticeDeactivatedModal = true
    },

    practiceDeletedHandler () {
      this.showPracticeDeletedModal = true
    },

    practiceUserDeletedHandler () {
      this.showPracticeUserDeletedModal = true
    },

    toggleConfirmationModal () {
      this.confirmation_modal = true
    },

    updatePermissions (user) {
      if (
        user
        && user.practice_detail
        && user.practice_detail.permissions
        && user.practice_detail.permissions.length > 0
      ) {
        this.$store.commit("SET_PERMISSIONS", user.practice_detail.role.permissions)
      } else {
        this.$store.commit("SET_PERMISSIONS", [])
      }
    },

    getInit () {
      this.user = this.$auth.user
    },

    logout () {
      this.$axios
        .post("/api/v1/logout")
        .then(() => {
          this.$store.commit("billing/CLEAR_PRACTICE_BILLING_NOTIFICATION")
          this.$store.commit("billing/CLEAR_LOCUM_BILLING_NOTIFICATION")
          this.$store.commit("jobs/CLEAR_PRACTICE_JOB_NOTIFICATION")
          this.$store.commit("jobs/CLEAR_LOCUM_JOB_NOTIFICATION")
          console.log("Socket Logged Out")
          console.log("One Signal Logged Out")
        })
        .catch(err => {
          console.log("err", err.response || err)
          if (err.response.data.message) {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "danger",
              text: [`${err.response.data.message}`,],
            })
          }
        })
        .finally(() => {
          this.$emit("modal", false)
          this.$store.commit("TOGGLE_SIDEBAR", false)
          return this.loggedOutHandler()
        })
        .then(() => {
          this.$loggedOutBroadcastChannel.postMessage()
        })
        .catch(err => {
          console.log("err", err.response || err)
          if (err.response.data.message) {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "danger",
              text: [`${err.response.data.message}`,],
            })
          }
        })
    },

    async loggedOutHandler () {
      try {
        await this.$auth.logout()
        this.$auth.$storage.setUniversal("_token.local", "")
        this.$router.push("/")
      } catch (err) {
        console.log("err", err)
      }
    },

    confirm () {
      this.$auth.logout().finally(() => {
        this.$auth.$storage.setUniversal("_token.local", "")
        this.$router.push("/")
      })
    },

    close () {
      this.$store.commit("TOGGLE_SIDEBAR", false)
      document.body.style.overflow = "auto"
    },
  },
}
</script>

<style scoped>
.shield {
  z-index: 511;
}

.sidebar {
  position: fixed;
  margin-left: -220px;
  width: 200px;
  height: 100%;
  overflow: auto;
  border-right: solid 1px#ccc;
  transition: all 0.3s ease-in-out;
  background-color: rgb(2, 4, 12);
  z-index: 55;
}

.toggled-left {
  margin-left: 0;
}

.close-button {
  display: block;
}

@media screen and (min-width: 1281px) {
  .sidebar {
    z-index: 100;
    margin-left: 0;
  }

  .close-button {
    display: none;
  }
}

.survey-modal {
  position: fixed;
  background-color: white;
  z-index: 512;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.error-alert {
  position: fixed;
  top: 0;
  left: 40%;
  z-index: 700;
  display: flex;
  justify-content: center;
  margin-left: -40px;
}

@media screen and (max-width: 600px) {
  .error-alert {
    width: 100%;
    left: 0;
    margin-left: 0;
  }
}
</style>
