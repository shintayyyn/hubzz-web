<template>
  <div class="flex flex-row flex-wrap justify-between">
    <div class="w-1/2 pr-4">
      <div class="rounded-lg shadow-lg p-8">
        <div class="w-full">
          <div class="flex flex-col mb-8">
            <div class="text-xs sm:text-base py-1">Practice name</div>
            <div class="text-xs sm:text-sm font-bold">practice name here</div>
          </div>
          <div class="flex flex-col my-8">
            <div class="text-xs sm:text-base py-1">Practice code</div>
            <div class="text-xs sm:text-sm font-bold">practice code here</div>
          </div>
          <div class="flex flex-col my-8">
            <div class="text-xs sm:text-base py-1">Address</div>
            <div class="text-xs sm:text-sm font-bold">address here</div>
          </div>
          <div class="flex flex-col my-8">
            <div class="text-xs sm:text-base py-1">Phone number</div>
            <div class="text-xs sm:text-sm font-bold">phone number here</div>
          </div>
          <div class="flex flex-col mt-8">
            <div class="text-xs sm:text-base py-1">CCG</div>
            <div class="text-xs sm:text-sm font-bold">ccg here</div>
          </div>
        </div>
      </div>
    </div>
    <div class="w-1/2 pl-4">
      <div class="rounded-lg shadow-lg p-8">
        <form class="w-full">
          <AppInput
            v-model="form.email"
            :type="'email'"
            :name="'email'"
            :label="'Email'"
            :placeholder="''"
            :error="this.formError.find(item => item.field === 'email')"
          />
          <AppInput
            v-model="form.phone_number"
            :type="'text'"
            :name="'phone_number'"
            :label="'Phone number'"
            :placeholder="''"
            :error="this.formError.find(item => item.field === 'phone_number')"
          />
          <AppInput
            v-model="form.report_to"
            :type="'text'"
            :name="'report_to'"
            :label="'Report to'"
            :placeholder="''"
            :error="this.formError.find(item => item.field === 'report_to')"
          />
          <AppInput
            :type="'multi-checkbox'"
            @checked="form.practice_type_id.push($event)"
            @unchecked="form.practice_type_id.splice(form.practice_type_id.findIndex(item => item === $event), 1)"
            :name="'practice_type_id'"
            :label="'What type of Practice are you?'"
            :placeholder="''"
            :error="this.formError.find(item => item.field === 'practice_type_id')"
            :lists="practice_types"
          />
          <AppTextarea
            v-model="form.extra_information"
            :name="'extra_information'"
            :label="'Extra Information (Pracking restrictions, transport links, etc.)'"
            :placeholder="''"
            :error="this.formError.find(item => item.field === 'extra_information')"
          />
          <AppButton :label="'Save changes'" @click="save"/>
        </form>
      </div>
    </div>
  </div>
  <!-- <div class="border-solid rounded-lg shadow-lg">
    <form class="w-full p-8">
      <div class="relative flex flex-col my-6">
        <div class="flex flex-row justify-start">
          <label for="email" class="text-sm">Email Address</label>
        </div>
        <div class="flex flex-row justify-start mt-4">
          <div
            class="flex flex-col border-b-2 border-grey-light w-full"
            :class="[setFocus === 'email' ? 'border-yellow':'', formError.find(item => item.field === 'email') ? 'border-red':'']"
          >
            <input
              type="email"
              name="email"
              id="email"
              ref="email"
              class="font-bold text-sm p-2 leading-tight focus:outline-none"
              @focus="setFocus = 'email'"
              @blur="setFocus = ''"
              v-model="form.email"
            >
          </div>
        </div>
        <div
          class="absolute pin-t pin-r bg-red text-white p-1"
          v-if="formError.find(item => item.field === 'email')"
        >{{formError.find(item => item.field === 'email').message}}</div>
      </div>

      <div class="relative flex flex-col my-6">
        <div class="flex flex-row justify-start">
          <label for="title" class="text-sm">Title</label>
        </div>
        <div class="flex flex-row justify-start mt-4">
          <div
            class="flex flex-col border-b-2 border-grey-light w-full"
            :class="[setFocus === 'title' ? 'border-yellow':'', formError.find(item => item.field === 'title') ? 'border-red':'']"
          >
            <input
              type="text"
              name="title"
              id="title"
              ref="title"
              class="font-bold text-sm p-2 leading-tight focus:outline-none"
              @focus="setFocus = 'title'"
              @blur="setFocus = ''"
              v-model="form.title"
            >
          </div>
        </div>
        <div
          class="absolute pin-t pin-r bg-red text-white p-1"
          v-if="formError.find(item => item.field === 'title')"
        >{{formError.find(item => item.field === 'title').message}}</div>
      </div>

      <div class="relative flex flex-col my-6">
        <div class="flex flex-row justify-start">
          <label for="first_name" class="text-sm">First name</label>
        </div>
        <div class="flex flex-row justify-start mt-4">
          <div
            class="flex flex-col border-b-2 border-grey-light w-full"
            :class="[setFocus === 'first_name' ? 'border-yellow':'', formError.find(item => item.field === 'first_name') ? 'border-red':'']"
          >
            <input
              type="text"
              name="first_name"
              id="first_name"
              ref="first_name"
              class="font-bold text-sm p-2 leading-tight focus:outline-none"
              @focus="setFocus = 'first_name'"
              @blur="setFocus = ''"
              v-model="form.first_name"
            >
          </div>
        </div>
        <div
          class="absolute pin-t pin-r bg-red text-white p-1"
          v-if="formError.find(item => item.field === 'first_name')"
        >{{formError.find(item => item.field === 'first_name').message}}</div>
      </div>

      <div class="relative flex flex-col my-6">
        <div class="flex flex-row justify-start">
          <label for="last_name" class="text-sm">Last name</label>
        </div>
        <div class="flex flex-row justify-start mt-4">
          <div
            class="flex flex-col border-b-2 border-grey-light w-full"
            :class="[setFocus === 'last_name' ? 'border-yellow':'', formError.find(item => item.field === 'last_name') ? 'border-red':'']"
          >
            <input
              type="text"
              name="last_name"
              id="last_name"
              ref="last_name"
              class="font-bold text-sm p-2 leading-tight focus:outline-none"
              @focus="setFocus = 'last_name'"
              @blur="setFocus = ''"
              v-model="form.last_name"
            >
          </div>
        </div>
        <div
          class="absolute pin-t pin-r bg-red text-white p-1"
          v-if="formError.find(item => item.field === 'last_name')"
        >{{formError.find(item => item.field === 'last_name').message}}</div>
      </div>

      <div class="relative flex flex-col my-6">
        <div class="flex flex-row justify-start">
          <label for="suffix" class="text-sm">Suffix</label>
        </div>
        <div class="flex flex-row justify-start mt-4">
          <div
            class="flex flex-col border-b-2 border-grey-light w-full"
            :class="[setFocus === 'suffix' ? 'border-yellow':'', formError.find(item => item.field === 'suffix') ? 'border-red':'']"
          >
            <input
              type="text"
              name="suffix"
              id="suffix"
              ref="suffix"
              class="font-bold text-sm p-2 leading-tight focus:outline-none"
              @focus="setFocus = 'suffix'"
              @blur="setFocus = ''"
              v-model="form.suffix"
            >
          </div>
        </div>
        <div
          class="absolute pin-t pin-r bg-red text-white p-1"
          v-if="formError.find(item => item.field === 'suffix')"
        >{{formError.find(item => item.field === 'suffix').message}}</div>
      </div>

      <div class="relative flex flex-col my-6">
        <div class="flex flex-row justify-start">
          <label for="gender" class="text-sm">Gender</label>
        </div>
        <div class="flex flex-row justify-start mt-4">
          <div
            class="flex flex-col border-b-2 border-grey-light w-full"
            :class="[setFocus === 'gender' ? 'border-yellow':'', formError.find(item => item.field === 'gender') ? 'border-red':'']"
          >
            <select
              @focus="setFocus = 'gender'"
              @blur="setFocus = ''"
              v-model="form.gender"
              name="gender"
              id="gender"
              class="font-bold text-sm p-2 leading-tight focus:outline-none"
            >
              Role
              <option value selected>Select..</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>
        <div
          class="absolute pin-t pin-r bg-red text-white p-1"
          v-if="formError.find(item => item.field === 'gender')"
        >{{formError.find(item => item.field === 'gender').message}}</div>
      </div>

      <div class="relative flex flex-col my-6">
        <div class="flex flex-row justify-start">
          <label for="mobile" class="text-sm">Mobile Number</label>
        </div>
        <div class="flex flex-row justify-start mt-4">
          <div
            class="flex flex-col border-b-2 border-grey-light w-full"
            :class="[setFocus === 'mobile' ? 'border-yellow':'', formError.find(item => item.field === 'mobile') ? 'border-red':'']"
          >
            <input
              type="text"
              name="mobile"
              id="mobile"
              ref="mobile"
              class="font-bold text-sm p-2 leading-tight focus:outline-none"
              @focus="setFocus = 'mobile'"
              @blur="setFocus = ''"
              v-model="form.mobile"
            >
          </div>
        </div>
        <div
          class="absolute pin-t pin-r bg-red text-white p-1"
          v-if="formError.find(item => item.field === 'mobile')"
        >{{formError.find(item => item.field === 'mobile').message}}</div>
      </div>

      <div class="relative flex flex-col my-6">
        <div class="flex flex-row justify-start">
          <label for="home_number" class="text-sm">Home/Land line Number</label>
        </div>
        <div class="flex flex-row justify-start mt-4">
          <div
            class="flex flex-col border-b-2 border-grey-light w-full"
            :class="[setFocus === 'home_number' ? 'border-yellow':'', formError.find(item => item.field === 'home_number') ? 'border-red':'']"
          >
            <input
              type="text"
              name="home_number"
              id="home_number"
              ref="home_number"
              class="font-bold text-sm p-2 leading-tight focus:outline-none"
              @focus="setFocus = 'home_number'"
              @blur="setFocus = ''"
              v-model="form.home_number"
            >
          </div>
        </div>
        <div
          class="absolute pin-t pin-r bg-red text-white p-1"
          v-if="formError.find(item => item.field === 'home_number')"
        >{{formError.find(item => item.field === 'home_number').message}}</div>
      </div>

      <div class="p-5 border border-grey rounded-lg bg-grey-light">
        <div class="relative flex flex-col my-6">
          <div class="flex flex-row justify-start">
            <label for="post_code" class="text-sm">Post code</label>
          </div>
          <div class="flex flex-row justify-start mt-4">
            <div
              class="flex flex-col border-b-2 border-white w-full"
              :class="[setFocus === 'post_code' ? 'border-yellow':'', formError.find(item => item.field === 'post_code') ? 'border-red':'']"
            >
              <input
                type="text"
                name="post_code"
                id="post_code"
                ref="post_code"
                placeholder="Enter a post code and select from list"
                class="font-bold text-sm p-2 leading-tight focus:outline-none bg-grey-light"
                @focus="setFocus = 'post_code'"
                @blur="setFocus = ''"
                v-model="form.post_code"
              >
            </div>
          </div>
          <div
            class="absolute pin-t pin-r bg-red text-white p-1"
            v-if="formError.find(item => item.field === 'post_code')"
          >{{formError.find(item => item.field === 'post_code').message}}</div>
        </div>

        <div class="relative flex flex-col my-6">
          <div class="flex flex-row justify-start">
            <label for="line_1" class="text-sm">Address line 1</label>
          </div>
          <div class="flex flex-row justify-start mt-4">
            <div
              class="flex flex-col border-b-2 border-white w-full"
              :class="[setFocus === 'line_1' ? 'border-yellow':'', formError.find(item => item.field === 'line_1') ? 'border-red':'']"
            >
              <input
                type="text"
                name="line_1"
                id="line_1"
                ref="line_1"
                class="font-bold text-sm p-2 leading-tight focus:outline-none bg-grey-light"
                @focus="setFocus = 'line_1'"
                @blur="setFocus = ''"
                v-model="form.line_1"
              >
            </div>
          </div>
          <div
            class="absolute pin-t pin-r bg-red text-white p-1"
            v-if="formError.find(item => item.field === 'line_1')"
          >{{formError.find(item => item.field === 'line_1').message}}</div>
        </div>

        <div class="relative flex flex-col my-6">
          <div class="flex flex-row justify-start">
            <label for="line_2" class="text-sm">Address line 2 (optional)</label>
          </div>
          <div class="flex flex-row justify-start mt-4">
            <div
              class="flex flex-col border-b-2 border-white w-full"
              :class="[setFocus === 'line_2' ? 'border-yellow':'', formError.find(item => item.field === 'line_2') ? 'border-red':'']"
            >
              <input
                type="text"
                name="line_2"
                id="line_2"
                ref="line_2"
                class="font-bold text-sm p-2 leading-tight focus:outline-none bg-grey-light"
                @focus="setFocus = 'line_2'"
                @blur="setFocus = ''"
                v-model="form.line_2"
              >
            </div>
          </div>
          <div
            class="absolute pin-t pin-r bg-red text-white p-1"
            v-if="formError.find(item => item.field === 'line_2')"
          >{{formError.find(item => item.field === 'line_2').message}}</div>
        </div>

        <div class="relative flex flex-col my-6">
          <div class="flex flex-row justify-start">
            <label for="line_3" class="text-sm">City / Town / District</label>
          </div>
          <div class="flex flex-row justify-start mt-4">
            <div
              class="flex flex-col border-b-2 border-white w-full"
              :class="[setFocus === 'line_3' ? 'border-yellow':'', formError.find(item => item.field === 'line_3') ? 'border-red':'']"
            >
              <input
                type="text"
                name="line_3"
                id="line_3"
                ref="line_3"
                class="font-bold text-sm p-2 leading-tight focus:outline-none bg-grey-light"
                @focus="setFocus = 'line_3'"
                @blur="setFocus = ''"
                v-model="form.line_3"
              >
            </div>
          </div>
          <div
            class="absolute pin-t pin-r bg-red text-white p-1"
            v-if="formError.find(item => item.field === 'line_3')"
          >{{formError.find(item => item.field === 'line_3').message}}</div>
        </div>
      </div>

      <div class="text-left mt-5">
        <button
          class="bg-yellow-dark hover:text-white focus:outline-none font-bold text-xl p-6 rounded-lg"
          @click.prevent="save"
        >Save changes</button>
      </div>
    </form>
  </div>-->
