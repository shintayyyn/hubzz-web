<template>
  <div class="modal shadow-lg">
    <div class="p-8">
      <div @click="$router.push('/compliance')" class="cursor-pointer">
        <svgicon name="left-arrow" height="32" />
      </div>
      <div class="flex flex-col p-4">
        <div class="flex flex-row flex-no-wrap items-center text-lg">
          <a
            @click.prevent="downloadItem(mandatory_training.file.url,mandatory_training.file.filename)"
            class="text-black no-underline flex items-center w-auto hover:bg-yellow-500 rounded-lg cursor-pointer p-2"
          >
            <svgicon
              name="cloud-download"
              width="21"
              height="21"
              color="black"
              hover="transparent black"
              class="inline"
            ></svgicon>
            <span class="mx-1"></span>
            <span>Download</span>
          </a>
        </div>
        <div class="shadow-lg rounded-lg bg-gray-300 mt-5">
          <div class="flex flex-row flex-wrap justify-start p-8">
            <div class="flex flex-col w-full lg:w-1/4">
              <p class="font-bold text-lg">Title</p>
              <p
                class="mt-2 text-sm md:text-base"
              >{{mandatory_training.mandatory_training ? mandatory_training.mandatory_training.name: null}}</p>
              <p class="mt-5 font-bold text-lg">File last uploaded</p>
              <p
                class="mt-2 text-sm md:text-base"
              >{{mandatory_training.file ? $moment(mandatory_training.file.created_at).format('DD/MM/YYYY HH:mm:ss') : null}}</p>
              <div v-if="mandatory_training.status === 'Approved'">
                <p class="mt-5 font-bold text-lg">Expiration Date</p>
                <p
                  class="mt-2 text-sm md:text-base"
                >{{mandatory_training.expired_at ? $moment(mandatory_training.expired_at).format('DD/MM/YYYY HH:mm:ss') : null}}</p>
              </div>
              <div v-if="mandatory_training.status === 'Rejected'">
                <p class="mt-5 font-bold text-lg">Rejected At</p>
                <p
                  class="mt-2 text-sm md:text-base"
                >{{mandatory_training && mandatory_training.rejected_at ? mandatory_training.rejected_at : null }}</p>
                <p class="mt-5 font-bold text-lg">Notes</p>
                <p
                  class="mt-2 text-sm md:text-base"
                >{{mandatory_training && mandatory_training.note ? mandatory_training.note : null}}</p>
              </div>
            </div>
            <div class="w-full pl-0 lg:pl-5 mt-5 lg:mt-0 lg:w-3/4">
              <embed
                class="object-contain object-top"
                width="100%"
                height="auto"
                :class="mandatory_training.file.type == 'image' ? '' : 'document h-full w-full'"
                :src="mandatory_training.file.url"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  async asyncData({ app, params, error }) {
    try {
      const response = await app.$axios.$get(
        `/api/v1/locum/locum-detail-mandatory-trainings/${params.id}`
      );
      let mandatory_training =
        response.data && response.data.locum_detail_mandatory_training
          ? response.data.locum_detail_mandatory_training
          : null;
      console.log(mandatory_training);
      return {
        mandatory_training
      };
    } catch (err) {
      throw err;
    }
  }
};
</script>
<style scoped>
.modal {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  border-left: solid 2px #edf2f7;
  transition: all 0.3s ease-in-out;
  background-color: white;
  z-index: 510;
}
@media screen and (min-width: 1200px) {
  .modal {
    width: 80%;
  }
}
</style>