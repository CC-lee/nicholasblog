var express = require('express'),
  router = express.Router(),
  frontApi = require('../api/frontApi').about

function url(str) {
  return `/about/${str}`
}//aboutList

// 前台
// 获取分类给前台使用
router.post(url('aboutList'), frontApi.aboutList)

module.exports = router