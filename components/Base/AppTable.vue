<template>
  <section class="relative">
    <AppLoading :loading="loading" spinner />
    <div class="overflow-x-auto">
      <table class="mx-auto">
        <thead>
          <tr class="text-sm md:text-base">
            <th v-for="(column, index) in columns" :key="index">
              <span
                v-if="column.sortable"
                @click="sort(column.dataIndex)"
                :class="column.sortable ? 'cursor-pointer':''"
              >
                <span>{{column.name}}</span>
                <svgicon
                  class="inline align-baseline"
                  :name="sortIcon(column.dataIndex)"
                  height="12"
                  width="12"
                />
              </span>
              <span v-else>{{column.name}}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-for="item in items">
            <tr
              @click="$emit('show', item)"
              :key="item.id"
              class="__job-card shadow-md cursor-pointer text-xs"
            >
              <td
                v-for="(column, index) in columns"
                :key="index"
                :class="column.class"
                id="data-cell"
              >
                <span
                  v-if="column.class.includes('localDate')"
                >{{dataCell(item, column) | localDate}}</span>
                <span v-else>{{dataCell(item, column)}}</span>
              </td>
              <td class="flex justify-center"  v-if="item.removable">
                <div
                  class="font-semibold text-xs sm:text-sm text-center"
                  @click.stop.prevent="toggle(item)"
                >X</div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <div class="bottom-0 w-full">
      <AppPagination
        :total="total"
        :totalPages="totalPages"
        :currentPage="currentPage"
        @pagechanged="pagechanged"
        @limitchanged="limitchanged"
        :loading="loading"
        :perPage="perPage"
      />
    </div>
    <AppConfirmationModal
      :label="'Are you sure you want to delete this?'"
      :confirmLabel="'Yes'"
      :cancelLabel="'Cancel'"
      :modal="modal"
      @confirm="remove"
      @cancel="cancel"
    />
  </section>
</template>
<script>
import AppConfirmationModal from "@/components/Base/AppConfirmationModal";
import AppPagination from "@/components/Base/AppPagination";
import AppLoading from "@/components/Base/AppLoading";
export default {
  props: {
    total: {
      type: Number,
      required: true
    },
    items: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    currentPage: {
      type: Number,
      default: 1
    },
    perPage: {
      type: Number,
      default: 10
    },
    columns: {
      type: Array,
      required: true
    },
    orderBy: {
      type: Array,
      required: false
    }
  },
  components: {
    AppConfirmationModal,
    AppLoading,
    AppPagination
  },
  computed: {
    totalPages() {
      return Math.ceil(this.total / this.perPage);
    }
  },
  data() {
    return {
      modal: false,
      selectedItemId: null,
      params: []
    };
  },
  mounted() {
    this.params = this.orderBy;
  },
  methods: {
    sort(dataIndex) {
      if (!this.params.some(item => item.includes(`${dataIndex}`))) {
        this.params.push(`${dataIndex}:desc`);
      } else {
        let index = this.params.findIndex(item => item === `${dataIndex}:desc`);
        if (index >= 0) {
          this.params.splice(index, 1, `${dataIndex}:asc`);
        } else {
          this.params.splice(
            this.params.findIndex(item => item === `${dataIndex}:asc`),
            1
          );
        }
      }
      this.$emit("sorted", this.params);
    },
    pagechanged(e) {
      this.$emit("pagechanged", e);
    },
    limitchanged(limit) {
      this.$emit("limitchanged", limit);
    },
    sortIcon(dataIndex) {
      if (!this.params.some(item => item.includes(dataIndex))) {
        return "sort";
      } else {
        let index = this.params.findIndex(item => item === `${dataIndex}:desc`);
        if (index >= 0) {
          return "sort-descend";
        } else {
          return "sort-ascend";
        }
      }
    },
    dataCell(item, column) {
      var dataIndexArr = column.dataIndex.split(".");
      let str = "";
      if (dataIndexArr.length === 1) {
        str = item[dataIndexArr[0]];
      } else if (dataIndexArr.length === 2 && item[dataIndexArr[0]]) {
        str = item[dataIndexArr[0]][dataIndexArr[1]];
      } else if (
        dataIndexArr.length === 3 &&
        item[dataIndexArr[0]][dataIndexArr[1]]
      ) {
        str = item[dataIndexArr[0]][dataIndexArr[1]][dataIndexArr[2]];
      }
      if (str === false) return str = 'No'
      if (str === true) return str = 'Yes'
      return str === null ? `(none)` : str;
    },
    toggle(item) {
      this.selectedItemId = item.id;
      this.modal = true;
    },
    cancel() {
      this.selectedItemId = null;
      this.modal = false;
    },
    remove() {
      this.$emit("remove", this.selectedItemId);
      this.modal = false;
    }
  }
};
</script>
<style scoped>
table thead th {
  padding: 10px;
}
table tbody td {
  padding: 15px;
}
#data-cell {
  max-width: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>