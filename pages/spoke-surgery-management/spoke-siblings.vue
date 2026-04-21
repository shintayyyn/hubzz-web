<template>
  <div class="p-4">
    <div v-if="totalSiblings < 1" class="flex justify-center text-gray-500">
      You have no siblings.
    </div>
    <AppTable
      v-if="practiceSiblings.length > 0"
      :total="totalSiblings"
      :items="practiceSiblings"
      :loading="loading"
      :currentPage="current_page"
      :perPage="params.limit"
      :columns="columns"
      :orderBy="params.order_by"
      :customWidth="550"
      @pagechanged="pagechanged"
      @limitchanged="limitchanged"
      @sorted="sorted"
    >
      <template v-slot:actions="slotProps">
        <div class="flex flex-wrap justify-center">
          <div
            class="mx-1 p-2 bg-yellow-400 font-bold rounded-lg focus:outline-none"
            @click="
              $router.push({
                path: `/spoke-surgery-management/spoke-siblings/${slotProps.item.id}`
              })
            "
          >
            View
          </div>
        </div>
      </template>
    </AppTable>

    <!-- :routerLink="'/surgery-management/practice-spokes'"
			@pagechanged="pagechanged"
			@limitchanged="limitchanged"
			@sorted="sorted"
		></AppTable>-->

    <!-- <template v-slot:actions="slotProps">
				<div class="flex items-center justify-center">
          <div class="rounded-full px-6 py-1" :class="surgeryStatus()">{{ getStatus() }}</div>
        </div>
		</template>-->
    <transition name="fade" mode="out-in">
      <nuxt-link
        v-if="
          $route.name.includes('spoke-surgery-management-spoke-siblings-id')
        "
        class="shield"
        :to="{ name: 'spoke-surgery-management-spoke-siblings' }"
      />
    </transition>
    <nuxt-child />
  </div>
</template>

<script>
import AppTable from "@/components/Base/AppTable";
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },
  components: {
    AppTable
  },
  data() {
    return {
      locums: [],
      totalSiblings: 0,
      practiceSiblings: "",

      loading: false,

      // App Table
      current_page: 1,
      params: {
        offset: 0,
        limit: 5,
        order_by: []
      },
      columns: [
      //new
        {
          name: "Practice Surgery",
          dataIndex: "surgery.name",
          class: "text-left"
        },
        {
          name: "Postal Code",
          dataIndex: "surgery.address.post_code",
          class: " md:text-left"
        },
        {
          name: "Practice Code",
          dataIndex: "surgery.code",
          class: " md:text-left"
        },
        {
          name: "Actions",
          dataIndex: "actions",
          class: "text-center"
        }
      ]
    };
  },
  computed: {
    authPermissions() {
      return this.$store.getters["permissions"];
    }
  },
  async asyncData({ app, route, store }) {
    try {
      let response = await app.$axios.$get(
        `/api/v1/practice/me/parent-surgery/practice-siblings`
      );
      const practiceSiblings = response.data.practice_siblings;
      console.log("siblings", practiceSiblings);
      response = await app.$axios.$get(
        `/api/v1/practice/me/parent-surgery/practice-siblings/count`
      );
      const totalSiblings = response.data.count;
      console.log("count", totalSiblings);
      return {
        practiceSiblings,
        totalSiblings
      };
    } catch (err) {
      console.log("get locum error!", err);
    }
  },
  created() {
    console.log();
  },
  methods: {
    getPracticeSiblings(params) {
      this.loading = true;
      this.$axios
        .$get(`/api/v1/practice/me/parent-surgery/practice-siblings`, {
          params
        })
        .then(res => {
          this.loading = false;
          this.practiceSiblings = [];
          res.data.practice_siblings.forEach(surgery => {
            this.practiceSiblings.push(surgery);
          });
        })
        .catch(err => {
          console.log(err);
        });
      console.log("siblings", this.practiceSiblings);
    },

    sorted(order_by) {
      this.current_page = 1;
      this.params.offset = 0;
      this.params.order_by = order_by;
      this.getPracticeSiblings(this.params);
    },
    pagechanged(page) {
      this.current_page = page;
      this.params.offset = this.params.limit * (page - 1);
      this.getPracticeSiblings(this.params);
    },
    limitchanged(limit) {
      this.current_page = 1;
      this.params.offset = 0;
      this.params.limit = limit;
      this.getPracticeSiblings(this.params);
    }
  }
};
</script>

<style></style>
