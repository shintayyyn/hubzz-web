<template>
  <div
    class="absolute pin-r pin-y z-20 p-10 h-auto bg-white shadow-lg"
    style="height:1800px"
    :style="$store.state.mobile ? 'width:100%' : 'width:90%'"
  >
    <div
      v-if="modal"
      class="fixed pin-t z-50"
      :class="$store.state.mobile ? 'w-full pin-x':'flex justify-center w-full pin-x'"
    >
      <div class="border-solid rounded-b-lg bg-yellow-dark py-2 px-24">
        <div class="flex justify-center">
          <svgicon name="alert" height="20" width="20"/>
          <div class="text-sm ml-2">Proceed to add this surgery?</div>
        </div>
        <div class="flex justify-center my-2">
          <div class="mx-2">
            <button
              class="border border-solid bg-yellow-dark hover:text-white focus:outline-none text-black font-bold py-5 rounded-lg"
              style="width:100px;"
              @click.prevent="add"
            >Yes</button>
          </div>
          <div class="mx-2">
            <button
              class="border border-solid bg-yellow-dark hover:text-white focus:outline-none text-black font-bold py-5 rounded-lg"
              @click.prevent="modal=false"
              style="width:100px;"
            >Cancel</button>
          </div>
        </div>
      </div>
    </div>
    <div @click="$store.commit('TOGGLE_SURGERY_MODAL', false)" class="cursor-pointer">
      <svgicon name="left-arrow" height="32" width="32"/>
    </div>
    <div class="font-bold text-lg my-5" style="font-family: Nunito">Add Surgery</div>

    <div class="rounded-lg shadow-lg p-5">
      <div
        class="mb-4 border-b border-b-2 border-grey py-2"
        :class="{'border-yellow-dark':setFocus === 'search'}"
      >
        <input
          @focus="setFocus = 'search'"
          @blur="setFocus = ''"
          @keyup.enter="search"
          v-model="form.search"
          type="text"
          placeholder="Search for practice by name, etc"
          class="appearance-none bg-transparent border-none w-full text-sm font-bold leading-tight focus:outline-none"
        >
      </div>
      <button
        class="rounded-lg shadow-md bg-yellow-dark p-2 text-sm font-bold hover:text-white focus:outline-none"
        @click="search"
      >Search</button>
    </div>

    <div v-if="showResult && results.length === 0" class="mt-5">
      <div
        class="text-xs xl:text-base font-bold"
      >No practice matched that name. Try again with whole words, practice code or CCG.</div>
    </div>
    <div class="rounded-lg shadow-lg overflow-auto mt-5" v-if="showResult && results.length > 0">
      <div
        class="text-xs lg:text-base font-bold p-4"
      >Select by clicking on the practice that you wish to add</div>
      <div
        class="border-t-2 p-4 cursor-pointer"
        :class="selectedPractice.id === item.id ? 'bg-yellow-dark':'hover:bg-grey'"
        v-for="(item) in results"
        :key="item.id"
        @click="select(item)"
      >
        <div class="flex flex-col justify-start text-xs xl:text-base">
          <div class="font-bold">{{item.name}}</div>
          <div
            class="mt-4"
          >{{item.address.line_1}}, {{item.address.line_2}}, {{item.address.line_3}}, {{item.address.post_code}}</div>
          <div class="flex flex-row flex-nowrap mt-1">
            <div class="rounded-lg bg-grey-light py-1 px-2 mr-1">CCG</div>
            <div class="flex items-center">{{item.clinical_commissioning_group.name}}</div>
          </div>
          <div class="flex flex-row flex-nowrap mt-1">
            <div class="rounded-lg bg-grey-light py-1 px-2 mr-1">Practice Code</div>
            <div class="flex items-center">{{item.practice_code}}</div>
          </div>
        </div>
      </div>
      <div class="border-t-2 p-4 text-xs xl:text-base">
        <p class="font-bold">These are just top 10 matches from your search term.</p>
        <p
          class="font-bold"
        >Try again with practice code or its full name if the practice isn't in the result.</p>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  data() {
    return {
      form: {
        search: ''
      },
      results: [],
      showResult: false,
      modal: false,
      selectedPractice: {
        id: '',
        name: '',
        address: {},
        ccg: '',
        practice_code: '',
        email: '',
        phone_number: ''
      },
      setFocus: ''
    }
  },
  mounted() {
    // get all the added surgery/practice id
    let ids = []
    this.$store.state.dashboard.surgeries.forEach(item => {
      ids.push(item.id)
    })
    // pass it as a params in search request to avoid duplicate
  },
  methods: {
    add() {
      this.$emit('addSurgery', this.selectedPractice)
      this.modal = false
      this.$store.commit('TOGGLE_SURGERY_MODAL', false)
    },
    select(item) {
      this.selectedPractice = item
      this.modal = true
    },
    search() {
      if (!this.form.search) {
        return
      }
      this.$axios
        .$get(`/api/v1/surgeries?search=${this.form.search}&limit=10`)
        .then(res => {
          this.results = res.data.surgeries
          // res.data.surgeries.forEach(item => {
          //   this.results.push({
          //     id: item.id,
          //     name: item.name,
          //     address: item.address,
          //     ccg: this.ccgs.find(ccg => ccg.id === item.clinical_commissioning_group_id).name,
          //     practice_code: item.code,
          //     email: item.email,
          //     phone_number: item.phone_number
          //   })
          // })
          this.showResult = true
        })
    }
  }
}
</script>
<style>
button:active {
  transform: translate(5px, 5px);
}
</style>

