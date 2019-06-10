<template>
  <div class="border-solid rounded-lg shadow-lg">
    <form class="w-full p-8"></form>
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
        email: '',
        title: '',
        first_name: '',
        last_name: '',
        suffix: '',
        gender: '',
        mobile_number: '',
        address_line_1: '',
        address_line_2: '',
        address_line_3: '',
        post_colde: ''
      },
      formError: []
    }
  },
  created() {
    this.$axios.$get('/api/v1/me').then(res => {
      console.log(res)
      this.form.email = res.data.user.email
      this.form.title = res.data.user.personal_detail.title
      this.form.first_name = res.data.user.personal_detail.first_name
      this.form.last_name = res.data.user.personal_detail.last_name
      this.form.suffix = res.data.user.personal_detail.suffix
      this.form.gender = res.data.user.personal_detail.gender
      this.form.mobile_number = res.data.user.contact_detail.mobile_number
      this.form.address_line_1 = res.data.user.address_detail.address.coordinates.line_1
      this.form.address_line_2 = res.data.user.address_detail.address.coordinates.line_2
      this.form.address_line_3 = res.data.user.address_detail.address.coordinates.line_3
      this.form.post_code = res.data.user.address_detail.address.coordinates.post_code
    })
  },
  methods: {
    async save() {
      try {
        this.formError = []
        this.Validate(this.form, ['title', 'suffix', 'address_line_2'])
        this.ValidateEmail({ email: this.form.email, field: 'email' })
        this.ValidateMobile(this.form.mobile)
        if (!this.formError.length) {
          this.$axios.$put(`/api/v1/locum/me/account`, this.form).then(res => {
            console.log(res)
            this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'Saved' })
          })
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>


