<template>
  <section class="relative">
    <AppLoading :loading="loading" spinner />
    <div class="overflow-x-auto p-2">
      <table class="mx-auto">
        <thead>
          <tr class="text-sm md:text-base">
            <th v-for="(column, index) in columns" :key="index" :class="column.class && column.class.includes('text-left') && 'text-left'">
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
                :class="column.class ? column.class : ''"
                id="data-cell"
              >
                <div
                  v-if="column.class && column.class.includes('localDate')"
                >{{dataCell(item, column) | localDate}}</div>
                <template v-else>
                  <div v-if="Array.isArray(dataCell(item, column))">
                    <div
                      v-for="(item, index) in dataCell(item, column)"
                      :key="`${item}-${index}`"
                    >{{item}}</div>
                  </div>
                  <div v-else>{{dataCell(item, column)}}</div>
                </template>
              </td>
              <slot name="actions" v-bind:item="item"></slot>
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
  </section>
</template>
<script>
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
      let str = null;

      if (Array.isArray(item[dataIndexArr[0]])) {
        str = [];
        item[dataIndexArr[0]].forEach(item => {
          str.push(item[dataIndexArr[1]][dataIndexArr[2]]);
        });
      } else {
        str = "";
        if (dataIndexArr.length === 1) {
          str = item[dataIndexArr[0]];
        } else if (dataIndexArr.length === 2 && item[dataIndexArr[0]]) {
          str = item[dataIndexArr[0]][dataIndexArr[1]];
        } else if (
          dataIndexArr.length === 3 &&
          item[dataIndexArr[0]][dataIndexArr[1]]
        ) {
          str = item[dataIndexArr[0]][dataIndexArr[1]][dataIndexArr[2]];
        } else if (
          dataIndexArr.length === 4 &&
          item[dataIndexArr[0]][dataIndexArr[1]][dataIndexArr[2]]
        ) {
          str =
            item[dataIndexArr[0]][dataIndexArr[1]][dataIndexArr[2]][
              dataIndexArr[3]
            ];
        }
      }

      if (str === false) return (str = "No");
      if (str === true) return (str = "Yes");
      // return str === null ? `(none)` : str;
      return str;
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