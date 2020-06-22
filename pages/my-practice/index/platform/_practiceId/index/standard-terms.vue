<template>
  <div>
    <span class="text-lg font-bold">Standard Terms</span>
    <!-- <div class="w-full lg:w-2/3 mt-2">
      <embed
        class="object-contain object-top w-full document h-full"
        src="http://www.africau.edu/images/default/sample.pdf"
      />
    </div> -->
  </div>
</template>
<script>
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  }
};
</script>
<style>
.document {
  min-height: 50vh;
}

@media screen and (min-width: 768px) {
  .document {
    min-height: 70vh;
  }
}
</style>