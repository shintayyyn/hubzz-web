<template>
  <div class="flex flex-no-wrap justify-start">
    <div style="font-family:Nunito" @click.prevent="$store.commit('termsAndConditions/setActiveTab', 'terms_and_conditions')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$store.state.termsAndConditions.activeTab === 'terms_and_conditions' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'">
        Terms & Conditions
    </div>
    <div style="font-family:Nunito" @click.prevent="$store.commit('termsAndConditions/setActiveTab', 'privacy_policy')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$store.state.termsAndConditions.activeTab === 'privacy_policy' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'">
        Privacy Policy
    </div>
  </div>
</template>
<script>
export default {

}
</script>
