<template>
  <table>
    <thead>
      <tr class="text-xs sm:text-sm text-left">
        <th
          v-for="(item, index) in columns"
          :key="item.dataIndex"
          @click="item.sortable ? $emit('sortBy', `${item.dataIndex}`) : null"
          class="text-center"
          :class="[index === 0 && 'sticky left-0', item.sortable && 'cursor-pointer']"
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
          <td class="text-center sticky left-0">{{item.job_number}}</td>
          <td class="text-center">{{item.type === 'Private' ? item.private_job.private_practice.surgery.name : item.platform_job.practice.surgery.name}}</td>
          <td class="text-center">{{item.type === 'Private' ? 'Private appointment' : item.title}}</td>
          <td class="text-center">{{item.shift.name}}</td>
          <td class="text-center">{{item.rate}}</td>
          <td class="text-center">{{item.locum_detail_rate_type.name}}</td>
          <td class="text-center">{{item.date_start}}</td>
          <td class="text-center">{{item.date_end}}</td>
          <td class="text-center"
            v-if="['Available','Current','Unfilled'].includes(item.status)"
          >{{$moment(item.date_created).format('YYYY-MM-DD') }}</td>
          <td class="text-center" v-if="item.status === 'Applied'">{{ $moment(item.date_created).format('YYYY-MM-DD') }}</td>
          <template v-if="item.status === 'Current'">
            <td class="text-center" v-if="item.type === 'Private'">N/A</td>
            <td class="text-center" v-else>{{item.platform_job.appointed_at | localDate}}</td>
          </template>
          <td class="text-center"
            v-if="item.status === 'Completed'"
          >{{item.job_parts[item.job_parts.length - 1].completed_at | localDate }}</td>
          <td class="text-center" v-if="item.status === 'Cancelled'">{{item.platform_job.cancelled_at | localDate}}</td>
          <td class="text-center" v-if="item.status === 'Declined'">{{item.platform_job.declined_at | localDate}}</td>
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
table {
  border-collapse: separate;
  border-spacing: 0 10px;
}

table tbody tr:hover td{
  background-color: #eff3f8;
}

table tbody td,
table thead th {
  background-color: #fff;
  padding: 15px 8px;
}

.table-sticky-first, .table-sticky-last{
  position: sticky;
  background-color: #fff;
}

.table-sticky-first table tbody td:first-child, .table-sticky-first table thead th:first-child{
  left: 0;
}
.table-sticky-last table tbody td:first-child, .table-sticky-last table thead th:first-child{
  right: 0;
}
</style>