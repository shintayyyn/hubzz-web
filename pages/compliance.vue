<template>
  <section>
    <div class="mt-10 px-5">
      <div class="border-solid rounded-lg shadow-md p-5 mb-5">
        <div class="flex flex-row flex-wrap justify-start">
          <div style="width:25%;">Your GMC / NMC Number</div>
          <div style="width:5%;" class="mx-10">{{form.gmc_nmc_number.value}}</div>
          <div style="width:10%;">
            <div
              class="text-center bg-orange text-white text-sm font-bold rounded-full py-2"
            >{{form.gmc_nmc_number.status}}</div>
          </div>
        </div>
      </div>
      <div class="border-solid rounded-lg shadow-md p-5 mb-5">
        <div class="flex flex-row flex-wrap justify-start">
          <div style="width:25%;">Your MPL / NPL Number</div>
          <div style="width:5%;" class="mx-10">{{form.mpl_npl_number.value}}</div>
          <div style="width:10%;">
            <div
              class="text-center bg-orange text-white text-sm font-bold rounded-full py-2"
            >{{form.mpl_npl_number.status}}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-10 px-5">
      <div class="font-bold text-sm ml-4">Documents you need to be approved by hubzz HQ</div>
      <div class="flex flex-row p-5">
        <div class="text-sm" style="width:10%">Type</div>
        <div class="text-sm" style="width:15%">Date uploaded</div>
        <div class="text-sm" style="width:15%">Expiry date</div>
        <div class="text-sm" style="width:10%">Status</div>
        <div class="text-sm" style="width:30%">Note from hubzz HQ</div>
        <div class="text-sm" style="width:10%">File</div>
        <div class="text-sm text-right" style="width:10%"></div>
      </div>
      <UploadFile
        v-for="(item, index) in approvedDocuments"
        :key="`${item}-${index}`"
        :title="item"
      />
    </div>

    <div class="mt-10 px-5">
      <div class="font-bold text-sm ml-4">Other documentation for reference to Practices</div>
      <div class="flex flex-row p-5">
        <div class="text-sm" style="width:10%">Type</div>
        <div class="text-sm" style="width:15%">Date uploaded</div>
        <div class="text-sm" style="width:55%"></div>
        <div class="text-sm" style="width:10%">File</div>
        <div class="text-sm text-right" style="width:10%"></div>
      </div>
      <OtherUploadFile
        v-for="(item, index) in otherDocuments"
        :key="`${item}-${index}`"
        :title="item"
      />
    </div>
  </section>
</template>
<script>
import UploadFile from '@/components/Compliance/UploadFile'
import OtherUploadFile from '@/components/Compliance/OtherUploadFile'
const approvedDocuments = [
  'Passport', 'Medical Indemnity Insurance Certificate',
  'Basic Life Support Certificate', 'DBS Certificate'
]
const otherDocuments = [
  'NMC Number confirmation', 'Enchanced DBS check dated within 3 years', 'Nurse Qualification',
  'Safeguarding Children & Adults - Minimum level 2', 'Safeguarding Children & Adults - Minimum level 3',
  'Hep B', 'Complaints Handling', 'Conflict Resolution', 'COSHH (Control of Substances Hazardous to Health regulation)',
  'Dementia Awareness', 'Epilepsy Awareness', 'Equality, Diversity and Human Rights', 'Fire Safety',
  'General Data Protection Regulations (GDPR)', 'Handling Medication & Avoiding Drug Errors', 'Handling Violence & Aggression',
  'Health, Safety and Welfare', 'Infection Prevention and Control', 'Information Governance, Record Keeping and Caldicott Protocols',
  'Training for workers in a lone environment', 'Management of Anaphylaxis', 'Manual Handling', 'Mental Capacity Act 2005',
  'Mental Health Act 2007', 'Preventing Radicalisation	', 'RIDDOR (Reporting of Injuries, Diseases & Dangerous Occurrences Regulations)',
  'Sepsis Awareness'
]
export default {
  components: {
    UploadFile,
    OtherUploadFile
  },
  data() {
    return {
      approvedDocuments,
      otherDocuments,
      form: {
        gmc_nmc_number: {
          value: 123, status: 'Pending', name: '', note: '', file: null
        },
        mpl_npl_number: {
          value: 123, status: 'Pending', name: '', note: '', file: null
        }
      },
      formError: []
    }
  },
  methods: {
    onFileInput(e, data) {
      console.log(e.target.files[0])
      let name = e.target.files[0].name
      // if (e.target.files[0].type !== 'application/pdf') {
      //   return
      // }
      // Send file to API
      this.form[data].file = e.target.files[0]
      // Get response
      this.form[data].date = new Date
      this.form[data].name = name
      this.form[data].note = 'notes from HQ'
      this.form[data].status = 'Pending'

    }
  }
}
</script>
