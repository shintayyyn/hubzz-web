<template>
  <div class="p-2">
    <AppLoading :loading="gettingComplianceDocument" spinner />

    <div class="flex flex-row flex-no-wrap items-center">
      <!-- <div class="cursor-pointer" @click="$router.push('/compliance')">
        <svgicon name="left-arrow" height="32" />
      </div> -->
      <a
        class="text-black no-underline flex items-center w-auto text-sm transition-hover hover:bg-yellow-500 rounded-lg cursor-pointer py-2 px-4 border"
        @click.prevent="downloadItem(compliance_document.file.url,compliance_document.file.filename)"
      >
        <svgicon
          name="cloud-download"
          width="18"
          height="18"
          color="black"
          hover="transparent black"
          class="inline"
        />
        <span class="mx-1" />
        <span>Download</span>
      </a>
    </div>

    <div class="flex flex-col">
      <div class="shadow-lg rounded-lg bg-gray-300 mt-4 max-w-5xl">
        <div v-if="compliance_document" class="flex flex-row flex-wrap justify-start p-4 md:p-8">
          <div class="flex flex-col w-full lg:w-1/4 pr-4">
            <p class="font-bold text-lg">
              Type
            </p>
            <p
              class="mt-2 text-sm md:text-base"
            >
              {{ compliance_document.compliance_document ? compliance_document.compliance_document.name: null }}
            </p>
            <div v-if="compliance_document.has_reference">
              <p class="font-bold text-lg mt-5">
                Reference
              </p>
              <p class="mt-2 text-sm md:text-base">
                {{ compliance_document.reference }}
              </p>
            </div>
            <div v-if="compliance_document.country">
              <p class="font-bold text-lg mt-5">
                Country
              </p>
              <p class="mt-2 text-sm md:text-base">
                {{ compliance_document.country.name }}
              </p>
            </div>
            <p class="mt-5 font-bold text-lg">
              Date uploaded
            </p>
            <p
              class="mt-2 text-sm md:text-base"
            >
              {{ compliance_document.uploaded_at_in_gb_formatted }}
            </p>
            <p class="mt-5 font-bold text-lg">
              Status
            </p>
            <p class="mt-2 text-sm md:text-base">
              {{ compliance_document.status }}
            </p>
            <div v-if="compliance_document.status === 'Approved'">
              <p class="mt-5 font-bold text-lg">
                Expiration Date
              </p>
              <p
                class="mt-2 text-sm md:text-base"
              >
                {{ compliance_document.expired_at_in_gb_formatted }}
              </p>
            </div>
            <div v-if="compliance_document.status === 'Rejected'">
              <p class="mt-5 font-bold text-lg">
                Rejected At
              </p>
              <p
                class="mt-2 text-sm md:text-base"
              >
                {{ compliance_document.rejected_at_in_gb_formatted }}
              </p>
              <p class="mt-5 font-bold text-lg">
                Notes
              </p>
              <p
                class="mt-2 text-sm md:text-base"
              >
                {{ compliance_document && compliance_document.note ? compliance_document.note : null }}
              </p>
            </div>

            <div v-if="false">
              <p class="mt-5 font-bold text-lg">
                Note
              </p>
              <p class="mt-2 text-sm md:text-base">
                {{ compliance_document.note }}
              </p>
            </div>
            
            <div class="mt-2">
              <button
                class="text-black no-underline flex items-center w-auto text-sm transition-hover hover:bg-yellow-500 rounded-lg cursor-pointer py-2 px-4 border border-gray-400 "
                @click.stop.prevent="uploadCompliance(compliance_document.id, compliance_document.compliance_document_id, compliance_document.compliance_document_type_name, compliance_document.file, compliance_document.has_reference, compliance_document.reference, compliance_document.country_id, 'optional')"
              >
                <span>Update</span>
              </button>
            </div>
          </div>
          <div class="mt-5 lg:mt-0 w-full lg:w-3/4">
            <embed
              class="object-contain object-top w-full"
              :class="compliance_document.file.type == 'image' ? 'image' : 'document h-full'"
              :src="['msword', 'tiff', 'vnd.openxmlformats-officedocument.wordprocessingml.document', 'vnd.openxmlformats-officedocument.wordprocessingml.template', 'vnd.ms-word.document.macroEnabled.12', 'vnd.ms-word.template.macroEnabled.12'].includes(compliance_document.file.subtype) ? convertDoc(compliance_document.file.url) : compliance_document.file.url"
            >
          </div>
        </div>
      </div>
    </div>

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
  </div>
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

  data() {
    return {
      compliance_document: null,
      gettingComplianceDocument: false,

      dataTypeUploading: null,
      loading: false,
      initialLoading: false,
      activeLoading: [],
      referenceComplianceDocuments: [],
      mandatoryComplianceDocuments: [],
      otherMandatoryComplianceDocuments: [],
      optionalComplianceDocuments: [],
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

  // async asyncData ({ app, params, redirect, }) {
  //   try {
  //     const response = await app.$axios.$get(
  //       `/api/v1/locum/locum-compliance-documents/${params.id}`
  //     )
  //     let compliance_document	= response.data && response.data.locum_compliance_document
  //       ? response.data.locum_compliance_document
  //       : null
        
  //     return {
  //       compliance_document,
  //     }
  //   } catch (err) {
  //     if (err.response && err.response.status === 404) {
  //       return redirect("/compliance")
  //     }
  //     throw err
  //   }
  // },

  mounted() {
    this.getComplianceDocument()

    this.$axios.get("/api/v1/countries?limit=1000000").then(response => {
      const sortedCountries = response.data.data.countries
        .sort((a, b) => {
          return a.name > b.name ? 1 : -1
        })

      const ukIndex = sortedCountries.findIndex((country) => country.name === 'United Kingdom')

      if (ukIndex > -1) {
        const ukCountry = sortedCountries[ukIndex]
        sortedCountries.splice(ukIndex, 1)
        sortedCountries.unshift(ukCountry)
      }
      
      this.countries = sortedCountries.map(country => {
        return {
          label: country.name,
          value: country.id,
        }
      })
    })
  },

  methods: {
    getComplianceDocument() {
      this.gettingComplianceDocument = true
      this.$axios.$get(
        `/api/v1/locum/locum-compliance-documents/${this.$route.params.id}`
      ).then((response) => {
        let compliance_document	= response.data && response.data.locum_compliance_document
          ? response.data.locum_compliance_document
          : null

        this.compliance_document = compliance_document
      }).finally(() => {
        this.gettingComplianceDocument = false
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

    convertDoc (document) {
      console.log(document)
      return `https://docs.google.com/gview?url=${document}&embedded=true`
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
          
          this.getComplianceDocument()

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
					responseObject.data.locum_compliance_document.compliance_document.name,
        compliance_document_type_id:
					responseObject.data.locum_compliance_document.compliance_document.compliance_document_type.id,
        compliance_document_type_name:
					responseObject.data.locum_compliance_document.compliance_document.compliance_document_type.name,
        // compliance_document_parent_type_id: responseObject.data.locum_compliance_document,
        // compliance_document_parent_type_name: responseObject.data.locum_compliance_document,
        // parent_compliance_document_id: responseObject.data.locum_compliance_document,
        // parent_compliance_document_name: responseObject.data.locum_compliance_document,
        file: responseObject.data.locum_compliance_document.file,
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
  },
}
</script>
<style scoped>
.modal-container {
	z-index: 510;
}
@media screen and (min-width: 1200px) {
	.modal-container {
		width: 80%;
	}
}
.document {
	width: 100%;
	min-height: 50vh;
}

.image {
	min-height: 100%;
	max-height: 100%;
}

@media screen and (min-width: 768px) {
	.document {
		min-height: 70vh;
	}

	.image {
		min-height: 60vh;
		max-height: 60vh;
	}
}

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