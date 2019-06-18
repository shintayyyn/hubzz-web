<template>
  <section class="compliance-section overflow-x-auto">
    <div class="mt-10 px-1">
      <div class="border-solid rounded-lg shadow-md p-5 mb-5">
        <div class="flex flex-row flex-wrap justify-start text-xs sm:text-sm">
          <div class="w-full p-1 text-left sm:w-1/3">Your GMC / NMC Number</div>
          <div class="w-full p-1 text-left sm:w-1/3 sm:text-center">{{gmc_or_nmc_number.number}}</div>
          <div class="max-w-xs p-1 text-left sm:text-right">
            <div
              class="text-xs sm:text-sm text-center bg-orange text-white font-bold rounded-full px-2 py-1"
              :class="status(gmc_or_nmc_number.status)"
            >{{gmc_or_nmc_number.status}}</div>
          </div>
        </div>
      </div>
      <div class="border-solid rounded-lg shadow-md p-5 mb-5">
        <div class="flex flex-row flex-wrap justify-start text-xs sm:text-sm">
          <div class="w-full p-1 text-left sm:w-1/3">Your MPL / NPL Number</div>
          <div class="w-full p-1 text-left sm:w-1/3 sm:text-center">{{mpl_or_npl_number.number}}</div>
          <div class="max-w-xs p-1 text-left sm:text-right">
            <div
              class="text-xs sm:text-sm text-center bg-orange text-white font-bold rounded-full px-2 py-1"
              :class="status(mpl_or_npl_number.status)"
            >{{mpl_or_npl_number.status}}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-10">
      <div class="font-bold text-xs sm:text-base">Documents you need to be approved by hubzz HQ</div>
    </div>

    <div class="mt-4">
      <table>
        <thead>
          <tr class="text-xs sm:text-sm text-left">
            <th>Type</th>
            <th>File</th>
            <th>Date uploaded</th>
            <th>Expiry date</th>
            <th>Status</th>
            <th>Note from hubzz HQ</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(item, index) in mandatory">
            <tr
              :key="item.id"
              class="rounded-lg shadow-md hover:bg-grey-light cursor-pointer text-xs sm:text-sm text-left"
            >
              <td>{{item.name}}</td>
              <td class="hover:underline" v-if="item.info">
                <div class="flex flex-row flex-nowrap">
                  <svgicon name="cloud-download" height="24" width="24"/>
                  <div class="leading-loose mx-2">
                    <a
                      target="_blank"
                      :href="item.info.file.url"
                    >{{item.info.file.filename | StringMaxLength(15)}}</a>
                  </div>
                </div>
              </td>
              <td v-else></td>
              <td v-if="item.info">{{item.info.file.created_at | localDate}}</td>
              <td v-else></td>
              <td v-if="item.info">{{item.info.expired_at | localDate}}</td>
              <td v-else></td>
              <td class="max-w-xs" v-if="item.info">
                <div
                  class="text-xs xl:text-base text-center text-white font-bold rounded-full p-2"
                  :class="status(item.info.status)"
                >{{item.info.status}}</div>
              </td>
              <td v-else></td>

              <td v-if="item.info">{{item.info.note | StringMaxLength}}</td>
              <td v-else></td>
              <td class="hover:underline" v-if="!item.info">
                <div class="flex flex-row flex-nowrap">
                  <input
                    type="file"
                    :name="`${item.id}_file`"
                    :id="`${item.id}_file`"
                    class="inputfile hidden"
                    @input="onFileInput($event, item.id)"
                  >
                  <svgicon name="cloud-upload" height="24" width="24"/>
                  <label :for="`${item.id}_file`" class="leading-loose mx-2 cursor-pointer">Upload</label>
                </div>
              </td>
              <td class="hover:underline" v-else>
                <div class="flex flex-row flex-nowrap">
                  <input
                    type="file"
                    :name="`${item.id}_file`"
                    :id="`${item.id}_file`"
                    class="inputfile hidden"
                    @input="onFileUpdate($event, item.info.id, index)"
                  >
                  <svgicon name="cloud-upload" height="24" width="24"/>
                  <label :for="`${item.id}_file`" class="leading-loose mx-2 cursor-pointer">Update</label>
                </div>
              </td>
            </tr>
            <tr :key="`${item.id}-tr`">
              <td></td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <div class="mt-10">
      <div class="font-bold text-xs sm:text-base">Other documentation for reference to Practices</div>
    </div>

    <!-- <div class="mt-4">
      <table>
        <thead>
          <tr class="text-xs sm:text-sm text-left">
            <th>Type</th>
            <th>File</th>
            <th>Date uploaded</th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(item, index) in optional">
            <tr
              :key="item.id"
              class="rounded-lg shadow-md hover:bg-grey-light cursor-pointer text-xs sm:text-sm text-left"
            >
              <td>{{item.name}}</td>
              <td class="hover:underline" v-if="fileUrl(item.id)">
                <div class="flex flex-row flex-nowrap">
                  <svgicon name="cloud-download" height="24" width="24"/>
                  <div class="leading-loose mx-2">
                    <a
                      target="_blank"
                      :href="fileUrl(item.id)"
                    >{{filename(item.id) | StringMaxLength(15)}}</a>
                  </div>
                </div>
              </td>
              <td v-else></td>

              <td>{{uploadDate(item.id) | localDate}}</td>
              <td></td>
              <td></td>

              <td></td>
              <td class="hover:underline" v-if="!filename(item.id)">
                <div class="flex flex-row flex-nowrap">
                  <input
                    type="file"
                    :name="`${item.id}_file`"
                    :id="`${item.id}_file`"
                    class="inputfile hidden"
                    @input="onFileInput($event, item.id)"
                  >
                  <svgicon name="cloud-upload" height="24" width="24"/>
                  <label :for="`${item.id}_file`" class="leading-loose mx-2 cursor-pointer">Upload</label>
                </div>
              </td>
              <td class="hover:underline" v-else>
                <div class="flex flex-row flex-nowrap">
                  <input
                    type="file"
                    :name="`${item.id}_file`"
                    :id="`${item.id}_file`"
                    class="inputfile hidden"
                    @input="onFileUpdate($event, item.id, index)"
                  >
                  <svgicon name="cloud-upload" height="24" width="24"/>
                  <label :for="`${item.id}_file`" class="leading-loose mx-2 cursor-pointer">Update</label>
                </div>
              </td>
            </tr>
            <tr :key="`${item.id}-tr`">
              <td></td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>-->

    <!-- <div class="px-5 overflow-x-auto overflow-y-hidden">
      <table class="table">
        <thead>
          <tr class="text-xs lg:text-sm text-left">
            <th style="min-width:120px">Type</th>
            <th style="min-width:120px">File</th>
            <th style="min-width:100px">Date uploaded</th>
            <th style="min-width:120px"></th>
            <th style="min-width:100px"></th>
            <th style="min-width:180px"></th>
            <th style="min-width:100px"></th>
          </tr>
        </thead>
        <tbody>
          <template v-for="item in optional">
            <tr
              :key="item.id"
              class="shadow-md hover:bg-grey-light cursor-pointer text-xs lg:text-sm"
            >
              <td style="min-width:120px">{{item.name}}</td>
              <td
                style="min-width:120px"
                class="hover:underline cursor-pointer"
                v-if="fileUrl(item.id)"
              >
                <div class="flex flex-row flex-nowrap">
                  <svgicon name="cloud-download" height="24" width="24"/>
                  <div class="leading-loose mx-2">
                    <a
                      target="_blank"
                      :href="fileUrl(item.id)"
                    >{{filename(item.id) | StringMaxLength(15)}}</a>
                  </div>
                </div>
              </td>
              <td v-else style="min-width:120px"></td>
              <td style="min-width:100px">{{uploadDate(item.id) | localDate}}</td>
              <td style="min-width:120px"></td>
              <td style="min-width:100px"></td>
              <td style="min-width:180px"></td>
              <td style="min-width:100px" class="hover:underline" v-if="!filename(item.id)">
                <div class="flex flex-row flex-nowrap">
                  <input
                    type="file"
                    :name="`${item.id}_file`"
                    :id="`${item.id}_file`"
                    class="inputfile hidden"
                    @input="onFileInput($event, item.id)"
                  >
                  <svgicon name="cloud-upload" height="24" width="24"/>
                  <label :for="`${item.id}_file`" class="leading-loose mx-2 cursor-pointer">Upload</label>
                </div>
              </td>
              <td style="min-width:100px" v-else>
                <div class="flex flex-row flex-nowrap">
                  <input
                    type="file"
                    :name="`${item.id}_file`"
                    :id="`${item.id}_file`"
                    class="inputfile hidden"
                    @input="onFileUpdate($event, item.id)"
                  >
                  <svgicon name="cloud-upload" height="24" width="24"/>
                  <label :for="`${item.id}_file`" class="leading-loose mx-2 cursor-pointer">Update</label>
                </div>
              </td>
            </tr>
            <tr>
              <td></td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>-->
  </section>
