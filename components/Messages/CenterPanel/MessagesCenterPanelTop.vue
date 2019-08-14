<template>
  <div
    v-if="$route.params.slug !== 'new'"
    class="panel-top p-4 w-full flex items-center border-b leading-none"
  >
    <div class="pr-4 md:hidden">
      <button class="focus:outline-none" @click="goBack()">
        <svgicon name="left-arrow" height="32" width="32" />
      </button>
    </div>
    <div class="flex flex-col justify-center">
      <div class="font-bold text-lg">
        <span>{{ details.name }}</span>
      </div>
      <div class="text-sm text-gray-600">
        <span class>{{ details.profession }}</span>
        <span class="px-2 text-lg">|</span>
        <span
          :class="details.status ? 'bg-green-400' : 'bg-gray-300'"
          class="inline-block rounded-full"
          style="padding: 5px"
        ></span>
        {{ details.status ? 'Online' : 'Offline' }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      messages: [],
      details: {
        id: "",
        name: "",
        profession: "",
        status: false
      }
    };
  },
  created() {
    this.getDetails();
  },
  watch: {
    $route(to, from) {
      this.getDetails();
    },
    usersOnline(value) {
      if (value.includes(parseInt(this.details.id))) {
        this.details.status = true;
      }
    }
  },
  computed: {
    usersOnline() {
      return this.$store.state.chat.users_online;
    }
  },
  methods: {
    getDetails() {
      let route = this.$router.app._route.params.slug;
      this.$axios.$get(`/api/v1/conversations/${route}`).then(res => {
        let domain = this.$auth.user.domain;
        if (domain === "Practice") {
          this.details.name =
            res.data.messages[0].sender_first_name +
            " " +
            res.data.messages[0].sender_last_name;
          this.details.profession =
            res.data.messages[0].sender.locum_detail.profession.name +
            " " +
            res.data.messages[0].sender.domain;
          this.details.id = res.data.messages[0].sender_id;
        } else {
          this.details.name =
            res.data.messages[0].receiver_first_name +
            " " +
            res.data.messages[0].receiver_last_name;

          this.details.profession =
            res.data.messages[0].receiver.practice_detail.practice_role;
          this.details.id = res.data.messages[0].receiver_id;
        }

        // this.$axios.$get(`/api/v1/messages/user-presence`).then(res => {
        //   let user_id = res.data.users.find(id => {
        //     return id.id;
        //   });
        //   if (user_id.id === this.details.id) {
        //     this.details.status = true;
        //   } else {
        //     this.details.status = false;
        //   }
        // });
      });
    },
    goBack() {
      this.$store.commit("IS_MOBILE", true);
      this.$router.push(`/messages/`);
    }
  }
};
</script>
<style>
.panel-top {
  min-height: 77px;
}
</style>
