<template>
	<section class="flex flex-col items-start">
		<AppButton :label="'Create'" class="ml-auto" @click="$router.push('/permanent-jobs/create')" />
		<AppTable
			class="w-full"
			v-if="permanent_jobs.length > 0"
			:total="total"
			:items="permanent_jobs"
			:currentPage="current_page"
			:perPage="params.limit"
			:columns="columns"
			:loading="loading"
			:routerLink="'/permanent-jobs'"
		></AppTable>
	</section>
</template>
<script>
import AppButton from "@/components/Base/AppButton";
import AppTable from "@/components/Base/AppTable";
export default {
	components: {
		AppButton,
		AppTable
	},
	data() {
		return {
			total: 0,
			current_page: 1,
			// app table params
			params: {
				job_id: null,
				limit: 5,
				offset: 0
			},
			loading: false,
			columns: [
				{
					name: "Title",
					dataIndex: "title"
				},
				{
					name: "Salary",
					dataIndex: "salary",
					class: "text-center"
				},
				{
					name: "Posted",
					dataIndex: "posted",
					class: "text-center"
				},
				{
					name: "Closes",
					dataIndex: "closes",
					class: "text-center"
				},
				{
					name: "Role",
					dataIndex: "role",
					class: "text-center"
				},
				{
					name: "Work Hours",
					dataIndex: "hours",
					class: "text-center"
				},
				{
					name: "Industry",
					dataIndex: "industry",
					class: "text-center"
				}
			],
			permanent_jobs: []
		};
	},
	created() {
		this.permanent_jobs = [
			{
				id: "1",
				title: "Lorem Ipsum",
				salary: 100,
				posted: "01 Jan 2020",
				closes: "01 Feb 2020",
				role: "GP",
				hours: "Part Time",
				industry: "NHS"
			}
		];
	}
};
</script>
