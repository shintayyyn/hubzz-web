<template>
  <div class="flex flex-col items-center justify-center w-full">
    <div class="flex w-full justify-center xl:justify-start">
      <div class="md:mx-4 flex flex-col p-4 md:p-8 m-1 rounded-lg shadow-lg" style="flex: 0 1 600px;">
        <form class="w-full">
          <div
            v-for="(item, index) in form.reference_locum_compliance_documents"
            :key="item.compliance_document_id"
          >
            <AppInput
              v-model="form.reference_locum_compliance_documents[index].reference"
              :type="'text'"
              :name="item.name.replace(/ /g, '_').toLowerCase()"
              :label="item.name"
              :error="formError.find(err => err.field === item.name.replace(/ /g, '_').toLowerCase())"
              :info="'For compliance; to be verified by the hubzz team'"
              :limit="parseInt(profession_id) !== 1 && parseInt(profession_id) <=5 ? 8 : 7"
              required
              @blur="CheckEmptyField(form.reference_locum_compliance_documents[index].reference, item.name.replace(/ /g, '_').toLowerCase()), checkValidation(item.name, parseInt(profession_id) !== 1 && parseInt(profession_id) <=5 ? 8 : 7)"
              @keydown="[1, 10, '1','10'].includes(profession_id) ? inputNumberOnly($event) : alphaNumeric($event)"
            />
          </div>

          <AppInput
            v-model="form.nhs_smart_card_id_number"
            :type="'text'"
            :name="'nhs_smart_card_id_number'"
            :label="'NHS Smart Card ID number'"
            @keydown="inputNumberOnly($event)"
          />

          <AppPostCode
            v-model="form.post_code"
            urlIndex="postcodes-io"
            :name="'post_code'"
            :label="'Post code'"
            :error="formError.find(error => error.field === 'post_code')"
            required
            @blur="CheckEmptyField(form.post_code, 'post_code')"
          />
          <AppInput
            v-model="form.address_line_1"
            :type="'text'"
            :name="'address_line_1'"
            :label="'Address line 1'"
            :error="formError.find(error => error.field === 'address_line_1')"
            required
            @blur="CheckEmptyField(form.address_line_1, 'address_line_1')"
          />

          <AppInput
            v-model="form.address_line_2"
            :type="'text'"
            :name="'address_line_2'"
            :label="'Address line 2 (optional)'"
            :placeholder="''"
          />

          <AppInput
            v-model="form.address_line_3"
            :type="'text'"
            :name="'address_line_3'"
            :label="'City / Town / District'"
            :error="formError.find(error => error.field === 'address_line_3')"
            required
            @blur="CheckEmptyField(form.address_line_3, 'address_line_3', 'City / Town / District')"
          />
        </form>
      </div>
    </div>

    <div class="flex justify-center mt-4">
      <AppButton :label="'<<'" @click="$store.commit('sign-up/SET_ACTIVE_COMPONENT', 'LocumStage1')" />
      <div class="mx-2" />
      <AppButton :label="'Next'" :inStyle="'padding:6px 16px;'" @click="next" />
    </div>
  </div>
