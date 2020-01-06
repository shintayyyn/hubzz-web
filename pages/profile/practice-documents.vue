<template>
	<section>
		<AppTable
			v-if="practice_compliance_documents.length > 0"
			:total="practice_compliance_documents.length"
			:items="practice_compliance_documents"
			:columns="columns"
			:routerLink="'/profile/practice-documents'"
			:routerId="'fileId'"
			:customWidth="480"
		></AppTable>
		<!-- <template v-if="terms.length > 0"> -->
		<p>
			<strong>Variation to Standard Terms</strong>
		</p>
		<AppTable
			:total="terms.length"
			:items="terms"
			:columns="terms_columns"
			:routerLink="'/profile/practice-documents'"
			:customWidth="480"
		></AppTable>
		<!-- </template> -->

		<transition name="fade" mode="out-in">
			<nuxt-link
				class="shield"
				v-if="$route.name === 'profile-practice-documents-id'"
				:to="'/profile/practice-documents'"
			></nuxt-link>
		</transition>
		<nuxt-child />
	</section>
</template>
<script>
import PracticeDocumentDetailModal from "@/components/Profile/PracticeDocumentDetailModal";
import AppTable from "@/components/Base/AppTable";
export default {
	transition: {
		name: "fade",
		mode: "out-in"
	},
	components: {
		PracticeDocumentDetailModal,
		AppTable
	},
	data() {
		return {
			practice_compliance_documents: [],
			terms: [],
			// app table
			columns: [
				{
					name: "Title",
					dataIndex: "name",
					class: "text-left"
				},
				{
					name: "File Size",
					dataIndex: "info.file.size",
					class: "text-center fileSize*MB qweq"
				},
				{
					name: "Last Upload Date",
					dataIndex: "info.created_at",
					class: "text-center localDate"
				}
			],
			terms_columns: [
				{
					name: "File Name",
					dataIndex: "filename",
					class: ""
				},
				{
					name: "File Size",
					dataIndex: "size",
					class: "text-center fileSize*MB qweq"
				},
				{
					name: "Last Upload Date",
					dataIndex: "created_at",
					class: "text-center localDate"
				}
			]
		};
	},
	computed: {
		authPermissions() {
			return this.$store.getters["auth/permissions"];
		}
	},
	async asyncData({ app, redirect, error }) {
		// const variation_response =
		if (app.$auth.user.domain === "Practice") {
			let permissions = app.$auth.user.practice_detail.role.permissions.map(
				permission => permission.name
			);
			if (permissions.includes("View Profile Practice Document")) {
				try {
					const [
						practice_documents,
						variation_terms,
						practice_document_types
					] = await Promise.all([
						app.$axios.$get(`/api/v1/practice/practice-documents`).then(res => {
							const practice_documents =
								res.data &&
								res.data.practice_documents &&
								res.data.practice_documents.length > 0
									? res.data.practice_documents
									: [];
							return practice_documents;
						}),
						app.$axios.$get(`/api/v1/practice/me/practice`).then(res => {
							const variation_terms =
								res.data &&
								res.data.practice &&
								res.data.practice.variation_terms_file
									? res.data.practice.variation_terms_file
									: [];
							console.log("variation", res.data.practice.variation_terms_file);
							return variation_terms;
						}),
						app.$axios.$get(`/api/v1/practice-document-types`).then(res => {
							const practice_document_types =
								res.data &&
								res.data.practice_document_types &&
								res.data.practice_document_types.length > 0
									? res.data.practice_document_types
									: [];
							return practice_document_types;
						})
					]);

					const terms = [];
					terms.push(variation_terms);

					const practice_compliance_documents = [];
					practice_document_types.forEach(practiceDocumentType => {
						let hasDocument = practice_documents.find(
							practiceDocument =>
								practiceDocument.practice_document_type.name ===
								practiceDocumentType.name
						);
						practice_compliance_documents.push({
							...practiceDocumentType,
							info: hasDocument ? hasDocument : null,
							fileId: hasDocument ? hasDocument.id : null
						});
					});

					console.log(
						"practice_compliance_documents",
						practice_compliance_documents,
						terms
					);

					return {
						practice_compliance_documents,
						terms
					};
				} catch (err) {
					if (err.response && err.response.status === 401) {
						error(err.response.data);
						return;
					}
					throw err;
				}
			} else if (permissions.includes("View Profile Practice")) {
				redirect("/profile");
			} else if (permissions.includes("View Profile Users")) {
				redirect(`/profile/users`);
			} else {
				error({ statusCode: 401, message: "Your Practice is Not Authorized" });
			}
		}
	},
	mounted() {
		this.$socket.on(
			"Practice Notification Document Created",
			this.getDocumentRealTime
		);
		this.$socket.on(
			"Practice Notification Document Updated",
			this.getDocumentRealTime
		);
	},
	destroyed() {
		this.removeListener();
	},
	created() {
		console.log("vaaar", this.variation_terms);
	},
	methods: {
		routerLink(practice_document) {
			if (practice_document) {
				return "/profile/practice-documents";
			} else {
				const query = {
					...this.$route.query,
					standard_terms: true
				};
				return;
			}
		},
		getDocumentRealTime(file) {
			let updatedDocument = this.practice_compliance_documents.find(
				item => item.fileId === file.id
			);
			let storeDocument = this.practice_compliance_documents.find(
				item => item.name === file.practice_document_type.name
			);

			if (updatedDocument) {
				updatedDocument.info = file;
			} else if (!updatedDocument && storeDocument) {
				storeDocument.info = file;
			}
		},
		removeListener() {
			this.$socket.removeListener(
				"Practice Notification Document Created",
				this.getDocumentRealTime
			);
			this.$socket.removeListener(
				"Practice Notification Document Updated",
				this.getDocumentRealTime
			);
		}
	}
};
</script>
<style scoped>
.shield {
	z-index: 509;
}
</style>
