<template>
	<div class="">
		<div class="px-2">
			<!-- <div class="flex flex-row flex-wrap justify-start pb-4">
				<nuxt-link
					:to="{ name: 'locum-billing-invoices', query: {...$route.query}}"
					class="cursor-pointer"
				>
					<svgicon name="left-arrow" height="32" width="32" />
				</nuxt-link>
			</div> -->
			<AppBreadcrumbs :links="links" />
			<LocumPlatformBillingInvoiceForm
				:propInvoice="invoice"
				:propJobPart="null"
				@updateInvoice="$emit('updateInvoice', $event), $router.push({ name: 'locum-billing-invoices', query: {...$route.query} })"
			/>
		</div>
	</div>
</template>
<script>
import AppBreadcrumbs from "@/components/Base/AppBreadcrumbs";
import LocumPlatformBillingInvoiceForm from "@/components/Billing/LocumPlatformBillingInvoiceForm";
export default {
	transition: {
		name: "slide",
		mode: "out-in"
	},
	components: {
		AppBreadcrumbs,
		LocumPlatformBillingInvoiceForm
	},
	async asyncData({ app, error, params, route }) {
		try {
			const response = await app.$axios.get(
				`/api/v1/locum/locum-invoices/${params.id}`
			);

			const invoice =
				response.data && response.data.data && response.data.data.locum_invoice
					? response.data.data.locum_invoice
					: null;

			const links = [ 
				{
					title: 'Billing',
					url: '/locum-billing/invoices'
				},
				{
					title: `${invoice.status}${['Approved', 'Disputed'].includes(invoice.status) ? ' Invoices' : ''}`,
					url: `/locum-billing/invoices?status=${route.query.status}`
				},
				{
					title: invoice.invoice_number
				}
			]

			return {
				invoice,
				links
			};
		} catch (err) {
			if (err && err.response.status === 404) {
				return error({ status: 404, message: "This page could not be found" });
			} else if (err & (err.response.status === 500)) {
				return error({ status: 500, message: "Something went wrong!" });
			}
			throw err;
		}
	}
};
</script>

<style scoped>
.modal-container {
	z-index: 512;
}
@media screen and (min-width: 1200px) {
	.modal-container {
		width: 80%;
	}
}
</style>
