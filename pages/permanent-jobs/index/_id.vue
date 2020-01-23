<template>
	<PermanentJob v-if="$auth.user.domain === 'Locum'" />
	<PracticePermanentJob v-else />
</template>
<script>
import AppButton from "@/components/Base/AppButton";
import PermanentJob from "@/components/PermanentJob/PermanentJobModal";
import PracticePermanentJob from "@/components/PermanentJob/PracticePermanentJob";
export default {
	components: {
		AppButton,
		PermanentJob,
		PracticePermanentJob
	}
};
</script>

<style scoped>
.modal-container {
	z-index: 510;
	margin: 0;
}
@media screen and (min-width: 1200px) {
	.modal-container {
		width: 80%;
	}
}
</style>