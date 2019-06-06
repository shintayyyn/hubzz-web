<template>
  <div>
    <!-- sidebar 500 499 -->
    <div class="sidebar">
      <AppSideBar @close="close"/>
    </div>
    <div class="sidebar-shield" v-if="$store.state.sidebar_shield"></div>
    <!-- signout 600 599 -->
    <div class="signout flex justify-center" v-if="$store.state.sign_out_modal">
      <SignOut/>
    </div>
    <div class="signout-shield" v-if="$store.state.signout_shield"></div>
    <!-- pratice - create job modal 510 509 -->
    <div class="create-job-modal shadow-lg" v-if="$auth.user.domain === 'Practice'">
      <CreateJobModal @close="closeCreateJobModal" v-if="$store.state.create_job_modal"/>
    </div>
    <div class="create-job-modal-shield" v-if="$store.state.create_job_shield"></div>
    <!-- practice - job details 510 509 -->
    <div class="job-detail-modal shadow-lg" v-if="$auth.user.domain === 'Practice'">
      <JobDetailModal @close="closeJobDetailModal" v-if="$store.state.job_detail_modal"/>
    </div>
    <div class="job-detail-modal-shield" v-if="$store.state.job_detail_shield"></div>
    <!-- practice - applied details 510 509 -->
    <div class="applied-detail-modal shadow-lg" v-if="$auth.user.domain === 'Practice'">
      <AppliedDetailModal
        @close="closeAppliedDetailModal"
        v-if="$store.state.applied_detail_modal"
      />
    </div>
    <div class="applied-detail-modal-shield" v-if="$store.state.applied_detail_shield"></div>
    <!-- practice - applied locum details 512 511 -->
    <div class="applied-locum-detail-modal shadow-lg" v-if="$auth.user.domain === 'Practice'">
      <AppliedLocumDetailModal
        @close="closeAppliedLocumDetailModal"
        v-if="$store.state.applied_locum_detail_modal"
      />
    </div>
    <div class="applied-locum-detail-modal-shield" v-if="$store.state.applied_locum_detail_shield"></div>
    <!-- practice - allocated details 510 509 -->
    <div class="allocated-detail-modal shadow-lg" v-if="$auth.user.domain === 'Practice'">
      <AllocatedDetailModal
        @close="closeAllocatedDetailModal"
        v-if="$store.state.allocated_detail_modal"
      />
    </div>
    <div class="allocated-detail-modal-shield" v-if="$store.state.allocated_detail_shield"></div>
    <!-- practice - completed details 510 509 -->
    <div class="completed-detail-modal shadow-lg" v-if="$auth.user.domain === 'Practice'">
      <CompletedDetailModal
        @close="closeCompletedDetailModal"
        v-if="$store.state.completed_detail_modal"
      />
    </div>
    <div class="completed-detail-modal-shield" v-if="$store.state.completed_detail_shield"></div>
    <!-- practice - unfilled details 510 509 -->
    <div class="unfilled-detail-modal shadow-lg" v-if="$auth.user.domain === 'Practice'">
      <UnfilledDetailModal
        @close="closeUnfilledDetailModal"
        v-if="$store.state.unfilled_detail_modal"
      />
    </div>
    <div class="unfilled-detail-modal-shield" v-if="$store.state.unfilled_detail_shield"></div>
    <!-- practice - cancelled details 510 509 -->
    <div class="cancelled-detail-modal shadow-lg" v-if="$auth.user.domain === 'Practice'">
      <CancelledDetailModal
        @close="closeCancelledDetailModal"
        v-if="$store.state.cancelled_detail_modal"
      />
    </div>
    <div class="cancelled-detail-modal-shield" v-if="$store.state.cancelled_detail_shield"></div>
    <!-- practice - declined details 510 509 -->
    <div class="declined-detail-modal shadow-lg" v-if="$auth.user.domain === 'Practice'">
      <DeclinedDetailModal
        @close="closeDeclinedDetailModal"
        v-if="$store.state.declined_detail_modal"
      />
    </div>
    <div class="declined-detail-modal-shield" v-if="$store.state.declined_detail_shield"></div>
    <!-- practice - my locum details details 510 509 -->
    <div class="my-locum-detail-modal shadow-lg" v-if="$auth.user.domain === 'Practice'">
      <MyLocumDetailModal
        @close="closeMyLocumDetailModal"
        v-if="$store.state.my_locum_detail_modal"
      />
    </div>
    <div class="my-locum-detail-modal-shield" v-if="$store.state.my_locum_detail_shield"></div>
    <!-- practice - add surgery modal 510 509 -->
    <div class="add-surgery-modal shadow-lg" v-if="$auth.user.domain === 'Practice'">
      <AddSurgeryModal @close="closeAddSurgeryModal" v-if="$store.state.add_surgery_modal"/>
    </div>
    <div class="add-surgery-modal-shield" v-if="$store.state.add_surgery_shield"></div>
    <!-- practice - add selected surgery surgery 512 511 -->
    <div
      class="add-selected-surgery-modal"
      v-if="$auth.user.domain === 'Practice' && $store.state.add_selected_surgery_modal"
    >
      <AddSelectedSurgeryModal/>
    </div>
    <div class="add-selected-surgery-shield" v-if="$store.state.add_selected_surgery_shield"></div>
    <!-- practice - remove uploaded document modal 510 509 -->
    <div class="remove-uploaded-document-modal">
      <RemoveUploadedDocumentModal
        v-if="$auth.user.domain === 'Practice' && $store.state.remove_uploaded_document_modal"
      />
    </div>
    <div
      class="remove-uploaded-document-shield"
      v-if="$store.state.remove_uploaded_document_shield"
    ></div>
    <!--  -->
    <div class="content">
      <!-- notification -->
      <div class="app-notification">
        <AppNotification/>
      </div>
      <!-- header -->
      <div class="header">
        <div class="flex flex-row flex-no-wrap justify-start">
          <div class="w-1/3 cursor-pointer" @click="toggle">
            <div v-if="$store.state.mobile">
              <div class="mx-4 my-2 bg-yellow-dark" style="width:30px;height:2px;"></div>
              <div class="mx-4 my-2 bg-yellow-dark" style="width:20px;height:2px;"></div>
            </div>
          </div>
          <div class="w-1/2 text-center">
            <img src="/images/hubzz-icon-transparent.png" style="width:25px;">
          </div>
          <div class="w-1/3 text-right leading-loose">
            <div class="px-6 text-xs xl:text-sm" v-if="$auth.user.domain === 'Practice'">
              <AppButton
                :label="'Create Job'"
                @click="toggleCreateJobModal"
                :inStyle="'font-size:small;padding:12px;'"
              />
            </div>
            <div class="px-6 text-xs xl:text-sm" v-else>{{$auth.user.email}}</div>
          </div>
        </div>
      </div>
      <!-- body -->
      <div class="body">
        <nuxt/>
      </div>
    </div>
  </div>
