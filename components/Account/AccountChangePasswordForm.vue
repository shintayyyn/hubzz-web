<template>
  <div class="border-solid rounded-lg shadow-lg p-8">
    <form class="w-full">
      <div class="relative flex flex-col mt-8">
        <div class="flex flex-row justify-between">
          <label for="current_password" class="text-sm" style="width:50%">Current Password</label>
        </div>
        <div class="flex flex-row justify-between mt-4">
          <div
            class="flex flex-col border-b-2 border-grey-light"
            style="width:100%"
            :class="[setFocus === 'current_password' ? 'border-yellow':'', formError.find(item => item.field === 'current_password') ? 'border-red':'']"
          >
            <input
              type="password"
              name="current_password"
              id="current_password"
              ref="current_password"
              class="focus:outline-none font-bold text-sm"
              style="height:40px;"
              @focus="setFocus = 'current_password'"
              @blur="setFocus = ''"
              v-model="form.current_password"
            >
          </div>
        </div>
        <div
          class="absolute pin-t pin-r bg-red text-white p-1"
          v-if="formError.find(item => item.field === 'current_password')"
        >{{formError.find(item => item.field === 'current_password').message}}</div>
      </div>

      <div class="relative flex flex-col mt-8">
        <div class="flex flex-row justify-between">
          <label for="new_password" class="text-sm" style="width:50%">New Password</label>
        </div>
        <div class="flex flex-row justify-between mt-4">
          <div
            class="flex flex-col border-b-2 border-grey-light"
            style="width:100%"
            :class="[setFocus === 'new_password' ? 'border-yellow':'', formError.find(item => item.field === 'new_password') ? 'border-red':'']"
          >
            <input
              type="password"
              name="new_password"
              id="new_password"
              ref="new_password"
              class="focus:outline-none font-bold text-sm"
              style="height:40px;"
              @focus="setFocus = 'new_password'"
              @blur="setFocus = ''"
              v-model="form.new_password"
            >
          </div>
        </div>
        <div
          class="absolute pin-t pin-r bg-red text-white p-1"
          v-if="formError.find(item => item.field === 'new_password')"
        >{{formError.find(item => item.field === 'new_password').message}}</div>
      </div>

      <div class="relative flex flex-col mt-8">
        <div class="flex flex-row justify-between">
          <label
            for="repeat_password"
            class="text-sm"
            style="width:50%"
          >Repeat new password to confirm</label>
        </div>
        <div class="flex flex-row justify-between mt-4">
          <div
            class="flex flex-col border-b-2 border-grey-light"
            style="width:100%"
            :class="[setFocus === 'repeat_password' ? 'border-yellow':'', formError.find(item => item.field === 'repeat_password') ? 'border-red':'']"
          >
            <input
              type="password"
              name="repeat_password"
              id="repeat_password"
              ref="repeat_password"
              class="focus:outline-none font-bold text-sm"
              style="height:40px;"
              @focus="setFocus = 'repeat_password'"
              @blur="setFocus = ''"
              v-model="form.repeat_password"
            >
          </div>
        </div>
        <div
          class="absolute pin-t pin-r bg-red text-white p-1"
          v-if="formError.find(item => item.field === 'repeat_password')"
        >{{formError.find(item => item.field === 'repeat_password').message}}</div>
      </div>

      <div class="text-left mt-5">
        <button
          class="bg-yellow-dark hover:text-white focus:outline-none text-black font-bold text-xl p-6 rounded-lg"
          @click.prevent="update"
        >Update</button>
      </div>
    </form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      setFocus: '',
      form: {
        current_password: '',
        new_password: '',
        repeat_password: '',
      },
      formError: []
    }
  },
  methods: {
    update() {
      this.formError = []
      this.Validate(this.form)
      this.ValidatePassword(this.form.new_password, this.form.repeat_password)
      if (!this.formError.length) {
        // action dispatch to api, return promise
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'Updated !' })
      }
    }
  }
}
</script>
<style scoped>
button:active {
  transform: translate(2px, 2px);
}
</style>

