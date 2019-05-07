<template>
  <div>
    <!-- <svg id="case1" width="400" height="400">
      <rect width="200" height="200" stroke="#123" fill="#fff">
        <text x="0" y="0" dx="1em" fill="#000" font-size="14px" text-anchor="middle">12</text>
      </rect>
    </svg> -->
    <svg id="case2" width="350" height="400"></svg>
    <svg id="case3" width="350" height="400"></svg>
    <svg id="case4" width="350" height="400"></svg>
    <svg id="case5" width="350" height="400"></svg>
  </div>
</template>

<script>
import * as d3 from 'd3'
export default {
  data () {
    return {
      dataset: [12, 11, 130, 89],
      dataColor: ['#212', '#122', '#234']
    }
  },
  methods: {
    initSvg () {
      let svg = d3.select('#case1')
      // let rects = svg.selectAll('rect').data(this.dataset).enter().append('rect').attr('border', 'solid 1px #000').attr('width', 100).attr('height', 100).attr('transform', (d, i) => {
      //   return `translate(${i * 100}, ${i * 100})`
      // }).text('测试文字').classed('test', true).attr('x', 0)
      // 我们先来定义一个比例尺
      let scaleLinear = d3.scaleLinear().domain([0, d3.max(this.dataset)]).range([0, 250]) // 线性
      let scaleOrdinal = d3.scaleOrdinal().domain(this.dataset).range(this.dataColor).unknown('未知')
      // 定义一个坐标轴
      let xAxis = d3.axisRight()
      xAxis.scale(scaleLinear)
      // svg.call(xAxis)
      svg.append('g').attr('width', 320)
        .attr('class', 'axis')
        .attr('height', 320)
        .attr('transform', 'translate(10, 10)').call(xAxis)
      // svg.select('g').call(xAxis)
    }
  },
  mounted () {
    console.log(d3)
    // this.initSvg()
    this.$D3Util.getBar('#case2', [this.dataset], ['测速', '册数', '测书', '长生'], true)
    this.$D3Util.getBar('#case3', [this.dataset, [45, 67, 189, 150]], ['测速', '册数', '测书', '长生'], true)
    this.$D3Util.getBar('#case4', [this.dataset], ['测速', '册数', '测书', '长生'], false)
    this.$D3Util.getBar('#case5', [this.dataset, [45, 67, 189, 150], [90, 45, 170, 200]], ['测速', '册数', '测书', '长生'], false)
  }
}
</script>

<style>
.rectGroup:hover {
  cursor: pointer;
}
.test {
  color: #000;
  fill: blueviolet;
}
.axis path,
.axis line {
  fill: none;
  stroke: black;
  shape-rendering: crispEdges;
}
.axis text {
  font-family: sans-serif;
  font-size: 11px;
}
</style>
