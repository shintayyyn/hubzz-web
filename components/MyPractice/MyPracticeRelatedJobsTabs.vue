<template>
  <div class="flex flex-row justify-start overflow-x-auto py-3">
    <div class="relative">
      <nuxt-link
        :to="`/my-practice/${practiceType}/${$route.params.practiceId}/related-jobs/allocated`"
        class="mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.name === `my-practice-${practiceType}-practiceId-related-jobs` || $route.name.includes(`my-practice-${practiceType}-practiceId-related-jobs-allocated`) ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Allocated</nuxt-link>
      <transition name="fade">
        <div
          v-if="$store.state.jobs.practice_new_allocated_jobs_count > 0"
          class="rounded-lg bg-red-600 text-white text-xs font-bold py-1 px-2 absolute right-0 top-0"
        >{{$store.state.jobs.practice_new_allocated_jobs_count}}</div>
      </transition>
    </div>
    <div class="relative">
      <nuxt-link
        :to="`/my-practice/${practiceType}/${$route.params.practiceId}/related-jobs/ongoing`"
        class="mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.name.includes(`my-practice-${practiceType}-practiceId-related-jobs-ongoing`) ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Ongoing</nuxt-link>
      <transition name="fade">
        <div
          v-if="$store.state.jobs.practice_new_ongoing_jobs_count > 0"
          class="rounded-lg bg-red-600 text-white text-xs font-bold py-1 px-2 absolute right-0 top-0"
        >{{$store.state.jobs.practice_new_ongoing_jobs_count}}</div>
      </transition>
    </div>
    <div class="relative">
      <nuxt-link
        :to="`/my-practice/${practiceType}/${$route.params.practiceId}/related-jobs/available`"
        class="mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.name.includes(`my-practice-${practiceType}-practiceId-related-jobs-available`) ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
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
        :to="`/my-practice/${practiceType}/${$route.params.practiceId}/related-jobs/matched`"
        class="mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.name.includes(`my-practice-${practiceType}-practiceId-related-jobs-matched`) ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Matched</nuxt-link>
      <transition name="fade">
        <div
          v-if="$store.state.jobs.practice_new_matched_jobs_count > 0"
          class="rounded-lg bg-red-600 text-white text-xs font-bold py-1 px-2 absolute right-0 top-0"
        >{{$store.state.jobs.practice_new_matched_jobs_count}}</div>
      </transition>
    </div>
    <div class="relative">
      <nuxt-link
        :to="`/my-practice/${practiceType}/${$route.params.practiceId}/related-jobs/applied`"
        class="mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.name.includes(`my-practice-${practiceType}-practiceId-related-jobs-applied`) ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
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
        :to="`/my-practice/${practiceType}/${$route.params.practiceId}/related-jobs/unsuccessful`"
        class="mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.name.includes(`my-practice-${practiceType}-practiceId-related-jobs-unsuccessful`) ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
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
        :to="`/my-practice/${practiceType}/${$route.params.practiceId}/related-jobs/declined`"
        class="mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.name.includes(`my-practice-${practiceType}-practiceId-related-jobs-declined`) ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Declined</nuxt-link>
      <transition name="fade">
        <div
          v-if="$store.state.jobs.practice_new_declined_jobs_count > 0"
          class="rounded-lg bg-red-600 text-white text-xs font-bold py-1 px-2 absolute right-0 top-0"
        >{{$store.state.jobs.practice_new_declined_jobs_count}}</div>
      </transition>
    </div>
    <div class="relative">
      <nuxt-link
        :to="`/my-practice/${practiceType}/${$route.params.practiceId}/related-jobs/cancelled`"
        class="mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.name.includes(`my-practice-${practiceType}-practiceId-related-jobs-cancelled`) ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
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
        :to="`/my-practice/${practiceType}/${$route.params.practiceId}/related-jobs/withdrawn`"
        class="mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.name.includes(`my-practice-${practiceType}-practiceId-related-jobs-withdrawn`) ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Withdrawn</nuxt-link>
      <transition name="fade">
        <div
          v-if="$store.state.jobs.practice_new_withdrawn_jobs_count > 0"
          class="rounded-lg bg-red-600 text-white text-xs font-bold py-1 px-2 absolute right-0 top-0"
        >{{$store.state.jobs.practice_new_withdrawn_jobs_count}}</div>
      </transition>
    </div>
    <div class="relative">
      <nuxt-link
        :to="`/my-practice/${practiceType}/${$route.params.practiceId}/related-jobs/completed`"
        class="mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.name.includes(`my-practice-${practiceType}-practiceId-related-jobs-completed`) ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
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
        :to="`/my-practice/${practiceType}/${$route.params.practiceId}/related-jobs/approved`"
        class="mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.name.includes(`my-practice-${practiceType}-practiceId-related-jobs-approved`) ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Approved</nuxt-link>
      <transition name="fade">
        <div
          v-if="$store.state.jobs.practice_new_approved_jobs_count > 0"
          class="rounded-lg bg-red-600 text-white text-xs font-bold py-1 px-2 absolute right-0 top-0"
        >{{$store.state.jobs.practice_new_approved_jobs_count}}</div>
      </transition>
    </div>
  </div>
</template>
<script>
export default {
  props: ["practiceType"]
};
</script>
