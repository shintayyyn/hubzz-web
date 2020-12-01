<template>
  <section class="relative">
    <AppTable
      v-if="total > 0 && !hasParentPractice"
      :total="total"
      :items="invitations"
      :loading="loading"
      :currentPage="current_page"
      :perPage="params.limit"
      :columns="columns"
      :orderBy="params.order_by"
      :customWidth="700"
      @pagechanged="pagechanged"
      @limitchanged="limitchanged"
    >
      <template v-slot:status_slot="slotProps">
        <div class="flex items-center justify-center">
          <div
            class="rounded-full px-6 py-1"
            :class="statusStyle(slotProps.item)"
          >
            {{ getStatus(slotProps.item) }}
          </div>
        </div>
      </template>
      <template v-slot:actions="slotProps">
        <div class="flex flex-wrap justify-center">
          <AppButton
            :label="'View'"
            @click="$router.push({ path: `/spoke-surgery-management/invitations/hub/${slotProps.item.id}` })"
          />
        </div>
      </template>
    </AppTable>
    <div
      v-else-if="total === 0 && !hasParentPractice"
      class="py-4 text-center text-gray-500"
    >
      No Hub invitations at the moment
    </div>
    <div
      v-else-if="total === 0 && hasParentPractice"
      class="py-4 text-center text-gray-500"
    >
      You already have Practice Hub
    </div>
    <transition name="fade" mode="out-in">
      <nuxt-link
        v-if="['spoke-surgery-management-invitations-hub-invitationId',].includes($route.name)"
        :to="'/spoke-surgery-management/invitations/hub'"
        class="shield"
      />
    </transition>
    <nuxt-child />
  </section>
</template>
<script>
import AppTable from "@/components/Base/AppTable"
import AppButton from "@/components/Base/AppButton"
export default {
  transition: {
    name: "fade",
    mode: "out-in",
  },
  components: {
    AppTable,
    AppButton,
  },
  data () {
    return {
      hasParentPractice: false,

      total: 0,
      invitations: [],
      loading: false,

      current_page: 1,
      params: {
        offset: 0,
        limit: 5,
        order_by: [],
        is_invitation_accepted: false,
      },

      columns: [
        {
          name: "Hub Surgery",
          dataIndex: "practice.surgery.name",
          class: "text-left",
          sortable: false,
        },
        {
          name: "Phone number",
          dataIndex: "practice.phone_number",
          class: "text-left",
        },
        {
          name: "Status",
          slot: true,
          slotName: "status_slot",
          dataIndex: "",
          class: "text-center",
        },
        {
          name: "Actions",
          dataIndex: "actions",
          class: "text-center",
        },
      ],
    }
  },
  async asyncData ({ app, }) {
    try {
      let responsePractice = await app.$axios.$get(
        `/api/v1/practice/me/parent-surgery`
      )

      let hasParentPractice
        = responsePractice
        && responsePractice.data
        && responsePractice.data.practice
        && responsePractice.data.practice.parent_practice_id
          ? responsePractice.data.practice.parent_practice_id
          : null

      let total = 0
      let invitations = []
      if (!hasParentPractice) {
        let responseInvitationCount = await app.$axios.$get(
          `/api/v1/practice/me/parent-surgery/invitations-count`,
          {
            params: {
              is_invitation_accepted: false,
              manual_status: "Active",
            },
          }
        )
        total = responseInvitationCount.data.count

        let responseInvitations = await app.$axios.$get(
          `/api/v1/practice/me/parent-surgery/invitations`,
          {
            params: {
              limit: 5,
              is_invitation_accepted: false,
              manual_status: "Active",
            },
          }
        )

        invitations = responseInvitations.data.practice_surgeries
      }
      return {
        total,
        invitations,
        hasParentPractice: hasParentPractice ? true : false,
      }
    } catch (err) {
      throw err
    }
  },
  mounted () {
    this.addSocketListeners()
  },
  destroyed () {
    this.removeSocketListener()
  },
  methods: {
    addSocketListeners () {
      this.$socket.on(
        "Practice Notification Practice Surgery Created",
        this.getInvitationPromiseAll
      )
      this.$socket.on(
        "Practice Notification Practice Surgery Deleted",
        this.getInvitationPromiseAll
      )
      this.$socket.on(
        "Practice Notification Accept Surgery",
        this.getInvitationPromiseAll
      )
      this.$socket.on(
        "Practice Notification Practice Surgery Surgery Rejected",
        this.getInvitationPromiseAll
      )
    },
    removeSocketListener () {
      this.$socket.removeListener(
        "Practice Notification Practice Surgery Created",
        this.getInvitationPromiseAll
      )
      this.$socket.removeListener(
        "Practice Notification Practice Surgery Deleted",
        this.getInvitationPromiseAll
      )
      this.$socket.removeListener(
        "Practice Notification Accept Surgery",
        this.getInvitationPromiseAll
      )
      this.$socket.removeListener(
        "Practice Notification Practice Surgery Surgery Rejected",
        this.getInvitationPromiseAll
      )
    },
    getInvitationPromiseAll () {
      Promise.all([
        this.$axios.$get(
          `/api/v1/practice/me/parent-surgery/invitations-count`,
          {
            params: {
              is_invitation_accepted: false,
            },
          }
        ),
        this.$axios.$get(`/api/v1/practice/me/parent-surgery/invitations`, {
          params: {
            offset: 0,
            limit: 5,
            is_invitation_accepted: false,
          },
        }),
      ])
        .then(([responseCount, response,]) => {
          this.invitations
            = response.data && response.data.practice_surgeries
              ? response.data.practice_surgeries
              : []
          this.total = responseCount.data.count
        })
        .catch(err => {
          console.log("err", err.response || err)
          throw err
        })
    },
    getStatus (surgery) {
      let status = "Invited"
      if (surgery.terminated_at) {
        status = "Terminated"
      } else if (surgery.termination_requested_at) {
        if (surgery.invitation_accepted_at) {
          status = "Termination Requested"
        } else {
          status = "Cancellation Requested"
        }
      } else if (surgery.invitation_rejected_at) {
        status = "Rejected"
      } else if (surgery.invitation_accepted_at) {
        status = "Active"
      }
      return status
    },
    statusStyle (surgery) {
      this.getStatus(surgery)
      switch (this.getStatus(surgery)) {
      case "Active":
        return "bg-green-500 text-white"
      case "Rejected":
        return "bg-red-600 text-white"
      case "Termination Requested":
        return "bg-orange-500 text-white"
      case "Terminated":
        return "bg-red-700 text-white"
      default:
        return "bg-yellow-400 text-black"
      }
    },
    limitchanged (limit) {
      this.current_page = 1
      this.params.offset = 0
      this.params.limit = limit
      this.getHubInvitations(this.params)
    },
    pagechanged (page) {
      this.current_page = page
      this.params.offset = this.params.limit * (page - 1)
      this.getHubInvitations(this.params)
    },
  },
}
</script>
