<template>
	<div>
		<div class="shield" v-if="modal" @click.prevent="$emit('cancel')"></div>
		<transition name="drop" mode="out-in">
			<div
				class="flex justify-center remove-confirmation-modal"
				:class="inClass"
				:style="inStyle"
				v-if="modal"
			>
				<div
					class="w-full md:w-auto border-solid rounded-b-lg bg-yellow-500 py-2 px-4 md:px-24 shadow-lg"
				>
					<div class="flex justify-center">
						<svgicon class="mr-1" :name="status" height="20" width="20" v-if="status" />
						<div class="text-sm md:text-base font-bold">{{label}}</div>
					</div>
					<div class="flex justify-center">
						<div class="text-sm md:text-base font-bold">{{label2}}</div>
					</div>
					<div class="flex justify-center">
						<div class="text-sm md:text-base font-bold">{{label3}}</div>
					</div>
					<div class="flex justify-center my-2">
						<div class="mx-2">
							<button
								class="button border hover:text-white focus:outline-none text-black font-bold py-2 md:py-5 rounded-lg"
								style="width:100px;"
								@click.prevent="$emit('confirm')"
							>{{confirmLabel}}</button>
						</div>
						<div class="mx-2" v-if="cancelLabel">
							<button
								class="button border hover:text-white focus:outline-none text-black font-bold py-2 md:py-5 rounded-lg"
								@click.prevent="$emit('cancel')"
								style="width:100px;"
							>{{cancelLabel}}</button>
						</div>
					</div>
				</div>
			</div>
		</transition>
	</div>
</template>
<script>
export default {
	props: {
		modal: {
			type: Boolean,
			default: false
		},
		status: {
			type: String,
			default: "alert"
		},
		label: {
			type: String,
			required: true
		},
		label2: {
			type: String
		},
		label3: {
			type: String
		},
		confirmLabel: {
			type: String
		},
		cancelLabel: {
			type: String
		},
		inClass: {
			type: String
		},
		inStyle: {
			type: String
		}
	}
};
</script>
<style scoped>
.button {
	background: linear-gradient(to top, #f2d024, #efde86);
}
.shield {
	z-index: 511;
}
.remove-confirmation-modal {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	height: auto;
	z-index: 601;
}
</style>
