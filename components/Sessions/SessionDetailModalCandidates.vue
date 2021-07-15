<template>
  <div class="flex flex-col w-full mt-4">
    <div class="text-xs sm:text-sm font-bold">
      Candidates
    </div>
    <div
      v-if="applicants.length === 0 && loading"
      class="relative flex w-full"
      style="min-height:80px"
    >
      <AppLoading :loading="loading" spinner />
    </div>

    <template v-if="applicants.length > 0">
      <div
        v-for="applicantUser in applicants"
        :key="applicantUser.id"
        class="bg-white rounded-lg border m-0 my-4 py-3 pl-3 md:pl-5 md:pr-2"
      >
        <div class="flex flex-row flex-no-wrap justify-between items-center hover:text-gray-600">
          <div class="cursor-pointer" @click.prevent="show(applicantUser.id)">
            <AppAvatar
              :height="'40px'"
              :width="'40px'"
              :src="applicantUser.avatar && applicantUser.avatar.file && applicantUser.avatar.file.url ? applicantUser.avatar.file.url : ''"
            />
          </div>
          <div
            class="text-sm font-bold leading-tight w-full px-2 md:text-center cursor-pointer truncate"
            @click.prevent="show(applicantUser.id)"
          >
            {{ applicantUser.personal_detail.name }}
          </div>
          <!-- <div
            v-if="!applicantUser.locum_job_applied_update_accepted"
            class="focus:outline-none"
          >not yet accepted</div>-->

          <div class="flex items-center">
            <template v-if="applicantUser.is_favorite">
              <svgicon
                name="on-star"
                height="25"
                width="25"
                class="cursor-pointer fill-current text-gray-700 hover:text-gray-800"
                @click="unfavorite(applicantUser)"
              />
            </template>
            <template v-else>
              <svgicon
                name="off-star"
                height="25"
                width="25"
                class="cursor-pointer fill-current text-gray-700 hover:text-gray-800"
                @click="favorite(applicantUser)"
              />
            </template>
            <button
              class="rounded-lg hover:bg-gray-300 focus:outline-none ml-2"
              @click.prevent="message(applicantUser)"
            >
              <svgicon name="chat" height="24" width="24" color="#888 #555 #fff" class="m-2" />
            </button>
            <button class="focus:outline-none" @click.prevent="show(applicantUser.id)">
              <svgicon name="arrow-right" height="20" width="20" class="fill-current m-2" />
            </button>
          </div>
        </div>
      </div>
      <div class="bottom-0 w-full">
        <AppPagination
          :total="total"
          :totalPages="totalPages"
          :currentPage="current_page"
          :loading="loading"
          :perPage="params.limit"
          @pagechanged="pagechanged"
          @limitchanged="limitchanged"
        />
      </div>
    </template>

    <transition name="fade" mode="out-in">
      <div v-if="sendMessageModal" class="message-modal md:w-2/3 lg:w-1/2 xl:w-1/3">
        <SendMessageModal
          :user="user"
          :profileOption="true"
          @close="sendMessageModal=false"
          @showProfile="show(user.id)"
        />
      </div>
    </transition>
    
    <transition name="slide" mode="out-in">
      <div v-if="modal" class="modal-container shadow-lg">
        <SessionDetailModalShowCandidate
          :job="job"
          :user="user"
          @close="modal = false"
          @appointed="$emit('appointed')"
        />
      </div>
    </transition>

    <div v-if="modal" class="shield modal-shield" @click="closeModal()" />

    <div v-if="sendMessageModal" class="shield" @click="closeModal()" />

    <AppConfirmationModal
      :label="confirmation_text"
      :confirmLabel="'Yes'"
      :cancelLabel="'Cancel'"
      :modal="confirmation_modal"
      @confirm="confirm"
      @cancel="confirmation_modal = false"
    />
  </div>
</template>

<script>
import AppAvatar from "~/components/Base/AppAvatar"
import AppPagination from "@/components/Base/AppPagination"
import AppConfirmationModal from "@/components/Base/AppConfirmationModal"
import AppLoading from "@/components/Base/AppLoading"
import SessionDetailModalShowCandidate from "@/components/Sessions/SessionDetailModalShowCandidate"
import SendMessageModal from "@/components/Messages/SendMessageModal"

