<template>
  <div
    v-if="$route.params.slug && $route.params.slug !== 'new'"
    class="panel-top p-4 w-full flex items-center border-b leading-none"
  >
    <div class="pr-4 md:hidden">
      <button class="focus:outline-none" @click="goBack()">
        <svgicon name="left-arrow" height="32" width="32" />
      </button>
    </div>
    <div class="flex flex-col justify-center">
      <div class="font-bold md:text-lg">
        <span>{{ details.name }}</span>
      </div>
      <div class="text-xs md:text-sm text-gray-600">
        <span class>{{ details.profession }}</span>
        <span class="inline-block px-2 text-lg">|</span>
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
  computed: {
    usersOnline() {
      return this.$store.state.chat.users_online;
    }
  },
  created() {
    this.getDetails();
    let isOnline = this.usersOnline.map(user => user).includes(this.details.id);
    this.details.status = isOnline;
  },
  watch: {
    $route(to, from) {
      this.getDetails();
    },
    usersOnline(value) {
      let isOnline = value.map(user => user).includes(this.details.id);
      this.details.status = isOnline;
    }
  },
  methods: {
    getDetails() {
      let route = this.$router.app._route.params.slug;
      this.$axios.$get(`/api/v1/conversations/${route}?limit=1`).then(res => {
        let domain = this.$auth.user.domain;
        if (res.data.messages.length > 0) {
          if (res.data.messages[0].sender.domain !== domain) {
            this.details.name =
              res.data.messages[0].sender_first_name +
              " " +
              res.data.messages[0].sender_last_name;
            this.details.id = res.data.messages[0].sender_id;
            res.data.messages[0].sender.domain === "Locum"
              ? (this.details.profession =
                  res.data.messages[0].sender.locum_detail.profession.name +
                  " " +
                  res.data.messages[0].sender.domain)
              : (this.details.profession =
                  res.data.messages[0].sender.practice_detail.practice_role);
          } else {
            this.details.name =
              res.data.messages[0].receiver_first_name +
              " " +
              res.data.messages[0].receiver_last_name;
            res.data.messages[0].receiver.domain === "Locum"
              ? (this.details.profession =
                  res.data.messages[0].receiver.locum_detail.profession.name +
                  " " +
                  res.data.messages[0].receiver.domain)
              : (this.details.profession =
                  res.data.messages[0].receiver.practice_detail.practice_role);
            this.details.id = res.data.messages[0].receiver_id;
          }
        }
        let isOnline = this.usersOnline
          .map(user => user.id)
          .includes(this.details.id);
        this.details.status = isOnline;
      });
    },
    goBack() {
      this.$router.push(`/messages`);
    }
  }
};
</script>
<style>
.panel-top {
  min-height: 77px;
}
</style>
