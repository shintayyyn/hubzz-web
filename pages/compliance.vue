<template>
  <section class="compliance-section">
    <div class="overflow-x-auto">
      <div class="number-status md:mt-10">
        <div class="border-solid rounded-lg shadow-md px-1 py-4 mb-5 mx-1 md:mx-0">
          <div class="flex flex-row flex-nowrap justify-start text-xs sm:text-sm">
            <div class="w-1/3 p-1 text-left">Your GMC / NMC Number</div>
            <div class="w-1/3 p-1 text-left">{{gmc_or_nmc_number.number}}</div>
            <div class="max-w-xs p-1">
              <div
                class="text-xs sm:text-sm text-center bg-orange text-white font-bold rounded-full px-2 py-1"
                :class="status(gmc_or_nmc_number.status)"
              >{{gmc_or_nmc_number.status}}</div>
            </div>
          </div>
        </div>
        <div class="border-solid rounded-lg shadow-md px-1 py-4 mb-5 mx-1 md:mx-0">
          <div class="flex flex-row flex-nowrap justify-start items-center text-xs sm:text-sm">
            <div class="w-1/3 p-1 text-left">Your MPL / NPL Number</div>
            <div class="w-1/3 p-1 text-left">{{mpl_or_npl_number.number}}</div>
            <div class="max-w-xs p-1">
              <div
                class="text-xs sm:text-sm text-center bg-orange text-white font-bold rounded-full px-2 py-1"
                :class="status(mpl_or_npl_number.status)"
              >{{mpl_or_npl_number.status}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showErrorModal" class="absolute pin-t">
      <div
        class="fixed text-white bg-red-light py-4 px-12 mr-10 md:mr-0 md:w-1/3 shadow"
        style="border-radius: 0 0 10px 10px"
      >
        <span class="text-base font-bold">Failed to upload file</span>
        <div class="flex flex-wrap md:flex-no-wrap">
          <div class="w-full md:w-2/3 text-sm mt-2">
            <span>File format should be any of the following:</span>
            <ul>
              <li>.pdf</li>
              <li>.jpeg</li>
              <li>.msword</li>
              <li>.tif</li>
            </ul>
          </div>
          <button
            class="mx-auto md:mx-10 md:absolute pin-r pin-b w-32 my-2 md:my-10 p-4 text-sm rounded-lg shadow border border-white text-white hover:bg-white hover:text-black"
            @click="showErrorModal = false"
          >Okay</button>
        </div>
      </div>
    </div>
    <div class="mt-10">
      <div class="font-bold text-xs sm:text-base">Documents you need to be approved by hubzz HQ</div>
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
          <template v-for="(item, index) in mandatory">
            <tr
              :key="item.id"
              class="rounded-lg shadow-md hover:bg-grey-light cursor-pointer text-xs sm:text-sm text-left"
            >
              <td>{{item.name}}</td>
              <td class="hover:underline" v-if="item.info && item.info.file">
                <div class="flex flex-row flex-nowrap items-center">
                  <svgicon name="cloud-download" height="24" width="24" />
                  <div class="mx-2">
                    <a
                      @click.prevent="downloadItem(item.info.file.url, item.info.file.filename)"
                      :href="item.info.file.url"
                      :download="item.info.file.filename"
                      target="_blank"
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
                    class="text-xs sm:text-sm text-center text-white font-bold rounded-full px-2 py-1"
                    :class="status(item.info.status)"
                  >{{item.info.status}}</div>
                </div>
              </td>
              <td v-else></td>

              <td v-if="item.info">{{item.info.note | StringMaxLength}}</td>
              <td v-else></td>
              <td class="hover:underline" v-if="!item.info">
                <div class="flex flex-row flex-nowrap">
                  <input
                    type="file"
                    :name="`${item.id}_file`"
                    :id="`${item.id}_file`"
                    class="inputfile hidden"
                    @input="onFileInput($event, item.id)"
                  />
                  <svgicon name="cloud-upload" height="24" width="24" />
                  <label :for="`${item.id}_file`" class="leading-loose mx-2 cursor-pointer">Upload</label>
                </div>
              </td>
              <td class="hover:underline" v-else>
                <div class="flex flex-row flex-nowrap">
                  <input
                    type="file"
                    :name="`${item.id}_file`"
                    :id="`${item.id}_file`"
                    class="inputfile hidden"
                    @input="onFileUpdate($event, item.info.id, index)"
                  />
                  <svgicon name="cloud-upload" height="24" width="24" />
                  <label :for="`${item.id}_file`" class="leading-loose mx-2 cursor-pointer">Update</label>
                </div>
              </td>
            </tr>
            <tr :key="`${item.id}-${index}`">
              <td></td>
            </tr>
          </template>
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
          <template v-for="(item, index) in optional">
            <tr
              :key="item.id"
              class="rounded-lg shadow-md hover:bg-grey-light cursor-pointer text-xs sm:text-sm text-left"
            >
              <td>{{item.name}}</td>
              <td class="hover:underline" v-if="item.info && item.info.file">
                <div class="flex flex-row flex-nowrap">
                  <svgicon name="cloud-download" height="24" width="24" />
                  <div class="leading-loose mx-2">
                    <a
                      @click.prevent="downloadItem(item.info.file.url, item.info.file.filename)"
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
              <td class="hover:underline" v-if="!item.info">
                <div class="flex flex-row flex-nowrap">
                  <input
                    type="file"
                    :name="`${item.id}_file`"
                    :id="`${item.id}_file`"
                    class="inputfile hidden"
                    @input="onFileInput($event, item.id, index)"
                  />
                  <svgicon name="cloud-upload" height="24" width="24" />
                  <label :for="`${item.id}_file`" class="leading-loose mx-2 cursor-pointer">Upload</label>
                </div>
              </td>
              <td class="hover:underline" v-else>
                <div class="flex flex-row flex-nowrap">
                  <input
                    type="file"
                    :name="`${item.id}_file`"
                    :id="`${item.id}_file`"
                    class="inputfile hidden"
                    @input="onFileUpdate($event, item.info.id, index)"
                  />
                  <svgicon name="cloud-upload" height="24" width="24" />
                  <label :for="`${item.id}_file`" class="leading-loose mx-2 cursor-pointer">Update</label>
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
          <template v-for="(item, index) in mandatory_trainings">
            <tr
              :key="item.id"
              class="rounded-lg shadow-md hover:bg-grey-light cursor-pointer text-xs sm:text-sm text-left"
            >
              <td>{{item.name}}</td>
              <td class="hover:underline" v-if="item.info && item.info.file">
                <div class="flex flex-row flex-nowrap">
                  <svgicon name="cloud-download" height="24" width="24" />
                  <div class="leading-loose mx-2">
                    <a
                      @click.prevent="downloadItem(item.info.file.url, item.info.file.filename)"
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
              <td class="hover:underline" v-if="!item.info">
                <div class="flex flex-row flex-nowrap">
                  <input
                    type="file"
                    :name="`${item.id}_mandatory_file`"
                    :id="`${item.id}_mandatory_file`"
                    class="inputfile hidden"
                    @input="onMandatoryFileInput($event, item.id, index)"
                  />
                  <svgicon name="cloud-upload" height="24" width="24" />
                  <label
                    :for="`${item.id}_mandatory_file`"
                    class="leading-loose mx-2 cursor-pointer"
                  >Upload</label>
                </div>
              </td>
              <td class="hover:underline" v-else>
                <div class="flex flex-row flex-nowrap">
                  <input
                    type="file"
                    :name="`${item.id}_mandatory_file`"
                    :id="`${item.id}_mandatory_file`"
                    class="inputfile hidden"
                    @input="onMandatoryFileUpdate($event, item.info.id, index)"
                  />
                  <svgicon name="cloud-upload" height="24" width="24" />
                  <label
                    :for="`${item.id}_mandatory_file`"
                    class="leading-loose mx-2 cursor-pointer"
                  >Update</label>
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
  </section>
</template>
<script>
export default {
  data() {
    return {
      gmc_or_nmc_number: {},
      mpl_or_npl_number: {},
      profession: {},
      mandatory: [],
      optional: [],
      mandatory_trainings: [],
      showErrorModal: false
    };
  },
  created() {
    // get gmc, mpl status
    this.gmc_or_nmc_number = this.$auth.user.locum_detail.gmc_or_nmc_number;
    this.mpl_or_npl_number = this.$auth.user.locum_detail.mpl_or_npl_number;
    // get all compliance documents list based on profession category
    this.$axios.$get(`/api/v1/profession-categories`).then(res => {
      this.profession = res.data.profession_categories.find(
        profession =>
          profession.id ===
          this.$auth.user.locum_detail.profession.profession_category.id
      );
      this.setComplianceDocuments();
    });
    // get all mandatory training list
    this.$axios.$get(`/api/v1/mandatory-trainings`).then(res => {
      this.mandatory_trainings = res.data.mandatory_trainings;
      this.setMandatoryTrainings();
    });
  },
  methods: {
    // set mandatory training
    setMandatoryTrainings() {
      if (this.$auth.user.locum_detail.mandatory_trainings.length > 0) {
        this.$auth.user.locum_detail.mandatory_trainings.forEach(
          userMandatoryTraining => {
            this.mandatory_trainings.forEach(mandatoryTraining => {
              if (
                userMandatoryTraining.mandatory_training.id ===
                mandatoryTraining.id
              ) {
                mandatoryTraining.info = userMandatoryTraining;
              }
            });
          }
        );
      }
      this.mandatory_trainings = this.mandatory_trainings.sort(
        (a, b) => a.id - b.id
      );

    },
    // set mandatory and optional
    setComplianceDocuments() {
      if (this.$auth.user.locum_detail.compliance_documents.length > 0) {
        this.$auth.user.locum_detail.compliance_documents.forEach(
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
    },
    status(status) {
      switch (status) {
        case "Pending":
          return "bg-orange";
          break;
        case "Verified":
          return "bg-green";
          break;
        case "Approved":
          return "bg-green";
          break;
        case "Rejected":
          return "bg-red";
          break;
        case "Expiring":
          return "bg-orange";
          break;
        case "Expired":
          return "bg-red";
          break;
        default:
          return;
      }
    },
    onFileInput(e, id, index) {
      if (!e.target.files.length) {
        return;
      }
      let types = ["pdf", "jpeg", "msword", "tif"];
      let file = e.target.files[0];
      let fileType = file.type.split("/")[1];
      if (!types.includes(fileType)) {
        this.showErrorModal = true;
        return;
      }
      const formData = new FormData();
      formData.append("file", file);
      formData.append("compliance_document_id", id);
      formData.append("locum_detail_id", this.$auth.user.id);
      // post request to API / send file
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
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    onFileUpdate(e, id, index) {
      if (!e.target.files.length) {
        return;
      }
      let types = ["pdf", "jpeg", "msword", "tif"];
      let file = e.target.files[0];
      let fileType = file.type.split("/")[1];
      if (!types.includes(fileType)) {
        this.showErrorModal = true;
        return;
      }
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
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    onMandatoryFileInput(e, id, index) {
      if (!e.target.files.length) {
        return;
      }
      let types = ["pdf", "jpeg", "msword", "tif"];
      let file = e.target.files[0];
      let fileType = file.type.split("/")[1];
      if (!types.includes(fileType)) {
        this.showErrorModal = true;
        return;
      }
      const formData = new FormData();
      formData.append("file", file);
      formData.append("mandatory_training_id", id);
      // post request to API / send file
      this.$axios
        .$post(`/api/v1/locum/locum-detail-mandatory-trainings`, formData)
        .then(res => {
          this.mandatory_trainings.splice(index, 1);
          this.mandatory_trainings.push({
            id: res.data.locum_detail_mandatory_training.mandatory_training.id,
            name:
              res.data.locum_detail_mandatory_training.mandatory_training.name,
            info: res.data.locum_detail_mandatory_training
          });
          this.mandatory_trainings = this.mandatory_trainings.sort(
            (a, b) => a.id - b.id
          );
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: ["Document uploaded!"]
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    onMandatoryFileUpdate(e, id, index) {
      if (!e.target.files.length) {
        return;
      }
      let types = ["pdf", "jpeg", "msword", "tif"];
      let file = e.target.files[0];
      let fileType = file.type.split("/")[1];
      if (!types.includes(fileType)) {
        this.showErrorModal = true;
        return;
      }
      const formData = new FormData();
      formData.append("file", file);
      // post request to API / send file
      this.$axios
        .$put(`/api/v1/locum/locum-detail-mandatory-trainings/${id}`, formData)
        .then(res => {
          this.mandatory_trainings.splice(index, 1);
          this.mandatory_trainings.push({
            id: res.data.locum_detail_mandatory_training.mandatory_training.id,
            name:
              res.data.locum_detail_mandatory_training.mandatory_training.name,
            info: res.data.locum_detail_mandatory_training
          });
          this.mandatory_trainings = this.mandatory_trainings.sort(
            (a, b) => a.id - b.id
          );
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: ["Document uploaded!"]
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    downloadItem(fileUrl, fileName) {
      const axios = require('axios');
      axios({
        url: fileUrl,
        method: 'GET',
        responseType: 'blob', // important
      }).then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
      });
    }
  }
};
</script>
<style scoped>
.number-status {
  width: 920px;
}
a {
  text-decoration: none;
  color: black;
}
table {
  width: 920px;
}
table thead th {
  padding: 10px 0;
}
table tbody td {
  padding: 15px 8px;
}
</style>
