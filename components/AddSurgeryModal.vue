<template>
  <section>
    <AppConfirmationModal
      :label="'Proceed to add this surgery?'"
      :confirmLabel="'Yes'"
      :cancelLabel="'Cancel'"
      :modal="confirmation_add_modal"
      @confirm="proceed"
      @cancel="confirmation_add_modal = false"
    />

    <div class="max-w-5xl" :class="page ? '' : 'p-4 md:p-8'">
      <div v-if="!page" class="cursor-pointer" @click="$emit('close')">
        <svgicon name="left-arrow" height="32" width="32" />
      </div>
      <template v-if="!input_details">
        <div class="flex justify-start font-bold text-sm sm:text-xl pt-2">
          Add Practice
        </div>
        <div class="rounded-lg border px-4 py-4 mt-4">
          <AppInput v-model="search_text" :type="'text'" :name="'search'" />
          <AppButton :label="'Search Practice'" :inStyle="'padding:5px 14px;'" @click="search" />
          <AppButton
            :label="'Input manually'"
            :inStyle="'padding:5px 14px;'"
            @click="input_details = true"
          />
        </div>
        <div v-if="showResult && surgeries.length === 0" class="mt-5">
          <div
            class="text-xs xl:text-base font-bold"
          >
            No practice matched that name. Try again with whole words, practice code or CCG.
          </div>
          <AppButton
            class="rounded-lg shadow-lg mt-5"
            :label="'Input manually'"
            @click="input_details = true"
          />
        </div>
        <div
          v-if="showResult && surgeries.length > 0"
          class="rounded-lg shadow-lg overflow-auto mt-5"
        >
          <div
            class="text-xs lg:text-base font-bold px-4 py-2"
          >
            Select by clicking on the practice that you wish to add
          </div>
          <div
            v-for="(item) in surgeries"
            :key="item.id"
            class="border-t-2 p-4"
            :class="[selectedSurgeries.includes(item.id) ? 'bg-gray-200': selectedSurgery.id === item.id ? 'bg-yellow-500':'hover:bg-gray-400 cursor-pointer']"
            @click="select(item)"
          >
            <div class="relative flex flex-col justify-start">
              <span v-if="selectedSurgeries.includes(item.id)" class="absolute right-0">
                <svgicon name="success-checkmark" width="25" height="25" />
              </span>
              <div class="font-bold text-xs xl:text-base">
                {{ item.name }}
              </div>
              <div
                class="mt-2 text-xs xl:text-sm"
              >
                {{ item.address.line_1 }}, {{ item.address.line_2 }}, {{ item.address.line_3 }}, {{ item.address.post_code }}
              </div>
              <div class="flex flex-row flex-no-wrap mt-1 text-xs xl:text-sm">
                <div class="rounded-lg bg-gray-300 py-1 px-2 mr-1">
                  CCG
                </div>
                <div class="flex items-center">
                  {{ item.clinical_commissioning_group.name }}
                </div>
              </div>
              <div class="flex flex-row flex-no-wrap mt-1 text-xs xl:text-sm">
                <div class="rounded-lg bg-gray-300 py-1 px-2 mr-1">
                  Practice Code
                </div>
                <div class="flex items-center">
                  {{ item.code }}
                </div>
              </div>
            </div>
          </div>
          <div class="border-t-2 p-4 text-xs xl:text-base">
            <p class="font-bold">
              These are just top 10 matches from your search term.
            </p>
            <p
              class="font-bold"
            >
              Try again with practice code or its full name if the practice isn't in the result.
            </p>
          </div>
        </div>
      </template>
      <template v-if="input_details">
        <div ref="container" class="mt-2 flex flex-col items-center justify-center w-full">
          <!-- <AppFormError v-if="formError.length > 0" class="w-full mb-4" :formError="formError" /> -->
          <div class="flex w-full justify-center xl:justify-start">
            <div class="flex flex-col w-full p-4 my-4 rounded-lg border">
              <form class="w-full">
                <AppInput v-model="form.name" :type="'text'" :name="'name'" :label="'Practice'" />
                <AppInput
                  v-model="form.phone_number"
                  :type="'text'"
                  :name="'phone_number'"
                  label="Phone number"
                  :limit="11"
                  :placeholder="'Phone number'"
                  :error="formError.find(item => item.field === 'phone_number')"
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
                  @blur="CheckEmptyField(form.clinical_commissioning_group_name, 'clinical_commissioning_group_name')"
                />
                <AppInput
                  v-model="form.code"
                  :type="'text'"
                  :name="'code'"
                  :label="'Code'"
                  :error="formError.find(item => item.field === 'code')"
                  @blur="CheckEmptyField(form.code,'code')"
                />
                <AppPostCode
                  v-model="form.postcode"
                  :urlIndex="'/api/v1/postcode-coordinates'"
                  :name="'postcode'"
                  :label="'Post code'"
                  :error="formError.find(item => item.field === 'postcode')"
                  :inStyle="'background-color:#dae1e7;border-color:white'"
                  @blur="CheckEmptyField(form.postcode, 'postcode')"
                />
                <AppInput
                  v-model="form.address_line_1"
                  :type="'text'"
                  :name="'address_line_1'"
                  :label="'address_line_1'"
                  :error="formError.find(item => item.field === 'address_line_1')"
                  @blur="CheckEmptyField(form.address_line_1,'address_line_1')"
                />
                <AppInput
                  v-model="form.address_line_2"
                  :type="'text'"
                  :name="'address_line_2'"
                  :label="'address_line_2'"
                  :error="formError.find(item => item.field === 'address_line_2')"
                />
                <AppInput
                  v-model="form.address_line_3"
                  :type="'text'"
                  :name="'address_line_3'"
                  :label="'address_line_3'"
                  :error="formError.find(item => item.field === 'address_line_3')"
                />
                <AppInput
                  v-model="form.address_line_4"
                  :type="'text'"
                  :name="'address_line_4'"
                  :label="'address_line_4'"
                  :error="formError.find(item => item.field === 'address_line_4')"
                />
                <AppInput
                  v-model="form.address_line_5"
                  :type="'text'"
                  :name="'address_line_5'"
                  :label="'address_line_5'"
                  :error="formError.find(item => item.field === 'address_line_5')"
                />
              </form>
            </div>
          </div>

          <div class="flex justify-center mt-4">
            <AppButton :label="'<<'" @click="closeInputDetails" />
            <div class="mx-2" />
            <AppButton :label="'Add'" :disabled="adding_surgery_loading" @click="add" />
          </div>
        </div>
      </template>
    </div>
  </section>
