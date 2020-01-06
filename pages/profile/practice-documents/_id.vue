<template>
	<div class="modal-container bg-white shadow-lg">
		<div class="p-4 md:p-8">
			<div class="flex items-center">
				<nuxt-link :to="'/profile/practice-documents'" class="cursor-pointer">
					<svgicon name="left-arrow" height="32" />
				</nuxt-link>
				<div
					v-if="authPermissions.includes('Download Profile Practice Document')"
					class="ml-8 hover:text-black hover:bg-yellow-500 rounded-lg inline-flex p-2 cursor-pointer"
				>
					<a
						@click.prevent="downloadItem(practice_document.file.url, practice_document.file.filename)"
						class="text-black no-underline flex justify-center px-2"
					>
						<svgicon name="cloud-download" width="21" height="21" color="black" hover="transparent black"></svgicon>
						<span class="pl-2">Download</span>
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
						<p
							class="mt-2 text-base"
						>{{practice_document.practice ? practice_document.practice.surgery.name: null}}</p>
						<p class="mt-5 mr-20 font-semibold">File last uploaded</p>
						<p
							class="mt-2 text-base"
						>{{practice_document.file ? $moment(practice_document.file.created_at).format('MM/DD/YYYY HH:mm:ss') : null}}</p>
						<p class="mt-5 mr-20 font-semibold">Uploaded By</p>
						<p
							class="mt-2 text-base"
						>{{practice_document.created_by_user ? practice_document.created_by_user.personal_detail.name : ''}}</p>
					</div>
					<div class="w-full mt-5 lg:mt-0 lg:w-3/4">
						<embed
							class="object-contain object-top w-full"
							:class="practice_document.file.type == 'image' ? 'image' : 'document h-full '"
							:src="practice_document.file.subtype === 'tiff' || practice_document.file.subtype === 'msword' ? convertDoc(practice_document.file.url) : practice_document.file.url"
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	transition: {
		name: "slide",
		mode: "out-in"
	},
	computed: {
		authPermissions() {
			return this.$store.getters["auth/permissions"];
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
			console.log("docs", response);
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
			console.log(fileUrl, fileFilename);
			const axios = require("axios");
			console.log(axios);
			axios({
				url: fileUrl,
				method: "GET",
				responseType: "blob" // important
			}).then(response => {
				console.log(response);
				return;
				const url = window.URL.createObjectURL(new Blob([response.data]));
				const link = document.createElement("a");
				link.href = url;
				link.setAttribute("download", fileFilename);
				document.body.appendChild(link);
				link.click();
			});
		},
		convertDoc(document) {
			if (this.practice_document.file.subtype === "tiff") {
				return document;
			} else if (this.practice_document.file.subtype === "msword") {
				return `https://docs.google.com/gview?url=${document}&embedded=true`;
			}
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

