<template>
  <section>
    <div class="mt-10 px-5 overflow-x-auto">
      <div class="border-solid rounded-lg shadow-md p-5 mb-5">
        <div class="flex flex-row flex-no-wrap justify-start text-xs xl:text-base">
          <div class="w-1/4">Your GMC / NMC Number</div>
          <div class="w-1/4 mx-10">{{gmc_or_nmc_number.number}}</div>
          <div class="max-w-xs">
            <div
              class="text-xs xl:text-base text-center bg-orange text-white font-bold rounded-full p-2"
              :class="numberStatusBg(gmc_or_nmc_number.status)"
            >{{gmc_or_nmc_number.status}}</div>
          </div>
        </div>
      </div>
      <div class="border-solid rounded-lg shadow-md p-5 mb-5">
        <div class="flex flex-row flex-no-wrap justify-start text-xs xl:text-base">
          <div class="w-1/4">Your MPL / NPL Number</div>
          <div class="w-1/4 mx-10">{{mpl_or_npl_number.number}}</div>
          <div class="max-w-md">
            <div
              class="text-xs xl:text-base text-center bg-orange text-white font-bold rounded-full p-2"
              :class="numberStatusBg(mpl_or_npl_number.status)"
            >{{mpl_or_npl_number.status}}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-10 px-5">
      <div class="font-bold text-xs xl:text-base ml-4">Documents you need to be approved by hubzz HQ</div>
    </div>
    <div class="px-5 overflow-x-auto overflow-y-hidden">
      <table class="table">
        <thead>
          <tr class="text-xs lg:text-sm text-left">
            <th style="min-width:120px">Type</th>
            <th style="min-width:120px">File</th>
            <th style="min-width:100px">Date uploaded</th>
            <th style="min-width:120px">Expiry date</th>
            <th style="min-width:100px">Status</th>
            <th style="min-width:180px">Note from hubzz HQ</th>
            <th style="min-width:100px"></th>
          </tr>
        </thead>
        <tbody>
          <template v-for="item in mandatory">
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
              <td style="min-width:120px">{{expiryDate(item.id) | localDate}}</td>
              <td style="min-width:100px" class="max-w-xs">
                <div
                  class="text-xs xl:text-base text-center text-white font-bold rounded-full p-2"
                  :class="documentStatusBg(item.id)"
                >{{status(item.id)}}</div>
              </td>
              <td style="min-width:180px">{{note(item.id) | StringMaxLength}}</td>
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
    </div>

    <div class="mt-10 px-5">
      <div
        class="font-bold text-xs xl:text-base ml-4"
      >Other documentation for reference to Practices</div>
    </div>
    <div class="px-5 overflow-x-auto overflow-y-hidden">
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
    </div>
  </section>
</template>
<script>
export default {
  data() {
    return {
      gmc_or_nmc_number: {},
      mpl_or_npl_number: {},
      compliance_documents: [],
      mandatory: [],
      optional: []
    }
  },
  created() {
    // get gmc, mpl status
    this.gmc_or_nmc_number = this.$auth.user.locum_detail.gmc_or_nmc_number
    this.mpl_or_npl_number = this.$auth.user.locum_detail.mpl_or_npl_number
    // get mandatory and optional compliance documents list based on profession category
    this.$axios.$get(`/api/v1/profession-categories`).then(res => {
      let profession = res.data.profession_categories.find(profession => profession.id === this.$auth.user.locum_detail.profession.profession_category.id)
      this.mandatory = profession.mandatory_compliance_documents
      this.optional = profession.optional_compliance_documents
    })
    // get compliance documents status
    this.$axios.$get(`/api/v1/locum/locum-detail-compliance-documents`).then(res => {
      // console.log(res.data.locum_detail_compliance_documents)
      this.compliance_documents = res.data.locum_detail_compliance_documents
    })
  },
  methods: {
    status(id) {
      if (this.compliance_documents.find(document => document.compliance_document.id === id)) {
        return this.compliance_documents.find(document => document.compliance_document.id === id).status
      }
    },
    numberStatusBg(status) {
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
    documentStatusBg(id) {
      if (this.compliance_documents.find(document => document.compliance_document.id === id)) {
        let status = this.compliance_documents.find(document => document.compliance_document.id === id).status
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
      }
    },
    uploadDate(id) {
      if (this.compliance_documents.find(document => document.compliance_document.id === id)) {
        return this.compliance_documents.find(document => document.compliance_document.id === id).file.created_at
      }
    },
    expiryDate(id) {
      if (this.compliance_documents.find(document => document.compliance_document.id === id)) {
        return this.compliance_documents.find(document => document.compliance_document.id === id).expired_at
      }
    },
    note(id) {
      if (this.compliance_documents.find(document => document.compliance_document.id === id)) {
        return this.compliance_documents.find(document => document.compliance_document.id === id).note
      }
    },
    fileUrl(id) {
      if (this.compliance_documents.find(document => document.compliance_document.id === id)) {
        return this.compliance_documents.find(document => document.compliance_document.id === id).file.url
      }
    },
    filename(id) {
      if (this.compliance_documents.find(document => document.compliance_document.id === id)) {
        return this.compliance_documents.find(document => document.compliance_document.id === id).file.filename
      }
    },
    file(id) {
      if (this.compliance_documents.find(document => document.compliance_document.id === id)) {
        return this.compliance_documents.find(document => document.compliance_document.id === id).file
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
        this.compliance_documents.push(res.data.locum_detail_compliance_document)
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'Document uploaded!' })
      })
    },
    onFileUpdate(e, id) {
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
      // put request to API / send file 
      this.$axios.$put(`/api/v1/locum/locum-detail-compliance-documents/${id}`, formData).then(res => {
        this.compliance_documents.push(res.data.locum_detail_compliance_document)
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'Document updated!' })
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
  min-width: 1000px;
}
table thead th {
  padding: 15px;
}
table tbody td {
  padding: 15px;
}
</style>
