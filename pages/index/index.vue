<template>
  <div class="bg-white rounded-lg shadow-lg p-4 md:p-8">
    <div class="w-full flex flex-col">
      <AppInput
        v-model="form.email"
        :type="'email'"
        :name="'email'"
        :label="'Email address'"
        :placeholder="''"
        :error="formError.find(item => item.field === 'email')"
        @submit="login"
      />
      <div class="flex flex-col">
        <label class="text-xs md:text-sm">Password</label>
        <div class="w-full relative">
          <input
            v-model="form.password"
            :type="form.type"
            :error="formError.find(item => item.field === 'password')"
            @submit="login"
            @keyup.enter="login"
            class="w-full py-3 border-b-2 focus:border-yellow-400 focus:outline-none text-xs md:text-sm"
            :class="formError.length > 0 ? 'border-red-500' : ''"
          />
          <button
            @click="form.type === 'password' ? form.type = 'text' : form.type = 'password'"
            class="absolute top-0 right-0 mx-2 h-full focus:outline-none"
            v-if="form.password"
          >
            <svgicon
              v-if="form.type === 'password'"
              name="eye"
              height="24"
              width="24"
              class="fill-current text-gray-500 hover:text-gray-600"
            />
            <svgicon
              v-else
              name="hide-eye"
              height="24"
              width="24"
              class="fill-current text-gray-500 hover:text-gray-600"
            />
          </button>
        </div>
      </div>
    </div>

    <div class="flex justify-end mt-2 mb-8">
      <nuxt-link to="/forgot-password">
        <span class="hover:underline text-sm cursor-pointer">Forgot password?</span>
      </nuxt-link>
    </div>
    <div class="flex justify-center">
      <AppButton :label="'Sign In'" @click="login" :disabled="logginIn" />
    </div>
  </div>
</template>

<script>
import AppInput from "@/components/Base/AppInput";
import AppButton from "@/components/Base/AppButton";
import debounce from 'lodash.debounce'
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },
  layout: "auth",
  components: {
    AppInput,
    AppButton
  },
  data() {
    return {
      form: {
        email: "",
        password: "",
        type: "password"
      },
      formError: [],
      logginIn: false,
    };
  },
  methods: {
    login: debounce(function () {
      try {
        if (this.logginIn) {
          return
        }

        this.formError = [];
        this.Validate(this.form);

        if (!this.formError.length) {
          this.logginIn = true
          this.$axios
            .$post("/api/v1/login", this.form)
            .then(async res => {
              // Email Verification
              //  if(res.data.user.is_email_verified === false){
              //   this.formError.push({ field: "email", message: "Email is not yet verified. Check your email and verify your account first." })
              // } else{
              const token = res.data.token.token;
              this.$axios.setToken(token, "Bearer");
              this.$auth.$storage.setUniversal(
                "_token.local",
                "Bearer " + token
              );
              await this.$auth.fetchUser();
              this.$router.push("/dashboard");
              if (this.$socket.connected) {
                await this.$axios.post("/api/v1/socket/login", {
                  socket_id: this.$socket.id
                });
                console.log("Socket Logged In");
              }
              await this.$store.dispatch("one-signal/setOneSignalUser");
              // }
            })
            .catch(err => {
              console.log("err", err.response || err);
              if (err.response.data.message) {
                this.$store.commit("SET_NOTIFICATION", {
                  enabled: true,
                  status: "danger",
                  text: [`${err.response.data.message}`]
                });
              }
              if (err.response.data.error_messages) {
                err.response.data.error_messages.forEach(error => {
                  this.formError.push(error);
                });
              }
            })
            .finally(() => {
              this.logginIn = false
            });
        }
      } catch (e) {
        console.log(e);
      }
    }, 10),
  }
};
</script>
<style scoped>
a {
  text-decoration: none;
  color: black;
}
</style>

