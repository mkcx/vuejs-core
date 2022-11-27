#### nomorepore 一个包依赖另一个包配置

1. 运行命令
   安装@vue/shared@workspave 到 @vue/reactivity 下

```
$ pnpm install @vue/shared@workspace --filter @vue/reactivity
```

2. 使用 ts 配置路径
   ```
   {
      "baseUrl": ".",
      "paths": {
        "@vue/*": ["packages/*/src"]
      }
   }
   ```
   ### effect 副作用函数
   依赖收集使用的是标记形式
