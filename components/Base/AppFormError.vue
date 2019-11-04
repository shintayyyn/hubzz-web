<template>
  <div class="rounded-lg bg-red-400 p-2 text-white text-sm md:text-base">
    <ul v-for="(item, index) in formError" :key="index" class="list-disc list-inside">
      <li>{{(item.message === "Required" ? `${item.field.replace(/_/g, " ").charAt(0).toUpperCase() + item.field.slice(1).replace(/_/g, " ")} is ${item.message}` : item.message.charAt(0).toUpperCase() + item.message.slice(1)).replace(/_/g, " ")}}</li>
      <!-- <li>{{item.message}} on <span class="capitalize">{{item.field.replace(/_/g, " ")}}</span> field</li> -->
    </ul>
  </div>
</template>
<script>
export default {
  props: ['formError'],
}
</script>

