<template>
  <div class="relative">
    <div class="__report_table flex w-full bg-white-smoke shadow-lg  text-xs whitespace-no-wrap overflow-x-auto mt-1">
      <div v-for="columnDetail in columnDetails" :key="`columnDetail_${columnDetail.key}`" :style="columnStyle(columnDetail)">
        <div class="flex font-bold">
          <div class="flex-1 p-2 flex justify-between items-center">
            <div class="whitespace-no-wrap">
              {{ columnDetail.title }}
            </div>
            <button v-if="columnDetail.sort_key" class="px-1 ml-2" @click="setOrderBy(columnDetail.sort_key)">
              <span v-if="getColumnOrderByDirection(columnDetail.sort_key) === null">
                <svgicon name="sort" height="12" width="12" color="white" />
              </span>
              <span v-if="getColumnOrderByDirection(columnDetail.sort_key) === 'asc'">
                <svgicon name="sort-ascend" height="12" width="12" color="white" />
              </span>
              <span v-if="getColumnOrderByDirection(columnDetail.sort_key) === 'desc'">
                <svgicon name="sort-descend" height="12" width="12" color="white" />
              </span>
            </button>
          </div>
        </div>

        <div
          v-for="(item, index) in items"
          :key="`key_${columnDetail.key}_${getItemKey(item, index)}`"
          class="flex bg-white"
          :class="[
            columnDetail.justify ? `justify-${columnDetail.justify}` : 'justify-start',
            index !== item.length - 1 ? 'border-dotted border-b border-gray-800' : '',
          ]"
        >
          <span class="whitespace-no-wrap p-2">&nbsp;{{ columnDetail.column(item, index) }}</span>
        </div>
        <div v-if="loading && items.length === 0">
          <div v-for="(item, index) in limit"  :key="`limit_${index}`" class="flex bg-white-smoke">
            <span class="whitespace-no-wrap p-2">&nbsp;</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="absolute inset-0 flex flex-col items-center justify-center shadow-md bg-white-smoke">
      <svgicon name="loader" color="black" width="60" height="60" />
      <span class="text-black text-2xl">Loading...</span>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      limit: {
        type: Number,
        default: 10,
      },
      loading: {
        type: Boolean,
        default: false,
      },
      items: {
        type: Array,
        required: true,
      },
      orderBy: {
        type: Array,
        default: () => [],
      },
      columnDetails: {
        type: Array,
        default: () => [],
      },
      getItemKey: {
        type: Function,
        default: (item, index) => index,
      },
    },

    computed: {
      getColumnOrderByDirection () {
        return column => {
          const index = this.orderBy.findIndex((orderBy) => {
            const [_col] = orderBy.split(":")
            const col = _col ? _col.toLowerCase() : null
            return col === column
          })

          if (index > -1) {
            const _dir = this.orderBy[index].split(":")[1]

            return _dir && _dir.toLowerCase() === 'desc' ? 'desc' : 'asc'
          }

          return null
        }
      },

      columnStyle () {
        return (columnDetail) => {
          return {
            flexGrow: columnDetail.flexGrow,
            flexShrink: columnDetail.flexShrink,
          }
        }
      },
    },

    methods: {
      setOrderBy (column) {
        let orderBy = [...this.orderBy]

        const index = orderBy.findIndex((orderBy) => {
          const [_col] = orderBy.split(":")
          const col = _col ? _col.toLowerCase() : null
          return col === column
        })

        if (index > -1) {
          let direction = this.getColumnOrderByDirection(column)

          orderBy.splice(index, 1)

          if (direction === "asc") {
            // orderBy.push(`${column}:desc`)
            orderBy = [`${column}:desc`]
          }
        } else {
          // orderBy.push(column)
          orderBy = [column]
        }

        this.$emit('setOrderBy', orderBy)
      },
    },
  }

</script>

<style>
  .__report_table::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  .__report_table::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 3px;
  }

  .__report_table::-webkit-scrollbar-track:hover {
    background: rgba(0, 0, 0, 0.116);
    border-radius: 3px;
  }

  .__report_table::-webkit-scrollbar-thumb {
    background: #a1a8b9;
    border-radius: 3px;
  }

  .__report_table::-webkit-scrollbar-thumb:hover {
    background: #7b8396;
  }
</style>
