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
        <div class="font-bold text-xs sm:text-base">Documents you need to be approved by Hubzz HQ</div>
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
        <div class="table" >
          <div class="flex flex-no-wrap justify-start font-bold leading-none text-sm">
            <div class="w-1/6 p-2">Type</div>
            <div class="w-1/6 p-2">File</div>
            <div class="w-1/6 p-2">Date uploaded</div>
            <div class="w-1/6 p-2">Expiry date</div>
            <div class="w-1/6 p-2">Status</div>
            <div class="w-1/6 p-2">Note</div>
            <div class="w-1/6 p-2" />
          </div>
          <div v-for="item in mandatoryComplianceDocuments" :key="item.compliance_document_id">
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
              class="flex flex-no-wrap justify-start shadow-md rounded-lg items-center p-3 my-3 bg-white "
              :class="!item.file ? 'text-gray-600' : 'hover cursor-pointer'"
              @click="show(item, 'compliance')"
            >
              <div class="flex flex-col" :class="item.compliance_document_type_name !== 'Safeguarding' ? 'w-1/6' : 'mr-8'">
                <template v-if="item.compliance_document_type_name !== 'Safeguarding'">
                  {{ item.compliance_document_name | StringMaxLength(55) }}
                <span>{{item.compliance_document_type_name === 'Passport' && item.country_name ? `${item.country_name} VISA? ${hasVisa ? 'Yes' : 'No'}` : ''}}</span>
                </template>
                <template v-else>
                  {{ item.compliance_document_name }}
                </template>
              </div>
              <template v-if="item.compliance_document_type_name !== 'Safeguarding'">
                <div class="item w-1/6" v-if="(item.file || item.reference)">
                  <div class="flex flex-row flex-no-wrap items-center" v-if="item.file">
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
                  <div
                    class="flex flex-row flex-no-wrap items-center"
                    v-if="item.reference && item.reference !== 'null'"
                  >{{ item.reference }}</div>
                </div>
                <div class="item w-1/6 py-2" v-else />
                <div
                  class="item w-1/6"
                  v-if="item.file && item.file.created_at && item.compliance_document_type_name !== 'Safeguarding'"
                >{{ item.file.created_at | localDate }}</div>
                <div class="item w-1/6 py-2" v-else />
                <div class="item w-1/6" v-if="item && item.expired_at">{{ item.expired_at | localDate }}</div>
                <div class="item w-1/6 py-2" v-else />
              </template>
              <div class="item w-1/6" v-if="item && item.status ">
                <div class="flex justify-start max-w-xs">
                  <div
                    class="text-xs sm:text-sm text-center text-white font-bold rounded-full px-4 py-1"
                    :class="status(item.status)"
                  >{{ item.status }}</div>
                </div>
              </div>
              <div class="item w-1/6" v-else />
              <template v-if="item.compliance_document_type_name !== 'Safeguarding'">
                <div class="item w-1/6" v-if="(item && item.note)">{{ item.note | StringMaxLength(15) }}</div>
                <div class="item w-1/6" v-else />
                <div
                  v-if="item.compliance_document_type_name !== 'Safeguarding'"
                  class="item w-1/6 flex flex-row flex-no-wrap justify-center items-center bg-yellow-500 px-4 py-2 rounded cursor-pointer"
                  style="position:sticky;right:0"
                  @click.stop.prevent="uploadCompliance(item.id, item.compliance_document_id, item.compliance_document_type_name, item.file, item.has_reference, item.reference, item.country_id, 'mandatory')"
                >Upload</div>
                <div class="w-1/6" v-else></div>
              </template>
            </div>
            <!-- SAFEGUARDING CHILDREN -->
            <div v-if="item.compliance_document_type_name === 'Safeguarding'">
              <div
                v-for="childItem in item.child_locum_compliance_documents"
                :key="childItem.compliance_document_id"
                class="flex flex-col"
              >
                <div
                  v-if="activeLoading.includes(childItem.compliance_document_id)"
                  class="flex flex-no-wrap justify-between shadow-lg rounded-lg items-center p-3 my-3 ml-8 bg-gray-200"
                >
                  <span
                    class="w-full loader-message text-center text-gray-800 cursor-wait bg-gray-200"
                  >Uploading</span>
                </div>
                <div
                  v-else
                  class="flex flex-no-wrap justify-start shadow-md rounded-lg items-center p-3 my-3 ml-8 bg-white"
                  :class="!childItem.file ? 'text-gray-600' : 'hover cursor-pointer'"
                  @click="show(childItem, 'compliance')"
                >
                  <div class="item w-1/6 pr-2">{{ childItem.compliance_document_name | StringMaxLength(55) }}</div>
                  <div class="item w-1/6" v-if="(childItem.file || childItem.reference)">
                    <div class="flex flex-row flex-no-wrap items-center" v-if="childItem.file">
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
                    <div
                      class="flex flex-row flex-no-wrap items-center"
                      v-if="childItem.reference && childItem.reference !== 'null'"
                    >{{ childItem.reference }}</div>
                  </div>
                  <div class="item w-1/6" v-else />
                  <div
                    class="item w-1/6"
                    v-if="childItem.file && childItem.file.created_at"
                  >{{ childItem.file.created_at | localDate }}</div>
                  <div class="item w-1/6" v-else />
                  <div
                    class="item w-1/6"
                    v-if="childItem && childItem.expired_at"
                  >{{ childItem.expired_at | localDate }}</div>
                  <div class="item w-1/6" v-else />
                  <div class="item w-1/6" v-if="childItem && childItem.status">
                    <div class="flex justify-start max-w-xs">
                      <div
                        class="text-xs sm:text-sm text-center font-bold rounded-full px-4 py-1"
                        :class="status(childItem.status)"
                      >{{ childItem.status }}</div>
                    </div>
                  </div>
                  <div class="item w-1/6" v-else />
                  <div
                    class="item w-1/6"
                    v-if="childItem && childItem.note"
                  >{{ childItem.note | StringMaxLength(15) }}</div>
                  <div class="item w-1/6" v-else />
                  <div
                    class="item w-1/6 flex flex-row flex-no-wrap justify-center items-center bg-yellow-500 px-4 py-2 rounded cursor-pointer"
                    style="position:sticky;right:0"
                    @click.stop.prevent="uploadCompliance(childItem.id, childItem.compliance_document_id, childItem.compliance_document_type_name, childItem.file, childItem.has_reference, childItem.reference, childItem.country_id, 'mandatory-child')"
                  >Upload</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- OPTIONAL -->
      <div class="mt-10">
        <div class="font-bold text-xs sm:text-base">Other documentation for reference to Practices</div>
        <div
          class="text-sm font-hairline italic"
        >(Note: Only file types .pdf, .jpeg, .jfif, .doc, .docx, .tiff are acccepted)</div>
      </div>
      <div class="mt-4 overflow-x-auto">
        <template v-if="!optionalComplianceDocuments.length">
          <span
            class="text-center font-bold text-gray-500 text-xs md:text-sm"
            colspan="7"
          >This section is empty. Update your profile to fill this area.</span>
        </template>
        <div class="table" >
          <div class="flex flex-no-wrap justify-between font-bold leading-none text-sm">
            <div class="w-1/3 p-2">Type</div>
            <div class="w-1/3 p-2">File</div>
            <div class="w-1/6 p-2" />
          </div>
          <div v-for="item in optionalComplianceDocuments" :key="item.compliance_document_id">
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
              class="flex flex-no-wrap justify-between shadow-md rounded-lg items-center p-3 my-3 bg-white "
              :class="!item.file ? 'text-gray-600' : 'hover cursor-pointer'"
              @click="show(item, 'compliance')"
            >
              <div :class="item.compliance_document_type_name !== 'Safeguarding' ? 'item w-1/3' : ''">
              <template v-if="item.compliance_document_type_name === 'Safeguarding'">
                {{ item.compliance_document_name }}
              </template>
              <template v-else>
                {{ item.compliance_document_name | StringMaxLength(55) }}
              </template>
              </div>
              <div class="item w-1/3" v-if="(item.file || item.reference)">
                <div class="flex flex-row flex-no-wrap items-center" v-if="item.file">
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
                <div
                  class="flex flex-row flex-no-wrap items-center"
                  v-if="item.reference && item.reference !== 'null'"
                >{{ item.reference }}</div>
              </div>
              <div class="item w-1/3" v-else />
              <div
                v-if="item.compliance_document_type_name !== 'Safeguarding'"
                class="w-1/6 flex flex-row flex-no-wrap justify-center items-center bg-yellow-500 px-4 py-2 rounded cursor-pointer"
                style="position:sticky;right:0"
                @click.stop.prevent="uploadCompliance(item.id, item.compliance_document_id, item.compliance_document_type_name, item.file, item.has_reference, item.reference, item.country_id, 'optional')"
              >Upload</div>
              <div class="w-1/6" v-else></div>
            </div>
            <!-- SAFEGUARDING CHILDREN -->
            <div v-if="item.compliance_document_type_name === 'Safeguarding'">
              <div
                v-for="childItem in item.child_locum_compliance_documents"
                :key="childItem.compliance_document_id"
                class="flex flex-col"
              >
                <div
                  v-if="activeLoading.includes(childItem.compliance_document_id)"
                  class="flex flex-no-wrap justify-between shadow-md rounded-lg items-center p-3 my-3 ml-8 bg-gray-200"
                >
                  <span
                    class="w-full loader-message text-center text-gray-800 cursor-wait bg-gray-200"
                  >Uploading</span>
                </div>
                <div
                  v-else
                  class="flex flex-no-wrap justify-between shadow-md rounded-lg items-center p-3 my-3 ml-8 bg-white"
                  :class="!childItem.file ? 'text-gray-600' : 'hover'"
                  @click="show(childItem, 'compliance')"
                >
                  <div class="item w-1/3">{{ childItem.compliance_document_name | StringMaxLength(55) }}</div>
                  <div class="item w-1/3" v-if="(childItem.file || childItem.reference)">
                    <div class="flex flex-row flex-no-wrap items-center" v-if="childItem.file">
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
                    <div
                      class="flex flex-row flex-no-wrap items-center"
                      v-if="childItem.reference && childItem.reference !== 'null'"
                    >{{ childItem.reference }}</div>
                  </div>
                  <div class="item w-1/3" v-else />
                  <div
                    class="w-1/6 flex flex-row flex-no-wrap justify-center items-center bg-yellow-500 px-4 py-2 rounded cursor-pointer"
                    style="position:sticky;right:0"
                    @click.stop.prevent="uploadCompliance(childItem.id, childItem.compliance_document_id, childItem.compliance_document_type_name, childItem.file, childItem.has_reference, childItem.reference, childItem.country_id, 'optional-child')"
                  >Upload</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TRAININGS -->
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
    </div>
    <transition name="fade" mode="out-in">
      <div
        v-if="['compliance-id','compliance-mandatory-training-id'].includes($route.name)"
        class="shield"
        @click="$router.push('/compliance')"
      />
    </transition>
    <nuxt-child />
    <div>
      <transition name="fade" mode="out-in">
        <div class="shield" v-if="modal"></div>
      </transition>
      <transition name="fade" mode="out-in">
        <div class="flex justify-center upload-modal" v-if="modal">
          <div class="relative border-solid rounded-lg bg-white p-4 shadow-lg" style="width:25%">
            <AppLoading :loading="activeLoading.length > 0" spinner />
            <div class="flex flex-col justify-center">
              <div class="flex justify-end font-bold cursor-pointer" @click="modal = false">X</div>
              <template v-if="selectedComplianceTypeName === 'Passport'">
                <AppInput
                  v-model="form.country_id"
                  :type="'select'"
                  :name="'country_id'"
                  :label="'Country'"
                  :placeholder="'Select...'"
                  :error="formError.find(item => item.field === 'country_id')"
                  :items="countries"
                />
              </template>
              <template v-if="selectedComplianceTypeName === 'DBS'">
                <AppInput
                  v-model="form.has_reference"
                  :type="'single-checkbox'"
                  :name="'has_reference'"
                  :label="'Has Reference'"
                  :error="formError.find(item => item.field === 'has_reference')"
                />
              </template>
              <template v-if="selectedComplianceTypeName === 'Reference' || form.has_reference">
                <AppInput
                  v-model="form.reference"
                  :type="'text'"
                  :name="'reference'"
                  :label="'Reference'"
                  :error="formError.find(item => item.field === 'reference')"
                />
              </template>
              <div
                class="hover:underline flex flex-row flex-no-wrap justify-center items-center bg-yellow-500 px-4 py-2 mt-2 rounded cursor-pointer"
              >
                <input
                  type="file"
                  name="file"
                  id="file"
                  class="inputfile hidden"
                  @input="onFileInput($event, form.compliance_document_id)"
                  @click.stop
                />
                <svgicon name="cloud-upload" height="24" width="24" />
                <label for="file" class="hidden md:block leading-loose mx-2 cursor-pointer">Upload</label>
              </div>
              <div class="w-full text-center" v-if="form.file">
                <small>Uploaded file: {{form.file.name}}</small>
              </div>
              <div class="w-full text-center" v-else-if="file">
                <small>file: {{file.filename}}</small>
              </div>
              <transition name="drop-down">
                <div
                  v-if="formError.find(item => item.field === 'file')"
                  class="text-red-500 py-1 text-xs text-white"
                >{{ formError.find(item => item.field === 'file').message.charAt(0).toUpperCase() + formError.find(item => item.field === 'file').message.slice(1).replace(/_/g, " ") }}</div>
              </transition>
              <AppButton
                class="mt-8"
                :label="'Submit'"
                @click="submit"
                :inStyle="'padding:5px 14px;'"
              />
            </div>
          </div>
        </div>
      </transition>
    </div>
  </section>
