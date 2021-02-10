<template>
  <div class="">
    <div class="flex flex-col items-start px-2">
      <!-- <nuxt-link
        :to="{ path: `/my-practice/platform`, query: { ...$route.query }}"
        class="cursor-pointer"
      >
        <svgicon name="left-arrow" height="32" width="32" />
      </nuxt-link> -->
      <AppBreadcrumbs :links="links" />
      <div class="flex flex-row justify-start overflow-x-auto mb-2 border-b border-sunglow w-full">
        <nuxt-link
          :to="{ path: `/my-practice/platform/${$route.params.practiceId}`, query: { ...$route.query}}"
          :event="$route.name === 'my-practice-index-platform-practiceId-index'? '' : 'click'"
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer"
          :class="$route.name === 'my-practice-index-platform-practiceId-index'? 'border-b-6 border-sunglow' : 'text-gray-600'"
        >Profile</nuxt-link>
        <nuxt-link
          :to="{ path: `/my-practice/platform/${$route.params.practiceId}/users`, query: { ...$route.query}}"
          :event="$route.name.includes('my-practice-index-platform-practiceId-index-users') ? '' : 'click'"
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer"
          :class="$route.name.includes('my-practice-index-platform-practiceId-index-users') ? 'border-b-6 border-sunglow' : 'text-gray-600'"
        >Users</nuxt-link>
        <nuxt-link
          :to="{ path: `/my-practice/platform/${$route.params.practiceId}/surgeries`, query: { ...$route.query}}"
          :event="$route.name.includes('my-practice-index-platform-practiceId-index-surgeries') ? '' : 'click'"
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer"
          :class="$route.name.includes('my-practice-index-platform-practiceId-index-surgeries') ? 'border-b-6 border-sunglow' : 'text-gray-600'"
        >Surgeries</nuxt-link>
        <!-- <nuxt-link
					:to="{ path: `/my-practice/platform/${$route.params.practiceId}/standard-terms`, query: { ...$route.query}}"
					class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer"
					:class="$route.name.includes('my-practice-index-platform-practiceId-index-standard-terms') ? 'border-b-6 border-sunglow' : 'text-gray-600'"
        >Standard Terms</nuxt-link>-->
        <nuxt-link
          :to="{ path: `/my-practice/platform/${$route.params.practiceId}/related-jobs`, query: { ...$route.query }}"
          :event="$route.name.includes('my-practice-index-platform-practiceId-index-related-jobs') ? '' : 'click'"
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer"
          :class="$route.name.includes('my-practice-index-platform-practiceId-index-related-jobs') ? 'border-b-6 border-sunglow' : 'text-gray-600'"
        >Related Jobs</nuxt-link>
      </div>
      <div class="w-full">
        <nuxt-child :practice="practice" />
      </div>
    </div>
  </div>
</template>
<script>
import AppBreadcrumbs from "@/components/Base/AppBreadcrumbs"
export default {
  components: {
    AppBreadcrumbs
  },
  computed: {
    links() {
      console.log("practiceeee", this.practice)
      let links = [
        {
          title: 'My Practice',
          url: '/my-practice'
        },
        {
          title: 'Platform',
          url: '/my-practice/platform'
        },
        {
          title: this.practice.name,
          url: `/my-practice/platform/${this.practice.id}`
        }
      ]

      if (this.$route.name === 'my-practice-index-platform-practiceId-index-users') {
        links.push({
          title: 'Users',
          url: `/my-practice/platform/${this.practice.id}/users?status=${this.$route.query.status}`
        })
      }else if (this.$route.name.includes('my-practice-index-platform-practiceId-index-surgeries')) {
        links.push({
          title: 'Surgeries',
          url: `/my-practice/platform/${this.practice.id}/surgeries?status=${this.$route.query.status}`
        })
      }else if (this.$route.name.includes('my-practice-index-platform-practiceId-index-related-jobs')) {
        links.push({
          title: 'Related Jobs',
          url: `/my-practice/platform/${this.practice.id}/related-jobs?status=${this.$route.query.status}`
        })
      }
      return links
    }
  },
  async asyncData({ app, params, error }) {
    try {
      const response = await app.$axios.$get(
        `/api/v1/locum/practices/${params.practiceId}`
      );

      const practice =
        response.data && response.data.practice ? response.data.practice : null;

      return {
        practice
      };
    } catch (err) {
      throw err;
    }
  }
};
</script>
<style scoped>
.modal-container {
  z-index: 510;
}
@media screen and (min-width: 1200px) {
  .modal-container {
    width: 80%;
  }
}
</style>