const baseUrl = process.env.VUE_APP_BASE_API === '/' ? '' : process.env.VUE_APP_BASE_API
const state = {
  baseApi: baseUrl,
  // 部署包上传
  deployUploadApi: baseUrl + '/api/deploy/upload',
  // SQL脚本上传
  databaseUploadApi: baseUrl + '/api/database/upload',
  // 实时控制台
  socketApi: baseUrl + '/websocket?token=kl',
  // 图片上传
  imagesUploadApi: baseUrl + '/api/localStorage/pictures',
  // 修改头像
  updateAvatarApi: baseUrl + '/api/users/updateAvatar',
  // 上传文件到七牛云
  qiNiuUploadApi: baseUrl + '/api/qiNiuContent',
  // Sql 监控
  sqlApi: baseUrl + '/druid/index.html',
  // swagger
  swaggerApi: baseUrl + '/swagger-ui/index.html',
  // 文件上传
  fileUploadApi: baseUrl + '/api/localStorage'
}

const getters = {
}

const mutations = {
}

const actions = {
}

export default {
  namespaced: true,
  getters,
  state,
  mutations,
  actions
}
