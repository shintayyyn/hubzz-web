<template>
  <div>
    <div v-if="modal" class="shield" @click.prevent="$emit('cancel')" />
    <transition name="drop" mode="out-in">
      <div v-if="modal" class="flex justify-center remove-confirmation-modal">
        <div
          class="w-full md:w-auto border-solid rounded-b-lg bg-yellow-500 py-2 pt-4 px-4 md:px-24 shadow-lg"
        >
          <div class="flex justify-center">
            <svgicon v-if="status" class="mr-1" :name="status" height="20" width="20" />
            <div class="text-sm md:text-base font-bold">
              {{ label }}
            </div>
          </div>
          <div class="flex justify-center">
            <div class="text-sm md:text-base font-bold">
              {{ label2 }}
            </div>
          </div>
          <div class="flex justify-center">
            <div class="text-sm md:text-base font-bold">
              {{ label3 }}
            </div>
          </div>
          <div v-if="loading" class="flex justify-center">
            <svgicon v-if="loading" name="loader" width="60" height="60" />
          </div>
          <div v-if="!loading" class="flex justify-center my-2 mt-4">
            <div class="mx-2">
              <button
                class="button border hover:text-white focus:outline-none text-black font-bold py-2 px-2 rounded-lg"
                style="min-width:120px;"
                :disabled="loading"
                @click.prevent="$emit('confirm')"
              >
                {{ confirmLabel }}
              </button>
            </div>
            <div v-if="cancelLabel" class="mx-2">
              <button
                class="button border hover:text-white focus:outline-none text-black font-bold py-2 px-2 rounded-lg"
                style="min-width:120px;"
                :disabled="loading"
                @click.prevent="$emit('cancel')"
              >
                {{ cancelLabel }}
              </button>
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
      default: false,
    },
    status: {
      type: String,
      default: "alert",
    },
    label: {
      type: String,
      required: true,
    },
    label2: {
      type: String,
    },
    label3: {
      type: String,
    },
    confirmLabel: {
      type: String,
    },
    cancelLabel: {
      type: String,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
<style scoped>
.button {
	background: linear-gradient(to top, #f2d024, #efde86);
}

.button:hover {
	background: linear-gradient(to top, #ebc91f, #e7d475);
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
	z-index: 601;
}
</style>
