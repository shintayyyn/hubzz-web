<template>
  <div class="py-2">
    <div v-if="practiceHub" class="flex flex-col md:flex-row md:m-4 my-6">
      <div class="flex flex-col md:flex-row w-full pb-2 md:pb-0">
        <div class="md:w-1/2">
          <p class="text-lg font-semibold">Practice Hub</p>
          <div class="flex flex-col mx-2">
            <div class="flex flex-col mt-4 md:flex-row w-full leading-tight">
              <p class="md:w-1/3 font-semibold">Practice Name</p>
              <p class="md:w-2/3 mx-2 md:mx-0">{{ practiceHub.surgery.name }}</p>
            </div>
            <div class="flex flex-col mt-4 md:flex-row w-full leading-tight">
              <p class="md:w-1/3 font-semibold">Practice Code</p>
              <p class="md:w-2/3 mx-2 md:mx-0">{{ practiceHub.code }}</p>
            </div>
            <div class="flex flex-col mt-4 md:flex-row w-full leading-tight">
              <p class="md:w-1/3 font-semibold">CCG</p>
              <p class="md:w-2/3 mx-2 md:mx-0">{{ practiceHub.clinical_commissioning_group_name }}</p>
            </div>
            <div class="flex flex-col mt-4 md:flex-row w-full leading-tight">
              <p class="md:w-1/3 font-semibold">Contact Number</p>
              <p class="md:w-2/3 mx-2 md:mx-0">{{ practiceHub.phone_number }}</p>
            </div>
            <div class="flex flex-col mt-4 md:flex-row w-full leading-tight">
              <div class="md:w-1/3 font-semibold">Address</div>
              <div class="md:w-2/3">
                <div class="md:mx-0">{{ practiceHub.address_line_1 }}</div>
                <div class="md:mx-0">{{ practiceHub.address_line_2 }}</div>
                <div class="md:mx-0">{{ practiceHub.address_line_3 }}</div>
                <div class="md:mx-0">{{ practiceHub.address_line_4 }}</div>
              </div>
            </div>

            <div class="flex flex-col md:flex-row w-full mt-2 leading-tight">
              <p class="md:w-1/3 font-semibold">Report To</p>
              <p
                class="md:w-2/3 mx-2 md:mx-0"
              >{{practiceHub.report_to ? practiceHub.report_to : 'N/A'}}</p>
            </div>
            <div class="flex flex-col md:flex-row w-full mt-2 leading-tight">
              <p class="md:w-1/3 font-semibold">Email Address</p>
              <p class="md:w-2/3 mx-2 md:mx-0">{{practiceHub.email ? practiceHub.email : 'N/A'}}</p>
            </div>
          </div>
        </div>
        <div class="md:w-1/2 mt-4 md:mt-0">
          <p class="text-lg font-semibold">Permissions</p>
          <div class="mx-2">
            <div class="flex items-center py-1">
              <span class="mr-3 md:mx-2">
                <svgicon
                  :name="practiceSpoke.allow_surgery_create_sessions === true ? 'success-checkmark' : 'times-solid'"
                  class="fill-current w-5 h-5"
                  :class="practiceSpoke.allow_surgery_create_sessions ? 'text-green-500' : 'w-5 h-5 text-red-500 border-2 border-red-500 rounded-full p-1'"
                />
              </span>
              <p class="font-semibold leading-tight">Job Creation</p>
            </div>
            <div
              class="mt-2 mb-4 bg-gray-200 p-4 rounded-lg"
              v-if="practiceSpoke.allow_surgery_create_sessions === true"
            >
              <p class="font-semibold pb-2">Rate Limits (Only effective when allowed to create jobs)</p>
              <div class="flex flex-col md:flex-row">
                <p class="text-sm font-semibold md:w-2/3">Maximum Hourly Rate Limit</p>
                <p
                  class="text-sm text-sm mx-2 md:mx-0"
                >{{practiceSpoke.max_hourly_rate_limit ?'£ '+ practiceSpoke.max_hourly_rate_limit : 'N/A'}}</p>
              </div>
              <div class="flex flex-col md:flex-row">
                <p class="text-sm font-semibold md:w-2/3">Maximum Half Day Rate Limit</p>
                <p
                  class="text-sm text-sm mx-2 md:mx-0"
                >{{practiceSpoke.max_halfday_rate_limit ?'£ '+ practiceSpoke.max_halfday_rate_limit : 'N/A'}}</p>
              </div>
              <div class="flex flex-col md:flex-row">
                <p class="text-sm font-semibold md:w-2/3">Maximum Whole Day Rate Limit</p>
                <p
                  class="text-sm text-sm mx-2 md:mx-0"
                >{{practiceSpoke.max_wholeday_rate_limit ?'£ '+ practiceSpoke.max_wholeday_rate_limit : 'N/A'}}</p>
              </div>
              <div class="flex flex-col md:flex-row">
                <p class="text-sm font-semibold md:w-2/3">Maximum Out-of-Hours Rate Limit</p>
                <p
                  class="text-sm text-sm mx-2 md:mx-0"
                >{{practiceSpoke.max_ooh_rate_limit ?'£ '+ practiceSpoke.max_ooh_rate_limit : 'N/A'}}</p>
              </div>
              <div class="flex flex-col md:flex-row">
                <p class="text-sm font-semibold md:w-2/3">Maximum Excess Hours</p>
                <p
                  class="text-sm text-sm mx-2 md:mx-0"
                >{{practiceSpoke.max_excess_hours ? practiceSpoke.max_excess_hours +' Hours' : 'N/A'}}</p>
              </div>
            </div>
            <div class="flex items-center py-1">
              <span class="mr-3 md:mx-2">
                <svgicon
                  :name="practiceSpoke.allow_surgery_bill_locum === true ? 'success-checkmark' : 'times-solid'"
                  class="fill-current w-5 h-5"
                  :class="practiceSpoke.allow_surgery_bill_locum ? 'text-green-500' : 'text-red-500 border-2 border-red-500 rounded-full p-1'"
                />
              </span>
              <p class="font-semibold leading-tight">Billing for Locums</p>
            </div>
            <div class="flex items-center py-1">
              <span class="mr-3 md:mx-2">
                <svgicon
                  :name="practiceSpoke.allow_surgery_bill_hubzz === true ? 'success-checkmark' : 'times-solid'"
                  class="fill-current w-5 h-5"
                  :class="practiceSpoke.allow_surgery_bill_hubzz ? 'text-green-500' : 'text-red-500 border-2 border-red-500 rounded-full p-1'"
                />
              </span>
              <p class="font-semibold leading-tight">Billing for HUBZZ</p>
            </div>
            <div class="flex items-center py-1">
              <span class="mr-3 md:mx-2">
                <svgicon
                  :name="practiceSpoke.share_banks_to_other_surgeries === true ? 'success-checkmark' : 'times-solid'"
                  class="fill-current w-5 h-5"
                  :class="practiceSpoke.share_banks_to_other_surgeries ? 'text-green-500' : 'text-red-500 border-2 border-red-500 rounded-full p-1'"
                />
              </span>
              <p class="font-semibold leading-tight">Bank Sharing</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!practiceHub">
      <AppTable
        v-if="totalInvitations > 0"
        :total="totalInvitations"
        :items="hubInvitations"
        :loading="loading"
        :currentPage="current_page"
        :perPage="params.limit"
        :columns="columns"
        :orderBy="params.order_by"
        :customWidth="700"
        @pagechanged="pagechanged"
        @limitchanged="limitchanged"
      >
        <template v-slot:actions="slotProps">
          <div class="flex flex-wrap justify-center">
            <div
              @click="$router.push({ path: `/spoke-surgery-management/hub/${slotProps.item.id}` })"
              class="my-1 p-2 bg-yellow-500 font-bold rounded-lg focus:outline-none"
            >View</div>
          </div>
        </template>
      </AppTable>
      <div v-else class="py-4 text-center text-gray-500">No Practice Hub at the moment</div>
    </div>
    <transition name="fade" mode="out-in">
      <nuxt-link
        :to="'/spoke-surgery-management'"
        class="shield"
        v-if="['spoke-surgery-management-index-hub-invitationId',].includes($route.name)"
      ></nuxt-link>
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
      practiceSpoke: "",
      practiceHub: "",
      totalInvitations: 0,
      hubInvitations: [],
      // app table params (no filter for this one)
      current_page: 1,
      loading: false,
      params: {
        offset: 0,
        limit: 5,
        order_by: []
      },
      columns: [
        {
          name: "Hub Surgery",
          dataIndex: "practice.surgery.name",
          class: "text-left",
          sortable: false
        },
        {
          name: "Phone Number",
          dataIndex: "practice.phone_number",
          class: "text-left"
        },
        {
          name: "Actions",
          dataIndex: "actions",
          class: "text-center"
        }
      ]
    };
  },
  async asyncData({ app, route, store }) {
    try {
      let response = await app.$axios.$get(
        `/api/v1/practice/me/parent-surgery`
      );
      const practiceSpoke = response.data.practice;
      const practiceHub = response.data.practice.parent_practice;

      response = await app.$axios.$get(
        `/api/v1/practice/me/parent-surgery/invitations-count`
      );
      const totalInvitations = response.data.count;
      response = await app.$axios.$get(
        `/api/v1/practice/me/parent-surgery/invitations`
      );
      const hubInvitations = response.data.practice_surgeries;
      // let hubInvitations = []
      // if (response.data && response.data.practice_surgeries) {
      //   response.data.practice_surgeries.forEach(invitation => {
      //     hubInvitations.push(invitation)
      //   })
      // }
      return {
        practiceSpoke,
        practiceHub,
        totalInvitations,
        hubInvitations
      };
    } catch (err) {
      throw err;
    }
  },
  methods: {
    // async getHub(){
    //   await this.$axios.$get(`/api/v1/practice/me/parent-surgery`).then(res => {
    //     this.practiceHub =
    //   })
    // },
    getHubInvitations(params) {
      this.loading = true;
      this.$axios
        .$get(`/api/v1/practice/me/parent-surgery/invitations`, { params })
        .then(res => {
          (this.loading = false), (this.hubInvitations = []);
          res.data.practice_surgeries.forEach(invitation => {
            this.hubInvitations.push(invitation);
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    limitchanged(limit) {
      this.current_page = 1;
      this.params.offset = 0;
      this.params.limit = limit;
      this.getHubInvitations(this.params);
    },
    pagechanged(page) {
      this.current_page = page;
      this.params.offset = this.params.limit * (page - 1);
      this.getHubInvitations(this.params);
    }
  }
};
</script>

<style>
/* .shield {
	z-index: 509;
} */
</style>
