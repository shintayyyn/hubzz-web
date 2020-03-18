<template>
  <CreatePermanentJobModal />
</template>

<script>
import AppInput from "@/components/Base/AppInput";
import AppButton from "@/components/Base/AppButton";
import AppFilterSearch from "@/components/Base/AppFilterSearch";
import AppDate from "@/components/Base/AppDate";
import CreatePermanentJobModal from "@/components/PermanentJob/CreatePermanentJobModal";

export default {
	components: {
		AppInput,
		AppButton,
		AppFilterSearch,
		AppDate,
		CreatePermanentJobModal
	},
	data() {
		return {
			form: {
				title: "",
				description: "",
				date_posted: "",
				date_closing: "",
				email: "",
				report_to: "",
				industry_type: "",
				salary_amount: 0,
				salary_description: "",
				work_hours: 0,
				practice_id: "",
				parent_practice_id: "",
				appointed_to_locum: "",
				profession_id: "",
				practice_rate: 0,
				approved_at: "",

				qualification_id: "",
				clinical_system_id: "",
				spoken_language_id: ""
			},

			practice_lists: [],
			professions: [],
			professions_categories: [],
			selectedProfession: {
				profession_category: {}
			},
			industry_types: [
				{
					label: "NHS",
					value: "NHS"
				},
				{
					label: "Private",
					value: "Private"
				}
			],
			work_hours_type: [
				{
					label: "Part Time",
					value: "part_time"
				},
				{
					label: "Full Time",
					value: "full_time"
				}
			],
			salary_description_type: [
				{
					label: "Attractive",
					value: "Attractive"
				},
				{
					label: "Average",
					value: "Average"
				},
				{
					label: "Negotiable",
					value: "Negotiable"
				},
				{
					label: "Non-negotiable",
					value: "Non-negotiable"
				}
			],
			formError: []
		};
	},
	created() {
		this.loading = true;
		Promise.all([
			this.$axios.$get("/api/v1/practice/me/practice-practices"),
			this.$axios.$get("/api/v1/locum-detail-rate-types"),
			this.$axios.$get("/api/v1/shifts"),
			this.$axios.$get("/api/v1/professions"),
			this.$axios.$get("/api/v1/me")
		])
			.then(
				([
					responsePracticeLists,
					responseRateLists,
					responseShifts,
					responseProfessions,
					responseMe
				]) => {
					this.practice_lists = [];
					responsePracticeLists.data.practices.forEach(item => {
						this.practice_lists.push({
							label: item.surgery.name,
							value: item.id
						});
					});
					this.rate_lists = [];
					responseRateLists.data.locum_detail_rate_types.forEach(item => {
						this.rate_lists.push({ label: item.name, value: item.id });
					});
					this.shifts = [];
					responseShifts.data.shifts.forEach(item => {
						this.shifts.push({ label: item.name, value: item.id });
					});
					this.professions = [];
					responseProfessions.data.professions.forEach(item => {
						this.professions.push({ label: item.name, value: item.id });
						this.professions_categories.push(item);
					});
				}
			)
			.finally(() => {
				this.loading = false;
			});
	},
	watch: {
		"form.profession_id"(newValue, oldValue) {
			this.CheckEmptyField(newValue, "profession_id");
			if (newValue && oldValue) {
				this.form.qualification_id = [];
			}
			if (newValue) {
				this.selectedProfession = this.professions_categories.find(
					item => item.id == newValue
				);
				if (this.selectedProfession.profession_category.id == 1) {
					this.compliances = this.gp_compliance_documents_lists;
					return;
				}
				if (this.selectedProfession.profession_category.id == 2) {
					this.compliances = this.others_compliance_documents_lists;
					return;
				}
			}
		}
	}
};
</script>
<style>
.wrapper {
	position: relative;
	width: 100%;
	height: 100%;
	overflow: auto;
	transition: all 0.3s ease-in-out;
	scroll-behavior: smooth;
}

.modal-container {
	z-index: 510;
}
@media (min-width: 1200px) {
	.modal-container {
		width: 80%;
	}
}
.shield {
	z-index: 509;
}
</style>