export default {
  components: {
    AppAvatar,
    AppPagination,
    AppConfirmationModal,
    AppLoading,
    SessionDetailModalShowCandidate,
    SendMessageModal,
  },

  props: {
    job: {
      type: Object,
      default: () => null,
    },
  },

  data () {
    return {
      loading: false,
      total: 0,
      applicants: [],
      current_page: 1,
      params: {
        offset: 0,
        limit: 5,
      },
      user: null,
      modal: false,
      sendMessageModal: false,
      confirmation_text: "",
      confirmation_modal: false,
      user_id: null,
    }
  },

  computed: {
    totalPages () {
      return Math.ceil(this.total / this.params.limit)
    },
  },

  async mounted () {
    this.loading = true
    try {
      Promise.all([
        this.$axios.$get(
          `/api/v1/practice/jobs/${this.job.id}/applicants/count`
        ),
        this.$axios.$get(
          `/api/v1/practice/jobs/${this.job.id}/applicants?offset=0&limit=5`
        ),
      ])
        .then(([responseCount, responseUsers,]) => {
          this.total = responseCount.data.count
          this.applicants = responseUsers.data.users
        })
        .finally(() => {
          this.loading = false
        })
    } catch (err) {
      console.log("err", err.response || err)
      if (err.response && err.response.data && err.response.data.message) {
        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "danger",
          text: [`${err.response.data.message}`,],
        })
      }
      this.loading = false
      throw err
    }
  },

  methods: {
    favorite (user) {
      this.confirmation_text = "Add this Locum to MyBanks?"
      this.confirmation_modal = true
      this.user = user
    },

    unfavorite (user) {
      this.confirmation_text = "Remove this Locum to My Banks?"
      this.confirmation_modal = true
      this.user = user
    },

    confirm () {
      if (!this.user.is_favorite) {
        this.$axios
          .$post(`/api/v1/practice/locums/${this.user.id}/favorite`)
          .then(() => {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: ["Added to favourites",],
            })
            this.user.is_favorite = true
          })
          .catch(err => {
            console.log("err", err.response || err)
            throw err
          })
          .finally(() => {
            this.confirmation_modal = false
          })
      } else if (this.user.is_favorite) {
        this.$axios
          .$delete(`/api/v1/practice/locums/${this.user.id}/favorite`)
          .then(() => {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: ["Remove to favourites",],
            })
            this.user.is_favorite = false
          })
          .catch(err => {
            console.log("err", err.response || err)
            throw err
          })
          .finally(() => {
            this.confirmation_modal = false
          })
      }
    },

    getApplicants (params) {
      this.$axios
        .$get(`/api/v1/practice/jobs/${this.job.id}/applicants`, {
          params,
        })
        .then(res => {
          this.applicants = res.data.users
        })
    },

    pagechanged (page) {
      this.current_page = page
      this.params.offset = this.params.limit * (page - 1)
      this.getApplicants(this.params)
    },

    limitchanged (limit) {
      this.current_page = 1
      this.params.offset = 0
      this.params.limit = limit
      this.getApplicants(this.params)
    },

    show (id) {
      this.$axios.$get(`/api/v1/practice/jobs/${this.job.id}/applicants/${id}`).then(res => {
        this.user = res.data.user
        this.modal = true
      })
    },

    message (user) {
      this.user = user
      this.sendMessageModal = true
    },

    closeModal () {
      if (this.modal) {
        this.modal = false
      } else if (this.sendMessageModal) {
        this.sendMessageModal = false
      }
    },
  },
}
</script>

<style scoped>
/* .avatar {
  max-width: 40px;
  max-height: 40px;
  min-width: 40px;
  min-height: 40px;
} */
/* img {
  border-radius: 50%;
} */
.modal-shield {
  z-index: 511;
}
.modal-container {
  z-index: 512;
}
@media screen and (min-width: 1200px) {
  .modal-container {
    width: 70%;
  }
}
.message-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 59;
}
</style>
