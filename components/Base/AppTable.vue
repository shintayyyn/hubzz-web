<template>
  <section class="relative">
    <AppLoading :loading="loading" spinner />
    <div class="overflow-x-auto mt-4">
      <div class="apptable">
        <div class="w-full flex flex-no-wrap justify-around">
          <div
            v-for="(column, index) in columns"
            :key="`${column}-${index}`"
            class="app-cell text-sm md:text-base md:font-bold px-4"
          >
            <div
              v-if="column.sortable"
              @click="sort(column.dataIndex)"
              class="flex items-center cursor-pointer"
              :class="column.class && column.class.includes('text-center') && 'justify-center'"
            >
              <div class="block pr-1">{{column.name}}</div>
              <svgicon class :name="sortIcon(column.dataIndex)" height="12" width="12" />
            </div>
            <div
              v-if="!column.sortable"
              class="flex block"
              :class="column.class && column.class.includes('text-center') && 'justify-center'"
            >{{column.name}}</div>
          </div>
        </div>
        <div
          class="w-full __job-card rounded-lg shadow-md py-4 my-2"
          v-for="(item) in items"
          :key="item.id"
        >
          <nuxt-link :to="{ path: `${routerLink}/${item.id}`, query: {...$route.query}}">
            <div class="flex flex-no-wrap justify-around">
              <div
                v-for="(column, index) in columns"
                :key="index"
                class="app-cell px-4"
                :class="column.class && column.class.includes('text-center') && 'text-center'"
              >
                <div v-if="column.dataIndex !== 'actions'">
                  <div class="truncate"
                    v-if="column.class && column.class.includes('localDate') && dataCell(item,column) !== '(none)'"
                  >{{dataCell(item, column) | localDate}}</div>
                  <template v-else>
                    <div v-if="Array.isArray(dataCell(item, column))">
                      <div class="truncate"
                        v-for="(item, index) in dataCell(item, column)"
                        :key="`${item}-${index}`"
                      >{{item}}</div>
                    </div>
                    <div class="truncate" v-else>{{dataCell(item, column)}}</div>
                  </template>
                </div>
                <slot v-else name="actions" v-bind:item="item"></slot>
              </div>
            </div>
          </nuxt-link>
        </div>
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
        this.params = [];
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
.apptable {
  min-width: 112rem;
  /* max-width: 100%; */
}

.app-cell {
  min-width: 150px;
  /* max-width: 150px; */
}

@media screen and (min-width: 768px) {
  .apptable {
    min-width: 1200px;
  }
  .app-cell {
    min-width: 200px;
    /* max-width: 200px; */
  }
}
</style>