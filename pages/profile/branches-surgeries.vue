<template>
  <section>
    <div class="flex overflow-x-auto whitespace-no-wrap">
      <button
        class="rounded-lg bg-yellow-500 p-2 cursor-pointer font-semibold text-xs sm:text-sm focus:outline-none"
        @click="$router.push('/profile/branches-surgeries/create')"
        v-if="authPermissions.includes('Create Profile Surgeries')"
      >Add Surgeries</button>
    </div>
    <AppTable
      v-if="surgeries.length > 0"
      :total="totalSurgeries"
      :items="surgeries"
      :loading="loading"
      :currentPage="current_page"
      :perPage="params.limit"
      :columns="columns"
      :orderBy="params.order_by"
      @show="show"
      @remove="remove"
      @pagechanged="pagechanged"
      @limitchanged="limitchanged"
      @sorted="sorted"
    />
    <div v-else class="flex justify-center">no branches / surgeries</div>
    <transition name="fade" mode="out-in">
      <div
        class="shield"
        v-if="['profile-branches-surgeries-create', 'profile-branches-surgeries-id', 'profile-branches-surgeries-edit'].includes($route.name)"
      ></div>
    </transition>
    <nuxt-child @addSurgery="addSurgery" @updateSurgery="updateSurgery" />
  </section>
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
      totalSurgeries: 0,
      surgeries: [],
      loading: false,
      current_page: 1,
      // app table filter
      sampleFilter: [],
      // app table params
      params: {
        offset: 0,
        limit: 5,
        order_by: []
      },
      // for app table component
      columns: [
        {
          name: "Surgery",
          dataIndex: "surgery.name",
          class: "text-left",
          sortable: true
        },
        {
          name: "Practice Code",
          dataIndex: "surgery.code",
          class: "text-center"
        },
        {
          name: "Pay for surgery",
          dataIndex: "pay_for_surgery",
          class: "text-center"
        },
        {
          name: "Verify job creation",
          dataIndex: "verify_job_creation",
          class: "text-center"
        }
      ]
    };
  },
  computed: {
    authPermissions() {
      return this.$store.getters["auth/permissions"];
    }
  },
  mounted() {
    this.$socket.on("Practice Notification Create Surgery", surgery => {
      // if (!this.surgeries.map(item => item.id).includes(surgery.id)) {
      //   this.surgeries.push(surgery);
      // }
      this.getSurgeriesCount(this.params);
    });
    this.$socket.on("Practice Notification Update Surgery", surgery => {
      let index = this.surgeries.findIndex(item => item.id == surgery.id);
      if (index >= 0) {
        this.surgeries.splice(index, 1, surgery);
      }
    });
    this.$socket.on("Practice Notification Delete Surgery", surgeryId => {
      this.getSurgeriesCount(this.params);
      // this.surgeries = this.surgeries.filter(item => item.id != surgeryId);
    });
  },
  async asyncData({ app, store, error }) {
    try {
      const responsePracticeType = await app.$axios.$get(
        `/api/v1/practice/me/practice-type`
      );
      let practice =
        responsePracticeType.data && responsePracticeType.data.practice
          ? responsePracticeType.data.practice
          : null;

      let surgeries = [];
      let parent_surgery = null;
      let totalSurgeries = 0;
      if (practice.type === "Hub") {
        const responseCount = await app.$axios.$get(
          `/api/v1/practice/me/practice-surgeries/count`
        );

        totalSurgeries =
          responseCount.data && responseCount.data.count
            ? responseCount.data.count
            : 0;

        const response = await app.$axios.$get(
          `/api/v1/practice/me/practice-surgeries?limit=5`
        );

        if (response.data && response.data.practice_surgeries) {
          response.data.practice_surgeries.forEach(surgery => {
            surgeries.push({ ...surgery, removable: true });
          });
        }
      } else if (practice.type === "Spoke") {
        if (practice.parent_surgery) {
          let surgery = {
            id: practice.parent_surgery.id,
            pay_for_surgery: practice.pay_for_surgery,
            verify_job_creation: practice.verify_job_creation,
            surgery: practice.parent_surgery
          };
          surgeries.push(surgery);
        }
      }
      return {
        practice,
        totalSurgeries,
        surgeries
      };
    } catch (err) {
      if (err.response && err.response.status === 401) {
        error(err.response.data);
        return;
      }
      throw err;
    }
  },
  methods: {
    getSurgeriesCount(params) {
      this.$axios
        .$get(`/api/v1/practice/me/practice-surgeries/count`, { params })
        .then(res => {
          this.totalSurgeries = res.data.count;
          this.getSurgeries(this.params);
        });
    },
    getSurgeries(params) {
      this.loading = true;
      this.$axios
        .$get(`/api/v1/practice/me/practice-surgeries`, { params })
        .then(res => {
          this.loading = false;
          this.surgeries = [];
          res.data.practice_surgeries.forEach(surgery => {
            this.surgeries.push({ ...surgery, removable: true });
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    sorted(order_by) {
      this.current_page = 1;
      this.params.offset = 0;
      this.params.order_by = order_by;
      this.getSurgeries(this.params);
    },
    pagechanged(page) {
      this.current_page = page;
      this.params.offset = this.params.limit * (page - 1);
      this.getSurgeries(this.params);
    },
    limitchanged(limit) {
      this.current_page = 1;
      this.params.offset = 0;
      this.params.limit = limit;
      this.getSurgeries(this.params);
    },
    addSurgery(payload) {
      if (!this.surgeries.map(item => item.id).includes(payload.id)) {
        this.surgeries.push(payload);
      }
    },
    updateSurgery(payload) {
      let index = this.surgeries.findIndex(
        surgery => surgery.id === payload.id
      );
      if (index >= 0) {
        this.surgeries.splice(index, 1, payload);
      }
    },
    removeModal(item) {
      if (this.authPermissions.includes("Delete Profile Surgeries")) {
        this.selectedSurgeryId = item.id;
        this.modal = true;
      }
    },
    async remove(id) {
      this.loading = true;
      if (!this.authPermissions.includes("Delete Profile Surgeries")) {
        return;
      }
      if (this.practice.type === "Hub") {
        await this.$axios.$delete(
          `/api/v1/practice/me/practice-surgeries/${id}`
        );
      } else if (this.practice.type === "Spoke") {
        await this.$axios.$delete(`/api/v1/practice/me/parent-surgery`);
      }
      this.loading = false;
      this.surgeries = this.surgeries.filter(surgery => surgery.id !== id);
      this.$store.commit("SET_NOTIFICATION", {
        enabled: true,
        status: "success",
        text: ["Practice Surgery Deleted Successfully"]
      });
    },
    show(item) {
      if (this.authPermissions.includes("Show Profile Surgeries")) {
        if (this.practice.type === "Hub") {
          this.$router.push(`/profile/branches-surgeries/${item.id}`);
        } else if (this.practice.type === "Spoke") {
          this.$router.push(`/profile/branches-surgeries/edit`);
        }
      }
    }
  }
};
</script>
<style scoped>
.shield {
  z-index: 509;
}
</style>

