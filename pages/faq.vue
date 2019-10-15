<template>
  <section>
    <div class="lg:px-10">
      <div class="flex flex-no-wrap justify-start">
        <div
          class="p-3 text-sm font-bold border rounded-lg border-yellow-500 bg-yellow-500"
        >Frequently asked questions</div>
      </div>
    </div>
    <div class="lg:px-10 mt-5">
      <div class="rounded-lg shadow-lg pt-10 px-5 pb-5 mb-10">
        <div class="font-bold text-xl">FAQs</div>
        <div class="font-bold mt-4 mb-2">Locum</div>

        <div v-for="item in locum_faqs" :key="item.id">
          <div
            class="border border-white border-solid bg-gray-300 p-4 flex justify-between items-center cursor-pointer"
            @click="item.toggled = !item.toggled"
          >
            <div>{{item.question}}</div>
            <div class="font-bold text-lg">
              <svgicon name="arrow-right" height="15" width="15" v-if="!item.toggled" />
              <svgicon name="arrow-up" height="25" width="25" color="black" v-else />
            </div>
          </div>
          <transition name="drop-down">
            <div
              class="flex justify-start item-answer font-bold text-sm overflow-hidden"
              v-if="item.toggled"
            >
              <div v-html="item.answer" class="w-full px-4 py-2 h-auto"></div>
            </div>
          </transition>
          <!-- <div
            class="flex justify-start item-answer font-bold text-sm overflow-hidden"
            :class="{'toggled': item.toggled}"
          >
            <div v-html="item.answer" class="w-full px-4"></div>
          </div>-->
        </div>

        <div class="font-bold mt-4 mb-2">Practice</div>
        <div v-for="item in practice_faqs" :key="item.id">
          <div
            class="border border-white border-solid bg-gray-300 p-4 flex justify-between items-center cursor-pointer"
            @click="item.toggled = !item.toggled"
          >
            <div>{{item.question}}</div>
            <div class="font-bold text-lg">
              <svgicon name="arrow-right" height="15" width="15" v-if="!item.toggled" />
              <svgicon name="arrow-up" height="25" width="25" color="black" v-else />
            </div>
          </div>
          <transition name="drop-down">
            <div
              class="flex justify-start item-answer font-bold text-sm overflow-hidden"
              v-if="item.toggled"
            >
              <div v-html="item.answer" class="w-full px-4 py-2 h-auto"></div>
            </div>
          </transition>
          <!-- <div
            class="flex justify-start item-answer font-bold text-sm overflow-hidden"
            :class="{'toggled': item.toggled}"
          >
            <div v-html="item.answer" class="w-full h-auto px-4"></div>
          </div>-->
        </div>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  async asyncData({ app, route, store, error }) {
    const response = await app.$axios.$get(`/api/v1/faqs`);
    let faqs =
      response && response.data && response.data.faqs ? response.data.faqs : [];
    faqs = faqs.map(faq => {
      return {
        ...faq,
        toggled: false
      };
    });
    const locum_faqs = faqs.filter(faq => faq.domain === "Locum");
    locum_faqs[0].answer =
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
    const practice_faqs = faqs.filter(faq => faq.domain === "Practice");
    return {
      locum_faqs,
      practice_faqs
    };
  }
};
</script>
<style scoped>
.item-answer {
  word-wrap: break-word;
  height: auto;
  /* transition: all 0.3s ease-in-out; */
}
.toggled {
  height: auto;
}
</style>
