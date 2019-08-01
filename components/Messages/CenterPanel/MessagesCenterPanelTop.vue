<template>
    <div class="p-4 w-full">
        <div 
        v-for="item in messages"
        :key="item.id"
        class="font-bold text-lg"
        >
            <span :class="parseInt($route.params.slug) === item.id ? '' : 'hidden'">{{ item.receiver_first_name }} {{ item.receiver_last_name }}</span>
        </div>
        <div class="text-sm text-grey-dark">
            <span class="">asd</span>
            <span class="px-2 text-lg">|</span>
            <span class="">
                <span class="inline-block py-1 px-1 bg-green-light rounded-full"></span>
                Online
            </span>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            messages: [],
        };
    },
    created(){
        let route = this.$router.app._route.params.slug
        this.$axios.$get(`/api/v1/conversations`).then(res => {
        let conversations = res.data.conversations
        this.messages = conversations
        });
    }
}
</script>