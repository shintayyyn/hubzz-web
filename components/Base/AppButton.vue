<template>
	<button
		@click.prevent="$emit('click')"
		:disabled="disabled"
		class="rounded-lg p-2 md:px-4 focus:outline-none transition-hover"
		:class="[disabled ? 'disabled-button' : '', (label.includes('Filter') || label.includes('Sort')) && 'flex items-center', inClass, customTheme ? customTheme : 'button font-bold md:text-lg ']"
		:style="inStyle"
	>
		{{label}}
		<svgicon
			v-if="label.includes('Filter') || label.includes('Sort')"
			name="sort"
			class="h-full w-3 ml-2 fill-current"
		/>
	</button>
</template>
<script>
export default {
	props: {
		label: {
			type: String,
			default: "Save"
		},
		inClass: {
			type: String
		},
		inStyle: {
			type: String
		},
		disabled: {
			type: Boolean,
			default: false
		},
		customTheme: {
			type: String
		}
	}
};
</script>
<style >
.button {
	background: linear-gradient(to top, #f2d024, #efde86);
}
.button:hover,
.button:focus {
	background: linear-gradient(to top, #e6c520, #f1d130);
}
.button:hover {
	transform: translate(1px, 1px);
}
.button:active {
	transform: translate(2px, 2px);
}
.disabled-button {
	color: #9e9e9e;
	background: linear-gradient(to top, #ccc, #ddd);
	cursor: not-allowed;
}

.disabled-button:hover {
	transform: translate(0, 0);
	background: linear-gradient(to top, #ccc, #ddd);
}
</style>

