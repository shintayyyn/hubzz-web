<template>
  <div class="flex flex-col w-full">
    <div class="text-xs sm:text-sm font-bold">Candidates</div>
    <div
      class="bg-white rounded-lg shadow-lg m-0 my-4 py-3 px-5"
      v-for="user in applicants"
      :key="user.id"
    >
      <div class="flex flex-row flex-no-wrap justify-between items-center hover:text-gray-600">
        <div @click.prevent="show(user.id)" class="cursor-pointer">
          <AppAvatar
            :height="'40px'"
            :width="'40px'"
            :src="user.avatar && user.avatar.file && user.avatar.file.url ? user.avatar.file.url : ''"
          />
        </div>
        <div
          class="text-sm font-bold leading-loose w-full px-2 md:text-center cursor-pointer"
          @click.prevent="show(user.id)"
        >{{user.personal_detail.name}}</div>

        <div class="flex items-center">
          <button
            class="rounded-lg hover:bg-gray-300 focus:outline-none"
            @click.prevent="message(user)"
          >
            <svgicon name="chat" height="24" width="24" color="#888 #555 #fff" class="m-2" />
          </button>
          <button class="focus:outline-none" @click.prevent="show(user.id)">
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
        @pagechanged="pagechanged"
        @limitchanged="limitchanged"
        :loading="loading"
        :perPage="params.limit"
      />
    </div>

    <transition name="fade" mode="out-in">
    <div class="message-modal md:w-2/3 lg:w-1/2 xl:w-1/3" v-if="sendMessageModal">
      <SendMessageModal
          :user="user"
          @close="sendMessageModal=false"
          @showProfile="show(user.id)"
          :profileOption="true"
        />
    </div>
    </transition>
    <transition name="slide" mode="out-in">
      <div class="modal-container shadow-lg" v-if="modal">
        <SessionDetailModalShowCandidate
          @close="modal = false"
          :job="job"
          :user="user"
          @appointed="$emit('appointed')"
        />
      </div>
    </transition>
    <div class="shield modal-shield" v-if="modal" @click="closeModal()"></div>
    <div class="shield" v-if="sendMessageModal" @click="closeModal()"></div>
  </div>
</template>
<script>
import AppAvatar from "~/components/Base/AppAvatar";
import AppPagination from "@/components/Base/AppPagination";
import SessionDetailModalShowCandidate from "@/components/Sessions/SessionDetailModalShowCandidate";
import SendMessageModal from "@/components/Messages/SendMessageModal";
export default {
  components: {
    AppAvatar,
    AppPagination,
    SessionDetailModalShowCandidate,
    SendMessageModal
  },
  props: ["job"],
  data() {
    return {
      total: 0,
      applicants: [],
      current_page: 1,
      loading: false,
      params: {
        offset: 0,
        limit: 20
      },
      user: null,
      modal: false,
      sendMessageModal: false
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.total / this.params.limit);
    }
  },
  created() {
    this.getApplicantsCount();
  },
  methods: {
    getApplicantsCount() {
      this.$axios
        .$get(`/api/v1/practice/jobs/${this.job.id}/applicants/count`)
        .then(res => {
          this.total = res.data.count;
          this.getApplicants(this.params);
        });
    },
    getApplicants(params) {
      this.$axios
        .$get(`/api/v1/practice/jobs/${this.job.id}/applicants`, {
          params
        })
        .then(res => {
          this.applicants = res.data.users;
        });
    },
    pagechanged(page) {
      this.current_page = page;
      this.params.offset = this.params.limit * (page - 1);
      this.getApplicants(this.params);
    },
    limitchanged(limit) {
      this.current_page = 1;
      this.params.offset = 0;
      this.params.limit = limit;
      this.getApplicants(this.params);
    },
    show(id) {
      this.$axios.$get(`/api/v1/practice/locums/${id}`).then(res => {
        this.user = res.data.user;
        this.modal = true;
      });
    },
    message(user) {
      this.user = user;
      this.sendMessageModal = true;
    },
    closeModal(){
      if (this.modal){
        this.modal = false
      }else if(this.sendMessageModal){
        this.sendMessageModal = false
      }
    }
  }
};
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

