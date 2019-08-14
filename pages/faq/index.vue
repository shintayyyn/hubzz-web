<template>
  <section>
    <div class="px-10">
      <div class="flex flex-no-wrap justify-start">
        <div
          style="font-family:Nunito"
          class="p-3 text-sm font-bold cursor-pointer border rounded-lg border-yellow-500 bg-yellow-500"
        >Frequently asked questions</div>
      </div>
    </div>
    <div class="px-10 mt-5">
      <div class="rounded-lg shadow-lg pt-10 px-5 pb-5 mb-10" style="font-family:Nunito">
        <div class="font-bold text-xl">FAQs</div>
        <div>faqs</div>
        <div class="font-bold mt-4 mb-2">Locum</div>
        <div v-for="item in locum_faqs" :key="item.id">
          <div
            class="border border-white border-solid bg-gray-300 p-4 flex justify-between cursor-pointer"
            @click="item.toggled = !item.toggled"
          >
            <div>{{item.question}}</div>
            <div class="font-bold text-lg">
              <svgicon name="arrow-right" height="15" width="15" v-if="!item.toggled" />
              <span v-else class="font-bold text-lg">^</span>
            </div>
          </div>
          <div
            class="flex justify-start item-answer font-bold text-sm overflow-hidden"
            :class="{'toggled': item.toggled}"
          >
            <div class="p-4">{{item.answer}}</div>
          </div>
        </div>

        <div class="font-bold mt-4 mb-2">Practice</div>
        <div v-for="item in practice_faqs" :key="item.id">
          <div
            class="border border-white border-solid bg-gray-300 p-4 flex justify-between cursor-pointer"
            @click="item.toggled = !item.toggled"
          >
            <div>{{item.question}}</div>
            <div class="font-bold text-lg">
              <svgicon name="arrow-right" height="15" width="15" v-if="!item.toggled" />
              <span v-else class="font-bold text-lg">^</span>
            </div>
          </div>
          <div
            class="flex justify-start item-answer font-bold text-sm overflow-hidden"
            :class="{'toggled': item.toggled}"
          >
            <div class="p-4">{{item.answer}}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  async asyncData({ app, route, store, error }) {
    const response = await app.$axios.$get(`/api/v1/faqs`)
    let faqs = response && response.data && response.data.faqs ? response.data.faqs : []
    faqs = faqs.map((faq) => {
      return {
        ...faq,
        'toggled': false
      }
    })
    const locum_faqs = faqs.filter(faq => faq.domain === 'Locum')
    const practice_faqs = faqs.filter(faq => faq.domain === 'Practice')
    return {
      locum_faqs,
      practice_faqs
    }
  },
}
</script>
<style scoped>
.item-answer {
  height: 0;
  transition: all 0.3s ease-in-out;
}
.toggled {
  height: 50px;
}
</style>
