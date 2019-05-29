<template>
  <div>
    <div class="flex flex-row justify-end">
      <button
        class="bg-yellow-dark rounded-full font-bold text-3xl hover:text-white focus:outline-none"
        style="width:40px;height:40px;"
        @click="add"
      >+</button>
      <div class="ml-2 text-xs sm:text-sm" style="line-height:280%">Add Surgery</div>
    </div>
    <div class="flex flex-col mt-4">
      <div class="flex flex-row px-4 flex-nowrap justify-between">
        <div class="text-xs sm:text-sm w-full px-1">Practice</div>
        <div class="text-xs sm:text-sm w-full px-1">Practice code</div>
        <div class="text-xs sm:text-sm w-full px-1">Location</div>
      </div>
      <div class="rounded-lg shadow-lg p-4 mt-4" v-for="item in results" :key="item.id">
        <div class="flex flex-row flex-nowrap">
          <div class="text-xs sm:text-sm w-full px-1">{{item.surgery.name}}</div>
          <div class="text-xs sm:text-sm w-full px-1">{{item.surgery.code}}</div>
          <div
            class="text-xs sm:text-sm w-full px-1"
          >{{item.surgery.address.line_1}} {{item.surgery.address.line_2}} {{item.surgery.address.line_3}} {{item.surgery.address.post_code}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      results: []
    }
  },
  computed: {
    // get added surgery from profile - surgeries tab
    practiceChildren() {
      return this.$store.state.profile.added_surgery
    }
  },
  watch: {
    // watch store added surgery for each added from profile - surgeries tab
    practiceChildren(value) {
      if (value) {
        this.results.push(value)
      }
    }
  },
  created() {
    // practice children
    this.$axios.$get(`/api/v1/practice/practice-children`).then(res => {
      this.results = res.data.practice_children
    })
  },
  methods: {
    add() {
      this.$store.commit('SET_ADDSURGERY_SHIELD', true)
      let d = document.getElementsByClassName('add-surgery-modal')[0]
      d.classList.toggle('toggled-right')
      document.body.style.overflow = 'hidden'
      this.$store.commit('SET_ADDSURGERY_MODAL', true)
    }
  }
}
</script>

