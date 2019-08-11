<template>
  <section>
    <div class="add-surgery-confirmation-shield" v-if="modal"></div>
    <transition name="drop" mode="out-in">
      <div class="add-surgery-confirmation-modal flex justify-center" v-if="modal">
        <AddSurgeryConfirmationModal @add="add" @close="modal = false" />
      </div>
    </transition>

    <div class="p-8 max-w-xl">
      <div @click="$emit('close')" class="cursor-pointer">
        <svgicon name="left-arrow" height="32" width="32" />
      </div>
      <div class="flex justify-start font-bold text-sm sm:text-xl mt-8">Add Surgery</div>
      <div class="rounded-lg shadow-lg px-8 py-4 mt-4">
        <AppInput
          v-model="search_text"
          :type="'text'"
          :name="'search'"
          :label="''"
          :placeholder="''"
        />
        <AppButton :label="'Search'" @click="search" :inStyle="'padding:5px;'" />
      </div>
      <div v-if="showResult && surgeries.length === 0" class="mt-5">
        <div
          class="text-xs xl:text-base font-bold"
        >No practice matched that name. Try again with whole words, practice code or CCG.</div>
      </div>
      <div
        class="rounded-lg shadow-lg overflow-auto mt-5"
        v-if="showResult && surgeries.length > 0"
      >
        <div
          class="text-xs lg:text-base font-bold p-4"
        >Select by clicking on the practice that you wish to add</div>
        <div
          class="border-t-2 p-4 cursor-pointer"
          :class="selectedSurgery.id === item.id ? 'bg-yellow-400':'hover:bg-grey'"
          v-for="(item) in surgeries"
          :key="item.id"
          @click="select(item)"
        >
          <div class="flex flex-col justify-start text-xs xl:text-base">
            <div class="font-bold">{{item.name}}</div>
            <div
              class="mt-4"
            >{{item.address.line_1}}, {{item.address.line_2}}, {{item.address.line_3}}, {{item.address.post_code}}</div>
            <div class="flex flex-row flex-no-wrap mt-1">
              <div class="rounded-lg bg-gray-200 py-1 px-2 mr-1">CCG</div>
              <div class="flex items-center">{{item.clinical_commissioning_group.name}}</div>
            </div>
            <div class="flex flex-row flex-no-wrap mt-1">
              <div class="rounded-lg bg-gray-200 py-1 px-2 mr-1">Practice Code</div>
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
  </section>
</template>
<script>
import AppInput from '@/components/Base/AppInput'
import AppButton from '@/components/Base/AppButton'
import AddSurgeryConfirmationModal from '@/components/Profile/AddSurgeryConfirmationModal'
export default {
  components: {
    AppInput,
    AppButton,
    AddSurgeryConfirmationModal,
  },
  data() {
    return {
      search_text: '',
      surgeries: [],
      selectedSurgery: {},
      showResult: false,
      modal: false,
    }
  },
  methods: {
    search() {
      if (!this.search_text) {
        return
      }
      this.$axios.$get(`/api/v1/surgeries?search=${this.search_text}&has_parent=false&is_parent=false&limit=10`).then(res => {
        this.surgeries = res.data.surgeries
        this.showResult = true
      })
    },
    select(item) {
      this.selectedSurgery = item
      this.modal = true
    },
    add() {
      this.$axios.$post(`/api/v1/practice/practice-children`, { surgery_id: this.selectedSurgery.id }).then(res => {
        this.$emit('add', res.data.practice_child)
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: [`${res.message}`] })
        this.modal = false
        // this.$emit('close')
      })
    }
  }
}
</script>

<style scoped>
.add-surgery-confirmation-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: auto;
  z-index: 514;
}
.add-surgery-confirmation-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 513;
}
</style>