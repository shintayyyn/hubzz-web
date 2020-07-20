<template>
  <section class="flex w-full">
    <div class="relative h-full w-full flex flex-col justify-between overflow-y-hidden">
      <MessagesCenterPanelTop :user="user" class="mt-10 md:mt-0" />

      <div class="h-full px-4 md:px-20 md:pt-20" />

      <MessagesCenterPanelForm :user="user" />
    </div>
  </section>
</template>

<script>
import MessagesCenterPanelTop from "@/components/Messages/CenterPanel/MessagesCenterPanelTop"
import MessagesCenterPanelForm from "@/components/Messages/CenterPanel/MessagesCenterPanelForm"

export default {
  components: {
    MessagesCenterPanelTop,
    MessagesCenterPanelForm,
  },

  data () {
    return {
      user: null,
    }
  },

  mounted () {
    if (window.innerWidth < 768) {
      this.$store.commit("IS_MOBILE", false)
    }

    const userId = this.$route.params.userId

    this.$axios.get('/api/v1/conversations/search-users', {
      params: {
        id: userId,
      },
    }).then((response) => {
      const user = response.data.data.users.length > 0
        ? response.data.data.users[0]
        : null

      if (user) {
        this.user = {
          ...user,
          name: `${user.personal_detail.first_name} ${user.personal_detail.last_name}`,
          profession: user.locum_detail_profession_name
            ? user.locum_detail_profession_name
            : user.practice_detail_practice_role
              ? `${user.practice_detail_practice_role} (${user.practice_name})`
              : null,
          status: user.is_online,
        }
      }
    }).catch(err => {
      console.log("err", err.response || err)

      let message = null

      if (err.response) {
        message = err.response.data.message
      } else if (err.request) {
        message = "Something weng wrong!"
      } else {
        message = err.message
      }

      if (message) {
        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "danger",
          text: [`${message}`,],
        })
      }
    })
  },

  created () {
    this.$store.commit("chat/DELETE_ACTIVE_CONVERSATION")
  },
}
</script>
