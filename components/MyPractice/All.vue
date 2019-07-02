<template>
  <section>
    <div class="flex flex-row flex-wrap justify-start">
      <div
        class="card cursor-pointer rounded-lg shadow-lg m-2 p-5 hover:bg-grey"
        v-for="practice in practices"
        :key="practice.id"
      >
        <!-- <div class="flex justify-end z-50">
        <template v-if="practice.is_favorite">
          <svgicon
            name="on-star"
            height="32"
            width="32"
            class="cursor-pointer"
            @click="favorite(practice.id)"
          />
        </template>
        <template v-else>
          <svgicon
            name="off-star"
            height="32"
            width="32"
            class="cursor-pointer"
            @click="favorite(practice.id)"
          />
        </template>
        </div>-->
        <div class="flex flex-wrap text-center mt-4 cursor-pointer" @click="show(practice.id)">
          <div class="w-full">
            <svgicon name="no-avatar" height="60" width="60"/>
          </div>
          <div class="w-full font-bold text-sm sm:text-lg my-4">{{practice.report_to}}</div>
          <div class="w-full font-bold text-grey-dark text-sm sm:text-lg">{{practice.email}}</div>
        </div>
      </div>
    </div>
    <div class="shield" v-if="modal"></div>
    <transition name="slide" mode="out-in">
      <div class="modal shadow-lg" v-if="modal">
        <MyPracticeDetailModal :practice="practice" @close="modal = false"/>
      </div>
    </transition>
  </section>
</template>
<script>
import MyPracticeDetailModal from '@/components/MyPractice/MyPracticeDetailModal'
export default {
  components: {
    MyPracticeDetailModal
  },
  data() {
    return {
      practices: [],
      modal: false,
      practice: null
    }
  },
  created() {
    this.$axios.$get(`/api/v1/locum/practices`).then(res => {
      this.practices = res.data.practices
    })
  },
  methods: {
    show(id) {
      this.$axios.$get(`/api/v1/locum/practices/${id}`).then(res => {
        this.practice = res.data.practice
        this.modal = true
      })
    }
  }
}
</script>
<style>
.card {
  min-width: 200px;
  height: 250px;
  box-sizing: content-box;
}
.shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 509;
}
.modal {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  border-left: solid 2px #edf2f7;
  transition: all 0.3s ease-in-out;
  background-color: white;
  z-index: 510;
}
@media screen and (min-width: 1200px) {
  .modal {
    width: 80%;
  }
}
</style>


