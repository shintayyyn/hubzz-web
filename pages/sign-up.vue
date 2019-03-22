<template>
  <div class="__register">

    <IndexTabControl/>

    <div class="__register_form_container">
      <div class="__register_form">
        <div class="flex justify-center p-2 text-xl">
          <span>New to hubzz? Get started here</span>
        </div>
        <button class="__locum">I'm looking for work</button>
        <button class="__practice">I'm looking for locums</button>
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

    overflow: auto;
  }

  .__register_form_container {
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

  .__register_form button {
    align-self: center;
    width: 60%;
    padding: 1.75rem;
    border-radius: .75rem;
    font-size: 1.5rem;
    margin: .5rem;
  }

  .__register_form button.__locum {
    background-color: #FFDA3A;
  }

  .__register_form button.__practice {
    border: 2px solid #FFDA3A;
  }

  @media (min-width: 1280px) {
    .__register {
      padding-top: 6rem;
    }
  }
</style>
