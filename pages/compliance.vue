<template>
  <section class="compliance-section">
    <div class="overflow-x-auto">
      <div class="mt-5 px-1">
        <div class="shadow-md rounded-lg bg-white px-1 py-2 md:py-4 mb-5 mx-1 md:mx-0">
          <div
            class="relative flex flex-row flex-wrap justify-between sm:items-center text-xs sm:text-sm md:px-4"
          >
            <div
              class="w-full sm:w-auto px-2 md:p-1 font-bold md:font-normal text-left"
            >GMC / NMC Number</div>
            <div
              class="w-full sm:w-2/3 px-2 md:p-1"
            >{{gmc_or_nmc_number ? gmc_or_nmc_number.number : 'No GMC or NMC Number registered'}}</div>
            <div
              class="absolute right-0 m-2 md:relative flex items-center justify-end sm:m-0 md:text-center"
            >
              <span
                class="text-xs sm:text-sm text-center text-white font-bold rounded-full px-4 py-1"
                :class="status(gmc_or_nmc_number ? gmc_or_nmc_number.status : 'No GMC or NMC Number registered')"
              >{{ gmc_or_nmc_number ? gmc_or_nmc_number.status : '' }}</span>
            </div>
          </div>
        </div>
        <div class="shadow-md rounded-lg bg-white px-1 py-2 md:py-4 mb-5 mx-1 md:mx-0">
          <div
            class="relative flex flex-row flex-wrap justify-between sm:items-center text-xs sm:text-sm md:px-4"
          >
            <div
              class="w-full sm:w-auto px-2 md:p-1 font-bold md:font-normal text-left"
            >MPL / NPL Number</div>
            <div
              class="w-full sm:w-2/3 px-2 md:p-1"
            >{{mpl_or_npl_number ? mpl_or_npl_number.number : 'No MPL or NPL Number registered'}}</div>
            <div
              class="lute right-0 m-2 md:relative flex items-center justify-end sm:m-0 md:text-center"
            >
              <span
                class="text-xs sm:text-sm text-center text-white font-bold rounded-full px-4 py-1"
                :class="status(mpl_or_npl_number ? mpl_or_npl_number.status : '')"
              >{{ mpl_or_npl_number ? mpl_or_npl_number.status : '' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-10">
      <div class="font-bold text-xs sm:text-base">Documents you need to be approved by Hubzz HQ</div>
      <div
        class="text-sm font-hairline italic"
      >(Note: Only file types .pdf, .jpeg, .msword, .tiff are acccepted)</div>
    </div>
    <div class="mt-4 overflow-x-auto">
      <template v-if="!mandatory.length">
        <span
          class="text-center font-bold text-gray-500"
          colspan="7"
        >This section is empty. Update your profile to fill this area.</span>
      </template>
      <table>
        <thead>
          <tr class="text-xs sm:text-sm text-left">
            <th class="pl-2">Type</th>
            <th class="pl-2">File</th>
            <th class="text-center">Date uploaded</th>
            <th class="text-center">Expiry date</th>
            <th class="text-center">Status</th>
            <th class="text-center">Note from hubzz HQ</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <!--------------------------FILE SHOULD SHOW ON CLICK----------------------------->
          <template v-for="(item, index) in mandatory">
            <tr
              class="text-xs sm:text-sm text-left bg-gray-200"
              v-if="activeLoading.includes(item.id)"
              :key="item.id"
            >
              <td colspan="7" class="loader-message text-center text-gray-800 cursor-wait">Uploading</td>
            </tr>
            <tr
              v-else
              :key="item.id"
              class="text-xs sm:text-sm text-left"
              :class="!item.info && 'text-gray-600'"
            >
              <td
                :class="item.info && item.info.file ? 'cursor-pointer' : ''"
                @click="show(item, 'compliance')"
              >{{item.name}}</td>
              <td class="hover:underline" v-if="item.info && item.info.file">
                <div class="flex flex-row flex-no-wrap items-center">
                  <svgicon name="cloud-download" height="24" width="24" />
                  <div class="mx-2">
                    <a
                      @click.stop.prevent="downloadItem(item.info.file.url, item.info.file.filename)"
                      :href="item.info.file.url"
                      :download="item.info.file.filename"
                      target="_blank"
                      class="whitespace-no-wrap"
                    >{{item.info.file.filename | StringMaxLength(15)}}</a>
                  </div>
                </div>
              </td>
              <td v-else></td>
              <td v-if="item.info && item.info.file">{{item.info.file.created_at | localDate}}</td>
              <td v-else></td>
              <td v-if="item.info && item.info.expired_at">{{item.info.expired_at | localDate}}</td>
              <td v-else></td>
              <td v-if="item.info && item.info.status">
                <div class="flex justify-center max-w-xs">
                  <div
                    class="text-xs sm:text-sm text-center text-white font-bold rounded-full px-4 py-1"
                    :class="status(item.info.status)"
                  >{{item.info.status}}</div>
                </div>
              </td>
              <td v-else></td>
              <td
                v-if="item && item.info && item.info.note"
              >{{ item.info.note | StringMaxLength(15)}}</td>
              <td v-else></td>
              <td
                class="hover:underline"
                v-if="!item.info"
                @click.stop="$refs[`${item.id}_file_mandatory_compliance`][0].click()"
              >
                <div class="flex flex-row flex-no-wrap">
                  <input
                    type="file"
                    :ref="`${item.id}_file_mandatory_compliance`"
                    class="inputfile hidden"
                    @input="onFileInput($event, item.id)"
                    @click.stop
                  />
                  <svgicon name="cloud-upload" height="24" width="24" />
                  <label class="leading-loose mx-2 cursor-pointer text-black">Upload</label>
                </div>
              </td>
              <td
                @click.stop="$refs[`${item.id}_file_mandatory_compliance`][0].click()"
                class="hover:underline"
                v-else
              >
                <div
                  class="flex flex-row flex-no-wrap justify-center bg-yellow-500 px-4 py-2 rounded cursor-pointer"
                >
                  <input
                    type="file"
                    :ref="`${item.id}_file_mandatory_compliance`"
                    class="inputfile hidden"
                    @input="onFileUpdate($event, item.info.id, index)"
                    @click.stop
                  />
                  <svgicon name="cloud-upload" height="24" width="24" />
                  <label class="leading-loose mx-2 cursor-pointer">Update</label>
                </div>
              </td>
            </tr>
          </template>
          <!-------------------------FILE SHOULD SHOW ON CLICK------------------------------>
        </tbody>
      </table>
    </div>

    <div class="mt-10">
      <div class="font-bold text-xs sm:text-base">Other documentation for reference to Practices</div>
    </div>

    <div class="mt-4 overflow-x-auto">
      <table>
        <thead>
          <tr class="text-xs sm:text-sm text-left">
            <th class="pl-2">Type</th>
            <th class="pl-2">File</th>
            <th class="text-center">Date uploaded</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <template v-if="!optional.length">
            <span
              class="text-center font-bold text-gray-500"
              colspan="7"
            >This section is empty. Update your profile to fill this area.</span>
          </template>
          <template v-for="(item, index) in optional">
            <tr
              class="text-xs sm:text-sm text-left bg-gray-200"
              v-if="activeLoading.includes(item.id)"
              :key="item.id"
            >
              <td colspan="7" class="loader-message text-center text-gray-800 cursor-wait">Uploading</td>
            </tr>
            <tr
              v-else
              :key="item.id"
              class="text-xs sm:text-sm text-left"
              :class="!item.info && 'text-gray-600 hover:bg-white'"
            >
              <td
                :class="item.info && item.info.file ? 'cursor-pointer' : ''"
                class="w-1/3"
                @click="show(item, 'compliance')"
              >{{item.name}}</td>
              <td class="hover:underline" v-if="item.info && item.info.file">
                <div class="flex flex-row flex-no-wrap">
                  <svgicon name="cloud-download" height="24" width="24" />
                  <div class="leading-loose mx-2">
                    <a
                      @click.stop.prevent="downloadItem(item.info.file.url, item.info.file.filename)"
                      target="_blank"
                      :href="item.info.file.url"
                    >{{item.info.file.filename | StringMaxLength(15)}}</a>
                  </div>
                </div>
              </td>
              <td v-else></td>
              <td
                v-if="item.info && item.info.file"
                class="text-center"
              >{{item.info.file.created_at | localDate}}</td>
              <td v-else></td>
              <td
                @click.stop="$refs[`${item.id}_file_optional_compliance`][0].click()"
                class="hover:underline"
                v-if="!item.info"
              >
                <div class="flex flex-row flex-no-wrap justify-center">
                  <input
                    type="file"
                    :ref="`${item.id}_file_optional_compliance`"
                    class="inputfile hidden"
                    @input="onFileInput($event, item.id, index)"
                    @click.stop
                  />
                  <svgicon name="cloud-upload" height="24" width="24" />
                  <label class="leading-loose mx-2 cursor-pointer text-black">Upload</label>
                </div>
              </td>
              <td
                @click.stop="$refs[`${item.id}_file_optional_compliance`][0].click()"
                class="hover:underline"
                v-else
              >
                <div
                  class="flex flex-row flex-no-wrap justify-center bg-yellow-500 lg:w-2/3 mx-auto p-2 rounded cursor-pointer"
                >
                  <input
                    type="file"
                    :ref="`${item.id}_file_optional_compliance`"
                    class="inputfile hidden"
                    @input="onFileUpdate($event, item.info.id, index, item.id)"
                    @click.stop
                  />
                  <svgicon name="cloud-upload" height="24" width="24" />
                  <label class="leading-loose mx-2 cursor-pointer">Update</label>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <div class="mt-10">
      <div class="font-bold text-xs sm:text-base">Mandatory Training</div>
    </div>

    <div class="mt-4 overflow-x-auto">
      <template v-if="!mandatory_trainings.length">
        <span
          class="text-center font-bold text-gray-500"
          colspan="7"
        >This section is empty. Update your profile to fill this area.</span>
      </template>
      <template v-else>
        <table>
          <thead>
            <tr class="text-xs sm:text-sm text-left">
              <th class="pl-2">Type</th>
              <th class="pl-2">File</th>
              <th class="text-center">Date uploaded</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, index) in mandatory_trainings">
              <tr
                class="text-xs sm:text-sm text-left bg-gray-200"
                v-if="activeLoading.includes(item.mandatory_training.id)"
                :key="item.id"
              >
                <td colspan="7" class="loader-message text-center text-gray-800">Uploading</td>
              </tr>
              <tr
                v-else
                :key="item.id"
                class="text-xs sm:text-sm text-left"
                :class="!item.file && 'text-gray-600'"
              >
                <td
                  :class="item && item.file ? 'cursor-pointer' : ''"
                  class="w-1/3"
                  @click="show(item, 'mandatory')"
                >{{item.mandatory_training.name}}</td>
                <td class="hover:underline" v-if="item.file">
                  <div class="flex flex-row flex-no-wrap">
                    <svgicon name="cloud-download" height="24" width="24" />
                    <div class="leading-loose mx-2">
                      <a
                        @click.stop.prevent="downloadItem(item.file.url, item.file.filename)"
                        target="_blank"
                        :href="item.file.url"
                        class="whitespace-no-wrap"
                      >{{item.file.filename | StringMaxLength(15)}}</a>
                    </div>
                  </div>
                </td>
                <td v-else></td>
                <td
                  v-if="item && item.file"
                  class="text-center"
                >{{item.file.created_at | localDate}}</td>
                <td v-else></td>
                <td
                  @click.stop="$refs[`${item.id}_file_mandatory_training`][0].click()"
                  class="hover:underline"
                  v-if="!item.file"
                >
                  <div class="flex flex-row flex-no-wrap justify-center">
                    <input
                      type="file"
                      :ref="`${item.id}_file_mandatory_training`"
                      class="inputfile hidden"
                      @input="onMandatoryFileInput($event, item.mandatory_training.id, index)"
                      @click.stop
                    />
                    <svgicon name="cloud-upload" height="24" width="24" />
                    <label class="leading-loose mx-2 cursor-pointer text-black">Upload</label>
                  </div>
                </td>
                <td
                  @click.stop="$refs[`${item.id}_file_mandatory_training`][0].click()"
                  class="hover:underline"
                  v-else
                >
                  <div
                    class="flex flex-row flex-no-wrap justify-center bg-yellow-500 lg:w-2/3 mx-auto p-2 rounded cursor-pointer"
                  >
                    <input
                      type="file"
                      :ref="`${item.id}_file_mandatory_training`"
                      class="inputfile hidden"
                      @input="onMandatoryFileUpdate($event, item.id, index, item.mandatory_training.id)"
                      @click.stop
                    />
                    <svgicon name="cloud-upload" height="24" width="24" />
                    <label class="leading-loose mx-2 cursor-pointer">Update</label>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </template>
    </div>
    <div
      class="shield"
      v-if="['compliance-id','compliance-mandatory-training-id'].includes($route.name)"
      @click="$router.push('/compliance')"
    ></div>
    <nuxt-child />
  </section>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      activeLoading: [],
      gmc_or_nmc_number: {},
      mpl_or_npl_number: {},
      profession: {},
      mandatory: [],
      optional: [],
      mandatory_trainings: [],
      specificComplianceDoc: null,
      specificMandatoryTraining: null,
      complianceModal: false,
      mandatoryTrainingModal: false
    };
  },
  async asyncData({ app, error }) {
    try {
      const response = await app.$axios.$get(`/api/v1/me`);
      const user =
        response.data && response.data.user ? response.data.user : null;
      return {
        user
      };
    } catch (err) {}
  },
  created() {
    // get gmc, mpl status
    this.gmc_or_nmc_number = this.user.locum_detail.gmc_or_nmc_number;
    this.mpl_or_npl_number = this.user.locum_detail.mpl_or_npl_number;
    // get all compliance documents list based on profession category
    this.$axios.$get(`/api/v1/profession-categories`).then(res => {
      this.profession = res.data.profession_categories.find(
        profession =>
          profession.id ===
          this.user.locum_detail.profession.profession_category.id
      );
      this.setComplianceDocuments();
    });
    // get all mandatory training list
    this.setMandatoryTrainings();
  },
  mounted() {
    this.$socket.on("Locum Notification Compliance Approved", file => {
      let index = this.mandatory.findIndex(
        item =>
          item.info.compliance_document.name === file.compliance_document.name
      );
      let updatedFile = this.mandatory.find(
        item =>
          item.info.compliance_document.name === file.compliance_document.name
      );
      if (index >= 0) {
        this.mandatory.splice(index, 1, { ...updatedFile, info: file });
      }
    });
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
  methods: {
    show(item, type) {
      if ((item.info && item.info.file) || item.file) {
        if (type === "compliance") {
          this.$router.push(`/compliance/${item.info.id}`);
        }
        if (type === "mandatory")
          this.$router.push(`/compliance/mandatory-training/${item.id}`);
      }
    },
    // set mandatory training
    setMandatoryTrainings() {
      this.$axios
        .$get(`/api/v1/locum/locum-detail-mandatory-trainings`)
        .then(res => {
          this.mandatory_trainings = res.data.locum_detail_mandatory_trainings;
          this.mandatory_trainings = this.mandatory_trainings.sort(
            (a, b) => a.id - b.id
          );
        });
    },
    // set mandatory and optional compliance
    setComplianceDocuments() {
      this.$axios
        .$get(`/api/v1/locum/locum-detail-compliance-documents`)
        .then(res => {
          if (res.data.locum_detail_compliance_documents.length > 0) {
            res.data.locum_detail_compliance_documents.forEach(
              userComplianceDocument => {
                this.profession.mandatory_compliance_documents.forEach(
                  mandatoryDocument => {
                    if (
                      userComplianceDocument.compliance_document.id ===
                      mandatoryDocument.id
                    ) {
                      mandatoryDocument.info = userComplianceDocument;
                    }
                  }
                );
                this.profession.optional_compliance_documents.forEach(
                  optionalDocument => {
                    if (
                      userComplianceDocument.compliance_document.id ===
                      optionalDocument.id
                    ) {
                      optionalDocument.info = userComplianceDocument;
                    }
                  }
                );
              }
            );
          }
          this.mandatory = this.profession.mandatory_compliance_documents.sort(
            (a, b) => a.id - b.id
          );
          this.optional = this.profession.optional_compliance_documents.sort(
            (a, b) => a.id - b.id
          );
          console.log(this.mandatory);
          console.log(this.optional);
        });
    },
    status(status) {
      if (status === "Pending" || status === "Expiring") {
        return "bg-orange-500";
      }
      if (status === "Verified" || status === "Approved") {
        return "bg-green-500";
      }
      if (status === "Rejected" || status === "Expired") {
        return "bg-red-500";
      }
    },
    onFileInput(e, id, index) {
      if (!e.target.files.length) {
        return;
      }
      let types = ["pdf", "jpeg", "msword", "tiff"];
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
          let mandatory_index = this.mandatory.findIndex(
            document =>
              document.id ===
              res.data.locum_detail_compliance_document.compliance_document.id
          );
          if (mandatory_index >= 0) {
            this.mandatory.splice(mandatory_index, 1);
            this.mandatory.push({
              id:
                res.data.locum_detail_compliance_document.compliance_document
                  .id,
              name:
                res.data.locum_detail_compliance_document.compliance_document
                  .name,
              info: res.data.locum_detail_compliance_document
            });
            this.mandatory = this.mandatory.sort((a, b) => a.id - b.id);
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: ["Document uploaded!"]
            });
            this.loading = false;
          } else {
            let optional_index = this.optional.findIndex(
              document =>
                document.id ===
                res.data.locum_detail_compliance_document.compliance_document.id
            );
            this.optional.splice(optional_index, 1);
            this.optional.push({
              id:
                res.data.locum_detail_compliance_document.compliance_document
                  .id,
              name:
                res.data.locum_detail_compliance_document.compliance_document
                  .name,
              info: res.data.locum_detail_compliance_document
            });
            this.optional = this.optional.sort((a, b) => a.id - b.id);
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: ["Document uploaded!"]
            });
            this.loading = false;
          }
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
    onFileUpdate(e, id, index, loadingId) {
      if (!e.target.files.length) {
        return;
      }
      let types = ["pdf", "jpeg", "msword", "tiff"];
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
      // post request to API / send file
      this.$axios
        .$put(`/api/v1/locum/locum-detail-compliance-documents/${id}`, formData)
        .then(res => {
          let inMandatory = this.mandatory.findIndex(
            document =>
              document.id ===
              res.data.locum_detail_compliance_document.compliance_document.id
          );
          if (inMandatory > 0) {
            this.mandatory.splice(index, 1);
            this.mandatory.push({
              id:
                res.data.locum_detail_compliance_document.compliance_document
                  .id,
              name:
                res.data.locum_detail_compliance_document.compliance_document
                  .name,
              info: res.data.locum_detail_compliance_document
            });
            this.mandatory = this.mandatory.sort((a, b) => a.id - b.id);
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: ["Document uploaded!"]
            });
            this.loading = false;
          } else {
            this.optional.splice(index, 1);
            this.optional.push({
              id:
                res.data.locum_detail_compliance_document.compliance_document
                  .id,
              name:
                res.data.locum_detail_compliance_document.compliance_document
                  .name,
              info: res.data.locum_detail_compliance_document
            });
            this.optional = this.optional.sort((a, b) => a.id - b.id);
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: ["Document uploaded!"]
            });
            this.loading = false;
          }
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
          this.activeLoading = this.activeLoading.filter(item => item !== id);
        });
    },
    onMandatoryFileInput(e, id, index) {
      let types = ["pdf", "jpeg", "msword", "tiff"];
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
      let types = ["pdf", "jpeg", "msword", "tiff"];
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
          console.log(file);
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
table tbody tr:hover td {
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
