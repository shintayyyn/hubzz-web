<template>
  <div class="p-4">
    <div
      v-if="practice && practice.share_my_banks === false"
      class="py-4 text-center text-gray-500"
    >Your Hub Banks are not shared.</div>
    <div
      v-if="practice && practice.share_my_banks === true"
      class="flex flex-row flex-wrap justify-start"
    >
      <div v-if="locums.length < 1" class="py-4 text-center text-gray-500">Your hub has no banks.</div>
      <div
        v-for="locum in locums"
        v-else
        :key="locum.id"
        class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2"
      >
        <div class="h-full w-full flex flex-row flex-wrap justify-start">
          <div class="h-full w-full rounded-lg shadow-lg bg-gray-300 hover:bg-gray-400 p-4">
            <nuxt-link :to="{ path: `/spoke-surgery-management/hub-banks/${locum.id}` }">
              <div
                v-if="authPermissions.includes('Favorite MyBanks Locum')"
                class="flex justify-end z-50"
              >
                <template v-if="locum.is_favorite">
                  <svgicon
                    name="on-star"
                    height="32"
                    width="32"
                    class="cursor-pointer fill-current text-gray-700 hover:text-gray-800"
                    @click.prevent.stop="unfavorite(locum.id)"
                  />
                </template>
                <template v-else-if="!locum.is_favorite">
                  <svgicon
                    name="off-star"
                    height="32"
                    width="32"
                    class="cursor-pointer fill-current text-gray-700 hover:text-gray-800"
                    @click.prevent.stop="favorite(locum.id)"
                  />
                </template>
              </div>

              <div class="flex flex-wrap text-center mt-4 cursor-pointer">
                <div class="w-full flex justify-center">
                  <AppAvatar
                    :src="locum.avatar && locum.avatar.file && locum.avatar.file.url ? locum.avatar.file.url : ''"
                  />
                </div>
                <div
                  class="w-full font-bold text-sm sm:text-lg mt-4 leading-tight"
                >{{ locum.personal_detail.name }}</div>
                <div
                  class="w-full mb-4 font-bold text-gray-700 text-sm leading-tight"
                >{{ locum.email }}</div>
                <div
                  class="w-full mb-4 font-bold text-gray-700 text-sm leading-tight"
                >{{ locum.locum_detail.profession.name }}</div>
              </div>
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
    <div v-if="locums.length > 0 && totalPages > 1" class="mt-5 flex justify-center">
      <AppPagination
        :total="total"
        :totalPages="totalPages"
        :currentPage="current_page"
        :perPage="perPage"
        @pagechanged="pagechanged"
      />
    </div>
    <transition name="fade" mode="out-in">
      <nuxt-link
        v-if="['spoke-surgery-management-hub-banks-id',].includes($route.name)"
        :to="`/spoke-surgery-management/hub-banks/${$route.params.id}`"
        class="shield"
      />
    </transition>
    <nuxt-child />
    <AppConfirmationModal
      :label="confirmation_text"
      :confirmLabel="'Yes'"
      :cancelLabel="'Cancel'"
      :modal="confirmation_modal"
      @confirm="confirm"
      @cancel="confirmation_modal = false"
    />
  </div>
</template>

