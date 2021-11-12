module.exports = {

  /***************               界面配置 begin           ***************/
  /**
   * @description 网站标题
   */
  title: 'CoAdmin管理系统',
  /**
   * @description 是否显示 tagsView
   */
  tagsView: false,
  /**
   * @description tagsView==true 顶部显示，否则底部显示
   */
  tagsViewTop: true,
  /**
   * @description 固定头部
   */
  fixedHeader: false,
  /**
   * @description 顶部标题栏是否显示阴影
   */
  elevatedHeader: false,
  /**
   * @description 是否只保持一个子菜单的展开
   */
  uniqueOpened: true,
  /**
   * @description 左侧菜单栏是否显示阴影
   */
  elevatedSidebar: true,
  /**
   * @description 左侧菜单栏是否显示logo
   */
  sidebarLogo: true,
  /**
   * 左侧菜单栏是否占满顶部
   */
  sidebarTop: true,
  /**
   * 左侧菜单栏默认宽度
   */
  sidebarWidth: 280,
  /**
   * 左侧菜单栏默认mini状态
   */
  sidebarMini: false,
  /**
   * 是否显示页面背景图
   */
  pageBgImage: true,
  /***************               界面配置 end             ***************/

  /***************               特殊配置 begin           ***************/
  /*******
   * 间距参考： https://quasar.dev/style/spacing
   * 间距参考： https://quasar.dev/style/breakpoints
   * 颜色参考： https://quasar.dev/style/color-palette
   */
  /**
   * CoPage样式:
   * 颜色：
   *  bg-teal  // 提示：颜色仅为用法示例，请在 default-color.js 中设置颜色，可以设置正常模式和dark模式（下同）
   * 边距：
   *  q-pa-md
   *  q-ma-md
   */
  pageClass: 'q-pa-sm', // PC等大屏幕使用（下同）
  pageStyle: '',
  pageClassMobile: '', // 手机等小屏幕使用（下同）
  pageStyleMobile: '',
  /**
   * CoTable样式
   * 背景颜色：
   *  bg-teal
   * 边距：
   *  q-pa-md
   *  q-ma-md
   * 边框：
   *  q-table--bordered
   * 无阴影：
   *  q-table--flat
   * 无圆角：
   *  q-table--square
   */
  tableClass: 'q-table--flat q-table--square',
  tableStyle: '',
  tableClassMobile: 'q-table--flat q-table--square',
  tableStyleMobile: '',
  /**
   * CoCard样式（co-tree全局样式也在这里设置）:
   * 设置边框：
   *  q-pa-sm q-ma-sm
   * 设置背景色：
   *  bg-teal
   * 无阴影：
   *  q-table--flat
   * 无圆角：
   *  q-table--square

   * style: 设置背景色（含半透明）:
   *  background:#3d1d1d52
   */
  cardClass: 'q-table--flat q-table--square',
  cardStyle: '',
  cardClassMobile: 'q-table--flat q-table--square',
  cardStyleMobile: '',
  /**
   * CoDialog样式:
   * 使用 dialogClass 设置边框：
   *  q-pa-sm
   * 使用 dialogClass 设置背景色：
   *  bg-teal
   * 使用 dialogStyle 设置背景色（含半透明）:
   *  background:#3d1d1d52
   */
  dialogClass: '',
  dialogStyle: '',
  dialogClassMobile: '',
  dialogStyleMobile: '',
  /***************               特殊配置 end             ***************/

  /***************               鉴权配置 begin           ***************/
  /**
   * @description 记住密码状态下的token在Cookie中存储的天数，默认1天
   */
  tokenCookieExpires: 1,
  /**
   * @description 记住密码状态下的密码在Cookie中存储的天数，默认1天s
   */
  passCookieExpires: 1,
  /**
   * @description token key
   */
  TokenKey: 'TOKEN',
  /**
   * @description 请求超时时间，毫秒（默认2分钟）
   */
  timeout: 1200000,
  /***************               鉴权配置 end             ***************/

  /**
   * 是否进入dark模式
   */
  darkMode: false,
  /**
   * 设置输入框、表格、按钮等默认dense：
   *    支持 → undefined / true / false
   */
  denseMode: true,
  /**
   * 设置输入框的外观样式：
   * co-select/co-input/co-field/co-date-select/co-tree-select design mode：
   *    支持 → default / standout / filled / outlined / borderless
   */
  inputDesignMode: 'outlined',
  /**
   * 设置输入框的外观为方形直角 或 圆形大圆弧：
   *    支持 → default / square / rounded
   */
  inputDesignCorner: 'rounded',
  /**
   * 设置输入框的外观样式：
   * co-btn / co-btn-toggle / co-btn-dropdown design mode：
   *    支持 → default / flat / outline / push / unelevated
   */
  btnDesignMode: 'push',
  /**
   * 设置输入框的外观为方形直角 或 圆形大圆弧：
   *    支持 → default / square / rounded
   */
  btnDesignCorner: 'rounded',
  /**
   * 表格每页默认显示的行数
   */
  pageSize: 10,
  /**
   * 是否显示设置的底部信息
   */
  showFooter: true,
  /**
   * 底部文字，支持html语法
   */
  footerTxt: '© 2020 XXYY 版权所有',
  /**
   * 备案号
   */
  caseNumber: '粤ICP备xxxxxx号-1'
}
