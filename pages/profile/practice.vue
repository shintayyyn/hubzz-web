<template>
  <section>
    <div class="flex flex-col">
      <div class="h-full flex flex-row flex-wrap justify-between">
        <div class="w-full md:w-2/3 p-1">
          <div class="bg-white rounded-lg shadow-lg p-4 md:p-8 h-full">
            <div class="flex flex-row flex-wrap">
              <div class="flex flex-col w-full md:w-1/3 p-1">
                <div class="text-xs sm:text-sm">Practice name</div>
                <div class="text-xs font-bold py-2">{{surgery.name}}</div>
                <div class="text-xs sm:text-sm mt-4">CCG</div>
                <div class="text-xs font-bold py-2">{{surgery.clinical_commissioning_group.name}}</div>
              </div>
              <div class="flex flex-col w-full md:w-1/3 p-1">
                <div class="text-xs sm:text-sm" mt-4>Practice code</div>
                <div class="text-xs font-bold py-2">{{surgery.code}}</div>
                <div class="text-xs sm:text-sm mt-4">Phone number</div>
                <div class="text-xs font-bold py-2">{{surgery.phone_number}}</div>
              </div>
              <div class="flex flex-col w-full md:w-1/3 p-1">
                <div class="text-xs sm:text-sm">Address</div>
                <div
                  class="text-xs font-bold py-2"
                >{{surgery.address.line_1}} {{surgery.address.line_2}} {{surgery.address.line_3}} {{surgery.address.post_code}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="w-full md:w-1/3 p-1">
          <div class="bg-white rounded-lg shadow-lg p-4 md:p-8 h-full">
            <div class="flex flex-col">
              <AppInput
                v-model="form.use_variation_terms"
                :type="'single-checkbox'"
                :name="'use_variation_terms'"
                :label="'Use Standard Terms with Locum?'"
                :disabled="!authPermissions.includes('Update Profile Practice')"
                :error="formError.find(item => item.field === 'use_variation_terms')"
              />
              <div class="flex flex-row flex-wrap justify-between items-center">
                <div class="text-xs sm:text-sm">Your Practice's standard terms</div>
                <div
                  v-if="authPermissions.includes('Update Profile Practice')"
                  class="relative flex justify-start items-center"
                >
                  <label v-if="loading == false" for="file-upload">
                    <div class="flex flex-row flex-no-wrap cursor-pointer hover:underline">
                      <svgicon name="cloud-upload" height="24" width="24" />
                      <div
                        class="ml-2 text-xs sm:text-sm leading-loose"
                      >{{ practice.variation_terms_file ? 'Update' : 'Upload' }}</div>
                    </div>
                  </label>
                  <input type="file" id="file-upload" class="hidden" @input="onFileInput($event)" />
                </div>
              </div>
              <div class="relative mt-4 bg-gray-300 rounded-lg p-4">
                <!-- <div
                  v-if="form.use_variation_terms"
                  class="absolute top-0 bottom-0 left-0 right-0 rounded-lg p-4 bg-gray-500 opacity-75"
                ></div>-->
                <AppLoading :spinner="false" :loading="loading" :message="'Uploading'" />
                <div v-if="!loading" class="flex flex-no-wrap justify-between items-center">
                  <div
                    class="text-xs sm:text-sm document-filename"
                  >{{ practice.variation_terms_file && practice.variation_terms_file.filename ? practice.variation_terms_file.filename : '' }}</div>
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

      <div class="w-full p-1">
        <div class="bg-white rounded-lg shadow-lg p-4 md:p-8">
          <AppFormError :formError="formError" v-if="formError.length" />
          <div class="flex flex-row flex-wrap justify-between">
            <div class="flex flex-col w-full md:w-1/2 pr-1">
              <AppInput
                v-model="form.phone_number"
                :type="'text'"
                :name="'phone_number'"
                :label="'Phone number'"
                :error="formError.find(item => item.field === 'phone_number')"
                @submit="save"
                @blur="CheckEmptyField(form.phone_number, 'phone_number')"
              />
              <AppInput
                v-model="form.report_to"
                :type="'text'"
                :name="'report_to'"
                :label="'Report to'"
                :error="formError.find(item => item.field === 'report_to')"
                @submit="save"
                @blur="CheckEmptyField(form.report_to, 'report_to')"
              />
              <AppInput
                v-model="form.email"
                :type="'email'"
                :name="'email'"
                :label="'Email Address'"
                :error="formError.find(item => item.field === 'email')"
                @submit="save"
                @blur="CheckEmptyField(form.email, 'email')"
              />
              <!-- <AppInput
                v-model="form.use_variation_terms"
                :type="'select'"
                :name="'type'"
                :label="'Use Variation Terms?'"
                :error="formError.find(item => item.field === 'use_variation_terms')"
                :placeholder="'Select...'"
                :items="[{ value: true , label: 'Yes'},{ value: 'false', label: 'No'}]"
              />-->
            </div>
            <div class="flex flex-col w-full md:w-1/2 pl-1">
              <AppInput
                v-model="form.practice_type_id"
                :type="'multi-checkbox'"
                :error="formError.find(item => item.field === 'practice_type_id')"
                @checked="form.practice_type_id.push($event)"
                @unchecked="uncheckPractice($event)"
                :name="'practice_type_id'"
                :label="'What type of Practice are you?'"
                :lists="practice_types"
              />
            </div>
          </div>
          <div class="flex flex-col">
            <div class="text-xs sm:text-sm mt-3">Compliance Documents</div>
            <div class="flex flex-row flex-wrap justify-between">
              <div class="flex flex-col w-full md:w-1/2 pr-1">
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
              <div class="flex flex-col w-full md:w-1/2 pl-1">
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
            <div class="flex flex-col w-full md:w-1/2 pr-1">
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
            <div class="flex flex-col w-full md:w-1/2 pl-1">
              <AppInput
                v-model="vat_registered"
                :type="'single-checkbox'"
                :name="'vat_registered'"
                :label="'Are you a VAT registered?'"
              />
              <template v-if="vat_registered">
                <AppInput
                  v-model="vat_number"
                  :type="'text'"
                  :name="'vat_number'"
                  :label="'VAT Number'"
                />
              </template>
            </div>
          </div>
          <div class="flex flex-row flex-wrap justify-between">
            <AppInput
              v-model="form.extra_information"
              :type="'textarea'"
              :name="'extra_information'"
              :label="'Extra Information (Pracking restrictions, transport links, etc.)'"
              :resize="false"
            />
          </div>
          <div class="mt-8">
            <AppButton
              :label="'Save changes'"
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
    <!-- <AppConfirmationModal
      :label="'Are you sure you want to change your Practice type? All of your branches/surgeries will be remove.'"
      :confirmLabel="'Yes'"
      :cancelLabel="'Cancel'"
      :modal="practiceTypeConfirmationModal"
      @confirm="confirmPracticeType"
      @cancel="cancelPracticeType"
    />-->
    <!-- <AppConfirmationModal
      :label="'You do not have any Permission'"
      :confirmLabel="'OK'"
      :modal="permissionConfirmationModal"
      @confirm="cancelPracticeType"
    />-->
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
      vat_registered: false,
      vat_number: "",
      modal: false,
      // practiceTypeConfirmationModal: false,
      // permissionConfirmationModal: false,
      loading: false,
      // selectedPracticeType: "",
      // oldPracticeType: "",
      form: {
        phone_number: "",
        report_to: "",
        email: "",
        extra_information: "",
        practice_type_id: [],
        mandatory_training_id: [],
        gp_compliance_document_id: [],
        others_compliance_document_id: [],
        use_variation_terms: false
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
    // practiceType(newValue, oldValue) {
    //   this.oldPracticeType = oldValue;
    // }
    // "form.phone_number"(value) {
    //   this.CheckEmptyField(this.form.phone_number, "phone_number");
    // },
    // "form.report_to"(value) {
    //   this.CheckEmptyField(this.form.report_to, "report_to");
    // },
    // "form.email"(value) {
    //   this.CheckEmptyField(this.form.email, "email");
    // },
    // "form.practice_type_id"(value) {
    //   this.CheckEmptyField(this.form.practice_type_id, "practice_type_id");
    // },
    // "form.mandatory_training_id"(value) {
    //   this.CheckEmptyField(
    //     this.form.mandatory_training_id,
    //     "mandatory_training_id"
    //   );
    // },
    // "form.gp_compliance_document_id"(value) {
    //   this.CheckEmptyField(
    //     this.form.gp_compliance_document_id,
    //     "gp_compliance_document_id"
    //   );
    // },
    // "form.others_compliance_document_id"(value) {
    //   this.CheckEmptyField(
    //     this.form.others_compliance_document_id,
    //     "others_compliance_document_id"
    //   );
    // }
  },
  async asyncData({ app, error }) {
    try {
      const response = await app.$axios.$get(`/api/v1/practice/me/practice`);
      const surgery =
        response.data &&
        response.data.practice &&
        response.data.practice.surgery
          ? response.data.practice.surgery
          : null;
      const practice =
        response.data && response.data.practice ? response.data.practice : null;

      const responsePracticeTypes = await app.$axios.$get(
        `/api/v1/practice-types`
      );
      let practice_types =
        responsePracticeTypes.data &&
        responsePracticeTypes.data.practice_types &&
        responsePracticeTypes.data.practice_types.length
          ? responsePracticeTypes.data.practice_types
          : [];
      practice_types = practice_types.map(practiceType => {
        return { label: practiceType.name, value: practiceType.id };
      });

      const responseMandatoryTrainings = await app.$axios.$get(
        `/api/v1/mandatory-trainings`
      );
      let mandatory_trainings =
        responseMandatoryTrainings.data &&
        responseMandatoryTrainings.data.mandatory_trainings &&
        responseMandatoryTrainings.data.mandatory_trainings.length
          ? responseMandatoryTrainings.data.mandatory_trainings
          : [];
      mandatory_trainings = mandatory_trainings.map(mandatoryTraining => {
        return { label: mandatoryTraining.name, value: mandatoryTraining.id };
      });

      const responseProfessionCategories = await app.$axios.$get(
        `/api/v1/profession-categories`
      );
      let profession_categories =
        responseProfessionCategories.data &&
        responseProfessionCategories.data.profession_categories &&
        responseProfessionCategories.data.profession_categories.length
          ? responseProfessionCategories.data.profession_categories
          : [];
      const gp = profession_categories.find(item => item.id === 1);
      const others = profession_categories.find(item => item.id === 2);
      const gp_documents = [
        ...gp.mandatory_compliance_documents.map(gpMandatoryDoc => {
          return { value: gpMandatoryDoc.id, label: gpMandatoryDoc.name };
        }),
        ...gp.optional_compliance_documents.map(gpOptionalDoc => {
          return { value: gpOptionalDoc.id, label: gpOptionalDoc.name };
        })
      ];
      const others_documents = [
        ...others.mandatory_compliance_documents.map(othersMandatoryDoc => {
          return {
            value: othersMandatoryDoc.id,
            label: othersMandatoryDoc.name
          };
        }),
        ...others.optional_compliance_documents.map(othersOptionalDoc => {
          return { value: othersOptionalDoc.id, label: othersOptionalDoc.name };
        })
      ];

      // const responsePracticeType = await app.$axios.$get(
      //   `/api/v1/practice/me/practice-type`
      // );
      // const practiceType =
      //   responsePracticeType.data &&
      //   responsePracticeType.data.practice &&
      //   responsePracticeType.data.practice.type
      //     ? responsePracticeType.data.practice.type
      //     : null;

      return {
        surgery,
        practice,
        practice_types,
        mandatory_trainings,
        gp_documents,
        others_documents
        // practiceType
      };
    } catch (err) {
      if (err.response && err.response.status === 401) {
        error(err.response.data);
        return;
      }
      throw err;
    }
  },
  mounted() {
    this.form.phone_number = this.practice.phone_number;
    this.form.report_to = this.practice.report_to;
    this.form.email = this.practice.email;
    this.form.extra_information = this.practice.extra_information;
    this.form.use_variation_terms = this.practice.use_variation_terms;
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
  },
  methods: {
    onFileInput(e) {
      if (!e.target.files.length) {
        return;
      }
      this.formError = [];
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
      this.loading = true;
      this.$axios
        .$post(`/api/v1/practice/me/practice/variation-terms`, formData)
        .then(res => {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [res.message]
          });
          this.loading = false;
          this.practice.variation_terms_file =
            res.data.practice.variation_terms_file;
          // this.save();
        })
        .catch(err => {
          console.log("err", err.response);
          if (err.response.status === 500) {
            if (err.response.data.message.includes("File size")) {
              this.formError.push({
                field: "use_variation_terms",
                message: err.response.data.message
              });
            } else {
              this.formError.push({
                field: "",
                message: "Something went wrong"
              });
            }
          }
          // this.formError = err.response.data.error_messages;
        })
        .finally(() => {
          this.loading = false;
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
    // practiceTypeOnchange(value) {
    //   if (this.authPermissions.includes("Update Profile Practice")) {
    //     this.selectedPracticeType = value;
    //     this.practiceTypeConfirmationModal = true;
    //   } else {
    //     this.permissionConfirmationModal = true;
    //   }
    // },
    // cancelPracticeType() {
    //   this.practiceType = this.oldPracticeType;
    //   this.practiceTypeConfirmationModal = false;
    //   this.permissionConfirmationModal = false;
    // },
    // confirmPracticeType() {
    //   this.$axios
    //     .$put(`/api/v1/practice/me/practice-type`, {
    //       type: this.selectedPracticeType
    //     })
    //     .then(res => {
    //       this.practiceTypeConfirmationModal = false;
    //       this.$emit("changeType", res.data.practice.type);
    //       this.$store.commit("SET_NOTIFICATION", {
    //         enabled: true,
    //         status: "success",
    //         text: ["Practice Type Changed"]
    //       });
    //     });
    // },
    remove() {
      this.$axios
        .$delete(`/api/v1/practice/me/practice/variation-terms`)
        .then(res => {
          this.modal = false;
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [res.message]
          });
          this.practice.variation_terms_file = null;
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
          "use_variation_terms"
        ];
        // if (this.practice.variation_terms_file !== null) {
        //   notRequired.push("use_variation_terms");
        // }
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