</template>
<script>
import AppInput from "@/components/Base/AppInput"
import AppButton from "@/components/Base/AppButton"
import AppPostCode from "@/components/Base/AppPostCode"
import AppFormError from "@/components/Base/AppFormError"
import AppConfirmationModal from "@/components/Base/AppConfirmationModal"
export default {
  components: {
    AppInput,
    AppButton,
    AppPostCode,
    AppFormError,
    AppConfirmationModal,
  },
  props: {
    page: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      search_text: "",
      surgeries: [],
      selectedSurgery: {},
      showResult: false,
      confirmation_add_modal: false,
      selectedSurgeries: [],
      input_details: false,
      adding_surgery_loading: false,
      //
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
  methods: {
    search () {
      this.$axios
        .$get(`/api/v1/locum/private-practices`)
        .then(res => {
          res.data.private_practices.find(item => {
            this.selectedSurgeries.push(item.surgery.id)
          })
        })
        .catch(err => {
          console.log("err", err.response || err)
          if (err.response.data.message) {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "danger",
              text: [`${err.response.data.message}`,],
            })
          }
        })
      this.$axios
        .$get(
          `/api/v1/surgeries?search=${this.search_text}&has_parent=false&is_parent=false&limit=10`
        )
        .then(res => {
          this.surgeries = res.data.surgeries
          this.showResult = true
        })
        .catch(err => {
          console.log("err", err.response || err)
          if (err.response.data.message) {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "danger",
              text: [`${err.response.data.message}`,],
            })
          }
        })
    },
    select (item) {
      if (!this.selectedSurgeries.includes(item.id)) {
        this.selectedSurgery = item
        this.confirmation_add_modal = true
      }
    },
    proceed () {
      this.form.name = this.selectedSurgery.name
      this.form.phone_number = this.selectedSurgery.phone_number
      this.form.code = this.selectedSurgery.code
      this.form.clinical_commissioning_group_name = this.selectedSurgery.clinical_commissioning_group_name
      this.form.address_line_1 = this.selectedSurgery.address_line_1
      this.form.address_line_2 = this.selectedSurgery.address_line_2
      this.form.address_line_3 = this.selectedSurgery.address_line_3
      this.form.address_line_4 = this.selectedSurgery.address_line_4
      this.form.address_line_5 = this.selectedSurgery.address_line_5
      this.form.postcode = this.selectedSurgery.postcode

      this.formError = []
      this.input_details = true
      this.confirmation_add_modal = false
    },
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
    async add () {
      this.formError = []
      this.Validate(this.form, [
        "coordinate_x",
        "coordinate_y",
        "address_line_2",
        "address_line_3",
        "address_line_4",
        "address_line_5",
      ])
      this.adding_surgery_loading = true
      await this.checkCoordinates(this.form.postcode)
      this.adding_surgery_loading = false
      if (!this.formError.length) {
        this.$axios
          .$post(`/api/v1/locum/private-practices`, this.form)
          .then(res => {
            this.$store.commit(
              "ADD_LOCUM_PRIVATE_PRACTICE",
              res.data.private_practice
            )
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: [`${res.message}`,],
            })
            // this.confirmation_add_modal = false;
            this.$emit("addPractice", res.data.private_practice)
            this.$emit("close")
          })
          .catch(err => {
            console.log("err", err.response || err)
            if (err.response.data.message) {
              this.$store.commit("SET_NOTIFICATION", {
                enabled: true,
                status: "danger",
                text: [`${err.response.data.message}`,],
              })
            }
          })
      }
    },
    closeInputDetails () {
      this.input_details = false
      this.form.name = ""
      this.form.phone_number = ""
      this.form.clinical_commissioning_group_name = ""
      this.form.code = ""
      this.form.address_line_1 = ""
      this.form.address_line_2 = ""
      this.form.address_line_3 = ""
      this.form.address_line_4 = ""
      this.form.address_line_5 = ""
      this.form.postcode = ""
      this.form.coordinate_x = ""
      this.form.coordinate_y = ""
    },
  },
}
</script>
