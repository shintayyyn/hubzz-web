<template>
  <button
    :disabled="disabled"
    class="default-btn rounded-md px-2 py-1 focus:outline-none transition-hover text-sm "
    :class="[
      disabled ? 'disabled-button' : '',
      inClass,
      customTheme ? customTheme : 'button border-2',
      badge && icon ? 'flex items-center justify-between' : '',
      icon ? 'flex items-center' : ''
    ]"
    :style="inStyle"
    @click.prevent="$emit('click')"
  >
    <p :class="icon ? 'flex items-center' : 'text-center'">
      <svgicon
        v-if="icon"
        :name="icon"
        width="14"
        class="fill-current py-1"
      /> <span :class="icon ? 'hidden md:block ml-2' : 'mx-2'">{{ label }}</span>
    </p>

    <span v-if="badge" class="ml-2 md:ml-6 bg-red-600 font-bold text-xs text-white px-1 h-5 flex items-center justify-center">{{ badge > 99 ? '99+' : badge }}</span>

    <!-- <svgicon
      v-if="label.includes('Filter') || label.includes('Sort')"
      name="sort"
      class="h-full w-3 ml-2 fill-current"
    /> -->
  </button>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: "Save",
    },

    icon: {
      type: String,
    },

    badge: {
      type: [String, Number,],
    },

    inClass: {
      type: String,
      default: null,
    },

    inStyle: {
      type: String,
      default: null,
    },

    disabled: {
      type: Boolean,
      default: false,
    },

    customTheme: {
      type: String,
      default: null,
    },
  },
}
</script>

<style >
  .button {
    /* background: linear-gradient(to top, #f2d024, #efde86); */
  }

  .bg-warning {
    background: #f9a423;
  }
  .bg-info {
    background: #16e3c8;
  }

  .bg-info:hover,
  .bg-info:focus {
    background: #0fbea7;
    /* background: linear-gradient(to top, #e6c520, #f1d130); */
  }

  .bg-warning:hover,
  .bg-warning:focus {
    background: #eb9a1f;
    /* background: linear-gradient(to top, #e6c520, #f1d130); */
  }

  .button:hover,
  .button:focus {
    background: #f8f8f8;
    /* background: linear-gradient(to top, #e6c520, #f1d130); */
  }

  .default-btn {
    border-radius: 6px;
  }
  
  .default-btn:hover {
    transform: translate(1px, 1px);
  }

  .default-btn:active {
    transform: translate(2px, 2px);
  }

  .disabled-button {
    color: #9e9e9e;
    background: #ddd;
    /* background: linear-gradient(to top, #ccc, #ddd); */
    cursor: not-allowed;
  }

  .disabled-button:hover {
    transform: translate(0, 0);
    background: #ddd;
    /* background: linear-gradient(to top, #ccc, #ddd); */
  }

  /* @media (min-width: 720px) {
    .default {
      min-width: 150px;
    }
  } */
</style>

