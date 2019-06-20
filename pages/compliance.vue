<template>
  <section class="compliance-section">
    <div class="overflow-x-auto">
      <div class="number-status mt-10">
        <div class="border-solid rounded-lg shadow-md p-5 mb-5">
          <div class="flex flex-row flex-nowrap justify-start text-xs sm:text-sm">
            <div class="w-1/3 p-1 text-left">Your GMC / NMC Number</div>
            <div class="w-1/3 p-1 text-left">{{gmc_or_nmc_number.number}}</div>
            <div class="max-w-xs p-1">
              <div
                class="text-xs sm:text-sm text-center bg-orange text-white font-bold rounded-full px-2 py-1"
                :class="status(gmc_or_nmc_number.status)"
              >{{gmc_or_nmc_number.status}}</div>
            </div>
          </div>
        </div>
        <div class="border-solid rounded-lg shadow-md p-5 mb-5">
          <div class="flex flex-row flex-nowrap justify-start text-xs sm:text-sm">
            <div class="w-1/3 p-1 text-left">Your MPL / NPL Number</div>
            <div class="w-1/3 p-1 text-left">{{mpl_or_npl_number.number}}</div>
            <div class="max-w-xs p-1">
              <div
                class="text-xs sm:text-sm text-center bg-orange text-white font-bold rounded-full px-2 py-1"
                :class="status(mpl_or_npl_number.status)"
              >{{mpl_or_npl_number.status}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-10">
      <div class="font-bold text-xs sm:text-base">Documents you need to be approved by hubzz HQ</div>
    </div>

    <div class="mt-4 overflow-x-auto">
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
                      :href="item.info.file.url"
                      :download="item.info.file.filename"
                      target="_blank"
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
                  class="text-xs sm:text-sm text-center text-white font-bold rounded-full px-2 py-1"
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

    <div class="mt-4 overflow-x-auto">
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
              <td></td>
              <td></td>
              <td></td>
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
  </section>
</template>
<script>
export default {
  data() {
    return {
      gmc_or_nmc_number: {},
      mpl_or_npl_number: {},
      profession: {},
    }
  },
  computed: {
    mandatory() {
      return this.$store.state.compliance.mandatory
    },
    optional() {
      return this.$store.state.compliance.optional
    },
  },
  created() {
    // get gmc, mpl status
    this.gmc_or_nmc_number = this.$auth.user.locum_detail.gmc_or_nmc_number
    this.mpl_or_npl_number = this.$auth.user.locum_detail.mpl_or_npl_number
    // get all compliance documents list based on profession category
    this.$axios.$get(`/api/v1/profession-categories`).then(res => {
      this.profession = res.data.profession_categories.find(profession => profession.id === this.$auth.user.locum_detail.profession.profession_category.id)
      this.setComplianceDocuments()
    })
  },
  methods: {
    // set mandatory and optional
    setComplianceDocuments() {
      if (this.$auth.user.locum_detail.compliance_documents.length > 0) {
        this.$auth.user.locum_detail.compliance_documents.forEach(userComplianceDocument => {
          this.profession.mandatory_compliance_documents.forEach(mandatoryDocument => {
            if (userComplianceDocument.compliance_document.id === mandatoryDocument.id) {
              mandatoryDocument.info = userComplianceDocument
            }
          })
          this.profession.optional_compliance_documents.forEach(optionalDocument => {
            if (userComplianceDocument.compliance_document.id === optionalDocument.id) {
              optionalDocument.info = userComplianceDocument
            }
          })
        })
      }
      console.log(this.profession.mandatory_compliance_documents)
      this.$store.commit('compliance/SET_MANDATORY', this.profession.mandatory_compliance_documents)
      this.$store.commit('compliance/SET_OPTIONAL', this.profession.optional_compliance_documents)
      // this.compliance_documents = [...this.profession.mandatory_compliance_documents, ...this.profession.optional_compliance_documents]
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
        let uploadFile = this.compliance_documents.find(document => document.id === res.data.locum_detail_compliance_document.compliance_document.id)
        uploadFile.info = res.data.locum_detail_compliance_document
        console.log(uploadFile)
        this.setComplianceDocuments()
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
        this.$store.commit('compliance/UPDATE_MANDATORY', res.data.locum_detail_compliance_document)
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'Document updated!' })
      }).catch(err => {
        console.log(err)
      })
    },
  }
}
</script>
<style scoped>
.number-status {
  width: 920px;
}
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
