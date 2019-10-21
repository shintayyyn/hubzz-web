<template>
<div>
  <AppTable
    v-if="surgeries.length > 0"
    :total="surgeries.length"
    :items="surgeries"
    :columns="columns"
  ></AppTable>
</div>
</template>
<script>
import AppTable from "@/components/Base/AppTable";
export default {
  props: ["surgeries"],
  components: {
    AppTable
  },
  data(){
    return{
      // app table
      columns: [
        {
          name: "Surgery",
          dataIndex: "name",
          class: "text-left"
        },
        {
          name: "Practice Code",
          dataIndex: "code",
          class: "text-center"
        },
        {
          name: "CCG",
          dataIndex: "clinical_commissioning_group.name",
          class: "text-center"
        },
      ],
    }
  },
  computed: {
  totalPages() {
    return Math.ceil(this.total / this.perPage);
  },
  pagechanged(page) {
    return
    this.current_page = page;
    this.params.offset = this.params.limit * (page - 1);
    // this.getJobParts(this.params);
  },
  limitchanged(limit) {
    return
    this.current_page = 1;
    this.params.offset = 0;
    this.params.limit = limit;
    // this.getJobParts(this.params);
  },
},
};
</script>