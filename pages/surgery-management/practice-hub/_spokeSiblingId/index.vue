<template>
  <div class="p-4">
    <div class="flex flex-row flex-wrap justify-start">
      <div class="w-full md:w-1/3 lg:w-1/4 p-2" v-for="locum in locums" :key="locum.id">
        <div class="h-full rounded-lg shadow-lg bg-gray-300 hover:bg-gray-400 p-4">
          <nuxt-link :to="{ path: `/my-banks/${locum.id}`, query: {...$route.query}}">
            <div
              class="flex justify-end z-50"
              v-if="authPermissions.includes('Favorite MyBanks Locum')"
            >
              <template v-if="locum.is_favorite">
                <svgicon
                  name="on-star"
                  height="32"
                  width="32"
                  class="cursor-pointer fill-current text-gray-700 hover:text-gray-800"
                  @click.prevent.stop="favorite(locum.id)"
                />
              </template>
              <template v-else>
                <svgicon
                  name="off-star"
                  height="32"
                  width="32"
                  class="cursor-pointer fill-current text-gray-700 hover:text-gray-800"
                  @click.prevent.stop="favorite(locum.id)"
                />
              </template>
            </div>

            <div class="flex flex-wrap text-center mt-4 cursor-pointer">
              <div class="w-full flex justify-center">
                <AppAvatar
                  :src="locum.avatar && locum.avatar.file && locum.avatar.file.url ? locum.avatar.file.url : ''"
                />
              </div>

              <div
                class="w-full font-bold text-sm sm:text-lg my-4 leading-tight"
              >{{locum.personal_detail.name}}</div>
              <div
                class="w-full mb-4 font-bold text-gray-700 text-sm leading-tight"
              >{{locum.locum_detail.profession.name}}</div>
            </div>
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppAvatar from "@/components/Base/AppAvatar";
export default {
  components:{
    AppAvatar
  },
  data(){
    return{
      locums:[],
    }
  },
  computed: {
    authPermissions() {
      return this.$store.getters["auth/permissions"];
    }
  },
  async asyncData({app, route, store}) {
    try{
      let response = await app.$axios.$get(`/api/v1/practice/locums`)
      const locums = response.data.users
      return{
        locums
      }
    }catch(err){
      console.log('get locum error!', err)
    }
    
  },  
  methods:{
    
  }
}
</script>

<style>

</style>