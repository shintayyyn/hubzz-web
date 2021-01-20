<template>
  <section>
    <div class="flex flex-no-wrap justify-start border-b border-sunglow">
      <div
        class="px-3 py-2 text-sm font-bold border-b-4 border-sunglow"
      >
        Frequently asked questions
      </div>
    </div>
    <div class="mt-2 md:mt-5">
      <div class="bg-white rounded-lg shadow-lg md:pt-10 px-5 py-5 mb-10">
        <div class="font-bold text-xl">
          FAQs
        </div>
        
        <div v-if="$auth.user.domain === 'Locum'">
          <div class="font-bold mt-4 mb-2">
            Locum
          </div>
          <div v-for="item in locum_faqs" :key="item.id">
            <div
              class="border border-white border-solid bg-gray-300 hover:bg-gray-400 transition-hover py-2 px-4 md:py-4 flex justify-between items-center cursor-pointer"
              @click="item.toggled = !item.toggled"
            >
              <div>{{ item.question }}</div>
              <div>
                <svgicon
                  name="arrow-right"
                  height="15"
                  width="15"
                  :class="item.toggled ? 'rotate' : 'arrow'"
                />
              </div>
            </div>
            <transition name="drop-down" mode="out-in">
              <div v-if="item.toggled">
                <no-ssr>
                  <quill-editor class="border-none" :options="options" :content="item.answer" disabled />
                </no-ssr>
              </div>
            </transition>
          </div>
        </div>
				
        <div v-if="$auth.user.domain === 'Practice'">
          <div class="font-bold mt-4 mb-2">
            Practice
          </div>
          <div v-for="item in practice_faqs" :key="item.id">
            <div
              class="border border-white border-solid bg-gray-300 hover:bg-gray-400 transition-hover py-2 px-4 md:py-4 flex justify-between items-center cursor-pointer"
              @click="item.toggled = !item.toggled"
            >
              <div>{{ item.question }}</div>
              <div>
                <svgicon
                  name="arrow-right"
                  height="15"
                  width="15"
                  :class="item.toggled ? 'rotate' : 'arrow'"
                />
              </div>
            </div>
            <transition name="drop-down" mode="out-in">
              <div v-if="item.toggled">
                <no-ssr>
                  <quill-editor class="border-none" :options="options" :content="item.answer" disabled />
                </no-ssr>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  data () {
    return {
      locum_faqs: [],
      practice_faqs: [],
      options: {
        modules: {
          toolbar: null,
        },
      },
    }
  },
  async asyncData ({ app, }) {
    const response = await app.$axios.$get(`/api/v1/faqs`)

    let faqs
			= response && response.data && response.data.faqs ? response.data.faqs : []

    faqs = faqs.map(faq => {
      return {
        ...faq,
        toggled: false,
      }
    })

    const locum_faqs = faqs.filter(faq => faq.domain === "Locum")

    // locum_faqs[0].answer
    // 	= "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    
    const practice_faqs = faqs.filter(faq => faq.domain === "Practice")

    return {
      locum_faqs,
      practice_faqs,
    }
  },
}
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
.rotate {
	transform: rotate(90deg);
	transition: transform 0.3s ease-in-out;
}

.arrow {
	transform: rotate(0deg);
	transition: transform 0.3s ease-in-out;
}
</style>
