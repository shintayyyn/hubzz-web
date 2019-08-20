<template>
  <section class="profile-section">
    <div class="modal-shield" v-if="shield"></div>
    <div class="flex overflow-x-auto whitespace-no-wrap">
      <nuxt-link
        to="/profile/practice"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.name === 'profile-practice'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Practice</nuxt-link>
      <nuxt-link
        to="/profile/branches-surgeries"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.name === 'profile-branches-surgeries' || $route.name === 'profile-branches-surgeries-create'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Branches / Surgeries</nuxt-link>
      <nuxt-link
        to="/profile/practice-documents"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.name === 'profile-practice-documents'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Practice Documents</nuxt-link>
      <nuxt-link
        v-if="$route.name === 'profile-branches-surgeries' || $route.name === 'profile-branches-surgeries-create'"
        to="/profile/branches-surgeries/create"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer hover:bg-yellow-500 rounded-lg"
      >
        Create
        <!-- <button
          class="bg-yellow-500 rounded-full font-bold text-3xl hover:text-white focus:outline-none"
          style="width:40px;height:40px;"
        >+</button>-->
      </nuxt-link>
    </div>
    <div class="mt-5">
      <nuxt-child />
    </div>
  </section>
</template>
<script>
export default {
  computed: {
    shield() {
      return this.$store.state.profile.shield;
    }
  },
  watch: {
    shield(value) {
      if (value) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
    }
  }
};
</script>
<style scoped>
.modal-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 509;
}
</style>