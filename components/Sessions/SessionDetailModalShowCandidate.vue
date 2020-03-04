<template>
  <section>
    <div class="p-4 md:p-8 max-w-3xl">
      <div class="flex items-center">
        <svgicon
          name="left-arrow"
          height="32"
          width="32"
          @click="$emit('close')"
          class="cursor-pointer"
        />
        <button class="mx-4 focus:outline-none" @click.prevent.stop="message(user)">
          <svgicon name="chat" height="32" width="32" color="#888 #555 #fff" />
        </button>
      </div>
      <div class="flex flex-row flex-no-wrap justify-start mt-4 md:mt-8">
        <div class="font-bold text-md sm:text-lg">{{user.personal_detail.name}}</div>
      </div>
      <div class="flex flex-row flex-wrap justify-between mt-4">
        <div class="w-full pr-0 lg:pr-2 lg:w-1/2">
          <div class="bg-white rounded-lg shadow-lg p-4 md:p-8">
            <div class="float-right">
              <AppAvatar
                :height="'80px'"
                :width="'80px'"
                :src="user.avatar && user.avatar.file && user.avatar.file.url ? user.avatar.file.url : ''"
              />
            </div>
            <div class="font-bold text-sm sm:text-md">Candidate</div>
            <div class="text-xs sm:text-sm mb-4 md:mb-8">{{user.locum_detail.profession.name}}</div>
            <div class="font-bold text-sm sm:text-md">Headline</div>
            <div class="text-xs sm:text-sm mb-4 md:mb-8">{{user.locum_detail.headline}}</div>
            <div class="font-bold text-sm sm:text-md">Biography</div>
            <div class="text-xs sm:text-sm mb-4 md:mb-8">{{user.locum_detail.short_biography}}</div>
            <div class="font-bold text-sm sm:text-md">GMC / NMC Number</div>
            <div
              class="text-xs sm:text-sm mb-4 md:mb-8"
            >{{user.locum_detail.gmc_or_nmc_number.number}}</div>
            <div class="font-bold text-sm sm:text-md">MPL / NPL Number</div>
            <div
              class="text-xs sm:text-sm mb-4 md:mb-8"
            >{{user.locum_detail.mpl_or_npl_number.number}}</div>
            <div class="font-bold text-sm sm:text-md">Specialty</div>
            <div class="text-xs sm:text-sm mb-4 md:mb-8 flex flex-row flex-wrap">
              <div
                class="rounded-lg bg-yellow-500 p-2 m-1"
                v-for="item in user.locum_detail.qualifications"
                :key="item.id"
              >{{item.name}}</div>
            </div>
            <div class="font-bold text-sm sm:text-md">Clinical systems</div>
            <div class="text-xs sm:text-sm mb-4 md:mb-8 flex flex-row flex-wrap">
              <div
                class="rounded-lg bg-yellow-500 p-2 m-1"
                v-for="item in user.locum_detail.clinical_systems"
                :key="item.id"
              >{{item.name}}</div>
            </div>
            <div class="font-bold text-sm sm:text-md">Languages</div>
            <div class="text-xs sm:text-sm mb-4 md:mb-8 flex flex-row flex-wrap">
              <div class="rounded-lg bg-yellow-500 p-2 m-1">English</div>
              <div
                class="rounded-lg bg-yellow-500 p-2 m-1"
                v-for="item in user.locum_detail.spoken_languages"
                :key="item.id"
              >{{item.name}}</div>
            </div>
          </div>
        </div>
        <div class="w-full pl-0 lg:pl-2 mt-8 lg:mt-0 lg:w-1/2">
          <div class="rounded-lg shadow-lg p-4 md:p-8 mb-4">
            <div class="font-bold text-sm sm:text-md">Compliance documents</div>
            <div class="flex flex-col mb-4 md:mb-8">
              <div
                class="flex flex-row items-center mt-2 cursor-pointer hover:underline"
                v-for="item in mandatory"
                :key="item.id"
              >
                <span>
                  <svgicon name="cloud-download" height="24" width="24" />
                </span>
                <a
                  class="px-2 text-sm leading-tight"
                  @click.prevent="downloadItem(item.file.url, item.file.filename)"
                  :href="item.file.url"
                  :download="item.file.filename"
                  target="_blank"
                >{{item.compliance_document.name}}</a>
              </div>
            </div>
            <div class="font-bold text-sm sm:text-md">Others documents</div>
            <div class="flex flex-col mb-4 md:mb-8">
              <div
                class="flex flex-row mt-2 cursor-pointer hover:underline"
                v-for="item in optional"
                :key="item.id"
              >
                <span>
                  <svgicon name="cloud-download" height="24" width="24" />
                </span>
                <a
                  class="px-2"
                  @click.prevent="downloadItem(item.file.url, item.file.filename)"
                  :href="item.file.url"
                  :download="item.file.filename"
                  target="_blank"
                >{{item.compliance_document.name}}</a>
              </div>
            </div>

            <div class="font-bold text-sm sm:text-md">Preferred rates</div>
            <div class="flex flex-col mb-4 md:mb-8">
              <div
                class="flex flex-row flex-no-wrap mt-2"
                v-for="item in user.locum_detail.rates"
                :key="item.id"
              >
                <div class="text-xs sm:text-sm">{{item.rate_type.name}}: £ {{item.min}}</div>
              </div>
            </div>
            <div class="font-bold text-sm sm:text-md">Referees</div>
            <div v-if="user.locum_detail.referees.length > 0">
              <div
                class="rounded-lg flex flex-col bg-gray-300 my-2 p-4"
                v-for="item in user.locum_detail.referees"
                :key="item.id"
              >
                <div class="text-xs sm:text-sm">{{item ? item.name:null}}</div>
                <div class="text-xs sm:text-sm">{{item ? item.phone_number:null}}</div>
                <div class="text-xs sm:text-sm">{{item ? item.email:null}}</div>
              </div>
            </div>
            <div v-else>
              <div class="text-xs sm:text-sm">(none)</div>
            </div>
          </div>
          <AppButton
            :label="'Appoint to this job'"
            @click="confirmation_modal = true"
            v-if="authPermissions.includes('Appoint Sessions Job') && user.locum_job_user_appointable"
          />
          <AppButton
            :label="'This user has not yet accepted your changes'"
            disabled
            v-if="!user.locum_job_user_appointable"
          />
        </div>
      </div>
    </div>
    <transition name="fade" mode="out-in">
      <div class="message-modal md:w-2/3 lg:w-1/2 xl:w-1/3" v-if="sendMessageModal">
        <SendMessageModal :user="user" @close="sendMessageModal=false" :profileOption="false" />
      </div>
    </transition>
    <div class="shield" v-if="sendMessageModal" @click="sendMessageModal=false"></div>
    <AppConfirmationModal
      :label="'Appoint this Locum?'"
      :confirmLabel="'Yes'"
      :cancelLabel="'Cancel'"
      :modal="confirmation_modal"
      @confirm="appoint"
      @cancel="confirmation_modal = false"
    />
  </section>
