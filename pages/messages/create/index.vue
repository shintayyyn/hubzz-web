<template>
  <section class="flex w-full">
    <div class="relative h-full w-full flex flex-col justify-between overflow-y-hidden">
      <div class="h-full px-4 md:px-20 md:pt-20">
        <div v-if="!$route.query.new">
          <div class="md:absolute top-0 left-0 md:relative w-full py-4 flex items-center mt-12">
            <button
              class="flex mr-4 items-center font-bold focus:outline-none md:hidden"
              @click="goBack()"
            >
              <svgicon name="left-arrow" height="20" width="20" />
            </button>
            <span class="font-bold text-lg">Create Message</span>
          </div>

          <AppAutoComplete
            v-model="searchUser"
            :name="'search_user'"
            :label="'Send message to'"
            :placeholder="`Search for ${$auth.user.domain === 'Practice' ? 'Locum' : 'Practice'}`"
            :keyword="'practices'"
            :url="'api/v1/conversations/search-users'"
            @newConversation="newConversation"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import AppAutoComplete from "~/components/Base/AppAutoComplete"

export default {
  components: {
    AppAutoComplete,
  },

  data () {
    return {
      searchUser: '',
    }
  },

  mounted () {
    if (window.innerWidth < 768) {
      this.$store.commit("IS_MOBILE", false)
    }
  },

  created () {
    this.$store.commit("chat/DELETE_ACTIVE_CONVERSATION")
  },

  methods: {
    newConversation (user) {
      this.$router.push({
        path: `/messages/create/${user.id}`,
      })
    },

    goBack () {
      this.$router.push(`/messages`)
    },
  },
}
</script>
