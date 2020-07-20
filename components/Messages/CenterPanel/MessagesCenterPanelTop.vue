<template>
  <div
    class="relative panel-top px-4 md:p-4 w-full flex items-center border-b leading-none"
    :class="$auth.user.domain === 'Locum' ? 'py-3' : 'pb-4 pt-6'"
  >
    <div class="pr-4 md:hidden">
      <button class="focus:outline-none" @click="goBack()">
        <svgicon name="left-arrow" height="20" width="20" />
      </button>
    </div>

    <div v-if="displayUser" class="flex flex-col justify-center leading-tight">
      <div class="font-bold md:text-lg">
        <span>{{ displayUser.name }}</span>
      </div>

      <div
        v-if="displayUser.profession && displayUser.status !== null"
        class="flex items-center text-xs md:text-sm text-gray-600"
      >
        <span class>{{ displayUser.profession }}</span>

        <span class="mx-1 text-lg">|</span>

        <div class="flex items-center">
          <span
            :class="displayUser.status ? 'bg-green-400' : 'bg-gray-300'"
            class="rounded-full mr-1"
            style="padding: 5px"
          />

          <p class="inline-block">
            {{ displayUser.status ? 'Online' : 'Offline' }}
          </p>
        </div>
      </div>
    </div>
    <!-- <span class="font-mono absolute right-0 border-2 border-gray-400 text-gray-400 rounded-full w-6 h-6 mx-4 font-bold text-sm flex items-center justify-center cursor-pointer">i</span> -->
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: () => null,
    },
  },

  computed: {
    displayUser () {
      const user = this.user

      if (user) {
        return {
          ...user,
          name: `${user.first_name} ${user.last_name}`,
          profession: user.locum_detail_profession_name
            ? user.locum_detail_profession_name
            : user.practice_detail_practice_role
              ? `${user.practice_detail_practice_role} (${user.practice_name})`
              : null,
          status: user.is_online,
        }
      }

      return null
    },
  },

  methods: {
    goBack () {
      if (this.$route.path != "/messages") {
        this.$router.push(`/messages`)
      }
    },
  },
  
}
</script>

<style>
  @media screen and (min-width: 768px) {
    .panel-top {
      min-height: 78px;
    }
  }
</style>
