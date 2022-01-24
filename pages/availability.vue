<template>
  <div>
    <AppBreadcrumbs v-if="$route.name !== 'availability'" :links="links" />
    <nuxt-child />
  </div>
</template>
<script>
import AppBreadcrumbs from '@/components/Base/AppBreadcrumbs'
export default {
  components: {
    AppBreadcrumbs,
  },
  computed: {
    links () {
      console.log(this.$route)
      let links = [
        {
          title: 'Availability',
          url: '/availability',
        },
      ]
      if (this.$route.params.id) {
        links.push(
          {
            title: this.$route.params.id,
            url: `/availability/${this.$route.params.id}`,
          }
        )
      }else if (this.$route.name === 'availability-create') {
        links.push(
          {
            title: 'Add availability',
            url: '/availability/create',
          }
        )
      }
      return links
    },
  },
}
</script>
