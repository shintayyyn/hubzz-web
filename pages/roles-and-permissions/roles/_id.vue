<template>
  <div class="modal-container shadow-lg">
    <PracticeRoleDetail :role="role" @close="$router.push(`/roles-and-permissions/roles`)" />
  </div>
</template>
<script>
import PracticeRoleDetail from "@/components/PracticeRole/PracticeRoleDetail";
export default {
  components: {
    PracticeRoleDetail
  },
  async asyncData({ app, params, error }) {
    const response = await app.$axios.$get(
      `/api/v1/practice/practice-roles/${params.id}`
    );

    const role =
      response.data && response.data.role ? response.data.role : null;

    return {
      role
    };
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
</style>