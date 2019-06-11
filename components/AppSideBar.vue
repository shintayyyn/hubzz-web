<template>
  <div class="sidebar-nav">
    <div
      v-if="$store.state.mobile"
      class="cursor-pointer text-2xl font-bold text-yellow-dark mt-5 px-4 mb-24"
      @click="$emit('close')"
    >X</div>
    <!-- @click="$store.commit('TOGGLE_DRAWER', false)" -->
    <div class="mt-20"></div>
    <div v-for="(item, index) in lists" :key="index" class="text-sm relative">
      <span
        class="absolute inset-y-0 left-0 border-solid bg-yellow-dark w-1 h-full"
        v-if="$route.path == item.route"
      ></span>
      <nuxt-link
        :to="item.route"
        class="block no-underline p-4"
        :class="$route.path == item.route ? 'text-yellow-dark' : 'text-black hover:text-grey-light'"
      >
        <span class="font-sans">{{item.name}}</span>
      </nuxt-link>
    </div>
    <div class="text-sm relative">
      <span
        class="absolute pin-l border-solid bg-yellow-dark w-1 h-full"
        v-if="$route.path == '/sign-out'"
      ></span>
      <button
        @click.prevent="signout"
        class="block no-underline p-4 focus:outline-none"
        :class="$route.path == '/sign-out' ? 'text-yellow-dark' : 'text-black hover:text-grey-light'"
      >
        <span class="font-sans">Sign Out</span>
      </button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      lists: []
    }
  },
  created() {
    let domain = this.$auth.user.domain
    let isActivated = this.$auth.user.is_activated
    let addedLists = []
    let defaultLists = [
      { name: 'Dashboard', route: '/' },
      { name: 'Account', route: '/account' }
    ]
    let otherLists = [
      { name: 'Billing', route: '/billing' },
      { name: 'FAQ', route: '/faq' },
      { name: 'Terms and Conditions', route: '/terms-and-conditions' },
      { name: 'Invite', route: '/invite' },
      { name: 'Contact Us', route: '/contact-us' }
    ]
    if (domain === 'Practice') {
      addedLists = [
        { name: 'Profile', route: '/profile' },
        { name: 'My Banks', route: '/my-banks' },
        { name: 'Sessions', route: '/sessions' }
      ]
    } else if (domain === 'Locum') {
      addedLists = [
        { name: 'Compliance', route: '/compliance' },
        { name: 'Availability', route: '/availability' },
        { name: 'Jobs', route: '/jobs' }
      ]
    }
    this.lists = [...defaultLists, ...addedLists, ...otherLists]

  },
  methods: {
    signout() {
      this.$store.commit('TOGGLE_SIGN_OUT_MODAL', true)
      this.$store.commit('SET_SIGNOUT_SHIELD', true)
    }
  }
}
</script>
<style>
</style>
