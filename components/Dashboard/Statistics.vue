<template>
	<section>
		<div class="flex flex-row flex-wrap justify-start lg:max-w-6xl">
			<div
				v-for="(item, index) in statistics"
				:key="index"
				class="sm:px-2 my-2 sm:my-4 w-full sm:w-1/2 lg:max-w-sm"
				:class="$auth.user.domain === 'Locum' ? 'md:w-1/4' : 'md:w-1/3'"
			>
				<nuxt-link :to="item.route">
					<div class="statistics-card rounded-lg shadow-md px-4 md:px-8 py-4 bg-white hover:bg-gray-300">
						<div class="flex flex-col">
							<div class="text-sm sm:text-md">{{ item.label }}</div>
							<div class="font-bold text-5xl">{{ item.value }}</div>
						</div>
					</div>
				</nuxt-link>
			</div>
		</div>
	</section>
</template>
<script>
export default {
	data() {
		return {
			statistics: []
		};
	},
	created() {
		this.statistics = [];
		if (this.$auth.user.domain === "Locum") {
			this.getLocumStats();
		} else if (this.$auth.user.domain === "Practice") {
			this.getPracticeStats();
		}
	},
	methods: {
		getLocumStats() {
			this.$axios
				.$get(`/api/v1/locum/me/statistics`)
				.then(res => {
					this.statistics.push({
						label: "Available Jobs",
						value: res.data.locum_user_statistics.matched_job_count,
						route: "/jobs?status=Available"
					}),
						this.statistics.push({
							label: "Allocated Jobs",
							value: res.data.locum_user_statistics.allocated_job_count,
							route: "/jobs?status=Allocated"
						}),
						this.statistics.push({
							label: "Applied Jobs",
							value: res.data.locum_user_statistics.applied_job_count,
							route: "/jobs?status=Applied"
						}),
						this.statistics.push({
							label: "Ongoing Job Parts",
							value: res.data.locum_user_statistics.ongoing_job_part_count,
							route: "/jobs?status=Ongoing"
						});
					this.statistics.push({
						label: "Completed Job Parts",
						value: res.data.locum_user_statistics.completed_job_part_count,
						route: "/jobs?status=Completed"
					});
				})
				.catch(err => {
					console.log("err", err.response || err);
				});
		},
		getPracticeStats() {
			this.$axios
				.$get(`/api/v1/practice/me/practice-statistics`)
				.then(res => {
					this.statistics.push({
						label: "My Banks",
						value: res.data.practice_statistics.favorite_locum_count,
						route: "/my-banks?status=Favorite"
					});
					this.statistics.push({
						label: "Applied Jobs",
						value: res.data.practice_statistics.applied_job_count,
						route: "/sessions?status=Applied"
					}),
						this.statistics.push({
							label: "Allocated Jobs",
							value: res.data.practice_statistics.allocated_job_count,
							route: "/sessions?status=Allocated"
						}),
						this.statistics.push({
							label: "Live Jobs",
							value: res.data.practice_statistics.live_job_count,
							route: "/sessions?status=Live"
						});
					this.statistics.push({
						label: "Completed Job Parts",
						value: res.data.practice_statistics.completed_job_part_count,
						route: "/sessions?status=Completed"
					});
					this.statistics.push({
						label: "Unfilled Jobs",
						value: res.data.practice_statistics.unfilled_job_count,
						route: "/sessions?status=Unfilled"
					});
					this.statistics.push({
						label: "To Complete Ongoing Job Parts",
						value:
							res.data.practice_statistics
								.to_be_completed_ongoing_job_part_count,
						route: "/sessions?status=Ongoing"
					});
				})
				.catch(err => {
					console.log("err", err.response || err);
				});
		}
	}
};
</script>

<style scoped>
a {
	text-decoration: none;
	color: black;
}

.statistics-card {
	min-height: 130px;
	display: flex;
	align-items: center;
}
</style>