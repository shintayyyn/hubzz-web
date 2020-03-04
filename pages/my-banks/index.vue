<template>
  <section class="relative">
    <div class="flex flex-row justify-start overflow-x-auto py-3 mb-3">
      <div class="relative">
        <nuxt-link
          :event="$store.state.jobs.loading_jobs ? '' : 'click'"
          :to="{ path: '/my-banks', query: { ...$route.query, type: 'gp' }}"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="!$route.query.type || ($route.query.type && $route.query.type.toLowerCase() === 'gp') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >GP</nuxt-link>
      </div>
      <div class="relative">
        <nuxt-link
          :event="$store.state.jobs.loading_jobs ? '' : 'click'"
          :to="{ path: '/my-banks', query: { ...$route.query, type: 'others' }}"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query.type && $route.query.type.toLowerCase() === 'others' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Others</nuxt-link>
      </div>
    </div>

    <transition name="fade" mode="out-in">
      <div v-if="toggleTable">
        <AppLoading :loading="loading" spinner />
        <div class="flex flex-row flex-wrap justify-start">
          <div
            class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2"
            v-for="locum in locums"
            :key="locum.id"
          >
            <div class="h-full rounded-lg shadow-lg bg-gray-300 hover:bg-gray-400 p-4">
              <nuxt-link :to="{ path: `/my-banks/${locum.id}`, query: {...$route.query}}">
                <div class="flex justify-end items-center">
                  <div
                    class="flex justify-end items-center z-40"
                    v-if="authPermissions.includes('Favorite MyBanks Locum')"
                  >
                    <template v-if="locum.is_favorite">
                      <svgicon
                        name="on-star"
                        height="32"
                        width="32"
                        class="cursor-pointer fill-current text-gray-700 hover:text-gray-800"
                        @click.prevent.stop="favorite(locum.id)"
                      />
                    </template>
                    <template v-else>
                      <svgicon
                        name="off-star"
                        height="32"
                        width="32"
                        class="cursor-pointer fill-current text-gray-700 hover:text-gray-800"
                        @click.prevent.stop="favorite(locum.id)"
                      />
                    </template>
                  </div>
                  <button
                    class="ml-2 p-2 focus:outline-none hover:bg-gray-300 rounded-lg"
                    @click.prevent.stop="message(locum)"
                  >
                    <svgicon name="chat" height="24" width="24" color="#6b778b #4a5568 #fff" />
                  </button>
                </div>
                <div class="flex flex-wrap text-center mt-4 cursor-pointer">
                  <div class="w-full flex justify-center">
                    <AppAvatar
                      :src="locum.avatar && locum.avatar.file && locum.avatar.file.url ? locum.avatar.file.url : ''"
                    />
                  </div>

                  <div
                    class="w-full font-bold text-sm sm:text-lg leading-tight"
                  >{{locum.personal_detail.name}}</div>
                  <div
                    class="w-full mb-4 font-bold text-gray-700 text-sm leading-tight"
                  >{{locum.email}}</div>
                  <div
                    class="w-full mb-4 font-bold text-gray-700 text-sm leading-tight"
                  >{{locum.locum_detail.profession.name}}</div>
                </div>
              </nuxt-link>
            </div>
          </div>
        </div>

        <transition name="fade" mode="out-in">
          <div class="message-modal md:w-2/3 lg:w-1/2 xl:w-1/3" v-if="sendMessageModal">
            <SendMessageModal
              :user="user"
              @close="sendMessageModal=false"
              @showProfile="$router.push({ path: `/my-banks/${selectedId}`, query: {...$route.query}})"
              :profileOption="true"
            />
          </div>
        </transition>
        <div class="shield" v-if="sendMessageModal" @click="sendMessageModal=false"></div>

        <div class="mt-5 flex justify-center" v-if="locums.length > 0 && totalPages > 1">
          <AppPagination
            :total="total"
            :totalPages="totalPages"
            :currentPage="current_page"
            :perPage="perPage"
            @pagechanged="pagechanged"
          />
        </div>
        <div v-if="!locums.length" class="flex flex-row flex-wrap justify-center">
          <div>There are no locums connected to your practice yet.</div>
        </div>
        <transition name="fade" mode="out-in">
          <nuxt-link
            class="shield border-red-500"
            v-if="$route.name.includes('my-banks-index-locumId') && !sendMessageModal"
            :to="{ path: `/my-banks`, query: { ...$route.query}}"
          ></nuxt-link>
        </transition>
        <div>
          <nuxt-child />
        </div>
      </div>
    </transition>
  </section>
