<template>
  <div class="flex flex-col w-full">
    <div class="text-xs sm:text-sm font-bold">Candidates</div>
    <div
      class="rounded-lg shadow-lg m-0 my-4 py-3 px-5 cursor-pointer"
      v-for="user in applicants"
      :key="user.id"
      @click="show(user.id)"
    >
      <div class="flex flex-row flex-no-wrap justify-between items-center">
        <AppAvatar
          :height="'40px'"
          :width="'40px'"
          :src="user.avatar && user.avatar.file && user.avatar.file.url ? user.avatar.file.url : ''"
        />
        <div class="text-xs sm:text-sm font-bold leading-loose">{{user.personal_detail.name}}</div>
        <div class="flex">
          <svgicon name="arrow-right" height="20" width="20" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import AppAvatar from "~/components/Base/AppAvatar";
export default {
  components: {
    AppAvatar
  },
  props: ["applicants"],
  methods: {
    show(id) {
      this.$axios.$get(`/api/v1/practice/locums/${id}`).then(res => {
        const user = res.data.user;
        this.$emit("show", user);
      });
      // console.log(this.$route.query)
      // const query = {
      //   ...this.$route.query
      // }
      // this.$router.push({ path: `/sessions/${this.$route.params.id}/locum/${id}`, query })
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

