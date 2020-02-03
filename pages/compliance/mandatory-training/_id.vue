<template>
	<div class="modal-container shadow-lg">
		<div class="p-4 md:p-8">
			<div class="flex flex-row flex-no-wrap items-center text-lg">
				<div @click="$router.push('/compliance')" class="cursor-pointer">
					<svgicon name="left-arrow" height="32" />
				</div>
				<a
					@click.prevent="downloadItem(mandatory_training.file.url,mandatory_training.file.filename)"
					class="text-black no-underline flex items-center w-auto hover:bg-yellow-500 rounded-lg cursor-pointer p-2 mx-4"
				>
					<svgicon
						name="cloud-download"
						width="21"
						height="21"
						color="black"
						hover="transparent black"
						class="inline"
					></svgicon>
					<span class="mx-1"></span>
					<span>Download</span>
				</a>
			</div>
			<div class="flex flex-col md:p-4">
				<div class="shadow-lg rounded-lg bg-gray-300 mt-5 max-w-5xl">
					<div class="flex flex-row flex-wrap justify-start p-4 md:p-8">
						<div class="flex flex-col w-full lg:w-1/4 pr-4">
							<p class="font-bold text-lg">Title</p>
							<p
								class="mt-2 text-sm md:text-base"
							>{{mandatory_training.mandatory_training ? mandatory_training.mandatory_training.name: null}}</p>
							<p class="mt-5 font-bold text-lg">File last uploaded</p>
							<p
								class="mt-2 text-sm md:text-base"
							>{{mandatory_training.file ? $moment(mandatory_training.file.created_at).format('DD/MM/YYYY HH:mm:ss') : null}}</p>
							<div v-if="mandatory_training.status === 'Approved'">
								<p class="mt-5 font-bold text-lg">Expiration Date</p>
								<p
									class="mt-2 text-sm md:text-base"
								>{{mandatory_training.expired_at ? $moment(mandatory_training.expired_at).format('DD/MM/YYYY HH:mm:ss') : null}}</p>
							</div>
							<div v-if="mandatory_training.status === 'Rejected'">
								<p class="mt-5 font-bold text-lg">Rejected At</p>
								<p
									class="mt-2 text-sm md:text-base"
								>{{mandatory_training.file ? $moment(mandatory_training.file.created_at).format('DD/MM/YYYY HH:mm:ss') : null}}</p>
								<div v-if="mandatory_training.status === 'Approved'">
									<p class="mt-5 font-bold text-lg">Expiration Date</p>
									<p
										class="mt-2 text-sm md:text-base"
									>{{mandatory_training.expired_at ? $moment(mandatory_training.expired_at).format('DD/MM/YYYY HH:mm:ss') : null}}</p>
								</div>
								<div v-if="mandatory_training.status === 'Rejected'">
									<p class="mt-5 font-bold text-lg">Rejected At</p>
									<p
										class="mt-2 text-sm md:text-base"
									>{{mandatory_training && mandatory_training.rejected_at ? mandatory_training.rejected_at : null }}</p>
									<p class="mt-5 font-bold text-lg">Notes</p>
									<p
										class="mt-2 text-sm md:text-base"
									>{{mandatory_training && mandatory_training.note ? mandatory_training.note : null}}</p>
								</div>
								<p class="mt-5 font-bold text-lg">Expiry date</p>
								<AppDate v-model="expiry_date" :name="'expiry_date'" isAfter />
								<AppButton :label="'Save'" @click="update()" :inStyle="'padding:5px 20px'" />
							</div>
							<p class="mt-5 font-bold text-lg">Expiry date</p>
							<AppDate v-model="expiry_date" :name="'expiry_date'" isAfter />
							<AppButton :label="'Save'" @click="update" :inStyle="'padding:5px 20px'" />
						</div>
						<div class="mt-5 lg:mt-0 w-full lg:w-3/4">
							<embed
								class="object-contain object-top w-full"
								:class="mandatory_training.file.type == 'image' ? 'image' : 'document h-full'"
								:src="mandatory_training.file.subtype === 'tiff' || mandatory_training.file.subtype === 'msword' ? convertDoc(mandatory_training.file.url) : mandatory_training.file.url"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import AppDate from "@/components/Base/AppDate";
import AppButton from "@/components/Base/AppButton";
export default {
	components: {
		AppDate,
		AppButton
	},
	data() {
		return {
			expiry_date: null,
			formError: []
		};
	},
	async asyncData({ app, params, error }) {
		try {
			const response = await app.$axios.$get(
				`/api/v1/locum/locum-detail-mandatory-trainings/${params.id}`
			);
			let mandatory_training =
				response.data && response.data.locum_detail_mandatory_training
					? response.data.locum_detail_mandatory_training
					: null;
			console.log(mandatory_training);
			return {
				mandatory_training
			};
		} catch (err) {
			throw err;
		}
	},
	created() {
		this.expiry_date = this.mandatory_training.expired_at;
	},
	methods: {
		async update() {
			try {
				const formData = new FormData();
				formData.append("file", {});
				formData.append("expired_at", this.expiry_date);
				const response = await this.$axios.$put(
					`/api/v1/locum/locum-detail-mandatory-trainings/${this.$route.params.id}`,
					formData
				);
			} catch (err) {
				throw err;
			}
		},
		downloadItem(fileUrl, fileName) {
			const axios = require("axios");
			axios({
				url: fileUrl,
				method: "GET",
				responseType: "blob" // important
			}).then(response => {
				const url = window.URL.createObjectURL(new Blob([response.data]));
				const link = document.createElement("a");
				link.href = url;
				link.setAttribute("download", fileName);
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
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