// 测试css
import './style.css'
// 测试数据
import Node from './node.xml'
// 测试js
import TestJs from './testJs'
var div = document.createElement('div')
div.innerHTML = '<b class="test">我是一个使用var来声明自己的div，因为我不知到自己现在是否支持es6所以不敢用let</b>'
document.body.appendChild(div)
console.log(Node)
let button = document.createElement('button')
button.innerHTML = '点击我'
button.onclick = TestJs.test
div.appendChild(button)