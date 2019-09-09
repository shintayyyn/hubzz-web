<template>
  <div class="max-w-5xl">
    <div class="flex flex-row flex-no-wrap justify-start">
      <div class="font-bold text-md sm:text-lg">{{user.personal_detail.name}}</div>
    </div>
    <div class="flex flex-row flex-wrap justify-between mt-4">
      <div class="w-full pr-0 lg:pr-2 lg:w-1/2">
        <div class="rounded-lg shadow-lg p-4">
          <div class="flex flex-col">
            <div class="flex flex-row flex-wrap justify-between items-center">
              <div class="flex flex-col order-2 md:order-1 w-full md:w-1/2">
                <div class="font-bold text-sm sm:text-md">Candidate</div>
                <div class="text-xs sm:text-sm mb-8">{{user.locum_detail.profession.name}}</div>
              </div>
              <AppAvatar
                class="order-1 md:order-2 mb-4 md:mb-0"
                :height="'150px'"
                :width="'150px'"
                :src="user.avatar && user.avatar.file && user.avatar.file.url ? user.avatar.file.url : ''"
              />
            </div>
            <div class="font-bold text-sm sm:text-md">Candidate</div>
            <div class="text-xs sm:text-sm mb-8">{{user.locum_detail.profession.name}}</div>
            <div class="font-bold text-sm sm:text-md">Headline</div>
            <div class="text-xs sm:text-sm mb-8">{{user.locum_detail.headline}}</div>
            <div class="font-bold text-sm sm:text-md">Biography</div>
            <div class="text-xs sm:text-sm mb-8">{{user.locum_detail.short_biography}}</div>
            <div class="font-bold text-sm sm:text-md">GMC / NMC Number</div>
            <div class="text-xs sm:text-sm mb-8">{{user.locum_detail.gmc_or_nmc_number.number}}</div>
            <div class="font-bold text-sm sm:text-md">MPL / NPL Number</div>
            <div class="text-xs sm:text-sm mb-8">{{user.locum_detail.mpl_or_npl_number.number}}</div>
            <div class="font-bold text-sm sm:text-md">Specialty</div>
            <div class="text-xs sm:text-sm mb-8 flex flex-row flex-wrap">
              <div
                class="rounded-lg bg-yellow-500 p-2 m-1"
                v-for="item in user.locum_detail.qualifications"
                :key="item.id"
              >{{item.name}}</div>
            </div>
            <div class="font-bold text-sm sm:text-md">Clinical systems</div>
            <div class="text-xs sm:text-sm mb-8 flex flex-row flex-wrap">
              <div
                class="rounded-lg bg-yellow-500 p-2 m-1"
                v-for="item in user.locum_detail.clinical_systems"
                :key="item.id"
              >{{item.name}}</div>
            </div>
            <div class="font-bold text-sm sm:text-md">Languages</div>
            <div class="text-xs sm:text-sm mb-8 flex flex-row flex-wrap">
              <div class="rounded-lg bg-yellow-500 p-2 m-1">English</div>
              <div
                class="rounded-lg bg-yellow-500 p-2 m-1"
                v-for="item in user.locum_detail.spoken_languages"
                :key="item.id"
              >{{item.name}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="w-full pl-0 lg:pl-2 mt-8 lg:mt-0 lg:w-1/2">
        <div class="rounded-lg shadow-lg p-8 mb-4">
          <div class="font-bold text-sm sm:text-md">Compliance documents</div>
          <div class="flex flex-col mb-8">
            <div
              class="flex flex-row flex-no-wrap mt-2 cursor-pointer hover:underline"
              v-for="item in mandatory"
              :key="item.id"
            >
              <svgicon name="cloud-download" height="24" width="24" />
              <a
                @click.prevent="downloadItem(item.file.url, item.file.filename)"
                :href="item.file.url"
                :download="item.file.filename"
                target="_blank"
                class="px-2"
              >{{item.compliance_document.name}}</a>
            </div>
          </div>
          <div class="font-bold text-sm sm:text-md">Others documents</div>
          <div class="flex flex-col mb-8">
            <div
              class="flex flex-row flex-no-wrap mt-2 cursor-pointer hover:underline"
              v-for="item in optional"
              :key="item.id"
            >
              <svgicon class="mr-1" name="cloud-download" height="24" width="24" />
              <a
                @click.prevent="downloadItem(item.file.url, item.file.filename)"
                :href="item.file.url"
                :download="item.file.filename"
                target="_blank"
                class="px-2"
              >{{item.compliance_document.name}}</a>
            </div>
          </div>

          <div class="font-bold text-sm sm:text-md">Preferred rates</div>
          <div class="flex flex-col mb-8">
            <div
              class="flex flex-row flex-no-wrap mt-2"
              v-for="item in user.locum_detail.rates"
              :key="item.id"
            >
              <div
                class="text-xs sm:text-sm"
              >{{item.rate_type.name}}: £ {{item.min}} - £ {{item.max}}</div>
            </div>
          </div>
          <div class="font-bold text-sm sm:text-md">Referees</div>
          <div v-if="user.locum_detail.referees.length > 0">
            <div
              class="rounded-lg flex flex-col bg-gray-300 my-2 p-4"
              v-for="item in user.locum_detail.referees"
              :key="item.id"
            >
              <div class="text-xs sm:text-sm">Contact Name: {{item ? item.name:null}}</div>
              <div class="text-xs sm:text-sm">Telephone No.: {{item ? item.phone_number:null}}</div>
              <div class="text-xs sm:text-sm">Email Address: {{item ? item.email:null}}</div>
            </div>
          </div>
          <div v-else>
            <div class="text-xs sm:text-sm">(none)</div>
          </div>
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
  props: ["user"],
  data() {
    return {
      mandatory: [],
      optional: []
    };
  },
  created() {
    this.getProfessionCategory(
      this.user.locum_detail.profession.profession_category.id
    );
  },
  methods: {
    getProfessionCategory(id) {
      this.$axios.$get(`/api/v1/profession-categories/${id}`).then(res => {
        this.mandatory = this.user.locum_detail.compliance_documents.filter(
          compliance_document => {
            return res.data.profession_category.mandatory_compliance_documents.some(
              mandatory_compliance_document =>
                mandatory_compliance_document.id ===
                compliance_document.compliance_document.id
            );
          }
        );
        this.optional = this.user.locum_detail.compliance_documents.filter(
          compliance_document => {
            return res.data.profession_category.optional_compliance_documents.some(
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

