const path = require('path')
// 获取命令行的参数
const args = require('minimist')(process.argv.slice(2))
const { build } = require('esbuild')

// 打包时的模块
const target = args._[0] || 'reactivity'
const format = args.f || 'global'

const pkg = require(path.resolve(
  __dirname,
  `../packages/${target}/package.json`
))

// 打包格式
const outputFormat = format.startsWith('global')
  ? 'iife'
  : format === 'cjs'
  ? 'cjs'
  : 'esm'

// 输出路径
const outfile = path.resolve(
  __dirname,
  `../packages/${target}/dist/${target}.${format}.js`
)

build({
  entryPoints: [path.resolve(__dirname, `../packages/${target}/src/index.ts`)],
  outfile,
  bundle: true,
  sourcemap: true,
  format: outputFormat,
  globalName: pkg.buildOptions?.name,
  platform: format === 'cjs' ? 'node' : 'browser',
  watch: {
    // 监听文件变化
    onRebuild(error) {
      if (!error) console.log('rebuilt...')
    }
  }
}).then(() => {
  console.log('watching...')
})
