<template>
  <div class="rounded-lg shadow-lg px-8 pb-8 pt-12">
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
      <AppInput
        v-model="form.password"
        :type="'password'"
        :name="'password'"
        :label="'Password'"
        :placeholder="''"
        :error="formError.find(item => item.field === 'password')"
        @submit="login"
      />
    </div>

    <div class="flex justify-end mb-8">
      <nuxt-link to="/forgot-password">
        <span class="hover:underline cursor-pointer">Forgot password?</span>
      </nuxt-link>
    </div>
    <div class="flex justify-center">
      <AppButton :label="'Sign In'" @click="login" />
    </div>
  </div>
</template>

<script>
import AppInput from "@/components/Base/AppInput";
import AppButton from "@/components/Base/AppButton";
export default {
  layout: "auth",
  components: {
    AppInput,
    AppButton
  },
  data() {
    return {
      form: {
        email: "locum@nhs.net",
        password: "qweqwe"
      },
      formError: []
    };
  },
  watch: {
    "form.email"(value) {
      // splice from formerror
      let index = this.formError.findIndex(item => item.field === "email");
      if (index >= 0) {
        this.formError.splice(index, 1);
      }
      // validate
      if (!value) {
        // required
        this.formError.push({ field: "email", message: "Required" });
      } else {
        const error = this.ValidateEmail(value);
        if (error) {
          this.formError.push(error);
        }
      }
    },
    "form.password"(value) {
      // splice from formerror
      let index = this.formError.findIndex(item => item.field === "password");
      if (index >= 0) {
        this.formError.splice(index, 1);
      }
      // validate
      if (!value) {
        // required
        this.formError.push({ field: "password", message: "Required" });
      } else if (value && value.length < 6) {
        this.formError.push({
          field: "password",
          message: "Password Must Be Atleast 6 Characters"
        });
      }
    }
  },
  methods: {
    async login() {
      try {
        this.formError = [];
        this.Validate(this.form);
        console.log(this.formError);

        if (!this.formError.length) {
          this.$axios
            .$post("/api/v1/login", this.form)
            .then(async res => {
              // Email Verification
              //  if(res.data.user.is_email_verified === false){
              //   this.formError.push({ field: "email", message: "Email is not yet verified. Check your email and verify your account first." })
              // } else{
                console.log(res);
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
              err.response.data.error_messages.forEach(error => {
                this.formError.push(error);
              });
            });
            
        }
      } catch (e) {
        console.log(e);
      }
    }
  }
};
</script>
<style scoped>
a {
  text-decoration: none;
  color: black;
}
</style>

