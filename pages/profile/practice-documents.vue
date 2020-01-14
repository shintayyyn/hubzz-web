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
    <template v-if="terms.length > 0">
      <p class="mt-4">
        <strong>Variation to Standard Terms</strong>
      </p>
      <div class="row flex justify-start font-bold leading-none text-sm">
        <div class="flex-1 flex items-center p-2">Filename</div>
        <div class="flex-1 flex items-center p-2 justify-center">File Size</div>
        <div class="flex-1 flex items-center p-2 justify-center">Last Upload Date</div>
      </div>

      <div v-for="item in terms" :key="item.id" class="row py-2">
        <nuxt-link :to="`/profile/practice-documents/${item.id}/standard-terms`">
          <div
            class="px-2 mx-2 flex justify-start shadow-md rounded-lg items-center py-3 bg-white transition-hover hover:bg-gray-100"
          >
            <div class="flex-1">{{item.filename}}</div>
            <div class="flex-1 text-center">{{item.filename}}</div>
            <div class="flex-1 text-center">{{item.filename}}</div>
          </div>
        </nuxt-link>
      </div>
    </template>

    <transition name="fade" mode="out-in">
      <nuxt-link
        class="shield"
        v-if="$route.name.includes('profile-practice-documents-id')"
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
			variation_terms: [],
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
							if (!res.data.practice.variation_terms_file) {
								return null
							}
							const variation_terms = {
								fileId: res.data.practice.variation_terms_file.id,
								name: "Standard Terms",
								info: {
									file: {
										size: res.data.practice.variation_terms_file.size
									},
									created_at: res.data.practice.variation_terms_file.created_at
								}
							};
							console.log("variation", res.data.practice);
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

					// Add variation terms
					// practice_compliance_documents.push(variation_terms);

          // const practice_compliance_documents = [];
          // practice_document_types.forEach(practiceDocumentType => {
          //   let hasDocument = practice_documents.find(
          //     practiceDocument =>
          //       practiceDocument.practice_document_type.name ===
          //       practiceDocumentType.name
          //   );
          //   practice_compliance_documents.push({
          //     ...practiceDocumentType,
          //     info: hasDocument ? hasDocument : null,
          //     fileId: hasDocument ? hasDocument.id : null
          //   });
          // });

          const terms = [];
          if (variation_terms !== null) {
            terms.push(variation_terms);
          }
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
