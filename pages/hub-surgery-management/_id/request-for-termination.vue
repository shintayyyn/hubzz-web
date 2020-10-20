<template>
	<div class="m-2">
		<AppConfirmationModal
			:label="'Are you sure you want to terminate this spoke?'"
			:confirmLabel="'Yes'"
			:cancelLabel="'Cancel'"
			:modal="confirm"
			@confirm="toSendTerminationRequest()"
			@cancel="confirm = false"
		/>
		<AppInput
			v-model="form.note"
			:type="'textarea'"
			:name="'note'"
			:label="'Note'"
			:placeholder="'Please input reasons why you want to terminate the Spoke'"
			:resize="false"
			:error="formError.find(item => item.field === 'note')"
			@blur="CheckEmptyField(form.note, 'note')"
		/>
		<AppButton :label="'Send'" @click="checkField()" :inStyle="'padding:5px 14px;'" />
	</div>
</template>
<script>
import AppInput from "@/components/Base/AppInput";
import AppButton from "@/components/Base/AppButton";
import AppConfirmationModal from "@/components/Base/AppConfirmationModal";
export default {
	transition: {
		name: "fade",
		mode: "out-in"
	},
	components: {
		AppInput,
		AppButton,
		AppConfirmationModal
	},
	data() {
		return {
			confirm: false,
			form: {
				note: ""
			},
			formError: []
		};
	},
	watch: {
		"form.note"(value) {
			this.CheckEmptyField(this.form.note, "note");
		}
	},
	async asyncData ({ app, error, store, }) {
    try {
			const authPermissions = store.getters["permissions"]

      if (app.$auth.user.domain === 'Practice'
          && authPermissions.includes('Request for Termination Surgery Management') === false) {
        error({
          statusCode: 403,
          message: 'You are not authorized to view this page.',
        })
        return
      }

    } catch (err) {
      console.log('err', err.response || err)
      error({
        statusCode: 403,
        message: 'You are not authorized to view this page.',
      })
    }
  },
	methods: {
		checkField() {
			this.formError = [];
			this.Validate(this.form);
			if (!this.formError.length) {
				this.confirm = true;
			}
		},
		toSendTerminationRequest() {
			if (!this.formError.length) {
				this.$axios
					.$post(
						`/api/v1/practice/me/practice-surgeries/${this.$route.params.id}/request-for-termination`,
						{
							note: this.form.note
						}
					)
					.then(res => {
						this.$store.commit("SET_NOTIFICATION", {
							enabled: true,
							status: "success",
							text: ["Termination Request Successfully Sent"]
						});
					});
				this.$router.push(`/hub-surgery-management`);
			}
		}
	}
}
</script>
<style></style>
