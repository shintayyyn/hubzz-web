<template>
  <div>
    <div class="p-8 max-w-3xl">
      <div @click="$emit('close')" class="cursor-pointer">
        <svgicon name="left-arrow" height="32" />
      </div>
      <div class="ml-8 hover:text-black hover:bg-yellow-500 rounded-lg inline-flex p-2">
        <a
          @click.prevent="downloadItem(specificMandatoryTraining.file.url,specificMandatoryTraining.file.filename)"
          class="text-black no-underline"
        >
          <svgicon
            name="cloud-download"
            width="21"
            height="21"
            color="black"
            hover="transparent black"
          ></svgicon>
          <span>Download</span>
        </a>
      </div>
      <div class="flex flex-row justify-start">
        <div class="flex-col shadow-lg rounded-lg bg-gray-300 mx-6 mt-10">
          <div class="inline-flex text-sm m-4">
            <div class="m-2 mr-20">
              <p class="mr-20 font-semibold">Title</p>
              <p
                class="mt-2 text-base"
              >{{specificMandatoryTraining.mandatory_training ? specificMandatoryTraining.mandatory_training.name: null}}</p>
              <p class="mt-5 mr-20 font-semibold">File last uploaded</p>
              <p
                class="mt-2 text-base"
              >{{specificMandatoryTraining.file ? $moment(specificMandatoryTraining.file.created_at).format('DD/MM/YYYY HH:mm:ss') : null}}</p>
              <div v-if="specificMandatoryTraining.status === 'Approved'">
                <p class="mt-5 mr-20 font-semibold">Expiration Date</p>
                <p
                  class="mt-2 text-base"
                >{{specificMandatoryTraining.expired_at ? $moment(specificMandatoryTraining.expired_at).format('DD/MM/YYYY HH:mm:ss') : null}}</p>
              </div>
              <div v-if="specificMandatoryTraining.status === 'Rejected'">
                <p class="mt-5 mr-20 font-semibold">Rejected At</p>
                <p
                  class="mt-2 text-base"
                >{{specificMandatoryTraining && specificMandatoryTraining.rejected_at ? specificMandatoryTraining.rejected_at : null }}</p>
                <p class="mt-5 mr-20 font-semibold">Notes</p>
                <p
                  class="mt-2 text-base"
                >{{specificMandatoryTraining && specificMandatoryTraining.note ? specificMandatoryTraining.note : null}}</p>
              </div>
            </div>
            <div class="flex m-2">
              <embed width="800px" height="600px" :src="specificMandatoryTraining.file.url" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['specificMandatoryTraining'],

}
</script>
