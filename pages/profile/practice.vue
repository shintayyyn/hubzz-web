<template>
  <section>
    <div class="flex flex-col">
      <!-- <div class="flex flex-row flex-wrap justify-end">
        <div class="w-full md:w-1/3 p-1">
          <div class="rounded-lg shadow-lg px-2">
            <AppSelect
              v-model="practiceType"
              :name="'type'"
              :label="'Practice Type'"
              :placeholder="'Select...'"
              :items="[{ value: 'Stand Alone', label: 'Stand Alone'},{ value: 'Hub', label: 'Hub'},{ value: 'Spoke', label: 'Spoke'}]"
              @change="practiceTypeOnchange"
            />
          </div>
        </div>
      </div>-->
      <div class="flex flex-row flex-wrap justify-between">
        <div class="w-full md:w-2/3 p-1">
          <div class="rounded-lg shadow-lg p-8 h-full flex items-center">
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
          <div class="flex flex-col">
            <div class="rounded-lg shadow-lg px-4">
              <AppSelect
                v-model="practiceType"
                :name="'type'"
                :label="'Practice Type'"
                :placeholder="'Select...'"
                :items="[{ value: 'Stand Alone', label: 'Stand Alone'},{ value: 'Hub', label: 'Hub'},{ value: 'Spoke', label: 'Spoke'}]"
                @change="practiceTypeOnchange"
              />
            </div>
            <div class="rounded-lg shadow-lg p-4 mt-4">
              <div class="flex flex-col">
                <div class="text-xs sm:text-sm">Your Practice's standard terms</div>
                <div class="mt-4 bg-gray-300 rounded-lg p-4">
                  <div class="flex flex-no-wrap justify-between items-center">
                    <div class="flex text-sm" v-if="uploading">
                      <label for="file-upload">Uploading</label>
                      <div class="spinner">
                        <div class="bounce1"></div>
                        <div class="bounce2"></div>
                        <div class="bounce3"></div>
                      </div>
                    </div>
                    <div
                      v-if="!uploading"
                      class="text-xs sm:text-sm document-filename"
                    >{{ practice.standard_terms && practice.standard_terms.file ? practice.standard_terms.file.filename : '' }}</div>
                    <div
                      class="font-bold text-md sm:text-lg hover:null cursor-pointer text-gray-600 hover:text-black"
                      @click="modal = true"
                      v-if="practice.standard_terms"
                    >x</div>
                  </div>
                </div>
                <div class="relative flex justify-start mt-2 items-center">
                  <label v-if="uploading == false" for="file-upload">
                    <div class="flex flex-row flex-no-wrap cursor-pointer hover:underline">
                      <svgicon name="cloud-upload" height="24" width="24" />
                      <div class="ml-2 text-xs sm:text-sm leading-loose">Upload</div>
                    </div>
                  </label>
                  <input type="file" id="file-upload" class="hidden" @input="onFileInput($event)" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="self-start w-full md:w-3/5 p-2">
          <div class="rounded-lg shadow-lg p-8">
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
        </div>-->
        <!-- <div class="self-start w-full md:w-2/5 p-2">
          <div class="rounded-lg shadow-lg p-8">
            <div class="flex flex-col">
              <div class="text-xs sm:text-sm">Your Practice's standard terms</div>
              <div class="mt-4 bg-gray-300 rounded-lg p-4">
                <div class="flex flex-no-wrap justify-between items-center">
                  <div class="flex text-sm" v-if="uploading">
                    <label for="file-upload">Uploading</label>
                    <div class="spinner">
                      <div class="bounce1"></div>
                      <div class="bounce2"></div>
                      <div class="bounce3"></div>
                    </div>
                  </div>
                  <div
                    v-if="!uploading"
                    class="text-xs sm:text-sm document-filename"
                  >{{ practice.standard_terms && practice.standard_terms.file ? practice.standard_terms.file.filename : '' }}</div>
                  <div
                    class="font-bold text-md sm:text-lg hover:null cursor-pointer text-gray-600 hover:text-black"
                    @click="modal = true"
                    v-if="practice.standard_terms"
                  >x</div>
                </div>
              </div>
              <div class="relative flex justify-start mt-2 items-center">
                <label v-if="uploading == false" for="file-upload">
                  <div class="flex flex-row flex-no-wrap cursor-pointer hover:underline">
                    <svgicon name="cloud-upload" height="24" width="24" />
                    <div class="ml-2 text-xs sm:text-sm leading-loose">Upload</div>
                  </div>
                </label>
                <input type="file" id="file-upload" class="hidden" @input="onFileInput($event)" />
              </div>
            </div>
            <AppLoading :loading="loading" :message="'Loading'" v-if="loading" />
          </div>
        </div>-->
      </div>

      <div class="w-full p-2">
        <div class="rounded-lg shadow-lg p-8">
          <AppFormError :formError="formError" v-if="formError.length" />
          <div class="flex flex-row flex-wrap justify-between">
            <div class="flex flex-col w-full md:w-1/3 pr-1">
              <AppInput
                v-model="form.phone_number"
                :type="'text'"
                :name="'phone_number'"
                :label="'Phone number'"
                :placeholder="''"
              />
              <AppInput
                v-model="form.report_to"
                :type="'text'"
                :name="'report_to'"
                :label="'Report to'"
                :placeholder="''"
              />
              <AppInput
                v-model="form.email"
                :type="'email'"
                :name="'email'"
                :label="'Email Address'"
                :placeholder="''"
              />
              <AppInput
                v-model="form.practice_type_id"
                :type="'multi-checkbox'"
                @checked="form.practice_type_id.push($event)"
                @unchecked="uncheckPractice($event)"
                :name="'practice_type_id'"
                :label="'What type of Practice are you?'"
                :placeholder="''"
                :lists="practice_types"
              />
              <AppTextarea
                v-model="form.extra_information"
                :name="'extra_information'"
                :label="'Extra Information (Pracking restrictions, transport links, etc.)'"
                :placeholder="''"
              />
              <AppInput
                v-model="form.mandatory_training_id"
                :type="'multi-checkbox'"
                @checked="form.mandatory_training_id.push($event)"
                @unchecked="uncheckMandatory($event)"
                :name="'mandatory_training_id'"
                :label="'Mandatory training required from Locums:'"
                :placeholder="''"
                :lists="mandatory_trainings"
              />
            </div>
            <div class="flex flex-col w-full md:w-2/3 pl-1">
              <div class="text-xs sm:text-sm mt-3">Compliance Documents</div>
              <div class="flex flex-row flex-wrap justify-between">
                <div class="flex flex-col w-full md:w-1/2 pr-1">
                  <AppInput
                    v-model="form.gp_compliance_document_id"
                    :type="'multi-checkbox'"
                    @checked="form.gp_compliance_document_id.push($event)"
                    @unchecked="uncheckGp($event)"
                    :name="'gp_compliance_document_id'"
                    :label="'For GPs:'"
                    :placeholder="''"
                    :lists="gp_documents"
                  />
                </div>
                <div class="flex flex-col w-full md:w-1/2 pl-1">
                  <AppInput
                    v-model="form.others_compliance_document_id"
                    :type="'multi-checkbox'"
                    @checked="form.others_compliance_document_id.push($event)"
                    @unchecked="uncheckOther($event)"
                    :name="'others_compliance_document_id'"
                    :label="'For Nurses, et al:'"
                    :placeholder="''"
                    :lists="others_documents"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="mt-8">
            <AppButton :label="'Save changes'" @click="save()" />
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
    <AppConfirmationModal
      :label="'Are you sure you want to change your Practice type? All of your branches/surgeries will be remove.'"
      :confirmLabel="'Yes'"
      :cancelLabel="'Cancel'"
      :modal="practiceTypeConfirmationModal"
      @confirm="confirmPracticeType"
      @cancel="cancelPracticeType"
    />
  </section>
