<template>
  <section class="header-section">
    <div class="flex flex-row flex-wrap justify-between">
      <div class="w-1/2 sm:w-1/3 cursor-pointer" @click="toggle">
        <div class="burger">
          <div class="my-2 bg-yellow-dark"></div>
          <div class="my-2 bg-yellow-dark"></div>
        </div>
      </div>
      <div class="w-1/2 text-right sm:w-1/3 sm:text-center">
        <img src="/images/hubzz-icon-transparent.png" class="logo">
      </div>
      <div class="w-full sm:w-1/3 text-right leading-loose">
        <div class="text-xs xl:text-sm" v-if="$auth.user.domain === 'Practice'">
          <AppButton
            :label="'Create Job'"
            @click="toggleCreateJobModal"
            :inStyle="'font-size:small;padding:12px;'"
          />
        </div>
        <div class="text-xs xl:text-sm" v-else>{{$auth.user.email}}</div>
      </div>
    </div>
  </section>
</template>
<script>
import AppButton from '@/components/Base/AppButton'
export default {
  components: {
    AppButton
  },
  methods: {
    toggle() {
      this.$store.commit('TOGGLE_SIDEBAR', true)
      document.body.style.overflow = 'hidden'
    },
    toggleCreateJobModal() {

    }
  }
}
</script>

<style scoped>
.header-section {
  width: 100%;
  margin-bottom: 50px;
}
.burger {
  display: block;
}
.burger div:first-child {
  width: 30px;
  height: 2px;
}
.burger div:nth-child(2) {
  width: 20px;
  height: 2px;
}
.logo {
  width: 25px;
}
@media screen and (min-width: 1200px) {
  .burger {
    display: none;
  }
}
</style>
