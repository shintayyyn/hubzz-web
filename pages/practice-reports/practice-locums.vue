<template>
  <div class="report-modal p-4 md:p-8 shadow-lg">
    <div class="page-overlap flex-1 flex flex-col self-end bg-trout">
      <div class="flex justify-between text-sm text-white">
        <nuxt-link to="/reports" class="text-white hover:text-sunglow p-1">
          <svgicon name="arrow-left-solid" height="32" width="32" class="fill-current" />
        </nuxt-link>
      </div>

      <div class="text-lg md:text-2xl text-white">
        Locums Used / Bank
      </div>
  
      <div class="text-sm md:text-lg text-white">
        Rep-005
      </div>

      <div class="flex text-sm text-white">
        <nuxt-link
          to="/reports/practice-locums"
          class="text-white hover:text-sunglow p-1"
          :class="[
            $route.name === 'index-reports-practice-locums' ? 'text-sunglow' : ''
          ]"
        >
          <span class="text-2xl">Table</span>
        </nuxt-link>
        <nuxt-link
          to="/reports/practice-locums/map"
          class="text-white hover:text-sunglow p-1"
          :class="[
            $route.name === 'index-reports-practice-locums-map' ? 'text-sunglow' : ''
          ]"
        >
          <span class="text-2xl">Map</span>
        </nuxt-link>
      </div>

      <nuxt-child />
    </div>
  </div>
</template>
