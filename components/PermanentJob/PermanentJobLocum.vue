<template>
  <div class="flex flex-col w-full">
    <div class="text-xs sm:text-sm font-bold">Locum</div>
    <div class="relative flex w-full" v-if="!user && loading" style="min-height:80px">
      <AppLoading :loading="loading" spinner />
    </div>
    <div class="relative rounded-lg shadow-lg bg-white p-4 md:p-8 mt-4" v-if="user && !loading">
      <div class="flex flex-col">
        <div class="flex flex-row justify-between">
          <div class="flex flex-col w-full">
            <AppAvatar
              class="mb-4"
              :height="'80px'"
              :width="'80px'"
              :src="user.avatar && user.avatar.file && user.avatar.file.url ? user.avatar.file.url : ''"
            />
            <div class="flex flex-col w-full">
              <div class="font-bold text-sm lg:text-lg">{{user.personal_detail.name}}</div>
              <div class="text-xs lg:text-sm">{{user.locum_detail.profession.name}}</div>
            </div>
          </div>
          <div class="flex justify-start items-start z-50">
            <template v-if="user.is_favorite">
              <svgicon
                name="on-star"
                height="32"
                width="32"
                class="cursor-pointer fill-current text-gray-700 hover:text-gray-800"
                @click="unfavorite"
              />
            </template>
            <template v-else-if="!user.is_favorite">
              <svgicon
                name="off-star"
                height="32"
                width="32"
                class="cursor-pointer fill-current text-gray-700 hover:text-gray-800"
                @click="favorite"
              />
            </template>
            <button
              class="bg-yellow-500 mx-2 rounded-lg hover:bg-yellow-400 focus:outline-none"
              @click.prevent="sendMessageModal = true"
            >
              <svgicon name="chat" height="20" width="20" color="#888 #555 #fff" class="m-2" />
            </button>
          </div>
          <transition name="fade" mode="out-in">
            <div class="message-modal md:w-2/3 lg:w-1/2 xl:w-1/3" v-if="sendMessageModal">
              <SendMessageModal
                :user="user"
                @close="sendMessageModal=false"
                @showProfile="show(user.id)"
              />
            </div>
          </transition>
          <div class="shield" v-if="sendMessageModal" @click="sendMessageModal=false"></div>
        </div>
        <div class="body-info my-4">
          <div class="font-bold text-sm sm:text-md">Headline</div>
          <div class="text-xs sm:text-sm mb-8">{{user.locum_detail.headline}}</div>
          <div class="font-bold text-sm sm:text-md">Biography</div>
          <div class="text-xs sm:text-sm mb-8">{{user.locum_detail.short_biography}}</div>
          <div class="font-bold text-sm sm:text-md">GMC / NMC Number</div>
          <div class="text-xs sm:text-sm mb-8">{{user.locum_detail.gmc_or_nmc_number.number}}</div>
          <div class="font-bold text-sm sm:text-md">MPL / NPL Number</div>
          <div class="text-xs sm:text-sm mb-8">{{user.locum_detail.mpl_or_npl_number.number}}</div>
          <div class="font-bold text-sm sm:text-md">NHS Smart Card ID Number</div>
          <div class="text-xs sm:text-sm mb-8">{{user.locum_detail.nhs_smart_card_id_number}}</div>
          <div class="font-bold text-sm sm:text-md">Special requirements</div>
          <div class="text-xs sm:text-sm mb-8">{{user.locum_detail.special_requirements}}</div>
          <div class="font-bold text-sm sm:text-md">Preferred rates</div>
          <div class="flex flex-col mb-8">
            <div
              class="flex flex-row flex-no-wrap mt-2"
              v-for="item in user.locum_detail.rates"
              :key="item.id"
            >
              <div class="text-xs sm:text-sm">{{item.rate_type.name}}: £ {{item.min}}</div>
            </div>
          </div>
          <div class="font-bold text-sm sm:text-md">Specialty</div>
          <div class="text-xs sm:text-sm mb-8 flex flex-row flex-wrap">
            <div
              class="rounded-lg bg-yellow-500 p-2 m-1"
              v-for="item in user.locum_detail.qualifications"
              :key="item.id"
            >{{item.name}}</div>
          </div>
          <div class="font-bold text-sm sm:text-md">Clinical systems</div>
          <div class="text-xs sm:text-sm mb-8 flex flex-row flex-wrap">
            <div
              class="rounded-lg bg-yellow-500 p-2 m-1"
              v-for="item in user.locum_detail.clinical_systems"
              :key="item.id"
            >{{item.name}}</div>
          </div>
          <div class="font-bold text-sm sm:text-md">Languages</div>
          <div class="text-xs sm:text-sm mb-8 flex flex-row flex-wrap">
            <div class="rounded-lg bg-yellow-500 p-2 m-1">English</div>
            <div
              class="rounded-lg bg-yellow-500 p-2 m-1"
              v-for="item in user.locum_detail.spoken_languages"
              :key="item.id"
            >{{item.name}}</div>
          </div>
          <div class="font-bold text-sm sm:text-md">Compliance documents</div>
          <div class="flex flex-col mb-8">
            <div
              class="flex flex-row flex-no-wrap mt-2 cursor-pointer hover:underline"
              v-for="item in mandatory"
              :key="item.id"
            >
              <div class="w-5 h-5">
                <svgicon name="cloud-download" height="24" width="24" />
              </div>
              <a
                @click.stop.prevent="downloadItem(item.file.url, item.file.filename)"
                :href="item.file.url"
                :download="item.file.filename"
                class="whitespace-no-wrap leading-loose mx-2 text-xs"
              >{{item.compliance_document.name}}</a>
              <!-- <div class="leading-loose mx-2 text-xs">{{item.compliance_document.name}}</div> -->
            </div>
            <template v-if="optional && !optional.length">
              <span class="text-sm">(none)</span>
            </template>
          </div>
          <div class="font-bold text-sm sm:text-md">Other documents</div>
          <div class="flex flex-col mb-8">
            <div
              class="flex flex-row flex-no-wrap mt-2 cursor-pointer hover:underline"
              v-for="item in optional"
              :key="item.id"
            >
              <div class="w-5 h-5">
                <svgicon name="cloud-download" height="24" width="24" />
              </div>
              <a
                @click.stop.prevent="downloadItem(item.file.url, item.file.filename)"
                :href="item.file.url"
                :download="item.file.filename"
                class="whitespace-no-wrap leading-loose mx-2 text-xs"
              >{{item.compliance_document.name}}</a>
              <!-- <div class="leading-loose mx-2 text-xs">{{item.compliance_document.name}}</div> -->
            </div>
            <template v-if="optional && !optional.length">
              <span class="text-sm">(none)</span>
            </template>
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
        </div>
      </div>
    </div>
    <AppConfirmationModal
      :label="confirmation_text"
      :confirmLabel="'Yes'"
      :cancelLabel="'Cancel'"
      :modal="confirmation_modal"
      @confirm="confirm"
      @cancel="confirmation_modal = false"
    />
  </div>
