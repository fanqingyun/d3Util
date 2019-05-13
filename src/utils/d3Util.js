import * as d3 from "d3"
import { setInterval } from "timers"

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
  // 柱状图
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
  // 饼图/环形图
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
  // 折线图
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
            return pane.attr("height")
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
        pane
          .append("g")
          .selectAll("circle")
          .data(lines)
          .enter()
          .append("circle")
          .attr("cx", (d, i) => {
            return d[0]
          })
          .attr("cy", (d, i) => {
            return d[1]
          })
          .attr("r", pane.attr("width") * 0.01)
          .attr("stroke", colorArr[key])
          // .attr('fill', colorArr[key])
          .attr("fill", "#fff")
      })
    }
  },
  // 水球图
  getliquidFill: (id, value) => {
    let pane = getPane(id)
    let data = [1, 1, 1, 1, 1, 1]
    let pieData = d3.pie()(data)
    let arcEnd = d3
      .arc()
      .outerRadius(pane.attr("width") / 2)
      .innerRadius(pane.attr("width") / 2.5)
      .padAngle(0.05)
    let arcStart = d3
      .arc()
      .outerRadius((pane.attr("width") / 2) * 0.5)
      .innerRadius((pane.attr("width") / 2.5) * 0.5)
    // 分组
    // 最外部
    let outerG = pane
      .selectAll("outerG")
      .data(pieData)
      .enter()
      .append("g")
      .classed("outerG", true)
      .attr(
        "transform",
        `translate(${pane.attr("width") / 2}, ${pane.attr("height") / 2})`
      )
    // 添加弧线
    let linearGradient = outerG
      .append("defs")
      .append("linearGradient")
      .attr("x1", 0)
      .attr("x2", 1)
      .attr("y1", 0)
      .attr("y2", 1)
      .attr("id", (d, i) => {
        return "grad" + i
      })
    linearGradient
      .append("stop")
      .attr("offset", 0)
      .attr("stop-color", (d, i) => {
        return colorArr[0]
      })
    linearGradient
      .append("stop")
      .attr("offset", 1)
      .attr("stop-color", (d, i) => {
        return colorArr[1]
      })
    outerG
      .append("path")
      .attr("d", (d, i) => {
        return arcStart(d)
      })
      .attr("fill", (d, i) => {
        return `url(#grad${i})`
      })
      .transition()
      .delay(1000) // 延迟500ms再开始
      .duration(2000) // 过渡时长为1000ms
      .attr("d", (d, i) => {
        return arcEnd(d)
      })
    let t = setTimeout(() => {
      d3.timer(() => {
        outerG
          .selectAll("path")
          .transition()
          .duration(30) // 过渡时长为1000ms
          .attr("d", (d, i) => {
            d.startAngle = d.startAngle + 0.01
            d.endAngle = d.endAngle + 0.01
            return arcEnd(d)
          })
      })
      clearTimeout(t)
    }, 3000)
    let middleG = pane
      .selectAll("middleG")
      .data(d3.pie()([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]))
      .enter()
      .append("g")
      .classed("middleG", true)
      .attr(
        "transform",
        `translate(${pane.attr("width") / 2}, ${pane.attr("height") / 2})`
      )
    // // 添加圆
    let circleArc = d3
      .arc()
      .outerRadius(pane.attr("width") / 2.5 * 0.9)
      .innerRadius(pane.attr("width") / 2.5 * 0.89)
    middleG
      .append("path")
      .attr("d", (d, i) => {
        return circleArc(d)
      })
      .attr('fill', 'transparent')
      .transition()
      .delay(1000)
      .duration(2000)
      .attr("fill", (d, i) => {
        return colorArr[0]
      })
      .attr("stroke-width", '2px')
    middleG
      .append('rect')
      .transition()
      .delay(1000)
      .duration(2000)
      .attr('height', `${pane.attr("width") * 0.060}`)
      .attr('width', `${pane.attr("width") * 0.020}`)
      .attr('transform', (d, i) => {
        return `translate(${circleArc.centroid(d)}) rotate(${(d.startAngle + d.endAngle) / 2 * 180 / Math.PI })`
      })
      .attr('fill', colorArr[1])
    let mt = setTimeout(() => {
      d3.timer(() => {
        middleG
          .selectAll('rect')
          .transition()
          .duration(30)
          .attr('transform', (d, i) => {
            d.startAngle = d.startAngle - 0.01
            d.endAngle = d.endAngle - 0.01
            return `translate(${circleArc.centroid(d)}) rotate(${(d.startAngle + d.endAngle) / 2 * 180 / Math.PI })`
          })
      })
      clearTimeout(mt)
    }, 3000)
    // 添加一组平行四边形
    let innerG = pane
      .selectAll("innerG")
      .data(d3.pie()([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]))
      .enter()
      .append("g")
      .classed("innerG", true)
      .attr(
        "transform",
        `translate(${pane.attr("width") / 2}, ${pane.attr("height") / 2})`
      )
    let paralleArc = d3
    .arc()
    .outerRadius(pane.attr("width") / 2.5 * 0.70)
    .innerRadius(pane.attr("width") / 2.5 * 0.65)
    innerG
      .append("path")
      .attr("d", (d, i) => {
        return paralleArc(d)
      })
      .attr('fill', 'transparent')
      .transition()
      .delay(1000)
      .duration(2000)
      .attr("fill", (d, i) => {
        return colorArr[0]
      })
      .attr("stroke-width", '2px')
    innerG
      .append('rect')
      .transition()
      .delay(1000)
      .duration(2000)
      .attr('height', `${pane.attr("width") * 0.040}`)
      .attr('width', `${pane.attr("width") * 0.060}`)
      .attr('transform', (d, i) => {
        return `translate(${paralleArc.centroid(d)[0] * 0.9}, ${paralleArc.centroid(d)[1] * 0.9}) rotate(${(d.startAngle + d.endAngle) / 2 * 180 / Math.PI }) skewX(5)`
      })
      .attr('fill', colorArr[0])
      .attr('stroke', '#fff')
    let it = setTimeout(() => {
      d3.timer(() => {
        innerG
          .selectAll('rect')
          .transition()
          .duration(30)
          .attr('transform', (d, i) => {
            d.startAngle = d.startAngle - 0.01
            d.endAngle = d.endAngle - 0.01
            return `translate(${paralleArc.centroid(d)[0] * 0.9}, ${paralleArc.centroid(d)[1] * 0.9}) rotate(${(d.startAngle + d.endAngle) / 2 * 180 / Math.PI }) skewX(5)`
          })
      })
      clearTimeout(it)
    }, 3000)
    pane.attr('transform', `${pane.attr('transform')} skewX(10)`)
  }
}
