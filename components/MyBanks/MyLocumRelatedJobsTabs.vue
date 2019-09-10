<template>
  <div class="flex flex-row justify-start overflow-x-auto py-3">
    <div class="relative">
      <nuxt-link
        :to="`/my-banks/${locumType}/${$route.params.userId}/related-jobs/available`"
        class="mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.name === `my-banks-${locumType}-userId-related-jobs` || $route.name.includes(`my-banks-${locumType}-userId-related-jobs-available`) ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Available</nuxt-link>
      <transition name="fade">
        <div
          v-if="$store.state.jobs.practice_new_available_jobs_count > 0"
          class="rounded-lg bg-red-600 text-white text-xs font-bold py-1 px-2 absolute right-0 top-0"
        >{{$store.state.jobs.practice_new_available_jobs_count}}</div>
      </transition>
    </div>
    <div class="relative">
      <nuxt-link
        :to="`/my-banks/${locumType}/${$route.params.userId}/related-jobs/applied`"
        class="mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.name.includes(`my-banks-${locumType}-userId-related-jobs-applied`) ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Applied</nuxt-link>
      <transition name="fade">
        <div
          v-if="$store.state.jobs.practice_new_applied_jobs_count > 0"
          class="rounded-lg bg-red-600 text-white text-xs font-bold py-1 px-2 absolute right-0 top-0"
        >{{$store.state.jobs.practice_new_applied_jobs_count}}</div>
      </transition>
    </div>
    <div class="relative">
      <nuxt-link
        :to="`/my-banks/${locumType}/${$route.params.userId}/related-jobs/current`"
        class="mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.name.includes(`my-banks-${locumType}-userId-related-jobs-current`) ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Current</nuxt-link>
      <transition name="fade">
        <div
          v-if="$store.state.jobs.practice_new_allocated_jobs_count > 0"
          class="rounded-lg bg-red-600 text-white text-xs font-bold py-1 px-2 absolute right-0 top-0"
        >{{$store.state.jobs.practice_new_allocated_jobs_count}}</div>
      </transition>
    </div>
    <div class="relative">
      <nuxt-link
        :to="`/my-banks/${locumType}/${$route.params.userId}/related-jobs/completed`"
        class="mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.name.includes(`my-banks-${locumType}-userId-related-jobs-completed`) ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Completed</nuxt-link>
      <transition name="fade">
        <div
          v-if="$store.state.jobs.practice_new_completed_jobs_count > 0"
          class="rounded-lg bg-red-600 text-white text-xs font-bold py-1 px-2 absolute right-0 top-0"
        >{{$store.state.jobs.practice_new_completed_jobs_count}}</div>
      </transition>
    </div>
    <div class="relative">
      <nuxt-link
        :to="`/my-banks/${locumType}/${$route.params.userId}/related-jobs/unsuccessful`"
        class="mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.name.includes(`my-banks-${locumType}-userId-related-jobs-unsuccessful`) ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Unsuccessful</nuxt-link>
      <transition name="fade">
        <div
          v-if="$store.state.jobs.practice_new_unsuccessful_jobs_count > 0"
          class="rounded-lg bg-red-600 text-white text-xs font-bold py-1 px-2 absolute right-0 top-0"
        >{{$store.state.jobs.practice_new_unsuccessful_jobs_count}}</div>
      </transition>
    </div>
    <div class="relative">
      <nuxt-link
        :to="`/my-banks/${locumType}/${$route.params.userId}/related-jobs/cancelled`"
        class="mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.name.includes(`my-banks-${locumType}-userId-related-jobs-cancelled`) ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Cancelled</nuxt-link>
      <transition name="fade">
        <div
          v-if="$store.state.jobs.practice_new_cancelled_jobs_count > 0"
          class="rounded-lg bg-red-600 text-white text-xs font-bold py-1 px-2 absolute right-0 top-0"
        >{{$store.state.jobs.practice_new_cancelled_jobs_count}}</div>
      </transition>
    </div>
    <div class="relative">
      <nuxt-link
        :to="`/my-banks/${locumType}/${$route.params.userId}/related-jobs/declined`"
        class="mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.name.includes(`my-banks-${locumType}-userId-related-jobs-declined`) ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Declined</nuxt-link>
      <transition name="fade">
        <div
          v-if="$store.state.jobs.practice_new_declined_jobs_count > 0"
          class="rounded-lg bg-red-600 text-white text-xs font-bold py-1 px-2 absolute right-0 top-0"
        >{{$store.state.jobs.practice_new_declined_jobs_count}}</div>
      </transition>
    </div>
  </div>
</template>
<script>
export default {
  props: ["locumType"]
};
</script>
