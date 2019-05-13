<template>
  <div class="relative flex flex-col">
    <label for="title" class="text-xs xl:text-sm mb-4">{{label}}</label>
    <input
      :type="type"
      :ref="field"
      class="py-4 font-bold text-xs xl:text-sm border-b-2 focus:outline-none focus:border-yellow"
      :class="formError.find(item => item.field === 'field') ? 'border-red':''"
      @focus="''"
      @blur="''"
      v-model="form.title"
      :placeholder="placeholder"
    >
    <span
      class="absolute pin-r bg-red text-white p-1 text-xs xl:text-base"
      v-if="formError.find(item => item.field === 'field')"
    >{{formError.find(item => item.field === 'field').message}}</span>
  </div>
</template>
<script>
export default {
  props: {
    label: String,
    type: String,
    field: String,
    placeholder: String
  }

}
</script>
