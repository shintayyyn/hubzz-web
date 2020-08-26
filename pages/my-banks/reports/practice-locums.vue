<template>
  <div class="report-modal p-4 md:p-8 shadow-lg">
    <div class="page-overlap flex-1 flex flex-col self-end bg-trout">
      <div class="flex justify-between text-sm">
        <nuxt-link :to="{ name: 'my-banks-reports'}" class=" hover:text-sunglow p-1">
          <svgicon name="left-arrow" height="32" width="32" class="fill-current" />
        </nuxt-link>
      </div>

      <div class="text-lg md:text-2xl ">
        Locums Used / Bank
      </div>
  
      <div class="text-sm md:text-lg ">
        Rep-005
      </div>

      <div v-if="false" class="flex text-sm">
        <nuxt-link
          to="/my-banks/reports/practice-locums"
          class=" hover:text-sunglow p-1"
          :class="[
            $route.name === 'index-my-banks-reports-practice-locums' ? 'text-sunglow' : ''
          ]"
        >
          <span class="text-2xl">Table</span>
        </nuxt-link>

        <nuxt-link
          to="/my-banks/reports/practice-locums/map"
          class=" hover:text-sunglow p-1"
          :class="[
            $route.name === 'index-my-banks-reports-practice-locums-map' ? 'text-sunglow' : ''
          ]"
        >
          <span class="text-2xl">Map</span>
        </nuxt-link>
      </div>

      <nuxt-child />
    </div>
  </div>
</template>
