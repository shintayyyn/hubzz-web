<template>
  <div class="flex flex-col items-center justify-center w-full">
    <div class="flex w-full justify-center xl:justify-start">
      <div class="mx-4 flex flex-col p-8 m-1 rounded-lg shadow-lg" style="flex: 0 1 600px;">
        <div class="w-full">
          <AppInput
            v-model="form.search"
            :type="'text'"
            :name="'search'"
            :label="'Search for a Practice'"
            :placeholder="'Practice code, name of practice'"
            @error="error"
            @submit="search"
            isRequired
          />
        </div>
        <AppButton :label="'Search'" @click="search"/>
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
          :class="surgery_id === item.id ? 'bg-yellow-dark':'hover:bg-grey'"
          v-for="(item) in results"
          :key="item.id"
          @click="surgery_id = item.id"
        >
          <div class="flex flex-col justify-start">
            <div class="font-bold">{{item.name}}</div>
            <div
              class="mt-4"
            >{{item.address.line_1}}, {{item.address.line_2}}, {{item.address.line_3}}, {{item.address.post_code}}</div>
            <div class="flex flex-row flex-nowrap mt-1">
              <div class="text-sm rounded-lg bg-grey-light py-1 px-2 mr-1">CCG</div>
              <div class="text-sm flex items-center">{{item.clinical_commissioning_group.name}}</div>
            </div>
            <div class="flex flex-row flex-nowrap mt-1">
              <div class="text-sm rounded-lg bg-grey-light py-1 px-2 mr-1">Practice Code</div>
              <div class="text-sm flex items-center">{{item.code}}</div>
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

    <div v-if="showResult && results.length === 0">
      <div
        class="text-sm sm:text-md font-bold mt-2"
      >No practice matched that name. Try again with whole words, practice code or CCG.</div>
    </div>

    <div class="flex justify-center mt-4" v-if="surgery_id">
      <AppButton :label="'Next'" @click="next"/>
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
      form: {
        search: ''
      },
      formError: [],
      showResult: false,
      results: [],
      surgery_id: null
    }
  },
  computed: {
    surgeryId() {
      return this.$store.state.signUp.practice_details.surgery_id
    },
    search_results() {
      return this.$store.state.signUp.search_results
    }
  },
  mounted() {
    if (this.search_results.length > 0 && this.surgeryId) {
      this.results = this.search_results
      this.surgery_id = this.surgeryId
      this.showResult = true
    }
  },
  methods: {
    error(error) {
      if (!error.message) {
        //remove
        this.formError.splice(this.formError.findIndex(item => item.field === error.field), 1)
      } else {
        //add or update
        let item = this.formError.find(item => item.field === error.field)
        if (!item) {
          this.formError.push(error)
        } else {
          item.message = error.message
        }
      }
    },
    search() {
      if (!this.formError.length) {
        this.$axios
          .$get(`/api/v1/surgeries?search=${this.form.search}&limit=10`)
          .then(res => {
            this.results = []
            res.data.surgeries.forEach(item => {
              this.results.push(item)
            })
            this.showResult = true
          })
      }
    },
    next() {
      try {
        let item = this.results.find(item => item.id === this.surgery_id)
        this.$store.commit('signUp/SET_PRACTICE_DETAILS', { surgery_id: item.id, search_results: this.results })
        this.$emit('nextTab', 'PracticeAccountDetails')
      } catch (e) {

      }
    }
  }
}
</script>
<style scoped>
</style>
