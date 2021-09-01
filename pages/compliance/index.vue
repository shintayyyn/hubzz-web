<template>
  <section class="compliance-section">
    <AppLoading :loading="initialLoading" spinner />

    <div class="overflow-x-auto">
      <div
        v-if="referenceComplianceDocuments.length > 0"
        class="mt-10 flex items-center justify-between"
      >
        <div class="font-bold text-xs sm:text-base">
          Reference you need to be approved by Hubzz HQ
        </div>
        <!-- <div class="text-xs cursor-pointer">Edit</div> -->
      </div>

      <div class="mt-5 px-1">
        <div
          v-for="item in referenceComplianceDocuments"
          :key="item.id"
          class="shadow-md rounded-lg bg-white px-1 py-2 md:py-4 mb-5 mx-1 md:mx-0"
          :class="!item.file ? 'text-gray-600' : 'hover cursor-pointer'"
          @click="item.file ? show(item, 'compliance') : null"
        >
          <div
            class="relative flex flex-col sm:flex-row justify-between sm:items-center text-xs sm:text-sm"
          >
            <div
              class="px-2 md:p-1 font-bold md:font-normal text-left"
              :style="[
                {
                  flex: '1 0 0',
                  minWidth: '100px',
                  maxWidth: '400px',
                }
              ]"
            >
              {{ item.compliance_document_name }}
            </div>

            <div
              class="px-2"
              :style="[
                {
                  flex: '1 0 0',
                  minWidth: '100px',
                  maxWidth: '150px',
                }
              ]"
            >
              {{ item.reference }}
            </div>

            <div
              class="px-2"
              :style="[
                {
                  flex: '1 0 0',
                  minWidth: '130px',
                  maxWidth: '400px',
                }
              ]"
            >
              <span
                v-if="item.status === 'Rejected'"
                class="break-word"
              >Reason for Rejection: {{ item.note ? item.note : null }}</span>
            </div>

            <div
              class="px-2"
              :style="[
                {
                  flex: '1 0 0',
                  minWidth: '100px',
                  maxWidth: '150px',
                }
              ]"
            >
              <div
                v-if="item && item.status"
                class="text-xs sm:text-sm"
              >
                {{ item.status }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- MANDATORY -->
      <div class="mt-10">
        <div class="font-bold text-xs sm:text-base">
          Documents you need to be approved by Hubzz HQ
        </div>
        <div
          class="text-sm font-hairline italic"
        >
          (Note: Only file types .pdf, .jpeg, .jfif, .doc, .docx, .tiff are accepted)
        </div>
      </div>

      <div class="mt-4 overflow-x-auto">
        <template v-if="mandatoryComplianceDocuments.length.length === 0">
          <span
            class="text-center font-bold text-gray-500 text-xs md:text-sm"
            colspan="7"
          >This section is empty. Update your profile to fill this area.</span>
        </template>

        <div class="table">
          <div class="flex flex-no-wrap justify-start font-bold leading-none text-sm px-3">
            <div class="item w-1/6 p-2">
              Type
            </div>
            <div class="item w-1/6 p-2">
              File
            </div>
            <div class="item w-1/6 p-2">
              Date uploaded
            </div>
            <div class="item w-1/6 p-2">
              Expiry date
            </div>
            <div class="item w-1/6 p-2">
              Status
            </div>
            <div class="item w-1/6 p-2">
              Note
            </div>
            <div class="hidden xxl:block xl:block lg:block item w-1/6 p-2" />
          </div>

          <div v-for="item in mandatoryComplianceDocuments" :key="item.compliance_document_id">
            <div
              v-if="activeLoading.includes(item.compliance_document_id)"
              class="flex flex-no-wrap justify-between shadow-md rounded-lg items-center p-3 my-3 bg-gray-200"
            >
              <span
                class="w-full loader-message md:text-center text-gray-800 cursor-wait bg-gray-200"
              >Uploading</span>
            </div>

            <div
              v-if="!activeLoading.includes(item.compliance_document_id)"
              class="flex flex-no-wrap justify-start shadow-md rounded-lg items-center p-3 my-3 bg-white"
              :class="!item.file ? 'text-gray-600' : 'hover cursor-pointer'"
              @click="show(item, 'compliance')"
            >
              <div
                class="flex flex-col"
                :class="item.compliance_document_type_name !== 'Safeguarding' ? 'w-1/6 px-2' : 'w-4/6 text-black'"
              >
                <template v-if="item.compliance_document_type_name !== 'Safeguarding'">
                  {{ item.compliance_document_name | StringMaxLength(55) }}
                  <span
                    v-if="item.compliance_document_type_name === 'Passport' && item.country_name"
                  >{{ `${item.country_name} VISA? ${hasVisa ? 'Yes' : 'No'}` }}</span>
                </template>

                <template
                  v-if="item.compliance_document_type_name === 'Safeguarding'"
                >
                  {{ item.compliance_document_name }}
                </template>
              </div>

              <template v-if="item.compliance_document_type_name !== 'Safeguarding'">
                <div v-if="(item.file || item.reference)" class="item w-1/6">
                  <div v-if="item.file" class="flex flex-row flex-no-wrap items-center">
                    <span>
                      <svgicon name="cloud-download" height="24" width="24" />
                    </span>

                    <div class="pl-2">
                      <a
                        :href="item.file.url"
                        :download="item.file.filename"
                        target="_blank"
                        class="truncate w-full"
                        @click.stop.prevent="downloadItem(item.file.url, item.file.filename)"
                      >
                        <span class="block md:hidden">{{ item.file.filename | StringMaxLength(15) }}</span>
                        <span class="hidden xl:block xxl:hidden">{{ item.file.filename | StringMaxLength(12) }}</span>
                        <span class="hidden xxl:block">{{ item.file.filename | StringMaxLength(20) }}</span>
                        <span class="hidden md:block xl:hidden">{{ item.file.filename | StringMaxLength(10) }}</span>
                      </a>
                    </div>
                  </div>

                  <div
                    v-if="item.reference && item.reference !== 'null'"
                    class="flex flex-row flex-no-wrap items-center"
                  >
                    {{ item.reference }}
                  </div>
                </div>

                <div v-if="!(item.file || item.reference)" class="item w-1/6" />

                <div class="item w-1/6 px-2">
                  <template v-if="item.file && item.uploaded_at_in_gb_formatted && item.compliance_document_type_name !== 'Safeguarding'">
                    {{ item.uploaded_at_in_gb_formatted }}
                  </template>
                </div>

                <!-- <div
									v-if="item.file && item.uploaded_at_in_gb_formatted && item.compliance_document_type_name !== 'Safeguarding'"
									class="item w-1/6 border border-red-600"
								>{{ item.uploaded_at_in_gb_formatted }}</div>

								<div
									v-if="!(item.file && item.file.created_at && item.compliance_document_type_name !== 'Safeguarding')"
									class="item w-1/6 border border-blue-600 py-2"
								/> -->

                <div class="item w-1/6 px-2">
                  {{ item.expired_at_in_gb_formatted }}
                </div>
              </template>

              <div v-if="item && item.status" class="w-1/6 px-2">
                <div
                  class="text-xs sm:text-sm text-black"
                >
                  {{ item.status }}
                </div>
              </div>

              <div v-if="!(item && item.status)" class="w-1/6" />
              <template v-if="item.compliance_document_type_name === 'Safeguarding'">
                <div class="w-1/6" />
                <div class="w-1/6" />
              </template>

              <template v-if="item.compliance_document_type_name !== 'Safeguarding'">
                <div v-if="(item && item.note)" class="w-1/6 px-2">
                  {{ item.note | StringMaxLength(15) }}
                </div>
                <div v-if="!(item && item.note)" class="w-1/6 px-2" />

                <div
                  v-if="item.compliance_document_type_name !== 'Safeguarding'"
                  class="md:w-1/6 flex flex-row flex-no-wrap justify-end items-center"
                  style="position:sticky;right:0"
                >
                  <div
                    class="bg-yellow-500 px-4 py-2 rounded cursor-pointer"
                    @click.stop.prevent="uploadCompliance(item.id, item.compliance_document_id, item.compliance_document_type_name, item.file, item.has_reference, item.reference, item.country_id, 'mandatory')"
                  >
                    <span class="hidden md:block">Upload</span>
                    <span class="block md:hidden">
                      <svgicon class="fill-current" name="cloud-upload" width="20" height="20" />
                    </span>
                  </div>
                </div>

                <div v-if="!(item.compliance_document_type_name !== 'Safeguarding')" class="w-1/6" />
              </template>
            </div>

            <!-- SAFEGUARDING CHILDREN -->
            <div v-if="item.compliance_document_type_name === 'Safeguarding'">
              <div class="ml-8 flex flex-no-wrap justify-start font-bold leading-none text-sm">
                <div class="item w-1/6 p-2">
                  Type
                </div>
                <div class="item w-1/6 p-2">
                  File
                </div>
                <div class="item w-1/6 p-2">
                  Date uploaded
                </div>
                <div class="item w-1/6 p-2">
                  Expiry date
                </div>
                <div class="item w-1/6 p-2">
                  Status
                </div>
                <div class="item w-1/6 p-2">
                  Note
                </div>
                <div class="hidden xxl:block xl:block lg:block item w-1/6 p-2" />
              </div>

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
                    class="w-full loader-message md:text-center text-gray-800 cursor-wait bg-gray-200"
                  >Uploading</span>
                </div>

                <div
                  v-else
                  class="flex flex-no-wrap justify-start shadow-md rounded-lg items-center p-3 my-3 ml-8 bg-white"
                  :class="!childItem.file ? 'text-gray-600' : 'hover cursor-pointer'"
                  @click="show(childItem, 'compliance')"
                >
                  <div class="item w-1/6 pr-2">
                    {{ childItem.compliance_document_name | StringMaxLength(55) }}
                  </div>

                  <div v-if="(childItem.file || childItem.reference)" class="item w-1/6">
                    <div v-if="childItem.file" class="flex flex-row flex-no-wrap items-center">
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
                      v-if="childItem.reference && childItem.reference !== 'null'"
                      class="flex flex-row flex-no-wrap items-center"
                    >
                      {{ childItem.reference }}
                    </div>
                  </div>

                  <div v-else class="item w-1/6 px-2" />

                  <div class="item w-1/6 px-2">
                    {{ childItem.uploaded_at_in_gb_formatted }}
                  </div>

                  <div class="item w-1/6 px-2">
                    {{ childItem.expired_at_in_gb_formatted }}
                  </div>

                  <div v-if="childItem && childItem.status" class="item w-1/6 px-2">
                    <div
                      class="text-xs sm:text-sm"
                    >
                      {{ childItem.status }}
                    </div>
                  </div>

                  <div v-if="!(childItem && childItem.status)" class="item w-1/6 px-2" />

                  <div
                    v-if="childItem && childItem.note"
                    class="item w-1/6 px-2"
                  >
                    {{ childItem.note | StringMaxLength(15) }}
                  </div>

                  <div v-if="!(childItem && childItem.note)" class="item w-1/6" />

                  <div
                    class="md:w-1/6 flex flex-row flex-no-wrap justify-end items-center"
                    style="position:sticky;right:0"
                  >
                    <div
                      class="bg-yellow-500 px-4 py-2 rounded cursor-pointer"
                      @click.stop.prevent="uploadCompliance(childItem.id, childItem.compliance_document_id, childItem.compliance_document_type_name, childItem.file, childItem.has_reference, childItem.reference, childItem.country_id, 'mandatory-child')"
                    >
                      <span class="hidden md:block">Upload</span>
                      <span class="block md:hidden">
                        <svgicon class="fill-current" name="cloud-upload" width="20" height="20" />
                      </span>
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
        <div class="font-bold text-xs sm:text-base">
          Other documentation for reference to Practices
        </div>

        <div
          class="text-sm font-hairline italic"
        >
          (Note: Only file types .pdf, .jpeg, .jfif, .doc, .docx, .tiff are accepted)
        </div>
      </div>

      <div class="mt-4 overflow-x-auto">
        <template v-if="optionalComplianceDocuments.length.length === 0">
          <span
            class="text-center font-bold text-gray-500 text-xs md:text-sm"
            colspan="7"
          >This section is empty. Update your profile to fill this area.</span>
        </template>

        <div class="table">
          <div class="flex flex-no-wrap justify-between font-bold leading-none text-sm px-3">
            <div class="w-1/3 p-2">
              Type
            </div>
            <div class="w-1/3 p-2">
              File
            </div>
            <div class="w-1/3 p-2" />
          </div>

          <div v-for="item in optionalComplianceDocuments" :key="item.compliance_document_id">
            <div
              v-if="activeLoading.includes(item.compliance_document_id)"
              class="flex flex-no-wrap justify-between shadow-md rounded-lg items-center p-3 my-3 bg-gray-200"
            >
              <span
                class="w-full loader-message md:text-center text-gray-800 cursor-wait bg-gray-200"
              >Uploading</span>
            </div>

            <div
              v-if="!activeLoading.includes(item.compliance_document_id)"
              class="flex flex-no-wrap justify-between shadow-md rounded-lg items-center p-3 my-3 bg-white"
              :class="!item.file ? 'text-gray-600' : 'hover cursor-pointer'"
              @click="show(item, 'compliance')"
            >
              <div :class="item.compliance_document_type_name !== 'Safeguarding' ? 'item w-1/3' : ''">
                <template
                  v-if="item.compliance_document_type_name === 'Safeguarding'"
                >
                  {{ item.compliance_document_name }}
                </template>

                <template
                  v-if="item.compliance_document_type_name !== 'Safeguarding'"
                >
                  {{ item.compliance_document_name | StringMaxLength(55) }}
                </template>
              </div>

              <div class="item w-1/3">
                <template v-if="(item.file || item.reference)">
                  <div v-if="item.file" class="flex flex-row flex-no-wrap items-center">
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
                    v-if="item.reference && item.reference !== 'null'"
                    class="flex flex-row flex-no-wrap items-center"
                  >
                    {{ item.reference }}
                  </div>
                </template>
              </div>

              <div
                v-if="item.compliance_document_type_name !== 'Safeguarding'"
                class="md:w-1/3 flex flex-row flex-no-wrap justify-end items-center"
                style="position:sticky;right:0"
              >
                <div
                  class="bg-yellow-500 px-4 py-2 rounded cursor-pointer"
                  @click.stop.prevent="uploadCompliance(item.id, item.compliance_document_id, item.compliance_document_type_name, item.file, item.has_reference, item.reference, item.country_id, 'optional')"
                >
                  <span class="hidden md:block">Upload</span>
                  <span class="block md:hidden">
                    <svgicon class="fill-current" name="cloud-upload" width="20" height="20" />
                  </span>
                </div>
              </div>

              <div v-if="item.compliance_document_type_name === 'Safeguarding'" class="w-1/6" />
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
                    class="w-full loader-message md:text-center text-gray-800 cursor-wait bg-gray-200"
                  >Uploading</span>
                </div>

                <div
                  v-else
                  class="flex flex-no-wrap justify-between shadow-md rounded-lg items-center p-3 my-3 ml-8 bg-white"
                  :class="!childItem.file ? 'text-gray-600' : 'hover'"
                  @click="show(childItem, 'compliance')"
                >
                  <div class="item w-1/3">
                    {{ childItem.compliance_document_name | StringMaxLength(55) }}
                  </div>

                  <div v-if="(childItem.file || childItem.reference)" class="item w-1/3">
                    <div v-if="childItem.file" class="flex flex-row flex-no-wrap items-center">
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
                      v-if="childItem.reference && childItem.reference !== 'null'"
                      class="flex flex-row flex-no-wrap items-center"
                    >
                      {{ childItem.reference }}
                    </div>
                  </div>

                  <div v-if="!(childItem.file || childItem.reference)" class="item w-1/3" />

                  <div
                    class="md:w-1/6 flex flex-row flex-no-wrap justify-end items-center"
                    style="position:sticky;right:0"
                  >
                    <div
                      class="bg-yellow-500 px-4 py-2 rounded cursor-pointer"
                      @click.stop.prevent="uploadCompliance(childItem.id, childItem.compliance_document_id, childItem.compliance_document_type_name, childItem.file, childItem.has_reference, childItem.reference, childItem.country_id, 'optional-child')"
                    >
                      <span class="hidden md:block">Upload</span>
                      <span class="block md:hidden">
                        <svgicon class="fill-current" name="cloud-upload" width="20" height="20" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TRAININGS -->
      <div class="mt-10">
        <div class="font-bold text-xs sm:text-base">
          Mandatory Training
        </div>
      </div>

      <div class="mt-4 overflow-x-auto">
        <template v-if="mandatory_trainings.length === 0">
          <span
            class="text-center font-bold text-gray-500 text-xs md:text-sm"
            colspan="7"
          >This section is empty. Update your profile to fill this area.</span>
        </template>

        <template v-if="mandatory_trainings.length > 0">
          <table>
            <thead>
              <tr class="text-sm text-left">
                <th class="pl-2">
                  Type
                </th>
                <th class="pl-2">
                  File
                </th>
                <th class="text-center">
                  Date uploaded
                </th>
                <th />
              </tr>
            </thead>

            <tbody>
              <template v-for="(item, index) in mandatory_trainings">
                <tr
                  v-if="activeLoading.includes(item.mandatory_training.id)"
                  :key="item.id"
                  class="text-left bg-gray-200"
                >
                  <td colspan="4" class="loader-message md:text-center text-gray-800">
                    Uploading
                  </td>
                </tr>

                <tr
                  v-if="!activeLoading.includes(item.mandatory_training.id)"
                  :key="item.id"
                  class="text-left"
                  :class="item.file ? 'text-black' : 'text-gray-600'"
                >
                  <td
                    :class="item && item.file ? 'cursor-pointer' : ''"
                    class="w-1/3"
                    @click="show(item, 'mandatory')"
                  >
                    {{ item.mandatory_training.name }}
                  </td>

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

                  <td v-if="!item.file" />

                  <td class="text-center">
                    {{ item.uploaded_at_in_gb_formatted }}
                  </td>

                  <td
                    v-if="!item.file"
                    class="hover:underline"
                    @click.stop="$refs[`${item.id}_file_mandatory_training`][0].click()"
                  >
                    <div
                      class="flex flex-row flex-no-wrap justify-center float-right lg:w-2/3 mx-auto p-2 cursor-pointer bg-yellow-500 rounded"
                    >
                      <input
                        :ref="`${item.id}_file_mandatory_training`"
                        type="file"
                        class="inputfile hidden"
                        @input="onMandatoryFileInput($event, item.mandatory_training.id, index)"
                        @click.stop
                      >

                      <svgicon class="md:hidden fill-current" name="cloud-upload" height="24" width="24" />

                      <label class="hidden md:block leading-loose mx-2 cursor-pointer">Upload</label>
                    </div>
                  </td>

                  <td
                    v-if="item.file"
                    class="hover:underline"
                    @click.stop="$refs[`${item.id}_file_mandatory_training`][0].click()"
                  >
                    <div
                      class="flex flex-row flex-no-wrap justify-center float-right lg:w-2/3 mx-auto p-2 cursor-pointer bg-yellow-500 rounded"
                    >
                      <input
                        :ref="`${item.id}_file_mandatory_training`"
                        type="file"
                        class="inputfile hidden"
                        @input="onMandatoryFileUpdate($event, item.id, index, item.mandatory_training.id)"
                        @click.stop
                      >

                      <svgicon class="md:hidden fill-current" name="cloud-upload" height="24" width="24" />

                      <label class="hidden md:block text-black leading-loose mx-2 cursor-pointer">Update</label>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </template>
      </div>

      <div class="mt-10">
        <div class="font-bold text-xs sm:text-base">
          Other Mandatory Training
        </div>
      </div>

      <div class="mt-4 overflow-x-auto">
        <template v-if="other_mandatory_trainings.length.length === 0">
          <span
            class="text-center font-bold text-gray-500 text-xs md:text-sm"
            colspan="7"
          >This section is empty. Update your profile to fill this area.</span>
        </template>

        <template v-else>
          <table>
            <thead>
              <tr class="text-sm text-left">
                <th class="pl-2">
                  Type
                </th>
                <th class="pl-2">
                  File
                </th>
                <th class="text-center">
                  Date uploaded
                </th>
                <th />
              </tr>
            </thead>

            <tbody>
              <template v-for="(item, index) in other_mandatory_trainings">
                <tr
                  v-if="activeLoading.includes(item.locum_other_mandatory_training_id)"
                  :key="item.id"
                  class="text-left bg-gray-200"
                >
                  <td colspan="4" class="loader-message md:text-center text-gray-800">
                    Uploading
                  </td>
                </tr>

                <tr
                  v-if="!activeLoading.includes(item.locum_other_mandatory_training_id)"
                  :key="item.id"
                  class="text-left"
                  :class="item.file ? 'text-black' : 'text-gray-600'"
                >
                  <td
                    :class="item && item.file ? 'cursor-pointer' : ''"
                    class="w-1/3"
                    @click="show(item, 'other-mandatory')"
                  >
                    {{ item.name }}
                  </td>

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

                  <td v-if="!item.file" />

                  <td class="text-center">
                    {{ item.uploaded_at_in_gb_formatted }}
                  </td>

                  <td
                    v-if="!item.file"
                    class="hover:underline"
                    @click.stop="$refs[`${item.id}_file_other_mandatory_training`][0].click()"
                  >
                    <div
                      class="flex flex-row flex-no-wrap justify-center float-right lg:w-2/3 mx-auto p-2 cursor-pointer bg-yellow-500 rounded"
                    >
                      <input
                        :ref="`${item.id}_file_other_mandatory_training`"
                        type="file"
                        class="inputfile hidden"
                        @input="onOtherMandatoryFileInput($event, item.locum_other_mandatory_training_id, index)"
                        @click.stop
                      >

                      <svgicon class="md:hidden fill-current" name="cloud-upload" height="24" width="24" />

                      <label class="hidden md:block leading-loose mx-2 cursor-pointer">Upload</label>
                    </div>
                  </td>

                  <td
                    v-if="item.file"
                    class="hover:underline"
                    @click.stop="$refs[`${item.id}_file_other_mandatory_training`][0].click()"
                  >
                    <div
                      class="flex flex-row flex-no-wrap justify-center float-right lg:w-2/3 mx-auto p-2 cursor-pointer bg-yellow-500 rounded"
                    >
                      <input
                        :ref="`${item.id}_file_other_mandatory_training`"
                        type="file"
                        class="inputfile hidden"
                        @input="onOtherMandatoryFileInput($event, item.locum_other_mandatory_training_id, index)"
                        @click.stop
                      >

                      <svgicon class="md:hidden fill-current" name="cloud-upload" height="24" width="24" />

                      <label class="hidden md:block text-black leading-loose mx-2 cursor-pointer">Update</label>
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
        <div v-if="modal" class="shield" />
      </transition>

      <transition name="fade" mode="out-in">
        <div v-if="modal" class="flex justify-center upload-modal">
          <div class="relative border-solid rounded-lg bg-white p-4 shadow-lg w-4/5 md:w-2/5 xl:w-1/4">
            <AppLoading :loading="activeLoading.length > 0" spinner />

            <div class="flex flex-col justify-center">
              <div class="flex justify-end font-bold cursor-pointer" @click="modal = false">
                X
              </div>

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
                  label="Give permission to do update checks"
                  :error="formError.find(item => item.field === 'has_reference')"
                />
              </template>

              <template v-if="selectedComplianceTypeName === 'Reference' || form.has_reference">
                <AppInput
                  v-model="form.reference"
                  :type="'textarea'"
                  :name="'reference'"
                  :label="selectedComplianceTypeName === 'DBS' ? 'DBS Reference' : 'Reference'"
                  :error="formError.find(item => item.field === 'reference')"
                  :limit="255"
                  :resize="false"
                  :rows="3"
                  @blur="formError.find(item => item.field === 'reference')"
                />
              </template>

              <div
                class="hover:underline flex flex-row flex-no-wrap justify-center items-center bg-yellow-500 px-4 py-2 rounded cursor-pointer"
                :class="form.has_reference ? '-mt-6' : 'mt-2'"
              >
                <input
                  id="file"
                  type="file"
                  name="file"
                  class="inputfile hidden"
                  @input="onFileInput($event)"
                  @click.stop
                >

                <svgicon name="cloud-upload" height="24" width="24" />

                <label for="file" class="leading-loose mx-2 cursor-pointer">Upload</label>
              </div>

              <div v-if="form.file" class="w-full text-center break-words">
                <small>Uploaded file: {{ form.file.name }}</small>
              </div>

              <div v-else-if="file" class="w-full text-center break-words">
                <small>file: {{ file.filename }}</small>
              </div>

              <transition name="drop-down">
                <div
                  v-if="formError.find(item => item.field === 'file')"
                  class="text-red-500 py-1 text-xs text-white"
                >
                  {{ formError.find(item => item.field === 'file').message.charAt(0).toUpperCase() + formError.find(item => item.field === 'file').message.slice(1).replace(/_/g, " ") }}
                </div>
              </transition>

              <AppButton class="mt-8" :label="'Submit'" :inStyle="'padding:5px 14px;'" @click="submit" />
            </div>
          </div>
        </div>
      </transition>
    </div>
  </section>
</template>

<script>
import AppInput from "@/components/Base/AppInput"
import AppButton from "@/components/Base/AppButton"
import AppLoading from "@/components/Base/AppLoading"

export default {
  components: {
    AppInput,
    AppButton,
    AppLoading,
  },

  data () {
    return {
      dataTypeUploading: null,
      loading: false,
      initialLoading: false,
      activeLoading: [],
      referenceComplianceDocuments: [],
      mandatoryComplianceDocuments: [],
      optionalComplianceDocuments: [],
      mandatory_trainings: [],
      other_mandatory_trainings: [],
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
        country_id: null,
      },
      formError: [],
    }
  },

  computed: {
    hasVisa () {
      return this.mandatoryComplianceDocuments.find(
        item => item.compliance_document_type_name === "Visa"
      )
    },
  },

  watch: {
    $route (value) {
      if (
        ["compliance-id", "compliance-mandatory-training-id",].includes(
          value.name
        )
      ) {
        document.body.style.overflow = "hidden"
      } else {
        document.body.style.overflow = "auto"
      }
    },

    "form.reference" (value) {
      if (value && value.length <= 255) {
        let index = this.formError.findIndex(
          item => item.field === "reference"
        )

        if (index > -1) {
          this.formError.splice(index, 1)
        }
      }
    },
  },

  mounted () {
    this.initialLoading = true
    this.initializeCompliances().finally(() => {
      this.initialLoading = false
    })
    this.addListeners()
  },

  destroyed () {
    this.removeListeners()
  },

  methods: {
    initializeCompliances () {
      this.$axios.get("/api/v1/countries?limit=1000000").then(response => {
        this.countries = response.data.data.countries.map(country => {
          return {
            label: country.name,
            value: country.id,
          }
        })
      })

      return Promise.all([
        this.getAllCompliances(),
        this.getLocumMandatoryTranings(),
        this.getLocumOtherMandatoryTrainings(),
      ])
    },

    addListeners () {
      this.$socket.on(
        "Locum Notification Number Pending",
        this.getComplianceRealTime
      )
      this.$socket.on(
        "Locum Notification Number Rejected",
        this.getComplianceRealTime
      )
      this.$socket.on(
        "Locum Notification Number Verified",
        this.getComplianceRealTime
      )
      this.$socket.on(
        "Locum Notification Compliance Approved",
        this.getComplianceRealTime
      )
      this.$socket.on(
        "Locum Notification Compliance Rejected",
        this.getComplianceRealTime
      )
      this.$socket.on(
        "Locum Notification Compliance Pending",
        this.getComplianceRealTime
      )
      this.$socket.on(
        "Locum Notification Compliance Expiring",
        this.getComplianceRealTime
      )
      this.$socket.on(
        "Locum Notification Compliance Expired",
        this.getComplianceRealTime
      )
    },

    removeListeners () {
      this.$socket.removeListener(
        "Locum Notification Number Pending",
        this.getComplianceRealTime
      )
      this.$socket.removeListener(
        "Locum Notification Number Rejected",
        this.getComplianceRealTime
      )
      this.$socket.removeListener(
        "Locum Notification Number Verified",
        this.getComplianceRealTime
      )
      this.$socket.removeListener(
        "Locum Notification Compliance Approved",
        this.getComplianceRealTime
      )
      this.$socket.removeListener(
        "Locum Notification Compliance Rejected",
        this.getComplianceRealTime
      )
      this.$socket.removeListener(
        "Locum Notification Compliance Pending",
        this.getComplianceRealTime
      )
      this.$socket.removeListener(
        "Locum Notification Compliance Expiring",
        this.getComplianceRealTime
      )
      this.$socket.removeListener(
        "Locum Notification Compliance Expired",
        this.getComplianceRealTime
      )
    },

    async getComplianceRealTime (file) {
      if (!file) {
        return
      }

      this.getAllCompliances()
    },

    getAllCompliances () {
      this.$axios.get("/api/v1/locum/me/compliance").then(response => {
        const user = response.data.data.user

        const {
          reference_locum_compliance_documents: referenceComplianceDocuments,
          mandatory_locum_compliance_documents: mandatoryComplianceDocuments,
          optional_locum_compliance_documents: optionalComplianceDocuments,
        } = user

        this.referenceComplianceDocuments = referenceComplianceDocuments
        this.mandatoryComplianceDocuments = mandatoryComplianceDocuments
        this.optionalComplianceDocuments = optionalComplianceDocuments
      })
    },

    getLocumMandatoryTranings () {
      this.$axios
        .get("/api/v1/locum/locum-detail-mandatory-trainings")
        .then(response => {
          this.mandatory_trainings = response.data.data.locum_detail_mandatory_trainings.sort(
            (a, b) => a.id - b.id
          )
        })
    },

    getLocumOtherMandatoryTrainings () {
      this.$axios
        .get("/api/v1/locum/other-mandatory-training", {
          params: {
            user_id: this.$auth.user.id,
            is_added_only: true,
          },
        })
        .then(response => {
          this.other_mandatory_trainings = response.data.data.locum_other_mandatory_trainings.sort(
            (a, b) => a.id - b.id
          )
        })
    },

    async uploadCompliance (...args) {
      const [
        id,
        complianceDocumentId,
        typeName,
        file,
        hasReference,
        reference,
        countryId,
        type,
      ] = args

      this.selectedId = id
      this.modal = true
      this.type = type
      this.formError = []
      this.file = file
      this.selectedComplianceTypeName = typeName
      this.form.compliance_document_id = complianceDocumentId
      this.form.file = null
      this.form.has_reference = ["false", false, "0", 0, null,].includes(
        hasReference
      )
        ? false
        : true
      this.form.reference = reference !== "null" ? reference : ""
      this.form.country_id = countryId
    },

    async submit () {
      try {
        this.formError = []

        let notRequired = ["has_reference",]

        if (this.file) {
          notRequired.push("file")
        }

        if (this.selectedComplianceTypeName !== "Passport") {
          notRequired.push("country_id")
        }

        if (
          !["Reference", "DBS",].includes(this.selectedComplianceTypeName)
					|| ["false", false, "0", 0,].includes(this.form.has_reference)
        ) {
          notRequired.push("reference")
        }

        if (["false", false,].includes(this.form.has_reference)) {
          this.form.reference = null
        }

        if (this.form.has_reference) {
          if (this.form.reference.length && this.form.reference.length > 255) {
            this.formError.push({
              field: "reference",
              message: "Reference is too long.",
            })
          }
        }

        this.Validate(this.form, notRequired)

        if (this.formError.length === 0) {
          const formData = new FormData()

          formData.append("user_id", this.$auth.user.id)

          formData.append(
            "compliance_document_id",
            this.form.compliance_document_id
          )

          if (this.form.file) {
            formData.append("file", this.form.file)
          }

          formData.append("has_reference", this.form.has_reference)

          formData.append("reference", this.form.reference)

          if (this.selectedComplianceTypeName === "Passport") {
            formData.append("country_id", this.form.country_id)
          }

          this.activeLoading.push(this.form.compliance_document_id)

          let response

          if (!this.file) {
            response = await this.$axios.$post(
              `/api/v1/locum/locum-compliance-documents`,
              formData
            )
          } else if (this.file) {
            response = await this.$axios.$patch(
              `/api/v1/locum/locum-compliance-documents/${this.selectedId}`,
              formData
            )
          }

          if (this.type === "mandatory") {
            let updatedMandatoryComplianceIndex = this.mandatoryComplianceDocuments.findIndex(
              item =>
                item.compliance_document_id === this.form.compliance_document_id
            )

            if (updatedMandatoryComplianceIndex > -1) {
              this.mandatoryComplianceDocuments.splice(
                updatedMandatoryComplianceIndex,
                1,
                this.getUpdatedObject(response)
              )
            }
          }

          if (this.type === "mandatory-child") {
            let updatedMandatoryComplianceChildrenIndex = this.mandatoryComplianceDocuments
              .find(
                item => item.compliance_document_type_name === "Safeguarding"
              )
              .child_locum_compliance_documents.findIndex(
                childIndex =>
                  childIndex.compliance_document_id
									=== this.form.compliance_document_id
              )

            if (updatedMandatoryComplianceChildrenIndex > -1) {
              this.mandatoryComplianceDocuments
                .find(
                  item => item.compliance_document_type_name === "Safeguarding"
                )
                .child_locum_compliance_documents.splice(
                  updatedMandatoryComplianceChildrenIndex,
                  1,
                  this.getUpdatedObject(response)
                )
            }
          }

          if (this.type === "optional") {
            let updatedOptionalComplianceIndex = this.optionalComplianceDocuments.findIndex(
              item =>
                item.compliance_document_id === this.form.compliance_document_id
            )

            if (updatedOptionalComplianceIndex > -1) {
              this.optionalComplianceDocuments.splice(
                updatedOptionalComplianceIndex,
                1,
                this.getUpdatedObject(response)
              )
            }
          }

          if (this.type === "optional-child") {
            let updatedOptionalComplianceChildrenIndex = this.optionalComplianceDocuments
              .find(
                item => item.compliance_document_type_name === "Safeguarding"
              )
              .child_locum_compliance_documents.findIndex(
                childIndex =>
                  childIndex.compliance_document_id
									=== this.form.compliance_document_id
              )

            if (updatedOptionalComplianceChildrenIndex > -1) {
              this.optionalComplianceDocuments
                .find(
                  item => item.compliance_document_type_name === "Safeguarding"
                )
                .child_locum_compliance_documents.splice(
                  updatedOptionalComplianceChildrenIndex,
                  1,
                  this.getUpdatedObject(response)
                )
            }
          }

          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: ["Compliance Updated",],
          })

          this.activeLoading = this.activeLoading.filter(
            id => id !== this.form.compliance_document_id
          )

          this.modal = false
        }
      } catch (err) {
        console.log("err", err.response || err)

        if (err.response.data.message === "File Is Required") {
          this.formError.push({
            field: "file",
            message: "File Is Required",
          })
        } else {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "danger",
            text: [err.response.data.message,],
          })
        }

        this.activeLoading = this.activeLoading.filter(
          id => id !== this.form.compliance_document_id
        )
      }
    },

    getUpdatedObject (responseObject) {
      return {
        type: responseObject.data.locum_compliance_document.type,
        id: responseObject.data.locum_compliance_document.id,
        has_reference:
					responseObject.data.locum_compliance_document.has_reference,
        reference: responseObject.data.locum_compliance_document.reference,
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
        file: responseObject.data.locum_compliance_document.file,
      }
    },

    show (item, type) {
      if (item.file) {
        if (type === "compliance") {
          this.$router.push(`/compliance/${item.id}`)
        }

        if (type === "mandatory") {
          this.$router.push(`/compliance/mandatory-training/${item.id}`)
        }
      }
    },

    status (status) {
      switch (status) {
      case "Pending":
      case "Expiring":
        return "bg-orange-500 text-white "
      case "Verified":
      case "Approved":
        return "bg-green-500 text-white "
      case "Empty":
        return "border-2 border-gray-500 text-gray-600"
      default:
        return "bg-red-500 text-white "
      }
    },

    onFileInput (event) {
      if (!event.target.files.length) {
        return
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
        "vnd.ms-word.template.macroEnabled.12",
      ]

      let file = event.target.files[0]

      let fileType = file.type.split("/")[1]

      if (!types.includes(fileType)) {
        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "alert",
          text: ["Invalid File Format",],
        })

        return
      }

      this.form.file = file
    },

    onMandatoryFileInput (e, id, index) {
      let types = [
        "pdf",
        "jpeg",
        "msword",
        "tiff",
        "vnd.openxmlformats-officedocument.wordprocessingml.document",
        "vnd.openxmlformats-officedocument.wordprocessingml.template",
        "vnd.ms-word.document.macroEnabled.12",
        "vnd.ms-word.template.macroEnabled.12",
      ]

      let file = e.target.files[0]
      let fileType = file.type.split("/")[1]

      if (!types.includes(fileType)) {
        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "alert",
          text: ["Invalid File Format",],
        })

        return
      }

      const formData = new FormData()

      formData.append("file", file)

      formData.append("mandatory_training_id", id)

      // post request to API / send file
      this.loading = true

      this.activeLoading.push(id)

      this.$axios
        .$post(`/api/v1/locum/locum-detail-mandatory-trainings`, formData)
        .then(res => {
          this.mandatory_trainings.splice(
            index,
            1,
            res.data.locum_detail_mandatory_training
          )

          this.mandatory_trainings = this.mandatory_trainings.sort(
            (a, b) => a.id - b.id
          )

          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: ["Document uploaded!",],
          })

          this.activeLoading = this.activeLoading.filter(item => item !== id)
        })
        .catch(err => {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "danger",
            text: [`${err.response.data.message}`,],
          })

          this.activeLoading = this.activeLoading.filter(item => item !== id)
        })
        .finally(() => {
          this.loading = false
        })
    },

    onMandatoryFileUpdate (e, id, index, loadingId) {
      if (!e.target.files.length) {
        return
      }

      let types = [
        "pdf",
        "jpeg",
        "msword",
        "tiff",
        "vnd.openxmlformats-officedocument.wordprocessingml.document",
        "vnd.openxmlformats-officedocument.wordprocessingml.template",
        "vnd.ms-word.document.macroEnabled.12",
        "vnd.ms-word.template.macroEnabled.12",
      ]

      let file = e.target.files[0]

      let fileType = file.type.split("/")[1]

      if (!types.includes(fileType)) {
        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "alert",
          text: ["Invalid File Format",],
        })

        return
      }

      const formData = new FormData()

      formData.append("file", file)

      // post request to API / send file
      this.loading = true

      this.activeLoading.push(loadingId)

      this.$axios
        .$put(`/api/v1/locum/locum-detail-mandatory-trainings/${id}`, formData)
        .then(res => {
          this.mandatory_trainings.splice(
            index,
            1,
            res.data.locum_detail_mandatory_training
          )

          this.mandatory_trainings = this.mandatory_trainings.sort(
            (a, b) => a.id - b.id
          )

          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: ["Document uploaded!",],
          })

          this.activeLoading = this.activeLoading.filter(
            item => item !== loadingId
          )
        })
        .catch(err => {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "danger",
            text: [`${err.response.data.message}`,],
          })

          this.activeLoading = this.activeLoading.filter(
            item => item !== loadingId
          )
        })
        .finally(() => {
          this.loading = false
        })
    },

    onOtherMandatoryFileInput (e, id, index) {
      let types = [
        "pdf",
        "jpeg",
        "msword",
        "tiff",
        "vnd.openxmlformats-officedocument.wordprocessingml.document",
        "vnd.openxmlformats-officedocument.wordprocessingml.template",
        "vnd.ms-word.document.macroEnabled.12",
        "vnd.ms-word.template.macroEnabled.12",
      ]

      let file = e.target.files[0]

      let fileType = file.type.split("/")[1]

      if (!types.includes(fileType)) {
        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "alert",
          text: ["Invalid File Format",],
        })

        return
      }

      const formData = new FormData()

      formData.append("file", file)

      formData.append("other_mandatory_training_id", id)

      // post request to API / send file
      this.loading = true

      this.activeLoading.push(id)

      this.$axios
        .$patch(`/api/v1/locum/other-mandatory-training/${id}`, formData)
        .then(res => {
          this.other_mandatory_trainings.splice(
            index,
            1,
            res.data.locum_other_mandatory_training
          )

          this.other_mandatory_trainings = this.other_mandatory_trainings.sort(
            (a, b) => a.id - b.id
          )

          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: ["Document uploaded!",],
          })

          this.activeLoading = this.activeLoading.filter(item => item !== id)
        })
        .catch(err => {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "danger",
            text: [`${err.response.data.message}`,],
          })

          this.activeLoading = this.activeLoading.filter(item => item !== id)
        })
        .finally(() => {
          this.loading = false
        })
    },

    onOtherMandatoryFileUpdate (e, id, index, loadingId) {
      if (!e.target.files.length) {
        return
      }

      let types = [
        "pdf",
        "jpeg",
        "msword",
        "tiff",
        "vnd.openxmlformats-officedocument.wordprocessingml.document",
        "vnd.openxmlformats-officedocument.wordprocessingml.template",
        "vnd.ms-word.document.macroEnabled.12",
        "vnd.ms-word.template.macroEnabled.12",
      ]

      let file = e.target.files[0]

      let fileType = file.type.split("/")[1]

      if (!types.includes(fileType)) {
        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "alert",
          text: ["Invalid File Format",],
        })

        return
      }

      const formData = new FormData()

      formData.append("file", file)

      // post request to API / send file
      this.loading = true

      this.activeLoading.push(loadingId)

      this.$axios
        .$put(`/api/v1/locum/locum-detail-mandatory-trainings/${id}`, formData)
        .then(res => {
          this.mandatory_trainings.splice(
            index,
            1,
            res.data.locum_detail_mandatory_training
          )

          this.mandatory_trainings = this.mandatory_trainings.sort(
            (a, b) => a.id - b.id
          )

          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: ["Document uploaded!",],
          })

          this.activeLoading = this.activeLoading.filter(
            item => item !== loadingId
          )
        })
        .catch(err => {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "danger",
            text: [`${err.response.data.message}`,],
          })

          this.activeLoading = this.activeLoading.filter(
            item => item !== loadingId
          )
        })
        .finally(() => {
          this.loading = false
        })
    },

    downloadItem (fileUrl, fileName) {
      const axios = require("axios")

      axios({
        url: fileUrl,
        method: "GET",
        responseType: "blob", // important
      }).then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data,]))
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", fileName)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
    },
  },
}
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
	min-width: 150px;
}
@media screen and (min-width: 1200px) {
	.complianceModal {
		width: 80%;
	}
	.mandatoryTrainingModal {
		width: 80%;
	}
}
@media screen and (min-width: 1420px) {
	.table {
		min-width: 100%;
	}
	.table .item {
		min-width: auto;
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
