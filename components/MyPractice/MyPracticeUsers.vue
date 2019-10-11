<template>
  <table class="overflow-x-auto p-2">
    <thead>
      <tr class="text-xs sm:text-sm text-left">
        <th>User</th>
        <th>Practice Role</th>
        <th>Surgery</th>
        <th>Email</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="(user, index) in practice_users">
        <tr
          :key="user.id"
          class="__job-card rounded-lg shadow-md cursor-pointer text-xs text-left"
          @click="$emit('show', user.id)"
        >
          <td>{{user.personal_detail.name}}</td>
          <td>{{user.practice_detail.practice_role}}</td>
          <td>{{user.practice_detail.practice.surgery.name}}</td>
          <td>{{user.email}}</td>
        </tr>
        <tr :key="`${user.id}-${index}`">
          <td></td>
        </tr>
      </template>
    </tbody>
  </table>
</template>
<script>
export default {
  props: ["practice_users"]
};
</script>