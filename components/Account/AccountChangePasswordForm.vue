<template>
  <div class="border-solid rounded-lg shadow-lg">
    <div class="w-full">
        <form class="px-8 pt-6 pb-8 mb-4">
          <div class="mb-4 border-b border-b-2 border-grey py-2" :class="{'border-yellow-dark':setFocus === 'current_password', 'border-red': formError.includes('current_password')}">
            <label for="current_password" class="block text-sm mb-2">Current Password</label>
            <em v-if="formError.includes('current_password')" class="text-xs text-red-darker float-right">Required</em>
            <input @focus="setFocus = 'current_password'" @blur="setFocus = ''" v-model="form.current_password" type="password" name="current_password" id="current_password" class="appearance-none bg-transparent border-none w-full text-grey-darker mr-3 py-1 px-2 leading-tight focus:outline-none">
          </div>
          <div class="mb-4 border-b border-b-2 border-grey py-2" :class="{'border-yellow-dark':setFocus === 'new_password', 'border-red': formError.includes('new_password')}">
            <label for="new_password" class="block text-sm mb-2">New Password</label>
            <em v-if="formError.includes('new_password')" class="text-xs text-red-darker float-right">Required</em>
            <input @focus="setFocus = 'new_password'" @blur="setFocus = ''" v-model="form.new_password" type="password" name="new_password" id="new_password" class="appearance-none bg-transparent border-none w-full text-grey-darker mr-3 py-1 px-2 leading-tight focus:outline-none">
          </div>
          <div class="mb-4 border-b border-b-2 border-grey py-2" :class="{'border-yellow-dark':setFocus === 'confirm_new_password', 'border-red': formError.includes('confirm_new_password')}">
            <label for="confirm_new_password" class="block text-sm mb-2">Repeat new password to confirm</label>
            <em v-if="formError.includes('confirm_new_password')" class="text-xs text-red-darker float-right">Required</em>
            <input @focus="setFocus = 'confirm_new_password'" @blur="setFocus = ''" v-model="form.confirm_new_password" type="password" name="confirm_new_password" id="confirm_new_password" class="appearance-none bg-transparent border-none w-full text-grey-darker mr-3 py-1 px-2 leading-tight focus:outline-none">
          </div>

          <div class="text-left mt-5">
            <button class="bg-yellow-dark hover:text-white focus:outline-none text-black font-bold text-xl p-6 rounded-lg" @click.prevent="update">Update</button>
          </div>

        </form>
      </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      loading: false,
      setFocus: '',
      form: {
        current_password: '',
        new_password: '',
        confirm_new_password: '',
      },
      formError: []
    }
  },
  methods: {
    update () {
      this.loading = true
      this.formError = []
      // ! validate locally on this component only
      this.Validate()
      if (!this.formError.length) {
      } else {
        this.loading = false
      }
    }
  }
}
</script>

