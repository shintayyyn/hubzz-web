<template>
  <div>
    <AppBreadcrumbs :links="links"/>
    <nuxt-child />
  </div>
</template>
<script>
import AppBreadcrumbs from "@/components/Base/AppBreadcrumbs"
export default {
  components: {
    AppBreadcrumbs
  },
  computed: {
    links() {
      let route = this.$route
      let links = [
        {
          title: 'Roles and Permissions',
          url: '/roles-and-permissions/roles'
        }
      ]

      if (route.params.id) {
        links.push(
          {
            title: route.params.id,
            url: `/roles-and-permissions/roles/${route.params.id}`
          }
        )
      }else if (route.name === 'roles-and-permissions-roles-create') {
        links.push(
          {
            title: 'Create',
            url: '/roles-and-permissions/roles/create'
          }
        )
      }else {
        links = []
      }

      return links
    }
  }
  
}
</script>