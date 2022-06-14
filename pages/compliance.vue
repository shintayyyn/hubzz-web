<template>
  <div>
    <AppBreadcrumbs v-if="$route.name !== 'compliance'" :links="links" />
    <nuxt-child />
  </div>
</template>
<script>
import AppBreadcrumbs from '@/components/Base/AppBreadcrumbs'
export default {
  components: {
    AppBreadcrumbs
  },
  computed: {
    links() {
      console.log(this.$route)
      let links = [
        {
          title: 'Compliance',
          url: '/compliance'
        }
      ]
      if (this.$route.params.id) {
        links.push(
          {
            title: this.$route.params.id,
            url: `/compliance/${this.$route.params.id}`
          }
        )
      }else if (this.$route.name === 'availability-create') {
        links.push(
          {
            title: 'Add availability',
            url: '/availability/create'
          }
        )
      }
      return links
    }
  }
}
</script>