</template>
<script>
import AppInput from "@/components/Base/AppInput"
import AppButton from "@/components/Base/AppButton"
import AppFilterSearch from "@/components/Base/AppFilterSearch"
import AppRate from "@/components/Base/AppRate"
import AppPostCode from "@/components/Base/AppPostCode"
import { parse } from "cookie"
export default {
	components: {
		AppInput,
		AppButton,
		AppFilterSearch,
		AppRate,
		AppPostCode
	},
	data () {
		return {
			selectedProfession: null,
			profession_id: "",
			reference_locum_compliance_documents_list: [],
			form: {
				reference_locum_compliance_documents: [],
				nhs_smart_card_id_number: "",
				post_code: null,
				address_line_1: "",
				address_line_2: "",
				address_line_3: ""
			},
			formError: []
		}
	},
	computed: {
		stage1details () {
			return this.$store.getters["sign-up/stage1Details"]
		},
		stage2pt1details () {
			return this.$store.getters["sign-up/stage2pt1Details"]
		},
		stage2pt1detailsFormError () {
			return this.$store.getters["sign-up/stage2pt1DetailsFormError"]
		}
	},
	async created () {
		// this.form.reference_locum_compliance_documents = this.stage2pt1details
		// 	.reference_locum_compliance_documents.length
		// 	? this.stage2pt1details.reference_locum_compliance_documents
		// 	: [];
		this.form.nhs_smart_card_id_number = this.stage2pt1details.nhs_smart_card_id_number
		this.form.post_code = this.stage2pt1details.post_code
		this.form.address_line_1 = this.stage2pt1details.address_line_1
		this.form.address_line_2 = this.stage2pt1details.address_line_2
		this.form.address_line_3 = this.stage2pt1details.address_line_3

		this.profession_id = this.stage1details.profession_id
		const response = await this.$axios.$get(
			`/api/v1/professions/${this.profession_id}`
		)
		this.reference_locum_compliance_documents_list =
			response.data.profession.profession_compliance_category.reference_compliance_documents
		// if (!this.stage2pt1details.reference_locum_compliance_documents.length) {
		this.reference_locum_compliance_documents_list.forEach(item => {
			let foundCompliance = this.stage2pt1details.reference_locum_compliance_documents.find(
				compliance =>
					compliance.compliance_document_id === item.compliance_document_id
			)
			let fieldName = item.compliance_document_name
				.replace(/ /g, "_")
				.toLowerCase()
			this.form.reference_locum_compliance_documents.push({
				compliance_document_id: item.compliance_document_id,
				name: item.compliance_document_name,
				reference: foundCompliance ? foundCompliance.reference : ""
			})
		})
		// }
	},
	methods: {
		checkValidation (name, limit) {
			let fieldName = name.replace(/ /g, "_").toLowerCase()
			let field = this.form.reference_locum_compliance_documents.find(
				item => item.name === name
			)
			if (field.reference.length < limit) {
				this.formError.push({
					field: fieldName,
					message: `${name} must be ${limit} characters.`
				})
			}
		},
		checkCoordinates (postcode) {
			return this.$axios
				.$get(`${process.env.POSTCODES_IO_URL}/postcodes/${postcode}/validate`)
				.then(res => {
					if (!res.result) {
						this.formError.push({
							field: "post_code",
							message: "Invalid post code"
						})
					}
				})
				.catch(err => {
					console.log("err", err.response || err)
					if (
						err.response.data.status === 404 &&
						err.response.data.message === "Postcode Coordinate Not Found"
					) {
						this.formError.push({
							field: "post_code",
							message: "Invalid post code"
						})
					}
				})
		},
		next () {
			this.formError = []
			let notRequired = ["nhs_smart_card_id_number", "address_line_2"]
			this.Validate(this.form, notRequired)
			console.log(this.formError)
			if (!this.formError.length) {
				this.$store.commit("sign-up/SET_STAGE_2_PT_1_DETAILS", this.form)
				this.$store.commit("sign-up/SET_STAGE_2_PT_1_FORM_ERROR", [])
				this.$store.commit("sign-up/SET_ACTIVE_COMPONENT", "LocumStage2pt2")
				// this.$store.commit("sign-up/SET_PROFESSIONAL_DETAILS", {
				// 	...this.form,
				// 	profession_category_id: this.selectedProfession.profession_category.id
				// });
				// this.$store.commit("sign-up/SET_PROFESSIONAL_DETAIL_FORM_ERROR", []);

				// this.$store.commit(
				// 	"sign-up/SET_ACTIVE_COMPONENT",
				// 	"LocumPayrollDetails"
				// );
			}
		}
	}
}
</script>
