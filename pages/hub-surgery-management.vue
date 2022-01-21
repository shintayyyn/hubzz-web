<template>
  <section>
    <AppBreadcrumbs :links="links" v-if="!['hub-surgery-management-index', 'hub-surgery-management-invitations-spoke', 'hub-surgery-management-invitations-hub'].includes($route.name)"/> 
    <div v-if="!$route.params.id && !$route.params.invoiceId && !$route.params.jobId && !['hub-surgery-management-invitations-hub-create'].includes($route.name)" class="flex overflow-x-auto border-b border-sunglow">
      <nuxt-link
        :to="`/hub-surgery-management`"
        class="md:mr-3 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="
          $route.name === 'hub-surgery-management-index' || $route.name.includes('hub-surgery-management-id')
            ? 'border-b-4 border-sunglow'
            : 'text-gray-600'
        "
      >
        My Spokes
      </nuxt-link>

      <nuxt-link
        v-if="authPermissions && authPermissions.includes('Invitation Processes Surgery Management')"
        :to="{ name: 'hub-surgery-management-invitations-spoke'}"
        class="md:mr-3 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="
          $route.name.includes('hub-surgery-management-invitations')
            ? 'border-b-4 border-sunglow'
            : 'text-gray-600'
        "
      >
        Invitations
      </nuxt-link>
    </div>

    <!-- <transition name="fade" mode="out-in">
      <div
        v-if="['hub-surgery-management-index-invitationId', 'hub-surgery-management-id', 'hub-surgery-management-index-create'].includes($route.name)
          || $route.name.includes('hub-surgery-management-id')"
        class="shield"
        @click="$router.push('/hub-surgery-management')"
      />
    </transition> -->

    <nuxt-child />
  </section>
