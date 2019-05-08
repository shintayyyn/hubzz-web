<template>
  <section>
    <div class="mt-10 px-5">
      <div class="border-solid rounded-lg shadow-md p-5 mb-5">
        <div class="flex flex-row flex-no-wrap justify-start text-xs xl:text-base">
          <div class="w-1/4">Your GMC / NMC Number</div>
          <div class="w-1/4 mx-10">{{form.gmc_or_nmc_number.value}}</div>
          <div class="max-w-xs">
            <div
              class="text-xs xl:text-base text-center bg-orange text-white font-bold rounded-full p-2"
            >{{form.gmc_or_nmc_number.status}}</div>
          </div>
        </div>
      </div>
      <div class="border-solid rounded-lg shadow-md p-5 mb-5">
        <div class="flex flex-row flex-no-wrap justify-start text-xs xl:text-base">
          <div class="w-1/4">Your MPL / NPL Number</div>
          <div class="w-1/4 mx-10">{{form.mpl_or_npl_number.value}}</div>
          <div class="max-w-md">
            <div
              class="text-xs xl:text-base text-center bg-orange text-white font-bold rounded-full p-2"
            >{{form.mpl_or_npl_number.status}}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-10 px-5">
      <div class="font-bold text-xs xl:text-base ml-4">Documents you need to be approved by hubzz HQ</div>
      <div class="flex flex-row flex-no-wrap justify-start text-xs xl:text-base p-5">
        <div class="w-1/3 sm:w-1/6">Type</div>
        <div class="hidden sm:w-1/6 sm:block">Date uploaded</div>
        <div class="hidden sm:w-1/6 sm:block">Expiry date</div>
        <div class="w-1/3 sm:w-1/6">Status</div>
        <div class="hidden sm:w-1/6 sm:block">Note from hubzz HQ</div>
        <div class="w-1/3 sm:w-1/6">File</div>
      </div>
      <UploadFile v-for="(item, index) in mainDocuments" :item="item" :key="`${item.id}-${index}`"/>
    </div>

    <div class="mt-10 px-5">
      <div
        class="font-bold text-xs xl:text-base ml-4"
      >Other documentation for reference to Practices</div>
      <div class="flex flex-row flex-no-wrap justify-start text-xs xl:text-base p-5">
        <div class="w-1/2 sm:w-1/3">Type</div>
        <div class="hidden sm:w-1/3 sm:block">Date uploaded</div>
        <div class="w-1/2 sm:w-1/3">File</div>
      </div>
      <OtherUploadFile
        v-for="(item, index) in otherDocuments"
        :key="`${item.id}-${index}`"
        :item="item"
      />
    </div>
  </section>
</template>
<script>
import UploadFile from '@/components/Compliance/UploadFile'
import OtherUploadFile from '@/components/Compliance/OtherUploadFile'
export default {
  components: {
    UploadFile,
    OtherUploadFile
  },
  data() {
    return {
      form: {
        gmc_or_nmc_number: {
          value: '', status: 'Pending', name: '', note: '', file: null
        },
        mpl_or_npl_number: {
          value: '', status: 'Pending', name: '', note: '', file: null
        }
      },
      formError: []
    }
  },
  computed: {
    mainDocuments() {
      return this.$store.getters['compliance/mainDocuments']
    },
    otherDocuments() {
      return this.$store.getters['compliance/otherDocuments']
    }
  },
  created() {
    this.$store.dispatch('compliance/getComplianceDocuments')
    this.form.gmc_or_nmc_number.value = this.$auth.user.locum_detail.gmc_or_nmc_number
    this.form.mpl_or_npl_number.value = this.$auth.user.locum_detail.mpl_or_npl_number
  }
}
</script>
