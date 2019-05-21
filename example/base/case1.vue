<template>
  <div>
    <svg id="case1" width="400" height="400">
      <!-- <rect width="200" height="200" stroke="#123" fill="#fff">
        <text x="0" y="0" dx="1em" fill="#000" font-size="14px" text-anchor="middle">12</text>
      </rect>-->
    </svg>
    <svg id="case2" width="350" height="400"></svg>
    <svg id="case3" width="350" height="400"></svg>
    <svg id="case4" width="350" height="400"></svg>
    <svg id="case5" width="350" height="400"></svg>
    <svg id="case6" width="350" height="400"></svg>
    <svg id="case7" width="350" height="400"></svg>
    <svg id="case8" width="350" height="400"></svg>
    <svg id="case9" width="350" height="400"></svg>
    <svg id="case10" width="350" height="400"></svg>
    <svg id="case11" width="350" height="400"></svg>
    <svg id="case12" width="350" height="400"></svg>
    <svg id="case13" width="350" height="400"></svg>
    <svg id="case14" width="350" height="400"></svg>
    <svg id="case15" width="350" height="400"></svg>
    <svg id="case16" width="350" height="400"></svg>
    <svg id="case17" width="350" height="400"></svg>
    <svg id="case18" width="350" height="400"></svg>
    <svg id="case19" width="350" height="400"></svg>
    <svg id="case20" width="350" height="400"></svg>
    <svg id="case21" width="350" height="400"></svg>
    <svg id="case22" width="350" height="400"></svg>
    <svg id="case23" width="350" height="400"></svg>
    <svg id="case24" width="350" height="400"></svg>
    <svg id="case25" width="350" height="400"></svg>
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
      let arr = [[80, 80], [200, 100], [200, 200], [100, 200]]
      let lines = d3.line()
      let areas = d3.area()
        .x(function (d, i) { return 50 + i * 80 })
        .y0(function (d, i) { return 400 / 2 })
        .y1(function (d, i) { return 400 / 2 - d })
      svg.append('path').attr('d', lines(arr)).attr("fill", "none").attr("stroke", "black").attr('stroke-width', '1px')
      svg.append('path').attr('d', areas([12, 67, 89, 79])).attr("fill", "none").attr("stroke", "black").attr('stroke-width', '1px')
      // let rects = svg.selectAll('rect').data(this.dataset).enter().append('rect').attr('border', 'solid 1px #000').attr('width', 100).attr('height', 100).attr('transform', (d, i) => {
      //   return `translate(${i * 100}, ${i * 100})`
      // }).text('测试文字').classed('test', true).attr('x', 0)
      // 我们先来定义一个比例尺
      let scaleLinear = d3.scaleLinear().domain([0, d3.max(this.dataset)]).range([0, 250]) // 线性
      let scaleOrdinal = d3.scaleOrdinal().domain(this.dataset).range(this.dataColor).unknown('未知')
      let xAxis = d3.axisRight()
      xAxis.scale(scaleLinear)
      svg.call(xAxis)
      svg
        .append('g').attr('width', 320)
        .attr('class', 'axis')
        .attr('height', 320)
        .attr('transform', 'translate(10, 10)').call(xAxis)
    }
  },
  mounted () {
    console.log(d3)
    this.initSvg()
    // 柱形图
    this.$D3Util.getBar('#case2', [this.dataset], ['测速', '册数', '测书', '长生'], true)
    this.$D3Util.getBar('#case3', [this.dataset, [45, 67, 189, 150]], ['测速', '册数', '测书', '长生'], true)
    this.$D3Util.getBar('#case4', [this.dataset], ['测速', '册数', '测书', '长生'], false)
    this.$D3Util.getBar('#case5', [this.dataset, [45, 67, 189, 150], [90, 45, 170, 200]], ['测速', '册数', '测书', '长生'], false)
    // 饼图和环形图
    this.$D3Util.getPie('#case6', [20, 30, 15, 13, 79], true)
    this.$D3Util.getPie('#case7', [20, 30, 15, 13, 79], false)
    // 折线图
    this.$D3Util.getLine('#case8', [this.dataset], ['测速', '册数', '测书', '长生'], true)
    this.$D3Util.getLine('#case9', [this.dataset, [45, 67, 189, 150], [145, 67, 89, 150]], ['测速', '册数', '测书', '长生'])
    // 水球图
    this.$D3Util.getliquidFill('#case10', 0.45)
    // 力导向图
    let nodes = [
      { name: "中国" },
      { name: "美国" },
      { name: "日本" },
      { name: "俄罗斯" },
      { name: "法国" },
      { name: "德国" },
      { name: "印度" }
    ]

    let links = [
      { source: 0, target: 1, relation: 0 },
      { source: 0, target: 2, relation: 3 },
      { source: 0, target: 3, relation: 5 },
      { source: 1, target: 4, relation: 2 },
      { source: 1, target: 5, relation: 12 },
      { source: 1, target: 6, relation: 1 }
    ]
    this.$D3Util.getForce('#case11', nodes, links)
    let continent = ["亚洲", "欧洲", "非洲", "美洲", "大洋洲"]
    let population = [
      [9000, 870, 3000, 1000, 5200],
      [3400, 8000, 2300, 4922, 374],
      [2000, 2000, 7700, 4881, 1050],
      [3000, 8012, 5531, 500, 400],
      [3540, 4310, 1500, 1900, 300]
    ]
    this.$D3Util.getChord('#case12', population, continent)
    let treeData = {
      name: '中国',
      children: [
        {
          name: '浙江',
          children: [
            { name: '杭州', value: 100 },
            { name: '宁波', value: 100 },
            { name: '温州', value: 100 },
            { name: '绍兴', value: 100 }
          ]
        },
        {
          name: '广西',
          children: [
            {
              name: '桂林',
              children: [
                { name: '秀峰区', value: 100 },
                { name: '叠彩区', value: 100 },
                { name: '象山区', value: 100 },
                { name: '七星区', value: 100 }
              ]
            },
            { name: '南宁', value: 100 },
            { name: '柳州', value: 100 },
            { name: '防城港', value: 100 }
          ]
        },
        {
          name: '黑龙江',
          children: [
            { name: '哈尔滨', value: 100 },
            { name: '齐齐哈尔', value: 100 },
            { name: '牡丹江', value: 100 },
            { name: '大庆', value: 100 }
          ]
        },
        {
          name: '新疆',
          children:
            [
              { name: '乌鲁木齐', value: 100 },
              { name: '克拉玛依', value: 100 },
              { name: '吐鲁番', value: 100 },
              { name: '哈密', value: 100 }
            ]
        }
      ]
    }
    this.$D3Util.getTree('#case13', treeData, true)
    this.$D3Util.getTree('#case14', treeData)
    this.$D3Util.getCluster('#case15', treeData)
    this.$D3Util.getPack('#case16', treeData)
    // let histogramData = []
    // for (let i = 0; i <  100; i++) {
    //   histogramData[i] = parseInt(Math.random()* 300) + 100
    // }
    // this.$D3Util.getHistogram('#case17', histogramData)
    this.$D3Util.getPartition('#case18', treeData)
    this.$D3Util.getPartition('#case19', treeData, true)
    // let stackData = [
    //   {        name: "PC",
    //     sales: [{ year: 2005, profit: 3000 },
    //     { year: 2006, profit: 1300 },
    //     { year: 2007, profit: 3700 },
    //     { year: 2008, profit: 4900 },
    //     { year: 2009, profit: 700 }]      },
    //   {        name: "SmartPhone",
    //     sales: [{ year: 2005, profit: 2000 },
    //     { year: 2006, profit: 4000 },
    //     { year: 2007, profit: 1810 },
    //     { year: 2008, profit: 6540 },
    //     { year: 2009, profit: 2820 }]      },
    //   {        name: "Software",
    //     sales: [{ year: 2005, profit: 1100 },
    //     { year: 2006, profit: 1700 },
    //     { year: 2007, profit: 1680 },
    //     { year: 2008, profit: 4000 },
    //     { year: 2009, profit: 4900 }]      }
    // ];
    let stackData = [
      {apples: 3840, bananas: 1920, cherries: 960, dates: 400},
      {apples: 1600, bananas: 1440, cherries: 960, dates: 400},
      {apples:  640, bananas:  960, cherries: 640, dates: 400},
      {apples:  320, bananas:  480, cherries: 640, dates: 400}
    ];
    let stackKeys = ["apples", "bananas", "cherries", "dates"]
    let stackXAxias = [2012, 2013, 2014, 2015]
    this.$D3Util.getStack('#case21', stackData, stackKeys, stackXAxias, 'bar')
    this.$D3Util.getStack('#case22', stackData, stackKeys, stackXAxias, 'bar', true)
    this.$D3Util.getStack('#case23', stackData, stackKeys, stackXAxias, 'line', true)
    this.$D3Util.getTreeMap('#case24', treeData)
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
