<template>
    <div class="border border-solid border-r-8 absolute pin-r pin-t z-20 p-10 bg-grey-lighter" style="height:130%" :style="$store.state.mobile ? 'width:100%' : 'width:60%'">
      <div @click="$store.commit('TOGGLE_SURGERY_MODAL', false)" class="cursor-pointer" v-text="'<'"></div>
      <div class="font-bold text-lg my-5" style="font-family: Nunito">Add Surgery</div>

      <div class="border-solid rounded-lg shadow-md mb-8 px-5 py-8" style="width:90%">
        <div class="mb-4 border-b border-b-2 border-grey py-2" :class="{'border-yellow-dark':setFocus === 'surgery'}">
            <input @focus="setFocus = 'surgery'" @blur="setFocus = ''" v-model="form.surgery" type="text" name="surgery"
                placeholder="Search for practice by name, etc"
                class="appearance-none bg-transparent border-none w-full text-sm font-bold leading-tight focus:outline-none">
        </div>
        <button class="rounded-lg shadow-md bg-yellow-dark p-2 text-sm font-bold hover:text-white focus:outline-none" @click="search">Search</button>
      </div>

    </div>
</template>
<script>

export default {
  data () {
    return {
        form: {
            surgery: ''
        },
        setFocus: ''
    }
  },
  methods: {
    search () {
        this.$store.commit('TOGGLE_SURGERY_MODAL', false)
        if (this.form.surgery === '') {
          return
        }
        this.$emit('addSurgery', this.form.surgery)
    }
  }
}
</script>
