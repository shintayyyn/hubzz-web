<template>
  <section class="compliance-section">
    <div class="overflow-x-auto">
      <div class="mt-5 px-1">
        <div
          v-for="item in referenceComplianceDocuments"
          :key="item.id"
          class="shadow-md rounded-lg bg-white px-1 py-2 md:py-4 mb-5 mx-1 md:mx-0"
        >
          <div
            class="relative flex flex-row flex-wrap justify-between sm:items-center text-xs sm:text-sm"
          >
            <div
              class="w-1/2 px-2 md:p-1 font-bold md:font-normal text-left"
            >{{ item.compliance_document_name }}</div>
            <div class="w-1/2 px-2 md:p-1 flex flex-no-wrap justify-between items-center">
              <div>{{ item.reference }}</div>
              <div
                class="text-xs sm:text-sm text-center text-white font-bold rounded-full px-4 py-1"
                :class="status(item ? item.status : '')"
              >{{ item ? item.status : '' }}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- MANDATORY -->
      <div class="mt-10">
        <div class="font-bold text-xs sm:text-base">
          Documents you need to be approved by Hubzz HQ
          <span class="text-red-500">*</span>
          <span class="block">test size xs</span>
          <span class="hidden sm:block">test size small</span>
          <span class="hidden md:block">test size medium</span>
          <span class="hidden lg:block">test size large</span>
          <span class="hidden xl:block">test size xl</span>
        </div>
        <div
          class="text-sm font-hairline italic"
        >(Note: Only file types .pdf, .jpeg, .jfif, .doc, .docx, .tiff are acccepted)</div>
      </div>
      <div class="mt-4 overflow-x-auto">
        <template v-if="!mandatoryComplianceDocuments.length">
          <span
            class="text-center font-bold text-gray-500 text-xs md:text-sm"
            colspan="7"
          >This section is empty. Update your profile to fill this area.</span>
        </template>
        <div class="hidden lg:block">
          <div class="flex flex-no-wrap justify-start font-bold leading-none text-sm">
            <div class="w-1/6 p-2">Type</div>
            <div class="w-1/6 p-2">File</div>
            <div class="w-1/6 p-2">Date uploaded</div>
            <div class="w-1/6 p-2">Expiry date</div>
            <div class="w-1/6 p-2">Status</div>
            <div class="w-1/6 p-2">Note</div>
            <div class="w-1/6 p-2" />
          </div>
          <div
            v-for="(item, index) in mandatoryComplianceDocuments"
            :key="item.compliance_document_id"
          >
            <div
              v-if="activeLoading.includes(item.compliance_document_id)"
              class="flex flex-no-wrap justify-between shadow-md rounded-lg items-center p-3 my-3 bg-gray-200"
            >
              <span
                class="w-full loader-message text-center text-gray-800 cursor-wait bg-gray-200"
              >Uploading</span>
            </div>
            <div
              v-else
              class="flex flex-no-wrap justify-start shadow-md rounded-lg items-center p-3 my-3 bg-white"
              :class="!item.file ? 'text-gray-600' : 'hover'"
            >
              <div class="w-1/6">{{ item.compliance_document_name | StringMaxLength(30) }}</div>
              <div class="w-1/6" v-if="(item.file || item.reference)">
                <div class="flex flex-row flex-no-wrap items-center">
                  <svgicon name="cloud-download" height="24" width="24" />
                  <div class="mx-2">
                    <a
                      :href="item.file.url"
                      :download="item.file.filename"
                      target="_blank"
                      class="whitespace-no-wrap"
                      @click.stop.prevent="downloadItem(item.file.url, item.file.filename)"
                    >{{ item.file.filename | StringMaxLength(15) }}</a>
                  </div>
                </div>
                <div class="flex flex-row flex-no-wrap items-center">{{ item.reference }}</div>
              </div>
              <div class="w-1/6" v-else />
              <div
                class="w-1/6"
                v-if="item.file && item.file.created_at"
              >{{ item.file.created_at | localDate }}</div>
              <div class="w-1/6" v-else />
              <div class="w-1/6" v-if="item && item.expired_at">{{ item.expired_at | localDate }}</div>
              <div class="w-1/6" v-else />
              <div class="w-1/6" v-if="item && item.status">
                <div class="flex justify-start max-w-xs">
                  <div
                    class="text-xs sm:text-sm text-center text-white font-bold rounded-full px-4 py-1"
                    :class="status(item.status)"
                  >{{ item.status }}</div>
                </div>
              </div>
              <div class="w-1/6" v-else />
              <div class="w-1/6" v-if="item && item.note">{{ item.note | StringMaxLength(15) }}</div>
              <div class="w-1/6" v-else />
              <div class="w-1/6" v-if="item.compliance_document_type_name.includes('Upload')">
                <div
                  v-if="!item.file"
                  class="hover:underline"
                  @click.stop="$refs[`${item.compliance_document_id}_file_mandatory_compliance`][0].click()"
                >
                  <div class="flex flex-row flex-no-wrap">
                    <input
                      :ref="`${item.compliance_document_id}_file_mandatory_compliance`"
                      type="file"
                      class="inputfile hidden"
                      @input="onFileInput($event, item.compliance_document_id)"
                      @click.stop
                    />
                    <svgicon name="cloud-upload" height="24" width="24" />
                    <label
                      class="hidden md:block leading-loose mx-2 cursor-pointer text-black"
                    >Upload</label>
                  </div>
                </div>
                <div
                  v-else-if="item.file"
                  class="hover:underline"
                  @click.stop="$refs[`${item.id}_file_mandatory_compliance`][0].click()"
                >
                  <div
                    class="flex flex-row flex-no-wrap justify-center items-center bg-yellow-500 px-4 py-2 rounded cursor-pointer"
                  >
                    <input
                      :ref="`${item.id}_file_mandatory_compliance`"
                      type="file"
                      class="inputfile hidden"
                      @input="onFileUpdate($event, item.id, index, item.compliance_document_id)"
                      @click.stop
                    />
                    <svgicon name="cloud-upload" height="24" width="24" />
                    <label class="hidden md:block leading-loose mx-2 cursor-pointer">Update</label>
                  </div>
                </div>
              </div>
              <div class="w-1/6" v-else />
            </div>
            <div v-if="item.compliance_document_type_name === 'Safeguarding'">
              <div
                v-for="(childItem, index) in item.child_locum_compliance_documents"
                :key="childItem.compliance_document_id"
                class="flex flex-col"
              >
                <div
                  v-if="activeLoading.includes(childItem.compliance_document_id)"
                  class="flex flex-no-wrap justify-between shadow-md rounded-lg items-center p-3 my-3 bg-gray-200"
                >
                  <span
                    class="w-full loader-message text-center text-gray-800 cursor-wait bg-gray-200"
                  >Uploading</span>
                </div>
                <div
                  v-else
                  class="flex flex-no-wrap justify-start shadow-md rounded-lg items-center p-3 my-3 ml-8 bg-white"
                  :class="!childItem.file ? 'text-gray-600' : 'hover'"
                >
                  <div class="w-60">{{ childItem.compliance_document_name | StringMaxLength(20) }}</div>
                  <div class="w-60" v-if="(childItem.file || childItem.reference)">
                    <div class="flex flex-row flex-no-wrap items-center">
                      <svgicon name="cloud-download" height="24" width="24" />
                      <div class="mx-2">
                        <a
                          :href="childItem.file.url"
                          :download="childItem.file.filename"
                          target="_blank"
                          class="whitespace-no-wrap"
                          @click.stop.prevent="downloadItem(childItem.file.url, childItem.file.filename)"
                        >{{ childItem.file.filename | StringMaxLength(15) }}</a>
                      </div>
                    </div>
                    <div class="flex flex-row flex-no-wrap items-center">{{ childItem.reference }}</div>
                  </div>
                  <div
                    class="w-60"
                    v-if="childItem.compliance_document_type_name.includes('Upload')"
                  >
                    <div
                      v-if="!childItem.file"
                      class="hover:underline"
                      @click.stop="$refs[`${childItem.compliance_document_id}_file_mandatory_compliance`][0].click()"
                    >
                      <div class="flex flex-row flex-no-wrap">
                        <input
                          :ref="`${childItem.compliance_document_id}_file_mandatory_compliance`"
                          type="file"
                          class="inputfile hidden"
                          @input="onFileInput($event, childItem.compliance_document_id, 'child')"
                          @click.stop
                        />
                        <svgicon name="cloud-upload" height="24" width="24" />
                        <label
                          class="hidden md:block leading-loose mx-2 cursor-pointer text-black"
                        >Upload</label>
                      </div>
                    </div>
                    <div
                      v-else-if="childItem.file"
                      class="hover:underline"
                      @click.stop="$refs[`${childItem.id}_file_mandatory_compliance`][0].click()"
                    >
                      <div
                        class="flex flex-row flex-no-wrap justify-center bg-yellow-500 px-4 py-2 rounded cursor-pointer"
                      >
                        <input
                          :ref="`${childItem.id}_file_mandatory_compliance`"
                          type="file"
                          class="inputfile hidden"
                          @input="onFileUpdate($event, childItem.id, index, childItem.compliance_document_id, 'child')"
                          @click.stop
                        />
                        <svgicon name="cloud-upload" height="24" width="24" />
                        <label class="hidden md:block leading-loose mx-2 cursor-pointer">Update</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- OPTIONAL -->
      <div class="mt-10">
        <div class="font-bold text-xs sm:text-base">Other documentation for reference to Practices</div>
      </div>
      <div class="mt-4 overflow-x-auto">
        <template v-if="!optionalComplianceDocuments.length">
          <span
            class="text-center font-bold text-gray-500 text-xs md:text-sm"
            colspan="7"
          >This section is empty. Update your profile to fill this area.</span>
        </template>
        <div class="flex flex-no-wrap justify-start font-bold leading-none text-sm">
          <div class="w-1/2 flex p-2">Type</div>
          <div class="w-1/2 flex p-2">File / Reference</div>
          <div class="w-1/2 flex p-2" />
        </div>

        <div
          v-for="(item, index) in optionalComplianceDocuments"
          :key="item.compliance_document_id"
          class="flex flex-col"
        >
          <div
            v-if="activeLoading.includes(item.compliance_document_id)"
            class="flex flex-no-wrap justify-between shadow-md rounded-lg items-center p-3 my-3 bg-gray-200"
          >
            <span
              class="w-full loader-message text-center text-gray-800 cursor-wait bg-gray-200"
            >Uploading</span>
          </div>
          <div
            v-else
            class="flex flex-no-wrap justify-between shadow-md rounded-lg items-center p-3 my-3 bg-white"
            :class="!item.file ? 'text-gray-600' : 'hover'"
          >
            <div class="w-1/2">{{ item.compliance_document_name | StringMaxLength(20) }}</div>
            <div
              class="w-1/2 flex flex-no-wrap justify-between items-center"
              v-if="(item.file || item.reference)"
            >
              <div class="flex flex-row flex-no-wrap items-center">
                <svgicon name="cloud-download" height="24" width="24" />
                <div class="mx-2">
                  <a
                    :href="item.file.url"
                    :download="item.file.filename"
                    target="_blank"
                    class="whitespace-no-wrap"
                    @click.stop.prevent="downloadItem(item.file.url, item.file.filename)"
                  >{{ item.file.filename | StringMaxLength(15) }}</a>
                </div>
                <div>{{ item.reference }}</div>
              </div>
              <div v-if="item.compliance_document_type_name.includes('Upload')" class>
                <div
                  v-if="!item.file"
                  class="hover:underline"
                  @click.stop="$refs[`${item.compliance_document_id}_file_mandatory_compliance`][0].click()"
                >
                  <div class="flex flex-row flex-no-wrap justify-end">
                    <input
                      :ref="`${item.compliance_document_id}_file_mandatory_compliance`"
                      type="file"
                      class="inputfile hidden"
                      @input="onFileInput($event, item.compliance_document_id, 'parent')"
                      @click.stop
                    />
                    <svgicon name="cloud-upload" height="24" width="24" />
                    <label
                      class="hidden md:block leading-loose mx-2 cursor-pointer text-black"
                    >Upload</label>
                  </div>
                </div>
                <div
                  v-else-if="item.file"
                  class="hover:underline"
                  @click.stop="$refs[`${item.id}_file_mandatory_compliance`][0].click()"
                >
                  <div
                    class="flex flex-row flex-no-wrap justify-center bg-yellow-500 px-4 py-2 rounded cursor-pointer"
                  >
                    <input
                      :ref="`${item.id}_file_mandatory_compliance`"
                      type="file"
                      class="inputfile hidden"
                      @input="onFileUpdate($event, item.id, index, item.compliance_document_id, 'parent')"
                      @click.stop
                    />
                    <svgicon name="cloud-upload" height="24" width="24" />
                    <label class="hidden md:block leading-loose mx-2 cursor-pointer">Update</label>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="w-1/2" />
          </div>
          <div v-if="item.compliance_document_type_name === 'Safeguarding'">
            <div
              v-for="(childItem, index) in item.child_locum_compliance_documents"
              :key="childItem.compliance_document_id"
              class="flex flex-col"
            >
              <div
                v-if="activeLoading.includes(childItem.compliance_document_id)"
                class="flex flex-no-wrap justify-between shadow-md rounded-lg items-center p-3 my-3 bg-gray-200"
              >
                <span
                  class="w-full loader-message text-center text-gray-800 cursor-wait bg-gray-200"
                >Uploading</span>
              </div>
              <div
                v-else
                class="flex flex-no-wrap justify-between shadow-md rounded-lg items-center p-3 my-3 ml-8 bg-white"
                :class="!childItem.file ? 'text-gray-600' : 'hover'"
              >
                <div class="w-full">{{ childItem.compliance_document_name | StringMaxLength(20) }}</div>
                <div v-if="(childItem.file || childItem.reference)" class="w-full">
                  <div class="flex flex-row flex-no-wrap items-center">
                    <svgicon name="cloud-download" height="24" width="24" />
                    <div class="mx-2">
                      <a
                        :href="childItem.file.url"
                        :download="childItem.file.filename"
                        target="_blank"
                        class="whitespace-no-wrap"
                        @click.stop.prevent="downloadItem(childItem.file.url, childItem.file.filename)"
                      >{{ childItem.file.filename | StringMaxLength(15) }}</a>
                    </div>
                  </div>
                  <div class="flex flex-row flex-no-wrap items-center">{{ childItem.reference }}</div>
                </div>
                <div v-if="childItem.compliance_document_type_name.includes('Upload')" class>
                  <div
                    v-if="!childItem.file"
                    class="hover:underline"
                    @click.stop="$refs[`${childItem.compliance_document_id}_file_mandatory_compliance`][0].click()"
                  >
                    <div class="flex flex-row flex-no-wrap">
                      <input
                        :ref="`${childItem.compliance_document_id}_file_mandatory_compliance`"
                        type="file"
                        class="inputfile hidden"
                        @input="onFileInput($event, childItem.compliance_document_id, 'child')"
                        @click.stop
                      />
                      <svgicon name="cloud-upload" height="24" width="24" />
                      <label
                        class="hidden md:block leading-loose mx-2 cursor-pointer text-black"
                      >Upload</label>
                    </div>
                  </div>
                  <div
                    v-else-if="childItem.file"
                    class="hover:underline"
                    @click.stop="$refs[`${childItem.id}_file_mandatory_compliance`][0].click()"
                  >
                    <div
                      class="flex flex-row flex-no-wrap justify-center bg-yellow-500 px-4 py-2 rounded cursor-pointer"
                    >
                      <input
                        :ref="`${childItem.id}_file_mandatory_compliance`"
                        type="file"
                        class="inputfile hidden"
                        @input="onFileUpdate($event, childItem.id, index, childItem.compliance_document_id, 'child')"
                        @click.stop
                      />
                      <svgicon name="cloud-upload" height="24" width="24" />
                      <label class="hidden md:block leading-loose mx-2 cursor-pointer">Update</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  data() {
    return {
      dataTypeUploading: null,
      loading: false,
      activeLoading: [],
      referenceComplianceDocuments: [],
      mandatoryComplianceDocuments: [],
      optionalComplianceDocuments: []
    };
  },
  watch: {
    $route(value) {
      if (
        ["compliance-id", "compliance-mandatory-training-id"].includes(
          value.name
        )
      ) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
    }
  },
  async asyncData({ app, store }) {
    try {
      const response = await app.$axios.$get(`/api/v1/locum/me/compliance`);

      const referenceComplianceDocuments =
        response.data.user.reference_locum_compliance_documents;
      const mandatoryComplianceDocuments =
        response.data.user.mandatory_locum_compliance_documents;
      console.log(mandatoryComplianceDocuments);
      const optionalComplianceDocuments =
        response.data.user.optional_locum_compliance_documents;
      console.log(optionalComplianceDocuments);

      return {
        referenceComplianceDocuments,
        mandatoryComplianceDocuments,
        optionalComplianceDocuments
      };
    } catch (err) {
      console.log("err", err.response || err);
      if (err.response.data.message) {
        store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "danger",
          text: [`${err.response.data.message}`]
        });
      }
      throw err;
    }
  },
  mounted() {
    this.$socket.on(
      "Locum Notification Number Pending",
      this.getNumberPendingRealTime
    );
    this.$socket.on(
      "Locum Notification Number Rejected",
      this.getNumberRejectedRealTime
    );
    this.$socket.on(
      "Locum Notification Number Verified",
      this.getNumberVerifiedRealTime
    );
    this.$socket.on(
      "Locum Notification Compliance Approved",
      this.getComplianceRealTime
    );
    this.$socket.on(
      "Locum Notification Compliance Rejected",
      this.getComplianceRealTime
    );
    this.$socket.on(
      "Locum Notification Compliance Pending",
      this.getComplianceRealTime
    );
    this.$socket.on(
      "Locum Notification Compliance Expiring",
      this.getComplianceRealTime
    );
    this.$socket.on(
      "Locum Notification Compliance Expired",
      this.getComplianceRealTime
    );
  },
  destroyed() {
    this.removeListener();
  },
  methods: {
    getAllCompliances() {
      this.$axios.$get(`/api/v1/locum/me/compliance`).then(res => {
        this.referenceComplianceDocuments =
          res.data.user.reference_locum_compliance_documents;
        this.mandatoryComplianceDocuments =
          res.data.user.mandatory_locum_compliance_documents;
        this.optionalComplianceDocuments =
          res.data.user.optional_locum_compliance_documents;
      });
    },
    // async getNumberPendingRealTime(file) {
    //   if (!file) {
    //     return;
    //   }
    //   if (file && file.type === "GMC/NMC") {
    //     this.gmc_or_nmc_number.status = "Pending";
    //   } else if (file && file.type === "MPL/NPL") {
    //     this.mpl_or_npl_number = "Pending";
    //   }
    // },
    // async getNumberRejectedRealTime(file) {
    //   if (!file) {
    //     return;
    //   }
    //   if (file && file.type === "GMC/NMC") {
    //     this.gmc_or_nmc_number.status = "Rejected";
    //   } else if (file && file.type === "MPL/NPL") {
    //     this.mpl_or_npl_number = "Rejected";
    //   }
    // },
    // async getNumberVerifiedRealTime(file) {
    //   if (!file) {
    //     return;
    //   }
    //   if (file && file.type === "GMC/NMC") {
    //     this.gmc_or_nmc_number.status = "Verified";
    //   } else if (file && file.type === "MPL/NPL") {
    //     this.mpl_or_npl_number.status = "Verified";
    //   }
    // },
    async getComplianceRealTime(file) {
      if (!file) {
        return;
      }
      this.getAllCompliances();
      // let index = this.mandatory.findIndex(
      //   item =>
      //     item.info.compliance_document.name ===
      //       file.compliance_document.name ||
      //     item.name === file.compliance_document.name
      // );
      // let updatedFile = this.mandatory.find(
      //   item =>
      //     item.info.compliance_document.name ===
      //       file.compliance_document.name ||
      //     item.name === file.compliance_document.name
      // );
      // if (index >= 0) {
      //   this.mandatory.splice(index, 1, { ...updatedFile, info: file });
      // }
    },
    removeListener() {
      this.$socket.removeListener(
        "Locum Notification Number Pending",
        this.getNumberPendingRealTime
      );
      this.$socket.removeListener(
        "Locum Notification Number Rejected",
        this.getNumberRejectedRealTime
      );
      this.$socket.removeListener(
        "Locum Notification Number Verified",
        this.getNumberVerifiedRealTime
      );
      this.$socket.removeListener(
        "Locum Notification Compliance Approved",
        this.getComplianceRealTime
      );
      this.$socket.removeListener(
        "Locum Notification Compliance Pending",
        this.getComplianceRealTime
      );
      this.$socket.removeListener(
        "Locum Notification Compliance Rejected",
        this.getComplianceRealTime
      );
      this.$socket.removeListener(
        "Locum Notification Compliance Expiring",
        this.getComplianceRealTime
      );
      this.$socket.removeListener(
        "Locum Notification Compliance Expired",
        this.getComplianceRealTime
      );
    },
    show(item, type) {
      if ((item.info && item.info.file) || item.file) {
        if (type === "compliance") {
          this.$router.push(`/compliance/${item.info.id}`);
        }
        if (type === "mandatory")
          this.$router.push(`/compliance/mandatory-training/${item.id}`);
      }
    },
    status(status) {
      let str;
      switch (status) {
        case "Pending":
        case "Expiring":
          str = "bg-orange-500";
          break;
        case "Verified":
        case "Approved":
          str = "bg-green-500";
          break;
        default:
          str = "bg-red-500";
      }
      return str;
    },
    onFileInput(e, id, dataTypeUploading) {
      if (!e.target.files.length) {
        return;
      }
      // vnd.openxmlformats-officedocument.wordprocessingml.document - docx type
      let types = [
        "pdf",
        "jpeg",
        "msword",
        "tiff",
        "vnd.openxmlformats-officedocument.wordprocessingml.document",
        "vnd.openxmlformats-officedocument.wordprocessingml.template",
        "vnd.ms-word.document.macroEnabled.12",
        "vnd.ms-word.template.macroEnabled.12"
      ];
      let file = e.target.files[0];
      let fileType = file.type.split("/")[1];
      if (!types.includes(fileType)) {
        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "alert",
          text: ["Invalid File Format"]
        });
        return;
      }
      const formData = new FormData();
      formData.append("file", file);
      formData.append("compliance_document_id", id);
      formData.append("locum_detail_id", this.$auth.user.id);
      // post request to API / send file
      this.loading = true;
      this.activeLoading.push(id);

      this.$axios
        .$post(`/api/v1/locum/locum-detail-compliance-documents`, formData)
        .then(res => {
          if (dataTypeUploading === "parent") {
            let foundData = [
              ...this.optionalComplianceDocuments,
              ...this.mandatoryComplianceDocuments
            ].find(item => item.compliance_document_id === id);
            foundData.id = res.data.locum_detail_compliance_document.id;
            foundData.status = res.data.locum_detail_compliance_document.status;
            foundData.file = res.data.locum_detail_compliance_document.file;
            foundData.expired_at =
              res.data.locum_detail_compliance_document.expired_at;
            foundData.note = res.data.locum_detail_compliance_document.note;
          } else if (dataTypeUploading === "child") {
            let foundParentInOptional = this.optionalComplianceDocuments.find(
              item => item.compliance_document_type_name === "Parent"
            );
            let foundParentInMandatory = this.mandatoryComplianceDocuments.find(
              item => item.compliance_document_type_name === "Parent"
            );
            if (foundParentInOptional) {
              let foundChild = foundParentInOptional.child_locum_compliance_documents.find(
                item => item.compliance_document_id === id
              );
              if (foundChild) {
                foundChild.id = res.data.locum_detail_compliance_document.id;
                foundChild.status =
                  res.data.locum_detail_compliance_document.status;
                foundChild.file =
                  res.data.locum_detail_compliance_document.file;
                foundChild.expired_at =
                  res.data.locum_detail_compliance_document.expired_at;
                foundChild.note =
                  res.data.locum_detail_compliance_document.note;
              }
            }
            if (foundParentInMandatory) {
              let foundChild = foundParentInMandatory.child_locum_compliance_documents.find(
                item => item.compliance_document_id === id
              );
              if (foundChild) {
                foundChild.id = res.data.locum_detail_compliance_document.id;
                foundChild.status =
                  res.data.locum_detail_compliance_document.status;
                foundChild.file =
                  res.data.locum_detail_compliance_document.file;
                foundChild.expired_at =
                  res.data.locum_detail_compliance_document.expired_at;
                foundChild.note =
                  res.data.locum_detail_compliance_document.note;
              }
            }
          }

          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: ["Document uploaded!"]
          });
        })
        .catch(err => {
          console.log("err", err.response || err);
          if (
            err.response.data.message &&
            err.response.data.message.includes("File size too large") &&
            err.response.data.status === 500
          ) {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "danger",
              text: ["The maximum file size is 10mb only"]
            });
          } else {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "danger",
              text: [`${err.response.data.message}`]
            });
          }
          this.loading = false;
          this.activeLoading = this.activeLoading.filter(item => item !== id);
        })
        .finally(() => {
          this.loading = false;
          this.activeLoading = this.activeLoading.filter(
            item => item.id === id
          );
        });
    },
    onFileUpdate(e, id, index, loadingId, dataTypeUploading) {
      if (!e.target.files.length) {
        return;
      }
      let types = [
        "pdf",
        "jpeg",
        "msword",
        "tiff",
        "vnd.openxmlformats-officedocument.wordprocessingml.document",
        "vnd.openxmlformats-officedocument.wordprocessingml.template",
        "vnd.ms-word.document.macroEnabled.12",
        "vnd.ms-word.template.macroEnabled.12"
      ];
      let file = e.target.files[0];
      let fileType = file.type.split("/")[1];
      if (!types.includes(fileType)) {
        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "alert",
          text: ["Invalid File Format"]
        });
        return;
      }
      this.loading = true;
      this.activeLoading.push(loadingId);
      const formData = new FormData();
      formData.append("file", file);
      this.$axios
        .$put(`/api/v1/locum/locum-detail-compliance-documents/${id}`, formData)
        .then(res => {
          if (dataTypeUploading === "parent") {
            let foundData = [
              ...this.optionalComplianceDocuments,
              ...this.mandatoryComplianceDocuments
            ].find(item => item.compliance_document_id === loadingId);
            foundData.status = res.data.locum_detail_compliance_document.status;
            foundData.file = res.data.locum_detail_compliance_document.file;
            foundData.expired_at =
              res.data.locum_detail_compliance_document.expired_at;
            foundData.note = res.data.locum_detail_compliance_document.note;
          } else if (dataTypeUploading === "child") {
            let foundParentInOptional = this.optionalComplianceDocuments.find(
              item => item.compliance_document_type_name === "Parent"
            );
            let foundParentInMandatory = this.mandatoryComplianceDocuments.find(
              item => item.compliance_document_type_name === "Parent"
            );
            if (foundParentInOptional) {
              let foundChild = foundParentInOptional.child_locum_compliance_documents.find(
                item => item.compliance_document_id === loadingId
              );
              if (foundChild) {
                foundChild.status =
                  res.data.locum_detail_compliance_document.status;
                foundChild.file =
                  res.data.locum_detail_compliance_document.file;
                foundChild.expired_at =
                  res.data.locum_detail_compliance_document.expired_at;
                foundChild.note =
                  res.data.locum_detail_compliance_document.note;
              }
            }
            if (foundParentInMandatory) {
              let foundChild = foundParentInMandatory.child_locum_compliance_documents.find(
                item => item.compliance_document_id === loadingId
              );
              if (foundChild) {
                foundChild.status =
                  res.data.locum_detail_compliance_document.status;
                foundChild.file =
                  res.data.locum_detail_compliance_document.file;
                foundChild.expired_at =
                  res.data.locum_detail_compliance_document.expired_at;
                foundChild.note =
                  res.data.locum_detail_compliance_document.note;
              }
            }
          }

          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: ["Document uploaded!"]
          });
        })
        .catch(err => {
          console.log("err", err.response || err);
          if (
            err.response.data.message &&
            err.response.data.message.includes("File size too large") &&
            err.response.data.status === 500
          ) {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "danger",
              text: ["The maximum file size is 10mb only"]
            });
          } else {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "danger",
              text: [`${err.response.data.message}`]
            });
          }
        })
        .finally(() => {
          this.loading = false;
          this.activeLoading = this.activeLoading.filter(
            item => item.id === loadingId
          );
        });
    },
    onMandatoryFileInput(e, id, index) {
      let types = [
        "pdf",
        "jpeg",
        "msword",
        "tiff",
        "vnd.openxmlformats-officedocument.wordprocessingml.document",
        "vnd.openxmlformats-officedocument.wordprocessingml.template",
        "vnd.ms-word.document.macroEnabled.12",
        "vnd.ms-word.template.macroEnabled.12"
      ];
      let file = e.target.files[0];
      let fileType = file.type.split("/")[1];
      if (!types.includes(fileType)) {
        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "alert",
          text: ["Invalid File Format"]
        });
        return;
      }
      const formData = new FormData();
      formData.append("file", file);
      formData.append("mandatory_training_id", id);
      // post request to API / send file
      this.loading = true;
      this.activeLoading.push(id);
      this.$axios
        .$post(`/api/v1/locum/locum-detail-mandatory-trainings`, formData)
        .then(res => {
          this.mandatory_trainings.splice(
            index,
            1,
            res.data.locum_detail_mandatory_training
          );
          this.mandatory_trainings = this.mandatory_trainings.sort(
            (a, b) => a.id - b.id
          );
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: ["Document uploaded!"]
          });
          this.loading = false;
          this.activeLoading = this.activeLoading.filter(item => item !== id);
        })
        .catch(err => {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "danger",
            text: [`${err.response.data.message}`]
          });
          this.loading = false;
          this.activeLoading = this.activeLoading.filter(item => item !== id);
        });
    },
    onMandatoryFileUpdate(e, id, index, loadingId) {
      if (!e.target.files.length) {
        return;
      }
      let types = [
        "pdf",
        "jpeg",
        "msword",
        "tiff",
        "vnd.openxmlformats-officedocument.wordprocessingml.document",
        "vnd.openxmlformats-officedocument.wordprocessingml.template",
        "vnd.ms-word.document.macroEnabled.12",
        "vnd.ms-word.template.macroEnabled.12"
      ];
      let file = e.target.files[0];
      let fileType = file.type.split("/")[1];
      if (!types.includes(fileType)) {
        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "alert",
          text: ["Invalid File Format"]
        });
        return;
      }
      const formData = new FormData();
      formData.append("file", file);
      // post request to API / send file
      this.loading = true;
      this.activeLoading.push(loadingId);
      this.$axios
        .$put(`/api/v1/locum/locum-detail-mandatory-trainings/${id}`, formData)
        .then(res => {
          this.mandatory_trainings.splice(
            index,
            1,
            res.data.locum_detail_mandatory_training
          );
          this.mandatory_trainings = this.mandatory_trainings.sort(
            (a, b) => a.id - b.id
          );
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: ["Document uploaded!"]
          });
          this.loading = false;
          this.activeLoading = this.activeLoading.filter(
            item => item !== loadingId
          );
        })
        .catch(err => {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "danger",
            text: [`${err.response.data.message}`]
          });
          this.loading = false;
          this.activeLoading = this.activeLoading.filter(
            item => item !== loadingId
          );
        });
    },
    downloadItem(fileUrl, fileName) {
      const axios = require("axios");
      axios({
        url: fileUrl,
        method: "GET",
        responseType: "blob" // important
      }).then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    }
  }
};
</script>
<style scoped>
.loading {
  background-color: #ccc;
}
a {
  text-decoration: none;
  color: black;
}
table {
  border-collapse: separate;
  border-spacing: 0 10px;
  padding: 0 5px;
}
.hover:hover td {
  background-color: #eff3f8;
}
table tbody td:last-child,
table thead th:last-child {
  position: sticky;
  background-color: #fff;
  right: 0;
}
table tbody td {
  padding: 15px 8px;
}
.shield {
  z-index: 509;
}
.mandatoryTrainingModal {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  border-left: solid 2px #edf2f7;
  transition: all 0.3s ease-in-out;
  background-color: white;
  z-index: 510;
}
.complianceModal {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  border-left: solid 2px #edf2f7;
  transition: all 0.3s ease-in-out;
  background-color: white;
  z-index: 510;
}
@media screen and (min-width: 1200px) {
  .complianceModal {
    width: 80%;
  }
  .mandatoryTrainingModal {
    width: 80%;
  }
}
.loader-message:after {
  content: " .";
  animation: dots 1s steps(5, end) infinite;
}

@keyframes dots {
  0%,
  20% {
    color: rgba(0, 0, 0, 0);
    text-shadow: 0.25em 0 0 rgba(0, 0, 0, 0), 0.5em 0 0 rgba(0, 0, 0, 0);
  }
  40% {
    color: #333;
    text-shadow: 0.25em 0 0 rgba(0, 0, 0, 0), 0.5em 0 0 rgba(0, 0, 0, 0);
  }
  60% {
    text-shadow: 0.25em 0 0 #333, 0.5em 0 0 rgba(0, 0, 0, 0);
  }
  80%,
  100% {
    text-shadow: 0.25em 0 0 #333, 0.5em 0 0 #333;
  }
}
</style>
