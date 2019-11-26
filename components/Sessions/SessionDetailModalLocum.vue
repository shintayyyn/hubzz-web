<template>
  <div class="flex flex-col w-full">
    <div class="text-xs sm:text-sm font-bold">Locum</div>
    <div class="rounded-lg shadow-lg p-8 mt-4" v-if="user">
      <div class="flex flex-col">
        <div class="flex flex-row flex-wrap justify-between items-center">
          <div class="flex flex-col order-2 md:order-1 w-full md:w-1/2">
            <div class="flex justify-start z-50">
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
            </div>
            <div class="font-bold mt-4 text-sm lg:text-lg">{{user.personal_detail.name}}</div>
            <div class="text-xs lg:text-sm">{{user.locum_detail.profession.name}}</div>
          </div>
          <AppAvatar
            class="order-1 md:order-2"
            :height="'80px'"
            :width="'80px'"
            :src="user.avatar && user.avatar.file && user.avatar.file.url ? user.avatar.file.url : ''"
          />
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
              <div
                class="text-xs sm:text-sm"
              >{{item.rate_type.name}}: £ {{item.min}} - £ {{item.max}}</div>
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
              <div class="leading-loose mx-2 text-xs">{{item.compliance_document.name}}</div>
            </div>
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
              <div class="leading-loose mx-2 text-xs">{{item.compliance_document.name}}</div>
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
import AppConfirmationModal from "@/components/Base/AppConfirmationModal";
export default {
  components: {
    AppAvatar,
    AppConfirmationModal
  },
  props: ["job"],
  data() {
    return {
      user: null,
      mandatory: [],
      optional: [],
      confirmation_text: "",
      confirmation_modal: false
    };
  },
  created() {
    this.getAppointedLocum();
  },
  methods: {
    getAppointedLocum() {
      this.$axios
        .$get(
          `/api/v1/practice/locums/${this.job.platform_job.appointed_to_locum.user.id}`
        )
        .then(res => {
          this.user = res.data.user;
          this.getProfessionCategory(
            res.data.user.locum_detail.profession.profession_category.id
          );
        });
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
