<template>
  <div class="modal-container shadow-lg">
    <PracticeRoleDetail
      :role="role"
      @close="$router.push(`/roles-and-permissions/roles`)"
      @updateRole="$emit('updateRole', $event)"
    />
  </div>
</template>
<script>
import PracticeRoleDetail from "@/components/PracticeRole/PracticeRoleDetail";
export default {
  components: {
    PracticeRoleDetail
  },
  async asyncData({ app, params, error }) {
    try {
      const response = await app.$axios.$get(
        `/api/v1/practice/practice-roles/${params.id}`
      );

      const role =
        response.data && response.data.role ? response.data.role : null;

      return {
        role
      };
    } catch (err) {
      if (
        err.response &&
        (err.response.status === 401 || err.response.status === 404)
      ) {
        error(err.response.data);
        return;
      }
      throw err;
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
</style>