</template>
<script>
import AppLoading from "@/components/Base/AppLoading";
import AppAvatar from "@/components/Base/AppAvatar";
import AppPagination from "@/components/Base/AppPagination";
import SendMessageModal from "@/components/Messages/SendMessageModal";
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },
  components: {
    AppLoading,
    AppAvatar,
    AppPagination,
    SendMessageModal
  },
  middleware({ query, redirect, error }) {
    if (!query.status) {
      // api (Favorite only)
      redirect(`/my-banks?status=Favorite`);
    }
    if (
      query.status &&
      ![
        "favorite",
        "completed",
        "successful",
        "applied",
        "appointed",
        "rejected",
        "withdrawn"
      ].includes(query.status.toLowerCase())
    ) {
      return error({
        status: 404,
        message: "This MyBanks Status is Invalid"
      });
    }
  },
  data() {
    return {
      locums: [],
      total: 0,
      current_page: 1,
      loading: false,
      toggleTable: false,
      is_favorite: false,
      detailed: true,
      sendMessageModal: false,
      user: [],
      selectedId: null
    };
  },
  computed: {
    offset() {
      return this.perPage * (this.current_page - 1);
    },
    perPage() {
      return 8;
    },
    totalPages() {
      return Math.ceil(this.total / this.perPage);
    },
    authPermissions() {
      return this.$store.getters["permissions"];
    }
  },
  watch: {
    "$route.query"(
      { status: newStatus, type: newType },
      { status: oldStatus, type: oldType }
    ) {
      console.log(newType, oldType);
      if (
        (newStatus && newStatus !== null && newStatus !== oldStatus) ||
        (newType && newType !== null && newType !== oldType)
      ) {
        this.toggleTable = false;
        this.getLocumsCount();
      }
    }
  },
  created() {
    this.getLocumsCount();
  },
  methods: {
    message(user) {
      this.selectedId = user.id;
      this.user = user;
      this.sendMessageModal = true;
    },
    getLocumsCount() {
      let queryStatus = this.$route.query.status;
      let queryType = this.$route.query.type;
      this.loading = true;
      this.$axios
        .$get(`/api/v1/practice/locums/count`, {
          params: {
            practice_locum_type: queryStatus,
            profession_id: !queryType || queryType === "gp" ? 1 : 2
          }
        })
        .then(res => {
          this.total = res.data.count;
          this.getLocums(this.current_page);
        })
        .catch(err => {
          console.log("err", err);
        });
    },
    getLocums(page) {
      let queryStatus = this.$route.query.status;
      let queryType = this.$route.query.type;
      this.current_page = page;
      this.$axios
        .$get(`/api/v1/practice/locums`, {
          params: {
            practice_locum_type: queryStatus,
            profession_id: !queryType || queryType === "gp" ? 1 : 2,
            offset: this.offset,
            limit: this.perPage,
            detailed: true
          }
        })
        .then(res => {
          this.locums = res.data.users;
        })
        .catch(err => {
          console.log("err", err);
        })
        .finally(() => {
          this.toggleTable = true;
          this.loading = false;
        });
    },
    favorite(id) {
      let queryStatus = this.$route.query.status;
      let locum = this.locums.find(locum => locum.id === id);
      if (!locum.is_favorite) {
        this.$axios
          .$post(`/api/v1/practice/locums/${id}/favorite`)
          .then(res => {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: ["Added to favourites"]
            });
            locum.is_favorite = !locum.is_favorite;
          })
          .catch(err => {
            if (err.response.data) {
              this.$store.commit("SET_NOTIFICATION", {
                enabled: true,
                status: "danger",
                text: [`${err.response.message}`]
              });
            } else if (err.response.data.error_messages) {
            }
          });
      } else {
        this.$axios
          .$delete(`/api/v1/practice/locums/${id}/favorite`)
          .then(res => {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: ["Remove to favourites"]
            });
            locum.is_favorite = !locum.is_favorite;
          })
          .catch(err => {
            if (err.response.data) {
              this.$store.commit("SET_NOTIFICATION", {
                enabled: true,
                status: "danger",
                text: [`${err.response.message}`]
              });
            } else if (err.response.data.error_messages) {
            }
          });
        if (queryStatus.toLowerCase() === "favorite") {
          this.locums.splice(
            this.locums.findIndex(locum => locum.id === id),
            1
          );
        }
      }
    },
    pagechanged(e) {
      this.current_page = e;
      this.getLocums(this.current_page);
    }
  }
};
</script>
<style>
.chat-svg:hover {
  color: #535c6d #3c4453 #fff;
}
</style>