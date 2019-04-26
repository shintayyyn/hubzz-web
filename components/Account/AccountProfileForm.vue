<template>
  <div class="flex flex-row flex-wrap justify-start">
    <div class="border-solid rounded-lg shadow-lg p-8 mr-5 mb-5">
      <form class="w-full">
        <div class="relative flex flex-col mt-8">
          <div class="flex flex-row justify-between">
            <label for="gmc_nmc_number" class="text-sm" style="width:50%">GMC / NMC Number</label>
            <div
              class="text-sm rounded-lg bg-grey-light px-2 py-1"
            >For compliance; to be verified by the hubzz team</div>
          </div>
          <div class="flex flex-row justify-between mt-4">
            <div
              class="flex flex-col border-b-2 border-grey-light"
              style="width:100%"
              :class="[setFocus === 'gmc_nmc_number' ? 'border-yellow':'', formError.find(item => item.field === 'gmc_nmc_number') ? 'border-red':'']"
            >
              <input
                type="text"
                name="gmc_nmc_number"
                id="gmc_nmc_number"
                ref="gmc_nmc_number"
                class="focus:outline-none font-bold text-sm"
                style="height:40px;"
                @focus="setFocus = 'gmc_nmc_number'"
                @blur="setFocus = ''"
                v-model="form.gmc_nmc_number"
              >
            </div>
          </div>
          <div
            class="absolute pin-t pin-r bg-red text-white p-1"
            v-if="formError.find(item => item.field === 'gmc_nmc_number')"
          >{{formError.find(item => item.field === 'gmc_nmc_number').message}}</div>
        </div>

        <div class="relative flex flex-col mt-8">
          <div class="flex flex-row justify-between">
            <label for="mpl_npl_number" class="text-sm" style="width:50%">MPL / NPL Number</label>
            <div
              class="text-sm rounded-lg bg-grey-light px-2 py-1"
            >For compliance; to be verified by the hubzz team</div>
          </div>
          <div class="flex flex-row justify-between mt-4">
            <div
              class="flex flex-col border-b-2 border-grey-light"
              style="width:100%"
              :class="[setFocus === 'mpl_npl_number' ? 'border-yellow':'', formError.find(item => item.field === 'mpl_npl_number') ? 'border-red':'']"
            >
              <input
                type="text"
                name="mpl_npl_number"
                id="mpl_npl_number"
                ref="mpl_npl_number"
                class="focus:outline-none font-bold text-sm"
                style="height:40px;"
                @focus="setFocus = 'mpl_npl_number'"
                @blur="setFocus = ''"
                v-model="form.mpl_npl_number"
              >
            </div>
          </div>
          <div
            class="absolute pin-t pin-r bg-red text-white p-1"
            v-if="formError.find(item => item.field === 'mpl_npl_number')"
          >{{formError.find(item => item.field === 'mpl_npl_number').message}}</div>
        </div>

        <div class="relative flex flex-col mt-8">
          <div class="flex flex-row justify-between">
            <label for="nhs_number" class="text-sm" style="width:50%">NHS Smart Card ID number</label>
          </div>
          <div class="flex flex-row justify-between mt-4">
            <div
              class="flex flex-col border-b-2 border-grey-light"
              style="width:100%"
              :class="[setFocus === 'nhs_number' ? 'border-yellow':'', formError.find(item => item.field === 'nhs_number') ? 'border-red':'']"
            >
              <input
                type="text"
                name="nhs_number"
                id="nhs_number"
                ref="nhs_number"
                class="focus:outline-none font-bold text-sm"
                style="height:40px;"
                @focus="setFocus = 'nhs_number'"
                @blur="setFocus = ''"
                v-model="form.nhs_number"
              >
            </div>
          </div>
          <div
            class="absolute pin-t pin-r bg-red text-white p-1"
            v-if="formError.find(item => item.field === 'nhs_number')"
          >{{formError.find(item => item.field === 'nhs_number').message}}</div>
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
            <label for="biography" class="text-sm" style="width:50%">Short Biography</label>
            <div
              class="text-sm rounded-lg bg-grey-light px-2 py-1"
            >A little bit about yourself to inform to the Practices</div>
          </div>
          <div class="flex flex-row justify-between mt-4">
            <div
              class="flex flex-col border-b-2 border-grey-light"
              style="width:100%"
              :class="[setFocus === 'biography' ? 'border-yellow':'', formError.find(item => item.field === 'biography') ? 'border-red':'']"
            >
              <textarea
                name="biography"
                id="biography"
                rows="5"
                class="focus:outline-none font-bold text-sm"
                @focus="setFocus = 'biography'"
                @blur="setFocus = ''"
                v-model="form.biography"
              ></textarea>
            </div>
          </div>
          <div
            class="absolute pin-t pin-r bg-red text-white p-1"
            v-if="formError.find(item => item.field === 'biography')"
          >{{formError.find(item => item.field === 'biography').message}}</div>
        </div>

        <div class="relative flex flex-col mt-8">
          <div class="flex flex-row justify-between">
            <label for="requirements" class="text-sm" style="width:50%">Special requirements</label>
            <div
              class="text-sm rounded-lg bg-grey-light px-2 py-1"
            >Information for Practices for you own needs</div>
          </div>
          <div class="flex flex-row justify-between mt-4">
            <div
              class="flex flex-col border-b-2 border-grey-light"
              style="width:100%"
              :class="[setFocus === 'requirements' ? 'border-yellow':'', formError.find(item => item.field === 'requirements') ? 'border-red':'']"
            >
              <textarea
                name="requirements"
                id="requirements"
                rows="5"
                class="focus:outline-none font-bold text-sm"
                @focus="setFocus = 'requirements'"
                @blur="setFocus = ''"
                v-model="form.requirements"
              ></textarea>
            </div>
          </div>
          <div
            class="absolute pin-t pin-r bg-red text-white p-1"
            v-if="formError.find(item => item.field === 'requirements')"
          >{{formError.find(item => item.field === 'requirements').message}}</div>
        </div>

        <div class="relative flex flex-col mt-8">
          <div class="flex flex-row justify-between">
            <label for="profession" class="text-sm" style="width:50%">Profession</label>
          </div>
          <div class="flex flex-row justify-between mt-4">
            <div
              class="flex flex-col border-b-2 border-grey-light"
              style="width:100%"
              :class="[setFocus === 'profession' ? 'border-yellow':'', formError.find(item => item.field === 'profession') ? 'border-red':'']"
            >
              <select
                name="profession"
                id="profession"
                class="focus:outline-none font-bold text-sm"
                @focus="setFocus = 'profession'"
                @blur="setFocus = ''"
                v-model="form.profession"
                style="height:40px;"
              >
                Role
                <option value>Select..</option>
                <option value="gp">GP</option>
                <option value="anp">ANP</option>
                <option value="enp">ENP</option>
              </select>
            </div>
          </div>
          <div
            class="absolute pin-t pin-r bg-red text-white p-1"
            v-if="formError.find(item => item.field === 'profession')"
          >{{formError.find(item => item.field === 'profession').message}}</div>
        </div>

        <div class="relative flex flex-col mt-8">
          <div class="flex flex-row justify-between">
            <label for="specialty" class="text-sm" style="width:50%">Specialty</label>
            <div
              class="text-sm rounded-lg bg-grey-light px-2 py-1"
            >Choose at least one qualification</div>
          </div>
          <div class="flex flex-row justify-between mt-4">
            <div
              class="flex flex-col border-b-2 border-grey-light"
              style="width:100%"
              :class="[setFocus === 'specialty' ? 'border-yellow':'', formError.find(item => item.field === 'specialty') ? 'border-red':'']"
            >
              <div class="flex flex-row flex-wrap">
                <div
                  class="rounded-lg bg-yellow font-bold p-2 m-1"
                  v-for="(item, index) in selectedSpecialties"
                  :key="`${item}-${index}`"
                >
                  {{item}}
                  <span
                    class="font-bold cursor-pointer text-lg"
                    @click="removeSpecialty(item, index)"
                  >X</span>
                </div>
              </div>

              <div class="relative">
                <input
                  type="text"
                  name="specialty"
                  id="specialty"
                  ref="specialty"
                  class="focus:outline-none font-bold text-sm"
                  style="height:40px;width:100%;"
                  @focus="setFocus = 'specialty'"
                  @blur="setFocus = '', searchSpecialties = ''"
                  v-model="searchSpecialties"
                  placeholder="Select.."
                  @click.prevent="showSpecialties=true, setFocus = 'specialty'"
                  @keydown="specialtyKeyDownHandler"
                >

                <transition name="fade">
                  <div
                    class="bg-white shadow-lg overflow-auto absolute pin-x z-10"
                    v-if="showSpecialties"
                    style="height:100px"
                    v-on-clickaway="hideSpecialties"
                  >
                    <div
                      v-for="(item, index) in filteredSpecialties"
                      :key="`${item}-${index}`"
                      class="p-2 cursor-pointer"
                      @mouseover="specialtiesIndex=index"
                      :class="specialtiesIndex === index ? 'bg-grey':''"
                      @click="selectSpecialty(item, index)"
                    >
                      <strong>{{item}}</strong>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
          </div>
          <div
            class="absolute pin-t pin-r bg-red text-white p-1"
            v-if="formError.find(item => item.field === 'specialty')"
          >{{formError.find(item => item.field === 'specialty').message}}</div>
        </div>

        <div class="relative flex flex-col mt-8">
          <div class="flex flex-row justify-between">
            <label for="clinical_systems" class="text-sm" style="width:50%">Clinical Systems</label>
            <div class="text-sm rounded-lg bg-grey-light px-2 py-1">Choose at least one IT system</div>
          </div>
          <div class="flex flex-row justify-between mt-4">
            <div
              class="flex flex-col border-b-2 border-grey-light"
              style="width:100%"
              :class="[setFocus === 'clinical_systems' ? 'border-yellow':'', formError.find(item => item.field === 'clinical_systems') ? 'border-red':'']"
            >
              <div class="flex flex-row flex-wrap">
                <div
                  class="rounded-lg bg-yellow font-bold p-2 m-1"
                  v-for="(item, index) in selectedClinicalSystems"
                  :key="`${item}-${index}`"
                >
                  {{item}}
                  <span
                    class="font-bold cursor-pointer text-lg"
                    @click="removeClinicalSystems(item, index)"
                  >X</span>
                </div>
              </div>

              <div class="relative">
                <input
                  type="text"
                  name="clinical_systems"
                  id="clinical_systems"
                  ref="clinical_systems"
                  class="focus:outline-none font-bold text-sm"
                  style="height:40px;width:100%;"
                  @focus="setFocus = 'clinical_systems'"
                  @blur="setFocus = '', searchClinicalSystems = ''"
                  v-model="searchClinicalSystems"
                  placeholder="Select.."
                  @click.prevent="showClinicalSystems=true, setFocus = 'clinical_systems'"
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
                      :key="`${item}-${index}`"
                      class="p-2 cursor-pointer"
                      @mouseover="clinicalSystemsIndex=index"
                      :class="clinicalSystemsIndex === index ? 'bg-grey':''"
                      @click="selectClinicalSystems(item, index)"
                    >
                      <strong>{{item}}</strong>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
          </div>
          <div
            class="absolute pin-t pin-r bg-red text-white p-1"
            v-if="formError.find(item => item.field === 'clinical_systems')"
          >{{formError.find(item => item.field === 'clinical_systems').message}}</div>
        </div>

        <div class="relative flex flex-col mt-8">
          <div class="flex flex-row justify-between">
            <label for="clinical_systems" class="text-sm" style="width:50%">Spoken Languages</label>
            <div
              class="text-sm rounded-lg bg-grey-light px-2 py-1"
            >Choose other languages you can speak</div>
          </div>
          <div class="flex flex-row justify-between mt-4">
            <div
              class="flex flex-col border-b-2 border-grey-light"
              style="width:100%"
              :class="[setFocus === 'spoken_languages' ? 'border-yellow':'', formError.find(item => item.field === 'spoken_languages') ? 'border-red':'']"
            >
              <div class="flex flex-row flex-wrap">
                <div
                  class="rounded-lg bg-yellow font-bold p-2 m-1"
                  v-for="(item, index) in selectedSpokenLanguages"
                  :key="`${item}-${index}`"
                >
                  {{item}}
                  <span
                    class="font-bold cursor-pointer text-lg"
                    @click="removeSpokenLanguages(item, index)"
                  >X</span>
                </div>
              </div>

              <div class="relative">
                <input
                  type="text"
                  name="spoken_languages"
                  id="spoken_languages"
                  ref="spoken_languages"
                  class="focus:outline-none font-bold text-sm"
                  style="height:40px;width:100%;"
                  @focus="setFocus = 'spoken_languages'"
                  @blur="setFocus = '', searchSpokenLanguages = ''"
                  v-model="searchSpokenLanguages"
                  placeholder="Select.."
                  @click.prevent="showSpokenLanguages=true, setFocus = 'spoken_languages'"
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
                    :key="`${item}-${index}`"
                    class="p-2 cursor-pointer"
                    @mouseover="spokenLanguagesIndex=index"
                    :class="spokenLanguagesIndex === index ? 'bg-grey':''"
                    @click="selectSpokenLanguages(item, index)"
                  >
                    <strong>{{item}}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            class="absolute pin-t pin-r bg-red text-white p-1"
            v-if="formError.find(item => item.field === 'spoken_languages')"
          >{{formError.find(item => item.field === 'spoken_languages').message}}</div>
        </div>

        <div class="relative flex flex-col mt-8">
          <div class="flex flex-row justify-between">
            <label for="rates" class="text-sm">Your preferred rates £</label>
            <div class="text-sm rounded-lg bg-grey-light px-2 py-1">To match available jobs with</div>
          </div>
          <div class="flex flex-row flex-wrap justify-between mt-4">
            <div
              class="relative flex flex-col border-b-2 border-grey-light"
              style="width:49%"
              :class="[setFocus === 'rates_per_hour' ? 'border-yellow':'', formError.find(item => item.field === 'rates_per_hour') ? 'border-red':'']"
            >
              <label for="rates_per_hour" class="text-sm">Per hour</label>
              <input
                type="text"
                name="rates_per_hour"
                ref="rates_per_hour"
                id="rates_per_hour"
                class="focus:outline-none font-bold text-sm text-right"
                style="height:40px"
                @focus="setFocus = 'rates_per_hour'"
                @blur="setFocus = ''"
                @click="setFocus = 'rates_per_hour'"
                v-model="form.rates_per_hour"
              >
            </div>
            <div
              class="relative flex flex-col border-b-2 border-grey-light"
              style="width:49%"
              :class="[setFocus === 'rates_per_session' ? 'border-yellow':'', formError.find(item => item.field === 'rates_per_session') ? 'border-red':'']"
            >
              <label for="rates_per_session" class="text-sm">Per session</label>
              <input
                type="text"
                name="rates_per_session"
                ref="rates_per_session"
                id="rates_per_session"
                class="focus:outline-none font-bold text-sm text-right"
                style="height:40px"
                @focus="setFocus = 'rates_per_session'"
                @blur="setFocus = ''"
                @click="setFocus = 'rates_per_session'"
                v-model="form.rates_per_session"
              >
            </div>
          </div>
          <div
            class="absolute pin-t pin-r bg-red text-white p-1"
            v-if="formError.find(item => item.field === 'rates_per_hour' || item.field === 'rates_per_session')"
          >{{formError.find(item => item.field === 'rates_per_hour' || item.field === 'rates_per_session').message}}</div>
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

        <div class="text-left mt-5">
          <button
            class="bg-yellow-dark hover:text-white focus:outline-none text-black font-bold text-xl p-6 rounded-lg"
            @click.prevent="save"
          >Save changes</button>
        </div>
      </form>
    </div>
    <div
      class="cursor-pointer border border-solid rounded-lg shadow-md p-2"
      style="width:280px;height:200px;"
      @click="$refs.fileInput.click()"
    >
      <div class="text-center mt-4">
        <img
          v-if="imageUrl"
          :src="imageUrl"
          class="cursor-pointer hover:shadow-lg"
          style="border-radius:50%; height:150px;width:150px;"
        >
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
const specialties = [
  'A&E', 'Allergy', 'Anaphylaxis', 'Asthma',
  'Aviation Medicinde', 'Baby Clinics', 'COPD/Respiratory'
]
const clinicalSystems = [
  'Adastra', 'Cerner', 'Cleo', 'DGL'
]
const spokenLanguages = [
  'English', 'Chinese', 'Arabic'
]
import { mixin as clickaway } from 'vue-clickaway'
export default {
  mixins: [clickaway],
  data() {
    return {
      searchSpecialties: '',
      specialties,
      specialtiesIndex: 0,
      showSpecialties: false,
      selectedSpecialties: [],

      searchClinicalSystems: '',
      clinicalSystems,
      clinicalSystemsIndex: 0,
      showClinicalSystems: false,
      selectedClinicalSystems: [],

      searchSpokenLanguages: '',
      spokenLanguages,
      spokenLanguagesIndex: 0,
      showSpokenLanguages: false,
      selectedSpokenLanguages: [],

      imageUrl: '',
      setFocus: '',
      form: {
        gmc_nmc_number: '',
        mpl_npl_number: '',
        nhs_number: '',
        headline: '',
        biography: '',
        requirements: '',
        profession: '',
        specialty: [],
        clinical_systems: [],
        spoken_languages: [],
        rates_per_hour: '',
        rates_per_session: '',
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
    profileDetails() {
      return this.$store.state.account.profileDetails
    },
    filteredSpecialties() {
      return this.specialties.filter((specialty) => {
        const index = this.selectedSpecialties.findIndex((item) => {
          return item === specialty
        })
        return index === -1 && specialty && specialty.includes(this.searchSpecialties)
      })
    },
    filteredClinicalSystems() {
      return this.clinicalSystems.filter((clinicalSystem) => {
        const index = this.selectedClinicalSystems.findIndex((item) => {
          return item === clinicalSystem
        })
        return index === -1 && clinicalSystem && clinicalSystem.includes(this.searchClinicalSystems)
      })
    },
    filteredSpokenLanguages() {
      return this.spokenLanguages.filter((spokenLanguage) => {
        const index = this.selectedSpokenLanguages.findIndex((item) => {
          return item === spokenLanguage
        })
        return index === -1 && spokenLanguage && spokenLanguage.includes(this.searchSpokenLanguages)
      })
    }
  },
  mounted() {
    this.form.gmc_nmc_number = this.profileDetails.gmc_nmc_number
    this.form.mpl_npl_number = this.profileDetails.mpl_npl_number
    this.form.nhs_number = this.profileDetails.nhs_number
    this.form.headline = this.profileDetails.headline
    this.form.biography = this.profileDetails.biography
    this.form.requirements = this.profileDetails.requirements
    this.form.profession = this.profileDetails.profession
    this.profileDetails.specialty.forEach(item => {
      this.selectedSpecialties.push(item)
    })
    this.profileDetails.clinical_systems.forEach(item => {
      this.selectedClinicalSystems.push(item)
    })
    this.profileDetails.spoken_languages.forEach(item => {
      this.selectedSpokenLanguages.push(item)
    })
    this.form.rates_per_hour = this.profileDetails.rates_per_hour
    this.form.rates_per_session = this.profileDetails.rates_per_session
    this.form.contact_name_1 = this.profileDetails.contact_name_1
    this.form.contact_telephone_number_1 = this.profileDetails.contact_telephone_number_1
    this.form.contact_email_address_1 = this.profileDetails.contact_email_address_1
    this.form.contact_name_2 = this.profileDetails.contact_name_2
    this.form.contact_telephone_number_2 = this.profileDetails.contact_telephone_number_2
    this.form.contact_email_address_2 = this.profileDetails.contact_email_address_2
  },
  methods: {
    hideSpecialties() {
      this.showSpecialties = false
    },
    selectSpecialty(item, index) {
      this.selectedSpecialties.push(item)
      this.specialties.splice(index, 1)
      this.setFocus = 'specialty'
    },
    removeSpecialty(item, index) {
      this.selectedSpecialties.splice(index, 1)
      this.specialties.push(item)
    },
    specialtyKeyDownHandler(event) {
      if (this.setFocus !== 'specialty') {
        return
      } else {
        if (event.key === 'ArrowUp') {
          if (this.specialtiesIndex > 0) {
            this.specialtiesIndex--
          } else {
            this.specialtiesIndex = this.specialties.length - 1
          }
        }
        if (event.key === 'ArrowDown') {
          if (this.specialtiesIndex === this.specialties.length - 1) {
            this.specialtiesIndex = 0
          } else {
            this.specialtiesIndex++
          }
        }
        if (event.key === 'Enter') {
          if (this.specialties[this.specialtiesIndex]) {
            this.selectSpecialty(this.specialties[this.specialtiesIndex], this.specialtiesIndex)
          }
        }
        if (event.key === 'Backspace') {
          if (!this.searchSpecialties) {
            this.removeSpecialty(this.selectedSpecialties[this.selectedSpecialties.length - 1], this.selectedSpecialties.length - 1)
          }
        }
        if (event.key === 'Escape') {
          this.setFocus = ''
        }
      }
    },

    hideClinicalSystems() {
      this.showClinicalSystems = false
    },
    selectClinicalSystems(item, index) {
      this.selectedClinicalSystems.push(item)
      this.clinicalSystems.splice(index, 1)
      this.setFocus = 'clinical_systems'
    },
    removeClinicalSystems(item, index) {
      this.selectedClinicalSystems.splice(index, 1)
      this.clinicalSystems.push(item)
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
          if (this.clinicalSystems[this.clinicalSystemsIndex]) {
            this.selectClinicalSystems(this.clinicalSystems[this.clinicalSystemsIndex], this.clinicalSystemsIndex)
          }
        }
        if (event.key === 'Backspace') {
          if (!this.searchClinicalSystems) {
            this.removeClinicalSystems(this.selectedClinicalSystems[this.selectedClinicalSystems.length - 1], this.selectedClinicalSystems.length - 1)
          }
        }
        if (event.key === 'Escape') {
          this.setFocus = ''
        }
      }
    },

    hideSpokenLanguages() {
      this.showSpokenLanguages = false
    },
    selectSpokenLanguages(item, index) {
      this.selectedSpokenLanguages.push(item)
      this.spokenLanguages.splice(index, 1)
      this.setFocus = 'spoken_languages'
    },
    removeSpokenLanguages(item, index) {
      this.selectedSpokenLanguages.splice(index, 1)
      this.spokenLanguages.push(item)
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
          if (this.spokenLanguages[this.spokenLanguagesIndex]) {
            this.selectSpokenLanguages(this.spokenLanguages[this.spokenLanguagesIndex], this.spokenLanguagesIndex)
          }
        }
        if (event.key === 'Backspace') {
          if (!this.searchSpokenLanguages) {
            this.removeSpokenLanguages(this.selectedSpokenLanguages[this.selectedSpokenLanguages.length - 1], this.selectedSpokenLanguages.length - 1)
          }
        }
        if (event.key === 'Escape') {
          this.setFocus = ''
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
      this.selectedSpecialties.forEach(item => {
        this.form.specialty.push(item)
      })
      this.selectedClinicalSystems.forEach(item => {
        this.form.clinical_systems.push(item)
      })
      this.selectedSpokenLanguages.forEach(item => {
        this.form.spoken_languages.push(item)
      })
      this.formError = []
      this.Validate(this.form, ['contact_name_1', 'contact_telephone_number_1', 'contact_email_address_1', 'contact_name_2', 'contact_telephone_number_2', 'contact_email_address_2'])
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


