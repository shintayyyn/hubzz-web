<template>
  <div
    v-if="crumbs.length"
    class="flex items-center py-2 text-sm"
    :class="fixed && 'fixed top-0 mt-3 z-40 ml-10 xl:ml-0'"
  >
    <div
      v-for="(link, index) in crumbs"
      :key="index"
      class="flex items-center"
      :class="[!isLast(index) ? 'text-gray-600' : '', link.class]"
    >
      <p :class="crumbClass(index)" @click="onClickHandler(link.to, index)">
        {{ link.text }}
      </p>
      <svgicon
        v-if="!isLast(index)"
        name="arrow-right"
        width="10"
        class="fill-current"
      />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    fixed: {
      type: Boolean,
      default: true
    }
  },

  computed: {
    crumbs() {
      const segments = this.$route.path.split("/").filter(Boolean);

      return segments.reduce((breadcrumbs, segment, index) => {
        let text = segment.includes("-") ? segment.replace(/-/g, " ") : segment;
        text = text.replace(/(^\w{1})|(\s{1}\w{1})/g, word =>
          word.toUpperCase()
        );

        const prevCrumb = breadcrumbs[index - 1];
        const to = prevCrumb
          ? `${
            prevCrumb.to.endsWith("/") ? prevCrumb.to : prevCrumb.to + "/"
          }${segment}`
          : "/" + segment;

        breadcrumbs.push({ path: segment, to, text });

        return breadcrumbs;
      }, []);
    }
  },

  methods: {
    isLast(index) {
      return index === this.crumbs.length - 1;
    },
    crumbClass(index) {
      if (this.isLast(index)) {
        return "text-gray-700 pl-1";
      }
      return `cursor-pointer hover:text-blue-500 ${
        index === 0 ? "pr-1" : "px-1"
      }`;
    },
    onClickHandler(url, index) {
      if (!this.isLast(index)) {
        this.$router.push(url);
      }
    }
  }
};
</script>
