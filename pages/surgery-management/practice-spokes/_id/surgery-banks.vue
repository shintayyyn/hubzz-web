<template>
  <div class="p-4">
    <div class="flex flex-row flex-wrap justify-start">
      <div v-if="locums.length == 0">
        This spoke has no banks
      </div>
      <div class="w-full md:w-1/3 lg:w-1/4 p-2" v-for="locum in locums" :key="locum.id">
        <div class="h-full rounded-lg shadow-lg bg-gray-300 hover:bg-gray-400 p-4">
          <nuxt-link :to="{ path: `/surgery-management/practice-spokes/${$route.params.id}/surgery-banks/${locum.id}`, query: {...$route.query}}">
            <div class="flex flex-wrap text-center mt-4 cursor-pointer">
              <div class="w-full flex justify-center">
                <AppAvatar
                  :src="locum.avatar && locum.avatar.file && locum.avatar.file.url ? locum.avatar.file.url : ''"
                />
              </div>
              <div
                class="w-full font-bold text-sm sm:text-lg my-4 leading-tight"
              >{{locum.personal_detail.name}}</div>
              <div
                class="w-full mb-4 font-bold text-gray-700 text-sm leading-tight"
              >{{locum.locum_detail.profession.name}}</div>
            </div>
          </nuxt-link>
        </div>
      </div>
      <div class="mt-5 flex justify-center" v-if="locums.length > 0 && totalPages > 1">
        <AppPagination
          :total="total"
          :totalPages="totalPages"
          :currentPage="current_page"
          :perPage="perPage"
          @pagechanged="pagechanged"
        />
      </div>
      <transition name="fade" mode="out-in">
        <div
          class="shield"
          v-if="
            [
              'surgery-management-practice-spokes-id-surgery-banks-locumId',
            ].includes($route.name)
          "
          @click="$router.push(`/surgery-management/practice-spokes/${$route.params.id}/surgery-banks`)"
        ></div>
      </transition>
    </div>
    <nuxt-child/>
  </div>
</template>

<script>
import AppAvatar from "@/components/Base/AppAvatar";
import AppPagination from "@/components/Base/AppPagination"
export default {
  components:{
    AppAvatar,
    AppPagination
  },
  data(){
    return{
      locums:[],
      practiceSpoke: '',
      params: {
        favorite_by_practice_id: ''
      },
      // for pagination
      total: 0,
      current_page: 1,
      loading: false,
      toggleTable: false,
      is_favorite: false,
      detailed: true
    }
  },
  created() {
    // this.getLocumsCount();
  },
  computed: {
    offset() {
      return this.perPage * (this.current_page - 1);
    },
    perPage() {
      return 8;
    },
    totalPages() {
      return Math.ceil(this.total / this.perPage);
    },
    authPermissions() {
      return this.$store.getters["auth/permissions"];
    }
  },
  async asyncData({app, route, store}) {
    try{
      let response = await app.$axios.$get(`/api/v1/practice/me/practice-surgeries/${route.params.id}`)
      const practiceSurgery = response.data.practice_surgery
      console.log('practice surgery', practiceSurgery)
      let params = {
        surgery_id : practiceSurgery.surgery_id
      }
      response = await app.$axios.$get(`/api/v1/practice/practice-spokes`,{ params })
      console.log('response', response.data)
      const practiceSpoke = response.data.practices[0]
      return{
        // practiceSpoke
      }
    }catch(err){
      console.log('get locum error!', err)
    }
    
  },  
  methods:{
    getLocumsCount() {
      console.log('spoke', this.practiceSpoke)
      let params = {
        favorite_by_practice_id : this.practiceSpoke.id
      }
      console.log("get locums count");
      this.loading = true;
      this.$axios
        .$get(
          `/api/v1/practice/locums/count`,{ params }
        )
        .then(res => {
          console.log(res);
          this.total = res.data.count;
          this.getLocums(this.current_page);
        })
        .catch(err => {
          console.log("err", err);
        });
    },
    getLocums(page) {
      console.log("get locums");
      let params = {
        limit: this.perPage,
        offset: this.offset,
        favorite_by_practice_id :  this.practiceSpoke.id,
        detailed: true,
      }
      this.current_page = page;
      this.$axios
        .$get(
          `/api/v1/practice/locums`,{ params }
        )
        .then(res => {
          console.log(res);
          this.locums = res.data.users;
          this.toggleTable = true;
          this.loading = false;
        })
        .catch(err => {
          console.log("err", err);
        });
    },
     pagechanged(e) {
      this.current_page = e;
      this.getLocums(this.current_page);
    }
  }
}
</script>
<style>
.modal-container {
	z-index: 510;
}
@media screen and (min-width: 1200px) {
	.modal-container {
		width: 70%;
	}
}
</style>