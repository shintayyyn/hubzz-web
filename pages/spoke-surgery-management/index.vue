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
                <div
                  class="md:mx-0"
                >{{ practiceHub && practiceHub.address_line_1 ? practiceHub.address_line_1: null }}</div>
                <div
                  class="md:mx-0"
                >{{ practiceHub && practiceHub.address_line_2 ? practiceHub.address_line_2: null }}</div>
                <div
                  class="md:mx-0"
                >{{ practiceHub && practiceHub.address_line_3 ? practiceHub.address_line_3: null }}</div>
                <div
                  class="md:mx-0"
                >{{ practiceHub && practiceHub.address_line_4 ? practiceHub.address_line_4: null }}</div>
                <div
                  class="md:mx-0"
                >{{ practiceHub && practiceHub.address_line_5 ? practiceHub.address_line_5: null }}</div>
              </div>
            </div>

            <div class="flex flex-col md:flex-row w-full mt-2 leading-tight">
              <p class="md:w-1/3 font-semibold">Report To</p>
              <p
                class="md:w-2/3 mx-2 md:mx-0"
              >{{ practiceHub.report_to ? practiceHub.report_to : 'N/A' }}</p>
            </div>
            <div class="flex flex-col md:flex-row w-full mt-2 leading-tight">
              <p class="md:w-1/3 font-semibold">Email Address</p>
              <p class="md:w-2/3 mx-2 md:mx-0">{{ practiceHub.email ? practiceHub.email : 'N/A' }}</p>
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
              v-if="practiceSpoke.allow_surgery_create_sessions === true"
              class="mt-2 mb-4 bg-gray-200 p-4 rounded-lg"
            >
              <p class="font-semibold pb-2">Rate Limits (Only effective when allowed to create jobs)</p>
              <div class="flex flex-col md:flex-row">
                <p class="text-sm font-semibold md:w-2/3">Maximum Hourly Rate Limit</p>
                <p
                  class="text-sm text-sm mx-2 md:mx-0"
                >{{ practiceSpoke.max_hourly_rate_limit ?'£ '+ practiceSpoke.max_hourly_rate_limit : 'N/A' }}</p>
              </div>
              <div class="flex flex-col md:flex-row">
                <p class="text-sm font-semibold md:w-2/3">Maximum Half Day Rate Limit</p>
                <p
                  class="text-sm text-sm mx-2 md:mx-0"
                >{{ practiceSpoke.max_halfday_rate_limit ?'£ '+ practiceSpoke.max_halfday_rate_limit : 'N/A' }}</p>
              </div>
              <div class="flex flex-col md:flex-row">
                <p class="text-sm font-semibold md:w-2/3">Maximum Whole Day Rate Limit</p>
                <p
                  class="text-sm text-sm mx-2 md:mx-0"
                >{{ practiceSpoke.max_wholeday_rate_limit ?'£ '+ practiceSpoke.max_wholeday_rate_limit : 'N/A' }}</p>
              </div>
              <div class="flex flex-col md:flex-row">
                <p class="text-sm font-semibold md:w-2/3">Maximum Out-of-Hours Rate Limit</p>
                <p
                  class="text-sm text-sm mx-2 md:mx-0"
                >{{ practiceSpoke.max_ooh_rate_limit ?'£ '+ practiceSpoke.max_ooh_rate_limit : 'N/A' }}</p>
              </div>
              <div class="flex flex-col md:flex-row">
                <p class="text-sm font-semibold md:w-2/3">Maximum Excess Hours</p>
                <p
                  class="text-sm text-sm mx-2 md:mx-0"
                >{{ practiceSpoke.max_excess_hours ? practiceSpoke.max_excess_hours +' Hours' : 'N/A' }}</p>
              </div>
            </div>
            <div class="flex items-center py-1">
              <span class="mr-3 md:mx-2">
                <svgicon
                  :name="practiceSpoke.allow_surgery_create_permanent_jobs === true ? 'success-checkmark' : 'times-solid'"
                  class="fill-current w-5 h-5"
                  :class="practiceSpoke.allow_surgery_create_permanent_jobs ? 'text-green-500' : 'text-red-500 border-2 border-red-500 rounded-full p-1'"
                />
              </span>
              <p class="font-semibold leading-tight">Permanent Job Creation</p>
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
              <p class="font-semibold leading-tight">Spoke Siblings Bank Sharing</p>
            </div>
            <div class="flex items-center py-1">
              <span class="mr-3 md:mx-2">
                <svgicon
                  :name="practiceSpoke.share_my_banks === true ? 'success-checkmark' : 'times-solid'"
                  class="fill-current w-5 h-5"
                  :class="practiceSpoke.share_my_banks ? 'text-green-500' : 'text-red-500 border-2 border-red-500 rounded-full p-1'"
                />
              </span>
              <p class="font-semibold leading-tight">Hub Bank Sharing</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="py-4 text-center text-gray-500">No Practice Hub</div>
    <transition name="fade" mode="out-in">
      <nuxt-link
        v-if="['spoke-surgery-management-index-hub-invitationId',].includes($route.name)"
        :to="'/spoke-surgery-management'"
        class="shield"
      />
    </transition>
    <nuxt-child />
  </div>
</template>
<script>
import AppButton from "@/components/Base/AppButton";

export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },
  components: {
    AppButton
  },
  data() {
    return {
      practiceSpoke: "",
      practiceHub: "",
      loading: false
    };
  },
  async asyncData({ app, route, store }) {
    try {
      let response = await app.$axios.$get(
        `/api/v1/practice/me/parent-surgery`
      );
      const practiceSpoke = response.data.practice;
      const practiceHub = response.data.practice.parent_practice;
      return {
        practiceSpoke,
        practiceHub
      };
    } catch (err) {
      throw err;
    }
  },
  mounted() {
    this.addSocketListeners();
  },
  destroyed() {
    this.removeSocketListener();
  },
  methods: {
    addSocketListeners() {
      this.$socket.on(
        "Practice Notification Accept Surgery",
        this.getHubPromiseAll
      );
    },
    removeSocketListener() {
      this.$socket.removeListener(
        "Practice Notification Accept Surgery",
        this.getHubPromiseAll
      );
    },
    getHubPromiseAll() {
      this.$axios.$get(`/api/v1/practice/me/parent-surgery`).then(res => {
        this.practiceHub =
          res.data && res.data.practice && res.data.practice.hub_practice
            ? res.data.practice.hub_practice
            : null;
        this.hasParentPractice =
          res &&
          res.data &&
          res.data.practice &&
          res.data.practice.parent_practice_id
            ? true
            : false;
      });
    }
  }
};
</script>