</template>
<script>
export default {
  data() {
    return {
      gmc_or_nmc_number: {},
      mpl_or_npl_number: {},
      compliance_documents: [],
      // mandatory: [],
      // optional: [],
      //test
      profession: {}
    }
  },
  created() {
    // get gmc, mpl status
    this.gmc_or_nmc_number = this.$auth.user.locum_detail.gmc_or_nmc_number
    this.mpl_or_npl_number = this.$auth.user.locum_detail.mpl_or_npl_number
    // get mandatory and optional compliance documents list based on profession category
    this.$axios.$get(`/api/v1/profession-categories`).then(res => {
      this.profession = res.data.profession_categories.find(profession => profession.id === this.$auth.user.locum_detail.profession.profession_category.id)
      // console.log('mandatory', this.mandatory)
      // console.log('optional', this.optional)
      console.log('auth', this.profession)
      this.setComplianceDocuments()
    })

  },
  computed: {
    mandatory() {
      return this.profession.mandatory_compliance_documents
    }
  },
  methods: {
    setComplianceDocuments() {
      if (this.$auth.user.locum_detail.compliance_documents.length > 0) {
        this.$auth.user.locum_detail.compliance_documents.forEach(userComplianceDocument => {
          this.profession.mandatory_compliance_documents.forEach(mandatoryDocument => {
            if (userComplianceDocument.compliance_document.id === mandatoryDocument.id) {
              let info = {
                expired_at: userComplianceDocument.expired_at,
                file: userComplianceDocument.file,
                id: userComplianceDocument.id,
                rejected: userComplianceDocument.rejected,
                status: userComplianceDocument.status,
                verified_at: userComplianceDocument.verified_at,
              }
              mandatoryDocument.info = info
            }
          })
          this.profession.optional_compliance_documents.forEach(optionalDocument => {
            if (userComplianceDocument.compliance_document.id === optionalDocument.id) {
              let info2 = {
                expired_at: userComplianceDocument.expired_at,
                file: userComplianceDocument.file,
                id: userComplianceDocument.id,
                rejected: userComplianceDocument.rejected,
                status: userComplianceDocument.status,
                verified_at: userComplianceDocument.verified_at,
              }
              optionalDocument.info = info2
            }
          })
        })
      }
    },
    status(status) {
      switch (status) {
        case 'Pending':
          return 'bg-orange'
          break;
        case 'Verified':
          return 'bg-green'
          break;
        case 'Rejected':
          return 'bg-red-light'
          break;
        default:
          return
      }
    },
    onFileInput(e, id) {
      if (!e.target.files.length) {
        return
      }
      let types = ['pdf', 'jpeg', 'msword', 'tif']
      let file = e.target.files[0]
      let fileType = file.type.split('/')[1]
      if (!types.includes(fileType)) {
        return
      }
      const formData = new FormData()
      formData.append('file', file)
      formData.append('compliance_document_id', id)
      // post request to API / send file 
      this.$axios.$post(`/api/v1/locum/locum-detail-compliance-documents`, formData).then(res => {
        console.log(res)
        this.compliance_documents.push(res.data.locum_detail_compliance_document)
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'Document uploaded!' })
      })
    },
    onFileUpdate(e, id, index) {
      if (!e.target.files.length) {
        return
      }
      let types = ['pdf', 'jpeg', 'msword', 'tif']
      let file = e.target.files[0]
      let fileType = file.type.split('/')[1]
      if (!types.includes(fileType)) {
        return
      }
      const formData = new FormData()
      formData.append('file', file)
      this.$axios.$put(`/api/v1/locum/locum-detail-compliance-documents/${id}`, formData).then(res => {
        let index = this.$auth.user.locum_detail.compliance_documents.findIndex(item => item.id === res.data.locum_detail_compliance_document.id)
        this.$auth.fetchUser().then(res => {
          console.log(res)
        })
        // this.$auth.user.locum_detail.compliance_documents.splice(index, 1)

        // this.$auth.user.locum_detail.compliance_documents.push(res.data.locum_detail_compliance_document)
        // this.$auth.user
        // let inMandatory = this.profession.mandatory_compliance_documents.find(mandatory => mandatory.info.id === res.data.locum_detail_compliance_document.compliance_document.id)
        // console.log(inMandatory)

        // this.compliance_documents = this.compliance_documents.filter(item => item.id !== res.data.locum_detail_compliance_document.id)
        // this.compliance_documents.push(res.data.locum_detail_compliance_document)
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'Document updated!' })
      }).catch(err => {
        console.log(err.response)
      })
    },
  }
}
</script>
<style scoped>
a {
  text-decoration: none;
  color: black;
}
table {
  width: 920px;
}
table thead th {
  padding: 15px;
}
table tbody td {
  padding: 15px;
}
</style>
