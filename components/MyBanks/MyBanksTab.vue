<template>
<div>
 <div class="flex flex-wrap overflow-hidden">

    <div class="w-2/3 overflow-hidden">
      <div class="flex flex-row flex-wrap justify-start">
        <div
          style="font-family:Nunito"
          @click.prevent="goTo('favourites')"
          class="mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query.my_banks_tab === 'favourites' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
        >Favourites</div>
        <div
          style="font-family:Nunito"
          @click.prevent="goTo('all')"
          class="mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query.my_banks_tab === 'all' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
        >All</div>
        <div
          style="font-family:Nunito"
          @click.prevent="goTo('appointed')"
          class="mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query.my_banks_tab === 'appointed' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
        >Appointed</div>
        <div
          style="font-family:Nunito"
          @click.prevent="goTo('rejected')"
          class="mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query.my_banks_tab === 'rejected' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
        >Rejected</div>
        <div
          style="font-family:Nunito"
          @click.prevent="goTo('withdrawn')"
          class="mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query.my_banks_tab === 'withdrawn' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
        >Withdrawn</div>
      </div>
    </div>

    <div class="w-1/3 overflow-hidden">
      <div>
         <AppSelect
        :name="'Filter Locums by'"
        :label="'Filter Locums by'"
        :items="[ 
        {value: 1, label: 'GP'}, 
        {value: 2, label: 'Nurse | Advanced Nurse Practitioners (ANP)'}, 
        {value: 3, label: 'Nurse | Emergency Nurse Practitioners (ENP)'},
        {value: 4, label: 'Nurse | Nurse Practitioners'},
        {value: 5, label: 'Nurse | Practice Nurses'},
        {value: 6, label: 'Paramedic | Paramedic Practitioner'},
        {value: 7, label: 'Paramedic | Urgent Care Practitioner'},
        {value: 8, label: 'Paramedic | Emergency Care Practitioner'}, ]"
      />
      </div>
     
    </div>
  </div>
</div>
 
</template>
<script>
import AppSelect from '@/components/Base/AppSelect'
export default {
  components:{
    AppSelect
  },
  methods: {
    goTo(type) {
      const query = {
        ...this.$route.query,
        my_banks_tab: type
      }
      this.$router.push({ query })
    }
  }
}
</script>


