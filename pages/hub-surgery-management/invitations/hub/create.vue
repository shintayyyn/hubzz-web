<template>
  <div class="">
    <div class="p-2 w-full">
      <div class="flex justify-start font-bold text-sm sm:text-xl">
        Invite Spoke / Stand Alone
      </div>
      <div class="relative bg-white rounded-lg border p-4 mt-4 max-w-5xl">
        <AppInput
          v-model="search_text"
          :type="'text'"
          :name="'search'"
          :placeholder="'Surgery Name, Surgery Code, or keywords'"
          :error="formError.find(item => item.field === 'surgery_id')"
          @submit="search"
        />
        <AppButton
          :label="'Search'"
          :inStyle="'padding:5px 14px;'"
          @click="search"
        />
      </div>
      <div
        v-if="showResult && filteredPracticeSpokes.length === 0"
        class="mt-5"
      >
        <div class="text-xs xl:text-base font-bold">
          {{ resultNotice }}
        </div>
      </div>
      <div
        v-if="showResult && filteredPracticeSpokes.length > 0"
        class="rounded-lg border overflow-auto mt-5 bg-white max-w-5xl"
      >
        <div class="text-xs lg:text-base font-bold p-4">
          Select by clicking on the practice that you wish to add
        </div>

        <div
          v-for="item in filteredPracticeSpokes"
          :key="item.id"
          class="border-t-2 p-4 cursor-pointer hover:bg-gray-400"
          @click="select(item)"
        >
          <div class="flex flex-col justify-start text-xs xl:text-base">
            <div class="flex flex-col font-bold">
              <div>
                <span>{{ item.surgery.name }}</span>
                <span
                  class="p-1 px-4 rounded-lg text-sm mx-2 text-white"
                  :class="
                    item.type == 'Spoke' ? 'bg-blue-400' : 'bg-purple-400'
                  "
                >{{ item.type }}</span>
                <span
                  v-if="item.invited === true"
                  class="justify-right p-1 px-4 text-sm text-white font-semibold rounded-lg bg-green-400"
                >Invited</span>
              </div>
            </div>
            <div class="flex flex-row flex-no-wrap mt-1 text-sm">
              <div class="rounded-lg bg-gray-300 py-1 px-2 mr-1">
                CCG
              </div>
              <div class="flex items-center">
                {{
                  item.surgery.clinical_commissioning_group
                    ? item.surgery.clinical_commissioning_group.name
                    : "N/A"
                }}
              </div>
            </div>
            <div class="flex flex-row flex-no-wrap mt-1 text-sm">
              <div class="rounded-lg bg-gray-300 py-1 px-2 mr-1">
                Practice Code
              </div>
              <div class="flex items-center">
                {{ item.surgery.code }}
              </div>
            </div>
          </div>
        </div>
        <div class="border-t-2 px-4 py-2 text-xs md:text-sm leading-tight">
          <p class="font-bold">
            These are just top 10 matches from your search term.
          </p>
          <p class="font-bold">
            Try again with practice code or its full name if the practice isn't
            in the result.
          </p>
        </div>
      </div>
    </div>

    <div v-if="toInvite" class="spoke-shield" @click="toInvite = false" />
    <transition name="slide" mode="out-in">
      <div v-if="toInvite" class="spoke-permission-modal shadow-lg">
        <InviteSpokePermissions
          :spoke="selectedSpoke"
          @close="toInvite = false"
        />
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
      isSearching: false,
      searchTimeout: null,
      resultNotice:
        "No practice matched that name. Try again with whole words, practice code or CCG."
    };
  },
  async asyncData({ app, error }) {
    try {
      const responsePracticeType = await app.$axios.$get(
        `/api/v1/practice/me/practice-type`,
        { cache: true }
      );
      const type =
        responsePracticeType.data &&
        responsePracticeType.data.practice &&
        responsePracticeType.data.practice.type
          ? responsePracticeType.data.practice.type
          : null;

      const responsePracticeSpokes = await app.$axios.$get(
        `/api/v1/practice/practice-spokes`,
        { cache: true }
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
    await this.$axios
      .$get(`/api/v1/practice/me/practice-surgeries`, { cache: true })
      .then(res => {
        this.practiceSpokeInvitations = res.data.practice_surgeries;
      });
  },

  beforeDestroy() {
    clearTimeout(this.searchTimeout);
  },
  methods: {
    search() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.doSearch();
      }, 400);
    },

    async doSearch() {
      if (!this.search_text) return;
      if (this.isSearching) return;
      this.isSearching = true;

      this.filteredPracticeSpokes = [];
      this.practiceSpokesResult = [];

      try {
        let res = await this.$axios.$get(
          `/api/v1/practice/me/practice-surgeries/spoke-invitations`,
          {
            cache: true
          }
        );
        const invitationIds = res.data.invitations.map(inv => inv.id);

        res = await this.$axios.$get(`/api/v1/practice/practice-spokes`, {
          params: { search: this.search_text, limit: 10 }
        });

        if (res.data?.practices?.length > 0) {
          res.data.practices.forEach(practice => {
            this.filteredPracticeSpokes.push({
              ...practice,
              invited: invitationIds.includes(practice.id)
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
      } finally {
        this.isSearching = false;
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
