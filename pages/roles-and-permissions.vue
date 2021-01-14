<template>
  <section class="roles-and-permissions-section">
    <div class="flex justify-start overflow-x-auto lg:overflow-y-hidden my-3 border-b border-sunglow">
        <nuxt-link
          to="/roles-and-permissions/roles"
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="$route.name === 'roles-and-permissions' || $route.name.includes('roles-and-permissions-roles') ? 'border-b-4 border-sunglow' : 'text-gray-600'"
        >
          Roles
        </nuxt-link>
    </div>
    
    <div class="mt-5">
      <nuxt-child />
    </div>
  </section>
</template>

<script>
export default {
  middleware: "isVerified",
}
</script>
