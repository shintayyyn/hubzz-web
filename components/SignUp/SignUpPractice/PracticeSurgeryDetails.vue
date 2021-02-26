<template>
  <div ref="container" class="flex flex-col items-center justify-center xl:mx-4 w-full">
    <!-- <AppFormError v-if="formError.length > 0" class="w-full mb-4" :formError="formError" /> -->
    <div class="flex w-full justify-center xl:justify-start">
      <div class="flex flex-col w-full p-4 m-1 rounded-lg border">
        <form class="w-full">
          <AppInput
            v-model="form.name"
            :type="'text'"
            :name="'practice_name'"
            :label="'Practice'"
            :error="formError.find(item => item.field === 'practice_name')"
            required
            @blur="CheckEmptyField(form.name,'practice_name')"
          />
          <AppInput
            v-model="form.phone_number"
            :type="'text'"
            :name="'phone_number'"
            label="Phone number"
            :limit="11"
            :error="formError.find(item => item.field === 'phone_number')"
            required
            @blur="CheckEmptyField(form.phone_number,'phone_number')"
            @keydown="inputNumberOnly($event)"
          />
          <AppPostCode
            v-model="form.clinical_commissioning_group_name"
            :urlIndex="'/api/v1/clinical-commissioning-groups'"
            :dataIndex="'clinical_commissioning_groups'"
            :name="'clinical_commissioning_group_name'"
            :label="'Clinical Commissioning Group name'"
            :error="formError.find(item => item.field === 'clinical_commissioning_group_name')"
            :inStyle="'background-color:#dae1e7;border-color:white'"
            required
            @blur="CheckEmptyField(form.clinical_commissioning_group_name, 'clinical_commissioning_group_name')"
          />
          <AppInput
            v-model="form.code"
            :type="'text'"
            :name="'code'"
            :label="'Code'"
            :error="formError.find(item => item.field === 'code')"
            required
            @blur="CheckEmptyField(form.code,'code')"
          />
          <AppPostCode
            v-model="form.postcode"
            :urlIndex="'/api/v1/postcode-coordinates'"
            :name="'postcode'"
            :label="'Post code'"
            :error="formError.find(item => item.field === 'postcode')"
            :inStyle="'background-color:#dae1e7;border-color:white'"
            required
            @blur="CheckEmptyField(form.postcode, 'postcode')"
          />
          <AppInput
            v-model="form.address_line_1"
            :type="'text'"
            :name="'address_line_1'"
            :label="'Address Line 1'"
            :error="formError.find(item => item.field === 'address_line_1')"
            required
            @blur="CheckEmptyField(form.address_line_1,'address_line_1')"
          />
          <AppInput
            v-model="form.address_line_2"
            :type="'text'"
            :name="'address_line_2'"
            :label="'Address Line 2'"
            :error="formError.find(item => item.field === 'address_line_2')"
            required
            @blur="CheckEmptyField(form.address_line_2,'address_line_2')"
          />
          <AppInput
            v-model="form.address_line_3"
            :type="'text'"
            :name="'address_line_3'"
            :label="'Address Line 3'"
            :error="formError.find(item => item.field === 'address_line_3')"
            required
            @blur="CheckEmptyField(form.address_line_3,'address_line_3')"
          />
          <AppInput
            v-model="form.address_line_4"
            :type="'text'"
            :name="'address_line_4'"
            :label="'Address Line 4'"
            :error="formError.find(item => item.field === 'address_line_4')"
            @blur="CheckEmptyField(form.address_line_4,'address_line_4')"
          />
          <AppInput
            v-model="form.address_line_5"
            :type="'text'"
            :name="'address_line_5'"
            :label="'Address Line 5'"
            :error="formError.find(item => item.field === 'address_line_5')"
            @blur="CheckEmptyField(form.address_line_5,'address_line_5')"
          />
        </form>
      </div>
    </div>

    <div class="flex justify-center mt-4">
      <AppButton :label="'<<'" @click="$emit('nextTab', 'PracticeDetails')" />
      <div class="mx-2" />
      <AppButton :label="'Next'" @click="signUp" />
    </div>
  </div>