<script>
import AppAvatar from "@/components/Base/AppAvatar";
import AppConfirmationModal from "@/components/Base/AppConfirmationModal";
import AppPagination from "@/components/Base/AppPagination";
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },
  components: {
    AppAvatar,
    AppConfirmationModal,
    AppPagination
  },
  data() {
    return {
      total: 0,
      current_page: 1,
      loading: false,
      locums: [],

      confirmation_text: "",
      confirmation_modal: false,

      practice: null,
      parentPracticeId: null
    };
  },
  computed: {
    authPermissions() {
      return this.$store.getters["permissions"];
    },
    offset() {
      return this.perPage * (this.current_page - 1);
    },
    perPage() {
      return 8;
    },
    totalPages() {
      return Math.ceil(this.total / this.perPage);
    }
  },
  async asyncData({ app }) {
    try {
      let responseParentSurgery = await app.$axios.$get(
        `/api/v1/practice/me/parent-surgery`
      );
      const parentPracticeId =
        responseParentSurgery.data &&
        responseParentSurgery.data.practice &&
        responseParentSurgery.data.practice.parent_practice
          ? responseParentSurgery.data.practice.parent_practice.id
          : null;

      let total = 0;
      let locums = [];
      if (
        responseParentSurgery &&
        responseParentSurgery.data &&
        responseParentSurgery.data.practice &&
        responseParentSurgery.data.practice.share_my_banks
      ) {
        let responseCount = await app.$axios.$get(
          `/api/v1/practice/locums/count`,
          {
            params: {
              favorite_by_practice_id: parentPracticeId
            }
          }
        );

        total = responseCount.data.count;

        let response = await app.$axios.$get(`/api/v1/practice/locums`, {
          params: {
            favorite_by_practice_id: parentPracticeId
          }
        });

        locums = response.data.users;
      }

      return {
        practice: responseParentSurgery.data.practice,
        parentPracticeId: parentPracticeId,
        total,
        locums
      };
    } catch (err) {
      console.log("get locum error!", err);
    }
  },
  mounted() {
    this.$socket.on(
      "Practice Notification Practice Surgery Updated",
      this.getHubBanksRealTime
    );
  },
  destroyed() {
    this.removeListener();
  },
  methods: {
    getHubBanksPromiseAll() {
      this.$axios.$get(`/api/v1/practice/me/parent-surgery`).then(res => {
        this.parentPracticeId =
          res.data && res.data.practice && res.data.practice.parent_practice
            ? res.data.practice.parent_practice.id
            : null;

        this.practice = res.data.practice;

        this.$axios
          .$get(`/api/v1/practice/locums/count`, {
            params: {
              favorite_by_practice_id: this.parentPracticeId
            }
          })
          .then(res => {
            this.total = res.data.count;
          });

        this.$axios
          .$get(`/api/v1/practice/locums`, {
            params: {
              favorite_by_practice_id: this.parentPracticeId
            }
          })
          .then(res => {
            this.locums = res.data.users;
          });
      });
    },
    getHubBanksRealTime(payload) {
      if (
        payload.length > 0 &&
        payload[0].child_practice_id === this.practice.id
      ) {
        this.getHubBanksPromiseAll();
      }
    },
    removeListener() {
      this.$socket.removeListener(
        "Practice Notification Practice Surgery Updated",
        this.getHubBanksRealTime
      );
    },
    favorite(id) {
      this.user_id = id;
      this.confirmation_text = "Add this Locum to MyBanks?";
      this.confirmation_modal = true;
    },
    unfavorite(id) {
      this.user_id = id;
      this.confirmation_text = "Remove this Locum to My Banks?";
      this.confirmation_modal = true;
    },
    confirm() {
      let locum = this.locums.find(item => item.id === this.user_id);
      if (!locum.is_favorite) {
        this.$axios
          .$post(`/api/v1/practice/locums/${locum.id}/favorite`)
          .then(() => {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: ["Added to favourites"]
            });
            locum.is_favorite = true;
          })
          .catch(err => {
            console.log("err", err.response || err);
          })
          .finally(() => {
            this.confirmation_modal = false;
          });
      } else if (locum.is_favorite) {
        this.$axios
          .$delete(`/api/v1/practice/locums/${locum.id}/favorite`)
          .then(() => {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: ["Remove to favourites"]
            });
            locum.is_favorite = false;
          })
          .catch(err => {
            console.log("err", err.response || err);
          })
          .finally(() => {
            this.confirmation_modal = false;
          });
      }
    },
    getLocums(page) {
      let params = {
        limit: this.perPage,
        offset: this.offset,
        favorite_by_practice_id: this.parentPracticeId,
        detailed: true
      };
      this.current_page = page;
      this.$axios
        .$get(`/api/v1/practice/locums`, { params })
        .then(res => {
          this.locums = res.data.users;
          this.toggleTable = true;
          this.loading = false;
        })
        .catch(err => {
          console.log("err", err);
        });
    },
    pagechanged(e) {
      this.current_page = e;
      this.getLocums(this.current_page);
    }
  }
};
</script>