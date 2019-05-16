<template>
  <div class="flex flex-no-wrap justify-start">
    <div
      style="font-family:Nunito"
      @click.prevent="$store.commit('jobs/setActiveTab', 'allocated')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$store.state.jobs.activeTab === 'allocated' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
    >Allocated</div>
    <div
      style="font-family:Nunito"
      @click.prevent="$store.commit('jobs/setActiveTab', 'available')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$store.state.jobs.activeTab === 'available' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
    >Available</div>
    <div
      style="font-family:Nunito"
      @click.prevent="$store.commit('jobs/setActiveTab', 'applied')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$store.state.jobs.activeTab === 'applied' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
    >Applied</div>
    <div
      style="font-family:Nunito"
      @click.prevent="$store.commit('jobs/setActiveTab', 'unsuccessful')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$store.state.jobs.activeTab === 'unsuccessful' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
    >Unsuccessful</div>
    <div
      style="font-family:Nunito"
      @click.prevent="$store.commit('jobs/setActiveTab', 'declined')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$store.state.jobs.activeTab === 'declined' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
    >Declined</div>
    <div
      style="font-family:Nunito"
      @click.prevent="$store.commit('jobs/setActiveTab', 'completed')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$store.state.jobs.activeTab === 'completed' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
    >Completed</div>
  </div>
</template>
<script>
export default {

}
</script>
