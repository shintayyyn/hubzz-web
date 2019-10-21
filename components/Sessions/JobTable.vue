<template>
  <table>
    <thead>
      <tr class="text-xs sm:text-sm text-left">
        <th
          v-for="item in columns"
          :key="item.dataIndex"
          @click="item.sortable ? $emit('sortBy', `${item.dataIndex}`) : null"
          class="text-center"
        >
          {{item.label}}
          <svgicon
            v-if="item.sortable"
            class="inline align-baseline"
            name="sort"
            height="12"
            width="12"
          />
        </th>
      </tr>
    </thead>
    <tbody>
      <template v-for="item in jobs">
        <tr
          :key="item.id"
          class="cursor-pointer text-xs text-left"
          @click="$emit('show', item.id)"
        >
          <td>{{item.job_number}}</td>
          <td>{{item.type === 'Private' ? item.private_job.private_practice.surgery.name : item.platform_job.practice.surgery.name}}</td>
          <td>{{item.type === 'Private' ? 'Private appointment' : item.title}}</td>
          <td>{{item.shift.name}}</td>
          <td>{{item.rate}}</td>
          <td>{{item.locum_detail_rate_type.name}}</td>
          <td>{{item.date_start}}</td>
          <td>{{item.date_end}}</td>
          <td
            v-if="['Available','Current','Unfilled'].includes(item.status)"
          >{{$moment(item.date_created).format('YYYY-MM-DD') }}</td>
          <td v-if="item.status === 'Applied'">{{ $moment(item.date_created).format('YYYY-MM-DD') }}</td>
          <template v-if="item.status === 'Current'">
            <td v-if="item.type === 'Private'">N/A</td>
            <td v-else>{{item.platform_job.appointed_at | localDate}}</td>
          </template>
          <td
            v-if="item.status === 'Completed'"
          >{{item.job_parts[item.job_parts.length - 1].completed_at | localDate }}</td>
          <td v-if="item.status === 'Cancelled'">{{item.platform_job.cancelled_at | localDate}}</td>
          <td v-if="item.status === 'Declined'">{{item.platform_job.declined_at | localDate}}</td>
        </tr>
      </template>
    </tbody>
  </table>
</template>
<script>
export default {
  props: {
    columns: {
      type: Array,
      required: true
    },
    jobs: {
      type: Array,
      required: true
    }
  }
};
</script>
<style scoped>
table{
  border-collapse: separate;
  border-spacing: 0 10px;
}
/* table tbody tr {
  background-color: #fff;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
} */
table tbody tr:hover td{
  background-color: #eff3f8;
}
table tbody td:first-child, table thead td:first-child {
  position: sticky;
  background-color: #fff;
  right: 0;
}
table tbody td {
  padding: 1;
}
</style>