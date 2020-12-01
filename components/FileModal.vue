<template>
	<div class="p-4 md:p-8">
		<div class="flex items-center">
			<svgicon
				name="left-arrow"
				height="32"
				width="32"
				class="cursor-pointer"
				@click="$emit('close')"
			/>
			<p v-if="file.details" class="font-bold mx-4 text-lg">{{file.details.name}}</p>
		</div>
		<div class="flex flex-col my-2" v-if="file.file">
			<p class="font-bold pb-2">File</p>
			<div class="w-full">
				<img
					v-if="file.file.type === 'image'"
					:src="getFileUrl(this.file.file)"
					class="object-contain object-left-top"
				/>
				<embed
					v-else
					:src="getFileUrl(this.file.file)"
					class="object-contain object-left-top w-full document h-full"
				/>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	props: {
		file: {
			type: Object,
			default: () => null
		}
	},
	data() {
		return {
			fileUrl: null
		};
	},
	methods: {
		getFileUrl(file) {
			const { url, type, subtype } = file;
			console.log(file);
			if (type === "application") {
				if (
					subtype === "msword" ||
					subtype ===
						"vnd.openxmlformats-officedocument.wordprocessingml.document" ||
					subtype ===
						"vnd.openxmlformats-officedocument.wordprocessingml.template" ||
					subtype === "vnd.ms-word.document.macroEnabled.12" ||
					subtype === "vnd.ms-word.template.macroEnabled.12"
				) {
					console.log(`${process.env.API_URL}/docs-to-pdf?url=${url}`);
					return `${process.env.API_URL}/docs-to-pdf?url=${url}`;
				}

				console.log(url);
				return url;
			}

			if (type === "image") {
				if (subtype === "tiff") {
					return `${process.env.API_URL}/image-to-jpeg?url=${url}`;
				}

				return url;
			}

			return url;
		}
	}
};
</script>
<style scoped>
.document {
	width: 100%;
	min-height: 50vh;
}

.image {
	min-height: 100%;
	max-height: 100%;
}

@media screen and (min-width: 768px) {
	.document {
		min-height: 85vh;
	}

	.image {
		min-height: 60vh;
		max-height: 60vh;
	}
}
</style>