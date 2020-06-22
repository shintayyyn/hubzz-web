<template>
  <section class="relative">
    <transition name="fade" mode="out-in">
      <div v-if="showTable">
        <AppLoading :loading="loading" spinner />
        <div
          class="flex flex-row flex-wrap"
          :class="practices.length === 0 ? 'justify-center': 'justify-start'"
        >
          <div
            class="w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:max-w-sm p-2"
            v-for="practice in practices"
            :key="practice.id"
          >
            <div class="relative h-full rounded-lg shadow-lg bg-gray-300 p-4 hover:bg-gray-400">
              <nuxt-link
                class="w-full leading-tight"
                :to="{ path: `/my-practice/private-practice/${practice.id}`, query: {...$route.query}}"
              >
                <div class="flex font-bold text-sm sm:text-lg">{{practice.surgery.name}}</div>
                <div
                  class="w-full font-bold text-gray-700 text-xs leading-tight pt-1"
                >{{practice.address_line_1}} {{practice.address_line_2}} {{practice.address_line_3}} {{practice.address_post_code}}</div>
              </nuxt-link>
            </div>
          </div>
          <div class="w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:max-w-sm p-2">
            <div
              class="relative h-full rounded-lg shadow-lg bg-yellow-300 p-4 hover:bg-yellow-400 flex justify-center items-center cursor-pointer"
            >
              <div
                class="flex font-bold text-sm sm:text-lg"
                @click="$router.push('/my-practice/private-practice/create')"
              >Add Private Practice</div>
            </div>
          </div>
        </div>
        <div class="mt-5 flex justify-center" v-if="practices.length > 0 && totalPages > 1">
          <AppPagination
            :total="total"
            :totalPages="totalPages"
            :currentPage="current_page"
            @pagechanged="pagechanged"
          />
        </div>
        <div v-if="!practices.length" class="flex flex-row flex-wrap justify-center">
          <div>You do not have any Associated Job for any Practices</div>
        </div>
        <transition name="fade" mode="out-in">
          <nuxt-link
            class="shield"
            v-if="['my-practice-private-practice-practiceId', 'my-practice-private-practice-create'].includes($route.name)"
            :to="{ name: `my-practice-private-practice`, query: { ...$route.query}}"
          ></nuxt-link>
        </transition>
        <div>
          <nuxt-child @removePractice="removePractice" @addPractice="addPractice" />
        </div>
      </div>
    </transition>
  </section>
</template>
<script>
import AppLoading from "@/components/Base/AppLoading";
import AppPagination from "@/components/Base/AppPagination";
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },
  components: {
    AppLoading,
    AppPagination
  },
  data() {
    return {
      loading: false,
      current_page: 1,
      showTable: false,
      practices: [],
      total: 0
    };
  },
  computed: {
    offset() {
      return this.perPage * (this.current_page - 1);
    },
    perPage() {
      return 5;
    },
    totalPages() {
      return Math.ceil(this.total / this.perPage);
    }
  },
  async asyncData({ app, params, query, error }) {
    try {
      let response = await app.$axios.$get(
        `/api/v1/locum/private-practices/count`
      );

      const total =
        response.data && response.data.count ? response.data.count : 0;

      response = await app.$axios.$get(
        `/api/v1/locum/private-practices?offset=0&limit=5`
      );

      let practices =
        response.data && response.data.private_practices
          ? response.data.private_practices
          : [];

      const showTable = true;

      return {
        total,
        practices,
        showTable
      };
    } catch (err) {
      console.log("err", err.response || err);
      throw err;
    }
  },
  methods: {
    addPractice(addedPractice) {
      let index = this.practices.findIndex(
        practice => practice.id === addedPractice.id
      );
      if (index < 0) {
        this.practices.push(addedPractice);
      }
    },
    removePractice(id) {
      let index = this.practices.findIndex(practice => practice.id === id);
      if (index >= 0) {
        this.practices.splice(index, 1);
      }
    }
  }
};
</script>