</template>
<script>
import AppButton from '@/components/Base/AppButton'
import AppSideBar from '@/components/AppSideBar'
import AppToggleSideBar from '@/components/AppToggleSideBar'
import AppNotification from '@/components/AppNotification'
import SignOut from '@/components/Auth/SignOut'
// practice
import CreateJobModal from '@/components/CreateJobModal'
import RemoveUploadedDocumentModal from '@/components/Profile/RemoveUploadedDocumentModal'
import AddSurgeryModal from '@/components/Profile/AddSurgeryModal'
import AddSelectedSurgeryModal from '@/components/Profile/AddSelectedSurgeryModal'
import JobDetailModal from '@/components/Session/JobDetailModal'
import AppliedDetailModal from '@/components/Session/AppliedDetailModal'
import AppliedLocumDetailModal from '@/components/Session/AppliedLocumDetailModal'
import AllocatedDetailModal from '@/components/Session/AllocatedDetailModal'
import CompletedDetailModal from '@/components/Session/CompletedDetailModal'
import UnfilledDetailModal from '@/components/Session/UnfilledDetailModal'
import CancelledDetailModal from '@/components/Session/CancelledDetailModal'
import DeclinedDetailModal from '@/components/Session/DeclinedDetailModal'
import MyLocumDetailModal from '@/components/MyLocums/MyLocumDetailModal'
export default {
  components: {
    AppButton,
    AppSideBar,
    AppToggleSideBar,
    AppNotification,
    SignOut,
    // practice
    CreateJobModal,
    RemoveUploadedDocumentModal,
    AddSurgeryModal,
    AddSelectedSurgeryModal,
    JobDetailModal,
    AppliedDetailModal,
    AppliedLocumDetailModal,
    AllocatedDetailModal,
    CompletedDetailModal,
    UnfilledDetailModal,
    CancelledDetailModal,
    DeclinedDetailModal,
    MyLocumDetailModal
  },
  middleware: 'isAuthenticated',
  beforeCreate() {
    this.$store.commit("CHECK_WINDOW_WIDTH");
    // this.$store.commit('SET_MONTHS')
  },
  created() {
    if (process.browser) {
      addEventListener("resize", () => {
        this.$store.commit("CHECK_WINDOW_WIDTH");
      });
    }
  },
  computed: {
    // get notification
    notify() {
      return this.$store.state.notification.enabled
    }
  },
  watch: {
    // disabled notify
    notify(value) {
      if (value) {
        setTimeout(() => {
          this.$store.commit('SET_NOTIFICATION', { enabled: false, status: '', text: '' })
        }, 2000)
      }
    },
    '$route'(value) {
      // close sidebar
      this.$store.commit('SET_SIDEBAR_SHIELD', false)
      let d = document.getElementsByClassName('sidebar')[0]
      d.className = "sidebar";
      document.body.style.overflow = 'auto'
    },
  },
  methods: {
    toggle() {
      this.$store.commit('SET_SIDEBAR_SHIELD', true)
      let d = document.getElementsByClassName('sidebar')[0]
      d.className += " toggled-left";
      document.body.style.overflow = 'hidden'
    },
    close() {
      this.$store.commit('SET_SIDEBAR_SHIELD', false)
      let d = document.getElementsByClassName('sidebar')[0]
      d.className = "sidebar";
      document.body.style.overflow = 'auto'
    },
    // practice
    toggleCreateJobModal() {
      this.$store.commit('SET_CREATEJOB_SHIELD', true)
      let d = document.getElementsByClassName('create-job-modal')[0]
      d.classList.toggle('toggled-right')
      document.body.style.overflow = 'hidden'
      this.$store.commit('SET_CREATEJOB_MODAL', true)
    },
    closeCreateJobModal() {
      this.$store.commit('SET_CREATEJOB_SHIELD', false)
      let d = document.getElementsByClassName('create-job-modal')[0]
      d.classList.toggle('toggled-right')
      document.body.style.overflow = 'auto'
      this.$store.commit('SET_CREATEJOB_MODAL', false)
    },
    closeJobDetailModal() {
      this.$store.commit('SET_JOBDETAIL_SHIELD', false)
      let d = document.getElementsByClassName('job-detail-modal')[0]
      d.classList.toggle('toggled-right')
      document.body.style.overflow = 'auto'
      this.$store.commit('SET_JOBDETAIL_MODAL', false)
    },
    closeAppliedDetailModal() {
      this.$store.commit('SET_APPLIEDDETAIL_SHIELD', false)
      let d = document.getElementsByClassName('applied-detail-modal')[0]
      d.classList.toggle('toggled-right')
      document.body.style.overflow = 'auto'
      this.$store.commit('SET_APPLIEDDETAIL_MODAL', false)
    },
    closeAppliedLocumDetailModal() {
      this.$store.commit('SET_APPLIEDLOCUMDETAIL_SHIELD', false)
      let d = document.getElementsByClassName('applied-locum-detail-modal')[0]
      d.classList.toggle('toggled-right')
      document.body.style.overflow = 'auto'
      this.$store.commit('SET_APPLIEDLOCUMDETAIL_MODAL', false)
    },
    closeAllocatedDetailModal() {
      this.$store.commit('SET_ALLOCATEDDETAIL_SHIELD', false)
      let d = document.getElementsByClassName('allocated-detail-modal')[0]
      d.classList.toggle('toggled-right')
      document.body.style.overflow = 'auto'
      this.$store.commit('SET_ALLOCATEDDETAIL_MODAL', false)
    },
    closeCompletedDetailModal() {
      this.$store.commit('SET_COMPLETEDDETAIL_SHIELD', false)
      let d = document.getElementsByClassName('completed-detail-modal')[0]
      d.classList.toggle('toggled-right')
      document.body.style.overflow = 'auto'
      this.$store.commit('SET_COMPLETEDDETAIL_MODAL', false)
    },
    closeUnfilledDetailModal() {
      this.$store.commit('SET_UNFILLEDDETAIL_SHIELD', false)
      let d = document.getElementsByClassName('unfilled-detail-modal')[0]
      d.classList.toggle('toggled-right')
      document.body.style.overflow = 'auto'
      this.$store.commit('SET_UNFILLEDDETAIL_MODAL', false)
    },
    closeCancelledDetailModal() {
      this.$store.commit('SET_CANCELLEDDETAIL_SHIELD', false)
      let d = document.getElementsByClassName('cancelled-detail-modal')[0]
      d.classList.toggle('toggled-right')
      document.body.style.overflow = 'auto'
      this.$store.commit('SET_CANCELLEDDETAIL_MODAL', false)
    },
    closeDeclinedDetailModal() {
      this.$store.commit('SET_DECLINEDDETAIL_SHIELD', false)
      let d = document.getElementsByClassName('declined-detail-modal')[0]
      d.classList.toggle('toggled-right')
      document.body.style.overflow = 'auto'
      this.$store.commit('SET_DECLINEDDETAIL_MODAL', false)
    },
    closeMyLocumDetailModal() {
      this.$store.commit('SET_MYLOCUMDETAIL_SHIELD', false)
      let d = document.getElementsByClassName('my-locum-detail-modal')[0]
      d.classList.toggle('toggled-right')
      document.body.style.overflow = 'auto'
      this.$store.commit('SET_MYLOCUMDETAIL_MODAL', false)
    },
    closeAddSurgeryModal() {
      this.$store.commit('SET_ADDSURGERY_SHIELD', false)
      let d = document.getElementsByClassName('add-surgery-modal')[0]
      d.classList.toggle('toggled-right')
      document.body.style.overflow = 'auto'
      this.$store.commit('SET_ADDSURGERY_MODAL', false)
    },
  }
}
</script>
<style>
body {
  margin: 0;
}
/* notification */
.app-notification {
  position: fixed;
  top: 0;
  left: 50%;
  z-index: 999;
}
/* sidebar / signout */
.sidebar {
  position: fixed;
  margin-left: -200px;
  width: auto;
  height: 100%;
  overflow: auto;
  border-right: solid 2px #edf2f7;
  transition: all 0.3s ease-in-out;
  background-color: white;
  z-index: 500;
}
.sidebar-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 499;
}
.signout {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 600;
}
.signout-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 599;
}
/* practice */
.create-job-modal {
  position: fixed;
  right: 0;
  margin-right: -100%;
  width: 100%;
  height: 100%;
  overflow: auto;
  border-left: solid 2px #edf2f7;
  transition: all 0.3s ease-in-out;
  background-color: white;
  z-index: 510;
}
.create-job-modal-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 509;
}
.remove-uploaded-document-modal {
  position: fixed;
  top: 0;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  width: 100%;
  z-index: 510;
}
.remove-uploaded-document-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 509;
}
.add-surgery-modal {
  position: fixed;
  right: 0;
  margin-right: -100%;
  width: 100%;
  height: 100%;
  overflow: auto;
  border-left: solid 2px #edf2f7;
  transition: all 0.3s ease-in-out;
  background-color: white;
  z-index: 510;
}
.add-surgery-modal-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 509;
}
.add-selected-surgery-modal {
  position: fixed;
  top: 0;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  width: 100%;
  z-index: 512;
}
.add-selected-surgery-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 511;
}
.job-detail-modal {
  position: fixed;
  right: 0;
  margin-right: -100%;
  width: 100%;
  height: 100%;
  overflow: auto;
  border-left: solid 2px #edf2f7;
  transition: all 0.3s ease-in-out;
  background-color: white;
  z-index: 510;
}
.job-detail-modal-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 509;
}
.applied-detail-modal {
  position: fixed;
  right: 0;
  margin-right: -100%;
  width: 100%;
  height: 100%;
  overflow: auto;
  border-left: solid 2px #edf2f7;
  transition: all 0.3s ease-in-out;
  background-color: white;
  z-index: 510;
}
.applied-detail-modal-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 509;
}
.applied-locum-detail-modal {
  position: fixed;
  right: 0;
  margin-right: -100%;
  width: 100%;
  height: 100%;
  overflow: auto;
  border-left: solid 2px #edf2f7;
  transition: all 0.3s ease-in-out;
  background-color: white;
  z-index: 512;
}
.applied-locum-detail-modal-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 511;
}
.allocated-detail-modal {
  position: fixed;
  right: 0;
  margin-right: -100%;
  width: 100%;
  height: 100%;
  overflow: auto;
  border-left: solid 2px #edf2f7;
  transition: all 0.3s ease-in-out;
  background-color: white;
  z-index: 510;
}
.allocated-detail-modal-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 509;
}
.completed-detail-modal {
  position: fixed;
  right: 0;
  margin-right: -100%;
  width: 100%;
  height: 100%;
  overflow: auto;
  border-left: solid 2px #edf2f7;
  transition: all 0.3s ease-in-out;
  background-color: white;
  z-index: 510;
}
.completed-detail-modal-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 509;
}
.unfilled-detail-modal {
  position: fixed;
  right: 0;
  margin-right: -100%;
  width: 100%;
  height: 100%;
  overflow: auto;
  border-left: solid 2px #edf2f7;
  transition: all 0.3s ease-in-out;
  background-color: white;
  z-index: 510;
}
.unfilled-detail-modal-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 509;
}
.cancelled-detail-modal {
  position: fixed;
  right: 0;
  margin-right: -100%;
  width: 100%;
  height: 100%;
  overflow: auto;
  border-left: solid 2px #edf2f7;
  transition: all 0.3s ease-in-out;
  background-color: white;
  z-index: 510;
}
.cancelled-detail-modal-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 509;
}
.declined-detail-modal {
  position: fixed;
  right: 0;
  margin-right: -100%;
  width: 100%;
  height: 100%;
  overflow: auto;
  border-left: solid 2px #edf2f7;
  transition: all 0.3s ease-in-out;
  background-color: white;
  z-index: 510;
}
.declined-detail-modal-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 509;
}
.my-locum-detail-modal {
  position: fixed;
  right: 0;
  margin-right: -100%;
  width: 100%;
  height: 100%;
  overflow: auto;
  border-left: solid 2px #edf2f7;
  transition: all 0.3s ease-in-out;
  background-color: white;
  z-index: 510;
}
.my-locum-detail-modal-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 509;
}

