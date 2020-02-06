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
    >
      <template v-slot:actions="slotProps">
        <div
          v-if="slotProps.item.info"
        >{{(slotProps.item.info.updated_at ? slotProps.item.info.updated_at : slotProps.item.info.created_at) | localDate}}</div>
      </template>
      <template v-slot:actions-button="slotProps">
        <AppButton
          :label="'View'"
          @click="$router.push({ path: `/profile/practice-documents/${slotProps.item.fileId}` })"
        />
      </template>
    </AppTable>
    <template v-if="terms.length > 0">
      <p class="mt-4">
        <strong>Variation to Standard Terms</strong>
      </p>
      <AppTable
        v-if="terms.length > 0"
        :total="terms.length"
        :items="terms"
        :columns="variation_columns"
        :customWidth="480"
      >
        <template v-slot:actions="slotProps">
          <div
            v-if="slotProps.item.info"
          >{{(slotProps.item.info.updated_at ? slotProps.item.info.updated_at : slotProps.item.info.created_at) | localDate}}</div>
        </template>
        <template v-slot:actions-button>
          <AppButton
            :label="'View'"
            @click="$router.push({ path: `/profile/practice-documents/standard-terms` })"
          />
        </template>
      </AppTable>
    </template>

    <transition name="fade" mode="out-in">
      <nuxt-link
        class="shield"
        v-if="['profile-practice-documents-id', 'profile-practice-documents-standard-terms'].includes($route.name)"
        :to="'/profile/practice-documents'"
      ></nuxt-link>
    </transition>
    <nuxt-child :practice="practice" />
  </section>
</template>
<script>
import PracticeDocumentDetailModal from "@/components/Profile/PracticeDocumentDetailModal";
import AppTable from "@/components/Base/AppTable";
import AppButton from "@/components/Base/AppButton";
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },
  components: {
    PracticeDocumentDetailModal,
    AppTable,
    AppButton
  },
  data() {
    return {
      practice_compliance_documents: [],
      variation_terms: [],
      // app table
      variation_columns: [
        {
          name: "Filename",
          dataIndex: "name",
          class: "text-left"
        },
        {
          name: "File Size",
          dataIndex: "info.file.size",
          class: "text-center fileSize*MB"
        },
        {
          name: "Last Upload Date",
          dataIndex: "actions",
          class: "text-center"
        },
        {
          name: "Actions",
          dataIndex: "actions-button",
          class: "text-center"
        }
      ],
      columns: [
        {
          name: "Title",
          dataIndex: "name",
          class: "text-left"
        },
        {
          name: "File Size",
          dataIndex: "info.file.size",
          class: "text-center fileSize*MB"
        },
        {
          name: "Last Upload Date",
          dataIndex: "actions",
          class: "text-center"
        },
        {
          name: "Actions",
          dataIndex: "actions-button",
          class: "text-center"
        }
      ]
    };
  },
  computed: {
    authPermissions() {
      return this.$store.getters["permissions"];
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
            practice,
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
              const practice = res.data.practice;
              return practice;
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

          let variation_terms = null;
          if (practice.variation_terms_file) {
            variation_terms = {
              fileId: practice.variation_terms_file.id,
              name: "Standard Terms",
              info: {
                file: {
                  size: practice.variation_terms_file.size
                },
                created_at: practice.variation_terms_file.created_at
              }
            };
          }

          const terms = [];
          if (variation_terms !== null) {
            terms.push(variation_terms);
          }

          return {
            practice_compliance_documents,
            terms,
            practice
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
        storeDocument.fileId = file.id;
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
