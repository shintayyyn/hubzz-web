<template>
    <div class="rounded-lg shadow-lg pt-10 px-8 pb-8">
        <div class="mb-4 border-b border-b-2 border-grey py-2"
            :class="{'border-yellow-dark':setFocus === 'email_address', 'border-red': formError.includes('email_address')}">
            <label for="email_address" class="block text-sm mb-2">Email addresses to Locums</label>
            <em v-if="formError.includes('email_address')" class="text-xs text-red-darker float-right">Required</em>
            <input @focus="setFocus = 'email_address'" @blur="setFocus = ''" v-model="form.email_address"
                type="password" name="email_address" id="email_address"
                class="appearance-none bg-transparent border-none w-full text-grey-darker mr-3 py-1 px-2 leading-tight focus:outline-none">
        </div>
        <div class="flex justify-start mt-8">
            <div class="text-sm">The message to be sent to Locums</div>
        </div>
        <div class="flex justify-start mt-5">
            <div class="text-sm font-bold">Have you heard the buzz about hubzz?</div>
        </div>
        <div class="flex justify-start mt-5">
            <span class="text-sm font-bold">Join hubzz at &nbsp;</span>
            <span class="text-sm font-bold">
                <a href="http://hubzz.co.uk" target="_blank" class="text-black no-underline hover:underline">hubzz.co.uk</a>
            </span>
        </div>
        <div class="flex justify-start mt-5">
            <div class="text-left">
                <button class="bg-yellow-dark hover:text-white focus:outline-none text-black font-bold text-xl p-6 rounded-lg"
                    @click.prevent="send">Send</button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {
            form: {
                email_address: ''
            },
            formError: [],
            setFocus: false
        }
    },
    created () {
        // get from API
        this.form.terms_and_conditions = ''
    },
    methods: {
        send () {
            console.log(this.form)
        }
    }
}
</script>
<style scoped>
textarea {
    resize: none;
}
button:active {
    transform: translate(2px, 2px);
}
</style>