</template>
<script>
import AppInput from "@/components/Base/AppInput";
import AppButton from "@/components/Base/AppButton";
import AppLoading from "@/components/Base/AppLoading";
export default {
  components: {
    AppInput,
    AppButton,
    AppLoading
  },
  data() {
    return {
      dataTypeUploading: null,
      loading: false,
      activeLoading: [],
      referenceComplianceDocuments: [],
      mandatoryComplianceDocuments: [],
      optionalComplianceDocuments: [],
      mandatory_trainings: [],
      modal: false,
      type: null,
      selectedComplianceTypeName: null,

      file: null,
      selectedId: null,
      form: {
        compliance_document_id: null,
        file: null,
        has_reference: false,
        reference: null,
        country_id: null
      },
      formError: []
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
      const optionalComplianceDocuments =
        response.data.user.optional_locum_compliance_documents;

      const responseMandatoryTrainings = await app.$axios.$get(
        `/api/v1/locum/locum-detail-mandatory-trainings`
      );
      const mandatory_trainings = responseMandatoryTrainings.data.locum_detail_mandatory_trainings.sort(
        (a, b) => a.id - b.id
      );

      const responseCountries = await app.$axios.$get(
        `/api/v1/countries?limit=10000`
      );
      const countries =
        responseCountries &&
        responseCountries.data &&
        responseCountries.data.countries
          ? responseCountries.data.countries.map(item => {
              return {
                label: item.name,
                value: item.id
              };
            })
          : [];

      return {
        countries,
        referenceComplianceDocuments,
        mandatoryComplianceDocuments,
        optionalComplianceDocuments,
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
  computed: {
    hasVisa() {
      return this.mandatoryComplianceDocuments.find(
        item => item.compliance_document_type_name === "Visa"
      );
    }
  },
  mounted() {
    this.$socket.on(
      "Locum Notification Number Pending",
      this.getComplianceRealTime
    );
    this.$socket.on(
      "Locum Notification Number Rejected",
      this.getComplianceRealTime
    );
    this.$socket.on(
      "Locum Notification Number Verified",
      this.getComplianceRealTime
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
    async uploadCompliance(
      id,
      complianceDocumentId,
      typeName,
      file,
      hasReference,
      reference,
      countryId,
      type
    ) {
      let country_id;
      // if (typeName === "Passport") {
      //   console.log(id);
      //   let response = await this.$axios.$get(
      //     `api/v1/locum/locum-compliance-documents/${id}`
      //   );
      //   country_id =
      //     response.data &&
      //     response.data.locum_compliance_document &&
      //     response.data.locum_compliance_document.country
      //       ? response.data.locum_compliance_document.country.id
      //       : null;
      // }
      this.selectedId = id;
      this.modal = true;
      this.type = type;
      this.formError = [];
      this.file = file;
      this.selectedComplianceTypeName = typeName;
      this.form.compliance_document_id = complianceDocumentId;
      this.form.file = null;
      this.form.has_reference = ["false", false, "0", 0, null].includes(
        hasReference
      )
        ? false
        : true;
      this.form.reference = reference !== "null" ? reference : "";
      this.form.country_id = countryId;
    },
    async submit() {
      try {
        this.formError = [];
        let notRequired = ["has_reference"];
        if (this.file) {
          notRequired.push("file");
        }
        if (this.selectedComplianceTypeName !== "Passport") {
          notRequired.push("country_id");
        }
        if (
          !["Reference", "DBS"].includes(this.selectedComplianceTypeName) ||
          ["false", false, "0", 0].includes(this.form.has_reference)
        ) {
          notRequired.push("reference");
        }
        if (["false", false].includes(this.form.has_reference)) {
          this.form.reference = null;
        }
        this.Validate(this.form, notRequired);
        if (!this.formError.length) {
          const formData = new FormData();
          formData.append("user_id", this.$auth.user.id);
          formData.append(
            "compliance_document_id",
            this.form.compliance_document_id
          );
          if (this.form.file) {
            formData.append("file", this.form.file);
          }
          formData.append("has_reference", this.form.has_reference);
          formData.append("reference", this.form.reference);
          if (this.selectedComplianceTypeName === "Passport") {
            formData.append("country_id", this.form.country_id);
          }
          this.activeLoading.push(this.form.compliance_document_id);

          let response;
          if (!this.file) {
            response = await this.$axios.$post(
              `/api/v1/locum/locum-compliance-documents`,
              formData
            );
          } else if (this.file) {
            response = await this.$axios.$patch(
              `/api/v1/locum/locum-compliance-documents/${this.selectedId}`,
              formData
            );
          }
          if (this.type === "mandatory") {
            let updatedMandatoryComplianceIndex = this.mandatoryComplianceDocuments.findIndex(
              item =>
                item.compliance_document_id === this.form.compliance_document_id
            );
            if (updatedMandatoryComplianceIndex >= 0) {
              this.mandatoryComplianceDocuments.splice(
                updatedMandatoryComplianceIndex,
                1,
                this.getUpdatedObject(response)
              );
            }
          }
          if (this.type === "mandatory-child") {
            let updatedMandatoryComplianceChildrenIndex = this.mandatoryComplianceDocuments
              .find(
                item => item.compliance_document_type_name === "Safeguarding"
              )
              .child_locum_compliance_documents.findIndex(
                childIndex =>
                  childIndex.compliance_document_id ===
                  this.form.compliance_document_id
              );
            if (updatedMandatoryComplianceChildrenIndex >= 0) {
              this.mandatoryComplianceDocuments
                .find(
                  item => item.compliance_document_type_name === "Safeguarding"
                )
                .child_locum_compliance_documents.splice(
                  updatedMandatoryComplianceChildrenIndex,
                  1,
                  this.getUpdatedObject(response)
                );
            }
          }
          if (this.type === "optional") {
            let updatedOptionalComplianceIndex = this.optionalComplianceDocuments.findIndex(
              item =>
                item.compliance_document_id === this.form.compliance_document_id
            );
            if (updatedOptionalComplianceIndex >= 0) {
              this.optionalComplianceDocuments.splice(
                updatedOptionalComplianceIndex,
                1,
                this.getUpdatedObject(response)
              );
            }
          }
          if (this.type === "optional-child") {
            let updatedOptionalComplianceChildrenIndex = this.optionalComplianceDocuments
              .find(
                item => item.compliance_document_type_name === "Safeguarding"
              )
              .child_locum_compliance_documents.findIndex(
                childIndex =>
                  childIndex.compliance_document_id ===
                  this.form.compliance_document_id
              );
            if (updatedOptionalComplianceChildrenIndex >= 0) {
              this.optionalComplianceDocuments
                .find(
                  item => item.compliance_document_type_name === "Safeguarding"
                )
                .child_locum_compliance_documents.splice(
                  updatedOptionalComplianceChildrenIndex,
                  1,
                  this.getUpdatedObject(response)
                );
            }
          }
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: ["Compliance Updated"]
          });
          this.activeLoading = this.activeLoading.filter(
            id => id !== this.form.compliance_document_id
          );
          this.modal = false;
        }
      } catch (err) {
        console.log("err", err.response || err);
        if (err.response.data.message === "File Is Required") {
          this.formError.push({
            field: "file",
            message: "File Is Required"
          });
        }
        this.activeLoading = this.activeLoading.filter(
          id => id !== this.form.compliance_document_id
        );
      }
    },
    getUpdatedObject(responseObject) {
      return {
        type: responseObject.data.locum_compliance_document.type,
        id: responseObject.data.locum_compliance_document.id,
        has_reference:
          responseObject.data.locum_compliance_document.has_reference,
        reference: responseObject.data.locum_compliance_document.reference,
        // expired_at: responseObject.data.locum_compliance_document.expired_at,
        verified_at: responseObject.data.locum_compliance_document.verified_at,
        rejected_at: responseObject.data.locum_compliance_document.rejected_at,
        note: responseObject.data.locum_compliance_document.note,
        status: responseObject.data.locum_compliance_document.status,
        compliance_document_id:
          responseObject.data.locum_compliance_document.compliance_document.id,
        compliance_document_name:
          responseObject.data.locum_compliance_document.compliance_document
            .name,
        compliance_document_type_id:
          responseObject.data.locum_compliance_document.compliance_document
            .compliance_document_type.id,
        compliance_document_type_name:
          responseObject.data.locum_compliance_document.compliance_document
            .compliance_document_type.name,
        // compliance_document_parent_type_id: responseObject.data.locum_compliance_document,
        // compliance_document_parent_type_name: responseObject.data.locum_compliance_document,
        // parent_compliance_document_id: responseObject.data.locum_compliance_document,
        // parent_compliance_document_name: responseObject.data.locum_compliance_document,
        file: responseObject.data.locum_compliance_document.file
      };
    },
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
    async getComplianceRealTime(file) {
      if (!file) {
        return;
      }
      this.getAllCompliances();
    },
    removeListener() {
      this.$socket.removeListener(
        "Locum Notification Number Pending",
        this.getComplianceRealTime
      );
      this.$socket.removeListener(
        "Locum Notification Number Rejected",
        this.getComplianceRealTime
      );
      this.$socket.removeListener(
        "Locum Notification Number Verified",
        this.getComplianceRealTime
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
      if (item.file) {
        if (type === "compliance") {
          this.$router.push(`/compliance/${item.id}`);
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
          str = "bg-orange-500 text-white ";
          break;
        case "Verified":
        case "Approved":
          str = "bg-green-500 text-white ";
          break;
        case "Empty":
          str = "border-2 border-gray-500 text-gray-600"
          break;
        default:
          str = "bg-red-500 text-white ";
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
      // this.file = file;
      this.form.file = file;
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
.upload-modal {
  position: fixed;
  top: 25%;
  left: 0;
  right: 0;
  height: auto;
  z-index: 601;
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
.table {
  min-width: 72em;
  max-width: 100%;
}
 .table .item {
    min-width: 300px;
  }
@media screen and (min-width: 1200px) {
  .table {
    min-width: 100%;
  }
  .table .item {
    min-width: auto;
  }
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
