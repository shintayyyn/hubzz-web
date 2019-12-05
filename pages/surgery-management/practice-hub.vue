<template>
<div>
  <div class="flex overflow-x-auto">
    <nuxt-link
      :to="`/surgery-management/practice-hub`"
      class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
      :class="
        $route.name.includes('surgery-management-practice-hub')
          ? 'border rounded-lg border-yellow-500 bg-yellow-500'
          : 'text-gray-600'
      "
      >My Hub
    </nuxt-link>
    <nuxt-link
      v-if="myPractice.share_banks_to_other_surgeries === true"
      :to="`/surgery-management/practice-hub/spoke-siblings`"
      class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
      :class="
        $route.name.includes(
          'surgery-management-practice-hub-id-surgery-sessions'
        ) || $route.name === 'surgery-management-practice-hub-spoke-siblings'
          ? 'border rounded-lg border-yellow-500 bg-yellow-500'
          : 'text-gray-600'"
      >My Spoke Siblings
    </nuxt-link>
  </div>
  <transition name="fade" mode="out-in">
    <div
      class="shield"
      v-if="
        [
          'surgery-management-practice-hub-spoke-siblings-id',
          'surgery-management-practice-hub-invitationId',
          'surgery-management-practice-hub-spoke-siblings-id-sibling-bank-locumId'
        ].includes($route.name)
      "
      @click="$router.go(-1)"
    ></div>
  </transition>
  <nuxt-child/>
</div>
</template>

<script>
export default {
  data(){
    return{
      myPractice: '',
    }
  },
  async asyncData({app, route, store}) {
    try{  
      let response = await app.$axios.$get(`/api/v1/practice/me/practice`)
      const myPractice = response.data.practice
      console.log(myPractice)
      return{
        myPractice
      }
    }catch(err){
      console.log('something went wrong', err)
    }
  },
  methods:{

  }

}
</script>

<style>
.shield {
	/* z-index: 509; */
}
</style>