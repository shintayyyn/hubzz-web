<template>
  <section class="compliance-section">
    <div class="overflow-x-auto">
      <div class="mt-5 px-1">
        <div class="shadow-md rounded-lg bg-white px-1 py-2 md:py-4 mb-5 mx-1 md:mx-0">
          <div
            class="relative flex flex-row flex-wrap justify-between sm:items-center text-xs sm:text-sm"
          >
            <div
              class="w-full sm:w-auto px-2 md:p-1 font-bold md:font-normal text-left"
            >GMC / NMC Number</div>
            <div
              class="w-full sm:w-2/3 px-2 md:p-1"
            >{{ gmc_or_nmc_number ? gmc_or_nmc_number.number : 'No GMC or NMC Number registered' }}</div>
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
            class="relative flex flex-row flex-wrap justify-between sm:items-center text-xs sm:text-sm"
          >
            <div
              class="w-full sm:w-auto px-2 md:p-1 font-bold md:font-normal text-left"
            >MPL / NPL Number</div>
            <div
              class="w-full sm:w-2/3 px-2 md:p-1"
            >{{ mpl_or_npl_number ? mpl_or_npl_number.number : 'No MPL or NPL Number registered' }}</div>
            <div
              class="absolute right-0 m-2 md:relative flex items-center justify-end sm:m-0 md:text-center"
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
    <!-- <div class="mt-10">
      <div class="font-bold text-xs sm:text-base">
        Key Compliances you need to be approved by Hubzz HQ
        <span class="text-red-500">*</span>
      </div>
      <div
        class="text-sm font-hairline italic"
      >
        (Note: Only file types .pdf, .jpeg, .jfif, .doc, .docx, .tiff are acccepted)
      </div>
    </div>-->

    <!-- <div class="mt-4 overflow-x-auto">
      <table>
        <thead>
          <tr class="text-xs sm:text-sm text-left">
            <th class="pl-2">
              Type
            </th>
            <th class="pl-2">
              File
            </th>
            <th class="text-center">
              Date uploaded
            </th>
            <th class="text-center">
              Expiry date
            </th>
            <th class="text-center">
              Status
            </th>
            <th class="text-center">
              Note from hubzz HQ
            </th>
            <th />
          </tr>
        </thead>
        <tbody>
          <template v-for="(item, index) in keyCompliances">
            <tr
              v-if="activeLoading.includes(item.info && item.info.id ? item.info.id : item.id)"
              :key="item.id"
              class="text-xs sm:text-sm text-left bg-gray-200"
            >
              <td
                colspan="7"
                class="loader-message text-center text-gray-800 cursor-wait bg-gray-200"
              >
                Uploading
              </td>
            </tr>
            <tr
              v-else
              :key="item.id"
              class="text-xs sm:text-sm text-left"
              :class="!item.info ? 'text-gray-600' : 'hover'"
            >
              <td
                :class="item.info && item.info.file ? 'cursor-pointer' : ''"
                @click="show(item, 'compliance')"
              >
                {{ item.name }}
              </td>
              <td v-if="item.info && item.info.file" class="hover:underline">
                <div class="flex flex-row flex-no-wrap items-center">
                  <svgicon name="cloud-download" height="24" width="24" />
                  <div class="mx-2">
                    <a
                      :href="item.info.file.url"
                      :download="item.info.file.filename"
                      target="_blank"
                      class="whitespace-no-wrap"
                      @click.stop.prevent="downloadItem(item.info.file.url, item.info.file.filename)"
                    >{{ item.info.file.filename | StringMaxLength(15) }}</a>
                  </div>
                </div>
              </td>
              <td v-else />
              <td v-if="item.info && item.info.file">
                {{ item.info.file.created_at | localDate }}
              </td>
              <td v-else />
              <td v-if="item.info && item.info.expired_at">
                {{ item.info.expired_at | localDate }}
              </td>
              <td v-else />
              <td v-if="item.info && item.info.status">
                <div class="flex justify-center max-w-xs">
                  <div
                    class="text-xs sm:text-sm text-center text-white font-bold rounded-full px-4 py-1"
                    :class="status(item.info.status)"
                  >
                    {{ item.info.status }}
                  </div>
                </div>
              </td>
              <td v-else />
              <td
                v-if="item && item.info && item.info.note"
                class="text-center"
              >
                {{ item.info.note | StringMaxLength(15) }}
              </td>
              <td v-else />
              <td
                v-if="!item.info"
                class="hover:underline"
                @click.stop="$refs[`${item.id}_file_mandatory_compliance`][0].click()"
              >
                <div class="flex flex-row flex-no-wrap">
                  <input
                    :ref="`${item.id}_file_mandatory_compliance`"
                    type="file"
                    class="inputfile hidden"
                    @input="onFileInput($event, item.id)"
                    @click.stop
                  >
                  <svgicon name="cloud-upload" height="24" width="24" />
                  <label class="hidden md:block leading-loose mx-2 cursor-pointer text-black">Upload</label>
                </div>
              </td>
              <td
                v-else
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
                    @input="onFileUpdate($event, item.info.id, index, item.info.id)"
                    @click.stop
                  >
                  <svgicon name="cloud-upload" height="24" width="24" />
                  <label class="hidden md:block leading-loose mx-2 cursor-pointer">Update</label>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>-->
    <div class="mt-10">
      <div class="font-bold text-xs sm:text-base">
        Documents you need to be approved by Hubzz HQ
        <span class="text-red-500">*</span>
      </div>
      <div
        class="text-sm font-hairline italic"
      >(Note: Only file types .pdf, .jpeg, .jfif, .doc, .docx, .tiff are acccepted)</div>
    </div>

    <div class="mt-4 overflow-x-auto">
      <template v-if="!mandatory.length">
        <span
          class="text-center font-bold text-gray-500 text-xs md:text-sm"
          colspan="7"
        >This section is empty. Update your profile to fill this area.</span>
      </template>
      <table v-else>
        <thead>
          <tr class="text-xs sm:text-sm text-left">
            <th class="pl-2">Type</th>
            <th class="pl-2">File</th>
            <th class="text-center">Date uploaded</th>
            <th class="text-center">Expiry date</th>
            <th class="text-center">Status</th>
            <th class="text-center">Note from hubzz HQ</th>
            <th />
          </tr>
        </thead>
        <tbody>
          <template v-for="(item, index) in mandatory">
            <tr
              v-if="activeLoading.includes(item.info && item.info.id ? item.info.id : item.id)"
              :key="item.id"
              class="text-xs sm:text-sm text-left bg-gray-200"
            >
              <td
                colspan="7"
                class="loader-message text-center text-gray-800 cursor-wait bg-gray-200"
              >Uploading</td>
            </tr>
            <tr
              v-else
              :key="item.id"
              class="text-xs sm:text-sm text-left"
              :class="!item.info ? 'text-gray-600' : 'hover'"
            >
              <td
                :class="item.info && item.info.file ? 'cursor-pointer' : ''"
                @click="show(item, 'compliance')"
              >{{ item.name }}</td>
              <td v-if="item.info && item.info.file" class="hover:underline">
                <div class="flex flex-row flex-no-wrap items-center">
                  <svgicon name="cloud-download" height="24" width="24" />
                  <div class="mx-2">
                    <a
                      :href="item.info.file.url"
                      :download="item.info.file.filename"
                      target="_blank"
                      class="whitespace-no-wrap"
                      @click.stop.prevent="downloadItem(item.info.file.url, item.info.file.filename)"
                    >{{ item.info.file.filename | StringMaxLength(15) }}</a>
                  </div>
                </div>
              </td>
              <td v-else />
              <td v-if="item.info && item.info.file">{{ item.info.file.created_at | localDate }}</td>
              <td v-else />
              <td v-if="item.info && item.info.expired_at">{{ item.info.expired_at | localDate }}</td>
              <td v-else />
              <td v-if="item.info && item.info.status">
                <div class="flex justify-center max-w-xs">
                  <div
                    class="text-xs sm:text-sm text-center text-white font-bold rounded-full px-4 py-1"
                    :class="status(item.info.status)"
                  >{{ item.info.status }}</div>
                </div>
              </td>
              <td v-else />
              <td
                v-if="item && item.info && item.info.note"
                class="text-center"
              >{{ item.info.note | StringMaxLength(15) }}</td>
              <td v-else />
              <td
                v-if="!item.info"
                class="hover:underline"
                @click.stop="$refs[`${item.id}_file_mandatory_compliance`][0].click()"
              >
                <div class="flex flex-row flex-no-wrap">
                  <input
                    :ref="`${item.id}_file_mandatory_compliance`"
                    type="file"
                    class="inputfile hidden"
                    @input="onFileInput($event, item.id)"
                    @click.stop
                  />
                  <svgicon name="cloud-upload" height="24" width="24" />
                  <label class="hidden md:block leading-loose mx-2 cursor-pointer text-black">Upload</label>
                </div>
              </td>
              <td
                v-else
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
                    @input="onFileUpdate($event, item.info.id, index, item.info.id)"
                    @click.stop
                  />
                  <svgicon name="cloud-upload" height="24" width="24" />
                  <label class="hidden md:block leading-loose mx-2 cursor-pointer">Update</label>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <div class="mt-10">
      <div class="font-bold text-xs sm:text-base">Other documentation for reference to Practices</div>
    </div>

    <div class="mt-4 overflow-x-auto">
      <template v-if="!optional.length">
        <span
          class="text-center font-bold text-gray-500 text-xs md:text-sm"
          colspan="7"
        >This section is empty. Update your profile to fill this area.</span>
      </template>
      <table v-else>
        <thead>
          <tr class="text-xs sm:text-sm text-left">
            <th class="pl-2">Type</th>
            <th class="pl-2">File</th>
            <th class="text-center">Date uploaded</th>
            <th />
          </tr>
        </thead>
        <tbody>
          <template v-for="(item, index) in optional">
            <tr
              v-if="activeLoading.includes(item.id)"
              :key="item.id"
              class="text-xs sm:text-sm text-left bg-gray-200"
            >
              <td
                colspan="7"
                class="loader-message text-center text-gray-800 cursor-wait bg-gray-200"
              >Uploading</td>
            </tr>
            <tr
              v-else
              :key="item.id"
              class="text-xs sm:text-sm text-left"
              :class="!item.info ? 'text-gray-600' : 'hover'"
            >
              <td
                :class="item.info && item.info.file ? 'cursor-pointer' : ''"
                class="w-1/3"
                @click="show(item, 'compliance')"
              >{{ item.name }}</td>
              <td v-if="item.info && item.info.file" class="hover:underline">
                <div class="flex flex-row flex-no-wrap">
                  <svgicon name="cloud-download" height="24" width="24" />
                  <div class="leading-loose mx-2">
                    <a
                      target="_blank"
                      :href="item.info.file.url"
                      @click.stop.prevent="downloadItem(item.info.file.url, item.info.file.filename)"
                    >{{ item.info.file.filename | StringMaxLength(15) }}</a>
                  </div>
                </div>
              </td>
              <td v-else />
              <td
                v-if="item.info && item.info.file"
                class="text-center"
              >{{ item.info.file.created_at | localDate }}</td>
              <td v-else />
              <td
                v-if="!item.info"
                class="hover:underline"
                @click.stop="$refs[`${item.id}_file_optional_compliance`][0].click()"
              >
                <div
                  class="flex flex-row flex-no-wrap justify-center float-right lg:w-2/3 mx-auto p-2 cursor-pointer"
                >
                  <input
                    :ref="`${item.id}_file_optional_compliance`"
                    type="file"
                    class="inputfile hidden"
                    @input="onFileInput($event, item.id, index)"
                    @click.stop
                  />
                  <svgicon name="cloud-upload" height="24" width="24" />
                  <label class="hidden md:block leading-loose mx-2 cursor-pointer text-black">Upload</label>
                </div>
              </td>

              <td
                v-else
                class="hover:underline"
                @click.stop="$refs[`${item.id}_file_optional_compliance`][0].click()"
              >
                <div
                  class="flex flex-row flex-no-wrap justify-center float-right bg-yellow-500 mx-auto p-2 rounded cursor-pointer"
                >
                  <input
                    :ref="`${item.id}_file_optional_compliance`"
                    type="file"
                    class="inputfile hidden"
                    @input="onFileUpdate($event, item.info.id, index, item.id)"
                    @click.stop
                  />
                  <svgicon name="cloud-upload" height="24" width="24" />
                  <label class="hidden md:block leading-loose mx-2 cursor-pointer">Update</label>
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
          class="text-center font-bold text-gray-500 text-xs md:text-sm"
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
              <th />
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, index) in mandatory_trainings">
              <tr
                v-if="activeLoading.includes(item.mandatory_training.id)"
                :key="item.id"
                class="text-xs sm:text-sm text-left bg-gray-200"
              >
                <td colspan="7" class="loader-message text-center text-gray-800">Uploading</td>
              </tr>
              <tr
                v-else
                :key="item.id"
                class="text-xs sm:text-sm text-left"
                :class="!item.info ? 'text-gray-600' : 'hover:bg-white'"
              >
                <td
                  :class="item && item.file ? 'cursor-pointer' : ''"
                  class="w-1/3"
                  @click="show(item, 'mandatory')"
                >{{ item.mandatory_training.name }}</td>
                <td v-if="item.file" class="hover:underline">
                  <div class="flex flex-row flex-no-wrap">
                    <svgicon name="cloud-download" height="24" width="24" />
                    <div class="leading-loose mx-2">
                      <a
                        target="_blank"
                        :href="item.file.url"
                        class="whitespace-no-wrap"
                        @click.stop.prevent="downloadItem(item.file.url, item.file.filename)"
                      >{{ item.file.filename | StringMaxLength(15) }}</a>
                    </div>
                  </div>
                </td>
                <td v-else />
                <td
                  v-if="item && item.file"
                  class="text-center"
                >{{ item.file.created_at | localDate }}</td>
                <td v-else />
                <td
                  v-if="!item.file"
                  class="hover:underline"
                  @click.stop="$refs[`${item.id}_file_mandatory_training`][0].click()"
                >
                  <div
                    class="flex flex-row flex-no-wrap justify-center float-right lg:w-2/3 mx-auto p-2 cursor-pointer"
                  >
                    <input
                      :ref="`${item.id}_file_mandatory_training`"
                      type="file"
                      class="inputfile hidden"
                      @input="onMandatoryFileInput($event, item.mandatory_training.id, index)"
                      @click.stop
                    />
                    <svgicon name="cloud-upload" height="24" width="24" />
                    <label
                      class="hidden md:block leading-loose mx-2 cursor-pointer text-black"
                    >Upload</label>
                  </div>
                </td>
                <td
                  v-else
                  class="hover:underline"
                  @click.stop="$refs[`${item.id}_file_mandatory_training`][0].click()"
                >
                  <div
                    class="flex flex-row flex-no-wrap justify-center float-right bg-yellow-500 mx-auto p-2 rounded cursor-pointer"
                  >
                    <input
                      :ref="`${item.id}_file_mandatory_training`"
                      type="file"
                      class="inputfile hidden"
                      @input="onMandatoryFileUpdate($event, item.id, index, item.mandatory_training.id)"
                      @click.stop
                    />
                    <svgicon name="cloud-upload" height="24" width="24" />
                    <label
                      class="hidden md:block text-black leading-loose mx-2 cursor-pointer"
                    >Update</label>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </template>
    </div>
    <div
      v-if="['compliance-id','compliance-mandatory-training-id'].includes($route.name)"
      class="shield"
      @click="$router.push('/compliance')"
    />
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
      let keyCompliances = [];
      const responseUser = await app.$axios.$get(`/api/v1/me`);
      const user =
        responseUser.data && responseUser.data.user
          ? responseUser.data.user
          : null;
      const gmc_or_nmc_number = user.locum_detail.gmc_or_nmc_number;
      const mpl_or_npl_number = user.locum_detail.mpl_or_npl_number;

      const responseProfession = await app.$axios.$get(
        `/api/v1/profession-categories`
      );
      const profession = responseProfession.data.profession_categories.find(
        professionCategory =>
          professionCategory.id ===
          user.locum_detail.profession.profession_category.id
      );

      const responseComplianceDocuments = await app.$axios.$get(
        `/api/v1/locum/locum-detail-compliance-documents`
      );
      if (
        responseComplianceDocuments.data &&
        responseComplianceDocuments.data.locum_detail_compliance_documents &&
        responseComplianceDocuments.data.locum_detail_compliance_documents
          .length > 0
      ) {
        responseComplianceDocuments.data.locum_detail_compliance_documents.forEach(
          userComplianceDocument => {
            profession.mandatory_compliance_documents.forEach(
              mandatoryDocument => {
                if (
                  userComplianceDocument.compliance_document.id ===
                  mandatoryDocument.id
                ) {
                  mandatoryDocument.info = userComplianceDocument;
                }
              }
            );
            profession.optional_compliance_documents.forEach(
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
      const mandatory = profession.mandatory_compliance_documents.sort(
        (a, b) => a.id - b.id
      );
      const optional = profession.optional_compliance_documents.sort(
        (a, b) => a.id - b.id
      );

      keyCompliances = [...mandatory, ...optional];

      const responseMandatoryTrainings = await app.$axios.$get(
        `/api/v1/locum/locum-detail-mandatory-trainings`
      );
      const mandatory_trainings = responseMandatoryTrainings.data.locum_detail_mandatory_trainings.sort(
        (a, b) => a.id - b.id
      );

      return {
        keyCompliances,
        user,
        gmc_or_nmc_number,
        mpl_or_npl_number,
        profession,
        mandatory,
        optional,
        mandatory_trainings
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
    async getNumberPendingRealTime(file) {
      if (!file) {
        return;
      }
      if (file && file.type === "GMC/NMC") {
        this.gmc_or_nmc_number.status = "Pending";
      } else if (file && file.type === "MPL/NPL") {
        this.mpl_or_npl_number = "Pending";
      }
    },
    async getNumberRejectedRealTime(file) {
      if (!file) {
        return;
      }
      if (file && file.type === "GMC/NMC") {
        this.gmc_or_nmc_number.status = "Rejected";
      } else if (file && file.type === "MPL/NPL") {
        this.mpl_or_npl_number = "Rejected";
      }
    },
    async getNumberVerifiedRealTime(file) {
      if (!file) {
        return;
      }
      if (file && file.type === "GMC/NMC") {
        this.gmc_or_nmc_number.status = "Verified";
      } else if (file && file.type === "MPL/NPL") {
        this.mpl_or_npl_number.status = "Verified";
      }
    },
    async getComplianceRealTime(file) {
      if (!file) {
        return;
      }
      let index = this.mandatory.findIndex(
        item =>
          item.info.compliance_document.name ===
            file.compliance_document.name ||
          item.name === file.compliance_document.name
      );
      let updatedFile = this.mandatory.find(
        item =>
          item.info.compliance_document.name ===
            file.compliance_document.name ||
          item.name === file.compliance_document.name
      );
      if (index >= 0) {
        this.mandatory.splice(index, 1, { ...updatedFile, info: file });
      }
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
    onFileInput(e, id) {
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
          let key_compliances_index = this.keyCompliances.findIndex(
            document =>
              document.id ===
              res.data.locum_detail_compliance_document.compliance_document.id
          );

          if (key_compliances_index >= 0) {
            this.keyCompliances.splice(key_compliances_index, 1);
            this.keyCompliances.push({
              id:
                res.data.locum_detail_compliance_document.compliance_document
                  .id,
              name:
                res.data.locum_detail_compliance_document.compliance_document
                  .name,
              info: res.data.locum_detail_compliance_document
            });
            this.keyCompliances = this.keyCompliances.sort(
              (a, b) => a.id - b.id
            );
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: ["Document uploaded!"]
            });
            this.loading = false;
          }
          this.activeLoading = this.activeLoading.filter(item => item !== id);

          // let mandatory_index = this.mandatory.findIndex(
          //   document =>
          //     document.id ===
          //     res.data.locum_detail_compliance_document.compliance_document.id
          // );
          // if (mandatory_index >= 0) {
          //   this.mandatory.splice(mandatory_index, 1);
          //   this.mandatory.push({
          //     id:
          //       res.data.locum_detail_compliance_document.compliance_document
          //         .id,
          //     name:
          //       res.data.locum_detail_compliance_document.compliance_document
          //         .name,
          //     info: res.data.locum_detail_compliance_document
          //   });
          //   this.mandatory = this.mandatory.sort((a, b) => a.id - b.id);
          //   this.$store.commit("SET_NOTIFICATION", {
          //     enabled: true,
          //     status: "success",
          //     text: ["Document uploaded!"]
          //   });
          //   this.loading = false;
          // } else {
          //   let optional_index = this.optional.findIndex(
          //     document =>
          //       document.id ===
          //       res.data.locum_detail_compliance_document.compliance_document.id
          //   );
          //   this.optional.splice(optional_index, 1);
          //   this.optional.push({
          //     id:
          //       res.data.locum_detail_compliance_document.compliance_document
          //         .id,
          //     name:
          //       res.data.locum_detail_compliance_document.compliance_document
          //         .name,
          //     info: res.data.locum_detail_compliance_document
          //   });
          //   this.optional = this.optional.sort((a, b) => a.id - b.id);
          //   this.$store.commit("SET_NOTIFICATION", {
          //     enabled: true,
          //     status: "success",
          //     text: ["Document uploaded!"]
          //   });
          //   this.loading = false;
          // }
          // this.activeLoading = this.activeLoading.filter(item => item !== id);
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
        });
    },
    onFileUpdate(e, id, index, loadingId) {
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
      // post request to API / send file
      this.$axios
        .$put(`/api/v1/locum/locum-detail-compliance-documents/${id}`, formData)
        .then(res => {
          let key_compliances_index = this.keyCompliances.findIndex(
            document =>
              document.id ===
              res.data.locum_detail_compliance_document.compliance_document.id
          );
          if (key_compliances_index > 0) {
            this.keyCompliances.splice(index, 1);
            this.keyCompliances.push({
              id:
                res.data.locum_detail_compliance_document.compliance_document
                  .id,
              name:
                res.data.locum_detail_compliance_document.compliance_document
                  .name,
              info: res.data.locum_detail_compliance_document
            });
            this.keyCompliances = this.keyCompliances.sort(
              (a, b) => a.id - b.id
            );
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

          // let inMandatory = this.mandatory.findIndex(
          //   document =>
          //     document.id ===
          //     res.data.locum_detail_compliance_document.compliance_document.id
          // );
          // if (inMandatory > 0) {
          //   this.mandatory.splice(index, 1);
          //   this.mandatory.push({
          //     id:
          //       res.data.locum_detail_compliance_document.compliance_document
          //         .id,
          //     name:
          //       res.data.locum_detail_compliance_document.compliance_document
          //         .name,
          //     info: res.data.locum_detail_compliance_document
          //   });
          //   this.mandatory = this.mandatory.sort((a, b) => a.id - b.id);
          //   this.$store.commit("SET_NOTIFICATION", {
          //     enabled: true,
          //     status: "success",
          //     text: ["Document uploaded!"]
          //   });
          //   this.loading = false;
          // } else {
          //   this.optional.splice(index, 1);
          //   this.optional.push({
          //     id:
          //       res.data.locum_detail_compliance_document.compliance_document
          //         .id,
          //     name:
          //       res.data.locum_detail_compliance_document.compliance_document
          //         .name,
          //     info: res.data.locum_detail_compliance_document
          //   });
          //   this.optional = this.optional.sort((a, b) => a.id - b.id);
          //   this.$store.commit("SET_NOTIFICATION", {
          //     enabled: true,
          //     status: "success",
          //     text: ["Document uploaded!"]
          //   });
          //   this.loading = false;
          // }
          // this.activeLoading = this.activeLoading.filter(
          //   item => item !== loadingId
          // );
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
