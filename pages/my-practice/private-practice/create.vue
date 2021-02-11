<template>
  <div class="">
    <AppBreadcrumbs :links="links" />
    <AddSurgeryModal
      @close="$router.push({ name: 'my-practice-private-practice' })"
      @addPractice="$emit('addPractice', $event)"
      page
    />
  </div>
</template>
<script>
import AddSurgeryModal from "@/components/AddSurgeryModal";
import AppBreadcrumbs from '@/components/Base/AppBreadcrumbs'
export default {
  components: {
    AddSurgeryModal,
    AppBreadcrumbs
  },
  data() {
    return {
       links: [
        {
          title: 'My Practice',
          url: '/my-practice'
        },
        {
          title: 'Private Practice',
          url: '/my-practice/private-practice'
        },
        {
          title: 'Add Practice',
        }
      ]
    }
  },
  created() {
    console.log(this.$route)
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