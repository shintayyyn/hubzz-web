<template>
  <section>
    <div class="flex flex-no-wrap justify-start border-b border-sunglow">
      <div class="px-3 py-2 text-sm font-bold border-b-4 border-sunglow">
        Frequently asked questions
      </div>
    </div>
    <div class="mt-2 md:mt-5">
      <div class="bg-white rounded-lg border px-5 py-5">
        <div class="font-bold text-xl">
          FAQs
        </div>
        <div>
          <AppInput
            v-model="search"
            :type="'text'"
            :name="'search'"
            :label="'Search'"
          />
        </div>

        <div>
          <div class="font-bold mt-4 mb-2">
            {{ $auth.user.domain }}
          </div>
          <div v-for="item in faqs" :key="item.id">
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
                  <quill-editor
                    class="border-none"
                    :options="options"
                    :content="item.answer"
                    disabled
                  />
                </no-ssr>
              </div>
            </transition>
          </div>
        </div>

        <!-- <div v-if="$auth.user.domain === 'Practice'">
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
        </div> -->
      </div>
    </div>
  </section>
</template>
<script>
import AppInput from "@/components/Base/AppInput";
import debounce from "lodash.debounce";
export default {
  components: {
    AppInput
  },
  data() {
    return {
      search: "",
      faqs: [],
      locum_faqs: [],
      practice_faqs: [],
      options: {
        modules: {
          toolbar: null
        }
      }
    };
  },

  watch: {
    search(value) {
      this.searchSubmit(value);
    }
  },

  created() {
    this.getFaqs();
  },

  methods: {
    async getFaqs(search) {
      const params = {
        search: search,
        domain: this.$auth.user.domain
      };
      await this.$axios
        .$get(`/api/v1/faqs`, {
          cache: true,
          params
        })
        .then(res => {
          this.faqs = res.data.faqs.map(faq => {
            return {
              ...faq,
              toggled: false
            };
          });
        });
    },

    searchSubmit: debounce(function(value) {
      console.log("is it working?");
      this.getFaqs(value);
    }, 500)
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
.rotate {
  transform: rotate(90deg);
  transition: transform 0.3s ease-in-out;
}

.arrow {
  transform: rotate(0deg);
  transition: transform 0.3s ease-in-out;
}
</style>
