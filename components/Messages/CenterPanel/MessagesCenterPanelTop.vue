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

    <div v-if="conversation" class="flex flex-col justify-center leading-tight">
      <div class="font-bold md:text-lg">
        <span v-if="conversation.type === 'Admin'">Hubzz Admin</span>
        <span v-if="conversation.type !== 'Admin' && loggedInDomain === 'Locum' && conversation.practice">{{ conversation.practice.name }}</span>
        <span v-if="conversation.type !== 'Admin' && loggedInDomain === 'Practice' && conversation.locum_user">{{ conversation.locum_user.first_name }} {{ conversation.locum_user.last_name }}</span>
      </div>

      <div
        v-if="conversation.type !== 'Admin' && loggedInDomain === 'Locum' && conversation.locum_user"
        class="flex items-center text-xs md:text-sm text-gray-600"
      >
        <div class="flex items-center">
          <span
            :class="practiceHasOnline ? 'bg-green-400' : 'bg-gray-300'"
            class="rounded-full mr-1"
            style="padding: 5px"
          />

          <p class="inline-block">
            {{ practiceHasOnline ? 'Online' : 'Offline' }}
          </p>
        </div>
      </div>

      <div
        v-if="conversation.type !== 'Admin' && loggedInDomain === 'Practice' && conversation.locum_user"
        class="flex items-center text-xs md:text-sm text-gray-600"
      >
        <span class>{{ conversation.locum_user.locum_detail_profession_name }}</span>

        <span class="mx-1 text-lg">|</span>

        <div class="flex items-center">
          <span
            :class="conversation.locum_user.is_online ? 'bg-green-400' : 'bg-gray-300'"
            class="rounded-full mr-1"
            style="padding: 5px"
          />

          <p class="inline-block">
            {{ conversation.locum_user.is_online ? 'Online' : 'Offline' }}
          </p>
        </div>
      </div>
    </div>

    <div v-if="practice" class="flex flex-col justify-center leading-tight">
      <div class="font-bold md:text-lg">
        <span>{{ practice.name }}</span>
      </div>
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

    practice: {
      type: Object,
      default: () => null,
    },

    conversation: {
      type: Object,
      default: () => null,
    },
  },

  computed: {
    loggedInDomain () {
      return this.$auth.user ? this.$auth.user.domain : null
    },

    practiceHasOnline () {
      return this.conversation && this.conversation.practice && this.conversation.practice.users && this.conversation.practice.users.some((user) => user.is_online)
    },

    displayUser () {
      const user = this.user

      if (user) {
        const conversationMemberUser = user

        if (
          conversationMemberUser.domain === 'Practice'
          && (
            ['Deleted', 'Deactivated',].includes(conversationMemberUser.practice_user_status)
            || ['Deleted', 'Deactivated',].includes(conversationMemberUser.practice_status)
          )
        ) {
          return {
            name: "Hubzz User",
            profession: null,
            status: null,
          }
        }

        if (
          conversationMemberUser.domain === 'Locum'
          && ['Deleted', 'Deactivated',].includes(conversationMemberUser.locum_user_status)
        ) {
          return {
            name: "Hubzz User",
            profession: null,
            status: null,
          }
        }

        return {
          ...user,
          name: `${user.first_name || ''} ${user.last_name || ''}`,
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