</template>
<script>
import AppInput from "@/components/Base/AppInput";
import AppSelect from "@/components/Base/AppSelect";
import AppTextarea from "@/components/Base/AppTextarea";
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
    AppSelect,
    AppTextarea,
    AppButton,
    AppFormError,
    AppLoading,
    AppConfirmationModal
  },
  data() {
    return {
      modal: false,
      practiceTypeConfirmationModal: false,
      loading: false,
      selectedPracticeType: "",
      oldPracticeType: "",
      form: {
        email: "",
        phone_number: "",
        report_to: "",
        extra_information: "",
        practice_type_id: [],
        mandatory_training_id: [],
        gp_compliance_document_id: [],
        others_compliance_document_id: []
      },
      name: "",
      uploading: false,
      formError: []
    };
  },
  watch: {
    modal(value) {
      value
        ? (document.body.style.overflow = "hidden")
        : (document.body.style.overflow = "auto");
    },
    practiceType(newValue, oldValue) {
      this.oldPracticeType = oldValue;
    },
    "form.phone_number"(value) {
      if (value) {
        this.formError = this.formError.filter(
          err => err.field !== "phone_number"
        );
      }
    },
    "form.report_to"(value) {
      if (value) {
        this.formError = this.formError.filter(
          err => err.field !== "report_to"
        );
      }
    },
    "form.email"(value) {
      if (value) {
        this.formError = this.formError.filter(err => err.field !== "email");
      }
    },
    "form.extra_information"(value) {
      if (value) {
        this.formError = this.formError.filter(
          err => err.field !== "extra_information"
        );
      }
    },
    "form.practice_type_id"(value) {
      if (value.length) {
        this.formError = this.formError.filter(
          err => err.field !== "practice_type_id"
        );
      }
    },
    "form.mandatory_training_id"(value) {
      if (value.length) {
        this.formError = this.formError.filter(
          err => err.field !== "mandatory_training_id"
        );
      }
    },
    "form.gp_compliance_document_id"(value) {
      if (value.length) {
        this.formError = this.formError.filter(
          err => err.field !== "gp_compliance_document_id"
        );
      }
    },
    "form.others_compliance_document_id"(value) {
      if (value.length) {
        this.formError = this.formError.filter(
          err => err.field !== "others_compliance_document_id"
        );
      }
    }
  },
  async asyncData({ app, error }) {
    const response = await app.$axios.$get(`/api/v1/me`);
    const surgery =
      response.data &&
      response.data.user &&
      response.data.user.practice_detail &&
      response.data.user.practice_detail.practice &&
      response.data.user.practice_detail.practice.surgery
        ? response.data.user.practice_detail.practice.surgery
        : null;
    const practice =
      response.data &&
      response.data.user &&
      response.data.user.practice_detail &&
      response.data.user.practice_detail.practice
        ? response.data.user.practice_detail.practice
        : null;

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
        return { value: othersMandatoryDoc.id, label: othersMandatoryDoc.name };
      }),
      ...others.optional_compliance_documents.map(othersOptionalDoc => {
        return { value: othersOptionalDoc.id, label: othersOptionalDoc.name };
      })
    ];

    const responsePracticeType = await app.$axios.$get(
      `/api/v1/practice/me/practice-type`
    );
    const practiceType =
      responsePracticeType.data &&
      responsePracticeType.data.practice &&
      responsePracticeType.data.practice.type
        ? responsePracticeType.data.practice.type
        : null;

    return {
      surgery,
      practice,
      practice_types,
      mandatory_trainings,
      gp_documents,
      others_documents,
      practiceType
    };
  },
  created() {
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
  },
  methods: {
    onFileInput(e) {
      if (!e.target.files.length) {
        return;
      }
      let types = ["pdf", "jpeg", "msword", "tif"];
      let file = e.target.files[0];
      let fileType = file.type.split("/")[1];
      if (!types.includes(fileType)) {
        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "alert",
          text: "Invalid File Format"
        });
        return;
      }
      const formData = new FormData();
      formData.append("file", file);
      this.loading = true;
      this.$axios
        .$put(`/api/v1/practice/me/standard-terms`, formData)
        .then(res => {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [res.message]
          });
          this.loading = false;
        });
      this.practice.standard_terms = {
        file: {
          filename: file.name
        }
      };
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
    practiceTypeOnchange(value) {
      this.selectedPracticeType = value;
      console.log(value);
      this.practiceTypeConfirmationModal = true;
    },
    cancelPracticeType() {
      this.practiceType = this.oldPracticeType;
      this.practiceTypeConfirmationModal = false;
    },
    confirmPracticeType() {
      this.$axios
        .$put(`/api/v1/practice/me/practice-type`, {
          type: this.selectedPracticeType
        })
        .then(res => {
          this.practiceTypeConfirmationModal = false;
          this.$store.commit(
            "profile/SET_PRACTICE_TYPE",
            res.data.practice.type
          );
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: ["Practice Type Changed"]
          });
        });
    },
    remove() {
      this.loading = true;
      this.$axios.$delete(`/api/v1/practice/me/standard-terms`).then(res => {
        this.loading = false;
        this.modal = false;
        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "success",
          text: [res.message]
        });
        // this.practice.standard_terms.file.filename = null
        this.practice.standard_terms = null;
        // standard_terms)
      });
    },
    async save() {
      try {
        this.formError = [];
        this.Validate(this.form, [
          "mandatory_training_id",
          "extra_information"
        ]);
        if (!this.formError.length) {
          const res = await this.$axios.$put(
            `/api/v1/practice/me/profile`,
            this.form
          );
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [res.message]
          });
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



