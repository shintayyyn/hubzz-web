<template>
  <div class="__tab_control">
    <nuxt-link to="/sign-in">Sign In</nuxt-link>
    <nuxt-link to="/sign-up">Sign Up</nuxt-link>
  </div>
</template>

<style>
  .__tab_control {
    display: flex;
    justify-content: center;
    align-items: center;

    padding: 2rem 1rem;
    margin: 0 1rem;
  }

  .__tab_control > a {
    padding: 1rem 2.5rem;

    border-radius: 1.5rem;

    text-decoration: none;
    white-space: nowrap;
    color: #9E9E9E;
  }

  .__tab_control > a.nuxt-link-active {
    background-color: #FFDA3A;
    cursor: inherit;
    color: #000;
  }
</style>
