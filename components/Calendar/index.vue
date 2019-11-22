<template>
	<section>
		<div class="relative calendar bg-white border border-solid shadow-md my-4 rounded-lg lg:max-w-6xl">
			<div class="relative flex flex-row flex-wrap w-full h-full">
				<div
					class="relative w-full lg:w-2/3 px-2 pb-5 pt-2 md:p-5"
					:class="authPermissions.includes('Create Sessions Job') ? 'pb-16 md:pb-20' : ''"
				>
					<PerMonth v-if="$store.state.calendar.view_type === 'per_month'" />
					<PerWeek v-if="$store.state.calendar.view_type === 'per_week'" />
					<div class="absolute md:mx-5 md:py-4 mx-2 right-0 mt-2 md:-mt-3">
						<div
							v-if="
								$auth.user.domain === 'Locum' ||
									($auth.user.domain === 'Practice' && authPermissions.includes('Create Sessions Job'))
							"
							class="rounded-full h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 text-2xl sm:text-3xl md:text-4xl flex items-center focus:outline-none justify-center bg-yellow-500 font-semibold cursor-pointer shadow-md hover:text-white"
							@click="create"
						>
							+
						</div>
					</div>
				</div>
				<div class="w-full lg:w-1/3">
					<Info @viewPracticeJob="viewPracticeJob" @viewLocumJob="viewLocumJob" />
				</div>
			</div>
		</div>
		<div class="shield" v-if="toggleScroll" @click="close"></div>
		<transition name="slide" mode="out-in">
			<template v-if="locum_appointment_modal">
				<div class="modal-container">
					<LocumJobDetailModalAppointment
						v-if="locum_appointment_modal"
						@close="locum_appointment_modal = false"
						:job="locum_appointment_job"
					/>
				</div>
			</template>
			<template v-if="locum_modal">
				<div class="modal-container">
					<LocumJobDetailModal @close="locum_modal = false" :job="locum_job" />
				</div>
			</template>
			<template v-if="locum_modal_part">
				<div class="modal-container">
					<LocumJobPartDetailModal @close="locum_modal_part = false" :job_part="locum_job_part" />
				</div>
			</template>
			<template v-if="practice_modal">
				<div class="modal-container">
					<PracticeJobDetailModal @close="practice_modal = false" :job="practice_job" />
				</div>
			</template>
			<template v-if="practice_modal_part">
				<div class="modal-container">
					<PracticeJobPartDetailModal @close="practice_modal_part = false" :job_part="practice_job_part" />
				</div>
			</template>
		</transition>
	</section>
</template>
<script>
import PerMonth from "@/components/Calendar/PerMonth";
import PerWeek from "@/components/Calendar/PerWeek";
import Info from "@/components/Calendar/Info";
// locums
import LocumJobDetailModal from "@/components/Jobs/JobDetailModal";
import LocumJobPartDetailModal from "@/components/Jobs/JobPartDetailModal";
import LocumJobDetailModalAppointment from "@/components/Jobs/JobDetailModalAppointment";
// practice
import PracticeJobDetailModal from "@/components/Sessions/JobDetailModal";
import PracticeJobPartDetailModal from "@/components/Sessions/JobPartDetailModal";

export default {
	components: {
		PerMonth,
		PerWeek,
		Info,
		LocumJobDetailModal,
		LocumJobPartDetailModal,
		LocumJobDetailModalAppointment,
		PracticeJobDetailModal,
		PracticeJobPartDetailModal
	},
	data() {
		return {
			locum_modal: false,
			locum_job: null,
			locum_modal_part: false,
			locum_job_part: null,
			locum_appointment_modal: false,
			locum_appointment_job: null,
			practice_modal: false,
			practice_job: null,
			practice_modal_part: false,
			practice_job_part: null
		};
	},
	created() {
		this.$store.commit("calendar/SET_DATE_TODAY");
	},
	computed: {
		loading() {
			return this.$store.state.calendar.loading;
		},
		toggleScroll() {
			return (
				this.locum_modal_part ||
				this.locum_appointment_modal ||
				this.locum_modal ||
				this.practice_modal ||
				this.practice_modal_part
			);
		},
		create_job_modal() {
			return this.$store.state.calendar.create_job_modal;
		},
		authPermissions() {
			return this.$store.getters["auth/permissions"];
		}
	},
	watch: {
		toggleScroll(value) {
			if (value) {
				document.body.style.overflow = "hidden";
			} else {
				document.body.style.overflow = "auto";
			}
		}
	},
	methods: {
		create() {
			if (this.$auth.user.domain === "Locum") {
				this.createAppointmentJob();
			} else {
				this.$store.commit("calendar/CREATE_JOB_MODAL", true);
			}
		},
		// locum
		createAppointmentJob() {
			this.locum_appointment_modal = true;
			this.locum_appointment_job = null;
		},
		viewLocumJob(job) {
			if (job.type === "Private") {
				this.locum_appointment_modal = true;
				this.locum_appointment_job = job;
			} else if (["ongoing", "completed", "approved", "allocated"].includes(job.locum_status.toLowerCase())) {
				this.locum_modal_part = true;
				this.locum_job_part = job;
			} else if (!["ongoing", "completed", "approved", "allocated"].includes(job.locum_status.toLowerCase())) {
				this.locum_modal = true;
				this.locum_job = job;
			}
		},
		// practice
		viewPracticeJob(job) {
			if (["ongoing", "completed", "approved"].includes(job.status.toLowerCase())) {
				this.practice_modal_part = true;
				this.practice_job_part = job;
			} else if (!["ongoing", "completed", "approved"].includes(job.status.toLowerCase())) {
				this.practice_modal = true;
				this.practice_job = job;
			}
		},
		// close modal thru shield
		close() {
			this.locum_modal = false;
			this.locum_modal_part = false;
			this.locum_appointment_modal = false;
			this.practice_modal = false;
			this.practice_modal_part = false;
		}
	}
};
</script>
<style>
.calendar {
	height: auto;
	/* max-width: 1000px; */
}
@media screen and (min-width: 991px) {
	.calendar {
		height: auto;
	}
}
.modal-container {
	z-index: 510;
}
@media screen and (min-width: 1200px) {
	.modal-container {
		width: 80%;
	}
}
/* .shield {
  z-index: 509;
} */
</style>
