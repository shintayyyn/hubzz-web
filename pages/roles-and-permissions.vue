<template>
  <section class="roles-and-permissions-section">
    <div class="flex justify-start overflow-x-auto py-3">
      <div class="relative">
        <nuxt-link
          to="/roles-and-permissions/roles"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="$route.name === 'roles-and-permissions' || $route.name.includes('roles-and-permissions-roles') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Roles</nuxt-link>
      </div>
    </div>
    <div class="mt-5">
      <nuxt-child />
    </div>
  </section>
</template>
