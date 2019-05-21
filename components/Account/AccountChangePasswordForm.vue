<template>
  <div class="border-solid rounded-lg shadow-lg p-8">
    <form class="w-full">
      <AppInput
        v-model="form.old_password"
        :type="'password'"
        :name="'old_password'"
        :label="'Current password'"
        :placeholder="''"
        :error="formError.find(item => item.field === 'old_password')"
      />
      <AppInput
        v-model="form.new_password"
        :type="'password'"
        :name="'new_password'"
        :label="'New password'"
        :placeholder="''"
        :error="formError.find(item => item.field === 'new_password')"
      />
      <AppInput
        v-model="form.new_password_confirmation"
        :type="'password'"
        :name="'new_password_confirmation'"
        :label="'Repeat password to confirm'"
        :placeholder="''"
        :error="formError.find(item => item.field === 'new_password_confirmation')"
      />

      <div class="text-left mt-5">
        <AppButton :label="'Update'" @click="update"/>
      </div>
    </form>
  </div>
</template>
<script>
import AppInput from '@/components/Base/AppInput'
import AppSelect from '@/components/Base/AppSelect'
import AppButton from '@/components/Base/AppButton'
export default {
  components: {
    AppInput,
    AppSelect,
    AppButton
  },
  data() {
    return {
      form: {
        old_password: '',
        new_password: '',
        new_password_confirmation: '',
      },
      formError: []
    }
  },
  watch: {
    'form.old_password'(value) {
      // splice from formerror
      let index = this.formError.findIndex(item => item.field === 'old_password')
      if (index >= 0) {
        this.formError.splice(index, 1)
      }
      // validate
      if (!value) {
        // required
        this.formError.push({ field: 'old_password', message: 'Required' })
      }
    },
    'form.new_password'(value) {
      // splice from formerror
      let index = this.formError.findIndex(item => item.field === 'new_password')
      if (index >= 0) {
        this.formError.splice(index, 1)
      }
      // validate
      if (!value) {
        // required
        this.formError.push({ field: 'new_password', message: 'Required' })
      }
    },
    'form.new_password_confirmation'(value) {
      // splice from formerror
      let index = this.formError.findIndex(item => item.field === 'new_password_confirmation')
      if (index >= 0) {
        this.formError.splice(index, 1)
      }
      // validate
      if (!value) {
        // required
        this.formError.push({ field: 'new_password_confirmation', message: 'Required' })
      } else {
        const error = this.ValidateSamePassword(this.form.new_password, value, 'new_password_confirmation')
        console.log(error)
        if (error) {
          this.formError.push(error)
        }
      }
    }
  },
  methods: {
    async update() {
      try {
        this.formError = []
        this.Validate(this.form)
        if (!this.formError.length) {
          this.$axios
            .$put(`/api/v1/me/change-password`, this.form)
            .then(res => {
              // ! ask arvi where to store response
            }).catch(err => {
              err.response.data.error_messages.forEach(error => {
                this.formError.push(error)
              })
            })
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

