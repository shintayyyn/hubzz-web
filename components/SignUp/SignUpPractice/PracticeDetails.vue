<template>
  <div class="flex flex-col items-center justify-center w-full">
    <div class="flex w-full justify-center xl:justify-start">
      <div class="mx-4 flex flex-col p-8 m-1 rounded-lg shadow-lg" style="flex: 0 1 600px;">
        <div
          class="relative flex flex-col border-b-2 border-grey-light"
          :class="[setFocus === 'search' ? 'border-yellow':'']"
        >
          <label for="search" class="text-sm mb-4">Search for a Practice</label>
          <input
            type="text"
            ref="search"
            class="focus:outline-none font-bold text-sm"
            style="height:40px"
            @focus="setFocus = 'search'"
            @blur="setFocus = ''"
            v-model="form.search"
            placeholder="Practice code, name of practice"
          >
        </div>
        <div class="flex flex-row justify-start">
          <input
            type="checkbox"
            ref="hasUsers"
            class="focus:outline-none font-bold text-sm"
            style="height:40px"
            @focus="setFocus = 'has_users'"
            @blur="setFocus = ''"
            @keyup.enter="search"
            v-model="form.has_users"
            placeholder="Practice code, name of practice"
          >
          <label for="has_users" class="text-sm flex items-center ml-1">
            <em class="text-grey-dark text-sm">has users</em>
          </label>
        </div>
        <div class="relative flex flex-row mt-2">
          <button
            class="rounded-lg bg-yellow-dark px-1 py-2 text-sm font-bold hover:text-white focus:outline-none"
            @click.prevent="search"
          >Search</button>
        </div>
      </div>
    </div>

    <div
      class="flex w-full justify-center xl:justify-start mt-2"
      v-if="showResult && results.length > 0"
    >
      <div class="mx-4 flex flex-col py-4 m-1 rounded-lg shadow-lg" style="flex: 0 1 600px;">
        <div
          class="text-sm font-bold px-4 pb-4"
        >Select by clicking on the practice that you wish to add</div>

        <div
          class="border-t-2 p-4 cursor-pointer"
          :class="selectedPractice === item.practice_id ? 'bg-yellow-dark':'hover:bg-grey'"
          v-for="(item) in results"
          :key="item.practice_id"
          @click="selectedPractice = item.practice_id"
        >
          <div class="flex flex-col justify-start">
            <div class="font-bold">{{item.name}}</div>
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

    <div v-if="showResult && results.length === 0">test</div>

    <div class="flex w-full justify-center xl:justify-start mt-5" v-if="selectedPractice">
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
export default {
  data() {
    return {
      form: {
        search: '',
        has_users: false
      },
      showResult: false,
      setFocus: '',
      results: [],
      selectedPractice: null
    }
  },
  computed: {
    ccgs() {
      return this.$store.state.signUp.ccg
    }
  },
  methods: {
    search() {
      if (!this.form.search) {
        return
      }
      this.$axios
        .$get(`/api/v1/practices?search=${this.form.search}&has_users=${this.form.has_users}&limit=10`)
        .then(res => {
          this.results = []
          res.data.practices.forEach(item => {
            this.results.push({
              practice_id: item.id, name: item.name, address: `${item.address.line_1}, ${item.address.line_2}, ${item.address.line_3}, ${item.address.post_code}`,
              ccg: this.ccgs.find(ccg => ccg.id === item.clinical_commissioning_group_id).name, practice_code: item.code
            })
          })
        })
      this.showResult = true
    },
    next() {
      try {
        let item = this.results.find(item => item.practice_id === this.selectedPractice)
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
