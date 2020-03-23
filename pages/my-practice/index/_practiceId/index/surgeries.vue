<template>
	<AppTable
		v-if="surgeries.length > 0"
		:total="surgeries.length"
		:items="surgeries"
		:currentPage="current_page"
		:perPage="limit"
		:columns="columns"
		:orderBy="order_by"
		:loading="loading"
		@pagechanged="pagechanged"
		@limitchanged="limitchanged"
	></AppTable>
</template>
<script>
import AppTable from "@/components/Base/AppTable";
export default {
	transition: {
		name: "fade",
		mode: "out-in"
	},
	components: {
		AppTable
	},
	props: ["practice"],
	computed: {
		surgeries() {
			return this.practice ? [this.practice.surgery] : [];
		}
	},
	data() {
		return {
			columns: [
				{
					name: "Surgery",
					dataIndex: "name",
					class: ""
				},
				{
					name: "Practice code",
					dataIndex: "code",
					class: "text-center"
				},
				{
					name: "CCG",
					dataIndex: "clinical_commissioning_group.name",
					class: ""
				}
			],
			loading: false,
			offset: 0,
			limit: 5,
			order_by: [],
			current_page: 1
		};
	},
	methods: {
		pagechanged() {},
		limitchanged() {}
	}
};
</script>