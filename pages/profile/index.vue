<template>
  <section>
    <div class="flex flex-col">
      <div class="h-full flex flex-row flex-wrap justify-between">
        <div class="w-full lg:w-3/5 p-1">
          <div class="bg-white rounded-lg shadow-lg p-4 md:p-8 h-full">
            <div class="flex flex-row flex-wrap">
              <div class="flex flex-col w-full lg:w-1/2 xl:w-2/5 p-1">
                <div class="text-xs sm:text-sm">Practice name</div>
                <div class="text-xs font-bold py-2">{{surgery.name}}</div>
                <div class="text-xs sm:text-sm mt-4">CCG</div>
                <div class="text-xs font-bold py-2">{{surgery.clinical_commissioning_group.name}}</div>
              </div>
              <div class="flex flex-col w-full lg:w-1/2 xl:w-1/5 p-1">
                <div class="text-xs sm:text-sm" mt-4>Practice code</div>
                <div class="text-xs font-bold py-2">{{surgery.code}}</div>
                <div class="text-xs sm:text-sm mt-4">Phone number</div>
                <div class="text-xs font-bold py-2">{{surgery.phone_number}}</div>
              </div>
              <div class="flex xl:flex-col w-full xl:w-2/5 p-1">
                <div class="flex flex-col lg:w-1/2 xl:w-full">
                  <div class="text-xs sm:text-sm">Type</div>
                  <div
                    class="text-xs font-bold py-2"
                  >{{ !practice.hub_type || practice.hub_type !== 'Type 2' ? practice.type : 'Hub - Health Board'}}</div>
                </div>
                <div class="flex flex-col lg:w-1/2 xl:w-full">
                  <div class="text-xs sm:text-sm">Address</div>
                  <div
                    class="text-xs font-bold py-2"
                  >{{surgery.address.line_1}} {{surgery.address.line_2}} {{surgery.address.line_3}} {{surgery.address.post_code}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="w-full lg:w-2/5 p-1">
          <div class="relative bg-white rounded-lg shadow-lg p-4 lg:p-8 h-full">
            <AppLoading spinner :loading="input_file_loading" />
            <div class="flex flex-col">
              <div class="pb-2">
                <input
                  type="radio"
                  name="standard_terms"
                  id="use_standard_terms"
                  v-model="form.use_variation_terms"
                  :value="false"
                />
                <label for="use_standard_terms">Use Standard Terms with Locum</label>
              </div>
              <div class="pb-2">
                <input
                  type="radio"
                  name="standard_terms"
                  id="variation_terms_file"
                  v-model="form.use_variation_terms"
                  :value="true"
                />
                <label for="variation_terms_file">Use Variation to Standard Terms</label>
              </div>
              <!-- <AppInput
                v-model="form.use_standard_terms"
                :type="'single-checkbox'"
                :name="'use_standard_terms'"
                :label="'Use Standard Terms with Locum?'"
                :disabled="!authPermissions.includes('Update Profile Practice')"
                :error="formError.find(item => item.field === 'use_standard_terms')"
              />-->
              <div class="relative">
                <!-- <AppInput
                  v-model="form.use_variation_terms"
                  :type="'single-checkbox'"
                  :name="'use_variation_terms'"
                  :label="'Use Variation to Standard Terms'"
                  :disabled="!authPermissions.includes('Update Profile Practice')"
                  :error="formError.find(item => item.field === 'use_variation_terms')"
                />-->
                <div class="relative" v-if="form.use_variation_terms">
                  <div class="flex flex-row flex-wrap justify-between items-center">
                    <div class="text-xs sm:text-sm">Your Practice's standard terms</div>
                    <div
                      v-if="authPermissions.includes('Update Profile Practice')"
                      class="flex justify-start items-center"
                    >
                      <label v-if="input_file_loading === false" for="file-upload">
                        <div class="flex flex-row flex-no-wrap cursor-pointer hover:underline">
                          <svgicon name="cloud-upload" height="24" width="24" />
                          <div
                            class="ml-2 text-xs sm:text-sm leading-loose"
                          >{{ practice.variation_terms_file ? 'Update' : 'Upload' }}</div>
                        </div>
                      </label>
                      <input
                        type="file"
                        id="file-upload"
                        class="hidden"
                        @input="onFileInput($event)"
                      />
                    </div>
                  </div>
                  <div class="bg-gray-300 rounded-lg px-4 py-2" v-if="!input_file_loading">
                    <div class="flex flex-no-wrap justify-between items-center">
                      <div
                        class="text-xs sm:text-sm document-filename"
                      >{{ practice.variation_terms_file && practice.variation_terms_file.filename ? practice.variation_terms_file.filename : 'Upload File' }}</div>
                      <div
                        class="font-bold text-md sm:text-lg hover:null cursor-pointer text-gray-600 hover:text-black"
                        @click="modal = true"
                        v-if="practice.variation_terms_file"
                      >x</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="w-full p-1">
        <div class="relative bg-white rounded-lg shadow-lg p-2 md:p-6">
          <AppLoading :loading="loading" spinner />
          <AppFormError :formError="formError" v-if="formError.length" />
          <div class="flex flex-row flex-wrap justify-between">
            <div class="flex flex-col w-full md:w-1/2 px-2">
              <AppInput
                v-model="form.phone_number"
                :type="'text'"
                :name="'phone_number'"
                :label="'Phone number'"
                :error="formError.find(item => item.field === 'phone_number')"
                @submit="save"
                @blur="CheckEmptyField(form.phone_number, 'phone_number')"
                required
              />
              <AppInput
                v-model="form.report_to"
                :type="'text'"
                :name="'report_to'"
                :label="'Report to'"
                :error="formError.find(item => item.field === 'report_to')"
                @submit="save"
                @blur="CheckEmptyField(form.report_to, 'report_to')"
                required
              />
              <AppInput
                v-model="form.email"
                :type="'email'"
                :name="'email'"
                :label="'Email Address'"
                :error="formError.find(item => item.field === 'email')"
                @submit="save"
                @blur="CheckEmptyField(form.email, 'email')"
                required
              />
            </div>
            <div class="flex flex-col w-full md:w-1/2 px-2">
              <AppInput
                v-model="form.practice_type_id"
                :type="'multi-checkbox'"
                :error="formError.find(item => item.field === 'practice_type_id')"
                @checked="form.practice_type_id.push($event)"
                @unchecked="uncheckPractice($event)"
                :name="'practice_type_id'"
                :label="'What type of Practice are you?'"
                :lists="practice_types"
                required
              />
            </div>
          </div>
          <div class="flex flex-col">
            <div class="text-xs sm:text-sm mt-3 px-2">Compliance Documents</div>
            <div class="flex flex-row flex-wrap justify-between">
              <div class="flex flex-col w-full md:w-1/2 px-2">
                <AppInput
                  v-model="form.gp_compliance_document_id"
                  :type="'multi-checkbox'"
                  :error="formError.find(item => item.field === 'gp_compliance_document_id')"
                  @checked="form.gp_compliance_document_id.push($event)"
                  @unchecked="uncheckGp($event)"
                  :name="'gp_compliance_document_id'"
                  :label="'For GPs:'"
                  :lists="gp_documents"
                />
              </div>
              <div class="flex flex-col w-full md:w-1/2 px-2">
                <AppInput
                  v-model="form.others_compliance_document_id"
                  :type="'multi-checkbox'"
                  :error="formError.find(item => item.field === 'others_compliance_document_id')"
                  @checked="form.others_compliance_document_id.push($event)"
                  @unchecked="uncheckOther($event)"
                  :name="'others_compliance_document_id'"
                  :label="'For Nurses, et al:'"
                  :lists="others_documents"
                />
              </div>
            </div>
          </div>
          <div class="flex flex-row flex-wrap justify-between">
            <div class="flex flex-col w-full md:w-1/2 px-2">
              <AppInput
                v-model="form.mandatory_training_id"
                :type="'multi-checkbox'"
                :error="formError.find(item => item.field === 'mandatory_training_id')"
                @checked="form.mandatory_training_id.push($event)"
                @unchecked="uncheckMandatory($event)"
                :name="'mandatory_training_id'"
                :label="'Mandatory training required from Locums:'"
                :lists="mandatory_trainings"
              />
            </div>
            <div class="flex flex-col w-full md:w-1/2 px-2">
              <AppInput
                v-model="form.vat_registered"
                :type="'single-checkbox'"
                :name="'vat_registered'"
                :label="'Are you a VAT registered?'"
              />
              <template v-if="form.vat_registered">
                <AppInput
                  v-model="form.vat_number"
                  :type="'text'"
                  :name="'vat_number'"
                  :label="'VAT Number'"
                />
              </template>
            </div>
          </div>
          <div class="flex flex-row flex-wrap justify-between px-2">
            <AppInput
              v-model="form.extra_information"
              :type="'textarea'"
              :name="'extra_information'"
              :label="'Extra Information (Pracking restrictions, transport links, etc.)'"
              :resize="false"
            />
          </div>
          <div class="p-2">
            <AppButton
              :label="'Save changes'"
              :disabled="loading"
              @click="save"
              v-if="authPermissions.includes('Update Profile Practice')"
            />
          </div>
        </div>
      </div>
    </div>

    <AppConfirmationModal
      :label="'Proceed to remove the uploaded document?'"
      :confirmLabel="'Yes'"
      :cancelLabel="'Cancel'"
      :modal="modal"
      @confirm="remove"
      @cancel="modal = false"
    />
  </section>
</template>
<script>
import AppInput from "@/components/Base/AppInput";
import AppButton from "@/components/Base/AppButton";
import AppFormError from "@/components/Base/AppFormError";
import AppLoading from "@/components/Base/AppLoading";
import AppConfirmationModal from "@/components/Base/AppConfirmationModal";
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },
  components: {
    AppInput,
    AppButton,
    AppFormError,
    AppLoading,
    AppConfirmationModal
  },
  computed: {
    authPermissions() {
      return this.$store.getters["auth/permissions"];
    }
  },
  data() {
    return {
      surgery: null,
      vat_registered: false,
      vat_number: "",
      modal: false,
      loading: false,
      input_file_loading: false,
      terms: [],
      form: {
        phone_number: "",
        report_to: "",
        email: "",
        extra_information: "",
        practice_type_id: [],
        mandatory_training_id: [],
        gp_compliance_document_id: [],
        others_compliance_document_id: [],
        use_variation_terms: false,
        vat_registered: false,
        vat_number: null
      },
      name: "",
      formError: []
    };
  },
  watch: {
    modal(value) {
      value
        ? (document.body.style.overflow = "hidden")
        : (document.body.style.overflow = "auto");
    }
  },
  async asyncData({ app, store, redirect, error }) {
    if (app.$auth.user.domain === "Practice") {
      let permissions = app.$auth.user.practice_detail.role.permissions.map(
        permission => permission.name
      );
      if (permissions.includes("View Profile Practice")) {
        try {
          const [
            [surgery, practice],
            practice_types,
            mandatory_trainings,
            [gp_documents, others_documents]
          ] = await Promise.all([
            app.$axios
              .$get("/api/v1/practice/me/practice")
              .then(responsePractice => {
                const surgery =
                  responsePractice.data &&
                  responsePractice.data.practice &&
                  responsePractice.data.practice.surgery
                    ? responsePractice.data.practice.surgery
                    : null;
                const practice =
                  responsePractice.data && responsePractice.data.practice
                    ? responsePractice.data.practice
                    : null;
                console.log("practice", practice);
                return [surgery, practice];
              }),

            app.$axios
              .$get("/api/v1/practice-types")
              .then(responsePracticeTypes => {
                let practice_types =
                  responsePracticeTypes.data &&
                  responsePracticeTypes.data.practice_types &&
                  responsePracticeTypes.data.practice_types.length
                    ? responsePracticeTypes.data.practice_types
                    : [];
                practice_types = practice_types.map(practiceType => {
                  return { label: practiceType.name, value: practiceType.id };
                });
                return practice_types;
              }),

            app.$axios
              .$get("/api/v1/mandatory-trainings")
              .then(responseMandatoryTrainings => {
                let mandatory_trainings =
                  responseMandatoryTrainings.data &&
                  responseMandatoryTrainings.data.mandatory_trainings &&
                  responseMandatoryTrainings.data.mandatory_trainings.length
                    ? responseMandatoryTrainings.data.mandatory_trainings
                    : [];
                mandatory_trainings = mandatory_trainings.map(
                  mandatoryTraining => {
                    return {
                      label: mandatoryTraining.name,
                      value: mandatoryTraining.id
                    };
                  }
                );
                return mandatory_trainings;
              }),

            app.$axios
              .$get("/api/v1/profession-categories")
              .then(responseProfessionCategories => {
                let profession_categories =
                  responseProfessionCategories.data &&
                  responseProfessionCategories.data.profession_categories &&
                  responseProfessionCategories.data.profession_categories.length
                    ? responseProfessionCategories.data.profession_categories
                    : [];

                const gp = profession_categories.find(item => item.id === 1);

                const others = profession_categories.find(
                  item => item.id === 2
                );

                const gp_documents = [
                  ...gp.mandatory_compliance_documents.map(gpMandatoryDoc => {
                    return {
                      value: gpMandatoryDoc.id,
                      label: gpMandatoryDoc.name
                    };
                  }),
                  ...gp.optional_compliance_documents.map(gpOptionalDoc => {
                    return {
                      value: gpOptionalDoc.id,
                      label: gpOptionalDoc.name
                    };
                  })
                ];

                const others_documents = [
                  ...others.mandatory_compliance_documents.map(
                    othersMandatoryDoc => {
                      return {
                        value: othersMandatoryDoc.id,
                        label: othersMandatoryDoc.name
                      };
                    }
                  ),
                  ...others.optional_compliance_documents.map(
                    othersOptionalDoc => {
                      return {
                        value: othersOptionalDoc.id,
                        label: othersOptionalDoc.name
                      };
                    }
                  )
                ];

                return [gp_documents, others_documents];
              })
          ]);

          return {
            surgery,
            practice,
            practice_types,
            mandatory_trainings,
            gp_documents,
            others_documents
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
      } else if (permissions.includes("View Profile Users")) {
        redirect(`/profile/users`);
      } else if (permissions.includes("View Profile Practice Document")) {
        redirect(`/profile/practice-documents`);
      } else {
        error({ statusCode: 401, message: "Your Practice is Not Authorized" });
      }
    }
  },
  mounted() {
    this.form.phone_number = this.practice.phone_number;
    this.form.report_to = this.practice.report_to;
    this.form.email = this.practice.email;
    this.form.extra_information = this.practice.extra_information;
    this.practice.practice_types.forEach(item => {
      this.form.practice_type_id.push(item.id);
    });
    this.practice.mandatory_trainings.forEach(item => {
      this.form.mandatory_training_id.push(item.id);
    });
    this.practice.gp_compliance_documents.forEach(item => {
      this.form.gp_compliance_document_id.push(item.id);
    });
    this.practice.others_compliance_documents.forEach(item => {
      this.form.others_compliance_document_id.push(item.id);
    });
    this.form.use_variation_terms = this.practice.use_variation_terms;
  },
  methods: {
    onFileInput(e) {
      if (!e.target.files.length) {
        return;
      }
      console.log(e);
      this.formError = [];
      let types = ["pdf", "jpeg", "msword", "tiff", "docx"];
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
      let variation_terms_file = {
        filename: file.name,
        size: file.size,
        subtype: file.type.split("/")[1],
        type: file.type.split("/")[0]
      };
      const formData = new FormData();
      formData.append("file", file);
      this.input_file_loading = true;
      this.$axios
        .$post(`/api/v1/practice/me/practice/variation-terms`, formData)
        .then(res => {
          this.practice.variation_terms_file = variation_terms_file;
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [res.message]
          });
        })
        .catch(err => {
          console.log("err", err.response);
          if (err.response.status === 500) {
            if (err.response.data.message.includes("File size")) {
              this.formError.push({
                field: "use_standard_terms",
                message: err.response.data.message
              });
            } else {
              this.formError.push({
                field: "",
                message: "Something went wrong"
              });
            }
          }
        })
        .finally(() => {
          this.input_file_loading = false;
        });
    },
    uncheckPractice(value) {
      this.form.practice_type_id = this.form.practice_type_id.filter(
        id => id != value
      );
    },
    uncheckGp(value) {
      this.form.gp_compliance_document_id = this.form.gp_compliance_document_id.filter(
        id => id != value
      );
    },
    uncheckOther(value) {
      this.form.others_compliance_document_id = this.form.others_compliance_document_id.filter(
        id => id != value
      );
    },
    uncheckMandatory(value) {
      this.form.mandatory_training_id = this.form.mandatory_training_id.filter(
        id => id != value
      );
    },
    remove() {
      this.input_file_loading = true;
      this.modal = false;
      this.$axios
        .$delete(`/api/v1/practice/me/practice/variation-terms`)
        .then(res => {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [res.message]
          });
          this.practice.variation_terms_file = null;
          document.getElementById("file-upload").value = "";
        })
        .catch(err => {
          console.log("err", err.response || err);
          if (err.response.data) {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "danger",
              text: [err.response.data.message]
            });
          }
        })
        .finally(() => {
          this.input_file_loading = false;
        });
    },
    async save() {
      try {
        this.formError = [];
        let notRequired = [
          "mandatory_training_id",
          "extra_information",
          "gp_compliance_document_id",
          "others_compliance_document_id",
          "vat_registered"
        ];
        if (
          this.form.use_variation_terms === false ||
          (this.form.use_variation_terms === true &&
            this.practice.variation_terms_file !== null)
        ) {
          notRequired.push("use_variation_terms");
        } else if (
          this.form.use_variation_terms === true &&
          this.practice.variation_terms_file === null
        ) {
          this.formError.push({
            field: "use_variation_terms",
            message: "use_variation_terms file is required"
          });
        }
        if (["false", false].includes(this.vat_registered)) {
          notRequired.push("vat_number");
        }
        this.Validate(this.form, notRequired);
        if (!this.formError.length) {
          this.loading = true;

          const res = await this.$axios.$put(
            `/api/v1/practice/me/practice`,
            this.form
          );
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [res.message]
          });
          this.loading = false;
          this.scrollToTop();
        } else {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "danger",
            text: ["Please fill up all the forms"]
          });
          this.scrollToTop();
        }
      } catch (err) {
        this.scrollToTop();
        this.loading = false;
        this.formError = err.response.data.error_messages;
      }
    }
  }
};
</script>
<style scoped>
.document-filename {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>



