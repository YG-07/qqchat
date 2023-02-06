// 加载数据
// 随机生成uuid网站： https://www.nhooo.com/tool/uuid/

/** 动态添加script引入标签 */
const require = function (name) {
  document.write(`<script src="./src/data/${name}.js"></script>`)
}

// 引入数据
require('menu')
require('join-us')
require('帖子1/296c69d7-ab86-7362-570e-550c1436476e')
require('帖子2/8f257b42-3261-3b75-e580-4b9fe69c698b')
