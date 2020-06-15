<template>
	<div class="modal-container shadow-lg">
		<div class="p-4 md:p-8 h-screen">
			<div class="flex flex-row flex-wrap justify-start pb-4">
				<nuxt-link :to="{ name: `practice-billing-invoices-from-locums`, query: {...$route.query }}">
					<svgicon name="left-arrow" height="32" width="32" />
				</nuxt-link>
			</div>
			<PracticeBillingInvoiceForm
				:propInvoice="invoice"
				@updateInvoice="$emit('updateInvoice', $event), $router.push({ name: 'practice-billing-invoices-from-locums', query: {...$route.query} })"
			/>
		</div>
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
				`/api/v1/practice/locum-invoices/${params.id}`
			);
			const invoice =
				response.data && response.data.data && response.data.data.locum_invoice
					? response.data.data.locum_invoice
					: null;
			console.log(invoice);
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
		width: 80%;
	}
}
</style>
