
var modules = {
  "doc/实现 webpack 编译/src/test.js": function (module, exports, require) {
    module.exports = 'test';
    const ALoader = 'aLoader';
    const BLoader = 'bLoader';
  }
}

var cacheModule = {}
function require(moduleId) {
  if (cacheModule[moduleId]) return cacheModule[moduleId].exports

  var module = (cacheModule[moduleId] = { exports: {} })
  modules[moduleId](module, module.exports, require)
  return module.exports
}
(function () {
  const testContent = require("doc/\u5B9E\u73B0 webpack \u7F16\u8BD1/src/test.js");

  function myWebpackFn() {
    console.log('myWebpackFn');
  }

  console.log('testContent ->', testContent);
  const ALoader = 'aLoader';
  const BLoader = 'bLoader';
})()
