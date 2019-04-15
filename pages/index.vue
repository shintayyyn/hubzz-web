<template>
  <div class="px-10">
    <!-- <div class="text-xs font-bold font-sans">Reminders</div>
    <div class="flex flex-row flex-wrap justify-start">
      <div class="flex-none p-5" style="width:260px;">
        <div class="border border-solid rounded-lg shadow-md p-8 cursor-pointer" style="height:120px;">
          <div class="relative">
            <div>
              <span class="float-left p-1">icon</span>
              Please complete your <strong>billing</strong> details
            </div>
          </div>
        </div>
      </div>
      <div class="flex-none p-5" style="width:260px;">
        <div class="border border-solid rounded-lg shadow-md p-8 cursor-pointer" style="height:120px;">
          <div>
            <span class="float-left p-1">icon</span>
            Please complete your <strong>compliance</strong> documentation
          </div>
        </div>
      </div>
      <div class="flex-none p-5" style="width:260px;">
        <div class="border border-solid rounded-lg shadow-md p-8 cursor-pointer" style="height:120px;">
          <div>
            <span class="float-left p-1">icon</span>
            Please complete your <strong>pensions</strong> settings
          </div>
        </div>
      </div>
      <div class="flex-none p-5" style="width:260px;">
        <div class="border border-solid rounded-lg shadow-md p-8 cursor-pointer" style="height:120px;">
          <div>
            <span class="float-left p-1">icon</span>
            Please complete your <strong>availability</strong> details
          </div>
        </div>
      </div>
    </div>


    <div class="text-xs font-bold font-sans mt-5">Appointments</div>
    <div class="flex flex-row flex-wrap justify-start">
      <div class="flex-none p-5 w-full">
        <div class="border border-solid rounded-lg shadow-md p-8" style="height:500px;">
          <div>calendar here</div>
        </div>
      </div>
    </div>

    <div class="text-xs font-bold font-sans mt-5">Quick statistics</div>
    <div class="flex flex-row flex-wrap justify-start">
      <div class="flex-none p-5" style="width:260px;">
        <div class="border border-solid rounded-lg shadow-md p-8 cursor-pointer hover:bg-grey-lighter" style="height:120px;">
          <div>Available jobs</div>
          <div class="font-sans text-5xl text-grey-darkest">0</div>
        </div>
      </div>
      <div class="flex-none p-5" style="width:260px;">
        <div class="border border-solid rounded-lg shadow-md p-8 cursor-pointer hover:bg-grey-lighter" style="height:120px;">
          <div>Current jobs</div>
          <div class="font-sans text-5xl text-grey-darkest">0</div>
        </div>
      </div>
      <div class="flex-none p-5" style="width:260px;">
        <div class="border border-solid rounded-lg shadow-md p-8 cursor-pointer hover:bg-grey-lighter" style="height:120px;">
          <div>Applied jobs</div>
          <div class="font-sans text-5xl text-grey-darkest">0</div>
        </div>
      </div>
      <div class="flex-none p-5" style="width:260px;">
        <div class="border border-solid rounded-lg shadow-md p-8 cursor-pointer hover:bg-grey-lighter" style="height:120px;">
          <div>Completed jobs</div>
          <div class="font-sans text-5xl text-grey-darkest">0</div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
  import AppCards from '@/components/AppCards'
  export default {
    components: {
      AppCards
    },
    async asyncData({ store, redirect }) {
      try {
        redirect('/dashboard')
        // if (!store.$auth.loggedIn) {
        //   redirect('/sign-in')
        //   return
        // }
      } catch (err) {
        console.log('index asyncData pages index err', err)
      }
    }
  }
</script>
