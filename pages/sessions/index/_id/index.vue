<template>
	<div ref="modalContainer" class="modal-container shadow-lg">
		<SessionDetailModal
			:job="job"
			@close="close"
			@appointed="$emit('appointed', $event)"
			@cancelled="$emit('cancelled', $event)"
			@scrollToTop="scrollToTop()"
		/>
	</div>
</template>

<script>
import SessionDetailModal from "@/components/Sessions/SessionDetailModal";

export default {
	transition: {
		name: "slide",
		mode: "out-in"
	},

	components: {
		SessionDetailModal
	},

	data() {
		return {
			job: null
		};
	},

	async asyncData({ app, params, error }) {
		try {
			const { id } = params;

			let response = await app.$axios.get(`/api/v1/practice/jobs/${id}`);

			let job = response.data.data.job;

			return {
				job
			};
		} catch (err) {
			if (err && err.response && err.response.status === 404) {
				return error({
					status: 404,
					message: "This session could not be found."
				});
			}

			throw err;
		}
	},

	methods: {
		close() {
			this.$router.push({
				name: "sessions-index",
				query: {
					...this.$route.query
				}
			});
		},

		scrollToTop() {
			console.log(this.$refs.modalContainer);
			this.$nextTick(() => {
				this.$refs.modalContainer.scrollTop = 0;
			});
		}
	}
};
</script>

<style scoped>
.modal-container {
	z-index: 510;
}
@media screen and (min-width: 1200px) {
	.modal-container {
		width: 80%;
	}
}
</style>
