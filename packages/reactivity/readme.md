打包的格式

node 使用 cjs

es6

esm-bundler 把所有的模块都打包到一起

es-browser 给浏览器使用，script 标签引入模式  

```
{
  "name": "@vue/reactivity",
  "version": "1.0.0",
  "main": "index.js",
  "module": "dist/reactivity.esm-bundler.js", // 浏览器使用
  "unpkg": "dist/reactivity.global.js", // 全局
  "buildOptions": {
    "name": "VueReactivity", // 在全局里的变量名字
    "formats": [
      "es-browser",
      "esm-bundler",
      "cjs",
      "global"
    ]
  }
}
```
