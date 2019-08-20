<template >
  <div class="flex h-full pb-10">
    <div class="p-8 w-full h-full md:max-w-6xl">
      <div class="flex items-center">
        <div @click="$emit('close')" class="cursor-pointer">
          <svgicon name="left-arrow" height="32" />
        </div>
        <div
          class="ml-8 hover:text-black hover:bg-yellow-500 rounded-lg inline-flex p-2 cursor-pointer"
        >
          <a
            @click.prevent="downloadItem(specificComplianceDoc.file.url,specificComplianceDoc.file.filename)"
            class="text-black no-underline flex justify-center px-2"
          >
            <svgicon
              name="cloud-download"
              width="21"
              height="21"
              color="black"
              hover="transparent black"
              class="inline"
            ></svgicon>
            <span class="pl-2">Download</span>
          </a>
        </div>
      </div>

      <div class="flex flex-row justify-start">
        <div class="w-full flex-col shadow-lg rounded-lg bg-gray-300 px-2 md:px-6 mt-10 border">
          <div class="w-full inline-flex flex-col md:flex-row text-sm p-4">
            <div class="m-2 md:mr-20">
              <p class="mr-20 font-semibold">Title</p>
              <p
                class="mt-2 text-base"
              >{{specificComplianceDoc.compliance_document ? specificComplianceDoc.compliance_document.name: null}}</p>
              <p class="mt-5 mr-20 font-semibold">File last uploaded</p>
              <p
                class="mt-2 text-base"
              >{{specificComplianceDoc.file ? $moment(specificComplianceDoc.file.created_at).format('DD/MM/YYYY HH:mm:ss') : null}}</p>
              <div v-if="specificComplianceDoc.status === 'Approved'">
                <p class="mt-5 mr-20 font-semibold">Expiration Date</p>
                <p
                  class="mt-2 text-base"
                >{{specificComplianceDoc.expired_at ? $moment(specificComplianceDoc.expired_at).format('DD/MM/YYYY HH:mm:ss') : null}}</p>
              </div>
              <div v-if="specificComplianceDoc.status === 'Rejected'">
                <p class="mt-5 mr-20 font-semibold">Rejected At</p>
                <p
                  class="mt-2 text-base"
                >{{specificComplianceDoc && specificComplianceDoc.rejected_at ? specificComplianceDoc.rejected_at : null }}</p>
                <p class="mt-5 mr-20 font-semibold">Notes</p>
                <p
                  class="mt-2 text-base"
                >{{specificComplianceDoc && specificComplianceDoc.note ? specificComplianceDoc.note : null}}</p>
              </div>
            </div>
            <div class="flex m-2 w-full">
              <embed
                class="object-contain object-top w-full"
                :class="specificComplianceDoc.file.type == 'image' ? '' : 'document h-full'"
                :src="specificComplianceDoc.file.url"
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
  props: ["specificComplianceDoc"]
};
</script>
<style>
.document {
  min-height: 100%;
}
@media screen and (min-width: 768px) {
  .document {
    min-height: 70vh;
  }
}
</style>