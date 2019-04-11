<template>
  <section>
    <div class="mt-10 px-5">
      <div class="border-solid rounded-lg shadow-md p-5 mb-5">
        <div class="flex flex-row flex-wrap justify-start">
          <div style="width:25%;">Your GMC / NMC Number</div>
          <div style="width:5%;" class="mx-10">{{form.gmc_nmc_number.value}}</div>
          <div style="width:10%;">
            <div class="text-center bg-orange text-white text-sm font-bold rounded-full py-2">
              {{form.gmc_nmc_number.status}}
            </div>
          </div>
        </div>
      </div>
      <div class="border-solid rounded-lg shadow-md p-5 mb-5">
        <div class="flex flex-row flex-wrap justify-start">
          <div style="width:25%;">Your MPL / NPL Number</div>
          <div style="width:5%;" class="mx-10">{{form.mpl_npl_number.value}}</div>
          <div style="width:10%;">
            <div class="text-center bg-orange text-white text-sm font-bold rounded-full py-2">
              {{form.mpl_npl_number.status}}
            </div>
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
      <div class="border-solid rounded-lg shadow-md p-5 mb-5">
        <div class="flex flex-row flex-wrap justify-start">
          <div class="text-sm px-1" style="width:10%">Passport</div>
          <div class="text-sm px-1" style="width:15%">{{form.passport.date | localDate }}</div>
          <div class="text-sm px-1" style="width:15%"></div>
          <div style="width:10%;">
            <div class="text-center text-sm font-bold rounded-full px-1 py-2" :class="{ 'bg-orange text-white' : form.passport.status === 'Pending', 'border border-black bg-white text-black' : form.passport.status === 'Empty'}">
              {{form.passport.status}}
            </div>
          </div>
          <div class="text-sm px-1" style="width:30%">{{form.passport.note}}</div>
          <div class="text-sm px-1" style="width:10%">{{form.passport.name.length > 10 ? `${form.passport.name.substring(0, 10)}..` : form.passport.name}}</div>
          <div class="text-sm px-1 text-right" style="width:10%">
            <input type="file" name="passport_file" id="passport_file" class="inputfile hidden" @input="onFileInput($event, 'passport')" />
            <label for="passport_file" class="cursor-pointer">Upload</label>
          </div>
        </div>
      </div>
      <div class="border-solid rounded-lg shadow-md p-5 mb-5">
        <div class="flex flex-row flex-wrap justify-start">
          <div class="text-sm px-1" style="width:10%">Medical Indemnity insurance certificate</div>
          <div class="text-sm px-1" style="width:15%">{{form.medical_indemnity_insurance_cerfiticate.date | localDate}}</div>
          <div class="text-sm px-1" style="width:15%"></div>
          <div style="width:10%;">
            <div class="text-center text-sm font-bold rounded-full px-1 py-2" :class="{ 'bg-orange text-white' : form.medical_indemnity_insurance_cerfiticate.status === 'Pending', 'border border-black bg-white text-black' : form.medical_indemnity_insurance_cerfiticate.status === 'Empty'}">
              {{form.medical_indemnity_insurance_cerfiticate.status}}
            </div>
          </div>
          <div class="text-sm px-1" style="width:30%">{{form.medical_indemnity_insurance_cerfiticate.note}}</div>
          <div class="text-sm px-1" style="width:10%">{{form.medical_indemnity_insurance_cerfiticate.name.length > 10 ? `${form.medical_indemnity_insurance_cerfiticate.name.substring(0, 10)}..` : form.medical_indemnity_insurance_cerfiticate.name}}</div>
          <div class="text-sm px-1 text-right" style="width:10%">
            <input type="file" name="medical_indemnity_insurance_cerfiticate_file" id="medical_indemnity_insurance_cerfiticate_file" class="inputfile hidden" @input="onFileInput($event, 'medical_indemnity_insurance_cerfiticate')" />
            <label for="medical_indemnity_insurance_cerfiticate_file" class="cursor-pointer">Upload</label>
          </div>
        </div>
      </div>
      <div class="border-solid rounded-lg shadow-md p-5 mb-5">
        <div class="flex flex-row flex-wrap justify-start">
          <div class="text-sm px-1" style="width:10%">Basic Life support certificate</div>
          <div class="text-sm px-1" style="width:15%">{{form.basic_life_support_certificate.date | localDate}}</div>
          <div class="text-sm px-1" style="width:15%"></div>
          <div style="width:10%;">
            <div class="text-center text-sm font-bold rounded-full px-1 py-2" :class="{ 'bg-orange text-white' : form.basic_life_support_certificate.status === 'Pending', 'border border-black bg-white text-black' : form.basic_life_support_certificate.status === 'Empty'}">
              {{form.basic_life_support_certificate.status}}
            </div>
          </div>
          <div class="text-sm px-1" style="width:30%">{{form.basic_life_support_certificate.note}}</div>
          <div class="text-sm px-1" style="width:10%">{{form.basic_life_support_certificate.name.length > 10 ? `${form.basic_life_support_certificate.name.substring(0, 10)}..` : form.basic_life_support_certificate.name}}</div>
          <div class="text-sm px-1 text-right" style="width:10%">
            <input type="file" name="basic_life_support_certificate_file" id="basic_life_support_certificate_file" class="inputfile hidden" @input="onFileInput($event, 'basic_life_support_certificate')" />
            <label for="basic_life_support_certificate_file" class="cursor-pointer">Upload</label>
          </div>
        </div>
      </div>
      <div class="border-solid rounded-lg shadow-md p-5 mb-5">
        <div class="flex flex-row flex-wrap justify-start">
          <div class="text-sm px-1" style="width:10%">DBS Certificate</div>
          <div class="text-sm px-1" style="width:15%">{{form.dbs_certificate.date | localDate}}</div>
          <div class="text-sm px-1" style="width:15%"></div>
          <div style="width:10%;">
            <div class="text-center text-sm font-bold rounded-full px-1 py-2" :class="{ 'bg-orange text-white' : form.dbs_certificate.status === 'Pending', 'border border-black bg-white text-black' : form.dbs_certificate.status === 'Empty'}">
              {{form.dbs_certificate.status}}
            </div>
          </div>
          <div class="text-sm px-1" style="width:30%">{{form.dbs_certificate.note}}</div>
          <div class="text-sm px-1" style="width:10%">{{form.dbs_certificate.name.length > 10 ? `${form.dbs_certificate.name.substring(0, 10)}..` : form.dbs_certificate.name}}</div>
          <div class="text-sm px-1 text-right" style="width:10%">
            <input type="file" name="dbs_certificate_file" id="dbs_certificate_file" class="inputfile hidden" @input="onFileInput($event, 'dbs_certificate')" />
            <label for="dbs_certificate_file" class="cursor-pointer">Upload</label>
          </div>
        </div>
      </div>
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
       <div class="border-solid rounded-lg shadow-md p-5 mb-5">
        <div class="flex flex-row flex-wrap justify-start">
          <div class="text-sm px-1" style="width:10%">NMC Number confirmation</div>
          <div class="text-sm px-1" style="width:15%">{{form.nmc_number_confirmation.date | localDate}}</div>
          <div class="text-sm px-1" style="width:55%"></div>
          <div class="text-sm px-1" style="width:10%">{{form.nmc_number_confirmation.name | StringMaxLength(10)}}</div>
          <div class="text-sm px-1 text-right" style="width:10%">
            <input type="file" name="nmc_number_confirmation_file" id="nmc_number_confirmation_file" class="inputfile hidden" @input="onFileInput($event, 'nmc_number_confirmation')" />
            <label for="nmc_number_confirmation_file" class="cursor-pointer">Upload</label>
          </div>
        </div>
      </div>
      <div class="border-solid rounded-lg shadow-md p-5 mb-5">
        <div class="flex flex-row flex-wrap justify-start">
          <div class="text-sm px-1" style="width:10%">Enhanced DBS cehck dated within 3 years</div>
          <div class="text-sm px-1" style="width:15%">{{form.enhanced_dbs_check.date | localDate}}</div>
          <div class="text-sm px-1" style="width:55%"></div>
          <div class="text-sm px-1" style="width:10%">{{form.enhanced_dbs_check.name | StringMaxLength(10)}}</div>
          <div class="text-sm px-1 text-right" style="width:10%">
            <input type="file" name="enhanced_dbs_check_file" id="enhanced_dbs_check_file" class="inputfile hidden" @input="onFileInput($event, 'enhanced_dbs_check')" />
            <label for="enhanced_dbs_check_file" class="cursor-pointer">Upload</label>
          </div>
        </div>
      </div>
      <div class="border-solid rounded-lg shadow-md p-5 mb-5">
        <div class="flex flex-row flex-wrap justify-start">
          <div class="text-sm px-1" style="width:10%">Nurse Qualification</div>
          <div class="text-sm px-1" style="width:15%">{{form.nurse_qualification.date | localDate}}</div>
          <div class="text-sm px-1" style="width:55%"></div>
          <div class="text-sm px-1" style="width:10%">{{form.nurse_qualification.name | StringMaxLength(10)}}</div>
          <div class="text-sm px-1 text-right" style="width:10%">
            <input type="file" name="nurse_qualification_file" id="nurse_qualification_file" class="inputfile hidden" @input="onFileInput($event, 'nurse_qualification')" />
            <label for="nurse_qualification_file" class="cursor-pointer">Upload</label>
          </div>
        </div>
      </div>
      <div class="border-solid rounded-lg shadow-md p-5 mb-5">
        <div class="flex flex-row flex-wrap justify-start">
          <div class="text-sm px-1" style="width:10%">Safeguarding Children & Adults - Minimum Level 2</div>
          <div class="text-sm px-1" style="width:15%">{{form.safeguarding_children_level_2.date | localDate }}</div>
          <div class="text-sm px-1" style="width:55%"></div>
          <div class="text-sm px-1" style="width:10%">{{form.safeguarding_children_level_2.name | StringMaxLength(10)}}</div>
          <div class="text-sm px-1 text-right" style="width:10%">
            <input type="file" name="safeguarding_children_level_2_file" id="safeguarding_children_level_2_file" class="inputfile hidden" @input="onFileInput($event, 'safeguarding_children_level_2')" />
            <label for="safeguarding_children_level_2_file" class="cursor-pointer">Upload</label>
          </div>
        </div>
      </div>
      <div class="border-solid rounded-lg shadow-md p-5 mb-5">
        <div class="flex flex-row flex-wrap justify-start">
          <div class="text-sm px-1" style="width:10%">Safeguarding Children & Adults - Minimum Level 3</div>
          <div class="text-sm px-1" style="width:15%">{{form.safeguarding_children_level_3.date | localDate }}</div>
          <div class="text-sm px-1" style="width:55%"></div>
          <div class="text-sm px-1" style="width:10%">{{form.safeguarding_children_level_3.name | StringMaxLength(10)}}</div>
          <div class="text-sm px-1 text-right" style="width:10%">
            <input type="file" name="safeguarding_children_level_3_file" id="safeguarding_children_level_3_file" class="inputfile hidden" @input="onFileInput($event, 'safeguarding_children_level_3')" />
            <label for="safeguarding_children_level_3_file" class="cursor-pointer">Upload</label>
          </div>
        </div>
      </div>
      <div class="border-solid rounded-lg shadow-md p-5 mb-5">
        <div class="flex flex-row flex-wrap justify-start">
          <div class="text-sm px-1" style="width:10%">Hep B</div>
          <div class="text-sm px-1" style="width:15%">{{form.hep_b.date | localDate}}</div>
          <div class="text-sm px-1" style="width:55%"></div>
          <div class="text-sm px-1" style="width:10%">{{form.hep_b.name | StringMaxLength(10)}}</div>
          <div class="text-sm px-1 text-right" style="width:10%">
            <input type="file" name="hep_b_file" id="hep_b_file" class="inputfile hidden" @input="onFileInput($event, 'hep_b')" />
            <label for="hep_b_file" class="cursor-pointer">Upload</label>
          </div>
        </div>
      </div>
      <div class="border-solid rounded-lg shadow-md p-5 mb-5">
        <div class="flex flex-row flex-wrap justify-start">
          <div class="text-sm px-1" style="width:10%">Compliants Handling</div>
          <div class="text-sm px-1" style="width:15%">{{form.complaints_handling.date | localDate }}</div>
          <div class="text-sm px-1" style="width:55%"></div>
          <div class="text-sm px-1" style="width:10%">{{form.complaints_handling.name | StringMaxLength(10)}}</div>
          <div class="text-sm px-1 text-right" style="width:10%">
            <input type="file" name="complaints_handling_file" id="complaints_handling_file" class="inputfile hidden" @input="onFileInput($event, 'complaints_handling')" />
            <label for="complaints_handling_file" class="cursor-pointer">Upload</label>
          </div>
        </div>
      </div>
      <div class="border-solid rounded-lg shadow-md p-5 mb-5">
        <div class="flex flex-row flex-wrap justify-start">
          <div class="text-sm px-1" style="width:10%">Conflict Resolution</div>
          <div class="text-sm px-1" style="width:15%">{{form.conflict_resolution.date | localDate}}</div>
          <div class="text-sm px-1" style="width:55%"></div>
          <div class="text-sm px-1" style="width:10%">{{form.conflict_resolution.name | StringMaxLength(10)}}</div>
          <div class="text-sm px-1 text-right" style="width:10%">
            <input type="file" name="conflict_resolution_file" id="conflict_resolution_file" class="inputfile hidden" @input="onFileInput($event, 'conflict_resolution')" />
            <label for="conflict_resolution_file" class="cursor-pointer">Upload</label>
          </div>
        </div>
      </div>
      <div class="border-solid rounded-lg shadow-md p-5 mb-5">
        <div class="flex flex-row flex-wrap justify-start">
          <div class="text-sm px-1" style="width:10%">COSHH (Control of Substances Hazardous to Health regulation)</div>
          <div class="text-sm px-1" style="width:15%">{{form.coshh.date | localDate}}</div>
          <div class="text-sm px-1" style="width:55%"></div>
          <div class="text-sm px-1" style="width:10%">{{form.coshh.name | StringMaxLength(10)}}</div>
          <div class="text-sm px-1 text-right" style="width:10%">
            <input type="file" name="coshh_file" id="coshh_file" class="inputfile hidden" @input="onFileInput($event, 'coshh')" />
            <label for="coshh_file" class="cursor-pointer">Upload</label>
          </div>
        </div>
      </div>
      <div class="border-solid rounded-lg shadow-md p-5 mb-5">
        <div class="flex flex-row flex-wrap justify-start">
          <div class="text-sm px-1" style="width:10%">Dementia Awareness</div>
          <div class="text-sm px-1" style="width:15%">{{form.dementia_awareness.date | localDate }}</div>
          <div class="text-sm px-1" style="width:55%"></div>
          <div class="text-sm px-1" style="width:10%">{{form.dementia_awareness.name | StringMaxLength(10)}}</div>
          <div class="text-sm px-1 text-right" style="width:10%">
            <input type="file" name="dementia_awareness_file" id="dementia_awareness_file" class="inputfile hidden" @input="onFileInput($event, 'dementia_awareness')" />
            <label for="dementia_awareness_file" class="cursor-pointer">Upload</label>
          </div>
        </div>
      </div>
      <div class="border-solid rounded-lg shadow-md p-5 mb-5">
        <div class="flex flex-row flex-wrap justify-start">
          <div class="text-sm px-1" style="width:10%">Epilepsy Awareness</div>
          <div class="text-sm px-1" style="width:15%">{{form.epilepsy.date | localDate }}</div>
          <div class="text-sm px-1" style="width:55%"></div>
          <div class="text-sm px-1" style="width:10%">{{form.epilepsy.name | StringMaxLength(10)}}</div>
          <div class="text-sm px-1 text-right" style="width:10%">
            <input type="file" name="epilepsy_file" id="epilepsy_file" class="inputfile hidden" @input="onFileInput($event, 'epilepsy')" />
            <label for="epilepsy_file" class="cursor-pointer">Upload</label>
          </div>
        </div>
      </div>
      <div class="border-solid rounded-lg shadow-md p-5 mb-5">
        <div class="flex flex-row flex-wrap justify-start">
          <div class="text-sm px-1" style="width:10%">Equality, Diversity and Human Rights</div>
          <div class="text-sm px-1" style="width:15%">{{form.equality_diversity_human_rights.date | localDate}}</div>
          <div class="text-sm px-1" style="width:55%"></div>
          <div class="text-sm px-1" style="width:10%">{{form.equality_diversity_human_rights.name | StringMaxLength(10)}}</div>
          <div class="text-sm px-1 text-right" style="width:10%">
            <input type="file" name="equality_diversity_human_rights_file" id="equality_diversity_human_rights_file" class="inputfile hidden" @input="onFileInput($event, 'equality_diversity_human_rights')" />
            <label for="equality_diversity_human_rights_file" class="cursor-pointer">Upload</label>
          </div>
        </div>
      </div>
      <div class="border-solid rounded-lg shadow-md p-5 mb-5">
        <div class="flex flex-row flex-wrap justify-start">
          <div class="text-sm px-1" style="width:10%">Fire Safety</div>
          <div class="text-sm px-1" style="width:15%">{{form.fire_safety.date | localDate }}</div>
          <div class="text-sm px-1" style="width:55%"></div>
          <div class="text-sm px-1" style="width:10%">{{form.fire_safety.name | StringMaxLength(10)}}</div>
          <div class="text-sm px-1 text-right" style="width:10%">
            <input type="file" name="fire_safety_file" id="fire_safety_file" class="inputfile hidden" @input="onFileInput($event, 'fire_safety')" />
            <label for="fire_safety_file" class="cursor-pointer">Upload</label>
          </div>
        </div>
      </div>
      <div class="border-solid rounded-lg shadow-md p-5 mb-5">
        <div class="flex flex-row flex-wrap justify-start">
          <div class="text-sm px-1" style="width:10%">General Data Protection Regulations (GDPR)</div>
          <div class="text-sm px-1" style="width:15%">{{form.gdpr.date | localDate }}</div>
          <div class="text-sm px-1" style="width:55%"></div>
          <div class="text-sm px-1" style="width:10%">{{form.gdpr.name | StringMaxLength(10)}}</div>
          <div class="text-sm px-1 text-right" style="width:10%">
            <input type="file" name="gdpr_file" id="gdpr_file" class="inputfile hidden" @input="onFileInput($event, 'gdpr')" />
            <label for="gdpr_file" class="cursor-pointer">Upload</label>
          </div>
        </div>
      </div>
      <div class="border-solid rounded-lg shadow-md p-5 mb-5">
        <div class="flex flex-row flex-wrap justify-start">
          <div class="text-sm px-1" style="width:10%">Handling Medication & Avoiding Drug Errors</div>
          <div class="text-sm px-1" style="width:15%">{{form.handling_medication.date | localDate }}</div>
          <div class="text-sm px-1" style="width:55%"></div>
          <div class="text-sm px-1" style="width:10%">{{form.handling_medication.name | StringMaxLength(10)}}</div>
          <div class="text-sm px-1 text-right" style="width:10%">
            <input type="file" name="handling_medication_file" id="handling_medication_file" class="inputfile hidden" @input="onFileInput($event, 'handling_medication')" />
            <label for="handling_medication_file" class="cursor-pointer">Upload</label>
          </div>
        </div>
      </div>
      <div class="border-solid rounded-lg shadow-md p-5 mb-5">
        <div class="flex flex-row flex-wrap justify-start">
          <div class="text-sm px-1" style="width:10%">Handling Violence & Aggression</div>
          <div class="text-sm px-1" style="width:15%">{{form.handling_violence.date | localDate }}</div>
          <div class="text-sm px-1" style="width:55%"></div>
          <div class="text-sm px-1" style="width:10%">{{form.handling_violence.name | StringMaxLength(10)}}</div>
          <div class="text-sm px-1 text-right" style="width:10%">
            <input type="file" name="handling_violence_file" id="handling_violence_file" class="inputfile hidden" @input="onFileInput($event, 'handling_violence')" />
            <label for="handling_violence_file" class="cursor-pointer">Upload</label>
          </div>
        </div>
      </div>
      <div class="border-solid rounded-lg shadow-md p-5 mb-5">
        <div class="flex flex-row flex-wrap justify-start">
          <div class="text-sm px-1" style="width:10%">Health, Safety and Welfare</div>
          <div class="text-sm px-1" style="width:15%">{{form.health_safety_welfare.date | localDate }}</div>
          <div class="text-sm px-1" style="width:55%"></div>
          <div class="text-sm px-1" style="width:10%">{{form.health_safety_welfare.name | StringMaxLength(10)}}</div>
          <div class="text-sm px-1 text-right" style="width:10%">
            <input type="file" name="health_safety_welfare_file" id="health_safety_welfare_file" class="inputfile hidden" @input="onFileInput($event, 'health_safety_welfare')" />
            <label for="health_safety_welfare_file" class="cursor-pointer">Upload</label>
          </div>
        </div>
      </div>
      <div class="border-solid rounded-lg shadow-md p-5 mb-5">
        <div class="flex flex-row flex-wrap justify-start">
          <div class="text-sm px-1" style="width:10%">Infection Prevention and Control</div>
          <div class="text-sm px-1" style="width:15%">{{form.infection_prevention.date | localDate }}</div>
          <div class="text-sm px-1" style="width:55%"></div>
          <div class="text-sm px-1" style="width:10%">{{form.infection_prevention.name | StringMaxLength(10)}}</div>
          <div class="text-sm px-1 text-right" style="width:10%">
            <input type="file" name="infection_prevention_file" id="infection_prevention_file" class="inputfile hidden" @input="onFileInput($event, 'infection_prevention')" />
            <label for="infection_prevention_file" class="cursor-pointer">Upload</label>
          </div>
        </div>
      </div>
      <div class="border-solid rounded-lg shadow-md p-5 mb-5">
        <div class="flex flex-row flex-wrap justify-start">
          <div class="text-sm px-1" style="width:10%">Information Governance, Record Keeping and Caldicott Protocols</div>
          <div class="text-sm px-1" style="width:15%">{{form.information_governance.date | localDate }}</div>
          <div class="text-sm px-1" style="width:55%"></div>
          <div class="text-sm px-1" style="width:10%">{{form.information_governance.name | StringMaxLength(10)}}</div>
          <div class="text-sm px-1 text-right" style="width:10%">
            <input type="file" name="information_governance_file" id="information_governance_file" class="inputfile hidden" @input="onFileInput($event, 'information_governance')" />
            <label for="information_governance_file" class="cursor-pointer">Upload</label>
          </div>
        </div>
      </div>
      <div class="border-solid rounded-lg shadow-md p-5 mb-5">
        <div class="flex flex-row flex-wrap justify-start">
          <div class="text-sm px-1" style="width:10%">Training for workers in a lone environment</div>
          <div class="text-sm px-1" style="width:15%">{{form.training_workers.date | localDate }}</div>
          <div class="text-sm px-1" style="width:55%"></div>
          <div class="text-sm px-1" style="width:10%">{{form.training_workers.name | StringMaxLength(10)}}</div>
          <div class="text-sm px-1 text-right" style="width:10%">
            <input type="file" name="training_workers_file" id="training_workers_file" class="inputfile hidden" @input="onFileInput($event, 'training_workers')" />
            <label for="training_workers_file" class="cursor-pointer">Upload</label>
          </div>
        </div>
      </div>
      <div class="border-solid rounded-lg shadow-md p-5 mb-5">
        <div class="flex flex-row flex-wrap justify-start">
          <div class="text-sm px-1" style="width:10%">Management of Anaphylaxis</div>
          <div class="text-sm px-1" style="width:15%">{{form.management_anaphylaxis.date | localDate }}</div>
          <div class="text-sm px-1" style="width:55%"></div>
          <div class="text-sm px-1" style="width:10%">{{form.management_anaphylaxis.name | StringMaxLength(10)}}</div>
          <div class="text-sm px-1 text-right" style="width:10%">
            <input type="file" name="management_anaphylaxis_file" id="management_anaphylaxis_file" class="inputfile hidden" @input="onFileInput($event, 'management_anaphylaxis')" />
            <label for="management_anaphylaxis_file" class="cursor-pointer">Upload</label>
          </div>
        </div>
      </div>
      <div class="border-solid rounded-lg shadow-md p-5 mb-5">
        <div class="flex flex-row flex-wrap justify-start">
          <div class="text-sm px-1" style="width:10%">Manual Handling</div>
          <div class="text-sm px-1" style="width:15%">{{form.manual_handling.date | localDate }}</div>
          <div class="text-sm px-1" style="width:55%"></div>
          <div class="text-sm px-1" style="width:10%">{{form.manual_handling.name | StringMaxLength(10)}}</div>
          <div class="text-sm px-1 text-right" style="width:10%">
            <input type="file" name="manual_handling_file" id="manual_handling_file" class="inputfile hidden" @input="onFileInput($event, 'manual_handling')" />
            <label for="manual_handling_file" class="cursor-pointer">Upload</label>
          </div>
        </div>
      </div>
      <div class="border-solid rounded-lg shadow-md p-5 mb-5">
        <div class="flex flex-row flex-wrap justify-start">
          <div class="text-sm px-1" style="width:10%">Mental Capacity Act 2005</div>
          <div class="text-sm px-1" style="width:15%">{{form.mental_capacity_act_2005.date | localDate }}</div>
          <div class="text-sm px-1" style="width:55%"></div>
          <div class="text-sm px-1" style="width:10%">{{form.mental_capacity_act_2005.name | StringMaxLength(10)}}</div>
          <div class="text-sm px-1 text-right" style="width:10%">
            <input type="file" name="mental_capacity_act_2005_file" id="mental_capacity_act_2005_file" class="inputfile hidden" @input="onFileInput($event, 'mental_capacity_act_2005')" />
            <label for="mental_capacity_act_2005_file" class="cursor-pointer">Upload</label>
          </div>
        </div>
      </div>
      <div class="border-solid rounded-lg shadow-md p-5 mb-5">
        <div class="flex flex-row flex-wrap justify-start">
          <div class="text-sm px-1" style="width:10%">Mental Health Act 2007</div>
          <div class="text-sm px-1" style="width:15%">{{form.mental_health_act_2007.date | localDate }}</div>
          <div class="text-sm px-1" style="width:55%"></div>
          <div class="text-sm px-1" style="width:10%">{{form.mental_health_act_2007.name | StringMaxLength(10)}}</div>
          <div class="text-sm px-1 text-right" style="width:10%">
            <input type="file" name="mental_health_act_2007_file" id="mental_health_act_2007_file" class="inputfile hidden" @input="onFileInput($event, 'mental_health_act_2007')" />
            <label for="mental_health_act_2007_file" class="cursor-pointer">Upload</label>
          </div>
        </div>
      </div>
      <div class="border-solid rounded-lg shadow-md p-5 mb-5">
        <div class="flex flex-row flex-wrap justify-start">
          <div class="text-sm px-1" style="width:10%">Preventing Radicalisation</div>
          <div class="text-sm px-1" style="width:15%">{{form.preventing_radicalisation.date | localDate }}</div>
          <div class="text-sm px-1" style="width:55%"></div>
          <div class="text-sm px-1" style="width:10%">{{form.preventing_radicalisation.name | StringMaxLength(10)}}</div>
          <div class="text-sm px-1 text-right" style="width:10%">
            <input type="file" name="preventing_radicalisation_file" id="preventing_radicalisation_file" class="inputfile hidden" @input="onFileInput($event, 'preventing_radicalisation')" />
            <label for="preventing_radicalisation_file" class="cursor-pointer">Upload</label>
          </div>
        </div>
      </div>
      <div class="border-solid rounded-lg shadow-md p-5 mb-5">
        <div class="flex flex-row flex-wrap justify-start">
          <div class="text-sm px-1" style="width:10%">RIDDOR (Reporting of Injuries, Diseases & Dangerous Occurrences Regulations)</div>
          <div class="text-sm px-1" style="width:15%">{{form.riddor.date | localDate }}</div>
          <div class="text-sm px-1" style="width:55%"></div>
          <div class="text-sm px-1" style="width:10%">{{form.riddor.name | StringMaxLength(10)}}</div>
          <div class="text-sm px-1 text-right" style="width:10%">
            <input type="file" name="riddor_file" id="riddor_file" class="inputfile hidden" @input="onFileInput($event, 'riddor')" />
            <label for="riddor_file" class="cursor-pointer">Upload</label>
          </div>
        </div>
      </div>
      <div class="border-solid rounded-lg shadow-md p-5 mb-5">
        <div class="flex flex-row flex-wrap justify-start">
          <div class="text-sm px-1" style="width:10%">Sepsis Awareness</div>
          <div class="text-sm px-1" style="width:15%">{{form.sepsis_awareness.date | localDate }}</div>
          <div class="text-sm px-1" style="width:55%"></div>
          <div class="text-sm px-1" style="width:10%">{{form.sepsis_awareness.name | StringMaxLength(10)}}</div>
          <div class="text-sm px-1 text-right" style="width:10%">
            <input type="file" name="sepsis_awareness_file" id="sepsis_awareness_file" class="inputfile hidden" @input="onFileInput($event, 'sepsis_awareness')" />
            <label for="sepsis_awareness_file" class="cursor-pointer">Upload</label>
          </div>
        </div>
      </div>

    </div>

  </section>
