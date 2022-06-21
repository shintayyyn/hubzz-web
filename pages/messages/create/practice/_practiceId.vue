<template>
  <section class="flex w-full">
    <div class="relative h-full w-full flex flex-col justify-between overflow-y-hidden">
      <MessagesCenterPanelTop :practice="practice" class="mt-10 md:mt-0" />

      <div class="h-full px-4 md:px-20 md:pt-20" />

      <MessagesCenterPanelForm :practice="practice" />
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
      practice: null,
    }
  },

  mounted () {
    if (window.innerWidth < 768) {
      this.$store.commit("IS_MOBILE", false)
    }

    const practiceId = this.$route.params.practiceId

    this.$axios.get('/api/v1/conversations/search-practices', {
      params: {
        id: practiceId,
      },
    }).then((response) => {
      const practice = response.data.data.practices.length > 0
        ? response.data.data.practices[0]
        : null

      if (practice) {
        this.practice = {
          ...practice,

        }
      }
    }).catch(err => {
      console.log("err", err.response || err)

      let message = null

      if (err.response) {
        message = err.response.data.message
      } else if (err.request) {
        message = "Something went wrong!"
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
