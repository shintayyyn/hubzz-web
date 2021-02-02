<template>
  <section>
    <div v-on-clickaway="toggledOff" class="relative flex flex-col mb-3 md:mb-4">
      <div v-if="label || info" class="relative flex flex-row flex-wrap justify-between">
        <label v-if="label" :for="name" class="text-xs sm:text-sm py-1">
          {{ label }}
          <span v-if="required" class="text-red-500">*</span>
        </label>

        <div v-if="info" class="rounded-lg bg-gray-300 p-1 text-xs sm:text-sm">
          {{ info }}
        </div>
      </div>

      <div class="relative flex flex-row flex-wrap items-center justify-start">
        <div v-if="defaultItem" class="rounded-lg bg-yellow-500 py-2 px-3 m-1 text-xs sm:text-sm">
          {{ defaultItem }}
        </div>

        <div
          v-for="(item, index) in value"
          :key="`${item.value}-${index}`"
          class="rounded-lg bg-yellow-500 py-1 px-3 m-1 text-xs sm:text-sm flex items-center justify-between"
        >
          {{ item.label }}
          <!-- <span
            v-if="!disabled"
            class="font-bold cursor-pointer text-base pl-3"
            @click="remove(index)"
          >x</span> -->
        </div>

        <div v-if="!disabled">
          <input
            v-show="show"
            ref="input"
            v-model="search"
            type="text"
            :placeholder="placeholder"
            class="border-b-2 focus:border-yellow-400 focus:outline-none py-2 font-bold text-xs sm:text-sm"
            :class="error ? 'border-red-500' : ''"
            @focus="toggled = true"
            @keydown="handleKeyDownEvent"
            @change="$emit('change')"
          >
          <span v-if="required && !label" class="text-red-500">*</span>
          <transition name="drop-down">
            <div
              v-if="error"
              class="text-red-500 py-1 text-xs text-white"
            >
              {{ error.message.charAt(0).toUpperCase() + error.message.slice(1).replace(/_/g, " ") }}
            </div>
          </transition>
        </div>
      </div>

      <div v-show="show" class="relative flex flex-col w-full z-10">
        <div
          ref="filterSearchOptions"
          class="absolute w-full option-list flex flex-col bg-white shadow-md overflow-y-auto"
          :class="{'slide-down': toggled}"
          @scroll="scrollHandler"
        >
          <div class="relative">
            <div
              v-for="(item, index) in filteredItems"
              :id="`${item.label}`"
              :key="`${item.value}-${index}`"
              class="py-2 px-3 cursor-pointer text-xs sm:text-sm"
              :class="{'bg-gray-300': activeIndex === index}"
              @mouseover="activeIndex = index"
              @click="add(item)"
            >
              {{ item.label }}
            </div>

            <AppLoading :loading="loading" :message="'Loading'" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import { mixin as clickaway } from "vue-clickaway"
  import AppLoading from "@/components/Base/AppLoading"

  export default {

    components: {
      AppLoading,
    },

    mixins: [clickaway],

    props: {
      responseObj: {
        type: String,
        default: null,
      },

      value: {
        type: [Array, String, Number],
        default: () => null,
      },

      name: {
        type: String,
        default: null,
      },

      label: {
        type: String,
        default: null,
      },

      placeholder: {
        type: String,
        default: null,
      },

      error: {
        type: Object,
        default: () => null,
      },

      info: {
        type: String,
        default: null,
      },

      url: {
        type: String,
        default: null,
      },

      limitItem: {
        type: Number,
        default: null,
      },

      required: {
        type: Boolean,
        default: false
      },

      disabled: Boolean,

      professionCategoryId: {
        type: String,
        default: null
      },

      defaultItem: {
        type: String,
        default: null
      },

      selectionLists: {
        type: Array,
        default: () => [],
      },
    },

    data () {
      return {
        loading: false,
        search: "",
        total: 0,
        hasMore: true,
        items: [],
        toggled: false,
        activeIndex: 0
      }
    },

    computed: {
      show () {
        return !this.limitItem || this.limitItem !== this.value.length
      },

      filteredItems () {
        return this.items.filter(filterItem => {
          const index = this.value.findIndex(item => {
            return item.value && item.value === filterItem.value
          })
          return index === -1 && filterItem.value
        })
      },
    },

    watch: {
      activeIndex (value) {
        const getRef = document.getElementById(
          `${this.filteredItems[value].label}`
        )
        getRef.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "start"
        })
      },

      professionCategoryId (newValue, oldValue) {
        if (newValue && oldValue) {
          this.items = []
          this.getListsCount(this.search)
        }
      },

      search () {
        this.$emit('search', this.search)
        this.items = []
        this.getListsCount(this.search)
      },

      selectionLists () {
        this.items = this.selectionLists
      },
    },

    created () {
      this.items = this.selectionLists

      this.getListsCount(this.search)
    },

    methods: {
      scrollHandler () {
        if (
          this.$refs.filterSearchOptions.offsetHeight +
            this.$refs.filterSearchOptions.scrollTop >=
          this.$refs.filterSearchOptions.scrollHeight - 1
        ) {
          if (this.hasMore === true && !this.loading) {
            this.getLists(this.items.length, this.search)
          }
        }
      },

      getListsCount (search) {
        if (!this.url) {
          return
        }

        this.items = []
        let params = {}

        if (this.name === "qualification_id" || this.name === "specialty") {
          params = {
            ...params,
            profession_category_id: this.professionCategoryId
          }
        }

        params = { ...params, search }

        this.$axios
          .$get(`${this.url}/count`, { params })
          .then(res => {
            this.total = res.data.count
            this.getLists(this.items.length, this.search)
          })
          .catch(err => {
            console.log("err", err.response || err)
            if (err.response.data.message) {
              this.$store.commit("SET_NOTIFICATION", {
                enabled: true,
                status: "danger",
                text: [`${err.response.data.message}`]
              })
            }
          })
      },

      getLists (offset, search) {
        if (!this.url) {
          return
        }

        this.loading = true
        this.hasMore = true

        let params = {}

        if (this.name === "qualification_id" || this.name === "specialty") {
          params = {
            ...params,
            profession_category_id: this.professionCategoryId
          }
        }

        params = { ...params, offset, limit: 10, search }

        this.$axios
          .$get(`${this.url}`, { params })
          .then(res => {
            if (res.data.practice_types) {
              if (res.data.practice_types.length === 0) {
                this.loadMore = false
              } else {
                res.data.practice_types.forEach(item => {
                  this.items.push({
                    label: item.name,
                    value: item.id
                  })
                })
                if (res.data.practice_types.length < 10) {
                  this.loadMore = false
                }
              }
            }

            if (res.data.qualifications) {
              if (res.data.qualifications.length === 0) {
                this.hasMore = false
              } else {
                res.data.qualifications.forEach(item => {
                  this.items.push({
                    label: item.name,
                    value: item.id
                  })
                })
                if (res.data.qualifications.length < 10) {
                  this.hasMore = false
                }
              }
            }

            if (res.data.clinical_systems) {
              if (res.data.clinical_systems.length === 0) {
                this.hasMore = false
              } else {
                res.data.clinical_systems.forEach(item => {
                  this.items.push({
                    label: item.name,
                    value: item.id
                  })
                })
                if (res.data.clinical_systems.length < 10) {
                  this.hasMore = false
                }
              }
            }

            if (res.data.spoken_languages) {
              if (res.data.spoken_languages.length === 0) {
                this.hasMore = false
              } else {
                res.data.spoken_languages.forEach(item => {
                  this.items.push({
                    label: item.name,
                    value: item.id
                  })
                })
                if (res.data.spoken_languages.length < 10) {
                  this.hasMore = false
                }
              }
            }

            if (res.data.surgeries) {
              if (res.data.surgeries.length === 0) {
                this.hasMore = false
              } else {
                res.data.surgeries.forEach(item => {
                  this.items.push({
                    label: item.name,
                    value: item.id
                  })
                })
                if (res.data.surgeries.length < 10) {
                  this.hasMore = false
                }
              }
            }

            if (this.responseObj) {
              if (res.data[this.responseObj].length === 0) {
                this.hasMore = false
              } else {
                res.data[this.responseObj].forEach(item => {
                  this.items.push({
                    label: item.name,
                    value: item.id
                  })
                })
                if (res.data[this.responseObj].length < 10) {
                  this.hasMore = false
                }
              }
            }
          }).catch((err) => {
            console.log("err", err.response || err)
            if (err.response.data.message) {
              this.$store.commit("SET_NOTIFICATION", {
                enabled: true,
                status: "danger",
                text: [`${err.response.data.message}`]
              })
            }
          }).finally(() => {
            this.loading = false
          })
      },

      add (item) {
        if (this.limitItem && this.limitItem == this.value.length) {
          return
        }

        const newValue = JSON.parse(JSON.stringify(this.value))
        newValue.push(item)
        this.$refs.input.focus()
        this.$emit('input', newValue)
        this.$emit("add")

        if (
          this.$refs.filterSearchOptions.offsetHeight +
            this.$refs.filterSearchOptions.scrollTop >=
          this.$refs.filterSearchOptions.scrollHeight - 1
        ) {
          if (this.hasMore === true && !this.loading) {
            this.getLists(this.items.length, this.search)
          }
        }
      },

      remove (index) {
        const newValue = JSON.parse(JSON.stringify(this.value))
        newValue.splice(index, 1)
        this.$refs.input.focus()
        this.$emit('input', newValue)
        this.$emit("remove")
      },

      toggledOff () {
        this.toggled = false
      },

      handleKeyDownEvent () {
        if (!this.toggled) {
          return
        }

        if (event.key === "ArrowUp") {
          if (this.activeIndex > 0) {
            this.activeIndex--
          }
        }

        if (event.key === "ArrowDown") {
          if (this.activeIndex < this.items.length - 1) {
            this.activeIndex++
          }
        }

        if (event.key === "Enter") {
          this.add(this.items[this.activeIndex])
        }

        if (event.key === "Backspace") {
          if (!this.search) {
            this.remove(this.value.length - 1)
          }
          this.$refs.input.focus()
        }

        if (event.key === "Escape") {
          this.toggledOff()
        }
      }
    },
  }
</script>

<style scoped>
  .option-list {
    transition: all 0.3s ease-in-out;
    height: 0;
  }
  .slide-down {
    transition: all 0.3s ease-in-out;
    height: 200px;
  }
</style>
