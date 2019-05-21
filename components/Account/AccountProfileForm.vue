<template>
  <div class="flex flex-row flex-wrap justify-start">
    <div class="border-solid rounded-lg shadow-lg p-8 mr-5 mb-5">
      <form class="w-full">
        <div class="relative flex flex-col mt-8">
          <div class="flex flex-row justify-between">
            <label for="gmc_or_nmc_number" class="text-sm" style="width:50%">GMC / NMC Number</label>
            <div
              class="text-sm rounded-lg bg-grey-light px-2 py-1"
            >For compliance; to be verified by the hubzz team</div>
          </div>
          <div class="flex flex-row justify-between mt-4">
            <div
              class="flex flex-col border-b-2 border-grey-light"
              style="width:100%"
              :class="[setFocus === 'gmc_or_nmc_number' ? 'border-yellow':'', formError.find(item => item.field === 'gmc_or_nmc_number') ? 'border-red':'']"
            >
              <input
                type="text"
                name="gmc_or_nmc_number"
                id="gmc_or_nmc_number"
                ref="gmc_or_nmc_number"
                class="focus:outline-none font-bold text-sm"
                style="height:40px;"
                @focus="setFocus = 'gmc_or_nmc_number'"
                @blur="setFocus = ''"
                v-model="form.gmc_or_nmc_number"
              >
            </div>
          </div>
          <div
            class="absolute pin-t pin-r bg-red text-white p-1"
            v-if="formError.find(item => item.field === 'gmc_or_nmc_number')"
          >{{formError.find(item => item.field === 'gmc_or_nmc_number').message}}</div>
        </div>

        <div class="relative flex flex-col mt-8">
          <div class="flex flex-row justify-between">
            <label for="mpl_or_npl_number" class="text-sm" style="width:50%">MPL / NPL Number</label>
            <div
              class="text-sm rounded-lg bg-grey-light px-2 py-1"
            >For compliance; to be verified by the hubzz team</div>
          </div>
          <div class="flex flex-row justify-between mt-4">
            <div
              class="flex flex-col border-b-2 border-grey-light"
              style="width:100%"
              :class="[setFocus === 'mpl_or_npl_number' ? 'border-yellow':'', formError.find(item => item.field === 'mpl_or_npl_number') ? 'border-red':'']"
            >
              <input
                type="text"
                name="mpl_or_npl_number"
                id="mpl_or_npl_number"
                ref="mpl_or_npl_number"
                class="focus:outline-none font-bold text-sm"
                style="height:40px;"
                @focus="setFocus = 'mpl_or_npl_number'"
                @blur="setFocus = ''"
                v-model="form.mpl_or_npl_number"
              >
            </div>
          </div>
          <div
            class="absolute pin-t pin-r bg-red text-white p-1"
            v-if="formError.find(item => item.field === 'mpl_or_npl_number')"
          >{{formError.find(item => item.field === 'mpl_or_npl_number').message}}</div>
        </div>

        <div class="relative flex flex-col mt-8">
          <div class="flex flex-row justify-between">
            <label
              for="nhs_smart_card_id_number"
              class="text-sm"
              style="width:50%"
            >NHS Smart Card ID number</label>
          </div>
          <div class="flex flex-row justify-between mt-4">
            <div
              class="flex flex-col border-b-2 border-grey-light"
              style="width:100%"
              :class="[setFocus === 'nhs_smart_card_id_number' ? 'border-yellow':'', formError.find(item => item.field === 'nhs_smart_card_id_number') ? 'border-red':'']"
            >
              <input
                type="text"
                name="nhs_smart_card_id_number"
                id="nhs_smart_card_id_number"
                ref="nhs_smart_card_id_number"
                class="focus:outline-none font-bold text-sm"
                style="height:40px;"
                @focus="setFocus = 'nhs_smart_card_id_number'"
                @blur="setFocus = ''"
                v-model="form.nhs_smart_card_id_number"
              >
            </div>
          </div>
          <div
            class="absolute pin-t pin-r bg-red text-white p-1"
            v-if="formError.find(item => item.field === 'nhs_smart_card_id_number')"
          >{{formError.find(item => item.field === 'nhs_smart_card_id_number').message}}</div>
        </div>

        <div class="relative flex flex-col mt-8">
          <div class="flex flex-row justify-between">
            <label for="headline" class="text-sm" style="width:50%">Headline</label>
            <div
              class="text-sm rounded-lg bg-grey-light px-2 py-1"
            >A short headline about yourself to show to Practices</div>
          </div>
          <div class="flex flex-row justify-between mt-4">
            <div
              class="flex flex-col border-b-2 border-grey-light"
              style="width:100%"
              :class="[setFocus === 'headline' ? 'border-yellow':'', formError.find(item => item.field === 'headline') ? 'border-red':'']"
            >
              <input
                type="text"
                name="headline"
                id="headline"
                ref="headline"
                class="focus:outline-none font-bold text-sm"
                style="height:40px;"
                @focus="setFocus = 'headline'"
                @blur="setFocus = ''"
                v-model="form.headline"
              >
            </div>
          </div>
          <div
            class="absolute pin-t pin-r bg-red text-white p-1"
            v-if="formError.find(item => item.field === 'headline')"
          >{{formError.find(item => item.field === 'headline').message}}</div>
        </div>

        <div class="relative flex flex-col mt-8">
          <div class="flex flex-row justify-between">
            <label for="short_biography" class="text-sm" style="width:50%">Short Biography</label>
            <div
              class="text-sm rounded-lg bg-grey-light px-2 py-1"
            >A little bit about yourself to inform to the Practices</div>
          </div>
          <div class="flex flex-row justify-between mt-4">
            <div
              class="flex flex-col border-b-2 border-grey-light"
              style="width:100%"
              :class="[setFocus === 'short_biography' ? 'border-yellow':'', formError.find(item => item.field === 'short_biography') ? 'border-red':'']"
            >
              <textarea
                name="short_biography"
                id="short_biography"
                rows="5"
                class="focus:outline-none font-bold text-sm"
                @focus="setFocus = 'short_biography'"
                @blur="setFocus = ''"
                v-model="form.short_biography"
              ></textarea>
            </div>
          </div>
          <div
            class="absolute pin-t pin-r bg-red text-white p-1"
            v-if="formError.find(item => item.field === 'short_biography')"
          >{{formError.find(item => item.field === 'short_biography').message}}</div>
        </div>

        <div class="relative flex flex-col mt-8">
          <div class="flex flex-row justify-between">
            <label for="special_requirements" class="text-sm" style="width:50%">Special Requirements</label>
            <div
              class="text-sm rounded-lg bg-grey-light px-2 py-1"
            >Information for Practices for you own needs</div>
          </div>
          <div class="flex flex-row justify-between mt-4">
            <div
              class="flex flex-col border-b-2 border-grey-light"
              style="width:100%"
              :class="[setFocus === 'special_requirements' ? 'border-yellow':'', formError.find(item => item.field === 'special_requirements') ? 'border-red':'']"
            >
              <textarea
                name="special_requirements"
                id="special_requirements"
                rows="5"
                class="focus:outline-none font-bold text-sm"
                @focus="setFocus = 'special_requirements'"
                @blur="setFocus = ''"
                v-model="form.special_requirements"
              ></textarea>
            </div>
          </div>
          <div
            class="absolute pin-t pin-r bg-red text-white p-1"
            v-if="formError.find(item => item.field === 'special_requirements')"
          >{{formError.find(item => item.field === 'special_requirements').message}}</div>
        </div>

        <div class="relative flex flex-col mt-8">
          <div class="flex flex-row justify-between">
            <label for="profession_id" class="text-sm" style="width:50%">Profession</label>
          </div>
          <div class="flex flex-row justify-between mt-4">
            <div
              class="flex flex-col border-b-2 border-grey-light"
              style="width:100%"
              :class="[setFocus === 'profession_id' ? 'border-yellow':'', formError.find(item => item.field === 'profession_id') ? 'border-red':'']"
            >
              <select
                name="profession_id"
                id="profession_id"
                class="focus:outline-none font-bold text-sm"
                @focus="setFocus = 'profession_id'"
                @blur="setFocus = ''"
                v-model="form.profession_id"
                style="height:40px;"
              >
                Role
                <option v-for="item in professions" :key="item.id" :value="item.id">{{item.name}}</option>
              </select>
            </div>
          </div>
          <div
            class="absolute pin-t pin-r bg-red text-white p-1"
            v-if="formError.find(item => item.field === 'profession_id')"
          >{{formError.find(item => item.field === 'profession_id').message}}</div>
        </div>

        <div class="relative flex flex-col mt-8">
          <div class="flex flex-row justify-between">
            <label for="qualification_id" class="text-sm" style="width:50%">Specialty</label>
            <div
              class="text-sm rounded-lg bg-grey-light px-2 py-1"
            >Choose at least one qualification</div>
          </div>
          <div class="flex flex-row justify-between mt-4">
            <div
              class="flex flex-col border-b-2 border-grey-light"
              style="width:100%"
              :class="[setFocus === 'qualification_id' ? 'border-yellow':'', formError.find(item => item.field === 'qualification_id') ? 'border-red':'']"
            >
              <div class="flex flex-row flex-wrap">
                <div
                  class="rounded-lg bg-yellow font-bold p-2 m-1"
                  v-for="(item, index) in selectedQualifications"
                  :key="`${item.id}-${index}`"
                >
                  {{item.name}}
                  <span
                    class="font-bold cursor-pointer text-lg"
                    @click="removeQualification(item, index)"
                  >X</span>
                </div>
              </div>

              <div class="relative">
                <input
                  type="text"
                  name="qualification_id"
                  id="qualification_id"
                  ref="qualification_id"
                  class="focus:outline-none font-bold text-sm"
                  style="height:40px;width:100%;"
                  @focus="setFocus = 'qualification_id'"
                  @blur="setFocus = '', searchQualifications = ''"
                  v-model="searchQualifications"
                  placeholder="Select.."
                  @click.prevent="showQualifications=true, setFocus = 'qualification_id'"
                  @keydown="qualificationKeyDownHandler"
                >

                <transition name="fade">
                  <div
                    class="bg-white shadow-lg overflow-auto absolute pin-x z-10"
                    v-if="showQualifications"
                    style="height:100px"
                    v-on-clickaway="hideQualifications"
                  >
                    <div
                      v-for="(item, index) in filteredQualifications"
                      :key="`${item.id}-${index}`"
                      class="p-2 cursor-pointer"
                      @mouseover="qualificationsIndex=index"
                      :class="qualificationsIndex === index ? 'bg-grey':''"
                      @click="selectQualification(item, index)"
                    >
                      <strong>{{item.name}}</strong>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
          </div>
          <div
            class="absolute pin-t pin-r bg-red text-white p-1"
            v-if="formError.find(item => item.field === 'qualification_id')"
          >{{formError.find(item => item.field === 'qualification_id').message}}</div>
        </div>

        <div class="relative flex flex-col mt-8">
          <div class="flex flex-row justify-between">
            <label for="clinical_system_id" class="text-sm" style="width:50%">Clinical Systems</label>
            <div class="text-sm rounded-lg bg-grey-light px-2 py-1">Choose at least one IT system</div>
          </div>
          <div class="flex flex-row justify-between mt-4">
            <div
              class="flex flex-col border-b-2 border-grey-light"
              style="width:100%"
              :class="[setFocus === 'clinical_system_id' ? 'border-yellow':'', formError.find(item => item.field === 'clinical_system_id') ? 'border-red':'']"
            >
              <div class="flex flex-row flex-wrap">
                <div
                  class="rounded-lg bg-yellow font-bold p-2 m-1"
                  v-for="(item, index) in selectedClinicalSystems"
                  :key="`${item.id}-${index}`"
                >
                  {{item.name}}
                  <span
                    class="font-bold cursor-pointer text-lg"
                    @click="removeClinicalSystems(item, index)"
                  >X</span>
                </div>
              </div>

              <div class="relative">
                <input
                  type="text"
                  name="clinical_system_id"
                  id="clinical_system_id"
                  ref="clinical_system_id"
                  class="focus:outline-none font-bold text-sm"
                  style="height:40px;width:100%;"
                  @focus="setFocus = 'clinical_system_id'"
                  @blur="setFocus = '', searchClinicalSystems = ''"
                  v-model="searchClinicalSystems"
                  placeholder="Select.."
                  @click.prevent="showClinicalSystems=true, setFocus = 'clinical_system_id'"
                  @keydown="clinicalSystemsKeyDownHandler"
                >

                <transition name="fade">
                  <div
                    class="bg-white shadow-lg overflow-auto absolute pin-x z-10"
                    v-if="showClinicalSystems"
                    style="height:100px;"
                    v-on-clickaway="hideClinicalSystems"
                  >
                    <div
                      v-for="(item, index) in filteredClinicalSystems"
                      :key="`${item.id}-${index}`"
                      class="p-2 cursor-pointer"
                      @mouseover="clinicalSystemsIndex=index"
                      :class="clinicalSystemsIndex === index ? 'bg-grey':''"
                      @click="selectClinicalSystems(item, index)"
                    >
                      <strong>{{item.name}}</strong>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
          </div>
          <div
            class="absolute pin-t pin-r bg-red text-white p-1"
            v-if="formError.find(item => item.field === 'clinical_system_id')"
          >{{formError.find(item => item.field === 'clinical_system_id').message}}</div>
        </div>

        <div class="relative flex flex-col mt-8">
          <div class="flex flex-row justify-between">
            <label for="spoken_language_id" class="text-sm" style="width:50%">Spoken Languages</label>
            <div
              class="text-sm rounded-lg bg-grey-light px-2 py-1"
            >Choose other languages you can speak</div>
          </div>
          <div class="flex flex-row justify-between mt-4">
            <div
              class="flex flex-col border-b-2 border-grey-light"
              style="width:100%"
              :class="[setFocus === 'spoken_language_id' ? 'border-yellow':'', formError.find(item => item.field === 'spoken_language_id') ? 'border-red':'']"
            >
              <div class="flex flex-row flex-wrap">
                <div class="rounded-lg bg-yellow font-bold p-2 m-1">English</div>
                <div
                  class="rounded-lg bg-yellow font-bold p-2 m-1"
                  v-for="(item, index) in selectedSpokenLanguages"
                  :key="`${item.id}-${index}`"
                >
                  {{item.name}}
                  <span
                    class="font-bold cursor-pointer text-lg"
                    @click="removeSpokenLanguages(item, index)"
                  >X</span>
                </div>
              </div>

              <div class="relative">
                <input
                  type="text"
                  name="spoken_language_id"
                  id="spoken_language_id"
                  ref="spoken_language_id"
                  class="focus:outline-none font-bold text-sm"
                  style="height:40px;width:100%;"
                  @focus="setFocus = 'spoken_language_id'"
                  @blur="setFocus = '', searchSpokenLanguages = ''"
                  v-model="searchSpokenLanguages"
                  placeholder="Select.."
                  @click.prevent="showSpokenLanguages=true, setFocus = 'spoken_language_id'"
                  @keydown="spokenLanguagesKeyDownHandler"
                >

                <div
                  class="bg-white shadow-lg overflow-auto absolute pin-x z-10"
                  v-if="showSpokenLanguages"
                  style="height:100px;"
                  v-on-clickaway="hideSpokenLanguages"
                >
                  <div
                    v-for="(item, index) in filteredSpokenLanguages"
                    :key="`${item.id}-${index}`"
                    class="p-2 cursor-pointer"
                    @mouseover="spokenLanguagesIndex=index"
                    :class="spokenLanguagesIndex === index ? 'bg-grey':''"
                    @click="selectSpokenLanguages(item, index)"
                  >
                    <strong>{{item.name}}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            class="absolute pin-t pin-r bg-red text-white p-1"
            v-if="formError.find(item => item.field === 'spoken_language_id')"
          >{{formError.find(item => item.field === 'spoken_language_id').message}}</div>
        </div>

        <div class="relative flex flex-col mt-8">
          <div class="flex flex-row justify-between">
            <label for="rates" class="text-sm">Your preferred rates £</label>
            <div class="text-sm rounded-lg bg-grey-light px-2 py-1">To match available jobs with</div>
          </div>
          <div class="flex flex-row flex-wrap justify-between mt-4">
            <div
              class="relative flex flex-col border-b-2 border-grey-light"
              style="width:32%"
              :class="[setFocus === 'rate_per_hour' ? 'border-yellow':'', formError.find(item => item.field === 'rate_per_hour') ? 'border-red':'']"
            >
              <label for="rate_per_hour" class="text-sm">Per hour £</label>
              <input
                type="text"
                name="rate_per_hour"
                ref="rate_per_hour"
                id="rate_per_hour"
                class="focus:outline-none font-bold text-sm text-right"
                style="height:40px"
                @focus="setFocus = 'rate_per_hour'"
                @blur="setFocus = ''"
                @click="setFocus = 'rate_per_hour'"
                v-model="form.rate_per_hour"
              >
            </div>
            <div
              class="relative flex flex-col border-b-2 border-grey-light"
              style="width:32%"
              :class="[setFocus === 'rate_per_half_day_session' ? 'border-yellow':'', formError.find(item => item.field === 'rate_per_half_day_session') ? 'border-red':'']"
            >
              <label for="rate_per_half_day_session" class="text-sm">Per half day session £</label>
              <input
                type="text"
                name="rate_per_half_day_session"
                ref="rate_per_half_day_session"
                id="rate_per_half_day_session"
                class="focus:outline-none font-bold text-sm text-right"
                style="height:40px"
                @focus="setFocus = 'rate_per_half_day_session'"
                @blur="setFocus = ''"
                @click="setFocus = 'rate_per_half_day_session'"
                v-model="form.rate_per_half_day_session"
              >
            </div>
            <div
              class="relative flex flex-col border-b-2 border-grey-light"
              style="width:32%"
              :class="[setFocus === 'rate_per_whole_day_session' ? 'border-yellow':'', formError.find(item => item.field === 'rate_per_whole_day_session') ? 'border-red':'']"
            >
              <label for="rate_per_whole_day_session" class="text-sm">Per whole day session £</label>
              <input
                type="text"
                name="rate_per_whole_day_session"
                ref="rate_per_whole_day_session"
                id="rate_per_whole_day_session"
                class="focus:outline-none font-bold text-sm text-right"
                style="height:40px"
                @focus="setFocus = 'rate_per_whole_day_session'"
                @blur="setFocus = ''"
                @click="setFocus = 'rate_per_whole_day_session'"
                v-model="form.rate_per_whole_day_session"
              >
            </div>
          </div>
          <div
            class="absolute pin-t pin-r bg-red text-white p-1"
            v-if="formError.find(item => item.field === 'rate_per_hour' || item.field === 'rate_per_half_day_session' || item.field === 'rate_per_whole_day_session')"
          >{{formError.find(item => item.field === 'rate_per_hour' || item.field === 'rate_per_half_day_session' || item.field === 'rate_per_whole_day_session').message}}</div>
        </div>

        <div class="relative flex flex-col mt-8">
          <div class="flex flex-row justify-between">
            <label for="post_code" class="text-sm">The post code where I will be available at</label>
          </div>
          <div class="flex flex-row justify-between mt-4">
            <div
              class="flex flex-col border-b-2 border-grey-light"
              style="width:100%"
              :class="[setFocus === 'post_code' ? 'border-yellow':'', formError.find(item => item.field === 'post_code') ? 'border-red':'']"
            >
              <input
                type="text"
                name="post_code"
                id="post_code"
                ref="post_code"
                class="focus:outline-none font-bold text-sm"
                style="height:40px;width:100%;"
                @focus="setFocus = 'post_code'"
                @blur="setFocus = ''"
                v-model="form.post_code"
                placeholder="Enter a post code"
              >
            </div>
          </div>
          <div
            class="absolute pin-t pin-r bg-red text-white p-1"
            v-if="formError.find(item => item.field === 'post_code')"
          >{{formError.find(item => item.field === 'post_code').message}}</div>
        </div>

        <div class="relative flex flex-col mt-8">
          <div class="flex flex-row justify-between">
            <label
              for="miles"
              class="text-sm"
            >I will travel up to (amount of miles from this postcode)</label>
          </div>
          <div class="flex flex-row justify-between mt-4">
            <div
              class="flex flex-col border-b-2 border-grey-light"
              style="width:100%"
              :class="[setFocus === 'miles' ? 'border-yellow':'', formError.find(item => item.field === 'miles') ? 'border-red':'']"
            >
              <input
                type="text"
                name="miles"
                id="miles"
                ref="miles"
                class="focus:outline-none font-bold text-sm"
                style="height:40px;width:100%;"
                @focus="setFocus = 'miles'"
                @blur="setFocus = ''"
                v-model="form.miles"
                placeholder="Enter a post code"
              >
            </div>
          </div>
          <div
            class="absolute pin-t pin-r bg-red text-white p-1"
            v-if="formError.find(item => item.field === 'miles')"
          >{{formError.find(item => item.field === 'miles').message}}</div>
        </div>

        <div class="block text-sm mb-4 mt-12">Referees</div>
        <div class="p-5 border border-grey rounded-lg bg-grey-light my-1">
          <div class="relative flex flex-col mt-8">
            <div class="flex flex-row justify-between">
              <label for="contact_name_1" class="text-sm" style="width:50%">Contact name</label>
            </div>
            <div class="flex flex-row justify-between mt-4">
              <div
                class="flex flex-col border-b-2 border-white"
                style="width:100%"
                :class="[setFocus === 'contact_name_1' ? 'border-yellow':'', formError.find(item => item.field === 'contact_name_1') ? 'border-red':'']"
              >
                <input
                  type="text"
                  name="contact_name_1"
                  id="contact_name_1"
                  ref="contact_name_1"
                  class="focus:outline-none font-bold text-sm bg-grey-light"
                  style="height:40px;"
                  @focus="setFocus = 'contact_name_1'"
                  @blur="setFocus = ''"
                  v-model="form.contact_name_1"
                >
              </div>
            </div>
            <div
              class="absolute pin-t pin-r bg-red text-white p-1"
              v-if="formError.find(item => item.field === 'contact_name_1')"
            >{{formError.find(item => item.field === 'contact_name_1').message}}</div>
          </div>

          <div class="relative flex flex-col mt-8">
            <div class="flex flex-row justify-between">
              <label
                for="contact_telephone_number_1"
                class="text-sm"
                style="width:50%"
              >Telephone number</label>
            </div>
            <div class="flex flex-row justify-between mt-4">
              <div
                class="flex flex-col border-b-2 border-white"
                style="width:100%"
                :class="[setFocus === 'contact_telephone_number_1' ? 'border-yellow':'', formError.find(item => item.field === 'contact_telephone_number_1') ? 'border-red':'']"
              >
                <input
                  type="text"
                  name="contact_telephone_number_1"
                  id="contact_telephone_number_1"
                  ref="contact_telephone_number_1"
                  class="focus:outline-none font-bold text-sm bg-grey-light"
                  style="height:40px;"
                  @focus="setFocus = 'contact_telephone_number_1'"
                  @blur="setFocus = ''"
                  v-model="form.contact_telephone_number_1"
                >
              </div>
            </div>
            <div
              class="absolute pin-t pin-r bg-red text-white p-1"
              v-if="formError.find(item => item.field === 'contact_telephone_number_1')"
            >{{formError.find(item => item.field === 'contact_telephone_number_1').message}}</div>
          </div>

          <div class="relative flex flex-col mt-8">
            <div class="flex flex-row justify-between">
              <label for="contact_email_address_1" class="text-sm" style="width:50%">Email address</label>
            </div>
            <div class="flex flex-row justify-between mt-4">
              <div
                class="flex flex-col border-b-2 border-white"
                style="width:100%"
                :class="[setFocus === 'contact_email_address_1' ? 'border-yellow':'', formError.find(item => item.field === 'contact_email_address_1') ? 'border-red':'']"
              >
                <input
                  type="text"
                  name="contact_email_address_1"
                  id="contact_email_address_1"
                  ref="contact_email_address_1"
                  class="focus:outline-none font-bold text-sm bg-grey-light"
                  style="height:40px;"
                  @focus="setFocus = 'contact_email_address_1'"
                  @blur="setFocus = ''"
                  v-model="form.contact_email_address_1"
                >
              </div>
            </div>
            <div
              class="absolute pin-t pin-r bg-red text-white p-1"
              v-if="formError.find(item => item.field === 'contact_email_address_1')"
            >{{formError.find(item => item.field === 'contact_email_address_1').message}}</div>
          </div>
        </div>
        <div class="p-5 border border-grey rounded-lg bg-grey-light my-1">
          <div class="relative flex flex-col mt-8">
            <div class="flex flex-row justify-between">
              <label for="contact_name_2" class="text-sm" style="width:50%">Contact name</label>
            </div>
            <div class="flex flex-row justify-between mt-4">
              <div
                class="flex flex-col border-b-2 border-white"
                style="width:100%"
                :class="[setFocus === 'contact_name_2' ? 'border-yellow':'', formError.find(item => item.field === 'contact_name_2') ? 'border-red':'']"
              >
                <input
                  type="text"
                  name="contact_name_2"
                  id="contact_name_2"
                  ref="contact_name_2"
                  class="focus:outline-none font-bold text-sm bg-grey-light"
                  style="height:40px;"
                  @focus="setFocus = 'contact_name_2'"
                  @blur="setFocus = ''"
                  v-model="form.contact_name_2"
                >
              </div>
            </div>
            <div
              class="absolute pin-t pin-r bg-red text-white p-1"
              v-if="formError.find(item => item.field === 'contact_name_2')"
            >{{formError.find(item => item.field === 'contact_name_2').message}}</div>
          </div>

          <div class="relative flex flex-col mt-8">
            <div class="flex flex-row justify-between">
              <label
                for="contact_telephone_number_2"
                class="text-sm"
                style="width:50%"
              >Telephone number</label>
            </div>
            <div class="flex flex-row justify-between mt-4">
              <div
                class="flex flex-col border-b-2 border-white"
                style="width:100%"
                :class="[setFocus === 'contact_telephone_number_2' ? 'border-yellow':'', formError.find(item => item.field === 'contact_telephone_number_2') ? 'border-red':'']"
              >
                <input
                  type="text"
                  name="contact_telephone_number_2"
                  id="contact_telephone_number_2"
                  ref="contact_telephone_number_2"
                  class="focus:outline-none font-bold text-sm bg-grey-light"
                  style="height:40px;"
                  @focus="setFocus = 'contact_telephone_number_2'"
                  @blur="setFocus = ''"
                  v-model="form.contact_telephone_number_2"
                >
              </div>
            </div>
            <div
              class="absolute pin-t pin-r bg-red text-white p-1"
              v-if="formError.find(item => item.field === 'contact_telephone_number_2')"
            >{{formError.find(item => item.field === 'contact_telephone_number_2').message}}</div>
          </div>

          <div class="relative flex flex-col mt-8">
            <div class="flex flex-row justify-between">
              <label for="contact_email_address_2" class="text-sm" style="width:50%">Email address</label>
            </div>
            <div class="flex flex-row justify-between mt-4">
              <div
                class="flex flex-col border-b-2 border-white"
                style="width:100%"
                :class="[setFocus === 'contact_email_address_2' ? 'border-yellow':'', formError.find(item => item.field === 'contact_email_address_2') ? 'border-red':'']"
              >
                <input
                  type="text"
                  name="contact_email_address_2"
                  id="contact_email_address_2"
                  ref="contact_email_address_2"
                  class="focus:outline-none font-bold text-sm bg-grey-light"
                  style="height:40px;"
                  @focus="setFocus = 'contact_email_address_2'"
                  @blur="setFocus = ''"
                  v-model="form.contact_email_address_2"
                >
              </div>
            </div>
            <div
              class="absolute pin-t pin-r bg-red text-white p-1"
              v-if="formError.find(item => item.field === 'contact_email_address_2')"
            >{{formError.find(item => item.field === 'contact_email_address_2').message}}</div>
          </div>
        </div>
      </form>
      <div class="text-left mt-5">
        <button
          class="bg-yellow-dark hover:text-white focus:outline-none text-black font-bold text-xl p-6 rounded-lg"
          @click.prevent="save"
        >Save changes</button>
      </div>
    </div>
    <div
      class="cursor-pointer border border-solid rounded-lg shadow-md p-2"
      style="width:280px;height:200px;"
      @click="$refs.fileInput.click()"
    >
      <div class="relative text-center mt-4">
        <img
          v-if="imageUrl"
          :src="imageUrl"
          class="cursor-pointer hover:shadow-lg"
          style="border-radius:50%; height:150px;width:150px;"
        >
        <span class="absolute" v-if="imageUrl">
          <svgicon name="camera" height="32" width="32"/>
        </span>
        <input
          type="file"
          ref="fileInput"
          name="fileInput"
          id="fileInput"
          class="inputfile hidden"
          @input="onFileInput"
        >
      </div>
    </div>
  </div>
