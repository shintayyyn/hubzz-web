<template>
  <div class="flex flex-col items-center justify-center w-full">
    <div class="flex w-full justify-center xl:justify-start">
      <div class="mx-4 flex flex-col p-8 m-1 rounded-lg shadow-lg" style="flex: 0 1 600px;">
        <div
          class="relative flex flex-col border-b-2 border-grey-light"
          :class="[setFocus === 'search_practice' ? 'border-yellow':'']"
        >
          <label for="search_practice" class="text-sm mb-4">Search for a Practice</label>
          <input
            type="text"
            name="search_practice"
            ref="search_practice"
            id="search_practice"
            class="focus:outline-none font-bold text-sm"
            style="height:40px"
            @focus="setFocus = 'search_practice'"
            @blur="setFocus = ''"
            v-model="form.search_practice"
            placeholder="Practice code, name of practice"
          >
        </div>
        <div class="relative flex flex-row mt-2">
          <button
            class="rounded-lg bg-yellow-dark px-1 py-2 text-sm font-bold hover:text-white focus:outline-none"
            @click.prevent="search"
          >Search</button>
        </div>
      </div>
    </div>

    <div class="flex w-full justify-center xl:justify-start mt-2" v-if="showResult">
      <div class="mx-4 flex flex-col py-4 m-1 rounded-lg shadow-lg" style="flex: 0 1 600px;">
        <div
          class="text-sm font-bold px-4 pb-4"
        >Select by clicking on the practice that you wish to add</div>

        <div
          class="border-t-2 p-4 cursor-pointer"
          :class="selectedPractice === item.id ? 'bg-yellow-dark':'hover:bg-grey'"
          v-for="(item, index) in results"
          :key="`${item.id}-${index}`"
          @click="selectedPractice = item.id"
        >
          <div class="flex flex-col justify-start">
            <div class="font-bold">{{item.title}}</div>
            <div class="mt-4">{{item.address}}</div>
            <div class="flex flex-row flex-nowrap mt-1">
              <div class="text-sm rounded-lg bg-grey-light py-1 px-2 mr-1">CCG</div>
              <div class="text-sm flex items-center">{{item.ccg}}</div>
            </div>
            <div class="flex flex-row flex-nowrap mt-1">
              <div class="text-sm rounded-lg bg-grey-light py-1 px-2 mr-1">Practice Code</div>
              <div class="text-sm flex items-center">{{item.practice_code}}</div>
            </div>
          </div>
        </div>

        <div class="border-t-2 p-4">
          <p class="text-sm font-bold">These are just top 10 matches from your search term.</p>
          <p
            class="text-sm font-bold"
          >Try again with practice code or its full name if the practice isn't in the result.</p>
        </div>
      </div>
    </div>

    <div class="flex w-full justify-center xl:justify-start mt-5">
      <div class="flex justify-center" style="width:600px">
        <button
          class="rounded-lg p-6 bg-yellow text-lg font-bold hover:text-white focus:outline-none"
          @click.prevent="next"
        >Next</button>
      </div>
    </div>
  </div>
</template>
<script>
const results = [
  {
    id: 0,
    title: 'CAMP HILL GP LED HEALTH CENTRE',
    address: 'RAMSDEN AVENUE, CAMPHILL, NUNEATON CV10 9EB',
    ccg: 'Warwickshire North',
    practice_code: 'Y04969'
  },
  {
    id: 1,
    title: 'DR AC MILNER',
    address: 'ANLABY SURGERY, HALTEMPRICE LEISURE CNTR, ANLABY HU10 6QJ',
    ccg: 'East Riding of Yorkshire',
    practice_code: 'B81100'
  },
  {
    id: 2,
    title: 'DR MA SIMS PRACTICE',
    address: 'DIPPLE MED CTR, WEST WING, WICKFORD AVENUE, PITSEA, BASILDON SS13 3HQ',
    ccg: 'Basildon and Brentwood',
    practice_code: 'Y00469'
  },
]
export default {
  data() {
    return {
      form: {
        search_practice: ''
      },
      setFocus: '',
      // sample search
      showResult: false,
      results,
      selectedPractice: null
    }
  },
  methods: {
    search() {
      try {
        if (this.form.search_practice) {
          this.showResult = true
        }
      } catch (e) {

      }
    },
    next() {
      try {
        let item = this.results.find(item => item.id === this.selectedPractice)
        this.$store.commit('signUp/SET_PRACTICE_DETAILS', item)
        this.$store.commit('signUp/SET_ACTIVE_TAB', 'practice_account_details')
      } catch (e) {

      }
    }
  }
}
</script>
<style scoped>
button:active {
  transform: translate(5px, 5px);
}
</style>
