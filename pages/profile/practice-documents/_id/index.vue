<template>
	<div class="p-2">
		<div class="flex items-center">
			<!-- <nuxt-link :to="'/profile/practice-documents'" class="cursor-pointer">
				<svgicon name="left-arrow" height="32" />
			</nuxt-link> -->
			<div
				v-if="authPermissions.includes('Download Profile Practice Document')"
        class="text-black no-underline flex items-center w-auto text-sm transition-hover hover:bg-yellow-500 rounded-lg cursor-pointer py-2 px-4 border"
			>
				<a
					@click.prevent="downloadItem(practice_document.file.url, practice_document.file.filename)"
					class="text-black no-underline flex justify-center px-2"
				>
					<svgicon name="cloud-download" width="18" height="18" color="black" hover="transparent black"></svgicon>
					<span class="mx-1">Download</span>
				</a>
			</div>
		</div>

		<div class="shadow-lg rounded-lg bg-gray-300 mt-4 max-w-5xl">
			<div class="flex flex-row flex-wrap justify-start p-4 md:p-8">
				<div class="flex flex-col w-full lg:w-1/4">
					<p class="mr-20 font-semibold">Title</p>
					<p
						class="mt-2 text-base"
					>{{practice_document.practice_document_type ? practice_document.practice_document_type.name: null}}</p>
					<p class="mt-5 mr-20 font-semibold">Practice</p>
					<p class="mt-2 text-base">{{practice.name}}</p>
					<p class="mt-5 mr-20 font-semibold">File last uploaded</p>
					<p
						class="mt-2 text-base"
					>{{practice_document.last_uploaded_at_in_gb_formatted ? practice_document.last_uploaded_at_in_gb_formatted : null}}</p>
					<!-- <p class="mt-5 mr-20 font-semibold">Uploaded By</p>
					<p
						class="mt-2 text-base"
					>{{practice_document.created_by_user ? practice_document.created_by_user.personal_detail.name : ''}}</p>-->
				</div>
				<div class="w-full mt-5 lg:mt-0 lg:w-3/4">
					<embed
						class="object-contain object-top w-full"
						:class="practice_document.file.type == 'image' ? 'image' : 'document h-full '"
						:src="['msword', 'tiff', 'vnd.openxmlformats-officedocument.wordprocessingml.document', 'vnd.openxmlformats-officedocument.wordprocessingml.template', 'vnd.ms-word.document.macroEnabled.12', 'vnd.ms-word.template.macroEnabled.12'].includes(practice_document.file.subtype) ? convertDoc(practice_document.file.url) : practice_document.file.url"
					/>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	props: ["practice"],
	computed: {
		authPermissions() {
			return this.$store.getters["permissions"];
		}
	},
	data() {
		return {
			practice_document: null
		};
	},
	async asyncData({ app, params, error }) {
		try {
			const response = await app.$axios.$get(
				`/api/v1/practice/practice-documents/${params.id}`
			);
			const practice_document =
				response.data && response.data.practice_document
					? response.data.practice_document
					: null;
			console.log('asdasd', practice_document)
			return {
				practice_document
			};
		} catch (err) {
			if (err.response && err.response.status === 401) {
				error(err.response.data);
				return;
			}
			throw err;
		}
	},
	methods: {
		downloadItem(fileUrl, fileFilename) {
			const axios = require("axios");
			axios({
				url: fileUrl,
				method: "GET",
				responseType: "blob" // important
			}).then(response => {
				const url = window.URL.createObjectURL(new Blob([response.data]));
				const link = document.createElement("a");
				link.href = url;
				link.setAttribute("download", fileFilename);
				document.body.appendChild(link);
				link.click();
			});
		},
		convertDoc(document) {
			return `https://docs.google.com/gview?url=${document}&embedded=true`;
		}
	}
};
</script>
<style scoped>
.modal-container {
	z-index: 510;
}
@media screen and (min-width: 1200px) {
	.modal-container {
		width: 80%;
	}
}
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
		min-height: 70vh;
	}

	.image {
		min-height: 60vh;
		max-height: 60vh;
	}
}
</style>