</template>
<script>
import AppInput from "@/components/Base/AppInput"
import AppButton from "@/components/Base/AppButton"
import AppPostCode from "@/components/Base/AppPostCode"
import AppFormError from "@/components/Base/AppFormError"
export default {
  components: {
    AppInput,
    AppButton,
    AppPostCode,
    AppFormError,
  },
  data () {
    return {
      form: {
        name: "",
        phone_number: "",
        clinical_commissioning_group_name: "",
        code: "",
        address_line_1: "",
        address_line_2: "",
        address_line_3: "",
        address_line_4: "",
        address_line_5: "",
        postcode: "",
        coordinate_x: "",
        coordinate_y: "",
      },
      formError: [],
    }
  },
  computed: {
    practiceDetails () {
      return this.$store.getters["sign-up/practiceDetails"]
    },
    practiceSurgeryDetails () {
      return this.$store.getters["sign-up/practiceSurgeryDetails"]
    },
    practiceSurgeryFormError () {
      return this.$store.getters["sign-up/practiceSurgeryFormError"]
    },
  },
  watch: {
    practiceSurgeryFormError (value) {
      if (value.length > 0) {
        value.forEach(item => {
          this.formError.push(item)
        })
      }
    },
  },
  async mounted () {
    if (this.practiceDetails && this.practiceDetails.surgery_id) {
      this.form.name = this.practiceDetails.name
      this.form.phone_number = this.practiceDetails.phone_number
      this.form.code = this.practiceDetails.code
      this.form.clinical_commissioning_group_name = this.practiceDetails.clinical_commissioning_group_name
      this.form.address_line_1 = this.practiceDetails.address_line_1
      this.form.address_line_2 = this.practiceDetails.address_line_2
      this.form.address_line_3 = this.practiceDetails.address_line_3
      this.form.address_line_4 = this.practiceDetails.address_line_4
      this.form.address_line_5 = this.practiceDetails.address_line_5
      this.form.postcode = this.practiceDetails.postcode
    } else if (
      !this.practiceDetails.surgery_id
      && this.practiceSurgeryDetails
      && this.practiceSurgeryDetails.name
    ) {
      this.form.name = this.practiceSurgeryDetails.name
      this.form.phone_number = this.practiceSurgeryDetails.phone_number
      this.form.code = this.practiceSurgeryDetails.code
      this.form.clinical_commissioning_group_name = this.practiceSurgeryDetails.clinical_commissioning_group_name
      this.form.address_line_1 = this.practiceSurgeryDetails.address_line_1
      this.form.address_line_2 = this.practiceSurgeryDetails.address_line_2
      this.form.address_line_3 = this.practiceSurgeryDetails.address_line_3
      this.form.address_line_4 = this.practiceSurgeryDetails.address_line_4
      this.form.address_line_5 = this.practiceSurgeryDetails.address_line_5
      this.form.postcode = this.practiceSurgeryDetails.postcode
    }

    if (this.practiceSurgeryFormError.length > 0) {
      this.practiceSurgeryFormError.forEach(item => {
        this.formError.push(item)
      })
    }
  },
  methods: {
    checkCoordinates (postcode) {
      return this.$axios
        .$post("/api/v1/postcode-to-coordinates", { postcode, })
        .then(res => {
          if (res.data && res.data.postcode_coordinate) {
            this.form.coordinate_x = res.data.postcode_coordinate.coordinate_x
            this.form.coordinate_y = res.data.postcode_coordinate.coordinate_y
          }
        })
        .catch(err => {
          console.log("err", err.response || err)
          if (
            err.response.data.status === 404
            && err.response.data.message === "Postcode Coordinate Not Found"
          ) {
            this.formError.push({
              field: "postcode",
              message: "Invalid post code",
            })
          }
        })
    },
    async signUp () {
      this.formError = []
      await this.checkCoordinates(this.form.postcode)
      this.Validate(this.form, [
        "coordinate_x",
        "coordinate_y",
        "address_line_2",
        "address_line_4",
        "address_line_5",
      ])
      if (!this.formError.length) {
        this.$store.commit("sign-up/SET_PRACTICE_DETAILS", this.form)
        this.$store.commit("sign-up/SET_PRACTICE_SURGERY_DETAILS", this.form)
        this.$emit("nextTab", "PracticeAccountDetails")
      }
    },
    goBack () {
      this.$store.commit("sign-up/SET_PRACTICE_SURGERY_DETAILS", {
        name: this.form.name,
        phone_number: this.form.phone_number,
        code: this.form.code,
        clinical_commissioning_group_name: this.form.clinical_commissioning_group_name,
        address_line_1: this.form.address_line_1,
        address_line_2: this.form.address_line_2,
        address_line_3: this.form.address_line_3,
        address_line_4: this.form.address_line_4,
        address_line_5: this.form.address_line_5,
        postcode: this.form.postcode,
        coordinates_x: this.form.coordinates_x,
        coordinates_y: this.form.coordinates_y,
      })
      
      this.$emit('nextTab', 'PracticeDetails')
    },
  },
}
</script>
