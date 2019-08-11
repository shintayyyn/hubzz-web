<template>
  <div class="px-10">
    <div class="rounded-lg shadow-lg p-5" style="max-width:700px;">
      <div class="flex flex-row flex-wrap justify-between">
        <div class="p-2" :class="$store.state.mobile? 'w-full':'w-1/2'">
          <div class="text-sm my-2">Email address</div>
          <div class="text-sm font-bold">{{email_address}}</div>
        </div>
        <div class="p-2" :class="$store.state.mobile? 'w-full':'w-1/2'">
          <div class="text-sm my-2">Role</div>
          <div class="text-sm font-bold">{{role}}</div>
        </div>
        <div class="p-2" :class="$store.state.mobile? 'w-full':'w-1/2'">
          <div class="text-sm my-2">Sender</div>
          <div class="text-sm font-bold">{{sender}}</div>
        </div>
      </div>
      <div class="flex flex-row flex-wrap justify-start">
        <div class="p-2 w-full">
          <div
            class="mb-4 border-b border-b-2 border-grey py-2"
            :class="{'border-yellow-400':setFocus === 'message', 'border-red-300': formError.includes('message')}"
          >
            <label for="message" class="block text-sm mb-2">Your message</label>
            <em
              v-if="formError.includes('message')"
              class="text-xs text-red-400 float-right"
            >Required</em>
            <textarea
              rows="10"
              @focus="setFocus = 'message'"
              @blur="setFocus = ''"
              v-model="form.message"
              name="message"
              id="message"
              placeholder="Enter your message here..."
              class="appearance-none bg-transparent border-none w-full text-grey-darker mr-3 py-1 px-2 leading-tight focus:outline-none"
            ></textarea>
          </div>
        </div>
      </div>
      <div class="flex justify-start">
        <div class="text-left p-2">
          <button
            class="bg-yellow-400 hover:text-white focus:outline-none text-black font-bold text-xl p-6 rounded-lg"
            @click.prevent="send"
          >Send</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      email_address: '',
      role: '',
      sender: '',
      form: {
        message: ''
      },
      formError: [],
      setFocus: ''
    }
  },
  created() {
    // this should be on $auth.user
    this.email_address = 'kpabad.halcyondigital@gmail.com'
    this.role = 'Nurse | Advanced Nurse Practitioners (ANP)'
    this.sender = 'Mr. Kenneth Alvin Abad'
  },
  methods: {
    send() {
      console.log(this.form)
    }
  }
}
</script>
<style scoped>
button:active {
  transform: translate(2px, 2px);
}
</style>

