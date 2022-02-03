<template>
  <section class="relative">
    <AppTable
      v-if="practice_users.length > 0"
      :total="practice_users.length"
      :items="practice_users"
      :columns="columns"
      :orderBy="params.order_by"
      :sticky="'first'"
      @show="$emit('show', $event.id)"
    />
  </section>
</template>
<script>
import AppTable from "@/components/Base/AppTable"
export default {
  components: {
    AppTable,
  },
  props: {
    practice_users:{
      type: Array,
      default: () => null,
    },
  },
  data () {
    return {
      // app table column
      columns: [
        {
          name: "User",
          dataIndex: "personal_detail.name",
          class: "text-left",
        },
        {
          name: "Practice Role",
          dataIndex: "practice_detail.practice_role",
          class: "text-center",
        },
        {
          name: "Surgery",
          dataIndex: "practice_detail.practice.surgery.name",
          class: "text-center",
        },
        {
          name: "Email",
          dataIndex: "email",
          class: "text-center",
        },
      ],
      // app table params
      params: {
        order_by: ["created_at:desc",],
      },
    }
  },
}
</script>
