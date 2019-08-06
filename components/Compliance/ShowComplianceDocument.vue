<template>
    <div>
        <div class="p-8 max-w-xl">
            <div @click="$emit('close')" class="cursor-pointer">
                <svgicon name="left-arrow" height="32" />
            </div>
            <div class="ml-8 hover:text-black hover:bg-yellow-dark rounded-lg inline-flex p-2">
                <a
                @click.prevent="downloadItem(specificComplianceDoc.file.url,specificComplianceDoc.file.filename)"
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
                <div class="flex-col shadow-lg rounded-lg bg-grey-light mx-6 mt-10">
                    <div class="inline-flex text-sm m-4">
                        <div class="m-2 mr-20">
                            <p class="mr-20 font-semibold">Title</p>
                            <p class="mt-2 text-base">
                                {{specificComplianceDoc.compliance_document ? specificComplianceDoc.compliance_document.name: null}}
                            </p>
                            <p class="mt-5 mr-20 font-semibold">File last uploaded</p>
                            <p class="mt-2 text-base">
                                {{specificComplianceDoc.file ? $moment(specificComplianceDoc.file.created_at).format('DD/MM/YYYY HH:mm:ss') : null}}
                            </p>
                            <div v-if="specificComplianceDoc.status === 'Approved'">
                                <p class="mt-5 mr-20 font-semibold">Expiration Date</p>
                                <p class="mt-2 text-base">{{specificComplianceDoc.expired_at ? $moment(specificComplianceDoc.expired_at).format('DD/MM/YYYY HH:mm:ss') : null}}</p>
                            </div>
                            <div v-if="specificComplianceDoc.status === 'Rejected'">
                                <p class="mt-5 mr-20 font-semibold">Rejected At</p>
                                <p class="mt-2 text-base">{{specificComplianceDoc && specificComplianceDoc.rejected_at ? specificComplianceDoc.rejected_at : null }}</p>
                                <p class="mt-5 mr-20 font-semibold">Notes</p>
                                <p class="mt-2 text-base">{{specificComplianceDoc && specificComplianceDoc.note ? specificComplianceDoc.note : null}}</p>
                            </div>
                        </div>
                        <div class="flex m-2">
                        <embed
                            width="800px"
                            height="600px"
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
    props:['specificComplianceDoc'],
    created(){
        console.log(this.specificComplianceDoc)
    }
    
}
</script>
