<template>
  <div class="__register">

    <IndexTabControl/>

    <div class="__register_form_container">
      <div class="__register_form">
        <div class="flex justify-center p-2 text-xl">
          <span>New to hubzz? Get started here</span>
        </div>
        <nuxt-link to="/sign-up/locum" class="__locum">I'm looking for work</nuxt-link>
        <nuxt-link to="/sign-up/practice" class="__practice">I'm looking for locums</nuxt-link>
      </div>
    </div>

  </div>
</template>

<script>
  import IndexTabControl from '~/components/IndexTabControl.vue'

  export default {
    layout: 'index',

    components: {
      IndexTabControl
    },

    async asyncData () {
      console.log('asyncData pages sign-up')
    }
  }
</script>

<style>
  .__register {
    height: 100%;
    width: 100%;

    display: flex;
    flex-direction: column;

    overflow: auto;
  }

  .__register_form_container {
    height: 600px;
    display: flex;
    justify-content: center;
  }

  .__register_form {
    max-width: 600px;
    width: 600px;

    display: flex;
    flex-direction: column;

    padding: 2.5rem 1.5rem;
    margin: 1rem;
    border-radius: 1rem;
    box-shadow: 3px 3px 30px 3px rgba(0,0,0,0.11), 0 5px 15px 0 rgba(0,0,0,0.08);
  }

  .__register_form a {
    width: 60%;

    align-self: center;

    display: flex;
    justify-content: center;
    align-items: center;

    padding: 1.75rem;
    margin: .5rem;

    border-radius: .75rem;
    
    color: inherit;
    text-decoration: none;
    font-size: 1.5rem;
  }

  .__register_form a.__locum {
    background-color: #FFDA3A;
  }

  .__register_form a.__practice {
    border: 2px solid #FFDA3A;
  }

  @media (min-width: 1280px) {
    .__register {
      justify-content: center;
    }
  }
</style>