</template>
<script>
import AppBreadcrumbs from '@/components/Base/AppBreadcrumbs'
export default {
  components: {
    AppBreadcrumbs
  },
  computed: {
    authPermissions () {
      return this.$store.getters["permissions"]
    },
    links() {
      let links = [
        {
          title: 'Surgery Management',
          url: '/hub-surgery-management'
        },
      ]

      if (this.$route.params.id) {
        links.push({
          title: this.$route.params.id,
          url: `/hub-surgery-management/${this.$route.params.id}`
        })
      }

      switch (this.$route.name) {
        case 'hub-surgery-management-id-surgery-sessions-index':
        case 'hub-surgery-management-id-surgery-sessions-index-sessionId-job-parts-jobPartId':
        case 'hub-surgery-management-id-surgery-sessions-index-sessionId':
          links.push(
            {
              title: 'Surgery Sessions',
              url: `/hub-surgery-management/${this.$route.params.id}/surgery-sessions`
            }, 
            {
              title: `${this.$route.query.jobStatus ? this.$route.query.jobStatus : 'Allocated'} Jobs`,
              url: `/hub-surgery-management/${this.$route.params.id}/surgery-sessions?jobStatus=${this.$route.query.jobStatus}`
            }
          )
          break;
        case 'hub-surgery-management-id-surgery-billings-invoices-from-locums-invoiceId':
        case 'hub-surgery-management-id-surgery-billings-invoices-from-locums':
          links.push(
             {
              title: 'Surgery Billing',
              url: `/hub-surgery-management/${this.$route.params.id}/surgery-billings`
            }, 
            {
              title: 'Invoices from Locums',
              url: `/hub-surgery-management/${this.$route.params.id}/surgery-billings/invoices-from-locums`
            },
            {
              title: `${this.$route.query.status === 'pension-form-a' ? 'NHS ':''}${this.$route.query.status ? this.$route.query.status.replace(/-/g, ' ').replace(/(^\w{1})|(\s{1}\w{1})/g, word => word.toUpperCase()) : 'To be invoiced'}`,
              url: `/hub-surgery-management/${this.$route.params.id}/surgery-billings/invoices-from-locums?status=${this.$route.query.status}`
            }
          )
          break;
        case 'hub-surgery-management-id-surgery-banks':
        case 'hub-surgery-management-id-surgery-banks-locumId':
          links.push(
            {
              title: 'Surgery Banks',
              url: `/hub-surgery-management/${this.$route.params.id}/surgery-banks`
            }, 
          )
          break;
        case 'hub-surgery-management-id-surgery-permanent-jobs-index': 
        case 'hub-surgery-management-id-surgery-permanent-jobs-index-permJobId-locumId': 
        case 'hub-surgery-management-id-surgery-permanent-jobs-index-permJobId': 
        links.push(
          {
            title: 'Surgery Salaried Roles',
            url: `/hub-surgery-management/${this.$route.params.id}/surgery-permanent-jobs`
          },
          {
            title: `${this.$route.query.status ? this.$route.query.status : 'Available'} Jobs`,
            url: `/hub-surgery-management/${this.$route.params.id}/surgery-permanent-jobs/${this.$route.query.status ? '?status='+this.$route.query.status : ''}`
          }
        )
          break;
        case 'hub-surgery-management-id-surgery-billings-invoices-from-hubzz':
          links.push(
             {
              title: 'Surgery Billing',
              url: `/hub-surgery-management/${this.$route.params.id}/surgery-billings`
            }, 
            {
              title: 'Invoices from hubzz',
              url: `/hub-surgery-management/${this.$route.params.id}/surgery-billings/invoices-from-hubzz`
            }
          )
          break;
        case 'hub-surgery-management-invitations-hub-create': 
          links.push(
            {
              title: 'Invitations',
              url: '/hub-surgery-management/invitations/spoke'
            },
            {
              title: 'My Invitations',
              url: '/hub-surgery-management/invitations/hub'
            },
            {
              title: 'Invite',
              url: '/hub-surgery-management/invitations/hub/create'
            }
          )
          break
        default:
          break;
      }

      if (this.$route.params.invoiceId) {
        links.push({
          title: this.$route.params.invoiceId,
          url: `/hub-surgery-management/${this.$route.params.id}/surgery-billings/invoices-from-locums/${this.$route.params.invoiceId}?status=${this.$route.query.status}`
        })
      }
      if (this.$route.params.permJobId) {
        links.push({
          title: this.$route.params.permJobId,
          url: `/hub-surgery-management/${this.$route.params.id}/surgery-permanent-jobs/${this.$route.params.permJobId}${this.$route.query.status ? '?status='+this.$route.query.status : ''}`
        })
      }
      if (this.$route.params.permJobId && this.$route.params.locumId) {
        links.push({
          title: 'Applicants',
          url: `/hub-surgery-management/${this.$route.params.id}/surgery-permanent-jobs/${this.$route.params.permJobId}${this.$route.query.status ? '?status='+this.$route.query.status : ''}`
        },
        {
          title: this.$route.params.locumId,
          url: `/hub-surgery-management/${this.$route.params.id}/surgery-permanent-jobs/${this.$route.params.permJobId}/${this.$route.params.locumId}${this.$route.query.status ? '?status='+this.$route.query.status : ''}`
        })
      }else if (this.$route.params.locumId) {
        links.push({
          title: this.$route.params.locumId,
          url: `/hub-surgery-management/${this.$route.params.id}/surgery-banks/${this.$route.params.locumId}`
        })
      }
      if (this.$route.params.sessionId && this.$route.params.jobPartId) {
        links.push({
          title: this.$route.params.jobPartId,
          url: `/hub-surgery-management/${this.$route.params.id}/surgery-sessions/${this.$route.params.sessionId}/job-parts/${this.$route.params.jobPartId}?jobStatus=${this.$route.query.jobStatus}`
        })
      }
      if (this.$route.params.sessionId && !this.$route.params.jobPartId) {
        links.push({
          title: this.$route.params.sessionId,
          url: `/hub-surgery-management/${this.$route.params.id}/surgery-sessions/${this.$route.params.sessionId}?jobStatus=${this.$route.query.jobStatus}`
        })
      }
      console.log(links)
      return links
    }
  },
   async asyncData ({ app, error, store, }) {
    try{
      let response = await app.$axios.$get(`/api/v1/practice/me/practice`)
      const practice = response.data.practice

      const authPermissions = store.getters["permissions"]

      if (app.$auth.user.domain === 'Practice'
          && authPermissions.includes('View Surgery Management') === false
          && authPermissions.includes('View Surgery Sessions') === false
          && authPermissions.includes('View Surgery Billings') === false
          && authPermissions.includes('View Surgery Banks') === false
          && authPermissions.includes('View Surgery Permanent Jobs') === false) {
        error({
          statusCode: 403,
          message: 'You are not authorized to view this page.',
        })
        return
      }

      if (practice.status !== 'Active' && practice.status !== 'Dormant') {
        error({
          statusCode: 403,
          message: 'This function is unavailable on inactive practice.',
        })

        return
      }
      if (practice.type !== 'Hub') {
        error({
          statusCode: 403,
          message: 'This function is unavailable on this practice.',
        })

        return
      }
    } catch (err){
      error({ statusCode: 404, })
      store.commit("SET_NOTIFICATION", {
        enabled: true,
        status: "danger",
        text: "Something went wrong!",
      })
      console.log("get parent practice error!!", err)
    }
    // return
  },
}
</script>



