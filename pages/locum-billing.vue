<template>
	<section class="billing-section">
		<div class="flex flex-col md:flex-row lg:items-center justify-between">
			<div class="flex flex-row justify-start overflow-x-auto pb-3">
				<nuxt-link
					to="/locum-billing/invoices"
					class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
					:class="$route.name.includes('locum-billing-invoices') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
				>Invoices</nuxt-link>
				<nuxt-link
					:to="{ name: 'locum-billing-private-invoices'}"
					class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
					:class="$route.name.includes('locum-billing-private-invoices') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
				>Private Invoices</nuxt-link>
			</div>
		</div>
		<div>
			<nuxt-child />
		</div>
	</section>
</template>

<script>
export default {
	middleware: "isVerified",
	mounted() {
		if (this.$route.name === "locum-billing") {
			this.$router.push("/locum-billing/invoices?status=to-be-invoiced");
		}
	}
};
</script>