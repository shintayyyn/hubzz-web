<template>
  <div>
    <div class="flex border overflow-x-auto">
      <div
        @click.prevent="goTo('practice')"
        to="/profile"
        class="mr-5 p-3 text-sm font-bold cursor-pointer no-underline"
        :class="$route.query.profile_tab === 'practice' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Practice</div>

      <div
        @click.prevent="goTo('surgeries')"
        to="/profile/surgeries"
        class="mr-5 p-3 text-sm font-bold cursor-pointer no-underline"
        :class="$route.query.profile_tab === 'surgeries' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Branches / Surgeries</div>

      <div
        @click.prevent="goTo('documents')"
        to="/profile/documents"
        class="mr-5 p-3 text-sm font-bold cursor-pointer no-underline"
        :class="$route.query.profile_tab === 'documents' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Practice Documents</div>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    goTo(type) {
      const query = {
        ...this.$route.query,
        profile_tab: type
      };

      this.$router.push({ query });
    }
  }
};
</script>
