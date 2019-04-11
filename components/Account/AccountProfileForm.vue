<template>
  <section>
    <div class="flex flex-row flex-wrap justify-start">
      <div class="flex-none p-5">
        <div class="border border-solid rounded-lg shadow-md p-8">
          <form class="mb-4">
            <div class="mb-4 border-b border-b-2 border-grey py-2" :class="{'border-yellow-dark':setFocus === 'gmc_nmc_number', 'border-red': formError.includes('gmc_nmc_number')}">
                <label for="gmc_nmc_number" class="block text-sm mb-2">
                  GMC / NMC Number
                  <span class="float-right px-3 py-1 rounded-lg bg-grey-lighter font-normal">For compliance; to be verified by the hubzz team</span>
                </label>
              <em v-if="formError.includes('gmc_nmc_number')" class="text-xs text-red-darker float-right">Required</em>
              <input @focus="setFocus = 'gmc_nmc_number'" @blur="setFocus = ''" v-model="form.gmc_nmc_number" type="text" name="gmc_nmc_number" id="gmc_nmc_number" class="appearance-none bg-transparent border-none w-full text-grey-darker mr-3 py-1 px-2 leading-tight focus:outline-none">
            </div>
            <div class="mb-4 border-b border-b-2 border-grey py-2" :class="{'border-yellow-dark':setFocus === 'mpl_npl_number', 'border-red': formError.includes('mpl_npl_number')}">
              <label for="mpl_npl_number" class="block text-sm mb-2" >
                MPL / NPL Number
                <span class="float-right px-3 py-1 rounded-lg bg-grey-lighter font-normal">For compliance; to be verified by the hubzz team</span>
              </label>
              <em v-if="formError.includes('mpl_npl_number')" class="text-xs text-red-darker float-right">Required</em>
              <input @focus="setFocus = 'mpl_npl_number'" @blur="setFocus = ''" v-model="form.mpl_npl_number" type="text" name="mpl_npl_number" id="mpl_npl_number" class="appearance-none bg-transparent border-none w-full text-grey-darker mr-3 py-1 px-2 leading-tight focus:outline-none">
            </div>
            <div class="mb-4 border-b border-b-2 border-grey py-2" :class="{'border-yellow-dark':setFocus === 'nhs_number', 'border-red': formError.includes('nhs_number')}">
              <label for="nhs_number" class="block text-sm mb-2">NHS Smart Card ID number</label>
              <em v-if="formError.includes('nhs_number')" class="text-xs text-red-darker float-right">Required</em>
              <input @focus="setFocus = 'nhs_number'" @blur="setFocus = ''" v-model="form.nhs_number" type="text" name="nhs_number" id="nhs_number" class="appearance-none bg-transparent border-none w-full text-grey-darker mr-3 py-1 px-2 leading-tight focus:outline-none">
            </div>
            <div class="mb-4 border-b border-b-2 border-grey py-2" :class="{'border-yellow-dark':setFocus === 'headline', 'border-red': formError.includes('headline')}">
              <label for="headline" class="block text-sm mb-2">
                Headline
                <span class="float-right px-3 py-1 rounded-lg bg-grey-lighter font-normal">A short headline about yourself to show to Practices</span>
              </label>
              <em v-if="formError.includes('headline')" class="text-xs text-red-darker float-right">Required</em>
              <input @focus="setFocus = 'headline'" @blur="setFocus = ''" v-model="form.headline" type="text" name="headline" id="headline" class="appearance-none bg-transparent border-none w-full text-grey-darker mr-3 py-1 px-2 leading-tight focus:outline-none">
            </div>
            <div class="mb-4 border-b border-b-2 border-grey py-2" :class="{'border-yellow-dark':setFocus === 'biography'}">
              <label for="biography" class="block text-sm mb-2">
                Short Biography
                <span class="float-right px-3 py-1 rounded-lg bg-grey-lighter font-normal">A little bit about yourself to inform to the Practices</span>
              </label>
              <textarea rows="5" @focus="setFocus = 'biography'" @blur="setFocus = ''" v-model="form.biography" name="biography" id="biography" class="appearance-none bg-transparent border-none w-full text-grey-darker mr-3 py-1 px-2 leading-tight focus:outline-none"></textarea>
            </div>
            <div class="mb-4 border-b border-b-2 border-grey py-2" :class="{'border-yellow-dark':setFocus === 'requirements'}">
              <label for="requirements" class="block text-sm mb-2">
                Special requirements
                <span class="float-right px-3 py-1 rounded-lg bg-grey-lighter font-normal">Information for Practices for you own needs</span>
              </label>
              <textarea rows="5" @focus="setFocus = 'requirements'" @blur="setFocus = ''" v-model="form.requirements" name="requirements" id="requirements" class="appearance-none bg-transparent border-none w-full text-grey-darker mr-3 py-1 px-2 leading-tight focus:outline-none"></textarea>
            </div>
            <div class="mb-4 border-b border-b-2 border-grey py-2" :class="{'border-yellow-dark':setFocus === 'profession', 'border-red': formError.includes('profession')}">
              <label for="profession" class="block text-sm mb-2">Profession</label>
              <em v-if="formError.includes('profession')" class="text-xs text-red-darker float-right">Required</em>
              <select @focus="setFocus = 'profession'" @blur="setFocus = ''" v-model="form.profession" name="profession" id="profession" class="appearance-none bg-transparent border-none w-full text-grey-darker mr-3 py-1 px-2 leading-tight focus:outline-none">Role
                <option value="">Select..</option>
                <option value="gp">GP</option>
                <option value="anp">ANP</option>
                <option value="enp">ENP</option>
              </select>
            </div>

            <div class="mb-4 border-b border-b-2 border-grey py-2">
              <label for="specialty" class="block text-sm mb-2">
                Specialty
                <span class="float-right px-3 py-1 rounded-lg bg-grey-lighter font-normal">Choose at least one specialty</span>
              </label>
              <div class="my-4">
                <span class="mx-1 border-solid rounded-lg bg-yellow-dark p-3" v-for="(item, index) in form.specialty" :key="index">{{item.label}} <span class="font-bold cursor-pointer" @click.prevent="removeSpecialty(item, index)">X</span></span>
              </div>
              <select :size="setFocus === 'specialty' ? 5 : 0"  @focus="setFocus = 'specialty'" @blur="setFocus = ''"  name="specialty" id="specialty" class="appearance-none bg-transparent border-none w-full text-grey-darker mr-3 py-1 px-2 leading-tight focus:outline-none">
                <option value="" disabled selected>Select..</option>
                <option v-for="(item, index) in sampleSpecialty" :key="index" :value="item.value" @click.prevent="selectSpecialty(item, index)">{{item.label}}</option>
              </select>
            </div>

            <div class="mb-4 border-b border-b-2 border-grey py-2">
              <label for="clinical_systems" class="block text-sm mb-2">
                Clinical Systems
                <span class="float-right px-3 py-1 rounded-lg bg-grey-lighter font-normal">Choose at least one IT system</span>
              </label>
              <div class="my-4">
                <span class="mx-1 border-solid rounded-lg bg-yellow-dark p-3" v-for="(item, index) in form.clinical_systems" :key="index">{{item.label}} <span class="font-bold cursor-pointer" @click.prevent="removeClinicalSystems(item, index)">X</span></span>
              </div>
              <select :size="setFocus === 'clinical_systems' ? 5 : 0"  @focus="setFocus = 'clinical_systems'" @blur="setFocus = ''"  name="clinical_systems" id="clinical_systems" class="appearance-none bg-transparent border-none w-full text-grey-darker mr-3 py-1 px-2 leading-tight focus:outline-none">
                <option value="" disabled selected>Select..</option>
                <option v-for="(item, index) in sampleClinicalSystems" :key="index" :value="item.value" @click.prevent="selectClinicalSystems(item, index)">{{item.label}}</option>
              </select>
            </div>

            <div class="mb-4 border-b border-b-2 border-grey py-2">
              <label for="clinical_systems" class="block text-sm mb-2">
                Spoken Languages
                <span class="float-right px-3 py-1 rounded-lg bg-grey-lighter font-normal">Choose other languages you can speak</span>
              </label>
              <div class="my-4">
                <span class="mx-1 border-solid rounded-lg bg-yellow-dark p-3" v-for="(item, index) in form.spoken_languages" :key="index">{{item.label}} <span class="font-bold cursor-pointer" @click.prevent="removeSpokenLanguages(item, index)">X</span></span>
              </div>
              <select :size="setFocus === 'spoken_languages' ? 5 : 0"  @focus="setFocus = 'spoken_languages'" @blur="setFocus = ''"  name="spoken_languages" id="spoken_languages" class="appearance-none bg-transparent border-none w-full text-grey-darker mr-3 py-1 px-2 leading-tight focus:outline-none">
                <option value="" disabled selected>Select..</option>
                <option v-for="(item, index) in sampleSpokenLanguages" :key="index" :value="item.value" @click.prevent="selectSpokenLanguages(item, index)">{{item.label}}</option>
              </select>
            </div>

            <div class="block text-sm mb-2 mt-8">
              Your preferred rates
              <span class="float-right px-3 py-1 rounded-lg bg-grey-lighter font-normal">To match available jobs with</span>
            </div>


            <div class="flex flex-wrap -mx-3 mb-6">
              <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                <div class="mb-4 border-b border-b-2 border-grey py-2" :class="{'border-yellow-dark':setFocus === 'rates_per_hour'}">
                  <label for="rates_per_hour" class="block text-sm mb-2">Per hour</label>
                  <input @focus="setFocus = 'rates_per_hour'" @blur="setFocus = ''" v-model="form.rates.per_hour" type="text" name="rates_per_hour" id="rates_per_hour" class="appearance-none bg-transparent border-none w-full text-grey-darker mr-3 py-1 px-2 leading-tight focus:outline-none">
                </div>
              </div>
              <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                <div class="mb-4 border-b border-b-2 border-grey py-2" :class="{'border-yellow-dark':setFocus === 'rates_per_session'}">
                  <label for="rates_per_session" class="block text-sm mb-2">Per session</label>
                  <input @focus="setFocus = 'rates_per_session'" @blur="setFocus = ''" v-model="form.rates.per_session" type="text" name="rates_per_session" id="rates_per_session" class="appearance-none bg-transparent border-none w-full text-grey-darker mr-3 py-1 px-2 leading-tight focus:outline-none">
                </div>
              </div>
            </div>

            <div class="block text-sm mb-2 mt-5">Referees</div>
            <div class="p-5 border border-grey rounded-lg bg-grey-light">
              <div class="mb-4 border-b border-b-2 border-white py-2">
                <label for="contact_name_1" class="block text-sm mb-2">Contact name</label>
                <input @focus="setFocus = 'contact_name_1'" @blur="setFocus = ''" v-model="form.contact_name_1" type="text" name="contact_name_1" id="contact_name_1" class="appearance-none bg-transparent border-none w-full text-grey-darker mr-3 py-1 px-2 leading-tight focus:outline-none">
              </div>
              <div class="mb-4 border-b border-b-2 border-white py-2">
                <label for="contact_telephone_number_1" class="block text-sm mb-2">Telephone number</label>
                <input @focus="setFocus = 'contact_telephone_number_1'" @blur="setFocus = ''" v-model="form.contact_telephone_number_1" type="text" name="contact_telephone_number_1" id="contact_telephone_number_1" class="appearance-none bg-transparent border-none w-full text-grey-darker mr-3 py-1 px-2 leading-tight focus:outline-none">
              </div>
              <div class="mb-4 border-b border-b-2 border-white py-2">
                <label for="contact_email_address_1" class="block text-sm mb-2">Email address</label>
                <input @focus="setFocus = 'contact_email_address_1'" @blur="setFocus = ''" v-model="form.contact_email_address_1" type="text" name="contact_email_address_1" id="contact_email_address_1" class="appearance-none bg-transparent border-none w-full text-grey-darker mr-3 py-1 px-2 leading-tight focus:outline-none">
              </div>
            </div>

            <div class="p-5 border border-grey rounded-lg bg-grey-light mt-5">
              <div class="mb-4 border-b border-b-2 border-white py-2">
                <label for="contact_name_1" class="block text-sm mb-2">Contact name</label>
                <input @focus="setFocus = 'contact_name_1'" @blur="setFocus = ''" v-model="form.contact_name_1" type="text" name="contact_name_1" id="contact_name_1" class="appearance-none bg-transparent border-none w-full text-grey-darker mr-3 py-1 px-2 leading-tight focus:outline-none">
              </div>
              <div class="mb-4 border-b border-b-2 border-white py-2">
                <label for="contact_telephone_number_1" class="block text-sm mb-2">Telephone number</label>
                <input @focus="setFocus = 'contact_telephone_number_1'" @blur="setFocus = ''" v-model="form.contact_telephone_number_1" type="text" name="contact_telephone_number_1" id="contact_telephone_number_1" class="appearance-none bg-transparent border-none w-full text-grey-darker mr-3 py-1 px-2 leading-tight focus:outline-none">
              </div>
              <div class="mb-4 border-b border-b-2 border-white py-2">
                <label for="contact_email_address_1" class="block text-sm mb-2">Email address</label>
                <input @focus="setFocus = 'contact_email_address_1'" @blur="setFocus = ''" v-model="form.contact_email_address_1" type="text" name="contact_email_address_1" id="contact_email_address_1" class="appearance-none bg-transparent border-none w-full text-grey-darker mr-3 py-1 px-2 leading-tight focus:outline-none">
              </div>
            </div>
            <div class="text-left mt-5">
              <button class="bg-yellow-dark hover:text-white focus:outline-none text-black font-bold text-xl p-6 rounded-lg" @click.prevent="save">Save changes</button>
            </div>
          </form>
        </div>
      </div>
      <div class="flex-none p-5">
        <div class="border border-solid rounded-lg shadow-md" style="width:280px;height:200px;">
          <div v-if="imageUrl" class="text-center mt-5 cursor-pointer">
            <img :src="imageUrl" style="border-radius:50%; height:150px;width:150px;" class="hover:shadow-lg" @click="imageUrl = ''"/>
          </div>
          <div v-else class="text-center mt-10">
            <input type="file" name="file" id="file" class="inputfile hidden" @input="onFileInput" />
            <label for="file" class="font-bold bg-yellow-dark rounded-lg px-8 py-1 cursor-pointer hover:shadow-md">Choose a file</label>
          </div>
        </div>
      </div>
    </div>
  </section>

