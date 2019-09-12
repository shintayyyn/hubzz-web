<template>
  <div>
    <div class="shield" v-if="modal"></div>
    <transition name="drop" mode="out-in">
      <div class="remove-confirmation-modal shadow-lg" v-if="modal">
        <div class="border-solid rounded-b-lg bg-yellow-500 py-2 px-4 md:px-24">
          <div class="flex justify-center py-4">
            <svgicon name="alert" height="20" width="20" />
            <div class="text-sm ml-2">{{label}}</div>
          </div>
          <div class="flex justify-center my-2">
            <div class="mx-2">
              <button
                class="button border hover:text-white focus:outline-none text-black font-bold py-2 md:py-5 rounded-lg"
                style="width:100px;"
                @click.prevent="$emit('confirm')"
              >{{confirmLabel}}</button>
            </div>
            <div class="mx-2">
              <button
                class="button border hover:text-white focus:outline-none text-black font-bold py-2 md:py-5 rounded-lg"
                @click.prevent="$emit('cancel')"
                style="width:100px;"
              >{{cancelLabel}}</button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  props: {
    modal: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      required: true
    },
    confirmLabel: {
      type: String,
      required: true
    },
    cancelLabel: {
      type: String,
      required: true
    }
  }
};
</script>
<style scoped>
.button {
  background: linear-gradient(to top, #f2d024, #efde86);
}
.shield {
  z-index: 511;
}
.remove-confirmation-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: auto;
  z-index: 512;
}
</style>
