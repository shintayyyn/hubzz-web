<template>
  <section class="h-full w-full flex jusitify-center items-center">
    <div :style="`width: 120px;`">
      <AppTime
        v-model="apptime"
        :wrapperClass="'mb-1 py-1'"
        :inStyle="`
        background-color: transparent;
      `"
      />
    </div>
  </section>
</template>

<script>
import AppTime from "@/components/Base/AppTime"

export default {
  layout: "auth",

  components: {
    AppTime,
  },

  data () {
    return {
      apptime: "",
    }
  },
}
</script>
