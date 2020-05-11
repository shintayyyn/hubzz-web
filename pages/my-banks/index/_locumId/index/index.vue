<template>
  <div class="w-full">
    <div class="flex flex-row flex-no-wrap justify-start">
      <div class="font-bold text-md sm:text-lg">{{ user.personal_detail.name }}</div>
    </div>
    <div class="flex flex-row flex-wrap justify-between mt-4">
      <div class="w-full pr-0 lg:pr-2 lg:w-1/2">
        <div class="rounded-lg shadow-lg p-4">
          <div class="flex flex-col">
            <div class="flex flex-row flex-wrap justify-between items-center">
              <div class="flex flex-col order-2 md:order-1 w-full md:w-1/2">
                <div class="font-bold text-sm sm:text-md">Candidate</div>
                <div class="text-sm mb-8">{{ user.locum_detail.profession.name }}</div>
              </div>
              <AppAvatar
                class="order-1 md:order-2 mb-4 md:mb-0"
                :height="'80px'"
                :width="'80px'"
                :src="user.avatar && user.avatar.file && user.avatar.file.url ? user.avatar.file.url : null"
              />
            </div>
            <div class="font-bold text-sm sm:text-md">Headline</div>
            <div
              class="text-sm mb-8"
            >{{ user.locum_detail.headline && user.locum_detail.headline && user.locum_detail.headline.trim() ? user.locum_detail.headline : '(none)' }}</div>
            <div class="font-bold text-sm sm:text-md">Biography</div>
            <div
              class="text-sm mb-8"
            >{{ user.locum_detail.headline && user.locum_detail.short_biography && user.locum_detail.short_biography.trim() ? user.locum_detail.short_biography : '(none)' }}</div>
            <div class="font-bold text-sm sm:text-md">GMC / NMC Number</div>
            <div
              class="text-sm mb-8"
            >{{ user && user.locum_detail && user.locum_detail.gmc_or_nmc_number ? user.locum_detail.gmc_or_nmc_number.number : 'N/A' }}</div>
            <div class="font-bold text-sm sm:text-md">MPL / NPL Number</div>
            <div
              class="text-sm mb-8"
            >{{ user && user.locum_detail && user.locum_detail.mpl_or_npl_number ? user.locum_detail.mpl_or_npl_number.number : 'N/A' }}</div>
            <div class="font-bold text-sm sm:text-md">Specialty</div>
            <div class="text-sm mb-8 flex flex-row flex-wrap">
              <div
                v-for="item in user.locum_detail.qualifications"
                :key="item.id"
                class="rounded-lg bg-yellow-500 p-2 m-1"
              >{{ item.name }}</div>
            </div>
            <div class="font-bold text-sm sm:text-md">Clinical systems</div>
            <div class="text-sm mb-8 flex flex-row flex-wrap">
              <div
                v-for="item in user.locum_detail.clinical_systems"
                :key="item.id"
                class="rounded-lg bg-yellow-500 p-2 m-1"
              >{{ item.name }}</div>
            </div>
            <div class="font-bold text-sm sm:text-md">Languages</div>
            <div class="text-sm mb-8 flex flex-row flex-wrap">
              <div class="rounded-lg bg-yellow-500 p-2 m-1">English</div>
              <div
                v-for="item in user.locum_detail.spoken_languages"
                :key="item.id"
                class="rounded-lg bg-yellow-500 p-2 m-1"
              >{{ item.name }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="w-full pl-0 lg:pl-2 mt-8 lg:mt-0 lg:w-1/2">
        <div class="rounded-lg shadow-lg p-4 mb-4">
          <div class="font-bold text-sm sm:text-md">Compliance documents</div>
          <div class="flex flex-col mb-8">
            <div
              v-for="item in mandatory"
              :key="item.id"
              class="flex flex-row flex-no-wrap mt-2 cursor-pointer hover:underline"
            >
              <svgicon name="cloud-download" height="24" width="24" />
              <a
                :href="item.file.url"
                :download="item.file.filename"
                target="_blank"
                class="px-2"
                @click.prevent="downloadItem(item.file.url, item.file.filename)"
              >{{ item.compliance_document.name }}</a>
            </div>
            <template v-if="mandatory && !mandatory.length">
              <span class="text-sm">(none)</span>
            </template>
          </div>

          <div class="font-bold text-sm sm:text-md">Others documents</div>
          <div class="flex flex-col mb-8">
            <div
              v-for="item in optional"
              :key="item.id"
              class="flex flex-row flex-no-wrap mt-2 cursor-pointer hover:underline"
            >
              <svgicon class="mr-1" name="cloud-download" height="24" width="24" />
              <a
                :href="item.file.url"
                :download="item.file.filename"
                target="_blank"
                class="px-2"
                @click.prevent="downloadItem(item.file.url, item.file.filename)"
              >{{ item.compliance_document.name }}</a>
            </div>
            <template v-if="optional && !optional.length">
              <span class="text-sm">(none)</span>
            </template>
          </div>

          <div class="font-bold text-sm sm:text-md">Mandatory Trainings</div>
          <div class="flex flex-col mb-8">
            <div
              v-for="item in mandatoryTrainings"
              :key="item.id"
              class="flex flex-row flex-no-wrap mt-1 cursor-pointer hover:underline"
            >
              <div class="flex flex-row flex-no-wrap" v-if="item.file">
                <div class="w-5 h-5">
                  <svgicon name="cloud-download" height="24" width="24" />
                </div>
                <a
                  :href="item.file.url"
                  :download="item.file.filename"
                  class="break-words leading-loose mx-2 text-xs md:text-sm"
                  @click.stop.prevent="downloadItem(item.file.url, item.file.filename)"
                >{{ item.mandatory_training.name }}</a>
              </div>
            </div>
            <template v-if="mandatoryTrainings && !mandatoryTrainings.length">
              <span class="text-sm">(none)</span>
            </template>
          </div>

          <div class="font-bold text-sm sm:text-md">Preferred rates</div>
          <div class="flex flex-col mb-8">
            <div
              v-for="item in user.locum_detail.rates"
              :key="item.id"
              class="flex flex-row flex-no-wrap mt-2"
            >
              <div class="text-sm">{{ item.rate_type.name }}: £ {{ item.min }}</div>
            </div>
          </div>

          <div class="font-bold text-sm sm:text-md">Referees</div>
          <div v-if="referees.length > 0">
            <div
              v-for="item in referees"
              :key="item.id"
              :class="item && item.id ? 'rounded-lg flex flex-col bg-gray-300 my-2 p-4 text-xs md:text-sm' : ''"
            >
              <div class="flex flex-col w-full justify-start">
                <div class="w-full">Contact Name:</div>
                <div class="w-full">{{item.name && item.name.trim() ? item.name : '(none)'}}</div>
              </div>
              <div class="flex flex-col w-full justify-start my-2">
                <div class="w-full">Telephone number:</div>
                <div
                  class="w-full"
                >{{item.phone_number && item.phone_number.trim() ? item.phone_number : '(none)'}}</div>
              </div>
              <div class="flex flex-col w-full justify-start">
                <div class="w-full">Email Address:</div>
                <div class="w-full">{{item.email && item.email.trim() ? item.email : '(none)'}}</div>
              </div>
            </div>
          </div>
          <div v-else-if="referees.length === 0" class="text-xs md:text-sm">(none)</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import AppAvatar from "@/components/Base/AppAvatar";
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },
  components: {
    AppAvatar
  },
  data() {
    return {
      mandatory: [],
      optional: [],
      mandatoryTrainings: [],
      referees: []
    };
  },
  async asyncData({ app, params }) {
    try {
      const response = await app.$axios.$get(
        `/api/v1/practice/locums/${params.locumId}`
      );
      const user =
        response.data && response.data.user ? response.data.user : null;
      return {
        user
      };
    } catch (err) {
      throw err;
    }
  },
  created() {
    this.getLocumCompliancesByLocumProfessionProfessionComplianceCategoryId(
      this.user.locum_detail.profession.profession_compliance_category_id
    );
    this.mandatoryTrainings = [];
    this.user.locum_detail.mandatory_trainings.forEach(mandatoryTraining => {
      if (mandatoryTraining.file !== null) {
        this.mandatoryTrainings.push(mandatoryTraining);
      }
    });

    this.referees = [];
    this.user.locum_detail.referees.forEach(referee => {
      if (
        referee.name !== null &&
        referee.name &&
        referee.name.trim() &&
        referee.phone_number !== null &&
        referee.phone_number &&
        referee.phone_number.trim() &&
        referee.email !== null &&
        referee.email &&
        referee.email.trim()
      ) {
        this.referees.push(referee);
      }
    });
  },
  methods: {
    getLocumCompliancesByLocumProfessionProfessionComplianceCategoryId(
      locumProfessionProfessionComplianceCategoryId
    ) {
      this.$axios
        .$get(
          `/api/v1/profession-compliance-categories/${locumProfessionProfessionComplianceCategoryId}`
        )
        .then(res => {
          this.mandatory = this.user.locum_detail.compliance_documents.filter(
            compliance_document => {
              return res.data.profession_compliance_category.mandatory_compliance_documents.some(
                mandatory_compliance_document =>
                  mandatory_compliance_document.id ===
                  compliance_document.compliance_document.id
              );
            }
          );
          this.optional = this.user.locum_detail.compliance_documents.filter(
            compliance_document => {
              return res.data.profession_compliance_category.optional_compliance_documents.some(
                optional_compliance_document =>
                  optional_compliance_document.id ===
                  compliance_document.compliance_document.id
              );
            }
          );
        });
    },
    downloadItem(fileUrl, fileName) {
      const axios = require("axios");
      axios({
        url: fileUrl,
        method: "GET",
        responseType: "blob"
      }).then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
      });
    }
  }
};
</script>