# coadmin-web-quasar

Coadmin 管理系统 Web 客户端

基于 Quasar-admin-template 开发

Quasar相比ElementUI，胜在可定制性上比较强，同时官网文档也相当详细，看文档能解决绝大多数问题。界面也相对漂亮一些，另外还有一个很大的优势，Quasar对于移动端的适配做得非常棒。

## 代码仓库
[Github](https://github.com/jinjingmail/coadmin-web-quasar)
[Gitee](https://gitee.com/jinjinge/coadmin-web-quasar)

## 主要特点
- 给个`star`吧
- 良好的适配移动端小屏幕
- 感谢：eladmin-web、vue-element-admin、quasar-admin-crm、quasar-element-pro
- 更多特性请查阅 Quasar-admin-template 项目

```bash
TODO coadmin-tree、coadmin-select、coadmin-tree-select 等的 $emit 加入是否需要的判断
TODO 树表懒加载
TODO 树表增加图标显示
TODO “在当前页查找”支持ESC键盘按键
TODO 增加 coadmin-table-select
TODO 增加用户配置：左侧菜单栏是否阴影、header是否阴影、table字体颜色、coadmin-table的separator
TODO CROD.operate 增加选项“按grid显示”
TODO 针对mac系统，适配一下自定义组件（比如dialog的关闭按钮放到左上角）
TODO CoadminForm 表单配置型 Validator
TODO CoadminOptionGroup 自定义form项的错误提示
TODO CoadminDateSelect 可以手工输入日期、可以选择“最近7天、最近30天、本月、。。。”
TODO CoadminTree selected和ticked，可以设置“只选parent，只选leaf”

TODO BUG coadmin-tree-select 在菜单管理页面无法自动展开的问题
TODO BUG 在iphone上，输入框也要小一些
TODO BUG 在iphone上，有些按钮字体太小（颜色设置按钮、退出登录按钮等）
TODO BUG table和card会丢失阴影的问题
TODO BUG CoadminSelect use-input的时候，会出现下拉列出的选项空白行的问题
TODO BUG CoadminInput 在popup-proxy 里面时，有时候prepend、append、before、after 的slot会失效
TODO BUG 对话框最大化后，取消拖动
TODO BUG 图表dark模式文字颜色
TODO BUG CoadminTreeSelect 的 v-model不合理
```

## Demo
[Demo](http://jinjinge.gitee.io/coadmin-web-quasar)

## Install the dependencies（安装依赖）
```bash
首先，安装新版nodejs
然后，执行下面的指令安装依赖
npm install -g @quasar/cli
npm install
```

### Start development mode (启动app开发模式)
```bash
quasar dev
```

### Lint the files（Lint校验）
```bash
npm run lint
```

### Build the production（构建发行版本）
```bash
quasar build
```

### Customize the configuration（修改配置）
See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).
