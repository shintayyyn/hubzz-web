<template>
  <MyPracticeSurgeries :surgeries="[...practice.surgery]" />
</template>
<script>
import MyPracticeSurgeries from "@/components/MyPractice/MyPracticeSurgeries";
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },
  components: {
    MyPracticeSurgeries
  },
  props: ["practice"]
  // ! locum practice surgeries
};
</script>