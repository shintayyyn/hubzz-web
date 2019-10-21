<template>
  <section class="relative">
    <!-- <AppLoading :loading="loading" spinner /> -->
    <div class="overflow-x-auto">
      <table class="mx-auto">
        <thead>
          <tr class="text-sm md:text-base">
            <th
              v-for="(column, index) in columns"
              :key="index"
              :class="[(column.class && column.class.includes('text-center')) ? 'text-center' : 'text-left', 
              (sticky && (index === 0 && sticky === 'first')) && 'sticky left-0', 
              (sticky && (index === columns.length && sticky === 'last')) && 'sticky right-0']"
            >
              <span
                v-if="column.sortable"
                @click="sort(column.dataIndex)"
                :class="(column.class && column.class.includes('text-center')) && 'justify-center'"
                class="flex items-center w-full cursor-pointer"
              >
                <span class="block whitespace-no-wrap pr-1">{{column.name}}</span>
                <svgicon
                  class="inline align-baseline"
                  :name="sortIcon(column.dataIndex)"
                  height="12"
                  width="12"
                />
              </span>
              <span v-if="!column.sortable" class="block whitespace-no-wrap">{{column.name}}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(item, index) in items">
            <tr
              @click="$emit('show', item)"
              :key="item.id"
              class="cursor-pointer text-xs"
            >
              <td
                v-for="(column, index) in columns"
                :key="index"
                class="truncate"
                :class="[column.class ? column.class : '',
                (sticky && (index === 0 && sticky === 'first')) && 'sticky left-0', 
                (sticky && (index === columns.length && sticky === 'last')) && 'sticky right-0']"
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
                       class="truncate"
                    >{{ item }}</div>
                  </div>
                  <div class="truncate" v-else>{{ column.class.includes('file-size') ? (dataCell(item, column) / 1048576).toFixed(2) + 'Mb'  : dataCell(item, column)}}</div>
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
    },
    sticky: {
      type: String,
      default: ''
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
        let itemArray = null;
        let itemStr = null;
        let dataIndex = null;
        if (dataIndexArr.length === 1) {
          str = item[dataIndexArr[0]];
        }
        if (dataIndexArr.length === 2 && item[dataIndexArr[0]]) {
          str = item[dataIndexArr[0]][dataIndexArr[1]];
        }
        if (
          dataIndexArr.length === 3 &&
          item[dataIndexArr[0]] &&
          item[dataIndexArr[0]][dataIndexArr[1]]
        ) {
          str = item[dataIndexArr[0]][dataIndexArr[1]][dataIndexArr[2]];
        }
        if (
          dataIndexArr.length === 4 &&
          item[dataIndexArr[0]] &&
          item[dataIndexArr[0]][dataIndexArr[1]] &&
          item[dataIndexArr[0]][dataIndexArr[1]][dataIndexArr[2]]
        ) {
          str =
            item[dataIndexArr[0]][dataIndexArr[1]][dataIndexArr[2]][
              dataIndexArr[3]
            ];
        }
        if (
          dataIndexArr.length === 5 &&
          item[dataIndexArr[0]] &&
          item[dataIndexArr[0]][dataIndexArr[1]] &&
          item[dataIndexArr[0]][dataIndexArr[1]][dataIndexArr[2]][
            dataIndexArr[3]
          ]
        ) {
          str =
            item[dataIndexArr[0]][dataIndexArr[1]][dataIndexArr[2]][
              dataIndexArr[3]
            ][dataIndexArr[4]];
        }
        if (
          dataIndexArr.length === 6 &&
          item[dataIndexArr[0]] &&
          item[dataIndexArr[0]][dataIndexArr[1]] &&
          item[dataIndexArr[0]][dataIndexArr[1]][dataIndexArr[2]][
            dataIndexArr[3]
          ] &&
          item[dataIndexArr[0]][dataIndexArr[1]][dataIndexArr[2]][
            dataIndexArr[3]
          ][dataIndexArr[4]]
        ) {
          str =
            item[dataIndexArr[0]][dataIndexArr[1]][dataIndexArr[2]][
              dataIndexArr[3]
            ][dataIndexArr[4]][dataIndexArr[5]];
        }
      }
      if (str === false) {
        str = "No";
      }
      if (str === true) {
        str = "Yes";
      }
      if (str === null) {
        str = "(none)";
      }
      return str;
    }
  }
};
</script>
<style scoped>
table{
  border-collapse: separate;
  border-spacing: 0 10px;
}

table tbody tr:hover td{
  background-color: #eee;
}

table tbody td, table thead th {
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