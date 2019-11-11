<template>
  <section class="relative">
    <div class="relative flex flex-col overflow-x-auto w-full px-2 mt-4">
      <AppLoading :loading="loading" spinner />
      <div :style="`min-width: ${customWidth}px`" class="row flex justify-start font-bold leading-none text-sm">
        <div
          class="flex-1 flex items-center px-2"
          v-for="(column, index) in columns"
          :key="`${column}-${index}`"
          :class="[column.class && column.class.includes('text-center') && 'justify-center', column.sortable && 'cursor-pointer']"
          @click="column.sortable && sort(column.dataIndex)"
        >
          <span class="pr-1">{{ column.name }}</span>
          <svgicon v-if="column.sortable" :name="sortIcon(column.dataIndex)" height="12" width="12" />
        </div>
      </div>
      <div v-for="item in items" :key="item.id" :style="`min-width: ${customWidth}px`" class="row py-2">
        <nuxt-link :to="{ path: `${routerLink}/${item.id}`, query: { ...$route.query } }" :event="!routerLink ? '' : 'click'">
          <div class="flex justify-start shadow-md hover:bg-gray-100 rounded-lg items-center py-3">
            <div
              v-for="(column, index) in columns"
              :key="index"
              class="flex-1 truncate px-2"
              :class="column.class && column.class.includes('text-center') && 'text-center'"
            >
              <template v-if="Array.isArray(dataCell(item, column))">
                <div v-for="(item, index) in dataCell(item, column)" :key="`${item}-${index}`">{{ item }}</div>
              </template>
              <template v-else>
                <template v-if="column.dataIndex === 'actions'">
                  <slot name="actions" v-bind:item="item"></slot>
                </template>
                <template v-if="column.class && column.class.includes('localDate') && dataCell(item, column) !== '(none)'">{{
                  dataCell(item, column) | localDate
                }}</template>
                <template v-if="column.class && column.class.includes('status') && dataCell(item, column) !== '(none)'">
                  <div class="flex items-center justify-center">
                    <div class="rounded-full px-6 py-1" :class="statusClass">{{ status }}</div>
                  </div>
                </template>
                <template v-else>{{ dataCell(item, column) }}</template>
              </template>
            </div>
          </div>
        </nuxt-link>
      </div>
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
    routerLink: {
      type: String
    },
    customWidth: {
      type: String
    },
    status: {
      type: String
    },
    statusClass: {
      type: String
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
    console.log("status class", status);
    this.params = this.orderBy;
  },
  methods: {
    sort(dataIndex) {
      if (!this.params.some(item => item.includes(`${dataIndex}`))) {
        this.params = [];
        this.params.push(`${dataIndex}:desc`);
      } else {
        let index = this.params.findIndex(item => item === `${dataIndex}:desc`);
        if (index >= 0) {
          this.params.splice(index, 1, `${dataIndex}:asc`);
        } else {
          this.params.splice(this.params.findIndex(item => item === `${dataIndex}:asc`), 1);
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
        if (dataIndexArr.length === 3 && item[dataIndexArr[0]] && item[dataIndexArr[0]][dataIndexArr[1]]) {
          str = item[dataIndexArr[0]][dataIndexArr[1]][dataIndexArr[2]];
        }
        if (
          dataIndexArr.length === 4 &&
          item[dataIndexArr[0]] &&
          item[dataIndexArr[0]][dataIndexArr[1]] &&
          item[dataIndexArr[0]][dataIndexArr[1]][dataIndexArr[2]]
        ) {
          str = item[dataIndexArr[0]][dataIndexArr[1]][dataIndexArr[2]][dataIndexArr[3]];
        }
        if (
          dataIndexArr.length === 5 &&
          item[dataIndexArr[0]] &&
          item[dataIndexArr[0]][dataIndexArr[1]] &&
          item[dataIndexArr[0]][dataIndexArr[1]][dataIndexArr[2]][dataIndexArr[3]]
        ) {
          str = item[dataIndexArr[0]][dataIndexArr[1]][dataIndexArr[2]][dataIndexArr[3]][dataIndexArr[4]];
        }
        if (
          dataIndexArr.length === 6 &&
          item[dataIndexArr[0]] &&
          item[dataIndexArr[0]][dataIndexArr[1]] &&
          item[dataIndexArr[0]][dataIndexArr[1]][dataIndexArr[2]][dataIndexArr[3]] &&
          item[dataIndexArr[0]][dataIndexArr[1]][dataIndexArr[2]][dataIndexArr[3]][dataIndexArr[4]]
        ) {
          str = item[dataIndexArr[0]][dataIndexArr[1]][dataIndexArr[2]][dataIndexArr[3]][dataIndexArr[4]][dataIndexArr[5]];
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
.row {
  min-width: 1200px;
}
</style>