</template>
<script>
import { mixin as clickaway } from 'vue-clickaway'
export default {
  mixins: [clickaway],
  data() {
    return {
      searchQualifications: '',
      qualificationsIndex: 0,
      showQualifications: false,
      selectedQualifications: [],

      searchClinicalSystems: '',
      clinicalSystemsIndex: 0,
      showClinicalSystems: false,
      selectedClinicalSystems: [],

      searchSpokenLanguages: '',
      spokenLanguagesIndex: 0,
      showSpokenLanguages: false,
      selectedSpokenLanguages: [],

      imageUrl: '',
      setFocus: '',
      form: {
        gmc_or_nmc_number: '',
        mpl_or_npl_number: '',
        nhs_smart_card_id_number: '',
        headline: '',
        short_biography: '',
        special_requirements: '',
        profession_id: '',
        qualification_id: [],
        clinical_system_id: [],
        spoken_language_id: [],
        rate_per_hour: '',
        rate_per_half_day_session: '',
        rate_per_whole_day_session: '',
        post_code: '',
        miles: '',
        contact_name_1: '',
        contact_telephone_number_1: '',
        contact_email_address_1: '',
        contact_name_2: '',
        contact_telephone_number_2: '',
        contact_email_address_2: ''
      },
      formError: []
    }
  },
  computed: {
    filteredQualifications() {
      return this.qualifications.filter((qualification) => {
        const index = this.selectedQualifications.findIndex((item) => {
          return item.id === qualification.id
        })
        return index === -1 && qualification && qualification.name.includes(this.searchQualifications)
      })
    },
    filteredClinicalSystems() {
      return this.clinicalSystems.filter((clinicalSystem) => {
        const index = this.selectedClinicalSystems.findIndex((item) => {
          return item.id === clinicalSystem.id
        })
        return index === -1 && clinicalSystem && clinicalSystem.name.includes(this.searchClinicalSystems)
      })
    },
    filteredSpokenLanguages() {
      return this.spokenLanguages.filter((spokenLanguage) => {
        const index = this.selectedSpokenLanguages.findIndex((item) => {
          return item.id === spokenLanguage.id
        })
        return index === -1 && spokenLanguage && spokenLanguage.name.includes(this.searchSpokenLanguages)
      })
    },
    professions() {
      return this.$store.state.signUp.professions
    },
    qualifications() {
      return this.$store.state.signUp.qualifications
    },
    clinicalSystems() {
      return this.$store.state.signUp.clinicalSystems
    },
    spokenLanguages() {
      return this.$store.state.signUp.spokenLanguages
    }
  },
  created() {
    this.$axios.$get('/api/v1/me').then(res => {
      this.form.gmc_or_nmc_number = res.data.user.locum_detail.gmc_or_nmc_number,
        this.form.mpl_or_npl_number = res.data.user.locum_detail.mpl_or_npl_number,
        this.form.nhs_smart_card_id_number = res.data.user.locum_detail.nhs_smart_card_id_number,
        this.form.headline = res.data.user.locum_detail.headline,
        this.form.short_biography = res.data.user.locum_detail.short_biography,
        this.form.special_requirements = res.data.user.locum_detail.special_requirements,
        this.form.profession_id = res.data.user.locum_detail.profession.id,
        this.form.post_code = res.data.user.locum_detail.post_code
      this.form.miles = res.data.user.locum_detail.miles
      res.data.user.locum_detail.qualifications.forEach(item => {
        this.selectedQualifications.push(item)
      })
      res.data.user.locum_detail.clinical_systems.forEach(item => {
        this.selectedClinicalSystems.push(item)
      })
      res.data.user.locum_detail.spoken_languages.forEach(item => {
        this.selectedSpokenLanguages.push(item)
      })

      this.form.rate_per_hour = res.data.user.locum_detail.rate_per_hour,
        this.form.rate_per_half_day_session = res.data.user.locum_detail.rate_per_half_day_session,
        this.form.rate_per_whole_day_session = res.data.user.locum_detail.rate_per_whole_day_session

      // referees
    })

  },
  methods: {
    hideQualifications() {
      this.showQualifications = false
    },
    selectQualification(item) {
      this.selectedQualifications.push(item)
      this.setFocus = 'qualifications'
    },
    removeQualification(item, index) {
      this.selectedQualifications.splice(index, 1)
    },
    qualificationKeyDownHandler(event) {
      if (this.setFocus !== 'qualifications') {
        return
      } else {
        if (event.key === 'ArrowUp') {
          if (this.qualificationsIndex > 0) {
            this.qualificationsIndex--
          } else {
            this.qualificationsIndex = this.qualifications.length - 1
          }
        }
        if (event.key === 'ArrowDown') {
          if (this.qualificationsIndex === this.qualifications.length - 1) {
            this.qualificationsIndex = 0
          } else {
            this.qualificationsIndex++
          }
        }
        if (event.key === 'Enter') {
          if (this.filteredQualifications[this.qualificationsIndex]) {
            this.selectQualification(this.filteredQualifications[this.qualificationsIndex])
          }
        }
        if (event.key === 'Backspace') {
          if (!this.searchQualifications) {
            this.removeQualification(this.selectedQualifications[this.selectedQualifications.length - 1], this.selectedQualifications.length - 1)
          }
        }
        if (event.key === 'Escape') {
          this.setFocus = ''
          this.showQualifications = false
        }
      }
    },

    hideClinicalSystems() {
      this.showClinicalSystems = false
    },
    selectClinicalSystems(item) {
      this.selectedClinicalSystems.push(item)
      this.setFocus = 'clinical_systems'
    },
    removeClinicalSystems(item, index) {
      this.selectedClinicalSystems.splice(index, 1)
    },
    clinicalSystemsKeyDownHandler(event) {
      if (this.setFocus !== 'clinical_systems') {
        return
      } else {
        if (event.key === 'ArrowUp') {
          if (this.clinicalSystemsIndex > 0) {
            this.clinicalSystemsIndex--
          } else {
            this.clinicalSystemsIndex = this.clinicalSystems.length - 1
          }
        }
        if (event.key === 'ArrowDown') {
          if (this.clinicalSystemsIndex === this.clinicalSystems.length - 1) {
            this.clinicalSystemsIndex = 0
          } else {
            this.clinicalSystemsIndex++
          }
        }
        if (event.key === 'Enter') {
          if (this.filteredClinicalSystems[this.clinicalSystemsIndex]) {
            this.selectClinicalSystems(this.filteredClinicalSystems[this.clinicalSystemsIndex])
          }
        }
        if (event.key === 'Backspace') {
          if (!this.searchClinicalSystems) {
            this.removeClinicalSystems(this.selectedClinicalSystems[this.selectedClinicalSystems.length - 1], this.selectedClinicalSystems.length - 1)
          }
        }
        if (event.key === 'Escape') {
          this.setFocus = ''
          this.showClinicalSystems = false
        }
      }
    },

    hideSpokenLanguages() {
      this.showSpokenLanguages = false
    },
    selectSpokenLanguages(item) {
      this.selectedSpokenLanguages.push(item)
      this.setFocus = 'spoken_languages'
    },
    removeSpokenLanguages(item, index) {
      this.selectedSpokenLanguages.splice(index, 1)
    },
    spokenLanguagesKeyDownHandler(event) {
      if (this.setFocus !== 'spoken_languages') {
        return
      } else {
        if (event.key === 'ArrowUp') {
          if (this.spokenLanguagesIndex > 0) {
            this.spokenLanguagesIndex--
          } else {
            this.spokenLanguagesIndex = this.spokenLanguages.length - 1
          }
        }
        if (event.key === 'ArrowDown') {
          if (this.spokenLanguagesIndex === this.spokenLanguages.length - 1) {
            this.spokenLanguagesIndex = 0
          } else {
            this.spokenLanguagesIndex++
          }
        }
        if (event.key === 'Enter') {
          if (this.filteredSpokenLanguages[this.spokenLanguagesIndex]) {
            this.selectSpokenLanguages(this.filteredSpokenLanguages[this.spokenLanguagesIndex])
          }
        }
        if (event.key === 'Backspace') {
          if (!this.searchSpokenLanguages) {
            this.removeSpokenLanguages(this.selectedSpokenLanguages[this.selectedSpokenLanguages.length - 1], this.selectedSpokenLanguages.length - 1)
          }
        }
        if (event.key === 'Escape') {
          this.setFocus = ''
          this.showSpokenLanguages = false
        }
      }
    },

    onFileInput(e) {
      let file
      if (e.target.files[0].type.split('/')[0] !== 'image') {
        return
      }
      file = e.target.files[0]
      // send file to API
      this.$store.commit('account/SET_AVATAR_FILE', file)
      // get base 64
      this.getBase64(file, (imageUrl) => {
        this.imageUrl = imageUrl
      })
    },
    getBase64(img, callback) {
      const reader = new FileReader()
      reader.addEventListener('load', () => callback(reader.result))
      reader.readAsDataURL(img)
    },
    save() {
      // ! might change the name of the form
      this.form.qualification_id = this.selectedQualifications
      this.form.clinical_system_id = this.selectedClinicalSystems
      this.form.spoken_language_id = this.selectedSpokenLanguages
      this.formError = []
      this.Validate(this.form, ['contact_name_1', 'contact_telephone_number_1', 'contact_email_address_1',
        'nhs_smart_card_id_number', 'headline', 'short_biography', 'special_requirements',
        'contact_name_2', 'contact_telephone_number_2', 'contact_email_address_2'])
      this.ValidateEmail({ email: this.form.contact_email_address_1, field: 'contact_email_address_1' })
      this.ValidateEmail({ email: this.form.contact_email_address_2, field: 'contact_email_address_2' })
      if (!this.formError.length) {
        this.$store.commit('account/SET_PROFILE_DETAILS', this.form)
        // action dispatch to api, return promise
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'Saved !' })
      } else {
        this.loading = false
      }
    }
  }
}
</script>
<style scoped>
button:active {
  transform: translate(2px, 2px);
}
</style>