</template>
<script>
import AppInput from '@/components/Base/AppInput'
import AppTextarea from '@/components/Base/AppTextarea'
import AppButton from '@/components/Base/AppButton'
export default {
  components: {
    AppInput,
    AppTextarea,
    AppButton
  },
  data() {
    return {
      practice_types: [],
      form: {
        email: '',
        phone_number: '',
        report_to: '',
        extra_information: '',
        practice_type_id: [],
        // ! ask arvi on these
        mandatory_training_id: [],
        gp_compliance_document_id: [],
        others_compliance_document_id: []
      },
      formError: []
    }
  },
  watch: {
    'form.email'(value) {
      // splice from formerror
      let index = this.formError.findIndex(item => item.field === 'email')
      if (index >= 0) {
        this.formError.splice(index, 1)
      }
      // validate
      if (!value) {
        // required
        this.formError.push({ field: 'email', message: 'Required' })
      } else {
        // validate option
        const error = this.ValidateEmail(value)
        if (error) {
          this.formError.push(error)
        }
      }
    },
    'form.phone_number'(value) {
      // splice from formerror
      let index = this.formError.findIndex(item => item.field === 'phone_number')
      if (index >= 0) {
        this.formError.splice(index, 1)
      }
      // validate
      if (!value) {
        // required
        this.formError.push({ field: 'phone_number', message: 'Required' })
      } else {
        // validate options
        const error = this.ValidateMobile(value, 'phone_number')
        if (error) {
          this.formError.push(error)
        }
      }
    },
    'form.report_to'(value) {
      // splice from formerror
      let index = this.formError.findIndex(item => item.field === 'report_to')
      if (index >= 0) {
        this.formError.splice(index, 1)
      }
      // validate
      if (!value) {
        // required
        this.formError.push({ field: 'report_to', message: 'Required' })
      }
    },
    'form.extra_information'(value) {
      // splice from formerror
      let index = this.formError.findIndex(item => item.field === 'extra_information')
      if (index >= 0) {
        this.formError.splice(index, 1)
      }
      // validate
      if (!value) {
        // required
        this.formError.push({ field: 'extra_information', message: 'Required' })
      }
    },
    'form.practice_type_id'(value) {
      // splice from formerror
      let index = this.formError.findIndex(item => item.field === 'practice_type_id')
      if (index >= 0) {
        this.formError.splice(index, 1)
      }
      // validate
      if (!value.length) {
        // required
        this.formError.push({ field: 'practice_type_id', message: 'Required' })
      }
    }
  },
  created() {
    // get practice types
    this.$axios.$get(`/api/v1/practice-types`)
      .then(res => {
        this.practice_types = res.data.practice_types
      })
  },
  methods: {
    save() {
      try {
        this.formError = []
        this.Validate(this.form, ['mandatory_training_id', 'gp_compliance_document_id', 'others_compliance_document_id'])
        if (!this.formError.length) {
          this.$axios.$put(`/api/v1/practice/me/profile`).then(res => {
            //   ! ask arvi where to set the response
            console.log(res.message)
            console.log(res.data)
          })
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>



