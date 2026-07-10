<template>
  <div
    v-if="crumbs.length"
    class="flex items-center py-2 text-sm flex-nowrap flex-shrink-0 whitespace-nowrap overflow-x-auto"
    :class="fixed && 'fixed top-0 mt-3 z-40 ml-10 xl:ml-0'"
  >
    <div
      v-for="(item, index) in crumbs"
      :key="index"
      class="flex items-center flex-shrink-0 whitespace-nowrap"
      :class="item.classes"
    >
      <span v-if="index > 0" class="font-bold text-gray-500 mx-2">
        <svgicon name="arrow-right" width="9" class="fill-current" />
      </span>

      <div
        class="text-gray-700 whitespace-nowrap"
        :class="item.clickable ? 'hover:text-blue-500 cursor-pointer' : ''"
        @click="item.clickable && $router.push(item.to)"
      >
        {{ item.text }}
      </div>
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
      if (
        this.$route.name ===
        "index-survey-survey-questions-surveyQuestionId-edit"
      ) {
        return [
          {
            text: "Survey",
            to: { name: "index-survey" },
            clickable: true
          },
          {
            text: "Edit Questionnaire",
            to: null,
            clickable: false
          }
        ];
      }

      if (this.$route.name === "index-messages-create-practice-practiceId") {
        return [
          {
            text: "Messages",
            to: { name: "index-messages" },
            clickable: true
          },
          {
            text: "Create",
            to: null,
            clickable: false
          }
        ];
      }

      const routeMatched = this.$route.path.split("/");
      routeMatched.shift();

      let to = "";
      const toArray = [];

      routeMatched.forEach(item => {
        to += `/${item}`;
        toArray.push(to);
      });

      const routeParams = Object.values(this.$route.params).map(String);

      const breadcrumbs = routeMatched.reduce(
        (breadcrumbArray, path, index) => {
          if (!this.$route.matched[index]) {
            return breadcrumbArray;
          }

          const isParam = routeParams.includes(String(path));

          const nextPath = routeMatched[index + 1];
          const nextIsParam = routeParams.includes(String(nextPath));

          const hasConnectedChild =
            !!nextPath && !nextIsParam && index !== routeMatched.length - 1;

          let text = this.$route.matched[index].meta.breadCrumb || path;

          text = text.replace(/-/g, " ");
          text = text.replace(/(^\w{1})|(\s{1}\w{1})/g, word =>
            word.toUpperCase()
          );

          const itemTo = toArray[index];

          const forceClickableFirst = index === 0 && routeMatched.length > 1;

          const forceClickableId =
            isParam && index === 1 && routeMatched.length >= 3;

          const resolved =
            !isParam && !hasConnectedChild
              ? this.$router.resolve(itemTo)
              : null;

          const clickable =
            forceClickableFirst ||
            forceClickableId ||
            (!isParam &&
              !hasConnectedChild &&
              !!resolved?.route?.name &&
              index !== routeMatched.length - 1);
          breadcrumbArray.push({
            path,
            text,
            to: clickable
              ? itemTo
              : isParam || hasConnectedChild
                ? null
                : itemTo,
            clickable
          });

          return breadcrumbArray;
        },
        []
      );

      return breadcrumbs.filter(item => item.text !== "");
    }
  }
};
</script>
