<template>
  <div class="flex flex-col w-full lg:w-1/3 p-0 lg:pl-4 mt-4 lg:m-0">
    <div class="text-xs sm:text-sm font-bold">Locum</div>
    <div class="rounded-lg shadow-lg p-8 mt-4">
      <div class="flex flex-col">
        <div class="head-info">
          <div class="float-left mr-4">
            <svgicon name="no-avatar" height="80" width="80" />
          </div>
          <div class="font-bold mt-4 text-sm lg:text-lg">{{user.personal_detail.name}}</div>
          <div class="text-xs lg:text-sm">{{user.locum_detail.profession.name}}</div>
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
              class="flex flex-row flex-nowrap mt-2"
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
              class="rounded-lg bg-yellow-dark p-2 m-1"
              v-for="item in user.locum_detail.qualifications"
              :key="item.id"
            >{{item.name}}</div>
          </div>
          <div class="font-bold text-sm sm:text-md">Clinical systems</div>
          <div class="text-xs sm:text-sm mb-8 flex flex-row flex-wrap">
            <div
              class="rounded-lg bg-yellow-dark p-2 m-1"
              v-for="item in user.locum_detail.clinical_systems"
              :key="item.id"
            >{{item.name}}</div>
          </div>
          <div class="font-bold text-sm sm:text-md">Languages</div>
          <div class="text-xs sm:text-sm mb-8 flex flex-row flex-wrap">
            <div class="rounded-lg bg-yellow-dark p-2 m-1">English</div>
            <div
              class="rounded-lg bg-yellow-dark p-2 m-1"
              v-for="item in user.locum_detail.spoken_languages"
              :key="item.id"
            >{{item.name}}</div>
          </div>
          <div class="font-bold text-sm sm:text-md">Compliance documents</div>
          <div class="flex flex-col mb-8">
            <div
              class="flex flex-row flex-nowrap mt-2 cursor-pointer hover:underline"
              v-for="item in mandatory"
              :key="item.id"
            >
              <svgicon name="cloud-download" height="24" width="24" />
              <div class="leading-normal mx-2 document-filename">{{item.compliance_document.name}}</div>
            </div>
          </div>
          <div class="font-bold text-sm sm:text-md">Other documents</div>
          <div class="flex flex-col mb-8">
            <div
              class="flex flex-row flex-nowrap mt-2 cursor-pointer hover:underline"
              v-for="item in optional"
              :key="item.id"
            >
              <svgicon name="cloud-download" height="24" width="24" />
              <div class="leading-normal mx-2 document-filename">{{item.compliance_document.name}}</div>
            </div>
          </div>
          <div class="font-bold text-sm sm:text-md">Referees</div>
          <div class="rounded-lg flex flex-col bg-grey-light my-2 p-4">
            <div class="text-xs sm:text-sm">name</div>
            <div class="text-xs sm:text-sm">number</div>
            <div class="text-xs sm:text-sm">email</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['user', 'mandatory', 'optional']
}
</script>