</template>
<script>
import AppButton from "@/components/Base/AppButton";
import AppAvatar from "@/components/Base/AppAvatar";
import AppConfirmationModal from "@/components/Base/AppConfirmationModal";
import SendMessageModal from "@/components/Messages/SendMessageModal";
export default {
  props: ["user", "job"],
  components: {
    AppButton,
    AppConfirmationModal,
    AppAvatar,
    SendMessageModal
  },
  data() {
    return {
      confirmation_modal: false,
      mandatory: [],
      optional: [],
      sendMessageModal: false
    };
  },
  computed: {
    authPermissions() {
      return this.$store.getters["permissions"];
    }
  },
  created() {
    this.getProfessionCategory(
      this.user.locum_detail.profession.profession_category.id
    );
  },
  methods: {
    message(user) {
      this.user = user;
      this.sendMessageModal = true;
    },
    getProfessionCategory(id) {
      this.$axios.$get(`/api/v1/profession-categories/${id}`).then(res => {
        this.mandatory = this.user.locum_detail.compliance_documents.filter(
          compliance_document => {
            return res.data.profession_category.mandatory_compliance_documents.some(
              mandatory_compliance_document =>
                mandatory_compliance_document.id ===
                compliance_document.compliance_document.id
            );
          }
        );
        this.optional = this.user.locum_detail.compliance_documents.filter(
          compliance_document => {
            return res.data.profession_category.optional_compliance_documents.some(
              optional_compliance_document =>
                optional_compliance_document.id ===
                compliance_document.compliance_document.id
            );
          }
        );
      });
    },
    appoint() {
      this.$axios
        .$put(
          `/api/v1/practice/jobs/${this.job.id}/applicants/${
            this.user.id
          }/appoint`
        )
        .then(res => {
          if (
            this.$route.path.includes("/dashboard") ||
            this.$route.path.includes("/sessions")
          ) {
            this.$store.commit("jobs/REMOVE_PRACTICE_APPLIED_JOB", this.job.id);
            this.$store.commit(
              "jobs/REMOVE_PRACTICE_APPLIED_JOBS_REMINDER",
              this.job.id
            );
          }
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: ["Assign locum successfully"]
          });
          this.$emit("appointed");
        })
        .catch(err => {
          console.log("err", err.reponse | err);
          if (
            err.response &&
            err.response.data &&
            err.response.data.message === "Locum User Not Accept Update"
          ) {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "danget",
              text: ["Locum has not yet accepted the amendment."]
            });
          } else {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "danget",
              text: [`${err.response.data.message}`]
            });
          }
        })
        .finally(() => {
          this.confirmation_modal = false;
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
.document-filename {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.avatar {
  max-width: 80px;
  max-height: 80px;
  min-width: 80px;
  min-height: 80px;
}
img {
  border-radius: 50%;
}
</style>