</template>
<script>
const sampleSpecialty = [
  { value: 'allergy' , label: 'Allergy'},
  { value: 'asthma' , label: 'Asthma'},
  { value: 'aviation_medicine' , label: 'Aviation Medicine'}
]
const sampleClinicalSystems = [
  { value: 'cerner', label: 'Cerner'},
  { value: 'cleo', label: 'Cleo'},
  { value: 'docman', label: 'Docman'},
]
const sampleSpokenLanguages = [
  { value: 'english', label: 'English'},
  { value: 'tagalog', label: 'Tagalog'},
  { value: 'chinese', label: 'Chinese'},
]
export default {
  data () {
    return {
      sampleSpecialty,
      sampleClinicalSystems,
      sampleSpokenLanguages,
      imageUrl: '',
      loading: false,
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
        rates: {
          per_hour: '',
          per_session: ''
        },
        referees: [
          {
            contact_name_1: '',
            contact_telephone_number_1: '',
            contact_email_address_1: ''
          },
          {
            contact_name_2: '',
            contact_telephone_number_2: '',
            contact_email_2: ''
          }
        ]
      },
      formError: []
    }
  },
  methods: {
    selectSpecialty (item, index) {
      this.form.specialty.push(item)
      this.sampleSpecialty.splice(index, 1)
    },
    removeSpecialty (item, index) {
      this.form.specialty.splice(index, 1)
      this.sampleSpecialty.push(item)
    },
    selectClinicalSystems (item, index) {
      this.form.clinical_systems.push(item)
      this.sampleClinicalSystems.splice(index, 1)
    },
    removeClinicalSystems (item, index) {
      this.form.clinical_systems.splice(index, 1)
      this.sampleClinicalSystems.push(item)
    },
    selectSpokenLanguages (item, index) {
      this.form.spoken_languages.push(item)
      this.sampleSpokenLanguages.splice(index, 1)
    },
    removeSpokenLanguages (item, index) {
      this.form.spoken_languages.splice(index, 1)
      this.sampleSpokenLanguages.push(item)
    },
    onFileInput(e) {
      let file
      if (e.target.files[0].type.split('/')[0] !== 'image') {
        return
      }
      file = e.target.files[0]
      this.getBase64(file, (imageUrl) => {
        this.imageUrl = imageUrl
        console.log(this.imageUrl)
      })
    },
    getBase64(img, callback) {
      const reader = new FileReader()
      reader.addEventListener('load', () => callback(reader.result))
      reader.readAsDataURL(img)
    },
    save () {
      this.loading = true
      this.formError = []
      // ! Modify this.Validate() to accept arrays and objects too
      this.Validate(this.form)
      return
      if (!this.formError.length) {
      } else {
        this.loading = false
      }
    }
  }
}
</script>

