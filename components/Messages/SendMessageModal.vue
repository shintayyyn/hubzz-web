<template>
    <transition name="fade" mode="in-out">
        <section class="px-2 md:px-0" v-if="show">
            <div class="message-modal flex flex-col bg-white p-4 rounded-lg shadow-lg md:w-2/3 lg:w-1/2 xl:w-1/3">
                <div class="flex justify-between items-center pb-2">
                    <div class="flex items-center hover:text-gray-800 cursor-pointer" @click="openConversation">
                        <svgicon name="chat" height="20" width="20" color="#888 #555 #fff" class="mr-2"/>
                        <span class="font-bold">{{ this.user.personal_detail.name }}</span>
                    </div>
                    <div class="px-2 -mt-2 font-bold text-lg hover:text-gray-500 cursor-pointer" @click="$emit('close')">x</div>
                </div>
                <MessageForm :wrapperClass="'flex-col custom'" :inClass="'min-height'" :user="user" />
            </div>
            <div class="shield" @click="$emit('close')"></div>
        </section>
    </transition>
</template>

<script>
import MessageForm from "~/components/Messages/CenterPanel/MessagesCenterPanelForm";
import AppInput from "~/components/Base/AppInput";
import AppButton from "~/components/Base/AppButton";
export default {
    components: {
        AppInput,
        AppButton,
        MessageForm
    },
    props: {
        show: {
            default: false,
            type: Boolean,
        },
        user: {
            type: Object
        }
    },
    data(){
        return{
            conversation_id: ''
        }
    },
    computed:{
        messageSent(){
            return this.$store.state.chat.messageSent
        }
    },
    created(){
        this.$axios.$get(`/api/v1/conversations?user_id=${this.user.id}`).then(res => {
            this.conversation_id = res.data.conversation.conversation_id
        });
    },
    watch:{
        messageSent(value){
            if (value === false){
                setTimeout(() => {
                    this.$emit('close')
                }, 500);
            }
        }
    },
    methods:{
        openConversation(){
            this.$router.push(`/messages/${this.conversation_id}`)
        }
    }
}
</script>

<style>
.min-height{
    min-height: 200px;
}
.custom button{
    padding: 10px;
}
.message-modal{
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 60;
}
@media screen and (max-width: 767px){
    .message-modal{
        min-width: 85%;
    }
}
</style>