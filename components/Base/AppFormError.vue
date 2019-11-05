<template>
  <div class="text-white text-sm">
    <ul v-for="(item, index) in formError" :key="index">
      <transition name="drop" mode="out-in">
        <li class="pl-2 bg-red-200 mb-2 py-1 border border-red-400 text-red-600 rounded flex items-center">
          <svgicon name="exclamation-mark" class="w-4 h-4 mx-2 fill-current" />
          {{(item.message === "Required" ? `${item.field.replace(/_/g, " ").charAt(0).toUpperCase() + item.field.slice(1).replace(/_/g, " ")} is ${item.message}` : item.message.charAt(0).toUpperCase() + item.message.slice(1)).replace(/_/g, " ")}}
        </li>
      </transition>
    </ul>
  </div>
</template>
<script>
export default {
  props: ['formError'],
}
</script>

