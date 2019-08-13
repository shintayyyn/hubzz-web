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
      <div class="rounded-lg shadow-lg pt-10 px-5 pb-5" style="font-family:Nunito">
        <div class="font-bold text-xl">FAQs</div>

        <div class="font-bold mt-4 mb-2">Locum</div>
        <div v-for="(item, index) in locum_faqs" :key="`locum-${index}`">
          <div
            class="border border-white border-solid bg-gray-300 p-4 flex justify-between cursor-pointer"
            @click="item.view = !item.view"
          >
            <div>{{item.label}}</div>
            <div class="font-bold text-lg" v-text="item.view ? '^' : '>'"></div>
          </div>
          <transition name="slide-down">
            <div class="p-4 flex justify-start" v-if="item.view" id="content">
              <div class="font-bold text-sm">{{item.value}}</div>
            </div>
          </transition>
        </div>

        <div class="font-bold mt-4 mb-2">Practice</div>
        <div v-for="(item, index) in practice_faqs" :key="`practice-${index}`">
          <div
            class="border border-white border-solid bg-gray-300 p-4 flex justify-between cursor-pointer"
            @click="item.view = !item.view"
          >
            <div>{{item.label}}</div>
            <div class="font-bold text-lg" v-text="item.view ? '^' : '>'"></div>
          </div>
          <transition name="slide-down">
            <div class="p-4 flex justify-start" v-if="item.view" id="content">
              <div class="font-bold text-sm">{{item.value}}</div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
const locum_faqs = [
  {
    label: 'What are the benefits to a Locum',
    value: '(Key selling points and benefits)',
    view: false
  },
  {
    label: 'How to register and get started?',
    value: 'Insert some content here',
    view: false
  },
  {
    label: 'How to see work available if you move area or work away from home for a while?',
    value: 'Availability page',
    view: false
  },
  {
    label: 'How to apply for work?',
    value: '(ensure all compliance docs submitted and approved)',
    view: false
  },
]
const practice_faqs = [
  {
    label: 'What are the benefits to a Practice?',
    value: '(Key selling points and benefits)',
    view: false
  },
  {
    label: 'How to register and get started?',
    value: 'Insert some content here',
    view: false
  },
  {
    label: 'How to advertise work?',
    value: 'Advertise work for Practice',
    view: false
  },
  {
    label: 'What if I need a specialist / language?',
    value: '(to make sure you add that on the profile)',
    view: false
  },
  {
    label: 'Why am I not getting many applicants?',
    value: 'Hourly rate may not be attractive, could be that your Locum request spanned a period of time that is too long eg 4 months, and 1 person did not match that availability. Try breaking it down, 1 month per notification. Request contact with Client Service team to review / pay for our consultancy service!',
    view: false
  },
]
export default {
  data() {
    return {
      locum_faqs,
      practice_faqs
    }
  }
}
</script>
<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.25s ease-out;
}
.slide-down-enter,
.slide-down-leave-to {
  opacity: 0;
}
/* #content {
  border: 1px solid black;
  transition: height .3s ease-in-out;
}
#content:hover {
  display: none;
} */
</style>
