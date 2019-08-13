<template>
  <div>
    <div class="border-solid rounded-lg shadow-md mb-8">
      <div class="text-sm font-semibold p-5">Select by clicking on the practice that you wish to add</div>
      <div
        v-for="(item, index) in results"
        :key="index"
        class="p-5 cursor-pointer hover:bg-gray-300 focus:bg-yellow-500 outline-none"
        :tabindex="index"
        @click.prevent="select(item._id)"
      >
        <div class="text-xl font-semibold mb-2">{{item.name}}</div>
        <div class="text-sm">{{item.address}}</div>
        <div class="text-sm">
          <span class="px-1 text-xs rounded-sm bg-gray-300">Practice Code</span>
          {{item.code}}
        </div>
      </div>
      <div class="p-5 text-sm font-semibold leading-tight">
        These are just top 10 matches from your search term.
        <br />Try again with practice code of its full name if the practice isn't in the result.
      </div>
    </div>
    <div class="text-center" v-if="selectedPractice">
      <button
        class="bg-yellow-500 hover:text-white focus:outline-none text-black font-bold text-xl p-6 rounded-lg"
        @click.prevent="next()"
      >Next</button>
    </div>
  </div>
</template>
<script>
const results = [
  {
    _id: '1',
    name: 'CAMP HILL GP LED HEALTH CENTRE',
    address: 'RAMSDEN AVENUE, CAMPHILL, NUNEATON CV10 9EB',
    code: 'Y04969',
  },
  {
    _id: '2',
    name: 'FIVE TOWNS GP SURGERY',
    address: 'SHELDON PRIMARY CARE, TRENT',
    code: 'Y04965',
  },
  {
    _id: '3',
    name: 'LOCKWOOD GP SURGERY',
    address: 'CIVIC CENTRE, BRECK ROAD',
    code: 'Y04929',
  },
]
export default {
  data() {
    return {
      results,
      selectedPractice: ''
    }
  },
  methods: {
    select(id) {
      this.selectedPractice = id
    },
    next() {
      this.$emit('nextStep', this.selectedPractice)
    }
  }
}
</script>
