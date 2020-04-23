<template>
  <div>
    <TimeProgress
      style="height: 100px; width: 100px;"
      :max="maxTimeoutInSeconds"
      :value="timeoutInSeconds"
      maxColor="#505561"
      minColor="#fff"
    />
  </div>
</template>

<script>
  import TimeProgress from "@/components/Notifications/TimeProgress"

  export default {
    layout: 'plain',

    components: {
      TimeProgress,
    },

    data () {
      return {
        maxTimeoutInSeconds: 30,
        timeoutInSeconds: 30,
      }
    },

    mounted () {
      setInterval(() => {
        this.timeoutInSeconds-=.5
        
        if (this.timeoutInSeconds < 0) {
          this.timeoutInSeconds = this.maxTimeoutInSeconds
        }
      }, 500)
    },
  }
</script>
