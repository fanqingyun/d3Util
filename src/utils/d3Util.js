import * as d3 from "d3"

function getPane(id) {
  let svg = d3.select(id)
  let width = svg.attr("width")
  let height = svg.attr("height")
  let padding = { top: height * 0.15, left: width * 0.15 }
  let pane = svg
    .append("g")
    .attr("width", width * 0.7)
    .attr("height", height * 0.7)
    .attr("transform", `translate(${padding.left}, ${padding.top})`)
  return pane
}
const colorArr = d3.schemeCategory10
// seriesData数据集，以确定坐标尺的范围
export default {
  getBar: (id, seriesData, xAxisData, isVertical, legend) => {
    let pane = getPane(id)
    // 添加2个坐标组
    let xg = pane
      .append("g")
      .attr("transform", `translate(0, ${pane.attr("height")})`)
      .classed("axis", true)
    let yg = pane.append("g").classed("axis", true)
    let xAxis = d3.axisBottom()
    let yAxis = d3.axisLeft()
    if (seriesData.length) {
      let xScale = d3
        .scaleBand()
        .domain(xAxisData)
        .range([
          isVertical ? 0 : pane.attr("height"),
          isVertical ? pane.attr("width") : 0
        ])
      let yScale = d3
        .scaleLinear()
        .domain([
          0,
          d3.max(
            seriesData.map(item => {
              return d3.max(item)
            })
          )
        ])
        .range([
          !isVertical ? 0 : pane.attr("height"),
          !isVertical ? pane.attr("width") : 0
        ])
      xAxis.scale(isVertical ? xScale : yScale)
      yAxis.scale(!isVertical ? xScale : yScale)
      xg.call(xAxis)
      yg.call(yAxis)
      if (seriesData.length === 1) {
        let rectWidth = (pane.attr("width") / xAxisData.length) * 0.4
        // 分组（矩形，文字等)
        let group = pane
          .selectAll(".rectGroup")
          .data(seriesData[0])
          .enter()
          .append("g")
          .classed("rectGroup", true)
        group
          .append("rect")
          .attr("x", (d, i) => {
            return isVertical
              ? xScale(xAxisData[i]) - rectWidth / 2 + xScale.step() / 2
              : 0
          })
          .attr("y", (d, i) => {
            return isVertical
              ? yScale(d)
              : xScale(xAxisData[i]) - rectWidth / 2 + xScale.step() / 2
          })
          .attr("width", (d, i) => {
            return isVertical ? rectWidth : yScale(d)
          })
          .attr("height", d => {
            return isVertical ? pane.attr("height") - yScale(d) : rectWidth
          })
          .attr("fill", colorArr[0])
        group
          .append("text")
          .attr("x", (d, i) => {
            return isVertical
              ? xScale(xAxisData[i]) - rectWidth / 2 + xScale.step() / 2
              : yScale(d)
          })
          .attr("y", (d, i) => {
            return isVertical
              ? yScale(d)
              : xScale(xAxisData[i]) - rectWidth / 2 + xScale.step() / 2
          })
          .attr("dx", "1em")
          .attr("dy", isVertical ? 0 : "1em")
          .text(function(d) {
            return d
          })
          .attr("fill", (d, i) => {
            return colorArr[0]
          })
          // .attr('fill', 'white')
          .attr("font-size", "14px")
          .attr("text-anchor", "middle")
        // .on('mouseover', (d, i) => {

        // })
        // .on('mouseout', (d, i) => {

        // })
      } else {
        // 每个组的宽度
        let groupWidth =
          ((isVertical ? pane.attr("width") : pane.attr("height")) /
            xAxisData.length) *
          0.9
        // 矩形间的间距,多个间距总和设置为占总组宽的0.1
        let padding =
          ((groupWidth / seriesData.length) * 0.1) / (seriesData.length - 1)
        // 矩形的宽度
        let rectWidth = (groupWidth / seriesData.length) * 0.9
        // 矩形翻转 （这一步不一定要，看数据格式）
        let arr = []
        seriesData.forEach((item, index) => {
          item.map((subItem, subIndex) => {
            if (!arr[subIndex]) {
              arr[subIndex] = []
            }
            arr[subIndex][index] = subItem
          })
        })
        // 分组：大组
        let group = pane
          .selectAll(".rectGroup")
          .data(arr)
          .enter()
          .append("g")
          .classed("rectGroup", true)
          .attr("transform", (d, i) => {
            return isVertical
              ? `translate(${xScale(xAxisData[i]) -
                  groupWidth / 2 +
                  xScale.step() / 2}, 0)`
              : `translate(0, ${xScale(xAxisData[i]) -
                  groupWidth / 2 +
                  xScale.step() / 2})`
          })
        // 数据绑定
        let subGroup = group
          .selectAll("g")
          .data(d => {
            return d
          })
          .enter()
          .append("g")
        subGroup
          .append("rect")
          .attr("x", (d, i) => {
            return isVertical ? (padding + rectWidth) * i : 0
          })
          .attr("y", (d, i) => {
            return isVertical ? yScale(d) : (padding + rectWidth) * i
          })
          .attr("width", d => {
            return isVertical ? rectWidth : yScale(d)
          })
          .attr("height", d => {
            return isVertical ? pane.attr("height") - yScale(d) : rectWidth
          })
          .attr("fill", (d, i) => {
            return colorArr[i]
          })
        subGroup
          .append("text")
          .attr("x", (d, i) => {
            return isVertical ? (padding + rectWidth) * i : yScale(d)
          })
          .attr("y", (d, i) => {
            return isVertical ? yScale(d) : (padding + rectWidth) * i
          })
          .attr("dx", "1em")
          .attr("dy", isVertical ? 0 : "1.5em")
          .text(function(d) {
            return d
          })
          .attr("fill", (d, i) => {
            return colorArr[0]
          })
          // .attr('fill', 'white')
          .attr("font-size", "14px")
          .attr("text-anchor", "middle")
      }
    } else {
      pane.text("暂无数据").attr("font-size", "40px")
    }
    return pane
  },
  getPie: (id, seriesData, isPie) => {
    let pane = getPane(id)
    // 首先利用饼图布局将数据转换成绘图需要的数据
    let pieData = d3.pie()(seriesData)
    // 饼图和环形图需要用到弧生成器，因此创建一个弧生成器
    let arc = d3
      .arc()
      .outerRadius(d3.min([pane.attr("width"), pane.attr("height")]) / 2)
      .innerRadius(
        isPie ? 0 : d3.min([pane.attr("width"), pane.attr("height")]) / 4
      )
    // 分组
    let group = pane
      .selectAll("g")
      .data(pieData)
      .enter()
      .append("g")
      .attr(
        "transform",
        `translate(${pane.attr("width") / 2}, ${pane.attr("height") / 2})`
      )
    group
      .append("path")
      .attr("d", (d, i) => {
        return arc(d)
      })
      .attr("fill", (d, i) => {
        return colorArr[i]
      })
    // 添加说明
    group
      .append("text")
      .attr("transform", function(d) {
        return `translate(${arc.centroid(d)})`
      })
      .attr("text-anchor", "middle")
      .text(function(d) {
        return d.data
      })
    return pane
  },
  getLine: (id, seriesData, xAxisData, isArea) => {
    let pane = getPane(id)
    // 添加2个坐标组
    let xg = pane
      .append("g")
      .attr("transform", `translate(0, ${pane.attr("height")})`)
      .classed("axis", true)
    let yg = pane.append("g").classed("axis", true)
    let xAxis = d3.axisBottom()
    let yAxis = d3.axisLeft()
    let xScale = d3
      .scalePoint()
      .domain(xAxisData)
      .range([0, pane.attr("width")])
    let yScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(
          seriesData.map(item => {
            return d3.max(item)
          })
        )
      ])
      .range([pane.attr("height"), 0])
    xAxis.scale(xScale)
    yAxis.scale(yScale)
    xg.call(xAxis)
    yg.call(yAxis)
    if (isArea) {
      // 排序
      let arr = seriesData.map((item, key) => {
        return d3.max(item)
      })
      // 记下每组数据原来的位置
      let indexObj = {}
      arr.forEach((item, key) => {
        indexObj[item] = key
      })
      arr.sort(d3.descending)
      arr.forEach((item, key) => {
        // 线段生成器
        let area = d3
          .area()
          .x((d, i) => {
            return d[0]
          })
          .y1((d, i) => {
            return d[1]
          })
          .y0((d, i) => {
            return pane.attr('height')
          })
        let lines = []
        // 生成每一组数据坐标
        seriesData[indexObj[item]].forEach((subItem, subKey) => {
          // lines[subKey] = [xScale(xAxisData[subKey]) + xScale.step() / 2, yScale(subItem)]
          lines[subKey] = [xScale(xAxisData[subKey]), yScale(subItem)]
        })
        pane
          .append("path")
          .attr("d", area(lines))
          .attr("fill", colorArr[key])
          // .attr("stroke", colorArr[key])
          // .attr("stroke-width", "1px")
      })
    } else {
      seriesData.forEach((item, key) => {
        // 线段生成器
        let line = d3.line()
        let lines = []
        // 生成每一组数据坐标
        item.forEach((subItem, subKey) => {
          // lines[subKey] = [xScale(xAxisData[subKey]) + xScale.step() / 2, yScale(subItem)]
          lines[subKey] = [xScale(xAxisData[subKey]), yScale(subItem)]
        })
        pane
          .append("path")
          .attr("d", line(lines))
          .attr("fill", "none")
          .attr("stroke", colorArr[key])
          .attr("stroke-width", "1px")
      })
    }
  }
}
