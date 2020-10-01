<template>
  <div>
    <div ref="mapChartContainer" style="height: 600px;" />
  </div>
</template>

<script>
import Highcharts from 'highcharts/highmaps'
import map from '@highcharts/map-collection/countries/gb/gb-all.geo.json'

export default {

  transition: 'fade',

  data () {
    return {
      map: null,
      mapDatas: [],
    }
  },

  mounted () {
    this.map = map
    this.mapDatas = Highcharts.geojson(map)

    this.mapDatas.forEach((mapData) => {
      mapData.value = mapData.name === 'Anglesey' ? 10 : 0
    })

    console.log('map', map)
    console.log('mapDatas', this.mapDatas)

    const mapChartContainer = this.$refs.mapChartContainer
    if (mapChartContainer) {
      this.setMapChart(mapChartContainer)
    }
  },

  methods: {
    setMapChart (mapChartContainer) {
      Highcharts.mapChart(mapChartContainer, {

        title: {
          text: null,
        },

        credits: {
          enabled: false,
        },

        legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'middle',
        },

        colorAxis: {
          min: 0,
          minColor: '#606673',
          maxColor: '#e4b32b',
        },

        mapNavigation: {
          enabled: false,
          buttonOptions: {
            verticalAlign: 'bottom',
          },
          enableDoubleClickZoom: false,
          enableDoubleClickZoomTo: false,
          enableMouseWheelZoom: false,
          enableTouchZoom: false,
        },

        plotOptions: {
          map: {
            states: {
              hover: {
                color: '#e4b32b',
              },
            },
          },
        },

        series: [
          {
            data: this.mapDatas,
            name: 'GB',
          },
        ],

      })
    },
  },

}
</script>
