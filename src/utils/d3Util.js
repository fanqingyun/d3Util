import * as d3 from "d3";
import { setInterval } from "timers";

function getPane(id) {
  let svg = d3.select(id);
  let width = svg.attr("width");
  let height = svg.attr("height");
  let padding = { top: height * 0.15, left: width * 0.15 };
  let pane = svg
    .append("g")
    .attr("width", width * 0.7)
    .attr("height", height * 0.7)
    .attr("transform", `translate(${padding.left}, ${padding.top})`);
  return pane;
}
function getMax(a, b) {
  return a > b ? a : b;
}
function getMin(a, b) {
  return a < b ? a : b;
}
const colorArr = d3.schemeCategory10;
// seriesData数据集，以确定坐标尺的范围
export default {
  // 柱状图
  getBar: (id, seriesData, xAxisData, isVertical, legend) => {
    let pane = getPane(id);
    // 添加2个坐标组
    let xg = pane
      .append("g")
      .attr("transform", `translate(0, ${pane.attr("height")})`)
      .classed("axis", true);
    let yg = pane.append("g").classed("axis", true);
    let xAxis = d3.axisBottom();
    let yAxis = d3.axisLeft();
    if (seriesData.length) {
      let xScale = d3
        .scaleBand()
        .domain(xAxisData)
        .range([
          isVertical ? 0 : pane.attr("height"),
          isVertical ? pane.attr("width") : 0
        ]);
      let yScale = d3
        .scaleLinear()
        .domain([
          0,
          d3.max(
            seriesData.map(item => {
              return d3.max(item);
            })
          )
        ])
        .range([
          !isVertical ? 0 : pane.attr("height"),
          !isVertical ? pane.attr("width") : 0
        ]);
      xAxis.scale(isVertical ? xScale : yScale);
      yAxis.scale(!isVertical ? xScale : yScale);
      xg.call(xAxis);
      yg.call(yAxis);
      if (seriesData.length === 1) {
        let rectWidth = (pane.attr("width") / xAxisData.length) * 0.4;
        // 分组（矩形，文字等)
        let group = pane
          .selectAll(".rectGroup")
          .data(seriesData[0])
          .enter()
          .append("g")
          .classed("rectGroup", true);
        group
          .append("rect")
          .attr("x", (d, i) => {
            return isVertical
              ? xScale(xAxisData[i]) - rectWidth / 2 + xScale.step() / 2
              : 0;
          })
          .attr("y", (d, i) => {
            return isVertical
              ? yScale(d)
              : xScale(xAxisData[i]) - rectWidth / 2 + xScale.step() / 2;
          })
          .attr("width", (d, i) => {
            return isVertical ? rectWidth : yScale(d);
          })
          .attr("height", d => {
            return isVertical ? pane.attr("height") - yScale(d) : rectWidth;
          })
          .attr("fill", colorArr[0]);
        group
          .append("text")
          .attr("x", (d, i) => {
            return isVertical
              ? xScale(xAxisData[i]) - rectWidth / 2 + xScale.step() / 2
              : yScale(d);
          })
          .attr("y", (d, i) => {
            return isVertical
              ? yScale(d)
              : xScale(xAxisData[i]) - rectWidth / 2 + xScale.step() / 2;
          })
          .attr("dx", "1em")
          .attr("dy", isVertical ? 0 : "1em")
          .text(function(d) {
            return d;
          })
          .attr("fill", (d, i) => {
            return colorArr[0];
          })
          // .attr('fill', 'white')
          .attr("font-size", "14px")
          .attr("text-anchor", "middle");
        // .on('mouseover', (d, i) => {

        // })
        // .on('mouseout', (d, i) => {

        // })
      } else {
        // 每个组的宽度
        let groupWidth =
          ((isVertical ? pane.attr("width") : pane.attr("height")) /
            xAxisData.length) *
          0.9;
        // 矩形间的间距,多个间距总和设置为占总组宽的0.1
        let padding =
          ((groupWidth / seriesData.length) * 0.1) / (seriesData.length - 1);
        // 矩形的宽度
        let rectWidth = (groupWidth / seriesData.length) * 0.9;
        // 矩形翻转 （这一步不一定要，看数据格式）
        let arr = [];
        seriesData.forEach((item, index) => {
          item.map((subItem, subIndex) => {
            if (!arr[subIndex]) {
              arr[subIndex] = [];
            }
            arr[subIndex][index] = subItem;
          });
        });
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
                  xScale.step() / 2})`;
          });
        // 数据绑定
        let subGroup = group
          .selectAll("g")
          .data(d => {
            return d;
          })
          .enter()
          .append("g");
        subGroup
          .append("rect")
          .attr("x", (d, i) => {
            return isVertical ? (padding + rectWidth) * i : 0;
          })
          .attr("y", (d, i) => {
            return isVertical ? yScale(d) : (padding + rectWidth) * i;
          })
          .attr("width", d => {
            return isVertical ? rectWidth : yScale(d);
          })
          .attr("height", d => {
            return isVertical ? pane.attr("height") - yScale(d) : rectWidth;
          })
          .attr("fill", (d, i) => {
            return colorArr[i];
          });
        subGroup
          .append("text")
          .attr("x", (d, i) => {
            return isVertical ? (padding + rectWidth) * i : yScale(d);
          })
          .attr("y", (d, i) => {
            return isVertical ? yScale(d) : (padding + rectWidth) * i;
          })
          .attr("dx", "1em")
          .attr("dy", isVertical ? 0 : "1.5em")
          .text(function(d) {
            return d;
          })
          .attr("fill", (d, i) => {
            return colorArr[0];
          })
          // .attr('fill', 'white')
          .attr("font-size", "14px")
          .attr("text-anchor", "middle");
      }
    } else {
      pane.text("暂无数据").attr("font-size", "40px");
    }
    return pane;
  },
  // 饼图/环形图
  getPie: (id, seriesData, isPie) => {
    let pane = getPane(id);
    // 首先利用饼图布局将数据转换成绘图需要的数据
    let pieData = d3.pie()(seriesData);
    // 饼图和环形图需要用到弧生成器，因此创建一个弧生成器
    let arc = d3
      .arc()
      .outerRadius(d3.min([pane.attr("width"), pane.attr("height")]) / 2)
      .innerRadius(
        isPie ? 0 : d3.min([pane.attr("width"), pane.attr("height")]) / 4
      );
    // 分组
    let group = pane
      .selectAll("g")
      .data(pieData)
      .enter()
      .append("g")
      .attr(
        "transform",
        `translate(${pane.attr("width") / 2}, ${pane.attr("height") / 2})`
      );
    group
      .append("path")
      .attr("d", (d, i) => {
        return arc(d);
      })
      .attr("fill", (d, i) => {
        return colorArr[i];
      });
    // 添加说明
    group
      .append("text")
      .attr("transform", function(d) {
        return `translate(${arc.centroid(d)})`;
      })
      .attr("text-anchor", "middle")
      .text(function(d) {
        return d.data;
      });
    //   // 添加圆外线
    //   group
    //     .append("line")
    //     .attr("stroke","black")
    //     .attr("x1", (d) => { return arc.centroid(d)[0] * 2 })
    //     .attr("y1", (d) => { return arc.centroid(d)[1] * 2 })
    //     .attr("x2", (d) => { return arc.centroid(d)[0] * 2.2 })
    //     .attr("y2", (d) => { return arc.centroid(d)[1] * 2.2 })
    //  //添加弧外的文字元素
    //  group
    //   .append("text")
    //   .attr("transform",(d) => {
    //       return `translate(${arc.centroid(d)[0] * 2.5}, ${arc.centroid(d)[1] * 2.5})`
    //   })
    //   .attr('fill', '#000')
    //   .attr("text-anchor","middle")
    //   .text((d) => {
    //       return d.data
    //   })
    return pane;
  },
  // 折线图
  getLine: (id, seriesData, xAxisData, isArea) => {
    let pane = getPane(id);
    // 添加2个坐标组
    let xg = pane
      .append("g")
      .attr("transform", `translate(0, ${pane.attr("height")})`)
      .classed("axis", true);
    let yg = pane.append("g").classed("axis", true);
    let xAxis = d3.axisBottom();
    let yAxis = d3.axisLeft();
    let xScale = d3
      .scalePoint()
      .domain(xAxisData)
      .range([0, pane.attr("width")]);
    let yScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(
          seriesData.map(item => {
            return d3.max(item);
          })
        )
      ])
      .range([pane.attr("height"), 0]);
    xAxis.scale(xScale);
    yAxis.scale(yScale);
    xg.call(xAxis);
    yg.call(yAxis);
    if (isArea) {
      // 排序
      let arr = seriesData.map((item, key) => {
        return d3.max(item);
      });
      // 记下每组数据原来的位置
      let indexObj = {};
      arr.forEach((item, key) => {
        indexObj[item] = key;
      });
      arr.sort(d3.descending);
      arr.forEach((item, key) => {
        // 线段生成器
        let area = d3
          .area()
          .x((d, i) => {
            return d[0];
          })
          .y1((d, i) => {
            return d[1];
          })
          .y0((d, i) => {
            return pane.attr("height");
          });
        let lines = [];
        // 生成每一组数据坐标
        seriesData[indexObj[item]].forEach((subItem, subKey) => {
          // lines[subKey] = [xScale(xAxisData[subKey]) + xScale.step() / 2, yScale(subItem)]
          lines[subKey] = [xScale(xAxisData[subKey]), yScale(subItem)];
        });
        pane
          .append("path")
          .attr("d", area(lines))
          .attr("fill", colorArr[key]);
        // .attr("stroke", colorArr[key])
        // .attr("stroke-width", "1px")
      });
    } else {
      seriesData.forEach((item, key) => {
        // 线段生成器
        let line = d3.line();
        let lines = [];
        // 生成每一组数据坐标
        item.forEach((subItem, subKey) => {
          // lines[subKey] = [xScale(xAxisData[subKey]) + xScale.step() / 2, yScale(subItem)]
          lines[subKey] = [xScale(xAxisData[subKey]), yScale(subItem)];
        });
        pane
          .append("path")
          .attr("d", line(lines))
          .attr("fill", "none")
          .attr("stroke", colorArr[key])
          .attr("stroke-width", "1px");
        pane
          .append("g")
          .selectAll("circle")
          .data(lines)
          .enter()
          .append("circle")
          .attr("cx", (d, i) => {
            return d[0];
          })
          .attr("cy", (d, i) => {
            return d[1];
          })
          .attr("r", pane.attr("width") * 0.01)
          .attr("stroke", colorArr[key])
          // .attr('fill', colorArr[key])
          .attr("fill", "#fff");
      });
    }
  },
  // 水球图
  getliquidFill: (id, value) => {
    let pane = getPane(id);
    let data = [1, 1, 1, 1, 1, 1];
    let pieData = d3.pie()(data);
    let arcEnd = d3
      .arc()
      .outerRadius(pane.attr("width") / 2)
      .innerRadius(pane.attr("width") / 2.5)
      .padAngle(0.05);
    let arcStart = d3
      .arc()
      .outerRadius((pane.attr("width") / 2) * 0.5)
      .innerRadius((pane.attr("width") / 2.5) * 0.5);
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
      );
    // 添加弧线
    let linearGradient = outerG
      .append("defs")
      .append("linearGradient")
      .attr("x1", 0)
      .attr("x2", 1)
      .attr("y1", 0)
      .attr("y2", 1)
      .attr("id", (d, i) => {
        return "grad" + i;
      });
    linearGradient
      .append("stop")
      .attr("offset", 0)
      .attr("stop-color", (d, i) => {
        return colorArr[0];
      });
    linearGradient
      .append("stop")
      .attr("offset", 1)
      .attr("stop-color", (d, i) => {
        return colorArr[1];
      });
    outerG
      .append("path")
      .attr("d", (d, i) => {
        return arcStart(d);
      })
      .attr("fill", (d, i) => {
        return `url(#grad${i})`;
      })
      .transition()
      .delay(1000) // 延迟500ms再开始
      .duration(2000) // 过渡时长为1000ms
      .attr("d", (d, i) => {
        return arcEnd(d);
      });
    let t = setTimeout(() => {
      d3.timer(() => {
        outerG
          .selectAll("path")
          .transition()
          .duration(30) // 过渡时长为1000ms
          .attr("d", (d, i) => {
            d.startAngle = d.startAngle + 0.01;
            d.endAngle = d.endAngle + 0.01;
            return arcEnd(d);
          });
      });
      clearTimeout(t);
    }, 3000);
    let middleG = pane
      .selectAll("middleG")
      .data(d3.pie()([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]))
      .enter()
      .append("g")
      .classed("middleG", true)
      .attr(
        "transform",
        `translate(${pane.attr("width") / 2}, ${pane.attr("height") / 2})`
      );
    // // 添加圆
    let circleArc = d3
      .arc()
      .outerRadius((pane.attr("width") / 2.5) * 0.9)
      .innerRadius((pane.attr("width") / 2.5) * 0.89);
    middleG
      .append("path")
      .attr("d", (d, i) => {
        return circleArc(d);
      })
      .attr("fill", "transparent")
      .transition()
      .delay(1000)
      .duration(2000)
      .attr("fill", (d, i) => {
        return colorArr[0];
      })
      .attr("stroke-width", "2px");
    middleG
      .append("rect")
      .transition()
      .delay(1000)
      .duration(2000)
      .attr("height", `${pane.attr("width") * 0.06}`)
      .attr("width", `${pane.attr("width") * 0.02}`)
      .attr("transform", (d, i) => {
        return `translate(${circleArc.centroid(d)}) rotate(${(((d.startAngle +
          d.endAngle) /
          2) *
          180) /
          Math.PI})`;
      })
      .attr("fill", colorArr[1]);
    let mt = setTimeout(() => {
      d3.timer(() => {
        middleG
          .selectAll("rect")
          .transition()
          .duration(30)
          .attr("transform", (d, i) => {
            d.startAngle = d.startAngle - 0.01;
            d.endAngle = d.endAngle - 0.01;
            return `translate(${circleArc.centroid(
              d
            )}) rotate(${(((d.startAngle + d.endAngle) / 2) * 180) / Math.PI})`;
          });
      });
      clearTimeout(mt);
    }, 3000);
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
      );
    let paralleArc = d3
      .arc()
      .outerRadius((pane.attr("width") / 2.5) * 0.7)
      .innerRadius((pane.attr("width") / 2.5) * 0.65);
    innerG
      .append("path")
      .attr("d", (d, i) => {
        return paralleArc(d);
      })
      .attr("fill", "transparent")
      .transition()
      .delay(1000)
      .duration(2000)
      .attr("fill", (d, i) => {
        return colorArr[0];
      })
      .attr("stroke-width", "2px");
    innerG
      .append("rect")
      .transition()
      .delay(1000)
      .duration(2000)
      .attr("height", `${pane.attr("width") * 0.04}`)
      .attr("width", `${pane.attr("width") * 0.06}`)
      .attr("transform", (d, i) => {
        return `translate(${paralleArc.centroid(d)[0] *
          0.9}, ${paralleArc.centroid(d)[1] * 0.9}) rotate(${(((d.startAngle +
          d.endAngle) /
          2) *
          180) /
          Math.PI}) skewX(5)`;
      })
      .attr("fill", (d, i) => {
        return i % 5 > 2 ? colorArr[3] : "transparent";
      })
      .attr("stroke", "#111");
    let it = setTimeout(() => {
      d3.timer(() => {
        innerG
          .selectAll("rect")
          .transition()
          .duration(30)
          .attr("transform", (d, i) => {
            d.startAngle = d.startAngle - 0.01;
            d.endAngle = d.endAngle - 0.01;
            return `translate(${paralleArc.centroid(d)[0] *
              0.9}, ${paralleArc.centroid(d)[1] *
              0.9}) rotate(${(((d.startAngle + d.endAngle) / 2) * 180) /
              Math.PI}) skewX(5)`;
          });
      });
      clearTimeout(it);
    }, 3000);
    pane.attr("transform", `${pane.attr("transform")} skewX(10)`);
  },
  // 地图和世界地图
  getMap: (id, data) => {},
  // 力导向图
  getForce: (id, nodes, links) => {
    let pane = getPane(id);
    // let simulation = d3
    //   .forceSimulation(nodes)
    //   .force("charge", d3.forceManyBody())
    //   .force('link', d3.forceLink(links).distance(pane.attr('width') * 0.3))
    //   .force("center", d3.forceCenter().x(pane.attr('width') / 2).y(pane.attr('height') / 2))
    let forceSimulation = d3
      .forceSimulation()
      .force("link", d3.forceLink())
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter());

    // 布局：初始化力导向图，也就是传入数据
    // 生成节点数据
    forceSimulation.nodes(nodes).on("tick", ticked); // 这个函数很重要，后面给出具体实现和说明
    // 生成边数据
    forceSimulation
      .force("link")
      .links(links)
      .distance(function(d) {
        // 每一边的长度
        return pane.attr("width") * 0.4;
      });
    // 设图形的中心位置
    forceSimulation
      .force("center")
      .x(pane.attr("width") / 2)
      .y(pane.attr("height") / 2);
    // 添加连线
    let linksGroup = pane
      .append("g")
      .selectAll(".links")
      .data(links)
      .enter()
      .append("line")
      .classed("links", true)
      .attr("stroke", (d, i) => {
        return colorArr[i % 10];
      });
    // 添加节点
    let nodesGroup = pane
      .append("g")
      .selectAll(".nodes")
      .data(nodes)
      .enter()
      .append("g")
      .classed("nodes", true);
    let circleNodes = nodesGroup
      .append("circle")
      .attr("r", pane.attr("width") * 0.05)
      .attr("stroke", (d, i) => {
        return colorArr[i % 10];
      })
      .attr("fill", (d, i) => {
        return colorArr[i % 10];
      })
      .call(
        d3
          .drag()
          .on("start", started)
          .on("drag", dragged)
          .on("end", ended)
      );
    // 添加节点名称
    let nodeNames = nodesGroup
      .append("text")
      .text(d => {
        return d.name;
      })
      .attr("fill", (d, i) => {
        return colorArr[i % 10];
      })
      .attr("font-size", "14px")
      .attr("text-anchor", "middle")
      .attr("dy", "2em");
    // 添加节点之间的关系文字
    let relations = pane
      .append("g")
      .selectAll(".relation")
      .data(links)
      .enter()
      .append("text")
      .classed("relation", true)
      .text(d => {
        return d.relation;
      })
      .attr("fill", (d, i) => {
        return colorArr[i % 10];
      })
      .attr("font-size", "14px")
      .attr("text-anchor", "middle");
    // .attr('dy', '2em')
    // 添加特效
    let magic = pane
      .append("g")
      .selectAll(".magic")
      .data(links)
      .enter()
      .append("circle")
      .attr("class", "magic")
      .attr("stroke", "#000")
      .attr("fill", "#fff")
      .attr("r", pane.attr("width") * 0.01);
    let cxAnimate = magic
      .append("animate")
      .attr("attributeName", "cx")
      .attr("dur", "2s")
      .attr("repeatCount", "indefinite");
    let cyAnimate = magic
      .append("animate")
      .attr("attributeName", "cy")
      .attr("dur", "2s")
      .attr("repeatCount", "indefinite");
    function ticked() {
      // 因为有了这个函数，才不用在画图的时候指定图的坐标,节点。节点连线，节点之间的关系，节点名称
      linksGroup
        .attr("x1", d => {
          return d.source.x;
        })
        .attr("y1", d => {
          return d.source.y;
        })
        .attr("x2", d => {
          return d.target.x;
        })
        .attr("y2", d => {
          return d.target.y;
        });
      cxAnimate
        .attr("from", d => {
          return d.source.x;
        })
        .attr("to", d => {
          return d.target.x;
        });
      cyAnimate
        .attr("from", d => {
          return d.source.y;
        })
        .attr("to", d => {
          return d.target.y;
        });
      circleNodes
        .attr("cx", (d, i) => {
          return d.x;
        })
        .attr("cy", (d, i) => {
          return d.y;
        });
      nodeNames
        .attr("x", (d, i) => {
          return d.x;
        })
        .attr("y", (d, i) => {
          return d.y;
        });
      relations
        .attr("x", (d, i) => {
          return (d.source.x + d.target.x) / 2;
        })
        .attr("y", (d, i) => {
          return (d.source.y + d.target.y) / 2;
        });
    }
    function started(d) {
      if (!d3.event.active) {
        forceSimulation.alphaTarget(0.8).restart();
      }
      d.fx = d.x;
      d.fy = d.y;
    }
    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }
    function ended(d) {
      if (!d3.event.active) {
        forceSimulation.alphaTarget(0);
      }
      d.fx = null;
      d.fy = null;
    }
  },
  // 弦图
  getChord: (id, matrix, legend) => {
    let pane = getPane(id);
    // 要点：matrix转换数据，得到的chord.groups()是节点.chord是弦
    let chord = d3.chord()(matrix);
    // 因为包括外部弧和内部弦，分别创建弧生成器和弦生成器
    // 弧生成器
    let outerArc = d3
      .arc()
      .outerRadius(getMin(pane.attr("width"), pane.attr("height")) * 0.5)
      .innerRadius(getMin(pane.attr("width"), pane.attr("height")) * 0.45)
      .padAngle(0.02);
    // 弦生成器
    let innerRibbon = d3
      .ribbon()
      .radius(getMin(pane.attr("width"), pane.attr("height")) * 0.45);
    // 开始画弧
    let arcGroup = pane
      .append("g")
      .attr(
        "transform",
        `translate(${pane.attr("width") / 2}, ${pane.attr("height") / 2})`
      )
      .selectAll("path")
      .data(chord.groups)
      .enter()
      .append("path")
      .attr("fill", (d, i) => {
        return colorArr[i];
      })
      // .attr('d', (d) => {
      //   d.tmp = d.endAngle
      //   d.endAngle = d.startAngle
      //   return outerArc(d)
      // })
      // .transition()
      // .delay(500)
      // .duration((d, i) => {
      //   return i * 500
      // })
      .attr("d", d => {
        // d.endAngle = d.tmp
        return outerArc(d);
      });
    // 开始画弦
    let ribbonGroup = pane
      .append("g")
      .attr(
        "transform",
        `translate(${pane.attr("width") / 2}, ${pane.attr("height") / 2})`
      )
      .selectAll("path")
      .data(chord)
      .enter()
      .append("path")
      .attr("d", d => {
        return innerRibbon(d);
      })
      .on("mouseover", (d, i) => {
        // 事件需要在添加动画之前添加，否则会报事件类型未知错误
        ribbonGroup
          .filter(item => {
            return d.source.index != i && d.target.index != i;
          })
          .transition()
          .attr("fill", "transparent");
      })
      .on("mouseout", (d, i) => {
        ribbonGroup
          .filter(item => {
            return item.source.index != i && item.target.index != i;
          })
          .transition()
          .attr("fill", (d, i) => {
            return colorArr[i];
          });
      })
      // .attr('fill', 'transparent') // 展示一条一条画出来
      // .transition()
      // .delay((chord.groups.length - 1) * 500)
      // .duration((d, i) => {
      //   return i * 500
      // })
      .attr("fill", (d, i) => {
        return colorArr[i];
      });
    // 开始添加文字
    let textGroup = pane
      .append("g")
      .attr(
        "transform",
        `translate(${pane.attr("width") / 2}, ${pane.attr("height") / 2})`
      )
      .selectAll("text")
      .data(legend)
      .enter()
      .append("text")
      .attr("transform", (d, i) => {
        let rotate =
          (chord.groups[i].startAngle + chord.groups[i].endAngle) / 2;
        // if (rotate > Math.PI * 3 / 4 && rotate < Math.PI * 5 / 4 ) {
        //   rotate = rotate + Math.PI
        // }
        // if (rotate > Math.PI * 1 / 2 && rotate < Math.PI * 3 / 2 ) {
        //     rotate = rotate + Math.PI
        //   }
        return `translate(${outerArc.centroid(chord.groups[i])[0] *
          1.1}, ${outerArc.centroid(chord.groups[i])[1] *
          1.1}) rotate(${(rotate * 180) / Math.PI})`;
      })
      .attr("fill", (d, i) => {
        return colorArr[i];
      })
      .attr("text-anchor", "middle")
      .text(d => {
        return d;
      });
  },
  // 树状图/集群图:与树状态唯一的不同，所有的叶节点放在同一深度
  getTree: (id, seriesData, isTree) => {
    let pane = getPane(id);
    // 将原始数据转换为有层次的数据结构
    let initData = d3.hierarchy(seriesData).sum(function(d) {
      return d.value;
    });
    // 创建树布局d3.tree(),访问器主要是size和separation
    let tree = isTree ? d3
      .tree()
      .size([pane.attr("width") * 0.8, pane.attr("height") * 0.8])
      .separation(function(a, b) {
        return (a.parent === b.parent ? 1 : 2) / a.depth;
      })(initData) : d3
      .cluster()
      .size([pane.attr("width") * 0.8, pane.attr("height") * 0.8])
      .separation(function(a, b) {
        return (a.parent === b.parent ? 1 : 2) / a.depth;
      })(initData);
    // 传入数据，拿到节点和线
    let nodes = tree.descendants();
    let links = tree.links();
    // 创建一个贝塞尔生成曲线生成器
    let bcg = d3
      .linkHorizontal()
      .x(function(d) {
        return d.y;
      })
      .y(function(d) {
        return d.x;
      });
    // 绘制边
    pane.append("g")
      .selectAll("path")
      .data(links)
      .enter()
      .append("path")
      .attr("d", function(d) {
        return bcg(d);
      })
      .attr("fill", "none")
      .attr("stroke", "yellow")
      .attr("stroke-width", 1);

    // 绘制节点和文字
    // 老规矩，先创建用以绘制每个节点和对应文字的分组<g>
    let gs = pane
      .append("g")
      .selectAll("g")
      .data(nodes)
      .enter()
      .append("g")
      .attr("transform", function(d) {
        let cx = d.x;
        let cy = d.y;
        return `translate(${d.y}, ${d.x})`;
      });
    // 绘制节点
    gs.append("circle")
      .attr("r", pane.attr('width') * 0.04 / tree.children.length)
      .attr("fill", "white")
      .attr("stroke", "blue")
      .attr("stroke-width", 1);

    // 文字
    gs.append("text")
      .attr("x", function(d) {
        return d.children ? -40 : 8;
      })
      .attr("y", -5)
      .attr("dy", 10)
      .text(function(d) {
        return d.data.name;
      })
      .attr('font-size', `${20 / tree.children.length }px`)
  },
  // 环状集群图
  getCluster: (id, seriesData) => {
    let pane = getPane(id);
    // 将原始数据转换为有层次的数据结构
    let initData = d3.hierarchy(seriesData).sum(function(d) {
      return d.value;
    });
    // 创建树布局d3.tree(),访问器主要是size和separation
    let cluster = d3
      .cluster()
      .size([pane.attr("width") * 0.8, pane.attr("height") * 0.8])
      .separation(function(a, b) {
        return (a.parent === b.parent ? 1 : 2) / a.depth;
      })(initData);
    // 传入数据，拿到节点和线
    let nodes = cluster.descendants();
    let links = cluster.links();
    // 创建一个贝塞尔生成曲线生成器
    let bcg = d3
      .linkHorizontal()
      .x(function(d) {
        return d.y;
      })
      .y(function(d) {
        return d.x;
      });
    // 绘制边
    pane.append("g")
      .selectAll("path")
      .data(links)
      .enter()
      .append("path")
      .attr("d", function(d) {
        return bcg(d);
      })
      .attr("fill", "none")
      .attr("stroke", "yellow")
      .attr("stroke-width", 1);

    // 绘制节点和文字
    // 老规矩，先创建用以绘制每个节点和对应文字的分组<g>
    let gs = pane
      .append("g")
      .selectAll("g")
      .data(nodes)
      .enter()
      .append("g")
      .attr("transform", function(d) {
        let cx = d.x;
        let cy = d.y;
        return `translate(${d.y}, ${d.x})`;
      });
    // 绘制节点
    gs.append("circle")
      .attr("r", pane.attr('width') * 0.04 / cluster.children.length)
      .attr("fill", "white")
      .attr("stroke", "blue")
      .attr("stroke-width", 1);

    // 文字
    gs.append("text")
      .attr("x", function(d) {
        return d.children ? -40 : 8;
      })
      .attr("y", -5)
      .attr("dy", 10)
      .text(function(d) {
        return d.data.name;
      })
      .attr('font-size', `${20 / cluster.children.length }px`)
  },
};
