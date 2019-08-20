<template>
  <div class="flex flex-col w-full lg:w-1/3 p-0 lg:pl-4 mt-4 lg:m-0">
    <div class="text-xs sm:text-sm font-bold">Locum</div>
    <div class="rounded-lg shadow-lg p-8 mt-4">
      <div class="flex flex-col">
        <div class="flex flex-row flex-no-wrap justify-between items-center">
          <div class="relative avatar flex">
            <img
              :src="user.avatar.file.url"
              v-if="user.avatar && user.avatar.file && user.avatar.file.url"
            />
            <svgicon v-else name="no-avatar" height="80" width="80" />
          </div>
          <div class="flex flex-col">
            <div class="font-bold mt-4 text-sm lg:text-lg">{{user.personal_detail.name}}</div>
            <div class="text-xs lg:text-sm">{{user.locum_detail.profession.name}}</div>
          </div>
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
  </div>
</template>
<script>
export default {
  props: ["user", "mandatory", "optional"]
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