</template>
<script>
export default {
  data () {
    return {
      form: {
        gmc_nmc_number: {
          value: 123, status: 'Pending', name: '', note: '', file: null
        },
        mpl_npl_number: {
          value: 123, status: 'Pending', name: '', note: '', file: null
        },
        passport: {
          date: null, status: 'Empty', name: '', note: '', file: null
        },
        medical_indemnity_insurance_cerfiticate: {
          date: null, status: 'Empty', name: '', note: '', file: null
        },
        basic_life_support_certificate: {
          date: null, status: 'Empty', name: '', note: '', file: null
        },
        dbs_certificate: {
          date: null, status: 'Empty', name: '', note: '', file: null
        },
        nmc_number_confirmation: {
          date: null,  name: '', note: '', file: null
        },
        enhanced_dbs_check: {
          date: null,  name: '', note: '', file: null
        },
        nurse_qualification: {
          date: null,  name: '', note: '', file: null
        },
        safeguarding_children_level_2: {
          date: null,  name: '', note: '', file: null
        },
        safeguarding_children_level_3: {
          date: null,  name: '', note: '', file: null
        },
        hep_b: {
          date: null,  name: '', note: '', file: null
        },
        complaints_handling: {
          date: null,  name: '', note: '', file: null
        },
        conflict_resolution: {
          date: null,  name: '', note: '', file: null
        },
        coshh: {
          date: null,  name: '', note: '', file: null
        },
        dementia_awareness: {
          date: null,  name: '', note: '', file: null
        },
        epilepsy: {
          date: null,  name: '', note: '', file: null
        },
        equality_diversity_human_rights: {
          date: null,  name: '', note: '', file: null
        },
        fire_safety: {
          date: null,  name: '', note: '', file: null
        },
        gdpr: {
          date: null,  name: '', note: '', file: null
        },
        handling_medication: {
          date: null,  name: '', note: '', file: null
        },
        handling_violence: {
          date: null,  name: '', note: '', file: null
        },
        health_safety_welfare: {
          date: null,  name: '', note: '', file: null
        },
        infection_prevention: {
          date: null,  name: '', note: '', file: null
        },
        information_governance: {
          date: null,  name: '', note: '', file: null
        },
        training_workers: {
          date: null,  name: '', note: '', file: null
        },
        management_anaphylaxis: {
          date: null,  name: '', note: '', file: null
        },
        manual_handling: {
          date: null,  name: '', note: '', file: null
        },
        mental_capacity_act_2005: {
          date: null,  name: '', note: '', file: null
        },
        mental_health_act_2007: {
          date: null,  name: '', note: '', file: null
        },
        preventing_radicalisation: {
          date: null,  name: '', note: '', file: null
        },
        riddor: {
          date: null,  name: '', note: '', file: null
        },
        sepsis_awareness: {
          date: null,  name: '', note: '', file: null
        }
      },
      formError: []
    }
  },
  methods: {
    onFileInput (e, data) {
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
