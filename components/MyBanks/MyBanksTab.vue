<template>
  <div>
    <div class="flex flex-wrap overflow-hidden">
      <div class="w-2/3 overflow-hidden">
        <div class="flex flex-row flex-wrap justify-start">
          <div
            style="font-family:Nunito"
            @click.prevent="goTo('favourites')"
            class="mr-5 p-3 text-sm font-bold cursor-pointer"
            :class="$route.query.my_banks_tab === 'favourites' ? 'border rounded-lg border-yellow-400 bg-yellow-400' : 'text-gray-500'"
          >Favourites</div>
          <div
            style="font-family:Nunito"
            @click.prevent="goTo('all')"
            class="mr-5 p-3 text-sm font-bold cursor-pointer"
            :class="$route.query.my_banks_tab === 'all' ? 'border rounded-lg border-yellow-400 bg-yellow-400' : 'text-gray-500'"
          >All</div>
          <div
            style="font-family:Nunito"
            @click.prevent="goTo('appointed')"
            class="mr-5 p-3 text-sm font-bold cursor-pointer"
            :class="$route.query.my_banks_tab === 'appointed' ? 'border rounded-lg border-yellow-400 bg-yellow-400' : 'text-gray-500'"
          >Appointed</div>
          <div
            style="font-family:Nunito"
            @click.prevent="goTo('rejected')"
            class="mr-5 p-3 text-sm font-bold cursor-pointer"
            :class="$route.query.my_banks_tab === 'rejected' ? 'border rounded-lg border-yellow-400 bg-yellow-400' : 'text-gray-500'"
          >Rejected</div>
          <div
            style="font-family:Nunito"
            @click.prevent="goTo('withdrawn')"
            class="mr-5 p-3 text-sm font-bold cursor-pointer"
            :class="$route.query.my_banks_tab === 'withdrawn' ? 'border rounded-lg border-yellow-400 bg-yellow-400' : 'text-gray-500'"
          >Withdrawn</div>
        </div>
      </div>

      <div class="w-1/3 overflow-hidden"></div>
    </div>
  </div>
</template>
<script>
import AppSelect from '@/components/Base/AppSelect'
export default {
  components: {
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


