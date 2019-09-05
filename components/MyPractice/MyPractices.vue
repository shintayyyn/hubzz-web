<template>
  <div class="flex flex-row flex-wrap justify-start">
    <div
      class="w-full md:w-1/3 lg:w-1/4 rounded-lg shadow-lg bg-gray-300 m-2 p-4 hover:bg-gray-500"
      v-for="(practice, index) in practices"
      :key="practice.id"
    >
      <div class="flex justify-end z-50">
        <template v-if="practice.is_favorite">
          <svgicon
            name="on-star"
            height="32"
            width="32"
            class="cursor-pointer"
            @click="$emit('unfavorite', {practiceId: practice.id, index: index})"
          />
        </template>
        <template v-else>
          <svgicon
            name="off-star"
            height="32"
            width="32"
            class="cursor-pointer"
            @click="$emit('favorite', {practiceId: practice.id, index: index})"
          />
        </template>
      </div>

      <div
        class="flex flex-wrap text-center mt-4 cursor-pointer"
        @click="$emit('show', practice.id)"
      >
        <div class="w-full flex justify-center">
          <div class="relative flex justify-center">
            <AppAvatar
              :height="'150px'"
              :width="'150px'"
              :src="practice.user && practice.user.avatar && practice.user.avatar.file && practice.user.avatar.file.url ? practice.user.avatar.file.url : ''"
            />
          </div>
        </div>

        <div class="w-full font-bold text-sm sm:text-lg my-4">{{practice.surgery.name}}</div>
        <div
          class="w-full mb-4 font-bold text-gray-600 text-sm sm:text-lg"
        >{{practice.surgery.address.line_1}} {{practice.surgery.address.line_2}} {{practice.surgery.address.line_3}} {{practice.surgery.address.post_code}}</div>
      </div>
    </div>
  </div>
</template>
<script>
import AppAvatar from "@/components/Base/AppAvatar";
export default {
  props: ["practices"],
  components: {
    AppAvatar
  }
};
</script>