</template>
<script>
import AppAvatar from "~/components/Base/AppAvatar";
import AppLoading from "~/components/Base/AppLoading";
import AppConfirmationModal from "@/components/Base/AppConfirmationModal";
import SendMessageModal from "@/components/Messages/SendMessageModal";
export default {
  components: {
    AppAvatar,
    AppLoading,
    AppConfirmationModal,
    SendMessageModal
  },
  props: ["user"],
  data() {
    return {
      loading: false,
      // user: null,
      mandatory: [],
      optional: [],
      confirmation_text: "",
      confirmation_modal: false,
      sendMessageModal: false
    };
  },
  created() {
    console.log("locum assigned", this.user);
  },
  methods: {
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
    favorite() {
      this.confirmation_text = "Add this Locum to MyBanks?";
      this.confirmation_modal = true;
    },
    unfavorite() {
      this.confirmation_text = "Remove this Locum to MyBanks?";
      this.confirmation_modal = true;
    },
    confirm() {
      if (!this.user.is_favorite) {
        this.$axios
          .$post(`/api/v1/practice/locums/${this.user.id}/favorite`)
          .then(res => {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: ["Added to favourites"]
            });
          });
        this.user.is_favorite = true;
        this.confirmation_modal = false;
      } else if (this.user.is_favorite) {
        this.$axios
          .$delete(`/api/v1/practice/locums/${this.user.id}/favorite`)
          .then(res => {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: ["Remove to favourites"]
            });
          });
        this.user.is_favorite = false;
        this.confirmation_modal = false;
      }
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
