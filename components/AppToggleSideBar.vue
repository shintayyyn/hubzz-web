<template>
  <div class="togglebar-nav">
    <div class="mx-1  text-sm relative">
        <span class="text-yellow-dark font-bold text-2xl absolute pin-l p-5 cursor-pointer" @click="$store.commit('TOGGLE_DRAWER', false)">X</span>
    </div>
    <div class="mx-1 mt-20 text-sm relative">
      <span class="absolute pin-l border-solid bg-yellow w-1 h-full" v-if="$route.path == '/'"></span>
      <nuxt-link to="/" class="block no-underline p-4" :class="$route.path == '/' ? 'text-yellow-dark' : 'text-black hover:text-grey-light'">
        <span class="font-sans">Dashboard</span>
      </nuxt-link>
    </div>
    <div class="mx-1 text-sm relative">
      <span class="absolute pin-l border-solid bg-yellow w-1 h-full" v-if="$route.path == '/account'"></span>
      <nuxt-link to="/account" class="block no-underline p-4" :class="$route.path == '/account' ? 'text-yellow-dark' : 'text-black hover:text-grey-light'">
        <span class="font-sans">Account</span>
      </nuxt-link>
    </div>
    <div class="mx-1 text-sm relative">
      <span class="absolute pin-l border-solid bg-yellow w-1 h-full" v-if="$route.path == '/compliance'"></span>
      <nuxt-link to="/compliance" class="block no-underline p-4" :class="$route.path == '/compliance' ? 'text-yellow-dark' : 'text-black hover:text-grey-light'">
        <span class="font-sans">Compliance</span>
      </nuxt-link>
    </div>
    <div class="mx-1 text-sm relative">
      <span class="absolute pin-l border-solid bg-yellow w-1 h-full" v-if="$route.path == '/availability'"></span>
      <nuxt-link to="/availability" class="block no-underline p-4" :class="$route.path == '/availability' ? 'text-yellow-dark' : 'text-black hover:text-grey-light'">
        <span class="font-sans">Availability</span>
      </nuxt-link>
    </div>
    <div class="mx-1 text-sm relative">
      <span class="absolute pin-l border-solid bg-yellow w-1 h-full" v-if="$route.path == '/jobs'"></span>
      <nuxt-link to="/jobs" class="block no-underline p-4" :class="$route.path == '/jobs' ? 'text-yellow-dark' : 'text-black hover:text-grey-light'">
        <span class="font-sans">Jobs</span>
      </nuxt-link>
    </div>
    <div class="mx-1 text-sm relative">
      <span class="absolute pin-l border-solid bg-yellow w-1 h-full" v-if="$route.path == '/billing'"></span>
      <nuxt-link to="/billing" class="block no-underline p-4" :class="$route.path == '/billing' ? 'text-yellow-dark' : 'text-black hover:text-grey-light'">
        <span class="font-sans">Billing</span>
      </nuxt-link>
    </div>
    <div class="mx-1 text-sm relative">
      <span class="absolute pin-l border-solid bg-yellow w-1 h-full" v-if="$route.path == '/faq'"></span>
      <nuxt-link to="/faq" class="block no-underline p-4" :class="$route.path == '/faq' ? 'text-yellow-dark' : 'text-black hover:text-grey-light'">
        <span class="font-sans">FAQ</span>
      </nuxt-link>
    </div>
    <div class="mx-1 text-sm relative">
      <span class="absolute pin-l border-solid bg-yellow w-1 h-full" v-if="$route.path == '/terms-and-conditions'"></span>
      <nuxt-link to="/terms-and-conditions" class="block no-underline p-4" :class="$route.path == '/terms-and-conditions' ? 'text-yellow-dark' : 'text-black hover:text-grey-light'">
        <span class="font-sans">Terms and Conditions</span>
      </nuxt-link>
    </div>
    <div class="mx-1 text-sm relative">
      <span class="absolute pin-l border-solid bg-yellow w-1 h-full" v-if="$route.path == '/invite'"></span>
      <nuxt-link to="/invite" class="block no-underline p-4" :class="$route.path == '/invite' ? 'text-yellow-dark' : 'text-black hover:text-grey-light'">
        <span class="font-sans">Invite</span>
      </nuxt-link>
    </div>
    <div class="mx-1 text-sm relative">
      <span class="absolute pin-l border-solid bg-yellow w-1 h-full" v-if="$route.path == '/contact-us'"></span>
      <nuxt-link to="/contact-us" class="block no-underline p-4" :class="$route.path == '/contact-us' ? 'text-yellow-dark' : 'text-black hover:text-grey-light'">
        <span class="font-sans">Contact Us</span>
      </nuxt-link>
    </div>
    <div class="mx-1 text-sm relative">
      <span class="absolute pin-l border-solid bg-yellow w-1 h-full" v-if="$route.path == '/sign-out'"></span>
      <nuxt-link to="/sign-out" class="block no-underline p-4" :class="$route.path == '/sign-out' ? 'text-yellow-dark' : 'text-black hover:text-grey-light'">
        <span class="font-sans">Sign Out</span>
      </nuxt-link>
    </div>
  </div>
</template>
<script>
export default {

}
</script>
<style scoped>
.togglebar-nav {
  position: absolute;
  top: 0;
  width: 200px;
  margin: 0;
  padding: 0;
  /* padding-bottom: 50px; */
  padding-top: 10px;
  border-right: 1px solid lightgrey;
  height: 100%;
  background-color: white;
  z-index: 9;
}
</style>

