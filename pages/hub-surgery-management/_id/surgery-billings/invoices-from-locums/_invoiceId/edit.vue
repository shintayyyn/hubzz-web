<template>
	<div class="p-2">
		<PracticeBillingInvoiceForm
			:propInvoice="invoice"
			:propId="$route.params.invoiceId"
			@updateInvoice="$emit('updateInvoice', $event), $router.push({ path: `/hub-surgery-management/${$route.params.id}/surgery-billings/invoices-from-locums`, query: {...$route.query} })"
		/>
	</div>
</template>
<script>
import PracticeBillingInvoiceForm from "@/components/Billing/PracticeBillingInvoiceForm";
export default {
	transition: {
		name: "slide",
		mode: "out-in"
	},
	components: {
		PracticeBillingInvoiceForm
	},
	async asyncData({ app, error, params }) {
		try {
			const response = await app.$axios.get(
				`/api/v1/practice/locum-invoices/${params.invoiceId}`
			);
			const invoice =
				response.data && response.data.data && response.data.data.locum_invoice
					? response.data.data.locum_invoice
					: null;

			return {
				invoice
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
		width: 70%;
	}
}
</style>
