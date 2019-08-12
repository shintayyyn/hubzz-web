<template>
  <section>
    <div class="rate-shield" :class="{'hidden': !modal}" @click="modal=false"></div>
    <div class="flex flex-col py-2 cursor-pointer" @click="modal = true">
      <label :for="name" class="text-xs sm:text-sm py-1">{{label}}</label>
      <div
        class="absolute mt-12 bg-red-300 p-1 text-xs sm:text-sm text-white"
        v-if="error"
      >{{error.message}}</div>
      <div class="flex flex-row justify-start mt-1">
        <div class="text-xs sm:text-sm">From £{{value.min}} - to £{{value.max}}</div>
      </div>
    </div>
    <div v-if="modal" class="modal rounded-lg bg-white shadow-lg p-4 max-w-sm">
      <div class="flex flex-col">
        <label :for="value.min">Min</label>
        <input
          :value="value.min"
          :name="value.min"
          @input="$emit('input', { min: $event.target.value, max: value.max})"
          type="text"
          class="border-b-2 focus:border-yellow-300 focus:outline-none py-2 font-bold text-xs sm:text-sm text-right mb-4"
        />
        <label :for="value.max">Max</label>
        <input
          :value="value.max"
          :name="value.max"
          @input="$emit('input', { min: value.min, max: $event.target.value})"
          type="text"
          class="border-b-2 focus:border-yellow-300 focus:outline-none py-2 font-bold text-xs sm:text-sm text-right mb-4"
        />
        <!-- <button
          class="rounded-lg bg-yellow-400 font-bold text-xs sm:text-sm px-2 py-1 focus:outline-none hover:text-white cursor-pointer"
          @click.prevent="save"
        >Save</button>-->
      </div>
    </div>
  </section>
</template>
<script>
import AppButton from "@/components/Base/AppButton";
export default {
  components: {
    AppButton
  },
  data() {
    return {
      modal: false
    };
  },
  props: {
    value: Object,
    name: String,
    label: String,
    error: Object
  }
};
</script>
<style scoped>
.modal {
  position: fixed;
  top: 50%;
  z-index: 2;
  min-height: 100px;
  overflow: hidden;
  box-sizing: content-box;
}
.rate-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 1;
}
</style>

