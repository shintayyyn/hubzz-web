<template>
  <section class="compliance-section">
    <div class="overflow-x-auto">
      <div class="number-status md:mt-10">
        <div class="border-solid rounded-lg shadow-md px-1 py-4 mb-5 mx-1 md:mx-0">
          <div class="flex flex-row flex-no-wrap justify-start text-xs sm:text-sm">
            <div class="w-1/3 px-4 py-1 text-left">Your GMC / NMC Number</div>
            <div
              class="w-1/3 p-1 text-center"
            >{{gmc_or_nmc_number ? gmc_or_nmc_number.number : 'No GMC or NMC Number registered'}}</div>
            <div class="w-1/3 p-1 text-center">
              <span
                class="text-xs sm:text-sm text-center text-white font-bold rounded-full px-4 py-1"
                :class="status(gmc_or_nmc_number ? gmc_or_nmc_number.status : 'No GMC or NMC Number registered')"
              >{{ gmc_or_nmc_number ? gmc_or_nmc_number.status : '' }}</span>
            </div>
          </div>
        </div>
        <div class="border-solid rounded-lg shadow-md px-1 py-4 mb-5 mx-1 md:mx-0">
          <div class="flex flex-row flex-no-wrap justify-start items-center text-xs sm:text-sm">
            <div class="w-1/3 px-4 py-1 text-left">Your MPL / NPL Number</div>
            <div
              class="w-1/3 p-1 text-center"
            >{{mpl_or_npl_number ? mpl_or_npl_number.number : 'No MPL or NPL Number registered'}}</div>
            <div class="w-1/3 p-1 text-center">
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
    <div class="mt-4 overflow-x-auto px-2 md:px-0">
      <table>
        <thead>
          <tr class="text-xs sm:text-sm text-left">
            <th>Type</th>
            <th>File</th>
            <th>Date uploaded</th>
            <th>Expiry date</th>
            <th>Status</th>
            <th>Note from hubzz HQ</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <!--------------------------FILE SHOULD SHOW ON CLICK----------------------------->
          <template>
            <tr v-if="!mandatory.length">
              <td
                class="text-center font-bold text-gray-500"
                colspan="7"
              >This section is empty. Update your profile to fill this area.</td>
            </tr>
          </template>
          <template v-for="(item, index) in mandatory">
            <tr
              class="rounded-lg shadow-md text-xs sm:text-sm text-left bg-gray-200"
              v-if="activeLoading.includes(item.id)"
              :key="item.id"
            >
              <td colspan="7" class="loader-message text-center text-gray-800">Uploading</td>
            </tr>
            <tr
              v-else
              :key="item.id"
              class="rounded-lg shadow-md text-xs sm:text-sm text-left"
              :class="item.info && item.info.file ? 'hover:bg-gray-300' : ''"
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
              <td v-if="item.info">{{item.info.expired_at | localDate}}</td>
              <td v-else></td>
              <td v-if="item.info">
                <div class="flex max-w-xs">
                  <div
                    class="text-xs sm:text-sm text-center text-white font-bold rounded-full px-4 py-1"
                    :class="status(item.info.status)"
                  >{{item.info.status}}</div>
                </div>
              </td>
              <td v-else></td>

              <td
                v-if="item && item.info && item.info.note"
              >{{ item && item.info && item.info.note ? item.info.note : 'N/A' | StringMaxLength(15)}}</td>
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
                  <label class="leading-loose mx-2 cursor-pointer">Upload</label>
                </div>
              </td>
              <td
                @click.stop="$refs[`${item.id}_file_mandatory_compliance`][0].click()"
                class="hover:underline"
                v-else
              >
                <div class="flex flex-row flex-no-wrap">
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
            <tr :key="`${item.id}-${index}`">
              <td></td>
            </tr>
          </template>
          <!-------------------------FILE SHOULD SHOW ON CLICK------------------------------>
        </tbody>
      </table>
    </div>

    <div class="mt-10">
      <div class="font-bold text-xs sm:text-base">Other documentation for reference to Practices</div>
    </div>

    <div class="mt-4 overflow-x-auto px-2 md:px-0">
      <table>
        <thead>
          <tr class="text-xs sm:text-sm text-left">
            <th>Type</th>
            <th>File</th>
            <th>Date uploaded</th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <template>
            <tr v-if="!optional.length">
              <td
                class="text-center font-bold text-gray-500"
                colspan="7"
              >This section is empty. Update your profile to fill this area.</td>
            </tr>
          </template>
          <template v-for="(item, index) in optional">
            <tr
              class="rounded-lg shadow-md text-xs sm:text-sm text-left bg-gray-200"
              v-if="activeLoading.includes(item.id)"
              :key="item.id"
            >
              <td colspan="7" class="loader-message text-center text-gray-800">Uploading</td>
            </tr>
            <tr
              v-else
              :key="item.id"
              class="rounded-lg shadow-md text-xs sm:text-sm text-left"
              :class="item.info && item.info.file ? 'hover:bg-gray-300' : ''"
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
              <td v-if="item.info && item.info.file">{{item.info.file.created_at | localDate}}</td>
              <td v-else></td>
              <td></td>
              <td></td>
              <td></td>
              <td
                @click.stop="$refs[`${item.id}_file_optional_compliance`][0].click()"
                class="hover:underline"
                v-if="!item.info"
              >
                <div class="flex flex-row flex-no-wrap">
                  <input
                    type="file"
                    :ref="`${item.id}_file_optional_compliance`"
                    class="inputfile hidden"
                    @input="onFileInput($event, item.id, index)"
                    @click.stop
                  />
                  <svgicon name="cloud-upload" height="24" width="24" />
                  <label class="leading-loose mx-2 cursor-pointer">Upload</label>
                </div>
              </td>
              <td
                @click.stop="$refs[`${item.id}_file_optional_compliance`][0].click()"
                class="hover:underline"
                v-else
              >
                <div class="flex flex-row flex-no-wrap">
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
            <tr :key="`${item.id}-${index}-optional`">
              <td></td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <div class="mt-10">
      <div class="font-bold text-xs sm:text-base">Mandatory Training</div>
    </div>

    <div class="mt-4 overflow-x-auto px-2 md:px-0">
      <table>
        <thead>
          <tr class="text-xs sm:text-sm text-left">
            <th>Type</th>
            <th>File</th>
            <th>Date uploaded</th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <template>
            <tr v-if="!mandatory_trainings.length">
              <td
                class="text-center font-bold text-gray-500"
                colspan="7"
              >This section is empty. Update your profile to fill this area.</td>
            </tr>
          </template>
          <template v-for="(item, index) in mandatory_trainings">
            <tr
              class="rounded-lg shadow-md text-xs sm:text-sm text-left bg-gray-200"
              v-if="activeLoading.includes(item.mandatory_training.id)"
              :key="item.id"
            >
              <td colspan="7" class="loader-message text-center text-gray-800">Uploading</td>
            </tr>
            <tr
              v-else
              :key="item.id"
              class="rounded-lg shadow-md text-xs sm:text-sm text-left"
              :class="item && item.file ? 'hover:bg-gray-300' : ''"
            >
              <td
                :class="item.info && item.info.file ? 'cursor-pointer' : ''"
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
              <td v-if="item && item.file">{{item.file.created_at | localDate}}</td>
              <td v-else></td>
              <td></td>
              <td></td>
              <td></td>
              <td
                @click.stop="$refs[`${item.id}_file_mandatory_training`][0].click()"
                class="hover:underline"
                v-if="!item.file"
              >
                <div class="flex flex-row flex-no-wrap">
                  <input
                    type="file"
                    :ref="`${item.id}_file_mandatory_training`"
                    class="inputfile hidden"
                    @input="onMandatoryFileInput($event, item.mandatory_training.id, index)"
                    @click.stop
                  />
                  <svgicon name="cloud-upload" height="24" width="24" />
                  <label class="leading-loose mx-2 cursor-pointer">Upload</label>
                </div>
              </td>
              <td
                @click.stop="$refs[`${item.id}_file_mandatory_training`][0].click()"
                class="hover:underline"
                v-else
              >
                <div class="flex flex-row flex-no-wrap">
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
            <tr :key="`${item.id}-${index}-mandatory-training`">
              <td></td>
            </tr>
          </template>
        </tbody>
      </table>
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
          // if (res.data.user.locum_detail.compliance_documents.length > 0) {
          //   res.data.user.locum_detail.compliance_documents.forEach(
          //     userComplianceDocument => {
          //       this.profession.mandatory_compliance_documents.forEach(
          //         mandatoryDocument => {
          //           if (
          //             userComplianceDocument.compliance_document.id ===
          //             mandatoryDocument.id
          //           ) {
          //             mandatoryDocument.info = userComplianceDocument;
          //           }
          //         }
          //       );
          //       this.profession.optional_compliance_documents.forEach(
          //         optionalDocument => {
          //           if (
          //             userComplianceDocument.compliance_document.id ===
          //             optionalDocument.id
          //           ) {
          //             optionalDocument.info = userComplianceDocument;
          //           }
          //         }
          //       );
          //     }
          //   );
          // }
          this.mandatory = this.profession.mandatory_compliance_documents.sort(
            (a, b) => a.id - b.id
          );
          this.optional = this.profession.optional_compliance_documents.sort(
            (a, b) => a.id - b.id
          );
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
.number-status {
  /* width: 920px; */
}
a {
  text-decoration: none;
  color: black;
}
table {
  /* width: 920px; */
}
/* table thead th {
  padding: 10px 0;
} */
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
