<template>
  <section :class="isPage ? '' : 'modal-container'">
    <AppLoading :loading="loading" spinner :message="'Loading Job'" />
    <transition name="fade">
      <div
        v-if="permanent_job || permanent_job_application"
        :class="isPage ? 'px-2' : 'relative p-4 md:p-8'"
      >
        <template v-if="!isPage">
          <nuxt-link :to="{ path: `/permanent-jobs`, query: $route.query }">
            <svgicon
              name="left-arrow"
              height="32"
              width="32"
              class="cursor-pointer"
            />
          </nuxt-link>
        </template>
        <div
          class="flex flex-row flex-wrap justify-start items-center pt-3 pb-4"
        >
          <h4 class="text-lg md:text-xl font-bold flex items-center">
            <span>{{ permanent_job.title }}</span>
          </h4>
          <span
            v-if="permanent_job_application"
            class="ml-2 py-2 rounded my-1 font-semibold"
            :class="
              statusStyle(
                permanent_job_application.application_status === 'Rejected'
                  ? null
                  : permanent_job.job_posting_status
              )
            "
          >{{
            permanent_job_application.application_status === "Rejected"
              ? null
              : permanent_job.job_posting_status
          }}</span>

          <span
            class="mx-2 py-1 px-4 rounded my-1 font-semibold"
            :class="statusStyle(permanent_job.status)"
          >{{
            permanent_job_application &&
              permanent_job_application.application_status_formatted
              ? permanent_job_application.application_status_formatted
              : permanent_job.status
          }}</span>

          <span
            v-if="
              (permanent_job.job_posting_status === 'Closed' &&
                !permanent_job_application) ||
                (permanent_job.job_posting_status === 'Closed' &&
                permanent_job_application &&
                permanent_job_application.application_status !== 'Rejected')
            "
            class="mr-2 py-1 px-4 rounded font-semibold bg-yellow-500"
          >{{ jobClosingTag(permanent_job) }}</span>

          <AppButton
            v-if="
              permanent_job.status == 'Available' ||
                (permanent_job_application &&
                permanent_job_application.rejected_by_locum_at !== null)
            "
            class="mx-2"
            :label="toApply ? 'Cancel' : 'Apply'"
            @click="toApply = !toApply"
          />
          <!-- <AppButton
          v-if="permanent_job.status == 'Applied'"
          class="mx-2"
          :label="'Cancel Application'"
          @click="cancelApplication()"
				/>-->
        </div>

        <div
          v-if="toApply === true"
          class="w-full md:w-2/5 p-2 pb-4 absolute shadow bg-white rounded-lg z-50 left-0 md:left-auto"
        >
          <div class="mx-4 mt-4">
            <div class="w-full">
              <p class="font-bold text-sm">
                Please attach your latest CV
              </p>
              <p class="text-sm">
                Write a short description about yourself (Optional)
              </p>
              <div class="mb-3 md:mb-6">
                <no-ssr placeholder="Loading..." class>
                  <quill-editor
                    ref="myTextEditor"
                    v-model="job_application.job_application_pitch"
                    class="bg-white text-black border-b-2"
                    :options="editorOption"
                    @focus="onEditorFocus($event)"
                    @ready="onEditorReady($event)"
                  />
                </no-ssr>

                <p
                  class="text-sm w-full flex items-center justify-end mt-1"
                  :class="
                    jobApplicationPitchLength > 2000
                      ? 'text-red-500'
                      : 'text-gray-600'
                  "
                >
                  <svgicon
                    v-if="jobApplicationPitchLength > 2000"
                    name="exclamation-mark"
                    width="12"
                    height="12"
                    class="fill-current mr-1"
                  />
                  {{ jobApplicationPitchLength }}/2000
                </p>
              </div>
            </div>
            <div
              class="flex flex-col md:flex-row justify-between items-center w-full"
            >
              <AppButton
                class="my-1"
                :label="'Send Application'"
                :disabled="
                  !canApply ||
                    jobApplicationPitchLength > 2000 ||
                    (!job_application.job_application_pitch &&
                    !job_application.file)
                "
                @click="apply()"
              />
              <label
                class="my-1 leading-loose cursor-pointer text-black flex items-center justify-center rounded-lg transition-hover border border-yellow-500 text-sm px-4"
                :class="uploadedFile ? '' : 'hover:bg-yellow-500 '"
              >
                <input
                  id="coverEmail"
                  type="file"
                  name="coverEmail"
                  class="inputfile hidden"
                  accept="image/jpeg, .pdf, .doc, .docx, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  @input="uploadFile($event)"
                >
                <svgicon
                  name="cloud-upload"
                  height="18"
                  width="18"
                  class="mr-2"
                />
                {{ uploadedFile ? "Update File" : "Upload File" }}
              </label>
            </div>
            <div v-if="uploadedFile" class="text-xs flex flex-col items-end">
              <p>{{ uploadedFile | StringMaxLength(25) }}</p>
              <p
                class="text-right cursor-pointer hover:underline text-red-500"
                @click="(uploadedFile = ''), (job_application.file = '')"
              >
                Remove File
              </p>
            </div>
          </div>

          <p v-if="!canApply" class="text-sm px-4 text-red-500">
            CV is not uploaded yet. Upload
            <nuxt-link to="/compliance" class="underline text-red-500">
              here
            </nuxt-link>.
          </p>
        </div>
        <div
          v-if="permanent_job.job_posting_status === 'Closed'"
          class="bg-red-300 p-4 rounded-lg my-2"
        >
          Closed At: {{ permanent_job.closed_at_in_gb_formatted }}
          <!-- Closed At: {{ $moment(permanent_job.closed_at, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]').format('DD/MM/YYYY, h:mm:ss a') }} -->
          <!-- This Job Posting has been closed by the Practice for the reason that someone might have already been hired {{ jobClosingTag(permanent_job.hired_through) }} -->
        </div>
        <div
          v-if="
            permanent_job.job_posting_status !== 'Closed' &&
              permanent_job_application &&
              permanent_job_application.invitation_schedule_formatted &&
              ['For Interview', 'Accepted'].includes(
                permanent_job_application.application_status
              )
          "
          class="bg-gray-200 p-2 my-4 rounded-lg shadow"
        >
          <span class="font-bold block">Congratulations!</span>
          <!-- You have been invited for interview. Please attend on {{ $moment(permanent_job_application.invitation_schedule_formatted_formatted, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]').format('DD/MM/YYYY, h:mm:ss a') }} GMT -->
          <span
            v-if="
              permanent_job_application.application_status === 'For Interview'
            "
          >You have been invited for interview on
            {{ permanent_job_application.invitation_schedule_formatted }}
            GMT</span>
          <span
            v-if="permanent_job_application.application_status === 'Accepted'"
          >Your interview will be on
            {{ permanent_job_application.invitation_schedule_formatted }}
            GMT</span>
          <div
            v-if="
              permanent_job_application.application_status === 'For Interview'
            "
            class="flex"
          >
            <div class="pb-2 mr-4">
              <input
                id="approveInterview"
                v-model="approveInterview"
                type="radio"
                name="approveInterview"
                :value="'Accepted'"
              >
              <label for="approveInterview">Accept</label>
            </div>
            <div class="pb-2">
              <input
                id="declineInterview"
                v-model="approveInterview"
                type="radio"
                name="approveInterview"
                :value="'Rejected'"
              >
              <label for="declineInterview">Decline</label>
            </div>
          </div>
          <AppButton
            v-if="
              permanent_job_application.application_status === 'For Interview'
            "
            :label="'Submit Response'"
            :inStyle="'fontSize: 14px'"
            @click="submitResponse()"
          />
        </div>

        <div class="flex flex-col md:flex-row">
          <div class="w-full md:w-3/5 lg:w-2/3 pr-2">
            <div
              v-if="
                permanent_job_application &&
                  permanent_job_application.rejected_by_locum_at !== null
              "
              class="text-xs text-red-500"
            >
              * You have rejected an invitation for interview for this job on
              {{
                permanent_job_application &&
                  permanent_job_application.rejected_by_locum_at_in_gb_formatted
                  ? permanent_job_application.rejected_by_locum_at_in_gb_formatted
                  : null
              }}
            </div>
            <div
              class="bg-white rounded-lg border p-4 flex flex-col lg:flex-row"
            >
              <div class="w-full lg:w-1/2">
                <p class="font-bold text-xs sm:text-sm">
                  Practice
                </p>
                <p class="pl-2 pb-3">
                  {{ permanent_job ? permanent_job.practice_name : null }}
                </p>
                <p class="font-bold text-xs sm:text-sm">
                  Description
                </p>
                <!-- <div class="my-4">
								<span v-html="permanent_job ? permanent_job.description : null"></span>
							</div>-->
                <p
                  v-if="
                    !permanent_job.description &&
                      !permanent_job.description_file
                  "
                  class="mb-3 ml-2"
                >
                  (none)
                </p>
                <div v-if="permanent_job.description">
                  <no-ssr>
                    <quill-editor
                      class="border-none pl-2"
                      :options="options"
                      :content="permanent_job.description"
                      disabled
                    />
                  </no-ssr>
                </div>
                <div
                  v-if="permanent_job.description_file"
                  class="flex flex-row items-start mt-2 ml-2 pb-3"
                >
                  <div class="flex items-center">
                    <a
                      class="text-sm leading-tight mr-1"
                      :href="permanent_job.description_file.url"
                      :download="permanent_job.description_file.filename"
                      target="_blank"
                      @click.prevent="
                        downloadItem(
                          permanent_job.description_file.url,
                          permanent_job.description_file.filename
                        )
                      "
                    >
                      <span>
                        <svgicon name="cloud-download" height="24" width="24" />
                      </span>
                    </a>
                    <span
                      v-if="
                        permanent_job.description_file.subtype === 'jpeg' ||
                          permanent_job.description_file.subtype === 'pdf'
                      "
                      class="mx-2 hover:text-gray-800 cursor-pointer"
                      @click="
                        viewFile = { file: permanent_job.description_file }
                      "
                    >
                      <svgicon
                        name="eye"
                        class="fill-current"
                        height="20"
                        width="20"
                      />
                    </span>
                  </div>

                  <p>{{ permanent_job.description_file.filename }}</p>
                </div>
                <p class="font-bold text-xs sm:text-sm">
                  Salary
                </p>
                <p
                  v-if="permanent_job && permanent_job.salary_amount !== 0"
                  class="ml-2 mb-3"
                >
                  £ {{ permanent_job.salary_amount | currency }}
                </p>
                <p v-else class="pl-2 pb-3">
                  N/A
                </p>
                <p class="font-bold text-xs sm:text-sm">
                  Salary Description
                </p>
                <p class="pl-2 pb-3">
                  {{
                    permanent_job && permanent_job.salary_description_2
                      ? permanent_job.salary_description_2
                      : "N/A"
                  }}
                </p>
                <p class="font-bold text-xs sm:text-sm">
                  Posted
                </p>
                <p class="pl-2 pb-3">
                  {{
                    permanent_job
                      ? $moment(permanent_job.date_posted).format("DD/MM/YYYY")
                      : null
                  }}
                </p>
                <p class="font-bold text-xs sm:text-sm">
                  Closes
                </p>
                <p class="pl-2 pb-3">
                  {{
                    permanent_job
                      ? $moment(permanent_job.date_closing).format("DD/MM/YYYY")
                      : null
                  }}
                </p>
              </div>
              <div class="w-full lg:w-1/2">
                <p class="font-bold text-xs sm:text-sm">
                  Report to
                </p>
                <p class="pl-2 pb-3">
                  {{ permanent_job ? permanent_job.report_to : null }}
                </p>
                <p class="font-bold text-xs sm:text-sm">
                  Email
                </p>
                <p class="pl-2 pb-3">
                  {{ permanent_job ? permanent_job.email : null }}
                </p>
                <p class="font-bold text-xs sm:text-sm">
                  Role
                </p>
                <p class="pl-2 pb-3">
                  {{ permanent_job ? permanent_job.profession_name : null }}
                </p>
                <p class="font-bold text-xs sm:text-sm">
                  Job Type
                </p>
                <p class="pl-2 pb-3">
                  {{ permanent_job ? permanent_job.work_hours : null }}
                </p>

                <p class="font-bold text-xs sm:text-sm">
                  Industry
                </p>
                <p class="pl-2 pb-3">
                  {{ permanent_job ? permanent_job.industry_type : null }}
                </p>
              </div>
            </div>
            <AppButton
              v-if="
                (permanent_job.job_posting_status === 'Available' &&
                  !permanent_job_application) ||
                  (permanent_job.job_posting_status === 'Available' &&
                  permanent_job_application &&
                  permanent_job_application.application_status !== 'Rejected')
              "
              class="my-2 mt-4"
              label="Share with a friend"
              @click="toShowLink = !toShowLink"
            />
            <div v-if="toShowLink" class="rounded-lg p-4 border mb-2">
              <div
                class="text-sm md:text-base font-semibold flex flex-wrap items-center px-2"
              >
                <div class>
                  {{
                    `${site}/shared-permanent-job/${
                      permanent_job && permanent_job.id
                        ? permanent_job.id
                        : null
                    }`
                  }}
                </div>
                <AppButton
                  class="ml-4"
                  :label="'Copy Link'"
                  @click="
                    copyToClipboard(
                      `${site}/shared-permanent-job/${
                        permanent_job && permanent_job.id
                          ? permanent_job.id
                          : null
                      }`
                    )
                  "
                />
              </div>
            </div>
          </div>
          <div class="w-full md:w-2/5 lg:w-1/3 md:pl-2">
            <PermanentJobMap
              v-if="permanent_job"
              :permanent_job="permanent_job"
            />
          </div>
        </div>
        <transition name="slide" mode="out-in">
          <div v-if="viewFile" class="modal-container">
            <FileModal :file="viewFile" @close="viewFile = null" />
          </div>
        </transition>
        <div v-if="viewFile" class="shield file" @click="viewFile = null" />
      </div>
    </transition>
  </section>
</template>
<script>
import AppButton from "@/components/Base/AppButton";
import AppLoading from "@/components/Base/AppLoading";
import PermanentJobMap from "@/components/PermanentJob/PermanentJobMap";
import FileModal from "@/components/FileModal";
export default {
  components: {
    AppButton,
    AppLoading,
    PermanentJobMap,
    FileModal
  },
  props: {
    isPage: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      viewFile: null,
      approveInterview: "",
      toApply: false,
      toShowLink: false,
      site: "",
      loading: false,
      job_application: {
        locum_user_id: "",
        job_application_pitch: "",
        file: ""
      },
      job: {
        description: "",
        applied: false
      },
      options: {
        modules: {
          toolbar: null
        }
      },
      permanent_job: "",
      permanent_job_applications: "",
      permanent_job_application: "",

      uploadedFile: null,

      canApply: false,

      // quill
      editorOption: {
        placeholder: "About me",
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            ["blockquote", "code-block"],
            [{ header: 1 }, { header: 2 }],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ script: "sub" }, { script: "super" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ direction: "rtl" }],
            [{ size: ["small", false, "large", "huge"] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ font: [] }],
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
            ["clean"],
            ["link"]
          ]
        }
      },

      links: []
    };
  },

  computed: {
    jobApplicationPitchLength() {
      return (
        this.job_application.job_application_pitch.replace(/(<([^>]+)>)/gi, "")
          .length || 0
      );
    }
  },

  watch: {
    approveInterview(value) {
      console.log("accept?", value);
    }
  },

  async beforeMount() {
    this.loading = true;
    // this.site = await window && window.location.origin ? window.location.origin :"https://locum.halcyondigitalhost.com/"
    this.site = await window.location.origin;
  },
  async created() {
    let complianceDocs = [];
    await this.$axios
      .$get(`/api/v1/locum/locum-compliance-documents`)
      .then(res => {
        complianceDocs = res.data.locum_compliance_documents;
        const found = complianceDocs.find(
          complianceDoc => complianceDoc.compliance_document.name == "CV"
        );
        if (found) {
          this.canApply = true;
        }
      });

    await this.getJob();
  },
  methods: {
    async getJob() {
      let permanent_job = "";
      let permanent_job_applications = "";
      let permanent_job_application = "";

      const params = {
        locum_user_id: this.$auth.user.id,
        permanent_job_id: this.$route.params.id
      };
      //new logic
      await this.$axios
        .$get(`/api/v1/locum/permanent-jobs/${this.$route.params.id}`)
        .then(res => {
          permanent_job = res.data.permanent_job;
          let status =
            permanent_job.job_posting_status !== "Available"
              ? ["Unfilled", "Closed"].includes(
                permanent_job.job_posting_status
              )
                ? "Closed"
                : permanent_job.job_posting_status
              : "Available";

          this.links = [
            {
              title: "Salaried Roles",
              url: `/permanent-jobs${
                status !== "Available" ? "/?status=" + status : ""
              }`
            },
            {
              title: permanent_job.title
            }
          ];
          this.loading = false;
        });
      //end

      await this.$axios
        .$get(`/api/v1/locum/permanent-job-applications`, { params })
        .then(res => {
          permanent_job_applications = res.data.permanent_job_applications;
        });

      permanent_job_application = permanent_job_applications.find(
        item => item.permanent_job_id === permanent_job.id
      );

      this.permanent_job_application = permanent_job_application;

      if (this.permanent_job_application) {
        permanent_job.status = this.permanent_job_application.application_status;
        this.permanent_job = permanent_job;
      } else if (permanent_job.job_posting_status === "Closed") {
        permanent_job.status = "Closed";
        this.permanent_job = permanent_job;
      } else if (permanent_job.job_posting_status === "Unfilled") {
        permanent_job.status = "Unfilled";
        this.permanent_job = permanent_job;
      } else if (permanent_job.job_posting_status === "Available") {
        permanent_job.status = "Available";
        this.permanent_job = permanent_job;
      }
    },

    copyToClipboard(text) {
      // 1) Add the text to the DOM (usually achieved with a hidden input field)
      const input = document.createElement("input");
      input.setAttribute("id", "copiedText");
      document.body.appendChild(input);
      input.value = text;

      // 2) Select the text
      input.focus();
      input.select();

      // 3) Copy text to clipboard
      const isSuccessful = document.execCommand("copy");

      // 4) Catch errors
      if (!isSuccessful) {
        console.error("Failed to copy text.");
      } else {
        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "success",
          text: [`Copied to Clipboard`]
        });
        let copiedText = document.getElementById("copiedText");
        copiedText.parentNode.removeChild(copiedText);
      }
    },

    onEditorBlur(editor) {
      console.log("editor blur!", editor);
    },

    onEditorFocus(editor) {
      console.log("editor focus!", editor);
    },

    onEditorReady(editor) {
      console.log("editor ready!", editor);
    },

    uploadFile(e) {
      let types = [
        "pdf",
        "jpeg",
        "msword",
        "vnd.openxmlformats-officedocument.wordprocessingml.document",
        "vnd.openxmlformats-officedocument.wordprocessingml.template",
        "vnd.ms-word.document.macroEnabled.12",
        "vnd.ms-word.template.macroEnabled.12"
      ];
      let file = e.target.files[0];
      this.file;
      let fileType = file.type.split("/")[1];
      if (!types.includes(fileType)) {
        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "alert",
          text: ["Invalid File Format"]
        });
        return;
      }
      this.job_application.file = file;
      this.uploadedFile = file.name;
    },

    async apply() {
      if (this.canApply === false) {
        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "danger",
          text: ["Please Upload your CV first in Compliance Documents Page"]
        });
      } else {
        this.job_application.locum_user_id = this.$auth.user.id;
        if (
          this.job_application.job_application_pitch ||
          this.job_application.file
        ) {
          const formData = new FormData();
          formData.append("locum_user_id", this.$auth.user.id);
          if (this.job_application.job_application_pitch) {
            formData.append(
              "job_application_pitch",
              this.job_application.job_application_pitch
            );
          }
          if (this.job_application.file) {
            formData.append("file", this.job_application.file);
          }
          await this.$axios
            .$put(
              `/api/v1/locum/permanent-job-applications/${this.permanent_job.id}/apply`,
              formData
            )
            .then(() => {
              this.job.applied = true;
              this.toApply = false;
              this.$store.commit("SET_NOTIFICATION", {
                enabled: true,
                status: "success",
                text: ["You have successfully Applied to this job"]
              });
              this.getJob();
            });
        }
      }
    },

    async cancelApplication() {
      await this.$axios
        .$delete(
          `/api/v1/locum/permanent-job-applications/${this.permanent_job_application.id}/delete-application`
        )
        .then(res => {
          this.$router.push("/permanent-jobs");
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [res.message]
          });
        });
    },

    statusStyle(jobStatus) {
      switch (jobStatus) {
      case "Available":
        return "px-4 bg-green-500 text-white";
      case "Applied":
        return "px-4 bg-yellow-600 text-white";
      case "For Interview":
        return "px-4 bg-green-800 text-white";
      case "Accepted":
      case "Hired":
      case "Offered":
        return "px-4 bg-green-700 text-white";
      case "Rejected":
        return "px-4 bg-red-700 text-white";
      case "Closed":
        return "px-4 bg-gray-700 text-white";
      case "Unsuccessful":
      case "Unfilled":
        return "px-4 bg-gray-400";
      default:
        return;
      }
    },

    jobClosingTag(item) {
      let closingTag = "";
      if (
        this.permanent_job_application &&
        this.permanent_job_application.application_status === "Rejected"
      ) {
        closingTag = "Rejected";
      } else {
        closingTag = item.hired_through;
      }

      switch (closingTag) {
      case "Filled through HUBZZ":
        return "Filled through HUBZZ";
      case "Filled through Recruitment Agency":
        return "Filled through Recruitment Agency";
      case "Filled by Direct Applicant":
        return "Filled by Direct Applicant";
      case "Filled by Advert":
        return "Filled by Advert";
      case "Filled Internally":
        return "Filled Internally";
      case "Withdrawn":
        return "Withdrawn";
      case "Unfilled":
        return "Unfilled";
      default:
        return "Closed By Practice";
      }
    },

    submitResponse() {
      this.$axios
        .$put(
          `/api/v1/locum/permanent-job-applications/${this.permanent_job.id}/accept-or-reject-invitation/${this.permanent_job_application.id}`,
          {
            application_status: this.approveInterview
          }
        )
        .then(res => {
          this.getJob();
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
      });
    }
  }
};
</script>

<style scoped>
.modal-container {
  z-index: 510;
}
.ql-container {
  max-height: 350px;
  overflow-y: auto;
}
@media screen and (min-width: 1200px) {
  .modal-container {
    width: 80%;
  }
}
</style>
