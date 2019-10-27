<template>
  <div class="flex justify-start overflow-x-auto">
    <!-- <div class="mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap">
      <div @click="goTo('profile')">Profile</div>
    </div>
    <div class="mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap">
      <div @click="goTo('users')">Users</div>
    </div>
    <div class="mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap">
      <div @click="goTo('surgeries')">Surgeries</div>
    </div>
    <div class="mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap">
      <div @click="goTo('standard-terms')">Standard Terms</div>
    </div>
    <div class="mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap">
      <div @click="goTo('related-jobs')">Related Jobs</div>
    </div>-->
    <nuxt-link
      :to="`/my-practice/${practiceType}/${$route.params.practiceId}/profile`"
      :event="$route.name.includes('my-practice-applied-practiceId-profile') ? '' : 'click'"
      class="mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
      :class="$route.name === `my-practice-${practiceType}-practiceId-profile` || $route.name === `my-practice-${practiceType}-practiceId` ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
    >Profile</nuxt-link>
    <nuxt-link
      :to="`/my-practice/${practiceType}/${$route.params.practiceId}/users`"
      :event="$route.name.includes('my-practice-applied-practiceId-users') ? '' : 'click'"
      class="mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
      :class="$route.name.includes(`my-practice-${practiceType}-practiceId-users`) ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
    >Users</nuxt-link>
    <nuxt-link
      :to="`/my-practice/${practiceType}/${$route.params.practiceId}/surgeries`"
      :event="$route.name.includes('my-practice-applied-practiceId-surgeries') ? '' : 'click'"
      class="mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
      :class="$route.name === `my-practice-${practiceType}-practiceId-surgeries` ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
    >Surgeries</nuxt-link>
    <nuxt-link
      :to="`/my-practice/${practiceType}/${$route.params.practiceId}/standard-terms`"
      :event="$route.name.includes('my-practice-applied-practiceId-standard-terms') ? '' : 'click'"
      class="mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
      :class="$route.name === `my-practice-${practiceType}-practiceId-standard-terms` ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
    >Standard Terms</nuxt-link>
    <nuxt-link
      :to="`/my-practice/${practiceType}/${$route.params.practiceId}/related-jobs`"
      :event="$route.name.includes('my-practice-applied-practiceId-related-jobs') ? '' : 'click'"
      class="mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
      :class="$route.name.includes(`my-practice-${practiceType}-practiceId-related-jobs`) ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
    >Related Jobs</nuxt-link>
  </div>
</template>
<script>
export default {
  props: ["practiceType"],
  methods: {
    goTo(activeTab) {
      this.$router.push({
        path: `/my-practice/${this.practiceType}/${this.$route.params.practiceId}/${activeTab}`
      });
    }
  }
};
</script>

