<template>
  <div class="flex flex-col w-full">
    
    <div class="text-xs sm:text-sm font-bold">Candidates</div>
    <div
      class="bg-white rounded-lg shadow-lg m-0 my-4 py-3 px-5 "
      v-for="user in applicants"
      :key="user.id"
    >
      <SendMessageModal :show="sendMessage" :user="user" @close="sendMessage=false" @showProfile="show(user.id)"/>
      <div class="flex flex-row flex-no-wrap justify-between items-center hover:text-gray-600">
        <div @click.prevent="show(user.id)" class="cursor-pointer">
        <AppAvatar
          :height="'40px'"
          :width="'40px'"
          :src="user.avatar && user.avatar.file && user.avatar.file.url ? user.avatar.file.url : ''"
        />
        </div>
        <div class="text-sm font-bold leading-loose w-full px-2 md:text-center cursor-pointer" @click.prevent="show(user.id)">{{user.personal_detail.name}}</div>
        
        <div class="flex items-center">
          <button class="bg-yellow-500 mx-2 rounded-lg hover:bg-yellow-400 focus:outline-none" @click="sendMessage = true">
            <svgicon name="chat" height="20" width="20" color="#888 #555 #fff" class="m-2"/>
          </button>
          <button class="focus:outline-none" @click.prevent="show(user.id)">
            <svgicon name="arrow-right" height="20" width="20" class="fill-current m-2"/>
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
  </div>
</template>
<script>
import AppAvatar from "~/components/Base/AppAvatar";
import AppPagination from "@/components/Base/AppPagination";
import SendMessageModal from "@/components/Messages/SendMessageModal";
export default {
  components: {
    AppAvatar,
    AppPagination,
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
      sendMessage: false
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
        const user = res.data.user;
        this.$emit("show", user);
      });
    }
  }
};
</script>
<style scoped>
.avatar {
  max-width: 40px;
  max-height: 40px;
  min-width: 40px;
  min-height: 40px;
}
img {
  border-radius: 50%;
}
</style>