/* locums */
.availability-modal {
  position: fixed;
  right: 0;
  margin-right: -100%;
  width: 100%;
  height: 100vh;
  overflow: auto;
  border-left: solid 2px #edf2f7;
  transition: all 0.3s ease-in-out;
  background-color: white;
  z-index: 510;
}
.availability-modal-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 509;
}

.toggled-left {
  margin-left: 0;
}
.toggled-right {
  margin-right: -0%;
}

.header {
  padding-top: 10px;
  padding-bottom: 10px;
}
.content {
  height: auto;
  padding: 1px;
  margin-left: 0;
}

@media screen and (min-width: 900px) {
  .sidebar {
    margin-left: 0;
  }
  .toggled-right {
    margin-right: -5%;
  }
  .content {
    margin-left: 200px;
  }
  /* practice */
  .create-job-modal {
    width: 95%;
  }
  .add-surgery-modal {
    width: 95%;
  }
  .applied-locum-detail-modal {
    width: 95%;
  }
}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.1s ease-in-out;
}
.slide-enter,
.slide-leave-to {
  transform: translateX(-50px);
}
/* @media screen and (max-width: 700px) {
  .sidebar {
    width: 100%;
    height: auto;
    position: relative;
  }
  .sidebar a {float: left;}
  div.content {
    margin-left: 0;
  }
} */

/* @media screen and (max-width: 400px) {
  .sidebar a {
    text-align: center;
    float: none;
  }
} */
</style>


