<template>
  <MyPracticeProfile :practice="practice" />
</template>
<script>
import MyPracticeProfile from "@/components/MyPractice/MyPracticeProfile";
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },
  components: {
    MyPracticeProfile
  },
  props: ["practice"]
};
</script>