<template>
  <div
    v-if="$route.params.slug !== 'new'"
    class="panel-top p-4 w-full flex flex-col justify-center border-b"
  >
    <div class="font-bold text-lg">
      <span>{{ details.name }}</span>
    </div>
    <div class="text-sm text-grey-dark">
      <span class>{{ details.profession }}</span>
      <span class="px-2 text-lg">|</span>
      <span class>
        <span
          :class="details.status ? 'bg-green-light' : 'bg-grey'"
          class="inline-block py-1 px-1 rounded-full"
        ></span>
        {{ details.status === true ? 'Online' : 'Offline' }}
      </span>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      messages: [],
      details: {
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
        } else {
          this.details.name =
            res.data.messages[0].receiver_first_name +
            " " +
            res.data.messages[0].receiver_last_name;

          this.details.profession =
            res.data.messages[0].receiver.practice_detail.practice_role;
        }
      });
    }
  }
};
</script>
<style>
.panel-top {
  min-height: 77px;
}
</style>
