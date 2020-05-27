<template>
  <div class="modal-container shadow-lg">
    <div class="p-4 md:p-8 w-full">
      <svgicon
        name="left-arrow"
        height="32"
        width="32"
        class="mb-2 cursor-pointer"
        @click="$router.push('/hub-surgery-management/invitations/hub')"
      />
      <div class="flex justify-start font-bold text-sm sm:text-xl mt-8">Invite Spoke / Stand Alone</div>
      <div class="relative bg-white rounded-lg shadow-lg p-4 md:p-8 mt-4 max-w-5xl">
        <AppInput
          v-model="search_text"
          :type="'text'"
          :name="'search'"
          :placeholder="'Surgery Name, Surgery Code, or keywords'"
          @submit="search"
          :error="formError.find(item => item.field === 'surgery_id')"
        />
        <AppButton :label="'Search'" @click="search" :inStyle="'padding:5px 14px;'" />
      </div>
      <div v-if="showResult && filteredPracticeSpokes.length === 0" class="mt-5">
        <div class="text-xs xl:text-base font-bold">{{ resultNotice }}</div>
      </div>
      <div
        class="rounded-lg shadow-lg overflow-auto mt-5 bg-white"
        v-if="showResult && filteredPracticeSpokes.length > 0"
      >
        <div
          class="text-xs lg:text-base font-bold p-4"
        >Select by clicking on the practice that you wish to add</div>

        <div
          class="border-t-2 p-4 cursor-pointer hover:bg-gray-400"
          v-for="(item) in filteredPracticeSpokes"
          :key="item.id"
          @click="select(item)"
        >
          <div class="flex flex-col justify-start text-xs xl:text-base">
            <div class="flex flex-col font-bold">
              <div>
                <span>{{item.surgery.name}}</span>
                <span
                  class="p-1 px-4 rounded-lg text-sm mx-2 text-white"
                  :class="item.type == 'Spoke' ? 'bg-blue-400' : 'bg-purple-400'"
                >{{item.type}}</span>
                <span
                  v-if="item.invited === true"
                  class="justify-right p-1 px-4 text-sm text-white font-semibold rounded-lg bg-green-400"
                >Invited</span>
              </div>
            </div>
            <div class="flex flex-row flex-no-wrap mt-1">
              <div class="rounded-lg bg-gray-300 py-1 px-2 mr-1">CCG</div>
              <div
                class="flex items-center"
              >{{item.surgery.clinical_commissioning_group ? item.surgery.clinical_commissioning_group.name : 'N/A'}}</div>
            </div>
            <div class="flex flex-row flex-no-wrap mt-1">
              <div class="rounded-lg bg-gray-300 py-1 px-2 mr-1">Practice Code</div>
              <div class="flex items-center">{{item.surgery.code}}</div>
            </div>
          </div>
        </div>
        <div class="border-t-2 p-4 text-xs xl:text-base">
          <p class="font-bold">These are just top 10 matches from your search term.</p>
          <p
            class="font-bold"
          >Try again with practice code or its full name if the practice isn't in the result.</p>
        </div>
      </div>
    </div>

    <div class="spoke-shield" @click="toInvite = false" v-if="toInvite"></div>
    <transition name="slide" mode="out-in">
      <div class="spoke-permission-modal shadow-lg" v-if="toInvite">
        <InviteSpokePermissions @close="toInvite = false" :spoke="selectedSpoke" />
      </div>
    </transition>
  </div>
</template>
<script>
import AppInput from "@/components/Base/AppInput";
import AppButton from "@/components/Base/AppButton";
import InviteSpokePermissions from "@/components/Practice/InviteSpokePermissions";
export default {
  components: {
    AppInput,
    AppButton,
    InviteSpokePermissions
  },
  data() {
    return {
      disabled: "true",
      search_text: "",
      filteredPracticeSpokes: [],
      practiceSpokesResult: [],
      practiceSpokeInvitations: [],
      selectedSpoke: "",
      showResult: false,
      modal: false,
      formError: [],
      toInvite: false,
      resultNotice:
        "No practice matched that name. Try again with whole words, practice code or CCG."
    };
  },
  async asyncData({ app, error, auth }) {
    try {
      const responsePracticeType = await app.$axios.$get(
        `/api/v1/practice/me/practice-type`
      );
      const type =
        responsePracticeType.data &&
        responsePracticeType.data.practice &&
        responsePracticeType.data.practice.type
          ? responsePracticeType.data.practice.type
          : null;

      const responsePracticeSpokes = await app.$axios.$get(
        `/api/v1/practice/practice-spokes`
      );
      let practiceSpokesResult = [];
      if (
        responsePracticeSpokes.data &&
        responsePracticeSpokes.data.practices
      ) {
        responsePracticeSpokes.data.practices.forEach(spokes => {
          practiceSpokesResult.push(spokes);
        });
      }

      return {
        type,
        practiceSpokesResult
      };
    } catch (err) {
      if (err.response && err.response.status === 401) {
        error(err.response.data);
        return;
      }
      throw err;
    }
  },
  async created() {
    let practiceSpokeInvitations = [];
    await this.$axios
      .$get(`/api/v1/practice/me/practice-surgeries`)
      .then(res => {
        this.practiceSpokeInvitations = res.data.practice_surgeries;
      });
  },
  methods: {
    async search() {
      this.filteredPracticeSpokes = [];
      this.practiceSpokesResult = [];
      if (!this.search_text) {
        return;
      }
      try {
        let invitationIds = [];
        let res = await this.$axios.$get(
          `/api/v1/practice/me/practice-surgeries/spoke-invitations`
        );
        invitationIds = res.data.invitations.map(invitation => invitation.id);

        res = await this.$axios.$get(
          `/api/v1/practice/practice-spokes?search=${this.search_text}&limit=10`
        );

        if (res.data && res.data.practices && res.data.practices.length > 0) {
          res.data.practices.forEach(practice => {
            this.filteredPracticeSpokes.push({
              ...practice,
              invited: invitationIds.includes(practice.id) ? true : false
            });
          });
        }
        this.showResult = true;
      } catch (error) {
        console.log(error);
        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "danger",
          text: ["Something went wrong!"]
        });
      }
    },
    async select(item) {
      this.selectedSpoke = item;
      if (this.selectedSpoke.invited) {
        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "danger",
          text: [
            `This Spoke already invited you. Please check your Spoke invitations`
          ]
        });
        return;
      }
      this.toInvite = true;
    }
  }
};
</script>
<style scoped>
.modal-container {
  z-index: 510;
}
@media screen and (min-width: 1200px) {
  .modal-container {
    width: 80%;
  }
}
.spoke-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 511;
}
.spoke-permission-modal {
  position: fixed;
  top: 0;
  right: 0;
  margin-right: 0%;
  width: 100%;
  height: 100%;
  overflow: auto;
  border-left: solid 2px #ffc72c;
  transition: all 0.3s ease-in-out;
  background-color: white;
  z-index: 512;
}

@media screen and (min-width: 1200px) {
  .spoke-permission-modal {
    width: 70%;
  }
}
</style>