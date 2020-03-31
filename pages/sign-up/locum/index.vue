<template>
	<div class="w-full" ref="signUpContainer">
		<ProgressBar :percentage="percentage" />
		<div class="w-full xl:max-w-3xl p-4 md:p-6">
			<div class="flex w-full justify-center xl:justify-start">
				<div class="flex flex-col items-start mb-6 mt-1 md:mx-4" style="flex: 0 1 600px;">
					<nuxt-link to="/sign-up" class="text-black focus:outline-none">
						<svgicon name="left-arrow" height="32" width="32" />
					</nuxt-link>
					<div class="mt-1 text-xl font-bold">Sign up for a Locum account</div>
				</div>
			</div>

			<transition name="slide" mode="out-in">
				<component :is="activeTab"></component>
			</transition>
		</div>
	</div>
</template>

<script>
import ProgressBar from "~/components/SignUp/ProgressBar.vue";
import LocumStage1 from "~/components/SignUp/SignUpLocum/LocumStage1.vue";
import LocumStage2pt1 from "~/components/SignUp/SignUpLocum/LocumStage2pt1.vue";
import LocumStage2pt2 from "~/components/SignUp/SignUpLocum/LocumStage2pt2.vue";
import LocumAccountDetails from "~/components/SignUp/SignUpLocum/LocumAccountDetails.vue";
import LocumAddressDetails from "~/components/SignUp/SignUpLocum/LocumAddressDetails.vue";
import LocumProfessionalDetails from "~/components/SignUp/SignUpLocum/LocumProfessionalDetails.vue";
import LocumPayrollDetails from "~/components/SignUp/SignUpLocum/LocumPayrollDetails.vue";
import LocumCredentialDetails from "~/components/SignUp/SignUpLocum/LocumCredentialDetails.vue";
export default {
	layout: "auth",
	components: {
		ProgressBar,
		LocumStage1,
		LocumStage2pt1,
		LocumStage2pt2,
		LocumAccountDetails,
		LocumAddressDetails,
		LocumProfessionalDetails,
		LocumPayrollDetails,
		LocumCredentialDetails
	},
	computed: {
		activeTab() {
			return this.$store.getters["sign-up/activeTab"];
		},
		percentage() {
			switch (this.activeTab) {
				case "LocumStage1":
					return 25;
					break;
				case "LocumStage2pt1":
					return 50;
					break;
				case "LocumStage2pt2":
					return 100;
					break;
				default:
					return 0;
			}
			// switch (this.activeTab) {
			// 	case "LocumAccountDetails":
			// 		return 25;
			// 		break;
			// 	case "LocumAddressDetails":
			// 		return 45;
			// 		break;
			// 	case "LocumProfessionalDetails":
			// 		return 65;
			// 		break;
			// 	case "LocumPayrollDetails":
			// 		return 85;
			// 		break;
			// 	case "LocumCredentialDetails":
			// 		return 100;
			// 		break;
			// 	default:
			// 		return 0;
			// }
		}
	}
};
</script>