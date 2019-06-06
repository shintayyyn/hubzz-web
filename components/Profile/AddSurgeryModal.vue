<template>
  <div class="p-8 max-w-xl">
    <div @click="$emit('close')" class="cursor-pointer">
      <svgicon name="left-arrow" height="32" width="32"/>
    </div>
    <div class="flex flex-row justify-start font-bold text-xs sm:text-xl mt-8">Add Surgery</div>
    <div class="rounded-lg shadow-lg mt-4 p-5">
      <AppInput v-model="text" :type="'text'" :name="'search'"/>
      <AppButton :label="'Search'" @click="search" :inStyle="'padding:10px;'"/>
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
        :class="selectedSurgery.id === item.id ? 'bg-yellow-dark':'hover:bg-grey'"
        v-for="item in results"
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
            <div class="flex items-center">{{item.code}}</div>
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
import AppInput from '@/components/Base/AppInput'
import AppButton from '@/components/Base/AppButton'
export default {
  components: {
    AppInput,
    AppButton
  },
  data() {
    return {
      showResult: false,
      text: '',
      results: [],
      selectedSurgery: {
        address: {},
        clinical_commissioning_group: {},
        code: '',
        id: '',
        name: '',
        phone_number: ''
      },
    }
  },
  created() {
    this.showResult = false
    this.text = ''
    this.results = []
  },
  methods: {
    search() {
      if (!this.text) {
        return
      }
      // ! ask arvi / pass some params (that are already added) to exclude in the results
      this.$axios
        .$get(`/api/v1/surgeries?search=${this.text}&has_parent=false&is_parent=false&limit=10`)
        .then(res => {
          console.log(res)
          this.results = res.data.surgeries
          this.showResult = true
        })
    },
    select(item) {
      this.selectedSurgery.address = item.address
      this.selectedSurgery.clinical_commissioning_group = item.clinical_commissioning_group
      this.selectedSurgery.id = item.id
      this.selectedSurgery.name = item.name
      this.selectedSurgery.phone_number = item.phone_number
      //   set to store
      this.$store.commit('profile/SET_SELECTEDSURGERY_ID', this.selectedSurgery.id)
      this.$store.commit('SET_ADDSELECTEDSURGERY_MODAL', true)
      this.$store.commit('SET_ADDSELECTEDSURGERY_SHIELD', true)
    },
    add() {

    }
  },
}
</script>
<style>
</style>


